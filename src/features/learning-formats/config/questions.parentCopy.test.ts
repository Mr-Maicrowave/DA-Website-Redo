import assert from "node:assert/strict";
import test from "node:test";

import { ASSESSMENT_QUESTIONS } from "./questions.ts";
import { calculateEnvironment } from "../logic/calculateEnvironment.ts";
import { emptySignals } from "../logic/calculateSignals.ts";

test("uses the supplied observable-behaviour question copy", () => {
  assert.equal(ASSESSMENT_QUESTIONS.primary[0].question, "When schoolwork becomes difficult, what usually happens?");
  assert.equal(ASSESSMENT_QUESTIONS["high-school"][0].question, "When they receive a result they're unhappy with, what tends to happen?");
  assert.equal(ASSESSMENT_QUESTIONS.hsc[0].question, "Where does the pressure feel greatest right now?");
});

test("every option retains at least one parent-facing assessment tag", () => {
  for (const questions of Object.values(ASSESSMENT_QUESTIONS)) {
    for (const question of questions) {
      for (const option of question.options) assert.ok(option.tags?.length, `${question.stage} ${question.slot} ${option.id}`);
    }
  }
});

test("a small weighted score gap is treated as a close recommendation", () => {
  const signals = emptySignals();
  signals.privateScore = 5;
  signals.classScore = 4;
  assert.equal(calculateEnvironment(signals).close, true);
});
