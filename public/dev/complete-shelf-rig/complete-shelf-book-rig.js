import * as THREE from '/dev/complete-shelf-rig/vendor/three.module.js';
import { RoundedBoxGeometry } from '/dev/complete-shelf-rig/vendor/RoundedBoxGeometry.js';

// Extracted from public/dev/complete-shelf-reference/index.html at b0b5324.
// The factory intentionally owns only one physical Codex volume; the host owns its scene.
const CODEX = {
  id: 'codex', title: 'Codex', roman: 'I', discipline: 'Agentic craft',
  note: 'Precise intent, translated into tested systems.',
  deck: 'A field manual for delegating repository work to Codex: state the intent, let the agent trace the system, and treat tests and browser proof as part of the craft.',
  binding: 'Ultramarine cloth · copper foil', format: '148 × 216 mm · imagined edition',
  theme: 'Codex · intent into implementation', motif: 'Nested brackets', motifKey: 'brackets',
  color: '#182a43', foil: '#c87046',
  palette: { paper: '#171a24', paperDeep: '#10131b', paperPale: '#f1eadf', ink: '#f4eee6', inkSoft: '#b9b4ae', wall: '#171a24', shelf: '#3a2118', shelfDark: '#1c0e0a', light: '#f4d7b9', fill: '#9fb3c9' },
  width: 1.02, height: 1.58, depth: 0.26, chapters: ['Intent', 'Repository atlas', 'Proof'], seed: 11,
};

// The atlas and crop contract are retained from the source. The neutral host supplies
// its decoded first crop directly from the immutable reference document.
const COVER_CROPS = [[0, 0, 512, 768], [512, 0, 512, 768], [1024, 0, 512, 768], [1536, 0, 512, 768], [2048, 0, 512, 768], [2560, 0, 512, 768], [3072, 0, 512, 768]];
const FLEXIBLE_PAGE_SEGMENTS = 18;
const FLEXIBLE_PAGE_VERTICAL_SEGMENTS = 8;
const PAGINATED_LEAF_COUNT = 4;
const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const lerp = (from, to, progress) => from + (to - from) * progress;

function damp(current, target, smoothing, delta) {
  return THREE.MathUtils.damp(current, target, smoothing, Math.min(delta, 0.1));
}

