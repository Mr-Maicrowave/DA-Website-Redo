import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const indexUrl = new URL('./Index.tsx', import.meta.url);

test('places subject cards, video, reviews, and teachers after Programs in that order', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(
    source,
    /<ProgramsSection \/>\s*<SubjectPeekSection \/>\s*<DAEnvironmentSection \/>\s*<ReviewsSection \/>\s*<TeachersSection \/>/,
  );
});

test('places wellbeing immediately after the confidence quote', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(
    source,
    /<TeachersSection \/>\s*<QuoteSection \/>\s*<WellbeingSection \/>/,
  );
});
