import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ComicBorderService } from './comic-border.service';
import { ComicMaskedTileComponent } from './comic-masked-tile.component';

@Component({
  selector: 'comic-expandable-tile',
  standalone: true,
  imports: [CommonModule, ComicMaskedTileComponent],
  template: `
    <!-- COLLAPSED TILE SLOT WITH COMIC BORDER-->
    <tile-comic-masked
      [theme]="theme"
      [width]="tileWidth"
      [height]="tileHeight"
      [tileX]="tileX"
      [tileY]="tileY"
      class="tile-shell"
      (click)="open()">
      <ng-content select="[tile]"></ng-content>
    </tile-comic-masked>

    <!-- OVERLAY -->
    <div
      class="overlay"
      *ngIf="expanded"
      (click)="close()">
    </div>

    <!-- EXPANDED DIALOG SLOT -->
    <div
      class="dialog"
      *ngIf="expanded"
      [class]="'dialog theme-' + theme"
      [class.visible]="dialogVisible"
      (click)="$event.stopPropagation()">

      <button class="close" (click)="close()">✕</button>

      <div class="dialog-content">
        <div class="loading-mask" *ngIf="isLoading">
          <div class="loading-spinner"></div>
          <div class="loading-text">Initializing...</div>
          <div class="loading-bar">
            <span></span>
          </div>
        </div>
        <ng-container *ngIf="contentReady">
          <ng-content select="[dialog]"></ng-content>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    :host{
      display:inline-block;
    }

    /* ===================== */
    /* Tile shell            */
    /* ===================== */
    .tile-shell{
      display:inline-block;
      cursor:pointer;
      overflow: visible;
    }

    /* ===================== */
    /* Overlay (MAX Z)       */
    /* ===================== */
    .overlay{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.55);
      backdrop-filter:blur(4px);
      animation:fade-in .25s forwards;
      z-index:2147483646;
    }

    @keyframes fade-in{
      from{ opacity:0; }
      to{ opacity:1; }
    }

    /* ===================== */
    /* Dialog (shared motion)*/
    /* ===================== */
    .dialog{
      position:fixed;
      left:50%;
      top:50%;
      width:70vw;
      height:70vh;

      transform:
        translate(-50%,-50%)
        translate(var(--dx), var(--dy))
        scale(var(--sx), var(--sy));

      border-radius:18px;
      overflow:hidden;
      background:var(--tile-bg, #020814);
      border:2px solid var(--tile-border, rgba(255,255,255,.2));
      box-shadow:
        0 30px 80px rgba(0,0,0,.6),
        0 0 40px var(--tile-glow, rgba(255,255,255,.2));

      transition:
        transform .45s cubic-bezier(.2,.9,.3,1),
        border-radius .45s,
        box-shadow .3s ease,
        border-color .3s ease;

      z-index:2147483647;
    }

    .dialog.visible{
      transform:
        translate(-50%,-50%)
        translate(0,0)
        scale(1,1);

      border-radius:22px;
    }

    /* ===================== */
    /* Close button          */
    /* ===================== */
    .close{
      position:absolute;
      top:12px;
      right:12px;
      width:32px;
      height:32px;
      border-radius:50%;
      border:1px solid var(--tile-border, rgba(255,255,255,.4));
      background:#000;
      color:var(--tile-accent, #fff);
      font-size:18px;
      cursor:pointer;
      box-shadow:0 0 12px var(--tile-glow, rgba(255,255,255,.5));
      opacity:0;
      transition:.3s;
      z-index:2;
    }

    .dialog.visible .close{
      opacity:1;
    }

    /* ===================== */
    /* Dialog content        */
    /* ===================== */
    .dialog-content{
      width:100%;
      height:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      position:relative;
    }

    .loading-mask{
      position:absolute;
      inset:0;
      display:grid;
      place-items:center;
      gap:12px;
      background:rgba(2, 4, 10, 0.7);
      backdrop-filter:blur(6px);
      z-index:1;
    }

    .loading-spinner{
      width:42px;
      height:42px;
      border-radius:50%;
      border:2px solid rgba(255,255,255,.2);
      border-top-color:var(--tile-accent, #fff);
      animation:spin 0.9s linear infinite;
      box-shadow:0 0 16px var(--tile-glow, rgba(255,255,255,.4));
    }

    .loading-text{
      font-size:12px;
      letter-spacing:1.8px;
      text-transform:uppercase;
      color:var(--tile-accent, #fff);
      opacity:0.8;
    }

    .loading-bar{
      width:160px;
      height:6px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.2);
      overflow:hidden;
      background:rgba(0,0,0,.4);
    }

    .loading-bar span{
      display:block;
      width:40%;
      height:100%;
      background:linear-gradient(90deg, transparent, var(--tile-accent, #fff), transparent);
      animation:load-sweep 1.2s ease-in-out infinite;
    }

    @keyframes spin{
      to{ transform:rotate(360deg); }
    }

    @keyframes load-sweep{
      0%{ transform:translateX(-100%); opacity:0.4; }
      50%{ transform:translateX(60%); opacity:1; }
      100%{ transform:translateX(220%); opacity:0.2; }
    }

    .theme-candy{
      --tile-bg: radial-gradient(circle at 30% 20%, #fff4 0%, transparent 50%),
        linear-gradient(135deg,#ff5fd7,#ffb347);
      --tile-border: #ffe0ff;
      --tile-glow: rgba(255,111,214,.65);
      --tile-accent: #ffe9fb;
    }

    .theme-hyperlane{
      --tile-bg: radial-gradient(circle at 50% 20%, #00ffff44 0%, transparent 50%), #020814;
      --tile-border: #00e5ff;
      --tile-glow: rgba(0,255,255,.6);
      --tile-accent: #00e5ff;
    }

    .theme-sentient{
      --tile-bg: radial-gradient(circle at 50% 20%, #00ff5544 0%, transparent 50%), #000;
      --tile-border: #00ff66;
      --tile-glow: rgba(0,255,102,.5);
      --tile-accent: #00ff66;
    }

    .theme-mana{
      --tile-bg: radial-gradient(circle at 50% 20%, #c084fc55 0%, transparent 55%), #12001f;
      --tile-border: #c084fc;
      --tile-glow: rgba(192,132,252,.6);
      --tile-accent: #e9d5ff;
    }

    .theme-glitch{
      --tile-bg: repeating-linear-gradient(135deg, #111 0 10px, #1b1b1b 10px 20px);
      --tile-border: #ff5cf4;
      --tile-glow: rgba(255,92,244,.45);
      --tile-accent: #7ffcff;
    }

    .theme-quantum{
      --tile-bg: radial-gradient(circle at 50% 20%, #ff00ff33 0%, transparent 60%), #05020b;
      --tile-border: #ffef55;
      --tile-glow: rgba(255,239,85,.5);
      --tile-accent: #ffef55;
    }

    .theme-factory{
      --tile-bg: radial-gradient(circle at 20% 20%, rgba(61,255,191,.3) 0%, transparent 55%),
        radial-gradient(circle at 80% 30%, rgba(120,140,255,.3) 0%, transparent 60%),
        #0a101e;
      --tile-border: #5ce0ff;
      --tile-glow: rgba(92,224,255,.55);
      --tile-accent: #b8f7ff;
    }

    .theme-port{
      --tile-bg: radial-gradient(circle at 20% 30%, rgba(0,255,255,.25) 0%, transparent 55%),
        radial-gradient(circle at 75% 20%, rgba(0,150,255,.2) 0%, transparent 60%),
        #050a12;
      --tile-border: #2ef2ff;
      --tile-glow: rgba(46, 242, 255, .55);
      --tile-accent: #b8f7ff;
    }

    .theme-cell{
      --tile-bg: radial-gradient(circle at 35% 25%, rgba(120, 255, 210, 0.35) 0%, transparent 55%),
        radial-gradient(circle at 70% 60%, rgba(80, 220, 180, 0.25) 0%, transparent 60%),
        #06261f;
      --tile-border: #9affd6;
      --tile-glow: rgba(120, 255, 210, 0.55);
      --tile-accent: #d6fff0;
    }

    .theme-hanse{
      --tile-bg: radial-gradient(circle at 20% 20%, rgba(214, 182, 120, 0.2) 0%, transparent 55%),
        linear-gradient(135deg, #0b2433, #1f3b4a 55%, #132833);
      --tile-border: #d6b678;
      --tile-glow: rgba(214, 182, 120, 0.45);
      --tile-accent: #f2e2bf;
    }

    .theme-json{
      --tile-bg: radial-gradient(circle at 20% 20%, rgba(80, 210, 255, 0.28) 0%, transparent 60%),
        radial-gradient(circle at 80% 70%, rgba(120, 255, 210, 0.2) 0%, transparent 60%),
        #050c14;
      --tile-border: #7bd7ff;
      --tile-glow: rgba(120, 210, 255, 0.5);
      --tile-accent: #c8f4ff;
    }

    .theme-rainbow-millipedes{
      --tile-bg: linear-gradient(135deg, #ff5fd7, #ffd86b 30%, #7cffd4 60%, #6aa8ff);
      --tile-border: #ffe37a;
      --tile-glow: rgba(255, 205, 120, 0.55);
      --tile-accent: #fff1c4;
    }

    .theme-sediment{
      --tile-bg: linear-gradient(180deg, #3d2b1f, #6a4a36 40%, #96715a 80%, #c3a287);
      --tile-border: #d2b59c;
      --tile-glow: rgba(210, 181, 156, 0.45);
      --tile-accent: #f0e0d4;
    }

    .theme-zebra-pillbugs{
      --tile-bg: repeating-linear-gradient(135deg, #1a1a1a 0 10px, #f2f2f2 10px 20px);
      --tile-border: #e0e0e0;
      --tile-glow: rgba(240, 240, 240, 0.45);
      --tile-accent: #f8f8f8;
    }

    .theme-ants{
      --tile-bg: radial-gradient(circle at 20% 20%, rgba(255, 140, 90, 0.3) 0%, transparent 45%),
        linear-gradient(135deg, #2b0a0a, #4b1a12 50%, #1a0a0a);
      --tile-border: #ff9860;
      --tile-glow: rgba(255, 152, 96, 0.5);
      --tile-accent: #ffd1b0;
    }

    .theme-dogs{
      --tile-bg: radial-gradient(circle at 25% 30%, rgba(255, 236, 200, 0.35) 0%, transparent 50%),
        radial-gradient(circle at 80% 60%, rgba(255, 200, 150, 0.25) 0%, transparent 60%),
        #5a3d2b;
      --tile-border: #f1c59b;
      --tile-glow: rgba(241, 197, 155, 0.55);
      --tile-accent: #ffe3c7;
    }

    .theme-succulent-plants{
      --tile-bg: radial-gradient(circle at 20% 20%, rgba(150, 255, 200, 0.35) 0%, transparent 55%),
        radial-gradient(circle at 80% 70%, rgba(120, 220, 180, 0.25) 0%, transparent 60%),
        #0b2a1e;
      --tile-border: #9cffc9;
      --tile-glow: rgba(156, 255, 201, 0.5);
      --tile-accent: #d9ffe9;
    }

    .theme-water-systems{
      --tile-bg: radial-gradient(circle at 70% 20%, rgba(64, 210, 255, 0.35) 0%, transparent 55%),
        radial-gradient(circle at 25% 70%, rgba(80, 160, 255, 0.25) 0%, transparent 60%),
        #041a2c;
      --tile-border: #65d5ff;
      --tile-glow: rgba(101, 213, 255, 0.55);
      --tile-accent: #c6f2ff;
    }

    .theme-biosys{
      --tile-bg: radial-gradient(circle at 25% 20%, rgba(100, 255, 170, 0.35) 0%, transparent 55%),
        radial-gradient(circle at 75% 70%, rgba(80, 200, 255, 0.25) 0%, transparent 60%),
        #04261f;
      --tile-border: #7dffc3;
      --tile-glow: rgba(125, 255, 195, 0.5);
      --tile-accent: #d8fff1;
    }

    .theme-general-relativity{
      --tile-bg: radial-gradient(circle at 50% 45%, rgba(255, 240, 160, 0.35) 0%, transparent 50%),
        linear-gradient(135deg, #0a0f1e, #141a2f);
      --tile-border: #ffe49a;
      --tile-glow: rgba(255, 228, 154, 0.5);
      --tile-accent: #fff0c2;
    }

    .theme-arcane-summoning-circle{
      --tile-bg: radial-gradient(circle at 50% 50%, rgba(185, 140, 255, 0.35) 0%, transparent 55%),
        linear-gradient(135deg, #14081f, #2b1035);
      --tile-border: #cda8ff;
      --tile-glow: rgba(205, 168, 255, 0.6);
      --tile-accent: #f1ddff;
    }
  `]
})
export class ComicExpandableTileComponent implements OnInit, OnDestroy {
  private static expandedCount = 0;
  expanded = false;
  dialogVisible = false;
  isLoading = false;
  contentReady = false;
  private activePanel: HTMLElement | null = null;
  private openTimer: number | null = null;

