import type { AssessmentAnswers } from "./assessmentTypes";

export type EnvironmentId = "private" | "small-group" | "class";
export type DirectionId = "foundation" | "core" | "accelerated";

export type CompleteAssessmentAnswers = {
  [K in keyof AssessmentAnswers]: NonNullable<AssessmentAnswers[K]>;
};

export interface RecommendationObservation {
  key: keyof AssessmentAnswers;
  label: string;
  value: string;
}

export interface RecommendationCombination {
  environment: EnvironmentId;
  direction: DirectionId;
  summary: string;
}

export interface RecommendationDimension<TId extends string> {
  primary: TId;
  secondary: TId | null;
  scores: Record<TId, number>;
  reasons: readonly string[];
}

export interface LearningRecommendation {
  environment: RecommendationDimension<EnvironmentId>;
  direction: Omit<RecommendationDimension<DirectionId>, "secondary">;
  observations: readonly RecommendationObservation[];
  combination: RecommendationCombination;
}

export interface PracticalCharacteristic {
  label: string;
  description: string;
}

export interface EnvironmentDefinition {
  id: EnvironmentId;
  label: string;
  shortLabel: string;
  tagline: string;
  description: string;
  illustration: string;
  illustrationAlt: string;
  strengths: readonly string[];
  reasons: readonly string[];
  colorAccent: string;
  practicalCharacteristics: readonly PracticalCharacteristic[];
}

export interface DirectionDefinition {
  id: DirectionId;
  label: string;
  shortLabel: string;
  tagline: string;
  description: string;
  illustration: string;
  strengths: readonly string[];
  reasons: readonly string[];
  colorAccent: string;
}

export const isCompleteAssessment = (
  answers: AssessmentAnswers,
): answers is CompleteAssessmentAnswers =>
  Object.values(answers).every((answer) => answer !== null);
