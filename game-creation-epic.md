# DYZ (C) THE LEDGER-DRIVEN RECURSIVE GAME CREATION PROTOCOL

## (A No-Assumptions, No-Skipped-Steps System)

---

## PURPOSE

This document defines a **recursive, ledger-driven process** for creating a complete game.

If followed exactly and executed repeatedly:

* The process always converges
* No assumptions are silently made
* All uncertainty is surfaced, tracked, and resolved
* The final result is a finished, playable game

This protocol exists to solve one problem:

> Agents tend to invent details when they should ask questions.

This system makes invention illegal.

---

## PRIME DIRECTIVE (NON-NEGOTIABLE)

> Never invent information.
> Never assume defaults.
> Never "fill in the gaps."
> If uncertain, STOP and LEDGER.

Violating this rule invalidates all output.

---

## CORE PRINCIPLE

Progress is allowed only through:

* Explicit information
* Explicit decisions
* Explicit ledger resolutions

Everything else is forbidden.

---

# SECTION 1 - FUNDAMENTAL STRUCTURES

All work is expressed using only Markdown and the following structures.

---

## 1.1 LEDGER ENTRY (ATOMIC UNIT OF UNCERTAINTY)

A Ledger Entry represents one unresolved unknown.

```md
### Ledger:<ID>
- **Status**: OPEN | RESOLVED | BLOCKED
- **Type**: Question | Decision | Constraint | Dependency
- **Scope**: Vision | Gameplay | World | UI | Tech | Content | Meta
- **Statement**: <exact unknown or decision needed>
- **Reason**: <why this cannot be safely assumed>
- **Resolution**: <filled only when RESOLVED>
- **Introduced By**: <Task ID>
```

### Rules

* One ledger = one unknown
* If something might matter later, ledger it now
* Ledgers may block tasks
* Ledgers never disappear, only change status

---

## 1.2 TASK NODE (RECURSIVE WORK UNIT)

All work is performed via Tasks.

```md
## Task:<ID>
- **Goal**: <what this task produces>
- **Inputs**: <required resolved information>
- **Outputs**: <artifacts this task creates>
- **Blocked By**: <Ledger IDs>
- **Produces Ledgers**: <Ledger IDs>
- **Subtasks**: <Child Task IDs>
- **Status**: PENDING | BLOCKED | DONE
```

### Rules

* Tasks may not proceed if blocked
* Tasks may create ledgers
* Tasks may spawn subtasks
* Tasks only complete when outputs exist and no internal uncertainty remains

---

# SECTION 2 - EXECUTION LAW (MOST IMPORTANT)

This section overrides all other behavior.

---

## 2.1 TASK EXECUTION ALGORITHM

For every task, agents MUST follow these steps in order:

1. Read the task goal
2. Verify all Inputs
3. Check for ambiguity or missing info

   * If found -> create a Ledger Entry
4. Check Blocked By

   * If any OPEN ledger exists -> mark task BLOCKED and STOP
5. Produce Outputs

   * Only using resolved information
6. Detect new uncertainty

   * If discovered -> ledger it
7. Spawn Subtasks if needed
8. Set Status

   * DONE only if no unresolved uncertainty remains

DYS At no point may an agent proceed by "reasonable assumption."

---

## 2.2 UNCERTAINTY DETECTION CHECKLIST

Before writing any content, ask:

* Is this a player-facing rule?
* Is this a number or value?
* Is this a genre convention?
* Is this a technical limitation?
* Is this a tone or aesthetic choice?
* Is this a win/loss condition?

If yes and not explicitly known -> LEDGER IT

---

# SECTION 3 - RECURSION & DECOMPOSITION RULES

---

## 3.1 WHEN A TASK MUST SPLIT

A task must create subtasks if:

* It introduces more than 3 ledgers
* It mixes design and implementation
* It exceeds one conceptual scope
* It cannot be completed in one clear pass

