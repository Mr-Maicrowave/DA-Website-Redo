import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Lightformer, Text } from '@react-three/drei';
import { useLayoutEffect, useMemo, useState } from 'react';
import { Color, MeshPhysicalMaterial, PerspectiveCamera, Vector2 } from 'three';
import { TUTORS } from '../../data/teacherCatalogue';
import { createTutorBookEditions } from './tutor-library-data';
import { TutorBook } from './TutorBook';
import { useBookMaterialMaps } from './TutorBookCover';
import { CompleteShelfTutorBook, type CompleteShelfBookState } from './CompleteShelfTutorBook';
import { COMPLETE_SHELF_STUDIO_SHELF_TOP_Y } from './complete-shelf-book-prototype';
import { createCompleteShelfPresentationForQuery, getCompleteShelfPresentationQuery } from './complete-shelf-presentation';
import { CompleteShelfRigBridge } from './CompleteShelfRigBridge';
import { applyCompleteShelfStudioState, getCompleteShelfStudioEngine } from './complete-shelf-studio-state';

export type CompleteShelfEngineCamera = 'default' | 'open-top-oblique' | 'turn-side-oblique' | 'turn-top-oblique' | 'turn-close';

type StudioView = 'front' | 'rear' | 'top' | 'fore' | 'spine' | 'cover' | 'shelf' | 'typography' | 'typography-close' | 'geometry-debug' | 'geometry-debug-rear' | 'geometry-debug-top' | 'geometry-debug-spine' | 'geometry-debug-fore' | 'material-debug' | 'foil-debug' | 'foil-metal-debug';
const VIEWS: Record<StudioView, { position: [number, number, number]; target: [number, number, number]; fov: number }> = {
  front: { position: [.92, .68, 2.72], target: [0, .04, 0], fov: 34 }, rear: { position: [-1.1, .72, -2.55], target: [0, .05, 0], fov: 32 }, top: { position: [.62, 2.48, .95], target: [0, 0, 0], fov: 30 }, fore: { position: [2.45, .25, 0], target: [0, .02, 0], fov: 26 }, spine: { position: [-2.18, .24, .35], target: [-.18, .05, 0], fov: 27 }, cover: { position: [.15, .18, 2.3], target: [0, .06, 0], fov: 28 }, shelf: { position: [0, .72, 3.2], target: [0, .15, 0], fov: 30 }, typography: { position: [0, .64, 3], target: [0, .16, 0], fov: 29 }, 'typography-close': { position: [0, .48, 1.75], target: [0, .15, 0], fov: 26 },
  'foil-metal-debug': { position: [0, .25, 3.1], target: [0, .08, 0], fov: 30 },
  'geometry-debug': { position: [.92, .68, 2.72], target: [0, .04, 0], fov: 34 }, 'geometry-debug-rear': { position: [-1.1, .72, -2.55], target: [0, .05, 0], fov: 32 }, 'geometry-debug-top': { position: [.62, 2.48, .95], target: [0, 0, 0], fov: 30 }, 'geometry-debug-spine': { position: [-2.18, .24, .35], target: [-.18, .05, 0], fov: 27 }, 'geometry-debug-fore': { position: [2.45, .25, 0], target: [0, .02, 0], fov: 26 }, 'material-debug': { position: [0, .25, 3.45], target: [0, .1, 0], fov: 34 }, 'foil-debug': { position: [0, .25, 3.1], target: [0, .08, 0], fov: 30 },
};

const ENGINE_VIEWS: Record<CompleteShelfBookState, { position: [number, number, number]; target: [number, number, number]; fov: number }> = {
  'closed-front': { position: [.92, 1.34, 3.72], target: [0, .74, .96], fov: 34 },
  'closed-spine': { position: [-.38, 1.28, 4.12], target: [0, .73, .96], fov: 29 },
  shelf: { position: [0, .7, 3.15], target: [0, .18, 0], fov: 30 },
  extracting: { position: [0, 1.2, 3.55], target: [0, .72, .66], fov: 31 },
  preview: { position: [.92, 1.34, 3.72], target: [0, .74, .96], fov: 34 },
  'half-open': { position: [3.0, 2.35, 5.9], target: [-.08, .74, .96], fov: 35 },
  open: { position: [3.35, 2.6, 6.45], target: [-.1, .74, .96], fov: 37 },
  'page-turn-25': { position: [3.35, 2.6, 6.45], target: [-.1, .74, .96], fov: 37 },
  'page-turning': { position: [3.35, 2.6, 6.45], target: [-.1, .74, .96], fov: 37 },
  'page-turn-75': { position: [3.35, 2.6, 6.45], target: [-.1, .74, .96], fov: 37 },
  'page-settled': { position: [3.35, 2.6, 6.45], target: [-.1, .74, .96], fov: 37 },
  'closed-returned': { position: [0, .7, 3.15], target: [0, .18, 0], fov: 30 },
};
const ENGINE_STATES: readonly CompleteShelfBookState[] = ['closed-front', 'closed-spine', 'shelf', 'extracting', 'preview', 'half-open', 'open', 'page-turn-25', 'page-turning', 'page-turn-75', 'page-settled', 'closed-returned'];

