import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

type ViewMode = 'world' | 'room';
type NodeStatus = 'stable' | 'alert' | 'idle';
type InteractionMode = 'build' | 'route' | 'inspect';

interface DemoNode {
  id: string;
  label: string;
  kind: string;
  x: number;
  y: number;
  status: NodeStatus;
  tile?: { col: number; row: number };
}

interface DemoLink {
  from: string;
  to: string;
  type: 'flow' | 'policy';
}

interface BuildCategory {
  name: string;
  items: string[];
}

interface InspectorSample {
  inputs: string;
  outputs: string;
  throughput: string;
  policies?: string;
  constraints?: string;
}

@Component({
  selector: 'factory-universe-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="factory-demo" [class.wireframe]="wireframeMode">
      <header class="demo-topbar">
        <div class="topbar-left">
          <div class="label">Factory Universe</div>
          <div class="subtitle">Universe: {{ universeName }}</div>
          <div class="subtitle">Instance: {{ universeInstance }}</div>
          <div class="toggle-group">
            <button type="button" [class.active]="viewMode === 'world'" (click)="setView('world')">
              World
            </button>
            <button type="button" [class.active]="viewMode === 'room'" (click)="setView('room')">
              Room
            </button>
          </div>
        </div>
        <div class="topbar-center">
          <div class="topbar-section">
            <div class="section-label">Time Controls</div>
            <div class="toggle-group">
              <button type="button" [class.active]="!isPaused" (click)="setPaused(false)">
                Run
              </button>
              <button type="button" [class.active]="isPaused" (click)="setPaused(true)">
                Pause
              </button>
            </div>
          </div>
          <div class="topbar-section">
            <div class="section-label">Overlays</div>
            <div class="toggle-group">
              <button type="button" [class.active]="overlays.flow" (click)="toggleOverlay('flow')">
                Flow
              </button>
              <button type="button" [class.active]="overlays.stability" (click)="toggleOverlay('stability')">
                Stability
              </button>
              <button type="button" [class.active]="overlays.bottlenecks" (click)="toggleOverlay('bottlenecks')">
                Bottlenecks
              </button>
            </div>
          </div>
        </div>
        <div class="topbar-right">
          <div class="topbar-chip">
            <span class="chip-label">Resource Overview</span>
            <span class="chip-value">{{ resourceOverview }}</span>
          </div>
          <div class="topbar-chip">
            <span class="chip-label">Score</span>
            <span class="chip-value">{{ score | number:'1.0-0' }}</span>
          </div>
          <div class="topbar-chip" [class.alert]="alertCount > 0">
            <span class="chip-label">Global Alerts</span>
            <span class="chip-value">{{ alertCount }}</span>
          </div>
          <div class="topbar-chip">
            <span class="chip-label">Overlays</span>
            <span class="chip-value">{{ overlaySummary }}</span>
          </div>
          <button type="button" class="wireframe-toggle" [class.active]="wireframeMode" (click)="toggleWireframe()">
            Wireframe
          </button>
        </div>
      </header>

      <div class="demo-layout">
        <aside class="left-panel">
          <div class="panel-title">Build Menu</div>
          <div class="panel-section">
            <div class="section-label">Mode Indicator</div>
            <div class="toggle-group">
              <button type="button" [class.active]="interactionMode === 'build'" (click)="setMode('build')">
                Build
              </button>
              <button type="button" [class.active]="interactionMode === 'route'" (click)="setMode('route')">
                Route
              </button>
              <button type="button" [class.active]="interactionMode === 'inspect'" (click)="setMode('inspect')">
                Inspect
              </button>
            </div>
          </div>
          <div class="panel-section">
            <label class="section-label" for="build-filter">Filter/search</label>
            <input
              id="build-filter"
              class="panel-input"
              type="text"
              [value]="filterQuery"
              placeholder="Filter/search"
              (input)="updateFilter($any($event.target).value)" />
          </div>
          <div class="panel-section">
            <div class="section-label">Build Categories</div>
            <div class="category-block" *ngFor="let category of filteredBuildCategories">
              <div class="category-title">{{ category.name }}</div>
              <div class="category-items">
                <span *ngFor="let item of category.items" class="category-item">{{ item }}</span>
              </div>
            </div>
          </div>
        </aside>

        <section class="demo-viewport">
          <canvas #gridCanvas class="grid-canvas"></canvas>
          <svg class="link-layer" [class.flow-off]="!overlays.flow" viewBox="0 0 100 100" preserveAspectRatio="none">
            <ng-container *ngFor="let link of activeLinks">
              <line
                [attr.x1]="getNode(link.from)?.x"
                [attr.y1]="getNode(link.from)?.y"
                [attr.x2]="getNode(link.to)?.x"
                [attr.y2]="getNode(link.to)?.y"
                [attr.class]="link.type">
              </line>
            </ng-container>
          </svg>
          <div class="node-layer">
            <button
              type="button"
              class="node"
              *ngFor="let node of activeNodes"
              [class.selected]="node.id === selectedNodeId"
              [class.alert]="node.status === 'alert'"
              [class.idle]="node.status === 'idle'"
              [style.left.%]="node.x"
              [style.top.%]="node.y"
              [style.--sprite-x.px]="getTileX(node)"
              [style.--sprite-y.px]="getTileY(node)"
              [attr.title]="node.label + ' / ' + node.kind + ' / ' + node.status"
              (click)="selectNode(node)">
              <span class="node-label">{{ node.label }}</span>
              <span class="node-kind">{{ node.kind }}</span>
            </button>
          </div>
        </section>

        <aside class="demo-panel">
          <div class="panel-title">System Inspector</div>
          <div class="panel-block">
            <div class="panel-title">Diagnostics</div>
            <div class="panel-metric">
              <span>Throughput</span>
              <strong>{{ throughput | number:'1.1-1' }}x</strong>
            </div>
            <div class="panel-metric">
              <span>Efficiency</span>
              <strong>{{ efficiency | percent:'1.0-0' }}</strong>
            </div>
            <div class="panel-metric">
              <span>Stability</span>
              <strong>{{ stability | percent:'1.0-0' }}</strong>
            </div>
            <div class="panel-metric">
              <span>Entropy</span>
              <strong>{{ entropy | percent:'1.0-0' }}</strong>
            </div>
          </div>

          <div class="panel-block">
            <div class="panel-title">Selection</div>
            <div class="panel-selection">
              <div class="selection-name">{{ selectedNode?.label || 'None' }}</div>
              <div class="selection-kind">{{ selectedNode?.kind || 'Idle sector' }}</div>
              <div class="selection-status">
                Status: {{ selectedNode?.status || 'idle' }}
              </div>
              <div class="selection-detail">
                Inputs: {{ selectedInspector?.inputs || '--' }}
              </div>
              <div class="selection-detail">
                Outputs: {{ selectedInspector?.outputs || '--' }}
              </div>
              <div class="selection-detail">
                Throughput: {{ selectedInspector?.throughput || '--' }}
              </div>
              <div class="selection-detail" *ngIf="selectedInspector?.policies">
                Policies: {{ selectedInspector?.policies }}
              </div>
              <div class="selection-detail" *ngIf="selectedInspector?.constraints">
                Constraints: {{ selectedInspector?.constraints }}
              </div>
            </div>
          </div>

          <div class="panel-block">
            <div class="panel-title">Alerts</div>
            <div class="panel-alerts">
              <div *ngIf="alertNodes.length === 0" class="panel-muted">No active alerts.</div>
              <div *ngFor="let node of alertNodes" class="alert-line">
                {{ node.label }} - {{ getAlertDetail(node.id) }}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section class="bottom-strip" [class.expanded]="logsExpanded">
        <div class="strip-header">
          <div class="panel-title">Logs / Messages</div>
          <button type="button" class="strip-toggle" (click)="toggleLogs()">
            {{ logsExpanded ? 'Collapse' : 'Expand' }}
          </button>
        </div>
        <div class="panel-logs">
          <div *ngFor="let log of logLines" class="log-line">{{ log }}</div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      font-family: 'IBM Plex Sans', 'Inter', 'Segoe UI', sans-serif;
      --sokoban-sheet: url('/kenney_sokoban-pack/Vector/sokoban_vector.svg');
      --tile-size: 64px;
      --panel-bg: rgba(10, 14, 20, 0.92);
      --panel-border: rgba(110, 140, 170, 0.35);
      --panel-text: #d5dde7;
      --panel-muted: rgba(213, 221, 231, 0.6);
      --accent-cyan: rgba(86, 214, 214, 0.9);
      --accent-violet: rgba(134, 96, 210, 0.8);
      --accent-magenta: rgba(190, 88, 164, 0.8);
      --glow-cyan: rgba(86, 214, 214, 0.25);
      --glow-magenta: rgba(190, 88, 164, 0.2);
    }

    .factory-demo {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      box-sizing: border-box;
      background:
        linear-gradient(180deg, rgba(9, 12, 18, 0.95), rgba(7, 10, 16, 0.98)),
        radial-gradient(circle at 8% 15%, rgba(86, 214, 214, 0.16), transparent 45%),
        radial-gradient(circle at 90% 12%, rgba(134, 96, 210, 0.12), transparent 50%);
      border-radius: 16px;
      color: var(--panel-text);
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.05),
        0 12px 24px rgba(0, 0, 0, 0.45);
    }

    .factory-demo::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 16px;
      border: 1px solid rgba(130, 150, 170, 0.35);
      pointer-events: none;
      box-shadow:
        inset 0 0 12px rgba(0, 0, 0, 0.5),
        inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    .factory-demo::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background:
        linear-gradient(140deg, rgba(86, 214, 214, 0.2), transparent 35%),
        linear-gradient(310deg, rgba(190, 88, 164, 0.18), transparent 40%);
      mix-blend-mode: screen;
      opacity: 0.65;
      pointer-events: none;
    }

    .demo-topbar {
      display: grid;
      grid-template-columns: 1fr minmax(0, 1.2fr) 1fr;
      gap: 12px;
      align-items: center;
    }

    .topbar-left,
    .topbar-center,
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .topbar-left {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .topbar-left .label {
      font-size: 18px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .topbar-left .subtitle {
      font-size: 11px;
      letter-spacing: 0.8px;
      opacity: 0.7;
    }

    .topbar-center {
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .topbar-right {
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .topbar-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .section-label {
      font-size: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
      opacity: 0.65;
    }

    .topbar-chip {
      padding: 6px 10px;
      border-radius: 10px;
      background: rgba(12, 16, 24, 0.9);
      border: 1px solid var(--panel-border);
      font-size: 11px;
      letter-spacing: 0.6px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 120px;
    }

    .topbar-chip.alert {
      border-color: rgba(220, 120, 120, 0.55);
      color: rgba(255, 210, 210, 0.95);
    }

    .chip-label {
      opacity: 0.7;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.8px;
    }

    .chip-value {
      font-size: 11px;
    }

    .wireframe-toggle {
      border-radius: 999px;
      border: 1px solid rgba(140, 160, 180, 0.3);
      background: rgba(12, 16, 24, 0.9);
      color: inherit;
      padding: 6px 12px;
      font-size: 11px;
      letter-spacing: 0.8px;
      cursor: pointer;
    }

    .wireframe-toggle.active {
      border-color: var(--accent-cyan);
      background: rgba(86, 214, 214, 0.16);
    }

    .toggle-group {
      display: inline-flex;
      gap: 6px;
      background: rgba(12, 16, 24, 0.9);
      padding: 4px;
      border-radius: 999px;
      border: 1px solid rgba(140, 160, 180, 0.2);
    }

    .toggle-group button {
      border: none;
      background: transparent;
      color: inherit;
      font-size: 11px;
      letter-spacing: 0.8px;
      padding: 6px 12px;
      border-radius: 999px;
      cursor: pointer;
    }

    .toggle-group button.active {
      background: rgba(86, 214, 214, 0.15);
      border: 1px solid rgba(86, 214, 214, 0.35);
    }

    .demo-layout {
      flex: 1;
      display: grid;
      grid-template-columns: 220px minmax(0, 1fr) 280px;
      gap: 12px;
      min-height: 0;
    }

    .demo-viewport {
      position: relative;
      border-radius: 14px;
      overflow: hidden;
      background: rgba(8, 12, 18, 0.9);
      border: 1px solid rgba(120, 140, 160, 0.35);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
    }

    .grid-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .link-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .link-layer line {
      stroke-width: 0.6;
      opacity: 0.6;
      stroke: rgba(86, 214, 214, 0.7);
    }

    .link-layer line.policy {
      stroke-dasharray: 2 2;
      stroke: rgba(190, 120, 200, 0.7);
    }

    .link-layer.flow-off {
      opacity: 0.2;
    }

    .node-layer {
      position: absolute;
      inset: 0;
    }

    .node {
      position: absolute;
      transform: translate(-50%, -50%);
      width: 84px;
      height: 50px;
      border-radius: 10px;
      border: 1px solid rgba(120, 150, 170, 0.4);
      background: rgba(12, 16, 24, 0.9);
      color: #d9e4ef;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
      text-align: center;
      cursor: pointer;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
      overflow: hidden;
    }

    .node::before {
      content: '';
      position: absolute;
      inset: 6px auto auto 6px;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      background-image: var(--sokoban-sheet);
      background-size: calc(var(--tile-size) * 13) calc(var(--tile-size) * 8);
      background-position: var(--sprite-x) var(--sprite-y);
      image-rendering: pixelated;
      opacity: 0.85;
    }

    .node.selected {
      border-color: rgba(220, 235, 245, 0.9);
      box-shadow: 0 0 0 2px rgba(86, 214, 214, 0.4);
    }

    .node.alert {
      border-color: rgba(210, 120, 120, 0.7);
      color: rgba(255, 210, 210, 0.95);
    }

    .node.idle {
      opacity: 0.7;
    }

    .node-label {
      font-size: 10px;
      letter-spacing: 0.6px;
      text-transform: uppercase;
    }

    .node-kind {
      font-size: 9px;
      opacity: 0.75;
    }

    .left-panel,
    .demo-panel {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 0;
    }

    .left-panel {
      background: var(--panel-bg);
      border-radius: 12px;
      padding: 12px;
      border: 1px solid var(--panel-border);
    }

    .panel-block {
      background: var(--panel-bg);
      border-radius: 12px;
      padding: 10px 12px;
      border: 1px solid var(--panel-border);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .panel-title {
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      opacity: 0.8;
    }

    .panel-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .panel-input {
      background: rgba(12, 16, 24, 0.9);
      border: 1px solid var(--panel-border);
      border-radius: 8px;
      color: inherit;
      font-size: 11px;
      padding: 6px 8px;
    }

    .panel-tags {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .tag-button {
      border-radius: 8px;
      border: 1px solid rgba(140, 160, 180, 0.25);
      background: rgba(12, 16, 24, 0.9);
      color: inherit;
      padding: 6px 8px;
      font-size: 11px;
      letter-spacing: 0.4px;
      text-align: left;
      cursor: pointer;
    }

    .category-block {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 6px 0;
      border-top: 1px solid rgba(140, 160, 180, 0.2);
    }

    .category-block:first-of-type {
      border-top: none;
      padding-top: 0;
    }

    .category-title {
      font-size: 10px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      opacity: 0.8;
    }

    .category-items {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .category-item {
      font-size: 10px;
      padding: 3px 6px;
      border-radius: 999px;
      border: 1px solid rgba(140, 160, 180, 0.25);
      background: rgba(12, 16, 24, 0.9);
      letter-spacing: 0.4px;
    }

    .panel-metric {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
    }

    .panel-selection {
      font-size: 11px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .selection-detail {
      opacity: 0.7;
    }

    .panel-alerts {
      font-size: 10px;
      display: grid;
      gap: 4px;
    }

    .panel-muted {
      opacity: 0.6;
    }

    .alert-line {
      color: rgba(255, 210, 210, 0.95);
    }

    .selection-name {
      font-size: 12px;
      letter-spacing: 0.5px;
    }

    .selection-status {
      opacity: 0.6;
    }

    .panel-logs {
      font-family: 'Space Mono', 'JetBrains Mono', 'IBM Plex Mono', Consolas, monospace;
      font-size: 10px;
      display: grid;
      gap: 4px;
      max-height: 120px;
      overflow: hidden;
      opacity: 0.85;
    }

    .bottom-strip {
      background: var(--panel-bg);
      border-radius: 12px;
      padding: 8px 12px;
      border: 1px solid var(--panel-border);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 0;
    }

    .bottom-strip.expanded .panel-logs {
      max-height: 220px;
    }

    .strip-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .strip-toggle {
      border-radius: 999px;
      border: 1px solid rgba(140, 160, 180, 0.3);
      background: rgba(12, 16, 24, 0.9);
      color: inherit;
      padding: 4px 10px;
      font-size: 10px;
      letter-spacing: 0.6px;
      cursor: pointer;
    }

    .log-line {
      color: #9bd8ff;
    }

    .factory-demo.wireframe {
      background: rgba(6, 10, 16, 0.98);
      box-shadow: inset 0 0 0 1px rgba(140, 180, 210, 0.35);
    }

    .factory-demo.wireframe .demo-viewport,
    .factory-demo.wireframe .left-panel,
    .factory-demo.wireframe .demo-panel,
    .factory-demo.wireframe .bottom-strip,
    .factory-demo.wireframe .panel-block {
      background: rgba(8, 12, 20, 0.6);
      border: 1px dashed rgba(140, 180, 210, 0.4);
      box-shadow: none;
    }

    @media (max-width: 900px) {
      .demo-topbar {
        grid-template-columns: 1fr;
      }

      .topbar-right {
        justify-content: flex-start;
      }

      .demo-layout {
        grid-template-columns: 1fr;
      }
    }
    `
  ]
})
export class FactoryUniverseDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gridCanvas') gridCanvas?: ElementRef<HTMLCanvasElement>;

  viewMode: ViewMode = 'world';
  overlays = {
    flow: true,
    stability: true,
    bottlenecks: false
  };

  isPaused = false;
  wireframeMode = false;
  logsExpanded = false;

  universeName = 'Factory Universe';
  universeInstance = 'Demo Instance';

  interactionMode: InteractionMode = 'build';
  filterQuery = '';

  score = 120;
  throughput = 1.6;
  efficiency = 0.76;
  stability = 0.82;
  entropy = 0.18;

  selectedNodeId = 'core';

  readonly worldNodes: DemoNode[] = [
    { id: 'core', label: 'Core Forge', kind: 'Energy', x: 20, y: 30, status: 'stable', tile: { col: 2, row: 1 } },
    { id: 'matter', label: 'Matter Loom', kind: 'Matter', x: 45, y: 20, status: 'stable', tile: { col: 3, row: 1 } },
    { id: 'structure', label: 'Structure Hub', kind: 'Structure', x: 70, y: 35, status: 'alert', tile: { col: 4, row: 1 } },
    { id: 'complexity', label: 'Complexity Lab', kind: 'Complexity', x: 40, y: 60, status: 'stable', tile: { col: 5, row: 1 } },
    { id: 'entropy', label: 'Entropy Gate', kind: 'Entropy', x: 70, y: 70, status: 'idle', tile: { col: 6, row: 1 } }
  ];

  readonly worldLinks: DemoLink[] = [
    { from: 'core', to: 'matter', type: 'flow' },
    { from: 'matter', to: 'structure', type: 'flow' },
    { from: 'structure', to: 'complexity', type: 'flow' },
    { from: 'complexity', to: 'entropy', type: 'policy' }
  ];

  readonly roomNodes: DemoNode[] = [
    { id: 'collector', label: 'Collector', kind: 'Particles', x: 20, y: 40, status: 'stable', tile: { col: 2, row: 2 } },
    { id: 'synth', label: 'Synth Array', kind: 'Matter', x: 45, y: 35, status: 'stable', tile: { col: 3, row: 2 } },
    { id: 'assembler', label: 'Assembler', kind: 'Structure', x: 70, y: 45, status: 'alert', tile: { col: 4, row: 2 } },
    { id: 'relay', label: 'Relay', kind: 'Flow', x: 55, y: 65, status: 'idle', tile: { col: 5, row: 2 } }
  ];

  readonly roomLinks: DemoLink[] = [
    { from: 'collector', to: 'synth', type: 'flow' },
    { from: 'synth', to: 'assembler', type: 'flow' },
    { from: 'assembler', to: 'relay', type: 'policy' }
  ];

  readonly buildCategories: BuildCategory[] = [
    { name: 'Machines', items: ['Core Forge', 'Matter Loom', 'Structure Hub', 'Complexity Lab', 'Entropy Gate'] },
    { name: 'Rooms', items: ['Collector', 'Synth Array', 'Assembler', 'Relay'] },
    { name: 'Subsystems', items: ['Energy', 'Matter', 'Structure', 'Complexity', 'Entropy', 'Information'] }
  ];

  readonly inspectorSamples = {
    world: {
      core: {
        inputs: 'Energy',
        outputs: 'Particles',
        throughput: '1.6x',
        policies: 'Auto-balance',
        constraints: 'Stability >= 78%'
      },
      matter: {
        inputs: 'Particles',
        outputs: 'Matter',
        throughput: '1.4x',
        policies: 'Priority: 2',
        constraints: 'Entropy <= 22%'
      },
      structure: {
        inputs: 'Matter',
        outputs: 'Structure',
        throughput: '0.9x',
        policies: 'Throttle active',
        constraints: 'Throughput >= 1.0x'
      },
      complexity: {
        inputs: 'Structure',
        outputs: 'Complexity',
        throughput: '1.1x',
        policies: 'Optimizer loop',
        constraints: 'Stability >= 72%'
      },
      entropy: {
        inputs: 'Complexity',
        outputs: 'Information',
        throughput: '0.8x',
        policies: 'Audit only',
        constraints: 'Entropy drift <= 18%'
      }
    },
    room: {
      collector: {
        inputs: 'Energy',
        outputs: 'Particles',
        throughput: '1.8x',
        policies: 'Local buffer',
        constraints: 'Idle <= 15%'
      },
      synth: {
        inputs: 'Particles',
        outputs: 'Matter',
        throughput: '1.3x',
        policies: 'Batch mode',
        constraints: 'Heat <= 62%'
      },
      assembler: {
        inputs: 'Matter',
        outputs: 'Structure',
        throughput: '0.7x',
        policies: 'Manual override',
        constraints: 'Queue <= 40%'
      },
      relay: {
        inputs: 'Structure',
        outputs: 'Complexity',
        throughput: '1.0x',
        policies: 'Route lock',
        constraints: 'Latency <= 120ms'
      }
    }
  } as const;

  readonly alertDetails: Record<string, string> = {
    structure: 'Throughput drop: structure backlog',
    assembler: 'Output jam: saturation spike'
  };

  readonly baseLogs = {
    world: [
      'Spacetime lattice stabilized.',
      'Matter synthesis within predicted variance.',
      'Policy layer: throttling applied.',
      'Complexity growth curve normalized.'
    ],
    room: [
      'Room diagnostics initialized.',
      'Flow buffers aligned to local grid.',
      'Material queue within tolerance.',
      'Routing constraints synchronized.'
    ]
  } as const;

  readonly nodeLogs: Record<string, string[]> = {
    core: ['Core Forge engagement steady.', 'Energy bloom under control.'],
    matter: ['Matter Loom feeds stable.', 'Particle drift minimized.'],
    structure: ['Structure Hub congestion detected.', 'Stability compensation active.'],
    complexity: ['Complexity Lab iteration rising.', 'Feedback loop contained.'],
    entropy: ['Entropy Gate auditing flow.', 'Information parity maintained.'],
    collector: ['Collector intake steady.', 'Particle yield within target.'],
    synth: ['Synth Array cadence stable.', 'Matter yield within variance.'],
    assembler: ['Assembler queue saturated.', 'Manual tuning recommended.'],
    relay: ['Relay pathing stable.', 'Flow routing latency nominal.']
  };

  private tickHandle: number | null = null;
  private readonly tickIntervalMs = 1500;
  private resizeHandler = () => this.drawGrid();

  get activeNodes(): DemoNode[] {
    return this.viewMode === 'world' ? this.worldNodes : this.roomNodes;
  }

  get activeLinks(): DemoLink[] {
    return this.viewMode === 'world' ? this.worldLinks : this.roomLinks;
  }

  get selectedNode(): DemoNode | undefined {
    return this.activeNodes.find((node) => node.id === this.selectedNodeId);
  }

  get alertNodes(): DemoNode[] {
    return this.activeNodes.filter((node) => node.status === 'alert');
  }

  get alertCount(): number {
    return this.alertNodes.length;
  }

  get resourceOverview(): string {
    return this.viewMode === 'world'
      ? 'Energy / Matter / Structure / Complexity / Entropy / Information'
      : 'Particles / Matter / Structure / Flow';
  }

  get overlaySummary(): string {
    const active = Object.entries(this.overlays)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
    return active.length ? active.join(' / ') : 'None';
  }

  get filteredBuildCategories(): BuildCategory[] {
    const query = this.filterQuery.trim().toLowerCase();
    if (!query) {
      return this.buildCategories;
    }
    return this.buildCategories
      .map((category) => ({
        name: category.name,
        items: category.items.filter((item) => item.toLowerCase().includes(query))
      }))
      .filter((category) => category.items.length > 0);
  }

  get selectedInspector(): InspectorSample | null {
    const nodeId = this.selectedNodeId;
    if (!nodeId) {
      return null;
    }
    const viewKey = this.viewMode;
    const samples = this.inspectorSamples[viewKey] as Record<string, InspectorSample>;
    return samples[nodeId] || null;
  }

  get logLines(): string[] {
    const base = this.baseLogs[this.viewMode];
    const selection = this.selectedNodeId ? this.nodeLogs[this.selectedNodeId] || [] : [];
    return [...base, ...selection];
  }

  ngAfterViewInit(): void {
    this.drawGrid();
    window.addEventListener('resize', this.resizeHandler);
    this.startSimulation();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.stopSimulation();
  }

  setView(mode: ViewMode): void {
    if (this.viewMode === mode) {
      return;
    }
    this.viewMode = mode;
    const fallback = this.activeNodes[0];
    if (fallback) {
      this.selectedNodeId = fallback.id;
    }
    this.drawGrid();
  }

  setMode(mode: InteractionMode): void {
    if (this.interactionMode === mode) {
      return;
    }
    this.interactionMode = mode;
  }

  updateFilter(query: string): void {
    this.filterQuery = query;
  }

  setPaused(paused: boolean): void {
    if (this.isPaused === paused) {
      return;
    }
    this.isPaused = paused;
    if (this.isPaused) {
      this.stopSimulation();
      return;
    }
    this.startSimulation();
  }

  toggleWireframe(): void {
    this.wireframeMode = !this.wireframeMode;
  }

  toggleLogs(): void {
    this.logsExpanded = !this.logsExpanded;
  }

  toggleOverlay(key: keyof typeof this.overlays): void {
    this.overlays[key] = !this.overlays[key];
    this.drawGrid();
  }

  selectNode(node: DemoNode): void {
    this.selectedNodeId = node.id;
  }

  getAlertDetail(nodeId: string): string {
    return this.alertDetails[nodeId] || 'Operational anomaly detected';
  }

  getNode(id: string): DemoNode | undefined {
    return this.activeNodes.find((node) => node.id === id);
  }

  getTileX(node: DemoNode): number {
    if (!node.tile) {
      return 0;
    }
    return (node.tile.col - 1) * -this.tileSize;
  }

  getTileY(node: DemoNode): number {
    if (!node.tile) {
      return 0;
    }
    return (node.tile.row - 1) * -this.tileSize;
  }

  private startSimulation(): void {
    if (this.tickHandle !== null) {
      window.clearInterval(this.tickHandle);
    }
    if (this.isPaused) {
      this.tickHandle = null;
      return;
    }
    this.tickHandle = window.setInterval(() => this.advanceSimulation(), this.tickIntervalMs);
  }

  private stopSimulation(): void {
    if (this.tickHandle !== null) {
      window.clearInterval(this.tickHandle);
      this.tickHandle = null;
    }
  }

  private advanceSimulation(): void {
    this.score += this.viewMode === 'world' ? 12 : 6;
    this.throughput = this.clamp(this.throughput + 0.02, 1.2, 2.4);
    this.efficiency = this.clamp(this.efficiency + 0.01, 0.68, 0.94);
    this.stability = this.clamp(this.stability + (this.viewMode === 'room' ? -0.01 : 0.01), 0.6, 0.95);
    this.entropy = this.clamp(1 - this.stability, 0.05, 0.35);
  }

  private drawGrid(): void {
    const canvas = this.gridCanvas?.nativeElement;
    if (!canvas || !canvas.parentElement) {
      return;
    }

    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const cell = this.viewMode === 'world' ? 50 : 36;
    ctx.strokeStyle = 'rgba(88, 160, 255, 0.12)';
    ctx.lineWidth = 1;

    for (let x = 0; x <= rect.width; x += cell) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }

    for (let y = 0; y <= rect.height; y += cell) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    if (this.overlays.stability) {
      ctx.fillStyle = 'rgba(61, 255, 191, 0.08)';
      ctx.fillRect(rect.width * 0.1, rect.height * 0.1, rect.width * 0.35, rect.height * 0.35);
    }
    if (this.overlays.bottlenecks) {
      ctx.fillStyle = 'rgba(255, 120, 120, 0.1)';
      ctx.fillRect(rect.width * 0.6, rect.height * 0.55, rect.width * 0.25, rect.height * 0.25);
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private get tileSize(): number {
    return 64;
  }
}
