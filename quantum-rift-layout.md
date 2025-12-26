# quantum-rift-wireframes.md
## Screen Wireframe & Functional Region Definitions

This document defines all player-facing screens in Quantum Rift.
Each screen is described via functional regions with tagged responsibilities.

This document:
- Defines placement, visibility, and purpose
- Does NOT define visuals, styles, or interaction timing
- Is authoritative for UI capability mapping

---

# GLOBAL UI CONVENTIONS

These regions exist on all primary screens unless explicitly excluded.

## REGION: TOP_BAR
- Purpose: Global context and control
- Always Visible: Yes
- Contains:
  - Current Reality Node (if applicable)
  - Time controls (pause / speed)
  - Global alerts indicator
  - Access to Logs & Analysis

## REGION: RIGHT_INSPECTOR
- Purpose: Contextual details for selection
- Always Visible: Yes
- Contents vary by screen
- Read-only unless explicitly noted

## REGION: BOTTOM_LOG
- Purpose: Event history and system messages
- Always Visible: Collapsed by default
- Expandable
- No direct actions

---

# SCREEN: GALACTIC_NODE_MAP

Primary strategic overview.

## REGION: MAIN_CANVAS
- Displays:
  - All known Reality Nodes
  - Probability Channels between nodes
  - Active Fleets (in transit)
- Allows:
  - Node selection
  - Route inspection
- Does NOT allow:
  - Direct trading
  - Construction inside nodes

## REGION: LEFT_ACTION_PANEL
- Purpose: High-level actions
- Contains:
  - Establish Route
  - Dispatch Fleet
  - Open Market Ledger
  - Open Governance Panel
  - Open Tech Research

## REGION: RIGHT_INSPECTOR (Node Selected)
- Displays:
  - Node class
  - Stability / coherence
  - Population
  - Active structures
  - Current governance seats

---

# SCREEN: NODE_DETAIL_VIEW

Focused view of a single Reality Node.

## REGION: MAIN_CANVAS
- Displays:
  - Node layout (abstracted)
  - Structures
  - Local routes
- Allows:
  - Structure placement
  - Structure upgrades

## REGION: LEFT_ACTION_PANEL
- Contains:
  - Build Structure
  - Assign Observer
  - Local Market
  - Node Policies

## REGION: RIGHT_INSPECTOR (Structure Selected)
- Displays:
  - Input/output commodities
  - Throughput
  - Stability modifiers
  - Upkeep requirements

---

# SCREEN: MARKET_LEDGER

Trade and pricing interface.

## REGION: MAIN_TABLE
- Displays:
  - All known commodities
  - Prices per node
  - Volatility indicators
- Allows:
  - Buy orders
  - Sell orders
  - Contract setup

## REGION: LEFT_FILTER_PANEL
- Filters:
  - Commodity category
  - Node
  - Volatility class

## REGION: RIGHT_INSPECTOR (Commodity Selected)
- Displays:
  - Historical price chart
  - Node affinity
  - Decay characteristics

---

# SCREEN: FLEET_CONTROL

Fleet management and routing.

## REGION: MAIN_LIST
- Displays:
  - All owned fleets
  - Current status (idle, in transit, collapsed)
- Allows:
  - Select fleet
  - Issue movement orders

## REGION: RIGHT_INSPECTOR (Fleet Selected)
- Displays:
  - Vessel class
  - Observer
  - Cargo
  - Route risk
  - ETA distribution

---

# SCREEN: OBSERVER_ROSTER

Observer (captain) management.

## REGION: MAIN_LIST
- Displays:
  - All observers
  - Traits summary
- Allows:
  - Assign observer
  - Reassign observer

## REGION: RIGHT_INSPECTOR (Observer Selected)
- Displays:
  - Risk bias
  - Collapse control
  - Political alignment
  - Active assignment

---

# SCREEN: TECH_RESEARCH

Technology progression.

## REGION: MAIN_TREE_VIEW
- Displays:
  - All tech trees
  - Locked/unlocked nodes
- Allows:
  - Select research target

## REGION: RIGHT_INSPECTOR (Tech Selected)
- Displays:
  - Effects (descriptive)
  - Prerequisites
  - Research cost

---

# SCREEN: GOVERNANCE_PANEL

Political influence interface.

## REGION: MAIN_TABLE
- Displays:
  - All governance seats
  - Current holders
  - Election timers
- Allows:
  - Campaign investment
  - Policy influence

## REGION: RIGHT_INSPECTOR (Seat Selected)
- Displays:
  - Authority scope
  - Active modifiers
  - Required commodities

---

# SCREEN: LOGS_AND_ANALYSIS

System transparency interface.

## REGION: MAIN_LOG
- Displays:
  - Trade events
  - Route collapses
  - Political changes
- Read-only

## REGION: LEFT_FILTER_PANEL
- Filters:
  - Event type
  - Node
  - Time range

---

# END OF WIREFRAME DEFINITIONS

No visual styling, animations, or interaction timing is specified here.
