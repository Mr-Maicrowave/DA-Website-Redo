import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  CanvasTexture,
  DoubleSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  MeshPhysicalMaterial,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  Texture,
  Vector2,
  type Group,
} from 'three';
import { getPhotoUrl, type CatalogueTutor } from '../../data/teacherCatalogue';
import type { TutorBookEdition } from './tutor-library-data';
import { COMPLETE_SHELF_STUDIO_SHELF_TOP_Y, createCompleteShelfLeafLayout, getCompleteShelfBookMetrics, getCompleteShelfReadingEnvelope, sampleCompleteShelfPageTurn, shouldRenderCompleteShelfLeaves, type CompleteShelfBookPose } from './complete-shelf-book-prototype';
import type { ShelfPose } from './tutor-book-geometry';

const BOOK_WIDTH = 1.02;
const BOOK_HEIGHT = 1.58;
const BOOK_DEPTH = .26;
const BOOK_BOARD = .032;
const BOOK_SPINE = .082;
const PAGE_WIDTH = BOOK_WIDTH - .074;
const PAGE_HEIGHT = BOOK_HEIGHT - .068;
const CLOSED_PAGE_HEIGHT = PAGE_HEIGHT - .1;
const PAGE_DEPTH = BOOK_DEPTH - .026;
const PAGE_VISIBLE_WIDTH = PAGE_WIDTH - BOOK_SPINE * .42;
const COVER_IMAGES = new Map<string, HTMLImageElement>();

export type CompleteShelfBookState = 'closed-front' | 'closed-spine' | 'shelf' | 'extracting' | 'preview' | 'half-open' | 'open' | 'page-turn-25' | 'page-turning' | 'page-turn-75' | 'page-settled' | 'closed-returned';

type MaterialMaps = { clothNormal: Texture; clothRoughness: Texture; paper: Texture; paperBump: Texture; foilMask: Texture };

function canvasTexture(draw: (context: CanvasRenderingContext2D) => void, repeat: [number, number], colorSpace = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas texture creation is unavailable');
  draw(context);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = colorSpace ? SRGBColorSpace : texture.colorSpace;
  texture.wrapS = RepeatWrapping; texture.wrapT = RepeatWrapping; texture.repeat.set(...repeat);
  texture.minFilter = LinearMipmapLinearFilter; texture.magFilter = LinearFilter; texture.anisotropy = 8; texture.needsUpdate = true;
  return texture;
}

function useCompleteShelfMaterialMaps(): MaterialMaps {
  return useMemo(() => {
    const clothNormal = canvasTexture(context => {
      const image = context.createImageData(256, 256);
      for (let y = 0; y < 256; y += 1) for (let x = 0; x < 256; x += 1) {
        const weave = Math.sin(x * 1.21) * .62 + Math.sin(y * 1.08) * .62 + Math.sin((x + y) * .19) * .18;
        const index = (y * 256 + x) * 4;
        image.data[index] = 128 + weave * 18; image.data[index + 1] = 128 - weave * 18; image.data[index + 2] = 255; image.data[index + 3] = 255;
      }
      context.putImageData(image, 0, 0);
    }, [22, 28]);
    const clothRoughness = canvasTexture(context => {
      context.fillStyle = '#e0e0e0'; context.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y += 5) { context.fillStyle = `rgba(70,70,70,${.025 + (Math.sin(y) + 1) * .012})`; context.fillRect(0, y, 256, 1); }
    }, [22, 28]);
    const paper = canvasTexture(context => {
      context.fillStyle = '#eee5d2'; context.fillRect(0, 0, 256, 256);
      for (let y = 2; y < 256; y += 3) { context.strokeStyle = `rgba(105,83,52,${.024 + (Math.sin(y * .45) + 1) * .012})`; context.beginPath(); context.moveTo(0, y); context.lineTo(256, y + Math.sin(y * .21)); context.stroke(); }
    }, [2, 18], true);
    const paperBump = canvasTexture(context => {
      context.fillStyle = '#cfcfcf'; context.fillRect(0, 0, 256, 256);
      for (let y = 2; y < 256; y += 3) { context.fillStyle = 'rgba(100,100,100,.12)'; context.fillRect(0, y, 256, 1); }
    }, [2, 18]);
    const foilMask = canvasTexture(context => {
      context.clearRect(0, 0, 256, 256); context.strokeStyle = '#fff'; context.fillStyle = '#fff'; context.lineWidth = 5;
      context.strokeRect(38, 30, 180, 155); context.fillRect(78, 207, 100, 4);
    }, [1, 1]);
    return { clothNormal, clothRoughness, paper, paperBump, foilMask };
  }, []);
}

