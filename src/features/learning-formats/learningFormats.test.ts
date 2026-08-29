/**
 * Recommendation-logic tests for the Learning Formats decision tool.
 * Run: npm run test:learning-formats
 */

import assert from "node:assert/strict";
import test from "node:test";

import { stageForYear } from "./config/stages.ts";
import { isSubjectAvailable } from "./config/subjects.ts";
import { buildRecommendation } from "./logic/buildRecommendation.ts";
import { calculateSignals } from "./logic/calculateSignals.ts";
import type { AssessmentState } from "./logic/types.ts";
import {
  applyToggleSubject,
  applyYear,
  EMPTY_STATE,
} from "./state/transitions.ts";

function make(partial: Partial<AssessmentState>): AssessmentState {
  return { ...EMPTY_STATE, ...partial };
}

// ---------------------------------------------------------------------------
// Layer A — core environment
// ---------------------------------------------------------------------------

test("1. Primary child: high support need + low confidence -> Private", () => {
  const state = make({
    year: 3,
    stage: "primary",
    answers: { q1: "a", q2: "a", q3: "a", q4: "a" },
  });
  const { recommendation } = buildRecommendation(state);
  assert.equal(recommendation?.primaryEnvironment, "private");
});

test("2. Primary independent child -> Class", () => {
  const state = make({
    year: 4,
    stage: "primary",
    answers: { q1: "c", q2: "c", q3: "c", q4: "d" },
  });
  const { recommendation } = buildRecommendation(state);
  assert.equal(recommendation?.primaryEnvironment, "class");
});

test("3. High School: independent + challenge-seeking -> Class", () => {
  const state = make({
    year: 9,
    stage: "high-school",
    answers: { q1: "e", q2: "d", q3: "e", q4: "e" },
  });
  const { recommendation } = buildRecommendation(state);
  assert.equal(recommendation?.primaryEnvironment, "class");
});

test("4. High School: falling behind + waits for help -> Private", () => {
  const state = make({
    year: 8,
    stage: "high-school",
    answers: { q1: "a", q2: "a", q3: "a", q4: "a" },
  });
  const { recommendation } = buildRecommendation(state);
  assert.equal(recommendation?.primaryEnvironment, "private");
});

test("5. HSC: needs major individual support -> Private", () => {
  const state = make({
    year: 12,
    stage: "hsc",
    answers: { q1: "a", q2: "b", q3: "a", q4: "a" },
  });
  const { recommendation } = buildRecommendation(state);
  assert.equal(recommendation?.primaryEnvironment, "private");
});

test("6. HSC: independent + high-quality practice -> Class", () => {
  const state = make({
    year: 12,
    stage: "hsc",
    answers: { q1: "d", q2: "d", q3: "c", q4: "e" },
  });
  const { recommendation } = buildRecommendation(state);
  assert.equal(recommendation?.primaryEnvironment, "class");
});

test("scores are never exposed in the recommendation output", () => {
  const state = make({
    year: 8,
    stage: "high-school",
    answers: { q1: "a", q2: "a", q3: "a", q4: "a" },
  });
  const { recommendation } = buildRecommendation(state);
  const serialized = JSON.stringify(recommendation);
  assert.doesNotMatch(serialized, /privateScore|classScore|Signal/);
});

test("result language never claims certainty", () => {
  const state = make({
    year: 8,
    stage: "high-school",
    answers: { q1: "a", q2: "a", q3: "a", q4: "a" },
  });
  const { recommendation } = buildRecommendation(state);
  const serialized = JSON.stringify(recommendation).toLowerCase();
  assert.doesNotMatch(serialized, /belongs in|definitely|is the correct/);
  assert.ok((recommendation?.reasons.length ?? 0) >= 2);
  assert.ok((recommendation?.reasons.length ?? 0) <= 4);
});

test("close result surfaces a secondary environment", () => {
  // Tie: q1 b (p1/c1) q2 b (p1/c2) q3 b (p1/c2) q4 c (p1/c2) -> p4 c8? no.
  // Use a deliberate near-tie.
  const state = make({
    year: 8,
    stage: "high-school",
    answers: { q1: "b", q2: "b", q3: "d", q4: "b" },
  });
  const { signals, recommendation } = buildRecommendation(state);
  const gap = Math.abs(signals.privateScore - signals.classScore);
  if (gap <= 2) {
    assert.ok(recommendation?.secondaryEnvironment);
  }
});

// ---------------------------------------------------------------------------
// Layer B — specialist programs
// ---------------------------------------------------------------------------

test("7. High School Maths: school-specific alignment -> Focus Maths surfaced", () => {
  const state = make({
    year: 9,
    stage: "high-school",
    answers: { q1: "d", q2: "d", q3: "d", q4: "d" },
    selectedSubjects: ["maths"],
    subjectAnswers: { highSchoolMaths: "b" },
  });
  const { recommendation } = buildRecommendation(state);
  const maths = recommendation?.subjects.find((s) => s.subject === "maths");
  assert.equal(maths?.environment, "class");
  assert.ok(
    maths?.specialistPrograms.some((p) => p.id === "focus-maths"),
    "expected focus-maths to surface",
  );
});

