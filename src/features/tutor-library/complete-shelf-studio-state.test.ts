import assert from "node:assert/strict";
import test from "node:test";

import { applyCompleteShelfStudioState, getCompleteShelfStudioEngine } from "./complete-shelf-studio-state.ts";
import type { CompleteShelfRigController } from "./complete-shelf-r3f-state.ts";

test("uses the imperative rig only for an active Jenny studio engine query", () => {
  assert.equal(getCompleteShelfStudioEngine("presentation=jenny", "closed-front"), "imperative");
  assert.equal(getCompleteShelfStudioEngine("presentation=jenny", undefined), "legacy");
  assert.equal(getCompleteShelfStudioEngine("presentation=unknown", "closed-front"), "legacy");
  assert.equal(getCompleteShelfStudioEngine("", "page-turning"), "legacy");
});

test("maps studio page states to the existing imperative controller without a parallel physics model", () => {
  const calls: string[] = [];
  const controller = {
    reset: () => { calls.push("reset"); return true; },
    open: () => { calls.push("open"); return true; },
    close: () => { calls.push("close"); return true; },
    setOpenProgress: (value: number) => { calls.push(`open:${value}`); return true; },
    setPageTurnProgress: (value: number) => { calls.push(`page:${value}`); return true; },
    settlePage: () => { calls.push("settle"); return true; },
    update: () => { calls.push("update"); },
    getSnapshot: () => ({ rootUuid: "one", openProgress: 0, pageTurnProgress: 0, settledPages: 0, pagePivotCount: 6, paginatedLeafCount: 4, pageSettled: false, deformationReset: true }),
  } as CompleteShelfRigController;

  applyCompleteShelfStudioState(controller, "page-turn-75");

  assert.deepEqual(calls, ["reset", "open:1", "page:0.75", "update"]);
});
