import { Atom, BookOpen, BriefcaseBusiness, Calculator, Check, CircleHelp, FlaskConical, Leaf, Lightbulb, Microscope, PenLine, Scale, type LucideIcon } from 'lucide-react';
import { SUBJECT_AREAS_BY_STAGE, SUBJECTS_BY_STAGE } from '../config.ts';
import { FieldError } from '../fields.tsx';
import { getSchoolStage, toggleSubject, toggleSubjectArea } from '../model.ts';
import type { InterviewFormData } from '../types.ts';
import type { FormErrors } from '../validation.ts';
import './StepSubjects.css';

const SUBJECT_ICONS: Record<string, LucideIcon> = {
  english: BookOpen,
  mathematics: Calculator,
  'creative-writing': PenLine,
  science: Microscope,
  biology: Leaf,
  chemistry: FlaskConical,
  physics: Atom,
  'business-studies': BriefcaseBusiness,
  'legal-studies': Scale,
};

export function StepSubjects({ data, errors, onChange, studentName }: { data: InterviewFormData; errors: FormErrors; onChange: (next: InterviewFormData) => void; studentName: string }) {
  const stage = getSchoolStage(data.schoolYear);
  if (!stage) return <FieldError id="subjects-error" error="Please choose a school year first." />;

  const subjectOptions = SUBJECTS_BY_STAGE[stage];
  const selectedSubjects = subjectOptions.filter(subject => data.subjects.includes(subject.value));

  return <div className="interview-subjects">
    <section className="interview-subject-decision" aria-labelledby="select-subjects-heading">
      <header className="interview-subject-section-heading">
        <span>01</span>
        <div><h3 id="select-subjects-heading">Select subjects</h3><p>Choose as many as apply.</p></div>
      </header>
      <div className="interview-subject-tiles">
        {subjectOptions.map(subject => {
          const Icon = SUBJECT_ICONS[subject.value] ?? BookOpen;
          const selected = data.subjects.includes(subject.value);
          return <button className="interview-subject-tile" type="button" key={subject.value} aria-pressed={selected} onClick={() => onChange(toggleSubject(data, subject.value))}>
            <Icon aria-hidden="true" /><strong>{subject.label}</strong><span className="interview-subject-indicator" aria-hidden="true">{selected ? <Check /> : null}</span>
          </button>;
        })}
      </div>
      <FieldError id="subjects-error" error={errors.subjects} />
      <p className="interview-subject-note"><Lightbulb aria-hidden="true" />We’ll ask about the specific areas next.</p>
    </section>

    {selectedSubjects.length > 0 ? <section className="interview-area-decision" aria-labelledby="select-areas-heading">
      <header className="interview-subject-section-heading">
        <span>02</span>
        <div><h3 id="select-areas-heading">Which areas would support {studentName} most?</h3><p>Select any that sound relevant. You can choose as many as you like.</p></div>
      </header>
      <div className="interview-area-groups">
        {selectedSubjects.map(subject => {
          const Icon = SUBJECT_ICONS[subject.value] ?? BookOpen;
          const areas = SUBJECT_AREAS_BY_STAGE[stage][subject.value] ?? [];
          const values = data.subjectAreas[subject.value] ?? [];
          return <fieldset className="interview-area-group" key={subject.value}>
            <legend><Icon aria-hidden="true" /><span>{subject.label}</span></legend>
            <div className="interview-topic-chips">
              {areas.map(area => {
                const selected = values.includes(area.value);
                const unsure = area.value.includes('not-sure');
                return <button className={unsure ? 'interview-topic-chip interview-topic-chip--unsure' : 'interview-topic-chip'} type="button" key={area.value} aria-pressed={selected} title={unsure ? 'That’s completely fine — we can work this out during the consultation.' : undefined} onClick={() => onChange(toggleSubjectArea(data, subject.value, area.value))}>
                  {unsure ? <CircleHelp aria-hidden="true" /> : null}<span>{area.label}</span>{selected ? <Check className="interview-topic-check" aria-hidden="true" /> : null}
                </button>;
              })}
            </div>
          </fieldset>;
        })}
      </div>
    </section> : null}
  </div>;
}
