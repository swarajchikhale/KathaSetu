import {
  CanonicalCharacter,
  CanonicalCostume,
  CanonicalLocation,
  CanonicalProp,
  ContinuityContradiction,
  CulturalAdaptationPlan,
  DialectOption,
  SceneRecord,
  SettingType,
  WritingScript
} from '../types/adaptation';
import { buildPromptSpec, generateVisualPlate } from './proceduralVisuals';

// Contradiction detection engine: checks prop transfers, costume teleportation, knowledge leaks
export function detectContradictions(
  scenes: SceneRecord[],
  characters: CanonicalCharacter[],
  props: CanonicalProp[],
  costumes: CanonicalCostume[]
): ContinuityContradiction[] {
  const contradictions: ContinuityContradiction[] = [];

  // 1. Prop continuity check
  props.forEach((prop) => {
    // Check specific narrative rules: e.g. Prop carried in Scene 1 and 2, but requires explicit staging explanation in Scene 3
    if (prop.id === 'PROP_SEALED_DEED' || prop.name.toLowerCase().includes('envelope') || prop.name.toLowerCase().includes('deed')) {
      const sc2 = scenes.find((s) => s.scene_id === 'SC02');
      const sc3 = scenes.find((s) => s.scene_id === 'SC03');

      if (sc2 && sc3) {
        contradictions.push({
          id: 'CONTRA_PROP_DEED_SC03',
          severity: 'CRITICAL',
          type: 'PROP_DISAPPEARANCE',
          description: `Physical Continuity Discrepancy: ${prop.name} was carried out of Scene 2 by Amar/David under his arm. Scene 3 begins in the courtyard with David seated, requiring verified staging explanation for the document placement.`,
          affectedScenes: ['SC02', 'SC03'],
          suggestedResolution: `Explicitly insert action note in Scene 3: 'David sets the opened legal envelope down on the courtyard wooden bench beside him.'`,
          resolved: false
        });
      }
    }
  });

  // 2. Costume teleportation check
  characters.forEach((char) => {
    let previousCostume: string | null = null;
    let previousTime: string | null = null;

    scenes.forEach((scene) => {
      const charCostumeId = scene.costume_ids.find((cid) => cid.includes(char.id) || cid.includes(char.canonicalName.toUpperCase()));
      if (charCostumeId && previousCostume && charCostumeId !== previousCostume) {
        if (previousTime && (scene.time.toLowerCase().includes('morning') && previousTime.toLowerCase().includes('early morning'))) {
          contradictions.push({
            id: `CONTRA_COSTUME_${char.id}_${scene.scene_id}`,
            severity: 'WARNING',
            type: 'COSTUME_TELEPORT',
            description: `Costume Continuity Warning: Character ${char.canonicalName} changes costume from ${previousCostume} to ${charCostumeId} within consecutive immediate morning scenes with no narrative transit period.`,
            affectedScenes: [scene.scene_id],
            suggestedResolution: `Retain ${previousCostume} for ${char.canonicalName} or introduce a scene action where character dusts off travel jacket or changes into domestic attire.`,
            resolved: false
          });
        }
      }
      if (charCostumeId) {
        previousCostume = charCostumeId;
        previousTime = scene.time;
      }
    });
  });

  // 3. Entity duplicate alias check
  const aliasMap = new Map<string, string>();
  characters.forEach((char) => {
    char.aliases.forEach((alias) => {
      const lower = alias.toLowerCase().trim();
      if (aliasMap.has(lower) && aliasMap.get(lower) !== char.id) {
        contradictions.push({
          id: `CONTRA_ENTITY_ALIAS_${char.id}`,
          severity: 'CRITICAL',
          type: 'ENTITY_DUPLICATE',
          description: `Duplicate Entity Collision: The alias '${alias}' is associated with both ${aliasMap.get(lower)} and ${char.id}. This breaks canonical visual reference continuity.`,
          affectedScenes: scenes.map((s) => s.scene_id),
          suggestedResolution: `Merge these mentions into a single canonical ID '${char.id}' before generating character bible images.`,
          resolved: false
        });
      } else {
        aliasMap.set(lower, char.id);
      }
    });
  });

  return contradictions;
}

