import assert from "node:assert/strict";
import test from "node:test";

import { subjectContinueLabel } from "./subjectJourney.ts";
import { subjectsForStage } from "../config/subjects.ts";

test("subject CTA reflects the multi-select count", () => {
  assert.equal(subjectContinueLabel(1), "Continue with 1 subject →");
  assert.equal(subjectContinueLabel(3), "Continue with 3 subjects →");
});

test("journey uses the confirmed project subject availability", () => {
  assert.deepEqual(subjectsForStage("primary"), ["english", "maths"]);
  assert.ok(subjectsForStage("high-school").includes("physics"));
  assert.deepEqual(subjectsForStage("hsc"), ["english", "maths", "physics", "chemistry", "biology", "business-studies", "legal-studies"]);
});
