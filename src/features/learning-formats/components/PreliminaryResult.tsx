/** The soft "starting point" banner shown as soon as the assessment is done. */

import { cn } from "@/lib/utils";
import { envLabel } from "../logic/calculateSubjectRecommendations";
import type { Recommendation } from "../logic/types";
import { WF } from "./wireframe";

interface PreliminaryResultProps {
  recommendation: Recommendation;
}

const PreliminaryResult = ({ recommendation }: PreliminaryResultProps) => {
  const { primaryEnvironment, secondaryEnvironment, close } = recommendation;

  return (
    <div className={cn(WF.card, "border-brand-gold/50 bg-brand-gold/5")}>
      <p className={WF.sectionKicker}>Preliminary starting point</p>
      <p className="mt-2 font-heading text-xl font-semibold text-brand-navy">
        Based on what you&apos;ve told us, we&apos;d explore{" "}
        {envLabel(primaryEnvironment)} first.
      </p>
      {close && (
        <p className={cn(WF.body, "mt-1")}>
          Either environment could work — we&apos;d use your consultation to decide.
        </p>
      )}
      {secondaryEnvironment && !close && (
        <p className={cn(WF.body, "mt-1")}>
          {envLabel(secondaryEnvironment)} is also worth exploring.
        </p>
      )}
      <p className={cn(WF.body, "mt-3")}>
        This is a preliminary recommendation, not a diagnosis.
      </p>
      <p className={cn(WF.body, "mt-3")}>
        Next, choose the subjects you&apos;d like support with — you won&apos;t
        need to repeat this assessment.
      </p>
    </div>
  );
};

export default PreliminaryResult;