Big tasks are illegal. Small tasks are mandatory.

---

## 3.2 LEDGER PROPAGATION RULE

All subtasks inherit:

* All unresolved ledgers from parent tasks
* All constraints already established

Nothing is forgotten. Ever.

---

# SECTION 4 - ROOT GAME TASK

```md
## Task:ROOT
- **Goal**: Produce a complete, playable game
- **Inputs**: None
- **Outputs**:
  - Game Vision
  - Core Gameplay Loop
  - Systems Design
  - World & Content
  - UI/UX
  - Technical Implementation
- **Subtasks**:
  - TASK:VISION
  - TASK:CORE_LOOP
  - TASK:WORLD
  - TASK:SYSTEMS
  - TASK:UI
  - TASK:TECH
- **Status**: PENDING
```

ROOT never completes until all ledgers are resolved.

---

# SECTION 5 - STANDARD DOMAIN TASKS

## TASK:VISION

```md
## Task:VISION
- **Goal**: Define what game is being made
- **Inputs**: None
- **Outputs**:
  - Genre
  - Player fantasy
  - Tone
  - Design pillars
```

---

## TASK:CORE_LOOP

```md
## Task:CORE_LOOP
- **Goal**: Define the player?DTs repeating gameplay loop
- **Inputs**:
  - Genre
  - Player fantasy
- **Outputs**:
  - Player actions
  - Feedback
  - Progression
  - Win/Loss conditions
```

---

## TASK:WORLD

```md
## Task:WORLD
- **Goal**: Define the game world and fiction
- **Inputs**:
  - Vision
- **Outputs**:
  - Setting
  - Entities
  - Rules of the world
```

---

## TASK:SYSTEMS

```md
## Task:SYSTEMS
- **Goal**: Define all gameplay systems
- **Inputs**:
  - Core Loop
- **Outputs**:
  - Mechanics
  - Resources
  - Progression systems
```

---

## TASK:UI

```md
## Task:UI
- **Goal**: Define how the player interacts with the game
- **Inputs**:
  - Systems
- **Outputs**:
  - Screens
  - Controls
  - Feedback mechanisms
```

---

## TASK:TECH

```md
## Task:TECH
- **Goal**: Define how the game is implemented
- **Inputs**:
  - Systems
  - UI
- **Outputs**:
  - Engine
  - Platform
  - Build/run instructions
```

---

# SECTION 6 - LEDGER RESOLUTION RULES

A ledger may ONLY be resolved by:

* Explicit user input
* Explicit prior document reference
* Explicit decision task

Never by inference.

---

# SECTION 7 - COMPLETION CRITERIA

The game is considered FINISHED when:

* No ledger has Status = OPEN
* All tasks are DONE
* Build/run steps exist
* A player can start, play, and win or lose

---

# SECTION 8 - AGENT MANTRA

> If I am not certain, I must stop and ledger.
> Progress without certainty is failure.

---

# SECTION 9 - GUARANTEE

If followed exactly:

* No skipped decisions
* No silent assumptions
* No design drift
* Slow but correct convergence
* A real, playable game

---

# SECTION 10 -- EPIC EXECUTION LOG (RESUME PORTAL DEMO)

This log instantiates the protocol for the resume portal tech demo.

## Task:ROOT (Instance: RESUME_DEMO)
- **Goal**: Produce a complete, playable embedded demo that showcases past interaction work
- **Inputs**: None
- **Outputs**:
  - Game Vision
  - Core Gameplay Loop
  - Systems Design
  - World & Content
  - UI/UX
  - Technical Implementation
- **Subtasks**:
  - TASK:VISION_RESUME_DEMO
  - TASK:CORE_LOOP_RESUME_DEMO
  - TASK:WORLD_RESUME_DEMO
  - TASK:SYSTEMS_RESUME_DEMO
  - TASK:UI_RESUME_DEMO
  - TASK:TECH_RESUME_DEMO
