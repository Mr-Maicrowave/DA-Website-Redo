import { RoundedBox, Text } from '@react-three/drei';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, DataTexture, DirectionalLight, DoubleSide, Group, InstancedMesh, MeshStandardMaterial, Object3D, RGBAFormat, RepeatWrapping, SRGBColorSpace, UnsignedByteType } from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { SUBJECT_WALLS, getWallAngle, type SubjectWall, type TutorBookEdition } from './tutor-library-data';
import { createCabinetBlueprint } from './room-architecture';
import { CASE_STRIP_TILT_X, createCaseLightPlan, getIlluminationAngle } from './tutor-library-lighting';
import { createTutorBookEditions } from './tutor-library-data';
import { TUTORS } from '../../data/teacherCatalogue';
import { TutorShelf } from './TutorShelf';
import type { LibraryEvent, LibraryPhase } from './tutor-library-state';
import type { CompleteShelfBookPool } from './complete-shelf-book-pool';
import type { CompleteShelfTutorRig } from './CompleteShelfTutorBookBridge';
import type { TutorBookPageTurnDirection } from './tutor-book-pages';

RectAreaLightUniformsLib.init();

const ROOM_RADIUS = 8;
const ROOM_HEIGHT = 5.8;
const WALL_COLOURS: Record<SubjectWall['palette'], { label: string; accent: string; back: string }> = {
  primary: { label: '#f2d59b', accent: '#77503a', back: '#3d2115' },
  mathematics: { label: '#d8e4ef', accent: '#263f5d', back: '#263541' },
  english: { label: '#f0d0ba', accent: '#5f2831', back: '#3f1e22' },
  'science-social': { label: '#e5dbb7', accent: '#31435c', back: '#25364c' },
};
const TUTOR_BY_ID = new Map(TUTORS.map(tutor => [tutor.id, tutor]));
const BOOK_EDITIONS = createTutorBookEditions(TUTORS);
const EDITIONS_BY_WALL = new Map(SUBJECT_WALLS.map(wall => [
  wall.id,
  BOOK_EDITIONS.filter(edition => edition.wallId === wall.id),
]));
const WALL_WIDTH = 2 * ROOM_RADIUS * Math.tan(Math.PI / SUBJECT_WALLS.length) + .45;
const ROOM_SHELL_CORNERS: ReadonlyArray<readonly [number, number]> = [
  [-ROOM_RADIUS, -ROOM_RADIUS],
  [ROOM_RADIUS, -ROOM_RADIUS],
  [ROOM_RADIUS, ROOM_RADIUS],
  [-ROOM_RADIUS, ROOM_RADIUS],
];
const FLOOR_BOARDS = Array.from({ length: 58 }, (_, index) => ({
  x: -8.12 + index * .286,
  width: [.255, .278, .292, .266][index % 4],
  tone: ['#2b180f', '#24130c', '#301c11', '#27160e', '#342016'][index % 5],
  offset: index % 3 === 0 ? .035 : index % 3 === 1 ? -.025 : .01,
}));
const DECORATIVE_BOOK_SLOTS = [
  { row: 0, bay: 0, x: -.43, lean: -.05 }, { row: 0, bay: 0, x: -.31, lean: .04 },
  { row: 0, bay: 1, x: .34, lean: -.06 }, { row: 0, bay: 2, x: .35, lean: .08 },
  { row: 1, bay: 0, x: .39, lean: -.1 }, { row: 1, bay: 1, x: -.38, lean: .06 },
  { row: 1, bay: 2, x: -.38, lean: -.08 }, { row: 1, bay: 2, x: -.27, lean: .05 },
  { row: 2, bay: 0, x: -.41, lean: .08 }, { row: 2, bay: 1, x: .37, lean: -.07 },
  { row: 2, bay: 2, x: .36, lean: .06 }, { row: 2, bay: 2, x: .25, lean: -.04 },
  { row: 3, bay: 0, x: .39, lean: -.07 }, { row: 3, bay: 1, x: -.38, lean: .05 },
  { row: 3, bay: 2, x: -.38, lean: -.09 }, { row: 3, bay: 2, x: -.27, lean: .04 },
] as const;
const DECORATIVE_BOOK_COLOURS = ['#76434a', '#31594b', '#3a5278', '#795538', '#4b5960', '#28636a', '#697385', '#6a4f70', '#8d5150'] as const;
const DECORATIVE_BOOK_DETAIL_COLOURS = ['#c79958', '#a9b597', '#a4b7c7', '#b7a476'] as const;

