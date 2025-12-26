# Candy Runner Demo Ledger

This file instantiates the game-creation protocol for the Candy Runner tile demo.

---

## Task:ROOT_CANDY_RUNNER
- **Goal**: Produce a playable Candy Runner demo for the resume portal.
- **Inputs**: None
- **Outputs**:
  - Game Vision
  - Core Gameplay Loop
  - Systems Design
  - World/Content
  - UI/UX
  - Technical Implementation
- **Subtasks**:
  - TASK:VISION_CR
  - TASK:CORE_LOOP_CR
  - TASK:UI_CR
  - TASK:TECH_CR
  - TASK:TUNING_CR
  - TASK:IMPLEMENTATION_CR
- **Status**: DONE

## Task:VISION_CR
- **Goal**: Define what game is being made for the Candy Runner demo
- **Inputs**: Ledger:CR_TASK_SPEC
- **Outputs**:
  - Genre
  - Player fantasy
  - Tone
  - Design pillars
- **Status**: DONE

## Task:CORE_LOOP_CR
- **Goal**: Define the player repeating gameplay loop for the Candy Runner demo
- **Inputs**:
  - Ledger:CR_VISION_GENRE
  - Ledger:CR_VISION_PLAYER_FANTASY
- **Outputs**:
  - Player actions
  - Feedback
  - Progression
  - Win/Loss conditions
- **Status**: DONE

## Task:UI_CR
- **Goal**: Define how the player interacts with the Candy Runner demo
- **Inputs**:
  - Ledger:CR_CORE_ACTIONS
- **Outputs**:
  - Screens
  - Controls
  - Feedback mechanisms
- **Status**: DONE

## Task:TECH_CR
- **Goal**: Define how the Candy Runner demo is implemented
- **Inputs**:
  - Ledger:CR_TECH_ENGINE
  - Ledger:CR_TECH_PLATFORM
- **Outputs**:
  - Engine
  - Platform
  - Build/run instructions
- **Status**: DONE

## Task:TUNING_CR
- **Goal**: Decide gameplay tuning constants needed for implementation
- **Inputs**:
  - Ledger:CR_CORE_ACTIONS
  - Ledger:CR_WIN_LOSS
- **Outputs**:
  - Movement, spawn, and scoring constants
- **Status**: DONE

## Task:IMPLEMENTATION_CR
- **Goal**: Implement the playable Candy Runner demo in the Angular tile
- **Inputs**:
  - Ledger:CR_TECH_ENGINE
  - Ledger:CR_TECH_PLATFORM
  - Ledger:CR_CONTROLS_INPUT
  - Ledger:CR_TUNING_CONSTANTS
  - Ledger:CR_SCORE_RULES
  - Ledger:CR_OBSTACLE_SET
  - Ledger:CR_PICKUP_RULES
  - Ledger:CR_UI_TEXT
- **Outputs**:
  - Embedded DOM-based runner
  - Boot/play/over screens
  - Deterministic loop
- **Status**: DONE

---

### Ledger:CR_TASK_SPEC
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Meta
- **Statement**: Task specification for the Candy Runner demo
- **Reason**: Task scope and acceptance criteria must be explicit.
- **Resolution**:
  - Purpose: Create a lightweight arcade runner with tight jump timing, clear risk/reward lanes, and deterministic mechanics.
  - Explicit non-goals: No narrative progression, no meta-progression, no physics realism, no unseeded generation.
  - Target fidelity stage: Playable vertical slice.
  - Primary agent: EmbeddedGameComponent (game loop + logic owner).
  - Reviewers: Game feel, code determinism, protocol compliance.
  - Acceptance criteria: Start -> fail -> results loop; 1-frame input response; readable/fair obstacles; deterministic score/distance for given seed.
- **Introduced By**: User

### Ledger:CR_VISION_GENRE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What is the genre label?
- **Reason**: Genre conventions must be explicit.
- **Resolution**: Arcade side-scrolling endless runner.
- **Introduced By**: User

### Ledger:CR_VISION_PLAYER_FANTASY
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What is the player fantasy?
- **Reason**: Player fantasy guides the experience.
- **Resolution**: "A hyper-competent candy courier sprinting through a hostile confectionery factory."
- **Introduced By**: User

