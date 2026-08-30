/** Simple "Question X of N" progress indicator. */

import { WF } from "./wireframe";

interface AssessmentProgressProps {
  current: number; // 1-indexed
  total: number;
}

const AssessmentProgress = ({ current, total }: AssessmentProgressProps) => {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-4">
      <p className={WF.sectionKicker}>
        Question {current} of {total}
      </p>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-navy/10"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="h-full bg-brand-gold transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default AssessmentProgress;
