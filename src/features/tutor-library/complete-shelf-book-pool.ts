import type { TutorBookEdition } from './tutor-library-data.ts';
import {
  createCompleteShelfPrototypePlan,
  sampleCompleteShelfPrototypePose,
  type CompleteShelfBookPose,
} from './complete-shelf-book-prototype.ts';
import { getShelfPose, type ShelfPose } from './tutor-book-geometry.ts';
import { createBookReturnMotion, interpolateBookMotion } from './tutor-book-motion.ts';
import type { LibraryPhase } from './tutor-library-state.ts';

export const COMPLETE_SHELF_VISIBLE_ROWS = 3;

export interface CompleteShelfPoolRig {
  root: { uuid: string };
  dispose(): void;
}

export interface CompleteShelfRigLease<TRig extends CompleteShelfPoolRig> {
  rig: Promise<TRig>;
  release(): void;
}

export interface MountedRigRootRegistry {
  mount(editionId: string, rootUuid: string): void;
  unmount(editionId: string, rootUuid: string): void;
  get(editionId: string): string | undefined;
}

export function createMountedRigRootRegistry(): MountedRigRootRegistry {
  const mountedRoots = new Map<string, string>();
  return {
    mount(editionId, rootUuid) {
      if (!editionId.trim() || !rootUuid.trim()) return;
      mountedRoots.set(editionId, rootUuid);
    },
    unmount(editionId, rootUuid) {
      if (mountedRoots.get(editionId) === rootUuid) mountedRoots.delete(editionId);
    },
    get(editionId) {
      return mountedRoots.get(editionId);
    },
  };
}

export interface CompleteShelfBookPool<TRig extends CompleteShelfPoolRig> {
  acquire(editionId: string, createRig: () => Promise<TRig>): CompleteShelfRigLease<TRig>;
  peek(editionId: string): TRig | undefined;
  getSnapshot(): { retainedRigs: number; leasedRigs: number };
  disposeAll(): void;
}

interface PoolEntry<TRig extends CompleteShelfPoolRig> {
  editionId: string;
  promise: Promise<TRig>;
  rig?: TRig;
  leases: number;
  lastUsed: number;
  disposed: boolean;
}

export function createCompleteShelfBookPool<TRig extends CompleteShelfPoolRig>(options: { maxDormantRigs?: number } = {}): CompleteShelfBookPool<TRig> {
  const maxDormantRigs = Math.max(0, Math.floor(options.maxDormantRigs ?? 3));
  const entries = new Map<string, PoolEntry<TRig>>();
  let clock = 0;

  const disposeEntry = (entry: PoolEntry<TRig>) => {
    if (entry.disposed) return;
    entry.disposed = true;
    entries.delete(entry.editionId);
    if (entry.rig) entry.rig.dispose();
    else void entry.promise.then((rig) => rig.dispose(), () => undefined);
  };

  const pruneDormant = () => {
    const dormant = [...entries.values()]
      .filter((entry) => entry.leases === 0)
      .sort((left, right) => left.lastUsed - right.lastUsed || left.editionId.localeCompare(right.editionId));
    while (dormant.length > maxDormantRigs) disposeEntry(dormant.shift()!);
  };

  return {
    acquire(editionId: string, createRig: () => Promise<TRig>): CompleteShelfRigLease<TRig> {
      if (!editionId.trim()) throw new Error('Complete Shelf edition id is required');
      let entry = entries.get(editionId);
      if (!entry) {
        const next: PoolEntry<TRig> = {
          editionId,
          promise: Promise.resolve().then(createRig),
          leases: 0,
          lastUsed: ++clock,
          disposed: false,
        };
        next.promise = next.promise.then((rig) => {
          next.rig = rig;
          return rig;
        }, (error: unknown) => {
          if (entries.get(editionId) === next) entries.delete(editionId);
          throw error;
        });
        entries.set(editionId, next);
        entry = next;
      }

      entry.leases += 1;
      entry.lastUsed = ++clock;
      let released = false;
      return {
        rig: entry.promise,
        release() {
          if (released) return;
          released = true;
          entry!.leases = Math.max(0, entry!.leases - 1);
          entry!.lastUsed = ++clock;
          pruneDormant();
        },
      };
    },
    peek(editionId: string): TRig | undefined {
      return entries.get(editionId)?.rig;
    },
    getSnapshot() {
      const retained = [...entries.values()];
      return {
        retainedRigs: retained.length,
        leasedRigs: retained.filter((entry) => entry.leases > 0).length,
      };
    },
    disposeAll() {
      [...entries.values()].forEach(disposeEntry);
    },
  };
}