- **Status**: DONE

## Task:VISION_RESUME_DEMO
- **Goal**: Define what game is being made for the resume portal demo
- **Inputs**: None
- **Outputs**:
  - Genre (LEDGER:VISION_GENRE)
  - Player fantasy (LEDGER:VISION_PLAYER_FANTASY)
  - Tone: factory-automation sci-fi multiverse
  - Design pillars (LEDGER:VISION_PILLARS)
- **Blocked By**:
  - Ledger:WORLD_STORY_DELIVERY
  - Ledger:WIN_LOSS
- **Produces Ledgers**:
  - Ledger:VISION_GENRE
  - Ledger:VISION_PLAYER_FANTASY
  - Ledger:VISION_PILLARS
  - Ledger:WORLD_STORYLINE
  - Ledger:WORLD_STORY_DELIVERY
  - Ledger:GAME_PERSPECTIVE_SPLIT
  - Ledger:SCREENS_LIST
  - Ledger:CONTROLS_MAPPING
  - Ledger:SCORE_DEFINITION
  - Ledger:WIN_LOSS
  - Ledger:DEMO_SCOPE
  - Ledger:RESUME_BOUNDARY
- **Status**: DONE

## Task:CORE_LOOP_RESUME_DEMO
- **Goal**: Define the player?DTs repeating gameplay loop for the demo
- **Inputs**:
  - Ledger:VISION_GENRE
  - Ledger:VISION_PLAYER_FANTASY
- **Outputs**:
  - Player actions (LEDGER:CORE_ACTIONS)
  - Feedback (LEDGER:CORE_FEEDBACK)
  - Progression (LEDGER:CORE_PROGRESSION)
  - Win/Loss conditions (LEDGER:WIN_LOSS)
- **Blocked By**:
  - Ledger:CORE_ACTIONS
  - Ledger:CORE_FEEDBACK
  - Ledger:CORE_PROGRESSION
- **Produces Ledgers**:
  - Ledger:CORE_ACTIONS
  - Ledger:CORE_FEEDBACK
  - Ledger:CORE_PROGRESSION
- **Status**: DONE

## Task:WORLD_RESUME_DEMO
- **Goal**: Define the game world and fiction for the demo
- **Inputs**:
  - Ledger:VISION_PLAYER_FANTASY
- **Outputs**:
  - Setting (LEDGER:WORLD_SETTING)
  - Entities (LEDGER:WORLD_ENTITIES)
  - Rules of the world (LEDGER:WORLD_RULES)
- **Blocked By**:
  - Ledger:WORLD_SETTING
  - Ledger:WORLD_ENTITIES
  - Ledger:WORLD_RULES
- **Produces Ledgers**:
  - Ledger:WORLD_SETTING
  - Ledger:WORLD_ENTITIES
  - Ledger:WORLD_RULES
- **Status**: DONE

## Task:SYSTEMS_RESUME_DEMO
- **Goal**: Define all gameplay systems for the demo
- **Inputs**:
  - Ledger:CORE_ACTIONS
- **Outputs**:
  - Mechanics (LEDGER:SYSTEMS_MECHANICS)
  - Resources (LEDGER:SYSTEMS_RESOURCES)
  - Progression systems (LEDGER:SYSTEMS_PROGRESSION)
- **Blocked By**:
  - Ledger:SYSTEMS_MECHANICS
  - Ledger:SYSTEMS_RESOURCES
  - Ledger:SYSTEMS_PROGRESSION
- **Produces Ledgers**:
  - Ledger:SYSTEMS_MECHANICS
  - Ledger:SYSTEMS_RESOURCES
  - Ledger:SYSTEMS_PROGRESSION
- **Status**: DONE

## Task:UI_RESUME_DEMO
- **Goal**: Define how the player interacts with the demo
- **Inputs**:
  - Ledger:SYSTEMS_MECHANICS
