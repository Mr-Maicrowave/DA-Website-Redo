import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { confidenceChoices } from "./confidenceModel.ts";
import { learningHabitsChoices } from "./learningHabitsModel.ts";
import { motivationChoices } from "./motivationModel.ts";
import { goalsChoices } from "./goalsModel.ts";
import {
  initialAssessmentAnswers,
  setAcademicLevel,
  setConfidence,
  setLearningHabits,
  setMotivation,
  setGoals,
} from "./assessmentTypes.ts";

const featureDirectory = dirname(fileURLToPath(import.meta.url));

test("assessment state begins empty and updates Academic Level immutably", () => {
  assert.deepEqual(initialAssessmentAnswers, {
    academicLevel: null,
    confidence: null,
    learningHabits: null,
    motivation: null,
    goals: null,
  });

  const rebuilding = setAcademicLevel(initialAssessmentAnswers, "rebuilding");
  assert.equal(rebuilding.academicLevel, "rebuilding");
  assert.equal(initialAssessmentAnswers.academicLevel, null);
  assert.equal(rebuilding.confidence, null);

  const changed = setAcademicLevel(rebuilding, "above-level");
  assert.equal(changed.academicLevel, "above-level");
  assert.equal(rebuilding.academicLevel, "rebuilding");
});

test("Confidence updates immutably without changing Academic Level", () => {
  const academic = setAcademicLevel(initialAssessmentAnswers, "year-level");
  const confident = setConfidence(academic, "confident");

  assert.equal(confident.confidence, "confident");
  assert.equal(confident.academicLevel, "year-level");
  assert.equal(academic.confidence, null);
});

test("Confidence supports every stored answer value", () => {
  for (const answer of ["quiet", "encouraged", "confident"] as const) {
    assert.equal(setConfidence(initialAssessmentAnswers, answer).confidence, answer);
  }
});

test("Confidence choices preserve the three parent-facing behavior meanings", () => {
  assert.deepEqual(confidenceChoices, [
    {
      value: "quiet",
      title: "Keeps it to themselves",
      description: "They may know the answer but rarely speak up without prompting.",
    },
    {
      value: "encouraged",
      title: "Answers when encouraged",
      description: "They respond when called on or gently encouraged.",
    },
    {
      value: "confident",
      title: "Puts their hand up immediately",
      description: "They are comfortable speaking up and volunteering answers.",
    },
  ]);
});

test("Learning Habits stores each support-distance answer without changing earlier answers", () => {
  const earlier = setConfidence(
    setAcademicLevel(initialAssessmentAnswers, "year-level"),
    "encouraged",
  );
  for (const answer of ["guided", "check-in", "independent"] as const) {
    const updated = setLearningHabits(earlier, answer);
    assert.equal(updated.learningHabits, answer);
    assert.equal(updated.academicLevel, "year-level");
    assert.equal(updated.confidence, "encouraged");
    assert.equal(earlier.learningHabits, null);
  }
});

test("Learning Habits choices use the approved observational language", () => {
  assert.deepEqual(learningHabitsChoices, [
    {
      value: "guided",
      title: "Needs regular guidance",
      description: "They work best with frequent explanation, checking and reassurance.",
    },
    {
      value: "check-in",
      title: "Checks in sometimes",
      description: "They can work on their own but still benefit from occasional guidance.",
    },
    {
      value: "independent",
      title: "Works independently",
      description: "Once shown what to do, they usually manage the task on their own.",
    },
  ]);
});

test("Learning Habits encounter reuses the assessment controls and exact copy", () => {
  const encounterPath = resolve(featureDirectory, "LearningHabitsEncounter.tsx");
  assert.ok(existsSync(encounterPath), "LearningHabitsEncounter must exist");
  const source = readFileSync(encounterPath, "utf8");
  for (const copy of [
    "03 — LEARNING HABITS",
    "Once your child understands what to do, how much support do they usually need?",
    "Choose the one that feels most like them.",
  ]) assert.ok(source.includes(copy), `missing ${copy}`);
  assert.match(source, /AssessmentEncounter/);
  assert.match(source, /AssessmentChoice/);
  assert.match(source, /JourneyProgress/);
  assert.match(source, /data-journey-learning-habits-arrival/);
  assert.doesNotMatch(source, /confidence-classroom|ClassroomArchitecture/);
});

test("Motivation stores each persistence answer without changing earlier answers", () => {
  const earlier = setLearningHabits(
    setConfidence(setAcademicLevel(initialAssessmentAnswers, "year-level"), "encouraged"),
    "check-in",
  );
  for (const answer of ["needs-encouragement", "persistent", "challenge-seeking"] as const) {
    const updated = setMotivation(earlier, answer);
    assert.equal(updated.motivation, answer);
    assert.equal(updated.academicLevel, "year-level");
    assert.equal(updated.confidence, "encouraged");
    assert.equal(updated.learningHabits, "check-in");
    assert.equal(earlier.motivation, null);
  }
});

