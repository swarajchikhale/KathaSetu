import { DialectOption, VisualPromptSpec } from '../types/adaptation';

// Domain helper for generating prompt specifications
export function buildPromptSpec(
  type: 'character' | 'costume' | 'scene',
  entityName: string,
  culture: DialectOption,
  details: {
    role?: string;
    age?: number;
    costume?: string;
    setting?: string;
    time?: string;
    mood?: string;
  }
): VisualPromptSpec {
  const seed = Math.floor(Math.random() * 899999) + 100000;
  
  if (type === 'character') {
    return {
      model: 'gemini-3.1-flash-lite-image',
      aspectRatio: '3:4',
      positivePrompt: `Full-length cinematic character concept portrait of ${entityName}, age ${details.age || 30}, ${details.role || 'protagonist'} in authentic ${culture.name} cultural tradition (${culture.region}). Wearing authentic regional attire: ${details.costume || culture.culturalAnchors.textiles}. Authentic grooming, distinctive facial features reflecting regional lineage, expressive eyes, proud yet grounded posture. Shot on 85mm portrait lens, natural directional golden-hour lighting, high texture detail of handspun fabrics, photorealistic cinematic film still, 8k resolution.`,
      negativePrompt: `generic Bollywood costume, fancy dress party, modern synthetic nylon, western clothing, inaccurate turban style, distorted hands, blurry, cartoon, 3D render, over-saturated, pan-Indian generic caricature.`,
      seed,
      cameraAndLighting: '85mm f/1.8 prime lens, subtle side-rim daylight, shallow depth of field, warm organic film grain.',
      culturalAuthenticityChecklist: [
        `Strict adherence to ${culture.name} regional grooming`,
        `Fabric weave matches authentic ${culture.culturalAnchors.textiles.split(',')[0]}`,
        `Facial hair and headwear true to ${culture.region}`,
        `No pan-Indian or touristy decorative embellishments`
      ]
    };
  } else if (type === 'costume') {
    return {
      model: 'gemini-3.1-flash-lite-image',
      aspectRatio: '3:4',
      positivePrompt: `Official cinematic costume bible plate for ${entityName}, authentic to ${culture.name} (${culture.region}, ${culture.state}). Full body view front and 3/4 angle, displaying ${details.costume || 'traditional regional garment'}. Natural textured fabrics (${culture.culturalAnchors.textiles}), authentic dye tones (indigo, turmeric, madder, raw unbleached cotton), traditional stitching, appropriate footwear and regional jewelry. Museum-grade cultural archival costume plate, neutral studio fill lighting with textural rim light, sharp focus on textile embroidery.`,
      negativePrompt: `synthetic polyester shine, glitter, modern zippers, machine-printed fake ethnic patterns, incorrect drape, costume shop look, plastic accessories.`,
      seed,
      cameraAndLighting: '50mm standard architectural studio lens, high CRI diffused lighting, crisp fabric micro-texture.',
      culturalAuthenticityChecklist: [
        `Natural textile texture and traditional drape verified`,
        `Authentic regional color palette according to ${culture.state}`,
        `Period-appropriate and class-appropriate footwear and accessories`
      ]
    };
  } else {
    return {
      model: 'gemini-3.1-flash-lite-image',
      aspectRatio: '16:9',
      positivePrompt: `Cinematic wide keyframe still of ${entityName || 'ancestral homestead'}, setting in ${culture.region} (${culture.name}). ${details.setting || culture.culturalAnchors.architecture}. Time of day: ${details.time || 'morning'}, atmosphere: ${details.mood || 'tense, dramatic'}. Authentic regional architecture, traditional props (${culture.culturalAnchors.food}, brass ware, earthen vessels), cinematic character blocking showing distance and emotional tension. Directed like a contemporary realistic Indian art-house film. Shot on Arri Alexa, master anamorphic lens, realistic volumetric dust motes.`,
      negativePrompt: `modern plastic furniture, telephone poles in historical setting, generic palace sets, cartoonish bright colors, distorted anatomy, messy composition, CGI gloss.`,
      seed,
      cameraAndLighting: '35mm anamorphic master shot, natural ambient light bouncing from mud and brick surfaces, atmospheric haze.',
      culturalAuthenticityChecklist: [
        `Architecture matches ${culture.culturalAnchors.architecture.split(',')[0]}`,
        `Props follow authentic ${culture.region} agrarian/domestic toolkit`,
        `Seating and blocking reflect real cultural social hierarchy`
      ]
    };
  }
}

