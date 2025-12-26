import { Injectable } from '@angular/core';

export type TimeMode = 'pause' | 'normal' | 'fast';
export type FleetStatus = 'idle' | 'in_transit' | 'collapsed' | 'arrived';
export type ScreenId =
  | 'map'
  | 'node'
  | 'market'
  | 'fleet'
  | 'observer'
  | 'tech'
  | 'governance'
  | 'logs';

export interface NodeState {
  classId: string;
  stabilityBias: number;
  population: number;
  politicalWeight: number;
  governanceSeats: string[];
  structures: Array<{ id: string; type: string }>;
}

export interface MarketState {
  prices: Record<string, number>;
  volatility: Record<string, number>;
  supplyPressure: Record<string, number>;
  demandPressure: Record<string, number>;
  affinityMatch: Record<string, 'match' | 'neutral' | 'mismatch'>;
}

export interface FleetState {
  vesselClass: string;
  nodeFrom: string;
  nodeTo: string;
  status: FleetStatus;
  eta: number | null;
  cargo: { commodityId: string; quantity: number } | null;
  dispatchPrice: number | null;
}

export interface RouteState {
  fromNode: string;
  toNode: string;
  status: 'stable';
}

export interface ObserverState {
  name: string;
  riskBias: string;
  collapseControl: string;
  efficiencyBias: string;
  politicalAlignment: string;
  assignment: string;
  summary: string;
}

export interface TechState {
  status: string;
  effects: string;
  prerequisites: string;
  cost: string;
}

export interface ResearchState {
  active: string | null;
}

export interface GovernanceState {
  id: string;
  scope: string;
  authority: string;
  influence: Record<string, number>;
  requiredCommodities: string[];
  requiredCommoditiesLabel: string;
}

export interface SimulationState {
  time: {
    mode: TimeMode;
    tick: number;
  };
  credits: number;
  ui: {
    activeScreen: ScreenId;
    logsExpanded: boolean;
  };
  nodes: Record<string, NodeState>;
  markets: Record<string, MarketState>;
  routes: Record<string, RouteState>;
  routeOrder: string[];
  fleets: Record<string, FleetState>;
  fleetOrder: string[];
  observers: Record<string, ObserverState>;
  observerOrder: string[];
  tech: Record<string, TechState>;
  research: ResearchState;
  governance: Record<string, GovernanceState>;
  marketOrders: Array<{ id: string; type: 'buy' | 'sell'; nodeId: string; commodityId: string }>;
  pendingArrivals: Array<{
    fleetId: string;
    commodityId: string | null;
    quantity: number;
    arrivalSupplyDelta: number;
    originNode: string;
    destinationNode: string;
    dispatchPrice: number | null;
  }>;
  logs: string[];
  sequences: {
    route: number;
    fleet: number;
    structure: number;
    order: number;
  };
}

const NODE_WEIGHT_STABILITY = -0.2;
const NODE_WEIGHT_POPULATION = 0.15;
const AFFINITY_EFFECT = 0.1;
const PRICE_MIN_MULTIPLIER = 0.3;
const PRICE_MAX_MULTIPLIER = 3;
const BUY_PRESSURE_DELTA = 0.1;
const SELL_PRESSURE_DELTA = 0.1;
const PRESSURE_DECAY_FACTOR = 0.95;
const BASE_ROUTE_SPEED = 10;
const SUPPLY_PRESSURE_PER_UNIT = 0.01;
const ROUTE_VALUE = 100;

const VESSEL_CAPACITY: Record<string, number> = {
  CONTAINMENT_FRIGATE: 50,
  STABILIZER_BARGE: 120,
  PROBE_CARRIER: 20,
  CONSENSUS_FLAGSHIP: 80
};

const TIME_MODE_MULTIPLIERS: Record<TimeMode, number> = {
  pause: 0,
  normal: 1,
  fast: 4
};

const VOLATILITY_MULTIPLIERS: Record<string, number> = {
  None: 0,
  Low: 0.5,
  Medium: 1,
  High: 1.5,
  Extreme: 2
};

