import assert from "node:assert/strict";
import test from "node:test";

import { buildJourneyStartingPoint } from "./buildJourneyStartingPoint.ts";
import type { AssessmentState } from "./types.ts";

const state = (stage: AssessmentState["stage"], answers: AssessmentState["answers"]): AssessmentState => ({ year:null, stage, answers, selectedSubjects:[], subjectAnswers:{} });

test("builds private guidance from the selected behavioural tags", () => {
  const result = buildJourneyStartingPoint(state("primary", { q1:"a", q2:"a", q3:"b", q4:"b" }));
  assert.equal(result?.outcome, "private");
  assert.equal(result?.label, "PRIVATE LEARNING");
  assert.ok(result?.reasons.some((reason) => reason.includes("gaps identified")));
  assert.ok(result?.reasons.length && result.reasons.length <= 3);
});

test("builds class guidance from independence and challenge tags", () => {
  const result = buildJourneyStartingPoint(state("high-school", { q1:"c", q2:"d", q3:"d", q4:"c" }));
  assert.equal(result?.outcome, "class");
  assert.ok(result?.reasons.some((reason) => reason.includes("independently")));
});

test("labels a close score as both environments", () => {
  const result = buildJourneyStartingPoint(state("hsc", { q1:"a", q2:"c", q3:"b", q4:"c" }));
  assert.equal(result?.outcome, "both");
  assert.equal(result?.label, "BOTH COULD WORK");
});
