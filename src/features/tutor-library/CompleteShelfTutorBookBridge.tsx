import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Object3D } from 'three';

import type { CatalogueTutor } from '../../data/teacherCatalogue';
import type {
  CompleteShelfBookPool,
  CompleteShelfPoolRig,
} from './complete-shelf-book-pool';
import { isCompleteShelfControllerOpeningAllowed } from './complete-shelf-book-pool';
import { createCompleteShelfPresentation } from './complete-shelf-presentation';
import type { CompleteShelfRigController } from './complete-shelf-r3f-state';
import type { TutorBookEdition } from './tutor-library-data';
import { getControllerCompletionEvent, type LibraryEvent, type LibraryPhase } from './tutor-library-state';
import { createBookMotionTimingPolicy } from './tutor-book-motion';
import { advanceTutorBookPageTurn, type TutorBookPageTurnDirection } from './tutor-book-pages';
import { getMatrixDeltaFromIdentity, writeTutorLibraryRigDiagnostics } from './tutor-library-debug';

export interface CompleteShelfTutorRig extends CompleteShelfPoolRig {
  root: Object3D;
  controller: CompleteShelfRigController;
}

interface CompleteShelfRigModule {
  createCompleteShelfBookRig(config: { renderer: unknown; presentation: unknown }): CompleteShelfTutorRig;
}

const RIG_MODULE_URL = '/dev/complete-shelf-rig/complete-shelf-book-rig.js';
const importPublicModule = new Function('url', 'return import(url)') as (url: string) => Promise<CompleteShelfRigModule>;

