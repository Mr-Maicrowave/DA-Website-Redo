export type BookIntroSceneCalibration = {
  src: string;
  scale: number;
  x: number;
  y: number;
  objectPositionX: number;
  objectPositionY: number;
};

export const BOOK_INTRO_SCENE_CALIBRATION = {
  closed: {
    src: '/book-theme/closed-book.png',
    scale: 1,
    x: 0,
    y: 0,
    objectPositionX: 50,
    objectPositionY: 50,
  },
  prologue: {
    src: '/book-theme/prologue-book.png',
    scale: 1.11,
    x: 0,
    y: 4,
    objectPositionX: 50,
    objectPositionY: 51,
  },
  paper: {
    src: '/book-theme/paper-texture.png',
    scale: 1,
    x: 0,
    y: 0,
    objectPositionX: 50,
    objectPositionY: 50,
  },
} as const satisfies Record<string, BookIntroSceneCalibration>;

export const BOOK_INTRO_OPENING_SCENES = [
  BOOK_INTRO_SCENE_CALIBRATION.closed,
  BOOK_INTRO_SCENE_CALIBRATION.prologue,
] as const;

export const BOOK_INTRO_CALIBRATION_PAIRS = [
  { id: 'closed-to-prologue', reference: 'closed', calibrated: 'prologue' },
  { id: 'prologue-to-paper', reference: 'prologue', calibrated: 'paper' },
] as const;
