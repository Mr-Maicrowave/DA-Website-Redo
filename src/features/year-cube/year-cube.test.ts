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
  assert.match(originalExperience, /function buildHingedNet\(\)/);
  assert.match(originalExperience, /hinged-net__panel/);
  assert.match(originalExperience, /panel\.appendChild\(faceEls\[name\]\)/);
  assert.match(originalExperience, /async function exploreYear7\(\)/);
  assert.match(originalExperience, /async function exploreYear12\(\)/);
  assert.match(originalExperience, /7: \{ open: exploreYear7, close: closeYear7 \}/);
  assert.match(originalExperience, /12: \{ open: exploreYear12, close: closeYear12 \}/);
  assert.match(originalExperience, /face\.addEventListener\('click'/);
  assert.match(originalExperience, /const FACE_EXPLORER_YEARS/);
  assert.match(originalExperience, /\.face \{[\s\S]*backface-visibility: hidden/);
  assert.match(originalExperience, /function buildProbabilitySample/);
  assert.match(originalExperience, /P\(4\) = 1\/6/);
  assert.match(originalExperience, /turning point: \(2, −1\)/);
  assert.match(originalExperience, /METHOD/);
  assert.match(originalExperience, /if \(reduceMotion\) \{\s*openPanel\(n\);\s*return;\s*\}/);
  assert.match(originalExperience, /@media \(max-width: 900px\) \{[\s\S]*\.explore-card \{ background: #06111f;/);
  assert.match(originalExperience, /function createSceneNarration/);
  assert.match(originalExperience, /One roll is uncertain\./);
  assert.match(originalExperience, /A fair die has six possible faces\./);
  assert.match(originalExperience, /Make each decision visible\./);
  assert.match(originalExperience, /function projectNetAnimation/);
  assert.match(originalExperience, /function buildFunctionTransformation/);
  assert.match(originalExperience, /f\(x\) = \(x − 2\)² − 1/);
  assert.match(originalExperience, /function buildWorkedSolution/);
  assert.match(originalExperience, /A = π\(4\.5\)²/);
  assert.match(originalExperience, /cube\.classList\.add\('depth-mode'\)/);
  assert.match(originalExperience, /\.cube\.depth-mode \.face--front/);
  assert.match(originalExperience, /\.cube\.depth-mode \.face--right/);
  assert.match(originalExperience, /\.cube\.depth-mode \.face--top/);
  assert.match(originalExperience, /cube\.classList\.add\('space-diagonal-mode'\)/);
  assert.match(originalExperience, /fx\.style\.overflow = 'visible'/);
  assert.match(originalExperience, /space-diagonal-line/);
  assert.match(originalExperience, /function buildDiagonalWireframe\(\)/);
  assert.match(originalExperience, /P\(4\) = 1\/6/);
  assert.match(originalExperience, /await jumpTo\(-150, -20, 900\)/);
  assert.doesNotMatch(originalExperience, /gradient at a point/);
  assert.match(mathematicsPage, /import \{ YearCube \} from '@\/features\/year-cube\/YearCube'/);
  assert.match(mathematicsPage, /<YearCube\s*\/>/);
  assert.doesNotMatch(mathematicsPage, /<MathsSyllabusScrollStory\s*\/>/);
});
