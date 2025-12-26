import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ComicBorderService } from './comic-border.service';

@Component({
  selector: 'tile-comic-masked',
  standalone: true,
  imports: [],
  template: `
    <div
      class="comic-masked-tile-wrapper"
      [style.width.px]="width"
      [style.height.px]="height">
      <!-- SVG mask definition -->
      <svg class="tile-mask-definition" [attr.width]="expandedWidth" [attr.height]="expandedHeight">
        <defs>
          <!-- Clip path for the tile shape -->
          <clipPath [attr.id]="clipPathId" clipPathUnits="userSpaceOnUse">
            <path [attr.d]="tileMaskPath" />
          </clipPath>
        </defs>
      </svg>
      
      <!-- Tile content with mask applied -->
      <div
        class="tile-content"
        [style.width.px]="expandedWidth"
        [style.height.px]="expandedHeight"
        [style.left.px]="-borderDepth"
        [style.top.px]="-borderDepth"
        [style.clip-path]="'url(#' + clipPathId + ')'">
        <div
          class="tile-content-inner"
          [style.transform]="'scale(' + tileScaleX.toFixed(3) + ',' + tileScaleY.toFixed(3) + ')'">
          <ng-content></ng-content>
        </div>
      </div>
      
      <!-- Border overlays using the defined paths -->
      <div
        class="border-overlays"
        [style.width.px]="expandedWidth"
        [style.height.px]="expandedHeight"
        [style.left.px]="-borderDepth"
        [style.top.px]="-borderDepth">
        <svg class="border-outline" [attr.viewBox]="viewBox" preserveAspectRatio="none">
          <path [attr.d]="tileMaskPath" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
  `,
  styles: [
    `
    .comic-masked-tile-wrapper {
      position: relative;
      display: inline-block;
      overflow: visible;
    }
    
    .tile-mask-definition {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
    
    .tile-content {
      position: absolute;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tile-content-inner {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-origin: center;
    }
    
    /* Use more specific selectors to avoid global style conflicts */
    .tile-content .tile-title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px !important;
      font-weight: 800 !important;
      letter-spacing: 1.6px !important;
      color: #d5dde7 !important;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6) !important;
      margin: 0 !important;
      padding: 0 !important;
    }
 
    .tile-content .tile-subtitle {
      position: absolute;
      top: 65%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 10px !important;
      letter-spacing: 1px !important;
      opacity: 0.65 !important;
      text-transform: uppercase !important;
      color: #d5dde7 !important;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6) !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .border-overlays {
      position: absolute;
      pointer-events: none;
      z-index: 1;
    }

    .border-outline {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
      color: var(--comic-border-color, rgba(0, 0, 0, 0.8));
      opacity: var(--comic-border-opacity, 0.9);
      filter: var(--comic-border-filter, none);
      stroke-width: 3px; /* Thicker borders for more prominence */
    }
    
    /* Theme variations */
    :host-context(.theme-candy) {
      --comic-border-color: rgba(255, 92, 214, 0.9);
      --comic-border-filter: drop-shadow(0 0 2px rgba(255, 92, 214, 0.5));
    }
    
    :host-context(.theme-hyperlane) {
      --comic-border-color: rgba(0, 255, 255, 0.9);
      --comic-border-filter: drop-shadow(0 0 2px rgba(0, 255, 255, 0.5));
    }
    
    :host-context(.theme-sentient) {
      --comic-border-color: rgba(0, 255, 102, 0.9);
      --comic-border-filter: drop-shadow(0 0 2px rgba(0, 255, 102, 0.5));
    }
    
    :host-context(.theme-mana) {
      --comic-border-color: rgba(192, 132, 252, 0.9);
      --comic-border-filter: drop-shadow(0 0 2px rgba(192, 132, 252, 0.5));
    }
    
    :host-context(.theme-glitch) {
      --comic-border-color: rgba(255, 92, 244, 0.9);
      --comic-border-filter: drop-shadow(0 0 2px rgba(255, 92, 244, 0.5));
    }
    
    :host-context(.theme-quantum) {
      --comic-border-color: rgba(255, 239, 85, 0.9);
      --comic-border-filter: drop-shadow(0 0 2px rgba(255, 239, 85, 0.5));
    }
    
    :host-context(.theme-factory) {
      --comic-border-color: rgba(92, 224, 255, 0.9);
      --comic-border-filter: drop-shadow(0 0 2px rgba(92, 224, 255, 0.5));
    }
    
    /* Default theme */
    :host-context(.theme-default) {
      --comic-border-color: rgba(30, 95, 116, 0.9);
      --comic-border-filter: drop-shadow(0 0 2px rgba(30, 95, 116, 0.3));
    }
    
    /* Comic-style paper texture overlay */
    .border-overlays::before {
      content: '';
      position: absolute;
      inset: -10px;
      background:
        radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.03) 0.5px, transparent 1px),
        radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0.5px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.3;
      pointer-events: none;
      z-index: -1;
    }
    `
  ]
})
export class ComicMaskedTileComponent implements OnInit {
  @Input() theme: 'candy' | 'hyperlane' | 'sentient' | 'mana' | 'glitch' | 'quantum' | 'factory' | 'default' = 'default';
  @Input() width = 200;
  @Input() height = 100;
  @Input() tileX = 0;
  @Input() tileY = 0;
  @Input() borderDepth = 10;
  
  // Unique IDs for SVG elements
  clipPathId = 'comic-clip-' + Math.random().toString(36).substr(2, 9);

  tileMaskPath = '';
  viewBox = '0 0 200 100';

  constructor(private comicBorderService: ComicBorderService) {}

  @HostBinding('class')
  get hostClass(): string {
    return `theme-${this.theme}`;
  }

  ngOnInit(): void {
    this.updateMaskPath();
  }
  
  private updateMaskPath(): void {
    this.viewBox = `0 0 ${this.expandedWidth} ${this.expandedHeight}`;
    this.tileMaskPath = this.comicBorderService.generateTileMaskPathForTile(
      this.tileX,
      this.tileY,
      this.width,
      this.height,
      this.borderDepth,
      this.borderDepth
    );
  }

  get expandedWidth(): number {
    return this.width + this.borderDepth * 2;
  }

  get expandedHeight(): number {
    return this.height + this.borderDepth * 2;
  }

  get tileScaleX(): number {
    return this.expandedWidth / this.width;
  }

  get tileScaleY(): number {
    return this.expandedHeight / this.height;
  }
}
