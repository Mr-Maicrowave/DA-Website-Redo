import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';

const roomPath = new URL('./RoomRotunda.tsx', import.meta.url);
const scenePath = new URL('./TutorLibraryScene.tsx', import.meta.url);
const libraryPath = new URL('./TutorLibrary.tsx', import.meta.url);
const loadingPath = new URL('./TutorLibraryLoadingSurface.tsx', import.meta.url);

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

test('keeps a branded loading surface until the first frame and visible shelf assets are ready', () => {
  const library = readFileSync(libraryPath, 'utf8');
  const loading = readFileSync(loadingPath, 'utf8');
  const scene = readFileSync(scenePath, 'utf8');

  assert.match(library, /const \[roomReady, setRoomReady\] = useState\(false\)/);
  assert.match(library, /const \[firstShelfReady, setFirstShelfReady\] = useState\(false\)/);
  assert.match(library, /warmTutorLibraryFirstShelf\(\)/);
  assert.match(library, /isTutorLibraryRevealReady/);
  assert.match(library, /TutorLibraryLoadingSurface/);
  assert.match(loading, /tutor-library__loading/);
  assert.match(loading, /tutor-library__loading--departing/);
  assert.match(library, /tutor-library__canvas--ready/);
  assert.match(library, /onRoomReady=\{\(\) => \{ setRoomReady\(true\)/);
  assert.match(scene, /function RoomReadySignal/);
  assert.match(scene, /requestAnimationFrame\(\(\) => onRoomReady\(\)\)/);
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
  assert.match(source, /createWalnutGrainPixels\(128\)/);
  assert.doesNotMatch(source, /const size = 32/);
  assert.match(source, /CabinetMoulding/);
  assert.match(source, /nosingDepth/);
});

test('renders only real tutor books in every shelf state', () => {
  const room = readFileSync(new URL('./RoomRotunda.tsx', import.meta.url), 'utf8');
  assert.match(room, /<TutorShelf editions=\{spotlightEditions \?\? \(EDITIONS_BY_WALL\.get\(wall\.id\) \?\? \[\]\)\}/);
  assert.doesNotMatch(room, /DecorativeShelfBooks|DECORATIVE_BOOK_/);
});

test('batches the non-interactive floor boards into a single colour-varied mesh', () => {
  const room = readFileSync(new URL('./RoomRotunda.tsx', import.meta.url), 'utf8');

  assert.match(room, /function FloorBoards/);
  assert.match(room, /target\.setColorAt\(index, new Color\(board\.tone\)\)/);
  assert.match(room, /<FloorBoards \/>/);
});

test('keeps rendered wall labels self-contained for offline production capture', () => {
  const source = readFileSync(new URL('./RoomRotunda.tsx', import.meta.url), 'utf8');

  assert.match(source, /<Text[^>]*font="\/fonts\/da-prologue-marcellus-sc-400\.ttf"/);
});
