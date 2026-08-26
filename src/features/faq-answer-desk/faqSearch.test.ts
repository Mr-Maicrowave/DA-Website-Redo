import test from 'node:test';
import assert from 'node:assert/strict';
import { journeyQuestions, rankJourneyQuestions } from './faqData.ts';

test('class size ranks the attention journey first and the class-size thought second', () => {
  const results = rankJourneyQuestions('class size', journeyQuestions);

  assert.deepEqual(results.slice(0, 2).map(({ question }) => question.id), [
    'attention',
    'class-size',
  ]);
});

test('subject-specific searches find the getting-started journey', () => {
  const results = rankJourneyQuestions('high school maths', journeyQuestions);

  assert.equal(results[0]?.question.id, 'getting-started');
  assert.ok(results[0].score > 0);
});

test('blank and unrelated searches do not manufacture a match', () => {
  assert.deepEqual(rankJourneyQuestions('   ', journeyQuestions), []);
  assert.deepEqual(rankJourneyQuestions('parking', journeyQuestions), []);
});
