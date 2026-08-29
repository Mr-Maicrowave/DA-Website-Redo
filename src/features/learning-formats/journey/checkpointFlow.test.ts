import assert from "node:assert/strict";
import test from "node:test";

import { getCheckpointResumeIndex, getPreviousCheckpointIndex } from "./checkpointFlow.ts";
import { applyStage } from "../state/transitions.ts";

test("resumes at the first unanswered checkpoint", () => {
  assert.equal(getCheckpointResumeIndex(["q1", "q2", "q3", "q4"], { q1: "a", q2: "b" }), 2);
});

test("resumes at the result destination when all checkpoints are answered", () => {
  assert.equal(getCheckpointResumeIndex(["q1", "q2", "q3", "q4"], { q1: "a", q2: "b", q3: "c", q4: "d" }), 4);
});

test("back from the result returns to question four", () => {
  assert.equal(getPreviousCheckpointIndex(4), 3);
});

test("back from the first question remains at the first question", () => {
  assert.equal(getPreviousCheckpointIndex(0), 0);
});

test("changing route stage clears incompatible checkpoint answers", () => {
  const state = { year: null, stage: "primary" as const, answers: { q1: "a" }, selectedSubjects: [], subjectAnswers: {} };
  assert.deepEqual(applyStage(state, "hsc"), { ...state, stage: "hsc", answers: {}, subjectAnswers: {} });
});
