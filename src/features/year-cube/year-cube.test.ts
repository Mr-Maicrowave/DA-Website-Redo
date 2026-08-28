import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./YearCube.tsx', import.meta.url);
const mathematicsPageUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('replaces the maths scroll story with an accessible Years 7–12 cube', () => {
  assert.equal(existsSync(componentUrl), true, 'YearCube.tsx must provide the Mathematics page replacement');

  const source = readFileSync(componentUrl, 'utf8');
  const mathematicsPage = readFileSync(mathematicsPageUrl, 'utf8');

  assert.match(source, /Choose a year level/);
  assert.match(source, /Drag the cube/);
  assert.match(source, /Pause drift/);
  assert.match(source, /const YEARS = \[7, 8, 9, 10, 11, 12\]/);
  assert.match(source, /onPointerDown/);
  assert.match(source, /onKeyDown/);
  assert.match(mathematicsPage, /import \{ YearCube \} from '@\/features\/year-cube\/YearCube'/);
  assert.match(mathematicsPage, /<YearCube\s*\/>/);
  assert.doesNotMatch(mathematicsPage, /<MathsSyllabusScrollStory\s*\/>/);
});
