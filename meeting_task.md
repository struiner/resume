# Task: Functional Alignment Session — Embedded Game Component

## Purpose

Resolve discrepancies between expected and observed behavior in the Embedded Game
by conducting a cross-role functional alignment session and producing:
- Explicit design choices (ledger-choices)
- Actionable follow-up tasks
- Clear ownership boundaries

This task exists to **reduce ambiguity before implementation**, not to change code.

---

## Target Fidelity Stage

**Conceptual → Structural (blocked until completion)**

No promotion to Structural is allowed until all resulting ledger-choices are ratified.

---

## Participants & Roles

- **Project Curator**  
  Owns intent, scope, and success criteria for the embedded game within the portal.

- **UX / Ergonomics Designer**  
  Owns player perception, fairness, responsiveness, and cognitive load.

- **Frontend Engineer**  
  Owns feasibility, architectural implications, and implementation constraints.

- **Reviewer Proxy**  
  Simulates player perspective, focusing on perceived fairness and clarity.

---

## Session Scope (Explicit)

### In Scope
- Functional behavior of the game
- Player interaction rules
- Scoring semantics
- Difficulty progression
- Fairness and predictability

### Out of Scope (Non-goals)
- Visual polish
- Animations
- Audio
- Performance optimizations
- Refactoring or implementation changes

---

## Agenda & Findings

### 1. Game Objective

**Discussion Outcome**
- Consensus that the game must be understandable within seconds
- Endless survival aligns with short-session expectations

**Resulting Artifact**
- Ledger Choice required: **LC-001 — Game Objective**

**Blocking Status**
- Cannot proceed without explicit selection

---

### 2. Start Semantics & Fairness

**Observed Issue**
- Early obstacle spawning can cause perceived unfairness
- No onboarding buffer exists

**UX Position**
- Grace period materially improves trust and learning

**Engineering Position**
- Grace period is trivial to implement once specified

**Resulting Artifact**
- Ledger Choice required: **LC-002 — Start Semantics**

---

### 3. Jump Responsiveness

**Observed Issue**
- Jump input sometimes ignored
- Ground detection is numeric and implicit

**Reviewer Proxy Feedback**
- Ignored input is perceived as a bug, not difficulty

**Consensus**
- Jump eligibility must be rule-based, not positional coincidence

**Resulting Artifacts**
- Ledger Choice required: **LC-003 — Player Jump Eligibility**
- Ledger Choice required: **LC-004 — Ground Definition**

---

### 4. World Motion Model

**Observed Issue**
- World offset exists but has no functional impact
- Mental model unclear

**Engineering Risk**
- Hybrid models increase cognitive load and bug surface

**Consensus**
- One motion model must be canonical

**Resulting Artifact**
- Ledger Choice required: **LC-005 — World Motion Model**

---

### 5. Obstacles & Fairness Envelope

**Reviewer Proxy Concern**
- Random clustering can create unavoidable deaths

**UX Principle Applied**
- Difficulty should feel earned, not arbitrary

**Engineering Constraint**
- Guaranteeing avoidability requires explicit spacing rules

**Resulting Artifact**
- Ledger Choice required: **LC-006 — Obstacle Fairness**

---

### 6. Collectibles & Meaning

**Observed Issue**
- Collectibles exist without a clear gameplay purpose

**Project Curator Position**
- Every mechanic must justify its cognitive footprint

**Consensus**
- Collectibles must either reinforce risk/reward or be demoted to flavor

**Resulting Artifact**
- Ledger Choice required: **LC-007 — Collectible Purpose**

---

### 7. Scoring Model

**Observed Issue**
- Score is frame-rate dependent
- Meaning of score is unclear to players

**Reviewer Proxy Feedback**
- Score should clearly answer: “How well did I do?”

**Consensus**
- Scoring must be deterministic and semantically meaningful

**Resulting Artifact**
- Ledger Choice required: **LC-008 — Scoring Model**

---

### 8. Game Over Semantics

**Observed Issue**
- Abrupt termination lacks feedback

**UX Position**
- Even minimal feedback improves emotional closure

**Engineering Note**
- Feedback does not require animation initially

**Resulting Artifact**
- Ledger Choice required: **LC-009 — Game Over Semantics**

---

### 9. Difficulty Progression

**Observed Issue**
- Difficulty scaling is opaque and inconsistent

**Consensus**
- Difficulty progression must be explainable and testable

**Resulting Artifact**
- Ledger Choice required: **LC-010 — Difficulty Progression**

---

## Resulting Action Items

### A. Ledger Ratification Task
- **Owner:** Project Curator
- **Reviewers:** UX Designer, Frontend Engineer
- **Action:** Fill in selections for LC-001 through LC-010
- **Blocking:** Yes

### B. Constraint Mapping Task
- **Owner:** Frontend Engineer
- **Reviewers:** UX Designer
- **Action:** Map each ratified ledger-choice to explicit code constraints
- **Blocking:** Yes (blocks implementation)

### C. Reviewer Validation Task
- **Owner:** Reviewer Proxy
- **Action:** Validate that ratified choices align with fairness and clarity expectations
- **Blocking:** Yes

---

## Acceptance Criteria

This task is complete when:

- All referenced ledger-choices have a single, explicit selection
- No unresolved ambiguity remains in core gameplay rules
- All participants agree the game’s behavior can be explained in one paragraph
- Structural or implementation work can proceed without reinterpretation

---

## Notes

This task intentionally produces **decisions, not code**.
Any implementation work initiated before completion constitutes a governance violation.
