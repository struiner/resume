# Epic: Comic-Book Style Tile Borders (Franco-Belgian 90’s Aesthetic)

## Epic Summary

Create a **comic-book–inspired visual border system** for a tile-based world, evoking the playful, hand-drawn panel borders of **1990s Franco-Belgian comics**.  
The system must preserve a **strict logical grid** for gameplay and simulation, while introducing **organic, irregular, inked borders** between tiles at the rendering layer.

This epic focuses on **controlled visual chaos**: tiles must always fit perfectly together, but never *look* mechanically cut.

---

## Core Vision

> *“The world is a grid that pretends it isn’t.”*

- Tiles remain square in logic, coordinates, adjacency, and collision.
- Visually, tiles appear as if cut by hand, with uneven borders and expressive ink lines.
- Borders feel playful, alive, and slightly imperfect—like comic panels drawn by a human hand.

This visual style should feel **intentional, cohesive, and deterministic**, not random noise.

---

## Design Pillars

### 1. Separation of Concerns
- **Logic Layer**:  
  - Perfect grid
  - Deterministic adjacency
  - No visual irregularities
- **Visual Layer**:  
  - Irregular borders
  - Organic shapes
  - Ink-like variation

Never compromise the logic layer for visual flair.

---

### 2. Edge-Based Border System
- Borders are defined **per edge**, not per tile.
- Each shared edge between two tiles is generated **once** and reused by both tiles.
- Adjacent tiles must:
  - Share the exact same edge geometry
  - Use mirrored or flipped variants where appropriate

This guarantees:
- No gaps
- No overlaps
- Perfect visual continuity

---

### 3. Deterministic Generation
- All borders are generated from:
  - Global seed
  - Tile coordinates
  - Edge orientation (N/E/S/W)
- The same world seed must always generate the same borders.
- No runtime randomness without seed influence.

---

### 4. SVG-Driven Rendering
- Tile visuals use **SVG masks / clipPaths** to define their visible shape.
- Each tile assembles its final mask from four edge definitions.
- SVG is preferred for:
  - Smooth curves
  - Scalable resolution
  - Precise control
  - Easy mirroring and rotation

---

## Functional Requirements

### Tile Rendering
- Each tile:
  - Renders as a square container
  - Applies an SVG mask composed of four edges
  - Supports zooming without pixel artifacts

### Border Edge Definitions
- Define a small, reusable vocabulary of edge styles:
  - Slight wobble
  - Bulge
  - Notch
  - Zig / wave
  - Almost-straight (human-imperfect)
- Edge styles must be:
  - Parametric
  - Rotatable
  - Mirrorable

### Adjacency Awareness
- Tile components must know:
  - Which neighbors exist
  - Which edges are external (world boundary) vs internal (shared)

External edges may use:
- Thicker ink
- More dramatic shapes
- Optional “panel break” effects

---

## Non-Goals (Important)

- ❌ No irregular tile positioning
- ❌ No physics or collision changes
- ❌ No per-frame random jitter
- ❌ No gaps or overlaps between tiles

This epic is **purely visual**.

---

## Stretch Goals (Optional, Later Phases)

- Variable ink thickness per edge
- Slight misregistration (comic print feel)
- Occasional missing borders (open panels)
- Paper texture overlay
- Era-specific presets (clean vs chaotic linework)

---

## Suggested Implementation Phases

### Phase 1 — Visual Overlay Prototype
- Rectangular tiles
- Hand-drawn border strokes overlaid on top
- No masking yet

### Phase 2 — SVG Masked Tiles
- Edge-based SVG clipPaths
- Deterministic edge generation
- Perfect tile-to-tile continuity

### Phase 3 — Stylization & Polish
- Ink variation
- Texture
- Boundary dramatization

---

## Definition of Done

- Tiles render with comic-style borders
- Adjacent tiles share seamless edges
- Visual style is playful but controlled
- World remains logically grid-perfect
- Style is deterministic from seed
- System is extensible and maintainable

---

## Final Note

This epic aims to create a **signature visual identity**.  
The result should feel *hand-drawn, alive, and mischievous*—while remaining technically elegant and robust.

If it looks slightly imperfect, it’s working.
If it breaks the grid, it’s not.