function hashSeed(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function configureCanvasTexture(texture, renderer, { color = true, anisotropy = 16 } = {}) {
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(anisotropy, renderer?.capabilities?.getMaxAnisotropy?.() ?? 16);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function drawMotif(context, book, width, height) {
  const size = Math.min(width, height) * 0.22;
  const centerX = width * 0.5;
  const centerY = height * 0.38;
  context.save();
  context.strokeStyle = book.foil;
  context.fillStyle = book.foil;
  context.lineWidth = Math.max(3, width * 0.004);
  context.globalAlpha = 0.88;
  for (let layer = 0; layer < 3; layer += 1) {
    const inset = layer * size * 0.22;
    const left = centerX - size + inset;
    const right = centerX + size - inset;
    const top = centerY - size * 0.72 + inset;
    const bottom = centerY + size * 0.72 - inset;
    context.beginPath();
    context.moveTo(left + size * 0.25, top); context.lineTo(left, top); context.lineTo(left, bottom); context.lineTo(left + size * 0.25, bottom);
    context.moveTo(right - size * 0.25, top); context.lineTo(right, top); context.lineTo(right, bottom); context.lineTo(right - size * 0.25, bottom);
    context.stroke();
  }
  context.fillRect(centerX - 3, centerY - 3, 6, 6);
  context.restore();
}

function makeCoverTexture(book, renderer, atlasImage) {
  const canvas = document.createElement('canvas');
  canvas.width = 768; canvas.height = 1152;
  const context = canvas.getContext('2d');
  if (atlasImage?.complete && atlasImage.naturalWidth > 0) {
    const [sourceX, sourceY, sourceWidth, sourceHeight] = COVER_CROPS[0];
    context.drawImage(atlasImage, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    const edgeShade = context.createLinearGradient(0, 0, canvas.width, 0);
    edgeShade.addColorStop(0, 'rgba(0,0,0,0.16)'); edgeShade.addColorStop(0.055, 'rgba(255,255,255,0.015)');
    edgeShade.addColorStop(0.93, 'rgba(255,255,255,0)'); edgeShade.addColorStop(1, 'rgba(0,0,0,0.1)');
    context.fillStyle = edgeShade; context.fillRect(0, 0, canvas.width, canvas.height);
    return configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer);
  }
  const random = seededRandom(hashSeed(book.id) + book.seed);
  context.fillStyle = book.color; context.fillRect(0, 0, canvas.width, canvas.height);
  const edge = context.createLinearGradient(0, 0, canvas.width, 0);
  edge.addColorStop(0, 'rgba(0,0,0,0.24)'); edge.addColorStop(0.075, 'rgba(255,255,255,0.035)'); edge.addColorStop(0.5, 'rgba(255,255,255,0.01)'); edge.addColorStop(0.94, 'rgba(0,0,0,0.06)'); edge.addColorStop(1, 'rgba(0,0,0,0.19)');
  context.fillStyle = edge; context.fillRect(0, 0, canvas.width, canvas.height);
  for (let line = 0; line < 1250; line += 1) {
    const x = random() * canvas.width; const y = random() * canvas.height;
    context.strokeStyle = random() > 0.5 ? 'rgba(255,255,255,0.024)' : 'rgba(0,0,0,0.025)';
    context.lineWidth = 0.6 + random() * 0.8; context.beginPath(); context.moveTo(x, y); context.lineTo(x + 4 + random() * 22, y + (random() - 0.5) * 2); context.stroke();
  }
  context.strokeStyle = book.foil; context.globalAlpha = 0.72; context.lineWidth = 2;
  context.strokeRect(42, 42, canvas.width - 84, canvas.height - 84); context.strokeRect(55, 55, canvas.width - 110, canvas.height - 110); context.globalAlpha = 1;
  drawMotif(context, book, canvas.width, canvas.height);
  context.fillStyle = book.foil; context.textAlign = 'center'; context.textBaseline = 'middle';
  context.font = '500 18px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(`WORKING VOLUMES  /  ${book.roman}`, canvas.width / 2, 92);
  context.font = '400 88px Iowan Old Style, Baskerville, Georgia, serif'; context.fillText(book.title, canvas.width / 2, canvas.height * 0.72);
  context.font = '500 16px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(book.discipline.toUpperCase(), canvas.width / 2, canvas.height * 0.79);
  return configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer);
}

function makeFoilTexture(book, renderer, spine = false) {
  const canvas = document.createElement('canvas');
  canvas.width = spine ? 384 : 768; canvas.height = spine ? 1536 : 1152;
  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff'; context.strokeStyle = '#ffffff';
  if (spine) {
    context.lineWidth = 2.4; context.strokeRect(34, 38, canvas.width - 68, canvas.height - 76); context.textAlign = 'center'; context.textBaseline = 'middle';
    context.font = '500 24px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(book.roman, canvas.width * 0.5, 118);
    context.save(); context.translate(canvas.width * 0.5, canvas.height * 0.5); context.rotate(Math.PI / 2);
    context.font = '400 68px Iowan Old Style, Baskerville, Georgia, serif'; context.fillText(book.title, 0, 0); context.restore();
    context.beginPath(); context.arc(canvas.width * 0.5, canvas.height - 120, 24, 0, Math.PI * 2); context.stroke();
  } else {
    context.textAlign = 'left'; context.textBaseline = 'alphabetic'; context.font = '500 15px Inter, Helvetica Neue, Arial, sans-serif';
    context.fillText('WORKING VOLUMES  /  01', 58, 70); context.globalAlpha = 0.7; context.beginPath(); context.moveTo(58, 86); context.lineTo(164, 86); context.stroke(); context.globalAlpha = 1;
    context.font = '400 78px Iowan Old Style, Baskerville, Georgia, serif'; context.fillText(book.title, 58, 1020);
    context.font = '500 14px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(book.discipline.toUpperCase(), 60, 1066);
  }
  return configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer);
}

