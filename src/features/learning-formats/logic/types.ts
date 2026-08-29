/**
 * Shared types for the Learning Formats decision tool.
 *
 * LAYER A — Core learning environment: PRIVATE or CLASS (from the journey).
 * LAYER B — Subject-specific / specialist programs (from subject selection).
 *
 * Content lives in /config. Logic lives in /logic. State lives in /state.
 * Presentation lives in /components. Keep these separated.
 */

export type LearningStage = "primary" | "high-school" | "hsc";

export type Environment = "private" | "class";

export type SubjectId =
  | "english"
  | "maths"
  | "science"
  | "physics"
  | "chemistry"
  | "biology"
  | "business-studies"
  | "legal-studies";

/** Answer slot within a stage's assessment (Q1–Q4). */
export type QuestionSlot = "q1" | "q2" | "q3" | "q4";

/** Keys for a subject follow-up answer. Only specialist subjects have one. */
export type SubjectFollowUpKey =
  | "primaryEnglish"
  | "highSchoolEnglish"
  | "highSchoolMaths"
  | "hscEnglish"
  | "hscMaths";

/**
 * Every score / signal the engine tracks. Names mirror the DA spec 1:1 so the
 * scoring rules in /config are easy to audit against the brief.
 *
 * `privateScore` / `classScore` decide LAYER A.
 * The `*Signal` values feed tie-breaks, reason generation and LAYER B.
 */
export type SignalKey =
  | "privateScore"
  | "classScore"
  | "challengeSignal"
  | "confidenceSupportSignal"
  | "foundationSignal"
  | "creativeWritingSignal"
  | "accuracySignal"
  | "accountabilitySignal"
  | "assessmentSignal"
  | "organisationSignal"
  | "examReadinessSignal"
  | "hscPrepSignal"
  | "trialSignal"
  | "focusMathsSignal"
  | "focusEnglishSignal";

export type Signals = Record<SignalKey, number>;

export type ScoreMap = Partial<Record<SignalKey, number>>;

export type AssessmentTag = "confidence" | "foundation" | "independence" | "challenge" | "examTechnique" | "advanced" | "consistency";

export interface QuestionOption {
  /** Stable id (a, b, c, …) — persisted, so never renumber. */
  id: string;
  label: string;
  /** Score / signal deltas applied when this option is chosen. */
  scores?: ScoreMap;
  /** Observable behaviour themes retained for parent-facing reasons. */
  tags?: AssessmentTag[];
  /**
   * For subject follow-ups that classify a need rather than only score
   * (High School English, HSC English).
   */
  need?: string;
}

export interface AssessmentQuestionConfig {
  /** Answer slot this question fills. */
  slot: QuestionSlot;
  stage: LearningStage;
  question: string;
  options: QuestionOption[];
}

export interface SubjectFollowUpConfig {
  key: SubjectFollowUpKey;
  subject: SubjectId;
  stage: LearningStage;
  question: string;
  options: QuestionOption[];
}

/** The full persisted assessment state. */
export interface AssessmentState {
  year: number | null;
  stage: LearningStage | null;
  answers: Partial<Record<QuestionSlot, string>>;
  selectedSubjects: SubjectId[];
  subjectAnswers: Partial<Record<SubjectFollowUpKey, string>>;
}

export type SpecialistConfidence = "possible" | "worth-exploring" | "strong";

export interface SpecialistRecommendation {
  id: string;
  label: string;
  reason: string;
  confidence: SpecialistConfidence;
}

export interface SubjectRecommendation {
  subject: SubjectId;
  subjectLabel: string;
  environment: Environment;
  reason: string;
  /** Follow-up needed for this subject at this stage but not yet answered. */
  needsFollowUp: boolean;
  specialistPrograms: SpecialistRecommendation[];
}

export interface EnvironmentResult {
  primaryEnvironment: Environment;
  secondaryEnvironment?: Environment;
  /** Absolute gap between privateScore and classScore. Internal only. */
  scoreDifference: number;
  /** True when the result is a genuine coin-flip resolved by tie-break. */
  close: boolean;
}

export interface Recommendation {
  primaryEnvironment: Environment;
  secondaryEnvironment?: Environment;
  close: boolean;
  reasons: string[];
  subjects: SubjectRecommendation[];
}