const BASELINE_PRICES: Record<string, number> = {
  QG01_ENTANGLED_MATTER: 120,
  QG02_VACUUM_ENERGY: 84,
  QG03_DECOHERENCE_FIELD: 66,
  QG04_TEMPORAL_ISOTOPE: 144,
  QG05_PROBABILITY_LATTICE: 98,
  QG06_OBSERVER_ANCHOR: 112,
  QG07_WAVEFORM_ALLOY: 78,
  QG08_EVENT_HORIZON_FIBER: 138,
  QG09_INFORMATION_DUST: 52,
  QG10_COLLAPSE_RESIN: 90,
  QG11_PHASE_GLASS: 74,
  QG12_ENTROPY_SINK: 82,
  QG13_REALITY_CEMENT: 160,
  QG14_SUPERPOSITION_FLUID: 190,
  QG15_SIGNAL_NOISE_CRYSTAL: 96,
  QG16_OBSERVER_INK: 58,
  QG17_DIMENSIONAL_SLAG: 18,
  QG18_STATE_VECTOR_CORE: 132,
  QG19_PROBABILITY_SILK: 104,
  QG20_NULL_REFERENCE: 40
};

const COMMODITY_VOLATILITY_CLASS: Record<string, string> = {
  QG01_ENTANGLED_MATTER: 'Medium',
  QG02_VACUUM_ENERGY: 'High',
  QG03_DECOHERENCE_FIELD: 'Low',
  QG04_TEMPORAL_ISOTOPE: 'High',
  QG05_PROBABILITY_LATTICE: 'Low',
  QG06_OBSERVER_ANCHOR: 'Medium',
  QG07_WAVEFORM_ALLOY: 'Medium',
  QG08_EVENT_HORIZON_FIBER: 'Low',
  QG09_INFORMATION_DUST: 'High',
  QG10_COLLAPSE_RESIN: 'Medium',
  QG11_PHASE_GLASS: 'Low',
  QG12_ENTROPY_SINK: 'Low',
  QG13_REALITY_CEMENT: 'None',
  QG14_SUPERPOSITION_FLUID: 'Extreme',
  QG15_SIGNAL_NOISE_CRYSTAL: 'Medium',
  QG16_OBSERVER_INK: 'Low',
  QG17_DIMENSIONAL_SLAG: 'Low',
  QG18_STATE_VECTOR_CORE: 'Medium',
  QG19_PROBABILITY_SILK: 'Medium',
  QG20_NULL_REFERENCE: 'None'
};

const NODE_COORDINATES: Record<string, { x: number; y: number }> = {
  'node-core': { x: 20, y: 32 },
  'node-ind': { x: 52, y: 22 },
  'node-res': { x: 76, y: 40 },
  'node-front': { x: 30, y: 68 },
  'node-rift': { x: 68, y: 72 }
};

