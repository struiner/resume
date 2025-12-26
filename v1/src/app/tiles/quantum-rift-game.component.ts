import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuantumRiftStateService, SimulationState } from './quantum-rift-state.service';

type ScreenId =
  | 'map'
  | 'node'
  | 'market'
  | 'fleet'
  | 'observer'
  | 'tech'
  | 'governance'
  | 'logs';

interface ScreenDefinition {
  id: ScreenId;
  label: string;
  hasLeftPanel: boolean;
  leftTitle?: string;
  leftActions?: Array<{ label: string; event?: string; screen?: ScreenId }>;
  leftFilters?: Array<{ label: string; value: string }>;
}

interface QuantumNode {
  id: string;
  label: string;
  classId: NodeClassId;
  x: number;
  y: number;
}

type NodeClassId = 'CORE' | 'INDUSTRIAL' | 'RESEARCH' | 'FRONTIER' | 'RIFT_EDGE';

interface Commodity {
  id: string;
  name: string;
  category: string;
  volatility: string;
  decay: string;
  affinity: string;
  description: string;
}

interface GovernanceSeat {
  id: string;
  scope: string;
  authority: string;
}

interface SelectionState {
  nodeId: string;
  commodityId: string;
  fleetId: string;
  observerId: string;
  seatId: string;
  techTree: string;
}

const SCREEN_DEFINITIONS: ScreenDefinition[] = [
  {
    id: 'map',
    label: 'Galactic Node Map',
    hasLeftPanel: true,
    leftTitle: 'Actions',
    leftActions: [
      { label: 'Establish Route', event: 'ROUTE_ESTABLISHED' },
      { label: 'Dispatch Fleet', event: 'FLEET_DISPATCHED' },
      { label: 'Open Market Ledger', screen: 'market' },
      { label: 'Open Governance Panel', screen: 'governance' },
      { label: 'Open Tech Research', screen: 'tech' }
    ]
  },
  {
    id: 'node',
    label: 'Node Detail View',
    hasLeftPanel: true,
    leftTitle: 'Node Actions',
    leftActions: [
      { label: 'Build Structure', event: 'STRUCTURE_BUILT' },
      { label: 'Assign Observer', event: 'OBSERVER_ASSIGNED' },
      { label: 'Local Market', screen: 'market' },
      { label: 'Node Policies', event: 'NODE_POLICIES_OPENED' }
    ]
  },
  {
    id: 'market',
    label: 'Market Ledger',
    hasLeftPanel: true,
    leftTitle: 'Filters',
    leftFilters: [
      { label: 'Commodity Category', value: 'All' },
      { label: 'Node', value: 'Any' },
      { label: 'Volatility Class', value: 'Any' }
    ]
  },
  {
    id: 'fleet',
    label: 'Fleet Control',
    hasLeftPanel: false
  },
  {
    id: 'observer',
    label: 'Observer Roster',
    hasLeftPanel: false
  },
  {
    id: 'tech',
    label: 'Tech Research',
    hasLeftPanel: false
  },
  {
    id: 'governance',
    label: 'Governance Panel',
    hasLeftPanel: false
  },
  {
    id: 'logs',
    label: 'Logs and Analysis',
    hasLeftPanel: false
  }
];

const QUANTUM_NODES: QuantumNode[] = [
  { id: 'node-core-helix', label: 'CORE HELIX', classId: 'CORE', x: 50, y: 32 },
  { id: 'node-core-axial', label: 'CORE AXIAL', classId: 'CORE', x: 62, y: 44 },
  { id: 'node-ind-forge', label: 'IND FORGE', classId: 'INDUSTRIAL', x: 38, y: 44 },
  { id: 'node-ind-foundry', label: 'IND FOUNDRY', classId: 'INDUSTRIAL', x: 50, y: 56 },
  { id: 'node-ind-lattice', label: 'IND LATTICE', classId: 'INDUSTRIAL', x: 62, y: 56 },
  { id: 'node-ind-basin', label: 'IND BASIN', classId: 'INDUSTRIAL', x: 38, y: 56 },
  { id: 'node-ind-atelier', label: 'IND ATELIER', classId: 'INDUSTRIAL', x: 50, y: 68 },
  { id: 'node-res-singularity', label: 'RES SINGULARITY', classId: 'RESEARCH', x: 75, y: 35 },
  { id: 'node-res-parallax', label: 'RES PARALLAX', classId: 'RESEARCH', x: 25, y: 35 },
  { id: 'node-res-spectrum', label: 'RES SPECTRUM', classId: 'RESEARCH', x: 75, y: 65 },
  { id: 'node-res-axiom', label: 'RES AXIOM', classId: 'RESEARCH', x: 25, y: 65 },
  { id: 'node-front-delta', label: 'FRONTIER DELTA', classId: 'FRONTIER', x: 12, y: 50 },
  { id: 'node-front-echo', label: 'FRONTIER ECHO', classId: 'FRONTIER', x: 22, y: 80 },
  { id: 'node-front-vega', label: 'FRONTIER VEGA', classId: 'FRONTIER', x: 78, y: 20 },
  { id: 'node-front-nadir', label: 'FRONTIER NADIR', classId: 'FRONTIER', x: 90, y: 50 },
  { id: 'node-front-halo', label: 'FRONTIER HALO', classId: 'FRONTIER', x: 78, y: 80 },
  { id: 'node-front-rim', label: 'FRONTIER RIM', classId: 'FRONTIER', x: 22, y: 20 },
  { id: 'node-rift-null', label: 'RIFT NULL', classId: 'RIFT_EDGE', x: 4, y: 35 },
  { id: 'node-rift-scar', label: 'RIFT SCAR', classId: 'RIFT_EDGE', x: 96, y: 35 },
  { id: 'node-rift-abyss', label: 'RIFT ABYSS', classId: 'RIFT_EDGE', x: 85, y: 92 }
];

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

