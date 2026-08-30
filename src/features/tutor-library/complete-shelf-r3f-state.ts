export const COMPLETE_SHELF_EVIDENCE_STATES = [
  "closed-three-quarter",
  "half-open",
  "fully-open",
  "page-50",
  "settled-page",
  "closed-reset",
] as const;

export type CompleteShelfEvidenceState = typeof COMPLETE_SHELF_EVIDENCE_STATES[number];

export interface CompleteShelfRigController {
  reset(): boolean;
  open(): boolean;
  close(): boolean;
  setOpenProgress(value: number): boolean;
  setPageTurnProgress(value: number, direction?: -1 | 1): boolean;
  settlePage(direction?: -1 | 1): boolean;
  update(delta: number): void;
  getSnapshot(): {
    rootUuid: string;
    openProgress: number;
    pageTurnProgress: number;
    settledPages: number;
    pagePivotCount: number;
    paginatedLeafCount: number;
    pageSettled: boolean;
    deformationReset: boolean;
  };
}

const DESKTOP_CAMERA = {
  closed: [2.35, 1.48, 3.65],
  open: [0, 2.45, 3.55],
} as const;

const NARROW_CAMERA = {
  closed: [1.9, 1.5, 6.9],
  open: [0, 2.3, 8.8],
} as const;

export function getCompleteShelfCameraPose(
  state: CompleteShelfEvidenceState,
  narrow: boolean,
): readonly [number, number, number] {
  const poses = narrow ? NARROW_CAMERA : DESKTOP_CAMERA;
  return state === "closed-three-quarter" || state === "closed-reset" ? poses.closed : poses.open;
}

export function applyCompleteShelfEvidenceState(
  controller: CompleteShelfRigController,
  state: CompleteShelfEvidenceState,
  settlingFrames = 110,
) {
  controller.reset();
  const settle = () => {
    for (let frame = 0; frame < settlingFrames; frame += 1) controller.update(1 / 60);
  };

  if (state === "closed-reset") {
    controller.open();
    settle();
    controller.setPageTurnProgress(0.5);
    settle();
    controller.close();
    settle();
    return controller.getSnapshot?.();
  }

  if (state === "half-open") controller.setOpenProgress(0.5);
  if (state === "fully-open") controller.setOpenProgress(1);
  if (state === "page-50") {
    controller.setOpenProgress(1);
    controller.setPageTurnProgress(0.5);
  }
  if (state === "settled-page") {
    controller.setOpenProgress(1);
    controller.settlePage();
  }

  if (state !== "closed-three-quarter") settle();

  return controller.getSnapshot?.();
}