test("Motivation choices use neutral parent-facing persistence language", () => {
  assert.deepEqual(motivationChoices, [
    {
      value: "needs-encouragement",
      title: "Needs encouragement to continue",
      description: "A little support or reassurance helps them get moving again.",
    },
    {
      value: "persistent",
      title: "Keeps trying",
      description: "They usually persist, even if it takes several attempts.",
    },
    {
      value: "challenge-seeking",
      title: "Enjoys the challenge",
      description: "Difficult work often makes them more curious or determined.",
    },
  ]);
});

test("Motivation encounter reuses shared controls and stops before Goals", () => {
  const encounterPath = resolve(featureDirectory, "MotivationEncounter.tsx");
  assert.ok(existsSync(encounterPath), "MotivationEncounter must exist");
  const source = readFileSync(encounterPath, "utf8");
  for (const copy of [
    "04 — WHEN IT GETS HARD",
    "When the work becomes difficult, what usually happens next?",
    "Think about homework, unfamiliar questions or challenging new concepts.",
  ]) assert.ok(source.includes(copy), `missing ${copy}`);
  assert.match(source, /AssessmentEncounter/);
  assert.match(source, /AssessmentChoice/);
  assert.match(source, /JourneyProgress/);
  assert.match(source, /data-journey-motivation-arrival/);
  assert.doesNotMatch(source, /GoalsEncounter|recommendation|result/i);
});

test("Goals stores each future aim while preserving the four earlier answers", () => {
  const earlier = setMotivation(
    setLearningHabits(setConfidence(setAcademicLevel(initialAssessmentAnswers, "above-level"), "quiet"), "guided"),
    "persistent",
  );
  for (const answer of ["confidence-foundations", "steady-progress", "extension"] as const) {
    const updated = setGoals(earlier, answer);
    assert.equal(updated.goals, answer);
    assert.equal(updated.academicLevel, "above-level");
    assert.equal(updated.confidence, "quiet");
    assert.equal(updated.learningHabits, "guided");
    assert.equal(updated.motivation, "persistent");
    assert.equal(earlier.goals, null);
  }
});

test("Goals choices preserve equal, parent-facing future aims", () => {
  assert.deepEqual(goalsChoices, [
    { value: "confidence-foundations", title: "Build confidence & foundations", description: "Help them feel secure in what they know and strengthen important gaps." },
    { value: "steady-progress", title: "Keep progressing strongly", description: "Maintain consistent progress with the right support, structure and accountability." },
    { value: "extension", title: "Stretch beyond year level", description: "Give them greater challenge, faster progression or extension." },
  ]);
});

test("Goals encounter and completion hand off to the pathway reveal", () => {
  const goalsPath = resolve(featureDirectory, "GoalsEncounter.tsx");
  const telescopePath = resolve(featureDirectory, "TelescopeSelector.tsx");
  const completionPath = resolve(featureDirectory, "JourneyCompletion.tsx");
  for (const path of [goalsPath, telescopePath, completionPath]) assert.ok(existsSync(path), `${path} must exist`);
  const goals = readFileSync(goalsPath, "utf8");
  const telescope = readFileSync(telescopePath, "utf8");
  const completion = readFileSync(completionPath, "utf8");
  for (const copy of [
    "05 — LOOKING AHEAD",
    "What would you most like learning to do next?",
    "There's no wrong answer — think about what would make the biggest difference right now.",
  ]) assert.ok(goals.includes(copy), `missing ${copy}`);
  assert.match(goals, /AssessmentEncounter/);
  assert.match(goals, /JourneyProgress/);
  assert.match(goals, /TelescopeSelector/);
  assert.match(telescope, /AssessmentChoice/);
  assert.match(telescope, /data-telescope-selector/);
  assert.match(completion, /YOUR PATHWAY IS READY/);
  assert.match(completion, /Five moments\. One clearer picture\./);
  assert.match(completion, /SEE THEIR PATHWAY →/);
  assert.match(completion, /onRevealPathway/);
  assert.match(completion, /aria-controls="learning-pathway-result"/);
  assert.doesNotMatch(completion, /useState|data-step-seven-placeholder/);
});

test("assessment provider exposes typed answer actions and versioned session state", () => {
  const providerPath = resolve(featureDirectory, "AssessmentJourneyContext.tsx");
  assert.ok(existsSync(providerPath), "AssessmentJourneyContext must exist");
  const source = readFileSync(providerPath, "utf8");
  assert.match(source, /AssessmentJourneyProvider/);
  assert.match(source, /useAssessmentJourney/);
  assert.match(source, /setAcademicLevelAnswer/);
  assert.match(source, /readJourneySession/);
  assert.match(source, /writeJourneySession/);
  assert.match(source, /window\.sessionStorage/);
  assert.match(source, /resultRevealed/);
  assert.match(source, /setResultRevealed/);
  assert.doesNotMatch(source, /localStorage/);
});

