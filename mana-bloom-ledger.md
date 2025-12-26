# Mana Bloom Demo Ledger

This file instantiates the game-creation protocol for the Mana Bloom tile demo.

---

## Task:ROOT_MANA_BLOOM
- **Goal**: Produce a playable Mana Bloom demo for the resume portal.
- **Inputs**: None
- **Outputs**:
  - Game Vision
  - Core Gameplay Loop
  - Systems Design
  - World/Content
  - UI/UX
  - Technical Implementation
- **Subtasks**:
  - TASK:VISION_MB
  - TASK:CORE_LOOP_MB
  - TASK:UI_MB
  - TASK:TECH_MB
  - TASK:TUNING_MB
  - TASK:IMPLEMENTATION_MB
- **Status**: DONE

## Task:VISION_MB
- **Goal**: Define what game is being made for the Mana Bloom demo
- **Inputs**: Ledger:MB_TASK_SPEC
- **Outputs**:
  - Genre
  - Player fantasy
  - Tone
  - Design pillars
- **Blocked By**:
  - Ledger:MB_TASK_SPEC
- **Produces Ledgers**:
  - Ledger:MB_VISION_GENRE
  - Ledger:MB_VISION_PLAYER_FANTASY
  - Ledger:MB_VISION_TONE
  - Ledger:MB_VISION_PILLARS
- **Status**: DONE

## Task:CORE_LOOP_MB
- **Goal**: Define the player repeating gameplay loop for the Mana Bloom demo
- **Inputs**:
  - Ledger:MB_VISION_GENRE
  - Ledger:MB_VISION_PLAYER_FANTASY
- **Outputs**:
  - Player actions
  - Feedback
  - Progression
  - Win/Loss conditions
- **Blocked By**:
  - Ledger:MB_VISION_GENRE
  - Ledger:MB_VISION_PLAYER_FANTASY
  - Ledger:MB_CORE_ACTIONS
  - Ledger:MB_CORE_FEEDBACK
  - Ledger:MB_CORE_PROGRESSION
  - Ledger:MB_WIN_LOSS
- **Produces Ledgers**:
  - Ledger:MB_CORE_ACTIONS
  - Ledger:MB_CORE_FEEDBACK
  - Ledger:MB_CORE_PROGRESSION
  - Ledger:MB_WIN_LOSS
- **Status**: DONE

## Task:UI_MB
- **Goal**: Define how the player interacts with the Mana Bloom demo
- **Inputs**:
  - Ledger:MB_CORE_ACTIONS
- **Outputs**:
  - Screens
  - Controls
  - Feedback mechanisms
- **Blocked By**:
  - Ledger:MB_CORE_ACTIONS
  - Ledger:MB_CONTROLS_INPUT
  - Ledger:MB_SCREENS_LIST
  - Ledger:MB_UI_TEXT
- **Produces Ledgers**:
  - Ledger:MB_CONTROLS_INPUT
  - Ledger:MB_SCREENS_LIST
  - Ledger:MB_UI_TEXT
- **Status**: DONE

## Task:TECH_MB
- **Goal**: Define how the Mana Bloom demo is implemented
- **Inputs**:
  - Ledger:MB_TECH_ENGINE
  - Ledger:MB_TECH_PLATFORM
- **Outputs**:
  - Engine
  - Platform
  - Build/run instructions
- **Blocked By**:
  - Ledger:MB_TECH_ENGINE
  - Ledger:MB_TECH_PLATFORM
- **Produces Ledgers**:
  - Ledger:MB_TECH_ENGINE
  - Ledger:MB_TECH_PLATFORM
  - Ledger:MB_TECH_BUILD_RUN
- **Status**: DONE

## Task:TUNING_MB
- **Goal**: Decide gameplay tuning constants needed for implementation
- **Inputs**:
  - Ledger:MB_CORE_ACTIONS
  - Ledger:MB_WIN_LOSS
- **Outputs**:
  - Movement, timing, spawn, and scoring constants
- **Blocked By**:
  - Ledger:MB_CORE_ACTIONS
  - Ledger:MB_WIN_LOSS
  - Ledger:MB_TUNING_CONSTANTS
