import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { TUTORS } from '../../data/teacherCatalogue.ts';
import { toDiscoveryRecord } from './tutorDiscovery.ts';

const layoutUrl = new URL('./tutorOrbitLayout.ts', import.meta.url);
const records = TUTORS.map(toDiscoveryRecord);

async function loadLayout() {
  assert.equal(
    existsSync(fileURLToPath(layoutUrl)),
    true,
    'expected the deterministic tutor orbit layout module to exist',
  );

  return import(layoutUrl.href);
}

test('publishes the four named subject systems in reading order', async () => {
  const { TUTOR_ORBIT_GROUPS } = await loadLayout();

  assert.deepEqual(TUTOR_ORBIT_GROUPS, [
    { id: 'mathematics', label: 'Mathematics' },
    { id: 'english', label: 'English' },
    { id: 'science', label: 'Science' },
    { id: 'foundations', label: 'Foundations' },
  ]);
});

test('assigns the complete catalogue to one deterministic home system', async () => {
  const { createTutorOrbitLayout } = await loadLayout();
  const first = createTutorOrbitLayout(records);
  const second = createTutorOrbitLayout(records);
  const reordered = createTutorOrbitLayout([...records].reverse());

  assert.equal(first.length, records.length);
  assert.equal(new Set(first.map(slot => slot.tutorId)).size, records.length);
  assert.deepEqual(first, second);
  assert.deepEqual(reordered, first, 'slot identity must not depend on discovery-record input order');
  assert.deepEqual(
    new Set(first.map(slot => slot.tutorId)),
    new Set(records.map(record => record.tutor.id)),
  );

  const validGroups = new Set(['mathematics', 'english', 'science', 'foundations']);
  for (const slot of first) {
    assert.equal(validGroups.has(slot.groupId), true, `${slot.tutorId} has an invalid home system`);
  }
});

test('places primary and broad English plus Mathematics educators in Foundations', async () => {
  const { createTutorOrbitLayout } = await loadLayout();
  const slotsByTutor = new Map<string, { groupId: string }>(
    createTutorOrbitLayout(records).map(slot => [slot.tutorId, slot]),
  );

  for (const record of records) {
    if (record.tutor.hasPrimary || record.tutor.primarySubject === 'both') {
      assert.equal(
        slotsByTutor.get(record.tutor.id)?.groupId,
        'foundations',
        `${record.tutor.name} should have Foundations as their single home system`,
      );
    }
  }
});

test('clears neutral and selected focus cards at minimum and maximum desktop widths', async () => {
  const { createTutorOrbitLayout } = await loadLayout();
  const slots = createTutorOrbitLayout(records);
  const stageHeight = 768;
  const desktopWidths = [988, 1440];
  const focusCards = [
    { name: 'neutral', maxWidth: 432, widthRatio: 0.34, height: 304 },
    { name: 'selected', maxWidth: 544, widthRatio: 0.42, height: 304 },
  ];
  const interactionScale = 1.1;
  const maximumDrift = 6;

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
        const radius = slot.size * interactionScale / 2 + maximumDrift;
        const portrait = {
          left: x - radius,
          right: x + radius,
          top: y - radius,
          bottom: y + radius,
        };
        const clearsCentre = portrait.right <= protectedRect.left
          || portrait.left >= protectedRect.right
          || portrait.bottom <= protectedRect.top
          || portrait.top >= protectedRect.bottom;

        assert.equal(
          clearsCentre,
          true,
          `${slot.tutorId} intrudes into the ${focusCard.name} focus card at ${stageWidth}px`,
        );
        assert.ok(portrait.left >= 0 && portrait.right <= stageWidth, `${slot.tutorId} exceeds the stage width`);
        assert.ok(portrait.top >= 0 && portrait.bottom <= stageHeight, `${slot.tutorId} exceeds the stage height`);
      }
    }
  }
});

test('separates every unique slot by the two portrait radii plus an eight pixel gutter', async () => {
  const { createTutorOrbitLayout } = await loadLayout();
  const slots = createTutorOrbitLayout(records);
  const stageWidth = 1440;
  const stageHeight = 768;

  for (let firstIndex = 0; firstIndex < slots.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < slots.length; secondIndex += 1) {
      const first = slots[firstIndex];
      const second = slots[secondIndex];
      const dx = stageWidth * (first.x - second.x) / 100;
      const dy = stageHeight * (first.y - second.y) / 100;
      const distance = Math.hypot(dx, dy);
      const requiredDistance = (first.size + second.size) / 2 + 8;

      assert.ok(
        distance >= requiredDistance,
        `${first.tutorId} and ${second.tutorId} are only ${distance.toFixed(1)}px apart`,
      );
    }
  }
});