function StudioCamera({ view, engineState, engineCamera = 'default' }: { view: StudioView; engineState?: CompleteShelfBookState; engineCamera?: CompleteShelfEngineCamera }) {
  const camera = useThree(state => state.camera) as PerspectiveCamera;
  useLayoutEffect(() => { const pose = engineCamera === 'open-top-oblique' || engineCamera === 'turn-top-oblique' ? { position: [2.4, 4.7, 5.25] as [number, number, number], target: [-.08, .74, .96] as [number, number, number], fov: 34 } : engineCamera === 'turn-side-oblique' ? { position: [-3.1, 1.75, 4.5] as [number, number, number], target: [-.1, .72, .96] as [number, number, number], fov: 35 } : engineCamera === 'turn-close' ? { position: [1.75, 1.45, 3.15] as [number, number, number], target: [.02, .68, 1.05] as [number, number, number], fov: 28 } : engineState ? ENGINE_VIEWS[engineState] : VIEWS[view]; camera.position.set(...pose.position); camera.lookAt(...pose.target); camera.fov = pose.fov; camera.updateProjectionMatrix(); }, [camera, engineCamera, engineState, view]);
  return null;
}

function CompleteShelfPrototype({ state, collisionDebug, presentationQuery }: { state: CompleteShelfBookState; collisionDebug: boolean; presentationQuery: string | null }) {
  const presentation = useMemo(() => createCompleteShelfPresentationForQuery(presentationQuery), [presentationQuery]);
  if (presentation) return <CompleteShelfRigBridge stateKey={state} presentation={presentation} applyState={controller => applyCompleteShelfStudioState(controller, state)} />;
  const edition = createTutorBookEditions(TUTORS).find(candidate => candidate.wallId === 'primary')!;
  const tutor = TUTORS.find(candidate => candidate.id === edition.tutorId)!;
  return <CompleteShelfTutorBook tutor={tutor} edition={edition} state={state} collisionDebug={collisionDebug} shelfPose={{ position: [0, .1, 0], rotation: [0, Math.PI / 2, 0], width: .6, height: .92, depth: .31 }} />;
}

function StudioBooks({ view }: { view: StudioView }) {
  const editions = createTutorBookEditions(TUTORS).filter(edition => edition.wallId === 'primary').slice(0, 3);
  const isComparison = view === 'shelf' || view === 'typography' || view === 'typography-close';
  const books = isComparison ? (view === 'shelf' ? editions : [editions[0], editions[0], editions[0]]) : editions.slice(0, 1);
  return <>{books.map((edition, index) => {
    const tutor = TUTORS.find(candidate => candidate.id === edition.tutorId)!;
    const debug = view.startsWith('geometry-debug'); const spineView = view === 'spine' || view === 'fore' || view === 'top' || view === 'geometry-debug-spine' || view === 'geometry-debug-fore' || view === 'geometry-debug-top';
    return <TutorBook key={`${edition.id}-${index}`} edition={edition} tutor={tutor} phase="ROOM_IDLE" selected={false} motionProgress={0} onHover={() => undefined} studio geometryDebug={debug} spineTreatment={isComparison && view !== 'shelf' ? (['classic', 'stacked', 'surname'] as const)[index] : 'classic'} poseOverride={{ position: [isComparison ? (index - 1) * .58 : 0, .1 + (isComparison ? 0 : .02), 0], rotation: [0, isComparison ? Math.PI / 2 : spineView ? 0 : -.28, 0], width: .54, height: 1.04, depth: .31 }} />;
  })}</>;
}