- **Produces Ledgers**:
  - Ledger:MB_TUNING_CONSTANTS
- **Status**: DONE

## Task:IMPLEMENTATION_MB
- **Goal**: Implement the playable Mana Bloom demo in the Angular tile
- **Inputs**:
  - Ledger:MB_TECH_ENGINE
  - Ledger:MB_TECH_PLATFORM
  - Ledger:MB_CONTROLS_INPUT
  - Ledger:MB_TUNING_CONSTANTS
  - Ledger:MB_SCORE_RULES
  - Ledger:MB_ENTITY_SET
  - Ledger:MB_RESOURCE_RULES
  - Ledger:MB_UI_TEXT
- **Outputs**:
  - Embedded Mana Bloom game
  - Boot/play/over screens
  - Deterministic loop
- **Blocked By**:
  - Ledger:MB_TECH_ENGINE
  - Ledger:MB_TECH_PLATFORM
  - Ledger:MB_CONTROLS_INPUT
  - Ledger:MB_TUNING_CONSTANTS
  - Ledger:MB_SCORE_RULES
  - Ledger:MB_ENTITY_SET
  - Ledger:MB_RESOURCE_RULES
  - Ledger:MB_UI_TEXT
- **Status**: DONE

---

### Ledger:MB_TASK_SPEC
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Meta
- **Statement**: Task specification for the Mana Bloom demo
- **Reason**: Task scope and acceptance criteria must be explicit.
- **Resolution**:
  - Purpose: Create a compact, top-down action-adventure inspired by Zelda 1 focused on exploration, simple combat, and magical growth where the world responds to mana usage.
  - Explicit non-goals: No procedural overworld generation, no dialogue trees or branching narrative, no multiplayer, no deep RPG stats or builds, no physics simulation, no save-file persistence beyond session (demo only).
  - Target fidelity stage: Vertical Slice / Playable Prototype (feature-complete core loop; placeholder art and sound allowed; tuned feel > content volume).
  - Primary agent: Single Player Hero ("The Bloomkeeper").
  - Reviewers: Game designer (feel & loop), engine integrator (rendering + input), player-experience sanity check (clarity & pacing).
  - Acceptance criteria: Player can explore at least 6 connected screens; combat/damage/death/win condition are functional; mana resource meaningfully affects gameplay and world state; session completes in <= 15 minutes; keyboard-only playable.
- **Introduced By**: User

### Ledger:MB_RESUME_BOUNDARY
- **Status**: RESOLVED
- **Type**: Constraint
- **Scope**: Meta
- **Statement**: What resume-backed capabilities should the demo demonstrate?
- **Reason**: Demo must avoid implying unverified claims.
- **Resolution**:
  - Demonstrate deterministic game architecture (single-loop update/render, fixed timestep logic, state-driven transitions).
  - Demonstrate data-driven design (constants/ledgers define entities, tunables isolated, no render-time logic).
  - Demonstrate interactive world state (player actions mutate tiles, gates unlock via state, mana affects environment).
  - Demonstrate UI + input integration (keyboard abstraction, HUD overlays tied to state, pause/restart lifecycle).
  - Explicitly not required: save/load, audio mixing sophistication, mobile controls, accessibility pass.
- **Introduced By**: User

### Ledger:MB_VISION_GENRE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What is the genre label?
- **Reason**: Genre conventions must be explicit.
- **Resolution**: Top-down action-adventure.
- **Introduced By**: Task:VISION_MB

### Ledger:MB_VISION_PLAYER_FANTASY
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What is the player fantasy?
- **Reason**: Player fantasy guides the experience.
- **Resolution**: You are a lone wanderer restoring magical life to a withered land; every spell leaves a mark.
- **Introduced By**: Task:VISION_MB

### Ledger:MB_VISION_TONE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What is the tone/aesthetic?
- **Reason**: Tone affects visuals and feedback.
- **Resolution**: Mystical, quietly hopeful, slightly dangerous, never grim.
- **Introduced By**: Task:VISION_MB

