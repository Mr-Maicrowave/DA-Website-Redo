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
import type { LibraryPhase } from './tutor-library-state';

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
  onReady,
  onError,
}: {
  edition: TutorBookEdition;
  tutor: CatalogueTutor;
  pool: CompleteShelfBookPool<CompleteShelfTutorRig>;
  phase: LibraryPhase;
  active: boolean;
  onReady(rootUuid: string, controller: CompleteShelfRigController): void;
  onError?(message: string): void;
}) {
  const { gl } = useThree();
  const presentation = useMemo(() => createCompleteShelfPresentation(tutor), [tutor]);
  const [rig, setRig] = useState<CompleteShelfTutorRig | null>(() => pool.peek(edition.id) ?? null);
  const callbacks = useRef({ onReady, onError });
  const appliedCommand = useRef('');

  useEffect(() => {
    callbacks.current = { onReady, onError };
  }, [onError, onReady]);

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
    const command = `${rig.root.uuid}:${phase}`;
    if (appliedCommand.current === command) return;
    appliedCommand.current = command;

    if (phase === 'BOOK_OPENING' && isCompleteShelfControllerOpeningAllowed(phase)) rig.controller.open();
    else if (phase === 'BOOK_CLOSING') rig.controller.close();
    else if (phase === 'BOOK_RESETTING') rig.controller.reset();
  }, [active, phase, rig]);

  useFrame((_, delta) => {
    if (active) rig?.controller.update(delta);
  });

  return rig ? <primitive object={rig.root} dispose={null} /> : null;
}
