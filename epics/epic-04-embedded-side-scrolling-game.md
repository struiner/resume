# Epic 4 - Embedded Side-Scrolling Game Engine (Mini-Game)

## Purpose
Provide a lightweight side-scrolling game that can run inside an expanded tile as a self-contained experience.

## Explicit non-goals
- Create a full game with multiple levels or persistence
- Use external rendering engines beyond DOM, CSS, or canvas
- Add online features, analytics, or account systems

## Target fidelity stage
- Functional

## Primary agent
- Frontend Engineer

## Reviewers
- UX / Ergonomics Designer
- Reviewer Proxy

## Goal
Create a compact, polished side-scrolling game that launches inside an expanded tile and remains responsive and readable throughout.

## Why this exists
This is the moment of surprise: a game launched from a tiny UI tile.

## Scope
- Game viewport sized to expanded dialog
- Clean init and teardown
- Input handling (keyboard, pointer, touch)
- Camera scrolling
- Minimal physics (gravity, collisions)
- Lightweight entities (player, obstacles, pickups)
- Optional score and restart loop

## Rendering options
- DOM and CSS (vector or retro)
- Canvas (pixel or tile-based)

## Key deliverables
- EmbeddedGameComponent (hosted inside expandable dialog)
- Game loop with start, pause, stop
- Input controller abstraction
- Collision and bounds handling
- Theme hooks for styling and assets

## Example game concepts
- Candy Runner (jump and collect)
- Vector Hopper (single-color geometric obstacles)
- Arcane Glide (float and avoid)

## Acceptance criteria
- Game starts only when dialog is open
- Game loop stops on close
- No memory leaks
- Input response feels immediate
- Playable within 5 seconds of launch