const physicalSlotKey = (edition: TutorBookEdition) =>
  `${Math.min(edition.shelfIndex, COMPLETE_SHELF_VISIBLE_ROWS - 1)}:${edition.slotIndex}`;

export function selectVisibleShelfEditions(editions: readonly TutorBookEdition[], selectedEditionId?: string): TutorBookEdition[] {
  const selected = selectedEditionId ? editions.find((edition) => edition.id === selectedEditionId) : undefined;
  const winners = new Map<string, TutorBookEdition>();
  for (const edition of editions) {
    const key = physicalSlotKey(edition);
    if (!winners.has(key) || edition.id === selected?.id) winners.set(key, edition);
  }
  return [...winners.values()].sort((left, right) => {
    const leftRow = Math.min(left.shelfIndex, COMPLETE_SHELF_VISIBLE_ROWS - 1);
    const rightRow = Math.min(right.shelfIndex, COMPLETE_SHELF_VISIBLE_ROWS - 1);
    return leftRow - rightRow || left.slotIndex - right.slotIndex;
  });
}

export function createCompleteShelfClosedHandoff(edition: TutorBookEdition) {
  const shelf = createCompleteShelfPrototypePlan(getShelfPose(edition)).shelf;
  const clone = () => ({
    position: [...shelf.position] as [number, number, number],
    rotation: [...shelf.rotation] as [number, number, number],
    scale: [...shelf.scale] as [number, number, number],
  });
  return { proxy: clone(), rig: clone() };
}

const OPEN_CONTROLLER_PHASES = new Set<LibraryPhase>([
  'BOOK_OPENING',
  'BOOK_READING',
  'PAGE_DRAGGING',
  'PAGE_TURNING',
  'PAGE_SETTLED',
]);

export function isCompleteShelfControllerOpeningAllowed(phase: LibraryPhase) {
  return OPEN_CONTROLLER_PHASES.has(phase);
}

const interpolatePose = (from: CompleteShelfBookPose, to: CompleteShelfBookPose, progress: number) => {
  const t = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  const interpolate = (left: number, right: number) => left + (right - left) * t;
  return {
    position: from.position.map((value, index) => interpolate(value, to.position[index])) as CompleteShelfBookPose['position'],
    rotation: from.rotation.map((value, index) => interpolate(value, to.rotation[index])) as CompleteShelfBookPose['rotation'],
    scale: from.scale.map((value, index) => interpolate(value, to.scale[index])) as CompleteShelfBookPose['scale'],
  };
};

function createPlanForPose(edition: TutorBookEdition, shelfPose?: CompleteShelfBookPose) {
  if (!shelfPose) return createCompleteShelfPrototypePlan(getShelfPose(edition));
  const scale = shelfPose.scale[0];
  const syntheticShelfPose: ShelfPose = {
    position: [...shelfPose.position],
    rotation: [...shelfPose.rotation],
    width: .42,
    height: 1.58 * scale,
    depth: .31,
  };
  return createCompleteShelfPrototypePlan(syntheticShelfPose);
}

