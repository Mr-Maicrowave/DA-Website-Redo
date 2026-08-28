import { SUBJECT_AREAS_BY_STAGE, SUBJECTS_BY_STAGE } from '../config.ts';
import { FieldError, MultiChoice } from '../fields.tsx';
import { getSchoolStage, toggleSubject, toggleSubjectArea } from '../model.ts';
import type { InterviewFormData } from '../types.ts';
import type { FormErrors } from '../validation.ts';

export function StepSubjects({ data, errors, onChange }: { data: InterviewFormData; errors: FormErrors; onChange: (next: InterviewFormData) => void }) {
  const stage = getSchoolStage(data.schoolYear);
  if (!stage) return <FieldError id="subjects-error" error="Please choose a school year first." />;
  return <div className="interview-wizard-stack">
    <MultiChoice id="subjects" label="Which subjects would you like help with?" hint="Choose as many as apply." options={SUBJECTS_BY_STAGE[stage]} values={data.subjects} onToggle={subject => onChange(toggleSubject(data, subject))} error={errors.subjects} />
    {data.subjects.map(subject => {
      const areas = SUBJECT_AREAS_BY_STAGE[stage][subject] ?? [];
      return areas.length > 0 ? <MultiChoice key={subject} id={`${subject}-areas`} label={`Which ${SUBJECTS_BY_STAGE[stage].find(option => option.value === subject)?.label ?? subject} areas?`} hint="Optional — choose any that sound relevant." options={areas} values={data.subjectAreas[subject] ?? []} onToggle={area => onChange(toggleSubjectArea(data, subject, area))} /> : null;
    })}
  </div>;
}
