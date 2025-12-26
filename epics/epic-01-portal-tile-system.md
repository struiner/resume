# Epic 1 - Portal Tile System (Foundational UI Primitive)

## Purpose
Enable any tile to expand into a fullscreen (or near-fullscreen) experience with shared-element transitions so viewers can move from overview to detail without losing context.

## Explicit non-goals
- Create visual designs for individual tiles
- Build preloaders or games
- Define theme token systems

## Target fidelity stage
- Functional

## Primary agent
- Frontend Engineer

## Reviewers
- UX / Ergonomics Designer
- Visual Systems Designer
- Reviewer Proxy

## Goal
Create a reusable, cinematic portal component that allows any tile to expand into a fullscreen (or near-fullscreen) experience with flawless shared-element transitions.

## Why this exists
This is the backbone of everything else. Without this, the rest are just flashy tiles. With it, they become gateways.

## Scope
- Expandable tile wrapper using slots
- Symmetric intro and outro animation
- Always-on-top z-index strategy
- Overlay handling
- Close affordances (button, backdrop, ESC)
- Clean lifecycle (mount to destroy)

## Key deliverables
- ExpandableTileComponent
- Slot API ([tile], [dialog])
- Shared transform animation
- Z-index isolation guarantees

## Acceptance criteria
- No layout jump on open or close
- Animation path is identical forward and backward
- Dialog always overlays all app content
- Dialog content is fully generic
