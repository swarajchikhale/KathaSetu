# Continuity Contradiction & Physical State Audit Report
**Project:** The Harvest Divide (Majhi Cultural Adaptation)
**Auditor Engine:** KathaSetu Continuity Graph Supervisor v2.4
**Date of Audit:** Current Production Run

---

## 1. Executive Status
- Total Scenes Traversed: 4
- Total Canonical Characters Tracked: 4
- Total Canonical Props Monitored: 4
- Total Contradictions Detected: 1 Critical Physical State Discrepancy
- Resolution Status: **100% Resolved & Verified**

---

## 2. Contradiction Log & Resolution Traceability

### [ISSUE CONTRA_PROP_DEED_SC03] (SEVERITY: CRITICAL)
* **Type:** `PROP_DISAPPEARANCE`
* **Affected Scenes:** `SC02` (Canal Tube-Well) &rarr; `SC03` (Courtyard Kitchen)
* **Contradiction Description:**
  In Scene 2, character `CHAR_AMAR` holds the manila legal deed envelope (`PROP_SEALED_DEED`) under his left arm as he confronts Patwari Gurdip and Rohan. In the source screenplay of Scene 3, Amar is sitting on the bench, but no narrative action explained how or when the envelope was set down, risking visual disappearance.
* **Graph Audit Proof:**
  - `SC02.props_out`: `["PROP_SEALED_DEED"]`
  - `SC03.props_in` initially lacked placement action.
* **Suggested Resolution:**
  Explicitly insert action note in Scene 3:
  *"Amar sits upon the low wooden manja in the courtyard corner. The opened legal envelope lies beside him, its red ribbon loose on the wooden planks."*
* **Status:** **RESOLVED** (Action note baked into adapted screenplay and Scene 3 keyframe prompt).

---

## 3. Costume Continuity Traceability Matrix

| Character | Scene 1 (Morning) | Scene 2 (Noon) | Scene 3 (Dusk) | Scene 4 (Night) | Narrative Justification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Amarjit (CHAR_AMAR)** | `COST_AMAR_01` (Canvas Jacket + Kurta) | `COST_AMAR_01` (Jacket discarded, Kurta) | `COST_AMAR_02` (Domestic Kurta & Chadra) | `COST_AMAR_02` (Domestic Kurta & Chadra) | Returned home after field clash, washed with well water, changed out of travel canvas into domestic unbleached cotton. |
| **Rohan (CHAR_ROHAN)** | `COST_ROHAN_01` (Frayed Vest & Work Pants) | `COST_ROHAN_01` (Frayed Vest & Work Pants) | `COST_ROHAN_01` (Frayed Vest & Work Pants) | `COST_ROHAN_01` (Frayed Vest & Work Pants) | Single continuous grueling day of diesel pump repair and canal ditch work; no change of clothes. |
| **Bebe (CHAR_BEBE)** | `COST_BEBE_01` (Ivory Kameez & Phulkari) | N/A (Not in scene) | `COST_BEBE_01` (Ivory Kameez & Phulkari) | N/A (Remains in homestead) | Matriarch remains within ancestral domestic compound; wardrobe consistent. |
| **Patwari Gurdip (CHAR_GURDIP)**| N/A | `COST_GURDIP_01` (Khaki Safari Suit) | N/A | N/A | Government field tour uniform. |

---

## 4. Prop Lifecycle State Machine

- **`PROP_SEALED_DEED` (The Legal Partition Petition):**
  - Scene 1: Carried into homestead by Amar (unsealed).
  - Scene 2: Taken to canal well, presented to Patwari Gurdip, yellowed 1982 blueprint extracted.
  - Scene 3: Brought back to courtyard, set on wooden manja beside simmering milk.
  - Scene 4: Crumpled into Amar's back pocket, discarded at the boundary banyan tree as brothers reconcile.

- **`PROP_BRASS_CHEST_KEY` (Ancestral Sandook Key):**
  - Scene 1: Worn around Bebe's neck on black cotton cord.
  - Scene 3: Handed by Bebe to Amar as symbolic transfer of custody.
  - Scene 4: Held in Amar's palm at the moonlit stone marker to symbolize that the land deed remains locked inside the family chest forever.
