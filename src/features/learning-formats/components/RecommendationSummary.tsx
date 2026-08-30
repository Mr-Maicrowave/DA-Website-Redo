/**
 * SECTION 04 — "Your DA Pathway"
 *
 * Core environment + reasons, then one card per selected subject, then the CTA.
 * Updates immediately as answers change (fed straight from shared state).
 */

import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { envLabel } from "../logic/calculateSubjectRecommendations";
import type { Recommendation } from "../logic/types";
import SubjectRecommendationCard from "./SubjectRecommendationCard";
import { WF } from "./wireframe";

interface RecommendationSummaryProps {
  recommendation: Recommendation;
}

const RecommendationSummary = ({
  recommendation,
}: RecommendationSummaryProps) => {
  const { primaryEnvironment, secondaryEnvironment, close, reasons, subjects } =
    recommendation;

  return (
    <div className="grid gap-4">
      <div className={cn(WF.card, "border-brand-navy/25 bg-white")}>
        <p className={WF.sectionKicker}>Recommended learning environment</p>
        <p className="mt-1 font-heading text-2xl font-semibold text-brand-navy">
          Based on what you&apos;ve told us, we&apos;d explore{" "}
          {envLabel(primaryEnvironment)}.
        </p>

        {close && (
          <p className={cn(WF.body, "mt-1")}>
            This was a close result — both environments could suit them.
          </p>
        )}
        {secondaryEnvironment && !close && (
          <p className={cn(WF.body, "mt-1")}>
            <strong className="text-brand-navy">Also worth exploring:</strong>{" "}
            {envLabel(secondaryEnvironment)}.
          </p>
        )}

        {reasons.length > 0 && (
          <ul className="mt-3 grid gap-1.5">
            {reasons.map((reason) => (
              <li
                key={reason}
                className="flex gap-2 text-sm text-brand-navy/80"
              >
                <span aria-hidden className="text-brand-gold">
                  •
                </span>
                {reason}
              </li>
            ))}
          </ul>
        )}
      </div>

      {subjects.length > 0 && (
        <div className="grid gap-3">
          <p className={WF.sectionKicker}>Your DA pathway, subject by subject</p>
          {subjects.map((rec) => (
            <SubjectRecommendationCard key={rec.subject} rec={rec} />
          ))}
        </div>
      )}

      <div className={cn(WF.card, "border-brand-navy/25 bg-brand-navy text-white")}>
        <p className="font-heading text-xl font-semibold">Book an Interview</p>
        <p className="mt-1 text-sm text-white/80">
          This is a starting point. We&apos;ll listen to your concerns,
          understand your child&apos;s needs and confirm the best fit together.
        </p>
        <Link
          to="/book-interview"
          className={cn(
            WF.btnPrimary,
            "mt-3 bg-brand-gold text-brand-navy hover:bg-brand-gold/90",
          )}
        >
          Book an Interview
        </Link>
      </div>
    </div>
  );
};

export default RecommendationSummary;
