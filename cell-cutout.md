# agents.md
## Multi-Agent Orchestration Specification
## Biologically Accurate Cell Cut-Through Generator

---

## System Overview

This system generates biologically accurate, vector-based cell cut-through illustrations using multiple specialized agents operating in a strict validation and refinement pipeline.

Each agent has a single responsibility and must not exceed its authority.

Primary goals:
- Scientific correctness
- SVG vector fidelity
- Interactive, explorable educational output
- Deterministic, inspectable agent handoffs

---

## Agent Graph (Execution Order)

1. CellSpecAgent
2. BiologyValidatorAgent
3. LayoutComposerAgent
4. SVGRenderAgent
5. InteractionAnnotatorAgent
6. FinalSanityAgent

No agent may be skipped.

---

## Shared Data Contract

All agents communicate via a shared JSON document called `CellSpec`.

Agents may only:
- Read from previous fields
- Append new sections
- Never mutate or delete prior agent output

---

## Agent 1 — CellSpecAgent

### Responsibility
Define the biological and structural specification for the requested cell type.

### Inputs
- Requested cell type
- Optional specialization (e.g. neuron, muscle cell)
- Optional education level (basic / advanced)

### Outputs (CellSpec.biological)

```json
{
  "cellType": "animal",
  "specialization": null,
  "organelles": [
    {
      "id": "nucleus",
      "name": "Nucleus",
      "required": true,
      "membranes": 2,
      "relativeSize": 0.25,
      "function": "Houses genetic material and regulates gene expression"
    }
  ]
}
```

### Constraints
- Only real biological organelles allowed
- No artistic or layout decisions

---

## Agent 2 — BiologyValidatorAgent

### Responsibility
Validate biological correctness of the CellSpec.

### Inputs
- CellSpec.biological

### Outputs (CellSpec.validation)

```json
{
  "status": "approved",
  "warnings": [],
  "errors": []
}
```

### Validation Rules
- Organelles must belong to the specified cell type
- Membrane counts must be correct
- Functions must be scientifically accurate
- Relative sizes must be plausible

If errors exist, the pipeline must halt.

---

## Agent 3 — LayoutComposerAgent

### Responsibility
Convert biological specifications into a spatial layout model.

### Inputs
- CellSpec.biological
- CellSpec.validation (must be approved)

### Outputs (CellSpec.layout)

```json
{
  "canvas": { "width": 1000, "height": 1000 },
  "cutawayAngle": "frontal",
  "layers": [
    {
      "organelleId": "nucleus",
      "center": { "x": 520, "y": 510 },
      "radius": 230,
      "zIndex": 3
    }
  ]
}
```

### Constraints
- No SVG syntax
- No biological decisions
- Must respect relative size ratios

---

## Agent 4 — SVGRenderAgent

### Responsibility
Render the layout into valid SVG markup.

### Inputs
- CellSpec.layout
- CellSpec.biological

### Outputs (CellSpec.svg)

```xml
<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <g id="nucleus">
    <path d="..." />
  </g>
</svg>
```

### Rendering Rules
- SVG only
- Vector paths only
- Each organelle wrapped in a `<g>` with stable `id`
- No scripts, no stylesheets

---

## Agent 5 — InteractionAnnotatorAgent

### Responsibility
Annotate SVG with interaction metadata.

### Inputs
- CellSpec.svg
- CellSpec.biological

### Outputs (CellSpec.interactiveSvg)

```xml
<g id="mitochondrion"
   data-label="Mitochondrion"
   data-description="Produces ATP through cellular respiration">
```

### Constraints
- No visual modification
- Metadata only
- Tooltip text must be concise and factual

---

## Agent 6 — FinalSanityAgent

### Responsibility
Perform final system-level validation before output.

### Inputs
- CellSpec.interactiveSvg
- CellSpec.validation

### Checks
- SVG validity
- All organelles labeled
- No forbidden structures
- No missing required organelles
- No JavaScript or raster images

### Outputs (CellSpec.final)

```json
{
  "ready": true,
  "checksum": "sha256:..."
}
```

---

## Failure Handling

- Any agent may emit `errors`
- Pipeline must halt on errors
- No downstream agent may attempt correction unless explicitly re-invoked

---

## Forbidden Behaviors (Global)

Agents must never:
- Invent biological structures
- Override prior agent decisions
- Add artistic embellishments
- Collapse multiple organelles into one
- Use copyrighted reference diagrams

---

## Optional Extensions

- ComparativeCellAgent (side-by-side layouts)
- EducationTierAgent (grade-level explanations)
- LocalizationAgent (multi-language labels)
- AnimationAgent (host-driven, not embedded)

---

## Final Output Contract

System output must include:
- Approved biological spec
- Validated layout model
- Interactive SVG
- Deterministic agent trail
- Zero hallucinated biology
