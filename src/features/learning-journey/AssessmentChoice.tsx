import { type ReactNode } from "react";

interface AssessmentChoiceProps<T extends string> {
  name: string;
  value: T;
  title: string;
  description: string;
  selected: boolean;
  disabled: boolean;
  dimmed: boolean;
  illustration: ReactNode;
  onSelect: (value: T) => void;
}

export const AssessmentChoice = <T extends string>({
  name,
  value,
  title,
  description,
  selected,
  disabled,
  dimmed,
  illustration,
  onSelect,
}: AssessmentChoiceProps<T>) => {
  const descriptionId = `${name}-${value}-description`;
  return (
    <label
      className="assessment-choice"
      data-encounter-choice={value}
      data-selected={selected ? "true" : "false"}
      data-dimmed={dimmed ? "true" : "false"}
    >
      <input
        className="assessment-choice__input"
        type="radio"
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        aria-describedby={descriptionId}
        onChange={() => onSelect(value)}
      />
      <span className="assessment-choice__illustration" aria-hidden="true">
        {illustration}
        <span className="assessment-choice__gold-dot" data-selection-dot />
        <span className="assessment-choice__ripple" data-selection-ripple />
      </span>
      <span className="assessment-choice__copy">
        <strong>{title}</strong>
        <span id={descriptionId}>{description}</span>
        <i className="assessment-choice__accent" aria-hidden="true" />
      </span>
    </label>
  );
};
