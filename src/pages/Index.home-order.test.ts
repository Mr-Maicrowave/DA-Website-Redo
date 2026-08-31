import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const indexUrl = new URL('./Index.tsx', import.meta.url);

test('places reviews and the parent-story quote immediately after the environment video', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(
    source,
    /<AchievementsSection \/>\s*<DAEnvironmentSection \/>\s*<ReviewsSection \/>\s*<QuoteSection \/>\s*<ProgramsSection \/>\s*<SubjectPeekSection \/>\s*<TeachersSection \/>/,
  );
});

test('uses the requested Google Reviews heading', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(source, /Let(?:’|')s look at some of our Google Reviews/);
});