### Ledger:MB_VISION_PILLARS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What are the design pillars?
- **Reason**: Pillars define priorities and tradeoffs.
- **Resolution**:
  - Simplicity with consequence (few mechanics, each matters).
  - World reacts to magic (mana changes spaces).
  - Readable combat (simple, learnable patterns).
  - Exploration first (curiosity over optimization).
- **Introduced By**: Task:VISION_MB

### Ledger:MB_CORE_ACTIONS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: What are the core player actions?
- **Reason**: Actions define the loop and controls.
- **Resolution**: Move (4-directional), melee attack, cast mana ability, interact (contextual).
- **Introduced By**: Task:CORE_LOOP_MB

### Ledger:MB_CORE_FEEDBACK
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What feedback signals the results of actions and system state?
- **Reason**: Feedback affects readability and feel.
- **Resolution**: Hit flash + knockback, mana glow intensity changes, subtle tile changes when mana is spent/restored, simple sound cues (hit, cast, pickup).
- **Introduced By**: Task:CORE_LOOP_MB

### Ledger:MB_CORE_PROGRESSION
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: How does the player progress within the demo?
- **Reason**: Progression rules must be explicit.
- **Resolution**: Unlock new mana abilities (max 2-3), world gates open when mana thresholds are met, health upgrades via exploration.
- **Introduced By**: Task:CORE_LOOP_MB

### Ledger:MB_WIN_LOSS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: What are win/loss conditions?
- **Reason**: End conditions cannot be assumed.
- **Resolution**: Win by restoring the Heart Bloom (final shrine) after activating all Mana Sprouts; loss when health reaches zero, restart at map start and world resets to pre-restoration state.
- **Introduced By**: Task:CORE_LOOP_MB

### Ledger:MB_CONTROLS_INPUT
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What are the controls and input method?
- **Reason**: Input method and bindings must be explicit.
- **Resolution**: Keyboard only. Arrow keys / WASD move, Z/Space attack, X cast mana, Enter interact, Esc pause.
- **Introduced By**: Task:UI_MB

### Ledger:MB_SCREENS_LIST
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What screens exist in the demo?
- **Reason**: Screen flow determines UI layout.
- **Resolution**: Title screen, gameplay (overworld), pause menu, win screen, death screen.
- **Introduced By**: Task:UI_MB

### Ledger:MB_UI_TEXT
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What HUD and overlay text is required?
- **Reason**: UI copy must be explicit.
- **Resolution**: HUD shows hearts (health), mana orbs (resource), ability icon (current spell). Minimal text: "Mana Bloomed", "Mana Withered", "The Heart Awakens".
- **Introduced By**: Task:UI_MB

### Ledger:MB_TECH_ENGINE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: What engine and rendering approach are used?
- **Reason**: Rendering stack must be explicit.
- **Resolution**: Canvas-based renderer, single game loop, tile grid at 16x11 tiles per screen.
- **Introduced By**: Task:TECH_MB

### Ledger:MB_TECH_PLATFORM
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: What platform is targeted?
- **Reason**: Platform constraints affect implementation.
- **Resolution**: Desktop web (Chrome/Firefox), keyboard required.
- **Introduced By**: Task:TECH_MB

### Ledger:MB_TECH_BUILD_RUN
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: What build/run instructions are required?
- **Reason**: Build/run steps must be explicit.
- **Resolution**: Use Angular build pipeline (no custom bundling). Mana Bloom is an Angular component using Canvas with a single game loop; no SSR concerns. Canvas size fixed by component and scaled via CSS if needed.
- **Introduced By**: Task:TECH_MB

### Ledger:MB_DEMO_SCOPE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Meta
- **Statement**: What is the intended session length and content size?
- **Reason**: Scope affects pacing and content.
- **Resolution**: Session length 10-15 minutes. Content size 6-8 overworld screens, 1 mini-dungeon area, 1 final shrine encounter.
- **Introduced By**: User

### Ledger:MB_SCORE_RULES
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: What are the scoring rules, and is score required?
- **Reason**: Scoring and HUD feedback require explicit rules.
- **Resolution**: No numeric score. Success measured by completion. Optional internal metrics: time to completion, mana wasted vs restored.
- **Introduced By**: Task:TUNING_MB

