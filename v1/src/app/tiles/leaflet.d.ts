declare module 'leaflet' {
  export interface Map {
    setView(latlng: [number, number], zoom: number): this;
    invalidateSize(): void;
    remove(): void;
  }

  export interface LayerGroup {
    addTo(map: Map): this;
    clearLayers(): this;
  }

  export interface TileLayer {
    addTo(map: Map): this;
  }

  export interface CircleMarker {
    bindTooltip(content: string, options?: { direction?: string; offset?: [number, number] }): this;
    bindPopup(content: string, options?: { closeButton?: boolean; autoPan?: boolean }): this;
    addTo(layer: LayerGroup): this;
  }

  export function map(
    element: HTMLElement,
    options?: Record<string, unknown>
  ): Map;
  export function layerGroup(): LayerGroup;
  export function tileLayer(url: string, options?: Record<string, unknown>): TileLayer;
  export function circleMarker(
    latlng: [number, number],
    options?: Record<string, unknown>
  ): CircleMarker;
}
