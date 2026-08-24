import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const pageUrl = new URL('../../pages/programs/PrimarySchool.tsx', import.meta.url);
const referenceStoryUrl = new URL('./PrimaryReferenceStory.tsx', import.meta.url);
const referenceStoryDataUrl = new URL('./referenceStoryData.ts', import.meta.url);
const foundationUrl = new URL('./FoundationSection.tsx', import.meta.url);
const foundationCurriculumUrl = new URL('./FoundationCurriculum.tsx', import.meta.url);
const howWeTeachUrl = new URL('./HowWeTeach.tsx', import.meta.url);
const growthUrl = new URL('./GrowthSection.tsx', import.meta.url);
const growthCurriculumUrl = new URL('./GrowthCurriculum.tsx', import.meta.url);
const masteryUrl = new URL('./MasterySection.tsx', import.meta.url);
const masteryCurriculumUrl = new URL('./MasteryCurriculum.tsx', import.meta.url);
const aquariumUrl = new URL('./PrimaryAquarium.tsx', import.meta.url);
const aquariumDataUrl = new URL('./primaryStoryData.ts', import.meta.url);
const aquariumEngineUrl = new URL('./useAquariumEngine.ts', import.meta.url);
const aquariumFactCardUrl = new URL('./AquariumFactCard.tsx', import.meta.url);
const primaryReferenceCssUrl = new URL('./primary-reference.css', import.meta.url);

test('Primary reference story keeps the approved ten-section sequence after the preserved hero', () => {
  assert.equal(existsSync(referenceStoryUrl), true, 'PrimaryReferenceStory must exist');
  assert.equal(existsSync(referenceStoryDataUrl), true, 'reference story data must exist');

  const source = readFileSync(referenceStoryUrl, 'utf8');
  const pageSource = readFileSync(pageUrl, 'utf8');
  const ordered = [
    '<FoundationSection',
    '<FoundationCurriculum',
    '<HowWeTeach',
    '<GrowthSection',
    '<GrowthCurriculum',
    '<MasterySection',
    '<MasteryCurriculum',
    '<ProgramBag',
    '<FamilyReasons',
    '<PrimaryJourneyOutro',
  ];

  ordered.reduce((cursor, marker) => {
    const next = source.indexOf(marker);
    assert.ok(next > cursor, `${marker} must follow the previous section`);
    return next;
  }, -1);

  assert.match(pageSource, /<SubjectHero[\s\S]*<PrimaryReferenceStory/);
  assert.match(pageSource, /exploreTargetId="pathway"/);
  assert.doesNotMatch(pageSource, /Primary(?:Aquarium|JourneyLayer|JourneyOutro)/);
  assert.match(readFileSync(referenceStoryDataUrl, 'utf8'), /as const satisfies/);
});

test('story slots expose approved copy as semantic HTML rather than implementation artifacts', () => {
  const source = [referenceStoryUrl, foundationUrl, howWeTeachUrl, growthUrl, masteryUrl]
    .filter((url) => existsSync(url))
    .map((url) => readFileSync(url, 'utf8'))
    .join('\n');

  assert.match(source, /Strong foundations shape everything that follows\./);
  assert.match(source, /Growing skills\. Building independence\./);
  assert.match(source, /Ready for what comes next\./);
  assert.match(source, /Why families choose DA\./);
  assert.match(source, /A clear path\. Every step matters\./);
  assert.doesNotMatch(source, /\.alt\.toLowerCase\(\)/);
  assert.doesNotMatch(source, /referenceStoryAssets\.closingLandscape/);
});

test('Years 1–2 foundations present all four outcomes without turning them into cards', () => {
  assert.equal(existsSync(foundationUrl), true, 'FoundationSection must exist');
  const source = `${readFileSync(foundationUrl, 'utf8')}\n${readFileSync(referenceStoryDataUrl, 'utf8')}`;

  [
    'Core reading and number skills',
    'Confidence through small wins',
    'Individual attention every lesson',
    'Loved by parents for real results',
  ].forEach((label) => assert.match(source, new RegExp(label)));

  assert.match(source, /stagePhotos\.foundation/);
  assert.match(source, /foundationOutcomes\.map/);
  assert.doesNotMatch(source, /Card/);
});