function useDaCoverTexture(tutor: CatalogueTutor, edition: TutorBookEdition) {
  return useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 1536;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Tutor cover creation is unavailable');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(255,255,255,.93)'; context.font = '600 29px "Cormorant Garamond", serif'; context.textAlign = 'center';
    context.fillText('DA TUITION', 512, 105);
    context.font = '600 62px "Cormorant Garamond", serif'; context.fillText(tutor.name.replace(/^(Mr|Ms|Mrs)\s+/i, ''), 512, 895, 820);
    context.font = '600 23px Cabin, sans-serif'; context.fillText(edition.wallId.replace('-', ' ').toUpperCase(), 512, 946);
    const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.minFilter = LinearMipmapLinearFilter; texture.magFilter = LinearFilter; texture.anisotropy = 16;
    const portrait = new Image(); portrait.decoding = 'async'; portrait.onload = () => {
      context.save(); context.beginPath(); context.rect(142, 188, 740, 610); context.clip();
      const scale = Math.max(740 / portrait.width, 610 / portrait.height); const width = portrait.width * scale; const height = portrait.height * scale;
      context.drawImage(portrait, (1024 - width) / 2, 188 + (610 - height) / 2, width, height); context.restore(); texture.needsUpdate = true;
    }; portrait.src = getPhotoUrl(tutor); COVER_IMAGES.set(tutor.id, portrait);
    return texture;
  }, [edition.wallId, tutor]);
}

function useSpineTexture(tutor: CatalogueTutor, edition: TutorBookEdition) {
  return useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 1024;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Tutor spine creation is unavailable');
    const tutorName = tutor.name.replace(/^(Mr|Ms|Mrs)\s+/i, '').toUpperCase();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#d9b463'; context.textAlign = 'center'; context.textBaseline = 'middle';
    context.font = '700 23px Cabin, sans-serif'; context.fillText('DA  /  EDITION', 128, 64);
    context.save(); context.translate(128, 512); context.rotate(-Math.PI / 2);
    context.font = '600 46px "Cormorant Garamond", serif'; context.fillText(tutorName, 0, 0, 790);
    context.restore();
    context.font = '700 20px Cabin, sans-serif'; context.fillText(edition.wallId.replace('-', ' ').toUpperCase(), 128, 962);
    const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.minFilter = LinearMipmapLinearFilter; texture.magFilter = LinearFilter; texture.anisotropy = 16;
    return texture;
  }, [edition.wallId, tutor.name]);
}

function statePose(state: CompleteShelfBookState, shelfPose: ShelfPose): CompleteShelfBookPose {
  const scale = shelfPose.height / BOOK_HEIGHT;
  const shelf: CompleteShelfBookPose = { position: shelfPose.position, rotation: shelfPose.rotation, scale: [scale, scale, scale] };
  if (state === 'shelf' || state === 'closed-returned') return shelf;
  const reading = getCompleteShelfReadingEnvelope(COMPLETE_SHELF_STUDIO_SHELF_TOP_Y);
  if (state === 'extracting') return { position: [shelf.position[0], reading.rootPosition[1], .66], rotation: shelf.rotation, scale: [1, 1, 1] };
  if (state === 'closed-spine') return { position: reading.rootPosition, rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1] };
  return { position: reading.rootPosition, rotation: [-.045, 0, .012], scale: [1, 1, 1] };
}

function bookStateOpenAmount(state: CompleteShelfBookState) {
  if (state === 'half-open') return .5;
  if (state === 'open' || state === 'page-turn-25' || state === 'page-turning' || state === 'page-turn-75' || state === 'page-settled') return 1;
  return 0;
}

function pageTurnProgress(state: CompleteShelfBookState) {
  if (state === 'page-turn-25') return .25;
  if (state === 'page-turning') return .5;
  if (state === 'page-turn-75') return .75;
  if (state === 'page-settled') return 1;
  return 0;
}

