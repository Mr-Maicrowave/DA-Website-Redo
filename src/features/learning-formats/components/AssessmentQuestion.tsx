/**
 * A single radio-group question. Used for both the core assessment and the
 * subject follow-ups. Semantic radios, keyboard operable.
 */

import { useId } from "react";

import { cn } from "@/lib/utils";
import type { QuestionOption } from "../logic/types";
import { WF } from "./wireframe";

interface AssessmentQuestionProps {
  question: string;
  options: QuestionOption[];
  value: string | undefined;
  onChange: (optionId: string) => void;
  /** Unique within the page — keeps radio groups independent. */
  name: string;
}

const AssessmentQuestion = ({
  question,
  options,
  value,
  onChange,
  name,
}: AssessmentQuestionProps) => {
  const labelId = useId();

  return (
    <fieldset>
      <legend id={labelId} className={cn(WF.h3, "mb-3")}>
        {question}
      </legend>
      <div role="radiogroup" aria-labelledby={labelId} className="grid gap-2">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <label
              key={option.id}
              className={cn(
                WF.option,
                selected ? WF.optionSelected : WF.optionIdle,
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-gold"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

export default AssessmentQuestion;
