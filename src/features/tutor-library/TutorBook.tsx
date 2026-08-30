import { RoundedBox } from '@react-three/drei';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Vector2 } from 'three';
import type { CatalogueTutor } from '../../data/teacherCatalogue';
import {
  getCompleteShelfOuterMotionPose,
  advanceCompleteShelfOuterMotion,
  createCompleteShelfOuterMotionState,
  shouldAcquireCompleteShelfRig,
  shouldStartCompleteShelfRigIntent,
  type CompleteShelfBookPool,
} from './complete-shelf-book-pool';
import {
  CompleteShelfTutorBookBridge,
  type CompleteShelfTutorRig,
} from './CompleteShelfTutorBookBridge';
import type { TutorBookEdition } from './tutor-library-data';
import { createBookParts, getBookVisualProfile, getShelfPose } from './tutor-book-geometry';
import { createBookMotionPoses, interpolateBookMotion } from './tutor-book-motion';
import { TutorBookCover, TutorBookFoil, type SpineTreatment, useBookMaterialMaps } from './TutorBookCover';
import type { LibraryEvent, LibraryPhase } from './tutor-library-state';
import type { TutorBookPageTurnDirection } from './tutor-book-pages';

const COVER_COLOURS = ['#203a57', '#6a3035', '#63462c', '#25465a'];
const PAPER = ['#eadbb9', '#e4d2aa', '#f0dfbd'];

