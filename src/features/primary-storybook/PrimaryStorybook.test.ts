import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const pageUrl = new URL('../../pages/programs/PrimarySchool.tsx', import.meta.url);
const referenceStoryUrl = new URL('./PrimaryReferenceStory.tsx', import.meta.url);
const referenceStoryDataUrl = new URL('./referenceStoryData.ts', import.meta.url);
const foundationUrl = new URL('./FoundationSection.tsx', import.meta.url);
const foundationCurriculumUrl = new URL('./FoundationCurriculum.tsx', import.meta.url);
const howWeTeachUrl = new URL('./HowWeTeach.tsx', import.meta.url);
const supportJourneyUrl = new URL('./SupportJourney.tsx', import.meta.url);
const growthUrl = new URL('./GrowthSection.tsx', import.meta.url);
const growthCurriculumUrl = new URL('./GrowthCurriculum.tsx', import.meta.url);
const masteryUrl = new URL('./MasterySection.tsx', import.meta.url);
const masteryCurriculumUrl = new URL('./MasteryCurriculum.tsx', import.meta.url);
const aquariumUrl = new URL('./PrimaryAquarium.tsx', import.meta.url);
const aquariumDataUrl = new URL('./primaryStoryData.ts', import.meta.url);
const aquariumEngineUrl = new URL('./useAquariumEngine.ts', import.meta.url);
const aquariumFactCardUrl = new URL('./AquariumFactCard.tsx', import.meta.url);
const programBagUrl = new URL('./ProgramBag.tsx', import.meta.url);
const familyReasonsUrl = new URL('./FamilyReasons.tsx', import.meta.url);
const sampleResourcesUrl = new URL('./PrimarySampleResources.tsx', import.meta.url);
const outroUrl = new URL('./PrimaryJourneyOutro.tsx', import.meta.url);
const referenceMotionUrl = new URL('./usePrimaryReferenceMotion.ts', import.meta.url);
const storyConnectorsUrl = new URL('./StoryConnectors.tsx', import.meta.url);
const primaryReferenceCssUrl = new URL('./primary-reference.css', import.meta.url);

test('Primary reference story keeps all year-group chapters together before enrichment sections', () => {
  assert.equal(existsSync(referenceStoryUrl), true, 'PrimaryReferenceStory must exist');
  assert.equal(existsSync(referenceStoryDataUrl), true, 'reference story data must exist');

  const source = readFileSync(referenceStoryUrl, 'utf8');
  const pageSource = readFileSync(pageUrl, 'utf8');
  const ordered = [
    '<FoundationSection',
    '<FoundationCurriculum',
    '<GrowthSection',
    '<GrowthCurriculum',
    '<MasterySection',
    '<MasteryCurriculum',
    '<SeedTreeChallenge',
    '<HowWeTeach',
    '<ProgramBag',
    '<FamilyReasons',
    '<PrimarySampleResources',
    '<PrimaryJourneyOutro',
  ];

  ordered.reduce((cursor, marker) => {
    const next = source.indexOf(marker);
    assert.ok(next > cursor, `${marker} must follow the previous section`);
    return next;
  }, -1);

  assert.match(pageSource, /<PrimaryHero[\s\S]*<PrimaryReferenceStory/);
  assert.match(pageSource, /href="#primary-page-content"/);
  assert.doesNotMatch(pageSource, /Primary(?:Aquarium|JourneyLayer|JourneyOutro)/);
  assert.match(readFileSync(referenceStoryDataUrl, 'utf8'), /as const satisfies/);
});

