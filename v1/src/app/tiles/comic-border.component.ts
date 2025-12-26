import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ComicBorderService } from './comic-border.service';

@Component({
  selector: 'comic-border',
  standalone: true,
  imports: [],
  template: `
    <div class="comic-border-wrapper">
      <div class="comic-border-overlay">
        <!-- Top border -->
        <svg class="border-top" [attr.viewBox]="topViewBox" preserveAspectRatio="none">
          <path [attr.d]="topPath" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/>
        </svg>
        
        <!-- Right border -->
        <svg class="border-right" [attr.viewBox]="rightViewBox" preserveAspectRatio="none">
          <path [attr.d]="rightPath" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/>
        </svg>
        
        <!-- Bottom border -->
        <svg class="border-bottom" [attr.viewBox]="bottomViewBox" preserveAspectRatio="none">
          <path [attr.d]="bottomPath" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/>
        </svg>
        
        <!-- Left border -->
        <svg class="border-left" [attr.viewBox]="leftViewBox" preserveAspectRatio="none">
          <path [attr.d]="leftPath" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/>
        </svg>
        
        <!-- Corner decorations -->
        <div class="corner top-left" [innerHTML]="topLeftCorner"></div>
        <div class="corner top-right" [innerHTML]="topRightCorner"></div>
        <div class="corner bottom-left" [innerHTML]="bottomLeftCorner"></div>
        <div class="corner bottom-right" [innerHTML]="bottomRightCorner"></div>
      </div>
      
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
    .comic-border-wrapper {
      position: relative;
      display: inline-block;
    }
    
    .comic-border-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
    }
    
    .border-top, .border-bottom {
      position: absolute;
      width: 100%;
      height: 10px;
      left: 0;
    }
    
    .border-top {
      top: -5px;
    }
    
    .border-bottom {
      bottom: -5px;
    }
    
    .border-left, .border-right {
      position: absolute;
      width: 10px;
      height: 100%;
      top: 0;
    }
    
    .border-left {
      left: -5px;
    }
    
    .border-right {
      right: -5px;
    }
    
    svg {
      display: block;
      color: var(--comic-border-color, rgba(0, 0, 0, 0.8));
      opacity: var(--comic-border-opacity, 0.9);
      filter: var(--comic-border-filter, none);
    }
    
    .corner {
      position: absolute;
      width: 12px;
      height: 12px;
      color: var(--comic-border-color, rgba(0, 0, 0, 0.8));
      z-index: 2;
    }
    
    .corner svg {
      display: block;
      width: 100%;
      height: 100%;
    }
    
    .corner.top-left {
      top: -6px;
      left: -6px;
    }
    
    .corner.top-right {
      top: -6px;
      right: -6px;
    }
    
    .corner.bottom-left {
      bottom: -6px;
      left: -6px;
    }
    
    .corner.bottom-right {
      bottom: -6px;
      right: -6px;
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
    .comic-border-overlay::before {
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
export class ComicBorderComponent implements OnInit {
  @Input() theme: 'candy' | 'hyperlane' | 'sentient' | 'mana' | 'glitch' | 'quantum' | 'factory' | 'default' = 'default';
  @Input() width = 200;
  @Input() height = 100;
  
  topPath = '';
  rightPath = '';
  bottomPath = '';
  leftPath = '';
  
  topViewBox = '0 0 200 10';
  rightViewBox = '0 0 10 200';
  bottomViewBox = '0 0 200 10';
  leftViewBox = '0 0 10 200';
  
  topLeftCorner = '';
  topRightCorner = '';
  bottomLeftCorner = '';
  bottomRightCorner = '';

  constructor(private comicBorderService: ComicBorderService) {}

  @HostBinding('class')
  get hostClass(): string {
    return `theme-${this.theme}`;
  }

  ngOnInit(): void {
    this.updateBorderPaths();
    this.updateCornerDecorations();
  }

  private updateBorderPaths(): void {
    // Set viewBox dimensions based on input
    this.topViewBox = `0 0 ${this.width} 10`;
    this.rightViewBox = `0 0 10 ${this.height}`;
    this.bottomViewBox = `0 0 ${this.width} 10`;
    this.leftViewBox = `0 0 10 ${this.height}`;
    
    // Generate paths using the service
    this.topPath = this.comicBorderService.generateEdgePath(this.width, 10, 'top');
    this.rightPath = this.comicBorderService.generateEdgePath(this.height, 10, 'right');
    this.bottomPath = this.comicBorderService.generateEdgePath(this.width, 10, 'bottom');
    this.leftPath = this.comicBorderService.generateEdgePath(this.height, 10, 'left');
  }

  private updateCornerDecorations(): void {
    const cornerSize = 12;
    const cornerSVG = this.comicBorderService.generateCornerDecoration(cornerSize);
    
    this.topLeftCorner = `<svg viewBox="0 0 ${cornerSize} ${cornerSize}">${cornerSVG}</svg>`;
    this.topRightCorner = `<svg viewBox="0 0 ${cornerSize} ${cornerSize}">${cornerSVG}</svg>`;
    this.bottomLeftCorner = `<svg viewBox="0 0 ${cornerSize} ${cornerSize}">${cornerSVG}</svg>`;
    this.bottomRightCorner = `<svg viewBox="0 0 ${cornerSize} ${cornerSize}">${cornerSVG}</svg>`;
  }
}