// Procedural rich visual generator: Generates high-definition culturally authentic visual plates
// Safe for both browser and Node.js (does not depend on Node Buffer)
export function generateVisualPlate(
  type: 'character' | 'costume' | 'scene',
  title: string,
  subtitle: string,
  culture: DialectOption,
  spec: VisualPromptSpec
): string {
  const seed = spec.seed;
  const isMajhi = culture.id.includes('majhi') || culture.id.includes('malwai');
  const isMarwari = culture.id.includes('marwari') || culture.id.includes('mewari');
  const isBangru = culture.id.includes('bangru');
  const isAwadhi = culture.id.includes('awadhi') || culture.id.includes('maithili');

  let primaryHue = '#8B4513';
  let accentHue = '#D4AF37';
  let bgGradient1 = '#1E1B18';
  let bgGradient2 = '#2A241E';

  if (isMajhi) {
    primaryHue = '#B8860B';
    accentHue = '#C97A2B';
    bgGradient1 = '#1F1A14';
    bgGradient2 = '#362A19';
  } else if (isMarwari) {
    primaryHue = '#C85A17';
    accentHue = '#E5A65D';
    bgGradient1 = '#281B15';
    bgGradient2 = '#42281D';
  } else if (isBangru) {
    primaryHue = '#708090';
    accentHue = '#A0522D';
    bgGradient1 = '#1A1C1E';
    bgGradient2 = '#2B2E33';
  } else if (isAwadhi) {
    primaryHue = '#4A6B82';
    accentHue = '#C5A059';
    bgGradient1 = '#161F28';
    bgGradient2 = '#23323F';
  }

  const width = type === 'scene' ? 1200 : 800;
  const height = type === 'scene' ? 675 : 1060;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGradient1}"/>
      <stop offset="60%" stop-color="${bgGradient2}"/>
      <stop offset="100%" stop-color="#0F0D0B"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentHue}"/>
      <stop offset="100%" stop-color="${primaryHue}"/>
    </linearGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
      <stop offset="50%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.75"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>

  <!-- Architectural & Cultural Motifs -->
  <g opacity="0.18" stroke="${accentHue}" stroke-width="1.5" fill="none">
    ${type === 'scene' ? `
      <path d="M 0,450 Q 300,410 600,430 T 1200,400 L 1200,675 L 0,675 Z" fill="${primaryHue}" opacity="0.2"/>
      <path d="M 150,420 L 150,220 L 320,180 L 480,220 L 480,430" stroke="${accentHue}" stroke-width="2"/>
      <path d="M 280,270 A 40,40 0 0,1 360,270 L 360,420 L 280,420 Z" fill="${accentHue}" opacity="0.15"/>
      <circle cx="850" cy="220" r="140" stroke="${accentHue}" stroke-dasharray="8 6"/>
      <line x1="0" y1="520" x2="1200" y2="520" stroke="${primaryHue}" stroke-width="1"/>
      <line x1="0" y1="580" x2="1200" y2="580" stroke="${primaryHue}" stroke-width="0.8"/>
    ` : `
      <rect x="60" y="60" width="${width - 120}" height="${height - 120}" rx="16" stroke="${accentHue}" stroke-width="1.5" stroke-dasharray="6 4"/>
      <path d="M 200,400 Q 400,120 600,400" stroke="${accentHue}" stroke-width="2.5" fill="none"/>
      <circle cx="400" cy="380" r="220" stroke="${accentHue}" opacity="0.12" fill="${primaryHue}" fill-opacity="0.05"/>
      <circle cx="400" cy="380" r="160" stroke="${accentHue}" stroke-dasharray="4 8"/>
    `}
  </g>

  <!-- Stylized Figure / Asset Silhouette in Cultural Attire -->
  <g transform="${type === 'scene' ? 'translate(600, 240)' : 'translate(400, 460)'}" text-anchor="middle">
    ${type === 'character' ? `
      <circle cx="0" cy="-210" r="48" fill="${accentHue}" opacity="0.9"/>
      ${isMajhi ? '<path d="M -45,-240 C -45,-280 45,-280 45,-240 C 55,-220 -55,-220 -45,-240 Z" fill="#E5A65D"/> <polygon points="0,-270 20,-310 35,-265" fill="#C97A2B"/>' : ''}
      ${isMarwari ? '<path d="M -50,-245 Q 0,-290 50,-245 Q 20,-215 -50,-245 Z" fill="#E57A3C"/> <path d="M 25,-260 Q 45,-300 65,-270" stroke="#FFD700" stroke-width="3" fill="none"/>' : ''}
      ${isBangru ? '<path d="M -48,-240 C -50,-275 50,-275 48,-240 Z" fill="#D3D3D3"/>' : ''}
      <path d="M -65,-150 C -45,-165 45,-165 65,-150 L 80,140 L -80,140 Z" fill="${primaryHue}" opacity="0.85"/>
      <path d="M -50,-145 Q -10,-80 20,-30 L 35,140 L 15,140 Q -10,-60 -40,-140 Z" fill="${accentHue}" opacity="0.9"/>
      <rect x="-45" y="140" width="35" height="180" fill="#2E2822"/>
      <rect x="10" y="140" width="35" height="180" fill="#2E2822"/>
      <ellipse cx="-28" cy="325" rx="24" ry="12" fill="${accentHue}"/>
      <ellipse cx="28" cy="325" rx="24" ry="12" fill="${accentHue}"/>
    ` : type === 'costume' ? `
      <path d="M -110,-190 L 110,-190 L 150,-120 L 110,-90 L 90,160 L -90,160 L -110,-90 L -150,-120 Z" fill="${primaryHue}" stroke="${accentHue}" stroke-width="2"/>
      <path d="M 0,-190 L 0,80" stroke="${accentHue}" stroke-width="3" stroke-dasharray="6 3"/>
      <rect x="-85" y="140" width="170" height="18" fill="${accentHue}"/>
      <path d="M -80,160 L 80,160 L 110,320 L -110,320 Z" fill="#23201C" stroke="${accentHue}" stroke-width="1.5"/>
    ` : `
      <circle cx="-140" cy="120" r="30" fill="${accentHue}" opacity="0.8"/>
      <path d="M -160,150 L -120,150 L -110,240 L -170,240 Z" fill="${primaryHue}"/>
      <circle cx="120" cy="130" r="28" fill="${accentHue}" opacity="0.6"/>
      <path d="M 100,160 L 140,160 L 145,240 L 95,240 Z" fill="#3D342A"/>
    `}
  </g>

  <!-- Vignette -->
  <rect width="100%" height="100%" fill="url(#vignette)"/>

  <!-- Cinema Plate Lower Info Header -->
  <g transform="translate(${type === 'scene' ? 60 : 50}, ${height - (type === 'scene' ? 140 : 180)})">
    <rect x="-10" y="-10" width="${width - (type === 'scene' ? 100 : 80)}" height="${type === 'scene' ? 110 : 150}" rx="8" fill="#0D0C0B" fill-opacity="0.88" stroke="${accentHue}" stroke-width="1" stroke-opacity="0.4"/>
    
    <rect x="15" y="15" width="160" height="24" rx="4" fill="${primaryHue}" fill-opacity="0.4" stroke="${accentHue}" stroke-width="0.8"/>
    <text x="95" y="31" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.5" text-anchor="middle">
      ${culture.name.toUpperCase()}
    </text>

    <text x="15" y="66" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="${type === 'scene' ? 22 : 24}" font-weight="700" letter-spacing="0.5">
      ${title}
    </text>

    <text x="15" y="${type === 'scene' ? 88 : 94}" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="13" font-weight="400">
      ${subtitle}
    </text>

    <text x="${width - (type === 'scene' ? 140 : 120)}" y="65" fill="${accentHue}" font-family="monospace" font-size="11" text-anchor="end">
      PROD-SPEC // SEED: ${seed}
    </text>
    <text x="${width - (type === 'scene' ? 140 : 120)}" y="86" fill="#94A3B8" font-family="monospace" font-size="10" text-anchor="end">
      ${spec.model} | ${spec.aspectRatio} | 85mm
    </text>
  </g>
</svg>`;

  // Universal data URI encoding that works natively in both Browser and Node.js without Buffer
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