function MaterialDebug() {
  const maps = useBookMaterialMaps();
  const swatches = [['A BASE', <meshPhysicalMaterial color="#183653" roughness={.82} />], ['B + NORMAL', <meshPhysicalMaterial color="#183653" normalMap={maps.clothNormal} normalScale={new Vector2(.12, .12)} roughness={.82} />], ['C 2× NORMAL', <meshPhysicalMaterial color="#183653" normalMap={maps.clothNormal} normalScale={new Vector2(.24, .24)} roughness={.82} />], ['D FULL', <meshPhysicalMaterial color="#183653" normalMap={maps.clothNormal} normalScale={new Vector2(.12, .12)} roughnessMap={maps.clothRoughness} bumpMap={maps.clothRoughness} bumpScale={.008} roughness={.82} sheen={.34} sheenRoughness={.6} />]] as const;
  const mapPlanes = [['HEIGHT', maps.clothHeight], ['NORMAL', maps.clothNormal], ['ROUGHNESS', maps.clothRoughness]] as const;
  return <group>{swatches.map(([label, material], index) => <group key={label} position={[(index - 1.5) * .93, .36, 0]} rotation={[0, -.34, 0]}><mesh castShadow><boxGeometry args={[.7, .7, .06]} />{material}</mesh><Text position={[0, -.47, .08]} fontSize={.075} color="#1c2025" anchorX="center">{label}</Text></group>)}<group position={[-1.13, -1.02, 0]} rotation={[0, -.34, 0]}><mesh><boxGeometry args={[1.35, .42, .06]} /><meshPhysicalMaterial color="#f0e7d5" map={maps.paper} roughnessMap={maps.paperBump} bumpMap={maps.paperBump} bumpScale={.02} roughness={.94} /></mesh><Text position={[0, -.31, .08]} fontSize={.075} color="#1c2025" anchorX="center">PAPER: BASE / FINAL</Text></group>{mapPlanes.map(([label, map], index) => <group key={label} position={[.45 + index * .72, -1.02, 0]}><mesh><planeGeometry args={[.56, .42]} /><meshBasicMaterial map={map} /></mesh><Text position={[0, -.29, .02]} fontSize={.06} color="#1c2025" anchorX="center">{label}</Text></group>)}</group>;
}

function FoilDebug() { return <group>{[-1, 0, 1].map((x, index) => <group key={x} position={[x, .08, 0]} rotation={[0, [-.52, 0, .52][index], 0]}><mesh><boxGeometry args={[.72, .94, .05]} /><meshPhysicalMaterial color="#183653" roughness={.9} /></mesh><mesh position={[0, 0, .029]}><planeGeometry args={[.52, .56]} /><meshPhysicalMaterial color="#a77b38" metalness={1} roughness={.08} envMapIntensity={1.4} clearcoat={.12} /></mesh><Text position={[0, -.36, .062]} fontSize={.15} color="#caa766" anchorX="center">FOIL</Text><Text position={[0, -.56, .062]} fontSize={.065} color="#1c2025" anchorX="center">{['AWAY', 'PARTIAL', 'SPECULAR'][index]}</Text></group>)}</group>; }

function FoilMetalDebug() {
  const material = useMemo(() => new MeshPhysicalMaterial({ color: '#a77b38', metalness: 1, roughness: .1, clearcoat: 0, envMapIntensity: 1.4 }), []);
  return <group>{[-1, 0, 1].map((x, index) => <group key={x} position={[x, .08, 0]} rotation={[0, [-.58, 0, .58][index], 0]}><mesh name={`foil-metal-${index}`} material={material}><planeGeometry args={[.72, .9]} /></mesh><Text material={material} position={[0, -.22, .005]} fontSize={.15} anchorX="center">FOIL</Text><Text position={[0, -.57, .02]} fontSize={.06} color="#1c2025" anchorX="center">{['DARK REGION', 'PARTIAL', 'BRIGHT SOFTBOX'][index]}</Text></group>)}<mesh name="foil-metal-reference-sphere" position={[0, -1.08, 0]} material={material}><sphereGeometry args={[.36, 48, 32]} /></mesh><Text position={[0, -1.57, .02]} fontSize={.07} color="#1c2025" anchorX="center">METALNESS 1 · ROUGHNESS .1</Text></group>;
}

