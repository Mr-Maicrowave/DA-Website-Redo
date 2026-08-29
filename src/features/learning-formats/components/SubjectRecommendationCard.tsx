/** One subject row in "Your DA Pathway". */

import { cn } from "@/lib/utils";
import { envLabel } from "../logic/calculateSubjectRecommendations";
import type { SpecialistConfidence, SubjectRecommendation } from "../logic/types";
import { WF } from "./wireframe";

const CONFIDENCE_SUFFIX: Record<SpecialistConfidence, string> = {
  possible: "worth discussing at your interview",
  "worth-exploring": "worth exploring",
  strong: "a strong option",
};

interface SubjectRecommendationCardProps {
  rec: SubjectRecommendation;
}

const SubjectRecommendationCard = ({ rec }: SubjectRecommendationCardProps) => (
  <div className={WF.card}>
    <p className={WF.sectionKicker}>{rec.subjectLabel}</p>
    <p className="mt-1 font-heading text-lg font-semibold text-brand-navy">
      {envLabel(rec.environment)}
    </p>

    {rec.needsFollowUp ? (
      <p className={cn(WF.body, "mt-1 text-brand-gold")}>
        Answer the {rec.subjectLabel} follow-up above to see specialist options.
      </p>
    ) : (
      <>
        {rec.specialistPrograms.map((program) => (
          <div key={program.id} className="mt-2">
            <span
              className={cn(
                WF.chip,
                "border-brand-gold bg-brand-gold/10 text-brand-navy",
              )}
            >
              + {program.label} — {CONFIDENCE_SUFFIX[program.confidence]}
            </span>
            <p className="mt-1 text-sm text-brand-navy/70">{program.reason}</p>
          </div>
        ))}
      </>
    )}

    <p className={cn(WF.body, "mt-2")}>{rec.reason}</p>
  </div>
);

export default SubjectRecommendationCard;
