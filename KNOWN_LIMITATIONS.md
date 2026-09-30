# KNOWN_LIMITATIONS.md: Known Limitations & Edge Cases

This document details known architectural boundaries and current limitations of the KathaSetu MVP in production.

---

## 1. Micro-Dialect Granularity Boundaries
- **Caste and Sub-Clan Cadence Variations**: While KathaSetu achieves precise regional dialect adaptation (e.g. Majhi vs Malwai in Punjab, or Marwari vs Mewari in Rajasthan), it does not attempt hyper-local caste-specific vocabulary variations within the same village (e.g. Jat vs Mazhabi nuances in Majha). Standardized literary dialect forms are prioritized to maintain dramatic intelligibility.
- **Urban Code-Switching Depth**: In urban settings, modern youth blend regional vernacular with conversational English (Hinglish/Punglish). While the system includes a code-switching policy toggle, deep sociolect code-switching remains heuristic.

---

## 2. Multimodal Visual Consistency Across Angles
- **3D Spatial Pose Consistency**: The generated Character Bible produces high-fidelity full-body reference plates with consistent physical descriptions, facial features, grooming, and clothing palettes. However, generating 360-degree dynamic turnarounds under differing action angles without specialized 3D LoRAs / IP-Adapter weight maps can introduce minor fabric fold variations.
- **Complex Multi-Character Action Keyframes**: When a scene requires more than 4 characters in complex spatial blocking (e.g., a crowded village panchayat council), 2D diffusion models occasionally blend costume accessories across adjacent figures. The Single-Asset Retry Engine was specifically implemented to mitigate this by allowing targeted re-generation.

---

## 3. Screenplay Formatting Ingestion
- **Standardized Sluglines Expected**: Ingestion assumes standard professional sluglines (`SCENE 1: INT. LOCATION - TIME`). Screenplays written in unstructured prose or novelistic formats require manual review or pre-formatting before entity extraction.
- **Non-Linear Flashbacks**: Complex non-linear timeline jumps (flashbacks inside flashbacks) can trigger false-positive costume teleportation warnings in the contradiction engine, which the user can manually resolve using the "Mark Verified" action.
