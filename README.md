# KathaSetu: Cultural Screenplay & Visual Adaptation Studio
**OTT Dialect Platform | AI Engineering Assignment**

KathaSetu is an agentic AI web platform that recreates short neutral screenplays inside exact Indian regional cultures and dialects (e.g., Majhi, Malwai, Bangru, Marwari, Mewari, Awadhi, Maithili), maintains strict canonical identity and physical continuity across scenes, and produces a complete visual production pack (character bible, costume plates, and scene keyframes).

---

## 🌟 Key Highlights & Engineering Design

1. **Exact Regional Precision (No Pan-Indian Stereotypes)**:
   - Supports specific dialects with deep linguistic, kinship, non-verbal, and architectural anchors:
     - **Punjab (Majhi)**: Amritsar/Tarn Taran belt; tonality, *Aithe*, *Kardiyan paye aan*, Bebe/Bhau kinship, baked Nanakshahi brick havelis, Phulkari shawls, diesel tube-wells.
     - **Punjab (Malwai)**: Bathinda/Mansa cotton & canal tract; *ti* auxiliary verb endings, tractor culture.
     - **Haryana (Bangru / Haryanvi)**: Rohtak/Jhajjar plains; direct candor, Hookah councils, Khandwa headwear, 52-kali Daman.
     - **Rajasthan (Marwari)**: Jodhpur/Shekhawati; *Hukum*, *Mhare*, courtly deference, sandstone jharokhas, Bandhani safas.
     - **Rajasthan (Mewari)**: Udaipur/Chittorgarh; Sisodia heritage, lake courtyards, sword display niches.
     - **Uttar Pradesh (Awadhi)**: Lucknow/Ayodhya rural fringe; *Hum*, *Amma*, Ganga-Jamuni Tehzeeb, Chikankari, clay verandas.
     - **Bihar (Maithili)**: Mithila heartland; four-tier honorific system, Paag headwear, Kohbar & Madhubani art.

2. **Canonical Entity Normalization**:
   - Merges repeated character mentions and aliases into one persistent ID (e.g., `Amar`, `The Elder Son`, `A. Singh`, `David` &rarr; `CHAR_AMAR`).
   - Assigns unique canonical IDs to props (`PROP_SEALED_DEED`) and costumes (`COST_AMAR_01`).

3. **Mandatory Human-in-the-Loop Approval Gate**:
   - Enforces explicit user verification of the Cultural Adaptation Plan, merged character identities, and costume variants **before** initiating expensive visual asset generation.

4. **Physical Contradiction & Continuity Auditor**:
   - Detects prop disappearance (e.g. legal deed envelope carried out of Scene 2 must not vanish in Scene 3 without handover).
   - Flags costume teleportation across immediate consecutive time steps.
   - Highlights all affected scenes with one-click resolution.

5. **Single-Asset Retry Engine**:
   - Regenerates individual failed character portraits, costume plates, or scene keyframes with modified seeds and prompts without rebuilding the entire project graph.

6. **Reproducible Prompt Specs**:
   - Every visual asset includes model (`gemini-3.1-flash-lite-image`), aspect ratio, positive prompt, negative cultural prompt, camera lens, lighting parameters, and authenticity checklist.

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd submission

# Install dependencies
npm install
```

### Environment Configuration
Create a `.env` file in the root directory:
```bash
# Copy example
cp .env.example .env
```
Contents of `.env`:
```env
# Optional Gemini API key (AI Studio automatically injects this at runtime)
# If omitted or rate-limited, the application seamlessly uses its built-in
# deterministic agentic extractor and cinematic procedural visual generator.
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### Running the Studio
```bash
# Start full-stack dev server (Express backend + Vite client on port 3000)
npm run dev

# Or build for production
npm run build
npm start
```

Visit `http://localhost:3000` in your browser.

---

## 🧪 Automated Testing
Run the comprehensive unit and integration suite:
```bash
npx tsx tests/studio.test.ts
```
Or click the **"Live Tests"** button inside the studio header to run the in-browser verification suite!

---

## 📂 Deliverables Directory Structure
```
submission/
├── README.md               # Setup steps, overview, verification
├── ARCHITECTURE.md         # Detailed agentic architecture & state machine
├── AI_USAGE.md             # AI engineering log, errors, verification
├── KNOWN_LIMITATIONS.md    # Boundary conditions & honest limitations
├── server.ts               # Full-stack Express server with Gemini SDK proxy
├── tests/
│   └── studio.test.ts      # Automated acceptance & continuity tests
├── sample_output/          # Export deliverables matching Page 6
│   ├── scene_breakdown.json
│   ├── adapted_screenplay.txt
│   ├── continuity_report.md
│   ├── character_bible.md
│   └── costume_bible.md
└── src/                    # Frontend React 19 application
```