test('the Primary proof section previews learning and progress without fabricated document content', () => {
  assert.equal(existsSync(sampleResourcesUrl), true, 'PrimarySampleResources must exist');

  const story = readFileSync(referenceStoryUrl, 'utf8');
  const source = readFileSync(sampleResourcesUrl, 'utf8');

  assert.match(story, /<FamilyReasons\s*\/>\s*<PrimarySampleResources\s*\/>\s*<PrimaryJourneyOutro\s*\/>/);
  [
    'A CLOSER LOOK',
    'Don’t just take our word for it.',
    'See what learning looks like.',
    'Their learning.',
    'Their progress.',
    'SAMPLE STUDENT WORK',
    'SAMPLE PARENT REPORT',
    '3-page PDF preview',
    'PDF report preview',
    'Learning you can see.',
    'Progress you can follow.',
  ].forEach((copy) => assert.ok(source.includes(copy), `sample resources must include ${copy}`));

  assert.match(source, /studentBookletPdf/);
  assert.match(source, /parentReportPdf/);
  assert.match(source, /\/assets\/primary\/sample-booklet\.pdf/);
  assert.match(source, /\/assets\/primary\/sample-report\.pdf/);
  assert.doesNotMatch(source, /PDF preview coming soon/);
  assert.match(source, /showModal\(\)/);
  assert.match(source, /onCancel/);
  assert.match(source, /event\.key !== 'Tab'/);
  assert.match(source, /event\.key === 'Escape'/);
  assert.match(source, /<iframe/);
  assert.match(source, /aria-modal="true"/);
});

