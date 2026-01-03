import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CandyRunnerEngine, RunnerInput, RunnerState } from './candy-runner.core';

@Component({
  selector: 'tile-candy-runner',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="tile runner-tile" #container>
    <div class="burst"></div>

    <div class="candy-rain">
      <span
        *ngFor="let c of candies"
        class="candy"
        [style.--x.%]="c.x"
        [style.--delay.s]="c.delay"
        [style.--duration.s]="c.duration"
        [style.--rot.deg]="c.rot"
        [style.--sx.px]="c.sx"
        [style.--sy.px]="c.sy">
      </span>
    </div>

    <div class="runner-stage-wrap">
      <div
        class="runner-stage"
        [style.width.px]="state.metrics.viewportWidth"
        [style.height.px]="state.metrics.viewportHeight"
        [style.transform]="stageTransform">
        <div class="runner-sky"></div>
        <div class="runner-ground"></div>

        <div
          *ngFor="let pit of state.pits"
          class="runner-pit"
          [style.left.px]="pit.x"
          [style.width.px]="pit.width">
        </div>

        <div
          *ngFor="let obstacle of state.obstacles"
          class="runner-obstacle"
          [class.spike]="obstacle.type === 'spike'"
          [class.low]="obstacle.type === 'low'"
          [class.bar]="obstacle.type === 'bar'"
          [style.left.px]="obstacle.x"
          [style.bottom.px]="obstacle.y"
          [style.width.px]="obstacle.width"
          [style.height.px]="obstacle.height">
        </div>

        <div
          *ngFor="let pickup of state.pickups"
          class="runner-candy"
          [class.golden]="pickup.kind === 'golden'"
          [style.left.px]="pickup.x"
          [style.bottom.px]="pickup.y"
          [style.width.px]="pickup.width"
          [style.height.px]="pickup.height">
        </div>

        <div
          class="runner-player"
          [class.air]="!state.player.grounded"
          [style.left.px]="state.player.x"
          [style.bottom.px]="state.player.y"
          [style.width.px]="state.player.width"
          [style.height.px]="state.player.height">
        </div>
      </div>
    </div>

    <div class="hud" *ngIf="state.mode !== 'boot'">
      <div class="hud-item">Score {{ state.score | number:'1.0-0' }}</div>
      <div class="hud-item">Distance {{ state.distance | number:'1.0-0' }}</div>
    </div>

    <div class="overlay" *ngIf="state.mode !== 'playing'">
      <ng-container *ngIf="state.mode === 'boot'">
        <div class="overlay-title">Candy Runner</div>
        <div class="overlay-subtitle">Press Space to Start</div>
      </ng-container>
      <ng-container *ngIf="state.mode === 'over'">
        <div class="overlay-title">Run Over</div>
        <div class="overlay-subtitle">Final Score {{ state.score | number:'1.0-0' }}</div>
        <div class="overlay-subtitle">Distance {{ state.distance | number:'1.0-0' }}</div>
        <div class="overlay-prompt">Press R to Retry</div>
      </ng-container>
    </div>

    <div class="tile-label">
      <div class="label-title">CANDY RUNNER</div>
      <div class="label-subtitle">Jump & Collect</div>
    </div>
  </div>
  `,
  styles: [
    `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .tile {
      --tile: 18px;
      width: 200px;
      height: 100px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      background:
        radial-gradient(circle at 30% 20%, #fff6 0%, transparent 40%),
        linear-gradient(135deg, #ff4fd8, #ffb347);
      box-shadow:
        0 6px 16px rgba(0,0,0,.35);
      font-family: "IBM Plex Sans", "Inter", "Segoe UI", sans-serif;
    }

    .tile:hover {
      animation: wobble .45s;
    }

    .burst {
      position: absolute;
      inset: -30%;
      background:
        repeating-radial-gradient(
          circle,
          #fff 0 6px,
          transparent 6px 18px
        );
      background-size: calc(400% + 50px) calc(400% + 50px);
      opacity: 0;
      transform: scale(0.4);
      transition: 0.4s;
      filter: blur(2px);
    }

    .tile:hover .burst {
      opacity: 0.7;
      transform: scale(1);
    }

    .candy-rain {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    }

    .candy {
      position: absolute;
      top: -40px;
      left: calc(var(--x) * 1%);
      width: var(--tile);
      height: var(--tile);
      background-image: url('/assets/tiles/candy-sheet.svg');
      background-size: calc(var(--tile) * 26) calc(var(--tile) * 14);
      background-position: calc(var(--sx) * 2) calc(var(--sy) * 2);
      opacity: 0;
      transform: rotate(var(--rot));
    }

    .tile:hover .candy {
      opacity: 1;
      animation:
        candy-fall var(--duration) linear infinite,
        candy-spin 3s linear infinite;
      animation-delay: var(--delay);
    }

    .runner-stage-wrap {
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      pointer-events: none;
      z-index: 1;
    }

    .runner-stage {
      position: relative;
      transform-origin: bottom center;
      border-radius: 10px;
      overflow: hidden;
      background: linear-gradient(180deg, #87e5ff 0%, #6cb4ff 55%, #ffb3e9 100%);
      box-shadow: inset 0 0 0 2px rgba(255,255,255,.35);
    }

    .runner-sky {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 20% 25%, rgba(255,255,255,0.6), transparent 50%),
        radial-gradient(circle at 75% 15%, rgba(255,255,255,0.5), transparent 60%);
      opacity: 0.85;
    }

    .runner-ground {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 70px;
      background: linear-gradient(180deg, #ff74c5 0%, #b51a7a 100%);
      box-shadow: inset 0 6px 0 rgba(255,255,255,0.25);
    }

    .runner-pit {
      position: absolute;
      bottom: 0;
      height: 70px;
      background: linear-gradient(180deg, #31102f 0%, #140812 100%);
      box-shadow: inset 0 6px 12px rgba(0,0,0,0.4);
    }

    .runner-player {
      position: absolute;
      background: linear-gradient(135deg, #fff7b8, #ff8bd1);
      border-radius: 14px;
      box-shadow: 0 6px 10px rgba(0,0,0,0.25);
    }

    .runner-player.air {
      box-shadow: 0 10px 18px rgba(0,0,0,0.3);
    }

    .runner-obstacle {
      position: absolute;
      border-radius: 6px;
      background: linear-gradient(135deg, #ff477e, #b2144b);
      box-shadow: inset 0 0 0 2px rgba(255,255,255,0.2);
    }

    .runner-obstacle.spike {
      border-radius: 0;
      clip-path: polygon(0 100%, 15% 30%, 30% 100%, 50% 35%, 70% 100%, 85% 30%, 100% 100%);
      background: linear-gradient(135deg, #ffb3d9, #ff2f7b);
    }

    .runner-obstacle.bar {
      background: linear-gradient(135deg, #ff76b5, #8b0d3b);
      border-radius: 10px;
    }

    .runner-obstacle.low {
      background: linear-gradient(135deg, #ff79c6, #7b0d3d);
      border-radius: 8px;
    }

    .runner-candy {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #fff, #ff85e1);
      box-shadow: 0 4px 8px rgba(0,0,0,0.25);
    }

    .runner-candy.golden {
      background: radial-gradient(circle at 30% 30%, #fff7b0, #ffb347);
      box-shadow: 0 4px 12px rgba(255, 205, 80, 0.6);
    }

    .hud {
      position: absolute;
      top: 6px;
      left: 8px;
      right: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      pointer-events: none;
    }

    .overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-align: center;
      background: rgba(20, 4, 18, 0.55);
      color: #fff;
      text-shadow: 0 2px 6px rgba(0,0,0,0.6);
      pointer-events: none;
    }

    .overlay-title {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .overlay-subtitle {
      font-size: 10px;
      font-weight: 600;
      opacity: 0.9;
    }

    .overlay-prompt {
      font-size: 9px;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .tile-label {
      position: absolute;
      left: 10px;
      bottom: 8px;
      z-index: 3;
      text-transform: uppercase;
      color: #fff;
      text-shadow:
        -2px -2px 0 #a1005d,
         2px -2px 0 #a1005d,
        -2px  2px 0 #a1005d,
         2px  2px 0 #a1005d,
         0   0   10px rgba(255, 255, 255, 0.8);
      pointer-events: none;
    }

    .label-title {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.14em;
    }

    .label-subtitle {
      font-size: 8px;
      font-weight: 800;
      opacity: 0.85;
      letter-spacing: 0.08em;
    }

    @keyframes wobble {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(2deg) scale(1.02); }
      50% { transform: rotate(-2deg) scale(1.03); }
      75% { transform: rotate(1deg); }
      100% { transform: rotate(0deg); }
    }

    @keyframes candy-fall {
      from { transform: translateY(-20px) rotate(var(--rot)); }
      to { transform: translateY(140px) rotate(calc(var(--rot) + 180deg)); }
    }

    @keyframes candy-spin {
      to { filter: hue-rotate(360deg); }
    }
     
    `
  ]
})
export class TileCandyRunner implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  state: RunnerState;
  stageTransform = 'scale(1)';

  private readonly engine = new CandyRunnerEngine();
  private animationFrameId: number | null = null;
  private lastTimestamp = 0;
  private accumulator = 0;
  private resizeObserver: ResizeObserver | null = null;
  private jumpQueued = false;
  private restartQueued = false;
  private resetQueued = false;

  private readonly onKeyDownBound = (event: KeyboardEvent) => this.handleKeyDown(event);
  candies = Array.from({ length: 18 }, () => ({
    x: Math.random() * 200,
    delay: Math.random() * 1.5,
    duration: 1.8 + Math.random() * 1.8,
    rot: Math.random() * 360,
    sx: -(Math.floor(Math.random() * 13) * 20),
    sy: -(Math.floor(4 + Math.random() * 2) * 20)
  }));

  constructor() {
    this.state = this.engine.state;
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.observeSize());
    window.addEventListener('keydown', this.onKeyDownBound);
    this.lastTimestamp = performance.now();
    this.animationFrameId = requestAnimationFrame((ts) => this.loop(ts));
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDownBound);
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  private loop(timestamp: number) {
    const delta = Math.min(0.05, (timestamp - this.lastTimestamp) / 1000);
    this.lastTimestamp = timestamp;
    this.accumulator += delta;

    const step = 1 / 60;
    while (this.accumulator >= step) {
      this.engine.step(step, this.consumeInput());
      this.accumulator -= step;
    }

    this.animationFrameId = requestAnimationFrame((ts) => this.loop(ts));
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.repeat) {
      return;
    }
    if (event.code === 'Escape') {
      this.resetQueued = true;
      return;
    }
    if (event.code === 'KeyR') {
      this.restartQueued = true;
      return;
    }
    if (event.code === 'Space' || event.code === 'KeyW' || event.code === 'ArrowUp') {
      event.preventDefault();
      this.jumpQueued = true;
    }
  }

  private consumeInput(): RunnerInput {
    const input = {
      jumpPressed: this.jumpQueued,
      restartPressed: this.restartQueued,
      resetPressed: this.resetQueued
    };
    this.jumpQueued = false;
    this.restartQueued = false;
    this.resetQueued = false;
    return input;
  }

  private observeSize() {
    this.resizeObserver = new ResizeObserver(() => this.updateScale());
    this.resizeObserver.observe(this.containerRef.nativeElement);
    this.updateScale();
  }

  private updateScale() {
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    const scaleX = rect.width / this.state.metrics.viewportWidth;
    const scaleY = rect.height / this.state.metrics.viewportHeight;
    const scale = Math.max(0.1, Math.min(scaleX, scaleY));
    this.stageTransform = `scale(${scale})`;
  }
}
