import * as THREE from '/dev/complete-shelf-rig/vendor/three.module.js';
import { RoundedBoxGeometry } from '/dev/complete-shelf-rig/vendor/RoundedBoxGeometry.js';
import { applyCompleteShelfPresentation } from '/dev/complete-shelf-rig/complete-shelf-presentation-seam.js';

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
// Keep the six-leaf construction intact; only the first leaf is reader-turnable.
const PAGINATED_LEAF_COUNT = 1;
const PAGE_SETTLE_EPSILON = 0.001;
const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const lerp = (from, to, progress) => from + (to - from) * progress;
const smoothstep = (value) => value * value * (3 - 2 * value);

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

function makeClothBumpTexture(book, renderer) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d'); const random = seededRandom(hashSeed(`${book.id}-cloth`) + book.seed);
  context.fillStyle = '#7f7f7f'; context.fillRect(0, 0, canvas.width, canvas.height);
  for (let line = 0; line < 256; line += 2) { const value = Math.round(98 + random() * 70); context.strokeStyle = `rgb(${value},${value},${value})`; context.globalAlpha = 0.34 + random() * 0.18; context.lineWidth = 0.65 + random() * 0.45; context.beginPath(); context.moveTo(0, line + (random() - 0.5)); context.lineTo(256, line + (random() - 0.5)); context.stroke(); }
  for (let line = 1; line < 256; line += 3) { const value = Math.round(105 + random() * 58); context.strokeStyle = `rgb(${value},${value},${value})`; context.globalAlpha = 0.25 + random() * 0.14; context.lineWidth = 0.55 + random() * 0.35; context.beginPath(); context.moveTo(line + (random() - 0.5), 0); context.lineTo(line + (random() - 0.5), 256); context.stroke(); }
  context.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas); texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(5, 8);
  return configureCanvasTexture(texture, renderer, { color: false, anisotropy: 12 });
}

function makeClothSurfaceMaps(book, renderer) {
  const size = 256; const field = new Float32Array(size * size); const normalCanvas = document.createElement('canvas'); const roughnessCanvas = document.createElement('canvas'); normalCanvas.width = roughnessCanvas.width = size; normalCanvas.height = roughnessCanvas.height = size;
  const normalContext = normalCanvas.getContext('2d'); const roughnessContext = roughnessCanvas.getContext('2d'); const normalImage = normalContext.createImageData(size, size); const roughnessImage = roughnessContext.createImageData(size, size); const phase = (book.seed % 19) * 0.23;
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) field[y * size + x] = 0.5 + Math.sin((x + phase) * Math.PI * 0.52) * 0.18 + Math.sin((y - phase) * Math.PI * 0.41) * 0.15 + Math.sin((x + y + phase) * Math.PI * 0.19) * 0.045;
  const sample = (x, y) => field[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) { const index = y * size + x; const pixel = index * 4; const dx = (sample(x + 1, y) - sample(x - 1, y)) * 1.5; const dy = (sample(x, y + 1) - sample(x, y - 1)) * 1.5; const length = Math.hypot(dx, dy, 1); normalImage.data[pixel] = Math.round(((-dx / length) * 0.5 + 0.5) * 255); normalImage.data[pixel + 1] = Math.round(((-dy / length) * 0.5 + 0.5) * 255); normalImage.data[pixel + 2] = Math.round(((1 / length) * 0.5 + 0.5) * 255); normalImage.data[pixel + 3] = 255; const roughness = Math.round(188 + field[index] * 56); roughnessImage.data[pixel] = roughness; roughnessImage.data[pixel + 1] = roughness; roughnessImage.data[pixel + 2] = roughness; roughnessImage.data[pixel + 3] = 255; }
  normalContext.putImageData(normalImage, 0, 0); roughnessContext.putImageData(roughnessImage, 0, 0);
  const map = (canvas, suffix) => { const texture = new THREE.CanvasTexture(canvas); texture.name = `${book.id}-${suffix}`; texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(5, 8); return configureCanvasTexture(texture, renderer, { color: false, anisotropy: 12 }); };
  return { normal: map(normalCanvas, 'cloth-normal'), roughness: map(roughnessCanvas, 'cloth-roughness') };
}

function makeEmbossMap(sourceTexture, name, renderer) {
  const texture = new THREE.CanvasTexture(sourceTexture.image); texture.name = name; texture.wrapS = sourceTexture.wrapS; texture.wrapT = sourceTexture.wrapT; texture.repeat.copy(sourceTexture.repeat); texture.offset.copy(sourceTexture.offset); texture.center.copy(sourceTexture.center); texture.rotation = sourceTexture.rotation;
  return configureCanvasTexture(texture, renderer, { color: false, anisotropy: 16 });
}

function drawPaperSurface(context, width, height, random) {
  context.fillStyle = '#e8e1d3'; context.fillRect(0, 0, width, height); const wash = context.createLinearGradient(0, 0, width, height); wash.addColorStop(0, 'rgba(255,255,255,0.22)'); wash.addColorStop(0.42, 'rgba(255,255,255,0.035)'); wash.addColorStop(1, 'rgba(103,87,64,0.08)'); context.fillStyle = wash; context.fillRect(0, 0, width, height);
  for (let fiber = 0; fiber < 2400; fiber += 1) { const x = random() * width; const y = random() * height; const length = 5 + random() * 34; context.strokeStyle = random() > 0.44 ? `rgba(255,255,255,${0.025 + random() * 0.045})` : `rgba(92,76,55,${0.018 + random() * 0.035})`; context.lineWidth = 0.45 + random() * 0.65; context.beginPath(); context.moveTo(x, y); context.lineTo(Math.min(width, x + length), y + (random() - 0.5) * 2.2); context.stroke(); }
  for (let fleck = 0; fleck < 1200; fleck += 1) { const tone = Math.round(112 + random() * 94); context.fillStyle = `rgba(${tone},${tone - 5},${tone - 13},${0.016 + random() * 0.025})`; const size = 0.5 + random() * 1.1; context.fillRect(random() * width, random() * height, size, size); }
}

function makePaperFaceTexture(book, renderer, printed = false) {
  const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 1152; const context = canvas.getContext('2d'); const random = seededRandom(printed ? hashSeed(`${book.id}-printed-page`) + book.seed : hashSeed('working-volumes-paper-stock'));
  drawPaperSurface(context, canvas.width, canvas.height, random);
  if (printed) { const ink = new THREE.Color(book.palette.ink); context.fillStyle = `rgba(${Math.round(ink.r * 255)},${Math.round(ink.g * 255)},${Math.round(ink.b * 255)},0.2)`; context.textAlign = 'left'; context.textBaseline = 'alphabetic'; context.font = '500 15px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(book.title.toUpperCase(), 84, 98); context.fillRect(84, 121, 190, 2); for (let column = 0; column < 2; column += 1) for (let line = 0; line < 34; line += 1) { const last = line % 7 === 6; context.globalAlpha = 0.22 + random() * 0.11; context.fillRect(84 + column * 316, 184 + line * 23, last ? 108 + random() * 86 : 190 + random() * 72, 1.45); } context.globalAlpha = 0.32; context.font = '400 17px Iowan Old Style, Baskerville, Georgia, serif'; context.fillText(book.roman, canvas.width - 104, canvas.height - 72); context.globalAlpha = 1; }
  return configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer, { anisotropy: 16 });
}