type RoomBookInteractionProps = {
  generation: number;
  reducedMotion: boolean;
  pageTurnDirection: TutorBookPageTurnDirection;
  onActivate: (editionId: string, rootUuid: string) => void;
  onRigReady: (editionId: string, rootUuid: string, token: number) => void;
  onRigUnavailable: (editionId: string, rootUuid: string) => void;
  onLifecycleComplete: (event: LibraryEvent) => void;
  onPageSettled: (settledPages: number) => void;
  onError: (message: string) => void;
};

const WALNUT_GRAIN = (() => {
  const size = 32;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
    const index = (y * size + x) * 4;
    const grain = 168 + Math.round(Math.sin(x * .72 + y * .19) * 11 + Math.sin(x * 2.4) * 4);
    pixels[index] = grain; pixels[index + 1] = grain; pixels[index + 2] = grain - 5; pixels[index + 3] = 255;
  }
  const texture = new DataTexture(pixels, size, size, RGBAFormat, UnsignedByteType);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping; texture.wrapT = RepeatWrapping;
  texture.repeat.set(5, 2);
  texture.needsUpdate = true;
  return texture;
})();

const CABINET_MATERIALS = new Map<string, MeshStandardMaterial>();

function getCabinetMaterial(color: string, roughness: number, metalness: number, grain: boolean) {
  const key = `${color}:${roughness}:${metalness}:${grain ? 'grain' : 'flat'}`;
  const existing = CABINET_MATERIALS.get(key);
  if (existing) return existing;
  const material = new MeshStandardMaterial({
    color,
    map: grain ? WALNUT_GRAIN : null,
    roughness,
    metalness,
  });
  CABINET_MATERIALS.set(key, material);
  return material;
}

type BoxProps = { size: [number, number, number]; position: [number, number, number]; color: string; roughness?: number; metalness?: number; radius?: number; grain?: boolean };

function CabinetBox({ size, position, color, roughness = 0.68, metalness = 0.04, radius = 0.035, grain = true }: BoxProps) {
  return <RoundedBox args={size} position={position} radius={radius} smoothness={3} castShadow receiveShadow>
    <primitive object={getCabinetMaterial(color, roughness, metalness, grain)} attach="material" dispose={null} />
  </RoundedBox>;
}

function CabinetMoulding({ width, y, z, color, depth = .13 }: { width: number; y: number; z: number; color: string; depth?: number }) {
  return <group>
    <CabinetBox size={[width, .06, depth]} position={[0, y - .026, z]} color="#2b160d" roughness={.5} radius={.022} />
    <CabinetBox size={[width - .06, .085, depth - .025]} position={[0, y, z + .026]} color={color} roughness={.43} radius={.022} />
    <CabinetBox size={[width - .19, .044, depth + .042]} position={[0, y + .048, z + .048]} color="#70482d" roughness={.35} radius={.014} />
    <CabinetBox size={[width - .33, .019, depth + .066]} position={[0, y + .075, z + .068]} color="#9a7046" roughness={.29} radius={.008} />
  </group>;
}

