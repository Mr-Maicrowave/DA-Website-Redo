import { getStageQuestions } from "../config/questions.ts";
import { calculateEnvironment } from "./calculateEnvironment.ts";
import { calculateSignals } from "./calculateSignals.ts";
import type { AssessmentState, AssessmentTag } from "./types.ts";

export interface JourneyStartingPoint {
  outcome: "private" | "class" | "both";
  label: "PRIVATE LEARNING" | "CLASS LEARNING" | "BOTH COULD WORK";
  summary: string;
  reasons: string[];
}

const REASONS: Record<AssessmentTag, string> = {
  confidence: "Confidence appears to be affecting how they respond when work becomes difficult.",
  foundation: "They may benefit from having gaps identified before moving forward.",
  independence: "They appear comfortable working independently once concepts are explained.",
  challenge: "They may benefit from learning alongside motivated peers and being appropriately challenged.",
  advanced: "They appear ready for an environment that maintains pace and academic challenge.",
  consistency: "Structure and consistency may be more important than intensive one-to-one support.",
  examTechnique: "Regular exam-focused practice may help turn their understanding into stronger marks.",
};

function selectedTags(state: AssessmentState): AssessmentTag[] {
  const tags: AssessmentTag[] = [];
  for (const question of getStageQuestions(state.stage)) {
    const selected = question.options.find((option) => option.id === state.answers[question.slot]);
    if (selected?.tags) tags.push(...selected.tags);
  }
  return [...new Set(tags)];
}

export function buildJourneyStartingPoint(state: AssessmentState): JourneyStartingPoint | null {
  const questions = getStageQuestions(state.stage);
  if (!state.stage || !questions.every((question) => state.answers[question.slot])) return null;
  const environment = calculateEnvironment(calculateSignals(state));
  const tags = selectedTags(state);
  if (environment.close) {
    return {
      outcome: "both",
      label: "BOTH COULD WORK",
      summary: "Both environments could suit them.",
      reasons: [
        "Their answers show a balanced need for individual support and structured progression.",
        "We'd use the consultation to understand which environment feels more natural in practice.",
      ],
    };
  }
  const outcome = environment.primaryEnvironment;
  const preferredTags: AssessmentTag[] = outcome === "private"
    ? ["foundation", "confidence", "examTechnique", "consistency"]
    : ["independence", "consistency", "challenge", "advanced", "examTechnique"];
  const reasons = preferredTags.filter((tag) => tags.includes(tag)).map((tag) => REASONS[tag]).slice(0, 3);
  if (outcome === "private" && reasons.length < 3) reasons.push("Closer checking would allow the lesson to adapt when something hasn't clicked.");
  return {
    outcome,
    label: outcome === "private" ? "PRIVATE LEARNING" : "CLASS LEARNING",
    summary: outcome === "private"
      ? "A more individual environment may be the stronger starting point."
      : "A structured class environment may be the stronger starting point.",
    reasons: reasons.slice(0, 3),
  };
}