function drawWrappedCanvasText(context, text, x, y, maxCharacters, lineHeight, maxLines = 6) {
  const words = text.split(/\s+/); let line = ''; let lineIndex = 0; words.forEach((word) => { if (lineIndex >= maxLines) return; const candidate = line ? `${line} ${word}` : word; if (candidate.length > maxCharacters && line) { context.fillText(line, x, y + lineIndex * lineHeight); line = word; lineIndex += 1; } else line = candidate; }); if (line && lineIndex < maxLines) context.fillText(line, x, y + lineIndex * lineHeight);
}

function makeEndpaperTexture(book, renderer) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 768; const context = canvas.getContext('2d'); const random = seededRandom(hashSeed(`${book.id}-endpaper`) + book.seed); drawPaperSurface(context, canvas.width, canvas.height, random); context.save(); context.fillStyle = book.color; context.globalAlpha = 0.14; context.fillRect(0, 0, canvas.width, canvas.height); context.globalAlpha = 0.18; context.strokeStyle = book.foil; context.lineWidth = 1; for (let x = 28; x < canvas.width; x += 48) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, canvas.height); context.stroke(); } for (let y = 24; y < canvas.height; y += 48) { context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke(); } context.globalAlpha = 0.42; drawMotif(context, { ...book, foil: book.palette.inkSoft }, canvas.width, canvas.height); context.restore(); const texture = configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer, { anisotropy: 16 }); texture.name = `${book.id}-patterned-endpaper`; return texture;
}