function LegacyTutorBook({ edition, tutor, phase, selected, motionProgress, neighbourResponse = 0, onHover, poseOverride, studio = false, spineTreatment, geometryDebug = false }: { edition: TutorBookEdition; tutor: CatalogueTutor; phase: LibraryPhase; selected: boolean; motionProgress: number; neighbourResponse?: number; onHover: (editionId: string) => void; poseOverride?: ReturnType<typeof getShelfPose>; studio?: boolean; spineTreatment?: SpineTreatment; geometryDebug?: boolean }) {
  const shelfPose = useMemo(() => getShelfPose(edition), [edition]);
  const pose = poseOverride ?? shelfPose;
  const profile = useMemo(() => getBookVisualProfile(edition), [edition]);
  const materials = useBookMaterialMaps();
  const parts = useMemo(() => createBookParts(pose.width, pose.height, pose.depth), [pose.depth, pose.height, pose.width]);
  const motion = useMemo(() => createBookMotionPoses(pose), [pose]);
  const cover = COVER_COLOURS[edition.materialVariant % COVER_COLOURS.length];
  const activeMotion = !studio && selected && (phase === 'BOOK_HOVER_INTENT' || phase === 'BOOK_EXTRACTING' || phase === 'BOOK_PREVIEW' || phase === 'BOOK_RETURNING');
  const currentPose = !activeMotion ? motion.shelf
    : phase === 'BOOK_HOVER_INTENT' ? interpolateBookMotion(motion.shelf, motion.extraction.to, .08)
      : phase === 'BOOK_EXTRACTING' ? (motionProgress < .42
        ? interpolateBookMotion(motion.extraction.from, motion.extraction.to, motionProgress / .42)
        : interpolateBookMotion(motion.preview.from, motion.preview.to, (motionProgress - .42) / .58))
        : phase === 'BOOK_RETURNING' ? interpolateBookMotion(motion.preview.to, motion.shelf, motionProgress) : motion.preview.to;
  const studioShowsSpine = studio && Math.abs(pose.rotation[1] - Math.PI / 2) < .02;
  const showCover = !geometryDebug && !studioShowsSpine && (studio || (selected && (phase === 'BOOK_EXTRACTING' || phase === 'BOOK_PREVIEW' || (phase === 'BOOK_RETURNING' && motionProgress < .78))));

  const renderedRotation: [number, number, number] = [currentPose.rotation[0], currentPose.rotation[1], currentPose.rotation[2] + neighbourResponse];

  return <group name={`tutor-book-${edition.id}`} position={currentPose.position} rotation={renderedRotation} scale={currentPose.scale} castShadow onPointerEnter={event => { event.stopPropagation(); onHover(edition.id); }}>
    <group name="back-board-pivot">
      <RoundedBox name="back-board" args={[parts.backBoard.width, parts.backBoard.height, parts.backBoard.depth]} position={[0, 0, -pose.depth / 2 + parts.backBoard.depth / 2]} radius={parts.boardRadius} smoothness={2} castShadow receiveShadow>
        <meshPhysicalMaterial color={geometryDebug ? '#18d94c' : cover} normalMap={geometryDebug ? undefined : materials.clothNormal} normalScale={new Vector2(.12, .12)} roughnessMap={geometryDebug ? undefined : materials.clothRoughness} bumpMap={geometryDebug ? undefined : materials.clothRoughness} bumpScale={.008} roughness={geometryDebug ? .58 : .88} metalness={.01} sheen={geometryDebug ? 0 : .28} sheenRoughness={.7} />
      </RoundedBox>
      <mesh name="rear-endpaper" position={[0, 0, -pose.depth / 2 + parts.backBoard.depth + .001]}><planeGeometry args={[parts.pageBlock.width, parts.pageBlock.height]} /><meshPhysicalMaterial color={geometryDebug ? '#ff9acb' : '#e7dcc4'} roughness={.95} /></mesh>
    </group>
    <mesh name="page-block-core" position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[parts.pageBlock.width, parts.pageBlock.height, parts.pageBlock.depth]} />
      <meshPhysicalMaterial color={geometryDebug ? '#f2dfae' : PAPER[profile.pageTone]} map={geometryDebug ? undefined : materials.paper} roughnessMap={geometryDebug ? undefined : materials.paperBump} bumpMap={geometryDebug ? undefined : materials.paperBump} bumpScale={.012} roughness={.93} metalness={0} />
    </mesh>
    <mesh name="fore-edge" position={[parts.pageBlock.width / 2 + .002, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[parts.pageBlock.depth - .01, parts.pageBlock.height - .008]} /><meshPhysicalMaterial color={geometryDebug ? '#f6df31' : '#f0e7d5'} map={geometryDebug ? undefined : materials.paper} roughnessMap={geometryDebug ? undefined : materials.paperBump} bumpMap={geometryDebug ? undefined : materials.paperBump} bumpScale={.018} roughness={.94} /></mesh>
    <mesh name="head-edge" position={[0, parts.pageBlock.height / 2 + .002, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[parts.pageBlock.width, parts.pageBlock.depth - .01]} /><meshPhysicalMaterial color={geometryDebug ? '#ff922e' : '#f1e8d7'} map={geometryDebug ? undefined : materials.paper} roughnessMap={geometryDebug ? undefined : materials.paperBump} bumpMap={geometryDebug ? undefined : materials.paperBump} bumpScale={.014} roughness={.94} /></mesh>
    <mesh name="tail-edge" position={[0, -parts.pageBlock.height / 2 - .002, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[parts.pageBlock.width, parts.pageBlock.depth - .01]} /><meshPhysicalMaterial color={geometryDebug ? '#9d4edd' : '#e9dcc7'} map={geometryDebug ? undefined : materials.paper} roughnessMap={geometryDebug ? undefined : materials.paperBump} bumpMap={geometryDebug ? undefined : materials.paperBump} bumpScale={.014} roughness={.94} /></mesh>
    <group name="front-board-pivot">
      <RoundedBox name="front-board" args={[parts.frontBoard.width, parts.frontBoard.height, parts.frontBoard.depth]} position={[0, 0, pose.depth / 2 - parts.frontBoard.depth / 2]} radius={parts.boardRadius} smoothness={2} castShadow receiveShadow>
        <meshPhysicalMaterial color={geometryDebug ? '#f32121' : cover} normalMap={geometryDebug ? undefined : materials.clothNormal} normalScale={new Vector2(.12, .12)} roughnessMap={geometryDebug ? undefined : materials.clothRoughness} bumpMap={geometryDebug ? undefined : materials.clothRoughness} bumpScale={.008} roughness={geometryDebug ? .58 : .88} metalness={.01} sheen={geometryDebug ? 0 : .28} sheenRoughness={.7} />
      </RoundedBox>
      <mesh name="front-endpaper" position={[0, 0, pose.depth / 2 - parts.frontBoard.depth - .001]} rotation={[0, Math.PI, 0]}><planeGeometry args={[parts.pageBlock.width, parts.pageBlock.height]} /><meshPhysicalMaterial color={geometryDebug ? '#ff9acb' : '#e7dcc4'} roughness={.95} /></mesh>
    </group>
    <RoundedBox name="spine" args={[parts.spine.width, parts.spine.height, parts.spine.depth]} position={[-pose.width / 2 + parts.spine.width / 2, 0, 0]} radius={parts.boardRadius * .45} smoothness={2} castShadow receiveShadow>
      <meshPhysicalMaterial color={geometryDebug ? '#2789ff' : cover} normalMap={geometryDebug ? undefined : materials.clothNormal} normalScale={new Vector2(.12, .12)} roughnessMap={geometryDebug ? undefined : materials.clothRoughness} bumpMap={geometryDebug ? undefined : materials.clothRoughness} bumpScale={.008} roughness={geometryDebug ? .58 : .88} metalness={.01} sheen={geometryDebug ? 0 : .3} sheenRoughness={.7} />
    </RoundedBox>
    <mesh name="spine-lining" position={[-pose.width / 2 + parts.spine.width * .75, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[parts.pageBlock.depth * .82, parts.pageBlock.height - .03]} /><meshPhysicalMaterial color={geometryDebug ? '#fff' : '#d7c5a4'} roughness={.96} /></mesh>
    {[-1, 1].map(side => <mesh key={side} name="joint-groove" position={[-pose.width / 2 + parts.spine.width + parts.jointWidth / 2, 0, side * (parts.pageBlock.depth / 2 + .002)]}><planeGeometry args={[parts.jointWidth, parts.pageBlock.height]} /><meshPhysicalMaterial color={geometryDebug ? side < 0 ? '#e72ccf' : '#25d6db' : '#120d0b'} roughness={1} transparent={!geometryDebug} opacity={geometryDebug ? 1 : .38} /></mesh>)}
    {[-1, 1].map(direction => <mesh key={`headband-${direction}`} name="headband" position={[-parts.pageBlock.width / 2 + parts.spine.width * .72, direction * (parts.pageBlock.height / 2 - .006), 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.0045, .0045, parts.pageBlock.depth * .78, 10]} /><meshPhysicalMaterial color={geometryDebug ? '#31ff64' : '#a06b42'} roughness={.72} /></mesh>)}
    <group name="spine-and-hinges">
      <TutorBookCover tutor={tutor} edition={edition} mode="spine" width={parts.spine.depth - .024} height={parts.spine.height - .065} position={[-pose.width / 2 - .002, 0, 0]} rotation={[0, -Math.PI / 2, 0]} visible={!showCover} />
      <TutorBookFoil tutor={tutor} edition={edition} mode="spine" width={parts.spine.depth - .018} height={parts.spine.height - .04} position={[-pose.width / 2 - .003, 0, 0]} rotation={[0, -Math.PI / 2, 0]} visible={!showCover} spineTreatment={spineTreatment} />
    </group>
    <group name="front-cover-art"><TutorBookCover tutor={tutor} edition={edition} mode="cover" width={parts.frontBoard.width - .025} height={parts.frontBoard.height - .03} z={pose.depth / 2 + parts.frontBoard.depth / 2 + .001} visible={showCover} /><TutorBookFoil tutor={tutor} edition={edition} mode="cover" width={parts.frontBoard.width - .025} height={parts.frontBoard.height - .03} z={pose.depth / 2 + parts.frontBoard.depth / 2 + .002} visible={showCover} /></group>
    {selected && <pointLight position={[-.3, .6, 1.1]} intensity={2.4} distance={3.2} color="#ffe8b1" />}
  </group>;
}

const COMPLETE_SHELF_WIDTH = 1.02;
const COMPLETE_SHELF_HEIGHT = 1.58;
const COMPLETE_SHELF_CLOSED_DEPTH = .324;
const COMPLETE_SHELF_SPINE_X = -COMPLETE_SHELF_WIDTH / 2 - .008;

type TutorBookProps = {
  edition: TutorBookEdition;
  tutor: CatalogueTutor;
  phase: LibraryPhase;
  selected: boolean;
  motionProgress: number;
  neighbourResponse?: number;
  onHover: (editionId: string, rootUuid: string) => void;
  onActivate?: (editionId: string, rootUuid: string) => void;
  onRigReady?: (editionId: string, rootUuid: string, token: number) => void;
  onRigUnavailable?: (editionId: string, rootUuid: string) => void;
  onLifecycleComplete?: (event: LibraryEvent) => void;
  onPageSettled?: (settledPages: number) => void;
  onError?: (message: string) => void;
  generation?: number;
  reducedMotion?: boolean;
  pageTurnDirection?: TutorBookPageTurnDirection;
  pool?: CompleteShelfBookPool<CompleteShelfTutorRig>;
  rigIntent?: boolean;
  rigIntentToken?: number;
  onRigIntent?: (editionId?: string) => void;
  poseOverride?: ReturnType<typeof getShelfPose>;
  studio?: boolean;
  spineTreatment?: SpineTreatment;
  geometryDebug?: boolean;
};

function DormantCompleteShelfProxy({ tutor, edition }: { tutor: CatalogueTutor; edition: TutorBookEdition }) {
  const cover = COVER_COLOURS[edition.materialVariant % COVER_COLOURS.length];
  return <group name={`dormant-complete-shelf-proxy-${edition.id}`}>
    <RoundedBox args={[COMPLETE_SHELF_WIDTH, COMPLETE_SHELF_HEIGHT, COMPLETE_SHELF_CLOSED_DEPTH]} radius={.0045} smoothness={2} castShadow receiveShadow>
      <meshPhysicalMaterial color={cover} roughness={.94} metalness={.02} sheen={.28} sheenRoughness={.78} />
    </RoundedBox>
    <TutorBookCover tutor={tutor} edition={edition} mode="spine" width={COMPLETE_SHELF_CLOSED_DEPTH - .018} height={COMPLETE_SHELF_HEIGHT - .075} position={[COMPLETE_SHELF_SPINE_X, 0, 0]} rotation={[0, -Math.PI / 2, 0]} visible />
    <TutorBookFoil tutor={tutor} edition={edition} mode="spine" width={COMPLETE_SHELF_CLOSED_DEPTH - .014} height={COMPLETE_SHELF_HEIGHT - .04} position={[COMPLETE_SHELF_SPINE_X - .001, 0, 0]} rotation={[0, -Math.PI / 2, 0]} visible />
  </group>;
}

function RoomTutorBook({ edition, tutor, phase, selected, motionProgress, neighbourResponse = 0, onHover, onActivate, onRigReady, onRigUnavailable, onLifecycleComplete, onPageSettled, onError, generation = 0, reducedMotion = false, pageTurnDirection = 1, pool, rigIntent = false, rigIntentToken = 0, onRigIntent }: TutorBookProps & { pool: CompleteShelfBookPool<CompleteShelfTutorRig> }) {
  const [rigReady, setRigReady] = useState(false);
  const activationRequested = useRef(false);
  const rootUuid = useRef<string>();
  const motionState = useRef(createCompleteShelfOuterMotionState(edition));
  const nextMotionState = advanceCompleteShelfOuterMotion(
    motionState.current,
    selected ? phase : 'ROOM_IDLE',
    motionProgress,
  );
  useLayoutEffect(() => { motionState.current = nextMotionState; }, [nextMotionState]);
  const pose = nextMotionState.pose;
  const rigRequested = shouldAcquireCompleteShelfRig({
    phase,
    editionId: edition.id,
    intentEditionId: rigIntent ? edition.id : undefined,
    selectedEditionId: selected ? edition.id : undefined,
  });
  const rotation: [number, number, number] = [pose.rotation[0], pose.rotation[1], pose.rotation[2] + neighbourResponse];

  return <group
    name={`tutor-book-${edition.id}`}
    position={pose.position}
    rotation={rotation}
    scale={pose.scale}
    castShadow
    onPointerEnter={(event) => {
      event.stopPropagation();
    }}
    onClick={(event) => {
      event.stopPropagation();
      if (rootUuid.current) onActivate?.(edition.id, rootUuid.current);
      else if (shouldStartCompleteShelfRigIntent('activate', phase, selected)) {
        activationRequested.current = true;
        setRigReady(false);
        onRigIntent?.(edition.id);
      }
    }}
  >
    <group visible={!rigRequested || !rigReady}><DormantCompleteShelfProxy tutor={tutor} edition={edition} /></group>
    {rigRequested ? <CompleteShelfTutorBookBridge
      key={`${edition.id}:${rigIntentToken}`}
      edition={edition}
      tutor={tutor}
      pool={pool}
      phase={phase}
      active={selected}
      generation={generation}
      reducedMotion={reducedMotion}
      pageTurnDirection={pageTurnDirection}
      onReady={(readyRootUuid) => {
        rootUuid.current = readyRootUuid;
        setRigReady(true);
        onRigReady?.(edition.id, readyRootUuid, rigIntentToken);
        if (activationRequested.current) {
          activationRequested.current = false;
          onActivate?.(edition.id, readyRootUuid);
        }
      }}
      onRelease={(releasedRootUuid) => {
        activationRequested.current = false;
        if (rootUuid.current === releasedRootUuid) rootUuid.current = undefined;
        setRigReady(false);
        onRigUnavailable?.(edition.id, releasedRootUuid);
      }}
      onLifecycleComplete={event => onLifecycleComplete?.(event)}
      onPageSettled={settledPages => onPageSettled?.(settledPages)}
      onError={(message) => {
        if (rootUuid.current) {
          onRigUnavailable?.(edition.id, rootUuid.current);
          rootUuid.current = undefined;
        }
        if (!selected) onRigIntent?.();
        activationRequested.current = false;
        setRigReady(false);
        onError?.(message);
      }}
    /> : null}
    {selected ? <pointLight position={[-.3, .6, 1.1]} intensity={2.4} distance={3.2} color="#ffe8b1" /> : null}
  </group>;
}

export function TutorBook(props: TutorBookProps) {
  if (props.studio) {
    return <LegacyTutorBook {...props} onHover={(editionId) => props.onHover(editionId, '')} />;
  }
  if (!props.pool) throw new Error('Tutor Library room books require a Complete Shelf rig pool');
  return <RoomTutorBook {...props} pool={props.pool} />;
}
