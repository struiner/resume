import { Injectable, OnDestroy } from '@angular/core';

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
  totalEta: number | null;
  ownerId: string;
  cargo: { commodityId: string; quantity: number } | null;
  dispatchPrice: number | null;
  entropy: number;
  entropyRate: number;
  mitigation: {
    vessel: number;
    observer: number;
    total: number;
  };
  entropyConsequences?: EntropyConsequences;
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
  entropyModifierDelta?: number;
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

export type EntropyConsequences = {
  cargoEfficiencyDelta?: number;
  fleetEfficiencyDelta?: number;
  observerModifierDelta?: number;
};

export interface SimulationEvent {
  id: string;
  tick: number;
  type: string;
  payload: Record<string, unknown>;
  refs?: {
    nodeId?: string;
    destinationNodeId?: string;
    originNodeId?: string;
    fleetId?: string;
    commodityId?: string;
  };
}

type AiActionType =
  | 'AI_DISPATCH_FLEET'
  | 'AI_MARKET_BUY_ORDER_PLACED'
  | 'AI_MARKET_SELL_ORDER_PLACED'
  | 'AI_REVERSAL_APPLIED_CARGO'
  | 'AI_REVERSAL_APPLIED_FLEET'
  | 'AI_REVERSAL_APPLIED_OBSERVER';

interface AiActionCandidate {
  traderId: string;
  type: AiActionType;
  targetLabel: string;
  event: QuantumEvent;
  utility: {
    profit: number;
    eta: number;
    entropy: number;
    entropyConsequences: number;
    cost: number;
    utilization: number;
  };
}

interface ScoredAiAction extends AiActionCandidate {
  score: number;
}

export interface SimulationState {
  time: {
    mode: TimeMode;
    tick: number;
  };
  credits: number;
  entropyReversalConfig: {
    effectFraction: number;
    baseCost: number;
  };
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
    entropy: number;
    consequences: EntropyConsequences;
    ownerId: string;
  }>;
  aiTraders: Array<{
    id: string;
    credits: number;
    fleets: string[];
    observers: string[];
  }>;
  events: SimulationEvent[];
  logs: string[];
  sequences: {
    route: number;
    fleet: number;
    structure: number;
    order: number;
    event: number;
  };
}

const NODE_WEIGHT_STABILITY = -0.2;
const NODE_WEIGHT_POPULATION = 0.15;
const AFFINITY_EFFECT = 0.1;
const PRICE_MIN_MULTIPLIER = 0.5;
const PRICE_MAX_MULTIPLIER = 2.5;
const BUY_PRESSURE_DELTA = 0.01;
const SELL_PRESSURE_DELTA = 0.01;
const PRESSURE_DECAY_FACTOR = 0.98;
const BASE_ROUTE_TIME = 10;
const DISTANCE_TIME_FACTOR = 0.5;
const SUPPLY_PRESSURE_PER_UNIT = 0.01;
const ROUTE_VALUE = 1;

const ENTROPY_WEIGHT_DURATION = 0.4;
const ENTROPY_WEIGHT_VOLATILITY = 0.3;
const ENTROPY_WEIGHT_QUANTITY = 0;
const ENTROPY_WEIGHT_ORIGIN_INSTABILITY = 0.2;
const ENTROPY_WEIGHT_OBSERVER = 0.1;
const ENTROPY_RATE_BASE = 0.01;
const ENTROPY_MAX = 0.95;
const CARGO_ENTROPY_FACTOR = 0.1;
const FLEET_ENTROPY_FACTOR = 0.1;
const OBSERVER_ENTROPY_FACTOR = 0.1;
const AI_ENTROPY_REVERSAL_THRESHOLD = 0.2;
const CARGO_EFFICIENCY_MIN = 0.6;
const CARGO_EFFICIENCY_MAX = 1;
const AI_MIN_ACTION_SCORE = 0.01;
const AI_MIN_CREDIT_BUFFER = 200;

const VESSEL_CAPACITY: Record<string, number> = {
  CONTAINMENT_FRIGATE: 50,
  STABILIZER_BARGE: 120,
  PROBE_CARRIER: 20,
  CONSENSUS_FLAGSHIP: 80
};

const VESSEL_DAMPENING: Record<string, number> = {
  CONTAINMENT_FRIGATE: 0.4,
  STABILIZER_BARGE: 0.6,
  PROBE_CARRIER: 0.2,
  CONSENSUS_FLAGSHIP: 0.8
};

