import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ACESFilmicToneMapping,
  Color,
  Object3D,
  PCFSoftShadowMap,
  PMREMGenerator,
  SRGBColorSpace,
  Vector3,
  type Texture,
  type WebGLRenderTarget,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import {
  applyCompleteShelfEvidenceState,
  COMPLETE_SHELF_EVIDENCE_STATES,
  getCompleteShelfCameraPose,
  type CompleteShelfEvidenceState,
  type CompleteShelfRigController,
} from "./complete-shelf-r3f-state";
import { createCompleteShelfPresentationForQuery } from "./complete-shelf-presentation";

interface CompleteShelfRig {
  root: Object3D & {
    userData: {
      applyCoverAtlas?: (image: HTMLImageElement) => boolean;
    };
  };
  controller: CompleteShelfRigController;
  dispose(): void;
}

interface CompleteShelfRigModule {
  createCompleteShelfBookRig(config: { renderer: unknown; presentation?: unknown }): CompleteShelfRig;
}

interface RigSnapshot {
  rootUuid: string;
  openProgress: number;
  pageTurnProgress: number;
  settledPages: number;
  pagePivotCount: number;
  deformationReset: boolean;
}

const RIG_MODULE_URL = "/dev/complete-shelf-rig/complete-shelf-book-rig.js";
const REFERENCE_URL = "/dev/complete-shelf-reference/index.html";
const CAMERA_TARGET = new Vector3(0, 0, 0);
const importPublicModule = new Function("url", "return import(url)") as (
  url: string,
) => Promise<CompleteShelfRigModule>;

function isEvidenceState(value: string | null): value is CompleteShelfEvidenceState {
  return COMPLETE_SHELF_EVIDENCE_STATES.includes(value as CompleteShelfEvidenceState);
}

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

function disposeObjectHierarchy(root: Object3D) {
  root.traverse((object) => {
    const candidate = object as Object3D & {
      geometry?: { dispose(): void };
      material?: { dispose(): void } | Array<{ dispose(): void }>;
    };
    candidate.geometry?.dispose();
    const materials = Array.isArray(candidate.material) ? candidate.material : [candidate.material];
    materials.forEach((material) => material?.dispose());
  });
  root.clear();
}

function NeutralStudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target: WebGLRenderTarget<Texture> = generator.fromScene(room, 0.04);
    scene.environment = target.texture;
    generator.dispose();

    return () => {
      scene.environment = null;
      target.dispose();
      disposeObjectHierarchy(room);
    };
  }, [gl, scene]);

  return (
    <>
      <color attach="background" args={[new Color(0x17191d)]} />
      <mesh rotation-x={-Math.PI / 2} position-y={-1.02} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={0x25282d} roughness={0.92} metalness={0} />
      </mesh>
      <directionalLight color={0xf4d7b9} intensity={3.1} position={[2.8, 4.5, 3.4]} castShadow />
      <hemisphereLight color={0x9fb3c9} groundColor={0x17191d} intensity={1.35} />
      <directionalLight color={0xc87046} intensity={1.1} position={[-3, 2, -2]} />
    </>
  );
}

function CameraBridge({ state }: { state: CompleteShelfEvidenceState }) {
  const { camera, size } = useThree();
  const pose = getCompleteShelfCameraPose(state, size.width <= 560);
  const targetPosition = useMemo(() => new Vector3(...pose), [pose]);

  useLayoutEffect(() => {
    camera.position.copy(targetPosition);
    camera.lookAt(CAMERA_TARGET);
    camera.updateProjectionMatrix();
  }, [camera, targetPosition]);

  useFrame((_, delta) => {
    camera.position.lerp(targetPosition, 1 - Math.exp(-delta * 4));
    camera.lookAt(CAMERA_TARGET);
  });

  return null;
}

