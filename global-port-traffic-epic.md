# Epic: Global Port Traffic Resume Tile

## Epic Goal

Create a visually striking, interactive **Global Port Traffic** tile for the Angular resume portal. The tile will display a **static world map snapshot** with **major ports**, showing their **economic activity** (imports, exports, cargo volume) and **ship engagement**, using data from the **EconDB Ports API**. The tile should match the existing neon / sci‑fi aesthetic of other tiles (e.g. Hyperlane).

---

## Business Value

* Demonstrates real-world data integration (external API consumption).
* Showcases geospatial visualization skills (Leaflet).
* Communicates economic intuition at a glance (trade flows, port importance).
* Acts as a portfolio artifact highlighting frontend + data engineering capabilities.

---

## Success Criteria

* Tile renders correctly at **200×100 px**.
* World map is visible with dark theme.
* Ports are plotted at correct geographic locations.
* Hovering or clicking a port reveals:

  * Port name
  * Import volume
  * Export volume
  * Number of ships / vessel calls
* Map is **non-draggable** and **non-zoomable** (static snapshot behavior).
* Styling is consistent with existing neon / CRT aesthetic.

---

## Non-Goals

* No real-time updates or animations.
* No full-screen map view.
* No historical time-series navigation.
* No authentication or user-specific filtering.

---

## Data & API Requirements

### Primary Data Source

* EconDB Ports API

  * Ports list (top ports by traffic)
  * Port-level container imports / exports
  * Vessel call counts or schedules

### Data Snapshot Strategy

* Fetch latest available monthly snapshot.
* Cache or bake snapshot into build if necessary.
* Limit to **top N ports** (recommended: 50–100) to avoid visual clutter.

### Expected Data Shape (Logical)

```ts
interface PortSnapshot {
  name: string;
  locode: string;
  latitude: number;
  longitude: number;
  importTEU: number;
  exportTEU: number;
  vesselCalls: number;
}
```

---

## Architecture Overview

### Angular

* Standalone component: `TilePortsComponent`
* Uses `HttpClient` for data fetching
* Lifecycle hook: `AfterViewInit` for map initialization

### Mapping

* Library: Leaflet
* Tile provider: Dark-themed basemap (e.g. Carto Dark Matter)
* Rendering method: `CircleMarker`

---

## Implementation Tasks

### Task 1: Project Setup

* Install Leaflet via npm
* Add Leaflet CSS to global styles
* Verify map renders in Angular environment

### Task 2: Tile Skeleton

* Create standalone Angular component
* Match existing tile dimensions and shadows
* Add label overlay with neon text styling

### Task 3: Leaflet Map Initialization

* Initialize map inside component lifecycle
* Disable all interactive gestures:

  * Dragging
  * Zoom
  * Scroll
* Set world-level center and zoom

### Task 4: Data Integration

* Create service for EconDB API interaction
* Fetch port snapshot data
* Normalize API response into `PortSnapshot` objects

### Task 5: Port Visualization

* Plot each port as a `CircleMarker`
* Radius scaled by total throughput
* Neon cyan color scheme
* Semi-transparent fill for glow effect

### Task 6: Interactivity

* Tooltip on hover (quick summary)
* Popup on click (detailed stats)
* Ensure interactions do not enable map movement

### Task 7: Visual Polish

* Ensure markers are legible at small scale
* Adjust opacity and radius for dense regions
* Verify label readability over map

---

## UX & Visual Design Guidelines

* Background: deep navy / near-black
* Accent color: cyan (#0ff)
* Text: outlined, glowing, uppercase
* Map contrast should be subtle, not dominant
* Markers should feel like "energy nodes" on the globe

---

## Performance Considerations

* Avoid rendering >100 markers
* Avoid per-marker API calls
* Precompute marker radius scaling
* No animations inside the map canvas

---

## Risks & Mitigations

| Risk                   | Mitigation                     |
| ---------------------- | ------------------------------ |
| Marker overlap         | Limit ports or reduce radius   |
| API rate limits        | Cache snapshot data            |
| Small tile readability | Use tooltips instead of labels |
| Missing coordinates    | Maintain LOCODE → lat/lng map  |

---

## Acceptance Checklist

* [ ] Tile renders with correct dimensions
* [ ] Map loads without console errors
* [ ] Ports appear globally distributed
* [ ] Hover shows tooltip
* [ ] Click opens popup
* [ ] Visual style matches portal aesthetic

---

## Future Enhancements (Optional)

* Expand tile into full-screen map
* Animate trade intensity pulses
* Filter by importer vs exporter
* Overlay shipping lanes
* Link to vessel-level drilldown

---

## Definition of Done

The **Global Port Traffic** tile is deployed, visually coherent with the portal, data-accurate, performant, and communicates global trade dynamics at a glance.
