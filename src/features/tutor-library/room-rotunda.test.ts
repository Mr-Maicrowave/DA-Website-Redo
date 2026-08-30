import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';

const roomPath = new URL('./RoomRotunda.tsx', import.meta.url);
const scenePath = new URL('./TutorLibraryScene.tsx', import.meta.url);
const libraryPath = new URL('./TutorLibrary.tsx', import.meta.url);

test('renders a data-driven Three.js room without fixed wall geometry', () => {
  assert.equal(existsSync(roomPath), true);
  assert.equal(existsSync(scenePath), true);
  const room = readFileSync(roomPath, 'utf8');
  const library = readFileSync(libraryPath, 'utf8');
  assert.match(room, /SUBJECT_WALLS\.map/);
  assert.match(room, /getWallAngle/);
  assert.doesNotMatch(room, /wall-0|wall-1|wall-2|wall-3/);
  assert.match(library, /<Canvas/);
});

test('does not treat leaving the canvas as leaving an active tutor book', () => {
  const library = readFileSync(libraryPath, 'utf8');

  assert.doesNotMatch(library, /<Canvas[^>]*onPointerLeave=/);
});

test('keeps continuous tutor-library motion inside the canvas rather than React state', () => {
  const library = readFileSync(libraryPath, 'utf8');
  const scene = readFileSync(scenePath, 'utf8');

  assert.doesNotMatch(library, /setTurnProgress\(/);
  assert.doesNotMatch(library, /setBookMotionProgress\(/);
  assert.match(scene, /useFrame/);
});

test('keeps a branded HTML loading surface visible until the first WebGL frame is ready', () => {
  const library = readFileSync(libraryPath, 'utf8');

  assert.match(library, /const \[canvasReady, setCanvasReady\] = useState\(false\)/);
  assert.match(library, /tutor-library__loading/);
  assert.match(library, /onCreated=\{\(\) => requestAnimationFrame\(\(\) => setCanvasReady\(true\)\)\}/);
});

test('keeps adjoining shelf corners while culling the wall opposite the viewer', () => {
  const room = readFileSync(roomPath, 'utf8');

  assert.match(room, /function isTutorLibraryWallVisible/);
  assert.match(room, /distanceFromActive <= 1/);
  assert.match(room, /visible=\{isTutorLibraryWallVisible\(index, fromWallIndex, toWallIndex, phase\)\}/);
  assert.match(room, /<WallShelves key=\{wall\.id\} visible=/);
});

test('uses lightweight material variation and layered mouldings for architectural fidelity', () => {
  const source = readFileSync(new URL('./RoomRotunda.tsx', import.meta.url), 'utf8');

  assert.match(source, /DataTexture/);
  assert.match(source, /CabinetMoulding/);
  assert.match(source, /nosingDepth/);
});

test('fills quiet shelf gaps with one batched non-interactive decorative book layer', () => {
  const room = readFileSync(new URL('./RoomRotunda.tsx', import.meta.url), 'utf8');
  assert.match(room, /function DecorativeShelfBooks/);
  assert.match(room, /<instancedMesh ref=\{mesh\}/);
  assert.match(room, /<DecorativeShelfBooks cabinet=\{cabinet\} wallId=\{wall\.id\} \/>/);
});

test('keeps rendered wall labels self-contained for offline production capture', () => {
  const source = readFileSync(new URL('./RoomRotunda.tsx', import.meta.url), 'utf8');

  assert.match(source, /<Text[^>]*font="\/fonts\/da-prologue-marcellus-sc-400\.ttf"/);
});
