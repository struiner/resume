# Global Port Traffic Tile Ledger

This file instantiates the ledger-driven protocol for the Global Port Traffic tile.

---

## Task:ROOT_PORT_TRAFFIC
- **Goal**: Produce a Global Port Traffic tile with a static world map and port activity overlays.
- **Inputs**: None
- **Outputs**:
  - Tile UI component
  - Map rendering layer
  - Port data integration
- **Subtasks**:
  - TASK:DATA_PORTS
  - TASK:VISUAL_PORTS
  - TASK:IMPLEMENTATION_PORTS
- **Status**: DONE

## Task:DATA_PORTS
- **Goal**: Define the authoritative EconDB data source and snapshot strategy.
- **Inputs**: None
- **Outputs**:
  - API endpoint and auth requirements
  - Snapshot refresh cadence
  - Top-N port selection rule
- **Blocked By**: None
- **Status**: DONE

## Task:VISUAL_PORTS
- **Goal**: Apply the neon/CRT visual direction from the epic.
- **Inputs**: None
- **Outputs**:
  - Dark basemap styling
  - Cyan marker palette
  - Static map behavior
- **Status**: DONE

## Task:IMPLEMENTATION_PORTS
- **Goal**: Implement the tile and hook data into the map view.
- **Inputs**:
  - Ledger:PORTS_API_ENDPOINT
  - Ledger:PORTS_API_AUTH
  - Ledger:PORTS_SNAPSHOT_STRATEGY
  - Ledger:PORTS_TOP_N
- **Outputs**:
  - Angular standalone tile component
  - Map rendering with markers and tooltips
- **Blocked By**: None
- **Status**: DONE

---

### Ledger:PORTS_API_ENDPOINT
- **Status**: RESOLVED
- **Type**: Dependency
- **Scope**: Tech
- **Statement**: What is the exact EconDB Ports API base URL and endpoint path?
- **Reason**: The tile must fetch real data without inventing URLs.
- **Resolution**: Base URL `https://api.econdb.com`, primary endpoint `GET /ports/vessel-schedule`.
- **Introduced By**: Task:DATA_PORTS

### Ledger:PORTS_API_AUTH
- **Status**: RESOLVED
- **Type**: Dependency
- **Scope**: Tech
- **Statement**: What authentication (API key, headers, or tokens) is required by EconDB?
- **Reason**: Auth requirements cannot be assumed.
- **Resolution**: API key via `Authorization: Bearer <YOUR_API_KEY>` or `X-API-Key: <YOUR_API_KEY>`. Keys must not be shipped in the client.
- **Introduced By**: Task:DATA_PORTS

### Ledger:PORTS_SNAPSHOT_STRATEGY
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: Should the port snapshot be baked into the build or fetched live at runtime?
- **Reason**: Snapshot strategy affects caching, availability, and build flow.
- **Resolution**: Baked snapshot asset at `/assets/data/port-snapshot.json`; no live API calls in the client.
- **Introduced By**: Task:DATA_PORTS

### Ledger:PORTS_TOP_N
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Content
- **Statement**: How many top ports should be displayed in the tile?
- **Reason**: Marker density and readability depend on a fixed cap.
- **Resolution**: Top 50 ports by total throughput (importTEU + exportTEU).
- **Introduced By**: Task:DATA_PORTS
