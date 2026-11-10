import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./YearCube.tsx', import.meta.url);
const mathematicsPageUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);
const originalExperienceUrl = new URL('../../../public/interactive/year-cube/index.html', import.meta.url);

test('replaces the maths scroll story with an accessible Years 7–12 cube', () => {
  assert.equal(existsSync(componentUrl), true, 'YearCube.tsx must provide the Mathematics page replacement');

  const source = readFileSync(componentUrl, 'utf8');
  const mathematicsPage = readFileSync(mathematicsPageUrl, 'utf8');
  const originalExperience = readFileSync(originalExperienceUrl, 'utf8');

  assert.match(source, /\/interactive\/year-cube\/index\.html/);
  assert.match(source, /title="Interactive Years 7 to 12 mathematics cube"/);
  assert.match(originalExperience, /function foldAnimation\(direction, duration\)/);
  assert.match(originalExperience, /async function exploreYear7\(\)/);
  assert.match(originalExperience, /async function exploreYear12\(\)/);
  assert.match(originalExperience, /7: \{ open: exploreYear7, close: closeYear7 \}/);
  assert.match(originalExperience, /12: \{ open: exploreYear12, close: closeYear12 \}/);
  assert.match(originalExperience, /face\.addEventListener\('click'/);
  assert.match(originalExperience, /const FACE_EXPLORER_YEARS/);
  assert.match(mathematicsPage, /import \{ YearCube \} from '@\/features\/year-cube\/YearCube'/);
  assert.match(mathematicsPage, /<YearCube\s*\/>/);
  assert.doesNotMatch(mathematicsPage, /<MathsSyllabusScrollStory\s*\/>/);
});
