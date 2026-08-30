/**
 * SUBJECT + SPECIALIST RECOMMENDATIONS  (Layer B)
 *
 * Every selected subject inherits the core environment (Private / Class).
 * On top of that, subjects with a specialist pathway may surface one or more
 * specialist programs — always ADDITIVE, never a replacement.
 */

import {
  getSubjectFollowUp,
  isSubjectAvailable,
  subjectLabel,
} from "../config/subjects.ts";
import {
  HIGH_SCHOOL_ENGLISH_COPY,
  HIGH_SCHOOL_ENGLISH_RULES,
  HSC_FOCUS_ENGLISH_RULES,
  SPECIALIST_PROGRAMS,
} from "../config/specialistPrograms.ts";
import {
  HIGH_SCHOOL_ENGLISH_GATES,
  SPECIALIST_THRESHOLDS,
} from "../config/scoringRules.ts";
import type {
  AssessmentState,
  Environment,
  LearningStage,
  Signals,
  SpecialistConfidence,
  SpecialistRecommendation,
  SubjectId,
  SubjectRecommendation,
} from "./types.ts";

/**
 * Maps a signal value to a confidence label, or null when the program should
 * not surface at all. A program is only ever shown at "worth-exploring" or
 * "strong" — "possible" is reserved for future manual use.
 */
function confidenceFor(
  value: number,
  surface: number,
  strong: number,
): SpecialistConfidence | null {
  if (value >= strong) return "strong";
  if (value >= surface) return "worth-exploring";
  return null;
}

function envLabel(env: Environment): string {
  return env === "private" ? "Private Learning" : "Class Learning";
}

function subjectReason(env: Environment, subject: SubjectId): string {
  const label = subjectLabel(subject);
  return env === "private"
    ? `${label} would run in the same individual setting, so explanations and checking stay closely matched to them.`
    : `${label} would run in the same structured class setting, with regular checking across the group.`;
}

/** The `highSchoolEnglishNeed` / `hscEnglishNeed` picked, if any. */
function needFromAnswer(
  state: AssessmentState,
  key: "highSchoolEnglish" | "hscEnglish",
): string | null {
  const answerId = state.subjectAnswers[key];
  if (!answerId) return null;
  const followUp =
    key === "highSchoolEnglish"
      ? getSubjectFollowUp("english", "high-school")
      : getSubjectFollowUp("english", "hsc");
  return followUp?.options.find((o) => o.id === answerId)?.need ?? null;
}

// ---------------------------------------------------------------------------

function primaryEnglishSpecialists(signals: Signals): SpecialistRecommendation[] {
  const t = SPECIALIST_THRESHOLDS.creativeWriting;
  const confidence = confidenceFor(
    signals.creativeWritingSignal,
    t.surface,
    t.strong,
  );
  if (!confidence) return [];
  return [
    {
      id: "creative-writing",
      label: SPECIALIST_PROGRAMS["creative-writing"].label,
      reason:
        "Their writing answers point to wanting more idea development, detail and expression.",
      confidence,
    },
  ];
}

/**
 * YEAR 7–10 ENGLISH (confirmed rules)
 *
 *   general-support  -> no specialist (Private/Class only)
 *   creative-writing -> Creative Writing (on choice alone)
 *   gat              -> GAT English, softened under strong support signals
 *   bullet           -> Bullet English, strict triple gate else "discuss at interview"
 *   focus            -> Focus English (on choice alone)
 */
function highSchoolEnglishSpecialists(
  state: AssessmentState,
  signals: Signals,
): SpecialistRecommendation[] {
  const need = needFromAnswer(state, "highSchoolEnglish");
  if (!need) return [];
  const rule = HIGH_SCHOOL_ENGLISH_RULES.find((r) => r.need === need);
  if (!rule || !rule.programId) return []; // unknown need or general support

  const label = SPECIALIST_PROGRAMS[rule.programId].label;
  const make = (
    reason: string,
    confidence: SpecialistConfidence,
  ): SpecialistRecommendation[] => [{ id: rule.programId!, label, reason, confidence }];

  // Signals from the earlier (core) assessment.
  const challengeReadiness = signals.challengeSignal;
  const independence = signals.classScore - signals.privateScore;
  const supportPull =
    signals.confidenceSupportSignal + signals.foundationSignal;
  const privateLead = signals.privateScore - signals.classScore;

  if (rule.gate === "none") {
    return make(
      need === "creative-writing"
        ? HIGH_SCHOOL_ENGLISH_COPY.creativeWriting
        : HIGH_SCHOOL_ENGLISH_COPY.focus,
      "worth-exploring",
    );
  }

  if (rule.gate === "gat") {
    const g = HIGH_SCHOOL_ENGLISH_GATES.gat;
    const soften =
      supportPull >= g.softenWhenSupportPullAtLeast ||
      privateLead >= g.softenWhenPrivateLeadAtLeast;
    const ready =
      challengeReadiness >= g.minChallengeReadiness &&
      independence >= g.minIndependence;
    return ready && !soften
      ? make(HIGH_SCHOOL_ENGLISH_COPY.gatFull, "worth-exploring")
      : make(HIGH_SCHOOL_ENGLISH_COPY.gatSoften, "possible");
  }

  // rule.gate === "bullet" — strictest: all three gates must pass.
  const b = HIGH_SCHOOL_ENGLISH_GATES.bullet;
  const performance = signals.challengeSignal + signals.accuracySignal;
  const eligible =
    challengeReadiness >= b.minChallengeReadiness &&
    performance >= b.minPerformance &&
    independence >= b.minIndependence;
  return eligible
    ? make(HIGH_SCHOOL_ENGLISH_COPY.bulletFull, "worth-exploring")
    : make(HIGH_SCHOOL_ENGLISH_COPY.bulletFallback, "possible");
}