function ImperativeRigBridge({
  state,
  presentationQuery,
  onSnapshot,
  onArtworkStatus,
  onError,
}: {
  state: CompleteShelfEvidenceState;
  presentationQuery: string | null;
  onSnapshot(snapshot: RigSnapshot): void;
  onArtworkStatus(status: "applied" | "failed"): void;
  onError(message: string): void;
}) {
  const { gl } = useThree();
  const rigRef = useRef<CompleteShelfRig | null>(null);
  const [rig, setRig] = useState<CompleteShelfRig | null>(null);

  useEffect(() => {
    let cancelled = false;
    let createdRig: CompleteShelfRig | null = null;

    void importPublicModule(RIG_MODULE_URL)
      .then((module: CompleteShelfRigModule) => {
        if (cancelled) return;
        const presentation = createCompleteShelfPresentationForQuery(presentationQuery);
        createdRig = module.createCompleteShelfBookRig(presentation ? {
          renderer: gl,
          presentation: {
            tutorId: presentation.tutorId,
            colours: presentation.colours,
            sources: presentation.createCanvasSources(),
          },
        } : { renderer: gl });
        rigRef.current = createdRig;
        setRig(createdRig);
        if (presentation) {
          onArtworkStatus("applied");
          return undefined;
        }
        return loadReferenceAtlas();
      })
      .then((atlas) => {
        if (!atlas || cancelled || !createdRig) return;
        if (!createdRig.root.userData.applyCoverAtlas?.(atlas)) {
          throw new Error("Pinned cover atlas could not be applied");
        }
        onArtworkStatus("applied");
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(error);
        onArtworkStatus("failed");
        onError(message);
      });

    return () => {
      cancelled = true;
      rigRef.current = null;
      createdRig?.dispose();
    };
  }, [gl, onArtworkStatus, onError, presentationQuery]);

  useEffect(() => {
    if (!rig) return;
    applyCompleteShelfEvidenceState(rig.controller, state);
    onSnapshot(rig.controller.getSnapshot());
  }, [rig, state, onSnapshot]);

  useFrame((_, delta) => {
    const currentRig = rigRef.current;
    if (!currentRig) return;
    currentRig.controller.update(delta);
  });

  return rig ? <primitive object={rig.root} dispose={null} /> : null;
}

function initialEvidenceState() {
  const requested = new URLSearchParams(window.location.search).get("state");
  return isEvidenceState(requested) ? requested : "closed-three-quarter";
}

function initialPresentationQuery() {
  return new URLSearchParams(window.location.search).get("presentation");
}

