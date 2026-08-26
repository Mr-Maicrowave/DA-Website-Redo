import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pageUrl = new URL('./Science.tsx', import.meta.url);

test('renders the Programs pathway as a macro-to-micro scroll story before HSC lenses', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /<SciencePrograms\s*\/>/);
  assert.match(source, /className="science-scale-story[^\"]*"/);
  assert.match(source, /className="science-macro-stage[^\"]*"/);
  assert.match(source, /className="science-scale-caption[^\"]*"/);
  assert.match(source, /visible-world-v1\.png/);
  assert.match(source, /living-systems-v1\.png/);
  assert.match(source, /molecules-v1\.png/);
  assert.match(source, /fields-and-waves-v1\.png/);
  assert.match(source, /circle\(0% at 64% 36%\)/);
  assert.match(source, /circle\(0% at 36% 64%\)/);
  assert.match(source, /circle\(0% at 64% 37%\)/);
  assert.match(source, /clipPath: cellReveal/);
  assert.match(source, /clipPath: moleculeReveal/);
  assert.match(source, /clipPath: fieldReveal/);
  assert.match(source, /const scaleProgress = useTransform/);
  assert.match(source, /style=\{\{ left: scaleProgress \}\}/);
  assert.match(source, /Science at every scale/);
  assert.match(source, /HSC BIOLOGY · YEARS 11–12/);
  assert.match(source, /HSC CHEMISTRY · YEARS 11–12/);
  assert.match(source, /HSC PHYSICS · YEARS 11–12/);
  assert.match(source, /HSC SPECIALISATION/);
  assert.match(source, /className="science-programs__hsc[^\"]*"/);
  assert.match(source, /prefers-reduced-motion: reduce/);
});