test('Years 1–2 curriculum preserves the complete interactive aquarium', () => {
  assert.equal(existsSync(foundationCurriculumUrl), true, 'FoundationCurriculum must exist');
  assert.equal(existsSync(aquariumUrl), true, 'PrimaryAquarium must exist');
  assert.equal(existsSync(aquariumDataUrl), true, 'aquarium data must exist');
  assert.equal(existsSync(aquariumEngineUrl), true, 'aquarium engine must exist');

  const curriculum = readFileSync(foundationCurriculumUrl, 'utf8');
  const aquarium = readFileSync(aquariumUrl, 'utf8');
  const aquariumData = readFileSync(aquariumDataUrl, 'utf8');
  const engine = readFileSync(aquariumEngineUrl, 'utf8');

  assert.match(curriculum, /<PrimaryAquarium/);
  assert.equal((aquariumData.match(/id: '/g) ?? []).length, 7);
  assert.match(aquarium, /aquariumFish\.map/);
  assert.match(aquarium, /<button/);
  assert.match(aquarium, /aria-label=\{`Show fun fact about \$\{fish\.label\}`\}/);
  assert.match(aquarium, /primary-aquarium__progress/);
  assert.match(aquarium, /\/primary-reference\/aquarium\/water-background\.png/);
  assert.match(aquariumData, /\/primary-reference\/aquarium\/fish\/clownfish\.png/);
  assert.match(engine, /pointermove/);
  assert.match(engine, /ripplesRef/);
  assert.match(engine, /bubblePoolRef/);
  assert.match(engine, /prefers-reduced-motion/);
  assert.match(engine, /visibilityObserver/);
  assert.match(engine, /app\.ticker\.stop\(\)/);
  assert.match(engine, /app\.ticker\.start\(\)/);
});

test('How We Teach renders four authentic DA photo moments from typed story data', () => {
  assert.equal(existsSync(howWeTeachUrl), true, 'HowWeTeach must exist');
  const source = readFileSync(howWeTeachUrl, 'utf8');
  const storyData = readFileSync(referenceStoryDataUrl, 'utf8');

  assert.match(source, /teachingSteps\.map/);
  assert.match(source, /<figure/);
  assert.match(source, /src=\{step\.photo\.src\}/);
  assert.match(source, /alt=\{step\.photo\.alt\}/);
  assert.equal((storyData.match(/number: '0[1-4]'/g) ?? []).length >= 8, true);
});

test('Years 3–4 renders the complete growth story from typed outcomes and an authentic group photo', () => {
  assert.equal(existsSync(growthUrl), true, 'GrowthSection must exist');
  assert.equal(existsSync(growthCurriculumUrl), true, 'GrowthCurriculum must exist');

  const story = readFileSync(referenceStoryUrl, 'utf8');
  const growth = readFileSync(growthUrl, 'utf8');
  const curriculum = readFileSync(growthCurriculumUrl, 'utf8');
  const data = readFileSync(referenceStoryDataUrl, 'utf8');
  const source = `${growth}\n${curriculum}\n${data}`;

  assert.match(story, /import GrowthSection from '\.\/GrowthSection'/);
  assert.match(story, /import GrowthCurriculum from '\.\/GrowthCurriculum'/);
  assert.match(growth, /growthOutcomes\.map/);
  assert.match(growth, /stagePhotos\.growth/);
  assert.match(growth, /<figure/);
  assert.match(growth, /loading="lazy"/);
  assert.match(growth, /decoding="async"/);
  assert.match(curriculum, /curriculumBands\.growth/);
  assert.match(curriculum, /curriculum\.items\.map/);
  [
    'Growing skills. Building independence.',
    'Independence and responsibility',
    'Stronger thinking and problem solving',
    'Collaborative learning',
    'NAPLAN readiness',
    'Reading to learn through comprehension and inference',
    'Narrative and informative writing with language conventions',
    'NAPLAN-aligned numeracy, data and multi-step problem solving',
    '/images/community/tutor_mentor_girls.jpg',
    '/primary-reference/decor/growth-crayon-set.png',
  ].forEach((copy) => assert.ok(source.includes(copy), `growth story must include ${copy}`));
  assert.doesNotMatch(source, /Card/);
});

test('Years 5–6 remains complete at every breakpoint with four outcomes, curriculum and classroom photography', () => {
  assert.equal(existsSync(masteryUrl), true, 'MasterySection must exist');
  assert.equal(existsSync(masteryCurriculumUrl), true, 'MasteryCurriculum must exist');

  const story = readFileSync(referenceStoryUrl, 'utf8');
  const mastery = readFileSync(masteryUrl, 'utf8');
  const curriculum = readFileSync(masteryCurriculumUrl, 'utf8');
  const data = readFileSync(referenceStoryDataUrl, 'utf8');
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');
  const source = `${mastery}\n${curriculum}\n${data}`;

  assert.match(story, /import MasterySection from '\.\/MasterySection'/);
  assert.match(story, /import MasteryCurriculum from '\.\/MasteryCurriculum'/);
  assert.match(mastery, /masteryOutcomes\.map/);
  assert.match(mastery, /stagePhotos\.mastery/);
  assert.match(mastery, /<figure/);
  assert.match(mastery, /loading="lazy"/);
  assert.match(mastery, /decoding="async"/);
  assert.match(curriculum, /curriculumBands\.mastery/);
  assert.match(curriculum, /curriculum\.items\.map/);
  [
    'Ready for what comes next.',
    'Advanced literacy & comprehension',
    'Mathematical reasoning & problem solving',
    'Independent study & organisation',
    'High school readiness',
    'Persuasive and narrative writing at a high level',
    'Selective-school reasoning, speed and accuracy',
    'Independent study habits, organisation and Year 7 preparation',
    '/images/community/0X1A7290.jpeg',
    '/primary-reference/decor/mastery-crayon-set.png',
  ].forEach((copy) => assert.ok(source.includes(copy), `mastery story must include ${copy}`));
  assert.doesNotMatch(styles, /\.primary-reference-mastery[^,{]*\{[^}]*display:\s*none/s);
  assert.doesNotMatch(source, /Card/);
});

test('aquarium initialization is single-flight and cancellation-safe across asynchronous setup', () => {
  const engine = readFileSync(aquariumEngineUrl, 'utf8');

  assert.match(engine, /let initializing = false/);
  assert.match(engine, /initializing \|\| dispose/);
  assert.match(engine, /initializing = true/);
  assert.ok((engine.match(/if \(cancelled\)/g) ?? []).length >= 3, 'cancellation must be checked after substantial awaits');
  assert.match(engine, /catch \(error\)/);
  assert.match(engine, /destroyAquariumApp/);
});

test('aquarium resize keeps cover layers, fish sprites, and hit targets aligned', () => {
  const engine = readFileSync(aquariumEngineUrl, 'utf8');

  assert.match(engine, /ResizeObserver/);
  assert.match(engine, /resizeFishMotion/);
  assert.match(engine, /coverSprite/);
  assert.match(engine, /updateFishButton/);
});

test('aquarium fallbacks load below-fold and stop compositor work after Pixi takes over', () => {
  const aquarium = readFileSync(aquariumUrl, 'utf8');
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');

  assert.ok((aquarium.match(/loading="lazy"/g) ?? []).length >= 6);
  assert.ok((aquarium.match(/decoding="async"/g) ?? []).length >= 6);
  assert.match(styles, /\.primary-aquarium\.is-pixi-ready \.primary-aquarium__bubbles[\s\S]*animation:\s*none/);
  assert.match(styles, /\.primary-aquarium\.is-pixi-ready \.primary-aquarium__sprite[\s\S]*animation:\s*none/);
  assert.match(styles, /visibility:\s*hidden/);
});

test('reduced-motion fact transitions are immediate on entrance and exit', () => {
  const source = readFileSync(aquariumFactCardUrl, 'utf8');

  assert.match(source, /exit=\{reducedMotion \? \{ opacity: 0 \}/);
  assert.match(source, /transition=\{\{ duration: reducedMotion \? 0/);
  assert.doesNotMatch(source, /exit=\{\{ opacity: 0, y: 8 \}\}/);
});