function highSchoolMathsSpecialists(signals: Signals): SpecialistRecommendation[] {
  const t = SPECIALIST_THRESHOLDS.focusMaths;
  const confidence = confidenceFor(signals.focusMathsSignal, t.surface, t.strong);
  if (!confidence) return [];
  return [
    {
      id: "focus-maths",
      label: SPECIALIST_PROGRAMS["focus-maths"].label,
      reason:
        "School-specific alignment and current assessment support are the main priority selected.",
      confidence,
    },
  ];
}

function hscEnglishSpecialists(
  state: AssessmentState,
  signals: Signals,
): SpecialistRecommendation[] {
  const rule = HSC_FOCUS_ENGLISH_RULES;
  if (!rule.enabled) return [];
  const need = needFromAnswer(state, "hscEnglish");
  if (need && rule.matchingNeeds.length === 0 && SPECIALIST_THRESHOLDS.focusEnglish.surface === 999) {
    return [{ id: rule.programId, label: SPECIALIST_PROGRAMS[rule.programId].label, reason: "The best HSC English pathway depends on the priority you selected and is worth confirming together.", confidence: "possible" }];
  }
  const needMatch = need != null && rule.matchingNeeds.includes(need);
  const t = SPECIALIST_THRESHOLDS.focusEnglish;
  const signalMatch =
    rule.useSignalThreshold && signals.focusEnglishSignal >= t.surface;
  if (!needMatch && !signalMatch) return [];
  return [
    {
      id: rule.programId,
      label: SPECIALIST_PROGRAMS[rule.programId].label,
      reason: "Matches the English priority you selected.",
      confidence: signals.focusEnglishSignal >= t.strong ? "strong" : "worth-exploring",
    },
  ];
}

function hscMathsSpecialists(signals: Signals): SpecialistRecommendation[] {
  const out: SpecialistRecommendation[] = [];
  const prep = SPECIALIST_THRESHOLDS.hscPrep;
  const trial = SPECIALIST_THRESHOLDS.trialClass;

  const prepConfidence = confidenceFor(
    signals.hscPrepSignal,
    prep.surface,
    prep.strong,
  );
  if (prepConfidence) {
    out.push({
      id: "hsc-prep",
      label: SPECIALIST_PROGRAMS["hsc-prep"].label,
      reason:
        "Points to needing systematic, whole-course preparation rather than ad-hoc study.",
      confidence: prepConfidence,
    });
  }

  const trialConfidence = confidenceFor(
    signals.trialSignal,
    trial.surface,
    trial.strong,
  );
  if (trialConfidence) {
    out.push({
      id: "trial-class",
      label: SPECIALIST_PROGRAMS["trial-class"].label,
      reason:
        "Points to losing marks on timing, exam pressure and avoidable mistakes.",
      confidence: trialConfidence,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------

function specialistsForSubject(
  subject: SubjectId,
  stage: LearningStage,
  state: AssessmentState,
  signals: Signals,
): SpecialistRecommendation[] {
  if (subject === "english") {
    if (stage === "primary") return primaryEnglishSpecialists(signals);
    if (stage === "high-school") return highSchoolEnglishSpecialists(state, signals);
    if (stage === "hsc") return hscEnglishSpecialists(state, signals);
  }
  if (subject === "maths") {
    if (stage === "high-school") return highSchoolMathsSpecialists(signals);
    if (stage === "hsc") return hscMathsSpecialists(signals);
  }
  return [];
}

export function calculateSubjectRecommendations(
  state: AssessmentState,
  signals: Signals,
  environment: Environment,
): SubjectRecommendation[] {
  const stage = state.stage;
  if (!stage) return [];

  return state.selectedSubjects
    .filter((subject) => isSubjectAvailable(subject, state.year, stage))
    .map((subject) => {
      const followUp = getSubjectFollowUp(subject, stage);
      const needsFollowUp =
        followUp != null && !state.subjectAnswers[followUp.key];

      return {
        subject,
        subjectLabel: subjectLabel(subject),
        environment,
        reason: subjectReason(environment, subject),
        needsFollowUp,
        specialistPrograms: needsFollowUp
          ? []
          : specialistsForSubject(subject, stage, state, signals),
      };
    });
}

export { envLabel };
