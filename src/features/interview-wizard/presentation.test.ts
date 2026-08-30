import test from 'node:test';
import assert from 'node:assert/strict';
import { BEHAVIOURS_OBSERVED, LEARNING_CHALLENGES, PARENT_CONCERNS } from './config.ts';
import { buildDirectSummary, groupOptions, REVIEW_PROCESS } from './presentation.ts';

test('groups every configured answer once without changing its value or label', () => {
  const cases = [
    [BEHAVIOURS_OBSERVED, ['Confidence', 'Study habits', 'Independence', 'Other']],
    [PARENT_CONCERNS, ['Progress', 'Confidence', 'Learning', 'Preparation', 'Other']],
    [LEARNING_CHALLENGES, ['Foundations', 'Focus & pace', 'Understanding', 'Confidence / assessment', 'History', 'Other']],
  ] as const;

  for (const [options, headings] of cases) {
    const groups = groupOptions(options);
    assert.deepEqual(groups.map(group => group.heading), headings);
    assert.deepEqual(groups.flatMap(group => group.options).map(option => option.value).sort(), options.map(option => option.value).sort());
  }
});

test('listening summaries repeat only answers the parent selected', () => {
  assert.equal(buildDirectSummary('Phillip', []), 'Choose any answers that feel familiar and we’ll reflect them here.');
  assert.equal(buildDirectSummary('Phillip', ['Generally manageable']), 'What we’re hearing: Phillip — Generally manageable.');
  assert.equal(buildDirectSummary('Phillip', ['Generally manageable', 'Enjoys being challenged']), 'What we’re hearing: Phillip — Generally manageable; Enjoys being challenged.');
});

test('review process reflects consultation progress without implying a recommendation', () => {
  assert.deepEqual(REVIEW_PROCESS.map(item => item.status), ['complete', 'current', 'future', 'future', 'future']);
});
