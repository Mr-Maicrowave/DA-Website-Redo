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
} from "./complete-shelf-r3f-state";
import { CompleteShelfRigBridge, type RigSnapshot } from "./CompleteShelfRigBridge";
import { selectCompleteShelfR3FBridgePresentation } from "./complete-shelf-r3f-presentation";
const CAMERA_TARGET = new Vector3(0, 0, 0);

function isEvidenceState(value: string | null): value is CompleteShelfEvidenceState {
  return COMPLETE_SHELF_EVIDENCE_STATES.includes(value as CompleteShelfEvidenceState);
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

function initialEvidenceState() {
  const requested = new URLSearchParams(window.location.search).get("state");
  return isEvidenceState(requested) ? requested : "closed-three-quarter";
}

function initialBridgePresentation() {
  return selectCompleteShelfR3FBridgePresentation(window.location.search);
}

export default function CompleteShelfR3FCheckpoint() {
  const [state, setState] = useState<CompleteShelfEvidenceState>(initialEvidenceState);
  const [presentation] = useState(initialBridgePresentation);
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
      data-presentation={presentation ? "jenny" : "reference"}
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
        <CompleteShelfRigBridge
          stateKey={state}
          presentation={presentation}
          applyState={(controller) => applyCompleteShelfEvidenceState(controller, state)}
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
          {error || (artworkStatus === "applied" ? presentation ? "Canonical Jenny presentation applied to the persistent rig" : "Pinned Codex cover artwork applied to the persistent rig" : presentation ? "Loading canonical Jenny presentation…" : "Loading immutable Codex cover artwork…")}
        </p>
        <p className="complete-shelf-r3f-status" aria-live="polite">
          {`${state.replace(/-/g, " ")} · ${narrow ? "narrow-390-safe" : "desktop"} · persistent rig ${persistentRoot ? "verified" : "changed"} · ${snapshot?.pagePivotCount ?? "…"} page pivots`}
        </p>
      </section>
    </main>
  );
}
