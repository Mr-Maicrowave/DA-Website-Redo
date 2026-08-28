import { FORMAT_PREFERENCES, LEARNING_CHALLENGES, PREVIOUS_TUTORING_ISSUES, TUTOR_PREFERENCES } from '../config.ts';
import { MultiChoice, SingleChoice, TextArea } from '../fields.tsx';
import { setTutoringHistory, toggleArrayValue, toggleExclusiveValue } from '../model.ts';
import type { InterviewFormData, LearningFormat } from '../types.ts';
import type { FormErrors } from '../validation.ts';

const YES_NO = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

export function StepLearningPreferences({ data, onChange }: { data: InterviewFormData; errors: FormErrors; onChange: (next: InterviewFormData) => void }) {
  const challengeToggle = (value: string) => {
    const learningChallenges = toggleExclusiveValue(data.learningChallenges, value, ['nothing-specific', 'not-sure']);
    onChange({ ...data, learningChallenges, learningChallengesOther: learningChallenges.includes('other') ? data.learningChallengesOther : undefined });
  };
  return <div className="interview-wizard-stack">
    <MultiChoice id="learning-challenges" label="Is there anything that tends to make learning harder for them?" options={LEARNING_CHALLENGES} values={data.learningChallenges} onToggle={challengeToggle} />
    {data.learningChallenges.includes('other') ? <TextArea id="learning-challenges-other" label="What else should we know?" value={data.learningChallengesOther ?? ''} onChange={value => onChange({ ...data, learningChallengesOther: value })} /> : null}
    <SingleChoice id="previous-tutoring" label="Have they had tutoring before?" options={YES_NO} value={data.hasHadTutoringBefore === undefined ? undefined : data.hasHadTutoringBefore ? 'yes' : 'no'} onChange={value => onChange(setTutoringHistory(data, value === 'yes'))} />
    {data.hasHadTutoringBefore ? <><TextArea id="previous-tutoring-worked" label="What worked well?" value={data.previousTutoringWorked ?? ''} onChange={value => onChange({ ...data, previousTutoringWorked: value })} /><MultiChoice id="previous-tutoring-issues" label="What didn’t work for them?" options={PREVIOUS_TUTORING_ISSUES} values={data.previousTutoringIssues} onToggle={value => onChange({ ...data, previousTutoringIssues: toggleArrayValue(data.previousTutoringIssues, value) })} /></> : null}
    <MultiChoice id="preferred-formats" label="Do you already have a learning format in mind?" options={FORMAT_PREFERENCES} values={data.preferredFormats} onToggle={value => onChange({ ...data, preferredFormats: toggleExclusiveValue(data.preferredFormats, value, ['not-sure']) as LearningFormat[] })} />
    <MultiChoice id="tutor-preferences" label="What kind of tutor tends to bring out the best in your child?" options={TUTOR_PREFERENCES} values={data.tutorPreferences} onToggle={value => onChange({ ...data, tutorPreferences: toggleExclusiveValue(data.tutorPreferences, value, ['no-preference']) })} />
    <TextArea id="tutor-preference-notes" label="Anything else we should consider when matching them?" value={data.tutorPreferenceNotes ?? ''} onChange={value => onChange({ ...data, tutorPreferenceNotes: value })} />
    <TextArea id="anything-else" label="Is there anything else you’d like us to know before we speak with you?" value={data.anythingElse ?? ''} onChange={value => onChange({ ...data, anythingElse: value })} />
  </div>;
}