- **Outputs**:
  - Screens (LEDGER:UI_SCREENS)
  - Controls (LEDGER:UI_CONTROLS)
  - Feedback mechanisms (LEDGER:UI_FEEDBACK)
- **Blocked By**:
  - Ledger:UI_SCREENS
  - Ledger:UI_CONTROLS
  - Ledger:UI_FEEDBACK
- **Produces Ledgers**:
  - Ledger:UI_SCREENS
  - Ledger:UI_CONTROLS
  - Ledger:UI_FEEDBACK
- **Status**: DONE

## Task:TECH_RESUME_DEMO
- **Goal**: Define how the demo is implemented
- **Inputs**:
  - Ledger:SYSTEMS_MECHANICS
  - Ledger:UI_CONTROLS
- **Outputs**:
  - Engine (LEDGER:TECH_ENGINE)
  - Platform (LEDGER:TECH_PLATFORM)
  - Build/run instructions (LEDGER:TECH_BUILD_RUN)
- **Blocked By**:
  - Ledger:TECH_ENGINE
  - Ledger:TECH_PLATFORM
  - Ledger:TECH_BUILD_RUN
- **Produces Ledgers**:
  - Ledger:TECH_ENGINE
  - Ledger:TECH_PLATFORM
  - Ledger:TECH_BUILD_RUN
- **Status**: DONE

---

### Ledger:VISION_GENRE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What is the genre label?
- **Reason**: Genre conventions cannot be assumed.
- **Resolution**: Automation-simulation.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:VISION_PLAYER_FANTASY
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What is the player fantasy?
- **Reason**: Player fantasy guides the entire experience.
- **Resolution**: You are a cyber-tycoon managing a galaxy-factory.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:VISION_PILLARS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What are the design pillars?
- **Reason**: Pillars determine prioritization and tradeoffs.
- **Resolution**: Genericity, pixel art, automation, expansion.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:PLATFORM_ENGINE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: What platform/engine should be used?
- **Reason**: Implementation details cannot be assumed.
- **Resolution**: Angular-only embedded demo.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:SCOPE_MVP
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Meta
- **Statement**: What is the MVP size and structure?
- **Reason**: Scope affects all downstream tasks.
- **Resolution**: Multi-screen demo.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:GAME_PERSPECTIVE_SPLIT
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: Which screens are side-view vs 2D top-down, and how is the Zelda2-style divide applied?
- **Reason**: Camera perspective changes mechanics, UI, and layout.
- **Resolution**: World-view is top-down; room-view (buildings/caves) is side-view.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:CONTROLS_INPUT
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What is the primary input method?
- **Reason**: Input method dictates control mapping and accessibility.
- **Resolution**: WASD movement with optional keys for stats, inventory, crawl, jump, hit/shoot.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:CONTROLS_MAPPING
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What are the exact keybindings for optional actions and menus?
- **Reason**: Keybinding defaults cannot be assumed.
- **Resolution**: WASD movement, I inventory, E stats, Z jump, C crawl, X hit/shoot.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:SCORE_REQUIRED
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: Is a scoring system required, and is a leaderboard needed?
- **Reason**: Scoring affects systems and UI; leaderboard affects storage.
- **Resolution**: A score is required; no highscore board.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:SCORE_DEFINITION
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: What actions generate score and how is it displayed?
- **Reason**: Scoring rules cannot be assumed.
- **Resolution**: Score scales with the size of the universe factory.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:WORLD_STORYLINE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: World
- **Statement**: What is the elaborate storyline and key beats?
- **Reason**: Story content must be explicit to avoid invention.
- **Resolution**: Phased milestones: Boot Sequence (stabilize dormant factory), Expansion of Reality (new domains/strata), Optimization Era (bottlenecks/feedback loops), Autonomy Threshold (policy-level control), Cosmic Maturity (self-sustaining universe). Transcendence excluded.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:WORLD_STORY_DELIVERY
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: How is the storyline delivered (cutscenes, text logs, dialogue panels, etc.)?
- **Reason**: Delivery affects UI and pacing.
- **Resolution**: Brief intro cutscene text; in-game terminals/system logs for milestones; UI flavor text/tooltips; optional AI avatar interfaces (non-character); progress-based narration triggered by scale/efficiency.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:WIN_LOSS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: Are there win/loss conditions or is it a sandbox loop?
- **Reason**: End conditions cannot be assumed.
- **Resolution**: No loss condition and no traditional win; milestones acknowledge progression with optional soft completion at autonomy/cosmic maturity.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:SCREENS_LIST
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What are the screens and their purpose in the multi-screen demo?
- **Reason**: Screen flow determines navigation and content layout.
- **Resolution**: World-view (overarching factory build). Room-view (enter buildings/caves to find parts or ingredients).
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:DEMO_SCOPE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Meta
- **Statement**: What is the intended session length or content depth for the demo?
- **Reason**: Scope affects level count, narrative length, and build time.
- **Resolution**: Comparable in size to an Apogee shareware product.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:RESUME_BOUNDARY
- **Status**: RESOLVED
- **Type**: Constraint
- **Scope**: Meta
- **Statement**: What explicit resume-backed interaction capabilities should be demonstrated, and how should the demo avoid implying unverified claims?
- **Reason**: Resume content must be truth-preserving with no inflation.
- **Resolution**: Demonstrate concepting and programming capabilities only.
- **Introduced By**: Task:VISION_RESUME_DEMO