function makeInteriorPageTextures(book, renderer) {
  const inkColor = new THREE.Color(book.color).lerp(new THREE.Color(0x211b16), 0.62); const ink = `#${inkColor.getHexString()}`;
  return Array.from({ length: 8 }, (_, pageIndex) => { const canvas = document.createElement('canvas'); const width = 512; const height = 768; canvas.width = 384; canvas.height = 576; const context = canvas.getContext('2d'); context.scale(0.75, 0.75); const random = seededRandom(hashSeed(`${book.id}-leaf-${pageIndex}`) + book.seed); drawPaperSurface(context, width, height, random); context.fillStyle = ink; context.strokeStyle = ink; context.textAlign = 'left'; context.textBaseline = 'alphabetic'; context.globalAlpha = 0.58; context.font = '500 10px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(`WORKING VOLUMES  /  ${book.roman}`, 48, 48); context.textAlign = 'right'; context.fillText(String(pageIndex + 1).padStart(2, '0'), width - 48, 48); context.textAlign = 'left'; context.fillRect(48, 64, width - 96, 1); context.globalAlpha = 1;
    if (pageIndex === 0) { context.font = '500 12px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(book.discipline.toUpperCase(), 54, 174); context.font = `400 ${book.title.length > 10 ? 48 : 58}px Iowan Old Style, Baskerville, Georgia, serif`; drawWrappedCanvasText(context, book.title, 52, 246, 18, 58, 2); context.globalAlpha = 0.55; context.font = '400 22px Iowan Old Style, Baskerville, Georgia, serif'; drawWrappedCanvasText(context, book.note, 54, 462, 36, 30, 4); }
    else if (pageIndex === 1 || pageIndex === 3) { const chapter = pageIndex === 1 ? 0 : 1; context.font = '500 11px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(`CHAPTER ${String(chapter + 1).padStart(2, '0')}`, 54, 166); context.font = '400 49px Iowan Old Style, Baskerville, Georgia, serif'; drawWrappedCanvasText(context, book.chapters[chapter], 52, 244, 18, 54, 3); context.globalAlpha = 0.52; context.font = '400 20px Iowan Old Style, Baskerville, Georgia, serif'; drawWrappedCanvasText(context, chapter === 0 ? book.note : book.deck, 54, 438, 42, 28, 6); }
    else if (pageIndex === 2 || pageIndex === 6) { context.font = '500 11px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(pageIndex === 2 ? 'PLATE 01  /  SYSTEM MOTIF' : 'PLATE 02  /  TECHNICAL SYSTEM', 54, 146); context.save(); context.globalAlpha = 0.58; if (pageIndex === 2) drawMotif(context, { ...book, foil: ink }, width, height * 0.92); else { context.translate(width * 0.5, 380); for (let ring = 0; ring < 5; ring += 1) { context.beginPath(); context.arc(0, 0, 38 + ring * 34, 0, Math.PI * 2); context.stroke(); } for (let spoke = 0; spoke < 8; spoke += 1) { const angle = spoke * Math.PI * 0.25; context.beginPath(); context.moveTo(Math.cos(angle) * 36, Math.sin(angle) * 36); context.lineTo(Math.cos(angle) * 176, Math.sin(angle) * 176); context.stroke(); } } context.restore(); context.globalAlpha = 0.48; context.font = '400 17px Iowan Old Style, Baskerville, Georgia, serif'; drawWrappedCanvasText(context, book.theme, 54, 650, 44, 24, 3); }
    else if (pageIndex === 4) { context.font = '500 11px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(`NOTES  /  ${book.chapters[1].toUpperCase()}`, 54, 138); context.globalAlpha = 0.44; for (let column = 0; column < 2; column += 1) for (let line = 0; line < 24; line += 1) context.fillRect(54 + column * 214, 190 + line * 18, line % 7 === 6 ? 72 + random() * 54 : 138 + random() * 44, 1.25); context.globalAlpha = 0.78; context.strokeRect(54, 654, 404, 54); context.font = '500 10px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(book.motif.toUpperCase(), 70, 686); }
    else if (pageIndex === 5) { context.font = '500 11px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText('CHAPTER 03', 54, 166); context.font = '400 49px Iowan Old Style, Baskerville, Georgia, serif'; drawWrappedCanvasText(context, book.chapters[2], 52, 244, 18, 54, 3); context.globalAlpha = 0.52; context.font = '400 20px Iowan Old Style, Baskerville, Georgia, serif'; drawWrappedCanvasText(context, book.deck, 54, 438, 42, 28, 6); }
    else { context.font = '500 11px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText('COLOPHON', 54, 164); context.font = '400 32px Iowan Old Style, Baskerville, Georgia, serif'; context.fillText(book.title, 54, 230); context.globalAlpha = 0.58; context.font = '400 18px Iowan Old Style, Baskerville, Georgia, serif'; drawWrappedCanvasText(context, `${book.binding}. ${book.format}. Conceived as an original editorial study for Working Volumes.`, 54, 306, 44, 28, 7); }
    context.globalAlpha = 0.62; context.fillRect(48, height - 48, width - 96, 1); context.globalAlpha = 1; const texture = configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer, { anisotropy: 16 }); texture.name = `${book.id}-interior-page-${pageIndex + 1}`; return texture; });
}

function makePageEdgeTextures(book, renderer) {
  const makeEdgeTexture = (width, height, suffix) => { const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; const context = canvas.getContext('2d'); const random = seededRandom(hashSeed(`${book.id}-${suffix}`) + book.seed); context.fillStyle = '#dcd5c7'; context.fillRect(0, 0, width, height); const step = suffix === 'fore-edge' ? 2 : 1.35; for (let y = 0; y < height; y += step) { const shade = Math.round(106 + random() * 74); const signature = random() > 0.965; context.strokeStyle = `rgba(${shade},${shade - 3},${shade - 9},${signature ? 0.34 : 0.13 + random() * 0.13})`; context.lineWidth = signature ? 1.05 : 0.42 + random() * 0.42; context.beginPath(); context.moveTo(0, y + (random() - 0.5) * 0.5); context.bezierCurveTo(width * 0.3, y + (random() - 0.5) * 0.9, width * 0.72, y + (random() - 0.5) * 0.9, width, y + (random() - 0.5) * 0.5); context.stroke(); } const shade = context.createLinearGradient(0, 0, width, 0); shade.addColorStop(0, 'rgba(58,48,35,0.18)'); shade.addColorStop(0.035, 'rgba(255,255,255,0.04)'); shade.addColorStop(0.86, 'rgba(255,255,255,0)'); shade.addColorStop(1, 'rgba(58,48,35,0.12)'); context.fillStyle = shade; context.fillRect(0, 0, width, height); return configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer); };
  return { fore: makeEdgeTexture(512, 2048, 'fore-edge'), headTail: makeEdgeTexture(2048, 384, 'head-tail-edge') };
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

function makeSpineTexture(book, renderer) {
  const canvas = document.createElement('canvas'); canvas.width = 384; canvas.height = 1536; const context = canvas.getContext('2d'); const random = seededRandom(hashSeed(`${book.id}-spine-cloth`) + book.seed); context.fillStyle = book.color; context.fillRect(0, 0, canvas.width, canvas.height);
  const shade = context.createLinearGradient(0, 0, canvas.width, 0); shade.addColorStop(0, 'rgba(0,0,0,0.2)'); shade.addColorStop(0.14, 'rgba(255,255,255,0.055)'); shade.addColorStop(0.62, 'rgba(255,255,255,0.012)'); shade.addColorStop(1, 'rgba(0,0,0,0.16)'); context.fillStyle = shade; context.fillRect(0, 0, canvas.width, canvas.height);
  for (let thread = 0; thread < 1900; thread += 1) { const x = random() * canvas.width; const y = random() * canvas.height; const vertical = random() > 0.42; context.strokeStyle = random() > 0.5 ? `rgba(255,255,255,${0.018 + random() * 0.038})` : `rgba(0,0,0,${0.018 + random() * 0.032})`; context.lineWidth = 0.45 + random() * 0.7; context.beginPath(); context.moveTo(x, y); context.lineTo(vertical ? x + (random() - 0.5) * 1.2 : x + 8 + random() * 28, vertical ? y + 8 + random() * 34 : y + (random() - 0.5) * 1.2); context.stroke(); }
  const bottomShade = context.createLinearGradient(0, canvas.height * 0.82, 0, canvas.height); bottomShade.addColorStop(0, 'rgba(0,0,0,0)'); bottomShade.addColorStop(1, 'rgba(0,0,0,0.12)'); context.fillStyle = bottomShade; context.fillRect(0, 0, canvas.width, canvas.height); return configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer, { anisotropy: 16 });
}

function makeSpineFoilTexture(book, renderer) {
  const canvas = document.createElement('canvas'); canvas.width = 384; canvas.height = 1536; const context = canvas.getContext('2d'); context.clearRect(0, 0, canvas.width, canvas.height); context.fillStyle = '#ffffff'; context.strokeStyle = '#ffffff'; context.lineWidth = 2.4; context.strokeRect(34, 38, canvas.width - 68, canvas.height - 76); context.textAlign = 'center'; context.textBaseline = 'middle'; context.font = '500 24px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(book.roman, canvas.width * 0.5, 118); context.save(); context.translate(canvas.width * 0.5, canvas.height * 0.5); context.rotate(Math.PI / 2); context.font = `400 ${book.title.length > 10 ? 58 : 68}px Iowan Old Style, Baskerville, Georgia, serif`; context.fillText(book.title, 0, 0); context.restore(); context.beginPath(); context.arc(canvas.width * 0.5, canvas.height - 120, 24, 0, Math.PI * 2); context.stroke(); context.beginPath(); context.moveTo(canvas.width * 0.5 - 24, canvas.height - 120); context.lineTo(canvas.width * 0.5 + 24, canvas.height - 120); context.stroke(); return configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer);
}

function makeBackCoverTexture(book, renderer) {
  const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 1152; const context = canvas.getContext('2d'); const random = seededRandom(hashSeed(`${book.id}-back-cloth`) + book.seed); context.fillStyle = book.color; context.fillRect(0, 0, canvas.width, canvas.height); const shade = context.createLinearGradient(0, 0, canvas.width, 0); shade.addColorStop(0, 'rgba(0,0,0,0.15)'); shade.addColorStop(0.05, 'rgba(255,255,255,0.028)'); shade.addColorStop(0.84, 'rgba(255,255,255,0)'); shade.addColorStop(1, 'rgba(0,0,0,0.11)'); context.fillStyle = shade; context.fillRect(0, 0, canvas.width, canvas.height);
  for (let thread = 0; thread < 2600; thread += 1) { const x = random() * canvas.width; const y = random() * canvas.height; const length = 5 + random() * 30; context.strokeStyle = random() > 0.5 ? `rgba(255,255,255,${0.018 + random() * 0.03})` : `rgba(0,0,0,${0.016 + random() * 0.028})`; context.lineWidth = 0.45 + random() * 0.65; context.beginPath(); context.moveTo(x, y); context.lineTo(x + length, y + (random() - 0.5) * 1.5); context.stroke(); }
  const vignette = context.createRadialGradient(canvas.width * 0.62, canvas.height * 0.38, 20, canvas.width * 0.62, canvas.height * 0.38, canvas.width * 0.75); vignette.addColorStop(0, 'rgba(255,255,255,0.03)'); vignette.addColorStop(1, 'rgba(0,0,0,0.09)'); context.fillStyle = vignette; context.fillRect(0, 0, canvas.width, canvas.height); return configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer);
}

function makeBackFoilTexture(book, renderer) {
  const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 1152; const context = canvas.getContext('2d'); context.clearRect(0, 0, canvas.width, canvas.height); context.fillStyle = '#ffffff'; context.strokeStyle = '#ffffff'; context.textAlign = 'left'; context.textBaseline = 'alphabetic'; context.font = '500 16px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(`WORKING VOLUMES  /  ${book.roman}`, 68, 82); context.globalAlpha = 0.72; context.fillRect(68, 108, 176, 2); context.globalAlpha = 1; context.lineWidth = 1.5;
  for (let ring = 0; ring < 5; ring += 1) { context.globalAlpha = 0.24 - ring * 0.032; context.beginPath(); context.arc(548, 374, 74 + ring * 38, 0, Math.PI * 2); context.stroke(); } context.globalAlpha = 1; context.beginPath(); context.moveTo(348, 374); context.lineTo(704, 374); context.moveTo(548, 174); context.lineTo(548, 574); context.stroke(); context.font = `400 ${book.title.length > 10 ? 52 : 62}px Iowan Old Style, Baskerville, Georgia, serif`; context.fillText(book.title, 68, 956); context.font = '500 15px Inter, Helvetica Neue, Arial, sans-serif'; context.fillText(book.discipline.toUpperCase(), 70, 1004); context.globalAlpha = 0.68; context.fillRect(68, 1040, 632, 1.5); context.globalAlpha = 1; context.textAlign = 'right'; context.fillText('AN IMAGINED EDITION', 700, 1080); return configureCanvasTexture(new THREE.CanvasTexture(canvas), renderer);
}

function createMesh(geometry, material, name, cast = true, receive = true) { const mesh = new THREE.Mesh(geometry, material); mesh.name = name; mesh.castShadow = cast; mesh.receiveShadow = receive; return mesh; }

function addTurnIns(pivot, book, side, width, height, insideZ, material, boxGeometry) {
  const stripDepth = 0.002; const border = 0.018; const longWidth = width - border * 0.7; const longHeight = height - border * 2.2;
  [['head', width * 0.5, height * 0.5 - border * 0.56, longWidth, border], ['tail', width * 0.5, -height * 0.5 + border * 0.56, longWidth, border], ['spine', border * 0.56, 0, border, longHeight], ['fore', width - border * 0.56, 0, border, longHeight]].forEach(([edge, x, y, stripWidth, stripHeight]) => { const strip = createMesh(boxGeometry, material, `${book.id}-${side}-turn-in-${edge}`, false, true); strip.scale.set(stripWidth, stripHeight, stripDepth); strip.position.set(x, y, insideZ); pivot.add(strip); });
}

function updateFlexiblePage(pagePivot, targetCurve, delta, immediate = false, targetTwist = 0) {
  const flex = pagePivot.userData.flex; if (!flex) return; const settleImmediately = immediate; const step = Math.min(delta, 0.033); let nextCurve = targetCurve; let nextTwist = targetTwist;
  if (settleImmediately) { flex.curveVelocity = 0; flex.twistVelocity = 0; } else {
    const curveAcceleration = (targetCurve - flex.curve) * 178 - flex.curveVelocity * 19;
    const twistAcceleration = (targetTwist - flex.twist) * 210 - flex.twistVelocity * 21;
    flex.curveVelocity = clamp(flex.curveVelocity + curveAcceleration * step, -1.8, 1.8);
    flex.twistVelocity = clamp(flex.twistVelocity + twistAcceleration * step, -1.6, 1.6);
    nextCurve = clamp(flex.curve + flex.curveVelocity * step, -0.025, 0.19);
    nextTwist = clamp(flex.twist + flex.twistVelocity * step, -0.12, 0.12);
    if (Math.abs(targetCurve - nextCurve) < 0.00002 && Math.abs(flex.curveVelocity) < 0.0008) { nextCurve = targetCurve; flex.curveVelocity = 0; }
    if (Math.abs(targetTwist - nextTwist) < 0.00002 && Math.abs(flex.twistVelocity) < 0.0008) { nextTwist = targetTwist; flex.twistVelocity = 0; }
  }
  if (!settleImmediately && Math.abs(nextCurve - flex.curve) < 0.00001 && Math.abs(targetCurve - nextCurve) < 0.00001 && Math.abs(nextTwist - flex.twist) < 0.00001 && Math.abs(targetTwist - nextTwist) < 0.00001) return;
  flex.curve = nextCurve; flex.twist = nextTwist;
  flex.surfaces.forEach(({ position, base, direction, geometry }) => { for (let vertex = 0; vertex < position.count; vertex += 1) { const offset = vertex * 3; const x = base[offset]; const y = base[offset + 1]; const mappedU = direction > 0 ? x + 0.5 : 1 - (x + 0.5); const arch = Math.sin(Math.PI * mappedU); const freeEdgeLift = mappedU * mappedU * 0.16; const diagonalTwist = nextTwist * y * Math.pow(mappedU, 1.35); const softRipple = nextTwist * Math.sin(mappedU * Math.PI * 2) * (1 - Math.min(1, Math.abs(y) * 1.65)) * 0.09; position.setXYZ(vertex, x, y, (nextCurve * (arch * 0.84 + freeEdgeLift) * (1 + y * 0.14) + diagonalTwist + softRipple) * direction); } position.needsUpdate = true; geometry.computeVertexNormals(); });
}

export function createCompleteShelfBookRig(config = {}) {
  const book = CODEX;
  const presentation = config.presentation;
  const renderer = config.renderer; const root = new THREE.Group(); root.name = 'complete-shelf-codex-rig'; root.userData.source = 'Complete Shelf Codex book rig';
  const motion = new THREE.Group(); motion.name = 'codex-motion'; root.add(motion);
  const { width, height, depth } = book; const board = 0.032; const coverRadius = 0.0045; const pageRadius = 0.0025; const spineRadius = 0.0015; const spineBoardThickness = 0.014; const spineWidth = 0.082; const pageWidth = width - 0.074; const pageHeight = height - 0.068; const pageDepth = depth - 0.026;
  const coverTexture = makeCoverTexture(book, renderer, config.coverAtlasImage); const foilTexture = makeFoilTexture(book, renderer); const clothBumpTexture = makeClothBumpTexture(book, renderer); const clothSurfaceMaps = makeClothSurfaceMaps(book, renderer); const paperFaceTexture = makePaperFaceTexture(book, renderer); const interiorPageTextures = makeInteriorPageTextures(book, renderer); const openingEndpaperTexture = makeEndpaperTexture(book, renderer); const frontEndpaperTexture = makeEndpaperTexture(book, renderer); const pageEdgeTextures = makePageEdgeTextures(book, renderer); const spineTexture = makeSpineTexture(book, renderer); const spineFoilTexture = makeSpineFoilTexture(book, renderer); const backCoverTexture = makeBackCoverTexture(book, renderer); const backFoilTexture = makeBackFoilTexture(book, renderer); const foilEmbossTexture = makeEmbossMap(foilTexture, `${book.id}-front-foil-emboss`, renderer); const spineEmbossTexture = makeEmbossMap(spineFoilTexture, `${book.id}-spine-foil-emboss`, renderer); const backEmbossTexture = makeEmbossMap(backFoilTexture, `${book.id}-back-foil-emboss`, renderer);
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
  const trackedTextures = [coverTexture, foilTexture, clothBumpTexture, clothSurfaceMaps.normal, clothSurfaceMaps.roughness, paperFaceTexture, ...interiorPageTextures, openingEndpaperTexture, frontEndpaperTexture, pageEdgeTextures.fore, pageEdgeTextures.headTail, spineTexture, spineFoilTexture, backCoverTexture, backFoilTexture, foilEmbossTexture, spineEmbossTexture, backEmbossTexture];
  const cloth = new THREE.MeshPhysicalMaterial({ color: book.color, normalMap: clothSurfaceMaps.normal, normalScale: new THREE.Vector2(0.34, 0.34), roughnessMap: clothSurfaceMaps.roughness, roughness: 0.98, metalness: 0.02, bumpMap: clothBumpTexture, bumpScale: 0.0045, sheen: 0.34, sheenRoughness: 0.76, sheenColor: new THREE.Color(book.foil), transparent: true });
  const coverArt = new THREE.MeshPhysicalMaterial({ map: coverTexture, normalMap: clothSurfaceMaps.normal, normalScale: new THREE.Vector2(0.28, 0.28), roughnessMap: clothSurfaceMaps.roughness, bumpMap: clothBumpTexture, bumpScale: 0.0035, roughness: 0.92, metalness: 0.035, clearcoat: 0.06, clearcoatRoughness: 0.72, sheen: 0.26, sheenRoughness: 0.78, transparent: true });
  const foilArt = new THREE.MeshPhysicalMaterial({ color: book.foil, map: foilTexture, alphaMap: foilTexture, bumpMap: foilEmbossTexture, bumpScale: 0.016, roughness: 0.2, metalness: 0.94, clearcoat: 0.18, clearcoatRoughness: 0.12, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const spineArt = new THREE.MeshPhysicalMaterial({ map: spineTexture, normalMap: clothSurfaceMaps.normal, normalScale: new THREE.Vector2(0.3, 0.3), roughnessMap: clothSurfaceMaps.roughness, bumpMap: clothBumpTexture, bumpScale: 0.004, roughness: 0.95, metalness: 0.025, sheen: 0.27, sheenRoughness: 0.78, transparent: true, side: THREE.DoubleSide });
  const spineFoilArt = new THREE.MeshPhysicalMaterial({ color: book.foil, map: spineFoilTexture, alphaMap: spineFoilTexture, bumpMap: spineEmbossTexture, bumpScale: 0.017, roughness: 0.19, metalness: 0.92, clearcoat: 0.16, clearcoatRoughness: 0.13, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, side: THREE.DoubleSide });
  const backArt = new THREE.MeshPhysicalMaterial({ map: backCoverTexture, normalMap: clothSurfaceMaps.normal, normalScale: new THREE.Vector2(0.28, 0.28), roughnessMap: clothSurfaceMaps.roughness, bumpMap: clothBumpTexture, bumpScale: 0.0035, roughness: 0.96, metalness: 0.025, sheen: 0.25, sheenRoughness: 0.8, transparent: true, side: THREE.DoubleSide });
  const backFoilArt = new THREE.MeshPhysicalMaterial({ color: book.foil, map: backFoilTexture, alphaMap: backFoilTexture, bumpMap: backEmbossTexture, bumpScale: 0.016, roughness: 0.21, metalness: 0.9, clearcoat: 0.14, clearcoatRoughness: 0.14, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, side: THREE.DoubleSide });
  const openingEndpaperMaterial = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(book.palette.paperPale).lerp(new THREE.Color(0xf2ead8), 0.5), map: openingEndpaperTexture, bumpMap: paperFaceTexture, bumpScale: 0.0018, roughness: 0.94, metalness: 0, sheen: 0.025, sheenRoughness: 1, side: THREE.DoubleSide, transparent: true }); const frontEndpaperMaterial = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(book.palette.paperPale).lerp(new THREE.Color(0xf2ead8), 0.5), map: frontEndpaperTexture, bumpMap: paperFaceTexture, bumpScale: 0.0018, roughness: 0.94, metalness: 0, sheen: 0.025, sheenRoughness: 1, side: THREE.DoubleSide, transparent: true });
  const foreEdgeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: pageEdgeTextures.fore, bumpMap: pageEdgeTextures.fore, bumpScale: 0.0022, roughness: 0.93, metalness: 0, sheen: 0.018, sheenRoughness: 1, side: THREE.DoubleSide, transparent: true });
  const headTailEdgeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: pageEdgeTextures.headTail, bumpMap: pageEdgeTextures.headTail, bumpScale: 0.0015, roughness: 0.94, metalness: 0, sheen: 0.014, sheenRoughness: 1, side: THREE.DoubleSide, transparent: true });
  const grooveMaterial = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(book.color).multiplyScalar(0.42), roughness: 0.9, metalness: 0, bumpMap: clothBumpTexture, bumpScale: 0.006, side: THREE.DoubleSide, transparent: true });
  const pageMaterial = new THREE.MeshPhysicalMaterial({ color: 0xe7dfcf, map: paperFaceTexture, bumpMap: paperFaceTexture, bumpScale: 0.0014, roughness: 0.95, metalness: 0, sheen: 0.025, sheenRoughness: 1, transparent: true });
  const makeLeafMaterial = (texture) => new THREE.MeshPhysicalMaterial({ color: 0xeee6d7, map: texture, bumpMap: paperFaceTexture, bumpScale: 0.0012, roughness: 0.96, metalness: 0, sheen: 0.02, sheenRoughness: 1, side: THREE.FrontSide, transparent: true }); const interiorPageMaterials = interiorPageTextures.map(makeLeafMaterial); const blankPageMaterial = makeLeafMaterial(paperFaceTexture);
  const headbandMaterial = new THREE.MeshPhysicalMaterial({ color: 0xc6a66d, roughness: 0.58, metalness: 0.16, sheen: 0.14, sheenRoughness: 0.76, transparent: true }); const signatureMaterial = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0x8d816f).lerp(new THREE.Color(book.palette.paperPale), 0.34), roughness: 0.98, metalness: 0, transparent: true }); const ribbonMaterial = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(book.foil).lerp(new THREE.Color(book.color), 0.28), roughness: 0.62, metalness: 0.08, sheen: 0.36, sheenRoughness: 0.68, side: THREE.DoubleSide, transparent: true });
  const presentationSourceListeners = [];
  const presentationApplied = applyCompleteShelfPresentation({
    presentation,
    textures: { cover: coverTexture, coverFoil: foilTexture, spine: spineTexture, spineFoil: spineFoilTexture, back: backCoverTexture, backFoil: backFoilTexture, openingEndpaper: openingEndpaperTexture, frontEndpaper: frontEndpaperTexture, interiors: interiorPageTextures },
    materials: { cloth: [cloth], foil: [foilArt, spineFoilArt, backFoilArt, headbandMaterial], paper: [openingEndpaperMaterial, frontEndpaperMaterial, pageMaterial, ...interiorPageMaterials, blankPageMaterial], edge: [foreEdgeMaterial, headTailEdgeMaterial] },
    onDispose: (removeListener) => presentationSourceListeners.push(removeListener),
  });
  if (presentationApplied) {
    if (presentation.colours?.cloth) { grooveMaterial.color.set(new THREE.Color(presentation.colours.cloth).multiplyScalar(0.42)); ribbonMaterial.color.set(new THREE.Color(book.foil).lerp(new THREE.Color(presentation.colours.cloth), 0.28)); }
    root.userData.presentation = { tutorId: presentation.tutorId ?? null };
  }
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1); const planeGeometry = new THREE.PlaneGeometry(1, 1); const coverGeometry = new RoundedBoxGeometry(width, height, board, 2, coverRadius); const pageGeometry = createPageBlockGeometry(pageWidth, pageHeight, pageDepth, pageRadius); const coverSurfaceGeometry = createRoundedPlaneGeometry(width - 0.007, height - 0.007, 0.0035); const endpaperGeometry = createRoundedPlaneGeometry(width - 0.045, height - 0.045, 0.003);
  const pageBlock = createMesh(pageGeometry, pageMaterial, 'codex-page-block'); pageBlock.position.x = 0.018; motion.add(pageBlock);
  const backPivot = new THREE.Group(); backPivot.name = 'codex-back-cover-pivot'; backPivot.position.set(-width * 0.5, 0, -depth * 0.5 - board * 0.5); const backCover = createMesh(coverGeometry, cloth, 'codex-back-cover'); backCover.position.x = width * 0.5; backPivot.add(backCover); const backPlane = createMesh(coverSurfaceGeometry, backArt, 'codex-back-cover-art', false, false); backPlane.position.set(width * 0.5, 0, -board * 0.55); backPlane.rotation.y = Math.PI; backPivot.add(backPlane); const backFoilPlane = createMesh(coverSurfaceGeometry, backFoilArt, 'codex-back-foil-art', false, false); backFoilPlane.position.set(width * 0.5, 0, -board * 0.605); backFoilPlane.rotation.y = Math.PI; backPivot.add(backFoilPlane); const backEndpaper = createMesh(endpaperGeometry, openingEndpaperMaterial, 'codex-back-endpaper', false, true); backEndpaper.position.set(width * 0.5, 0, board * 0.515); backPivot.add(backEndpaper); addTurnIns(backPivot, book, 'back', width, height, board * 0.53, cloth, boxGeometry); const backGroove = createMesh(planeGeometry, grooveMaterial, 'codex-back-hinge-groove', false, false); backGroove.scale.set(0.012, height * 0.94, 1); backGroove.position.set(0.038, 0, -board * 0.535); backGroove.rotation.y = Math.PI; backPivot.add(backGroove); motion.add(backPivot);
  const frontPivot = new THREE.Group(); frontPivot.name = 'codex-front-cover-pivot'; frontPivot.position.set(-width * 0.5, 0, depth * 0.5 + board * 0.5); const frontCover = createMesh(coverGeometry, cloth, 'codex-front-cover'); frontCover.position.x = width * 0.5; frontPivot.add(frontCover); const coverPlane = createMesh(coverSurfaceGeometry, coverArt, 'codex-cover-art', false, false); coverPlane.position.set(width * 0.5, 0, board * 0.55); frontPivot.add(coverPlane); const foilPlane = createMesh(coverSurfaceGeometry, foilArt, 'codex-foil-art', false, false); foilPlane.position.set(width * 0.5, 0, board * 0.605); frontPivot.add(foilPlane); const frontEndpaper = createMesh(endpaperGeometry, frontEndpaperMaterial, 'codex-front-endpaper', false, true); frontEndpaper.position.set(width * 0.5, 0, -board * 0.515); frontEndpaper.rotation.y = Math.PI; frontPivot.add(frontEndpaper); addTurnIns(frontPivot, book, 'front', width, height, -board * 0.53, cloth, boxGeometry); const frontGroove = createMesh(planeGeometry, grooveMaterial, 'codex-front-hinge-groove', false, false); frontGroove.scale.set(0.012, height * 0.94, 1); frontGroove.position.set(0.038, 0, board * 0.655); frontPivot.add(frontGroove); motion.add(frontPivot);
  const pagePivots = [];
  for (let pageIndex = 0; pageIndex < 6; pageIndex += 1) {
    const leafOrder = 5 - pageIndex; const pivot = new THREE.Group(); pivot.name = `codex-page-${pageIndex}`; pivot.position.set(-width * 0.5 + spineWidth * 0.65, 0, pageDepth * 0.5 + 0.0015 + pageIndex * 0.0015); pivot.userData.restZ = pivot.position.z; pivot.userData.turnedZ = depth * 0.5 + board + 0.004 + leafOrder * 0.0015;
    const frontGeometry = new THREE.PlaneGeometry(1, 1, FLEXIBLE_PAGE_SEGMENTS, FLEXIBLE_PAGE_VERTICAL_SEGMENTS); const backGeometry = new THREE.PlaneGeometry(1, 1, FLEXIBLE_PAGE_SEGMENTS, FLEXIBLE_PAGE_VERTICAL_SEGMENTS); const visiblePageWidth = pageWidth - spineWidth * 0.42;
    const presentedLeafMaterial = presentationApplied && leafOrder < (presentation.sources?.interiors?.length ?? 0) ? interiorPageMaterials[leafOrder] : null;
    const frontPageMaterial = presentedLeafMaterial ?? (leafOrder < 4 ? interiorPageMaterials[leafOrder * 2] : blankPageMaterial); const backPageMaterial = presentedLeafMaterial ?? (leafOrder < 4 ? interiorPageMaterials[leafOrder * 2 + 1] : blankPageMaterial);
    const front = createMesh(frontGeometry, frontPageMaterial, `codex-page-sheet-${pageIndex}-front`, false, true); front.scale.set(visiblePageWidth, pageHeight - 0.014, 1); front.position.set(visiblePageWidth * 0.5, 0, 0.00022); pivot.add(front);
    const back = createMesh(backGeometry, backPageMaterial, `codex-page-sheet-${pageIndex}-back`, false, true); back.scale.set(visiblePageWidth, pageHeight - 0.014, 1); back.position.set(visiblePageWidth * 0.5, 0, -0.00022); back.rotation.y = Math.PI; pivot.add(back);
    pivot.userData.flex = { curve: 0, curveVelocity: 0, twist: 0, twistVelocity: 0, surfaces: [{ geometry: frontGeometry, position: frontGeometry.attributes.position, base: Float32Array.from(frontGeometry.attributes.position.array), direction: 1 }, { geometry: backGeometry, position: backGeometry.attributes.position, base: Float32Array.from(backGeometry.attributes.position.array), direction: -1 }] };
    motion.add(pivot); pagePivots.push(pivot);
  }
  const spineGeometry = new RoundedBoxGeometry(spineBoardThickness, height - 0.012, depth + board * 1.88, 1, spineRadius); const spine = createMesh(spineGeometry, spineArt, 'codex-flat-spine'); spine.position.x = -width * 0.5 - spineBoardThickness * 0.35; spine.userData.profile = 'flat'; motion.add(spine);
  const spineFoil = createMesh(planeGeometry, spineFoilArt, 'codex-spine-foil', false, false); spineFoil.scale.set(depth + board * 1.82, height - 0.018, 1); spineFoil.rotation.y = -Math.PI * 0.5; spineFoil.position.set(spine.position.x - spineBoardThickness * 0.505, 0, 0); motion.add(spineFoil);
  const spineLining = createMesh(new RoundedBoxGeometry(spineWidth * 0.68, height - 0.056, Math.max(0.045, pageDepth - 0.008), 1, 0.0015), frontEndpaperMaterial, 'codex-spine-lining'); spineLining.position.set(-width * 0.5 + spineWidth * 0.38, 0, 0); motion.add(spineLining);
  [-1, 1].forEach((direction) => { const headband = createMesh(new THREE.CylinderGeometry(0.012, 0.012, pageDepth * 0.88, 12), headbandMaterial, `codex-headband-${direction}`); headband.rotation.x = Math.PI * 0.5; headband.position.set(-pageWidth * 0.5 + 0.046, direction * (pageHeight * 0.5 - 0.004), 0); motion.add(headband); });
  const ribbon = createMesh(createRoundedPlaneGeometry(0.034, pageHeight * 0.76, 0.002), ribbonMaterial, 'codex-ribbon-bookmark', false, true); ribbon.position.set(-pageWidth * 0.5 + 0.09 + (book.seed % 3) * 0.018, -pageHeight * 0.17, pageDepth * 0.5 + 0.003); ribbon.rotation.z = (book.seed % 2 ? -1 : 1) * 0.014; motion.add(ribbon);
  for (let signatureIndex = 0; signatureIndex < 6; signatureIndex += 1) { const signature = createMesh(boxGeometry, signatureMaterial, `codex-page-signature-${signatureIndex + 1}`, false, true); signature.scale.set(0.0035, 0.00135, pageDepth * 0.91); signature.position.set(0.018 + pageWidth * 0.5 + 0.001, -pageHeight * 0.5 + ((signatureIndex + 1) / 7) * pageHeight, 0); motion.add(signature); }
  const foreEdge = createMesh(planeGeometry, foreEdgeMaterial, 'codex-fore-edge', false, true); foreEdge.scale.set(pageDepth * 0.94, pageHeight - 0.028, 1); foreEdge.rotation.y = Math.PI * 0.5; foreEdge.position.set(0.018 + pageWidth * 0.5 + 0.002, 0, 0); motion.add(foreEdge);
  [-1, 1].forEach((direction) => { const edge = createMesh(planeGeometry, headTailEdgeMaterial, `codex-${direction > 0 ? 'head' : 'tail'}-edge`, false, true); edge.scale.set(pageWidth - 0.035, pageDepth * 0.94, 1); edge.rotation.x = direction > 0 ? -Math.PI * 0.5 : Math.PI * 0.5; edge.position.set(0.018, direction * (pageHeight * 0.5 + 0.002), 0); motion.add(edge); });
  root.userData.construction = { board, coverRadius, pageRadius, spineRadius, spineBoardThickness, spineProfile: 'flat', spineFoilLayered: true, backSurfaceLayered: true, clothPbrMaps: true, foilEmbossed: true, interiorPageDesigns: interiorPageTextures.length, turnInStrips: 8, hingeGrooves: 2, spineLining: true, pageSignatures: pageGeometry.userData.pageSignatures, flexiblePageSegments: FLEXIBLE_PAGE_SEGMENTS, flexiblePageVerticalSegments: FLEXIBLE_PAGE_VERTICAL_SEGMENTS, pagePivots: pagePivots.length, pageStackOffsets: pagePivots.map((pivot) => pivot.userData.restZ) };
  root.userData.applyCoverAtlas = applyCoverAtlas;
  const state = {
    open: 0,
    openTarget: 0,
    settledPages: 0,
    pageTurnCommitted: false,
    pageDrag: { active: false, progress: 0, progressVelocity: 0, verticalBias: 0, direction: 0 },
  };
  const resetNeutralPageDrag = () => {
    state.pageDrag.active = false;
    state.pageDrag.progress = 0;
    state.pageDrag.progressVelocity = 0;
    state.pageDrag.verticalBias = 0;
    state.pageDrag.direction = 0;
  };
  const updatePaginatedBook = (delta) => {
    const amount = clamp(state.open, 0, 1); const speed = 10.5; const { pageDrag } = state;
    frontPivot.rotation.y = damp(frontPivot.rotation.y, (-Math.PI + 0.055) * amount, speed, delta);
    pagePivots.forEach((pivot, pageIndex) => {
      const leafOrder = pagePivots.length - 1 - pageIndex;
      let pageTarget = 0; let positionTarget = pivot.userData.restZ; let pageTwistTarget = 0; let dragCurveBoost = 0; let flexTwistTarget = 0;
      if (leafOrder < PAGINATED_LEAF_COUNT) {
        const isTurned = leafOrder < state.settledPages;
        const unturnedTarget = -0.038 + leafOrder * 0.008;
        const turnedTarget = -Math.PI + 0.085 + leafOrder * 0.014;
        pageTarget = isTurned ? turnedTarget : unturnedTarget;
        positionTarget = isTurned ? pivot.userData.turnedZ : pivot.userData.restZ;
        if (pageDrag.active && pageDrag.direction !== 0) {
          const dragLeafOrder = pageDrag.direction > 0 ? state.settledPages : state.settledPages - 1;
          if (leafOrder === dragLeafOrder) {
            const dragProgress = smoothstep(pageDrag.progress);
            const dragEnvelope = Math.sin(Math.PI * dragProgress);
            const speedResponse = clamp(Math.abs(pageDrag.progressVelocity) / 5.5, 0, 1);
            const signedSpeed = clamp(pageDrag.progressVelocity / 5.5, -1, 1);
            pageTarget = pageDrag.direction > 0 ? lerp(unturnedTarget, turnedTarget, dragProgress) : lerp(turnedTarget, unturnedTarget, dragProgress);
            positionTarget = pageDrag.direction > 0 ? lerp(pivot.userData.restZ, pivot.userData.turnedZ, dragProgress) : lerp(pivot.userData.turnedZ, pivot.userData.restZ, dragProgress);
            pageTwistTarget = pageDrag.direction * dragEnvelope * (0.014 + pageDrag.verticalBias * 0.026);
            dragCurveBoost = dragEnvelope * (0.032 + speedResponse * 0.064);
            flexTwistTarget = dragEnvelope * (pageDrag.verticalBias * 0.08 + signedSpeed * pageDrag.direction * 0.03);
          }
        }
        pivot.position.z = damp(pivot.position.z, pivot.userData.restZ + (positionTarget - pivot.userData.restZ) * amount, speed, delta);
      } else {
        pageTarget = -0.006 + (leafOrder - PAGINATED_LEAF_COUNT) * 0.003;
        pivot.position.z = damp(pivot.position.z, pivot.userData.restZ, speed, delta);
      }
      pivot.rotation.y = damp(pivot.rotation.y, pageTarget * amount, speed, delta);
      pivot.rotation.z = damp(pivot.rotation.z, pageTwistTarget * amount, speed, delta);
      const turnProgress = clamp(Math.abs(pivot.rotation.y) / Math.PI, 0, 1);
      const curveTarget = amount > 0 ? amount * (0.004 + Math.sin(Math.PI * turnProgress) * 0.082 + dragCurveBoost) : 0;
      updateFlexiblePage(pivot, curveTarget, delta, false, flexTwistTarget * amount);
    });
  };
  const isPageGeometrySettled = () => {
    const amount = clamp(state.open, 0, 1);
    return pagePivots.every((pivot, pageIndex) => {
      const leafOrder = pagePivots.length - 1 - pageIndex;
      const paginated = leafOrder < PAGINATED_LEAF_COUNT;
      const turned = paginated && leafOrder < state.settledPages;
      const pageTarget = paginated
        ? turned ? -Math.PI + 0.085 + leafOrder * 0.014 : -0.038 + leafOrder * 0.008
        : -0.006 + (leafOrder - PAGINATED_LEAF_COUNT) * 0.003;
      const positionTarget = turned ? pivot.userData.turnedZ : pivot.userData.restZ;
      const expectedRotation = pageTarget * amount;
      const expectedPosition = pivot.userData.restZ + (positionTarget - pivot.userData.restZ) * amount;
      const turnProgress = clamp(Math.abs(expectedRotation) / Math.PI, 0, 1);
      const expectedCurve = amount > 0 ? amount * (0.004 + Math.sin(Math.PI * turnProgress) * 0.082) : 0;
      const flex = pivot.userData.flex;
      return Math.abs(pivot.rotation.y - expectedRotation) <= PAGE_SETTLE_EPSILON
        && Math.abs(pivot.rotation.z) <= PAGE_SETTLE_EPSILON
        && Math.abs(pivot.position.z - expectedPosition) <= PAGE_SETTLE_EPSILON
        && Math.abs(flex.curve - expectedCurve) <= PAGE_SETTLE_EPSILON
        && Math.abs(flex.twist) <= PAGE_SETTLE_EPSILON
        && Math.abs(flex.curveVelocity) <= PAGE_SETTLE_EPSILON
        && Math.abs(flex.twistVelocity) <= PAGE_SETTLE_EPSILON;
    });
  };
  const controller = {
    open() { state.openTarget = 1; state.settledPages = 0; state.pageTurnCommitted = false; resetNeutralPageDrag(); return true; },
    close() { state.openTarget = 0; state.settledPages = 0; state.pageTurnCommitted = false; resetNeutralPageDrag(); return true; },
    setOpenProgress(progress) { state.open = state.openTarget = clamp(progress, 0, 1); if (state.openTarget === 0) { state.settledPages = 0; state.pageTurnCommitted = false; resetNeutralPageDrag(); } return true; },
    setPageTurnProgress(progress, direction = 1) {
      const nextProgress = clamp(progress, 0, 1);
      if (state.openTarget < 0.999) { resetNeutralPageDrag(); return false; }
      if (state.pageTurnCommitted && !isPageGeometrySettled()) return false;
      if (nextProgress === 0) { state.pageTurnCommitted = false; resetNeutralPageDrag(); return true; }
      const normalizedDirection = direction < 0 ? -1 : 1;
      const atBoundary = normalizedDirection > 0
        ? state.settledPages >= PAGINATED_LEAF_COUNT
        : state.settledPages <= 0;
      if (nextProgress > 0 && atBoundary) { resetNeutralPageDrag(); return false; }
      state.pageDrag.active = nextProgress > 0;
      state.pageDrag.progress = nextProgress;
      state.pageDrag.progressVelocity = 0;
      state.pageDrag.verticalBias = 0;
      state.pageDrag.direction = nextProgress > 0 ? normalizedDirection : 0;
      state.pageTurnCommitted = false;
      return true;
    },
    settlePage(direction = state.pageDrag.direction || 1) { if (state.openTarget < 0.999) return false; const normalizedDirection = direction < 0 ? -1 : 1; const nextSettledPages = clamp(state.settledPages + normalizedDirection, 0, PAGINATED_LEAF_COUNT); resetNeutralPageDrag(); if (nextSettledPages === state.settledPages) return false; state.settledPages = nextSettledPages; state.pageTurnCommitted = true; return true; },
    reset() { state.open = state.openTarget = 0; state.settledPages = 0; state.pageTurnCommitted = false; resetNeutralPageDrag(); frontPivot.rotation.y = 0; pagePivots.forEach((pivot) => { pivot.rotation.set(0, 0, 0); pivot.position.z = pivot.userData.restZ; updateFlexiblePage(pivot, 0, 0, true); }); return true; },
    update(delta = 0) { state.open = damp(state.open, state.openTarget, 10.5, delta); updatePaginatedBook(delta); },
    getSnapshot() {
      const flexiblePages = pagePivots.map((pivot) => ({ curve: pivot.userData.flex.curve, twist: pivot.userData.flex.twist, curveVelocity: pivot.userData.flex.curveVelocity, twistVelocity: pivot.userData.flex.twistVelocity }));
      return { rootUuid: root.uuid, rootName: root.name, openProgress: state.open, pageTurnProgress: state.pageDrag.active ? state.pageDrag.progress : 0, settledPages: state.settledPages, pagePivotCount: pagePivots.length, paginatedLeafCount: PAGINATED_LEAF_COUNT, pageSettled: state.pageTurnCommitted && isPageGeometrySettled(), flexiblePageSegments: FLEXIBLE_PAGE_SEGMENTS, flexiblePageVerticalSegments: FLEXIBLE_PAGE_VERTICAL_SEGMENTS, flexiblePages, deformationReset: flexiblePages.every(({ curve, twist, curveVelocity, twistVelocity }) => Math.abs(curve) < 0.00001 && Math.abs(twist) < 0.00001 && Math.abs(curveVelocity) < 0.00001 && Math.abs(twistVelocity) < 0.00001) };
    },
  };
  controller.reset();
  const dispose = () => { presentationSourceListeners.forEach((removeListener) => removeListener()); const geometries = new Set(); const materials = new Set(); const textures = new Set(trackedTextures); root.traverse((object) => { if (object.geometry) geometries.add(object.geometry); const source = object.material; (Array.isArray(source) ? source : [source]).forEach((material) => { if (!material) return; materials.add(material); Object.values(material).forEach((value) => { if (value?.isTexture) textures.add(value); }); }); }); geometries.forEach((geometry) => geometry.dispose()); materials.forEach((material) => material.dispose()); textures.forEach((texture) => texture.dispose()); };
  return { root, controller, dispose };
}