const SEED_STATE: SimulationState = {
  time: {
    mode: 'normal',
    tick: 0
  },
  credits: 0,
  ui: {
    activeScreen: 'map',
    logsExpanded: false
  },
  nodes: {
    'node-core': {
      classId: 'CORE',
      stabilityBias: 0.88,
      population: 1200,
      politicalWeight: 0.9,
      governanceSeats: ['CONSENSUS_ANCHOR'],
      structures: []
    },
    'node-ind': {
      classId: 'INDUSTRIAL',
      stabilityBias: 0.72,
      population: 760,
      politicalWeight: 0.6,
      governanceSeats: ['NODE_COORDINATOR'],
      structures: []
    },
    'node-res': {
      classId: 'RESEARCH',
      stabilityBias: 0.58,
      population: 340,
      politicalWeight: 0.55,
      governanceSeats: [],
      structures: []
    },
    'node-front': {
      classId: 'FRONTIER',
      stabilityBias: 0.42,
      population: 180,
      politicalWeight: 0.3,
      governanceSeats: [],
      structures: []
    },
    'node-rift': {
      classId: 'RIFT_EDGE',
      stabilityBias: 0.25,
      population: 40,
      politicalWeight: 0.2,
      governanceSeats: ['RIFT_MEDIATOR'],
      structures: []
    }
  },
  markets: {
    'node-core': {
      prices: {},
      volatility: {
        QG01_ENTANGLED_MATTER: 0.22,
        QG02_VACUUM_ENERGY: 0.68,
        QG03_DECOHERENCE_FIELD: 0.12,
        QG04_TEMPORAL_ISOTOPE: 0.58,
        QG05_PROBABILITY_LATTICE: 0.18,
        QG06_OBSERVER_ANCHOR: 0.32,
        QG07_WAVEFORM_ALLOY: 0.28,
        QG08_EVENT_HORIZON_FIBER: 0.2,
        QG09_INFORMATION_DUST: 0.72,
        QG10_COLLAPSE_RESIN: 0.36,
        QG11_PHASE_GLASS: 0.14,
        QG12_ENTROPY_SINK: 0.2,
        QG13_REALITY_CEMENT: 0,
        QG14_SUPERPOSITION_FLUID: 0.9,
        QG15_SIGNAL_NOISE_CRYSTAL: 0.3,
        QG16_OBSERVER_INK: 0.18,
        QG17_DIMENSIONAL_SLAG: 0.08,
        QG18_STATE_VECTOR_CORE: 0.24,
        QG19_PROBABILITY_SILK: 0.34,
        QG20_NULL_REFERENCE: 0
      },
      supplyPressure: {
        QG01_ENTANGLED_MATTER: 0,
        QG02_VACUUM_ENERGY: 0,
        QG03_DECOHERENCE_FIELD: 0,
        QG04_TEMPORAL_ISOTOPE: 0,
        QG05_PROBABILITY_LATTICE: 0,
        QG06_OBSERVER_ANCHOR: 0,
        QG07_WAVEFORM_ALLOY: 0,
        QG08_EVENT_HORIZON_FIBER: 0,
        QG09_INFORMATION_DUST: 0,
        QG10_COLLAPSE_RESIN: 0,
        QG11_PHASE_GLASS: 0,
        QG12_ENTROPY_SINK: 0,
        QG13_REALITY_CEMENT: 0,
        QG14_SUPERPOSITION_FLUID: 0,
        QG15_SIGNAL_NOISE_CRYSTAL: 0,
        QG16_OBSERVER_INK: 0,
        QG17_DIMENSIONAL_SLAG: 0,
        QG18_STATE_VECTOR_CORE: 0,
        QG19_PROBABILITY_SILK: 0,
        QG20_NULL_REFERENCE: 0
      },
      demandPressure: {
        QG01_ENTANGLED_MATTER: 0,
        QG02_VACUUM_ENERGY: 0,
        QG03_DECOHERENCE_FIELD: 0,
        QG04_TEMPORAL_ISOTOPE: 0,
        QG05_PROBABILITY_LATTICE: 0,
        QG06_OBSERVER_ANCHOR: 0,
        QG07_WAVEFORM_ALLOY: 0,
        QG08_EVENT_HORIZON_FIBER: 0,
        QG09_INFORMATION_DUST: 0,
        QG10_COLLAPSE_RESIN: 0,
        QG11_PHASE_GLASS: 0,
        QG12_ENTROPY_SINK: 0,
        QG13_REALITY_CEMENT: 0,
        QG14_SUPERPOSITION_FLUID: 0,
        QG15_SIGNAL_NOISE_CRYSTAL: 0,
        QG16_OBSERVER_INK: 0,
        QG17_DIMENSIONAL_SLAG: 0,
        QG18_STATE_VECTOR_CORE: 0,
        QG19_PROBABILITY_SILK: 0,
        QG20_NULL_REFERENCE: 0
      },
      affinityMatch: {
        QG01_ENTANGLED_MATTER: 'neutral',
        QG02_VACUUM_ENERGY: 'neutral',
        QG03_DECOHERENCE_FIELD: 'neutral',
        QG04_TEMPORAL_ISOTOPE: 'neutral',
        QG05_PROBABILITY_LATTICE: 'neutral',
        QG06_OBSERVER_ANCHOR: 'neutral',
        QG07_WAVEFORM_ALLOY: 'neutral',
        QG08_EVENT_HORIZON_FIBER: 'neutral',
        QG09_INFORMATION_DUST: 'neutral',
        QG10_COLLAPSE_RESIN: 'neutral',
        QG11_PHASE_GLASS: 'neutral',
        QG12_ENTROPY_SINK: 'neutral',
        QG13_REALITY_CEMENT: 'neutral',
        QG14_SUPERPOSITION_FLUID: 'neutral',
        QG15_SIGNAL_NOISE_CRYSTAL: 'neutral',
        QG16_OBSERVER_INK: 'neutral',
        QG17_DIMENSIONAL_SLAG: 'neutral',
        QG18_STATE_VECTOR_CORE: 'neutral',
        QG19_PROBABILITY_SILK: 'neutral',
        QG20_NULL_REFERENCE: 'neutral'
      }
    }
  },
  routes: {},
  routeOrder: [],
  fleets: {
    'fleet-01': {
      vesselClass: 'CONTAINMENT_FRIGATE',
      nodeFrom: 'node-core',
      nodeTo: 'node-ind',
      status: 'in_transit',
      eta: 4,
      cargo: { commodityId: 'QG01_ENTANGLED_MATTER', quantity: 50 },
      dispatchPrice: BASELINE_PRICES['QG01_ENTANGLED_MATTER']
    },
    'fleet-02': {
      vesselClass: 'STABILIZER_BARGE',
      nodeFrom: 'node-ind',
      nodeTo: 'node-front',
      status: 'idle',
      eta: null,
      cargo: null,
      dispatchPrice: null
    },
    'fleet-03': {
      vesselClass: 'PROBE_CARRIER',
      nodeFrom: 'node-res',
      nodeTo: 'node-rift',
      status: 'collapsed',
      eta: null,
      cargo: null,
      dispatchPrice: null
    }
  },
  fleetOrder: ['fleet-01', 'fleet-02', 'fleet-03'],
  observers: {
    'observer-01': {
      name: 'Observer A',
      riskBias: 'Low',
      collapseControl: 'Moderate',
      efficiencyBias: 'Stability',
      politicalAlignment: 'Neutral',
      assignment: 'fleet-01',
      summary: 'Low risk, stability biased'
    },
    'observer-02': {
      name: 'Observer B',
      riskBias: 'High',
      collapseControl: 'Strong',
      efficiencyBias: 'Profit',
      politicalAlignment: 'Expansionist',
      assignment: 'node-ind',
      summary: 'High risk, profit biased'
    }
  },
  observerOrder: ['observer-01', 'observer-02'],
  tech: {
    'Containment Engineering': {
      status: 'locked',
      effects: '--',
      prerequisites: '--',
      cost: '--'
    },
    'Observation Theory': {
      status: 'locked',
      effects: '--',
      prerequisites: '--',
      cost: '--'
    },
    'Probability Stabilization': {
      status: 'locked',
      effects: '--',
      prerequisites: '--',
      cost: '--'
    },
    'Expedition Science': {
      status: 'locked',
      effects: '--',
      prerequisites: '--',
      cost: '--'
    },
    'Governance Manipulation': {
      status: 'locked',
      effects: '--',
      prerequisites: '--',
      cost: '--'
    }
  },
  research: {
    active: null
  },
  governance: {
    NODE_COORDINATOR: {
      id: 'NODE_COORDINATOR',
      scope: 'Single node',
      authority: 'Infrastructure, local trade modifiers',
      influence: { player: 0 },
      requiredCommodities: [],
      requiredCommoditiesLabel: '--'
    },
    CONSENSUS_ANCHOR: {
      id: 'CONSENSUS_ANCHOR',
      scope: 'Multi-node',
      authority: 'Stability enforcement, route regulation',
      influence: { player: 0 },
      requiredCommodities: [],
      requiredCommoditiesLabel: '--'
    },
    RIFT_MEDIATOR: {
      id: 'RIFT_MEDIATOR',
      scope: 'Regional',
      authority: 'Conflict suppression, variance limits',
      influence: { player: 0 },
      requiredCommodities: [],
      requiredCommoditiesLabel: '--'
    }
  },
  marketOrders: [],
  pendingArrivals: [],
  logs: ['Simulation state seeded.'],
  sequences: {
    route: 1,
    fleet: 4,
    structure: 1,
    order: 1
  }
};

