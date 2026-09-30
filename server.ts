import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { DIALECT_REGISTRY } from './src/data/dialectRegistry';
import { BENCHMARK_SCREENPLAYS } from './src/data/sampleScreenplays';
import {
  ai,
  buildBenchmarkExtraction,
  buildPromptSpec,
  detectContradictions,
  extractScreenplay,
  generateAdaptationPlan,
  generateVisualPlate
} from './src/server/agenticEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '20mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Dialects registry
app.get('/api/dialects', (req: Request, res: Response) => {
  res.json(DIALECT_REGISTRY);
});

// Benchmark screenplays
app.get('/api/benchmarks', (req: Request, res: Response) => {
  res.json(BENCHMARK_SCREENPLAYS);
});

// Extract screenplay into canonical records
app.post('/api/extract', async (req: Request, res: Response) => {
  try {
    const { text, cultureId } = req.body;
    const culture = DIALECT_REGISTRY.find((d) => d.id === cultureId) || DIALECT_REGISTRY[0];
    const screenplayText = text || BENCHMARK_SCREENPLAYS[0].text;

    const result = await extractScreenplay(screenplayText, culture);
    res.json(result);
  } catch (err: any) {
    console.error('Error during extraction:', err);
    res.status(500).json({ error: err.message || 'Extraction failed' });
  }
});

// Generate or update cultural adaptation plan
app.post('/api/adaptation-plan', (req: Request, res: Response) => {
  try {
    const { cultureId, region, setting, script, characters } = req.body;
    const culture = DIALECT_REGISTRY.find((d) => d.id === cultureId) || DIALECT_REGISTRY[0];
    const plan = generateAdaptationPlan(culture, region, setting, script, characters || []);
    res.json(plan);
  } catch (err: any) {
    console.error('Error creating adaptation plan:', err);
    res.status(500).json({ error: err.message || 'Plan generation failed' });
  }
});

// Detect contradictions in scene graph
app.post('/api/detect-contradictions', (req: Request, res: Response) => {
  try {
    const { scenes, characters, props, costumes } = req.body;
    const contradictions = detectContradictions(scenes || [], characters || [], props || [], costumes || []);
    res.json(contradictions);
  } catch (err: any) {
    console.error('Error detecting contradictions:', err);
    res.status(500).json({ error: err.message || 'Contradiction check failed' });
  }
});

// Regenerate single visual asset (Character portrait, Costume plate, Scene look)
app.post('/api/generate-asset', async (req: Request, res: Response) => {
  try {
    const { type, title, subtitle, cultureId, spec, details } = req.body;
    const culture = DIALECT_REGISTRY.find((d) => d.id === cultureId) || DIALECT_REGISTRY[0];

    const currentSpec = spec || buildPromptSpec(type, title, culture, details || {});
    // Increment seed for visual diversity
    currentSpec.seed = Math.floor(Math.random() * 899999) + 100000;

    // Check if Gemini Image generation is available via SDK
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: currentSpec.positivePrompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: currentSpec.aspectRatio === '16:9' ? '16:9' : '3:4'
            }
          }
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
        if (imagePart?.inlineData?.data) {
          const mime = imagePart.inlineData.mimeType || 'image/png';
          const assetUrl = `data:${mime};base64,${imagePart.inlineData.data}`;
          return res.json({
            assetUrl,
            promptSpec: currentSpec,
            engine: 'gemini-3.1-flash-lite-image'
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini image generation warning, falling back to cinematic vector plate:', geminiError?.message || geminiError);
      }
    }

    // High fidelity procedural cinematic vector plate
    const assetUrl = generateVisualPlate(type, title, subtitle || `${culture.name}`, culture, currentSpec);
    return res.json({
      assetUrl,
      promptSpec: currentSpec,
      engine: 'procedural-cinematic-render'
    });
  } catch (err: any) {
    console.error('Error generating asset:', err);
    res.status(500).json({ error: err.message || 'Asset generation failed' });
  }
});

// Export production package
app.post('/api/export-bundle', (req: Request, res: Response) => {
  try {
    const project = req.body;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    const markdownReport = `# ${project.title || 'Screenplay'} - Cultural Adaptation Production Pack
**Target Culture & Dialect:** ${project.selectedCulture?.name}
**Region:** ${project.selectedRegion || project.selectedCulture?.region}
**Setting:** ${project.selectedSetting} | **Output Script:** ${project.selectedScript}
**Generated on:** ${new Date().toLocaleString()}

---

## 1. Executive Summary & Preservation of Story
${project.adaptationPlan?.whyStoryIsPreserved || 'Story logic and dramatic relationships preserved with exact cultural grounding.'}

## 2. Cultural Adaptation Strategy
- **Verbal Adaptation:** ${project.adaptationPlan?.verbalAdaptationStrategy?.dialectFeatures}
- **Kinship & Honorifics:** ${project.adaptationPlan?.verbalAdaptationStrategy?.kinshipAndHonorifics}
- **Non-Verbal & Seating Hierarchy:** ${project.adaptationPlan?.nonVerbalAdaptationStrategy?.seatingAndSpatialHierarchy}
- **Architecture & Textiles:** ${project.adaptationPlan?.worldBuilding?.architecture}

## 3. Canonical Character Bible
${(project.characters || [])
  .map(
    (c: any) => `### ${c.canonicalName} (${c.id})
- **Adapted Identity:** ${c.adaptedName} (${c.adaptedRole})
- **Age:** ${c.age} | **Role:** ${c.role}
- **Grooming:** ${c.grooming}
- **Physical Traits:** ${c.physicalDescription}
- **Personality:** ${c.personality}
`
  )
  .join('\n')}

## 4. Costume Bible
${(project.costumes || [])
  .map(
    (cos: any) => `### ${cos.label} (${cos.id})
- **Character:** ${cos.characterId} | **Scenes:** ${cos.scenesAppearing?.join(', ')}
- **Garments:** ${cos.garments}
- **Fabrics & Colors:** ${cos.fabrics} (${cos.colors})
- **Footwear & Accessories:** ${cos.footwear}, ${cos.jewellery || 'None'}
`
  )
  .join('\n')}

## 5. Scene Breakdown & Continuity Report
${(project.scenes || [])
  .map(
    (sc: any) => `### Scene ${sc.scene_number}: ${sc.slugline}
- **Location:** ${sc.sub_location} (${sc.int_ext})
- **Time / Weather:** ${sc.time} | ${sc.weather}
- **Characters Present:** ${sc.characters?.join(', ')}
- **Props (In / Out):** IN: ${sc.props_in?.join(', ') || 'None'} | OUT: ${sc.props_out?.join(', ') || 'None'}
- **Dramatic Purpose:** ${sc.dramatic_purpose}
- **Emotional Transition:** ${sc.emotional_change}
`
  )
  .join('\n')}

## 6. Continuity Contradictions & Audit Status
Total Issues Detected: ${(project.contradictions || []).length}
${(project.contradictions || [])
  .map(
    (contra: any) => `- [${contra.severity}] ${contra.type} (${contra.affectedScenes?.join(', ')}): ${contra.description} -> Resolution: ${contra.suggestedResolution}`
  )
  .join('\n')}
`;

    res.json({
      filename: `katha_setu_${project.selectedCulture?.id || 'adaptation'}_${timestamp}.json`,
      markdownReport,
      data: project
    });
  } catch (err: any) {
    console.error('Error generating export bundle:', err);
    res.status(500).json({ error: err.message || 'Export failed' });
  }
});

// Mount Vite or serve static assets
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cultural Screenplay & Visual Adaptation Studio running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
