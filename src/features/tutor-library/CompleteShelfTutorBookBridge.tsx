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
  onReady,
  onLifecycleComplete,
  onError,
}: {
  edition: TutorBookEdition;
  tutor: CatalogueTutor;
  pool: CompleteShelfBookPool<CompleteShelfTutorRig>;
  phase: LibraryPhase;
  active: boolean;
  generation: number;
  reducedMotion: boolean;
  onReady(rootUuid: string, controller: CompleteShelfRigController): void;
  onLifecycleComplete(event: LibraryEvent): void;
  onError?(message: string): void;
}) {
  const { gl } = useThree();
  const presentation = useMemo(() => createCompleteShelfPresentation(tutor), [tutor]);
  const [rig, setRig] = useState<CompleteShelfTutorRig | null>(() => pool.peek(edition.id) ?? null);
  const callbacks = useRef({ onReady, onLifecycleComplete, onError });
  const appliedCommand = useRef('');
  const emittedCompletion = useRef('');

  useEffect(() => {
    callbacks.current = { onReady, onLifecycleComplete, onError };
  }, [onError, onLifecycleComplete, onReady]);

  useEffect(() => {
    let cancelled = false;
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
      if (!cancelled) setRig(nextRig);
    }).catch((error: unknown) => {
      if (cancelled) return;
      const message = error instanceof Error ? error.message : String(error);
      console.error(error);
      callbacks.current.onError?.(message);
    });

    return () => {
      cancelled = true;
      lease.release();
    };
  }, [edition.id, gl, pool, presentation]);

  useLayoutEffect(() => {
    if (!rig) return;
    callbacks.current.onReady(rig.root.uuid, rig.controller);
  }, [rig]);

  useEffect(() => {
    if (!rig || !active) return;
    const command = `${rig.root.uuid}:${phase}:${generation}`;
    if (appliedCommand.current === command) return;
    appliedCommand.current = command;

    if (phase === 'BOOK_OPENING' && isCompleteShelfControllerOpeningAllowed(phase)) {
      if (reducedMotion) rig.controller.setOpenProgress(1);
      else rig.controller.open();
    }
    else if (phase === 'PAGE_TURNING') rig.controller.setPageTurnProgress(1);
    else if (phase === 'BOOK_CLOSING') rig.controller.close();
    else if (phase === 'BOOK_RESETTING') rig.controller.reset();
  }, [active, generation, phase, reducedMotion, rig]);

  useFrame((_, delta) => {
    if (!active || !rig) return;
    rig.controller.update(delta);
    const snapshot = rig.controller.getSnapshot();
    const completion = getControllerCompletionEvent(phase, generation, snapshot);
    if (!completion) return;
    const key = `${rig.root.uuid}:${phase}:${generation}:${completion.type}`;
    if (emittedCompletion.current === key) return;
    emittedCompletion.current = key;
    if (completion.type === 'PAGE_TURN_COMPLETE') rig.controller.settlePage();
    callbacks.current.onLifecycleComplete(completion);
  });

  return rig ? <primitive object={rig.root} dispose={null} /> : null;
}
