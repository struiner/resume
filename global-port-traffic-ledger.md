# Global Pinball Map Tile Ledger

This file instantiates the ledger-driven protocol for the Global Pinball Map tile.

---

## Task:ROOT_PINBALL_MAP
- **Goal**: Produce a Global Pinball Map tile with a static world map and location density overlays.
- **Inputs**: None
- **Outputs**:
  - Tile UI component
  - Map rendering layer
  - Pinball Map data integration
- **Subtasks**:
  - TASK:DATA_PINBALL
  - TASK:VISUAL_PINBALL
  - TASK:IMPLEMENTATION_PINBALL
- **Status**: DONE

## Task:DATA_PINBALL
- **Goal**: Define the authoritative Pinball Map data source and snapshot strategy.
- **Inputs**: None
- **Outputs**:
  - API endpoint paths
  - Snapshot strategy
  - Top-N location selection rule
- **Blocked By**: None
- **Status**: DONE

## Task:VISUAL_PINBALL
- **Goal**: Apply the neon/CRT visual direction from the epic.
- **Inputs**: None
- **Outputs**:
  - Dark basemap styling
  - Cyan marker palette
  - Static map behavior
  - Required attribution overlay
- **Status**: DONE

## Task:IMPLEMENTATION_PINBALL
- **Goal**: Implement the tile and hook snapshot data into the map view.
- **Inputs**:
  - Ledger:PINBALL_ENDPOINT_LOCATIONS
  - Ledger:PINBALL_ENDPOINT_MACHINE_DETAILS
  - Ledger:PINBALL_SNAPSHOT_STRATEGY
  - Ledger:PINBALL_TOP_N
- **Outputs**:
  - Angular standalone tile component
  - Map rendering with markers and tooltips
  - Snapshot build script
- **Blocked By**: None
- **Status**: DONE

---

### Ledger:PINBALL_ENDPOINT_LOCATIONS
- **Status**: RESOLVED
- **Type**: Dependency
- **Scope**: Tech
- **Statement**: What is the exact Pinball Map endpoint for global locations?
- **Reason**: The tile must fetch real data without inventing URLs.
- **Resolution**: `GET https://pinballmap.com/api/v1/locations.json`
- **Introduced By**: Task:DATA_PINBALL

### Ledger:PINBALL_ENDPOINT_MACHINE_DETAILS
- **Status**: RESOLVED
- **Type**: Dependency
- **Scope**: Tech
- **Statement**: What is the endpoint for machine details at a location?
- **Reason**: Machine list data must be explicit.
- **Resolution**: `GET https://pinballmap.com/api/v1/locations/:id/machine_details.json`
- **Introduced By**: Task:DATA_PINBALL

### Ledger:PINBALL_SNAPSHOT_STRATEGY
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: Should the snapshot be baked into the build or fetched live at runtime?
- **Reason**: Snapshot strategy affects caching, availability, and build flow.
- **Resolution**: Baked JSON asset at `/assets/data/pinball-snapshot.json`; no live API calls in the client.
- **Introduced By**: Task:DATA_PINBALL

### Ledger:PINBALL_TOP_N
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Content
- **Statement**: How many top locations should be displayed in the tile?
- **Reason**: Marker density and readability depend on a fixed cap.
- **Resolution**: Top 50 locations by machine count.
- **Introduced By**: Task:DATA_PINBALL

### Ledger:PINBALL_REGIONS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Content
- **Statement**: Which region slugs should be sampled for the global snapshot?
- **Reason**: The locations endpoint requires a region filter.
- **Resolution**: Auto-select regions where location country is in OECD Western Europe list (AT, BE, CH, DE, DK, ES, FI, FR, GB, GR, IE, IS, IT, LU, NL, NO, PT, SE, UK).
- **Introduced By**: Task:DATA_PINBALL
