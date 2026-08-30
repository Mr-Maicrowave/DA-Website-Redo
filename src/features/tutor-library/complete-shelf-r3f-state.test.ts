import assert from "node:assert/strict";
import test from "node:test";

import {
  applyCompleteShelfEvidenceState,
  getCompleteShelfCameraPose,
  type CompleteShelfRigController,
} from "./complete-shelf-r3f-state.ts";
import { selectCompleteShelfR3FBridgePresentation } from "./complete-shelf-r3f-presentation.ts";

function createControllerRecorder() {
  const calls: string[] = [];
  const controller = {
    reset: () => { calls.push("reset"); return true; },
    open: () => { calls.push("open"); return true; },
    close: () => { calls.push("close"); return true; },
    setOpenProgress: (value: number) => { calls.push(`open:${value}`); return true; },
    setPageTurnProgress: (value: number) => { calls.push(`page:${value}`); return true; },
    settlePage: () => { calls.push("settle-page"); return true; },
    update: () => { calls.push("update"); },
  } as unknown as CompleteShelfRigController;

  return { calls, controller };
}

test("half-open evidence uses the approved controller and settles the existing rig", () => {
  const { calls, controller } = createControllerRecorder();

  applyCompleteShelfEvidenceState(controller, "half-open", 2);

  assert.deepEqual(calls, ["reset", "open:0.5", "update", "update"]);
});

test("page-turn and settled evidence never construct a replacement rig state", () => {
  const pageTurn = createControllerRecorder();
  applyCompleteShelfEvidenceState(pageTurn.controller, "page-50", 1);
  assert.deepEqual(pageTurn.calls, ["reset", "open:1", "page:0.5", "update"]);

  const settled = createControllerRecorder();
  applyCompleteShelfEvidenceState(settled.controller, "settled-page", 1);
  assert.deepEqual(settled.calls, ["reset", "open:1", "settle-page", "update"]);
});

test("closed/reset evidence returns the same controller to its neutral state", () => {
  const closed = createControllerRecorder();
  applyCompleteShelfEvidenceState(closed.controller, "closed-three-quarter", 3);
  assert.deepEqual(closed.calls, ["reset"]);

  const closedReset = createControllerRecorder();
  applyCompleteShelfEvidenceState(closedReset.controller, "closed-reset", 1);
  assert.deepEqual(closedReset.calls, [
    "reset",
    "open",
    "update",
    "page:0.5",
    "update",
    "close",
    "update",
  ]);
});

test("camera framing matches the standalone host at desktop and narrow widths", () => {
  assert.deepEqual(getCompleteShelfCameraPose("closed-three-quarter", false), [2.35, 1.48, 3.65]);
  assert.deepEqual(getCompleteShelfCameraPose("page-50", false), [0, 2.45, 3.55]);
  assert.deepEqual(getCompleteShelfCameraPose("closed-three-quarter", true), [1.9, 1.5, 6.9]);
  assert.deepEqual(getCompleteShelfCameraPose("fully-open", true), [0, 2.3, 8.8]);
  assert.deepEqual(getCompleteShelfCameraPose("closed-reset", true), [1.9, 1.5, 6.9]);
});

test("R3F URL query selects canonical Jenny presentation for the imperative bridge", () => {
  const jenny = selectCompleteShelfR3FBridgePresentation("?state=fully-open&presentation=jenny");

  assert.equal(jenny?.tutorId, "T003");
  assert.equal(typeof jenny?.createCanvasSources, "function");
  assert.equal(selectCompleteShelfR3FBridgePresentation("?presentation=unknown"), undefined);
  assert.equal(selectCompleteShelfR3FBridgePresentation("?state=fully-open"), undefined);
});
