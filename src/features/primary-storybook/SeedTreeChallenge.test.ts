import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { primaryQuestionBank } from './primaryQuestionBank.ts';

const storyUrl = new URL('./PrimaryReferenceStory.tsx', import.meta.url);
const challengeUrl = new URL('./SeedTreeChallenge.tsx', import.meta.url);
const bankUrl = new URL('./primaryQuestionBank.ts', import.meta.url);
const stylesUrl = new URL('./seed-tree-challenge.css', import.meta.url);

test('the seed challenge replaces the aquarium in the existing story slot', () => {
  const story = readFileSync(storyUrl, 'utf8');
  assert.match(story, /<MasteryCurriculum\s*\/>\s*<SeedTreeChallenge\s*\/>\s*<SupportJourney/);
  assert.doesNotMatch(story, /<PrimaryAquarium/);
});

test('the challenge uses six separately generated transparent growth assets', () => {
  const challenge = readFileSync(challengeUrl, 'utf8');
  for (const name of ['seed', 'germinating-seed', 'sprout', 'young-plant', 'sapling', 'mature-tree']) {
    assert.match(challenge, new RegExp(`/primary-reference/seed-tree/${name}\\.png`));
    assert.equal(existsSync(new URL(`../../../public/primary-reference/seed-tree/${name}.png`, import.meta.url)), true);
  }
  assert.match(challenge, /--growth-stage/);
});

test('question content is data-driven for every year and subject', () => {
  const bank = readFileSync(bankUrl, 'utf8');
  const challenge = readFileSync(challengeUrl, 'utf8');
  for (let year = 1; year <= 6; year += 1) {
    const level = primaryQuestionBank[year as keyof typeof primaryQuestionBank];
    assert.equal(level.maths.length >= 12, true);
    assert.equal(level.english.length >= 12, true);
  }
  for (const field of ['difficulty', 'question', 'options', 'correctAnswer', 'hint', 'explanation', 'type']) {
    assert.match(bank, new RegExp(field));
  }
  assert.match(challenge, /Question \{questionIndex \+ 1\} of 6/);
  assert.match(challenge, /Almost! Try once more\./);
  assert.match(challenge, /attempts >= 2/);
  assert.match(challenge, /Look what you grew!/);
});

test('the garden challenge remains accessible, responsive and reduced-motion safe', () => {
  const challenge = readFileSync(challengeUrl, 'utf8');
  const styles = readFileSync(stylesUrl, 'utf8');
  assert.match(challenge, /aria-live="polite"/);
  assert.match(challenge, /aria-pressed=/);
  assert.match(challenge, /type="button"/);
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /@media \(max-width:\s*800px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion:\s*reduce\)/);
});
