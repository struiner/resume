# Pinball Fantasies-Style Concept Pack (Glitch.io)

Scope: This document instantiates the game-creation protocol using the Glitch.io epic, static definitions, and wireframe definitions as the sole sources of truth. No additional mechanics, values, or narrative claims are introduced.

Sources:
- glitch_io.epic.md
- glitch_io.static.definitions.md
- glitch_io.wireframe.definitions.md
- game-creation-epic.md

---

## Task:ROOT (Instance: GLITCH_IO_PINBALL_FANTASIES)
- **Goal**: Produce a complete, playable single-table pinball game that aligns with a classic Pinball Fantasies-style loop, using the Glitch.io specification as the authoritative source.
- **Inputs**: None
- **Outputs**:
  - Game Vision
  - Core Gameplay Loop
  - Systems Design
  - World & Content
  - UI/UX
  - Technical Implementation
- **Subtasks**:
  - TASK:VISION_GLITCH_IO
  - TASK:CORE_LOOP_GLITCH_IO
  - TASK:WORLD_GLITCH_IO
  - TASK:SYSTEMS_GLITCH_IO
  - TASK:UI_GLITCH_IO
  - TASK:TECH_GLITCH_IO
- **Status**: PENDING

---

## Task:VISION_GLITCH_IO
- **Goal**: Define what game is being made
- **Inputs**: None
- **Outputs**:
  - Genre: Single-table pinball simulation with classic letter-spelling modes.
  - Player fantasy: You are a pinball wizard operating a sentient pinball cabinet.
  - Tone: Retro-future neon, digital distortion, subtle humor, cyberpunk arcade.
  - Design pillars:
    - Skill and flow through responsive flippers and loop shots.
    - Glitch as a telegraphed, exploitable mechanic.
    - Homage through variety: multiball, timed scoring, target knockdowns, multi-stage modes.
    - Clarity and feedback via LEDs, callouts, and UI timers.
    - Progression and mastery via achievements and cosmetics.
- **Blocked By**: None
- **Produces Ledgers**: None
- **Status**: DONE

---

## Task:CORE_LOOP_GLITCH_IO
- **Goal**: Define the repeating gameplay loop
- **Inputs**:
  - Vision outputs
- **Outputs**:
  - Player actions: launch ball, control flippers, shoot targets/ramps/loops, nudge, start modes.
  - Feedback: top bar (score, balls, multiplier, timers), right panel (letters, mode progress, jackpots), bottom status bar (callouts), audio cues per event.
  - Progression: spell letter sequences to unlock modes; build combo multipliers; earn extra balls; unlock cosmetics/achievements.
  - Win/Loss: game ends when all balls drain; success is high score and achievements.
- **Blocked By**: None
- **Produces Ledgers**: None
- **Status**: DONE

---

## Task:WORLD_GLITCH_IO
- **Goal**: Define world and fiction
- **Inputs**:
  - Vision outputs
- **Outputs**:
  - Setting: Sentient pinball cabinet in a cyberpunk arcade in Rotterdam; playfield is a circuit-board mindscape.
  - Entities: ball, flippers, bumpers, ramps/loops, targets, inlanes/outlanes, modes.
  - World rules: deterministic physics; letter lamps persist until mode start or ball drain; telegraphed glitch events; tilt warnings enforce nudging limits.
- **Blocked By**: None
- **Produces Ledgers**: None
- **Status**: DONE

---

## Task:SYSTEMS_GLITCH_IO
- **Goal**: Define gameplay systems
- **Inputs**:
  - Core loop outputs
- **Outputs**:
  - Mechanics: deterministic physics, combo multiplier, glitch events, mode timers, extra ball and ball save, mystery award.
  - Resources: balls, score, multiplier, letters collected, glitch rating.
  - Progression systems: modes (Data Multiball, Overclock, Debug Round, Poltergeist), achievements, cosmetic cabinet skins.
- **Blocked By**: None
- **Produces Ledgers**: None
- **Status**: DONE

---

## Task:UI_GLITCH_IO
- **Goal**: Define player interaction via screens and controls
- **Inputs**:
  - Systems outputs
- **Outputs**:
  - Screens: Main Menu, Table Play, Pause Menu, Game Over, Settings.
  - Controls: keyboard (Z/Left, / or Right, Space/Down, X/C/Up, Esc/P), touch buttons, optional remapping.
  - Feedback mechanisms: LED lamps, flashing ramps, mode timers, audio callouts, status bar text, accessibility options.
- **Blocked By**: None
- **Produces Ledgers**: None
- **Status**: DONE

---

## Task:TECH_GLITCH_IO
- **Goal**: Define implementation approach
- **Inputs**:
  - Systems outputs
  - UI outputs
- **Outputs**:
  - Engine: Angular SPA with Canvas/WebGL rendering and deterministic physics (e.g., Matter.js).
  - Platform: Modern desktop and mobile browsers.
  - Build/run instructions: LEDGER:TECH_BUILD_RUN_GLITCH_IO
- **Blocked By**:
  - Ledger:TECH_BUILD_RUN_GLITCH_IO
- **Produces Ledgers**:
  - Ledger:TECH_BUILD_RUN_GLITCH_IO
- **Status**: BLOCKED

---

### Ledger:TECH_BUILD_RUN_GLITCH_IO
- **Status**: OPEN
- **Type**: Decision
- **Scope**: Tech
- **Statement**: What are the explicit build and run steps for the Glitch.io Angular application?
- **Reason**: The epic references build tooling but does not specify exact commands or scripts.
- **Resolution**: 
- **Introduced By**: Task:TECH_GLITCH_IO