export function computeCommodityPrice(
  nodeId: string,
  commodityId: string,
  state: SimulationState
): number {
  const baseline = BASELINE_PRICES[commodityId] ?? 0;
  if (!baseline) {
    return 0;
  }
  const node = state.nodes[nodeId];
  if (!node) {
    return baseline;
  }
  const stabilityNormalized = clamp(node.stabilityBias, 0, 1);
  const populationNormalized = normalizePopulation(node.population, state.nodes);
  const nodeModifier =
    stabilityNormalized * NODE_WEIGHT_STABILITY +
    populationNormalized * NODE_WEIGHT_POPULATION;

  const market = state.markets[nodeId];
  const supplyPressure = market?.supplyPressure[commodityId] ?? 0;
  const demandPressure = market?.demandPressure[commodityId] ?? 0;
  const affinityMatch = market?.affinityMatch[commodityId] ?? 'neutral';
  const affinityEffect =
    affinityMatch === 'match'
      ? -AFFINITY_EFFECT
      : affinityMatch === 'mismatch'
        ? AFFINITY_EFFECT
        : 0;

  const netPressure = demandPressure - supplyPressure + affinityEffect;
  const volatilityClass = COMMODITY_VOLATILITY_CLASS[commodityId] ?? 'Medium';
  const volatilityMultiplier = VOLATILITY_MULTIPLIERS[volatilityClass] ?? 1;
  const effectivePressure = netPressure * volatilityMultiplier;

  const rawPrice = baseline * (1 + nodeModifier + effectivePressure);
  const minPrice = baseline * PRICE_MIN_MULTIPLIER;
  const maxPrice = baseline * PRICE_MAX_MULTIPLIER;
  return clamp(rawPrice, minPrice, maxPrice);
}

