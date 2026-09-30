import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DIALECT_REGISTRY } from '../src/data/dialectRegistry';
import { BENCHMARK_SCREENPLAYS } from '../src/data/sampleScreenplays';
import {
  buildBenchmarkExtraction,
  buildPromptSpec,
  detectContradictions,
  generateAdaptationPlan
} from '../src/server/agenticEngine';

console.log('--- RUNNING KATHASETU VERIFICATION TEST SUITE ---');

// Test 1: Ingestion & Scene Order Preservation
const benchmark = BENCHMARK_SCREENPLAYS[0];
const majhiCulture = DIALECT_REGISTRY[0];
const extraction = buildBenchmarkExtraction(benchmark.text, majhiCulture);

assert.strictEqual(extraction.scenes.length, 4, 'Should extract exactly 4 scenes from benchmark screenplay');
assert.strictEqual(extraction.scenes[0].scene_number, 1, 'Scene sequence must start at Scene 1');
assert.strictEqual(extraction.scenes[3].scene_number, 4, 'Scene sequence must end at Scene 4');
console.log('✓ PASS: Ingestion & Scene Order Preservation');

// Test 2: Canonical Entity Normalization (No Duplicate Characters)
const characters = extraction.characters;
assert.strictEqual(characters.length, 4, 'Should normalize character mentions into exactly 4 canonical identities');

const amarChar = characters.find(c => c.id === 'CHAR_AMAR');
assert.ok(amarChar, 'CHAR_AMAR must exist as canonical ID');
assert.ok(amarChar.aliases.includes('David'), 'David must be merged under CHAR_AMAR');
assert.ok(amarChar.aliases.includes('The Elder Son'), 'The Elder Son must be merged under CHAR_AMAR');
assert.ok(amarChar.aliases.includes('A. Singh'), 'A. Singh must be merged under CHAR_AMAR');
console.log('✓ PASS: Canonical Entity Normalization (Aliases merged into CHAR_AMAR)');

// Test 3: Costume Variant Plan Integrity
const costumes = extraction.costumes;
assert.ok(costumes.length >= 4, 'Should register unique costume variants');
const amarCostumes = costumes.filter(c => c.characterId === 'CHAR_AMAR');
assert.strictEqual(amarCostumes.length, 2, 'Amar must have distinct travel and domestic costume variants');
assert.deepStrictEqual(amarCostumes[0].scenesAppearing, ['SC01', 'SC02'], 'COST_AMAR_01 must appear in Scenes 1 & 2');
assert.deepStrictEqual(amarCostumes[1].scenesAppearing, ['SC03', 'SC04'], 'COST_AMAR_02 must appear in Scenes 3 & 4');
console.log('✓ PASS: Costume Variant Plan & Reusability');

// Test 4: Physical Contradiction & Prop Audit
const contradictions = detectContradictions(
  extraction.scenes,
  extraction.characters,
  extraction.props,
  extraction.costumes
);
assert.ok(contradictions.length > 0, 'Contradiction engine must flag unhandled prop transition from Scene 2 to 3');
const deedWarning = contradictions.find(c => c.type === 'PROP_DISAPPEARANCE');
assert.ok(deedWarning, 'Should catch PROP_DISAPPEARANCE');
assert.ok(deedWarning.affectedScenes.includes('SC02') && deedWarning.affectedScenes.includes('SC03'), 'Affected scenes must be SC02 and SC03');
console.log('✓ PASS: Physical Contradiction & Prop Traceability Engine');

// Test 5: Cultural Adaptation Plan & Guardrails
const plan = generateAdaptationPlan(majhiCulture, majhiCulture.region, 'rural', 'latin', characters);
assert.strictEqual(plan.cultureId, 'punjab_majhi');
assert.ok(plan.verbalAdaptationStrategy.kinshipAndHonorifics.length > 10, 'Must include specific kinship rules');
assert.ok(plan.nonVerbalAdaptationStrategy.seatingAndSpatialHierarchy.length > 10, 'Must include spatial seating rules');
assert.strictEqual(plan.characterAdaptationMap.length, 4, 'Must adapt all 4 canonical characters');
console.log('✓ PASS: Cultural Adaptation Plan & Guardrails');

// Test 6: Prompt Specification Reproducibility
const promptSpec = buildPromptSpec('character', 'Amarjit Singh', majhiCulture, {
  role: 'Elder Son',
  age: 34
});
assert.strictEqual(promptSpec.model, 'gemini-3.1-flash-lite-image');
assert.ok(promptSpec.positivePrompt.includes('Majha') || promptSpec.positivePrompt.includes('Majhi'));
assert.ok(promptSpec.negativePrompt.includes('Bollywood'));
assert.strictEqual(typeof promptSpec.seed, 'number');
console.log('✓ PASS: Prompt Specification Reproducibility Spec');

console.log('\n======================================================');
console.log('ALL 6 AUTOMATED VERIFICATION TESTS PASSED WITH 100% SUCCESS!');
console.log('======================================================\n');
