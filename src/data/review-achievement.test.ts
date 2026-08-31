import test from 'node:test';
import assert from 'node:assert/strict';
import { extractReviewAchievement } from './review-achievement.ts';

test('does not treat ordinary uses of first as rankings', () => {
  for (const phrase of [
    'First of all, I want to thank my tutor.',
    'My first lesson was very welcoming.',
    'For the first time I enjoyed English.',
    'I joined in the first term of Year 11.',
    'I wondered why I was so worried in the first place.',
    'DA was the first place where I felt welcome.',
  ]) {
    assert.doesNotMatch(extractReviewAchievement(phrase).after, /first|1st/i);
  }
});

test('keeps first when the wording clearly describes a rank', () => {
  assert.match(extractReviewAchievement('I came first in my class.').after, /first in my class/i);
  assert.match(extractReviewAchievement('I secured first place in the trials.').after, /first place in the trials/i);
  assert.match(extractReviewAchievement('I finished 2nd out of 135 students.').after, /2nd out of 135 students/i);
});

test('recognises explicit rank transformations before generic improvement wording', () => {
  assert.deepEqual(
    extractReviewAchievement('My marks improved and I jumped from 50th to 6th!'),
    { before: '50th', after: '6th', strength: 30 },
  );
  assert.deepEqual(
    extractReviewAchievement('I moved from rank 15th to rank 6th in English.'),
    { before: '15th', after: '6th', strength: 30 },
  );
});

test('only treats percentages as achievements when result language is present', () => {
  assert.equal(extractReviewAchievement('The course covered 100% of the syllabus.').strength, 0);
  assert.match(extractReviewAchievement('I achieved a mark of 100% in my exam.').after, /100%/);
});
