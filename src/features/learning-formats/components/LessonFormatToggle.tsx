/** PRIVATE / CLASS toggle for Section 01. Presentation only — no scoring. */

import { cn } from "@/lib/utils";
import type { Environment } from "../logic/types";
import { WF } from "./wireframe";

interface LessonFormatToggleProps {
  value: Environment;
  onChange: (value: Environment) => void;
}

const OPTIONS: { id: Environment; label: string }[] = [
  { id: "private", label: "Private Learning" },
  { id: "class", label: "Class Learning" },
];

const LessonFormatToggle = ({ value, onChange }: LessonFormatToggleProps) => (
  <div role="radiogroup" aria-label="Lesson format" className="inline-flex gap-2">
    {OPTIONS.map((option) => {
      const on = value === option.id;
      return (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={on}
          onClick={() => onChange(option.id)}
          className={cn(WF.toggle, on ? WF.toggleOn : WF.toggleOff)}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);

export default LessonFormatToggle;
