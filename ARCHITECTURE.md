# ARCHITECTURE.md: KathaSetu Agentic Pipeline Architecture

## 1. System Overview
KathaSetu is an agentic screenplay adaptation and visual continuity system built to solve the hardest challenge in cultural AI engineering: **maintaining narrative identity, physical object continuity, and accurate regional specificity without model hallucination or visual drift.**

```
+---------------------------------------------------------------------------------+
|                                 USER INPUT                                     |
|  Neutral Screenplay (3-5 Pages) + Culture Choice (Majhi, Bangru, Marwari, etc.)|
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| STAGE 1: INGESTION & ORDER PRESERVATION                                         |
| - Validates sluglines (SCENE 1: INT. ... - DAY)                                |
| - Preserves strict scene sequence (SC01 -> SC02 -> SC03 -> SC04)                |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| STAGE 2: STRUCTURED EXTRACTION & CANONICAL NORMALIZATION                        |
| - Extracts Scene Records (int/ext, location, sub-location, time, mood, purpose)|
| - Merges character aliases into persistent canonical records (CHAR_AMAR, etc.) |
| - Extracts costume variants (COST_AMAR_01) and props (PROP_SEALED_DEED)        |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| STAGE 3: CONTINUITY GRAPH AUDITING                                              |
| - Scans props_in and props_out for physical disappearance                       |
| - Validates costume timing against scene time intervals                         |
| - Flags contradictions with affected scene backlinks                           |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| STAGE 4: CULTURAL ADAPTATION PLANNING                                           |
| - Ingests DIALECT_REGISTRY constraints (lexicon, kinship, honorifics, gestures)|
| - Maps characters to regional social hierarchy with written justifications     |
| - Generates explicit World Building anchors (architecture, textiles, transport) |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| STAGE 5: MANDATORY HUMAN APPROVAL GATE                                          |
| - Freezes entity graph before any expensive image generation                    |
| - User reviews checklist: alias merges, dialect accuracy, story preservation   |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| STAGE 6: DUAL-TRACK GENERATION                                                  |
| 1. Script Adaptation: Side-by-side comparative screenplay with cultural notes   |
| 2. Visual Pipeline: Character Bible, Costume Plates, Scene Keyframes            |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| STAGE 7: AUDIT, SINGLE-ASSET RETRY & EXPORT                                     |
| - User can retry any single asset without rebuilding project graph              |
| - One-click export of structured JSON, Markdown, and prompt specifications     |
+---------------------------------------------------------------------------------+
```

---

## 2. Structured Data Schemas

### 2.1 Scene Record Schema
```typescript
interface SceneRecord {
  scene_id: string;               // e.g. "SC01"
  scene_number: number;           // 1, 2, 3...
  slugline: string;               // "SCENE 1: INT. ANCESTRAL HOMESTEAD - MORNING"
  int_ext: 'INT' | 'EXT';
  location_id: string;            // "LOC_HOMESTEAD_BAITHAK"
  sub_location: string;
  time: string;                   // "Early Morning (6:15 AM)"
  weather: string;
  mood: string;
  short_summary: string;
  dramatic_purpose: string;
  characters: string[];           // ["CHAR_AMAR", "CHAR_BEBE", "CHAR_ROHAN"]
  costume_ids: string[];          // ["COST_AMAR_01", "COST_BEBE_01"]
  props_in: string[];             // ["PROP_SEALED_DEED"]
  props_out: string[];            // ["PROP_SEALED_DEED"]
  character_states: {
    character_id: string;
    emotional_state_before: string;
    emotional_state_after: string;
    injuries_or_physical: string;
    knowledge_gained: string;
  }[];
  emotional_change: string;
  continuity_warnings: string[];
}
```

### 2.2 Canonical Entity Normalization
The system rejects duplicate entities by keeping a normalized alias registry:
```typescript
const ALIAS_DICTIONARY = {
  CHAR_AMAR: ['David', 'Amar', 'The Elder Son', 'A. Singh', 'Prodigal Heir'],
  CHAR_ROHAN: ['Rohan', 'The Younger Brother', 'The Boy', 'The Son'],
  CHAR_BEBE: ['Beatrice', 'Mother', 'Bebe', 'The Matriarch', 'Maji Sa'],
  CHAR_GURDIP: ['Gurdip', 'The Surveyor', 'The Assessor', 'Revenue Patwari']
};
```
When an alias is encountered across lines or scenes, it is mapped to the single canonical ID.

---

## 3. Physical Continuity & Contradiction Engine

The `detectContradictions()` engine performs graph traversal across consecutive scene nodes:
1. **Prop Disappearance Rule**: If a prop is present in `props_out` of Scene $N$, it MUST either appear in `props_in` of Scene $N+1$ or have an explicit handover/storage action recorded. If missing, a `PROP_DISAPPEARANCE` contradiction is generated.
2. **Costume Teleportation Rule**: If character $C$ wears costume $X$ at Scene $N$ (Morning) and costume $Y$ at Scene $N+1$ (Immediate Noon) with zero narrative transit interval, a `COSTUME_TELEPORT` warning is raised.
3. **Knowledge Leak Rule**: Characters cannot reveal information in Scene $N$ that their character state indicates was acquired in Scene $N+1$.

---

## 4. Single-Asset Retry Architecture
Unlike monolithic pipelines that regenerate the entire project upon a visual defect, KathaSetu's `handleRegenerateAsset(type, id, ...)` endpoint:
- Targets **only** the selected entity node in memory.
- Increments or modifies the generation seed (`seed + 1`).
- Preserves all canonical relationships, costume links, and scene dependencies.
- Replaces only the asset's URL and prompt spec.
