import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { firstValueFrom } from 'rxjs';

type PinballLocationSnapshot = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  machineCount: number;
  topMachines?: string[];
};

@Component({
  selector: 'tile-global-port-traffic',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="port-tile" [class.dialog]="mode === 'dialog'">
      <div class="map" #map [class.hidden]="mode !== 'dialog'"></div>
      <div class="map-glow" *ngIf="mode === 'dialog'"></div>
      <div class="scanlines" *ngIf="mode === 'dialog'"></div>

      <div class="label" *ngIf="mode === 'dialog'">
        <div class="title">GLOBAL PINBALL MAP</div>
        <div class="subtitle">Machine density snapshot</div>
      </div>

      <div class="attribution" *ngIf="mode === 'dialog'">Data: Pinball Map</div>
      <div class="debug" *ngIf="mode === 'dialog'">map {{ mapWidth }}x{{ mapHeight }}</div>

      <div class="projection" *ngIf="mode !== 'dialog'">
        <div class="projection-core">
          <div class="projection-ring ring-1"></div>
          <div class="projection-ring ring-2"></div>
          <div class="projection-ring ring-3"></div>
          <div class="projection-grid"></div>
          <div class="projection-title">PINBALL PROJECTION</div>
        </div>
        <div class="projection-glow"></div>
        <div class="projection-lines"></div>
      </div>

      <div class="empty" *ngIf="ports.length === 0">
        <div class="empty-card">
          <div class="empty-title">Snapshot Pending</div>
          <div class="empty-subtitle">Awaiting Pinball Map ingest</div>
          <div class="empty-grid">
            <span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .port-tile {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: radial-gradient(circle at 15% 20%, rgba(0, 255, 255, 0.08), transparent 55%),
        radial-gradient(circle at 80% 30%, rgba(0, 200, 255, 0.12), transparent 60%),
        #050a12;
      box-shadow:
        inset 0 0 20px rgba(0, 0, 0, 0.65),
        0 8px 18px rgba(0, 0, 0, 0.45);
    }

    .map {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: #050a12;
      width: 100%;
      height: 100%;
    }

    .map.hidden {
      opacity: 0;
      pointer-events: none;
    }

    .map-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 65% 45%, rgba(0, 255, 255, 0.12), transparent 60%);
      mix-blend-mode: screen;
      pointer-events: none;
      z-index: 2;
    }

    .scanlines {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        to bottom,
        rgba(10, 40, 60, 0.18) 0 2px,
        rgba(5, 12, 18, 0.1) 2px 4px
      );
      opacity: 0.35;
      pointer-events: none;
      z-index: 3;
    }

    .label {
      position: absolute;
      left: 10px;
      bottom: 10px;
      z-index: 4;
      text-transform: uppercase;
      letter-spacing: 1.8px;
      color: #b8f7ff;
      text-shadow: 0 0 12px rgba(0, 255, 255, 0.35);
      font-size: 9px;
    }

    .attribution {
      position: absolute;
      right: 8px;
      bottom: 8px;
      z-index: 4;
      font-size: 8px;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: rgba(184, 247, 255, 0.6);
    }

    .debug {
      position: absolute;
      left: 10px;
      top: 10px;
      z-index: 6;
      font-size: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.7);
      background: rgba(0, 0, 0, 0.45);
      padding: 4px 6px;
      border-radius: 6px;
    }

    .title {
      font-weight: 800;
      font-size: 11px;
    }

    .subtitle {
      opacity: 0.7;
      font-size: 9px;
    }

    .empty {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5;
      background:
        radial-gradient(circle at 50% 40%, rgba(0, 255, 255, 0.08), transparent 60%),
        rgba(0, 6, 12, 0.6);
      color: rgba(184, 247, 255, 0.85);
    }

    .empty-card {
      width: 70%;
      max-width: 220px;
      padding: 10px 12px;
      border: 1px solid rgba(46, 242, 255, 0.35);
      background: rgba(4, 12, 18, 0.7);
      box-shadow:
        0 0 16px rgba(46, 242, 255, 0.25),
        inset 0 0 12px rgba(0, 0, 0, 0.6);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      text-align: center;
    }

    .empty-title {
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .empty-subtitle {
      font-size: 9px;
      opacity: 0.7;
      margin-bottom: 8px;
    }

    .empty-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
    }

    .empty-grid span {
      height: 4px;
      border-radius: 999px;
      background: rgba(46, 242, 255, 0.25);
      box-shadow: 0 0 8px rgba(46, 242, 255, 0.25);
    }

    .projection {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      z-index: 4;
    }

    .projection-core {
      position: relative;
      width: 140px;
      height: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateY(-6px);
    }

    .projection-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1px solid rgba(46, 242, 255, 0.4);
      box-shadow: 0 0 14px rgba(46, 242, 255, 0.35);
      animation: pulse-ring 4s ease-in-out infinite;
    }

    .projection-ring.ring-1 {
      transform: scale(0.55);
      animation-delay: 0s;
    }

    .projection-ring.ring-2 {
      transform: scale(0.75);
      animation-delay: 1.1s;
    }

    .projection-ring.ring-3 {
      transform: scale(0.95);
      animation-delay: 2.2s;
    }

    .projection-grid {
      position: absolute;
      width: 110px;
      height: 60px;
      border-radius: 10px;
      background:
        repeating-linear-gradient(
          to right,
          rgba(46, 242, 255, 0.35) 0 1px,
          transparent 1px 10px
        ),
        repeating-linear-gradient(
          to bottom,
          rgba(46, 242, 255, 0.2) 0 1px,
          transparent 1px 10px
        );
      box-shadow: 0 0 18px rgba(46, 242, 255, 0.4);
      transform: perspective(240px) rotateX(65deg);
      animation: grid-float 3s ease-in-out infinite;
    }

    .projection-title {
      position: absolute;
      bottom: 57px;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(184, 247, 255, 0.9);
      text-shadow: 0 0 14px rgba(46, 242, 255, 0.6);
    }

    .projection-glow {
      position: absolute;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(46, 242, 255, 0.18), transparent 70%);
      animation: glow-breathe 5s ease-in-out infinite;
    }

    .projection-lines {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        to bottom,
        rgba(20, 50, 70, 0.3) 0 2px,
        transparent 2px 6px
      );
      opacity: 0.35;
      mix-blend-mode: screen;
      pointer-events: none;
    }

    @keyframes pulse-ring {
      0% { opacity: 0.25; transform: scale(0.45); }
      50% { opacity: 0.7; }
      100% { opacity: 0.25; transform: scale(1); }
    }

    @keyframes grid-float {
      0%, 100% { transform: perspective(240px) rotateX(65deg) translateY(0); }
      50% { transform: perspective(240px) rotateX(65deg) translateY(-6px); }
    }

    @keyframes glow-breathe {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.75; }
    }

    .port-tile.dialog .label {
      left: 22px;
      bottom: 18px;
      font-size: 12px;
    }

    .port-tile.dialog .title {
      font-size: 16px;
    }

    .port-tile.dialog .subtitle {
      font-size: 12px;
    }

    .port-tile.dialog {
      min-height: 100%;
    }

    :host ::ng-deep .leaflet-container {
      background: #050a12;
      font-family: var(--font-body);
    }

    :host ::ng-deep .leaflet-control-container {
      display: none;
    }

    :host ::ng-deep .leaflet-tooltip,
    :host ::ng-deep .leaflet-popup-content-wrapper,
    :host ::ng-deep .leaflet-popup-tip {
      background: rgba(4, 12, 18, 0.95);
      color: #b8f7ff;
      border: 1px solid rgba(0, 255, 255, 0.35);
      box-shadow: 0 0 18px rgba(0, 255, 255, 0.25);
    }

    :host ::ng-deep .leaflet-popup-content {
      margin: 10px 12px;
      font-size: 11px;
      letter-spacing: 0.4px;
    }
  `]
})
export class TileGlobalPortTraffic implements AfterViewInit, OnDestroy {
  @Input() mode: 'tile' | 'dialog' = 'tile';
  @ViewChild('map', { static: true }) mapEl!: ElementRef<HTMLDivElement>;

  ports: PinballLocationSnapshot[] = [];
  private map: L.Map & { fitBounds?: (bounds: number[][], options?: { padding?: [number, number]; maxZoom?: number }) => void } | null = null;
  private markerLayer = L.layerGroup();
  private resizeObserver: ResizeObserver | null = null;
  mapWidth = 0;
  mapHeight = 0;

  constructor(private http: HttpClient) {}

  async ngAfterViewInit(): Promise<void> {
    this.map = L.map(this.mapEl.nativeElement, {
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      touchZoom: true,
      tap: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 4,
      minZoom: 1
    }).addTo(this.map);

    this.markerLayer.addTo(this.map);

    if (this.mode === 'dialog') {
      this.map.fitBounds?.(
        [
          [34, -11],
          [71, 32]
        ],
        { padding: [12, 12], maxZoom: 4 }
      );
    } else {
      this.map.setView([15, 0], 1.1);
    }

    await this.loadSnapshot();
    this.renderPorts();

    this.scheduleInvalidate();

    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      const { width, height } = entry.contentRect;
      this.mapWidth = Math.round(width);
      this.mapHeight = Math.round(height);
      this.map?.invalidateSize();
    });
    this.resizeObserver.observe(this.mapEl.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.map?.remove();
    this.map = null;
  }

  private async loadSnapshot(): Promise<void> {
    try {
      const payload = await firstValueFrom(
        this.http.get<unknown>('assets/data/pinball-snapshot.json', { headers: { 'Cache-Control': 'no-store' } })
      );
      if (!Array.isArray(payload)) {
        return;
      }
      const normalized = payload.filter((item) => this.isLocationSnapshot(item));
      this.ports = this.selectTopPorts(normalized, 50);
    } catch {
      this.ports = [];
    }
  }

  private isLocationSnapshot(value: unknown): value is PinballLocationSnapshot {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const record = value as Record<string, unknown>;
    return (
      typeof record['id'] === 'number' &&
      typeof record['name'] === 'string' &&
      typeof record['latitude'] === 'number' &&
      typeof record['longitude'] === 'number' &&
      typeof record['city'] === 'string' &&
      typeof record['country'] === 'string' &&
      typeof record['machineCount'] === 'number'
    );
  }

  private renderPorts(): void {
    if (!this.map) {
      return;
    }
    this.markerLayer.clearLayers();

    const maxTotal = this.ports.reduce((max, location) => {
      const total = location.machineCount;
      return total > max ? total : max;
    }, 0);

    const minRadius = this.mode === 'dialog' ? 4 : 2.5;
    const maxRadius = this.mode === 'dialog' ? 12 : 7;
    const formatter = new Intl.NumberFormat('en-US');

    this.ports.forEach((location) => {
      const total = location.machineCount;
      const ratio = maxTotal > 0 ? total / maxTotal : 0;
      const scaled = ratio > 0 ? Math.log10(1 + ratio * 9) : 0;
      const radius = minRadius + scaled * (maxRadius - minRadius);

      const marker = L.circleMarker([location.latitude, location.longitude], {
        radius,
        color: '#2ef2ff',
        weight: 1,
        fillColor: '#00f7ff',
        fillOpacity: 0.55,
        opacity: 0.9
      });

      const tooltip = `${location.name} (${location.machineCount} machines)`;
      marker.bindTooltip(tooltip, { direction: 'top', offset: [0, -4] });

      const machines = (location.topMachines ?? []).slice(0, 6);
      const machineLines = machines.length
        ? machines.map((machine) => `<div>${this.escapeHtml(machine)}</div>`).join('')
        : '<div>No machine list</div>';

      const popup = `
        <div><strong>${location.name}</strong></div>
        <div>${location.city}, ${location.country}</div>
        <div>Machines: ${formatter.format(location.machineCount)}</div>
        <div style="margin-top:6px;"><strong>Top machines</strong></div>
        <div>${machineLines}</div>
      `;
      marker.bindPopup(popup, { closeButton: false, autoPan: false });

      marker.addTo(this.markerLayer);
    });
  }

  private scheduleInvalidate(): void {
    const delays = [0, 300, 700];
    delays.forEach((delay) => {
      setTimeout(() => {
        this.map?.invalidateSize();
      }, delay);
    });
  }

  private selectTopPorts(locations: PinballLocationSnapshot[], cap: number): PinballLocationSnapshot[] {
    return [...locations]
      .sort((a, b) => b.machineCount - a.machineCount)
      .slice(0, cap);
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
