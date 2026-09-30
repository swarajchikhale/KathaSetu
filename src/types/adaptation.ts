export type DialectOption = {
  id: string;
  name: string;
  region: string;
  state: string;
  description: string;
  linguisticTraits: string;
  kinshipTerms: Record<string, string>;
  culturalAnchors: {
    architecture: string;
    textiles: string;
    food: string;
    rituals: string;
    socialDynamics: string;
  };
  sampleGreeting: string;
};

export type WritingScript = 'latin' | 'devanagari' | 'gurmukhi' | 'nastaliq';

export type SettingType = 'rural' | 'urban' | 'semi-urban';

export interface CanonicalCharacter {
  id: string;
  canonicalName: string;
  aliases: string[];
  age: number;
  role: string;
  relationships: string;
  personality: string;
  adaptedName?: string;
  adaptedRole?: string;
  culturalCues?: string;
  grooming?: string;
  physicalDescription?: string;
  approved?: boolean;
  visualAssetUrl?: string;
  visualPromptSpec?: VisualPromptSpec;
}

export interface CanonicalCostume {
  id: string;
  characterId: string;
  label: string;
  scenesAppearing: string[];
  garments: string;
  fabrics: string;
  colors: string;
  headwear?: string;
  footwear?: string;
  jewellery?: string;
  groomingNotes?: string;
  approved?: boolean;
  visualAssetUrl?: string;
  visualPromptSpec?: VisualPromptSpec;
}

export interface CanonicalLocation {
  id: string;
  name: string;
  type: 'INT' | 'EXT' | 'INT/EXT';
  subLocation: string;
  architectureDetails: string;
  culturalProps: string[];
  scenesAppearing: string[];
}

export interface CanonicalProp {
  id: string;
  name: string;
  firstIntroducedScene: string;
  lastKnownScene: string;
  carriedByCharacterId?: string;
  description: string;
  culturalAdaptedEquivalent?: string;
}

export interface ScreenplayLine {
  id: string;
  type: 'action' | 'dialogue' | 'parenthetical' | 'slugline' | 'transition';
  character?: string;
  characterId?: string;
  text: string;
  adaptedText?: string;
  culturalNote?: string;
  nonVerbalAction?: string;
}

export interface SceneRecord {
  scene_id: string;
  scene_number: number;
  slugline: string;
  int_ext: 'INT' | 'EXT' | 'INT/EXT';
  location_id: string;
  sub_location: string;
  time: string;
  day_or_date: string;
  weather: string;
  mood: string;
  short_summary: string;
  dramatic_purpose: string;
  characters: string[]; // character IDs
  costume_ids: string[];
  props_in: string[];
  props_out: string[];
  character_states: {
    character_id: string;
    emotional_state_before: string;
    emotional_state_after: string;
    injuries_or_physical: string;
    knowledge_gained: string;
  }[];
  emotional_change: string;
  continuity_warnings: string[];
  lines: ScreenplayLine[];
  visualKeyframeUrl?: string;
  visualPromptSpec?: VisualPromptSpec;
}

export interface VisualPromptSpec {
  model: string;
  aspectRatio: string;
  positivePrompt: string;
  negativePrompt: string;
  seed: number;
  cameraAndLighting: string;
  culturalAuthenticityChecklist: string[];
}

export interface CulturalAdaptationPlan {
  cultureId: string;
  cultureName: string;
  dialectName: string;
  region: string;
  settingType: SettingType;
  writingScript: WritingScript;
  coreNarrativeGoal: string;
  whyStoryIsPreserved: string;
  verbalAdaptationStrategy: {
    dialectFeatures: string;
    kinshipAndHonorifics: string;
    humourAndCadence: string;
    codeSwitchingPolicy: string;
  };
  nonVerbalAdaptationStrategy: {
    greetingsAndRespect: string;
    seatingAndSpatialHierarchy: string;
    touchAndEyeContact: string;
    eatingAndFoodHospitality: string;
  };
  worldBuilding: {
    architecture: string;
    wardrobeAndFabrics: string;
    transportAndProps: string;
    soundscapeAndRituals: string;
  };
  characterAdaptationMap: {
    sourceName: string;
    adaptedName: string;
    canonicalId: string;
    socialRoleShift: string;
    culturalJustification: string;
  }[];
  uncertaintiesAndAssumptions: string[];
  approvedByHuman: boolean;
}

export interface ContinuityContradiction {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
  type: 'PROP_DISAPPEARANCE' | 'COSTUME_TELEPORT' | 'KNOWLEDGE_LEAK' | 'LOCATION_CLASH' | 'ENTITY_DUPLICATE';
  description: string;
  affectedScenes: string[];
  suggestedResolution: string;
  resolved: boolean;
}

export interface AdaptationProject {
  id: string;
  title: string;
  sourceScreenplayText: string;
  selectedCulture: DialectOption;
  selectedRegion: string;
  selectedSetting: SettingType;
  selectedScript: WritingScript;
  scenes: SceneRecord[];
  characters: CanonicalCharacter[];
  costumes: CanonicalCostume[];
  locations: CanonicalLocation[];
  props: CanonicalProp[];
  adaptationPlan: CulturalAdaptationPlan;
  contradictions: ContinuityContradiction[];
  workflowStep: 'upload' | 'extraction' | 'approval' | 'screenplay' | 'visuals' | 'continuity_export';
  isApprovedForVisuals: boolean;
}
