import assert from "node:assert/strict";
import test from "node:test";

import {
  answerObservations,
  combinationCopy,
  directionConfig,
  environmentConfig,
  ENVIRONMENT_TIE_PRIORITY,
  SECONDARY_ENVIRONMENT_MAX_GAP,
} from "./recommendationConfig.ts";
import { isCompleteAssessment } from "./recommendationTypes.ts";
import { initialAssessmentAnswers } from "./assessmentTypes.ts";
import { calculateLearningRecommendation } from "./recommendationScoring.ts";

test("recommendation configuration covers both dimensions and all combinations", () => {
  assert.deepEqual(Object.keys(environmentConfig), ["private", "small-group", "class"]);
  assert.deepEqual(Object.keys(directionConfig), ["foundation", "core", "accelerated"]);
  assert.equal(Object.keys(combinationCopy).length, 9);
  assert.equal(SECONDARY_ENVIRONMENT_MAX_GAP, 2);
  assert.deepEqual(ENVIRONMENT_TIE_PRIORITY, ["small-group", "private", "class"]);
});

test("every assessment answer has a parent-facing observation", () => {
  for (const values of Object.values(answerObservations)) {
    assert.equal(Object.keys(values).length, 3);
  }
});

test("configuration never claims certainty", () => {
  const serialized = JSON.stringify({
    environmentConfig,
    directionConfig,
    combinationCopy,
  });
  assert.doesNotMatch(
    serialized,
    /correct class|is a .* student|definitely belongs/i,
  );
});

test("complete-answer guard rejects partial answers", () => {
  assert.equal(isCompleteAssessment(initialAssessmentAnswers), false);
  assert.equal(
    isCompleteAssessment({
      academicLevel: "year-level",
      confidence: "encouraged",
      learningHabits: "check-in",
      motivation: "persistent",
      goals: "steady-progress",
    }),
    true,
  );
});

test("close-guidance rebuilding profile explores private plus foundation", () => {
  const result = calculateLearningRecommendation({
    academicLevel: "rebuilding",
    confidence: "quiet",
    learningHabits: "guided",
    motivation: "needs-encouragement",
    goals: "confidence-foundations",
  });

  assert.equal(result?.environment.primary, "private");
  assert.equal(result?.direction.primary, "foundation");
});

test("balanced check-in profile explores small group plus core", () => {
  const result = calculateLearningRecommendation({
    academicLevel: "year-level",
    confidence: "encouraged",
    learningHabits: "check-in",
    motivation: "persistent",
    goals: "steady-progress",
  });

  assert.equal(result?.environment.primary, "small-group");
  assert.equal(result?.direction.primary, "core");
  assert.equal(result?.observations.length, 5);
  assert.equal(result?.combination.summary, combinationCopy["small-group:core"].summary);
});

test("independent challenge profile explores class plus accelerated", () => {
  const result = calculateLearningRecommendation({
    academicLevel: "above-level",
    confidence: "confident",
    learningHabits: "independent",
    motivation: "challenge-seeking",
    goals: "extension",
  });

  assert.equal(result?.environment.primary, "class");
  assert.equal(result?.direction.primary, "accelerated");
});

test("academic level alone does not determine environment", () => {
  const result = calculateLearningRecommendation({
    academicLevel: "above-level",
    confidence: "quiet",
    learningHabits: "guided",
    motivation: "persistent",
    goals: "extension",
  });

  assert.notEqual(result?.environment.primary, "class");
  assert.equal(result?.direction.primary, "accelerated");
});

test("stable priority resolves exact environment ties and exposes the runner-up", () => {
  const result = calculateLearningRecommendation({
    academicLevel: "rebuilding",
    confidence: "quiet",
    learningHabits: "guided",
    motivation: "persistent",
    goals: "steady-progress",
  });

  assert.equal(result?.environment.scores.private, 8);
  assert.equal(result?.environment.scores["small-group"], 8);
  assert.equal(result?.environment.primary, "small-group");
  assert.equal(result?.environment.secondary, "private");
});

test("secondary environment appears only within the configured score gap", () => {
  const close = calculateLearningRecommendation({
    academicLevel: "year-level",
    confidence: "confident",
    learningHabits: "check-in",
    motivation: "persistent",
    goals: "steady-progress",
  });
  const decisive = calculateLearningRecommendation({
    academicLevel: "rebuilding",
    confidence: "quiet",
    learningHabits: "guided",
    motivation: "needs-encouragement",
    goals: "confidence-foundations",
  });

  assert.equal(close?.environment.primary, "small-group");
  assert.equal(close?.environment.secondary, "class");
  assert.equal(decisive?.environment.secondary, null);
});

test("recommendations expose concise answer-supported reasons without duplicates", () => {
  const result = calculateLearningRecommendation({
    academicLevel: "year-level",
    confidence: "encouraged",
    learningHabits: "check-in",
    motivation: "persistent",
    goals: "steady-progress",
  });

  assert.ok(result);
  assert.ok(result.environment.reasons.length >= 2);
  assert.ok(result.environment.reasons.length <= 4);
  assert.equal(new Set(result.environment.reasons).size, result.environment.reasons.length);
  assert.ok(result.direction.reasons.length >= 1);
});

test("incomplete assessments do not produce a recommendation", () => {
  assert.equal(calculateLearningRecommendation(initialAssessmentAnswers), null);
});