export default function CompleteShelfR3FCheckpoint() {
  const [state, setState] = useState<CompleteShelfEvidenceState>(initialEvidenceState);
  const [presentationQuery] = useState(initialPresentationQuery);
  const [snapshot, setSnapshot] = useState<RigSnapshot | null>(null);
  const [artworkStatus, setArtworkStatus] = useState<"pending" | "applied" | "failed">("pending");
  const [error, setError] = useState("");
  const persistentRootRef = useRef<string | null>(null);

  useEffect(() => {
    document.title = "Complete Shelf R3F bridge";
  }, []);

  function chooseState(nextState: CompleteShelfEvidenceState) {
    const params = new URLSearchParams(window.location.search);
    params.set("state", nextState);
    window.history.replaceState(null, "", `?${params}`);
    setState(nextState);
  }

  if (snapshot && persistentRootRef.current === null) persistentRootRef.current = snapshot.rootUuid;
  const persistentRoot = snapshot ? persistentRootRef.current === snapshot.rootUuid : true;
  const narrow = typeof window !== "undefined" && window.innerWidth <= 560;

  return (
    <main
      data-host="r3f"
      data-bridge="primitive"
      data-state={state}
      data-presentation={presentationQuery === "jenny" ? "jenny" : "reference"}
      data-root-uuid={snapshot?.rootUuid ?? "pending"}
      data-persistent-root={String(persistentRoot)}
      data-page-pivots={snapshot?.pagePivotCount ?? "pending"}
      data-open-progress={snapshot?.openProgress.toFixed(4) ?? "pending"}
      data-page-turn-progress={snapshot?.pageTurnProgress.toFixed(4) ?? "pending"}
      data-settled-pages={snapshot?.settledPages ?? "pending"}
      data-deformation-reset={snapshot ? String(snapshot.deformationReset) : "pending"}
      data-artwork-status={artworkStatus}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        display: "grid",
        gridTemplateRows: "minmax(0, 1fr) auto",
        minWidth: 320,
        minHeight: "100dvh",
        color: "#f3eee4",
        background: "#17191d",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <style>{`
        .complete-shelf-r3f-panel { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; padding: .8rem clamp(1rem, 3vw, 2rem); background: #0d0f12; border-top: 1px solid #36393f; }
        .complete-shelf-r3f-label { margin-right: auto; font-size: .75rem; letter-spacing: .12em; text-transform: uppercase; color: #c6beb2; }
        .complete-shelf-r3f-control { color: inherit; background: #20242a; border: 1px solid #4b5059; border-radius: .35rem; min-height: 2.25rem; padding: .35rem .65rem; font: inherit; }
        .complete-shelf-r3f-status { width: 100%; margin: 0; color: #c6beb2; font-size: .8rem; }
        @media (max-width: 560px) {
          .complete-shelf-r3f-panel { gap: .45rem; }
          .complete-shelf-r3f-label { width: 100%; margin-right: 0; }
          button.complete-shelf-r3f-control { flex: 1 1 31%; }
          select.complete-shelf-r3f-control { flex: 1 1 100%; }
        }
      `}</style>
      <Canvas
        aria-label="Interactive Complete Shelf book rig hosted by React Three Fiber"
        camera={{ position: [2.35, 1.48, 3.65], fov: 32, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
        }}
      >
        <NeutralStudioEnvironment />
        <CameraBridge state={state} />
        <ImperativeRigBridge
          state={state}
          presentationQuery={presentationQuery}
          onSnapshot={setSnapshot}
          onArtworkStatus={setArtworkStatus}
          onError={setError}
        />
      </Canvas>
      <section
        aria-label="R3F bridge controls"
        className="complete-shelf-r3f-panel"
      >
        <span className="complete-shelf-r3f-label">
          Complete Shelf rig · R3F primitive bridge
        </span>
        <button type="button" className="complete-shelf-r3f-control" onClick={() => chooseState("fully-open")}>Open</button>
        <button type="button" className="complete-shelf-r3f-control" onClick={() => chooseState("closed-three-quarter")}>Close</button>
        <button type="button" className="complete-shelf-r3f-control" onClick={() => chooseState("settled-page")}>Settle page</button>
        <button type="button" className="complete-shelf-r3f-control" onClick={() => chooseState("closed-three-quarter")}>Reset</button>
        <select
          aria-label="Rig state"
          value={state}
          onChange={(event) => chooseState(event.target.value as CompleteShelfEvidenceState)}
          className="complete-shelf-r3f-control"
        >
          {COMPLETE_SHELF_EVIDENCE_STATES.map((evidenceState) => (
            <option key={evidenceState} value={evidenceState}>{evidenceState.replace(/-/g, " ")}</option>
          ))}
        </select>
        <p className="complete-shelf-r3f-status" style={{ color: artworkStatus === "failed" ? "#ffae95" : undefined }} aria-live="polite">
          {error || (artworkStatus === "applied" ? presentationQuery === "jenny" ? "Canonical Jenny presentation applied to the persistent rig" : "Pinned Codex cover artwork applied to the persistent rig" : presentationQuery === "jenny" ? "Loading canonical Jenny presentation…" : "Loading immutable Codex cover artwork…")}
        </p>
        <p className="complete-shelf-r3f-status" aria-live="polite">
          {`${state.replace(/-/g, " ")} · ${narrow ? "narrow-390-safe" : "desktop"} · persistent rig ${persistentRoot ? "verified" : "changed"} · ${snapshot?.pagePivotCount ?? "…"} page pivots`}
        </p>
      </section>
    </main>
  );
}
