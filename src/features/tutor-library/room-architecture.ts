export type CabinetBay = {
  centerX: number;
  width: number;
  bookBackZ: number;
  bookFrontZ: number;
};

export type CabinetBlueprint = {
  backPanelZ: number;
  recessDepth: number;
  shelfDepth: number;
  shelfThickness: number;
  nosingDepth: number;
  panelInset: number;
  corniceDepth: number;
  plinthHeight: number;
  frameDepth: number;
  frameThickness: number;
  bayHeight: number;
  shelfLevels: number[];
  bays: CabinetBay[];
};

export function createCabinetBlueprint(width: number, height: number): CabinetBlueprint {
  const frameThickness = 0.26;
  const recessDepth = 0.68;
  const shelfDepth = 0.86;
  const shelfThickness = 0.14;
  const frameDepth = 0.98;
  const nosingDepth = 0.085;
  const panelInset = 0.075;
  const corniceDepth = 1.16;
  const plinthHeight = 0.32;
  const usableWidth = width - frameThickness * 4;
  const bayWidth = usableWidth / 3;

  return {
    backPanelZ: -0.08,
    recessDepth,
    shelfDepth,
    shelfThickness,
    nosingDepth,
    panelInset,
    corniceDepth,
    plinthHeight,
    frameDepth,
    frameThickness,
    bayHeight: (height - 1.2) / 3,
    shelfLevels: [-height / 2 + 0.48, -height / 6, height / 6, height / 2 - 0.48],
    bays: Array.from({ length: 3 }, (_, index) => ({
      centerX: -usableWidth / 2 + bayWidth * (index + 0.5),
      width: bayWidth - frameThickness,
      bookBackZ: 0.08,
      bookFrontZ: 0.54,
    })),
  };
}

export function getSubjectWallLabelPose(cabinet: CabinetBlueprint, height: number): [number, number, number] {
  return [0, height / 2 - .54, .45 + cabinet.corniceDepth + .035];
}
