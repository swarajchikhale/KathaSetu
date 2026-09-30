import { GoogleGenAI, Type } from '@google/genai';
import {
  AdaptationProject,
  CanonicalCharacter,
  CanonicalCostume,
  CanonicalLocation,
  CanonicalProp,
  ContinuityContradiction,
  CulturalAdaptationPlan,
  DialectOption,
  SceneRecord,
  SettingType,
  VisualPromptSpec,
  WritingScript
} from '../types/adaptation';
import { DIALECT_REGISTRY } from '../data/dialectRegistry';
import { buildPromptSpec, generateVisualPlate } from '../utils/proceduralVisuals';
import {
  buildBenchmarkExtraction,
  detectContradictions,
  generateAdaptationPlan
} from '../utils/benchmarkExtraction';

// Re-export client-safe utilities
export { buildPromptSpec, generateVisualPlate, buildBenchmarkExtraction, detectContradictions, generateAdaptationPlan };

// Initialize Gemini on server side
const apiKey = process.env.GEMINI_API_KEY;
export const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

// Enrich raw extracted JSON data with visual specs and prompt templates
export function enrichExtractedData(
  data: any,
  culture: DialectOption,
  screenplayText: string
): {
  scenes: SceneRecord[];
  characters: CanonicalCharacter[];
  costumes: CanonicalCostume[];
  locations: CanonicalLocation[];
  props: CanonicalProp[];
  contradictions: ContinuityContradiction[];
} {
  const characters: CanonicalCharacter[] = (data.characters || []).map((c: any) => {
    const spec = buildPromptSpec('character', c.canonicalName || c.name, culture, {
      role: c.role,
      age: c.age,
      costume: c.grooming
    });
    return {
      id: c.id || `CHAR_${(c.canonicalName || c.name).toUpperCase().replace(/\s+/g, '_')}`,
      canonicalName: c.canonicalName || c.name,
      aliases: c.aliases || [c.name],
      age: c.age || 35,
      role: c.role || 'Protagonist',
      relationships: c.relationships || 'Family member',
      personality: c.personality || 'Determined and complex',
      grooming: c.grooming || `${culture.name} traditional grooming`,
      physicalDescription: c.physicalDescription || `Native features of ${culture.region}`,
      approved: false,
      visualAssetUrl: generateVisualPlate('character', c.canonicalName || c.name, `${c.role || 'Character'} | Age ${c.age || 35}`, culture, spec),
      visualPromptSpec: spec
    };
  });

  const costumes: CanonicalCostume[] = (data.costumes || []).map((cos: any) => {
    const spec = buildPromptSpec('costume', cos.label || cos.id, culture, {
      costume: `${cos.garments} made of ${cos.fabrics} in ${cos.colors}`
    });
    return {
      id: cos.id || `COST_${cos.characterId}_01`,
      characterId: cos.characterId || characters[0]?.id || 'CHAR_MAIN',
      label: cos.label || 'Standard Attire',
      scenesAppearing: cos.scenesAppearing || ['SC01'],
      garments: cos.garments || 'Traditional regional wear',
      fabrics: cos.fabrics || 'Handspun Khaddar',
      colors: cos.colors || 'Earthy tones',
      headwear: cos.headwear || 'Regional turban or head covering',
      footwear: cos.footwear || 'Desi leather footwear',
      jewellery: cos.jewellery || 'Simple regional metal adornment',
      groomingNotes: cos.groomingNotes || 'Neat traditional style',
      approved: false,
      visualAssetUrl: generateVisualPlate('costume', cos.label || cos.id, `${cos.garments} (${cos.fabrics})`, culture, spec),
      visualPromptSpec: spec
    };
  });

  const locations: CanonicalLocation[] = (data.locations || []).map((loc: any) => ({
    id: loc.id || `LOC_${loc.name.toUpperCase().replace(/\s+/g, '_')}`,
    name: loc.name || 'Ancestral Homestead',
    type: loc.type || 'INT',
    subLocation: loc.subLocation || 'Courtyard',
    architectureDetails: loc.architectureDetails || culture.culturalAnchors.architecture,
    culturalProps: loc.culturalProps || ['Brass vessels', 'Charpai'],
    scenesAppearing: loc.scenesAppearing || ['SC01']
  }));

  const props: CanonicalProp[] = (data.props || []).map((p: any) => ({
    id: p.id || `PROP_${p.name.toUpperCase().replace(/\s+/g, '_')}`,
    name: p.name,
    firstIntroducedScene: p.firstIntroducedScene || 'SC01',
    lastKnownScene: p.lastKnownScene || 'SC04',
    carriedByCharacterId: p.carriedByCharacterId,
    description: p.description || 'Key dramatic property',
    culturalAdaptedEquivalent: p.culturalAdaptedEquivalent || p.name
  }));

  const scenes: SceneRecord[] = (data.scenes || []).map((s: any, idx: number) => {
    const spec = buildPromptSpec('scene', `Scene ${s.scene_number || idx + 1}: ${s.sub_location || 'Courtyard'}`, culture, {
      setting: culture.culturalAnchors.architecture,
      time: s.time,
      mood: s.mood
    });
    return {
      scene_id: s.scene_id || `SC0${idx + 1}`,
      scene_number: s.scene_number || idx + 1,
      slugline: s.slugline || `SCENE ${idx + 1}: ${s.int_ext || 'INT'}. ${s.sub_location || 'HOMESTEAD'} - ${s.time || 'DAY'}`,
      int_ext: s.int_ext || 'INT',
      location_id: s.location_id || 'LOC_HOMESTEAD',
      sub_location: s.sub_location || 'Main Courtyard',
      time: s.time || 'Morning',
      day_or_date: s.day_or_date || 'Day 1',
      weather: s.weather || 'Warm, clear',
      mood: s.mood || 'Dramatic confrontation',
      short_summary: s.short_summary || 'Family confrontation over land.',
      dramatic_purpose: s.dramatic_purpose || 'Establish central stakes.',
      characters: s.characters || characters.map((c) => c.id),
      costume_ids: s.costume_ids || costumes.map((cos) => cos.id),
      props_in: s.props_in || [],
      props_out: s.props_out || [],
      character_states: s.character_states || [],
      emotional_change: s.emotional_change || 'Tension escalates.',
      continuity_warnings: s.continuity_warnings || [],
      lines: s.lines || [],
      visualKeyframeUrl: generateVisualPlate('scene', `SCENE ${s.scene_number || idx + 1}`, `${s.sub_location || 'Keyframe'} (${s.time || 'Day'})`, culture, spec),
      visualPromptSpec: spec
    };
  });

  const contradictions = detectContradictions(scenes, characters, props, costumes);

  return { scenes, characters, costumes, locations, props, contradictions };
}

