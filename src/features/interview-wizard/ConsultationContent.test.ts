import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const sourceUrl = new URL('./ConsultationContent.tsx', import.meta.url);
const cssUrl = new URL('./consultation-content.css', import.meta.url);
const projectRoot = new URL('../../../', import.meta.url);

test('composes the reference consultation cards with generated icon assets', () => {
  const source = readFileSync(sourceUrl, 'utf8');
  const styles = readFileSync(cssUrl, 'utf8');

  for (const className of [
    'consultation-how-card',
    'consultation-during-card',
    'consultation-after-card',
    'consultation-reassurance',
  ]) {
    assert.match(source, new RegExp(className));
    assert.match(styles, new RegExp(`\\.${className}`));
  }

  for (const asset of [
    'how-listen.png', 'how-understand.png', 'how-recommend.png', 'how-match.png', 'how-begin.png',
    'during-listen.png', 'during-student.png', 'during-clarify.png', 'during-pathway.png', 'during-direction.png',
    'after-recommend.png', 'after-match.png', 'after-begin.png', 'after-observe.png', 'after-adjust.png',
    'botanical-corner.png',
  ]) {
    assert.match(source, new RegExp(asset.replace('.', '\\.')));
    assert.ok(existsSync(new URL(`public/images/interview-consultation/${asset}`, projectRoot)));
  }
});

test('keeps consultation content semantic and connected in reading order', () => {
  const source = readFileSync(sourceUrl, 'utf8');

  assert.match(source, /<section[\s\S]*<article/);
  assert.match(source, /aria-label="Consultation journey"/);
  assert.match(source, /You don’t need to arrive with the answer/);
  assert.match(source, /consultation-arrow/);
});
