/**
 * CORE ENVIRONMENT DECISION  (Layer A)
 *
 * privateScore vs classScore, with a documented tie-break. Scores are
 * INTERNAL — never shown to parents.
 */

import { SECONDARY_ENVIRONMENT_MAX_GAP, TIE_BREAK } from "../config/scoringRules.ts";
import type { EnvironmentResult, Signals } from "./types.ts";

export function calculateEnvironment(signals: Signals): EnvironmentResult {
  const priv = signals.privateScore;
  const cls = signals.classScore;
  const scoreDifference = Math.abs(priv - cls);

  let primaryEnvironment: EnvironmentResult["primaryEnvironment"];
  let close = scoreDifference <= SECONDARY_ENVIRONMENT_MAX_GAP;

  if (priv > cls) {
    primaryEnvironment = "private";
  } else if (cls > priv) {
    primaryEnvironment = "class";
  } else {
    // Tie-break
    const supportPull =
      signals.confidenceSupportSignal + signals.foundationSignal;
    const independencePull =
      signals.challengeSignal + signals.accountabilitySignal;

    if (supportPull >= TIE_BREAK.privateSupportThreshold && supportPull > independencePull) {
      primaryEnvironment = "private";
      close = true;
    } else if (independencePull >= TIE_BREAK.classIndependenceThreshold) {
      primaryEnvironment = "class";
      close = true;
    } else {
      primaryEnvironment = TIE_BREAK.fallback;
      close = true;
    }
  }

  const result: EnvironmentResult = {
    primaryEnvironment,
    scoreDifference,
    close,
  };

  if (scoreDifference <= SECONDARY_ENVIRONMENT_MAX_GAP) {
    result.secondaryEnvironment =
      primaryEnvironment === "private" ? "class" : "private";
  }

  return result;
}
