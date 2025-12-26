# Epic 3 - Cinematic Preloader Framework

## Purpose
Make entering an expanded tile feel like booting a world, not loading content, while keeping load timing controllable.

## Explicit non-goals
- Build the portal expansion system
- Implement full game content
- Tie preloaders to specific tiles via hard-coded logic

## Target fidelity stage
- Functional

## Primary agent
- Frontend Engineer

## Reviewers
- Visual Systems Designer
- UX / Ergonomics Designer
- Reviewer Proxy

## Goal
Build a system of themed preloaders that make entering an expanded tile feel like booting a world.

## Why this exists
Transitions are emotional. This epic makes waiting feel intentional and exciting.

## Scope
- Preloader components with lifecycle hooks
- Non-linear progress simulation
- Themed variants (TRON, Candy, Arcane, etc.)
- Clean handoff to real content

## Example preloaders
- Tron or System Initialization
- Candy Panic Loader
- Arcane Mana Convergence
- Vector Boot Grid

## Acceptance criteria
- Loader is visually dominant
- Progress feels dramatic, not linear
- Game or content only mounts after loader completion
- Preloader is swappable via slot
