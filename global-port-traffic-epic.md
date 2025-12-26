# Epic: Global Pinball Map Resume Tile

## Epic Goal

Create a visually striking, interactive **Global Pinball Map** tile for the Angular resume portal. The tile displays a **static world map snapshot** of pinball locations and machine density using the **Pinball Map API**. The tile should match the existing neon / sci-fi aesthetic of other tiles (e.g. Hyperlane).

---

## Business Value

* Demonstrates real-world data integration (external API consumption).
* Showcases geospatial visualization skills (Leaflet).
* Communicates cultural footprint at a glance (pinball location density).
* Acts as a portfolio artifact highlighting frontend + data engineering capabilities.

---

## Success Criteria

* Tile renders correctly at **200x100 px**.
* World map is visible with dark theme.
* Locations are plotted at correct geographic coordinates.
* Hovering or clicking a location reveals:
  * Location name
  * City / country
  * Machine count
  * Top machines at the location (names)
* Map is **non-draggable** and **non-zoomable** (static snapshot behavior).
* Styling is consistent with existing neon / CRT aesthetic.
* Attribution is visible: **"Data: Pinball Map"**.

---

## Non-Goals

* No real-time updates or animations.
* No full-screen map view.
* No per-user personalization.
* No authentication or user accounts.

---

## Data & API Requirements

### Primary Data Source

* Pinball Map API v1

  * Locations per region (`/api/v1/region/:region/locations.json`)
  * Machine details per location

### Snapshot Strategy

* Fetch latest available data via API.
* Auto-select regions where location country is in OECD Western Europe list (AT, BE, CH, DE, DK, ES, FI, FR, GB, GR, IE, IS, IT, LU, NL, NO, PT, SE, UK).
* Normalize into a compact JSON asset.
* Limit to **top 50 locations** by machine count.

### Expected Data Shape (Logical)

```ts
interface PinballLocationSnapshot {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  machineCount: number;
  topMachines?: string[];
}
```

---

## Architecture Overview

### Angular

* Standalone component: `TileGlobalPortTraffic` (repurposed for pinball map)
* Uses `HttpClient` for snapshot loading
* Lifecycle hook: `AfterViewInit` for map initialization

### Mapping

* Library: Leaflet
* Tile provider: Dark-themed basemap (Carto Dark Matter)
* Rendering method: `CircleMarker`

---

## Implementation Tasks

### Task 1: Project Setup

* Install Leaflet via npm
* Add Leaflet CSS to global styles
* Verify map renders in Angular environment

### Task 2: Tile Skeleton

* Create / reuse standalone Angular component
* Match existing tile dimensions and shadows
* Add label overlay with neon text styling
* Add required attribution overlay

### Task 3: Leaflet Map Initialization

* Initialize map inside component lifecycle
* Disable all interactive gestures:
  * Dragging
  * Zoom
  * Scroll
* Set world-level center and zoom

### Task 4: Data Integration

* Create fetch script for Pinball Map API
* Normalize responses into `PinballLocationSnapshot` objects
* Bake `pinball-snapshot.json` into assets

### Task 5: Location Visualization

* Plot each location as a `CircleMarker`
* Radius scaled by machine count (log scaling)
* Neon cyan color scheme
* Semi-transparent fill for glow effect

### Task 6: Interactivity

* Tooltip on hover (quick summary)
* Popup on click (location + machine list)
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
* Avoid per-marker API calls at runtime
* Precompute marker radius scaling
* No animations inside the map canvas

---

## Risks & Mitigations

| Risk                   | Mitigation                     |
| ---------------------- | ------------------------------ |
| Marker overlap         | Limit locations or reduce size |
| API rate limits        | Use baked snapshot             |
| Small tile readability | Use tooltips and popups        |
| Missing coordinates    | Skip entries without lat/lon   |

---

## Acceptance Checklist

* [ ] Tile renders with correct dimensions
* [ ] Map loads without console errors
* [ ] Locations appear globally distributed
* [ ] Hover shows tooltip
* [ ] Click opens popup
* [ ] Visual style matches portal aesthetic
* [ ] Attribution visible

---

## Definition of Done

The **Global Pinball Map** tile is deployed, visually coherent with the portal, data-accurate, performant, and communicates global pinball density at a glance.
