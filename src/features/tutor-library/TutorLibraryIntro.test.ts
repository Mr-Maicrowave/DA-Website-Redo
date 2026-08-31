import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const intro = readFileSync(new URL('./TutorLibraryIntro.tsx', import.meta.url), 'utf8');
const completeShelf = readFileSync(new URL('../../../public/dev/complete-shelf-reference/index.html', import.meta.url), 'utf8');

test('Tutor Library intro hosts the direct single-book Complete Shelf variant without a DOM reading overlay', () => {
  assert.match(intro, /complete-shelf-reference\/index\.html\?variant=tutor-intro/);
  assert.match(intro, /<iframe/);
  assert.doesNotMatch(intro, /SpreadCopy|SingleShelfBay|CompleteShelfRigBridge/);
});

test('Complete Shelf exposes one tutor-selection volume and signals when its last page is reached', () => {
  assert.match(completeShelf, /get\("variant"\).*tutor-intro/);
  assert.match(completeShelf, /3,000 Apply/);
  assert.match(completeShelf, /Around 15 Are Chosen/);
  assert.match(completeShelf, /Before a DA tutor ever meets your child, they have already passed through one of the most demanding parts of becoming a DA educator: our selection process\./);
  assert.match(completeShelf, /color: "#eeeae2"/);
  assert.match(completeShelf, /const TUTOR_INTRO_COPY_FONT = '600 22px Arial, "Helvetica Neue", sans-serif'/);
  assert.match(completeShelf, /const TUTOR_INTRO_COPY_INK = "#1a314c"/);
  const tutorIntroPages = completeShelf.match(/if \(IS_TUTOR_INTRO\) \{[\s\S]*?return configureCanvasTexture\(new THREE\.CanvasTexture\(canvas\), \{ anisotropy: 16 \}\);/)?.[0] ?? '';
  assert.ok(tutorIntroPages, 'Expected the tutor intro page renderer');
  assert.doesNotMatch(tutorIntroPages, /600 16px Arial/, 'Tutor intro copy must not fall back to smaller text');
  assert.doesNotMatch(tutorIntroPages, /globalAlpha = 0\.[0-9]+[\s\S]{0,160}drawWrappedCanvasText/, 'Tutor intro copy must not use faded ink');
  assert.match(completeShelf, /Some things can be trained\./);
  assert.match(completeShelf, /Genuine care cannot be manufactured\. It has to be there from the beginning\./);
  assert.match(completeShelf, /For every child entrusted to us\./);
  assert.match(completeShelf, /function makeCoverTexture\(book\)[\s\S]*da-logo-full\.png/);
  assert.match(completeShelf, /ctx\.fillText\(book\.title, foilCanvas\.width \/ 2, foilCanvas\.height \* 0\.72\)/);
  assert.doesNotMatch(completeShelf, /audioControls\.hidden = IS_TUTOR_INTRO/);
  assert.doesNotMatch(completeShelf, /html\.tutor-intro \.audio-controls\s*\{[^}]*display:\s*none/);
  assert.match(completeShelf, /IMAGE PLACEHOLDER/);
  assert.match(completeShelf, /parent\.postMessage/);
  assert.match(completeShelf, /tutor-intro-complete/);
});

test('Tutor intro boot modules are served from this deployment instead of an external CDN', () => {
  const importMapSource = completeShelf.match(/<script type="importmap">\s*([\s\S]*?)<\/script>/)?.[1];
  assert.ok(importMapSource, 'Expected the Tutor intro to define an import map');

  const imports = JSON.parse(importMapSource).imports as Record<string, string>;
  const moduleImports = [...completeShelf.matchAll(/from "(three(?:\/addons\/[^\"]+)?)"/g)].map(match => match[1]);
  const publicRoot = fileURLToPath(new URL('../../../public/', import.meta.url));

  for (const moduleImport of moduleImports) {
    const exactMapping = imports[moduleImport];
    const prefix = Object.keys(imports).find(key => key.endsWith('/') && moduleImport.startsWith(key));
    const mappedUrl = exactMapping ?? (prefix ? `${imports[prefix]}${moduleImport.slice(prefix.length)}` : undefined);

    assert.ok(mappedUrl, `Expected an import-map entry for ${moduleImport}`);
    assert.doesNotMatch(mappedUrl, /^https?:\/\//, `${moduleImport} must not depend on a third-party network request`);
    assert.ok(
      existsSync(join(publicRoot, mappedUrl.replace(/^\//, ''))),
      `Expected ${mappedUrl} to be included in the deployed public assets`,
    );
  }
});