@Injectable({ providedIn: 'root' })
export class QuantumRiftStateService {
  private readonly mutableState: SimulationState = SEED_STATE;
  readonly state: Readonly<SimulationState> = this.mutableState;

  constructor() {
    this.recomputeAllPrices();
  }

  dispatch(event: QuantumEvent): void {
    this.applyMutation(event);
    this.log(`${event.type}`);
  }

  private applyMutation(event: QuantumEvent): void {
    switch (event.type) {
      case 'TIME_MODE_SET_PAUSE':
        this.mutableState.time.mode = 'pause';
        return;
      case 'TIME_MODE_SET_NORMAL':
        this.mutableState.time.mode = 'normal';
        return;
      case 'TIME_MODE_SET_FAST':
        this.mutableState.time.mode = 'fast';
        return;
      case 'SCREEN_CHANGED':
        this.mutableState.ui.activeScreen = event.screen;
        return;
      case 'LOG_PANEL_TOGGLED':
        this.mutableState.ui.logsExpanded = event.expanded;
        if (event.expanded) {
          this.mutableState.ui.activeScreen = 'logs';
        }
        return;
      case 'ENGINE_STEP_TRIGGERED':
        this.advanceEngineStep();
        return;
      case 'ROUTE_ESTABLISHED': {
        const routeId = `route-${this.mutableState.sequences.route}`;
        this.mutableState.sequences.route += 1;
        this.mutableState.routes[routeId] = {
          fromNode: event.fromNode,
          toNode: event.toNode,
          status: 'stable'
        };
        this.mutableState.routeOrder.push(routeId);
        return;
      }
      case 'FLEET_DISPATCHED': {
        const capacity = this.getVesselCapacity(event.vesselClass);
        const quantity = Math.floor(event.quantity);
        if (!capacity || quantity <= 0 || quantity > capacity) {
          this.log(
            `FLEET_DISPATCH_BLOCKED ${event.vesselClass} qty=${quantity} cap=${capacity}`
          );
          return;
        }
        const fleetId = `fleet-${String(this.mutableState.sequences.fleet).padStart(2, '0')}`;
        this.mutableState.sequences.fleet += 1;
        const eta = computeRouteEta(event.fromNode, event.toNode);
        const dispatchPrice = this.getMarketPrice(event.fromNode, event.commodityId);
        this.mutableState.fleets[fleetId] = {
          vesselClass: event.vesselClass,
          nodeFrom: event.fromNode,
          nodeTo: event.toNode,
          status: 'in_transit',
          eta,
          cargo: { commodityId: event.commodityId, quantity },
          dispatchPrice
        };
        this.mutableState.fleetOrder.push(fleetId);
        return;
      }
      case 'MARKET_BUY_ORDER_PLACED':
      case 'MARKET_SELL_ORDER_PLACED': {
        const orderId = `order-${this.mutableState.sequences.order}`;
        this.mutableState.sequences.order += 1;
        const market = this.mutableState.markets[event.nodeId];
        if (market) {
          if (event.type === 'MARKET_BUY_ORDER_PLACED') {
            market.demandPressure[event.commodityId] =
              (market.demandPressure[event.commodityId] ?? 0) + BUY_PRESSURE_DELTA;
          } else {
            market.supplyPressure[event.commodityId] =
              (market.supplyPressure[event.commodityId] ?? 0) + SELL_PRESSURE_DELTA;
          }
        }
        this.mutableState.marketOrders.push({
          id: orderId,
          type: event.type === 'MARKET_BUY_ORDER_PLACED' ? 'buy' : 'sell',
          nodeId: event.nodeId,
          commodityId: event.commodityId
        });
        return;
      }
      case 'STRUCTURE_BUILT': {
        const node = this.mutableState.nodes[event.nodeId];
        if (!node) {
          return;
        }
        const structureId = `structure-${this.mutableState.sequences.structure}`;
        this.mutableState.sequences.structure += 1;
        node.structures.push({ id: structureId, type: event.structureType });
        return;
      }
      case 'OBSERVER_ASSIGNED': {
        const observer = this.mutableState.observers[event.observerId];
        if (!observer) {
          return;
        }
        observer.assignment = event.assignment;
        return;
      }
      case 'FLEET_ROUTE_CHANGED': {
        const fleet = this.mutableState.fleets[event.fleetId];
        if (!fleet) {
          return;
        }
        fleet.nodeTo = event.toNode;
        fleet.status = 'in_transit';
        fleet.eta = computeRouteEta(fleet.nodeFrom, fleet.nodeTo);
        return;
      }
      case 'ROUTE_ARRIVED': {
        const fleet = this.mutableState.fleets[event.fleetId];
        if (!fleet) {
          return;
        }
        const market = this.mutableState.markets[event.nodeId];
        const arrivalSupplyDelta =
          event.commodityId && event.quantity > 0 ? event.quantity * SUPPLY_PRESSURE_PER_UNIT : 0;
        if (market && event.commodityId && event.quantity > 0) {
          market.supplyPressure[event.commodityId] =
            (market.supplyPressure[event.commodityId] ?? 0) + arrivalSupplyDelta;
        }
        this.mutableState.pendingArrivals.push({
          fleetId: event.fleetId,
          commodityId: event.commodityId,
          quantity: event.quantity,
          arrivalSupplyDelta,
          originNode: fleet.nodeFrom,
          destinationNode: event.nodeId,
          dispatchPrice: fleet.dispatchPrice
        });
        fleet.status = 'idle';
        fleet.nodeFrom = event.nodeId;
        fleet.nodeTo = event.nodeId;
        fleet.eta = null;
        fleet.cargo = null;
        fleet.dispatchPrice = null;
        return;
      }
      case 'TECH_RESEARCH_SELECTED':
        this.mutableState.research.active = event.techId;
        return;
      case 'GOVERNANCE_CAMPAIGN_INVESTED': {
        const seat = this.mutableState.governance[event.seatId];
        if (!seat) {
          return;
        }
        seat.influence[event.playerId] = (seat.influence[event.playerId] ?? 0) + 1;
        return;
      }
      case 'NODE_POLICIES_OPENED':
        return;
      default:
        return;
    }
  }