function makeClothMaps(book, renderer) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d'); const random = seededRandom(hashSeed(`${book.id}-cloth`) + book.seed);
  context.fillStyle = '#7f7f7f'; context.fillRect(0, 0, 256, 256);
  for (let line = 0; line < 256; line += 2) { const value = Math.round(98 + random() * 70); context.strokeStyle = `rgb(${value},${value},${value})`; context.globalAlpha = 0.34 + random() * 0.18; context.beginPath(); context.moveTo(0, line); context.lineTo(256, line + (random() - 0.5)); context.stroke(); }
  for (let line = 1; line < 256; line += 3) { const value = Math.round(105 + random() * 58); context.strokeStyle = `rgb(${value},${value},${value})`; context.globalAlpha = 0.25 + random() * 0.14; context.beginPath(); context.moveTo(line, 0); context.lineTo(line + (random() - 0.5), 256); context.stroke(); }
  context.globalAlpha = 1;
  const bump = configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer, { color: false, anisotropy: 12 }); bump.wrapS = bump.wrapT = THREE.RepeatWrapping; bump.repeat.set(5, 8);
  return { bump, normal: bump, roughness: bump };
}

function makePaperTexture(book, renderer, printed = false) {
  const canvas = document.createElement('canvas'); canvas.width = 384; canvas.height = 576;
  const context = canvas.getContext('2d'); const random = seededRandom(hashSeed(`${book.id}-${printed ? 'printed' : 'paper'}`) + book.seed);
  context.fillStyle = '#e8e1d3'; context.fillRect(0, 0, canvas.width, canvas.height);
  for (let fiber = 0; fiber < 900; fiber += 1) { const x = random() * canvas.width; const y = random() * canvas.height; context.strokeStyle = random() > 0.44 ? `rgba(255,255,255,${0.025 + random() * 0.045})` : `rgba(92,76,55,${0.018 + random() * 0.035})`; context.lineWidth = 0.45 + random() * 0.65; context.beginPath(); context.moveTo(x, y); context.lineTo(Math.min(canvas.width, x + 5 + random() * 34), y + (random() - 0.5) * 2.2); context.stroke(); }
  if (printed) { context.fillStyle = 'rgba(24,42,67,0.38)'; context.font = '500 10px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText('WORKING VOLUMES  /  I', 36, 38); context.fillRect(36, 52, canvas.width - 72, 1); for (let line = 0; line < 26; line += 1) context.fillRect(36, 86 + line * 15, line % 7 === 6 ? 84 + random() * 54 : 174 + random() * 48, 1); }
  return configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer);
}

function createRoundedPlaneGeometry(width, height, radius) {
  const halfWidth = width * 0.5; const halfHeight = height * 0.5; const corner = Math.min(radius, halfWidth, halfHeight); const shape = new THREE.Shape();
  shape.moveTo(-halfWidth + corner, -halfHeight); shape.lineTo(halfWidth - corner, -halfHeight); shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + corner); shape.lineTo(halfWidth, halfHeight - corner); shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - corner, halfHeight); shape.lineTo(-halfWidth + corner, halfHeight); shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - corner); shape.lineTo(-halfWidth, -halfHeight + corner); shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + corner, -halfHeight);
  const geometry = new THREE.ShapeGeometry(shape, 8); const position = geometry.getAttribute('position'); const uv = new Float32Array(position.count * 2);
  for (let index = 0; index < position.count; index += 1) { uv[index * 2] = (position.getX(index) + halfWidth) / width; uv[index * 2 + 1] = (position.getY(index) + halfHeight) / height; }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geometry.computeVertexNormals(); return geometry;
}

function createPageBlockGeometry(width, height, depth, radius) {
  const geometry = new RoundedBoxGeometry(width, height, depth, 4, radius); const position = geometry.getAttribute('position'); const halfWidth = width * 0.5;
  for (let index = 0; index < position.count; index += 1) { const normalizedX = clamp((position.getX(index) + halfWidth) / width, 0, 1); const gutterProgress = clamp(normalizedX / 0.16, 0, 1); const gutterEase = gutterProgress * gutterProgress * (3 - 2 * gutterProgress); const gutterCompression = (1 - gutterEase) * 0.012; const z = position.getZ(index); const foreEdgeCharacter = Math.pow(normalizedX, 8) * Math.sin(position.getY(index) * 31) * 0.00055; position.setZ(index, Math.sign(z || 1) * Math.max(0, Math.abs(z) - gutterCompression + foreEdgeCharacter)); }
  position.needsUpdate = true; geometry.computeVertexNormals(); geometry.userData.gutterCompression = 0.012; geometry.userData.pageSignatures = 6; return geometry;
}

function createMesh(geometry, material, name, cast = true, receive = true) { const mesh = new THREE.Mesh(geometry, material); mesh.name = name; mesh.castShadow = cast; mesh.receiveShadow = receive; return mesh; }

