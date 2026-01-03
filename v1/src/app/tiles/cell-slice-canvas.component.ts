import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'cell-slice-canvas',
  standalone: true,
  template: `
    <div class="canvas-shell">
      <button
        type="button"
        class="edit-toggle"
        [class.active]="editMode"
        (click)="toggleEditMode()"
        aria-label="Toggle edit mode">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 16.5V20h3.5l9.9-9.9-3.5-3.5L4 16.5zm13.7-9.2c.4-.4.4-1 0-1.4l-1.6-1.6c-.4-.4-1-.4-1.4 0l-1.3 1.3 3.5 3.5 1.3-1.8z"/>
        </svg>
      </button>
      @if (editMode) {
      <div class="edit-toolbar" aria-label="Edit tools">
        <button
          type="button"
          class="tool"
          [class.active]="boxSelectMode"
          (click)="toggleBoxSelect()"
          aria-label="Box select">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M8 8h3M8 8v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="plus-cluster">
        <button
          type="button"
          class="plus-icon"
          [class.active]="plusMenuOpen"
          (click)="togglePlusMenu()"
          aria-label="Add element">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
        @if (plusMenuOpen) {
          <div class="plus-menu" aria-label="Add options">
            <button
              type="button"
              class="plus-item"
              aria-label="Add chromatin"
              (click)="addOrganelle('chromatin')"
              (mouseenter)="showTooltipForKey('chromatin')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 9c2-4 6-4 8 0s6 4 6 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M6 15c3-2 6-2 9 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add rough endoplasmic reticulum"
              (click)="addOrganelle('rough-er')"
              (mouseenter)="showTooltipForKey('rough-er')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 8h14M5 12h14M5 16h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="7" cy="8" r="1" fill="currentColor"/>
                <circle cx="13" cy="12" r="1" fill="currentColor"/>
                <circle cx="18" cy="16" r="1" fill="currentColor"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add nucleolus"
              (click)="addOrganelle('nucleolus')"
              (mouseenter)="showTooltipForKey('nucleolus')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3.5" fill="currentColor"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add ribosomes"
              (click)="addOrganelle('ribosomes')"
              (mouseenter)="showTooltipForKey('ribosomes')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="7" cy="8" r="1.6" fill="currentColor"/>
                <circle cx="12" cy="12" r="1.6" fill="currentColor"/>
                <circle cx="17" cy="7" r="1.6" fill="currentColor"/>
                <circle cx="9" cy="16" r="1.6" fill="currentColor"/>
                <circle cx="16" cy="16" r="1.6" fill="currentColor"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add Golgi apparatus"
              (click)="addOrganelle('golgi')"
              (mouseenter)="showTooltipForKey('golgi')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 8c3-2 9-2 12 0M5 12c4-2 10-2 14 0M6 16c3-1 9-1 12 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add Golgi vesicle"
              (click)="addOrganelle('golgi-vesicle')"
              (mouseenter)="showTooltipForKey('golgi-vesicle')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add cytoplasm"
              (click)="addOrganelle('cytoplasm')"
              (mouseenter)="showTooltipForKey('cytoplasm')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 6h12v12H6z" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M8 10c2-2 6-2 8 0M8 14c2 2 6 2 8 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add vacuole"
              (click)="addOrganelle('vacuole')"
              (mouseenter)="showTooltipForKey('vacuole')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="6" y="6" width="12" height="12" rx="4" ry="4" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add lysosome"
              (click)="addOrganelle('lysosome')"
              (mouseenter)="showTooltipForKey('lysosome')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7 12c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5z" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M10 12h4M12 10v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add peroxisome"
              (click)="addOrganelle('peroxisome')"
              (mouseenter)="showTooltipForKey('peroxisome')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add smooth endoplasmic reticulum"
              (click)="addOrganelle('smooth-er')"
              (mouseenter)="showTooltipForKey('smooth-er')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 9c3-2 5-2 7 0s4 2 7 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M5 15c3 2 5 2 7 0s4-2 7 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add secretory vesicle"
              (click)="addOrganelle('secretory-vesicle')"
              (mouseenter)="showTooltipForKey('secretory-vesicle')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="10" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="16" cy="12" r="2" fill="currentColor"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add intermediate filament"
              (click)="addOrganelle('filament')"
              (mouseenter)="showTooltipForKey('filament')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 8h16M4 12h16M4 16h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button
              type="button"
              class="plus-item"
              aria-label="Add centrosome"
              (click)="addOrganelle('centrosome')"
              (mouseenter)="showTooltipForKey('centrosome')"
              (mouseleave)="clearTooltip()">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
                <path d="M12 4v4M12 16v4M4 12h4M16 12h4M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        }
      </div>
      }
      @if (activeTooltip) {
        <div class="plus-tooltip">
          <div class="plus-tooltip-title">{{ activeTooltip.title }}</div>
          <div class="plus-tooltip-body">{{ activeTooltip.description }}</div>
          <div class="plus-tooltip-function">{{ activeTooltip.function }}</div>
        </div>
      }
      <button
        type="button"
        class="export-button"
        (click)="exportSvg()"
        aria-label="Export canvas">
        Export
      </button>
      <svg
        #svgRoot
        class="cell-canvas"
        [attr.viewBox]="'0 0 ' + viewBoxWidth + ' ' + viewBoxHeight"
        (pointerdown)="onSvgPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp()"
        (pointerleave)="onPointerUp()">
        <defs>
          <linearGradient id="cellFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f4a3a"/>
            <stop offset="100%" stop-color="#0b3026"/>
          </linearGradient>
        </defs>
        <path
          [attr.d]="eggPath"
          fill="url(#cellFill)"
          stroke="rgba(140, 255, 220, 0.7)"
          stroke-width="2"/>
        @for (icon of spawnedIcons; track icon.id) {
          <path
            class="spawned-icon"
            [class.selected]="selectedIconIds.has(icon.id)"
            [attr.d]="icon.path"
            [attr.transform]="buildIconTransform(icon)"
            (pointerdown)="startIconDrag($event, icon.id)"
            (mouseenter)="showTooltipForKey(icon.key)"
            (mouseleave)="clearTooltip()"/>
        }
        @if (editMode) {
          @if (selectionRect; as rect) {
            <rect
              class="selection-rect"
              [attr.x]="rect.x"
              [attr.y]="rect.y"
              [attr.width]="rect.width"
              [attr.height]="rect.height"/>
          }
          <g>
            @for (point of eggPoints; track point; let i = $index) {
              <circle
                class="handle"
                [class.selected]="selectedIndices.has(i)"
                [attr.cx]="point.x"
                [attr.cy]="point.y"
                r="6"
                (pointerdown)="startDrag($event, 'egg', i)"/>
            }
          </g>
        }
      </svg>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .canvas-shell {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .cell-canvas {
      width: 100%;
      height: 100%;
      display: block;
      border-radius: 16px;
      background: radial-gradient(circle at 20% 20%, rgba(120, 255, 210, 0.08), transparent 60%);
      box-shadow: inset 0 0 18px rgba(5, 22, 18, 0.7);
    }

    .edit-toggle {
      position: absolute;
      left: 10px;
      top: 10px;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: 1px solid rgba(150, 255, 220, 0.3);
      background: rgba(6, 24, 20, 0.6);
      color: #d6fff0;
      display: grid;
      place-items: center;
      cursor: pointer;
      z-index: 2;
    }

    .edit-toggle svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
      opacity: 0.85;
    }

    .edit-toggle.active {
      background: rgba(120, 255, 210, 0.2);
      border-color: rgba(150, 255, 220, 0.6);
    }

    .edit-toolbar {
      position: absolute;
      left: 48px;
      top: 8px;
      display: flex;
      gap: 6px;
      z-index: 2;
    }

    .tool {
      width: 26px;
      height: 26px;
      border-radius: 8px;
      border: 1px solid rgba(150, 255, 220, 0.3);
      background: rgba(6, 24, 20, 0.6);
      color: #d6fff0;
      display: grid;
      place-items: center;
      cursor: pointer;
    }

    .tool svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    .tool.active {
      background: rgba(120, 255, 210, 0.2);
      border-color: rgba(150, 255, 220, 0.6);
    }

    .tool.danger {
      color: #ffb4a7;
      border-color: rgba(255, 150, 150, 0.3);
    }

    .plus-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: 1px solid rgba(150, 255, 220, 0.3);
      background: rgba(6, 24, 20, 0.6);
      color: #d6fff0;
      display: grid;
      place-items: center;
      cursor: pointer;
    }

    .plus-icon svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
    }

    .plus-icon.active {
      background: rgba(120, 255, 210, 0.2);
      border-color: rgba(150, 255, 220, 0.6);
    }

    .plus-cluster {
      position: absolute;
      right: 10px;
      top: 10px;
      display: grid;
      gap: 6px;
      z-index: 2;
    }

    .plus-menu {
      display: grid;
      gap: 6px;
      justify-items: end;
    }

    .plus-item {
      width: 26px;
      height: 26px;
      border-radius: 8px;
      border: 1px solid rgba(150, 255, 220, 0.3);
      background: rgba(6, 24, 20, 0.6);
      color: #d6fff0;
      display: grid;
      place-items: center;
      cursor: pointer;
    }

    .plus-item svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    .plus-tooltip {
      position: absolute;
      right: 54px;
      top: 44px;
      width: 220px;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(150, 255, 220, 0.3);
      background: rgba(6, 18, 16, 0.9);
      color: #d6fff0;
      pointer-events: none;
      box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
      z-index: 3;
    }

    .plus-tooltip-title {
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .plus-tooltip-body {
      font-size: 0.72rem;
      line-height: 1.4;
      margin-bottom: 6px;
      color: rgba(214, 255, 240, 0.9);
    }

    .plus-tooltip-function {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: rgba(160, 255, 220, 0.8);
    }

    .export-button {
      position: absolute;
      right: 10px;
      bottom: 10px;
      border-radius: 999px;
      border: 1px solid rgba(150, 255, 220, 0.3);
      background: rgba(6, 24, 20, 0.6);
      color: #d6fff0;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 6px 12px;
      cursor: pointer;
      z-index: 2;
    }

    .handle {
      fill: rgba(214, 255, 240, 0.9);
      stroke: rgba(10, 60, 44, 0.9);
      stroke-width: 1.5;
      cursor: grab;
    }

    .handle.core {
      fill: #b9fff0;
    }

    .handle.selected {
      fill: #7fffe0;
      stroke-width: 2;
    }

    .selection-rect {
      fill: rgba(120, 255, 210, 0.15);
      stroke: rgba(150, 255, 220, 0.65);
      stroke-width: 1.5;
      stroke-dasharray: 6 4;
    }

    .spawned-icon {
      fill: rgba(120, 255, 210, 0.85);
      stroke: rgba(10, 60, 44, 0.6);
      stroke-width: 0.9;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .spawned-icon.selected {
      fill: rgba(160, 255, 230, 0.95);
      stroke-width: 1.4;
    }
    `
  ]
})
export class CellSliceCanvasComponent implements AfterViewInit {
  @ViewChild('svgRoot', { static: true }) svgRoot!: ElementRef<SVGSVGElement>;
  editMode = false;
  readonly viewBoxWidth = 600;
  readonly viewBoxHeight = 360;
  coreRadius = 26;
  eggPoints = this.createEggPoints(300, 180, 150, 100, 1.4);
  eggPath = this.buildPath(this.eggPoints);
  private activeDrag:
    | { target: 'egg'; index: number; start: { x: number; y: number }; points: Array<{ x: number; y: number }> }
    | null = null;
  private activeIconDrag: { id: number; start: { x: number; y: number }; origin: { x: number; y: number } } | null = null;
  boxSelectMode = false;
  plusMenuOpen = false;
  activeTooltip: { title: string; description: string; function: string } | null = null;
  selectionRect: { x: number; y: number; width: number; height: number } | null = null;
  selectedIndices = new Set<number>();
  selectedIconIds = new Set<number>();
  private selectionStart: { x: number; y: number } | null = null;
  spawnedIcons: Array<{ id: number; key: string; path: string; x: number; y: number; scale: number }> = [];
  private nextIconId = 1;
  private readonly organellePaths: Record<string, string> = {
    chromatin: 'M7 9c2.6-4.2 8-4.2 10.6 0 1.8 2.8 1.8 6.2 0 9-1.8 2.8-5.6 4.2-8.6 3.2-2.6-.8-4.2-3-4.6-5.4-.3-2.1.2-4.8 2.6-6.8Z',
    'rough-er': 'M4 7h16v2H4zM4 11h16v2H4zM4 15h16v2H4z',
    nucleolus: 'M12 5a7 7 0 1 1 0 14a7 7 0 0 1 0-14z',
    ribosomes: 'M7 7a2 2 0 1 1 0 4a2 2 0 0 1 0-4zm10 0a2 2 0 1 1 0 4a2 2 0 0 1 0-4zm-5 5a2 2 0 1 1 0 4a2 2 0 0 1 0-4zm-4 5a2 2 0 1 1 0 4a2 2 0 0 1 0-4zm8 0a2 2 0 1 1 0 4a2 2 0 0 1 0-4z',
    golgi: 'M5 8c3-2 11-2 14 0l-1.4 1.8c-3-1.2-8-1.2-11.2 0L5 8zm-1 5c4-2 12-2 16 0l-1.4 1.8c-3-1.2-10-1.2-13.2 0L4 13zm1 5c3-1 11-1 14 0l-1.4 1.8c-3-.8-8.8-.8-11.2 0L5 18z',
    'golgi-vesicle': 'M12 6a6 6 0 1 1 0 12a6 6 0 0 1 0-12z',
    cytoplasm: 'M6 6h12v12H6zM8 10c2-2 6-2 8 0v2c-2 2-6 2-8 0v-2z',
    vacuole: 'M6 6h12v12H6z',
    lysosome: 'M7 12a5 5 0 1 1 10 0a5 5 0 0 1-10 0zm3-1h4v2h-4z',
    peroxisome: 'M12 6a6 6 0 1 1 0 12a6 6 0 0 1 0-12zM11 9h2v6h-2zM9 11h6v2H9z',
    'smooth-er': 'M4 10c3-2 6-2 8 0s5 2 8 0v2c-3 2-6 2-8 0s-5-2-8 0v-2zm0 4c3 2 6 2 8 0s5-2 8 0v2c-3-2-6-2-8 0s-5 2-8 0v-2z',
    'secretory-vesicle': 'M8 12a4 4 0 1 1 8 0a4 4 0 0 1-8 0z',
    filament: 'M4 8h16v2H4zM4 12h16v2H4zM4 16h16v2H4z',
    centrosome: 'M12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10z'
  };
  private readonly organelleInfo: Record<string, { title: string; description: string; function: string }> = {
    chromatin: {
      title: 'Chromatin',
      description: 'Dense DNA-protein coils inside the nucleus.',
      function: 'Stores genetic instructions and regulates access.'
    },
    'rough-er': {
      title: 'Rough ER',
      description: 'Membrane stacks dotted with ribosomes.',
      function: 'Synthesizes and folds proteins for export or membranes.'
    },
    nucleolus: {
      title: 'Nucleolus',
      description: 'Dense region inside the nucleus.',
      function: 'Produces ribosomal RNA and assembles ribosome parts.'
    },
    ribosomes: {
      title: 'Ribosomes',
      description: 'Tiny protein-making particles.',
      function: 'Translate mRNA into proteins.'
    },
    golgi: {
      title: 'Golgi apparatus',
      description: 'Stacked membrane sacs.',
      function: 'Modifies, sorts, and packages proteins and lipids.'
    },
    'golgi-vesicle': {
      title: 'Golgi vesicle',
      description: 'Small transport bubble from the Golgi.',
      function: 'Delivers sorted cargo to cell destinations.'
    },
    cytoplasm: {
      title: 'Cytoplasm',
      description: 'Gel-like interior between membrane and nucleus.',
      function: 'Supports organelles and hosts many reactions.'
    },
    vacuole: {
      title: 'Vacuole',
      description: 'Large storage compartment.',
      function: 'Maintains pressure and stores water or nutrients.'
    },
    lysosome: {
      title: 'Lysosome',
      description: 'Enzyme-filled sac.',
      function: 'Breaks down waste and recycles materials.'
    },
    peroxisome: {
      title: 'Peroxisome',
      description: 'Oxidation micro-compartment.',
      function: 'Detoxifies and breaks down fatty acids.'
    },
    'smooth-er': {
      title: 'Smooth ER',
      description: 'Smooth membrane tubules.',
      function: 'Synthesizes lipids and helps detoxification.'
    },
    'secretory-vesicle': {
      title: 'Secretory vesicle',
      description: 'Cargo bubble headed to the membrane.',
      function: 'Releases contents outside the cell.'
    },
    filament: {
      title: 'Intermediate filament',
      description: 'Strong internal fibers.',
      function: 'Provides structural support and resilience.'
    },
    centrosome: {
      title: 'Centrosome',
      description: 'Microtubule-organizing center.',
      function: 'Coordinates spindle formation during division.'
    }
  };

