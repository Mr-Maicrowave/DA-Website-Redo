export type CameraBeat = {
  readonly index: number;
  readonly backgroundIndex: number;
  readonly scale: number;
  readonly xPercent: number;
  readonly yPercent: number;
  readonly exposure: number;
};

export type ForegroundAsset = {
  readonly id: string;
  readonly src: string;
  readonly zone: "midground" | "foreground";
};

const ASSET_ROOT = "/assets/hsc/sunflower";

export const SUNFLOWER_BACKGROUNDS = [
  `${ASSET_ROOT}/backgrounds/sunflower-bg-01-opening.webp`,
  `${ASSET_ROOT}/backgrounds/sunflower-bg-02-approaching.webp`,
  `${ASSET_ROOT}/backgrounds/sunflower-bg-03-entering.webp`,
  `${ASSET_ROOT}/backgrounds/sunflower-bg-04-inside.webp`,
  `${ASSET_ROOT}/backgrounds/sunflower-bg-05-dense.webp`,
  `${ASSET_ROOT}/backgrounds/sunflower-bg-06-deepest.webp`,
  `${ASSET_ROOT}/backgrounds/sunflower-bg-07-light-returns.webp`,
  `${ASSET_ROOT}/backgrounds/sunflower-bg-08-opening.webp`,
  `${ASSET_ROOT}/backgrounds/sunflower-bg-09-rising.webp`,
  `${ASSET_ROOT}/backgrounds/sunflower-bg-10-horizon.webp`,
] as const;

export const SUNFLOWER_FOREGROUNDS: readonly ForegroundAsset[] = [
  { id: "tall-front", src: `${ASSET_ROOT}/foreground/sunflower-fg-01-tall-front.png`, zone: "midground" },
  { id: "tall-left", src: `${ASSET_ROOT}/foreground/sunflower-fg-02-tall-left.png`, zone: "midground" },
  { id: "tall-right", src: `${ASSET_ROOT}/foreground/sunflower-fg-03-tall-right.png`, zone: "midground" },
  { id: "medium", src: `${ASSET_ROOT}/foreground/sunflower-fg-04-medium.png`, zone: "midground" },
  { id: "small", src: `${ASSET_ROOT}/foreground/sunflower-fg-05-small.png`, zone: "midground" },
  { id: "cluster-three", src: `${ASSET_ROOT}/foreground/sunflower-fg-06-cluster-three.png`, zone: "midground" },
  { id: "cluster-five", src: `${ASSET_ROOT}/foreground/sunflower-fg-07-cluster-five.png`, zone: "foreground" },
  { id: "leafy-stem", src: `${ASSET_ROOT}/foreground/sunflower-fg-08-leafy-stem.png`, zone: "midground" },
  { id: "leaves", src: `${ASSET_ROOT}/foreground/sunflower-fg-09-leaves.png`, zone: "foreground" },
  { id: "close-right", src: `${ASSET_ROOT}/foreground/sunflower-fg-10-close-right.png`, zone: "foreground" },
  { id: "close-left", src: `${ASSET_ROOT}/foreground/sunflower-fg-11-close-left.png`, zone: "foreground" },
  { id: "bottom-leaves", src: `${ASSET_ROOT}/foreground/sunflower-fg-12-bottom-leaves.png`, zone: "foreground" },
] as const;

const CAMERA_STATES = [
  [0, 1.03, 0, -2, 1], [0, 1.07, -1, 0, 0.98],
  [1, 1.09, 1, 2, 0.96], [1, 1.13, -2, 4, 0.94],
  [2, 1.15, 2, 5, 0.91], [2, 1.18, -2, 7, 0.89],
  [3, 1.2, 1, 8, 0.87], [3, 1.23, -2, 10, 0.85],
  [4, 1.25, 2, 11, 0.82], [4, 1.28, -1, 12, 0.8],
  [5, 1.3, 1, 13, 0.78], [5, 1.32, 0, 14, 0.77],
  [6, 1.24, -1, 10, 0.82], [6, 1.18, 1, 7, 0.87],
  [7, 1.14, -1, 3, 0.92], [7, 1.1, 1, 0, 0.96],
  [8, 1.07, 0, -2, 0.99], [8, 1.04, -1, -4, 1.02],
  [9, 1.02, 1, -6, 1.04], [9, 1, 0, -8, 1.06],
] as const;

export const CAMERA_BEATS: readonly CameraBeat[] = Array.from({ length: 20 }, (_, index) => {
  const [backgroundIndex, scale, xPercent, yPercent, exposure] = CAMERA_STATES[index];
  return { index: index + 1, backgroundIndex, scale, xPercent, yPercent, exposure };
});