### Ledger:MB_ENTITY_SET
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Content
- **Statement**: What entities exist (player, enemies, allies, hazards, pickups)?
- **Reason**: Entity set defines rules and content scope.
- **Resolution**:
  - Player: Bloomkeeper (health, mana, melee + spell).
  - Enemies: Withered Slime (slow chaser), Thorn Crawler (patrol + dash), Mana Wisp (ranged, fragile).
  - World: Mana Sprout (inactive/active), Heart Bloom (final objective), Shrines (restore mana), Gates (mana-locked).
  - Pickups: Mana Orb (+mana), Heart Fragment (+max health), Temporary Bloom (buff zone).
- **Introduced By**: Task:TUNING_MB

### Ledger:MB_RESOURCE_RULES
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: What resources exist and how are they spent or gained?
- **Reason**: Resource rules affect progression and UI.
- **Resolution**:
  - Health: lost via damage, restored via shrines or rare drops, max increases via fragments.
  - Mana: spent on abilities, slowly regenerates only near active blooms.
  - Casting near withered land may corrupt tiles temporarily.
  - World mana state: areas have a mana level; some enemies weaken or vanish in high-mana zones; gates check world mana flags, not inventory.
- **Introduced By**: Task:TUNING_MB

### Ledger:MB_TUNING_CONSTANTS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: Concrete tuning values required for deterministic implementation.
- **Reason**: Deterministic mechanics require explicit constants.
- **Resolution**:
  - PLAYER_MOVE_SPEED: 1.25 tiles/sec
  - PLAYER_TURN_INSTANT: true
  - PLAYER_ATTACK_COOLDOWN: 350 ms
  - PLAYER_ATTACK_RANGE: 0.75 tiles
  - PLAYER_ATTACK_DAMAGE: 1
  - PLAYER_SPELL_COOLDOWN: 600 ms
  - PLAYER_SPELL_COST: 2 mana
  - PLAYER_SPELL_RANGE: 3 tiles
  - PLAYER_SPELL_DAMAGE: 2
  - PLAYER_MAX_HEALTH_START: 3 hearts
  - PLAYER_MAX_HEALTH_CAP: 6 hearts
  - PLAYER_KNOCKBACK_DISTANCE: 0.5 tiles
  - PLAYER_KNOCKBACK_STUN: 250 ms
  - MANA_MAX: 8
  - MANA_REGEN_RATE_ACTIVE_ZONE: +1 mana / 2.0 s
  - MANA_REGEN_RATE_INACTIVE_ZONE: 0
  - MANA_REGEN_DELAY_AFTER_CAST: 1.5 s
  - MANA_CAST_CORRUPTION_DURATION: 5 s
  - MANA_BLOOM_ACTIVATION_THRESHOLD: 1 successful cast nearby
  - WITHERED_SLIME: HP 2, DAMAGE 1, MOVE_SPEED 0.6 tiles/sec, KNOCKBACK_TAKEN 0.75 tiles
  - THORN_CRAWLER: HP 3, DAMAGE 1, MOVE_SPEED 0.9 tiles/sec, DASH_SPEED 2.0 tiles/sec, DASH_COOLDOWN 3.0 s
  - MANA_WISP: HP 1, DAMAGE 1, MOVE_SPEED 0.8 tiles/sec, PROJECTILE_SPEED 2.5 tiles/sec, FIRE_COOLDOWN 2.0 s
  - GATE_MANA_THRESHOLD: activate all local Mana Sprouts (2 sprouts per region)
  - SHRINE_HEAL_AMOUNT: full health
  - SHRINE_MANA_RESTORE: full mana
  - SHRINE_REUSE_DELAY: single-use for demo
  - MANA_ORB_VALUE: +1 mana
  - HEART_FRAGMENT_COUNT_FOR_FULL_HEART: 2
  - TEMP_BLOOM_DURATION: 10 s
  - TEMP_BLOOM_MANA_REGEN_BONUS: +1 mana / s
- **Introduced By**: Task:TUNING_MB