export function TutorBookStudio({ view = 'front', engineState, engineCamera = 'default', collisionDebug = false }: { view?: StudioView; engineState?: CompleteShelfBookState; engineCamera?: CompleteShelfEngineCamera; collisionDebug?: boolean }) {
  const diagnostic = view.includes('debug');
  const presentationSearch = typeof window === 'undefined' ? '' : window.location.search;
  const presentationQuery = getCompleteShelfPresentationQuery(presentationSearch);
  const [interactiveEngineState, setInteractiveEngineState] = useState<CompleteShelfBookState | undefined>(engineState);
  const activeEngineState = engineState ? interactiveEngineState ?? engineState : undefined;
  const completeShelfEngine = getCompleteShelfStudioEngine(presentationSearch, activeEngineState);
  return <main data-complete-shelf-engine={completeShelfEngine} data-presentation={presentationQuery ?? 'reference'} style={{ height: '100vh', background: diagnostic ? '#a7a39b' : '#22170f', position: 'relative' }}><Canvas shadows dpr={2} camera={{ fov: 32, position: [1.35, .82, 2.45] }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
    <color attach="background" args={[new Color(diagnostic ? '#a7a39b' : '#281b12')]} />
    <ambientLight intensity={diagnostic ? .9 : .72} color={diagnostic ? '#ffffff' : '#f2dfbe'} /><hemisphereLight intensity={diagnostic ? .65 : .66} color={diagnostic ? '#ffffff' : '#ffe7c7'} groundColor={diagnostic ? '#66666a' : '#3b2719'} />
    <spotLight castShadow position={[2.15, 2.9, 3.4]} intensity={28} angle={.5} penumbra={.76} color="#ffe8bd" shadow-mapSize={[1024, 1024]} />
    <spotLight position={[-2.2, 1.9, 1.2]} intensity={11} angle={.43} penumbra={.84} color="#d5e0f0" />
    <pointLight position={[-1.7, .9, -2.25]} intensity={8} distance={5} color="#ffd494" />
    {(engineState || view === 'material-debug' || view === 'foil-debug' || view === 'foil-metal-debug') && <Environment resolution={256} environmentIntensity={1.4}><Lightformer form="rect" intensity={7} color="#ffffff" position={[-3, 2.1, 2]} rotation={[0, .8, 0]} scale={[5, 3]} /><Lightformer form="rect" intensity={2.2} color="#30353b" position={[3, 1, -2]} rotation={[0, -.9, 0]} scale={[4, 3]} /><Lightformer form="rect" intensity={3} color="#e7b76f" position={[0, 3, -1]} rotation={[Math.PI / 2, 0, 0]} scale={[2, 1]} /></Environment>}
    {view === 'material-debug' && <spotLight position={[-3.2, 1.2, 2.1]} intensity={36} angle={.34} penumbra={.52} color="#ffffff" />}
    {view === 'foil-debug' && <spotLight position={[0, 1.5, 3.2]} intensity={48} angle={.28} penumbra={.35} color="#ffffff" />}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.52, 0]} receiveShadow><planeGeometry args={[7, 7]} /><meshStandardMaterial color={diagnostic ? '#85868a' : '#6a4227'} roughness={.72} /></mesh>
    {!diagnostic && <mesh position={[0, COMPLETE_SHELF_STUDIO_SHELF_TOP_Y - .06, 0]} receiveShadow><boxGeometry args={[4.8, .12, 1.15]} /><meshStandardMaterial color="#3b2113" roughness={.58} /></mesh>}
    <StudioCamera view={view} engineState={activeEngineState} engineCamera={engineCamera} />{activeEngineState ? <CompleteShelfPrototype state={activeEngineState} collisionDebug={collisionDebug} presentationQuery={presentationQuery} /> : view === 'material-debug' ? <MaterialDebug /> : view === 'foil-debug' ? <FoilDebug /> : view === 'foil-metal-debug' ? <FoilMetalDebug /> : <StudioBooks view={view} />}
  </Canvas>{activeEngineState && <nav aria-label="TutorBook prototype states" style={{ position: 'absolute', right: 20, bottom: 20, display: 'flex', maxWidth: 540, flexWrap: 'wrap', justifyContent: 'flex-end', gap: 6 }}>{ENGINE_STATES.map(state => <button key={state} type="button" onClick={() => setInteractiveEngineState(state)} aria-pressed={state === activeEngineState} style={{ border: '1px solid #b89757', background: state === activeEngineState ? '#d2aa5b' : '#1b273b', color: state === activeEngineState ? '#18120a' : '#f7e7c2', padding: '7px 9px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', cursor: 'pointer' }}>{state.replace(/-/g, ' ')}</button>)}</nav>}</main>;
}
