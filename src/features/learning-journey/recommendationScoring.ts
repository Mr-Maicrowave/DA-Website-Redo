import type { AssessmentAnswers } from "./assessmentTypes";
import {
  answerObservations,
  assessmentTopicLabels,
  combinationCopy,
  DIRECTION_TIE_PRIORITY,
  directionConfig,
  ENVIRONMENT_TIE_PRIORITY,
  SECONDARY_ENVIRONMENT_MAX_GAP,
} from "./recommendationConfig.ts";
import {
  isCompleteAssessment,
  type CompleteAssessmentAnswers,
  type DirectionId,
  type EnvironmentId,
  type LearningRecommendation,
  type RecommendationObservation,
} from "./recommendationTypes.ts";

type EnvironmentScores = Record<EnvironmentId, number>;
type DirectionScores = Record<DirectionId, number>;

const environmentWeights = {
  academicLevel: {
    rebuilding: { private: 2, "small-group": 1, class: 0 },
    "year-level": { private: 0, "small-group": 1, class: 1 },
    "above-level": { private: 0, "small-group": 1, class: 1 },
  },
  confidence: {
    quiet: { private: 3, "small-group": 2, class: 0 },
    encouraged: { private: 1, "small-group": 3, class: 0 },
    confident: { private: 0, "small-group": 1, class: 3 },
  },
  learningHabits: {
    guided: { private: 3, "small-group": 1, class: 0 },
    "check-in": { private: 1, "small-group": 3, class: 1 },
    independent: { private: 0, "small-group": 1, class: 3 },
  },
  motivation: {
    "needs-encouragement": { private: 2, "small-group": 2, class: 0 },
    persistent: { private: 0, "small-group": 2, class: 2 },
    "challenge-seeking": { private: 0, "small-group": 1, class: 3 },
  },
  goals: {
    "confidence-foundations": { private: 2, "small-group": 1, class: 0 },
    "steady-progress": { private: 0, "small-group": 2, class: 1 },
    extension: { private: 0, "small-group": 1, class: 2 },
  },
} as const;

const directionWeights = {
  academicLevel: {
    rebuilding: { foundation: 4, core: 1, accelerated: 0 },
    "year-level": { foundation: 0, core: 4, accelerated: 0 },
    "above-level": { foundation: 0, core: 1, accelerated: 4 },
  },
  confidence: {
    quiet: { foundation: 1, core: 0, accelerated: 0 },
    encouraged: { foundation: 0, core: 1, accelerated: 0 },
    confident: { foundation: 0, core: 1, accelerated: 1 },
  },
  learningHabits: {
    guided: { foundation: 2, core: 0, accelerated: 0 },
    "check-in": { foundation: 0, core: 2, accelerated: 0 },
    independent: { foundation: 0, core: 1, accelerated: 1 },
  },
  motivation: {
    "needs-encouragement": { foundation: 2, core: 0, accelerated: 0 },
    persistent: { foundation: 0, core: 2, accelerated: 0 },
    "challenge-seeking": { foundation: 0, core: 0, accelerated: 3 },
  },
  goals: {
    "confidence-foundations": { foundation: 4, core: 0, accelerated: 0 },
    "steady-progress": { foundation: 0, core: 4, accelerated: 0 },
    extension: { foundation: 0, core: 0, accelerated: 4 },
  },
} as const;

const environmentReasonSignals = {
  academicLevel: {
    rebuilding: {
      private: "Individual guidance can focus closely on important foundations.",
      "small-group": "A closer setting can create more room to consolidate important foundations.",
    },
    "year-level": {
      "small-group": "A focused peer setting can support continued progress with regular tutor attention.",
      class: "A shared structure may suit continued progress through year-level material.",
    },
    "above-level": {
      "small-group": "A focused peer setting can add challenge while preserving tutor feedback.",
      class: "A broader peer environment can add energy and challenge to extension work.",
    },
  },
  confidence: {
    quiet: {
      private: "One-to-one attention creates more room to notice hesitation.",
      "small-group": "A smaller peer environment may make participation feel more approachable.",
    },
    encouraged: {
      private: "Direct encouragement can be built naturally into each lesson.",
      "small-group": "Regular tutor prompts can encourage participation without a large audience.",
    },
    confident: {
      "small-group": "Comfort speaking up can contribute to a focused group discussion.",
      class: "Confident participation can make good use of wider classroom discussion.",
    },
  },
  learningHabits: {
    guided: {
      private: "Frequent explanation and checking are easier to provide one-to-one.",
      "small-group": "A focused group gives the tutor more opportunities to check understanding.",
    },
    "check-in": {
      private: "Individual check-ins can be timed around their work.",
      "small-group": "They can work independently while still receiving regular tutor check-ins.",
      class: "Some independence may help them keep pace with a shared lesson.",
    },
    independent: {
      "small-group": "Independent work can combine with the accountability of a focused peer group.",
      class: "Working independently can suit a more structured shared pace.",
    },
  },
  motivation: {
    "needs-encouragement": {
      private: "Close reassurance can help restart momentum when work becomes difficult.",
      "small-group": "Tutor check-ins and peer momentum may help when work becomes difficult.",
    },
    persistent: {
      "small-group": "Persistence can pair well with group accountability and feedback.",
      class: "Their willingness to keep trying may suit a steady shared lesson pace.",
    },
    "challenge-seeking": {
      "small-group": "A focused peer environment can turn challenge into productive discussion.",
      class: "A lively shared environment can provide additional challenge and comparison.",
    },
  },
  goals: {
    "confidence-foundations": {
      private: "Individual pacing can create space to rebuild confidence carefully.",
      "small-group": "A safer peer environment can support confidence without removing collaboration.",
    },
    "steady-progress": {
      "small-group": "Regular guidance and peer accountability can support consistent progress.",
      class: "A structured shared environment can support consistent curriculum momentum.",
    },
    extension: {
      "small-group": "Closer feedback can help shape extension around their current strengths.",
      class: "A wider peer group can add discussion and productive academic challenge.",
    },
  },
} as const;

