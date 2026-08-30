import assert from 'node:assert/strict';
import test from 'node:test';

import { TUTORS } from '../../data/teacherCatalogue.ts';
import {
  COMPLETE_SHELF_VISIBLE_ROWS,
  advanceCompleteShelfOuterMotion,
  createCompleteShelfBookPool,
  createMountedRigRootRegistry,
  createCompleteShelfClosedHandoff,
  createCompleteShelfOuterMotionState,
  getCompleteShelfOuterMotionPose,
  isCompleteShelfControllerOpeningAllowed,
  selectVisibleShelfEditions,
  shouldAcquireCompleteShelfRig,
} from './complete-shelf-book-pool.ts';
import { createTutorBookEditions } from './tutor-library-data.ts';
import { createLibraryState, libraryReducer, type LibraryEvent, type LibraryState } from './tutor-library-state.ts';

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

test('revisits an evicted tutor with only the newly mounted root through reset and return', async () => {
  const pool = createCompleteShelfBookPool<FakeRig>({ maxDormantRigs: 3 });
  const mountedRoots = createMountedRigRootRegistry();
  const creationCount = new Map<string, number>();
  const createRig = (editionId: string) => async () => {
    const count = (creationCount.get(editionId) ?? 0) + 1;
    creationCount.set(editionId, count);
    return { root: { uuid: `${editionId}:root:${count}` }, dispose() {} };
  };

  for (const editionId of ['book-a', 'book-b', 'book-c', 'book-d']) {
    const lease = pool.acquire(editionId, createRig(editionId));
    const rig = await lease.rig;
    mountedRoots.mount(editionId, rig.root.uuid);
    assert.equal(mountedRoots.get(editionId), rig.root.uuid);
    mountedRoots.unmount(editionId, rig.root.uuid);
    lease.release();
  }

  assert.equal(pool.peek('book-a'), undefined, 'book A must be evicted after more than three dormant tutors');
  assert.equal(mountedRoots.get('book-a'), undefined, 'an unmounted root can never remain an interaction identity');

  const revisit = pool.acquire('book-a', createRig('book-a'));
  const nextRig = await revisit.rig;
  mountedRoots.mount('book-a', nextRig.root.uuid);
  assert.equal(nextRig.root.uuid, 'book-a:root:2');
  assert.equal(mountedRoots.get('book-a'), 'book-a:root:2');

  const complete = (state: LibraryState, event: Omit<LibraryEvent, 'generation'>) =>
    libraryReducer(state, { ...event, generation: state.transitionGeneration } as LibraryEvent);
  let state = libraryReducer(createLibraryState('primary'), {
    type: 'HOVER', editionId: 'book-a', rootUuid: mountedRoots.get('book-a')!,
  });
  state = complete(state, { type: 'EXTRACT' } as Omit<LibraryEvent, 'generation'>);
  state = complete(state, { type: 'PREVIEW_READY' } as Omit<LibraryEvent, 'generation'>);
  state = libraryReducer(state, { type: 'OPEN' });
  state = complete(state, { type: 'READING_POSE_READY' } as Omit<LibraryEvent, 'generation'>);
  state = complete(state, { type: 'OPEN_COMPLETE' } as Omit<LibraryEvent, 'generation'>);
  state = libraryReducer(state, { type: 'CLOSE' });
  state = complete(state, { type: 'CLOSE_COMPLETE' } as Omit<LibraryEvent, 'generation'>);
  state = complete(state, {
    type: 'RESET_COMPLETE',
    controller: {
      rootUuid: nextRig.root.uuid, closeComplete: true, resetComplete: true,
      openProgress: 0, pageTurnProgress: 0, settledPages: 0, deformationReset: true,
    },
  } as Omit<LibraryEvent, 'generation'>);
  state = complete(state, { type: 'RETURN_COMPLETE' } as Omit<LibraryEvent, 'generation'>);
  assert.equal(state.phase, 'ROOM_IDLE');
  revisit.release();
});

