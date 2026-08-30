import { useEffect, useMemo, useState } from 'react';
import { CanvasTexture, DoubleSide, LinearFilter, LinearMipmapLinearFilter, NoColorSpace, RepeatWrapping, SRGBColorSpace } from 'three';
import { getPhotoUrl, type CatalogueTutor } from '../../data/teacherCatalogue';
import type { TutorBookEdition } from './tutor-library-data';

const COVER_TEXTURES = new Map<string, CanvasTexture>();
const FOIL_TEXTURES = new Map<string, CanvasTexture>();

type CoverMode = 'spine' | 'cover';
export type SpineTreatment = 'classic' | 'stacked' | 'surname';

const SUBJECT_MARK: Record<string, string> = { primary: 'PRIMARY STUDIES', mathematics: 'MATHEMATICS', english: 'ENGLISH', 'science-social': 'SCIENCE & SOCIAL' };
const COVER_CLOTH = ['#183653', '#63323b', '#5c412d', '#24475a', '#294a35', '#462d54', '#5c3b25', '#25494e', '#3c4654', '#673324'];

function configureMaterialTexture(texture: CanvasTexture, repeat: [number, number], color = false) {
  texture.colorSpace = color ? SRGBColorSpace : NoColorSpace;
  texture.wrapS = RepeatWrapping; texture.wrapT = RepeatWrapping;
  texture.repeat.set(...repeat); texture.minFilter = LinearMipmapLinearFilter; texture.magFilter = LinearFilter;
  texture.generateMipmaps = true; texture.anisotropy = 8; texture.needsUpdate = true;
  return texture;
}

function makeTexture(draw: (context: CanvasRenderingContext2D) => void, repeat: [number, number], color = false) {
  const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
  const context = canvas.getContext('2d')!; draw(context);
  return configureMaterialTexture(new CanvasTexture(canvas), repeat, color);
}

export function useBookMaterialMaps() {
  return useMemo(() => {
    const size = 256; const height = new Float32Array(size * size);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const weave = Math.sin(x * .98 + Math.sin(y * .07)) * .23 + Math.sin(y * 1.11 + Math.sin(x * .05)) * .19; const fibre = Math.sin((x * 7.13 + y * 3.71) * .11) * .045; height[y * size + x] = .5 + weave + fibre; }
    const clothNormal = makeTexture(context => { const image = context.createImageData(size, size); for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const at = (a: number, b: number) => height[((b + size) % size) * size + ((a + size) % size)]; const dx = (at(x + 1, y) - at(x - 1, y)) * 1.25; const dy = (at(x, y + 1) - at(x, y - 1)) * 1.25; const length = Math.hypot(dx, dy, 1); const i = (y * size + x) * 4; image.data[i] = 128 + Math.round((-dx / length) * 44); image.data[i + 1] = 128 + Math.round((-dy / length) * 44); image.data[i + 2] = 128 + Math.round((1 / length) * 127); image.data[i + 3] = 255; } context.putImageData(image, 0, 0); }, [20, 27]);
    const clothHeight = makeTexture(context => { const image = context.createImageData(size, size); for (let i = 0; i < height.length; i++) { const level = Math.round(Math.max(0, Math.min(1, height[i])) * 255); const j = i * 4; image.data[j] = image.data[j + 1] = image.data[j + 2] = level; image.data[j + 3] = 255; } context.putImageData(image, 0, 0); }, [20, 27]);
    const clothRoughness = makeTexture(context => { const image = context.createImageData(size, size); for (let i = 0; i < height.length; i++) { const level = Math.round(168 + Math.max(0, Math.min(1, height[i])) * 67); const j = i * 4; image.data[j] = image.data[j + 1] = image.data[j + 2] = level; image.data[j + 3] = 255; } context.putImageData(image, 0, 0); }, [20, 27]);
    const paper = makeTexture(context => { context.fillStyle = '#eee5d2'; context.fillRect(0, 0, size, size); let y = 0; while (y < size) { const gap = 2 + ((Math.sin(y * 1.71) + 1) * .7); const alpha = .028 + ((Math.sin(y * .41) + 1) * .017); context.strokeStyle = `rgba(103,81,52,${alpha})`; context.beginPath(); context.moveTo(0, y); context.lineTo(size, y + Math.sin(y * .19) * .45); context.stroke(); y += gap; } }, [2, 18], true);
    const paperBump = makeTexture(context => { const image = context.createImageData(size, size); for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const line = Math.sin(y * 2.15 + Math.sin(x * .08)) * .12; const grain = Math.sin(x * 1.81 + y * 2.47) * .035; const level = Math.round(204 + (line + grain) * 100); const i = (y * size + x) * 4; image.data[i] = image.data[i + 1] = image.data[i + 2] = level; image.data[i + 3] = 255; } context.putImageData(image, 0, 0); }, [2, 18]);
    return { clothHeight, clothNormal, clothRoughness, paper, paperBump };
  }, []);
}