const addEnvironmentScores = (
  total: EnvironmentScores,
  contribution: Readonly<EnvironmentScores>,
) => {
  for (const id of ENVIRONMENT_TIE_PRIORITY) total[id] += contribution[id];
};

const addDirectionScores = (
  total: DirectionScores,
  contribution: Readonly<DirectionScores>,
) => {
  for (const id of DIRECTION_TIE_PRIORITY) total[id] += contribution[id];
};

const rank = <TId extends string>(
  scores: Record<TId, number>,
  priority: readonly TId[],
) =>
  [...priority].sort(
    (left, right) =>
      scores[right] - scores[left] ||
      priority.indexOf(left) - priority.indexOf(right),
  );

const toObservations = (
  answers: CompleteAssessmentAnswers,
): RecommendationObservation[] => [
  {
    key: "academicLevel",
    label: assessmentTopicLabels.academicLevel,
    value: answerObservations.academicLevel[answers.academicLevel],
  },
  {
    key: "confidence",
    label: assessmentTopicLabels.confidence,
    value: answerObservations.confidence[answers.confidence],
  },
  {
    key: "learningHabits",
    label: assessmentTopicLabels.learningHabits,
    value: answerObservations.learningHabits[answers.learningHabits],
  },
  {
    key: "motivation",
    label: assessmentTopicLabels.motivation,
    value: answerObservations.motivation[answers.motivation],
  },
  {
    key: "goals",
    label: assessmentTopicLabels.goals,
    value: answerObservations.goals[answers.goals],
  },
];

const selectEnvironmentReasons = (
  answers: CompleteAssessmentAnswers,
  primary: EnvironmentId,
): string[] => {
  const candidates = [
    environmentReasonSignals.academicLevel[answers.academicLevel][primary],
    environmentReasonSignals.confidence[answers.confidence][primary],
    environmentReasonSignals.learningHabits[answers.learningHabits][primary],
    environmentReasonSignals.motivation[answers.motivation][primary],
    environmentReasonSignals.goals[answers.goals][primary],
  ].filter((reason): reason is string => Boolean(reason));

  return [...new Set(candidates)].slice(0, 4);
};

export const calculateLearningRecommendation = (
  answers: AssessmentAnswers,
): LearningRecommendation | null => {
  if (!isCompleteAssessment(answers)) return null;

  const environmentScores: EnvironmentScores = {
    private: 0,
    "small-group": 0,
    class: 0,
  };
  const directionScores: DirectionScores = {
    foundation: 0,
    core: 0,
    accelerated: 0,
  };

  addEnvironmentScores(
    environmentScores,
    environmentWeights.academicLevel[answers.academicLevel],
  );
  addEnvironmentScores(
    environmentScores,
    environmentWeights.confidence[answers.confidence],
  );
  addEnvironmentScores(
    environmentScores,
    environmentWeights.learningHabits[answers.learningHabits],
  );
  addEnvironmentScores(
    environmentScores,
    environmentWeights.motivation[answers.motivation],
  );
  addEnvironmentScores(environmentScores, environmentWeights.goals[answers.goals]);

  addDirectionScores(
    directionScores,
    directionWeights.academicLevel[answers.academicLevel],
  );
  addDirectionScores(
    directionScores,
    directionWeights.confidence[answers.confidence],
  );
  addDirectionScores(
    directionScores,
    directionWeights.learningHabits[answers.learningHabits],
  );
  addDirectionScores(
    directionScores,
    directionWeights.motivation[answers.motivation],
  );
  addDirectionScores(directionScores, directionWeights.goals[answers.goals]);

  const [primaryEnvironment, runnerUpEnvironment] = rank(
    environmentScores,
    ENVIRONMENT_TIE_PRIORITY,
  );
  const [primaryDirection] = rank(directionScores, DIRECTION_TIE_PRIORITY);
  const hasCloseSecondary =
    environmentScores[primaryEnvironment] -
      environmentScores[runnerUpEnvironment] <=
    SECONDARY_ENVIRONMENT_MAX_GAP;

  return {
    environment: {
      primary: primaryEnvironment,
      secondary: hasCloseSecondary ? runnerUpEnvironment : null,
      scores: environmentScores,
      reasons: selectEnvironmentReasons(answers, primaryEnvironment),
    },
    direction: {
      primary: primaryDirection,
      scores: directionScores,
      reasons: directionConfig[primaryDirection].reasons,
    },
    observations: toObservations(answers),
    combination: combinationCopy[`${primaryEnvironment}:${primaryDirection}`],
  };
};