function Leaf({ leafOrder, restZ, turnedZ, state, paper, paperBump }: { leafOrder: number; restZ: number; turnedZ: number; state: CompleteShelfBookState; paper: Texture; paperBump: Texture }) {
  const frontGeometry = useMemo(() => new PlaneGeometry(PAGE_VISIBLE_WIDTH, PAGE_HEIGHT, 18, 5), []);
  const backGeometry = useMemo(() => new PlaneGeometry(PAGE_VISIBLE_WIDTH, PAGE_HEIGHT, 18, 5), []);
  const base = useMemo(() => Float32Array.from(frontGeometry.attributes.position.array), [frontGeometry]);
  const turn = leafOrder === 0 ? pageTurnProgress(state) : 0;
  const openAmount = bookStateOpenAmount(state);
  const turnAtForeEdge = sampleCompleteShelfPageTurn(turn, 1, .5);

  useEffect(() => {
    [frontGeometry, backGeometry].forEach(geometry => {
      const position = geometry.attributes.position;
      for (let index = 0; index < position.count; index += 1) {
      const offset = index * 3; const x = base[offset]; const y = base[offset + 1]; const u = x / PAGE_VISIBLE_WIDTH + .5;
      const settledArch = openAmount * (.003 + Math.sin(Math.PI * u) * .014);
      const v = y / PAGE_HEIGHT + .5;
      const turning = sampleCompleteShelfPageTurn(turn, u, v);
      const lowerFreeEdgeLift = turn * .032 * Math.pow(u, 1.7) * (1 - v);
      position.setXYZ(index, x, y + lowerFreeEdgeLift, settledArch + turning.bow + turning.twist);
      }
      position.needsUpdate = true; geometry.computeVertexNormals();
    });
  }, [backGeometry, base, frontGeometry, openAmount, turn]);

  const pageRotation = openAmount * (turn ? -turnAtForeEdge.rotation : -.018 + leafOrder * .004);
  const pageZ = restZ + (turnedZ - restZ) * turn * openAmount;
  return <group position={[-BOOK_WIDTH / 2 + BOOK_SPINE * .65, 0, pageZ]} rotation={[0, pageRotation, 0]}>
    <mesh geometry={frontGeometry} position={[PAGE_VISIBLE_WIDTH / 2, 0, .00012]}>
      <meshPhysicalMaterial map={paper} roughnessMap={paperBump} bumpMap={paperBump} bumpScale={.012} roughness={.93} side={DoubleSide} />
    </mesh>
    <mesh geometry={backGeometry} position={[PAGE_VISIBLE_WIDTH / 2, 0, -.00012]} rotation={[0, Math.PI, 0]}>
      <meshPhysicalMaterial map={paper} roughnessMap={paperBump} bumpMap={paperBump} bumpScale={.012} roughness={.93} side={DoubleSide} />
    </mesh>
  </group>;
}

function CoverInterior({ cloth, endpaper, maps }: { cloth: string; endpaper: string; maps: MaterialMaps }) {
  return <>
    <mesh position={[PAGE_VISIBLE_WIDTH / 2, 0, 0]}><planeGeometry args={[PAGE_VISIBLE_WIDTH - .018, BOOK_HEIGHT - .018]} /><meshPhysicalMaterial color={cloth} normalMap={maps.clothNormal} normalScale={new Vector2(.22, .22)} roughness={.96} side={DoubleSide} /></mesh>
    <mesh position={[PAGE_VISIBLE_WIDTH / 2, 0, .002]}><planeGeometry args={[PAGE_VISIBLE_WIDTH - .108, BOOK_HEIGHT - .128]} /><meshPhysicalMaterial color={endpaper} map={maps.paper} roughnessMap={maps.paperBump} bumpMap={maps.paperBump} bumpScale={.006} roughness={.92} side={DoubleSide} /></mesh>
  </>;
}

function PageStack({ maps }: { maps: MaterialMaps }) {
  const bindingX = -BOOK_WIDTH / 2 + BOOK_SPINE * .65;
  return <group position={[bindingX, 0, .066]}>
    <mesh position={[PAGE_VISIBLE_WIDTH - .025, 0, 0]}><boxGeometry args={[.012, PAGE_HEIGHT - .15, .02]} /><meshPhysicalMaterial color="#d6c2a3" map={maps.paper} roughnessMap={maps.paperBump} bumpMap={maps.paperBump} bumpScale={.006} roughness={.95} /></mesh>
    {Array.from({ length: 7 }, (_, index) => <mesh key={index} position={[PAGE_VISIBLE_WIDTH / 2, -PAGE_HEIGHT / 2 + .084 + index * .009, index * .002]}><boxGeometry args={[PAGE_VISIBLE_WIDTH - .045, .003, .0014]} /><meshPhysicalMaterial color="#eadfc9" roughness={.98} /></mesh>)}
  </group>;
}