export function CompleteShelfTutorBookBridge({
  edition,
  tutor,
  pool,
  phase,
  active,
  generation,
  reducedMotion,
  pageTurnDirection,
  onReady,
  onRelease,
  onLifecycleComplete,
  onPageSettled,
  onError,
}: {
  edition: TutorBookEdition;
  tutor: CatalogueTutor;
  pool: CompleteShelfBookPool<CompleteShelfTutorRig>;
  phase: LibraryPhase;
  active: boolean;
  generation: number;
  reducedMotion: boolean;
  pageTurnDirection: TutorBookPageTurnDirection;
  onReady(rootUuid: string, controller: CompleteShelfRigController): void;
  onRelease(rootUuid: string): void;
  onLifecycleComplete(event: LibraryEvent): void;
  onPageSettled(settledPages: number): void;
  onError?(message: string): void;
}) {
  const { gl } = useThree();
  const presentation = useMemo(() => createCompleteShelfPresentation(tutor), [tutor]);
  const [rig, setRig] = useState<CompleteShelfTutorRig | null>(() => pool.peek(edition.id) ?? null);
  const callbacks = useRef({ onReady, onRelease, onLifecycleComplete, onPageSettled, onError });
  const appliedCommand = useRef('');
  const emittedCompletion = useRef('');
  const pageTurnProgress = useRef(0);
  const pageTurnCommitted = useRef(false);
  const pageTurnCommand = useRef('');
  const pageTurnDurationMs = useMemo(() => createBookMotionTimingPolicy(reducedMotion).pageTurnMs, [reducedMotion]);

  useEffect(() => {
    callbacks.current = { onReady, onRelease, onLifecycleComplete, onPageSettled, onError };
  }, [onError, onLifecycleComplete, onPageSettled, onReady, onRelease]);

  useEffect(() => {
    let cancelled = false;
    let mountedRootUuid: string | undefined;
    const lease = pool.acquire(edition.id, async () => {
      const module = await importPublicModule(RIG_MODULE_URL);
      return module.createCompleteShelfBookRig({
        renderer: gl,
        presentation: {
          tutorId: presentation.tutorId,
          colours: presentation.colours,
          sources: presentation.createCanvasSources(),
        },
      });
    });

    void lease.rig.then((nextRig) => {
      if (!cancelled) {
        mountedRootUuid = nextRig.root.uuid;
        setRig(nextRig);
      }
    }).catch((error: unknown) => {
      if (cancelled) return;
      const message = error instanceof Error ? error.message : String(error);
      console.error(error);
      callbacks.current.onError?.(message);
    });

    return () => {
      cancelled = true;
      if (mountedRootUuid) {
        callbacks.current.onRelease(mountedRootUuid);
        const qaRoot = gl.domElement.closest<HTMLElement>('[data-tutor-library-qa="root"]');
        if (qaRoot?.dataset.libraryRootUuid === mountedRootUuid) {
          writeTutorLibraryRigDiagnostics(gl.domElement, { rootUuid: 'unmounted' });
        }
      }
      lease.release();
    };
  }, [edition.id, gl, pool, presentation]);

  useLayoutEffect(() => {
    if (!rig) return;
    rig.root.updateMatrix();
    writeTutorLibraryRigDiagnostics(gl.domElement, {
      rootUuid: rig.root.uuid,
      matrixDelta: getMatrixDeltaFromIdentity(rig.root.matrix.elements),
      resetState: 'not-required',
    });
    callbacks.current.onReady(rig.root.uuid, rig.controller);
  }, [gl, rig]);

  useEffect(() => {
    if (!rig || !active) return;
    const command = `${rig.root.uuid}:${phase}:${generation}`;
    if (appliedCommand.current === command) return;
    appliedCommand.current = command;

    if (phase === 'BOOK_OPENING' && isCompleteShelfControllerOpeningAllowed(phase)) {
      if (reducedMotion) rig.controller.setOpenProgress(1);
      else rig.controller.open();
    }
    else if (phase === 'PAGE_TURNING') {
      pageTurnCommand.current = command;
      pageTurnProgress.current = 0;
      pageTurnCommitted.current = false;
      rig.controller.setPageTurnProgress(0, pageTurnDirection);
    }
    else if (phase === 'BOOK_CLOSING') {
      writeTutorLibraryRigDiagnostics(gl.domElement, { rootUuid: rig.root.uuid, matrixDelta: getMatrixDeltaFromIdentity(rig.root.matrix.elements), resetState: 'pending' });
      rig.controller.close();
    }
    else if (phase === 'BOOK_RESETTING') {
      writeTutorLibraryRigDiagnostics(gl.domElement, { rootUuid: rig.root.uuid, matrixDelta: getMatrixDeltaFromIdentity(rig.root.matrix.elements), resetState: 'pending' });
      rig.controller.reset();
    }
  }, [active, generation, gl, pageTurnDirection, phase, reducedMotion, rig]);

  useFrame((_, delta) => {
    if (!active || !rig) return;
    const pageCommand = phase === 'PAGE_TURNING' ? `${rig.root.uuid}:${phase}:${generation}` : '';
    if (phase === 'PAGE_TURNING' && pageTurnCommand.current !== pageCommand) {
      pageTurnCommand.current = pageCommand;
      pageTurnProgress.current = 0;
      pageTurnCommitted.current = false;
      rig.controller.setPageTurnProgress(0, pageTurnDirection);
    }
    if (phase === 'PAGE_TURNING' && !pageTurnCommitted.current) {
      pageTurnProgress.current = advanceTutorBookPageTurn(pageTurnProgress.current, delta, pageTurnDurationMs);
      rig.controller.setPageTurnProgress(pageTurnProgress.current, pageTurnDirection);
    }
    rig.controller.update(delta);
    if (phase === 'PAGE_TURNING' && !pageTurnCommitted.current && pageTurnProgress.current >= 1) {
      if (!rig.controller.settlePage(pageTurnDirection)) return;
      pageTurnCommitted.current = true;
    }
    const snapshot = rig.controller.getSnapshot();
    const completion = getControllerCompletionEvent(phase, generation, snapshot);
    if (!completion) return;
    const key = `${rig.root.uuid}:${phase}:${generation}:${completion.type}`;
    if (emittedCompletion.current === key) return;
    emittedCompletion.current = key;
    if (completion.type === 'PAGE_TURN_COMPLETE') callbacks.current.onPageSettled(snapshot.settledPages);
    if (completion.type === 'RESET_COMPLETE') {
      writeTutorLibraryRigDiagnostics(gl.domElement, {
        rootUuid: rig.root.uuid,
        matrixDelta: getMatrixDeltaFromIdentity(rig.root.matrix.elements),
        resetState: 'complete',
      });
    }
    callbacks.current.onLifecycleComplete(completion);
  });

  return rig ? <primitive object={rig.root} dispose={null} /> : null;
}