const COMMODITIES: Commodity[] = [
  {
    id: 'QG01_ENTANGLED_MATTER',
    name: 'Entangled Matter',
    category: 'Fundamental',
    volatility: 'Medium',
    decay: 'None',
    affinity: 'High-coherence nodes',
    description: 'Stable paired matter used in containment and routing structures.'
  },
  {
    id: 'QG02_VACUUM_ENERGY',
    name: 'Vacuum Energy',
    category: 'Energy',
    volatility: 'High',
    decay: 'Fast',
    affinity: 'Low-stability nodes',
    description: 'Extracted background energy with high fluctuation.'
  },
  {
    id: 'QG03_DECOHERENCE_FIELD',
    name: 'Decoherence Field',
    category: 'Field',
    volatility: 'Low',
    decay: 'Slow',
    affinity: 'High-population nodes',
    description: 'Field material used to suppress probability spread.'
  },
  {
    id: 'QG04_TEMPORAL_ISOTOPE',
    name: 'Temporal Isotope',
    category: 'Exotic',
    volatility: 'High',
    decay: 'Medium',
    affinity: 'Time-unstable nodes',
    description: 'Matter with non-uniform temporal behavior.'
  },
  {
    id: 'QG05_PROBABILITY_LATTICE',
    name: 'Probability Lattice',
    category: 'Structural',
    volatility: 'Low',
    decay: 'None',
    affinity: 'Trade hubs',
    description: 'Framework material for stabilizing routes.'
  },
  {
    id: 'QG06_OBSERVER_ANCHOR',
    name: 'Observer Anchor',
    category: 'Governance',
    volatility: 'Medium',
    decay: 'Slow',
    affinity: 'Politically active nodes',
    description: 'Material enabling consensus enforcement.'
  },
  {
    id: 'QG07_WAVEFORM_ALLOY',
    name: 'Waveform Alloy',
    category: 'Industrial',
    volatility: 'Medium',
    decay: 'None',
    affinity: 'Manufacturing nodes',
    description: 'Alloy resistant to probability shear.'
  },
  {
    id: 'QG08_EVENT_HORIZON_FIBER',
    name: 'Event Horizon Fiber',
    category: 'Structural',
    volatility: 'Low',
    decay: 'None',
    affinity: 'Rift-adjacent nodes',
    description: 'Tension-bearing filament for extreme routes.'
  },
  {
    id: 'QG09_INFORMATION_DUST',
    name: 'Information Dust',
    category: 'Abstract',
    volatility: 'High',
    decay: 'Fast',
    affinity: 'Research nodes',
    description: 'Highly perishable encoded state data.'
  },
  {
    id: 'QG10_COLLAPSE_RESIN',
    name: 'Collapse Resin',
    category: 'Chemical',
    volatility: 'Medium',
    decay: 'Medium',
    affinity: 'High-risk nodes',
    description: 'Reactive medium used during forced collapse events.'
  },
  {
    id: 'QG11_PHASE_GLASS',
    name: 'Phase Glass',
    category: 'Industrial',
    volatility: 'Low',
    decay: 'None',
    affinity: 'Infrastructure nodes',
    description: 'Transparent solid capable of holding phase variance.'
  },
  {
    id: 'QG12_ENTROPY_SINK',
    name: 'Entropy Sink',
    category: 'Fundamental',
    volatility: 'Low',
    decay: 'Slow',
    affinity: 'Overloaded nodes',
    description: 'Absorptive mass that reduces systemic entropy.'
  },
  {
    id: 'QG13_REALITY_CEMENT',
    name: 'Reality Cement',
    category: 'Structural',
    volatility: 'None',
    decay: 'None',
    affinity: 'Core nodes',
    description: 'Permanent stabilizing compound for node construction.'
  },
  {
    id: 'QG14_SUPERPOSITION_FLUID',
    name: 'Superposition Fluid',
    category: 'Exotic',
    volatility: 'Extreme',
    decay: 'Fast',
    affinity: 'Experimental nodes',
    description: 'Liquid maintaining multiple outcome states.'
  },
  {
    id: 'QG15_SIGNAL_NOISE_CRYSTAL',
    name: 'Signal Noise Crystal',
    category: 'Abstract',
    volatility: 'Medium',
    decay: 'Slow',
    affinity: 'Communication nodes',
    description: 'Crystalline medium encoding signal variance.'
  },
  {
    id: 'QG16_OBSERVER_INK',
    name: 'Observer Ink',
    category: 'Governance',
    volatility: 'Low',
    decay: 'Medium',
    affinity: 'Bureaucratic nodes',
    description: 'Consumable used to formalize observer assignments.'
  },
  {
    id: 'QG17_DIMENSIONAL_SLAG',
    name: 'Dimensional Slag',
    category: 'Waste',
    volatility: 'Low',
    decay: 'None',
    affinity: 'Extraction nodes',
    description: 'Byproduct of rift mining operations.'
  },
  {
    id: 'QG18_STATE_VECTOR_CORE',
    name: 'State Vector Core',
    category: 'Fundamental',
    volatility: 'Medium',
    decay: 'None',
    affinity: 'Capital nodes',
    description: 'Encapsulated reference state used for alignment.'
  },
  {
    id: 'QG19_PROBABILITY_SILK',
    name: 'Probability Silk',
    category: 'Structural',
    volatility: 'Medium',
    decay: 'Slow',
    affinity: 'Long-route nodes',
    description: 'Flexible stabilizer for extended probability channels.'
  },
  {
    id: 'QG20_NULL_REFERENCE',
    name: 'Null Reference',
    category: 'Abstract',
    volatility: 'None',
    decay: 'None',
    affinity: 'Universally accepted',
    description: 'Absolute baseline reference used in calibration and pricing.'
  }
];

const GOVERNANCE_SEATS: GovernanceSeat[] = [
  {
    id: 'NODE_COORDINATOR',
    scope: 'Single node',
    authority: 'Infrastructure, local trade modifiers'
  },
  {
    id: 'CONSENSUS_ANCHOR',
    scope: 'Multi-node',
    authority: 'Stability enforcement, route regulation'
  },
  {
    id: 'RIFT_MEDIATOR',
    scope: 'Regional',
    authority: 'Conflict suppression, variance limits'
  }
];

const TECH_TREES = [
  'Containment Engineering',
  'Observation Theory',
  'Probability Stabilization',
  'Expedition Science',
  'Governance Manipulation'
];

const LOG_CATEGORIES = [
  'Trade events',
  'Route collapses',
  'Political changes'
];

const VESSEL_CAPACITY: Record<string, number> = {
  CONTAINMENT_FRIGATE: 50,
  STABILIZER_BARGE: 120,
  PROBE_CARRIER: 20,
  CONSENSUS_FLAGSHIP: 80
};

const REVERSAL_STRUCTURES: Record<'cargo' | 'fleet' | 'observer', string> = {
  cargo: 'CARGO_STABILIZATION_FACILITY',
  fleet: 'FLEET_RECALIBRATION_FACILITY',
  observer: 'OBSERVER_RECONDITIONING_FACILITY'
};

const CARGO_ENTROPY_FACTOR = 0.1;
const FLEET_ENTROPY_FACTOR = 0.1;
const OBSERVER_ENTROPY_FACTOR = 0.1;