// Server-side extractor calling Gemini 3.8 Flash
export async function extractScreenplay(
  screenplayText: string,
  culture: DialectOption
): Promise<{
  scenes: SceneRecord[];
  characters: CanonicalCharacter[];
  costumes: CanonicalCostume[];
  locations: CanonicalLocation[];
  props: CanonicalProp[];
  contradictions: ContinuityContradiction[];
}> {
  if (ai) {
    try {
      const prompt = `You are a professional film continuity supervisor and script breakdown engineer for an Indian cinema OTT adaptation studio.
Extract structured records from this screenplay into exact JSON matching this schema:

Screenplay text:
${screenplayText}

Requirements:
1. Merge repeated aliases (e.g. 'Amar', 'the elder son', 'A. Singh', 'David') into ONE canonical character record.
2. Canonical character IDs must follow format CHAR_NAME.
3. Canonical costume IDs must follow format COST_CHARNAME_01.
4. Canonical location IDs must follow format LOC_NAME.
5. Canonical prop IDs must follow format PROP_NAME.
6. Scene records must include: scene_id (e.g. SC01), scene_number, int_ext, location_id, sub_location, time, day_or_date, weather, mood, short_summary, dramatic_purpose, characters (IDs), costume_ids, props_in, props_out, emotional_change, continuity_warnings.
7. Return clean JSON only.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.scenes && parsed.characters && parsed.scenes.length > 0) {
          return enrichExtractedData(parsed, culture, screenplayText);
        }
      }
    } catch (err) {
      console.warn('Gemini extraction fallback triggered:', err);
    }
  }

  return buildBenchmarkExtraction(screenplayText, culture);
}