function drawFrame(context: CanvasRenderingContext2D, tutor: CatalogueTutor, edition: TutorBookEdition, mode: CoverMode) {
  const canvas = context.canvas;
  const dark = COVER_CLOTH[edition.materialVariant % COVER_CLOTH.length];
  context.fillStyle = dark;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.textAlign = 'center'; context.textBaseline = 'middle';
  if (mode === 'spine') {
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(Math.PI / 2);
    context.restore();
    return;
  }
}

function createTexture(tutor: CatalogueTutor, edition: TutorBookEdition, mode: CoverMode) {
  const canvas = document.createElement('canvas');
  canvas.width = mode === 'spine' ? 384 : 1024;
  canvas.height = 1536;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas rendering is unavailable for tutor cover');
  drawFrame(context, tutor, edition, mode);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  if (mode === 'cover') {
    const portrait = new Image();
    portrait.decoding = 'async';
    portrait.onload = () => {
      context.save();
      context.beginPath();
      context.rect(118, 220, canvas.width - 236, 460);
      context.clip();
      const ratio = Math.max((canvas.width - 236) / portrait.width, 460 / portrait.height);
      const width = portrait.width * ratio;
      const height = portrait.height * ratio;
      context.drawImage(portrait, (canvas.width - width) / 2, 220 + (460 - height) / 2, width, height);
      context.restore();
      texture.needsUpdate = true;
    };
    portrait.src = getPhotoUrl(tutor);
  }
  return texture;
}

function createFoilTexture(tutor: CatalogueTutor, edition: TutorBookEdition, mode: CoverMode, treatment: SpineTreatment) {
  const canvas = document.createElement('canvas');
  canvas.width = mode === 'spine' ? 384 : 1024;
  canvas.height = 1536;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas rendering is unavailable for tutor foil');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#fff'; context.fillStyle = '#fff';
  context.lineWidth = mode === 'spine' ? 3 : 6;
  context.textAlign = 'center'; context.textBaseline = 'middle';
  if (mode === 'spine') {
    const surname = tutor.name.split(' ').at(-1)?.toUpperCase() ?? tutor.name.toUpperCase();
    if (treatment === 'stacked') {
      context.font = '600 42px "Playfair Display", Georgia, serif';
      surname.split('').forEach((letter, index) => context.fillText(letter, canvas.width / 2, 350 + index * 92));
    } else {
      context.save(); context.translate(canvas.width / 2, canvas.height / 2); context.rotate(Math.PI / 2);
      context.font = `600 ${treatment === 'surname' ? 76 : tutor.name.length > 15 ? 46 : 58}px "Playfair Display", Georgia, serif`;
      context.fillText(treatment === 'surname' ? surname : tutor.name.toUpperCase(), 0, treatment === 'surname' ? -16 : 0, canvas.height - 130); context.restore();
    }
    context.font = '600 16px Cabin, Arial, sans-serif'; context.fillText(SUBJECT_MARK[edition.wallId] ?? 'DA TUITION', canvas.width / 2, 94);
  } else {
    context.lineWidth = 7; context.strokeRect(118, 218, canvas.width - 236, 464);
    context.font = '600 27px Cabin, Arial, sans-serif'; context.fillText(`DA TUITION · ${SUBJECT_MARK[edition.wallId] ?? 'FACULTY'}`, canvas.width / 2, 110);
    context.font = '600 86px "Playfair Display", Georgia, serif'; context.fillText(tutor.name.replace(/^Mrs\s+/i, ''), canvas.width / 2, 1008, canvas.width - 150);
    context.font = '600 25px Cabin, Arial, sans-serif'; context.fillText(tutor.designation.toUpperCase(), canvas.width / 2, 1082, canvas.width - 180);
  }
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.minFilter = LinearMipmapLinearFilter; texture.magFilter = LinearFilter; texture.generateMipmaps = true; texture.anisotropy = 16; texture.needsUpdate = true;
  return texture;
}

