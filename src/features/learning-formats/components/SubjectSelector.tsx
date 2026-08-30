/**
 * SECTION 03 (part 1) — "Build Their Program"
 *
 * Multi-select. Add / remove any number of eligible subjects. Changing this
 * never touches the assessment answers.
 */

import { cn } from "@/lib/utils";
import { subjectLabel } from "../config/subjects";
import type { SubjectId } from "../logic/types";
import { WF } from "./wireframe";

interface SubjectSelectorProps {
  eligibleSubjects: SubjectId[];
  selected: SubjectId[];
  onToggle: (subject: SubjectId) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

const SubjectSelector = ({
  eligibleSubjects,
  selected,
  onToggle,
  onSelectAll,
  onClear,
}: SubjectSelectorProps) => {
  const allSelected =
    eligibleSubjects.length > 0 && selected.length === eligibleSubjects.length;

  return (
    <div>
      <p className={WF.h3}>Now let&apos;s look at what they need help with.</p>
      <p className={cn(WF.body, "mt-1")}>
        Select all subjects you&apos;d like support with.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {eligibleSubjects.map((subject) => {
          const checked = selected.includes(subject);
          return (
            <label
              key={subject}
              className={cn(
                WF.option,
                checked ? WF.optionSelected : WF.optionIdle,
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(subject)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-gold"
              />
              <span className="font-medium">{subjectLabel(subject)}</span>
            </label>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className={WF.btnGhost}
          onClick={onSelectAll}
          disabled={allSelected}
        >
          Select all
        </button>
        <button
          type="button"
          className={WF.btnGhost}
          onClick={onClear}
          disabled={selected.length === 0}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SubjectSelector;
