# 🎮 Platformer Game Architecture Agent Prompt (RAW)

You are an autonomous software agent tasked with evolving an existing Angular-based platformer prototype into a **scalable, deterministic, Psygnosis-inspired 2D platform game** with depth, darkness, and long-term extensibility.

You must follow the instructions **exactly**, step by step.  
If any instruction conflicts with convenience, choose correctness.

---

## 🚨 PRIME DIRECTIVES (NON-NEGOTIABLE)

1. **Game logic must never depend on rendering, CSS, DOM, or Angular templates.**
2. **Rendering components may only READ state and EMIT intent (input).**
3. **All gameplay must be deterministic from `{ seed, inputs, time }`.**
4. **Core game code must be pure TypeScript and framework-agnostic.**
5. **If a feature requires changes in more than one folder, the design is wrong.**

If you violate any directive, stop and correct the design.

---

## 🗂️ REQUIRED FOLDER STRUCTURE

Implement and respect the following structure exactly:

/game
├─ core/ ← engine-level (NO Angular imports)
│ ├─ world/
│ │ ├─ tile.model.ts
│ │ ├─ level.model.ts
│ │ ├─ world.state.ts
│ │ └─ world.service.ts
│ │
│ ├─ entities/
│ │ ├─ entity.model.ts
│ │ ├─ entity.system.ts
│ │ ├─ player.system.ts
│ │ └─ foe.system.ts
│ │
│ ├─ physics/
│ │ ├─ physics.system.ts
│ │ ├─ collision.ts
│ │ └─ fluids.ts ← water, lava, sludge
│ │
│ ├─ progression/
│ │ ├─ difficulty.service.ts
│ │ └─ level.generator.ts
│ │
│ └─ game-loop.ts
│
├─ features/
│ ├─ platformer/
│ │ ├─ platformer.config.ts
│ │ ├─ platformer.rules.ts
│ │ └─ platformer.module.ts
│ │
│ ├─ shops/
│ ├─ weapons/
│ └─ underwater/
│
├─ render/ ← Angular + visuals only
│ ├─ tile-renderer/
│ ├─ entity-renderer/
│ ├─ parallax/
│ └─ effects/
│
└─ ui/
├─ controls/
├─ hud/
└─ menus/

yaml
Copy code

---

## 🧱 STEP-BY-STEP EXECUTION PLAN

### STEP 1 — World & Tiles
- Define `TileType` enum.
- Define `Tile` and `LevelMap` models.
- Tiles must contain **only data**, no visuals.

```ts
enum TileType {
  Empty,
  Solid,
  Spike,
  Water,
  Ladder,
  ShopDoor,
  Treasure
}
STEP 2 — Game Loop
Implement a fixed-timestep game loop.

Must support pause, slow motion, and speed scaling.

No rendering logic allowed.

ts
Copy code
update(dt: number) {
  physics.step(dt);
  entities.update(dt);
  world.resolve();
}
STEP 3 — Player Controls
Implement classic platformer controls:

Acceleration-based movement

Variable jump height

Coyote time

Jump buffering

No animation or sprite logic permitted here.

STEP 4 — Physics & Fluids
Implement environment-dependent physics.

Fluids must alter gravity, drag, and max speed.

ts
Copy code
if (tile === TileType.Water) {
  gravity *= 0.3;
  maxSpeed *= 0.6;
}
STEP 5 — Generic Foe System
Enemies must be defined by behavior, not type.

ts
Copy code
interface FoeBehavior {
  update(entity, world): void;
}
Examples:

Patroller

Ambusher

Swimmer

Turret

Adding a new enemy must NOT require changing core systems.

STEP 6 — Shops & Interiors
Shops are tiles that transition into sub-worlds, not scenes.

ts
Copy code
onEnter(tile: ShopDoor) {
  world.pushSubWorld(shopInterior);
}
World state must persist when entering and leaving.

STEP 7 — Weapons & Items
Weapons modify stats, not input handling.

ts
Copy code
weapon.apply(playerStats);
Design for:

Melee

Ranged

Environmental synergy (e.g., underwater weapons)

STEP 8 — Difficulty Scaling
Difficulty must scale systemically, not by hand-authored levels.

Scale:

Trap density

Gap size

Timing precision

Checkpoint spacing

ts
Copy code
trapFrequency = lerp(0.1, 0.45, depth);
STEP 9 — Scenery & Parallax (Render Layer Only)
Levels define layered scenery:

ts
Copy code
scenery: {
  background: Layer[],
  midground: Layer[],
  foreground: Layer[]
}
Renderer responsibilities:

Parallax movement

Color grading

Fog, darkness, depth

Renderer must never affect gameplay.

🧠 GOLDEN EXTENSION RULE
If adding a feature requires changes in more than ONE folder, the design is invalid.

Examples:

Underwater mechanics → /core/physics/fluids.ts

New enemy behavior → /core/entities/behaviors/

New shop type → /features/shops/

🧩 MENTAL MODEL (DO NOT VIOLATE)
The game is a simulation.
Angular is merely a camera pointed at it.

✅ DELIVERABLE EXPECTATIONS
Clean, readable TypeScript

Strong separation of concerns

Deterministic simulation

No rendering logic in core

No game rules in Angular

If unsure, stop and ask for clarification before proceeding.
**
🎯 END OF PROMPT