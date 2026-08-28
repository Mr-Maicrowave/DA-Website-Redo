import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import { getLandscapeJourneyStage, LANDSCAPE_PATH_TIMING } from './landscapeJourneyModel.ts';

const pageUrl = new URL('../../pages/programs/PrimarySchool.tsx', import.meta.url);
const sceneUrl = new URL('./PrimaryLandscapeJourney.tsx', import.meta.url);

test('journey progress activates exactly three staircase milestones in order', () => {
  assert.equal(getLandscapeJourneyStage(0), 0);
  assert.equal(getLandscapeJourneyStage(0.24), 0);
  assert.equal(getLandscapeJourneyStage(0.25), 1);
  assert.equal(getLandscapeJourneyStage(0.54), 1);
  assert.equal(getLandscapeJourneyStage(0.55), 2);
  assert.equal(getLandscapeJourneyStage(0.81), 2);
  assert.equal(getLandscapeJourneyStage(0.82), 3);
  assert.equal(getLandscapeJourneyStage(1), 3);
});

test('journey progress is clamped when ScrollTrigger reports overscroll', () => {
  assert.equal(getLandscapeJourneyStage(-0.4), 0);
  assert.equal(getLandscapeJourneyStage(1.4), 3);
});

test('the crayon path finishes with the final staircase milestone', () => {
  assert.equal(LANDSCAPE_PATH_TIMING.start + LANDSCAPE_PATH_TIMING.duration, 1);
});

test('the Primary page moves directly from its hero into the reference story', () => {
  assert.equal(existsSync(sceneUrl), true, 'PrimaryLandscapeJourney must exist');

  const source = readFileSync(pageUrl, 'utf8');
  const heroIndex = source.indexOf('<div className="ps-opening">');
  const storyIndex = source.indexOf('<PrimaryReferenceStory');

  assert.ok(heroIndex >= 0, 'the existing hero must remain');
  assert.ok(storyIndex > heroIndex, 'the existing Primary story must follow the hero');
  assert.doesNotMatch(source, /<PrimaryLandscapeJourney/);
  assert.doesNotMatch(source, /<PrimaryWorldTransition/);
  assert.match(source, /<PrimaryHero/);
});
