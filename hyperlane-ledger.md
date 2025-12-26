# Hyperlane Demo Ledger

This file instantiates the game-creation protocol for the Hyperlane tile demo.

---

## Task:ROOT_HYPERLANE
- **Goal**: Produce a playable vertical-slice Hyperlane demo for the resume portal.
- **Inputs**: None
- **Outputs**:
  - Game Vision
  - Core Gameplay Loop
  - Systems Design
  - World/Content
  - UI/UX
  - Technical Implementation
- **Subtasks**:
  - TASK:VISION_HL
  - TASK:CORE_LOOP_HL
  - TASK:UI_HL
  - TASK:TECH_HL
  - TASK:TUNING_HL
  - TASK:IMPLEMENTATION_HL
- **Status**: DONE

## Task:VISION_HL
- **Goal**: Define what game is being made for the Hyperlane demo
- **Inputs**: Ledger:HL_TASK_SPEC
- **Outputs**:
  - Genre
  - Player fantasy
  - Tone
  - Design pillars
- **Status**: DONE

## Task:CORE_LOOP_HL
- **Goal**: Define the player repeating gameplay loop for the Hyperlane demo
- **Inputs**:
  - Ledger:HL_VISION_GENRE
  - Ledger:HL_VISION_PLAYER_FANTASY
- **Outputs**:
  - Player actions
  - Feedback
  - Progression
  - Win/Loss conditions
- **Status**: DONE

## Task:UI_HL
- **Goal**: Define how the player interacts with the Hyperlane demo
- **Inputs**:
  - Ledger:HL_CORE_ACTIONS
- **Outputs**:
  - Screens
  - Controls
  - Feedback mechanisms
- **Status**: DONE

## Task:TECH_HL
- **Goal**: Define how the Hyperlane demo is implemented
- **Inputs**:
  - Ledger:HL_TECH_ENGINE
  - Ledger:HL_TECH_PLATFORM
- **Outputs**:
  - Engine
  - Platform
  - Build/run instructions
- **Status**: DONE

## Task:TUNING_HL
- **Goal**: Decide gameplay tuning constants needed for implementation
- **Inputs**:
  - Ledger:HL_CORE_ACTIONS
  - Ledger:HL_WIN_LOSS
- **Outputs**:
  - Movement, combat, spawn, and scoring constants
- **Status**: DONE

## Task:IMPLEMENTATION_HL
- **Goal**: Implement the playable Hyperlane demo in the Angular tile
- **Inputs**:
  - Ledger:HL_TECH_ENGINE
  - Ledger:HL_TECH_PLATFORM
  - Ledger:HL_CONTROLS_INPUT
  - Ledger:HL_RUN_DURATION_SECONDS
  - Ledger:HL_PLAYER_STATS
  - Ledger:HL_WEAPON_STATS
  - Ledger:HL_ENEMY_SET
  - Ledger:HL_BOOST_RULES
  - Ledger:HL_SCORE_RULES
  - Ledger:HL_LANE_BOUNDS
- **Outputs**:
  - Embedded Canvas game
  - Win/loss feedback
  - Stable, deterministic loop
- **Status**: DONE

---

### Ledger:HL_TASK_SPEC
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Meta
- **Statement**: Task specification for the Hyperlane demo
- **Reason**: Task scope and acceptance criteria must be explicit.
- **Resolution**:
  - Purpose: Define and implement a playable vertical-slice demo of a hyperlane side-scrolling shooter inspired by SWIV.
  - Explicit non-goals: No full campaign, no narrative depth, no multiplayer, no advanced AI behaviors, no save/load.
  - Target fidelity stage: Playable prototype / vertical slice (feel > polish).
  - Primary agent: You (designer + implementer).
  - Reviewers: You (self-review) + future collaborator potential.
  - Acceptance criteria:
    - Player can fly, shoot, navigate hyperlanes, and complete a short run.
    - Enemies spawn and can be defeated.
    - Clear win/loss feedback.
    - Stable framerate and deterministic behavior.
- **Introduced By**: User

### Ledger:HL_RESUME_BOUNDARY
- **Status**: RESOLVED
- **Type**: Constraint
- **Scope**: Meta
- **Statement**: What resume-backed capabilities should the demo demonstrate?
- **Reason**: Demo must avoid implying unverified claims.
- **Resolution**: Demonstrate concepting and programming, emphasizing systems thinking, moment-to-moment game feel, and clean architecture suitable for extension.
- **Introduced By**: User