function FramedPanel({ width, height, x, color, emphasis = false }: { width: number; height: number; x: number; color: string; emphasis?: boolean }) {
  const rail = emphasis ? .105 : .072;
  const depth = emphasis ? .13 : .095;
  return <group position={[x, -.03, .115]}>
    <CabinetBox size={[width, height, .042]} position={[0, 0, -.028]} color="#21110b" roughness={.73} radius={.025} />
    <CabinetBox size={[width - rail * 2, height - rail * 2, .024]} position={[0, 0, .006]} color={color} roughness={.72} radius={.018} grain={false} />
    <CabinetBox size={[width, rail, depth]} position={[0, height / 2 - rail / 2, .034]} color="#4e2c1b" roughness={.42} radius={.018} />
    <CabinetBox size={[width, rail, depth]} position={[0, -height / 2 + rail / 2, .034]} color="#4e2c1b" roughness={.42} radius={.018} />
    <CabinetBox size={[rail, height - rail * 2, depth]} position={[-width / 2 + rail / 2, 0, .034]} color="#432415" roughness={.44} radius={.018} />
    <CabinetBox size={[rail, height - rail * 2, depth]} position={[width / 2 - rail / 2, 0, .034]} color="#432415" roughness={.44} radius={.018} />
    <CabinetBox size={[width - rail * 2 - .06, .018, .026]} position={[0, height / 2 - rail - .026, .101]} color="#805137" roughness={.34} radius={.007} />
  </group>;
}

function ShelfFrontProfile({ width, y, depth, nosingDepth }: { width: number; y: number; depth: number; nosingDepth: number }) {
  return <group>
    <CabinetBox size={[width, .045, depth + .035]} position={[0, y + .05, .34 + depth / 2 - .014]} color="#70452a" roughness={.36} radius={.014} />
    <CabinetBox size={[width + .07, .092, nosingDepth + .02]} position={[0, y + .004, .34 + depth / 2 - nosingDepth / 2]} color="#351b10" roughness={.39} radius={.026} />
    <CabinetBox size={[width - .11, .032, .067]} position={[0, y - .053, .34 + depth / 2 - .084]} color="#8d5c38" roughness={.34} radius={.01} />
    <CabinetBox size={[width - .18, .024, .046]} position={[0, y - .086, .34 + depth / 2 - .12]} color="#28130b" roughness={.5} radius={.008} />
  </group>;
}