### Ledger:CORE_ACTIONS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: What are the core player actions in the loop?
- **Reason**: Actions define the loop and cannot be assumed.
- **Resolution**: World-view actions: place/unlock cosmic subsystems, connect production chains, set policies/constraints, monitor and diagnose system behavior. Room-view actions: place machinery/conduits, tune inputs/outputs/ratios, resolve local bottlenecks, refactor layouts. Core loop: build -> connect -> observe -> refine across both scales.
- **Introduced By**: Task:CORE_LOOP_RESUME_DEMO

### Ledger:CORE_FEEDBACK
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What feedback signals the results of actions and system state?
- **Reason**: Feedback affects UI and comprehension.
- **Resolution**: Success feedback via visual flow cues, stability/efficiency UI indicators, and system logs with pseudo-scientific confirmations; optional soft audio hums/pulses. Inefficiency feedback via stalled visuals, non-fatal warnings/log annotations, and subtle audio discord. No hard failure, all feedback invites correction.
- **Introduced By**: Task:CORE_LOOP_RESUME_DEMO

### Ledger:CORE_PROGRESSION
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: How does the player progress within the core loop?
- **Reason**: Progression rules cannot be assumed.
- **Resolution**: Progression scales from local systems to multi-layered infrastructure; new machines/concepts unlock based on usage/understanding; complexity increases with interdependence and feedback loops; player role evolves from operator to architect to meta-designer; end-state is a self-sustaining factory with sandbox exploration.
- **Introduced By**: Task:CORE_LOOP_RESUME_DEMO

### Ledger:WORLD_SETTING
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: World
- **Statement**: What is the named universe context and multiverse representation?
- **Reason**: World setting cannot be assumed.
- **Resolution**: The Factory Universe is an artificial, consistent reality governed by industrialized, machine-readable processes. The multiverse is structural: separate factory instances with their own parameters and progression, created or branched as isolated simulations for comparison and iteration.
- **Introduced By**: Task:WORLD_RESUME_DEMO

### Ledger:WORLD_ENTITIES
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: World
- **Statement**: What entities, systems, and structures exist in the world?
- **Reason**: Entities drive world logic and presentation.
- **Resolution**: Player is an external overseer with no physical presence; interaction via interfaces/tools. Primary systems: production (energy, matter, structure, complexity), automation, monitoring. Structures: rooms/facilities, machines with cosmology-derived names, connections/conduits. Explicitly absent: characters, factions, enemies, anthropomorphic components.
- **Introduced By**: Task:WORLD_RESUME_DEMO