### Ledger:HL_VISION_GENRE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What is the genre label?
- **Reason**: Genre conventions must be explicit.
- **Resolution**: Side-scrolling arcade shooter / hyperlane runner.
- **Introduced By**: User

### Ledger:HL_VISION_PLAYER_FANTASY
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What is the player fantasy?
- **Reason**: Player fantasy guides the experience.
- **Resolution**: "I am a lone combat pilot threading impossible hyperlanes at lethal speed, surviving by reflex, positioning, and firepower."
- **Introduced By**: User

### Ledger:HL_VISION_TONE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What is the tone/aesthetic?
- **Reason**: Tone affects visuals and feedback.
- **Resolution**: Synthwave hard-sci-fi. Neon energy trails, dark voids, abstract geometry. High contrast, minimal UI, arcade clarity.
- **Introduced By**: User

### Ledger:HL_VISION_PILLARS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Vision
- **Statement**: What are the design pillars?
- **Reason**: Pillars define priorities and tradeoffs.
- **Resolution**: Speed as pressure; readable chaos; skill over stats; immediate feedback; short, replayable runs.
- **Introduced By**: User

### Ledger:HL_CORE_ACTIONS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: What are the core player actions?
- **Reason**: Actions define the loop and controls.
- **Resolution**: Fly (2D movement within lane bounds), shoot (primary weapon), dodge/reposition, optional temporary boost or lane-shift.
- **Introduced By**: User

### Ledger:HL_CORE_FEEDBACK
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What feedback signals the results of actions and system state?
- **Reason**: Feedback affects readability and feel.
- **Resolution**: Visual (explosions, hit flashes, enemy disintegration), audio (weapon fire, damage cues, warning tones), UI (health bar, score multiplier, lane speed indicator), motion (screen shake, recoil, speed lines).
- **Introduced By**: User

### Ledger:HL_CORE_PROGRESSION
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: How does the player progress within the demo?
- **Reason**: Progression rules must be explicit.
- **Resolution**: Within-run score, survival time, escalating difficulty. No meta-progression beyond optional score screen.
- **Introduced By**: User

### Ledger:HL_WIN_LOSS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: What are win/loss conditions?
- **Reason**: End conditions cannot be assumed.
- **Resolution**: Win by reaching the end of the hyperlane segment (time/distance based). Loss by ship destruction. Arcade-style restart.
- **Introduced By**: User

### Ledger:HL_CONTROLS_INPUT
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What are the controls and input method?
- **Reason**: Input method and bindings must be explicit.
- **Resolution**: Keyboard. Arrow keys or WASD move; Space fire; Shift boost (optional); Esc pause/quit demo.
- **Introduced By**: User

### Ledger:HL_SCREENS_LIST
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: What screens exist in the demo?
- **Reason**: Screen flow determines UI layout.
- **Resolution**: Minimal boot/menu screen, single gameplay screen, game over/results screen (score + retry).
- **Introduced By**: User

### Ledger:HL_TECH_ENGINE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: What engine and rendering approach are used?
- **Reason**: Rendering stack must be explicit.
- **Resolution**: HTML5 Canvas. Reuse EmbeddedGameComponent architecture. Deterministic update loop (fixed timestep preferred).
- **Introduced By**: User

### Ledger:HL_TECH_PLATFORM
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Tech
- **Statement**: What platform is targeted?
- **Reason**: Platform constraints affect implementation.
- **Resolution**: Desktop browser only; keyboard required; no mobile constraints.
- **Introduced By**: User

### Ledger:HL_DEMO_SCOPE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Meta
- **Statement**: What is the intended session length and content size?
- **Reason**: Scope affects pacing and content.
- **Resolution**: 3-7 minutes per run, one hyperlane biome with escalating enemy patterns.
- **Introduced By**: User

---

### Ledger:HL_RUN_DURATION_SECONDS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: Exact run duration (seconds) or distance target for a win.
- **Reason**: Win condition timing is a required numeric value.
- **Resolution**: Win at 240 seconds (4 minutes), equivalent to ~12,000 world units. Difficulty ramps every 30 seconds.
- **Introduced By**: User

### Ledger:HL_PLAYER_STATS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: Player ship stats (size, movement speed/accel, health, hitbox margin).
- **Reason**: Core movement and survivability require explicit values.
- **Resolution**: Ship size 32x20 px. Accel 1800 px/s^2. Max speed 420 px/s. Friction 1600 px/s^2. Health 100 HP. Hitbox inset to 80% of visual size.
- **Introduced By**: User

