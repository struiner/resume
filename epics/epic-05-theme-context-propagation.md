# Epic 5 - Theme and Context Propagation System

## Purpose
Allow tiles to pass theme context into preloaders and games automatically to keep the system cohesive without hard-coded coupling.

## Explicit non-goals
- Add tile-specific logic in the portal component
- Define new themes beyond the provided examples

## Target fidelity stage
- Functional

## Primary agent
- Frontend Engineer

## Reviewers
- Visual Systems Designer
- UX / Ergonomics Designer
- Reviewer Proxy

## Goal
Allow tiles to pass theme context (color, mood, type) into preloaders and games automatically.

## Why this exists
This turns a collection of demos into a cohesive system.

## Scope
- Theme tokens (for example: candy, vector, arcane)
- Injection into dialog content
- Optional CSS variable propagation
- Zero hard-coding between components

## Examples
- Candy tile to candy loader to candy game
- Hyperlane tile to TRON loader to vector game
- Mana Bloom to arcane loader to spell UI

## Acceptance criteria
- No tile-specific logic in portal
- Dialog content adapts automatically
- Easy to add new themes
- Works with projected content
