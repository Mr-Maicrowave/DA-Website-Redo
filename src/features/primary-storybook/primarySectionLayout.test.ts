import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import postcss from 'postcss';

const landscapeCss = readFileSync(new URL('./primary-landscape-journey.css', import.meta.url), 'utf8');
const storybookCss = readFileSync(new URL('./primary-storybook.css', import.meta.url), 'utf8');
const referenceCss = readFileSync(new URL('./primary-reference.css', import.meta.url), 'utf8');

const declarationsFor = (css: string, selector: string) => {
  const declarations = new Map<string, string>();
  postcss.parse(css).walkRules((rule) => {
    if (rule.parent?.type === 'atrule' || !rule.selectors.includes(selector)) return;
    rule.walkDecls((declaration) => {
      declarations.set(declaration.prop, declaration.value);
    });
  });
  return declarations;
};

test('the landscape shows the complete artwork instead of cropping it into one viewport', () => {
  const section = declarationsFor(landscapeCss, '.primary-landscape-journey');
  const viewport = declarationsFor(landscapeCss, '.primary-landscape-journey__viewport');
  const image = declarationsFor(landscapeCss, '.primary-landscape-journey__image');

  assert.equal(section.get('height'), 'auto');
  assert.equal(viewport.get('position'), 'relative');
  assert.equal(viewport.get('aspect-ratio'), '1672 / 941');
  assert.equal(image.get('object-fit'), 'contain');
});

test('the hero handoff has no straight horizontal band', () => {
  const transition = declarationsFor(readFileSync(new URL('./primary-world-transition.css', import.meta.url), 'utf8'), '.primary-world-transition');
  assert.equal(transition.get('border-top'), undefined);
  assert.equal(transition.get('background'), 'transparent');
});

test('the aquarium uses a tighter immersive composition instead of a full-screen rectangle', () => {
  const aquarium = declarationsFor(`${storybookCss}\n${referenceCss}`, '.primary-aquarium');
  assert.equal(aquarium.get('height'), 'clamp(40.625rem, 76svh, 48.75rem)');
  assert.equal(aquarium.get('min-height'), '0');
  assert.equal(aquarium.get('border-radius'), undefined);
});