/** One batched, non-interactive layer keeps shelf texture rich without additional book controllers. */
function DecorativeShelfBooks({ cabinet, wallId }: { cabinet: ReturnType<typeof createCabinetBlueprint>; wallId: string }) {
  const mesh = useRef<InstancedMesh>(null);
  const detailMesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const books = useMemo(() => DECORATIVE_BOOK_SLOTS.map((slot, index) => {
    const bay = cabinet.bays[slot.bay];
    const seed = wallId.length + wallId.charCodeAt(index % wallId.length) + index * 7;
    const height = .54 + (seed % 6) * .065;
    const depth = .22 + (seed % 3) * .028;
    return {
      position: [bay.centerX + slot.x * bay.width, cabinet.shelfLevels[slot.row] + cabinet.shelfThickness / 2 + height / 2, bay.bookFrontZ - depth / 2 - .05] as const,
      scale: [.12 + (seed % 4) * .027, height, depth] as const,
      lean: slot.lean,
    };
  }), [cabinet, wallId]);

  useLayoutEffect(() => {
    const target = mesh.current;
    const details = detailMesh.current;
    if (!target || !details) return;
    books.forEach((book, index) => {
      dummy.position.set(...book.position);
      dummy.rotation.set(0, Math.PI / 2, book.lean);
      dummy.scale.set(...book.scale);
      dummy.updateMatrix();
      target.setMatrixAt(index, dummy.matrix);
      target.setColorAt(index, new Color(DECORATIVE_BOOK_COLOURS[index % DECORATIVE_BOOK_COLOURS.length]));

      dummy.position.set(...book.position);
      dummy.rotation.set(0, Math.PI / 2, book.lean);
      dummy.translateY(book.scale[1] * .24);
      dummy.translateZ(book.scale[2] / 2 + .008);
      dummy.scale.set(book.scale[0] * 1.12, .024, .012);
      dummy.updateMatrix();
      details.setMatrixAt(index, dummy.matrix);
      details.setColorAt(index, new Color(DECORATIVE_BOOK_DETAIL_COLOURS[index % DECORATIVE_BOOK_DETAIL_COLOURS.length]));
    });
    target.instanceMatrix.needsUpdate = true;
    if (target.instanceColor) target.instanceColor.needsUpdate = true;
    details.instanceMatrix.needsUpdate = true;
    if (details.instanceColor) details.instanceColor.needsUpdate = true;
  }, [books, dummy]);

  return <group>
    <instancedMesh ref={mesh} args={[undefined, undefined, books.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" vertexColors roughness={.66} metalness={.045} emissive="#765d43" emissiveIntensity={.22} />
    </instancedMesh>
    <instancedMesh ref={detailMesh} name="decorative-book-edge-details" args={[undefined, undefined, books.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" vertexColors roughness={.34} metalness={.24} emissive="#b98b50" emissiveIntensity={.08} />
    </instancedMesh>
  </group>;
}

function FloorBoards() {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useLayoutEffect(() => {
    const target = mesh.current;
    if (!target) return;
    FLOOR_BOARDS.forEach((board, index) => {
      dummy.position.set(board.x, .02, board.offset);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(board.width, 1, 1);
      dummy.updateMatrix();
      target.setMatrixAt(index, dummy.matrix);
      target.setColorAt(index, new Color(board.tone));
    });
    target.instanceMatrix.needsUpdate = true;
    if (target.instanceColor) target.instanceColor.needsUpdate = true;
  }, [dummy]);

  return <instancedMesh ref={mesh} args={[undefined, undefined, FLOOR_BOARDS.length]} receiveShadow>
    <boxGeometry args={[1, .042, 16.9]} />
    <meshStandardMaterial color="#ffffff" vertexColors roughness={.52} metalness={.02} />
  </instancedMesh>;
}

function WallShelves({ visible, wall, angle, width, showWallLabel, spotlightEditions, pool, rigIntentEditionId, rigIntentToken, onRigIntent, phase, generation, reducedMotion, pageTurnDirection, selectedEditionId, motionProgress, motionProgressRef, onActivate, onRigReady, onRigUnavailable, onLifecycleComplete, onPageSettled, onError }: { visible: boolean; wall: SubjectWall; angle: number; width: number; showWallLabel: boolean; spotlightEditions?: readonly TutorBookEdition[]; pool: CompleteShelfBookPool<CompleteShelfTutorRig>; rigIntentEditionId?: string; rigIntentToken: number; onRigIntent: (editionId?: string) => void; phase: LibraryPhase; selectedEditionId?: string; motionProgress: number; motionProgressRef: Readonly<{ current: { turn: number; book: number } }> } & RoomBookInteractionProps) {
  const palette = WALL_COLOURS[wall.palette];
  const cabinet = useMemo(() => createCabinetBlueprint(width, ROOM_HEIGHT), [width]);
  const interiorHeight = ROOM_HEIGHT - .82;
  const shelfWidth = width - cabinet.frameThickness * 1.8;
  return <group visible={visible} position={[Math.sin(angle) * ROOM_RADIUS, ROOM_HEIGHT / 2, -Math.cos(angle) * ROOM_RADIUS]} rotation={[0, -angle, 0]}>
    <pointLight position={[0, .2, 1.55]} intensity={3.4} distance={7.2} decay={2} color="#ffe8c4" />
    <CabinetBox size={[width + .32, ROOM_HEIGHT + .16, .15]} position={[0, 0, -.16]} color="#102039" roughness={.9} radius={.035} grain={false} />
    <CabinetBox size={[width, ROOM_HEIGHT, .2]} position={[0, 0, cabinet.backPanelZ]} color="#28160e" roughness={.79} />
    {cabinet.bays.map((bay, index) => <FramedPanel key={`back-${bay.centerX}`} x={bay.centerX} width={bay.width} height={interiorHeight} color={palette.back} emphasis={index === 1} />)}
    <CabinetBox size={[.36, interiorHeight, cabinet.frameDepth]} position={[-width / 2 + .18, -.03, .44]} color="#3a2015" />
    <CabinetBox size={[.36, interiorHeight, cabinet.frameDepth]} position={[width / 2 - .18, -.03, .44]} color="#3a2015" />
    {cabinet.bays.slice(0, -1).map(bay => <group key={`divider-${bay.centerX}`}>
      <CabinetBox size={[.22, interiorHeight, cabinet.recessDepth + .2]} position={[bay.centerX + bay.width / 2 + .13, -.03, .35]} color="#47281a" radius={.03} />
      <CabinetBox size={[.07, interiorHeight - .18, cabinet.recessDepth + .26]} position={[bay.centerX + bay.width / 2 + .13, -.03, .61]} color="#6b4328" roughness={.39} radius={.016} />
    </group>)}
    {cabinet.shelfLevels.map((y, row) => <group key={`shelf-${y}`}>
      <CabinetBox size={[shelfWidth, cabinet.shelfThickness, cabinet.shelfDepth]} position={[0, y, .34]} color="#4b2a1a" roughness={.54} radius={.03} />
      <ShelfFrontProfile width={shelfWidth} y={y} depth={cabinet.shelfDepth} nosingDepth={cabinet.nosingDepth} />
    </group>)}
    <TutorShelf editions={spotlightEditions ?? (EDITIONS_BY_WALL.get(wall.id) ?? [])} spotlight={Boolean(spotlightEditions)} tutors={TUTOR_BY_ID} pool={pool} rigIntentEditionId={rigIntentEditionId} rigIntentToken={rigIntentToken} onRigIntent={onRigIntent} phase={phase} generation={generation} reducedMotion={reducedMotion} pageTurnDirection={pageTurnDirection} selectedEditionId={selectedEditionId} motionProgress={motionProgress} motionProgressRef={motionProgressRef} onActivate={onActivate} onRigReady={onRigReady} onRigUnavailable={onRigUnavailable} onLifecycleComplete={onLifecycleComplete} onPageSettled={onPageSettled} onError={onError} />
    {!spotlightEditions && <DecorativeShelfBooks cabinet={cabinet} wallId={wall.id} />}
    <CabinetBox size={[width, cabinet.plinthHeight, 1.04]} position={[0, -ROOM_HEIGHT / 2 + cabinet.plinthHeight / 2, .45]} color="#351a10" roughness={.54} radius={.04} />
    <CabinetMoulding width={width + .16} y={-ROOM_HEIGHT / 2 + .12} z={.45} color="#654028" depth={1.13} />
    <CabinetBox size={[width, .38, 1.06]} position={[0, ROOM_HEIGHT / 2 - .22, .45]} color="#3b1e12" roughness={.52} radius={.04} />
    <CabinetMoulding width={width + .18} y={ROOM_HEIGHT / 2 - .07} z={.45} color="#583421" depth={cabinet.corniceDepth} />
    <CabinetBox size={[width - .78, .035, .035]} position={[0, ROOM_HEIGHT / 2 - .39, .98]} color="#a77945" roughness={.3} metalness={.72} radius={.005} />
    {showWallLabel && <Text position={[0, ROOM_HEIGHT / 2 - .68, 1.01]} font="/fonts/da-prologue-marcellus-sc-400.ttf" fontSize={.24} anchorX="center" color={palette.label} letterSpacing={.075}>{wall.label.toUpperCase()}</Text>}
    <CabinetBox size={[width - .86, .025, .025]} position={[0, -ROOM_HEIGHT / 2 + .43, .96]} color={palette.accent} roughness={.32} metalness={.55} radius={.004} />
  </group>;
}

function RoomShell() {
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[17.2, 17.2]} /><meshStandardMaterial color="#160d0a" roughness={.64} metalness={.08} side={DoubleSide} /></mesh>
    <FloorBoards />
    <CabinetBox size={[17.2, .16, 17.2]} position={[0, ROOM_HEIGHT, 0]} color="#0b1930" roughness={.86} radius={.035} grain={false} />
    <CabinetBox size={[15.75, .055, 15.75]} position={[0, ROOM_HEIGHT - .12, 0]} color="#10223b" roughness={.92} radius={.04} grain={false} />
    <CabinetBox size={[17.1, .16, .28]} position={[0, .18, -ROOM_RADIUS]} color="#3b2115" roughness={.5} />
    <CabinetBox size={[17.1, .16, .28]} position={[0, .18, ROOM_RADIUS]} color="#3b2115" roughness={.5} />
    <CabinetBox size={[.28, .16, 17.1]} position={[-ROOM_RADIUS, .18, 0]} color="#3b2115" roughness={.5} />
    <CabinetBox size={[.28, .16, 17.1]} position={[ROOM_RADIUS, .18, 0]} color="#3b2115" roughness={.5} />
    <CabinetBox size={[17.1, .14, .28]} position={[0, ROOM_HEIGHT - .1, -ROOM_RADIUS]} color="#54331f" roughness={.42} />
    <CabinetBox size={[17.1, .14, .28]} position={[0, ROOM_HEIGHT - .1, ROOM_RADIUS]} color="#54331f" roughness={.42} />
    <CabinetBox size={[.28, .14, 17.1]} position={[-ROOM_RADIUS, ROOM_HEIGHT - .1, 0]} color="#54331f" roughness={.42} />
    <CabinetBox size={[.28, .14, 17.1]} position={[ROOM_RADIUS, ROOM_HEIGHT - .1, 0]} color="#54331f" roughness={.42} />
    {ROOM_SHELL_CORNERS.map(([x, z]) => <group key={`${x}-${z}`}>
      <CabinetBox size={[.62, ROOM_HEIGHT, .62]} position={[x, ROOM_HEIGHT / 2, z]} color="#211008" roughness={.51} radius={.07} />
      <CabinetBox size={[.44, ROOM_HEIGHT - .52, .44]} position={[x, ROOM_HEIGHT / 2, z]} color="#3a1e12" roughness={.45} radius={.055} />
      <CabinetBox size={[.28, ROOM_HEIGHT - .82, .28]} position={[x, ROOM_HEIGHT / 2, z]} color="#5b3520" roughness={.38} radius={.04} />
      <CabinetBox size={[.58, .2, .58]} position={[x, ROOM_HEIGHT - .22, z]} color="#613d26" roughness={.38} radius={.03} />
      <CabinetBox size={[.58, .15, .58]} position={[x, .18, z]} color="#593722" roughness={.42} radius={.03} />
      <CabinetBox size={[.08, ROOM_HEIGHT - .76, .08]} position={[x + (x > 0 ? -.24 : .24), ROOM_HEIGHT / 2, z + (z > 0 ? -.24 : .24)]} color="#9a7040" roughness={.28} metalness={.7} radius={.01} />
    </group>)}
    <group position={[0, ROOM_HEIGHT - .24, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.56, .72, .16, 32]} /><meshStandardMaterial color="#a97b43" roughness={.3} metalness={.72} emissive="#5d3d16" emissiveIntensity={.5} /></mesh>
      <mesh position={[0, -.085, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[.5, 32]} /><meshBasicMaterial color="#ffeac3" /></mesh>
      <pointLight position={[0, -.34, 0]} intensity={16} distance={12} decay={2} color="#fff0cf" />
    </group>
  </group>;
}

const CASE_LIGHT_PLAN = createCaseLightPlan(WALL_WIDTH, ROOM_HEIGHT);

/**
 * Strips under each shelf board plus one shadow-casting key, mounted on a single group that travels
 * to the case being viewed. Keeping the light count constant matters: adding or removing a light
 * recompiles every material in the scene, which would stall the room turn.
 */
function CaseLighting({ fromWallIndex, toWallIndex, motionProgressRef }: { fromWallIndex: number; toWallIndex: number; motionProgressRef: Readonly<{ current: { turn: number } }> }) {
  const key = useRef<DirectionalLight>(null);
  const aim = useRef<Object3D>(null);
  const lights = useRef<Group>(null);

  useLayoutEffect(() => {
    if (key.current && aim.current) key.current.target = aim.current;
  }, []);

  useFrame(() => {
    const group = lights.current;
    if (!group) return;
    const angle = getIlluminationAngle(fromWallIndex, toWallIndex, motionProgressRef.current.turn, SUBJECT_WALLS.length);
    group.position.set(Math.sin(angle) * ROOM_RADIUS, ROOM_HEIGHT / 2, -Math.cos(angle) * ROOM_RADIUS);
    group.rotation.set(0, -angle, 0);
  });

  return <group ref={lights}>
    {CASE_LIGHT_PLAN.map(strip => <rectAreaLight key={strip.row} position={[0, strip.y, strip.z]} rotation={[CASE_STRIP_TILT_X, 0, 0]} width={strip.width} height={strip.height} intensity={strip.intensity} color="#ffe3ae" />)}
    <object3D ref={aim} position={[0, -.45, .42]} />
    <directionalLight ref={key} castShadow position={[1.7, 3.3, 5.4]} intensity={1.25} color="#ffe7c2" shadow-mapSize={[2048, 2048]} shadow-bias={-.0006} shadow-normalBias={.018} shadow-camera-left={-8.6} shadow-camera-right={8.6} shadow-camera-top={5.4} shadow-camera-bottom={-5.4} shadow-camera-near={.5} shadow-camera-far={18} />
    <pointLight position={[0, 1.1, 2.2]} intensity={6.5} distance={7.6} decay={2} color="#ffdfae" />
  </group>;
}

export function isTutorLibraryWallVisible(index: number, activeWallIndex: number, pendingWallIndex: number, phase: LibraryPhase) {
  const wallCount = SUBJECT_WALLS.length;
  const distanceFromActive = Math.min(
    (index - activeWallIndex + wallCount) % wallCount,
    (activeWallIndex - index + wallCount) % wallCount,
  );

  // The adjoining cases remain at the edge of the camera composition. Cull only the wall
  // opposite the viewer, rather than leaving the rotunda's corners visibly empty at rest.
  return distanceFromActive <= 1 || (phase === 'ROOM_TURNING' && index === pendingWallIndex);
}

export function RoomRotunda({ fromWallIndex, toWallIndex, showWallLabels = true, spotlightEditions, pool, rigIntentEditionId, rigIntentToken, onRigIntent, phase, generation, reducedMotion, pageTurnDirection, selectedEditionId, motionProgress, motionProgressRef, onActivate, onRigReady, onRigUnavailable, onLifecycleComplete, onPageSettled, onError }: { fromWallIndex: number; toWallIndex: number; showWallLabels?: boolean; spotlightEditions?: readonly TutorBookEdition[]; pool: CompleteShelfBookPool<CompleteShelfTutorRig>; rigIntentEditionId?: string; rigIntentToken: number; onRigIntent: (editionId?: string) => void; phase: LibraryPhase; selectedEditionId?: string; motionProgress: number; motionProgressRef: Readonly<{ current: { turn: number; book: number } }> } & RoomBookInteractionProps) {
  return <group><RoomShell /><CaseLighting fromWallIndex={fromWallIndex} toWallIndex={toWallIndex} motionProgressRef={motionProgressRef} />{SUBJECT_WALLS.map((wall, index) => <WallShelves key={wall.id} visible={isTutorLibraryWallVisible(index, fromWallIndex, toWallIndex, phase)} wall={wall} angle={getWallAngle(index, SUBJECT_WALLS.length)} width={WALL_WIDTH} showWallLabel={showWallLabels} spotlightEditions={spotlightEditions ? (index === fromWallIndex ? spotlightEditions : []) : undefined} pool={pool} rigIntentEditionId={rigIntentEditionId} rigIntentToken={rigIntentToken} onRigIntent={onRigIntent} phase={phase} generation={generation} reducedMotion={reducedMotion} pageTurnDirection={pageTurnDirection} selectedEditionId={selectedEditionId} motionProgress={motionProgress} motionProgressRef={motionProgressRef} onActivate={onActivate} onRigReady={onRigReady} onRigUnavailable={onRigUnavailable} onLifecycleComplete={onLifecycleComplete} onPageSettled={onPageSettled} onError={onError} />)}</group>;
}