@Component({
  selector: 'quantum-rift-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rift-game">
      <header class="top-bar">
        <div class="top-left">
          <div class="eyebrow">Quantum Rift</div>
          <div class="screen-title">{{ activeScreen?.label }}</div>
          <div class="context-line">
            Current Node:
            <span>{{ selectedNode?.label || 'None selected' }}</span>
          </div>
        </div>
        <div class="top-center">
          <div class="control-group">
            <div class="control-label">Time Controls</div>
            <div class="toggle-group">
              <button type="button" [class.active]="state.time.mode === 'pause'" (click)="setTimeMode('pause')">
                Pause
              </button>
              <button type="button" [class.active]="state.time.mode === 'normal'" (click)="setTimeMode('normal')">
                Normal
              </button>
              <button type="button" [class.active]="state.time.mode === 'fast'" (click)="setTimeMode('fast')">
                Fast
              </button>
            </div>
            <button type="button" class="step-button" (click)="advanceStep()">
              Advance Step
            </button>
          </div>
          <div class="control-group">
            <div class="control-label">Screens</div>
            <div class="toggle-group">
              <button
                *ngFor="let screen of screens"
                type="button"
                [class.active]="screen.id === screenId"
                (click)="setScreen(screen.id)">
                {{ screen.label }}
              </button>
            </div>
          </div>
        </div>
        <div class="top-right">
          <div class="status-chip">
            <span class="chip-label">Credits</span>
            <span class="chip-value">{{ state.credits }}</span>
          </div>
          <div class="status-chip">
            <span class="chip-label">Alerts</span>
            <span class="chip-value">{{ alertState }}</span>
          </div>
          <button type="button" class="log-button" (click)="toggleLogs()">
            Logs & Analysis
          </button>
        </div>
      </header>

      <div class="rift-body" [class.no-left-panel]="!activeScreen?.hasLeftPanel">
        <aside class="left-panel" *ngIf="activeScreen?.hasLeftPanel">
          <div class="panel-title">{{ activeScreen?.leftTitle }}</div>
          <ng-container *ngIf="activeScreen?.leftActions">
            <button
              type="button"
              class="action-button"
              *ngFor="let action of activeScreen?.leftActions"
              (click)="handleAction(action)">
              {{ action.label }}
            </button>
          </ng-container>
          <ng-container *ngIf="activeScreen?.leftFilters">
            <div class="filter-block" *ngFor="let filter of activeScreen?.leftFilters">
              <div class="filter-label">{{ filter.label }}</div>
              <div class="filter-value">{{ filter.value }}</div>
            </div>
          </ng-container>
        </aside>

        <section class="main-panel">
          <ng-container [ngSwitch]="screenId">
            <div *ngSwitchCase="'map'" class="map-view">
              <svg class="map-links" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line
                  *ngFor="let link of nodeLinks"
                  [attr.x1]="getNode(link.from)?.x"
                  [attr.y1]="getNode(link.from)?.y"
                  [attr.x2]="getNode(link.to)?.x"
                  [attr.y2]="getNode(link.to)?.y"></line>
              </svg>
              <button
                type="button"
                class="node"
                *ngFor="let node of nodes"
                [class.selected]="node.id === selection.nodeId"
                [style.left.%]="node.x"
                [style.top.%]="node.y"
                (click)="selectNode(node.id)">
                <span class="node-name">{{ node.label }}</span>
                <span class="node-class">{{ node.classId }}</span>
              </button>
            </div>

            <div *ngSwitchCase="'node'" class="node-view">
              <div class="node-list">
                <button
                  type="button"
                  class="list-row"
                  *ngFor="let node of nodes"
                  [class.selected]="node.id === selection.nodeId"
                  (click)="selectNode(node.id)">
                  <span>{{ node.label }}</span>
                  <span>{{ node.classId }}</span>
                </button>
              </div>
              <div class="node-placeholder">
                <div class="placeholder-title">Node Layout</div>
                <div class="placeholder-text">Structures and routes are displayed here.</div>
              </div>
            </div>

            <div *ngSwitchCase="'market'" class="market-view">
              <div class="market-actions">
                <button type="button" class="action-button" (click)="placeMarketOrder('buy')">
                  Buy Order
                </button>
                <button type="button" class="action-button" (click)="placeMarketOrder('sell')">
                  Sell Order
                </button>
              </div>
              <div class="market-table">
                <div class="market-row header">
                  <span>Commodity</span>
                  <span>Category</span>
                  <span>Price</span>
                  <span>Volatility</span>
                  <span>Decay</span>
                </div>
                <button
                  type="button"
                  class="market-row"
                  *ngFor="let commodity of commodities"
                  [class.selected]="commodity.id === selection.commodityId"
                  (click)="selectCommodity(commodity.id)">
                  <span>{{ commodity.name }}</span>
                  <span>{{ commodity.category }}</span>
                  <span>{{ getCommodityPrice(commodity.id) }}</span>
                  <span>{{ getCommodityVolatility(commodity.id) }}</span>
                  <span>{{ commodity.decay }}</span>
                </button>
              </div>
            </div>

            <div *ngSwitchCase="'fleet'" class="list-view">
              <div class="list-title">Fleets</div>
              <button type="button" class="action-button" (click)="changeFleetRoute()">
                Issue New Route
              </button>
              <button
                type="button"
                class="list-row fleet-row"
                *ngFor="let fleetId of state.fleetOrder"
                [class.selected]="fleetId === selection.fleetId"
                (click)="selectFleet(fleetId)">
                <span>{{ fleetId }}</span>
                <span>{{ getFleetStatusLabel(fleetId) }}</span>
                <span class="cargo-chip">{{ getFleetCargoLabel(fleetId) }}</span>
              </button>
            </div>

            <div *ngSwitchCase="'observer'" class="list-view">
              <div class="list-title">Observers</div>
              <button
                type="button"
                class="list-row"
                *ngFor="let observerId of state.observerOrder"
                [class.selected]="observerId === selection.observerId"
                (click)="selectObserver(observerId)">
                <span>{{ state.observers[observerId].name || observerId }}</span>
                <span>{{ state.observers[observerId].summary || '--' }}</span>
              </button>
            </div>

            <div *ngSwitchCase="'tech'" class="list-view">
              <div class="list-title">Tech Trees</div>
              <button
                type="button"
                class="list-row"
                *ngFor="let tree of techTrees"
                [class.selected]="tree === selection.techTree"
                (click)="selectTech(tree)">
                <span>{{ tree }}</span>
                <span>{{ state.tech[tree].status || '--' }}</span>
              </button>
            </div>

            <div *ngSwitchCase="'governance'" class="list-view">
              <div class="list-title">Governance Seats</div>
              <button type="button" class="action-button" (click)="investInCampaign()">
                Invest in Campaign
              </button>
              <button
                type="button"
                class="list-row"
                *ngFor="let seat of governanceSeats"
                [class.selected]="seat.id === selection.seatId"
                (click)="selectSeat(seat.id)">
                <span>{{ seat.id }}</span>
                <span>{{ seat.scope }}</span>
              </button>
            </div>

            <div *ngSwitchCase="'logs'" class="list-view">
              <div class="list-title">Events</div>
              <div class="event-filters">
                <label>
                  <span>Type</span>
                  <select [(ngModel)]="eventTypeFilter">
                    <option *ngFor="let type of eventTypes" [value]="type">{{ type }}</option>
                  </select>
                </label>
                <label>
                  <span>Tick Min</span>
                  <input type="number" [(ngModel)]="eventTickMin" />
                </label>
                <label>
                  <span>Tick Max</span>
                  <input type="number" [(ngModel)]="eventTickMax" />
                </label>
                <label>
                  <span>Node</span>
                  <input type="text" [(ngModel)]="eventNodeFilter" />
                </label>
                <label>
                  <span>Fleet</span>
                  <input type="text" [(ngModel)]="eventFleetFilter" />
                </label>
                <label>
                  <span>Commodity</span>
                  <input type="text" [(ngModel)]="eventCommodityFilter" />
                </label>
              </div>
              <div class="event-list">
                <button
                  type="button"
                  class="list-row"
                  *ngFor="let entry of filteredEvents"
                  [class.selected]="entry.id === selectedEventId"
                  (click)="selectEvent(entry.id)">
                  <span>#{{ entry.tick }}</span>
                  <span>{{ entry.type }}</span>
                </button>
              </div>
              <div class="log-note">Full session events are listed here. Bottom log remains short-form.</div>
            </div>
          </ng-container>
        </section>

        <aside class="right-panel">
          <div class="panel-title">Inspector</div>

          <ng-container [ngSwitch]="screenId">
            <div *ngSwitchCase="'map'" class="inspector-block">
              <div class="inspector-title">Node Selected</div>
              <div class="inspector-line">Class: {{ selectedNodeState?.classId || '--' }}</div>
              <div class="inspector-line">Population: {{ selectedNodeState?.population || '--' }}</div>
              <div class="inspector-line">Political Weight: {{ selectedNodeState?.politicalWeight || '--' }}</div>
              <div class="inspector-line">Stability Bias: {{ selectedNodeState?.stabilityBias || '--' }}</div>
              <div class="inspector-line">Governance Seats: {{ selectedGovernanceSeats }}</div>
            </div>

            <div *ngSwitchCase="'node'" class="inspector-block">
              <div class="inspector-title">Structure Selected</div>
              <div class="inspector-line">Inputs: --</div>
              <div class="inspector-line">Outputs: --</div>
              <div class="inspector-line">Throughput: --</div>
              <div class="inspector-line">Stability Modifiers: --</div>
              <div class="inspector-line">Upkeep Requirements: --</div>
            </div>

            <div *ngSwitchCase="'market'" class="inspector-block">
              <div class="inspector-title">Commodity Selected</div>
              <div class="inspector-line">{{ selectedCommodity?.name || 'None' }}</div>
              <div class="inspector-line">Category: {{ selectedCommodity?.category || '--' }}</div>
              <div class="inspector-line">Price: {{ selectedCommodityPrice }}</div>
              <div class="inspector-line">Volatility: {{ selectedCommodityVolatility }}</div>
              <div class="inspector-line">Decay: {{ selectedCommodity?.decay || '--' }}</div>
              <div class="inspector-line">Node Affinity: {{ selectedCommodity?.affinity || '--' }}</div>
              <div class="inspector-note">{{ selectedCommodity?.description || '' }}</div>
            </div>

            <div *ngSwitchCase="'fleet'" class="inspector-block">
              <div class="inspector-title">Fleet Selected</div>
              <div class="inspector-line">Vessel Class: {{ selectedFleet?.vesselClass || '--' }}</div>
              <div class="inspector-line">Status: {{ selectedFleet?.status || '--' }}</div>
              <div class="inspector-line">Route: {{ selectedFleetRoute }}</div>
              <div class="inspector-line">Observer: --</div>
              <div class="inspector-line">Cargo: {{ getCargoDetail(selectedFleet?.cargo) }}</div>
              <div class="inspector-line">Entropy: {{ formatEntropy(selectedFleet?.entropy) }}</div>
              <div class="inspector-line">Entropy Rate: {{ formatEntropy(selectedFleet?.entropyRate) }}</div>
              <div class="inspector-line">
                Mitigation: {{ formatMitigation(selectedFleet?.mitigation) }}
              </div>
              <div class="inspector-line">
                Cargo Efficiency: {{ formatPercent(selectedFleet?.entropyConsequences?.cargoEfficiencyDelta) }}
              </div>
              <div class="inspector-line">
                Fleet Efficiency: {{ formatPercent(selectedFleet?.entropyConsequences?.fleetEfficiencyDelta) }}
              </div>
              <div class="inspector-line">
                Observer Modifier: {{ formatPercent(selectedFleet?.entropyConsequences?.observerModifierDelta) }}
              </div>
              <div class="inspector-actions">
                <button
                  type="button"
                  class="action-button"
                  [disabled]="!canReverseCargo().allowed"
                  (click)="applyCargoReversal()">
                  Stabilize Cargo
                </button>
                <div class="inspector-hint" *ngIf="canReverseCargo().reason">
                  {{ canReverseCargo().reason }}
                </div>
                <button
                  type="button"
                  class="action-button"
                  [disabled]="!canReverseFleet().allowed"
                  (click)="applyFleetReversal()">
                  Recalibrate Fleet
                </button>
                <div class="inspector-hint" *ngIf="canReverseFleet().reason">
                  {{ canReverseFleet().reason }}
                </div>
              </div>
              <div class="inspector-line">Route Risk: --</div>
              <div class="inspector-line">ETA (ticks): {{ selectedFleet?.eta ?? '--' }}</div>
            </div>

            <div *ngSwitchCase="'observer'" class="inspector-block">
              <div class="inspector-title">Observer Selected</div>
              <div class="inspector-line">Risk Bias: {{ selectedObserver?.riskBias || '--' }}</div>
              <div class="inspector-line">Collapse Control: {{ selectedObserver?.collapseControl || '--' }}</div>
              <div class="inspector-line">Efficiency Bias: {{ selectedObserver?.efficiencyBias || '--' }}</div>
              <div class="inspector-line">Political Alignment: {{ selectedObserver?.politicalAlignment || '--' }}</div>
              <div class="inspector-line">Active Assignment: {{ selectedObserver?.assignment || '--' }}</div>
              <div class="inspector-line">
                Entropy Modifier: {{ formatPercent(selectedObserver?.entropyModifierDelta) }}
              </div>
              <div class="inspector-actions">
                <button
                  type="button"
                  class="action-button"
                  [disabled]="!canReverseObserver().allowed"
                  (click)="applyObserverReversal()">
                  Recondition Observer
                </button>
                <div class="inspector-hint" *ngIf="canReverseObserver().reason">
                  {{ canReverseObserver().reason }}
                </div>
              </div>
            </div>

            <div *ngSwitchCase="'tech'" class="inspector-block">
              <div class="inspector-title">Tech Selected</div>
              <div class="inspector-line">Tree: {{ selection.techTree || '--' }}</div>
              <div class="inspector-line">Status: {{ selectedTech?.status || '--' }}</div>
              <div class="inspector-line">Effects: {{ selectedTech?.effects || '--' }}</div>
              <div class="inspector-line">Prerequisites: {{ selectedTech?.prerequisites || '--' }}</div>
              <div class="inspector-line">Research Cost: {{ selectedTech?.cost || '--' }}</div>
            </div>

            <div *ngSwitchCase="'governance'" class="inspector-block">
              <div class="inspector-title">Seat Selected</div>
              <div class="inspector-line">Seat: {{ selectedGovernance?.id || '--' }}</div>
              <div class="inspector-line">Scope: {{ selectedGovernance?.scope || '--' }}</div>
              <div class="inspector-line">Authority: {{ selectedGovernance?.authority || '--' }}</div>
              <div class="inspector-line">Required Commodities: {{ selectedGovernance?.requiredCommoditiesLabel || '--' }}</div>
            </div>

            <div *ngSwitchCase="'logs'" class="inspector-block">
              <div class="inspector-title">Event Detail</div>
              <ng-container *ngIf="selectedEvent; else noEvent">
                <div class="inspector-line">Tick: {{ selectedEvent.tick }}</div>
                <div class="inspector-line">Type: {{ selectedEvent.type }}</div>
                <div class="inspector-note">Payload</div>
                <pre class="event-payload">{{ formatEventPayload(selectedEvent.payload) }}</pre>
              </ng-container>
              <ng-template #noEvent>
                <div class="inspector-line">Select an event to inspect.</div>
              </ng-template>
            </div>
          </ng-container>
        </aside>
      </div>

      <footer class="bottom-log" [class.expanded]="state.ui.logsExpanded">
        <div class="log-header">
          <div class="panel-title">Logs / Messages</div>
          <button type="button" class="log-toggle" (click)="toggleLogs()">
            {{ state.ui.logsExpanded ? 'Collapse' : 'Expand' }}
          </button>
        </div>
        <div class="log-entries">
          <div class="log-line" *ngFor="let line of state.logs">{{ line }}</div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      font-family: "IBM Plex Sans", "Inter", "Segoe UI", sans-serif;
      color: #d7e2f1;
    }

    .rift-game {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
      box-sizing: border-box;
      background:
        radial-gradient(circle at 10% 12%, rgba(64, 160, 190, 0.16), transparent 50%),
        radial-gradient(circle at 85% 20%, rgba(150, 80, 160, 0.18), transparent 55%),
        linear-gradient(180deg, rgba(5, 8, 14, 0.95), rgba(3, 5, 10, 0.98));
      border-radius: 14px;
      border: 1px solid rgba(120, 150, 180, 0.3);
      box-shadow: 0 10px 22px rgba(0, 0, 0, 0.45);
    }

    .top-bar {
      display: grid;
      grid-template-columns: 1fr minmax(0, 2fr) 1fr;
      gap: 12px;
      align-items: center;
    }

    .top-left,
    .top-center,
    .top-right {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .top-center {
      align-items: center;
    }

    .top-right {
      align-items: flex-end;
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 1.6px;
      font-size: 10px;
      opacity: 0.7;
    }

    .screen-title {
      font-size: 16px;
      letter-spacing: 0.5px;
    }

    .context-line {
      font-size: 11px;
      opacity: 0.75;
    }

    .context-line span {
      color: #f2f6ff;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
    }

    .control-label {
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 1px;
      opacity: 0.65;
    }

    .toggle-group {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
      background: rgba(8, 12, 20, 0.7);
      border: 1px solid rgba(120, 150, 180, 0.25);
      padding: 4px;
      border-radius: 999px;
    }

    .toggle-group button {
      border: 1px solid transparent;
      background: transparent;
      color: inherit;
      font-size: 10px;
      padding: 4px 10px;
      border-radius: 999px;
      cursor: pointer;
      white-space: nowrap;
    }

    .toggle-group button.active {
      border-color: rgba(120, 220, 255, 0.6);
      background: rgba(80, 160, 200, 0.2);
    }

    .step-button {
      margin-top: 4px;
      border: 1px solid rgba(120, 150, 180, 0.3);
      background: rgba(10, 16, 26, 0.8);
      color: inherit;
      border-radius: 999px;
      padding: 4px 12px;
      font-size: 10px;
      letter-spacing: 0.6px;
      cursor: pointer;
    }

    .status-chip {
      background: rgba(8, 12, 20, 0.7);
      border: 1px solid rgba(120, 150, 180, 0.25);
      border-radius: 10px;
      padding: 6px 10px;
      font-size: 11px;
      text-align: right;
    }

    .chip-label {
      display: block;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.6;
    }

    .chip-value {
      font-size: 11px;
    }

    .log-button {
      margin-top: 4px;
      border: 1px solid rgba(120, 150, 180, 0.3);
      background: rgba(10, 14, 22, 0.85);
      color: inherit;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 10px;
      letter-spacing: 0.6px;
      cursor: pointer;
    }

    .rift-body {
      flex: 1;
      display: grid;
      grid-template-columns: 220px minmax(0, 1fr) 260px;
      gap: 12px;
      min-height: 0;
    }

    .rift-body.no-left-panel {
      grid-template-columns: minmax(0, 1fr) 260px;
    }

    .left-panel,
    .right-panel {
      background: rgba(8, 12, 20, 0.75);
      border: 1px solid rgba(120, 150, 180, 0.3);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 0;
    }

    .panel-title {
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 10px;
      opacity: 0.7;
    }

    .action-button {
      border: 1px solid rgba(120, 150, 180, 0.25);
      background: rgba(12, 18, 28, 0.8);
      color: inherit;
      padding: 8px 10px;
      border-radius: 10px;
      font-size: 11px;
      text-align: left;
      cursor: pointer;
    }

    .filter-block {
      background: rgba(12, 18, 28, 0.8);
      border: 1px solid rgba(120, 150, 180, 0.2);
      padding: 8px 10px;
      border-radius: 10px;
      font-size: 11px;
      display: grid;
      gap: 4px;
    }

    .filter-label {
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-size: 9px;
      opacity: 0.6;
    }

    .filter-value {
      color: #f2f6ff;
    }

    .main-panel {
      position: relative;
      background: rgba(6, 10, 16, 0.85);
      border: 1px solid rgba(120, 150, 180, 0.3);
      border-radius: 12px;
      padding: 12px;
      overflow: hidden;
    }

    .map-view {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 10px;
      background:
        linear-gradient(120deg, rgba(80, 120, 180, 0.08), transparent 50%),
        repeating-linear-gradient(90deg, rgba(90, 120, 150, 0.12) 0 1px, transparent 1px 24px),
        repeating-linear-gradient(0deg, rgba(90, 120, 150, 0.12) 0 1px, transparent 1px 24px);
    }

    .map-links {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .map-links line {
      stroke: rgba(120, 220, 255, 0.4);
      stroke-width: 0.6;
    }

    .node {
      position: absolute;
      transform: translate(-50%, -50%);
      width: 96px;
      height: 52px;
      border-radius: 12px;
      border: 1px solid rgba(120, 150, 180, 0.4);
      background: rgba(10, 16, 26, 0.9);
      color: inherit;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 10px;
      cursor: pointer;
    }

    .node.selected {
      border-color: rgba(150, 230, 255, 0.8);
      box-shadow: 0 0 12px rgba(120, 220, 255, 0.35);
    }

    .node-name {
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .node-class {
      opacity: 0.7;
    }

    .node-view {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      height: 100%;
    }

    .node-list,
    .market-table,
    .list-view {
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: auto;
      padding-right: 4px;
    }

    .node-list .list-row {
      grid-template-columns: 1fr 1fr;
    }

    .node-placeholder {
      border: 1px dashed rgba(120, 150, 180, 0.3);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
      background: rgba(8, 12, 20, 0.5);
      text-align: center;
    }

    .placeholder-title {
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 11px;
    }

    .placeholder-text {
      font-size: 11px;
      opacity: 0.7;
    }

    .market-row,
    .list-row {
      display: grid;
      grid-template-columns: 1.4fr 1fr 0.8fr 0.8fr 0.8fr;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid rgba(120, 150, 180, 0.2);
      background: rgba(12, 18, 28, 0.75);
      color: inherit;
      font-size: 11px;
      text-align: left;
      cursor: pointer;
    }

    .market-row.header {
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-size: 9px;
      opacity: 0.7;
      cursor: default;
    }

    .market-row.selected,
    .list-row.selected {
      border-color: rgba(150, 230, 255, 0.6);
      background: rgba(80, 140, 190, 0.2);
    }

    .list-view .list-row {
      grid-template-columns: 1fr 1fr;
    }

    .list-view .fleet-row {
      grid-template-columns: 1.1fr 0.9fr 0.7fr;
      align-items: center;
    }

    .cargo-chip {
      justify-self: end;
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid rgba(120, 150, 180, 0.3);
      background: rgba(10, 16, 26, 0.8);
      font-size: 9px;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: #f2f6ff;
    }

    .list-title {
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      opacity: 0.7;
    }

    .market-actions {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    .log-category {
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid rgba(120, 150, 180, 0.2);
      background: rgba(12, 18, 28, 0.75);
      font-size: 11px;
    }

    .log-note {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 8px;
    }

    .event-filters {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      font-size: 10px;
    }

    .event-filters label {
      display: grid;
      gap: 4px;
    }

    .event-filters span {
      text-transform: uppercase;
      letter-spacing: 0.6px;
      opacity: 0.6;
      font-size: 9px;
    }

    .event-filters input,
    .event-filters select {
      background: rgba(12, 18, 28, 0.75);
      border: 1px solid rgba(120, 150, 180, 0.25);
      color: inherit;
      border-radius: 8px;
      padding: 4px 6px;
      font-size: 10px;
    }

    .event-list {
      display: grid;
      gap: 8px;
      margin-top: 8px;
      overflow: auto;
      padding-right: 4px;
      max-height: 260px;
    }

    .event-payload {
      background: rgba(10, 14, 22, 0.75);
      border: 1px solid rgba(120, 150, 180, 0.2);
      border-radius: 8px;
      padding: 8px;
      font-size: 10px;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
    }

    .right-panel {
      gap: 12px;
    }

    .inspector-block {
      display: grid;
      gap: 6px;
      font-size: 11px;
    }

    .inspector-title {
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-size: 9px;
      opacity: 0.7;
    }

    .inspector-line {
      opacity: 0.85;
    }

    .inspector-note {
      margin-top: 4px;
      font-size: 10px;
      opacity: 0.7;
    }

    .inspector-actions {
      display: grid;
      gap: 6px;
      margin-top: 6px;
    }

    .inspector-actions .action-button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .inspector-hint {
      font-size: 10px;
      opacity: 0.65;
    }

    .bottom-log {
      border: 1px solid rgba(120, 150, 180, 0.3);
      border-radius: 12px;
      padding: 8px 12px;
      background: rgba(8, 12, 20, 0.75);
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-height: 60px;
    }

    .bottom-log .log-entries {
      display: grid;
      gap: 4px;
      font-family: "Space Mono", "JetBrains Mono", "IBM Plex Mono", Consolas, monospace;
      font-size: 10px;
      max-height: 60px;
      overflow: hidden;
      opacity: 0.85;
    }

    .bottom-log.expanded .log-entries {
      max-height: 160px;
    }

    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .log-toggle {
      border: 1px solid rgba(120, 150, 180, 0.3);
      background: rgba(10, 16, 26, 0.8);
      color: inherit;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 10px;
      letter-spacing: 0.6px;
      cursor: pointer;
    }

    @media (max-width: 900px) {
      .top-bar {
        grid-template-columns: 1fr;
      }

      .top-right {
        align-items: flex-start;
      }

      .rift-body,
      .rift-body.no-left-panel {
        grid-template-columns: 1fr;
      }
    }
    `
  ]
})
export class QuantumRiftGameComponent {
  readonly screens = SCREEN_DEFINITIONS;
  readonly nodes = QUANTUM_NODES;
  readonly nodeLinks = NODE_LINKS;
  readonly commodities = COMMODITIES;
  readonly governanceSeats = GOVERNANCE_SEATS;
  readonly techTrees = TECH_TREES;
  readonly logCategories = LOG_CATEGORIES;


  selection: SelectionState = {
    nodeId: QUANTUM_NODES[0]?.id ?? '',
    commodityId: COMMODITIES[0]?.id ?? '',
    fleetId: 'fleet-01',
    observerId: 'observer-01',
    seatId: GOVERNANCE_SEATS[0]?.id ?? '',
    techTree: TECH_TREES[0] ?? ''
  };

  eventTypeFilter = 'All';
  eventTickMin: number | null = null;
  eventTickMax: number | null = null;
  eventNodeFilter = '';
  eventFleetFilter = '';
  eventCommodityFilter = '';
  selectedEventId: string | null = null;

  alertState = 'None';
  private readonly defaultMarketNodeId = 'node-core-helix';

  constructor(private readonly simulation: QuantumRiftStateService) {}

  get state(): Readonly<SimulationState> {
    return this.simulation.state;
  }

  get screenId(): ScreenId {
    return this.state.ui.activeScreen;
  }

  get activeScreen(): ScreenDefinition | undefined {
    return this.screens.find((screen) => screen.id === this.screenId);
  }

  get selectedNode(): QuantumNode | undefined {
    return this.nodes.find((node) => node.id === this.selection.nodeId);
  }

  get selectedNodeState(): SimulationState['nodes'][string] | undefined {
    return this.state.nodes[this.selection.nodeId];
  }

  get selectedGovernanceSeats(): string {
    const seats = this.selectedNodeState?.governanceSeats ?? [];
    return seats.length ? seats.join(', ') : '--';
  }

  get selectedCommodity(): Commodity | undefined {
    return this.commodities.find((commodity) => commodity.id === this.selection.commodityId);
  }

  get selectedCommodityPrice(): number | string {
    return this.getCommodityPrice(this.selection.commodityId);
  }

  get selectedCommodityVolatility(): number | string {
    return this.getCommodityVolatility(this.selection.commodityId);
  }

  get marketNodeId(): string {
    if (this.state.markets[this.selection.nodeId]) {
      return this.selection.nodeId;
    }
    return this.defaultMarketNodeId;
  }

  get marketState(): SimulationState['markets'][string] | undefined {
    return this.state.markets[this.marketNodeId];
  }

  get selectedFleet(): SimulationState['fleets'][string] | undefined {
    return this.state.fleets[this.selection.fleetId];
  }

  get selectedFleetRoute(): string {
    const fleet = this.selectedFleet;
    if (!fleet) {
      return '--';
    }
    const from = this.getNodeLabel(fleet.nodeFrom);
    const to = this.getNodeLabel(fleet.nodeTo);
    return `${from} -> ${to}`;
  }

  get selectedObserver(): SimulationState['observers'][string] | undefined {
    return this.state.observers[this.selection.observerId];
  }

  get selectedTech(): SimulationState['tech'][string] | undefined {
    return this.state.tech[this.selection.techTree];
  }

  get selectedGovernance(): SimulationState['governance'][string] | undefined {
    return this.state.governance[this.selection.seatId];
  }

  get eventTypes(): string[] {
    const types = new Set<string>();
    for (const entry of this.state.events) {
      types.add(entry.type);
    }
    return ['All', ...Array.from(types).sort()];
  }

  get filteredEvents(): SimulationState['events'] {
    const typeFilter = this.eventTypeFilter.trim();
    const nodeFilter = this.eventNodeFilter.trim().toLowerCase();
    const fleetFilter = this.eventFleetFilter.trim().toLowerCase();
    const commodityFilter = this.eventCommodityFilter.trim().toLowerCase();
    const minTick = this.normalizeTick(this.eventTickMin);
    const maxTick = this.normalizeTick(this.eventTickMax);

    return this.state.events.filter((entry) => {
      if (typeFilter && typeFilter !== 'All' && entry.type !== typeFilter) {
        return false;
      }
      if (minTick !== null && entry.tick < minTick) {
        return false;
      }
      if (maxTick !== null && entry.tick > maxTick) {
        return false;
      }
      if (nodeFilter) {
        const nodeMatch = [
          entry.refs?.nodeId,
          entry.refs?.originNodeId,
          entry.refs?.destinationNodeId
        ]
          .filter(Boolean)
          .some((ref) => ref?.toLowerCase().includes(nodeFilter));
        if (!nodeMatch) {
          return false;
        }
      }
      if (fleetFilter) {
        if (!entry.refs?.fleetId?.toLowerCase().includes(fleetFilter)) {
          return false;
        }
      }
      if (commodityFilter) {
        if (!entry.refs?.commodityId?.toLowerCase().includes(commodityFilter)) {
          return false;
        }
      }
      return true;
    });
  }

  get selectedEvent(): SimulationState['events'][number] | undefined {
    if (!this.selectedEventId) {
      return undefined;
    }
    return this.state.events.find((entry) => entry.id === this.selectedEventId);
  }

  setScreen(id: ScreenId): void {
    this.simulation.dispatch({ type: 'SCREEN_CHANGED', screen: id });
  }

  setTimeMode(mode: 'pause' | 'normal' | 'fast'): void {
    if (mode === 'pause') {
      this.simulation.dispatch({ type: 'TIME_MODE_SET_PAUSE' });
    } else if (mode === 'fast') {
      this.simulation.dispatch({ type: 'TIME_MODE_SET_FAST' });
    } else {
      this.simulation.dispatch({ type: 'TIME_MODE_SET_NORMAL' });
    }
  }

  toggleLogs(): void {
    this.simulation.dispatch({
      type: 'LOG_PANEL_TOGGLED',
      expanded: !this.state.ui.logsExpanded
    });
  }

  advanceStep(): void {
    this.simulation.dispatch({ type: 'ENGINE_STEP_TRIGGERED' });
  }

  selectNode(id: string): void {
    this.selection.nodeId = id;
  }

  selectCommodity(id: string): void {
    this.selection.commodityId = id;
  }

  selectFleet(id: string): void {
    this.selection.fleetId = id;
  }

  selectObserver(id: string): void {
    this.selection.observerId = id;
  }

  selectSeat(id: string): void {
    this.selection.seatId = id;
  }

  selectTech(tree: string): void {
    this.selection.techTree = tree;
    this.simulation.dispatch({ type: 'TECH_RESEARCH_SELECTED', techId: tree });
  }

  selectEvent(eventId: string): void {
    this.selectedEventId = eventId;
  }

  getNode(id: string): QuantumNode | undefined {
    return this.nodes.find((node) => node.id === id);
  }

  getNodeLabel(id: string): string {
    return this.getNode(id)?.label || id;
  }

  getFleetStatusLabel(fleetId: string): string {
    const fleet = this.state.fleets[fleetId];
    if (!fleet) {
      return '--';
    }
    if (fleet.status === 'in_transit' && fleet.eta !== null) {
      return `${fleet.status} (${fleet.eta})`;
    }
    return fleet.status;
  }

  getFleetCargoLabel(fleetId: string): string {
    const fleet = this.state.fleets[fleetId];
    if (!fleet || !fleet.cargo?.commodityId || fleet.cargo.quantity <= 0 || fleet.status === 'idle') {
      return 'NO CARGO';
    }
    return `${this.getCommodityShortCode(fleet.cargo.commodityId)} x${fleet.cargo.quantity}`;
  }

  getCommodityShortCode(id: string): string {
    const [prefix] = id.split('_');
    return prefix || id;
  }

  getCommodityPrice(id: string): number | string {
    const price = this.marketState?.prices[id];
    return price ?? '--';
  }

  getCommodityVolatility(id: string): number | string {
    const volatility = this.marketState?.volatility[id];
    return volatility ?? '--';
  }

  getCommodityName(id?: string | null): string {
    if (!id) {
      return '--';
    }
    return this.commodities.find((commodity) => commodity.id === id)?.name ?? id;
  }

  getCargoDetail(cargo: { commodityId: string; quantity: number } | null | undefined): string {
    if (!cargo || cargo.quantity <= 0) {
      return 'NO CARGO';
    }
    return `${this.getCommodityName(cargo.commodityId)} x${cargo.quantity}`;
  }

  formatEventPayload(payload: Record<string, unknown>): string {
    try {
      return JSON.stringify(payload, null, 2);
    } catch {
      return String(payload);
    }
  }

  formatEntropy(value?: number | null): string {
    if (value === null || value === undefined) {
      return '--';
    }
    return value.toFixed(3);
  }

  formatMitigation(
    mitigation?: { vessel: number; observer: number; total: number } | null
  ): string {
    if (!mitigation) {
      return '--';
    }
    return `V${mitigation.vessel.toFixed(2)} O${mitigation.observer.toFixed(2)} T${mitigation.total.toFixed(2)}`;
  }

  formatPercent(value?: number | null): string {
    if (value === null || value === undefined) {
      return '--';
    }
    return `${(value * 100).toFixed(0)}%`;
  }

  applyCargoReversal(): void {
    const fleet = this.selectedFleet;
    const nodeId = this.getFleetLocationNodeId(fleet);
    if (!fleet || !nodeId) {
      return;
    }
    this.simulation.dispatch({
      type: 'REVERSAL_APPLIED_CARGO',
      targetType: 'cargo',
      targetId: this.selection.fleetId,
      nodeId,
      structureType: REVERSAL_STRUCTURES.cargo
    });
  }

  applyFleetReversal(): void {
    const fleet = this.selectedFleet;
    const nodeId = this.getFleetLocationNodeId(fleet);
    if (!fleet || !nodeId) {
      return;
    }
    this.simulation.dispatch({
      type: 'REVERSAL_APPLIED_FLEET',
      targetType: 'fleet',
      targetId: this.selection.fleetId,
      nodeId,
      structureType: REVERSAL_STRUCTURES.fleet
    });
  }

  applyObserverReversal(): void {
    const observer = this.selectedObserver;
    const nodeId = this.getObserverLocationNodeId(observer);
    if (!observer || !nodeId) {
      return;
    }
    this.simulation.dispatch({
      type: 'REVERSAL_APPLIED_OBSERVER',
      targetType: 'observer',
      targetId: this.selection.observerId,
      nodeId,
      structureType: REVERSAL_STRUCTURES.observer
    });
  }

  canReverseCargo(): { allowed: boolean; reason?: string } {
    const fleet = this.selectedFleet;
    const nodeId = this.getFleetLocationNodeId(fleet);
    if (!fleet || !nodeId) {
      return { allowed: false, reason: 'No fleet at node.' };
    }
    if (!this.hasStructure(nodeId, REVERSAL_STRUCTURES.cargo)) {
      return { allowed: false, reason: 'Missing cargo stabilization facility.' };
    }
    const entropy = this.getEntropyFromDelta(
      fleet.entropyConsequences?.cargoEfficiencyDelta,
      CARGO_ENTROPY_FACTOR
    );
    if (entropy <= 0) {
      return { allowed: false, reason: 'No cargo entropy to reverse.' };
    }
    const cost = this.getReversalCost(entropy);
    if (this.state.credits < cost) {
      return { allowed: false, reason: 'Insufficient credits.' };
    }
    return { allowed: true };
  }

  canReverseFleet(): { allowed: boolean; reason?: string } {
    const fleet = this.selectedFleet;
    const nodeId = this.getFleetLocationNodeId(fleet);
    if (!fleet || !nodeId) {
      return { allowed: false, reason: 'No fleet at node.' };
    }
    if (!this.hasStructure(nodeId, REVERSAL_STRUCTURES.fleet)) {
      return { allowed: false, reason: 'Missing fleet recalibration facility.' };
    }
    const entropy = this.getEntropyFromDelta(
      fleet.entropyConsequences?.fleetEfficiencyDelta,
      FLEET_ENTROPY_FACTOR
    );
    if (entropy <= 0) {
      return { allowed: false, reason: 'No fleet entropy to reverse.' };
    }
    const cost = this.getReversalCost(entropy);
    if (this.state.credits < cost) {
      return { allowed: false, reason: 'Insufficient credits.' };
    }
    return { allowed: true };
  }

  canReverseObserver(): { allowed: boolean; reason?: string } {
    const observer = this.selectedObserver;
    const nodeId = this.getObserverLocationNodeId(observer);
    if (!observer || !nodeId) {
      return { allowed: false, reason: 'No observer at node.' };
    }
    if (!this.hasStructure(nodeId, REVERSAL_STRUCTURES.observer)) {
      return { allowed: false, reason: 'Missing observer reconditioning facility.' };
    }
    const entropy = this.getEntropyFromDelta(
      observer.entropyModifierDelta,
      OBSERVER_ENTROPY_FACTOR
    );
    if (entropy <= 0) {
      return { allowed: false, reason: 'No observer entropy to reverse.' };
    }
    const cost = this.getReversalCost(entropy);
    if (this.state.credits < cost) {
      return { allowed: false, reason: 'Insufficient credits.' };
    }
    return { allowed: true };
  }

  private getFleetLocationNodeId(fleet?: SimulationState['fleets'][string]): string | null {
    if (!fleet) {
      return null;
    }
    return fleet.nodeFrom || null;
  }

  private getObserverLocationNodeId(observer?: SimulationState['observers'][string]): string | null {
    if (!observer) {
      return null;
    }
    const assignment = observer.assignment;
    if (this.state.nodes[assignment]) {
      return assignment;
    }
    const fleet = this.state.fleets[assignment];
    return fleet?.nodeFrom ?? null;
  }

  private hasStructure(nodeId: string, structureType: string): boolean {
    const node = this.state.nodes[nodeId];
    if (!node) {
      return false;
    }
    return node.structures.some((structure) => structure.type === structureType);
  }

  private getEntropyFromDelta(delta: number | undefined, factor: number): number {
    if (!delta || factor <= 0) {
      return 0;
    }
    const magnitude = Math.min(Math.abs(delta) / factor, 1);
    return magnitude * magnitude;
  }

  private getReversalCost(entropy: number): number {
    const baseCost = this.state.entropyReversalConfig.baseCost;
    return baseCost * (1 + entropy);
  }

  private normalizeTick(value: number | null): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    if (Number.isNaN(value)) {
      return null;
    }
    return value;
  }

  getVesselCapacity(vesselClass: string): number {
    return VESSEL_CAPACITY[vesselClass] ?? 0;
  }

  handleAction(action: { label: string; event?: string; screen?: ScreenId }): void {
    if (action.screen) {
      this.setScreen(action.screen);
      return;
    }
    if (!action.event) {
      return;
    }
    if (action.event === 'ROUTE_ESTABLISHED') {
      this.simulation.dispatch({
        type: 'ROUTE_ESTABLISHED',
        fromNode: this.selection.nodeId,
        toNode: this.selection.nodeId
      });
      return;
    }
    if (action.event === 'FLEET_DISPATCHED') {
      const vesselClass = 'CONTAINMENT_FRIGATE';
      this.simulation.dispatch({
        type: 'FLEET_DISPATCHED',
        vesselClass,
        fromNode: this.selection.nodeId,
        toNode: this.selection.nodeId,
        commodityId: this.selection.commodityId,
        quantity: this.getVesselCapacity(vesselClass)
      });
      return;
    }
    if (action.event === 'STRUCTURE_BUILT') {
      this.simulation.dispatch({
        type: 'STRUCTURE_BUILT',
        nodeId: this.selection.nodeId,
        structureType: 'Structure'
      });
      return;
    }
    if (action.event === 'OBSERVER_ASSIGNED') {
      this.simulation.dispatch({
        type: 'OBSERVER_ASSIGNED',
        observerId: this.selection.observerId,
        assignment: this.selection.nodeId
      });
      return;
    }
    if (action.event === 'NODE_POLICIES_OPENED') {
      this.simulation.dispatch({ type: 'NODE_POLICIES_OPENED' });
    }
  }

  placeMarketOrder(type: 'buy' | 'sell'): void {
    this.simulation.dispatch({
      type: type === 'buy' ? 'MARKET_BUY_ORDER_PLACED' : 'MARKET_SELL_ORDER_PLACED',
      nodeId: this.marketNodeId,
      commodityId: this.selection.commodityId
    });
  }

  changeFleetRoute(): void {
    this.simulation.dispatch({
      type: 'FLEET_ROUTE_CHANGED',
      fleetId: this.selection.fleetId,
      toNode: this.selection.nodeId
    });
  }

  investInCampaign(): void {
    this.simulation.dispatch({
      type: 'GOVERNANCE_CAMPAIGN_INVESTED',
      seatId: this.selection.seatId,
      playerId: 'player'
    });
  }
}