  @Input() theme: 'candy' | 'hyperlane' | 'sentient' | 'mana' | 'glitch' | 'quantum' | 'factory' | 'port' | 'cell' | 'hanse' | 'json' | 'rainbow-millipedes' | 'sediment' | 'zebra-pillbugs' | 'ants' | 'dogs' | 'succulent-plants' | 'water-systems' | 'biosys' | 'general-relativity' | 'arcane-summoning-circle' | 'default' = 'default';
  @Input() tileWidth = 200;
  @Input() tileHeight = 100;
  @Input() tileX = 0;
  @Input() tileY = 0;

  constructor(private host: ElementRef, private comicBorderService: ComicBorderService) {}

  ngOnInit(): void {
    // Set a consistent seed for all comic borders to ensure determinism
    this.comicBorderService.setSeed(42);
  }

  open() {
    if (this.expanded) {
      return;
    }
    this.isLoading = true;
    this.contentReady = false;
    const tileEl = this.host.nativeElement
      .querySelector('.tile-shell')
      .firstElementChild as HTMLElement;
    this.activePanel = this.host.nativeElement.closest('.ad-panel, .tile-panel');
    if (this.activePanel) {
      this.activePanel.classList.add('tile-active');
    }

    const rect = tileEl.getBoundingClientRect();

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const dx = rect.left + rect.width / 2 - cx;
    const dy = rect.top + rect.height / 2 - cy;

    const sx = rect.width / (window.innerWidth * 0.7);
    const sy = rect.height / (window.innerHeight * 0.7);

    const root = document.documentElement;
    root.style.setProperty('--dx', `${dx}px`);
    root.style.setProperty('--dy', `${dy}px`);
    root.style.setProperty('--sx', `${sx}`);
    root.style.setProperty('--sy', `${sy}`);

    this.expanded = true;
    this.updateBodyExpanded(true);

    requestAnimationFrame(() => {
      this.dialogVisible = true;
    });

    if (this.openTimer !== null) {
      window.clearTimeout(this.openTimer);
    }
    this.openTimer = window.setTimeout(() => {
      this.contentReady = true;
      this.isLoading = false;
      this.openTimer = null;
    }, 120);
  }

