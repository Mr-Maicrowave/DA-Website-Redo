import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const navigationUrl = new URL('./NavigationNew.tsx', import.meta.url);
const mobileNavigationUrl = new URL('./nav/MobileNavSheet.tsx', import.meta.url);

test('does not offer the retired All Subjects hub in the Subjects navigation', () => {
  const source = readFileSync(navigationUrl, 'utf8');

  assert.doesNotMatch(source, /title:\s*"All Subjects"/);
  assert.doesNotMatch(source, /href:\s*"\/subjects"/);
});

test('does not offer The DA Difference in the About navigation', () => {
  const source = readFileSync(navigationUrl, 'utf8');

  assert.doesNotMatch(source, /title:\s*"The DA Difference"/);
  assert.doesNotMatch(source, /href:\s*"\/why-choose-da"/);
});

test('offers the Contact Us page in both desktop and mobile navigation', () => {
  const desktopSource = readFileSync(navigationUrl, 'utf8');
  const mobileSource = readFileSync(mobileNavigationUrl, 'utf8');

  assert.match(desktopSource, /<Link to="\/contact"[^>]*>Contact Us<\/Link>/);
  assert.match(mobileSource, /to="\/contact"[\s\S]*?>\s*Contact Us\s*<\/Link>/);
});
