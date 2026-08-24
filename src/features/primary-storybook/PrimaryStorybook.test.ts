import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const pageUrl = new URL('../../pages/programs/PrimarySchool.tsx', import.meta.url);
const referenceStoryUrl = new URL('./PrimaryReferenceStory.tsx', import.meta.url);
const referenceStoryDataUrl = new URL('./referenceStoryData.ts', import.meta.url);
const aquariumUrl = new URL('./PrimaryAquarium.tsx', import.meta.url);
const aquariumDataUrl = new URL('./primaryStoryData.ts', import.meta.url);
const journeyUrl = new URL('./PrimaryJourneyLayer.tsx', import.meta.url);
const outroUrl = new URL('./PrimaryJourneyOutro.tsx', import.meta.url);

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
  assert.match(readFileSync(referenceStoryDataUrl, 'utf8'), /as const satisfies/);
});

test('aquarium exposes every creature fact to keyboard users', () => {
  assert.equal(existsSync(aquariumUrl), true);
  const source = readFileSync(aquariumUrl, 'utf8');
  const assetSource = readFileSync(aquariumDataUrl, 'utf8');
  assert.match(source, /Curiosity grows/);
  assert.match(source, /Move your cursor to chase the fish/);
  assert.match(source, /aria-label=\{`Show fun fact about \$\{fish\.label\}`\}/);
  assert.match(assetSource, /blue-tang\.png/);
  assert.match(assetSource, /clownfish\.png/);
  assert.match(assetSource, /pufferfish\.png/);
  assert.match(assetSource, /seahorse\.png/);
  assert.match(assetSource, /yellow-tang\.png/);
  assert.match(assetSource, /reef-fish\.png/);
  assert.match(assetSource, /starfish\.png/);
  assert.match(readFileSync(new URL('./useAquariumEngine.ts', import.meta.url), 'utf8'), /import\('pixi\.js'\)/);
});

test('aquarium water reacts separately from fish controls without React pointer state', () => {
  const source = readFileSync(aquariumUrl, 'utf8');
  const engine = readFileSync(new URL('./useAquariumEngine.ts', import.meta.url), 'utf8');
  assert.match(source, /onClick=\{\(event\) => selectFish\(event, fish\.id\)\}/);
  assert.match(source, /event\.stopPropagation\(\)/);
  assert.match(engine, /DisplacementFilter/);
  assert.match(engine, /pointerdown/);
  assert.match(engine, /pointermove/);
  assert.match(engine, /ripplesRef/);
  assert.match(engine, /bubblePoolRef/);
  assert.match(engine, /prefers-reduced-motion/);
  assert.doesNotMatch(source, /onPointerMove=\{/);
});

test('one shared plane links the journey and respects reduced motion', () => {
  assert.equal(existsSync(journeyUrl), true);
  const source = readFileSync(journeyUrl, 'utf8');
  assert.match(source, /primary-journey-plane/);
  assert.match(source, /MotionPathPlugin/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /strokeDasharray/);
});

test('the plane motion guide never renders as a line over page content', () => {
  const styles = readFileSync(new URL('./primary-storybook.css', import.meta.url), 'utf8');
  assert.match(styles, /\.primary-journey-route\{stroke:transparent/);
});

test('closing landscape and CTA complete the journey', () => {
  assert.equal(existsSync(outroUrl), true);
  const source = readFileSync(outroUrl, 'utf8');
  assert.match(source, /journey-continues-landscape\.png/);
  assert.match(source, /A clear path\. Every step matters\./);
  assert.match(source, /We’re here beside your child at every stage\./);
  assert.match(source, /Start Their Journey With Us/);
});