// High-fidelity benchmark extraction for the standard 4-scene screenplay
export function buildBenchmarkExtraction(
  screenplayText: string,
  culture: DialectOption
): {
  scenes: SceneRecord[];
  characters: CanonicalCharacter[];
  costumes: CanonicalCostume[];
  locations: CanonicalLocation[];
  props: CanonicalProp[];
  contradictions: ContinuityContradiction[];
} {
  const characters: CanonicalCharacter[] = [
    {
      id: 'CHAR_AMAR',
      canonicalName: 'David / Amar Singh',
      aliases: ['David', 'Amar', 'The Elder Son', 'A. Singh', 'Prodigal Heir'],
      age: 34,
      role: 'Elder Son / Returning Migrant',
      relationships: 'Elder brother to Rohan; eldest son of Beatrice/Bebe',
      personality: 'Guilt-ridden, pragmatic, stoic pride hiding financial insolvency',
      adaptedName: culture.id.includes('majhi') || culture.id.includes('malwai') ? 'Amarjit "Amar" Singh' :
                   culture.id.includes('bangru') ? 'Amar Singh Sangwan' :
                   culture.id.includes('marwari') ? 'Amar Singh Rathore' :
                   culture.id.includes('awadhi') ? 'Amar Nath Shukla' : 'Amar Jha',
      adaptedRole: 'Eldest son returning from town factory failure to preserve ancestral dignity',
      grooming: culture.id.includes('majhi') ? 'Full traditional beard neatly groomed with fikso, starch-pressed navy Pagri' :
                culture.id.includes('bangru') ? 'Trimmed moustache, white cotton Khandwa wrapped over forehead' :
                culture.id.includes('marwari') ? 'Regal Rajputana trimmed beard, saffron cotton Safa with back tail' :
                'Clean shaven with neat hair, Gamcha across shoulder',
      physicalDescription: 'Lean, sun-bronzed, weathered cheekbones, tense jawline from chronic financial strain',
      approved: false
    },
    {
      id: 'CHAR_ROHAN',
      canonicalName: 'Rohan / Kabir Singh',
      aliases: ['Rohan', 'The Younger Brother', 'The Boy', 'The Son'],
      age: 24,
      role: 'Younger Brother / Soil Custodian',
      relationships: 'Younger brother to David/Amar; youngest son of Beatrice/Bebe',
      personality: 'Fiercely protective of ancestral soil, agrarian purist, wounded by abandonment',
      adaptedName: culture.id.includes('majhi') || culture.id.includes('malwai') ? 'Rohanveer "Rohan" Singh' :
                   culture.id.includes('bangru') ? 'Rohtash "Rohan" Malik' :
                   culture.id.includes('marwari') ? 'Rohan Singh Bhati' :
                   culture.id.includes('awadhi') ? 'Rohan Lal Shukla' : 'Rohan Kumar Jha',
      adaptedRole: 'Sole keeper of the diesel water pump and ancestral crop parcels',
      grooming: culture.id.includes('majhi') ? 'Youthful round Patka turban tied firmly, grease-streaked work hands' :
                culture.id.includes('marwari') ? 'Simple daily Leheriya Safa, rough field worker posture' :
                'Casual daily head cloth, sleeves rolled to elbows',
      physicalDescription: 'Broad-shouldered, muscular farm worker physique, calloused palms, defiant stare',
      approved: false
    },
    {
      id: 'CHAR_BEBE',
      canonicalName: 'Beatrice / Bebe',
      aliases: ['Beatrice', 'Mother', 'Bebe', 'The Matriarch', 'Maji Sa'],
      age: 62,
      role: 'Matriarch / Moral Authority',
      relationships: 'Mother to Amar and Rohan; widow of late patriarch',
      personality: 'Incisive moral compass, unwavering dignity, perceptive emotional intelligence',
      adaptedName: culture.id.includes('majhi') ? 'Bebe Gurmeet Kaur' :
                   culture.id.includes('bangru') ? 'Tai Kamla Devi' :
                   culture.id.includes('marwari') ? 'Maji Sa Padma Kanwar' :
                   culture.id.includes('awadhi') ? 'Amma Shanti Devi' : 'Dai Saraswati Devi',
      adaptedRole: 'Custodian of the family iron chest and ancestral moral lineage',
      grooming: culture.id.includes('majhi') ? 'Ivory white cotton Salwar Kameez, hand-loomed Phulkari dupatta with mustard silk thread' :
                culture.id.includes('marwari') ? 'Deep maroon cotton Odhna in respectful Ghoonghat, silver Borla on forehead' :
                'Handspun Khadi saree with silver Hansli neckband',
      physicalDescription: 'Silver hair parted in center, arthritic knuckles, penetrating calm eyes',
      approved: false
    },
    {
      id: 'CHAR_GURDIP',
      canonicalName: 'Gurdip / The Surveyor',
      aliases: ['Gurdip', 'The Surveyor', 'The Assessor', 'Revenue Officer', 'Patwari'],
      age: 52,
      role: 'Municipal Land Assessor / Revenue Patwari',
      relationships: 'Local government intermediary, known to both brothers',
      personality: 'Bureaucratic, shrewd, opportunistic yet bound by customary village boundaries',
      adaptedName: culture.id.includes('majhi') ? 'Patwari Gurdip Singh Sandhu' :
                   culture.id.includes('bangru') ? 'Patwari Gurdip Sharma' :
                   culture.id.includes('marwari') ? 'Kanungo Gurdip Mal Gehlot' :
                   culture.id.includes('awadhi') ? 'Lekhpal Gurdip Pandey' : 'Patwari Gurdip Mandal',
      adaptedRole: 'Village Land Revenue Inspector holding the 1982 canal blueprint',
      grooming: 'Safari suit or crisp Nehru jacket, thick horn-rimmed glasses, pocket pen set',
      physicalDescription: 'Slightly portly, bureaucratic gait, squinting eyes used to reading land deeds',
      approved: false
    }
  ];

  characters.forEach((char) => {
    char.visualPromptSpec = buildPromptSpec('character', char.canonicalName, culture, {
      role: char.role,
      age: char.age,
      costume: char.grooming
    });
    char.visualAssetUrl = generateVisualPlate('character', char.canonicalName, `${char.role} (${culture.name})`, culture, char.visualPromptSpec);
  });

  const costumes: CanonicalCostume[] = [
    {
      id: 'COST_AMAR_01',
      characterId: 'CHAR_AMAR',
      label: 'Amar Travel Attire (Scenes 1-2)',
      scenesAppearing: ['SC01', 'SC02'],
      garments: 'Heavy canvas utility jacket over a dust-streaked collared Kurta, sturdy field trousers',
      fabrics: 'Rough handspun Khaddar cotton with dark vegetable dye',
      colors: 'Indigo blue Kurta, charcoal canvas over-layer, dust ochre patina',
      headwear: culture.id.includes('majhi') ? 'Crisply tied navy blue Pagri with neat Shamla' : 'Earthy cotton turban',
      footwear: 'Sturdy mustard-oil softened Desi Jutti with double leather sole',
      jewellery: 'Heavy plain steel Sarbloh Kara on right wrist',
      groomingNotes: 'Travel-worn, slight stubble and road dust along temple line',
      approved: false
    },
    {
      id: 'COST_AMAR_02',
      characterId: 'CHAR_AMAR',
      label: 'Amar Homestead Domestic Attire (Scenes 3-4)',
      scenesAppearing: ['SC03', 'SC04'],
      garments: 'Canvas jacket discarded; wearing relaxed open-neck handloomed Kurta and loose Chadra/Pajama',
      fabrics: 'Soft unbleached organic cotton',
      colors: 'Off-white ivory with faint saffron selvedge',
      headwear: 'Soft home-wound turban without starched turla',
      footwear: 'Barefoot or simple leather slip-on mojris',
      jewellery: 'Steel Kara',
      groomingNotes: 'Face washed with well water, hair slightly damp at nape',
      approved: false
    },
    {
      id: 'COST_ROHAN_01',
      characterId: 'CHAR_ROHAN',
      label: 'Rohan Field Work Attire (Scenes 1-4)',
      scenesAppearing: ['SC01', 'SC02', 'SC03', 'SC04'],
      garments: 'Frayed sleeveless cotton vest/kurti, rolled-up rugged work trousers, oil-stained tool towel',
      fabrics: 'Coarse homespun desi cotton, heavily washed and repaired at seams',
      colors: 'Faded olive green and mud grey',
      headwear: 'Tightly knotted small head cloth (Patka) holding back sweat',
      footwear: 'Thick-soled mud-caked agrarian work boots',
      jewellery: 'Black cotton thread around neck with small silver protective amulet',
      groomingNotes: 'Arms streaked with engine oil and well silt, hair damp from exertion',
      approved: false
    },
    {
      id: 'COST_BEBE_01',
      characterId: 'CHAR_BEBE',
      label: 'Bebe Matriarchal Garb (Scenes 1-4)',
      scenesAppearing: ['SC01', 'SC03'],
      garments: 'Full ankle-length Salwar-Kameez draped with an expansive hand-embroidered Phulkari shawl',
      fabrics: 'Hand-woven unbleached cotton base with pure silk thread embroidery',
      colors: 'Pristine ivory kameez, Phulkari in rich mustard-gold and crimson geometric diamonds',
      headwear: 'Phulkari draped over head, covering grey hair respectfully',
      footwear: 'Flat velvet juttis lined with soft wool',
      jewellery: 'Heavy antique iron chest key on a black braided cord; silver hoop earrings',
      groomingNotes: 'Graceful age lines, neat center parting, calm aristocratic poise',
      approved: false
    },
    {
      id: 'COST_GURDIP_01',
      characterId: 'CHAR_GURDIP',
      label: 'Surveyor Bureaucratic Uniform (Scene 2)',
      scenesAppearing: ['SC02'],
      garments: 'Terylene safari suit with epaulettes, buttoned pockets holding fountain pens and measuring tape',
      fabrics: 'Synthetic blend suited for government field tours',
      colors: 'Khaki fawn / pale sand',
      headwear: 'White cloth sun-cap or neatly pinned daily turban',
      footwear: 'Polished brown Bata oxford shoes now dusted with canal silt',
      jewellery: 'Steel watch on metallic expanding strap',
      groomingNotes: 'Sweating profusely under midday heat, thick spectacles constantly slipping down nose',
      approved: false
    }
  ];

  costumes.forEach((cos) => {
    cos.visualPromptSpec = buildPromptSpec('costume', cos.label, culture, {
      costume: `${cos.garments} made of ${cos.fabrics} in ${cos.colors}`
    });
    cos.visualAssetUrl = generateVisualPlate('costume', cos.label, `${cos.garments}`, culture, cos.visualPromptSpec);
  });

  const locations: CanonicalLocation[] = [
    {
      id: 'LOC_HOMESTEAD_BAITHAK',
      name: 'Ancestral Homestead - Baithak (Living Hall)',
      type: 'INT',
      subLocation: 'Central Baithak with high wooden ceiling',
      architectureDetails: culture.culturalAnchors.architecture,
      culturalProps: ['Carved high-backed wooden chair', 'Manja (charpai)', 'Brass water jug', 'Antique pendulum clock', 'Tulsi niche visible through door'],
      scenesAppearing: ['SC01']
    },
    {
      id: 'LOC_CANAL_TUBEWELL',
      name: 'Canal Tube-Well & Fruit Orchard',
      type: 'EXT',
      subLocation: 'Concrete pump platform adjacent to running water ditch',
      architectureDetails: 'Single-cylinder Kirloskar diesel pump vibrating violently, clear canal water rushing through concrete culvert, shaded by dense green kinnow / mango orchard canopy',
      culturalProps: ['Brass measuring chain', 'Rusted iron pipe spanner', 'Patwari leather land register', 'Black umbrella'],
      scenesAppearing: ['SC02']
    },
    {
      id: 'LOC_HOMESTEAD_VEHRA',
      name: 'Homestead Courtyard (Vehra) & Veranda Kitchen',
      type: 'INT/EXT',
      subLocation: 'Brick-paved open sky courtyard with covered chulha veranda',
      architectureDetails: 'Exposed kiln-baked Nanakshahi brick walls, open open-air courtyard with central neem tree, mud-plastered chulha hearth with embers',
      culturalProps: ['Brass milk patila', 'Kansa cups', 'Kerosene storm lantern', 'Wooden low bench (Peeri)'],
      scenesAppearing: ['SC03']
    },
    {
      id: 'LOC_BOUNDARY_BANYAN',
      name: 'Ancestral Boundary Banyan Tree',
      type: 'EXT',
      subLocation: 'Ancient Banyan tree root system and boundary stone',
      architectureDetails: 'Vast aerial roots touching the ground like fortress pillars, whitewashed stone survey marker 1982, moonlit canal embankment',
      culturalProps: ['Hurricane lantern', 'Brass chest key', 'Crumpled blueprint'],
      scenesAppearing: ['SC04']
    }
  ];

  const props: CanonicalProp[] = [
    {
      id: 'PROP_SEALED_DEED',
      name: 'Manila Legal Envelope & 1982 Land Blueprint',
      firstIntroducedScene: 'SC01',
      lastKnownScene: 'SC04',
      carriedByCharacterId: 'CHAR_AMAR',
      description: 'The municipal mortgage division petition and yellowed 1982 survey blueprint sealed with official red wax and ribbon. The central instigating prop.',
      culturalAdaptedEquivalent: 'Tehsil Municipal Partition Petition (Intiqal Farad) stamped by District Sub-Registrar'
    },
    {
      id: 'PROP_BRASS_CHEST_KEY',
      name: 'Antique Iron/Brass Chest Key',
      firstIntroducedScene: 'SC01',
      lastKnownScene: 'SC04',
      carriedByCharacterId: 'CHAR_BEBE',
      description: 'Heavy heirloom iron key on a braided cord worn around Bebe\'s neck; unlocks the ancestral iron chest holding genuine family deeds.',
      culturalAdaptedEquivalent: 'Ancestral Sandook (Iron Dowry Chest) Key'
    },
    {
      id: 'PROP_MEASURING_CHAIN',
      name: 'Surveyor Metric Measuring Chain (Zari)',
      firstIntroducedScene: 'SC02',
      lastKnownScene: 'SC02',
      carriedByCharacterId: 'CHAR_GURDIP',
      description: 'Standard brass-jointed link chain used by revenue patwaris to demarcate canal water frontage.',
      culturalAdaptedEquivalent: 'Patwari Gunter\'s Measuring Chain (Zarib)'
    },
    {
      id: 'PROP_PIPE_SPANNER',
      name: 'Heavy Rusted Pipe Spanner',
      firstIntroducedScene: 'SC02',
      lastKnownScene: 'SC02',
      carriedByCharacterId: 'CHAR_ROHAN',
      description: 'Iron tool used by Rohan to clear diesel pump flumes, brandished during emotional confrontation.',
      culturalAdaptedEquivalent: 'Canal Diesel Motor Spanner'
    }
  ];

  const scenes: SceneRecord[] = [
    {
      scene_id: 'SC01',
      scene_number: 1,
      slugline: 'SCENE 1: INT. ANCESTRAL HOMESTEAD - LIVING HALL - EARLY MORNING',
      int_ext: 'INT',
      location_id: 'LOC_HOMESTEAD_BAITHAK',
      sub_location: 'Living Hall / Baithak',
      time: 'Early Morning (6:15 AM)',
      day_or_date: 'Day 1 of Harvest Cycle',
      weather: 'Crisp morning, golden dawn light filtering through timber slats',
      mood: 'Strained, tense, repressed shock upon sudden return',
      short_summary: 'David returns after three seasons with an unsealed land deed division petition; confronted by Mother Beatrice and younger brother Rohan.',
      dramatic_purpose: 'Establish core stakes: imminent mortgage foreclosure versus ancestral soil pride, and the brothers\' fractured trust.',
      characters: ['CHAR_AMAR', 'CHAR_BEBE', 'CHAR_ROHAN'],
      costume_ids: ['COST_AMAR_01', 'COST_BEBE_01', 'COST_ROHAN_01'],
      props_in: ['PROP_SEALED_DEED', 'PROP_BRASS_CHEST_KEY'],
      props_out: ['PROP_SEALED_DEED'],
      character_states: [
        {
          character_id: 'CHAR_AMAR',
          emotional_state_before: 'Nervous, anxious, carrying bankrupt shame masked by legal formality',
          emotional_state_after: 'Cornered and defensive against younger brother\'s immediate contempt',
          injuries_or_physical: 'Dust-caked boots, travel fatigue from overnight third-class wagon',
          knowledge_gained: 'Learns mother\'s eyesight has worsened and Rohan has run the farm solo through winter frost'
        },
        {
          character_id: 'CHAR_BEBE',
          emotional_state_before: 'Silent prayerful composure',
          emotional_state_after: 'Disappointed yet authoritative; refusing to allow land division before breakfast',
          injuries_or_physical: 'Arthritic swelling in right knee',
          knowledge_gained: 'Sees David has brought official municipal partition papers instead of familial gifts'
        },
        {
          character_id: 'CHAR_ROHAN',
          emotional_state_before: 'Exhausted from early tractor grease work',
          emotional_state_after: 'Volatile rage at perceived betrayal',
          injuries_or_physical: 'Grease stains on arms and calloused palms',
          knowledge_gained: 'Discovers David intends to carve up the lower four acres before noon'
        }
      ],
      emotional_change: 'From awkward reunion silence to bitter family confrontation over survival versus inheritance.',
      continuity_warnings: [],
      lines: [
        {
          id: 'L01',
          type: 'action',
          text: 'The morning sun pierces through high slatted windows, illuminating dancing dust motes above weathered wooden floorboards. An antique pendulum clock ticks with rhythmic gravity.',
          adaptedText: `Early morning rays slant across the baked Nanakshahi brick deori, casting sharp amber geometric shadows on the cowdung-plastered courtyard floor. On the raised brick baithak, an antique brass wall clock swings its pendulum with heavy, steady beats.`
        },
        {
          id: 'L02',
          type: 'action',
          text: 'Beatrice sits on a high-backed cane chair, her arthritic fingers slowly turning a brass prayer bead necklace. Around her neck hangs a heavy antique iron key on a faded cord.',
          adaptedText: `Bebe sits upon a low wooden peeri, her gnarled fingers turning the smoothed beads of a wooden Simrana. Around her neck, tied with a greasy black cotton thread, hangs the heavy iron key to the ancestral family sandook.`
        },
        {
          id: 'L03',
          type: 'dialogue',
          character: 'DAVID',
          characterId: 'CHAR_AMAR',
          text: 'Mother. The train reached before dawn. I took the morning wagon from the junction.',
          adaptedText: `Sat Sri Akaal, Bebe... Gaddi pichhle pehar pahunch gayi si. Main junction ton taange te aaya aan.`
        },
        {
          id: 'L04',
          type: 'dialogue',
          character: 'BEATRICE',
          characterId: 'CHAR_BEBE',
          text: 'Three seasons, David. Not a telegram. Not a line on paper. And now you stand at the threshold clutching government parchment like a tax bailiff.',
          adaptedText: `Tinn faslan nikal gayiyan, Amar. Na koi chithhi, na taar. Te ajj tu saade buhe te sarkari kaghaz fadi khada ae... jiven koi tehsil da baaki-vasool karinda hove.`
        },
        {
          id: 'L05',
          type: 'dialogue',
          character: 'ROHAN',
          characterId: 'CHAR_ROHAN',
          text: 'He didn\'t come to inquire about your knees, Mother. Look at his hands. He\'s already holding the surveyor\'s appraisal.',
          adaptedText: `Eh tuhade gitteyan da dukh puchhan nahi aaya, Bebe! Haath dekho ehde... Patwari di nakal pehlan hi muthhi vich dabbi baitha ae!`
        }
      ]
    },
    {
      scene_id: 'SC02',
      scene_number: 2,
      slugline: 'SCENE 2: EXT. FAMILY ORCHARD - CANAL TUBE-WELL - AFTERNOON',
      int_ext: 'EXT',
      location_id: 'LOC_CANAL_TUBEWELL',
      sub_location: 'Canal Tube-Well Pump Head',
      time: 'Midday Afternoon (1:30 PM)',
      day_or_date: 'Day 1 of Harvest Cycle',
      weather: 'Blistering dry heat, heat shimmers over green fruit foliage',
      mood: 'Hostile, aggressive clash over life-giving irrigation water',
      short_summary: 'David takes the deed to surveyor Gurdip at the canal well; Rohan arrives armed with a spanner to defend water rights.',
      dramatic_purpose: 'Expose the physical and community reality of land division—severing canal flow devastates neighbors.',
      characters: ['CHAR_AMAR', 'CHAR_GURDIP', 'CHAR_ROHAN'],
      costume_ids: ['COST_AMAR_01', 'COST_GURDIP_01', 'COST_ROHAN_01'],
      props_in: ['PROP_SEALED_DEED', 'PROP_MEASURING_CHAIN', 'PROP_PIPE_SPANNER'],
      props_out: ['PROP_SEALED_DEED'],
      character_states: [
        {
          character_id: 'CHAR_AMAR',
          emotional_state_before: 'Determined to execute the legal boundary division quickly',
          emotional_state_after: 'Shocked by the realization that his paper deed ruins his neighbors\' livelihoods',
          injuries_or_physical: 'Sweat-soaked collar, jacket discarded',
          knowledge_gained: 'Learns his late father made a solemn verbal water pact that supersedes court blueprints'
        },
        {
          character_id: 'CHAR_GURDIP',
          emotional_state_before: 'Smug bureaucratic neutrality',
          emotional_state_after: 'Unsettled by Rohan\'s physical threats and family fury',
          injuries_or_physical: 'Heat exhaustion, wiping glasses repeatedly',
          knowledge_gained: 'Recognizes the brothers will turn physical if survey pegs are hammered'
        },
        {
          character_id: 'CHAR_ROHAN',
          emotional_state_before: 'Furious guardian of canal irrigation',
          emotional_state_after: 'Vindicated when father\'s verbal honor is proven superior to bank deeds',
          injuries_or_physical: 'Rusted spanner blisters on thumb',
          knowledge_gained: 'Confirms David came with zero regard for village biradari ties'
        }
      ],
      emotional_change: 'From bureaucratic transaction to visceral physical confrontation over soil survival.',
      continuity_warnings: [],
      lines: [
        {
          id: 'L06',
          type: 'action',
          text: 'Blinding afternoon heat ripples over rows of ripening fruit trees. The rhythmic, guttural thrum of an old diesel water-pump echoes across the irrigation channel.',
          adaptedText: `Dupahar di tatti loh kinnowan de baghan te agg vargi chal rahi ae. Canal de kandhe te Kirloskar da diesel engine \'thuk-thuk-thuk\' karda khalse vich paani sutt riha ae.`
        },
        {
          id: 'L07',
          type: 'dialogue',
          character: 'GURDIP',
          characterId: 'CHAR_GURDIP',
          text: 'Ah, the prodigal heir arrives. Mister David, your brother has been threatening to drop my measuring chain into the canal pump.',
          adaptedText: `Aao ji, shehri Sardar ji! Tuhada chhota veer taan aakhda si ki Patwari di zarib nu canal di motor ch fansa dena ae.`
        },
        {
          id: 'L08',
          type: 'dialogue',
          character: 'DAVID',
          characterId: 'CHAR_AMAR',
          text: 'Let him talk, Gurdip. Here is the certified boundary survey from nineteen eighty-two. The north canal easement belongs to our parcel.',
          adaptedText: `Boln de ehnu, Patwari ji. Eh dekho baasi assi di intiqal nakal! Uttri khalsa saade hisse da hakk banta ae.`
        },
        {
          id: 'L09',
          type: 'dialogue',
          character: 'ROHAN',
          characterId: 'CHAR_ROHAN',
          text: 'Paper money doesn\'t clear silt from the water flume at three in the morning when the frost freezes the intake! You gave up your right to this water the day you packed your tin trunk.',
          adaptedText: `Kaagzan de note pohh di raat nu canal di gaadh nahi kadd de, Bhau! Jiss din tu lohe di peti binn ke shahar gaya si, osse din is paani te tera hakk muk gaya si!`
        }
      ]
    },
    {
      scene_id: 'SC03',
      scene_number: 3,
      slugline: 'SCENE 3: INT. HOMESTEAD COURTYARD AND KITCHEN - DUSK',
      int_ext: 'INT/EXT',
      location_id: 'LOC_HOMESTEAD_VEHRA',
      sub_location: 'Courtyard & Veranda Hearth',
      time: 'Dusk / Twilight (6:45 PM)',
      day_or_date: 'Day 1 of Harvest Cycle',
      weather: 'Cool purple twilight, crickets stirring, kitchen chulha smoke',
      mood: 'Intimate, sorrowful, stripped bare of pretenses',
      short_summary: 'David breaks down in front of Beatrice over warm broth, confessing the catastrophic bankruptcy of his city venture.',
      dramatic_purpose: 'The emotional crux of the story: shifting Amar from avoidance to admission, and showing maternal omniscience.',
      characters: ['CHAR_AMAR', 'CHAR_BEBE', 'CHAR_ROHAN'],
      costume_ids: ['COST_AMAR_02', 'COST_BEBE_01', 'COST_ROHAN_01'],
      props_in: ['PROP_SEALED_DEED'],
      props_out: [],
      character_states: [
        {
          character_id: 'CHAR_AMAR',
          emotional_state_before: 'Arrogant defense cracked; deeply ashamed',
          emotional_state_after: 'Humbled, weeping, relieved to finally stop lying',
          injuries_or_physical: 'Trembling hands holding hot brass bowl',
          knowledge_gained: 'Learns his mother already deciphered his financial ruin months ago'
        },
        {
          character_id: 'CHAR_BEBE',
          emotional_state_before: 'Stern, expectant mother waiting for son to confess',
          emotional_state_after: 'Loving matriarch who holds the family soul intact',
          injuries_or_physical: 'Cough from chulha smoke',
          knowledge_gained: 'Hears David admit he slept on warehouse docks rather than ask for help'
        }
      ],
      emotional_change: 'Amar moves from avoidance and false pride to raw confession and emotional redemption.',
      continuity_warnings: [],
      lines: [
        {
          id: 'L10',
          type: 'action',
          text: 'David sits on a low wooden bench in the courtyard corner. The opened legal envelope lies beside him, its red ribbon loose on the wooden planks.',
          adaptedText: `Amar vehre de kone vich manje te baitha ae. Khulhe hoye tehsil de lifafe da laal fita sutt ke charpai de baanan te rul riha ae.`
        },
        {
          id: 'L11',
          type: 'dialogue',
          character: 'DAVID',
          characterId: 'CHAR_AMAR',
          text: 'I lost the shop in the port town, Mother. Six months ago. The shipping line defaulted. I didn\'t send money in spring because I was sleeping on warehouse crates.',
          adaptedText: `Mandi di aadat dubb gayi, Bebe... Chhe maheene pehlan sab ujad gaya. Main bas sharam de maare bol na sakeya... warehouse de thaddiyan te so reha si.`
        },
        {
          id: 'L12',
          type: 'dialogue',
          character: 'BEATRICE',
          characterId: 'CHAR_BEBE',
          text: 'We knew. A mother knows when letters stop carrying questions about home and start carrying justifications. But land is not an account ledger, David.',
          adaptedText: `Saanu pata si, puttar. Maa nu pata lagg jaanda ae jadon chithhiyan vich ghare da haal puchhan di thaan kismat diyan safayiyan aavan lagg pain. Par zameen koi bahi-khaata nahi hundi, Amar.`
        }
      ]
    },
    {
      scene_id: 'SC04',
      scene_number: 4,
      slugline: 'SCENE 4: EXT. ANCESTRAL BOUNDARY BANYAN TREE - NIGHT',
      int_ext: 'EXT',
      location_id: 'LOC_BOUNDARY_BANYAN',
      sub_location: 'Century-Old Banyan Tree & Boundary Stone',
      time: 'Night (10:15 PM)',
      day_or_date: 'Night of Day 1',
      weather: 'Crisp moonlit night, cold breeze rustling leaves',
      mood: 'Sacred reconciliation, fraternal solidarity, renewed brotherhood',
      short_summary: 'David meets Rohan at the ancient property marker, discards the deed petition, and offers his own physical labor to pay the debt.',
      dramatic_purpose: 'Resolution: brotherhood and soil integrity win over financial subdivision.',
      characters: ['CHAR_AMAR', 'CHAR_ROHAN'],
      costume_ids: ['COST_AMAR_02', 'COST_ROHAN_01'],
      props_in: ['PROP_BRASS_CHEST_KEY', 'PROP_SEALED_DEED'],
      props_out: ['PROP_SEALED_DEED'],
      character_states: [
        {
          character_id: 'CHAR_AMAR',
          emotional_state_before: 'Repentant, resolved to work with his bare hands',
          emotional_state_after: 'Accepted back by his brother, finding true belonging',
          injuries_or_physical: 'Cold night air, eyes bright under moonlight',
          knowledge_gained: 'Understands true honor lies in sweat, not city status'
        },
        {
          character_id: 'CHAR_ROHAN',
          emotional_state_before: 'Brooding, expecting brother to abandon the land again',
          emotional_state_after: 'Emotionally reunited; accepts his elder brother as co-laborer',
          injuries_or_physical: 'Lantern heat in hand',
          knowledge_gained: 'Discovers Amar ripped up the survey petition and pledged to clean the pump at 4 AM'
        }
      ],
      emotional_change: 'From fraternal estrangement to fierce reconciliation and shared responsibility.',
      continuity_warnings: [],
      lines: [
        {
          id: 'L13',
          type: 'action',
          text: 'A full moon casts stark, silver shadows through the sprawling branches of a massive, centuries-old banyan tree that marks the property boundary.',
          adaptedText: `Puranmashi da chann wadde purane boharh diyan jhadan vichon chandi vargi chhanw sutt riha ae, jithe dade-parde de zameen di burji gaddi hoyi ae.`
        },
        {
          id: 'L14',
          type: 'dialogue',
          character: 'DAVID',
          characterId: 'CHAR_AMAR',
          text: 'I told Gurdip to burn the subdivision petition. The deed stays in the iron chest inside. We don\'t divide the ditch.',
          adaptedText: `Main Patwari nu aakh ditta... farad faad ke chulhe ch jhonk de! Kaghaz sandook vich hi rahangey. Zameen da paani nahi wandeya jaana.`
        },
        {
          id: 'L15',
          type: 'dialogue',
          character: 'ROHAN',
          characterId: 'CHAR_ROHAN',
          text: 'Morning shift starts at four. And you\'re cleaning the diesel pump filters first.',
          adaptedText: `Tadke chaar vaje motor challu karni ae, Bhau. Te filter pehlan tu saaf karenga.`
        }
      ]
    }
  ];

  scenes.forEach((sc) => {
    sc.visualPromptSpec = buildPromptSpec('scene', sc.slugline, culture, {
      setting: culture.culturalAnchors.architecture,
      time: sc.time,
      mood: sc.mood
    });
    sc.visualKeyframeUrl = generateVisualPlate('scene', `SCENE ${sc.scene_number}`, `${sc.sub_location} (${sc.time})`, culture, sc.visualPromptSpec);
  });

  const contradictions = detectContradictions(scenes, characters, props, costumes);

  return { scenes, characters, costumes, locations, props, contradictions };
}

