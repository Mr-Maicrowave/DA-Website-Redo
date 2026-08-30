/**
 * SCORING RULES / THRESHOLDS
 * =========================
 *
 * Every tunable number the recommendation engine uses lives here. Changing a
 * value here changes behaviour without touching logic code.
 */

import type { Environment } from "../logic/types.ts";

/**
 * If |privateScore - classScore| is at or below this, the losing environment
 * is surfaced as "Also worth exploring".
 */
export const SECONDARY_ENVIRONMENT_MAX_GAP = 2;

/**
 * Tie-break when privateScore === classScore.
 *
 * 1. Strong need for direct support / foundations / low confidence  -> PRIVATE
 * 2. Relatively independent / challenge-seeking / structured        -> CLASS
 * 3. Still tied                                                     -> CLASS
 *    (stated clearly as a close result)
 */
export const TIE_BREAK = {
  /** confidenceSupportSignal + foundationSignal >= this  ->  PRIVATE */
  privateSupportThreshold: 3,
  /** challengeSignal + accountabilitySignal >= this      ->  CLASS */
  classIndependenceThreshold: 3,
  /** Final fallback environment when everything is level. */
  fallback: "class" as Environment,
};

/**
 * SPECIALIST-PROGRAM THRESHOLDS (Layer B)
 *
 * A program is only ever surfaced as "worth exploring" / "possible" /
 * "strong" — it is ADDED to the core Private/Class recommendation, never a
 * replacement for it.
 */
export const SPECIALIST_THRESHOLDS = {
  /** Creative Writing (Primary English): creativeWritingSignal */
  creativeWriting: { surface: 3, strong: 5 },

  /** Focus Maths (High School Maths): focusMathsSignal + challengeSignal */
  focusMaths: { surface: 3, strong: 6 },

  /** HSC Prep (HSC Maths): hscPrepSignal */
  hscPrep: { surface: 3, strong: 5 },

  /** Trial Class (HSC Maths): trialSignal */
  trialClass: { surface: 3, strong: 5 },

  /**
   * Focus English (HSC English): focusEnglishSignal.
   * `surface` is deliberately unreachable until DA confirms the real rule.
   * See HSC_FOCUS_ENGLISH_RULES in ./specialistPrograms.ts.
   */
  focusEnglish: { surface: 999, strong: 999 },
};

/**
 * YEAR 7–10 ENGLISH SPECIALIST GATES  (confirmed Aug 2026)
 *
 * The parent picks one need in the English follow-up. Creative Writing and
 * Focus surface on that choice alone. GAT and Bullet additionally require
 * core-assessment signals:
 *
 *   challengeReadiness = challengeSignal                     (wants harder work)
 *   independence       = classScore - privateScore           (class-ready, net)
 *   supportPull        = confidenceSupportSignal + foundationSignal
 *   privateLead        = privateScore - classScore
 *
 * Tune every number here — no thresholds live in the logic or components.
 */
export const HIGH_SCHOOL_ENGLISH_GATES = {
  gat: {
    /** Minimum challengeSignal for GAT to be a full recommendation. */
    minChallengeReadiness: 2,
    /** Minimum (classScore - privateScore); 0 = "not private-leaning". */
    minIndependence: 0,
    /**
     * If the student looks strongly support-oriented, GAT is softened to
     * "worth discussing at your interview" instead of a primary specialist.
     * Trigger when EITHER holds:
     */
    softenWhenSupportPullAtLeast: 5, // confidenceSupportSignal + foundationSignal
    softenWhenPrivateLeadAtLeast: 4, // privateScore - classScore
  },
  bullet: {
    /** Strictest pathway — ALL three gates must pass. */
    minChallengeReadiness: 3, // strong "wants challenge / performing strongly"
    minPerformance: 4, // challengeSignal + accuracySignal (sharp, precise, capable)
    minIndependence: 2, // classScore - privateScore (clearly class-ready)
  },
} as const;
