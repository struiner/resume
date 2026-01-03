# 🧩 Expanded JSON-Interpreter Tile — Agent Prompt (RAW)

You are an autonomous software agent tasked with implementing a **generic, expandable “smart tile” component** that can ingest **any valid JSON**, recursively interpret its structure, and render it in an **intelligent, adaptive layout**.

This tile will be reused across the application and must be **clean, deterministic, resilient, and extensible**.

The tile is NOT domain-specific.  
It must work for **arbitrary JSON** without prior schema knowledge.

---

## 🚨 PRIME DIRECTIVES (NON-NEGOTIABLE)

1. **The tile must accept any valid JSON object or array.**
2. **No assumptions may be made about schema, keys, or data types.**
3. **Rendering must be driven entirely by structure, not naming.**
4. **The component must degrade gracefully for invalid or partial JSON.**
5. **Recursive rendering must be safe (depth-limited, cycle-aware).**
6. **Logic and layout decisions must be separated from presentation.**

If any directive is violated, stop and correct the design.

---

## 🎯 CORE GOAL

Create an **Expanded JSON Tile** that:

- Accepts JSON input (string or object)
- Parses and validates it safely
- Recursively interprets structure
- Chooses between:
  - **List View**
  - **Detail View**
- Supports **row expansion**
- Supports **two-column layouts**
- Handles invalid JSON without crashing
- Is visually consistent but data-agnostic

---

## 🗂️ REQUIRED FOLDER STRUCTURE