test('keeps retained and leased rigs bounded under hostile pointer sweeps', async () => {
  const disposed: string[] = [];
  const pool = createCompleteShelfBookPool<FakeRig>({ maxDormantRigs: 3 });
  for (let index = 0; index < 20; index += 1) {
    const editionId = `sweep-${index}`;
    const lease = pool.acquire(editionId, async () => ({
      root: { uuid: `root:${editionId}` },
      dispose: () => disposed.push(editionId),
    }));
    await lease.rig;
    const leasedSnapshot = pool.getSnapshot();
    assert.ok(leasedSnapshot.retainedRigs <= 4, 'three dormant rigs plus one intent lease is the hard maximum');
    assert.equal(leasedSnapshot.leasedRigs, 1);
    lease.release();
    const snapshot = pool.getSnapshot();
    assert.ok(snapshot.retainedRigs <= 3);
    assert.equal(snapshot.leasedRigs, 0);
  }
  assert.equal(disposed.length, 17);
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
  const productionState = createCompleteShelfOuterMotionState(jenny);

  assert.deepEqual(handoff.proxy, handoff.rig);
  assert.deepEqual(productionState.pose, handoff.rig);
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

test('holds the sampled outer pose through close and reset before returning', () => {
  const jenny = createTutorBookEditions(TUTORS).find((edition) => edition.id === 'T003:primary')!;
  let motion = createCompleteShelfOuterMotionState(jenny);
  motion = advanceCompleteShelfOuterMotion(motion, 'BOOK_OPENING', 0);
  const interrupted = motion.pose;
  motion = advanceCompleteShelfOuterMotion(motion, 'BOOK_CLOSING', 0);
  assert.deepEqual(motion.pose, interrupted, 'close holds the exact current reading pose');
  motion = advanceCompleteShelfOuterMotion(motion, 'BOOK_RESETTING', 0);
  assert.deepEqual(motion.pose, interrupted, 'reset cannot teleport from reading to preview');
  motion = advanceCompleteShelfOuterMotion(motion, 'BOOK_RETURNING', 0);
  assert.deepEqual(motion.pose, interrupted);
  motion = advanceCompleteShelfOuterMotion(motion, 'BOOK_RETURNING', 1);
  assert.deepEqual(motion.pose, createCompleteShelfClosedHandoff(jenny).rig);
});

test('holds exact hover/extraction samples for leave and Escape at several progress points', () => {
  const jenny = createTutorBookEditions(TUTORS).find((edition) => edition.id === 'T003:primary')!;
  const cases = [
    { reason: 'leave-hover', phase: 'BOOK_HOVER_INTENT' as const, progress: 0 },
    { reason: 'escape-early', phase: 'BOOK_EXTRACTING' as const, progress: .17 },
    { reason: 'leave-mid', phase: 'BOOK_EXTRACTING' as const, progress: .49 },
    { reason: 'escape-late', phase: 'BOOK_EXTRACTING' as const, progress: .83 },
    { reason: 'close-preview', phase: 'BOOK_PREVIEW' as const, progress: 1 },
    { reason: 'close-reading-transit', phase: 'BOOK_TO_READING' as const, progress: .37 },
  ];

  for (const entry of cases) {
    let motion = createCompleteShelfOuterMotionState(jenny);
    motion = advanceCompleteShelfOuterMotion(motion, entry.phase, entry.progress);
    const interrupted = motion.pose;
    motion = advanceCompleteShelfOuterMotion(motion, 'BOOK_RESETTING', 0);
    assert.deepEqual(motion.pose, interrupted, entry.reason);
    motion = advanceCompleteShelfOuterMotion(motion, 'BOOK_RETURNING', 0);
    assert.deepEqual(motion.pose, interrupted, `${entry.reason} return origin`);
  }
});

test('allows exactly one global intent/selected rig and blocks non-idle pointer sweeps', () => {
  const editionIds = Array.from({ length: 76 }, (_, index) => `book-${index}`);
  for (const intentEditionId of editionIds) {
    const roomIdleOwners = editionIds.filter((editionId) => shouldAcquireCompleteShelfRig({
      phase: 'ROOM_IDLE',
      editionId,
      intentEditionId,
    }));
    assert.deepEqual(roomIdleOwners, [intentEditionId]);
  }

  const selectedEditionId = 'book-3';
  const hostileOwners = editionIds.filter((editionId) => shouldAcquireCompleteShelfRig({
    phase: 'BOOK_EXTRACTING',
    editionId,
    intentEditionId: 'book-70',
    selectedEditionId,
  }));
  assert.deepEqual(hostileOwners, [selectedEditionId]);
});

test('keeps hover lightweight and reserves full-rig acquisition for explicit activation', async () => {
  const module = await import('./complete-shelf-book-pool.ts');
  assert.equal(
    typeof module.shouldStartCompleteShelfRigIntent,
    'function',
    'the production pointer boundary must distinguish hover from activation',
  );
  const shouldStart = module.shouldStartCompleteShelfRigIntent!;

  assert.equal(shouldStart('hover', 'ROOM_IDLE', false), false, 'hover must never construct the page rig');
  assert.equal(shouldStart('activate', 'ROOM_IDLE', false), true, 'click or tap may request the rig');
  assert.equal(shouldStart('activate', 'BOOK_EXTRACTING', false), false, 'transitions reject competing requests');
  assert.equal(shouldStart('activate', 'ROOM_IDLE', true), false, 'the selected book already owns its rig');
});
