import test from 'node:test';
import assert from 'node:assert/strict';
import { MATHS_SYLLABUS_STORY_BEATS, STORY_SOURCE_NOTE, getStoryBeat } from './maths-syllabus-scroll-story-data.ts';

test('story contains the approved six beats in visual order', () => {
  assert.deepEqual(MATHS_SYLLABUS_STORY_BEATS.map((beat) => beat.id),
    ['locate', 'relate', 'change', 'accumulate', 'extend', 'explore']);
  assert.equal(getStoryBeat('change').course, 'Mathematics Advanced');
  assert.equal(getStoryBeat('explore').course, 'Mathematics Extension 2');
});

test('story prevents a false Standard-to-Extension prerequisite claim', () => {
  assert.match(STORY_SOURCE_NOTE.pathwayClarification, /not a prerequisite/i);
  assert.match(STORY_SOURCE_NOTE.pathwayClarification, /separate pathway/i);
});

test('unknown beat ids fail with a useful error', () => {
  assert.throws(
    () => getStoryBeat('unknown' as never),
    /Unknown Maths syllabus story beat: unknown/,
  );
});
