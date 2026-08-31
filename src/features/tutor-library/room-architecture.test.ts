import assert from 'node:assert/strict';
import test from 'node:test';
import { createCabinetBlueprint, getSubjectWallLabelPose } from './room-architecture.ts';

test('defines a recessed built-in cabinet rather than a flat shelf wall', () => {
  const cabinet = createCabinetBlueprint(16, 5.8);

  assert.ok(cabinet.recessDepth >= 0.6, 'books need a meaningful recess behind the front frame');
  assert.ok(cabinet.shelfDepth > cabinet.recessDepth, 'shelf boards must run from the back panel to the front lip');
  assert.ok(cabinet.shelfThickness >= 0.12, 'shelves need readable board thickness');
  assert.ok(cabinet.frameDepth > cabinet.recessDepth, 'outer frame must project beyond the book recess');
  assert.equal(cabinet.bays.length, 3, 'the resting wall uses three generous cabinet bays');
  assert.ok(cabinet.bays.every(bay => bay.width > 3 && bay.bookBackZ < bay.bookFrontZ));
});

test('defines a layered cabinetmaker construction rather than raw box shelving', () => {
  const cabinet = createCabinetBlueprint(16, 5.8);

  assert.ok(cabinet.nosingDepth >= .06, 'shelf fronts need a visible profiled nosing');
  assert.ok(cabinet.panelInset >= .04, 'backing must sit behind its face-frame rails');
  assert.ok(cabinet.corniceDepth > cabinet.frameDepth, 'cornice should project beyond the cabinet face');
  assert.ok(cabinet.plinthHeight >= .2, 'cabinet base needs a readable architectural plinth');
});

test('mounts the subject label on the visible face of the projecting cornice', () => {
  const cabinet = createCabinetBlueprint(16, 5.8);
  const pose = getSubjectWallLabelPose(cabinet, 5.8);

  assert.ok(pose[2] > .45 + cabinet.corniceDepth, 'the label must sit in front of the deepest cornice layer');
  assert.ok(pose[1] <= 5.8 / 2 - .48, 'the complete title needs safe clearance below the viewport ceiling');
  assert.ok(pose[1] > 5.8 / 2 - .7, 'the label must remain directly above the cabinet header');
});
