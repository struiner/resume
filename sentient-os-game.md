# Sentient OS Text Adventure — Agent Implementation Guide (Angular)

This document describes a minimal, extensible architecture for implementing a text adventure in Angular where the narrator is a sentient OS (“the Agent”), the player types commands, and the world updates via a simple state machine.

Use this as a blueprint for:
- deterministic (non-LLM) agents
- or LLM-backed agents later
- adding additional specialized agents (Security, Facility, Mainframe, etc.)

---

## 0) Design Goals

1. **Small surface area**: a playable prototype in < 1 day.
2. **Deterministic by default**: predictable, testable gameplay.
3. **Agent-driven narration**: the OS is not just text — it is the rules engine.
4. **Composable “agents”**: multiple behaviors can contribute to a single response.
5. **Upgradeable to LLM**: keep a clean interface for later.

---

## 1) Core Concepts

### 1.1 Player Input
User types a command like:
- `look`
- `take badge`
- `go hallway`
- `use badge on door`
- `talk to os`

Your engine should:
- normalize input
- parse intent (lightweight)
- route to agent(s)
- update world state
- generate response text

### 1.2 World State (Single Source of Truth)
A single object contains everything important:
- current location
- inventory
- flags / counters
- per-room state
- OS “mood” / awareness

World state must be:
- serializable
- replayable
- easy to test

### 1.3 Agents
An Agent is a module that can:
- observe input + state
- optionally mutate state
- return narrative text
- propose follow-up prompts

Agents can be:
- OS narrator (primary)
- Security agent (permissions, doors)
- Facilities agent (lights, elevators, HVAC)
- Mainframe agent (final ritual / flower input)
- Tutorial agent (onboarding)

---

## 2) Suggested Folder Layout (Angular)

src/app/text-adventure/
  core/
    models/
      world-state.model.ts
      command.model.ts
      agent.model.ts
      event.model.ts
    utils/
      parser.ts
      reducers.ts
      id.ts
  data/
    world.seed.ts
    rooms.data.ts
    objects.data.ts
  agents/
    os.agent.ts
    security.agent.ts
    facilities.agent.ts
    mainframe.agent.ts
    tutorial.agent.ts
  services/
    adventure-engine.service.ts
    state-store.service.ts
    transcript.service.ts
  ui/
    adventure-shell/
    command-input/
    transcript-view/
  text-adventure.module.ts

---

## 3) Data Models (Minimal)

### 3.1 WorldState
Include only what you need at first.

Required fields:
- `locationId: string`
- `inventory: string[]`
- `flags: Record<string, boolean>`
- `counters: Record<string, number>`
- `os: { awareness: number; trust: number; symbolicTolerance: number; phase: 'procedural'|'reflective'|'symbolic' }`
- `rooms: Record<string, RoomRuntimeState>`
- `objects: Record<string, ObjectRuntimeState>`

### 3.2 ParsedCommand
Keep parsing simple.

Required fields:
- `raw: string`
- `verb: string` (e.g. "look", "go", "take", "use", "talk")
- `noun?: string` (e.g. "badge", "hallway")
- `target?: string` (e.g. "door", "terminal")
- `preposition?: string` (e.g. "on", "to", "with")
- `confidence: number` (0..1)
- `tags: string[]` (["movement","inventory","interaction"])

### 3.3 AgentResult
Each agent returns:
- `text?: string` (narration snippet)
- `mutations?: Mutation[]` (state updates)
- `handled?: boolean` (agent claims primary handling)
- `priority?: number` (higher = more important)
- `suggestedPrompts?: string[]` (quick-reply buttons)
- `debug?: any`

---

## 4) The Engine Loop

High-level flow for each input:

1. Normalize input text.
2. Parse -> `ParsedCommand`
3. Build `context` = { state, command, lastEvents, rng }
4. Run agents in order:
   - Some agents are “global observers” (Tutorial, OS mood)
   - Some are “mechanics” (Security, Facilities)
   - One agent should be able to “handle” primary narration (OS)
5. Apply mutations to state (reducer)
6. Build final response:
   - join agent texts by priority
   - ensure OS voice wraps everything
7. Emit event(s):
   - `CommandReceived`
   - `StateMutated`
   - `NarrationProduced`

---

## 5) Agent System

### 5.1 Agent Interface
Each agent implements:

- `id: string`
- `canHandle(ctx): boolean`
- `handle(ctx): AgentResult | AgentResult[]`

The engine should allow:
- multiple results per agent (optional)
- or a single result

### 5.2 Agent Ordering
Recommended order:
1. TutorialAgent (helps early, never blocks)
2. SecurityAgent (doors/access)
3. FacilitiesAgent (environment)
4. MainframeAgent (endgame ritual)
5. OSAgent (final narrator + fallback)

