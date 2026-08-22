import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { TUTORS } from '../../data/teacherCatalogue.ts';
import { toDiscoveryRecord } from './tutorDiscovery.ts';

const layoutUrl = new URL('./tutorOrbitLayout.ts', import.meta.url);
const records = TUTORS.map(toDiscoveryRecord);

async function loadLayout() {
  assert.equal(existsSync(fileURLToPath(layoutUrl)), true);
  return import(layoutUrl.href);
}

test('publishes exactly three real subject bodies in reading order', async () => {
  const { TUTOR_ORBIT_GROUPS } = await loadLayout();
  assert.deepEqual(TUTOR_ORBIT_GROUPS, [
    { id: 'mathematics', label: 'Mathematics', anchorTutorId: 'T011' },
    { id: 'english', label: 'English', anchorTutorId: 'T005' },
    { id: 'science', label: 'Science', anchorTutorId: 'T010' },
  ]);
});

test('assigns the complete catalogue to one deterministic home or bridge placement', async () => {
  const { createTutorOrbitLayout } = await loadLayout();
  const first = createTutorOrbitLayout(records);
  const second = createTutorOrbitLayout(records);
  const reordered = createTutorOrbitLayout([...records].reverse());
  assert.equal(first.length, records.length);
  assert.equal(new Set(first.map(slot => slot.tutorId)).size, records.length);
  assert.deepEqual(first, second);
  assert.deepEqual(reordered, first, 'slot identity must not depend on input order');
  assert.deepEqual(new Set(first.map(slot => slot.tutorId)), new Set(records.map(record => record.tutor.id)));

  const validPlacements = new Set(['mathematics', 'english', 'science', 'maths-english-bridge', 'maths-science-bridge']);
  for (const slot of first) {
    assert.equal(validPlacements.has(slot.placementId), true, `${slot.tutorId} has an invalid placement`);
    assert.notEqual(slot.placementId, 'foundations');
  }
});

test('uses one lead anchor per subject body and authored bridges for broad-subject tutors', async () => {
  const { createTutorOrbitLayout } = await loadLayout();
  const slots = createTutorOrbitLayout(records);
  const anchors = slots.filter(slot => slot.isAnchor);
  assert.deepEqual(
    anchors.map(slot => [slot.placementId, slot.tutorId]),
    [['mathematics', 'T011'], ['english', 'T005'], ['science', 'T010']],
  );

  for (const record of records) {
    const tutorSlot = slots.find(slot => slot.tutorId === record.tutor.id);
    if (record.tutor.primarySubject === 'both' && record.tutor.hasPrimary) {
      assert.equal(tutorSlot?.placementId, 'maths-english-bridge');
    }
    if (record.tutor.primarySubject === 'science' && record.subjects.includes('maths')) {
      assert.equal(tutorSlot?.placementId, 'maths-science-bridge');
    }
  }
});

test('keeps Primary as K–6 eligibility rather than a fourth portrait group', async () => {
  const { createTutorOrbitLayout } = await loadLayout();
  const slots = createTutorOrbitLayout(records);
  const primaryIds = new Set(records.filter(record => record.tutor.hasPrimary).map(record => record.tutor.id));
  assert.ok(primaryIds.size > 0);
  for (const slot of slots) assert.doesNotMatch(slot.placementId, /primary|foundation/i);
  assert.equal(slots.filter(slot => primaryIds.has(slot.tutorId)).length, primaryIds.size);
});

test('clears neutral and selected focus cards across supported desktop widths', async () => {
  const { createTutorOrbitLayout } = await loadLayout();
  const slots = createTutorOrbitLayout(records);
  const stageHeight = 768;
  const desktopWidths = [1061, 1440];
  const focusCards = [
    { name: 'neutral', maxWidth: 432, widthRatio: 0.34, height: 304 },
    { name: 'selected', maxWidth: 544, widthRatio: 0.42, height: 304 },
  ];
  for (const stageWidth of desktopWidths) {
    for (const focusCard of focusCards) {
      const cardWidth = Math.min(focusCard.maxWidth, stageWidth * focusCard.widthRatio);
      const protectedRect = {
        left: (stageWidth - cardWidth) / 2,
        right: (stageWidth + cardWidth) / 2,
        top: (stageHeight - focusCard.height) / 2,
        bottom: (stageHeight + focusCard.height) / 2,
      };
      for (const slot of slots) {
        const x = stageWidth * slot.x / 100;
        const y = stageHeight * slot.y / 100;
        const radius = slot.size * 1.1 / 2 + 6;
        const portrait = { left: x - radius, right: x + radius, top: y - radius, bottom: y + radius };
        const clearsCentre = portrait.right <= protectedRect.left || portrait.left >= protectedRect.right
          || portrait.bottom <= protectedRect.top || portrait.top >= protectedRect.bottom;
        assert.equal(clearsCentre, true, `${slot.tutorId} intrudes into ${focusCard.name} at ${stageWidth}px`);
        assert.ok(portrait.left >= 0 && portrait.right <= stageWidth, `${slot.tutorId} exceeds stage width`);
        assert.ok(portrait.top >= 0 && portrait.bottom <= stageHeight, `${slot.tutorId} exceeds stage height`);
      }
    }
  }
});

test('separates every portrait at the minimum desktop layout width', async () => {
  const { createTutorOrbitLayout } = await loadLayout();
  const slots = createTutorOrbitLayout(records);
  const stageWidth = 1061;
  const stageHeight = 768;
  for (let firstIndex = 0; firstIndex < slots.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < slots.length; secondIndex += 1) {
      const first = slots[firstIndex];
      const second = slots[secondIndex];
      const distance = Math.hypot(stageWidth * (first.x - second.x) / 100, stageHeight * (first.y - second.y) / 100);
      const requiredDistance = (first.size + second.size) / 2 + 6;
      assert.ok(distance >= requiredDistance, `${first.tutorId} and ${second.tutorId} are only ${distance.toFixed(1)}px apart`);
    }
  }
});