  close() {
    if (!this.expanded) {
      return;
    }
    if (this.openTimer !== null) {
      window.clearTimeout(this.openTimer);
      this.openTimer = null;
    }
    this.dialogVisible = false;
    this.isLoading = false;
    this.contentReady = false;

    setTimeout(() => {
      this.expanded = false;
      if (this.activePanel) {
        this.activePanel.classList.remove('tile-active');
        this.activePanel = null;
      }
      this.updateBodyExpanded(false);
    }, 450);
  }

  ngOnDestroy(): void {
    if (this.openTimer !== null) {
      window.clearTimeout(this.openTimer);
      this.openTimer = null;
    }
    if (this.expanded) {
      if (this.activePanel) {
        this.activePanel.classList.remove('tile-active');
        this.activePanel = null;
      }
      this.updateBodyExpanded(false);
    }
  }

  private updateBodyExpanded(isExpanded: boolean): void {
    const body = document.body;
    if (isExpanded) {
      ComicExpandableTileComponent.expandedCount += 1;
      if (ComicExpandableTileComponent.expandedCount === 1) {
        body.classList.add('tiles-expanded');
      }
      return;
    }

    ComicExpandableTileComponent.expandedCount = Math.max(0, ComicExpandableTileComponent.expandedCount - 1);
    if (ComicExpandableTileComponent.expandedCount === 0) {
      body.classList.remove('tiles-expanded');
    }
  }
}
