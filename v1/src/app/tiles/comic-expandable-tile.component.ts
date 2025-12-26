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
        <ng-content select="[dialog]"></ng-content>
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
  `]
})
export class ComicExpandableTileComponent implements OnInit, OnDestroy {
  private static expandedCount = 0;
  expanded = false;
  dialogVisible = false;
  private activePanel: HTMLElement | null = null;

  @Input() theme: 'candy' | 'hyperlane' | 'sentient' | 'mana' | 'glitch' | 'quantum' | 'factory' | 'default' = 'default';
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
  }

  close() {
    if (!this.expanded) {
      return;
    }
    this.dialogVisible = false;

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