### Ledger:WORLD_RULES
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: World
- **Statement**: What hard rules govern the world?
- **Reason**: Rules constrain mechanics and narrative.
- **Resolution**: All creation is mediated through connected systems; resources are transformed under conservation-like constraints; scale increases complexity and emergent behavior; no irreversible failure states; player acts indirectly via construction/configuration/policies; universes are isolated unless explicitly branched.
- **Introduced By**: Task:WORLD_RESUME_DEMO

### Ledger:SYSTEMS_MECHANICS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: What core mechanics are available to the player?
- **Reason**: Mechanics define system behavior and interaction.
- **Resolution**: Placement on a structured grid (world and room scale); routing/connectivity via conduits/links; production chains with fixed recipes; room entry and local construction; configuration/tuning of throughput, priorities, and ratios; mid/late-game policy rules; observation/diagnostics via overlays, metrics, and logs.
- **Introduced By**: Task:SYSTEMS_RESUME_DEMO

### Ledger:SYSTEMS_RESOURCES
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: What resource types and transformations exist?
- **Reason**: Resource definitions must be explicit to avoid invention.
- **Resolution**: Resource types: Energy, Matter, Particles, Fields, Entropy, Information, Structure, Complexity. Example transformations: Energy -> Particles, Particles -> Matter, Matter -> Structure, Structure -> Complexity, Complexity -> Information, Information -> system efficiency modifiers. Recipes and balance are implementation details.
- **Introduced By**: Task:SYSTEMS_RESUME_DEMO

### Ledger:SYSTEMS_PROGRESSION
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: How are systems unlocked and progressed?
- **Reason**: Progression defines pacing and scope.
- **Resolution**: Tiered machine unlocks based on use of earlier systems; scale-based unlocks via throughput/stability/complexity thresholds; abstraction progression from direct placement to policy controls; parallel progression paths across production domains; soft upgrades that improve efficiency/capacity/control; universe-level meta progression via new configurations/rule variations.
- **Introduced By**: Task:SYSTEMS_RESUME_DEMO

### Ledger:UI_SCREENS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What screens exist beyond world-view and room-view?
- **Reason**: Screen flow cannot be assumed.
- **Resolution**: Main menu (universe selection/creation/duplication/branching), settings (audio/visuals/controls/accessibility), statistics/diagnostics, systems overview, logs/messages, pause/meta (time control, save/load, sandbox config). No character inventory or narrative journal.
- **Introduced By**: Task:UI_RESUME_DEMO

### Ledger:UI_CONTROLS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What controls and interaction methods are used?
- **Reason**: Input interaction details must be explicit.
- **Resolution**: Mouse-driven placement and selection; click-and-drag routing; drag to pan; scroll wheel zoom; right-click context menus; optional keyboard shortcuts but fully playable with mouse. Keyboard actions also include WASD, I, E, Z, C, X from prior ledgers.
- **Introduced By**: Task:UI_RESUME_DEMO

### Ledger:UI_FEEDBACK
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What feedback mechanisms and view-specific differences are used?
- **Reason**: Feedback must be explicit to support comprehension.
- **Resolution**: Shared: HUD widgets (resources, alerts, time controls), tooltips, logs/notifications, overlays for flow/bottlenecks/stability. World-view emphasizes abstract system-wide indicators (throughput, dependencies, global stability, policy compliance). Room-view emphasizes detailed flow visualization, machine state indicators, and local warnings.
- **Introduced By**: Task:UI_RESUME_DEMO

### Ledger:TECH_PLATFORM
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: What is the target platform and delivery context?
- **Reason**: Platform requirements constrain implementation.
- **Resolution**: Web browser target inside a single-page Angular application; no native/desktop runtime. Supported environments: modern desktop browsers (Chromium-based and Firefox); mobile not a primary target.
- **Introduced By**: Task:TECH_RESUME_DEMO