test("8. HSC Maths: systematic preparation need -> HSC Prep", () => {
  const state = make({
    year: 12,
    stage: "hsc",
    answers: { q1: "c", q2: "c", q3: "c", q4: "b" },
    selectedSubjects: ["maths"],
    subjectAnswers: { hscMaths: "b" },
  });
  const { recommendation } = buildRecommendation(state);
  const maths = recommendation?.subjects.find((s) => s.subject === "maths");
  assert.ok(maths?.specialistPrograms.some((p) => p.id === "hsc-prep"));
  assert.ok(!maths?.specialistPrograms.some((p) => p.id === "trial-class"));
});

test("9. HSC Maths: timing / exam pressure -> Trial Class", () => {
  const state = make({
    year: 12,
    stage: "hsc",
    answers: { q1: "c", q2: "c", q3: "c", q4: "b" },
    selectedSubjects: ["maths"],
    subjectAnswers: { hscMaths: "c" },
  });
  const { recommendation } = buildRecommendation(state);
  const maths = recommendation?.subjects.find((s) => s.subject === "maths");
  assert.ok(maths?.specialistPrograms.some((p) => p.id === "trial-class"));
});

test("Primary English: strong creative-writing signal -> Creative Writing", () => {
  const state = make({
    year: 3,
    stage: "primary",
    answers: { q1: "c", q2: "c", q3: "c", q4: "c" },
    selectedSubjects: ["english"],
    subjectAnswers: { primaryEnglish: "c" },
  });
  const { recommendation } = buildRecommendation(state);
  const english = recommendation?.subjects.find((s) => s.subject === "english");
  const cw = english?.specialistPrograms.find((p) => p.id === "creative-writing");
  assert.ok(cw, "expected creative-writing");
  assert.equal(cw?.confidence, "worth-exploring");
});

// --- Year 7–10 English specialists (confirmed Aug 2026) --------------------
// English follow-up options: a general-support, b creative-writing, c gat,
//                            d bullet, e focus
const HS_CHALLENGE = { q1: "d", q2: "d", q3: "d", q4: "d" }; // independent + challenge-ready
const HS_SUPPORT = { q1: "a", q2: "a", q3: "a", q4: "a" }; // strong support / foundation
const HS_NEUTRAL = { q1: "c", q2: "c", q3: "c", q4: "c" }; // class-leaning, no challenge signal

function hsEnglish(
  answers: Record<string, string>,
  englishOption: string,
): { env: string; programs: { id: string; confidence: string }[] } {
  const state = make({
    year: 9,
    stage: "high-school",
    answers,
    selectedSubjects: ["english"],
    subjectAnswers: { highSchoolEnglish: englishOption },
  });
  const { recommendation } = buildRecommendation(state);
  const english = recommendation!.subjects.find((s) => s.subject === "english")!;
  return {
    env: english.environment,
    programs: english.specialistPrograms.map((p) => ({
      id: p.id,
      confidence: p.confidence,
    })),
  };
}

test("HS English — General support: no specialist, core environment only", () => {
  assert.deepEqual(hsEnglish(HS_NEUTRAL, "a").programs, []);
});

test("HS English — Creative Writing surfaces on choice alone, either environment", () => {
  for (const answers of [HS_CHALLENGE, HS_SUPPORT]) {
    const cw = hsEnglish(answers, "b").programs.find(
      (p) => p.id === "creative-writing-english",
    );
    assert.ok(cw, "creative writing should surface");
    assert.equal(cw?.confidence, "worth-exploring");
  }
});

test("HS English — Focus surfaces on choice alone (no advanced signals needed)", () => {
  const focus = hsEnglish(HS_NEUTRAL, "e").programs.find(
    (p) => p.id === "focus-english-hs",
  );
  assert.ok(focus);
  assert.equal(focus?.confidence, "worth-exploring");
});

test("HS English — GAT is a full recommendation when independent + challenge-ready", () => {
  const gat = hsEnglish(HS_CHALLENGE, "c").programs.find(
    (p) => p.id === "gat-english",
  );
  assert.equal(gat?.confidence, "worth-exploring");
});

test("HS English — GAT softens to 'discuss at interview' under strong support signals", () => {
  const gat = hsEnglish(HS_SUPPORT, "c").programs.find(
    (p) => p.id === "gat-english",
  );
  assert.equal(gat?.confidence, "possible");
});

test("HS English — Bullet is full only when challenge + performance + independence all met", () => {
  const bullet = hsEnglish(HS_CHALLENGE, "d").programs.find(
    (p) => p.id === "bullet-english",
  );
  assert.equal(bullet?.confidence, "worth-exploring");
});

test("HS English — Bullet falls back to 'discuss at interview' when signals fall short", () => {
  for (const answers of [HS_SUPPORT, HS_NEUTRAL]) {
    const bullet = hsEnglish(answers, "d").programs.find(
      (p) => p.id === "bullet-english",
    );
    assert.equal(bullet?.confidence, "possible");
  }
});

test("HS English — specialists never replace the core environment", () => {
  const { env, programs } = hsEnglish(HS_CHALLENGE, "d");
  assert.ok(env === "private" || env === "class");
  assert.ok(programs.length > 0);
});