test("reusable encounter controls expose semantic radio and progress contracts", () => {
  const choicePath = resolve(featureDirectory, "AssessmentChoice.tsx");
  const encounterPath = resolve(featureDirectory, "AssessmentEncounter.tsx");
  const progressPath = resolve(featureDirectory, "JourneyProgress.tsx");
  for (const path of [choicePath, encounterPath, progressPath]) {
    assert.ok(existsSync(path), path + " must exist");
  }
  const choice = readFileSync(choicePath, "utf8");
  const encounter = readFileSync(encounterPath, "utf8");
  const progress = readFileSync(progressPath, "utf8");
  assert.match(choice, /type="radio"/);
  assert.match(choice, /aria-describedby/);
  assert.match(choice, /checked=/);
  assert.match(choice, /disabled=/);
  assert.match(encounter, /role="radiogroup"/);
  assert.match(encounter, /ArrowRight|ArrowDown/);
  assert.match(encounter, /aria-live="polite"/);
  assert.match(progress, /Academic Level/);
  assert.match(progress, /Confidence/);
  assert.match(progress, /Learning Habits/);
  assert.match(progress, /Motivation/);
  assert.match(progress, /Goals/);
});

test("Academic Level encounter supplies exact functional illustrated choices", () => {
  const encounterPath = resolve(featureDirectory, "AcademicLevelEncounter.tsx");
  assert.ok(existsSync(encounterPath), "AcademicLevelEncounter must exist");
  const source = readFileSync(encounterPath, "utf8");
  for (const copy of [
    "01 — ACADEMIC LEVEL",
    "Where is your child academically right now?",
    "Choose the one that feels most accurate.",
    "Rebuilding foundations",
    "They need more support with the basics.",
    "Around their year level",
    "They're keeping up with what is expected.",
    "Above their year level",
    "They're ready for greater challenge.",
  ]) assert.ok(source.includes(copy), "missing " + copy);
  for (const value of ["rebuilding", "year-level", "above-level"]) {
    assert.match(source, new RegExp("value: [\\\"']" + value + "[\\\"']"));
  }
  assert.match(source, /journeyAssets/);
  assert.doesNotMatch(source, /Card|Modal|Toast/);
});

test("journey integrates reusable encounter choreography without frame-state React updates", () => {
  const journeyPath = resolve(featureDirectory, "LearningJourney.tsx");
  const selectionPath = resolve(featureDirectory, "useEncounterSelection.ts");
  const source = readFileSync(journeyPath, "utf8");
  const selection = readFileSync(selectionPath, "utf8");
  assert.match(source, /AssessmentJourneyProvider/);
  assert.match(source, /AcademicLevelEncounter/);
  assert.match(source, /setAcademicLevelAnswer/);
  assert.match(source, /useEncounterSelection/);
  assert.match(selection, /confirming/);
  assert.match(selection, /data-selection-dot/);
  assert.match(selection, /data-selection-ripple/);
  assert.match(selection, /600|700|800|900/);
  assert.match(selection, /clearTimeout/);
});

test("unanswered encounter gates continuation without blocking wheel or touch events", () => {
  const journeyPath = resolve(featureDirectory, "LearningJourney.tsx");
  const worldPath = resolve(featureDirectory, "JourneyWorld.tsx");
  const journey = readFileSync(journeyPath, "utf8");
  const world = readFileSync(worldPath, "utf8");
  assert.match(journey, /academic-hold/);
  assert.match(journey, /confidence-hold/);
  assert.match(journey, /learning-habits-hold/);
  assert.match(journey, /motivation-hold/);
  assert.match(journey, /continuation-start/);
  assert.match(journey, /academicLevel/);
  assert.match(journey, /answersRef\.current\.confidence/);
  assert.match(journey, /answersRef\.current\.learningHabits/);
  assert.match(journey, /answersRef\.current\.motivation/);
  assert.match(world, /goalsEncounter/);
  assert.match(world, /completion/);
  assert.match(world, /recommendationJourney/);
  assert.doesNotMatch(journey, /addEventListener\(["'](?:wheel|touchmove)/);
});

test("answer handoffs settle at the next encounter instead of between scenes", () => {
  const source = readFileSync(resolve(featureDirectory, "LearningJourney.tsx"), "utf8");
  assert.match(source, /continueFromEncounter\(CONFIDENCE_HOLD_PROGRESS\)/);
  assert.match(source, /continueFromEncounter\(LEARNING_HABITS_HOLD_PROGRESS\)/);
  assert.match(source, /continueFromEncounter\(MOTIVATION_HOLD_PROGRESS\)/);
  assert.match(source, /continueFromEncounter\(GOALS_HOLD_PROGRESS\)/);
  assert.match(source, /GATE_SETTLE_EPSILON/);
});
