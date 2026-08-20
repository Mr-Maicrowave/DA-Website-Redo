import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { MATHS_SYLLABUS_STORY_BEATS } from './maths-syllabus-scroll-story-data.ts';

test('every beat has an optimised public art plate', () => {
  for (const beat of MATHS_SYLLABUS_STORY_BEATS) {
    const file = resolve(process.cwd(), 'public/images/maths-syllabus-scroll-story/' + beat.plate + '.webp');
    assert.equal(existsSync(file), true, beat.plate + ' is missing');
  }
});