export function getCompleteShelfOuterMotionPose(edition: TutorBookEdition, phase: LibraryPhase, progress: number, shelfPose?: CompleteShelfBookPose): CompleteShelfBookPose {
  const plan = createPlanForPose(edition, shelfPose);
  const reading: CompleteShelfBookPose = {
    // Keep the reading volume dominant while balancing its opened width with
    // the companion controls instead of forcing the book against the left edge.
    position: [.28, .26, 5.04],
    rotation: [-.045, 0, .012],
    scale: [...plan.preview.scale],
  };

  if (phase === 'BOOK_HOVER_INTENT') return sampleCompleteShelfPrototypePose(plan, .04);
  if (phase === 'BOOK_EXTRACTING') return sampleCompleteShelfPrototypePose(plan, progress);
  if (phase === 'BOOK_PREVIEW') return {
    ...plan.preview,
    position: [.06, .18, 4.84],
  };
  if (phase === 'BOOK_TO_READING') return interpolatePose(plan.preview, reading, progress);
  if (isCompleteShelfControllerOpeningAllowed(phase) || phase === 'BOOK_CLOSING') return reading;
  if (phase === 'BOOK_RESETTING') return plan.preview;
  if (phase === 'BOOK_RETURNING') return sampleCompleteShelfPrototypePose(plan, progress, 'returning');
  return plan.shelf;
}

export interface CompleteShelfOuterMotionState {
  readonly edition: TutorBookEdition;
  readonly phase: LibraryPhase;
  readonly pose: CompleteShelfBookPose;
  readonly returnFrom?: CompleteShelfBookPose;
  readonly shelfPose?: CompleteShelfBookPose;
}

/** A shelf-only recognition preview; it never acquires or drives the page rig. */
export function getTutorBookHoverPose(pose: CompleteShelfBookPose, faceOut: boolean): CompleteShelfBookPose {
  const scale = faceOut ? 1.07 : 1.1;
  return {
    position: [pose.position[0], pose.position[1] + (faceOut ? .025 : .012), pose.position[2] + (faceOut ? .16 : .12)],
    rotation: faceOut ? [pose.rotation[0], 0, pose.rotation[2]] : [-.018, 0, pose.rotation[2] * .35],
    scale: [pose.scale[0] * scale, pose.scale[1] * scale, pose.scale[2] * scale],
  };
}

export function createCompleteShelfOuterMotionState(edition: TutorBookEdition, shelfPose?: CompleteShelfBookPose): CompleteShelfOuterMotionState {
  return { edition, shelfPose, phase: 'ROOM_IDLE', pose: getCompleteShelfOuterMotionPose(edition, 'ROOM_IDLE', 0, shelfPose) };
}

export function advanceCompleteShelfOuterMotion(state: CompleteShelfOuterMotionState, phase: LibraryPhase, progress: number): CompleteShelfOuterMotionState {
  if (phase === 'BOOK_CLOSING' || phase === 'BOOK_RESETTING') {
    const returnFrom = state.returnFrom ?? state.pose;
    return { ...state, phase, pose: returnFrom, returnFrom };
  }
  if (phase === 'BOOK_RETURNING') {
    const returnFrom = state.returnFrom ?? state.pose;
    const shelf = getCompleteShelfOuterMotionPose(state.edition, 'ROOM_IDLE', 0, state.shelfPose);
    const returnMotion = createBookReturnMotion(returnFrom, shelf);
    return {
      ...state,
      phase,
      pose: interpolateBookMotion(returnMotion.from, returnMotion.to, progress),
      returnFrom,
    };
  }
  if (phase === 'BOOK_PREVIEW' && state.phase === 'BOOK_CLOSING') {
    return { ...state, phase, pose: state.pose };
  }
  return {
    edition: state.edition,
    phase,
    pose: getCompleteShelfOuterMotionPose(state.edition, phase, progress, state.shelfPose),
  };
}

export function shouldAcquireCompleteShelfRig(input: {
  phase: LibraryPhase;
  editionId: string;
  intentEditionId?: string;
  selectedEditionId?: string;
}) {
  if (input.selectedEditionId) return input.editionId === input.selectedEditionId;
  return input.phase === 'ROOM_IDLE' && input.editionId === input.intentEditionId;
}

export type CompleteShelfPointerInteraction = 'hover' | 'activate';

export function shouldStartCompleteShelfRigIntent(
  interaction: CompleteShelfPointerInteraction,
  phase: LibraryPhase,
  selected: boolean,
) {
  return interaction === 'activate' && phase === 'ROOM_IDLE' && !selected;
}