test('story slots expose approved copy as semantic HTML rather than implementation artifacts', () => {
  const source = [referenceStoryUrl, foundationUrl, howWeTeachUrl, growthUrl, masteryUrl, familyReasonsUrl, outroUrl]
    .filter((url) => existsSync(url))
    .map((url) => readFileSync(url, 'utf8'))
    .join('\n');

  assert.match(source, /Strong foundations shape everything that follows\./);
  assert.match(source, /Growing skills\. Building independence\./);
  assert.match(source, /Ready for what comes next\./);
  assert.match(source, /Why families choose DA\./);
  assert.match(source, /A clear path\. Every step matters\./);
  assert.doesNotMatch(source, /\.alt\.toLowerCase\(\)/);
  assert.doesNotMatch(source, /<h2[^>]*>\{?referenceStoryAssets\.closingLandscape/);
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
  assert.match(source, /\/images\/community\/primary-foundation-framed\.png/);
  assert.match(source, /foundationLeftDecor/);
  assert.match(source, /foundationOutcomeDecor/);
  assert.match(source, /primary-reference-foundation__outcome-icon/);
  assert.match(source, /foundationOutcomes\.map/);
  assert.doesNotMatch(source, /Card/);
});

test('Years 1–2 curriculum is followed by Years 3–4, Years 5–6 and the seed challenge', () => {
  assert.equal(existsSync(foundationCurriculumUrl), true, 'FoundationCurriculum must exist');
  assert.equal(existsSync(aquariumUrl), true, 'PrimaryAquarium must exist');
  assert.equal(existsSync(aquariumDataUrl), true, 'aquarium data must exist');
  assert.equal(existsSync(aquariumEngineUrl), true, 'aquarium engine must exist');

  const curriculum = readFileSync(foundationCurriculumUrl, 'utf8');
  const aquarium = readFileSync(aquariumUrl, 'utf8');
  const aquariumData = readFileSync(aquariumDataUrl, 'utf8');
  const engine = readFileSync(aquariumEngineUrl, 'utf8');
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');
  const story = readFileSync(referenceStoryUrl, 'utf8');

  assert.doesNotMatch(curriculum, /<PrimaryAquarium/);
  assert.match(story, /<FoundationCurriculum\s*\/>[\s\S]*?<GrowthSection\s*\/>\s*<GrowthCurriculum\s*\/>\s*<MasterySection\s*\/>\s*<MasteryCurriculum\s*\/>\s*<SeedTreeChallenge\s*\/>\s*<SupportJourney\s*\/>\s*<HowWeTeach/);
  assert.match(curriculum, /years-1-2-school-scene\.png/);
  assert.match(curriculum, /years-1-2-curriculum-atlas\.png/);
  assert.match(curriculum, /Discover the journey/);
  assert.match(curriculum, /primary-reference-curriculum__row/);
  assert.match(curriculum, /curriculum\.items\.map\(\(item, index\)/);
  assert.match(curriculum, /aria-label={`Explore \$\{item\.title\}`}/);
  assert.equal((aquariumData.match(/id: '/g) ?? []).length, 7);
  assert.match(aquariumData, /aquariumFish:[\s\S]*?\[([\s\S]*?)\];/);
  assert.match(aquariumData, /aquariumBackgroundFish/);
  assert.match(aquarium, /Discover them all/);
  assert.match(aquarium, /discovered\.length === 5/);
  assert.match(aquarium, /window\.setTimeout/);
  assert.match(aquarium, /onDismiss/);
  assert.match(aquarium, /aquariumFish\.map/);
  assert.match(aquarium, /<button/);
  assert.match(aquarium, /aria-label=\{`Show fun fact about \$\{fish\.label\}`\}/);
  assert.match(aquarium, /primary-aquarium__progress/);
  assert.match(aquarium, /\/primary-reference\/aquarium\/reference-tank-background\.png/);
  assert.match(aquarium, /primary-aquarium__moving-waves/);
  assert.match(styles, /@keyframes primary-aquarium-wave-drift/);
  assert.match(styles, /primary-aquarium__moving-waves/);
  assert.match(aquariumData, /\/primary-reference\/aquarium\/fish\/clownfish\.png/);
  assert.match(engine, /pointermove/);
  assert.match(engine, /ripplesRef/);
  assert.match(engine, /bubblePoolRef/);
  assert.match(engine, /prefers-reduced-motion/);
  assert.match(engine, /visibilityObserver/);
  assert.match(engine, /app\.ticker\.stop\(\)/);
  assert.match(engine, /app\.ticker\.start\(\)/);
});

test('How We Teach renders the four supplied transparent teaching composites in order', () => {
  assert.equal(existsSync(howWeTeachUrl), true, 'HowWeTeach must exist');
  const source = readFileSync(howWeTeachUrl, 'utf8');
  const storyData = readFileSync(referenceStoryDataUrl, 'utf8');

  assert.match(source, /teachingSteps\.map/);
  assert.match(source, /<figure/);
  assert.match(source, /data-photo-slot/);
  [
    'teaching-composite-explain.png',
    'teaching-composite-practise.png',
    'teaching-composite-independent.png',
    'teaching-composite-celebrate.png',
  ].forEach((filename) => assert.ok(source.includes(filename), `${filename} must render in its ordered teaching slot`));
  assert.match(source, /<img[\s\S]*?src=\{TEACHING_COMPOSITE_IMAGES\[index\]\}/);
  assert.match(source, /alt=\{step\.title\}/);
  assert.doesNotMatch(source, /teaching-frame-atlas\.png/);
  assert.match(source, /\/primary-reference\/teaching\/teaching-decor-atlas\.png/);
  assert.match(
    readFileSync(primaryReferenceCssUrl, 'utf8'),
    /\.primary-reference-teaching__photo\s*>\s*img\s*\{[\s\S]*?object-fit:\s*contain/,
    'transparent teaching composites must fit without cropping or stretching',
  );
  assert.match(source, /That’s the DA difference/);
  assert.match(source, /Every child\. Every lesson\. Every step forward/);
  assert.equal((storyData.match(/number: '0[1-4]'/g) ?? []).length >= 8, true);
});

test('the support journey follows the seed challenge with both reference-matched sections', () => {
  assert.equal(existsSync(supportJourneyUrl), true, 'SupportJourney must exist');

  const story = readFileSync(referenceStoryUrl, 'utf8');
  const source = readFileSync(supportJourneyUrl, 'utf8');

  assert.match(story, /<SeedTreeChallenge\s*\/>\s*<SupportJourney\s*\/>\s*<HowWeTeach\s*\/>/);
  [
    'We help every child find their place.',
    'Before DA',
    'We find the right support',
    'After DA',
    'Every child starts somewhere. We meet them there.',
    'Behind → Foundations',
    'On track → Consolidate',
    'Ahead → Extension',
    'Highly capable → Advanced pathway',
  ].forEach((copy) => assert.ok(source.includes(copy), `support journey must include ${copy}`));
  [
    'before-da-child.png',
    'right-support-tutor.png',
    'after-da-child.png',
    'pathway-seedling.png',
    'pathway-plant.png',
    'pathway-tree.png',
    'pathway-mountain.png',
    'support-heart-sparkle.png',
  ].forEach((asset) => assert.ok(source.includes(asset), `${asset} must render as a separate asset`));
  assert.equal((source.match(/<section/g) ?? []).length, 2);
  assert.match(source, /aria-labelledby="support-journey-title"/);
  assert.match(source, /aria-labelledby="support-pathways-title"/);
  assert.match(source, /aria-hidden="true"/);
});

test('How We Teach removes the large school and paper-plane header decorations', () => {
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');
  const referenceMatchedStyles = styles.slice(styles.indexOf('/* Reference-matched How We Teach chapter'));
  const source = readFileSync(howWeTeachUrl, 'utf8');

  assert.doesNotMatch(source, /primary-reference-teaching__(?:plane|school)/);
  assert.match(referenceMatchedStyles, /\.primary-reference-teaching__header\s*\{[\s\S]*?margin:\s*0 auto clamp\(1\.75rem,\s*3vw,\s*2\.75rem\)/);
  assert.match(referenceMatchedStyles, /\.primary-reference-teaching__header h2\s*\{[\s\S]*?font-size:\s*clamp\(3rem,\s*5vw,\s*5rem\)/);
});

test('the post-hero story exposes static connector markers and three teaching segments', () => {
  assert.equal(existsSync(storyConnectorsUrl), true, 'StoryConnectors must exist');
  if (!existsSync(storyConnectorsUrl)) return;

  const story = readFileSync(referenceStoryUrl, 'utf8');
  const curriculum = readFileSync(foundationCurriculumUrl, 'utf8');
  const aquarium = readFileSync(aquariumUrl, 'utf8');
  const teaching = readFileSync(howWeTeachUrl, 'utf8');
  const connectors = readFileSync(storyConnectorsUrl, 'utf8');
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');

  assert.match(curriculum, /<CurriculumToAquariumConnector/);
  assert.match(aquarium, /<AquariumExitConnector/);
  assert.match(story, /<FoundationCurriculum\s*\/>[\s\S]*<GrowthBridgeConnector\s*\/>[\s\S]*<GrowthSection\s*\/>/);
  assert.match(connectors, /data-story-connector="curriculum-to-aquarium"/);
  assert.match(connectors, /data-story-connector="aquarium-exit"/);
  assert.match(connectors, /data-story-connector="aquarium-to-growth"/);
  assert.match(teaching, /teachingSteps\.slice\(0, -1\)\.map/);
  assert.match(teaching, /<TeachingPathSegment/);
  assert.equal((connectors.match(/data-teaching-segment=/g) ?? []).length, 1, 'mapped segment marker must be present');
  assert.doesNotMatch(styles, /\.primary-aquarium__exit\s*\{\s*display:\s*none/);
});

test('Years 3–4 renders the complete growth story from typed outcomes and an authentic group photo', () => {
  assert.equal(existsSync(growthUrl), true, 'GrowthSection must exist');
  assert.equal(existsSync(growthCurriculumUrl), true, 'GrowthCurriculum must exist');

  const story = readFileSync(referenceStoryUrl, 'utf8');
  const growth = readFileSync(growthUrl, 'utf8');
  const curriculum = readFileSync(growthCurriculumUrl, 'utf8');
  const data = readFileSync(referenceStoryDataUrl, 'utf8');
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');
  const source = `${growth}\n${curriculum}\n${data}`;

  assert.match(story, /import GrowthSection from '\.\/GrowthSection'/);
  assert.match(story, /import GrowthCurriculum from '\.\/GrowthCurriculum'/);
  assert.match(growth, /growthOutcomes\.map/);
  assert.match(growth, /GROWTH_PHOTO/);
  assert.match(growth, /<figure/);
  assert.match(growth, /loading="lazy"/);
  assert.match(growth, /decoding="async"/);
  assert.match(curriculum, /curriculumBands\.growth/);
  assert.match(curriculum, /curriculum\.items\.map/);
  assert.match(growth, /years-3-4-learning-scene\.png/);
  assert.match(growth, /years-3-4-outcome-atlas\.png/);
  assert.match(growth, /years-3-4-decor-atlas\.png/);
  assert.match(growth, /primary-reference-growth__small-steps/);
  assert.match(growth, /Small steps today/);
  assert.match(curriculum, /years-3-4-curriculum-atlas\.png/);
  assert.doesNotMatch(curriculum, /years-3-4-garden-strip\.png|primary-reference-stage-curriculum__garden/);
  assert.match(curriculum, /primary-reference-stage-curriculum__art/);
  assert.match(styles, /primary-reference-stage-curriculum--growth[^}]*isolation:\s*isolate/);
  assert.doesNotMatch(growth, /primary-reference-growth__flight/);
  [
    'Growing skills. Building independence.',
    'Independence and responsibility',
    'Stronger thinking and problem solving',
    'Collaborative learning',
    'NAPLAN readiness',
    'Reading to learn through comprehension and inference',
    'Narrative and informative writing with language conventions',
    'NAPLAN-aligned numeracy, data and multi-step problem solving',
    '/primary-reference/growth/years-3-4-learning-scene.png',
  ].forEach((copy) => assert.ok(source.includes(copy), `growth story must include ${copy}`));
  assert.doesNotMatch(source, /Card/);
});

test('Years 5–6 matches the illustrated reference with separate transparent artwork and classroom photography', () => {
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
  [
    'mastery-star-icon.png',
    'mastery-brain-icon.png',
    'mastery-collaboration-icon.png',
    'mastery-graduation-icon.png',
  ].forEach((asset) => assert.ok(mastery.includes(asset), `mastery chapter must use ${asset}`));
  assert.doesNotMatch(mastery, /mastery-photo-decor\.png|primary-reference-mastery__plane/);
  assert.doesNotMatch(
    mastery,
    /mastery-photo-note\.png|primary-reference-mastery__note|A capable classroom|looking ahead together/,
  );
  [
    'mastery-writing-books.png',
    'mastery-reasoning-sheet.png',
    'mastery-year-seven-books.png',
    'mastery-signpost.png',
  ].forEach((asset) => assert.ok(curriculum.includes(asset), `mastery curriculum must use ${asset}`));
  assert.match(mastery, /primary-reference-mastery__outcome-icon/);
  assert.match(curriculum, /primary-reference-stage-curriculum__art/);
  assert.doesNotMatch(curriculum, /mastery-meadow-strip\.png|primary-reference-stage-curriculum__meadow/);
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
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');

  assert.match(engine, /ResizeObserver/);
  assert.match(engine, /resizeFishMotion/);
  assert.match(engine, /fitAquariumPlate/);
  assert.match(engine, /updateFishButton/);
  assert.match(styles, /\.primary-aquarium\s*\{[^}]*height:\s*auto[^}]*aspect-ratio:\s*3\s*\/\s*2/s);
  assert.match(styles, /\.primary-aquarium__canvas img,[\s\S]*object-fit:\s*contain/);
});

test('reduced-motion displacement reset uses the supported Pixi filter scale fields', () => {
  const engine = readFileSync(aquariumEngineUrl, 'utf8');

  assert.match(engine, /displacement\.scale\.x = 0/);
  assert.match(engine, /displacement\.scale\.y = 0/);
  assert.doesNotMatch(engine, /displacement\.scale\.set\(/);
});

test('aquarium fallbacks load below-fold and stop compositor work after Pixi takes over', () => {
  const aquarium = readFileSync(aquariumUrl, 'utf8');
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');

  assert.ok((aquarium.match(/loading="lazy"/g) ?? []).length >= 3);
  assert.ok((aquarium.match(/decoding="async"/g) ?? []).length >= 3);
  assert.match(styles, /\.primary-aquarium\.is-pixi-ready \.primary-aquarium__bubbles[\s\S]*animation:\s*none/);
  assert.match(styles, /\.primary-aquarium\.is-pixi-ready \.primary-aquarium__sprite[\s\S]*animation:\s*none/);
  assert.match(styles, /visibility:\s*hidden/);
});

test('reduced-motion fact transitions are immediate on entrance and exit', () => {
  const source = readFileSync(aquariumFactCardUrl, 'utf8');

  assert.match(source, /src=\{fish\.src\}/);
  assert.match(source, /primary-aquarium__fact-fish/);
  assert.match(source, /exit=\{reducedMotion \? \{ opacity: 0 \}/);
  assert.match(source, /transition=\{\{ duration: reducedMotion \? 0/);
  assert.doesNotMatch(source, /exit=\{\{ opacity: 0, y: 8 \}\}/);
});

test('learning environment presents one real DA photograph and five selectable formats', () => {
  assert.equal(existsSync(programBagUrl), true, 'ProgramBag must exist');

  const story = readFileSync(referenceStoryUrl, 'utf8');
  const programBag = readFileSync(programBagUrl, 'utf8');
  const data = readFileSync(referenceStoryDataUrl, 'utf8');
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');
  const programData = data.slice(
    data.indexOf('export const programChoices'),
    data.indexOf('export const familyReasons'),
  );

  assert.match(story, /import ProgramBag from '\.\/ProgramBag'/);
  assert.match(story, /<ProgramBag/);
  assert.match(programBag, /programChoices\.map/);
  assert.match(programBag, /<button/);
  assert.match(programBag, /aria-pressed=\{isSelected\}/);
  assert.match(programBag, /role="tablist"/);
  assert.match(programBag, /AnimatePresence/);
  assert.match(programBag, /layoutId="primary-program-active-indicator"/);
  assert.match(programBag, /useReducedMotion/);
  assert.match(programBag, /program\.photo/);
  assert.match(programBag, /program\.bestFor/);
  assert.doesNotMatch(programBag, /primaryAssetManifest\.schoolbag/);
  assert.equal((programData.match(/id: '(?:private-tuition|small-group|classes|creative-writing|advanced-enrichment)'/g) ?? []).length, 5);
  assert.equal((programData.match(/photo: '\/images\/community\//g) ?? []).length, 5);
  assert.match(styles, /grid-template-columns:\s*minmax\(0,\s*21fr\)\s+minmax\(0,\s*50fr\)\s+minmax\(0,\s*27fr\)/);
  assert.match(styles, /overflow-x:\s*auto/);
  assert.match(styles, /\.primary-program-bag__control:focus-visible/);
  assert.match(styles, /min-(?:width|height):\s*44px/);
});

test('learning environment uses the approved editorial copy without the former helper grid', () => {
  const programBag = readFileSync(programBagUrl, 'utf8');
  const data = readFileSync(referenceStoryDataUrl, 'utf8');
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');
  const source = `${programBag}\n${data}`;

  ['FIND THEIR RIGHT FIT', 'The right learning environment changes everything.', 'One goal — helping your child thrive.', 'BEST FOR', 'Learn more', 'Not sure which one?']
    .forEach((copy) => assert.ok(source.includes(copy), `learning environment must include ${copy}`));

  assert.doesNotMatch(programBag, /programNeeds\.map/);
  assert.doesNotMatch(programBag, /primary-program-bag__need-icon/);
  assert.doesNotMatch(programBag, /primary-program-bag__bag/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});

test('family reasons form a four-column unboxed editorial strip with the reviewed icon artwork', () => {
  assert.equal(existsSync(familyReasonsUrl), true, 'FamilyReasons must exist');

  const story = readFileSync(referenceStoryUrl, 'utf8');
  const familyReasons = readFileSync(familyReasonsUrl, 'utf8');
  const data = readFileSync(referenceStoryDataUrl, 'utf8');
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');
  const familyData = data.slice(data.indexOf('export const familyReasons'));

  assert.match(story, /import FamilyReasons from '\.\/FamilyReasons'/);
  assert.match(story, /<FamilyReasons/);
  assert.match(familyReasons, /familyReasons\.map/);
  assert.match(familyReasons, /referenceStoryAssets\.familyIcons/);
  assert.match(familyReasons, /backgroundPosition/);
  assert.match(familyReasons, /\['4%', '38%', '67%', '100%'\] as const/);
  assert.match(familyReasons, /primary-family-reasons__icon/);
  assert.match(familyReasons, /<ol/);
  assert.equal((familyData.match(/title: '/g) ?? []).length, 4);
  assert.match(familyData, /title: 'Small classes',[\s\S]*body: 'More attention, better outcomes\.'/);
  assert.match(familyData, /title: 'Loved by parents',[\s\S]*body: 'Real results, real relationships\.'/);
  assert.match(familyData, /title: 'Experienced tutors',[\s\S]*body: 'Qualified, passionate and caring\.'/);
  assert.match(familyData, /title: 'Proven progress',[\s\S]*body: 'Confidence today, success tomorrow\.'/);
  assert.match(styles, /\.primary-family-reasons__list\s*\{[\s\S]*grid-template-columns:\s*repeat\(4,/);
  assert.doesNotMatch(familyReasons, /Card/);
});

test('family reasons use compact desktop geometry and one complete atlas slice per reason', () => {
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');
  const familyStyles = styles.slice(
    styles.indexOf('.primary-family-reasons {'),
    styles.indexOf('.primary-journey-outro {'),
  );

  assert.match(familyStyles, /--family-strip-padding-block:\s*clamp\(1\.25rem,\s*2vw,\s*1\.75rem\)/);
  assert.match(familyStyles, /--family-icon-size:\s*clamp\(3\.5rem,\s*4\.5vw,\s*4\.25rem\)/);
  assert.match(familyStyles, /padding:\s*var\(--family-strip-padding-block\) 0/);
  assert.match(familyStyles, /\.primary-family-reasons__icon\s*\{[\s\S]*background-size:\s*400% auto/);
  assert.doesNotMatch(familyStyles, /\.primary-family-reasons__icons/);
  assert.doesNotMatch(familyStyles, /padding:\s*clamp\(3\.5rem/);
});

test('closing landscape carries semantic CTA copy and both expected journey links', () => {
  assert.equal(existsSync(outroUrl), true, 'PrimaryJourneyOutro must exist');
  const story = readFileSync(referenceStoryUrl, 'utf8');
  const outro = readFileSync(outroUrl, 'utf8');

  assert.match(story, /import PrimaryJourneyOutro from '\.\/PrimaryJourneyOutro'/);
  assert.match(outro, /referenceStoryAssets\.closingLandscape/);
  assert.match(outro, /A clear path\. Every step matters\./);
  assert.match(outro, /We’re here beside your child at every stage\./);
  assert.match(outro, /to="\/book-interview"/);
  assert.match(outro, /href="#pathway"/);
  assert.match(outro, /See How It Works/);
  assert.match(outro, /<h2/);
});

test('reference motion stays root-scoped, clears reduced-motion transforms, and fully cleans up', () => {
  assert.equal(existsSync(referenceMotionUrl), true, 'usePrimaryReferenceMotion must exist');
  const story = readFileSync(referenceStoryUrl, 'utf8');
  const motion = readFileSync(referenceMotionUrl, 'utf8');
  const styles = readFileSync(primaryReferenceCssUrl, 'utf8');

  assert.match(story, /useRef<HTMLElement>/);
  assert.match(story, /usePrimaryReferenceMotion\(rootRef\)/);
  assert.match(story, /<main ref=\{rootRef\}/);
  assert.match(motion, /usePrimaryReferenceMotion\s*=\s*\(rootRef:\s*RefObject<HTMLElement>\)/);
  assert.match(motion, /gsap\.registerPlugin\(ScrollTrigger\)/);
  assert.match(motion, /const context = gsap\.context/);
  assert.match(motion, /gsap\.matchMedia\(\)/);
  assert.match(motion, /root\.querySelector<HTMLElement>\('#pathway'\)/);
  assert.match(motion, /trigger:\s*pathway/);
  assert.doesNotMatch(motion, /trigger:\s*['"]#/);
  assert.match(motion, /prefers-reduced-motion:\s*reduce/);
  assert.match(motion, /prefers-reduced-motion:\s*no-preference/);
  assert.match(motion, /clearProps:\s*'transform,opacity,visibility,clipPath'/);
  assert.match(motion, /'\.primary-reference-teaching li'/);
  assert.doesNotMatch(motion, /'\.primary-reference-teaching li figure'/);
  assert.match(motion, /\.primary-reference-teaching__segment/);
  assert.match(motion, /teachingSegments/);
  assert.match(motion, /teachingMoments\.forEach/);
  assert.ok((motion.match(/immediateRender:\s*false/g) ?? []).length >= 2, 'static connectors must stay visible before their timelines begin');
  assert.match(motion, /\.primary-program-bag__control/);
  assert.match(motion, /media\.revert\(\)/);
  assert.match(motion, /context\.revert\(\)/);
  assert.doesNotMatch(styles, /@keyframes primary-reference-teaching-settle/);
  assert.doesNotMatch(styles, /animation:\s*primary-reference-teaching-settle/);
  assert.match(styles, /\.primary-reference-teaching li:nth-child\(1\) figure\s*\{\s*transform:\s*rotate\(-1\.4deg\)/);
});

test('Years 1–2 fills a desktop viewport with one shared proportional scale while other chapters remain naturally sized', () => {
  const styles = readFileSync(new URL('./primary-reference.css', import.meta.url), 'utf8');
  const challengeStyles = readFileSync(new URL('./seed-tree-challenge.css', import.meta.url), 'utf8');
  const foundation = readFileSync(new URL('./FoundationSection.tsx', import.meta.url), 'utf8');

  assert.match(styles, /@media \(min-width:\s*1100px\) and \(min-height:\s*700px\)/);
  assert.match(styles, /--primary-fold-space:\s*clamp\([^;]*svh/);
  assert.match(styles, /--primary-fold-title:\s*clamp\([^;]*min\([^;]*vw[^;]*svh/);
  assert.match(styles, /height:\s*auto/);
  assert.match(styles, /--primary-chapter-width:\s*min\(calc\(100% - 3rem\),\s*92rem\)/);
  assert.match(styles, /--foundation-scale-unit:\s*min\(1vw,\s*1\.6svh\)/);
  assert.match(styles, /\.primary-reference-foundation\s*\{[^}]*width:\s*var\(--primary-chapter-width\)/);
  assert.match(styles, /\.primary-reference-curriculum\s*\{[^}]*width:\s*var\(--primary-chapter-width\)/);
  assert.match(styles, /\.primary-reference-foundation\s*\{[^}]*height:\s*100svh/);
  assert.match(styles, /\.primary-reference-foundation__intro h2\s*\{[^}]*var\(--foundation-scale-unit\)/);
  assert.match(styles, /\.primary-reference-foundation__photo\s*\{[^}]*var\(--foundation-scale-unit\)/);
  assert.match(styles, /\.primary-reference-foundation__outcomes\s*\{[^}]*var\(--foundation-scale-unit\)/);
  assert.match(styles, /grid-template-areas:\s*['"]intro outcomes['"]\s*['"]photo outcomes['"]/);
  assert.match(styles, /\.primary-reference-foundation__intro\s*\{[^}]*grid-area:\s*intro/);
  assert.match(styles, /\.primary-reference-foundation__photo\s*\{[^}]*grid-area:\s*photo/);
  assert.match(styles, /\.primary-reference-foundation__outcomes\s*\{[^}]*grid-area:\s*outcomes/);
  assert.match(styles, /\.primary-reference-foundation__lead\s*\{[^}]*display:\s*block/);
  assert.match(foundation, /In Years 1–2, we build the skills, habits and confidence that set children up for every future success\./);
  assert.match(styles, /font-size:\s*var\(--primary-fold-title\)/);
  assert.match(styles, /max-height:\s*clamp\([^;]*svh/);
  assert.match(challengeStyles, /@media \(min-width:\s*1100px\) and \(min-height:\s*700px\)/);
  assert.match(challengeStyles, /--seed-fold-space:\s*clamp\([^;]*svh/);
  assert.match(challengeStyles, /height:\s*auto/);
  assert.doesNotMatch(challengeStyles, /seed-tree-challenge__paper\s*\{[^}]*overflow-y:\s*auto/);
  assert.doesNotMatch(styles, /@media \(max-width:\s*800px\)[\s\S]*height:\s*100svh[^\n}]*!important/);
});
