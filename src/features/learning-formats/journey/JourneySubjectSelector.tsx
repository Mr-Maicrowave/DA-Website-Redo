import { subjectLabel } from "../config/subjects";
import type { LearningStage, SubjectId } from "../logic/types";
import { journeyAssets } from "./journeyAssets";
import { subjectContinueLabel } from "./subjectJourney";
import type { CSSProperties } from "react";

interface JourneySubjectSelectorProps {
  stage: LearningStage;
  eligibleSubjects: SubjectId[];
  selected: SubjectId[];
  confirmed: boolean;
  onToggle: (subject: SubjectId) => void;
  onContinue: () => void;
}

const JourneySubjectSelector = ({ stage, eligibleSubjects, selected, confirmed, onToggle, onContinue }: JourneySubjectSelectorProps) => (
  <section className="lf-subject-destination" data-stage={stage} aria-labelledby="lf-subject-heading">
    <div className="lf-subject-merge" aria-hidden="true">
      <svg viewBox="0 0 900 120" preserveAspectRatio="none">
        <path className="lf-subject-merge__route lf-subject-merge__route--primary" d="M0 16 C120 16 145 60 250 60" />
        <path className="lf-subject-merge__route lf-subject-merge__route--high" d="M0 60 L250 60" />
        <path className="lf-subject-merge__route lf-subject-merge__route--hsc" d="M0 104 C120 104 145 60 250 60" />
        <path className="lf-subject-merge__shared" d="M250 60 C470 56 670 65 900 60" />
      </svg>
      <img src={journeyAssets.shared.books.src} alt="" />
    </div>
    {!confirmed ? <>
      <div className="lf-subject-destination__heading">
        <p>Now let&apos;s look at subjects.</p>
        <h2 id="lf-subject-heading">Which subjects would you like support with?</h2>
        <span>Select as many as are relevant.</span>
      </div>
      <div className="lf-subject-options" role="group" aria-labelledby="lf-subject-heading">
        {eligibleSubjects.map((subject) => {
          const checked = selected.includes(subject);
          return <label key={subject} className="lf-subject-option" data-selected={checked ? "true" : "false"}>
            <input type="checkbox" checked={checked} onChange={() => onToggle(subject)} />
            <span>{subjectLabel(subject)}</span>
          </label>;
        })}
      </div>
      <div className="lf-subject-collection" aria-live="polite" aria-label="Selected subjects">
        {selected.length === 0 ? <p>Your selected subjects will collect here.</p> : selected.map((subject, index) => <span key={subject} style={{ "--token-index": index } as CSSProperties}>{subjectLabel(subject)}</span>)}
      </div>
      <button type="button" className="lf-subject-continue" disabled={selected.length === 0} onClick={onContinue}>{subjectContinueLabel(selected.length)}</button>
    </> : <div className="lf-subject-confirmed" aria-live="polite"><p>Subjects selected</p><h2>Your subject pathways are ready to refine.</h2></div>}
  </section>
);

export default JourneySubjectSelector;
