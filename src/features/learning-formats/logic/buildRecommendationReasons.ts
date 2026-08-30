/**
 * REASON GENERATION
 *
 * Produces 2–4 parent-facing reasons derived from the actual answers and
 * signals — never a single hard-coded list. Reasons are phrased tentatively
 * ("appears", "may benefit") and never claim certainty.
 *
 * WHERE TO EDIT REASON COPY / TRIGGERS: the `REASON_RULES` array below.
 */

import type { AssessmentState, Environment, Signals } from "./types.ts";

interface ReasonRule {
  environment: Environment | "any";
  /** Higher = preferred when trimming to 4. */
  priority: number;
  text: string;
  when: (answers: AssessmentState["answers"], signals: Signals) => boolean;
}

const MIN_REASONS = 2;
const MAX_REASONS = 4;

const REASON_RULES: ReasonRule[] = [
  // --- PRIVATE ---
  {
    environment: "private",
    priority: 100,
    text: "Currently tends to rely on someone working through problems with them.",
    when: (a) => a.q2 === "a",
  },
  {
    environment: "private",
    priority: 90,
    text: "May benefit from a lower-pressure setting while confidence builds.",
    when: (_a, s) => s.confidenceSupportSignal >= 2,
  },
  {
    environment: "private",
    priority: 80,
    text: "May benefit from focused work on specific gaps or foundations.",
    when: (_a, s) => s.foundationSignal >= 2,
  },
  {
    environment: "private",
    priority: 60,
    text: "Points to a clear preference for closer, step-by-step explanation.",
    when: (_a, s) => s.privateScore - s.classScore >= 4,
  },
  {
    environment: "private",
    priority: 20,
    text: "Lets the tutor check understanding one concept at a time.",
    when: () => true,
  },
  {
    environment: "private",
    priority: 10,
    text: "Lets the pace follow the student rather than a group.",
    when: () => true,
  },

  // --- CLASS ---
  {
    environment: "class",
    priority: 100,
    text: "Appears comfortable working with some independence.",
    when: (a) => a.q2 === "c" || a.q2 === "d",
  },
  {
    environment: "class",
    priority: 95,
    text: "May benefit from being extended alongside capable peers.",
    when: (_a, s) => s.challengeSignal >= 3,
  },
  {
    environment: "class",
    priority: 85,
    text: "Responds well to structure, routine and regular checkpoints.",
    when: (_a, s) => s.accountabilitySignal >= 2,
  },
  {
    environment: "class",
    priority: 60,
    text: "Generally keeps up well with structured teaching.",
    when: (_a, s) => s.classScore - s.privateScore >= 4,
  },
  {
    environment: "class",
    priority: 20,
    text: "Benefits from seeing how other students approach the same problem.",
    when: () => true,
  },
  {
    environment: "class",
    priority: 10,
    text: "A structured lesson sequence suits how they currently work.",
    when: () => true,
  },
];

export function buildRecommendationReasons(
  answers: AssessmentState["answers"],
  signals: Signals,
  environment: Environment,
): string[] {
  const matches = REASON_RULES.filter(
    (rule) =>
      (rule.environment === environment || rule.environment === "any") &&
      rule.when(answers, signals),
  ).sort((a, b) => b.priority - a.priority);

  const chosen: string[] = [];
  for (const rule of matches) {
    if (chosen.includes(rule.text)) continue;
    chosen.push(rule.text);
    if (chosen.length >= MAX_REASONS) break;
  }

  // Guaranteed to reach MIN_REASONS because two `when: () => true` rules exist
  // per environment.
  return chosen.slice(0, Math.max(MIN_REASONS, chosen.length));
}
