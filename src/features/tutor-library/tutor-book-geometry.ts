import type { TutorBookEdition } from './tutor-library-data';
import { createCabinetBlueprint } from './room-architecture.ts';

export type BookPart = { width: number; height: number; depth: number };

export type TutorBookParts = {
  frontBoard: BookPart;
  backBoard: BookPart;
  pageBlock: BookPart;
  spine: BookPart;
  boardRadius: number;
  jointWidth: number;
  pageInsetX: number;
  pageInsetY: number;
};

export type ShelfPose = {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  depth: number;
};

export type BookVisualProfile = {
  width: number;
  height: number;
  depth: number;
  lean: number;
  clothTone: number;
  goldRuleOffset: number;
  pageTone: number;
};

const WALL_WIDTH = 16.45;
const ROOM_HEIGHT = 5.8;
const BAY_SLOT_RHYTHM = [
  [-.34, -.06, .23],
  [-.18, .16],
  [-.27, .03, .32],
] as const;

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 0xffffffff;
}

export function getBookVisualProfile(edition: TutorBookEdition): BookVisualProfile {
  const seed = `${edition.tutorId}:${edition.wallId}:${edition.materialVariant}`;
  const a = stableHash(`${seed}:a`);
  const b = stableHash(`${seed}:b`);
  const c = stableHash(`${seed}:c`);
  return {
    width: .36 + a * .16,
    height: .76 + b * .18,
    depth: .285 + c * .055,
    lean: (stableHash(`${seed}:lean`) - .5) * .072,
    clothTone: Math.floor(stableHash(`${seed}:cloth`) * 4),
    goldRuleOffset: .13 + stableHash(`${seed}:foil`) * .16,
    pageTone: Math.floor(stableHash(`${seed}:paper`) * 3),
  };
}

export function createBookParts(width = .42, height = .84, depth = .31): TutorBookParts {
  const boardThickness = width * .04;
  const pageInsetX = width * .036;
  const pageInsetY = height * .024;
  const jointWidth = boardThickness * .27;
  return {
    frontBoard: { width, height, depth: boardThickness },
    backBoard: { width, height, depth: boardThickness },
    pageBlock: { width: width - pageInsetX * 2, height: height - pageInsetY * 2, depth: Math.max(.12, depth - boardThickness * 2 - jointWidth * 2) },
    spine: { width: width * .09, height: height - boardThickness * .4, depth: depth - boardThickness * .35 },
    boardRadius: boardThickness * .12,
    jointWidth,
    pageInsetX,
    pageInsetY,
  };
}

export function getShelfPose(edition: TutorBookEdition): ShelfPose {
  const cabinet = createCabinetBlueprint(WALL_WIDTH, ROOM_HEIGHT);
  const row = Math.min(edition.shelfIndex, cabinet.shelfLevels.length - 2);
  const profile = getBookVisualProfile(edition);
  const slot = edition.slotIndex % 8;
  const bayIndex = slot < 3 ? 0 : slot < 5 ? 1 : 2;
  const localSlot = slot - (bayIndex === 0 ? 0 : bayIndex === 1 ? 3 : 5);
  const bay = cabinet.bays[bayIndex];
  const x = bay.centerX + BAY_SLOT_RHYTHM[bayIndex][localSlot] * bay.width;
  const shelfY = cabinet.shelfLevels[row] + cabinet.shelfThickness / 2;

  return {
    position: [x, shelfY + profile.height / 2, cabinet.bays[bayIndex].bookFrontZ - profile.depth / 2 - .045],
    rotation: [0, Math.PI / 2, profile.lean],
    width: profile.width,
    height: profile.height,
    depth: profile.depth,
  };
}
