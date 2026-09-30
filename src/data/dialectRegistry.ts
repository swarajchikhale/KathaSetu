import { DialectOption } from '../types/adaptation';

export const DIALECT_REGISTRY: DialectOption[] = [
  {
    id: 'punjab_majhi',
    name: 'Majhi (ਮਾਝੀ / माझी)',
    region: 'Majha Belt (Amritsar, Tarn Taran, Gurdaspur)',
    state: 'Punjab',
    description: 'The foundational dialect of Central Punjab. Renowned for rich tonality, resonant stress patterns, candid hospitality, and agrarian prestige.',
    linguisticTraits: "Use of \\\"paye aan\\\" continuous aspect, aspirated tone replaces 'h' in medial position (ਘ, ਝ, ਢ, ਧ, ਭ voiced aspirates turned to tones), distinct possessives like \\\"Aapna\\\", \\\"Tuhada\\\", \\\"Sadda\\\", vocabulary like \\\"Aithe\\\" (here), \\\"Kardiyan paye aan\\\", \\\"Ki karda ae\\\".",
    kinshipTerms: {
      father: 'Bapu Ji / Pitaji',
      mother: 'Bebe / Mata Ji',
      elder_brother: 'Veerji / Bhau',
      younger_brother: 'Nikke / Chhotu',
      paternal_uncle: 'Chacha Ji / Taya Ji',
      maternal_uncle: 'Mama Ji',
      elder_sister: 'Bhabhi Ji / Bhenji',
      elder_in_law: 'Bazurg'
    },
    culturalAnchors: {
      architecture: 'Baked Nanakshahi brick Haveli, expansive open courtyard (Vehra) with central neem tree, wide entrance archway (Deori), raised Baithak with Manjas (charpai) woven with munj rope, brass lotas on a wooden ledge.',
      textiles: 'Heavy handspun Khaddar, Phulkari embroidered shawls with geometric silken pat threads, starch-crisp Turbans (Pagg with sharp Shamla/Turla), Kurta-Chadra or Kurta-Pajama with mustard-oil softened Desi Jutti.',
      food: 'Sarson da Saag churned with madhani, Makki di Roti cooked on mud chulha, hand-churned white butter (Makhan), tall brass glasses of lassi, gur (jaggery) cubes on a brass thali.',
      rituals: 'Formal Ardas before land decisions, touching knees with both cupped hands when greeting elders, presenting sweet warm milk in Kansa bowls as unconditional hospitality, tying ceremonial Kada.',
      socialDynamics: 'Hyper-protective of familial honor (Izzat), land (Zameen) seen as sacred ancestral mother, candor favored over evasive polite deference, emotional clashes expressed through vocal directness and sudden solemn pauses.'
    },
    sampleGreeting: 'Sat Sri Akaal ji, Bhau! Aao aao baitho manje te.'
  },
  {
    id: 'punjab_malwai',
    name: 'Malwai (ਮਲਵਈ / मलवई)',
    region: 'Malwa Belt (Bathinda, Mansa, Sangrur, Faridkot)',
    state: 'Punjab',
    description: 'The southern Punjab dialect of the fertile cotton-and-canal tract. Marked by distinct phonological shifts, elongated vowels, and deep folk ballads.',
    linguisticTraits: 'Vowel shifting (o -> au, e -> ae), unique verb endings ("karde si" -> "karde ti"), use of "Bapu", "Lalle-bhabhe", "Bhai", "Nhi-o" with extended cadence.',
    kinshipTerms: {
      father: 'Bapu / Chacha',
      mother: 'Maa / Bhabo',
      elder_brother: 'Bhai / Bada Bhai',
      younger_brother: 'Kaka / Nikki',
      paternal_uncle: 'Taya / Chacha',
      maternal_uncle: 'Mama Ji',
      elder_sister: 'Didi / Behan',
      elder_in_law: 'Bapuji'
    },
    culturalAnchors: {
      architecture: 'Canal-adjacent brick homesteads, tractor sheds dominated by Massey Ferguson or Swaraj tractors, flat earthen roofs for drying red chillies and cotton, expansive Baithak with brass hukkah corners.',
      textiles: 'Coarse cotton Kurtas, simple round-wound Pagri without excessive turla, hand-loomed Khes blankets with diamond weaves, sturdy leather mojris suited for canal dirt paths.',
      food: 'Bajra khichdi with fresh ghee, thick tandoori rotis, whole raw onions crushed by fist, dried curd cakes (Wadiyan), spiced buttermilk.',
      rituals: 'Gathering at the village canal bridge (Pull) or tube-well (Motor) for disputes, Panchayat deliberations under peepal trees, offering tea in steel tumblers with overflowing foam.',
      socialDynamics: 'Fiercely egalitarian amongst peers, stubborn agrarian resilience against debt and drought, pride in hard physical labor, subtle dry humor during tense negotiations.'
    },
    sampleGreeting: 'Sat Sri Akaal Bapu, kiven o? Aapan motor vall gaddi mod layiye?'
  },
  {
    id: 'haryana_bangru',
    name: 'Bangru / Haryanvi (बाँगडू / हरियाणवी)',
    region: 'Deswali / Bangar Belt (Rohtak, Jhajjar, Sonipat, Jind)',
    state: 'Haryana',
    description: 'The direct, unapologetic dialect of the Haryana plains. Noted for sharp phonetic strikes, rich proverbs, hookah councils, and deep community kinship.',
    linguisticTraits: 'Use of "sae" / "sai" (is/are), "kadde" (when), "kit" (where), "kukar" (how), "maane" (us/me), sharp glottal stops, absence of excessive honorific euphemisms.',
    kinshipTerms: {
      father: 'Babu / Bapu',
      mother: 'Maa / Tai',
      elder_brother: 'Bada Bhai / Dada',
      younger_brother: 'Chhora / Nikkiya',
      paternal_uncle: 'Tau (elder) / Kaka (younger)',
      maternal_uncle: 'Mama',
      elder_sister: 'Jiji',
      elder_in_law: 'Chaudhary Sahab / Tau'
    },
    culturalAnchors: {
      architecture: 'Solid whitewashed brick Gher with heavy iron-bolted wooden gate, communal Chopal with carved pillars, open cowshed (Neem-shaded bara) with Murrah buffaloes, copper Hookah resting on cowdung-cake ashes.',
      textiles: 'Pure white Khadi Dhoti-Kurta, loosely wrapped Khandwa or Paggar with side drape, women in heavy 52-kali Daman skirt, Kurti, and Chunder with silver gotta work, silver Hansli neckbands.',
      food: 'Kachri ki sabzi, thick Bejar roti (gram + barley flour) roasted directly on coals, bowls of fresh white Makkhan (Tindi ghee), hand-crushed garlic chutney in stone sil-batta.',
      rituals: 'Hookah rotation (Gudgudi) signifying collective consensus and caste brotherhood (Bhaichara), tapping the bamboo lathi on ground during firm declarations.',
      socialDynamics: 'High honesty threshold: direct language is sign of respect and integrity, politeness can be interpreted as deception; clan elders (Tau) command unquestioned obedience in land arbitrations.'
    },
    sampleGreeting: 'Ram Ram Tau! Kit chaal pade tussi subah-subah? Hookah to peete jao!'
  },
  {
    id: 'rajasthan_marwari',
    name: 'Marwari (मारवाड़ी)',
    region: 'Marwar Belt (Jodhpur, Nagaur, Bikaner, Pali)',
    state: 'Rajasthan',
    description: 'The classical desert dialect of western Rajasthan. Distinguished by aristocratic formality, layered courtly honorifics, Thar desert resilience, and strict social hierarchy.',
    linguisticTraits: "Use of \\\"Hukum\\\" as constant respectful suffix, \\\"Mhare\\\" (mine), \\\"Thare\\\" (yours), \\\"Kaikar\\\" (how/why), \\\"Chhe / Hai\\\" auxiliary verbs, soft 's' shifted to 'h' in archaic forms.",
    kinshipTerms: {
      father: 'Bhabhasa / Hukum / Kakosa',
      mother: 'Maji Sa / Bhabhi Sa',
      elder_brother: 'Bhabhasa / Hukum Veer',
      younger_brother: 'Banna / Chhotu',
      paternal_uncle: 'Kakosa / Hukuma',
      maternal_uncle: 'Mamosa',
      elder_sister: 'Bai Sa',
      elder_in_law: 'Thakur Sahab / Hukum'
    },
    culturalAnchors: {
      architecture: 'Carved yellow Jaisalmer or red Jodhpur sandstone Haveli, intricate lattice Jharokhas (balconies) casting delicate shadow patterns, sunken central Chowk with stepped water cistern (Tanka), low wooden floor-cushions (Gaddis) with cylindrical bolsters.',
      textiles: 'Vibrant saffron or multi-colored Bandhani / Leheriya Pagri (Safa) tied with precision, linen Angrakha tied with side ribbons, Churidar pyjama, women in Chaniya Choli with Borla forehead jewel and sheer Odhna held in Ghoonghat.',
      food: 'Ker Sangri berry curry cooked in mustard oil and dried mango powder, Bajra rotla smeared with Ghee, spicy Gatte ki Sabzi, dried red Mathania chillies, sweetened churned Chaas.',
      rituals: 'Touching dust at elders feet followed by touching one\'s own eyes, serving water in a chilled copper Katori placed on a silver salver, formal welcoming with opium tincture (Afeem manuwar) in ceremonial legacy contexts.',
      socialDynamics: 'Deep emotional restraint; true conflict is never screamed, but delivered through icy politeness, allegorical proverbs, and strict deference to hereditary lineage.'
    },
    sampleGreeting: 'Khamma Ghani Hukum! Thare ghare padharo, mhara saubhagya.'
  },
  {
    id: 'rajasthan_mewari',
    name: 'Mewari (मेवाड़ी)',
    region: 'Mewar Belt (Udaipur, Chittorgarh, Rajsamand, Bhilwara)',
    state: 'Rajasthan',
    description: 'The proud hilly dialect of south-central Rajasthan. Marked by martial heritage, lake and granite valley topography, and ancient Sisodia cultural pride.',
    linguisticTraits: 'Distinct lexical items like "Aapre" (yours), "Kathe chalya" (where did you go), "Ho / Chho", strong dental consonants, heroic balladic cadence.',
    kinshipTerms: {
      father: 'Bhabhasa / Datasa',
      mother: 'Maji Sa',
      elder_brother: 'Bhaiji Sa',
      younger_brother: 'Banna',
      paternal_uncle: 'Kakasa',
      maternal_uncle: 'Mamasa',
      elder_sister: 'Baisa',
      elder_in_law: 'Rawat Ji / Hukum'
    },
    culturalAnchors: {
      architecture: 'Granite and marble lakeside Thikana courtyards, whitewashed stucco walls with blue and green elephant frescoes (Chitrashala), scalloped marble arches, brass Toran hanging above carved doorway.',
      textiles: 'Distinct Mewari Pagri (flatter, folded tight with red or green band), cotton Angarakhi with tight chest fitting, silver Talwar scabbard buckle, women in silk Poshak with Zari borders.',
      food: 'Mewari Dal Baati Churma cooked over dried cowdung coals, spicy Laal Maas or Gatte with wild herbs, roasted Makki ki Rabdi, fresh mawa pedas.',
      rituals: 'Saluting with "Jai Eklingji Ki", offering holy water from sacred lake shrines, bowing before ancestral sword display in family temple niche.',
      socialDynamics: 'Uncompromising adherence to vows (Pran), historical defiance, family consensus arbitrated by matrilineal maternal head behind the screen.'
    },
    sampleGreeting: 'Jai Eklingji Ki Sa! Kathe padhariya chho aapre daure te?'
  },
  {
    id: 'up_awadhi',
    name: 'Awadhi (अवधी)',
    region: 'Awadh Belt (Lucknow, Ayodhya, Barabanki, Rae Bareli rural fringe)',
    state: 'Uttar Pradesh',
    description: 'The literary and emotive tongue of the Gangetic plains. Blends delicate Ganga-Jamuni etiquette, poetic cadence, nuanced subtext, and agrarian warmth.',
    linguisticTraits: 'Use of "hum" for self (first person singular/plural), verbal forms ending in -is, -in ("kare rahein", "batais"), "ka hoat hai", rich proverbs from Tulsidas tradition.',
    kinshipTerms: {
      father: 'Bapu / Babuji',
      mother: 'Amma / Maiya',
      elder_brother: 'Bhaiya / Barhe Bhaiya',
      younger_brother: 'Lalla / Babua',
      paternal_uncle: 'Chachaji / Kaka',
      maternal_uncle: 'Mamaji',
      elder_sister: 'Didi / Bahina',
      elder_in_law: 'Panditji / Thakur Sahab'
    },
    culturalAnchors: {
      architecture: 'Clay-tiled veranda (Dalan) supported by carved wooden posts, brick courtyard with Tulsi chaura at the center, brass hanging lamps, store-room with clay granaries (Kothila).',
      textiles: 'Fine Lucknowi Chikankari embroidered muslin kurta, checked cotton Gamcha slung over left shoulder, leather Nagra shoes, women in Chanderi cotton sarees with red border.',
      food: 'Tehri with new winter potatoes and cauliflower, hot Kachauri with pumpkin subzi, freshly made sweet Gulab Jamun, Paan served from silver Khasdan.',
      rituals: 'Touching feet with right hand while saying "Pailagi", offering betel leaf (Paan) as seal of hospitality, recital of Chaupais during moral family crises.',
      socialDynamics: 'High poetic sensitivity; insults are never crude, but wrapped in sweetest formal hyperbole; complex family debts repaid with dignified silence.'
    },
    sampleGreeting: 'Pailagi Amma! Hum abhi abhi khet se laute hain, bhaiya ka kavan sandes aawa?'
  },
  {
    id: 'bihar_maithili',
    name: 'Maithili (मैथिली / মৈথিলী)',
    region: 'Mithila Belt (Darbhanga, Madhubani, Samastipur)',
    state: 'Bihar',
    description: 'The ancient, intellectual, and artistically revered tongue of Mithila. Famous for four distinct honorific tiers, Madhubani paintings, and matrilineal warmth.',
    linguisticTraits: 'Extreme honorific precision with verb conjugations changing based on subject and object honorifics (Ahan, Apne, O), ending verbs with -aichh / -aith ("kaha jaichhi").',
    kinshipTerms: {
      father: 'Pitaji / Babuji',
      mother: 'Dai / Mayi',
      elder_brother: 'Bor-Bhaiya',
      younger_brother: 'Babu',
      paternal_uncle: 'Kaka',
      maternal_uncle: 'Mamo',
      elder_sister: 'Didi',
      elder_in_law: 'Jeth-ji / Pandiji'
    },
    culturalAnchors: {
      architecture: 'Mud-plastered walls adorned with vibrant Kohbar and Madhubani murals (fishes, lotus, peacocks), thatched or tiled Baithaka, shaded pond (Pokhari) lined with bamboo groves.',
      textiles: 'Pure white Tussar silk Dhoti with red borders, Paag headgear (auspicious red or yellow ceremonial headpiece), women in Madhubani hand-painted cotton sarees with silver payal.',
      food: 'Rohu Machh-Bhaat (fish and rice curry with mustard paste), Ol ki Chutney (elephant foot yam), tender Makhana kheer cooked with green cardamoms.',
      rituals: 'Presenting Paag and sacred Betel nut (Supari) upon arrival, drawing Aripan (rice flour floor diagrams) at door sill, seeking blessings with folded palm touching temple.',
      socialDynamics: 'Scholarly debate preferred over physical bravado; deep matrilineal respect where maternal uncles and grandmothers wield final moral veto.'
    },
    sampleGreeting: 'Pranam Apne ke! Ahan aayi dware par padharal, Mithila dhanya bhel.'
  }
];
