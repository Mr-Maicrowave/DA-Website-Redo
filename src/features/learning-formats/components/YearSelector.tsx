/** STEP 0 — "What year is your child currently in?" */

import { useId } from "react";

import { cn } from "@/lib/utils";
import { SCHOOL_YEARS, stageForYear, stageLabel } from "../config/stages";
import { WF } from "./wireframe";

interface YearSelectorProps {
  value: number | null;
  onChange: (year: number) => void;
}

const YearSelector = ({ value, onChange }: YearSelectorProps) => {
  const labelId = useId();
  const stage = stageForYear(value);

  return (
    <fieldset>
      <legend id={labelId} className={cn(WF.h3, "mb-3")}>
        What year is your child currently in?
      </legend>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="grid grid-cols-3 gap-2 sm:grid-cols-4"
      >
        {SCHOOL_YEARS.map((year) => {
          const selected = value === year;
          return (
            <label
              key={year}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-md border px-3 py-2.5 text-sm font-medium transition-colors",
                selected ? WF.optionSelected : WF.optionIdle,
              )}
            >
              <input
                type="radio"
                name="lf-year"
                value={year}
                checked={selected}
                onChange={() => onChange(year)}
                className="sr-only"
              />
              Year {year}
            </label>
          );
        })}
      </div>
      {stage && (
        <p className={cn(WF.body, "mt-3")}>
          That places them in the{" "}
          <strong className="text-brand-navy">{stageLabel(stage)}</strong>{" "}
          question set.
        </p>
      )}
    </fieldset>
  );
};

export default YearSelector;
