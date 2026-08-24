import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const pageUrl = new URL('../../pages/programs/PrimarySchool.tsx', import.meta.url);
const referenceStoryUrl = new URL('./PrimaryReferenceStory.tsx', import.meta.url);
const referenceStoryDataUrl = new URL('./referenceStoryData.ts', import.meta.url);

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
  const source = readFileSync(referenceStoryUrl, 'utf8');

  assert.match(source, /Strong foundations shape everything that follows\./);
  assert.match(source, /Growing skills\. Building independence\./);
  assert.match(source, /Ready for what comes next\./);
  assert.match(source, /Why families choose DA\./);
  assert.match(source, /A clear path\. Every step matters\./);
  assert.doesNotMatch(source, /\.alt\.toLowerCase\(\)/);
  assert.doesNotMatch(source, /referenceStoryAssets\.closingLandscape/);
});
