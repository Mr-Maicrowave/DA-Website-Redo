import assert from 'node:assert/strict';
import test from 'node:test';

import { TUTORS } from '../../data/teacherCatalogue.ts';
import {
  COMPLETE_SHELF_VISIBLE_ROWS,
  createCompleteShelfBookPool,
  createCompleteShelfClosedHandoff,
  getCompleteShelfOuterMotionPose,
  isCompleteShelfControllerOpeningAllowed,
  selectVisibleShelfEditions,
} from './complete-shelf-book-pool.ts';
import { createTutorBookEditions } from './tutor-library-data.ts';

type FakeRig = {
  root: { uuid: string };
  dispose(): void;
};

test('lazily creates one retained physical root for each stable edition id', async () => {
  const created: string[] = [];
  const disposed: string[] = [];
  const pool = createCompleteShelfBookPool<FakeRig>({ maxDormantRigs: 2 });
  const createRig = (editionId: string) => async () => {
    created.push(editionId);
    return { root: { uuid: `root:${editionId}` }, dispose: () => disposed.push(editionId) };
  };

  assert.equal(pool.peek('T003:primary'), undefined, 'inactive proxies must not eagerly construct page rigs');
  const firstLease = pool.acquire('T003:primary', createRig('T003:primary'));
  const secondLease = pool.acquire('T003:primary', createRig('T003:primary'));
  const [first, second] = await Promise.all([firstLease.rig, secondLease.rig]);

  assert.equal(first, second);
  assert.equal(first.root.uuid, 'root:T003:primary');
  assert.deepEqual(created, ['T003:primary']);
  firstLease.release();
  secondLease.release();
  assert.deepEqual(disposed, []);
});

test('never evicts a leased active root and deterministically bounds dormant rigs', async () => {
  const disposed: string[] = [];
  const pool = createCompleteShelfBookPool<FakeRig>({ maxDormantRigs: 1 });
  const createRig = (editionId: string) => async () => ({
    root: { uuid: `root:${editionId}` },
    dispose: () => disposed.push(editionId),
  });

  const active = pool.acquire('active', createRig('active'));
  await active.rig;
  const dormantA = pool.acquire('dormant-a', createRig('dormant-a'));
  await dormantA.rig;
  dormantA.release();
  const dormantB = pool.acquire('dormant-b', createRig('dormant-b'));
  await dormantB.rig;
  dormantB.release();

  assert.equal((await active.rig).root.uuid, 'root:active');
  assert.deepEqual(disposed, ['dormant-a']);
  assert.equal(pool.peek('dormant-a'), undefined);
  assert.equal(pool.peek('dormant-b')?.root.uuid, 'root:dormant-b');
  active.release();
});

test('disposes a pending dormant rig exactly once when it resolves after eviction', async () => {
  let resolveRig!: (rig: FakeRig) => void;
  let disposeCount = 0;
  const pendingRig = new Promise<FakeRig>((resolve) => { resolveRig = resolve; });
  const pool = createCompleteShelfBookPool<FakeRig>({ maxDormantRigs: 0 });
  const lease = pool.acquire('pending', () => pendingRig);

  lease.release();
  resolveRig({ root: { uuid: 'root:pending' }, dispose: () => { disposeCount += 1; } });
  await lease.rig;

  assert.equal(disposeCount, 1);
  assert.equal(pool.peek('pending'), undefined);
});

test('uses proxies for only one deterministic edition per visible cabinet slot', () => {
  const editions = createTutorBookEditions(TUTORS);
  const primary = editions.filter((edition) => edition.wallId === 'primary');
  const mathematics = editions.filter((edition) => edition.wallId === 'mathematics');
  const visiblePrimary = selectVisibleShelfEditions(primary);
  const visibleMathematics = selectVisibleShelfEditions(mathematics);

  assert.equal(visiblePrimary[0].tutorId, 'T003', 'Jenny is the first Primary edition');
  assert.equal(visiblePrimary.length, COMPLETE_SHELF_VISIBLE_ROWS * 8);
  assert.equal(visibleMathematics.length, COMPLETE_SHELF_VISIBLE_ROWS * 8);
  for (const visible of [visiblePrimary, visibleMathematics]) {
    const slots = visible.map((edition) => `${Math.min(edition.shelfIndex, COMPLETE_SHELF_VISIBLE_ROWS - 1)}:${edition.slotIndex}`);
    assert.equal(new Set(slots).size, slots.length, 'no two visible editions occupy the same physical slot');
  }
});

test('selected overflow edition replaces only its collided proxy slot', () => {
  const primary = createTutorBookEditions(TUTORS).filter((edition) => edition.wallId === 'primary');
  const overflow = primary.at(-1)!;
  assert.ok(overflow.shelfIndex >= COMPLETE_SHELF_VISIBLE_ROWS);

  const baseline = selectVisibleShelfEditions(primary);
  const selected = selectVisibleShelfEditions(primary, overflow.id);
  assert.equal(selected.length, baseline.length);
  assert.ok(selected.some((edition) => edition.id === overflow.id));
  assert.equal(selected.filter((edition) => edition.slotIndex === overflow.slotIndex).length, COMPLETE_SHELF_VISIBLE_ROWS);
});

test('proxy and imperative rig share the exact closed outer transform', () => {
  const jenny = createTutorBookEditions(TUTORS).find((edition) => edition.id === 'T003:primary')!;
  const handoff = createCompleteShelfClosedHandoff(jenny);

  assert.deepEqual(handoff.proxy, handoff.rig);
  assert.notEqual(handoff.proxy, handoff.rig);
  assert.equal(handoff.rig.rotation[1], Math.PI / 2, 'closed shelf book is spine-out at the DA-owned outer root');
});

test('keeps the controller closed until the outer root reaches the clear reading pose', () => {
  assert.equal(isCompleteShelfControllerOpeningAllowed('BOOK_HOVER_INTENT'), false);
  assert.equal(isCompleteShelfControllerOpeningAllowed('BOOK_EXTRACTING'), false);
  assert.equal(isCompleteShelfControllerOpeningAllowed('BOOK_PREVIEW'), false);
  assert.equal(isCompleteShelfControllerOpeningAllowed('BOOK_TO_READING'), false);
  assert.equal(isCompleteShelfControllerOpeningAllowed('BOOK_OPENING'), true);
  assert.equal(isCompleteShelfControllerOpeningAllowed('BOOK_READING'), true);
});

test('drives only the outer pose and returns to the exact closed handoff', () => {
  const jenny = createTutorBookEditions(TUTORS).find((edition) => edition.id === 'T003:primary')!;
  const shelf = createCompleteShelfClosedHandoff(jenny).rig;
  const clearing = getCompleteShelfOuterMotionPose(jenny, 'BOOK_EXTRACTING', .48);
  const reading = getCompleteShelfOuterMotionPose(jenny, 'BOOK_OPENING', 0);
  const returned = getCompleteShelfOuterMotionPose(jenny, 'BOOK_RETURNING', 1);

  assert.ok(clearing.position[2] > shelf.position[2] + 1, 'whole closed book clears forward before opening');
  assert.ok(reading.position[2] > clearing.position[2]);
  assert.deepEqual(returned, shelf);
});
