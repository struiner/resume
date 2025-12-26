import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { firstValueFrom } from 'rxjs';

type PortSnapshot = {
  name: string;
  locode: string;
  latitude: number;
  longitude: number;
  importTEU: number;
  exportTEU: number;
  vesselCalls: number;
};

@Component({
  selector: 'tile-global-port-traffic',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="port-tile" [class.dialog]="mode === 'dialog'">
      <div class="map" #map></div>
      <div class="map-glow"></div>
      <div class="scanlines"></div>

      <div class="label">
        <div class="title">GLOBAL PORT TRAFFIC</div>
        <div class="subtitle">Trade flux snapshot</div>
      </div>

      <div class="empty" *ngIf="ports.length === 0">
        Snapshot pending
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
      font-size: 10px;
      letter-spacing: 1.4px;
      text-transform: uppercase;
      color: rgba(184, 247, 255, 0.75);
      background: rgba(0, 6, 12, 0.45);
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

  ports: PortSnapshot[] = [];
  private map: L.Map | null = null;
  private markerLayer = L.layerGroup();

  constructor(private http: HttpClient) {}

  async ngAfterViewInit(): Promise<void> {
    this.map = L.map(this.mapEl.nativeElement, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
      tap: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 4,
      minZoom: 1
    }).addTo(this.map);

    this.markerLayer.addTo(this.map);

    const zoom = this.mode === 'dialog' ? 1.4 : 1.1;
    this.map.setView([15, 0], zoom);

    await this.loadSnapshot();
    this.renderPorts();

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 0);
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  private async loadSnapshot(): Promise<void> {
    try {
      const payload = await firstValueFrom(
        this.http.get<unknown>('/assets/data/port-snapshot.json', { headers: { 'Cache-Control': 'no-store' } })
      );
      if (!Array.isArray(payload)) {
        return;
      }
      const normalized = payload.filter((item) => this.isPortSnapshot(item));
      this.ports = this.selectTopPorts(normalized, 50);
    } catch {
      this.ports = [];
    }
  }

  private isPortSnapshot(value: unknown): value is PortSnapshot {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const record = value as Record<string, unknown>;
    return (
      typeof record['name'] === 'string' &&
      typeof record['locode'] === 'string' &&
      typeof record['latitude'] === 'number' &&
      typeof record['longitude'] === 'number' &&
      typeof record['importTEU'] === 'number' &&
      typeof record['exportTEU'] === 'number' &&
      typeof record['vesselCalls'] === 'number'
    );
  }

  private renderPorts(): void {
    if (!this.map) {
      return;
    }
    this.markerLayer.clearLayers();

    const maxTotal = this.ports.reduce((max, port) => {
      const total = port.importTEU + port.exportTEU;
      return total > max ? total : max;
    }, 0);

    const minRadius = this.mode === 'dialog' ? 4 : 2.5;
    const maxRadius = this.mode === 'dialog' ? 12 : 7;
    const formatter = new Intl.NumberFormat('en-US');

    this.ports.forEach((port) => {
      const total = port.importTEU + port.exportTEU;
      const ratio = maxTotal > 0 ? total / maxTotal : 0;
      const scaled = ratio > 0 ? Math.log10(1 + ratio * 9) : 0;
      const radius = minRadius + scaled * (maxRadius - minRadius);

      const marker = L.circleMarker([port.latitude, port.longitude], {
        radius,
        color: '#2ef2ff',
        weight: 1,
        fillColor: '#00f7ff',
        fillOpacity: 0.55,
        opacity: 0.9
      });

      const tooltip = `${port.name} (${port.locode})`;
      marker.bindTooltip(tooltip, { direction: 'top', offset: [0, -4] });

      const popup = `
        <div><strong>${port.name}</strong></div>
        <div>Imports: ${formatter.format(port.importTEU)} TEU</div>
        <div>Exports: ${formatter.format(port.exportTEU)} TEU</div>
        <div>Vessels: ${formatter.format(port.vesselCalls)}</div>
      `;
      marker.bindPopup(popup, { closeButton: false, autoPan: false });

      marker.addTo(this.markerLayer);
    });
  }

  private selectTopPorts(ports: PortSnapshot[], cap: number): PortSnapshot[] {
    return [...ports]
      .sort((a, b) => (b.importTEU + b.exportTEU) - (a.importTEU + a.exportTEU))
      .slice(0, cap);
  }
}