const VOLATILITY_NORMALIZED: Record<string, number> = {
  None: 0,
  Low: 0.25,
  Medium: 0.5,
  High: 0.75,
  Extreme: 1
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

const CLASS_AFFINITY_MATCHES: Record<string, string[]> = {
  CORE: ['QG13_REALITY_CEMENT', 'QG18_STATE_VECTOR_CORE', 'QG20_NULL_REFERENCE'],
  INDUSTRIAL: ['QG07_WAVEFORM_ALLOY', 'QG11_PHASE_GLASS', 'QG05_PROBABILITY_LATTICE'],
  RESEARCH: ['QG09_INFORMATION_DUST', 'QG04_TEMPORAL_ISOTOPE'],
  FRONTIER: [],
  RIFT_EDGE: ['QG14_SUPERPOSITION_FLUID', 'QG08_EVENT_HORIZON_FIBER']
};

const COMMODITY_IDS = Object.keys(BASELINE_PRICES);

function createSeedMarketState(nodeClass: string): MarketState {
  const prices: Record<string, number> = {};
  const volatility: Record<string, number> = {};
  const supplyPressure: Record<string, number> = {};
  const demandPressure: Record<string, number> = {};
  const affinityMatch: Record<string, 'match' | 'neutral' | 'mismatch'> = {};
  const matches = new Set(CLASS_AFFINITY_MATCHES[nodeClass] ?? []);

  COMMODITY_IDS.forEach((commodityId) => {
    prices[commodityId] = 0;
    const volatilityClass = COMMODITY_VOLATILITY_CLASS[commodityId] ?? 'Medium';
    volatility[commodityId] = VOLATILITY_NORMALIZED[volatilityClass] ?? 0.5;
    supplyPressure[commodityId] = 0;
    demandPressure[commodityId] = 0;
    affinityMatch[commodityId] = matches.has(commodityId) ? 'match' : 'neutral';
  });

  return { prices, volatility, supplyPressure, demandPressure, affinityMatch };
}

const NODE_COORDINATES: Record<string, { x: number; y: number }> = {
  'node-core-helix': { x: 50, y: 32 },
  'node-core-axial': { x: 62, y: 44 },
  'node-ind-forge': { x: 38, y: 44 },
  'node-ind-foundry': { x: 50, y: 56 },
  'node-ind-lattice': { x: 62, y: 56 },
  'node-ind-basin': { x: 38, y: 56 },
  'node-ind-atelier': { x: 50, y: 68 },
  'node-res-singularity': { x: 75, y: 35 },
  'node-res-parallax': { x: 25, y: 35 },
  'node-res-spectrum': { x: 75, y: 65 },
  'node-res-axiom': { x: 25, y: 65 },
  'node-front-delta': { x: 12, y: 50 },
  'node-front-echo': { x: 22, y: 80 },
  'node-front-vega': { x: 78, y: 20 },
  'node-front-nadir': { x: 90, y: 50 },
  'node-front-halo': { x: 78, y: 80 },
  'node-front-rim': { x: 22, y: 20 },
  'node-rift-null': { x: 4, y: 35 },
  'node-rift-scar': { x: 96, y: 35 },
  'node-rift-abyss': { x: 85, y: 92 }
};

const NODE_LINKS = [
  { from: 'node-core-helix', to: 'node-core-axial' },
  { from: 'node-core-helix', to: 'node-ind-forge' },
  { from: 'node-core-helix', to: 'node-ind-foundry' },
  { from: 'node-core-axial', to: 'node-ind-lattice' },
  { from: 'node-core-axial', to: 'node-ind-foundry' },
  { from: 'node-ind-forge', to: 'node-ind-basin' },
  { from: 'node-ind-basin', to: 'node-ind-foundry' },
  { from: 'node-ind-lattice', to: 'node-ind-foundry' },
  { from: 'node-ind-foundry', to: 'node-ind-atelier' },
  { from: 'node-ind-atelier', to: 'node-res-spectrum' },
  { from: 'node-ind-atelier', to: 'node-res-axiom' },
  { from: 'node-ind-lattice', to: 'node-res-singularity' },
  { from: 'node-ind-forge', to: 'node-res-parallax' },
  { from: 'node-res-singularity', to: 'node-res-spectrum' },
  { from: 'node-res-parallax', to: 'node-res-axiom' },
  { from: 'node-res-spectrum', to: 'node-res-axiom' },
  { from: 'node-res-singularity', to: 'node-res-parallax' },
  { from: 'node-res-parallax', to: 'node-front-rim' },
  { from: 'node-res-parallax', to: 'node-front-delta' },
  { from: 'node-res-axiom', to: 'node-front-echo' },
  { from: 'node-res-axiom', to: 'node-front-delta' },
  { from: 'node-res-spectrum', to: 'node-front-halo' },
  { from: 'node-res-spectrum', to: 'node-front-nadir' },
  { from: 'node-res-singularity', to: 'node-front-vega' },
  { from: 'node-res-singularity', to: 'node-front-nadir' },
  { from: 'node-front-rim', to: 'node-front-delta' },
  { from: 'node-front-delta', to: 'node-front-echo' },
  { from: 'node-front-vega', to: 'node-front-nadir' },
  { from: 'node-front-nadir', to: 'node-front-halo' },
  { from: 'node-front-rim', to: 'node-front-vega' },
  { from: 'node-front-echo', to: 'node-front-halo' },
  { from: 'node-front-rim', to: 'node-rift-null' },
  { from: 'node-front-vega', to: 'node-rift-scar' },
  { from: 'node-front-halo', to: 'node-rift-abyss' },
  { from: 'node-front-nadir', to: 'node-rift-scar' }
];

const SEED_STATE: SimulationState = {
  time: {
    mode: 'normal',
    tick: 0
  },
  credits: 0,
  entropyReversalConfig: {
    effectFraction: 0.25,
    baseCost: 100
  },
  ui: {
    activeScreen: 'map',
    logsExpanded: false
  },
  nodes: {
    'node-core-helix': {
      classId: 'CORE',
      stabilityBias: 0.9,
      population: 1400,
      politicalWeight: 0.9,
      governanceSeats: ['CONSENSUS_ANCHOR'],
      structures: []
    },
    'node-core-axial': {
      classId: 'CORE',
      stabilityBias: 0.86,
      population: 1200,
      politicalWeight: 0.85,
      governanceSeats: ['CONSENSUS_ANCHOR'],
      structures: []
    },
    'node-ind-forge': {
      classId: 'INDUSTRIAL',
      stabilityBias: 0.74,
      population: 820,
      politicalWeight: 0.65,
      governanceSeats: ['NODE_COORDINATOR'],
      structures: []
    },
    'node-ind-foundry': {
      classId: 'INDUSTRIAL',
      stabilityBias: 0.7,
      population: 780,
      politicalWeight: 0.6,
      governanceSeats: ['NODE_COORDINATOR'],
      structures: []
    },
    'node-ind-lattice': {
      classId: 'INDUSTRIAL',
      stabilityBias: 0.68,
      population: 720,
      politicalWeight: 0.55,
      governanceSeats: ['NODE_COORDINATOR'],
      structures: []
    },
    'node-ind-basin': {
      classId: 'INDUSTRIAL',
      stabilityBias: 0.66,
      population: 700,
      politicalWeight: 0.5,
      governanceSeats: [],
      structures: []
    },
    'node-ind-atelier': {
      classId: 'INDUSTRIAL',
      stabilityBias: 0.62,
      population: 640,
      politicalWeight: 0.5,
      governanceSeats: [],
      structures: []
    },
    'node-res-singularity': {
      classId: 'RESEARCH',
      stabilityBias: 0.6,
      population: 420,
      politicalWeight: 0.55,
      governanceSeats: [],
      structures: []
    },
    'node-res-parallax': {
      classId: 'RESEARCH',
      stabilityBias: 0.58,
      population: 360,
      politicalWeight: 0.5,
      governanceSeats: [],
      structures: []
    },
    'node-res-spectrum': {
      classId: 'RESEARCH',
      stabilityBias: 0.56,
      population: 320,
      politicalWeight: 0.5,
      governanceSeats: [],
      structures: []
    },
    'node-res-axiom': {
      classId: 'RESEARCH',
      stabilityBias: 0.54,
      population: 300,
      politicalWeight: 0.45,
      governanceSeats: [],
      structures: []
    },
    'node-front-delta': {
      classId: 'FRONTIER',
      stabilityBias: 0.45,
      population: 240,
      politicalWeight: 0.35,
      governanceSeats: [],
      structures: []
    },
    'node-front-echo': {
      classId: 'FRONTIER',
      stabilityBias: 0.42,
      population: 220,
      politicalWeight: 0.32,
      governanceSeats: [],
      structures: []
    },
    'node-front-vega': {
      classId: 'FRONTIER',
      stabilityBias: 0.4,
      population: 200,
      politicalWeight: 0.3,
      governanceSeats: [],
      structures: []
    },
    'node-front-nadir': {
      classId: 'FRONTIER',
      stabilityBias: 0.38,
      population: 190,
      politicalWeight: 0.28,
      governanceSeats: [],
      structures: []
    },
    'node-front-halo': {
      classId: 'FRONTIER',
      stabilityBias: 0.36,
      population: 180,
      politicalWeight: 0.26,
      governanceSeats: [],
      structures: []
    },
    'node-front-rim': {
      classId: 'FRONTIER',
      stabilityBias: 0.34,
      population: 170,
      politicalWeight: 0.24,
      governanceSeats: [],
      structures: []
    },
    'node-rift-null': {
      classId: 'RIFT_EDGE',
      stabilityBias: 0.26,
      population: 90,
      politicalWeight: 0.2,
      governanceSeats: ['RIFT_MEDIATOR'],
      structures: []
    },
    'node-rift-scar': {
      classId: 'RIFT_EDGE',
      stabilityBias: 0.24,
      population: 70,
      politicalWeight: 0.18,
      governanceSeats: ['RIFT_MEDIATOR'],
      structures: []
    },
    'node-rift-abyss': {
      classId: 'RIFT_EDGE',
      stabilityBias: 0.22,
      population: 60,
      politicalWeight: 0.16,
      governanceSeats: ['RIFT_MEDIATOR'],
      structures: []
    }
  },
  markets: {
    'node-core-helix': createSeedMarketState('CORE'),
    'node-core-axial': createSeedMarketState('CORE'),
    'node-ind-forge': createSeedMarketState('INDUSTRIAL'),
    'node-ind-foundry': createSeedMarketState('INDUSTRIAL'),
    'node-ind-lattice': createSeedMarketState('INDUSTRIAL'),
    'node-ind-basin': createSeedMarketState('INDUSTRIAL'),
    'node-ind-atelier': createSeedMarketState('INDUSTRIAL'),
    'node-res-singularity': createSeedMarketState('RESEARCH'),
    'node-res-parallax': createSeedMarketState('RESEARCH'),
    'node-res-spectrum': createSeedMarketState('RESEARCH'),
    'node-res-axiom': createSeedMarketState('RESEARCH'),
    'node-front-delta': createSeedMarketState('FRONTIER'),
    'node-front-echo': createSeedMarketState('FRONTIER'),
    'node-front-vega': createSeedMarketState('FRONTIER'),
    'node-front-nadir': createSeedMarketState('FRONTIER'),
    'node-front-halo': createSeedMarketState('FRONTIER'),
    'node-front-rim': createSeedMarketState('FRONTIER'),
    'node-rift-null': createSeedMarketState('RIFT_EDGE'),
    'node-rift-scar': createSeedMarketState('RIFT_EDGE'),
    'node-rift-abyss': createSeedMarketState('RIFT_EDGE')
  },
  routes: {},
  routeOrder: [],
  fleets: {
    'fleet-01': {
      vesselClass: 'CONTAINMENT_FRIGATE',
      nodeFrom: 'node-core-helix',
      nodeTo: 'node-ind-forge',
      status: 'in_transit',
      eta: computeRouteEta('node-core-helix', 'node-ind-forge'),
      totalEta: computeRouteEta('node-core-helix', 'node-ind-forge'),
      ownerId: 'player',
      cargo: { commodityId: 'QG01_ENTANGLED_MATTER', quantity: 50 },
      dispatchPrice: BASELINE_PRICES['QG01_ENTANGLED_MATTER'],
      entropy: 0,
      entropyRate: 0,
      mitigation: { vessel: 0.4, observer: 0, total: 0.4 },
      entropyConsequences: {
        cargoEfficiencyDelta: 0,
        fleetEfficiencyDelta: 0,
        observerModifierDelta: 0
      }
    },
    'fleet-02': {
      vesselClass: 'STABILIZER_BARGE',
      nodeFrom: 'node-ind-foundry',
      nodeTo: 'node-ind-foundry',
      status: 'idle',
      eta: null,
      totalEta: null,
      ownerId: 'ai-01',
      cargo: null,
      dispatchPrice: null,
      entropy: 0,
      entropyRate: 0,
      mitigation: { vessel: 0.6, observer: 0, total: 0.6 },
      entropyConsequences: {
        cargoEfficiencyDelta: 0,
        fleetEfficiencyDelta: 0,
        observerModifierDelta: 0
      }
    },
    'fleet-03': {
      vesselClass: 'PROBE_CARRIER',
      nodeFrom: 'node-res-singularity',
      nodeTo: 'node-rift-scar',
      status: 'collapsed',
      eta: null,
      totalEta: null,
      ownerId: 'ai-01',
      cargo: null,
      dispatchPrice: null,
      entropy: 0,
      entropyRate: 0,
      mitigation: { vessel: 0.2, observer: 0, total: 0.2 },
      entropyConsequences: {
        cargoEfficiencyDelta: 0,
        fleetEfficiencyDelta: 0,
        observerModifierDelta: 0
      }
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
      assignment: 'node-ind-foundry',
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
  aiTraders: [
    {
      id: 'ai-01',
      credits: 2000,
      fleets: ['fleet-02', 'fleet-03'],
      observers: ['observer-02']
    }
  ],
  events: [],
  logs: ['Simulation state seeded.'],
  sequences: {
    route: 1,
    fleet: 4,
    structure: 1,
    order: 1,
    event: 1
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
export class QuantumRiftStateService implements OnDestroy {
  private readonly mutableState: SimulationState = SEED_STATE;
  readonly state: Readonly<SimulationState> = this.mutableState;
  private schedulerId: number | null = null;

  constructor() {
    this.recomputeAllPrices();
    this.updateScheduler();
  }

  ngOnDestroy(): void {
    if (this.schedulerId !== null) {
      clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
  }

  dispatch(event: QuantumEvent): void {
    this.applyMutation(event);
    this.log(`${event.type}`);
  }

  private applyMutation(event: QuantumEvent): void {
    switch (event.type) {
      case 'TIME_MODE_SET_PAUSE':
        this.mutableState.time.mode = 'pause';
        this.updateScheduler();
        return;
      case 'TIME_MODE_SET_NORMAL':
        this.mutableState.time.mode = 'normal';
        this.updateScheduler();
        return;
      case 'TIME_MODE_SET_FAST':
        this.mutableState.time.mode = 'fast';
        this.updateScheduler();
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
        this.advanceTick();
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
        const mitigation = this.getFleetMitigation(event.vesselClass, fleetId);
        this.mutableState.fleets[fleetId] = {
          vesselClass: event.vesselClass,
          nodeFrom: event.fromNode,
          nodeTo: event.toNode,
          status: 'in_transit',
          eta,
          totalEta: eta,
          ownerId: event.ownerId ?? 'player',
          cargo: { commodityId: event.commodityId, quantity },
          dispatchPrice,
          entropy: 0,
          entropyRate: 0,
          mitigation,
          entropyConsequences: {
            cargoEfficiencyDelta: 0,
            fleetEfficiencyDelta: 0,
            observerModifierDelta: 0
          }
        };
        this.mutableState.fleetOrder.push(fleetId);
        this.recordEvent('ROUTE_DISPATCHED', {
          fleetId,
          ownerId: event.ownerId ?? 'player',
          fromNode: event.fromNode,
          toNode: event.toNode,
          commodityId: event.commodityId,
          quantity
        }, {
          fleetId,
          nodeId: event.fromNode,
          destinationNodeId: event.toNode,
          commodityId: event.commodityId
        });
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
        this.recordEvent(event.type === 'MARKET_BUY_ORDER_PLACED' ? 'MARKET_BUY' : 'MARKET_SELL', {
          nodeId: event.nodeId,
          commodityId: event.commodityId,
          actor: 'player'
        }, {
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
        const fleet = this.mutableState.fleets[event.assignment];
        if (fleet) {
          fleet.mitigation = this.getFleetMitigation(fleet.vesselClass, event.assignment);
        }
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
        fleet.totalEta = fleet.eta;
        fleet.entropy = 0;
        fleet.entropyRate = 0;
        fleet.mitigation = this.getFleetMitigation(fleet.vesselClass, event.fleetId);
        fleet.entropyConsequences = {
          cargoEfficiencyDelta: 0,
          fleetEfficiencyDelta: 0,
          observerModifierDelta: 0
        };
        return;
      }
      case 'ROUTE_ARRIVED': {
        const fleet = this.mutableState.fleets[event.fleetId];
        if (!fleet) {
          return;
        }
        const observer = this.getAssignedObserver(event.fleetId);
        const consequences = resolveEntropyConsequences(event.entropy, {
          cargo: fleet.cargo ?? undefined,
          fleet,
          observer: observer ?? undefined
        });
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
          dispatchPrice: fleet.dispatchPrice,
          entropy: event.entropy,
          consequences,
          ownerId: fleet.ownerId
        });
        this.recordEvent('ROUTE_ARRIVED', {
          fleetId: event.fleetId,
          nodeId: event.nodeId,
          commodityId: event.commodityId,
          quantity: event.quantity
        }, {
          fleetId: event.fleetId,
          nodeId: event.nodeId,
          commodityId: event.commodityId ?? undefined
        });
        this.recordEvent('ENTROPY_APPLIED', {
          fleetId: event.fleetId,
          entropy: event.entropy
        }, {
          fleetId: event.fleetId
        });
        this.recordEvent('ENTROPY_CONSEQUENCE_APPLIED', {
          fleetId: event.fleetId,
          consequences
        }, {
          fleetId: event.fleetId
        });
        fleet.status = 'idle';
        fleet.nodeFrom = event.nodeId;
        fleet.nodeTo = event.nodeId;
        fleet.eta = null;
        fleet.totalEta = null;
        fleet.cargo = null;
        fleet.dispatchPrice = null;
        fleet.entropy = 0;
        fleet.entropyRate = 0;
        fleet.entropyConsequences = consequences;
        if (observer) {
          observer.entropyModifierDelta = consequences.observerModifierDelta ?? 0;
        }
        return;
      }
      case 'AI_DISPATCH_FLEET': {
        const fleet = this.mutableState.fleets[event.fleetId];
        if (!fleet || fleet.status !== 'idle' || fleet.ownerId !== event.traderId) {
          return;
        }
        const capacity = this.getVesselCapacity(fleet.vesselClass);
        const quantity = Math.floor(event.quantity);
        if (!capacity || quantity <= 0 || quantity > capacity) {
          return;
        }
        const eta = computeRouteEta(fleet.nodeFrom, event.toNode);
        const dispatchPrice = this.getMarketPrice(fleet.nodeFrom, event.commodityId);
        const mitigation = this.getFleetMitigation(fleet.vesselClass, event.fleetId);
        fleet.nodeTo = event.toNode;
        fleet.status = 'in_transit';
        fleet.eta = eta;
        fleet.totalEta = eta;
        fleet.cargo = { commodityId: event.commodityId, quantity };
        fleet.dispatchPrice = dispatchPrice;
        fleet.entropy = 0;
        fleet.entropyRate = 0;
        fleet.mitigation = mitigation;
        fleet.entropyConsequences = {
          cargoEfficiencyDelta: 0,
          fleetEfficiencyDelta: 0,
          observerModifierDelta: 0
        };
        this.recordEvent('ROUTE_DISPATCHED', {
          fleetId: event.fleetId,
          ownerId: event.traderId,
          fromNode: fleet.nodeFrom,
          toNode: event.toNode,
          commodityId: event.commodityId,
          quantity
        }, {
          fleetId: event.fleetId,
          nodeId: fleet.nodeFrom,
          destinationNodeId: event.toNode,
          commodityId: event.commodityId
        });
        this.recordEvent('AI_ROUTE_DISPATCH', {
          traderId: event.traderId,
          fleetId: event.fleetId,
          fromNode: fleet.nodeFrom,
          toNode: event.toNode,
          commodityId: event.commodityId,
          quantity,
          eta
        }, {
          fleetId: event.fleetId,
          nodeId: fleet.nodeFrom,
          destinationNodeId: event.toNode,
          commodityId: event.commodityId
        });
        const expectedEntropy = this.estimateEntropyForRoute({
          fromNode: fleet.nodeFrom,
          toNode: event.toNode,
          vesselClass: fleet.vesselClass,
          fleetId: event.fleetId,
          commodityId: event.commodityId,
          quantity,
          totalEta: eta
        });
        this.log(
          `AI_ROUTE ${event.traderId} ${event.fleetId} ` +
            `${fleet.nodeFrom} -> ${event.toNode} cargo=${event.commodityId} qty=${quantity} ` +
            `eta=${eta} entropy=${expectedEntropy.toFixed(3)}`
        );
        return;
      }
      case 'AI_MARKET_BUY_ORDER_PLACED': {
        const trader = this.getAiTrader(event.traderId);
        if (!trader) {
          return;
        }
        const market = this.mutableState.markets[event.nodeId];
        if (!market) {
          return;
        }
        if (event.quantity <= 0) {
          return;
        }
        const price = this.getMarketPrice(event.nodeId, event.commodityId);
        const creditCost = price * event.quantity;
        if (creditCost <= 0 || trader.credits < creditCost) {
          return;
        }
        trader.credits -= creditCost;
        market.demandPressure[event.commodityId] =
          (market.demandPressure[event.commodityId] ?? 0) + BUY_PRESSURE_DELTA;
        this.mutableState.marketOrders.push({
          id: `order-${this.mutableState.sequences.order}`,
          type: 'buy',
          nodeId: event.nodeId,
          commodityId: event.commodityId
        });
        this.mutableState.sequences.order += 1;
        this.recordEvent('MARKET_BUY', {
          nodeId: event.nodeId,
          commodityId: event.commodityId,
          actor: event.traderId,
          quantity: event.quantity,
          price
        }, {
          nodeId: event.nodeId,
          commodityId: event.commodityId
        });
        this.recordEvent('AI_TRADE_ACTION', {
          traderId: event.traderId,
          action: 'BUY_COMMODITY',
          nodeId: event.nodeId,
          commodityId: event.commodityId,
          quantity: event.quantity,
          price
        }, {
          nodeId: event.nodeId,
          commodityId: event.commodityId
        });
        this.log(
          `AI_TRADE BUY ${event.traderId} ${event.nodeId} ` +
            `${event.commodityId} qty=${event.quantity} price=${price.toFixed(2)} ` +
            `demand_delta=${BUY_PRESSURE_DELTA.toFixed(2)}`
        );
        return;
      }
      case 'AI_MARKET_SELL_ORDER_PLACED': {
        const trader = this.getAiTrader(event.traderId);
        if (!trader) {
          return;
        }
        const market = this.mutableState.markets[event.nodeId];
        if (!market) {
          return;
        }
        if (event.quantity <= 0) {
          return;
        }
        const price = this.getMarketPrice(event.nodeId, event.commodityId);
        const creditDelta = price * event.quantity;
        if (creditDelta <= 0) {
          return;
        }
        trader.credits += creditDelta;
        market.supplyPressure[event.commodityId] =
          (market.supplyPressure[event.commodityId] ?? 0) + SELL_PRESSURE_DELTA;
        this.mutableState.marketOrders.push({
          id: `order-${this.mutableState.sequences.order}`,
          type: 'sell',
          nodeId: event.nodeId,
          commodityId: event.commodityId
        });
        this.mutableState.sequences.order += 1;
        this.recordEvent('MARKET_SELL', {
          nodeId: event.nodeId,
          commodityId: event.commodityId,
          actor: event.traderId,
          quantity: event.quantity,
          price
        }, {
          nodeId: event.nodeId,
          commodityId: event.commodityId
        });
        this.recordEvent('AI_TRADE_ACTION', {
          traderId: event.traderId,
          action: 'SELL_COMMODITY',
          nodeId: event.nodeId,
          commodityId: event.commodityId,
          quantity: event.quantity,
          price
        }, {
          nodeId: event.nodeId,
          commodityId: event.commodityId
        });
        this.log(
          `AI_TRADE SELL ${event.traderId} ${event.nodeId} ` +
            `${event.commodityId} qty=${event.quantity} price=${price.toFixed(2)} ` +
            `supply_delta=${SELL_PRESSURE_DELTA.toFixed(2)}`
        );
        return;
      }
      case 'REVERSAL_APPLIED_CARGO':
      case 'REVERSAL_APPLIED_FLEET':
      case 'REVERSAL_APPLIED_OBSERVER': {
        const targetType = event.targetType;
        const node = this.mutableState.nodes[event.nodeId];
        if (!node || !node.structures.some((structure) => structure.type === event.structureType)) {
          this.log(`REVERSAL_BLOCKED ${event.targetType} ${event.targetId} missing_structure`);
          return;
        }

        const reversalConfig = this.mutableState.entropyReversalConfig;
        const targetState = this.getReversalTargetState(event.targetType, event.targetId);
        if (!targetState) {
          this.log(`REVERSAL_BLOCKED ${event.targetType} ${event.targetId} target_missing`);
          return;
        }

        const entropyBefore = this.getReversalEntropy(event.targetType, targetState);
        if (entropyBefore <= 0) {
          this.log(`REVERSAL_BLOCKED ${event.targetType} ${event.targetId} entropy_zero`);
          return;
        }

        const creditCost = this.getReversalCost(entropyBefore, reversalConfig.baseCost);
        if (this.mutableState.credits < creditCost) {
          this.log(`REVERSAL_BLOCKED ${event.targetType} ${event.targetId} credits_low`);
          return;
        }

        const reversal = applyEntropyReversal(entropyBefore, reversalConfig.effectFraction);
        this.applyReversalResult(event.targetType, targetState, reversal.entropyRemaining);
        this.mutableState.credits -= creditCost;
        this.recordEvent('ENTROPY_REVERSAL_APPLIED', {
          actor: 'player',
          targetType: event.targetType,
          targetId: event.targetId,
          nodeId: event.nodeId,
          entropyBefore,
          entropyRemoved: reversal.entropyRemoved,
          entropyAfter: reversal.entropyRemaining,
          creditCost
        }, {
          nodeId: event.nodeId,
          fleetId: event.targetType === 'observer' ? undefined : event.targetId,
          commodityId: undefined
        });

        this.log(
          `${event.type} ${event.targetId} ` +
            `entropy_before=${entropyBefore.toFixed(3)} ` +
            `entropy_removed=${reversal.entropyRemoved.toFixed(3)} ` +
            `entropy_after=${reversal.entropyRemaining.toFixed(3)} ` +
            `credit_cost=${creditCost.toFixed(2)} node=${event.nodeId}`
        );
        return;
      }
      case 'AI_REVERSAL_APPLIED_CARGO':
      case 'AI_REVERSAL_APPLIED_FLEET':
      case 'AI_REVERSAL_APPLIED_OBSERVER': {
        const trader = this.getAiTrader(event.traderId);
        if (!trader) {
          return;
        }
        const node = this.mutableState.nodes[event.nodeId];
        if (!node || !node.structures.some((structure) => structure.type === event.structureType)) {
          this.log(`AI_REVERSAL_BLOCKED ${event.targetType} ${event.targetId} missing_structure`);
          return;
        }

        const reversalConfig = this.mutableState.entropyReversalConfig;
        const targetState = this.getReversalTargetState(event.targetType, event.targetId);
        if (!targetState) {
          this.log(`AI_REVERSAL_BLOCKED ${event.targetType} ${event.targetId} target_missing`);
          return;
        }

        const entropyBefore = this.getReversalEntropy(event.targetType, targetState);
        if (entropyBefore <= 0) {
          this.log(`AI_REVERSAL_BLOCKED ${event.targetType} ${event.targetId} entropy_zero`);
          return;
        }

        const creditCost = this.getReversalCost(entropyBefore, reversalConfig.baseCost);
        if (trader.credits < creditCost) {
          this.log(`AI_REVERSAL_BLOCKED ${event.targetType} ${event.targetId} credits_low`);
          return;
        }

        const reversal = applyEntropyReversal(entropyBefore, reversalConfig.effectFraction);
        this.applyReversalResult(event.targetType, targetState, reversal.entropyRemaining);
        trader.credits -= creditCost;
        this.recordEvent('ENTROPY_REVERSAL_APPLIED', {
          actor: event.traderId,
          targetType: event.targetType,
          targetId: event.targetId,
          nodeId: event.nodeId,
          entropyBefore,
          entropyRemoved: reversal.entropyRemoved,
          entropyAfter: reversal.entropyRemaining,
          creditCost
        }, {
          nodeId: event.nodeId,
          fleetId: event.targetType === 'observer' ? undefined : event.targetId,
          commodityId: undefined
        });

        this.log(
          `${event.type} ${event.targetId} ` +
            `entropy_before=${entropyBefore.toFixed(3)} ` +
            `entropy_removed=${reversal.entropyRemoved.toFixed(3)} ` +
            `entropy_after=${reversal.entropyRemaining.toFixed(3)} ` +
            `credit_cost=${creditCost.toFixed(2)} node=${event.nodeId}`
        );
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
    this.runAiTraders();
    this.recomputeAllPrices();
    this.recordEvent('PRICE_UPDATE', {
      nodeCount: Object.keys(this.mutableState.markets).length,
      commodityCount: Object.keys(BASELINE_PRICES).length
    });
    this.applyPendingProfits();
    this.log(`TICK ${this.mutableState.time.tick}`);
  }

  advanceEngineStep(): void {
    const stepCount = TIME_MODE_MULTIPLIERS[this.mutableState.time.mode] ?? 0;
    for (let i = 0; i < stepCount; i += 1) {
      this.advanceTick();
    }
  }

  private updateScheduler(): void {
    if (this.schedulerId !== null) {
      clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
    if (this.mutableState.time.mode === 'pause') {
      return;
    }
    this.schedulerId = window.setInterval(() => {
      const ticksPerSecond = TIME_MODE_MULTIPLIERS[this.mutableState.time.mode] ?? 0;
      for (let i = 0; i < ticksPerSecond; i += 1) {
        this.advanceTick();
      }
    }, 1000);
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
      const entropyDelta = this.computeEntropyDelta(fleetId, fleet);
      fleet.entropy = this.applyEntropyCap(fleet.entropy + entropyDelta);
      fleet.entropyRate = entropyDelta;
      fleet.eta = Math.max(0, fleet.eta - 1);
      if (fleet.eta === 0) {
        const commodityId = fleet.cargo?.commodityId ?? null;
        const quantity = fleet.cargo?.quantity ?? 0;
        this.dispatch({
          type: 'ROUTE_ARRIVED',
          fleetId,
          nodeId: fleet.nodeTo,
          commodityId,
          quantity,
          entropy: fleet.entropy
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
      const baseArrivalPrice = commodityId
        ? this.getMarketPrice(arrival.destinationNode, commodityId)
        : 0;
      const cargoEfficiency = arrival.consequences.cargoEfficiencyDelta ?? 0;
      const arrivalPrice = baseArrivalPrice * (1 + cargoEfficiency);
      const profitBasis = arrivalPrice - dispatchPrice;
      const creditDelta = profitBasis * quantity * ROUTE_VALUE;
      this.applyCreditDelta(arrival.ownerId, creditDelta);
      this.recordEvent('PROFIT_APPLIED', {
        fleetId: arrival.fleetId,
        commodityId,
        quantity,
        originNode: arrival.originNode,
        destinationNode: arrival.destinationNode,
        dispatchPrice,
        arrivalPrice,
        creditDelta,
        ownerId: arrival.ownerId
      }, {
        fleetId: arrival.fleetId,
        originNodeId: arrival.originNode,
        destinationNodeId: arrival.destinationNode,
        commodityId: commodityId ?? undefined
      });
      this.log(
        `ROUTE_ARRIVED ${arrival.fleetId} ${commodityId ?? 'NO_CARGO'} qty=${quantity} ` +
          `${arrival.destinationNode} +${arrival.arrivalSupplyDelta.toFixed(2)} ` +
          `entropy=${arrival.entropy.toFixed(3)} ` +
          `cargoEff=${formatPercent(arrival.consequences.cargoEfficiencyDelta)} ` +
          `fleetEff=${formatPercent(arrival.consequences.fleetEfficiencyDelta)} ` +
          `observerMod=${formatPercent(arrival.consequences.observerModifierDelta)} ` +
          `profitContribution=${creditDelta.toFixed(2)}`
      );
      this.log(
        `PROFIT ${arrival.fleetId} ${commodityId ?? 'NO_CARGO'} qty=${quantity} ` +
          `${arrival.originNode} -> ${arrival.destinationNode} dispatch=${dispatchPrice.toFixed(2)} ` +
          `arrival=${arrivalPrice.toFixed(2)} delta=${creditDelta.toFixed(2)} ` +
          `owner=${arrival.ownerId} credits=${this.getCreditBalance(arrival.ownerId).toFixed(2)}`
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

  private computeEntropyDelta(fleetId: string, fleet: FleetState): number {
    const progressFraction = fleet.totalEta ? 1 / fleet.totalEta : 1;
    const durationInput = clamp(progressFraction, 0, 1);
    const volatilityInput = this.getVolatilityInput(fleet.cargo?.commodityId);
    const quantityInput = this.getQuantityInput(fleet);
    const originInstability = this.getOriginInstability(fleet.nodeFrom);
    const observerInput = this.getObserverInput(fleetId);

    const rawRisk =
      durationInput * ENTROPY_WEIGHT_DURATION +
      volatilityInput * ENTROPY_WEIGHT_VOLATILITY +
      quantityInput * ENTROPY_WEIGHT_QUANTITY +
      originInstability * ENTROPY_WEIGHT_ORIGIN_INSTABILITY +
      observerInput * ENTROPY_WEIGHT_OBSERVER;

    const mitigation =
      fleet.mitigation?.total ?? this.getFleetMitigation(fleet.vesselClass, fleetId).total;
    const effectiveRisk = rawRisk * (1 - mitigation);
    const safeRisk = Math.min(effectiveRisk, 0.999);

    return (1 - fleet.entropy) * safeRisk * ENTROPY_RATE_BASE;
  }

  private getVolatilityInput(commodityId?: string | null): number {
    if (!commodityId) {
      return 0;
    }
    const volatilityClass = COMMODITY_VOLATILITY_CLASS[commodityId] ?? 'Medium';
    return clamp(VOLATILITY_NORMALIZED[volatilityClass] ?? 0.5, 0, 1);
  }

  private getQuantityInput(fleet: FleetState): number {
    const quantity = fleet.cargo?.quantity ?? 0;
    const capacity = this.getVesselCapacity(fleet.vesselClass);
    if (!capacity) {
      return 0;
    }
    return clamp(quantity / capacity, 0, 1);
  }

  private getOriginInstability(nodeId: string): number {
    const node = this.mutableState.nodes[nodeId];
    if (!node) {
      return 0;
    }
    return clamp(1 - node.stabilityBias, 0, 1);
  }

  private getFleetMitigation(vesselClass: string, fleetId: string): {
    vessel: number;
    observer: number;
    total: number;
  } {
    const vessel = clamp(VESSEL_DAMPENING[vesselClass] ?? 0, 0, 1);
    const observer = clamp(this.getObserverModifier(fleetId), 0, 1);
    const total = clamp(vessel + observer, 0, 1);
    return { vessel, observer, total };
  }

  private getObserverModifier(fleetId: string): number {
    const observer = this.getAssignedObserver(fleetId);
    if (!observer) {
      return 0;
    }
    return 0;
  }

  private getObserverInput(fleetId: string): number {
    const observer = this.getAssignedObserver(fleetId);
    return observer ? 0 : 1;
  }

  private getAssignedObserver(fleetId: string): ObserverState | undefined {
    return Object.values(this.mutableState.observers).find(
      (candidate) => candidate.assignment === fleetId
    );
  }

  private applyEntropyCap(entropy: number): number {
    return clamp(entropy, 0, ENTROPY_MAX);
  }

  private getReversalTargetState(
    targetType: 'cargo' | 'fleet' | 'observer',
    targetId: string
  ): FleetState | ObserverState | null {
    if (targetType === 'observer') {
      return this.mutableState.observers[targetId] ?? null;
    }
    return this.mutableState.fleets[targetId] ?? null;
  }

  private getReversalEntropy(
    targetType: 'cargo' | 'fleet' | 'observer',
    targetState: FleetState | ObserverState
  ): number {
    if (targetType === 'observer') {
      const observer = targetState as ObserverState;
      return this.entropyFromDelta(observer.entropyModifierDelta, OBSERVER_ENTROPY_FACTOR);
    }
    const fleet = targetState as FleetState;
    if (!fleet.entropyConsequences) {
      return 0;
    }
    if (targetType === 'cargo') {
      return this.entropyFromDelta(fleet.entropyConsequences.cargoEfficiencyDelta, CARGO_ENTROPY_FACTOR);
    }
    return this.entropyFromDelta(fleet.entropyConsequences.fleetEfficiencyDelta, FLEET_ENTROPY_FACTOR);
  }

  private applyReversalResult(
    targetType: 'cargo' | 'fleet' | 'observer',
    targetState: FleetState | ObserverState,
    entropyRemaining: number
  ): void {
    const scaled = Math.sqrt(clamp(entropyRemaining, 0, ENTROPY_MAX));
    if (targetType === 'observer') {
      const observer = targetState as ObserverState;
      observer.entropyModifierDelta = clamp(-scaled * OBSERVER_ENTROPY_FACTOR, -1, 0);
      return;
    }
    const fleet = targetState as FleetState;
    if (!fleet.entropyConsequences) {
      return;
    }
    if (targetType === 'cargo') {
      fleet.entropyConsequences.cargoEfficiencyDelta = clampCargoEfficiencyDelta(
        -scaled * CARGO_ENTROPY_FACTOR
      );
      return;
    }
    fleet.entropyConsequences.fleetEfficiencyDelta = clamp(-scaled * FLEET_ENTROPY_FACTOR, -1, 0);
  }

  private entropyFromDelta(delta: number | undefined, factor: number): number {
    if (!delta || factor <= 0) {
      return 0;
    }
    const magnitude = Math.min(Math.abs(delta) / factor, 1);
    return clamp(magnitude * magnitude, 0, ENTROPY_MAX);
  }

  private getReversalCost(entropy: number, baseCost: number): number {
    return baseCost * (1 + entropy);
  }

  private runAiTraders(): void {
    this.mutableState.aiTraders.forEach((trader) => {
      const actions = this.generateAiActions(trader.id);
      if (!actions.length) {
        this.log(`AI_SKIP ${trader.id} no_actions`);
        return;
      }
      const scored = this.scoreAiActions(actions);
      scored.forEach((candidate) => {
        this.log(
          `AI_EVAL ${candidate.traderId} ${candidate.type} ` +
            `score=${candidate.score.toFixed(3)} target=${candidate.targetLabel}`
        );
      });
      const best = this.selectBestAiAction(scored);
      if (!best || best.score < AI_MIN_ACTION_SCORE) {
        this.log(`AI_SKIP ${trader.id} best_score=${best?.score.toFixed(3) ?? 'n/a'}`);
        return;
      }
      const creditsBefore = this.getCreditBalance(trader.id);
      this.dispatch(best.event);
      const creditsAfter = this.getCreditBalance(trader.id);
      this.log(
        `AI_ACTION ${best.traderId} ${best.type} ` +
          `score=${best.score.toFixed(3)} target=${best.targetLabel} ` +
          `credits_before=${creditsBefore.toFixed(2)} credits_after=${creditsAfter.toFixed(2)}`
      );
    });
  }

  private generateAiActions(traderId: string): AiActionCandidate[] {
    const trader = this.getAiTrader(traderId);
    if (!trader) {
      return [];
    }
    const candidates: AiActionCandidate[] = [];
    const idleFleetIds = trader.fleets.filter((fleetId) => {
      const fleet = this.mutableState.fleets[fleetId];
      return fleet?.status === 'idle';
    });
    const maxIdleCapacity = idleFleetIds.reduce((max, fleetId) => {
      const fleet = this.mutableState.fleets[fleetId];
      if (!fleet) {
        return max;
      }
      return Math.max(max, this.getVesselCapacity(fleet.vesselClass));
    }, 0);

    candidates.push(...this.generateAiDispatchActions(traderId, idleFleetIds));
    candidates.push(...this.generateAiReversalActions(traderId));
    candidates.push(...this.generateAiMarketActions(traderId, maxIdleCapacity));

    return candidates;
  }

  private generateAiDispatchActions(traderId: string, fleetIds: string[]): AiActionCandidate[] {
    const candidates: AiActionCandidate[] = [];
    const nodeIds = Object.keys(this.mutableState.nodes);
    const commodityIds = Object.keys(BASELINE_PRICES);
    fleetIds.forEach((fleetId) => {
      const fleet = this.mutableState.fleets[fleetId];
      if (!fleet) {
        return;
      }
      const capacity = this.getVesselCapacity(fleet.vesselClass);
      if (!capacity) {
        return;
      }
      nodeIds.forEach((destinationNode) => {
        if (destinationNode === fleet.nodeFrom) {
          return;
        }
        if (!this.isConnectedRoute(fleet.nodeFrom, destinationNode)) {
          return;
        }
        const eta = computeRouteEta(fleet.nodeFrom, destinationNode);
        commodityIds.forEach((commodityId) => {
          const quantity = capacity;
          const dispatchPrice = this.getMarketPrice(fleet.nodeFrom, commodityId);
          const expectedEntropy = this.estimateEntropyForRoute({
            fromNode: fleet.nodeFrom,
            toNode: destinationNode,
            vesselClass: fleet.vesselClass,
            fleetId,
            commodityId,
            quantity,
            totalEta: eta
          });
          const expectedConsequences = resolveEntropyConsequences(expectedEntropy, {
            cargo: { commodityId, quantity },
            fleet,
            observer: this.getAssignedObserver(fleetId)
          });
          const baseArrivalPrice = this.getMarketPrice(destinationNode, commodityId);
          const arrivalPrice =
            baseArrivalPrice * (1 + (expectedConsequences.cargoEfficiencyDelta ?? 0));
          const profit = (arrivalPrice - dispatchPrice) * quantity * ROUTE_VALUE;
          const consequenceMagnitude = this.getConsequenceMagnitude(expectedConsequences);

          candidates.push({
            traderId,
            type: 'AI_DISPATCH_FLEET',
            targetLabel: `${fleetId} ${fleet.nodeFrom}->${destinationNode} ${commodityId}`,
            event: {
              type: 'AI_DISPATCH_FLEET',
              traderId,
              fleetId,
              toNode: destinationNode,
              commodityId,
              quantity
            },
            utility: {
              profit,
              eta,
              entropy: expectedEntropy,
              entropyConsequences: consequenceMagnitude,
              cost: 0,
              utilization: 1
            }
          });
        });
      });
    });
    return candidates;
  }

  private generateAiMarketActions(traderId: string, maxCapacity: number): AiActionCandidate[] {
    const trader = this.getAiTrader(traderId);
    if (!trader || maxCapacity <= 0) {
      return [];
    }
    const candidates: AiActionCandidate[] = [];
    Object.keys(this.mutableState.markets).forEach((nodeId) => {
      Object.keys(BASELINE_PRICES).forEach((commodityId) => {
        const price = this.getMarketPrice(nodeId, commodityId);
        const quantity = 1;
        const creditCost = price * quantity;
        if (creditCost > 0 && trader.credits - creditCost >= AI_MIN_CREDIT_BUFFER) {
          candidates.push({
            traderId,
            type: 'AI_MARKET_BUY_ORDER_PLACED',
            targetLabel: `${nodeId} ${commodityId}`,
            event: {
              type: 'AI_MARKET_BUY_ORDER_PLACED',
              traderId,
              nodeId,
              commodityId,
              quantity
            },
            utility: {
              profit: 0,
              eta: 0,
              entropy: 0,
              entropyConsequences: 0,
              cost: creditCost,
              utilization: 0
            }
          });
        }
        candidates.push({
          traderId,
          type: 'AI_MARKET_SELL_ORDER_PLACED',
          targetLabel: `${nodeId} ${commodityId}`,
          event: {
            type: 'AI_MARKET_SELL_ORDER_PLACED',
            traderId,
            nodeId,
            commodityId,
            quantity
          },
          utility: {
            profit: 0,
            eta: 0,
            entropy: 0,
            entropyConsequences: 0,
            cost: 0,
            utilization: 0
          }
        });
      });
    });
    return candidates;
  }

  private generateAiReversalActions(traderId: string): AiActionCandidate[] {
    const trader = this.getAiTrader(traderId);
    if (!trader) {
      return [];
    }
    const candidates: AiActionCandidate[] = [];
    trader.fleets.forEach((fleetId) => {
      const fleet = this.mutableState.fleets[fleetId];
      if (!fleet) {
        return;
      }
      const nodeId = fleet.nodeFrom;
      const entropyCargo = this.entropyFromDelta(
        fleet.entropyConsequences?.cargoEfficiencyDelta,
        CARGO_ENTROPY_FACTOR
      );
      const entropyFleet = this.entropyFromDelta(
        fleet.entropyConsequences?.fleetEfficiencyDelta,
        FLEET_ENTROPY_FACTOR
      );
      if (entropyCargo > AI_ENTROPY_REVERSAL_THRESHOLD) {
        candidates.push(
          ...this.createAiReversalCandidate(
            traderId,
            trader.credits,
            'cargo',
            fleetId,
            nodeId,
            entropyCargo
          )
        );
      }
      if (entropyFleet > AI_ENTROPY_REVERSAL_THRESHOLD) {
        candidates.push(
          ...this.createAiReversalCandidate(
            traderId,
            trader.credits,
            'fleet',
            fleetId,
            nodeId,
            entropyFleet
          )
        );
      }
    });
    trader.observers.forEach((observerId) => {
      const observer = this.mutableState.observers[observerId];
      if (!observer) {
        return;
      }
      const nodeId = this.getObserverNodeId(observer);
      const entropyObserver = this.entropyFromDelta(
        observer.entropyModifierDelta,
        OBSERVER_ENTROPY_FACTOR
      );
      if (entropyObserver > AI_ENTROPY_REVERSAL_THRESHOLD) {
        candidates.push(
          ...this.createAiReversalCandidate(
            traderId,
            trader.credits,
            'observer',
            observerId,
            nodeId,
            entropyObserver
          )
        );
      }
    });
    return candidates;
  }

  private createAiReversalCandidate(
    traderId: string,
    traderCredits: number,
    targetType: 'cargo' | 'fleet' | 'observer',
    targetId: string,
    nodeId: string | null,
    entropy: number
  ): AiActionCandidate[] {
    if (!nodeId) {
      return [];
    }
    const structureType = this.getReversalStructureType(targetType);
    const node = this.mutableState.nodes[nodeId];
    if (!node || !node.structures.some((structure) => structure.type === structureType)) {
      return [];
    }
    const creditCost = this.getReversalCost(entropy, this.mutableState.entropyReversalConfig.baseCost);
    const avoidedLoss = this.estimateAvoidedLoss(targetType, targetId);
    if (
      creditCost > avoidedLoss ||
      creditCost > traderCredits ||
      traderCredits - creditCost < AI_MIN_CREDIT_BUFFER
    ) {
      return [];
    }
    const utility = {
      profit: 0,
      eta: 0,
      entropy,
      entropyConsequences: entropy,
      cost: creditCost,
      utilization: 0
    };
    if (targetType === 'cargo') {
      return [
        {
          traderId,
          type: 'AI_REVERSAL_APPLIED_CARGO',
          targetLabel: `${targetId}`,
          event: {
            type: 'AI_REVERSAL_APPLIED_CARGO',
            traderId,
            targetType: 'cargo',
            targetId,
            nodeId,
            structureType
          },
          utility
        }
      ];
    }
    if (targetType === 'fleet') {
      return [
        {
          traderId,
          type: 'AI_REVERSAL_APPLIED_FLEET',
          targetLabel: `${targetId}`,
          event: {
            type: 'AI_REVERSAL_APPLIED_FLEET',
            traderId,
            targetType: 'fleet',
            targetId,
            nodeId,
            structureType
          },
          utility
        }
      ];
    }
    return [
      {
        traderId,
        type: 'AI_REVERSAL_APPLIED_OBSERVER',
        targetLabel: `${targetId}`,
        event: {
          type: 'AI_REVERSAL_APPLIED_OBSERVER',
          traderId,
          targetType: 'observer',
          targetId,
          nodeId,
          structureType
        },
        utility
      }
    ];
  }

  private scoreAiActions(actions: AiActionCandidate[]): ScoredAiAction[] {
    const maxProfit = Math.max(0, ...actions.map((action) => action.utility.profit));
    const maxEta = Math.max(0, ...actions.map((action) => action.utility.eta));
    const maxEntropy = Math.max(0, ...actions.map((action) => action.utility.entropy));
    const maxConsequences = Math.max(
      0,
      ...actions.map((action) => action.utility.entropyConsequences)
    );
    const maxCost = Math.max(0, ...actions.map((action) => action.utility.cost));

    return actions.map((action) => {
      const normalizedProfit = maxProfit > 0 ? action.utility.profit / maxProfit : 0;
      const normalizedEta = maxEta > 0 ? action.utility.eta / maxEta : 0;
      const normalizedEntropy = maxEntropy > 0 ? action.utility.entropy / maxEntropy : 0;
      const normalizedConsequences =
        maxConsequences > 0 ? action.utility.entropyConsequences / maxConsequences : 0;
      const normalizedCost = maxCost > 0 ? action.utility.cost / maxCost : 0;
      const normalizedUtilization = clamp(action.utility.utilization, 0, 1);

      const score =
        normalizedProfit * 1.0 -
        normalizedEta * 0.5 -
        normalizedEntropy * 1.0 -
        normalizedConsequences * 1.5 -
        normalizedCost * 1.0 +
        normalizedUtilization * 0.5;

      return { ...action, score };
    });
  }

  private selectBestAiAction(actions: ScoredAiAction[]): ScoredAiAction | null {
    let best: ScoredAiAction | null = null;
    actions.forEach((action) => {
      if (!best || action.score > best.score) {
        best = action;
        return;
      }
      if (best && action.score === best.score) {
        if (action.type < best.type) {
          best = action;
        }
      }
    });
    return best;
  }

  private estimateEntropyForRoute(params: {
    fromNode: string;
    toNode: string;
    vesselClass: string;
    fleetId: string;
    commodityId: string;
    quantity: number;
    totalEta: number;
  }): number {
    const progressFraction = params.totalEta ? 1 / params.totalEta : 1;
    const durationInput = clamp(progressFraction, 0, 1);
    const volatilityInput = this.getVolatilityInput(params.commodityId);
    const quantityInput = clamp(params.quantity / this.getVesselCapacity(params.vesselClass), 0, 1);
    const originInstability = this.getOriginInstability(params.fromNode);
    const observerInput = this.getObserverInput(params.fleetId);
    const rawRisk =
      durationInput * ENTROPY_WEIGHT_DURATION +
      volatilityInput * ENTROPY_WEIGHT_VOLATILITY +
      quantityInput * ENTROPY_WEIGHT_QUANTITY +
      originInstability * ENTROPY_WEIGHT_ORIGIN_INSTABILITY +
      observerInput * ENTROPY_WEIGHT_OBSERVER;
    const mitigation = this.getFleetMitigation(params.vesselClass, params.fleetId).total;
    const effectiveRisk = Math.min(rawRisk * (1 - mitigation), 0.999);
    let entropy = 0;
    for (let step = 0; step < params.totalEta; step += 1) {
      entropy = this.applyEntropyCap(
        entropy + (1 - entropy) * effectiveRisk * ENTROPY_RATE_BASE
      );
    }
    return entropy;
  }

  private getConsequenceMagnitude(consequences: EntropyConsequences): number {
    return (
      Math.abs(consequences.cargoEfficiencyDelta ?? 0) +
      Math.abs(consequences.fleetEfficiencyDelta ?? 0) +
      Math.abs(consequences.observerModifierDelta ?? 0)
    );
  }

  private estimateAvoidedLoss(
    targetType: 'cargo' | 'fleet' | 'observer',
    targetId: string
  ): number {
    if (targetType === 'observer') {
      return ROUTE_VALUE * 5;
    }
    const fleet = this.mutableState.fleets[targetId];
    if (!fleet) {
      return 0;
    }
    const capacity = this.getVesselCapacity(fleet.vesselClass);
    return capacity * ROUTE_VALUE;
  }

  private getReversalStructureType(targetType: 'cargo' | 'fleet' | 'observer'): string {
    if (targetType === 'cargo') {
      return 'CARGO_STABILIZATION_FACILITY';
    }
    if (targetType === 'fleet') {
      return 'FLEET_RECALIBRATION_FACILITY';
    }
    return 'OBSERVER_RECONDITIONING_FACILITY';
  }

  private getAiTrader(traderId: string): SimulationState['aiTraders'][number] | undefined {
    return this.mutableState.aiTraders.find((trader) => trader.id === traderId);
  }

  private applyCreditDelta(ownerId: string, delta: number): void {
    if (ownerId === 'player') {
      this.mutableState.credits += delta;
      return;
    }
    const trader = this.getAiTrader(ownerId);
    if (trader) {
      trader.credits += delta;
    }
  }

  private getCreditBalance(ownerId: string): number {
    if (ownerId === 'player') {
      return this.mutableState.credits;
    }
    const trader = this.getAiTrader(ownerId);
    return trader?.credits ?? 0;
  }

  private getObserverNodeId(observer: ObserverState): string | null {
    if (this.mutableState.nodes[observer.assignment]) {
      return observer.assignment;
    }
    const fleet = this.mutableState.fleets[observer.assignment];
    return fleet?.nodeFrom ?? null;
  }

  private isConnectedRoute(fromNode: string, toNode: string): boolean {
    return NODE_LINKS.some(
      (link) =>
        (link.from === fromNode && link.to === toNode) ||
        (link.from === toNode && link.to === fromNode)
    );
  }

  private log(message: string): void {
    this.mutableState.logs.push(message);
  }

  private recordEvent(
    type: string,
    payload: Record<string, unknown>,
    refs?: SimulationEvent['refs']
  ): void {
    const id = `event-${this.mutableState.sequences.event}`;
    this.mutableState.sequences.event += 1;
    this.mutableState.events.push({
      id,
      tick: this.mutableState.time.tick,
      type,
      payload,
      refs
    });
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
  return Math.ceil(BASE_ROUTE_TIME + distance * DISTANCE_TIME_FACTOR);
}

function resolveEntropyConsequences(
  entropy: number,
  context: {
    cargo?: FleetState['cargo'];
    fleet?: FleetState;
    observer?: ObserverState;
  }
): EntropyConsequences {
      const scaledEntropy = Math.sqrt(clamp(entropy, 0, ENTROPY_MAX));
  const consequences: EntropyConsequences = {};

  if (context.cargo) {
    consequences.cargoEfficiencyDelta = clampCargoEfficiencyDelta(
      -scaledEntropy * CARGO_ENTROPY_FACTOR
    );
  }
  if (context.fleet) {
    consequences.fleetEfficiencyDelta = clamp(-scaledEntropy * FLEET_ENTROPY_FACTOR, -1, 0);
  }
  if (context.observer) {
    consequences.observerModifierDelta = clamp(-scaledEntropy * OBSERVER_ENTROPY_FACTOR, -1, 0);
  }

  return consequences;
}

function formatPercent(value?: number): string {
  if (value === undefined) {
    return '--';
  }
  return `${(value * 100).toFixed(0)}%`;
}

function clampCargoEfficiencyDelta(delta: number): number {
  const efficiency = clamp(1 + delta, CARGO_EFFICIENCY_MIN, CARGO_EFFICIENCY_MAX);
  return clamp(efficiency - 1, CARGO_EFFICIENCY_MIN - 1, 0);
}

function applyEntropyReversal(
  currentEntropy: number,
  effectFraction: number
): {
  entropyRemoved: number;
  entropyRemaining: number;
} {
    const safeEntropy = clamp(currentEntropy, 0, ENTROPY_MAX);
    const safeFraction = clamp(effectFraction, 0, 1);
    const entropyRemoved = safeEntropy * safeFraction;
    const entropyRemaining = clamp(safeEntropy - entropyRemoved, 0, ENTROPY_MAX);
  return { entropyRemoved, entropyRemaining };
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
      ownerId?: string;
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
      entropy: number;
    }
  | {
      type: 'REVERSAL_APPLIED_CARGO';
      targetType: 'cargo';
      targetId: string;
      nodeId: string;
      structureType: string;
    }
  | {
      type: 'REVERSAL_APPLIED_FLEET';
      targetType: 'fleet';
      targetId: string;
      nodeId: string;
      structureType: string;
    }
  | {
      type: 'REVERSAL_APPLIED_OBSERVER';
      targetType: 'observer';
      targetId: string;
      nodeId: string;
      structureType: string;
    }
  | {
      type: 'AI_DISPATCH_FLEET';
      traderId: string;
      fleetId: string;
      toNode: string;
      commodityId: string;
      quantity: number;
    }
  | {
      type: 'AI_MARKET_BUY_ORDER_PLACED';
      traderId: string;
      nodeId: string;
      commodityId: string;
      quantity: number;
    }
  | {
      type: 'AI_MARKET_SELL_ORDER_PLACED';
      traderId: string;
      nodeId: string;
      commodityId: string;
      quantity: number;
    }
  | {
      type: 'AI_REVERSAL_APPLIED_CARGO';
      traderId: string;
      targetType: 'cargo';
      targetId: string;
      nodeId: string;
      structureType: string;
    }
  | {
      type: 'AI_REVERSAL_APPLIED_FLEET';
      traderId: string;
      targetType: 'fleet';
      targetId: string;
      nodeId: string;
      structureType: string;
    }
  | {
      type: 'AI_REVERSAL_APPLIED_OBSERVER';
      traderId: string;
      targetType: 'observer';
      targetId: string;
      nodeId: string;
      structureType: string;
    }
  | { type: 'TECH_RESEARCH_SELECTED'; techId: string }
  | { type: 'GOVERNANCE_CAMPAIGN_INVESTED'; seatId: string; playerId: string }
  | { type: 'NODE_POLICIES_OPENED' };