  recomputeAllPrices(): void {
    Object.keys(this.mutableState.markets).forEach((nodeId) => {
      const market = this.mutableState.markets[nodeId];
      Object.keys(BASELINE_PRICES).forEach((commodityId) => {
        market.prices[commodityId] = computeCommodityPrice(nodeId, commodityId, this.mutableState);
      });
    });
  }

  advanceTick(): void {
    this.mutableState.time.tick += 1;
    this.applyPressureDecay();
    this.advanceRoutes();
    this.recomputeAllPrices();
    this.applyPendingProfits();
    this.log(`TICK ${this.mutableState.time.tick}`);
  }

  advanceEngineStep(): void {
    const stepCount = TIME_MODE_MULTIPLIERS[this.mutableState.time.mode] ?? 0;
    for (let i = 0; i < stepCount; i += 1) {
      this.advanceTick();
    }
  }

  private applyPressureDecay(): void {
    Object.values(this.mutableState.markets).forEach((market) => {
      Object.keys(market.demandPressure).forEach((commodityId) => {
        market.demandPressure[commodityId] *= PRESSURE_DECAY_FACTOR;
      });
      Object.keys(market.supplyPressure).forEach((commodityId) => {
        market.supplyPressure[commodityId] *= PRESSURE_DECAY_FACTOR;
      });
    });
  }

  private advanceRoutes(): void {
    Object.entries(this.mutableState.fleets).forEach(([fleetId, fleet]) => {
      if (fleet.status !== 'in_transit' || fleet.eta === null) {
        return;
      }
      fleet.eta = Math.max(0, fleet.eta - 1);
      if (fleet.eta === 0) {
        const commodityId = fleet.cargo?.commodityId ?? null;
        const quantity = fleet.cargo?.quantity ?? 0;
        this.dispatch({
          type: 'ROUTE_ARRIVED',
          fleetId,
          nodeId: fleet.nodeTo,
          commodityId,
          quantity
        });
      }
    });
  }