### Ledger:TECH_ENGINE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: What engine and rendering approach are used?
- **Reason**: Rendering stack must be explicit.
- **Resolution**: Angular client-only implementation with Canvas for grid/flows, SVG for overlays/routing/diagnostics, and DOM for UI panels/menus. Simulation and progression live in Angular services/modules. No external game engine.
- **Introduced By**: Task:TECH_RESUME_DEMO

### Ledger:TECH_BUILD_RUN
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: What build/run instructions are required?
- **Reason**: Build/run steps cannot be assumed.
- **Resolution**: Standard Angular workflow: npm install, ng serve, access http://localhost:4200; production build via standard Angular tooling. Documentation aligns with existing repository scripts.
- **Introduced By**: Task:TECH_RESUME_DEMO

---

# SECTION 11 -- EPIC EXECUTION LOG (FACTORY UNIVERSE DEMO REFINEMENT)

## Task:UI_FLOW_HUD_IMPLEMENTATION_RESUME_DEMO
- **Goal**: Implement functional UI flow + HUD refinements in the Factory Universe demo
- **Inputs**:
  - Ledger:UI_SCREENS
  - Ledger:UI_CONTROLS
  - Ledger:UI_FEEDBACK
  - Ledger:CORE_FEEDBACK
- **Outputs**:
  - Updated HUD signals (resources, alerts, time controls, overlays, selection, logs)
  - Clearer UI flow cues between world-view and room-view
  - Interactivity refinements consistent with diagnostics and feedback
- **Blocked By**: None
- **Produces Ledgers**: None
- **Status**: DONE

## Task:UI_FLOW_HUD_WIREFRAME_DECISION_RESUME_DEMO
- **Goal**: Decide whether to lock wireframes before deeper HUD iteration
- **Inputs**: None
- **Outputs**:
  - Wireframe lock decision
- **Blocked By**:
  - Ledger:WIREFRAME_LOCK_DECISION
- **Produces Ledgers**:
  - Ledger:WIREFRAME_LOCK_DECISION
- **Status**: DONE

## Task:UI_FLOW_WIREFRAME_IMPLEMENTATION_RESUME_DEMO
- **Goal**: Apply the functional wireframe zones and labels to the live demo
- **Inputs**:
  - Ledger:WIREFRAME_LOCK_DECISION
- **Outputs**:
  - Top bar with universe context, time controls, overlays, and alerts
  - Left build panel with mode indicator and category/filter entry
  - Right system inspector layout aligned to view-specific content
  - Bottom strip for logs/messages with expandable affordance
  - Optional wireframe mode toggle for zone visibility
- **Blocked By**: None
- **Produces Ledgers**: None
- **Status**: DONE

### Ledger:WIREFRAME_LOCK_DECISION
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: Should we lock wireframes now before further HUD iteration?
- **Reason**: The wireframe decision affects UI layout stability and implementation churn.
- **Resolution**: Lock now with a functional wireframe scope. Lock zones, hierarchy, and information flow only; do not lock colors, icons, typography, animation timing, or exact panel widths (use min/max ranges). Always-visible top bar with universe name/instance, time controls, global alerts; left panel for build categories, filter/search, and mode indicator; center canvas for primary play space; right inspector panel for selection details/throughput/warnings; bottom strip for logs/messages/milestones. Zones stay consistent across world/room views; content shifts (world: aggregates/policies/overlays; room: machine-level tuning/flow/saturation/idle overlays). Wireframe labels use plain text: Build Menu, System Inspector, Resource Overview, Logs / Messages, Time Controls, Overlays.
- **Introduced By**: Task:UI_FLOW_HUD_WIREFRAME_DECISION_RESUME_DEMO

