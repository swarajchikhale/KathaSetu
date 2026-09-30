# AI_USAGE.md: Model Utilization, Failures & Verification Log

This document provides a candid evaluation of how AI models were utilized in KathaSetu, what specific failure modes emerged during development, and how deterministic verification guardrails were engineered to catch and resolve them.

---

## 1. AI Models & Roles
- **Gemini 3.8 Flash (`gemini-3.8-flash`)**: Primary reasoning engine for structured script breakdown, dialogue rewriting in regional dialects, and initial entity extraction.
- **Gemini 3.1 Flash Lite Image (`gemini-3.1-flash-lite-image`)**: Image synthesis model for generating full-body character portraits, costume plates, and scene keyframes.
- **Deterministic Heuristic Engines**:
  - `detectContradictions()`: Rule-based graph auditor for props, costumes, and entity aliases.
  - `DIALECT_REGISTRY`: Verified linguistic and ethnographic dataset defining kinship terms, architecture, and gestures for 8 exact Indian regional dialects.

---

## 2. What AI Models Got Wrong & Engineering Countermeasures

### 2.1 Failure 1: The "Pan-Indian Bollywood" Hallucination
* **The Failure**: When prompted with generic instructions like "Adapt this screenplay into Punjabi/Rajasthani", the LLM defaulted to commercial movie tropes: characters frequently broke into song-and-dance exclamations (*"Oye hoye"*, *"Balle Balle"*), wore cartoonishly vivid wedding sherwanis during manual field work, and spoke a generic blend of Hindi and Anglicized slang.
* **Why it failed**: Pre-training corpora are heavily skewed toward mainstream Hindi cinema and diaspora tourism blogs, which erase distinct agrarian micro-cultures.
* **How we verified & fixed it**:
  1. We replaced broad labels with mandatory high-precision dialects (e.g., **Majhi** vs **Malwai**, **Marwari** vs **Mewari**, **Bangru**).
  2. Grounded generation in the `DIALECT_REGISTRY`, which explicitly injects regional phonetic rules (such as Majhi tonal contours and *paye aan* continuous aspects), authentic kinship terms (*Bebe*, *Bhau*, *Chacha Ji*), and exact domestic architecture (*baked Nanakshahi brick deoris*, *manja charpais*, *diesel canal tube-wells*).
  3. Added negative cultural prompts in visual prompt specs rejecting modern synthetic nylon, generic Bollywood party clothing, and palace caricatures.

### 2.2 Failure 2: Character Entity Multiplication (Alias Fragmentation)
* **The Failure**: Screenplays naturally refer to the same character using different aliases (e.g., *"David"*, *"The Elder Son"*, *"A. Singh"*, *"The Prodigal Heir"*). Unconstrained LLM extraction treated each alias as a separate individual, producing 7 characters from a 3-character script and generating multiple inconsistent visual bibles.
* **Why it failed**: Token-by-token parsing without coreference resolution treats different noun phrases as distinct entities.
* **How we verified & fixed it**:
  1. Implemented a deterministic coreference normalizer that maps all detected name variants to a single canonical ID (`CHAR_AMAR`).
  2. Added **Stage 3: Mandatory Human Approval Gate**, allowing the human director to review, merge, and lock canonical IDs before visual assets are rendered.

### 2.3 Failure 3: Vanishing Props & Discontinuous Actions
* **The Failure**: In Scene 2, the elder brother exits the canal pump carrying the legal envelope under his arm. In the LLM's adapted draft of Scene 3, the envelope was nowhere to be found in the room, yet two pages later, the mother miraculously referred to the petition without it having ever been set down.
* **Why it failed**: Autoregressive models lack persistent physical spatial state memory across scene boundaries.
* **How we verified & fixed it**:
  1. Built the `detectContradictions` auditor which tracks `props_in` and `props_out` across the scene array.
  2. The system flagged `CONTRA_PROP_DEED_SC03` as a `CRITICAL` continuity error, prompting an automatic staging insertion: *"David sets the opened legal envelope down on the courtyard wooden bench beside him."*

---

## 3. Safe Autonomy & Gating Philosophy
AI Studio's brief emphasizes: *"This challenge rewards judgment, evidence, verification and safe autonomy. A polished demo without a trustworthy decision process will not score well."*

Our architecture adheres to **Safe Autonomy**:
1. AI proposes structural breakdowns and dialect rewrites; deterministic graph algorithms verify continuity.
2. The user has explicit veto and editing power at every stage.
3. Costly visual rendering is locked behind human sign-off, preventing resource waste and unverified image generation.