### Ledger:HL_WEAPON_STATS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: Weapon stats (fire rate, bullet speed, damage, projectile size).
- **Reason**: Combat tuning requires explicit values.
- **Resolution**: Fire rate 8 shots/sec, bullet speed 900 px/s, damage 10 HP, bullet size 6x2 px, continuous fire on hold, soft cap ~40 bullets with oldest expiring.
- **Introduced By**: User

### Ledger:HL_ENEMY_SET
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: Enemy types and spawn cadence (counts, speeds, HP, patterns).
- **Reason**: Enemy definitions are required for the loop.
- **Resolution**: Drone (HP 20, speed 220, straight drift, spawn 1.5s early to 0.8s late, score 100). Striker (HP 40, speed 300, slight sine motion, spawn every 4s, score 250). Tank (HP 120, speed 140, slow blocker, spawn every 10-15s, score 600). Max concurrent enemies 12. Spawn rate scales linearly with time.
- **Introduced By**: User

### Ledger:HL_BOOST_RULES
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: Boost behavior (speed multiplier, duration, cooldown, input behavior).
- **Reason**: Boost affects movement feel and balance.
- **Resolution**: Boost multiplier 1.75x, duration 1.2s, cooldown 4.0s, hold-to-boost, firing remains enabled. Visual: screen streaks + engine flare.
- **Introduced By**: User

### Ledger:HL_SCORE_RULES
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: Scoring rules (points per kill, time, multiplier behavior).
- **Reason**: Score feedback requires explicit rules.
- **Resolution**: +10 pts/sec survival. Kill scores per enemy table. Combo multiplier +1x every 3 kills without taking damage, caps at x5, resets on hit.
- **Introduced By**: User

### Ledger:HL_LANE_BOUNDS
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: Lane layout and movement bounds (lane count/width or free movement bounds).
- **Reason**: Movement constraints affect feel and layout.
- **Resolution**: Free vertical movement. Playfield width is full canvas. Top/bottom margins 24 px. No hard lanes; implied via spawn patterns and parallax bands.
- **Introduced By**: User

### Ledger:HL_CONTACT_DAMAGE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: How much damage does a collision deal, and is there invulnerability time?
- **Reason**: Damage values and hit cadence affect survivability tuning.
- **Resolution**: Collision damage 20 HP with 0.5s invulnerability window.
- **Introduced By**: Task:TUNING_HL

### Ledger:HL_ENEMY_SIZES
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: What are the collision sizes for each enemy type?
- **Reason**: Sizes affect collision fairness and readability.
- **Resolution**: Drone 28x16 px. Striker 34x20 px. Tank 56x28 px.
- **Introduced By**: Task:TUNING_HL

### Ledger:HL_STRIKER_SINE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Gameplay
- **Statement**: What are the sine-wave parameters for Striker movement?
- **Reason**: Striker behavior needs explicit amplitude/frequency.
- **Resolution**: Vertical sine amplitude 18 px, frequency 2.4 rad/s, with per-spawn phase offset.
- **Introduced By**: Task:TUNING_HL

### Ledger:HL_TANK_SPAWN_INTERVAL
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: What base spawn interval should tanks use within the 10-15s band?
- **Reason**: Spawn interval impacts pacing.
- **Resolution**: Base interval 12s, scaled by global spawn ramp.
- **Introduced By**: Task:TUNING_HL

### Ledger:HL_LANE_SPEED_MODEL
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: UI
- **Statement**: How should lane speed be represented and scaled over the run?
- **Reason**: UI indicator and background motion require explicit mapping.
- **Resolution**: Lane speed indicator scales linearly from 1.0x to 1.6x over 240s. Background scroll speed scales from 260 to 420 px/s.
- **Introduced By**: Task:TUNING_HL

### Ledger:HL_SCORE_MULTIPLIER_SCOPE
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: What does the combo multiplier apply to?
- **Reason**: Score math must be explicit to be deterministic.
- **Resolution**: Multiplier applies to enemy kill scores only; survival time points are unaffected.
- **Introduced By**: Task:TUNING_HL

### Ledger:HL_SPAWN_SCALING_MODEL
- **Status**: RESOLVED
- **Type**: Decision
- **Scope**: Systems
- **Statement**: How does spawn scaling progress over time?
- **Reason**: Scaling affects pacing and difficulty curve.
- **Resolution**: Base intervals scaled by a linear factor (1.0 to 1.6 over 240s) and discrete 30s steps (+0.08 per step, max 7 steps).
- **Introduced By**: Task:TUNING_HL
