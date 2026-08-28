import { GOALS_BY_STAGE, PARENT_CONCERNS } from '../config.ts';
import { MultiChoice, TextArea } from '../fields.tsx';
import { getSchoolStage, toggleArrayValue } from '../model.ts';
import type { InterviewFormData } from '../types.ts';
import type { FormErrors } from '../validation.ts';

export function StepConcernsGoals({ data, errors, onChange }: { data: InterviewFormData; errors: FormErrors; onChange: (next: InterviewFormData) => void }) {
  const stage = getSchoolStage(data.schoolYear) ?? 'primary';
  return <div className="interview-wizard-stack">
    <MultiChoice id="parent-concerns" label="What has been worrying you most?" options={PARENT_CONCERNS} values={data.parentConcerns} onToggle={value => onChange({ ...data, parentConcerns: toggleArrayValue(data.parentConcerns, value) })} error={errors.parentConcerns} />
    <TextArea id="parent-concern-notes" label="Tell us what prompted you to reach out." value={data.parentConcernNotes ?? ''} onChange={value => onChange({ ...data, parentConcernNotes: value })} />
    <MultiChoice id="goals" label="If tuition goes well, what would you most like to see change?" options={GOALS_BY_STAGE[stage]} values={data.goals} onToggle={value => onChange({ ...data, goals: toggleArrayValue(data.goals, value) })} error={errors.goals} />
    <TextArea id="goal-notes" label="Is there a particular result or milestone you’re hoping for?" value={data.goalNotes ?? ''} onChange={value => onChange({ ...data, goalNotes: value })} />
  </div>;
}
