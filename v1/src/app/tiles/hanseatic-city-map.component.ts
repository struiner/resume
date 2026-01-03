import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { HanseaticCityMapService } from './hanseatic-city-map.service';

@Component({
  selector: 'hanseatic-city-map',
  standalone: true,
  template: `
    <div class="map-shell">
      <canvas #mapCanvas class="map-canvas" aria-label="Hanseatic city map"></canvas>
      <div class="map-overlay">
        <div class="map-title">Hanseatic League</div>
        <div class="map-subtitle">Trade corridors and civic anchors</div>
        <div class="map-controls">
          <button type="button" class="map-button" (click)="togglePlayback()">
            {{ playing ? 'Pause' : 'Play' }}
          </button>
          <button type="button" class="map-button ghost" (click)="resetSeed()">Reset</button>
        </div>
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

    .map-shell {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 16px;
      overflow: hidden;
      background:
        radial-gradient(circle at 20% 20%, rgba(214, 182, 120, 0.12), transparent 60%),
        linear-gradient(140deg, rgba(9, 26, 34, 0.95), rgba(15, 36, 46, 0.95));
      box-shadow: inset 0 0 30px rgba(5, 12, 14, 0.7);
    }

    .map-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    .map-overlay {
      position: absolute;
      left: 16px;
      top: 14px;
      display: grid;
      gap: 4px;
      padding: 8px 12px;
      border-radius: 12px;
      background: rgba(5, 16, 20, 0.65);
      border: 1px solid rgba(214, 182, 120, 0.35);
      color: #f2e2bf;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .map-title {
      font-size: 0.7rem;
      font-weight: 700;
    }

    .map-subtitle {
      font-size: 0.6rem;
      opacity: 0.75;
    }

    .map-controls {
      display: flex;
      gap: 8px;
      margin-top: 6px;
    }

    .map-button {
      border: 1px solid rgba(214, 182, 120, 0.5);
      background: rgba(12, 28, 34, 0.8);
      color: #f2e2bf;
      font-size: 0.6rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border-radius: 999px;
      padding: 4px 10px;
      cursor: pointer;
    }

    .map-button.ghost {
      border-style: dashed;
      opacity: 0.85;
    }
    `
  ]
})
export class HanseaticCityMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private resizeObserver?: ResizeObserver;
  playing = true;
  private seed = 'hanseatic-core';
  private targetTick = 16;
  private rafId: number | null = null;
  private lastTime = 0;
  private tickAccumulator = 0;
  private readonly tickIntervalMs = 800;

  constructor(private readonly mapService: HanseaticCityMapService) {}

  ngAfterViewInit(): void {
    this.bindResize();
    this.draw();
    this.startLoop();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.stopLoop();
  }

  togglePlayback(): void {
    this.playing = !this.playing;
    if (this.playing) {
      this.startLoop();
      return;
    }
    this.stopLoop();
  }

  resetSeed(): void {
    this.seed = `hanse-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.targetTick = 0;
    this.tickAccumulator = 0;
    this.draw();
  }

  private bindResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement;
    if (!container) {
      return;
    }
    this.resizeObserver = new ResizeObserver(() => this.draw());
    this.resizeObserver.observe(container);
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement;
    const width = container?.clientWidth ?? canvas.clientWidth;
    const height = container?.clientHeight ?? canvas.clientHeight;
    if (!width || !height) {
      return;
    }
    const cell = Math.max(5, Math.floor(Math.min(width, height) / 28));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    this.mapService.drawCity(ctx, width, height, this.seed, cell, this.targetTick);
  }

  private startLoop(): void {
    if (this.rafId !== null) {
      return;
    }
    this.lastTime = performance.now();
    const tick = (time: number) => {
      if (!this.playing) {
        this.rafId = null;
        return;
      }
      const delta = time - this.lastTime;
      this.lastTime = time;
      this.tickAccumulator += delta;
      if (this.tickAccumulator >= this.tickIntervalMs) {
        const steps = Math.floor(this.tickAccumulator / this.tickIntervalMs);
        this.tickAccumulator -= steps * this.tickIntervalMs;
        this.targetTick += steps;
        this.draw();
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (this.rafId === null) {
      return;
    }
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }
}
