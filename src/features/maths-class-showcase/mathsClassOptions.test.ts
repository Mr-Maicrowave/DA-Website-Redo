import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { mathsClassOptions } from './mathsClassOptions.ts';

test('maths class showcase provides the four selectable DA maths formats with complete detail panels', () => {
  assert.deepEqual(
    mathsClassOptions.map((option) => option.title),
    ['Private Maths Tuition', 'Small-Group Maths Classes', 'School Focus Classes', 'Selective & Trial Preparation'],
  );

  for (const option of mathsClassOptions) {
    assert.ok(option.short.length > 0);
    assert.ok(option.description.length > 80);
    assert.ok(option.image.startsWith('/english-page/images/subjects/english/'));
    assert.equal(option.stats.length, 4);
  }
});

test('selecting a maths class softly introduces its new detail panel', () => {
  const component = readFileSync(new URL('./MathsClassShowcase.tsx', import.meta.url), 'utf8');
  const styles = readFileSync(new URL('./maths-class-showcase.css', import.meta.url), 'utf8');

  assert.match(component, /className="maths-class-detail-content" key=\{active\.title\}/);
  assert.match(styles, /\.maths-class-detail-content\{animation:maths-class-detail-in/);
  assert.match(styles, /@keyframes maths-class-detail-in/);
  assert.match(styles, /@media \(prefers-reduced-motion:reduce\).*\.maths-class-detail-content\{animation:none\}/s);
});

test('uses a wide, right-anchored desktop composition without squeezing the class heading', () => {
  const styles = readFileSync(new URL('./maths-class-showcase.css', import.meta.url), 'utf8');

  assert.match(styles, /\.maths-classes__inner\{width:min\(1720px,calc\(100% - clamp\(40px,6vw,120px\)\)\);margin:0 auto/);
  assert.match(styles, /\.maths-class-showcase-shell\{display:grid;grid-template-columns:minmax\(290px,\.29fr\) minmax\(0,\.71fr\)/);
});