function updateFlexiblePage(pagePivot, targetCurve, delta, immediate = false, targetTwist = 0) {
  const flex = pagePivot.userData.flex; if (!flex) return; const step = Math.min(delta, 0.033); let nextCurve = targetCurve; let nextTwist = targetTwist;
  if (immediate) { flex.curveVelocity = 0; flex.twistVelocity = 0; } else { flex.curveVelocity = clamp(flex.curveVelocity + ((targetCurve - flex.curve) * 178 - flex.curveVelocity * 19) * step, -1.8, 1.8); flex.twistVelocity = clamp(flex.twistVelocity + ((targetTwist - flex.twist) * 210 - flex.twistVelocity * 21) * step, -1.6, 1.6); nextCurve = clamp(flex.curve + flex.curveVelocity * step, -0.025, 0.19); nextTwist = clamp(flex.twist + flex.twistVelocity * step, -0.12, 0.12); }
  flex.curve = nextCurve; flex.twist = nextTwist;
  flex.surfaces.forEach(({ position, base, direction, geometry }) => { for (let vertex = 0; vertex < position.count; vertex += 1) { const offset = vertex * 3; const x = base[offset]; const y = base[offset + 1]; const mappedU = direction > 0 ? x + 0.5 : 1 - (x + 0.5); const arch = Math.sin(Math.PI * mappedU); const freeEdgeLift = mappedU * mappedU * 0.16; const diagonalTwist = nextTwist * y * Math.pow(mappedU, 1.35); const softRipple = nextTwist * Math.sin(mappedU * Math.PI * 2) * (1 - Math.min(1, Math.abs(y) * 1.65)) * 0.09; position.setXYZ(vertex, x, y, (nextCurve * (arch * 0.84 + freeEdgeLift) * (1 + y * 0.14) + diagonalTwist + softRipple) * direction); } position.needsUpdate = true; geometry.computeVertexNormals(); });
}

