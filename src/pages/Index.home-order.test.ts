import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const indexUrl = new URL('./Index.tsx', import.meta.url);

test('places video, reviews, and teachers immediately after Programs in that order', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(
    source,
    /<ProgramsSection \/>\s*<DAEnvironmentSection \/>\s*<ReviewsSection \/>\s*<TeachersSection \/>/,
  );
});

test('places the confidence quote and subject cards immediately after Teachers', () => {
  const source = readFileSync(indexUrl, 'utf8');

  assert.match(
    source,
    /<TeachersSection \/>\s*<QuoteSection \/>\s*<WhatWeTeachSection \/>/,
  );
});