function BoundPageStack({ maps }: { maps: MaterialMaps }) {
  return <group position={[0, 0, -BOOK_BOARD * .56]} rotation={[0, Math.PI, 0]}>
    <mesh position={[PAGE_VISIBLE_WIDTH / 2, 0, .005]}><planeGeometry args={[PAGE_VISIBLE_WIDTH - .14, PAGE_HEIGHT - .2]} /><meshPhysicalMaterial color="#f3ecdd" map={maps.paper} roughnessMap={maps.paperBump} bumpMap={maps.paperBump} bumpScale={.004} roughness={.95} side={DoubleSide} /></mesh>
    {Array.from({ length: 5 }, (_, index) => <mesh key={index} position={[PAGE_VISIBLE_WIDTH / 2, -PAGE_HEIGHT / 2 + .105 + index * .009, .008]}><boxGeometry args={[PAGE_VISIBLE_WIDTH - .16, .003, .0014]} /><meshPhysicalMaterial color="#e7dac2" roughness={.98} /></mesh>)}
  </group>;
}

export function CompleteShelfTutorBook({ tutor, edition, shelfPose, state, collisionDebug = false }: { tutor: CatalogueTutor; edition: TutorBookEdition; shelfPose: ShelfPose; state: CompleteShelfBookState; collisionDebug?: boolean }) {
  const root = useRef<Group>(null);
  const maps = useCompleteShelfMaterialMaps();
  const coverTexture = useDaCoverTexture(tutor, edition);
  const spineTexture = useSpineTexture(tutor, edition);
  const pose = statePose(state, shelfPose);
  const metrics = getCompleteShelfBookMetrics(shelfPose);
  const openAmount = bookStateOpenAmount(state);
  const readingEnvelope = getCompleteShelfReadingEnvelope(COMPLETE_SHELF_STUDIO_SHELF_TOP_Y);
  const cloth = '#203a57';
  const endpaper = '#decfb5';
  const leaves = useMemo(() => createCompleteShelfLeafLayout(), []);

  useFrame(() => {
    if (!root.current) return;
    root.current.position.set(...pose.position); root.current.rotation.set(...pose.rotation); root.current.scale.setScalar(pose.scale[0]);
  });

  return <group ref={root} name={`complete-shelf-tutor-book-${edition.id}`} castShadow>
    <group name="complete-shelf-motion">
      <RoundedBox args={[BOOK_WIDTH, BOOK_HEIGHT, BOOK_BOARD]} position={[0, 0, -BOOK_DEPTH / 2 + BOOK_BOARD / 2]} radius={metrics.boardRadius} smoothness={2} castShadow receiveShadow>
        <meshPhysicalMaterial color={cloth} normalMap={maps.clothNormal} normalScale={new Vector2(.34, .34)} roughnessMap={maps.clothRoughness} bumpMap={maps.clothRoughness} bumpScale={.0045} roughness={.98} metalness={.02} sheen={.34} sheenRoughness={.76} />
      </RoundedBox>
      <mesh position={[0, 0, -.102]}><planeGeometry args={[PAGE_WIDTH, CLOSED_PAGE_HEIGHT]} /><meshPhysicalMaterial color="#d9c8aa" roughness={.95} side={DoubleSide} /></mesh>
      {openAmount < .08 && <mesh position={[.018, 0, 0]} castShadow receiveShadow><boxGeometry args={[PAGE_WIDTH, CLOSED_PAGE_HEIGHT, PAGE_DEPTH]} /><meshPhysicalMaterial color="#d8c5a5" map={maps.paper} roughnessMap={maps.paperBump} bumpMap={maps.paperBump} bumpScale={.012} roughness={.93} /></mesh>}
      <RoundedBox args={[BOOK_SPINE, BOOK_HEIGHT - .02, PAGE_DEPTH]} position={[-BOOK_WIDTH / 2 + BOOK_SPINE / 2, 0, 0]} radius={.0015} smoothness={2} castShadow receiveShadow>
        <meshPhysicalMaterial color={cloth} normalMap={maps.clothNormal} normalScale={new Vector2(.34, .34)} roughnessMap={maps.clothRoughness} roughness={.98} metalness={.02} sheen={.34} />
      </RoundedBox>
      <mesh position={[-BOOK_WIDTH / 2 - .002, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[PAGE_DEPTH * .91, BOOK_HEIGHT - .075]} /><meshPhysicalMaterial map={spineTexture} transparent metalness={.7} roughness={.3} envMapIntensity={1.5} side={DoubleSide} /></mesh>
      <group name="complete-shelf-rear-interior" position={[-BOOK_WIDTH / 2 + BOOK_SPINE * .65, 0, -BOOK_DEPTH / 2 + BOOK_BOARD + .002]}><CoverInterior cloth={cloth} endpaper={endpaper} maps={maps} /></group>
      <group name="complete-shelf-spine-lining" position={[-BOOK_WIDTH / 2 + BOOK_SPINE * .66, 0, .025]}>
        <mesh><boxGeometry args={[.046, PAGE_HEIGHT - .11, .028]} /><meshPhysicalMaterial color="#172d45" normalMap={maps.clothNormal} normalScale={new Vector2(.16, .16)} roughness={.94} /></mesh>
        <mesh position={[.018, 0, .016]}><planeGeometry args={[.012, PAGE_HEIGHT - .18]} /><meshBasicMaterial color="#483323" transparent opacity={.5} /></mesh>
      </group>
      <group name="complete-shelf-front-cover-pivot" position={[-BOOK_WIDTH / 2 + BOOK_SPINE * .65, 0, BOOK_DEPTH / 2 + BOOK_BOARD / 2]} rotation={[0, (-Math.PI + .055) * openAmount, 0]}>
        <RoundedBox args={[PAGE_VISIBLE_WIDTH, BOOK_HEIGHT, BOOK_BOARD]} position={[PAGE_VISIBLE_WIDTH / 2, 0, 0]} radius={metrics.boardRadius} smoothness={2} castShadow receiveShadow>
          <meshPhysicalMaterial color={cloth} normalMap={maps.clothNormal} normalScale={new Vector2(.34, .34)} roughnessMap={maps.clothRoughness} bumpMap={maps.clothRoughness} bumpScale={.0045} roughness={.98} metalness={.02} sheen={.34} sheenRoughness={.76} />
        </RoundedBox>
        <mesh position={[PAGE_VISIBLE_WIDTH / 2, 0, BOOK_BOARD * .55]}><planeGeometry args={[PAGE_VISIBLE_WIDTH - .025, BOOK_HEIGHT - .03]} /><meshPhysicalMaterial map={coverTexture} transparent roughness={.9} normalMap={maps.clothNormal} normalScale={new Vector2(.28, .28)} side={DoubleSide} /></mesh>
        <mesh position={[PAGE_VISIBLE_WIDTH / 2, 0, BOOK_BOARD * .605]}><planeGeometry args={[PAGE_VISIBLE_WIDTH - .025, BOOK_HEIGHT - .03]} /><meshPhysicalMaterial color="#e2b760" emissive="#2c1806" emissiveIntensity={.2} alphaMap={maps.foilMask} transparent metalness={.65} roughness={.28} envMapIntensity={1.6} depthWrite={false} side={DoubleSide} /></mesh>
        {shouldRenderCompleteShelfLeaves(openAmount) && <group position={[0, 0, -BOOK_BOARD * .515]} rotation={[0, Math.PI, 0]}><CoverInterior cloth={cloth} endpaper={endpaper} maps={maps} /></group>}
        {shouldRenderCompleteShelfLeaves(openAmount) && <BoundPageStack maps={maps} />}
      </group>
      {openAmount > .08 && <PageStack maps={maps} />}
      {shouldRenderCompleteShelfLeaves(openAmount) && leaves.map(leaf => <Leaf key={leaf.leafOrder} {...leaf} state={state} paper={maps.paper} paperBump={maps.paperBump} />)}
      {[-1, 1].map(direction => <mesh key={direction} position={[-PAGE_WIDTH / 2 + .046, direction * (PAGE_HEIGHT / 2 - .004), 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.012, .012, PAGE_DEPTH * .88, 12]} /><meshPhysicalMaterial color="#a06b42" roughness={.72} /></mesh>)}
      {shouldRenderCompleteShelfLeaves(openAmount) && <mesh position={[-PAGE_WIDTH / 2 + .09, -.27, PAGE_DEPTH / 2 + .006]}><boxGeometry args={[.034, PAGE_HEIGHT * .76, .002]} /><meshPhysicalMaterial color="#913d34" roughness={.64} /></mesh>}
      {shouldRenderCompleteShelfLeaves(openAmount) && <mesh position={[.018 + PAGE_WIDTH / 2 + .002, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[PAGE_DEPTH * .94, PAGE_HEIGHT - .028]} /><meshPhysicalMaterial map={maps.paper} roughness={.94} side={DoubleSide} /></mesh>}
    </group>
    {state !== 'closed-returned' && <mesh name="complete-shelf-contact-shadow" position={[0, -BOOK_HEIGHT / 2 - .022, .025]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[BOOK_WIDTH * 1.22, BOOK_DEPTH * 2.05]} /><meshBasicMaterial color="#160d0a" transparent opacity={.24} /></mesh>}
    {collisionDebug && state !== 'shelf' && state !== 'closed-returned' && <mesh name="complete-shelf-safe-page-turn-plane" position={[0, readingEnvelope.safeShelfY - pose.position[1], .1]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.2, 1.9]} /><meshBasicMaterial color="#ec4d46" transparent opacity={.18} depthWrite={false} side={DoubleSide} /></mesh>}
  </group>;
}
