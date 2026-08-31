import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { footerConfig } from './footer-config.ts';

test('exposes only verified internal routes in the footer navigation', () => {
  assert.deepEqual(footerConfig.explore, [
    { label: 'Our Approach', to: '/our-approach' },
    { label: 'Our Teachers', to: '/our-teachers' },
    { label: 'Success Stories', to: '/success-stories' },
    { label: 'Articles & Guides', to: '/articles' },
    { label: 'FAQ', to: '/faq' },
  ]);
  assert.deepEqual(footerConfig.subjects, [
    { label: 'Mathematics', to: '/subjects/mathematics' },
    { label: 'English', to: '/subjects/english' },
    { label: 'Science', to: '/subjects/science' },
    { label: 'Business Studies', to: '/subjects/business-studies' },
    { label: 'Legal Studies', to: '/subjects/legal-studies' },
  ]);
  assert.deepEqual(footerConfig.legal, [
    { label: 'Privacy Policy', to: '/privacy-policy' },
  ]);
  assert.deepEqual(footerConfig.primaryAction, {
    label: 'Book a consultation',
    to: '/book-interview',
  });
});

test('uses the supplied footer crest without modifying its bytes', () => {
  const asset = readFileSync(new URL('../../../public/images/brand/da-footer-crest-laurel.png', import.meta.url));
  const digest = createHash('sha256').update(asset).digest('hex');

  assert.equal(footerConfig.logo.src, '/images/brand/da-footer-crest-laurel.png');
  assert.equal(digest, 'd0c9ab549cfa630f0ef9e68c4c389807be4170553e237b7289fe282ec009545e');
});
