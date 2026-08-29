import { ArrowRight, Check, PenLine } from 'lucide-react';
import { GOALS_BY_STAGE, PARENT_CONCERNS } from '../config.ts';
import { FieldError, TextArea } from '../fields.tsx';
import { getInterviewLabels } from '../labels.ts';
import { getSchoolStage, toggleArrayValue } from '../model.ts';
import { GOAL_GROUPS, groupOptions } from '../presentation.ts';
import type { InterviewFormData, Option } from '../types.ts';
import type { FormErrors } from '../validation.ts';
import './StepsConversation.css';

function GroupedSelections({ options, values, onToggle, definitions }: { options: readonly Option[]; values: readonly string[]; onToggle: (value: string) => void; definitions?: Parameters<typeof groupOptions>[1] }) {
  return <div className="conversation-choice-groups">{groupOptions(options, definitions).map(group => <div key={group.heading}><h4>{group.heading}</h4><div>{group.options.map(option => { const selected = values.includes(option.value); return <button type="button" key={option.value} aria-pressed={selected} onClick={() => onToggle(option.value)}>{option.label}{selected ? <Check aria-hidden="true" /> : null}</button>; })}</div></div>)}</div>;
}

export function StepConcernsGoals({ data, errors, onChange, studentName }: { data: InterviewFormData; errors: FormErrors; onChange: (next: InterviewFormData) => void; studentName: string }) {
  const stage = getSchoolStage(data.schoolYear) ?? 'primary';
  const currentLabels = getInterviewLabels([...data.currentSituations, ...data.parentConcerns]).slice(0, 4);
  const goalLabels = getInterviewLabels(data.goals).slice(0, 4);
  return <div className="conversation-step conversation-step--goals">
    <section className="conversation-section"><header><span>01</span><div><h3>What’s been on your mind?</h3><p>Choose anything that has been worrying you.</p></div></header><GroupedSelections options={PARENT_CONCERNS} values={data.parentConcerns} onToggle={value => onChange({ ...data, parentConcerns: toggleArrayValue(data.parentConcerns, value) })} /><FieldError id="parent-concerns-error" error={errors.parentConcerns} /></section>
    <section className="conversation-writing-area"><div><PenLine aria-hidden="true" /><span>Whatever feels important.</span></div><TextArea id="parent-concern-notes" label="Tell us what prompted you to reach out." hint="You don’t need to write much — a few sentences can help us understand what’s been happening." value={data.parentConcernNotes ?? ''} onChange={value => onChange({ ...data, parentConcernNotes: value })} /></section>
    <div className="conversation-journey-connector" aria-hidden="true"><span /><ArrowRight /></div>
    <section className="conversation-section"><header><span>02</span><div><p className="conversation-section-kicker">IF TUITION GOES WELL…</p><h3>What would you most love to see change?</h3><p>Choose the outcomes that would matter most to your family.</p></div></header><GroupedSelections options={GOALS_BY_STAGE[stage]} definitions={GOAL_GROUPS} values={data.goals} onToggle={value => onChange({ ...data, goals: toggleArrayValue(data.goals, value) })} /><FieldError id="goals-error" error={errors.goals} /></section>
    <section className="conversation-writing-area conversation-writing-area--optional"><TextArea id="goal-notes" label="Is there a specific result you are hoping for?" hint="Optional" placeholder="e.g. improve from 60% to 80%, feel confident in class, prepare for an upcoming exam, reach Band 6, or move ahead of school." value={data.goalNotes ?? ''} onChange={value => onChange({ ...data, goalNotes: value })} /></section>
    {currentLabels.length || goalLabels.length ? <aside className="conversation-now-goal"><div><span>WHERE {studentName.toUpperCase()} IS NOW</span>{currentLabels.length ? <ul>{currentLabels.map(label => <li key={label}>{label}</li>)}</ul> : <p>We’ll clarify this together.</p>}</div><ArrowRight aria-hidden="true" /><div><span>WHAT YOU’D LOVE TO SEE</span>{goalLabels.length ? <ul>{goalLabels.map(label => <li key={label}>{label}</li>)}</ul> : <p>Choose any goals that matter to you.</p>}</div></aside> : null}
  </div>;
}
