import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const componentUrl = new URL('./MathematicalFieldStation.tsx', import.meta.url);
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('embeds The Sightings field station on the Mathematics page', () => {
  assert.equal(existsSync(componentUrl), true, 'MathematicalFieldStation.tsx must provide the standalone integration');
  assert.equal(existsSync(resolve(process.cwd(), 'public/interactive/mathematical-field-station/index.html')), true, 'The Sightings standalone entry point is missing');

  const component = readFileSync(componentUrl, 'utf8');
  const mathematicsPage = readFileSync(mathematicsUrl, 'utf8');

  assert.match(component, /The Sightings/);
  assert.match(component, /Interactive Mathematical Field Station/);
  assert.match(component, /src="\/interactive\/mathematical-field-station\/index\.html"/);
  assert.match(mathematicsPage, /import \{ MathematicalFieldStation \} from '@\/features\/mathematical-field-station\/MathematicalFieldStation'/);
  assert.match(mathematicsPage, /<MathematicalFieldStation\s*\/>/);
});
