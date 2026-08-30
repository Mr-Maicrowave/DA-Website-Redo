/**
 * CHARACTER JOURNEY — path geometry
 * =================================
 *
 * Three REAL SVG motion paths that share one junction point. The character is
 * animated along these with GSAP MotionPathPlugin — never with a bare
 * translateX. Edit the `d` strings / checkpoint coords here; nothing else in
 * the journey hard-codes coordinates.
 *
 *                            PRIMARY  (sage, curves gently up)
 *                        .--------- o  o  o  o
 *   INTRO --------------[junction]-- o  o  o  o   HIGH SCHOOL (dusty blue, centred)
 *                        '--------- o  o  o  o   HSC (muted violet, curves gently down)
 *
 *   Before the junction the character just walks a straight line (that space
 *   can later host the Private/Class + lesson-process explanation). At the
 *   junction it stops and the year question appears.
 */

import type { LearningStage } from "../logic/types";

export const JOURNEY_VIEWBOX = { width: 1600, height: 620 } as const;

/** Where all three branches begin — the character stops here to choose. */
export const JUNCTION = { x: 500, y: 310 } as const;

/**
 * The opening road enters at the lower-left edge, then rises gently into the
 * junction. This keeps the road visually continuous between the pinned
 * opening scene and the year split instead of starting a second line.
 */
export const INTRO_PATH = `M 0 606 C 155 606 245 310 ${JUNCTION.x} ${JUNCTION.y}`;

interface BranchGeometry {
  stage: LearningStage;
  label: string;
  /** Full branch path, starting at the junction. */
  d: string;
  /** Y of the (mostly horizontal) run where checkpoints sit. */
  runY: number;
  /** Four checkpoint anchor points along the branch. */
  checkpoints: { x: number; y: number }[];
}

const CHECKPOINT_X = [820, 1000, 1180, 1360];

function checkpoints(runY: number) {
  return CHECKPOINT_X.map((x) => ({ x, y: runY }));
}

export const BRANCHES: Record<LearningStage, BranchGeometry> = {
  primary: {
    stage: "primary",
    label: "Years 1–6",
    // gentle rise from the junction, then a level run
    d: `M ${JUNCTION.x} ${JUNCTION.y} C 572 310 606 176 700 172 L 1560 172`,
    runY: 172,
    checkpoints: checkpoints(172),
  },
  "high-school": {
    stage: "high-school",
    label: "Years 7–10",
    // stays approximately centred
    d: `M ${JUNCTION.x} ${JUNCTION.y} C 590 310 612 307 700 306 L 1560 306`,
    runY: 306,
    checkpoints: checkpoints(306),
  },
  hsc: {
    stage: "hsc",
    label: "Years 11–12",
    // gentle descent from the junction, then a level run
    d: `M ${JUNCTION.x} ${JUNCTION.y} C 572 310 606 448 700 452 L 1560 452`,
    runY: 452,
    checkpoints: checkpoints(452),
  },
};

export const STAGES: LearningStage[] = ["primary", "high-school", "hsc"];

/** Maps a grouped junction choice to the assessment stage. */
export function stageFromChoice(choice: LearningStage): LearningStage {
  return choice;
}

/**
 * Length-fraction (0–1) of `path` nearest to (x, y). Used to stop the
 * character exactly on a checkpoint regardless of the curve shape.
 * Works in any SVG whose element exposes getPointAtLength / getTotalLength.
 */
export function fractionAtPoint(
  path: SVGPathElement,
  x: number,
  y: number,
  samples = 480,
): number {
  const total = path.getTotalLength();
  if (!total) return 0;
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i <= samples; i += 1) {
    const len = (i / samples) * total;
    const p = path.getPointAtLength(len);
    const dist = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = len / total;
    }
  }
  return best;
}