  private applyPendingProfits(): void {
    if (!this.mutableState.pendingArrivals.length) {
      return;
    }
    const arrivals = [...this.mutableState.pendingArrivals];
    this.mutableState.pendingArrivals = [];
    arrivals.forEach((arrival) => {
      const commodityId = arrival.commodityId;
      const quantity = arrival.quantity;
      const dispatchPrice = arrival.dispatchPrice ?? 0;
      const arrivalPrice = commodityId
        ? this.getMarketPrice(arrival.destinationNode, commodityId)
        : 0;
      const profitBasis = arrivalPrice - dispatchPrice;
      const creditDelta = profitBasis * quantity * ROUTE_VALUE;
      this.mutableState.credits += creditDelta;
      this.log(
        `ROUTE_ARRIVED ${arrival.fleetId} ${commodityId ?? 'NO_CARGO'} qty=${quantity} ` +
          `${arrival.destinationNode} +${arrival.arrivalSupplyDelta.toFixed(2)} ` +
          `profitContribution=${creditDelta.toFixed(2)}`
      );
      this.log(
        `PROFIT ${arrival.fleetId} ${commodityId ?? 'NO_CARGO'} qty=${quantity} ` +
          `${arrival.originNode} -> ${arrival.destinationNode} dispatch=${dispatchPrice.toFixed(2)} ` +
          `arrival=${arrivalPrice.toFixed(2)} delta=${creditDelta.toFixed(2)} ` +
          `credits=${this.mutableState.credits.toFixed(2)}`
      );
    });
  }

  private getMarketPrice(nodeId: string, commodityId: string): number {
    const market = this.mutableState.markets[nodeId];
    const price = market?.prices[commodityId];
    if (typeof price === 'number') {
      return price;
    }
    return computeCommodityPrice(nodeId, commodityId, this.mutableState);
  }

  private getVesselCapacity(vesselClass: string): number {
    return VESSEL_CAPACITY[vesselClass] ?? 0;
  }

  private log(message: string): void {
    this.mutableState.logs.push(message);
  }
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function normalizePopulation(population: number, nodes: Record<string, NodeState>): number {
  const maxPopulation = Math.max(...Object.values(nodes).map((node) => node.population));
  if (!maxPopulation) {
    return 0;
  }
  return clamp(population / maxPopulation, 0, 1);
}

function computeRouteEta(fromNode: string, toNode: string): number {
  const from = NODE_COORDINATES[fromNode];
  const to = NODE_COORDINATES[toNode];
  if (!from || !to) {
    return 0;
  }
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return Math.ceil(distance / BASE_ROUTE_SPEED);
}

export type QuantumEvent =
  | { type: 'TIME_MODE_SET_PAUSE' }
  | { type: 'TIME_MODE_SET_NORMAL' }
  | { type: 'TIME_MODE_SET_FAST' }
  | { type: 'SCREEN_CHANGED'; screen: ScreenId }
  | { type: 'LOG_PANEL_TOGGLED'; expanded: boolean }
  | { type: 'ENGINE_STEP_TRIGGERED' }
  | { type: 'ROUTE_ESTABLISHED'; fromNode: string; toNode: string }
  | {
      type: 'FLEET_DISPATCHED';
      vesselClass: string;
      fromNode: string;
      toNode: string;
      commodityId: string;
      quantity: number;
    }
  | { type: 'MARKET_BUY_ORDER_PLACED'; nodeId: string; commodityId: string }
  | { type: 'MARKET_SELL_ORDER_PLACED'; nodeId: string; commodityId: string }
  | { type: 'STRUCTURE_BUILT'; nodeId: string; structureType: string }
  | { type: 'OBSERVER_ASSIGNED'; observerId: string; assignment: string }
  | { type: 'FLEET_ROUTE_CHANGED'; fleetId: string; toNode: string }
  | {
      type: 'ROUTE_ARRIVED';
      fleetId: string;
      nodeId: string;
      commodityId: string | null;
      quantity: number;
    }
  | { type: 'TECH_RESEARCH_SELECTED'; techId: string }
  | { type: 'GOVERNANCE_CAMPAIGN_INVESTED'; seatId: string; playerId: string }
  | { type: 'NODE_POLICIES_OPENED' };
