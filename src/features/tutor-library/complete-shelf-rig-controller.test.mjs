import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

class TestCanvas extends EventTarget {
  width = 0;
  height = 0;
  context = createCanvasContext(this);
  getContext() { return this.context; }
}

function createCanvasContext(canvas) {
  const noOp = () => undefined;
  return {
    canvas,
    fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1,
    textAlign: 'left', textBaseline: 'alphabetic', font: '',
    fillRect: noOp, strokeRect: noOp, clearRect: noOp, fillText: noOp,
    beginPath: noOp, closePath: noOp, moveTo: noOp, lineTo: noOp,
    bezierCurveTo: noOp, quadraticCurveTo: noOp, arc: noOp, stroke: noOp, fill: noOp,
    save: noOp, restore: noOp, translate: noOp, rotate: noOp, scale: noOp,
    drawImage: noOp, putImageData: noOp,
    createImageData: (width, height) => ({ data: new Uint8ClampedArray(width * height * 4), width, height }),
    createLinearGradient: () => ({ addColorStop: noOp }),
    createRadialGradient: () => ({ addColorStop: noOp }),
    measureText: value => ({ width: String(value).length * 8 }),
  };
}

const originalDocument = globalThis.document;
Object.assign(globalThis, { document: { createElement: () => new TestCanvas() } });
const rigModuleUrl = new URL('../../../public/dev/complete-shelf-rig/complete-shelf-book-rig.js', import.meta.url);
const publicRoot = new URL('../../../public/', import.meta.url);
const resolvePublicImport = path => new URL(`.${path}`, publicRoot).href;
const rigSource = (await readFile(rigModuleUrl, 'utf8'))
  .replaceAll("'/dev/complete-shelf-rig/vendor/three.module.js'", `'${resolvePublicImport('/dev/complete-shelf-rig/vendor/three.module.js')}'`)
  .replaceAll("'/dev/complete-shelf-rig/vendor/RoundedBoxGeometry.js'", `'${resolvePublicImport('/dev/complete-shelf-rig/vendor/RoundedBoxGeometry.js')}'`)
  .replaceAll("'/dev/complete-shelf-rig/complete-shelf-presentation-seam.js'", `'${resolvePublicImport('/dev/complete-shelf-rig/complete-shelf-presentation-seam.js')}'`);
const { createCompleteShelfBookRig } = await import(`data:text/javascript;base64,${Buffer.from(rigSource).toString('base64')}`);

test.after(() => Object.assign(globalThis, { document: originalDocument }));

const renderer = { capabilities: { getMaxAnisotropy: () => 1 } };
const settleGeometry = controller => {
  for (let frame = 0; frame < 240; frame += 1) controller.update(1 / 60);
};

test('keeps a concise one-turn reader boundary while all six physical leaves reset before return', () => {
  const rig = createCompleteShelfBookRig({ renderer });
  const { controller } = rig;

  controller.setOpenProgress(1);
  assert.equal(controller.setPageTurnProgress(1, 1), true);
  assert.equal(controller.settlePage(1), true);
  assert.equal(controller.getSnapshot().pageSettled, false, 'command completion is not physical settling');
  assert.equal(controller.setPageTurnProgress(0, 1), false, 'zero progress cannot clear an in-flight physical settle');
  assert.equal(controller.setPageTurnProgress(.5, 1), false, 'another turn is rejected while geometry is still settling');
  settleGeometry(controller);
  assert.equal(controller.getSnapshot().pageSettled, true, 'the target pivot and deformation settle within epsilon');
  assert.equal(controller.getSnapshot().settledPages, 1, 'a physically settled page stays settled between explicit actions');

  assert.equal(controller.setPageTurnProgress(1, -1), true);
  assert.equal(controller.settlePage(-1), true);
  assert.equal(controller.getSnapshot().settledPages, 0, 'Previous reverses the settled leaf');

  settleGeometry(controller);
  assert.equal(controller.setPageTurnProgress(1, 1), true, 'the only forward page begins');
  assert.equal(controller.settlePage(1), true, 'the only forward page settles');
  settleGeometry(controller);
  assert.equal(controller.getSnapshot().settledPages, 1);
  assert.equal(controller.getSnapshot().paginatedLeafCount, 1);
  assert.equal(controller.setPageTurnProgress(1, 1), false, 'a second out-of-range turn is rejected');

  controller.close();
  settleGeometry(controller);
  controller.reset();
  const reset = controller.getSnapshot();
  assert.equal(reset.pagePivotCount, 6);
  assert.equal(reset.openProgress, 0);
  assert.equal(reset.pageTurnProgress, 0);
  assert.equal(reset.settledPages, 0);
  assert.equal(reset.deformationReset, true);
  rig.dispose();
});

test('maps the six presentation canvases directly onto the six existing leaf materials', () => {
  const interiors = Array.from({ length: 6 }, () => new TestCanvas());
  const presentation = {
    tutorId: 'T003',
    sources: { interiors },
    colours: { paper: '#f2eadc' },
  };
  const rig = createCompleteShelfBookRig({ renderer, presentation });

  interiors.forEach((source, leafOrder) => {
    const pivot = rig.root.getObjectByName(`codex-page-${5 - leafOrder}`);
    assert.ok(pivot, `leaf ${leafOrder} exists`);
    assert.equal(pivot.getObjectByName(`codex-page-sheet-${5 - leafOrder}-front`).material.map.image, source);
    assert.equal(pivot.getObjectByName(`codex-page-sheet-${5 - leafOrder}-back`).material.map.image, source);
  });
  rig.dispose();
});
