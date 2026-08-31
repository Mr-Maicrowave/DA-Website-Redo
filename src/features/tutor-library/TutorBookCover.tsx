import { useEffect, useMemo, useState } from 'react';
import { CanvasTexture, DoubleSide, LinearFilter, LinearMipmapLinearFilter, NoColorSpace, RepeatWrapping, SRGBColorSpace } from 'three';
import type { CatalogueTutor } from '../../data/teacherCatalogue';
import type { TutorBookEdition } from './tutor-library-data';
import { createCompleteShelfPresentation, PRESENTATION_UPDATE_EVENT, type CompleteShelfPresentationShellCanvasSources } from './complete-shelf-presentation';
import { areTutorLibraryFontsReady, ensureTutorLibraryFonts } from './tutor-library-assets';

const COVER_TEXTURES = new Map<string, CanvasTexture>();
const FOIL_TEXTURES = new Map<string, CanvasTexture>();
const SHELL_SOURCES = new Map<string, Partial<CompleteShelfPresentationShellCanvasSources>>();

type CoverMode = 'spine' | 'cover';
export type SpineTreatment = 'classic' | 'stacked' | 'surname';

function configureMaterialTexture(texture: CanvasTexture, repeat: [number, number], color = false) {
  texture.colorSpace = color ? SRGBColorSpace : NoColorSpace;
  texture.wrapS = RepeatWrapping; texture.wrapT = RepeatWrapping;
  texture.repeat.set(...repeat); texture.minFilter = LinearMipmapLinearFilter; texture.magFilter = LinearFilter;
  texture.generateMipmaps = true; texture.anisotropy = 4; texture.needsUpdate = true;
  return texture;
}

function makeTexture(draw: (context: CanvasRenderingContext2D) => void, repeat: [number, number], color = false) {
  const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
  const context = canvas.getContext('2d')!; draw(context);
  return configureMaterialTexture(new CanvasTexture(canvas), repeat, color);
}

let sharedBookMaterialMaps: ReturnType<typeof createBookMaterialMaps> | undefined;

function createBookMaterialMaps() {
    const size = 256; const height = new Float32Array(size * size);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const weave = Math.sin(x * .98 + Math.sin(y * .07)) * .23 + Math.sin(y * 1.11 + Math.sin(x * .05)) * .19; const fibre = Math.sin((x * 7.13 + y * 3.71) * .11) * .045; height[y * size + x] = .5 + weave + fibre; }
    const clothNormal = makeTexture(context => { const image = context.createImageData(size, size); for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const at = (a: number, b: number) => height[((b + size) % size) * size + ((a + size) % size)]; const dx = (at(x + 1, y) - at(x - 1, y)) * 1.25; const dy = (at(x, y + 1) - at(x, y - 1)) * 1.25; const length = Math.hypot(dx, dy, 1); const i = (y * size + x) * 4; image.data[i] = 128 + Math.round((-dx / length) * 44); image.data[i + 1] = 128 + Math.round((-dy / length) * 44); image.data[i + 2] = 128 + Math.round((1 / length) * 127); image.data[i + 3] = 255; } context.putImageData(image, 0, 0); }, [20, 27]);
    const clothHeight = makeTexture(context => { const image = context.createImageData(size, size); for (let i = 0; i < height.length; i++) { const level = Math.round(Math.max(0, Math.min(1, height[i])) * 255); const j = i * 4; image.data[j] = image.data[j + 1] = image.data[j + 2] = level; image.data[j + 3] = 255; } context.putImageData(image, 0, 0); }, [20, 27]);
    const clothRoughness = makeTexture(context => { const image = context.createImageData(size, size); for (let i = 0; i < height.length; i++) { const level = Math.round(168 + Math.max(0, Math.min(1, height[i])) * 67); const j = i * 4; image.data[j] = image.data[j + 1] = image.data[j + 2] = level; image.data[j + 3] = 255; } context.putImageData(image, 0, 0); }, [20, 27]);
    const paper = makeTexture(context => { context.fillStyle = '#eee5d2'; context.fillRect(0, 0, size, size); let y = 0; while (y < size) { const gap = 2 + ((Math.sin(y * 1.71) + 1) * .7); const alpha = .028 + ((Math.sin(y * .41) + 1) * .017); context.strokeStyle = `rgba(103,81,52,${alpha})`; context.beginPath(); context.moveTo(0, y); context.lineTo(size, y + Math.sin(y * .19) * .45); context.stroke(); y += gap; } }, [2, 18], true);
    const paperBump = makeTexture(context => { const image = context.createImageData(size, size); for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const line = Math.sin(y * 2.15 + Math.sin(x * .08)) * .12; const grain = Math.sin(x * 1.81 + y * 2.47) * .035; const level = Math.round(204 + (line + grain) * 100); const i = (y * size + x) * 4; image.data[i] = image.data[i + 1] = image.data[i + 2] = level; image.data[i + 3] = 255; } context.putImageData(image, 0, 0); }, [2, 18]);
  return { clothHeight, clothNormal, clothRoughness, paper, paperBump };
}

/** The room reuses one quiet material set; individual tutor artwork remains unique. */
export function useBookMaterialMaps() {
  return useMemo(() => {
    sharedBookMaterialMaps ??= createBookMaterialMaps();
    return sharedBookMaterialMaps;
  }, []);
}

function getSharedShellSources(tutor: CatalogueTutor, edition: TutorBookEdition, mode: CoverMode) {
  const key = `${edition.id}:${tutor.id}:${edition.materialVariant}`;
  const cached = SHELL_SOURCES.get(key) ?? {};
  if (mode === 'cover' && !cached.cover) Object.assign(cached, createCompleteShelfPresentation(tutor, edition).createCoverCanvasSources());
  if (mode === 'spine' && !cached.spine) Object.assign(cached, createCompleteShelfPresentation(tutor, edition).createSpineCanvasSources());
  SHELL_SOURCES.set(key, cached);
  return cached as CompleteShelfPresentationShellCanvasSources;
}

function textureFromCanvas(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  canvas.addEventListener(PRESENTATION_UPDATE_EVENT, () => { texture.needsUpdate = true; });
  return texture;
}

function createTexture(tutor: CatalogueTutor, edition: TutorBookEdition, mode: CoverMode) {
  const sources = getSharedShellSources(tutor, edition, mode);
  return textureFromCanvas(mode === 'cover' ? sources.cover : sources.spine);
}

function createFoilTexture(tutor: CatalogueTutor, edition: TutorBookEdition, mode: CoverMode, _treatment: SpineTreatment) {
  const sources = getSharedShellSources(tutor, edition, mode);
  return textureFromCanvas(mode === 'cover' ? sources.coverFoil : sources.spineFoil);
}

let fontTextureRevision = 0;
let fontTextureRefresh: Promise<void> | undefined;
const fontTextureListeners = new Set<(revision: number) => void>();

function refreshTexturesAfterFontsLoad() {
  fontTextureRefresh ??= ensureTutorLibraryFonts().then(() => {
    COVER_TEXTURES.clear();
    FOIL_TEXTURES.clear();
    SHELL_SOURCES.clear();
    fontTextureRevision += 1;
    fontTextureListeners.forEach(listener => listener(fontTextureRevision));
  });
  return fontTextureRefresh;
}

function useFontRevision() {
  const [revision, setRevision] = useState(fontTextureRevision);
  useEffect(() => {
    if (areTutorLibraryFontsReady()) return;
    fontTextureListeners.add(setRevision);
    void refreshTexturesAfterFontsLoad();
    return () => { fontTextureListeners.delete(setRevision); };
  }, []);
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