### Ledger:CR_VISION_TONE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What is the tone/aesthetic?
- **Reason**: Tone affects visuals and feedback.
- **Resolution**: Bright, energetic, slightly absurd; fail states playful, not punishing.
- **Introduced By**: User

### Ledger:CR_VISION_PILLARS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What are the design pillars?
- **Reason**: Pillars define priorities and tradeoffs.
- **Resolution**: Momentum first; readable danger; risk pays; one-button mastery.
- **Introduced By**: User

### Ledger:CR_CORE_ACTIONS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: What are the core player actions?
- **Reason**: Actions define the loop and controls.
- **Resolution**: Jump with up to three jumps before landing; lane positioning via timing.
- **Introduced By**: User

### Ledger:CR_CORE_FEEDBACK
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What feedback signals the results of actions and system state?
- **Reason**: Feedback affects readability and feel.
- **Resolution**: Immediate collision fail, pickup pop, score tick, continuous distance counter.
- **Introduced By**: User

### Ledger:CR_CORE_PROGRESSION
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: How does the player progress within the demo?
- **Reason**: Progression rules must be explicit.
- **Resolution**: Distance increases and obstacle cadence ramps; score scales faster in high-risk lanes.
- **Introduced By**: User

### Ledger:CR_WIN_LOSS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: What are win/loss conditions?
- **Reason**: End conditions cannot be assumed.
- **Resolution**: Endless runner; loss on obstacle collision or falling into a pit.
- **Introduced By**: User

### Ledger:CR_CONTROLS_INPUT
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What are the controls and input method?
- **Reason**: Input method and bindings must be explicit.
- **Resolution**: Keyboard; Space/W/ArrowUp jump; R restart after failure; Esc reset run.
- **Introduced By**: User

### Ledger:CR_SCREENS_LIST
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What screens exist in the demo?
- **Reason**: Screen flow determines UI layout.
- **Resolution**: Boot/title, gameplay HUD, results screen.
- **Introduced By**: User

### Ledger:CR_SCORE_RULES
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: Scoring rules (pickup, time, combo).
- **Reason**: Score feedback requires explicit rules.
- **Resolution**: +10 per candy, +1 per second survived, +25 combo bonus for consecutive airborne pickups.
- **Introduced By**: User

### Ledger:CR_PICKUP_RULES
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: Pickup rules and effects.
- **Reason**: Pickup behavior affects core loop and double-jump.
- **Resolution**: Candy pickups are score-only; missed pickups are lost. Golden candy grants bonus score only.
- **Introduced By**: User

### Ledger:CR_OBSTACLE_SET
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Content
- **Statement**: Obstacle types and lane roles.
- **Reason**: Obstacle set defines risk/reward and readability.
- **Resolution**: Floor spikes, low crushers, high bars, and pits. Ground lane is safer; air lane is denser and riskier.
- **Introduced By**: User

### Ledger:CR_TECH_ENGINE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: What engine and rendering approach are used?
- **Reason**: Rendering stack must be explicit.
- **Resolution**: EmbeddedGameComponent with DOM sprites; no canvas rewrite.
- **Introduced By**: User

### Ledger:CR_TECH_PLATFORM
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: What platform is targeted?
- **Reason**: Platform constraints affect implementation.
- **Resolution**: Desktop browser, keyboard required.
- **Introduced By**: User

### Ledger:CR_UI_TEXT
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What HUD text is required?
- **Reason**: UI copy must be explicit.
- **Resolution**: "Candy Runner", "Press Space to Start", "Run Over", final score, distance, "Press R to Retry".
- **Introduced By**: User

### Ledger:CR_TUNING_CONSTANTS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: Concrete tuning values derived for implementation within provided bounds.
- **Reason**: Deterministic mechanics require explicit constants.
- **Resolution**:
  - Base speed 180 px/s; speed scales +5% every 10s.
  - Spawn interval ramps from 2.5s to 1.2s, starting at 15s and reaching late cadence by 90s.
  - Gravity -3000 px/s^2, jump velocity 800 px/s (clears ~1.5x player height).
  - Triple jump enabled (max 3 jumps before landing).
  - Pit width 140 px.
  - Candy lane heights: ground 84 px, air 147 px.
- **Introduced By**: Task:TUNING_CR
