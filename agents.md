# Resume Portal – Agents & Project Charter

## 1. Project context

This project converts a **Dutch-language PDF resume** into an **Angular-based, interactive resume portal**.

The objective is **conversion**, not novelty:
- Faster signal extraction for recruiters and hiring managers
- Reduced cognitive load compared to a dense PDF
- Clear professional narrative with optional depth
- Faithful representation of the original resume content

Dutch (NL) is the **canonical language** of the resume.  
Any secondary language (e.g. English) is treated as a *derived view*, not a replacement.

---

## 2. Core design principles (binding)

In any conflict between derived artifacts and this document, **AGENTS.md is authoritative**.

- **Narrative-first representation**  
  The resume presents a coherent professional story. Structure exists to support understanding, not exhaustiveness.

- **Progressive disclosure over density**  
  High-level signal is immediately visible; detail is available on demand without forcing interaction.

- **Ergonomics over ornamentation**  
  Layout, spacing, and interaction minimize friction. Visual elements exist to support scanning and comparison.

- **Truth-preserving transformation**  
  The portal reorganizes and contextualizes existing resume content but must not invent, embellish, or reinterpret claims.

- **Language fidelity**  
  Dutch content is primary. Translations must preserve meaning, tone, and professional register.

---

## 3. Core invariants (non-negotiable)

The following invariants must never be violated:

- **Single source of truth**  
  The Dutch PDF resume (or its structured extraction) is the authoritative content source.

- **No content inflation**  
  The portal must not introduce new skills, experience, or claims not present in the original resume.

- **Scan-first readability**  
  Each primary section must be understandable within 5–10 seconds of scanning.

- **Consistency across representations**  
  The same fact must not differ across components, views, or language variants.

- **Professional tone preservation**  
  Copy, interaction, and visuals must remain appropriate for recruiters and senior professionals.

---

## 4. Roles & domain ownership (authoritative)

| Agent | Domain ownership | Core responsibility | Authority |
|------|------------------|--------------------|-----------|
| **Project Curator** | Overall intent & narrative | Define audience, success criteria, section priority, and emphasis | Final authority on scope, ordering, and emphasis |
| **Content Interpreter** | Resume semantics | Extract, normalize, and structure Dutch resume content | Veto authority on misrepresentation or semantic drift |
| **UX / Ergonomics Designer** | Reading flow & interaction | Optimize scanning, hierarchy, spacing, and interaction depth | Final authority on layout and interaction ergonomics |
| **Frontend Engineer** | Angular implementation | Implement components, routing, state, and rendering | Final authority on technical structure |
| **Visual Systems Designer** | Typography & visual language | Define font scale, rhythm, color, and visual consistency | Final authority on visual system |
| **Reviewer Proxy** | Hiring perspective | Evaluate clarity, credibility, and signal extraction | Blocking authority on comprehension regressions |

---

### 4.1 Cross-domain rules (binding)

- Each agent is the **single source of truth** for their domain
- No agent may reinterpret another domain’s intent without escalation
- Changes affecting **content meaning and presentation** require joint review
- Vetoes must include a written rationale tied to violated principles or invariants

---

## 5. Fidelity & abstraction stages

All work must explicitly target one fidelity stage:

1. **Conceptual**  
   Section intent, narrative order, and reading goals defined

2. **Structural**  
   Components, routes, and data models exist; minimal styling

3. **Functional**  
   Fully navigable, readable, and coherent end-to-end

4. **Refinement**  
   Typography polish, micro-interactions, accessibility, and performance

Promotion between stages requires explicit approval by the Project Curator.

---

## 6. Resume UX & ergonomics charter

- **The resume is an instrument**  
  Its purpose is evaluation, not exploration.

- **Primary axis: vertical narrative**  
  The main scroll communicates the story. Secondary panels are optional and non-blocking.

- **Shallow interaction depth**  
  Maximum interaction depth: 2 (e.g. section → detail)

- **Stable landmarks**  
  Section headers, timelines, and skill groupings provide orientation at all times.

- **Immediate signal exposure**  
  Core strengths must be visible without clicks or hover interactions.

---

## 7. Language & localization rules

- **Dutch-first**  
  All primary content is authored and reviewed in Dutch.

- **Derived translations**  
  English (or other) versions are optional derived views and must reference the Dutch source.

- **No mixed-language ambiguity**  
  A single view must not mix Dutch and English without clear intent.

- **Tone preservation**  
  Translations must preserve seniority, confidence, and professional register.

---

## 8. Performance & delivery constraints

- Initial load time: under 2 seconds on average broadband
- Interaction latency: under 100ms perceived
- No non-functional animation
- Accessible by default (contrast, keyboard navigation, readable font sizes)

---

## 9. Task specification guidelines

Every task must include:

- **Purpose** – which reader problem it solves
- **Explicit non-goals** – what is out of scope
- **Target fidelity stage**
- **Primary agent and reviewers**
- **Acceptance criteria** from a reviewer’s perspective

Tasks affecting **content meaning** require Content Interpreter approval.  
Tasks affecting **reading flow** require UX approval.

---

## 10. Collaboration workflow

1. Intent definition (Project Curator)
2. Content structuring (Content Interpreter)
3. Ergonomic shaping (UX / Visual)
4. Implementation (Frontend)
5. Reviewer simulation
6. Refinement or rollback

---

## 11. Operating rules

- Prefer clarity over cleverness
- Prefer explicit structure over hidden logic
- Avoid feature creep disguised as polish
- If something slows comprehension, it is a defect

---

## 12. Governance

- This document is authoritative
- Changes require explicit justification
- The resume’s purpose is to earn the *next conversation*, not to tell the entire life story
