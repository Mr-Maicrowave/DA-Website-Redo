import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const componentUrl = new URL('./MathematicalFieldStation.tsx', import.meta.url);
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('mounts The Sightings as a native full-screen Mathematics page chapter', () => {
  assert.equal(existsSync(componentUrl), true, 'MathematicalFieldStation.tsx must provide the native integration');
  assert.equal(existsSync(resolve(process.cwd(), 'public/interactive/mathematical-field-station/index.html')), true, 'The original field-station reference must remain available');

  const component = readFileSync(componentUrl, 'utf8');
  const mathematicsPage = readFileSync(mathematicsUrl, 'utf8');

  assert.match(component, /The Sightings/);
  assert.match(component, /Interactive Mathematical Field Station/);
  assert.doesNotMatch(component, /<iframe/);
  assert.match(component, /min-h-\[100dvh\]/);
  assert.match(component, /field-station-native/);
  assert.match(mathematicsPage, /import \{ MathematicalFieldStation \} from '@\/features\/mathematical-field-station\/MathematicalFieldStation'/);
  assert.match(mathematicsPage, /<MathematicalFieldStation\s*\/>/);
});