  ngAfterViewInit(): void {
    this.updatePath();
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.boxSelectMode = false;
      this.plusMenuOpen = false;
      this.selectionRect = null;
      this.selectedIndices.clear();
    }
  }

  togglePlusMenu(): void {
    this.plusMenuOpen = !this.plusMenuOpen;
    if (!this.plusMenuOpen) {
      this.activeTooltip = null;
    }
  }

  addOrganelle(key: string): void {
    const path = this.organellePaths[key];
    if (!path) {
      return;
    }
    const size = this.coreRadius * 1.5;
    const scale = size / 24;
    const cx = this.viewBoxWidth / 2;
    const cy = this.viewBoxHeight / 2;
    this.spawnedIcons = [
      ...this.spawnedIcons,
      { id: this.nextIconId++, key, path, x: cx, y: cy, scale }
    ];
  }

  showTooltipForKey(key: string): void {
    const info = this.organelleInfo[key];
    if (!info) {
      return;
    }
    this.activeTooltip = info;
  }

  clearTooltip(): void {
    this.activeTooltip = null;
  }

  toggleBoxSelect(): void {
    this.boxSelectMode = !this.boxSelectMode;
    this.selectionRect = null;
  }

  exportSvg(): void {
    const svgEl = this.svgRoot.nativeElement;
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.querySelectorAll('.handle, .selection-rect').forEach((node) => node.remove());
    clone.removeAttribute('style');
    clone.setAttribute('width', `${this.viewBoxWidth}`);
    clone.setAttribute('height', `${this.viewBoxHeight}`);
    const serialized = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([serialized], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cell-slice.svg';
    link.click();
    URL.revokeObjectURL(url);
  }

  startDrag(event: PointerEvent, target: 'egg', index: number): void {
    if (!this.editMode) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const start = this.toSvgPoint(event);
    const pointsCopy = this.eggPoints.map((point) => ({ ...point }));
    this.activeDrag = { target: 'egg', index, start, points: pointsCopy };
    if (target === 'egg' && !this.selectedIndices.has(index)) {
      this.selectedIndices.clear();
      this.selectedIndices.add(index);
    }
    (event.target as Element).setPointerCapture(event.pointerId);
  }

  startIconDrag(event: PointerEvent, id: number): void {
    if (!this.editMode) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const start = this.toSvgPoint(event);
    const icon = this.spawnedIcons.find((item) => item.id === id);
    if (!icon) {
      return;
    }
    if (!this.selectedIconIds.has(id)) {
      this.selectedIconIds.clear();
      this.selectedIconIds.add(id);
    }
    this.activeIconDrag = { id, start, origin: { x: icon.x, y: icon.y } };
    (event.target as Element).setPointerCapture(event.pointerId);
  }

  onSvgPointerDown(event: PointerEvent): void {
    if (!this.editMode || !this.boxSelectMode) {
      return;
    }
    const start = this.toSvgPoint(event);
    this.selectionStart = start;
    this.selectionRect = { x: start.x, y: start.y, width: 0, height: 0 };
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.editMode) {
      return;
    }
    if (this.selectionStart && this.boxSelectMode) {
      const current = this.toSvgPoint(event);
      const x = Math.min(this.selectionStart.x, current.x);
      const y = Math.min(this.selectionStart.y, current.y);
      const width = Math.abs(current.x - this.selectionStart.x);
      const height = Math.abs(current.y - this.selectionStart.y);
      this.selectionRect = { x, y, width, height };
      return;
    }
    if (this.activeIconDrag) {
      const point = this.toSvgPoint(event);
      const deltaX = point.x - this.activeIconDrag.start.x;
      const deltaY = point.y - this.activeIconDrag.start.y;
      const movingIds = this.selectedIconIds.size
        ? Array.from(this.selectedIconIds)
        : [this.activeIconDrag.id];
      this.spawnedIcons = this.spawnedIcons.map((icon) =>
        movingIds.includes(icon.id)
          ? {
              ...icon,
              x: icon.x + deltaX,
              y: icon.y + deltaY
            }
          : icon
      );
      this.activeIconDrag.start = point;
      return;
    }
    if (!this.activeDrag) {
      return;
    }
    const point = this.toSvgPoint(event);
    const deltaX = point.x - this.activeDrag.start.x;
    const deltaY = point.y - this.activeDrag.start.y;
    const selected = this.selectedIndices.size ? Array.from(this.selectedIndices) : [this.activeDrag.index];
    selected.forEach((idx) => {
      const original = this.activeDrag?.points[idx];
      if (!original) {
        return;
      }
      this.eggPoints[idx] = {
        x: original.x + deltaX,
        y: original.y + deltaY
      };
    });
    this.updatePath();
  }

  onPointerUp(): void {
    this.activeDrag = null;
    this.activeIconDrag = null;
    if (this.selectionStart && this.selectionRect) {
      const rect = this.selectionRect;
      this.selectedIndices.clear();
      this.eggPoints.forEach((point, index) => {
        const inside =
          point.x >= rect.x &&
          point.x <= rect.x + rect.width &&
          point.y >= rect.y &&
          point.y <= rect.y + rect.height;
        if (inside) {
          this.selectedIndices.add(index);
        }
      });
      this.selectedIconIds.clear();
      this.spawnedIcons.forEach((icon) => {
        const inside =
          icon.x >= rect.x &&
          icon.x <= rect.x + rect.width &&
          icon.y >= rect.y &&
          icon.y <= rect.y + rect.height;
        if (inside) {
          this.selectedIconIds.add(icon.id);
        }
      });
    }
    this.selectionStart = null;
    this.selectionRect = null;
  }

  private updatePath(): void {
    this.eggPath = this.buildPath(this.eggPoints);
  }

  buildIconTransform(icon: { x: number; y: number; scale: number }): string {
    return `translate(${icon.x} ${icon.y}) scale(${icon.scale}) translate(-12 -12)`;
  }

  private createEggPoints(cx: number, cy: number, rx: number, ry: number, rotation: number) {
    const angles = [-Math.PI / 2, -Math.PI / 6, Math.PI / 6, Math.PI / 2, (5 * Math.PI) / 6, (7 * Math.PI) / 6];
    return angles.map((angle) => {
      const isTop = Math.abs(angle) < Math.PI / 2;
      const scaleX = isTop ? 0.78 : 1;
      const x = Math.cos(angle) * rx * scaleX;
      const y = Math.sin(angle) * ry;
      const rotated = this.rotatePoint(x, y, rotation);
      return { x: cx + rotated.x, y: cy + rotated.y };
    });
  }

  private rotatePoint(x: number, y: number, rotation: number) {
    return {
      x: x * Math.cos(rotation) - y * Math.sin(rotation),
      y: x * Math.sin(rotation) + y * Math.cos(rotation)
    };
  }

  private buildPath(points: Array<{ x: number; y: number }>): string {
    if (points.length < 2) {
      return '';
    }
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length; i += 1) {
      const p0 = points[(i - 1 + points.length) % points.length];
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const p3 = points[(i + 2) % points.length];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return `${d} Z`;
  }

  private toSvgPoint(event: PointerEvent): { x: number; y: number } {
    const svg = this.svgRoot.nativeElement;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * this.viewBoxWidth;
    const y = ((event.clientY - rect.top) / rect.height) * this.viewBoxHeight;
    return { x, y };
  }
}