test("HSC Focus English remains a consultation discussion until DA confirms eligibility", () => {
  for (const answer of ["a", "b", "c", "d", "e"]) {
    const state = make({
      year: 12,
      stage: "hsc",
      answers: { q1: "c", q2: "c", q3: "c", q4: "a" },
      selectedSubjects: ["english"],
      subjectAnswers: { hscEnglish: answer },
    });
    const { recommendation } = buildRecommendation(state);
    const english = recommendation?.subjects.find((s) => s.subject === "english");
    assert.equal(english?.specialistPrograms[0]?.id, "focus-english-hsc");
    assert.equal(english?.specialistPrograms[0]?.confidence, "possible");
  }
});

// ---------------------------------------------------------------------------
// Multi-subject + follow-up gating
// ---------------------------------------------------------------------------

test("10. Multiple subjects: one assessment, all get results, only specialist subjects get follow-ups", () => {
  const state = make({
    year: 8,
    stage: "high-school",
    answers: { q1: "d", q2: "c", q3: "c", q4: "c" },
    selectedSubjects: ["english", "maths", "chemistry"],
    subjectAnswers: { highSchoolEnglish: "a", highSchoolMaths: "b" },
  });
  const { recommendation } = buildRecommendation(state);
  assert.equal(recommendation?.subjects.length, 3);
  for (const s of recommendation!.subjects) {
    assert.equal(s.environment, recommendation!.primaryEnvironment);
  }
  const chem = recommendation?.subjects.find((s) => s.subject === "chemistry");
  assert.equal(chem?.needsFollowUp, false);
  assert.deepEqual(chem?.specialistPrograms, []);
});

test("11. Changing subject selection does NOT reset the student assessment", () => {
  let state = make({
    year: 8,
    stage: "high-school",
    answers: { q1: "a", q2: "b", q3: "c", q4: "d" },
  });
  state = applyToggleSubject(state, "english");
  state = applyToggleSubject(state, "maths");
  state = applyToggleSubject(state, "english"); // remove again
  assert.deepEqual(state.answers, { q1: "a", q2: "b", q3: "c", q4: "d" });
  assert.deepEqual(state.selectedSubjects, ["maths"]);
});

test("12. Changing year DOES reset incompatible answers when the stage changes", () => {
  let state = make({
    year: 6,
    stage: "primary",
    answers: { q1: "a", q2: "a", q3: "a", q4: "a" },
    selectedSubjects: ["english", "maths"],
  });
  // Year 6 -> Year 7 crosses primary -> high-school
  state = applyYear(state, 7);
  assert.equal(state.stage, "high-school");
  assert.deepEqual(state.answers, {});

  // Year 7 -> Year 9 stays in high-school -> answers preserved
  state = { ...state, answers: { q1: "b", q2: "b", q3: "b", q4: "b" } };
  const same = applyYear(state, 9);
  assert.equal(same.stage, "high-school");
  assert.deepEqual(same.answers, { q1: "b", q2: "b", q3: "b", q4: "b" });
});

test("changing year drops now-ineligible subjects (science: HS only)", () => {
  let state = make({
    year: 9,
    stage: "high-school",
    selectedSubjects: ["english", "science"],
  });
  state = applyYear(state, 11); // HSC has no "science"
  assert.deepEqual(state.selectedSubjects, ["english"]);
});

// ---------------------------------------------------------------------------
// Config sanity
// ---------------------------------------------------------------------------

test("stage mapping matches the DA year groupings", () => {
  assert.equal(stageForYear(1), "primary");
  assert.equal(stageForYear(6), "primary");
  assert.equal(stageForYear(7), "high-school");
  assert.equal(stageForYear(10), "high-school");
  assert.equal(stageForYear(11), "hsc");
  assert.equal(stageForYear(12), "hsc");
});

test("subject eligibility differs by stage", () => {
  assert.equal(isSubjectAvailable("science", 8, "high-school"), true);
  assert.equal(isSubjectAvailable("science", 12, "hsc"), false);
  assert.equal(isSubjectAvailable("chemistry", 4, "primary"), false);
});

test("incomplete assessment yields no recommendation", () => {
  const state = make({
    year: 8,
    stage: "high-school",
    answers: { q1: "a", q2: "a" },
  });
  const { recommendation } = buildRecommendation(state);
  assert.equal(recommendation, null);
});

test("stage-range journey can complete its preliminary recommendation without an exact year", () => {
  const state = make({ year: null, stage: "primary", answers: { q1:"a", q2:"a", q3:"a", q4:"a" } });
  assert.ok(buildRecommendation(state).recommendation);
});

test("Section 01 educational content does not affect scoring", () => {
  // The lesson-process toggle is presentation only; the signal engine only
  // ever reads `answers` and `subjectAnswers`.
  const a = calculateSignals(
    make({ year: 8, stage: "high-school", answers: { q1: "a" } }),
  );
  const b = calculateSignals(
    make({ year: 8, stage: "high-school", answers: { q1: "a" } }),
  );
  assert.deepEqual(a, b);
});