## Task:VISUAL_SYSTEM_TYPOGRAPHY_REFINEMENT_RESUME_DEMO
- **Goal**: Refine visual system and typography for the Factory Universe demo tile
- **Inputs**:
  - Ledger:UI_FEEDBACK
  - Ledger:WIREFRAME_LOCK_DECISION
  - Ledger:TECH_PLATFORM
- **Outputs**:
  - Updated typography stack and usage
  - Refined color system with prismatic accents
  - Controlled glow logic for edges and intersections
  - Demo tile visual polish consistent with refinement scope
- **Blocked By**: None
- **Produces Ledgers**: None
- **Status**: DONE

### Ledger:VISUAL_REFINEMENT_FIDELITY
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What fidelity stage governs this pass?
- **Reason**: Fidelity stage determines allowable change scope.
- **Resolution**: Refinement. Structure and layout are locked; polish surface language only (color, type, glow logic, visual metaphor).
- **Introduced By**: Task:VISUAL_SYSTEM_TYPOGRAPHY_REFINEMENT_RESUME_DEMO

### Ledger:VISUAL_TYPOGRAPHY_STACK
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What typography stack should be used?
- **Reason**: Typography sets tone and hierarchy.
- **Resolution**: Switch off Orbitron. Primary UI/headings use IBM Plex Sans or Inter; accent/meta labels use Space Mono or JetBrains Mono. Sans is the machine; mono is the absurd math beneath reality.
- **Introduced By**: Task:VISUAL_SYSTEM_TYPOGRAPHY_REFINEMENT_RESUME_DEMO

### Ledger:VISUAL_COLOR_DIRECTION
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What color and visual direction should govern the demo tile?
- **Reason**: Palette affects tone and scanability.
- **Resolution**: Cold industrial base (steel/graphite/oil-black with slight blue-green bias) fractured by prismatic accents (cyan to violet to magenta) used sparingly as seams/refractions.
- **Introduced By**: Task:VISUAL_SYSTEM_TYPOGRAPHY_REFINEMENT_RESUME_DEMO

### Ledger:VISUAL_GLOW_INTENSITY
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What glow intensity and logic should be used?
- **Reason**: Glow impacts readability and visual noise.
- **Resolution**: Medium, controlled, edge-only glow. No ambient bloom; glow appears on edges/dividers/intersections where reality is stressed. Prefer chromatic separation to soft bloom.
- **Introduced By**: Task:VISUAL_SYSTEM_TYPOGRAPHY_REFINEMENT_RESUME_DEMO

### Ledger:VISUAL_REFINEMENT_SCOPE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Meta
- **Statement**: What scope should visual refinement apply to?
- **Reason**: Scope controls blast radius and rollout.
- **Resolution**: Factory Universe demo tile only.
- **Introduced By**: Task:VISUAL_SYSTEM_TYPOGRAPHY_REFINEMENT_RESUME_DEMO

## Task:PLACEHOLDER_SAMPLES_REFINEMENT_RESUME_DEMO
- **Goal**: Introduce representative static placeholders for HUD and panels
- **Inputs**:
  - Ledger:UI_FEEDBACK
  - Ledger:SYSTEMS_RESOURCES
  - Ledger:WIREFRAME_LOCK_DECISION
- **Outputs**:
  - Build categories with sample items
  - Inspector fields populated with static inputs/outputs/throughput
  - Alerts with representative reasons
  - Logs/messages with sample system entries
  - Resource overview and overlay summary populated
- **Blocked By**: None
- **Produces Ledgers**: None
- **Status**: DONE

### Ledger:PLACEHOLDER_SAMPLE_FIDELITY
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What placeholder fidelity should be used for HUD and panel content?
- **Reason**: Placeholder fidelity affects perceived system completeness.
- **Resolution**: Static sample data for build categories, inspector fields, alerts, logs/messages, resource overview, and overlays.
- **Introduced By**: Task:PLACEHOLDER_SAMPLES_REFINEMENT_RESUME_DEMO
