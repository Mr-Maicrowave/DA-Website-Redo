import { type KeyboardEvent, type ReactNode } from "react";

import { type EncounterPhase } from "./assessmentTypes";

interface AssessmentEncounterProps {
  id?: string;
  label: string;
  heading: string;
  supportingText: string;
  phase: EncounterPhase;
  children: ReactNode;
  confirmationText?: string;
}

export const AssessmentEncounter = ({
  id = "academic-level",
  label,
  heading,
  supportingText,
  phase,
  children,
  confirmationText = "Got it.",
}: AssessmentEncounterProps) => {
  const handleKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
    const radios = Array.from(
      event.currentTarget.querySelectorAll<HTMLInputElement>('input[type="radio"]:not(:disabled)'),
    );
    if (!radios.length) return;
    event.preventDefault();
    const current = Math.max(0, radios.indexOf(document.activeElement as HTMLInputElement));
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = radios[(current + direction + radios.length) % radios.length];
    next.focus();
    next.click();
  };

  return (
    <article
      className="assessment-encounter"
      data-encounter={id}
      data-encounter-phase={phase}
    >
      <header className="assessment-encounter__header">
        <p className="assessment-encounter__label" data-encounter-label>{label}</p>
        <h2 id={`${id}-heading`} data-encounter-heading>{heading}</h2>
        <p data-encounter-support>{supportingText}</p>
      </header>
      <div
        className="assessment-encounter__choices"
        role="radiogroup"
        aria-labelledby={`${id}-heading`}
        onKeyDown={handleKeys}
      >
        {children}
      </div>
      <p
        className="assessment-encounter__confirmation"
        aria-live="polite"
        data-encounter-confirmation
      >
        {phase === "confirming" ? confirmationText : ""}
      </p>
    </article>
  );
};