function useFontRevision() {
  const [revision, setRevision] = useState(0);
  useEffect(() => { let mounted = true; document.fonts?.load('600 86px "Playfair Display"').then(() => document.fonts.load('600 27px Cabin')).then(() => { if (mounted) { COVER_TEXTURES.clear(); FOIL_TEXTURES.clear(); setRevision(value => value + 1); } }).catch(() => undefined); return () => { mounted = false; }; }, []);
  return revision;
}

function useTutorCoverTexture(tutor: CatalogueTutor, edition: TutorBookEdition, mode: CoverMode, revision: number) {
  const key = `${mode}:${revision}:${edition.id}:${tutor.name}:${tutor.designation}`;
  const texture = useMemo(() => {
    const cached = COVER_TEXTURES.get(key);
    if (cached) return cached;
    const created = createTexture(tutor, edition, mode);
    COVER_TEXTURES.set(key, created);
    return created;
  }, [key, mode, tutor]);
  useEffect(() => () => undefined, [texture]);
  return texture;
}

function useTutorFoilTexture(tutor: CatalogueTutor, edition: TutorBookEdition, mode: CoverMode, treatment: SpineTreatment, revision: number) {
  const key = `foil:v3:${revision}:${mode}:${treatment}:${edition.id}:${tutor.name}`;
  return useMemo(() => {
    const cached = FOIL_TEXTURES.get(key);
    if (cached) return cached;
    const created = createFoilTexture(tutor, edition, mode, treatment); FOIL_TEXTURES.set(key, created); return created;
  }, [edition, key, mode, treatment, tutor]);
}

export function TutorBookCover({ tutor, edition, mode, width, height, z, position, rotation, visible }: { tutor: CatalogueTutor; edition: TutorBookEdition; mode: CoverMode; width: number; height: number; z?: number; position?: [number, number, number]; rotation?: [number, number, number]; visible: boolean }) {
  const revision = useFontRevision(); const texture = useTutorCoverTexture(tutor, edition, mode, revision);
  return <mesh position={position ?? [0, 0, z ?? 0]} rotation={rotation} visible={visible}>
    <planeGeometry args={[width, height]} />
    <meshStandardMaterial map={texture} roughness={.42} metalness={.08} side={DoubleSide} />
  </mesh>;
}

export function TutorBookFoil({ tutor, edition, mode, width, height, z, position, rotation, visible, spineTreatment = 'classic' }: { tutor: CatalogueTutor; edition: TutorBookEdition; mode: CoverMode; width: number; height: number; z?: number; position?: [number, number, number]; rotation?: [number, number, number]; visible: boolean; spineTreatment?: SpineTreatment }) {
  const revision = useFontRevision(); const texture = useTutorFoilTexture(tutor, edition, mode, spineTreatment, revision);
  return <mesh position={position ?? [0, 0, z ?? 0]} rotation={rotation} visible={visible} renderOrder={2}>
    <planeGeometry args={[width, height]} />
    <meshPhysicalMaterial color="#d6af58" map={texture} alphaMap={texture} bumpMap={texture} bumpScale={.012} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-2} roughness={.14} metalness={.96} clearcoat={.16} clearcoatRoughness={.13} />
  </mesh>;
}
