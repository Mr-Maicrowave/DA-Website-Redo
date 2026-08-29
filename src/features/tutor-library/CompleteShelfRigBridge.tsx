import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Object3D } from "three";

import type { CompleteShelfPresentation } from "./complete-shelf-presentation";
import type { CompleteShelfRigController } from "./complete-shelf-r3f-state";

interface CompleteShelfRig {
  root: Object3D & { userData: { applyCoverAtlas?: (image: HTMLImageElement) => boolean } };
  controller: CompleteShelfRigController;
  dispose(): void;
}

interface CompleteShelfRigModule {
  createCompleteShelfBookRig(config: { renderer: unknown; presentation?: unknown }): CompleteShelfRig;
}

export interface RigSnapshot {
  rootUuid: string;
  openProgress: number;
  pageTurnProgress: number;
  settledPages: number;
  pagePivotCount: number;
  deformationReset: boolean;
}

const RIG_MODULE_URL = "/dev/complete-shelf-rig/complete-shelf-book-rig.js";
const REFERENCE_URL = "/dev/complete-shelf-reference/index.html";
const importPublicModule = new Function("url", "return import(url)") as (url: string) => Promise<CompleteShelfRigModule>;

async function loadReferenceAtlas() {
  const response = await fetch(REFERENCE_URL);
  if (!response.ok) throw new Error(`Reference fetch failed (${response.status})`);
  const source = await response.text();
  const match = source.match(/const COVER_ATLAS_DATA = "([^"]+)"/);
  if (!match) throw new Error("Pinned cover atlas data is unavailable");

  const image = new Image();
  image.decoding = "async";
  image.src = match[1];
  await image.decode();
  if (!image.complete || image.naturalWidth === 0) throw new Error("Pinned cover atlas decode produced no image");
  return image;
}

export function CompleteShelfRigBridge({
  stateKey,
  presentation,
  applyState,
  onSnapshot,
  onArtworkStatus,
  onError,
}: {
  stateKey: string;
  presentation: CompleteShelfPresentation | undefined;
  applyState(controller: CompleteShelfRigController): void;
  onSnapshot?(snapshot: RigSnapshot): void;
  onArtworkStatus?(status: "applied" | "failed"): void;
  onError?(message: string): void;
}) {
  const { gl } = useThree();
  const rigRef = useRef<CompleteShelfRig | null>(null);
  const [rig, setRig] = useState<CompleteShelfRig | null>(null);
  const callbacksRef = useRef({ applyState, onSnapshot, onArtworkStatus, onError });

  useEffect(() => {
    callbacksRef.current = { applyState, onSnapshot, onArtworkStatus, onError };
  }, [applyState, onArtworkStatus, onError, onSnapshot]);

  useEffect(() => {
    let cancelled = false;
    let createdRig: CompleteShelfRig | null = null;

    void importPublicModule(RIG_MODULE_URL)
      .then((module) => {
        if (cancelled) return undefined;
        createdRig = module.createCompleteShelfBookRig(presentation ? {
          renderer: gl,
          presentation: { tutorId: presentation.tutorId, colours: presentation.colours, sources: presentation.createCanvasSources() },
        } : { renderer: gl });
        rigRef.current = createdRig;
        setRig(createdRig);
        if (presentation) {
          callbacksRef.current.onArtworkStatus?.("applied");
          return undefined;
        }
        return loadReferenceAtlas();
      })
      .then((atlas) => {
        if (!atlas || cancelled || !createdRig) return;
        if (!createdRig.root.userData.applyCoverAtlas?.(atlas)) throw new Error("Pinned cover atlas could not be applied");
        callbacksRef.current.onArtworkStatus?.("applied");
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(error);
        callbacksRef.current.onArtworkStatus?.("failed");
        callbacksRef.current.onError?.(message);
      });

    return () => {
      cancelled = true;
      rigRef.current = null;
      createdRig?.dispose();
    };
  }, [gl, presentation]);

  useEffect(() => {
    if (!rig) return;
    callbacksRef.current.applyState(rig.controller);
    callbacksRef.current.onSnapshot?.(rig.controller.getSnapshot());
  }, [rig, stateKey]);

  useFrame((_, delta) => {
    rigRef.current?.controller.update(delta);
  });

  return rig ? <primitive object={rig.root} dispose={null} /> : null;
}
