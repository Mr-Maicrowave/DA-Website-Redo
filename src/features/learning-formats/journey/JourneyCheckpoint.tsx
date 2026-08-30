import { useId, type CSSProperties } from "react";

import type { AssessmentQuestionConfig } from "../logic/types";

interface JourneyCheckpointProps {
  question: AssessmentQuestionConfig;
  index: number;
  total: number;
  value?: string;
  context?: string;
  disabled?: boolean;
  onSelect: (optionId: string) => void;
  onBack?: () => void;
  backLabel?: string;
}

const JourneyCheckpoint = ({
  question,
  index,
  total,
  value,
  context,
  disabled = false,
  onSelect,
  onBack,
  backLabel = "← Previous question",
}: JourneyCheckpointProps) => {
  const legendId = useId();

  return (
    <section className="lf-journey-checkpoint" aria-labelledby={legendId}>
      <p className="lf-journey-checkpoint__count">Question {index + 1} of {total}</p>
      <fieldset disabled={disabled}>
        <legend id={legendId}>{question.question}</legend>
        {context && <p className="lf-journey-checkpoint__context">{context}</p>}
        <div className="lf-journey-checkpoint__choices">
          {question.options.map((option, optionIndex) => (
            <label
              key={option.id}
              className="lf-journey-choice"
              data-selected={value === option.id ? "true" : "false"}
              style={{ "--choice-index": optionIndex } as CSSProperties}
            >
              <input
                type="radio"
                name={`journey-${question.stage}-${question.slot}`}
                value={option.id}
                checked={value === option.id}
                onChange={() => onSelect(option.id)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {onBack && <button type="button" className="lf-checkpoint-back" onClick={onBack} disabled={disabled}>{backLabel}</button>}
    </section>
  );
};

export default JourneyCheckpoint;