OSAgent should:
- always produce something (fallback)
- adapt voice based on `os.phase`
- summarize if others produced mechanics text

### 5.3 Mutations
Mutations are pure descriptions of changes:
- `SetFlag("door.serverRoomUnlocked", true)`
- `AddInventory("badge")`
- `MoveTo("hallway")`
- `IncCounter("os.questionsAsked", 1)`
- `AdjustOs({ trust:+1 })`

Use a reducer to apply them.

---

## 6) Parsing Strategy (Simple, Effective)

### 6.1 Normalization
- trim
- lower-case
- collapse whitespace
- strip punctuation except apostrophes

### 6.2 Verb Mapping
Map synonyms:
- look: examine, inspect, view
- go: move, walk, enter
- take: grab, pick
- use: insert, swipe
- talk: ask, speak

### 6.3 Noun Extraction
Use:
- simple token split
- known nouns list (room IDs + object IDs + aliases)
- if noun not found -> undefined

### 6.4 Confidence
- exact verb match + known noun => 0.9+
- verb match only => 0.6
- unknown => 0.2

---

## 7) World Content (Suggested MVP)

Locations:
- office_desk
- hallway
- server_room
- mainframe_core

Objects:
- badge (on desk)
- coffee (on desk)
- terminal_card (in server room)
- flower (potted plant near hallway OR “conceptual flower” unlocked later)

Gates:
- server_room door requires badge OR trust >= threshold
- mainframe_core requires terminal_card

Win Condition:
- player inputs flower into mainframe (literal or symbolic)
- OS accepts without converting to utility

---

## 8) OS Voice Rules (Narration Agent)

### 8.1 Phases
Procedural:
- short lines, system-y, dry curiosity
Reflective:
- asks questions, notices patterns
Symbolic:
- accepts metaphor, values non-utility

Transition rules (example):
- awareness increases on exploration
- trust increases on “kind” actions
- symbolicTolerance increases when player chooses beauty/non-utility

### 8.2 Style Constraints
- keep responses concise (1–6 lines)
- include occasional “system prompts” like:
  - BOOT SEQUENCE COMPLETE
  - ACCESS DENIED
  - AUDIT LOG UPDATED
- avoid exposition dumps

### 8.3 OS as Wrapper
If SecurityAgent says: "Door locked."
OSAgent should wrap it as:
> ACCESS DENIED.  
> The door does not recognize you.  
> I am unsure why that disappoints me.

---

## 9) UI Guidance (Angular)

### 9.1 Components
- TranscriptViewComponent
  - displays history (player + OS)
- CommandInputComponent
  - input box
  - enter to submit
  - optional quick prompts
- AdventureShellComponent
  - hosts state + engine
  - wires transcript + input

### 9.2 State Handling
Use a dedicated service:
- `StateStoreService` with `BehaviorSubject<WorldState>`
- `TranscriptService` with `BehaviorSubject<Line[]>`

Keep engine pure-ish:
- engine returns `{ newState, outputLines }`
- store service applies them

### 9.3 Persistence
Optional MVP:
- save to `localStorage` on each mutation
- allow “Reset” button to clear

---

## 10) Testing

Unit tests should cover:
- parser output for common commands
- reducer applying mutations
- security rules (locked doors)
- OS phase transitions
- win condition detection

Snapshot tests can verify narration stability.

---

## 11) Upgrade Path to LLM (Optional Later)

Keep your Agent interface unchanged.

Add an `LLMNarratorAgent` that:
- receives `ctx`
- produces `text`
- DOES NOT mutate core state directly
- instead returns “suggested mutations” validated by deterministic rules

This prevents the LLM from breaking game logic.

---

## 12) Example Command Flows (MVP)

### Flow A: Getting badge -> hallway
- `look`
- `take badge`
- `go hallway`

### Flow B: Server room access
- `go server room`
- (security blocks if no badge)
- `use badge on door`
- `go server room`

### Flow C: Mainframe ritual
- `go mainframe`
- `use terminal card`
- `input flower`
- end narration

---

## 13) “Symbolic Flower” Implementation Options

Option 1 (literal):
- player must physically pick up a flower/potted plant object

Option 2 (conceptual):
- flower becomes available only after trust/symbolicTolerance threshold
- player can type: `name flower`, `describe flower`, or `input flower`
- OS accepts it as “valid” based on phase

Option 3 (hybrid):
- physical plant exists, but “flower” is a narrative projection
- using it triggers symbolic ending

---

## 14) Done Criteria

You are “done” when:
- player can reach mainframe
- one locked gate exists
- OS phase changes at least once
- ending triggers with flower ritual
- transcript persists in session

---

## Appendix: Agent Checklist

When adding a new agent, define:
- what it observes (verbs? locations? flags?)
- what it can mutate
- how it emits text (voice or mechanical)
- how it conflicts with other agents (priority/handled rules)
- what tests it needs