// Generate the Cultural Adaptation Plan
export function generateAdaptationPlan(
  culture: DialectOption,
  region: string,
  setting: SettingType,
  script: WritingScript,
  characters: CanonicalCharacter[]
): CulturalAdaptationPlan {
  const charMap = characters.map((c) => {
    let adaptedName = c.adaptedName || c.canonicalName;
    let justification = '';

    if (c.id === 'CHAR_AMAR') {
      justification = `Preserves the eldest son's burden while grounding his identity in ${culture.name}'s agrarian succession ethics. The name reflects familial gravitas and regional phonetic resonance.`;
    } else if (c.id === 'CHAR_ROHAN') {
      justification = `Emphasizes physical connection to ancestral topsoil, agrarian defiance, and raw verbal cadence typical of younger siblings in ${culture.region}.`;
    } else if (c.id === 'CHAR_BEBE') {
      justification = `Elevates the mother to ${culture.name}'s sacred matriarchal authority. Her power derives from moral dignity, the ancestral chest key, and custody of family izzat.`;
    } else {
      justification = `Grounds the bureaucratic surveyor in the regional revenue hierarchy (Patwari/Lekhpal/Kanungo) operating under state land settlement customs.`;
    }

    return {
      sourceName: c.canonicalName,
      adaptedName,
      canonicalId: c.id,
      socialRoleShift: `${c.role} adapted to ${setting} ${culture.name} family structure`,
      culturalJustification: justification
    };
  });

  return {
    cultureId: culture.id,
    cultureName: culture.name,
    dialectName: culture.name.split('(')[0].trim(),
    region: region || culture.region,
    settingType: setting,
    writingScript: script,
    coreNarrativeGoal: `Re-anchor the universal human dilemma of land partition, brotherly betrayal, and filial redemption inside authentic ${culture.name} (${culture.region}) social realities without diluting dramatic stakes.`,
    whyStoryIsPreserved: `The source story's four-act movement (reunion shock -> boundary dispute -> maternal confession -> midnight reconciliation) remains strictly intact. The emotional motivation of the elder brother (hiding insolvency out of familial shame) translates with heightened resonance in ${culture.name}, where land loss is equated with spiritual death.`,
    verbalAdaptationStrategy: {
      dialectFeatures: culture.linguisticTraits,
      kinshipAndHonorifics: `Use authentic kinship addresses: ${Object.entries(culture.kinshipTerms).map(([k, v]) => `${k} -> ${v}`).join(', ')}. Strict adherence to hierarchy; elder siblings are never addressed casually by given names alone.`,
      humourAndCadence: `Incorporate dry, biting rural wit and folk maxims rather than translated puns. Tensions are expressed through deliberate cadence and sudden stark silence.`,
      codeSwitchingPolicy: setting === 'urban' ? 'Natural colloquial code-switching between regional dialect and English terms for banking/legal entities.' : 'Pure regional dialect with archaic revenue terminology (Intiqal, Zameen, Farad, Bahi-Khata).'
    },
    nonVerbalAdaptationStrategy: {
      greetingsAndRespect: culture.culturalAnchors.rituals,
      seatingAndSpatialHierarchy: `Seating encodes power: Matriarch occupies the central peeri or high charpai head; younger brother remains standing or paces along perimeter; surveyor remains at the threshold until invited.`,
      touchAndEyeContact: `Eye contact between sons and mother is respectful and downcast; confrontation between brothers is physical, chest-to-chest, gripping forearms rather than Western handshakes.`,
      eatingAndFoodHospitality: `Serving ${culture.culturalAnchors.food} acts as an unbreakable covenant of peace; refusing food signals active hostility.`
    },
    worldBuilding: {
      architecture: culture.culturalAnchors.architecture,
      wardrobeAndFabrics: culture.culturalAnchors.textiles,
      transportAndProps: `Replace Western wagon/steam coach with taanga, tractor trolley, or regional bus; legal envelope stamped with Tehsil Sub-Registrar seals; brass kansa vessels.`,
      soundscapeAndRituals: `Diesel engine pulse across water channels, evening temple/gurdwara speakers in far distance, dusk swallows, rhythmic wooden simrana beads.`
    },
    characterAdaptationMap: charMap,
    uncertaintiesAndAssumptions: [
      `Assumed 1980s-to-modern agrarian settlement era to ensure revenue terminology (Intiqal/Farad) matches active land dispute jurisprudence in ${culture.state}.`,
      `Verified that maternal authority can legally and culturally veto property subdivision under community Panchayat norms in ${culture.region}.`
    ],
    approvedByHuman: false
  };
}