export function createCompleteShelfBookRig(config = {}) {
  const book = { ...CODEX, ...config.book, palette: { ...CODEX.palette, ...config.book?.palette } };
  const renderer = config.renderer; const root = new THREE.Group(); root.name = 'complete-shelf-codex-rig'; root.userData.source = 'Complete Shelf Codex book rig';
  const motion = new THREE.Group(); motion.name = 'codex-motion'; root.add(motion);
  const { width, height, depth } = book; const board = 0.032; const coverRadius = 0.0045; const pageRadius = 0.0025; const spineRadius = 0.0015; const spineBoardThickness = 0.014; const spineWidth = 0.082; const pageWidth = width - 0.074; const pageHeight = height - 0.068; const pageDepth = depth - 0.026;
  const coverTexture = makeCoverTexture(book, renderer, config.coverAtlasImage); const foilTexture = makeFoilTexture(book, renderer); const spineFoilTexture = makeFoilTexture(book, renderer, true); const clothMaps = makeClothMaps(book, renderer); const paperTexture = makePaperTexture(book, renderer); const printedPageTexture = makePaperTexture(book, renderer, true);
  const applyCoverAtlas = (atlasImage) => {
    if (!atlasImage?.complete || atlasImage.naturalWidth === 0) return false;
    const canvas = coverTexture.image;
    const context = canvas.getContext('2d');
    const [sourceX, sourceY, sourceWidth, sourceHeight] = COVER_CROPS[0];
    context.drawImage(atlasImage, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    const edgeShade = context.createLinearGradient(0, 0, canvas.width, 0);
    edgeShade.addColorStop(0, 'rgba(0,0,0,0.16)'); edgeShade.addColorStop(0.055, 'rgba(255,255,255,0.015)'); edgeShade.addColorStop(0.93, 'rgba(255,255,255,0)'); edgeShade.addColorStop(1, 'rgba(0,0,0,0.1)');
    context.fillStyle = edgeShade; context.fillRect(0, 0, canvas.width, canvas.height); coverTexture.needsUpdate = true; return true;
  };
  const trackedTextures = [coverTexture, foilTexture, spineFoilTexture, clothMaps.bump, paperTexture, printedPageTexture];
  const cloth = new THREE.MeshPhysicalMaterial({ color: book.color, normalMap: clothMaps.normal, normalScale: new THREE.Vector2(0.34, 0.34), roughnessMap: clothMaps.roughness, roughness: 0.98, metalness: 0.02, bumpMap: clothMaps.bump, bumpScale: 0.0045, sheen: 0.34, sheenRoughness: 0.76, sheenColor: new THREE.Color(book.foil), transparent: true });
  const coverArt = new THREE.MeshPhysicalMaterial({ map: coverTexture, normalMap: clothMaps.normal, normalScale: new THREE.Vector2(0.28, 0.28), roughnessMap: clothMaps.roughness, bumpMap: clothMaps.bump, bumpScale: 0.0035, roughness: 0.92, metalness: 0.035, clearcoat: 0.06, clearcoatRoughness: 0.72, sheen: 0.26, sheenRoughness: 0.78, transparent: true });
  const foilArt = new THREE.MeshPhysicalMaterial({ color: book.foil, map: foilTexture, alphaMap: foilTexture, bumpMap: foilTexture, bumpScale: 0.016, roughness: 0.2, metalness: 0.94, clearcoat: 0.18, clearcoatRoughness: 0.12, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const pageMaterial = new THREE.MeshPhysicalMaterial({ color: 0xe7dfcf, map: paperTexture, bumpMap: paperTexture, bumpScale: 0.0014, roughness: 0.95, metalness: 0, sheen: 0.025, sheenRoughness: 1, transparent: true });
  const pageSheetMaterial = new THREE.MeshPhysicalMaterial({ color: 0xeee6d7, map: printedPageTexture, bumpMap: paperTexture, bumpScale: 0.0012, roughness: 0.955, metalness: 0, sheen: 0.02, sheenRoughness: 1, side: THREE.DoubleSide, transparent: true });
  const spineArt = new THREE.MeshPhysicalMaterial({ color: book.color, map: coverTexture, normalMap: clothMaps.normal, roughnessMap: clothMaps.roughness, bumpMap: clothMaps.bump, bumpScale: 0.004, roughness: 0.95, metalness: 0.025, sheen: 0.27, sheenRoughness: 0.78, transparent: true, side: THREE.DoubleSide });
  const spineFoilArt = new THREE.MeshPhysicalMaterial({ color: book.foil, map: spineFoilTexture, alphaMap: spineFoilTexture, bumpMap: spineFoilTexture, bumpScale: 0.017, roughness: 0.19, metalness: 0.92, clearcoat: 0.16, clearcoatRoughness: 0.13, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, side: THREE.DoubleSide });
  const materials = [cloth, coverArt, foilArt, pageMaterial, pageSheetMaterial, spineArt, spineFoilArt];
  const coverGeometry = new RoundedBoxGeometry(width, height, board, 2, coverRadius); const pageGeometry = createPageBlockGeometry(pageWidth, pageHeight, pageDepth, pageRadius); const coverSurfaceGeometry = createRoundedPlaneGeometry(width - 0.007, height - 0.007, 0.0035);
  const pageBlock = createMesh(pageGeometry, pageMaterial, 'codex-page-block'); pageBlock.position.x = 0.018; motion.add(pageBlock);
  const backPivot = new THREE.Group(); backPivot.name = 'codex-back-cover-pivot'; backPivot.position.set(-width * 0.5, 0, -depth * 0.5 - board * 0.5); const backCover = createMesh(coverGeometry, cloth, 'codex-back-cover'); backCover.position.x = width * 0.5; backPivot.add(backCover); const backPlane = createMesh(coverSurfaceGeometry, coverArt, 'codex-back-cover-art', false, false); backPlane.position.set(width * 0.5, 0, -board * 0.55); backPlane.rotation.y = Math.PI; backPivot.add(backPlane); motion.add(backPivot);
  const frontPivot = new THREE.Group(); frontPivot.name = 'codex-front-cover-pivot'; frontPivot.position.set(-width * 0.5, 0, depth * 0.5 + board * 0.5); const frontCover = createMesh(coverGeometry, cloth, 'codex-front-cover'); frontCover.position.x = width * 0.5; frontPivot.add(frontCover); const coverPlane = createMesh(coverSurfaceGeometry, coverArt, 'codex-cover-art', false, false); coverPlane.position.set(width * 0.5, 0, board * 0.55); frontPivot.add(coverPlane); const foilPlane = createMesh(coverSurfaceGeometry, foilArt, 'codex-foil-art', false, false); foilPlane.position.set(width * 0.5, 0, board * 0.605); frontPivot.add(foilPlane); motion.add(frontPivot);
  const pagePivots = [];
  for (let pageIndex = 0; pageIndex < 6; pageIndex += 1) {
    const leafOrder = 5 - pageIndex; const pivot = new THREE.Group(); pivot.name = `codex-page-${pageIndex}`; pivot.position.set(-width * 0.5 + spineWidth * 0.65, 0, pageDepth * 0.5 + 0.0015 + pageIndex * 0.0015); pivot.userData.restZ = pivot.position.z; pivot.userData.turnedZ = depth * 0.5 + board + 0.004 + leafOrder * 0.0015;
    const frontGeometry = new THREE.PlaneGeometry(1, 1, FLEXIBLE_PAGE_SEGMENTS, FLEXIBLE_PAGE_VERTICAL_SEGMENTS); const backGeometry = new THREE.PlaneGeometry(1, 1, FLEXIBLE_PAGE_SEGMENTS, FLEXIBLE_PAGE_VERTICAL_SEGMENTS); const visiblePageWidth = pageWidth - spineWidth * 0.42;
    const front = createMesh(frontGeometry, pageSheetMaterial, `codex-page-sheet-${pageIndex}-front`, false, true); front.scale.set(visiblePageWidth, pageHeight - 0.014, 1); front.position.set(visiblePageWidth * 0.5, 0, 0.00022); pivot.add(front);
    const back = createMesh(backGeometry, pageSheetMaterial, `codex-page-sheet-${pageIndex}-back`, false, true); back.scale.set(visiblePageWidth, pageHeight - 0.014, 1); back.position.set(visiblePageWidth * 0.5, 0, -0.00022); back.rotation.y = Math.PI; pivot.add(back);
    pivot.userData.flex = { curve: 0, curveVelocity: 0, twist: 0, twistVelocity: 0, surfaces: [{ geometry: frontGeometry, position: frontGeometry.attributes.position, base: Float32Array.from(frontGeometry.attributes.position.array), direction: 1 }, { geometry: backGeometry, position: backGeometry.attributes.position, base: Float32Array.from(backGeometry.attributes.position.array), direction: -1 }] };
    motion.add(pivot); pagePivots.push(pivot);
  }
  const spineGeometry = new RoundedBoxGeometry(spineBoardThickness, height - 0.012, depth + board * 1.88, 1, spineRadius); const spine = createMesh(spineGeometry, spineArt, 'codex-flat-spine'); spine.position.x = -width * 0.5 - spineBoardThickness * 0.35; motion.add(spine);
  const spineFoil = createMesh(new THREE.PlaneGeometry(1, 1), spineFoilArt, 'codex-spine-foil', false, false); spineFoil.scale.set(depth + board * 1.82, height - 0.018, 1); spineFoil.rotation.y = -Math.PI * 0.5; spineFoil.position.set(spine.position.x - spineBoardThickness * 0.505, 0, 0); motion.add(spineFoil);
  const headbandMaterial = new THREE.MeshPhysicalMaterial({ color: 0xc6a66d, roughness: 0.58, metalness: 0.16, sheen: 0.14, sheenRoughness: 0.76 }); materials.push(headbandMaterial);
  [-1, 1].forEach((direction) => { const headband = createMesh(new THREE.CylinderGeometry(0.012, 0.012, pageDepth * 0.88, 12), headbandMaterial, `codex-headband-${direction}`); headband.rotation.x = Math.PI * 0.5; headband.position.set(-pageWidth * 0.5 + 0.046, direction * (pageHeight * 0.5 - 0.004), 0); motion.add(headband); });
  const ribbonMaterial = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(book.foil).lerp(new THREE.Color(book.color), 0.28), roughness: 0.62, metalness: 0.08, sheen: 0.36, sheenRoughness: 0.68, side: THREE.DoubleSide, transparent: true }); materials.push(ribbonMaterial); const ribbon = createMesh(createRoundedPlaneGeometry(0.034, pageHeight * 0.76, 0.002), ribbonMaterial, 'codex-ribbon-bookmark', false, true); ribbon.position.set(-pageWidth * 0.5 + 0.108, -pageHeight * 0.17, pageDepth * 0.5 + 0.003); ribbon.rotation.z = -0.014; motion.add(ribbon);
  root.userData.construction = { board, coverRadius, pageRadius, spineRadius, spineBoardThickness, flexiblePageSegments: FLEXIBLE_PAGE_SEGMENTS, flexiblePageVerticalSegments: FLEXIBLE_PAGE_VERTICAL_SEGMENTS, pagePivots: pagePivots.length, pageStackOffsets: pagePivots.map((pivot) => pivot.userData.restZ) };
  root.userData.applyCoverAtlas = applyCoverAtlas;
  const state = { open: 0, openTarget: 0, turn: 0, turnTarget: 0, settledPages: 0 };
  const updatePaginatedBook = (delta) => {
    const amount = clamp(state.open, 0, 1); const speed = 10.5; frontPivot.rotation.y = damp(frontPivot.rotation.y, (-Math.PI + 0.055) * amount, speed, delta);
    pagePivots.forEach((pivot, pageIndex) => { const leafOrder = pagePivots.length - 1 - pageIndex; let target = 0; let positionTarget = pivot.userData.restZ; let twist = 0; if (leafOrder < PAGINATED_LEAF_COUNT) { const isSettled = leafOrder < state.settledPages; const unturnedTarget = -0.038 + leafOrder * 0.008; const turnedTarget = -Math.PI + 0.085 + leafOrder * 0.014; if (leafOrder === state.settledPages && state.turn > 0) { target = lerp(unturnedTarget, turnedTarget, state.turn); positionTarget = lerp(pivot.userData.restZ, pivot.userData.turnedZ, state.turn); const envelope = Math.sin(Math.PI * state.turn); twist = envelope * 0.014; } else { target = isSettled ? turnedTarget : unturnedTarget; positionTarget = isSettled ? pivot.userData.turnedZ : pivot.userData.restZ; } pivot.position.z = damp(pivot.position.z, pivot.userData.restZ + (positionTarget - pivot.userData.restZ) * amount, speed, delta); } else { target = -0.006 + (leafOrder - PAGINATED_LEAF_COUNT) * 0.003; pivot.position.z = damp(pivot.position.z, pivot.userData.restZ, speed, delta); } pivot.rotation.y = damp(pivot.rotation.y, target * amount, speed, delta); pivot.rotation.z = damp(pivot.rotation.z, twist * amount, speed, delta); const progress = clamp(Math.abs(pivot.rotation.y) / Math.PI, 0, 1); updateFlexiblePage(pivot, amount > 0 ? amount * (0.004 + Math.sin(Math.PI * progress) * 0.082) : 0, delta, delta === 0, twist * amount); });
  };
  const controller = {
    open() { state.openTarget = 1; }, close() { state.openTarget = 0; state.turnTarget = 0; state.settledPages = 0; },
    setOpenProgress(progress) { state.open = state.openTarget = clamp(progress, 0, 1); },
    setPageTurnProgress(progress) { state.turn = state.turnTarget = clamp(progress, 0, 1); },
    settlePage() { state.turn = state.turnTarget = 0; state.settledPages = Math.min(PAGINATED_LEAF_COUNT, state.settledPages + 1); },
    reset() { state.open = state.openTarget = 0; state.turn = state.turnTarget = 0; state.settledPages = 0; frontPivot.rotation.y = 0; pagePivots.forEach((pivot) => { pivot.rotation.set(0, 0, 0); pivot.position.z = pivot.userData.restZ; updateFlexiblePage(pivot, 0, 0, true); }); },
    update(delta = 0) { state.open = damp(state.open, state.openTarget, 10.5, delta); state.turn = damp(state.turn, state.turnTarget, 12, delta); updatePaginatedBook(delta); },
    getSnapshot() { return { rootUuid: root.uuid, rootName: root.name, openProgress: state.open, pageTurnProgress: state.turn, settledPages: state.settledPages, pagePivotCount: pagePivots.length, flexiblePageSegments: FLEXIBLE_PAGE_SEGMENTS, flexiblePageVerticalSegments: FLEXIBLE_PAGE_VERTICAL_SEGMENTS }; },
  };
  controller.reset();
  const dispose = () => { root.traverse((object) => { object.geometry?.dispose?.(); const source = object.material; (Array.isArray(source) ? source : [source]).forEach((material) => material?.dispose?.()); }); trackedTextures.forEach((texture, index) => { if (index === 2 || index === 3) return; texture.dispose(); }); };
  return { root, controller, dispose };
}
