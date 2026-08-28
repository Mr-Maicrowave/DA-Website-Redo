import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { STEP_META } from './config.ts';
import { sanitiseDataForYear } from './model.ts';
import { buildInterviewPayload } from './payload.ts';
import { clearInterviewSession, restoreInterviewSession, saveInterviewSession } from './persistence.ts';
import { submitInterviewLocally } from './submission.ts';
import { StepConcernsGoals } from './steps/StepConcernsGoals.tsx';
import { StepCurrentSituation } from './steps/StepCurrentSituation.tsx';
import { StepLearningPreferences } from './steps/StepLearningPreferences.tsx';
import { StepParentStudent } from './steps/StepParentStudent.tsx';
import { StepReview } from './steps/StepReview.tsx';
import { StepSubjects } from './steps/StepSubjects.tsx';
import type { InterviewFormData, InterviewSubmissionPayload, SubmissionStatus, SubmitInterview } from './types.ts';
import { validateStep, type FormErrors } from './validation.ts';
import './interview-wizard.css';

const TOTAL_STEPS = 6;

export function InterviewWizard({ submitInterview = submitInterviewLocally, onSuccess }: {
  submitInterview?: SubmitInterview;
  onSuccess: (data: InterviewFormData, payload: InterviewSubmissionPayload) => void;
}) {
  const initial = useRef(
    typeof window === 'undefined'
      ? { version: 1 as const, currentStep: 1, data: null }
      : restoreInterviewSession(window.sessionStorage),
  );
  const [data, setData] = useState<InterviewFormData>(() =>
    initial.current.data ?? restoreInterviewSession({ getItem: () => null, setItem: () => undefined, removeItem: () => undefined }).data,
  );
  const [currentStep, setCurrentStep] = useState(initial.current.currentStep);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || submissionStatus === 'success') return undefined;
    const timer = window.setTimeout(() => {
      saveInterviewSession(window.sessionStorage, { version: 1, currentStep, data });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [currentStep, data, submissionStatus]);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [currentStep]);

  const goToStep = (step: number) => {
    setErrors({});
    setCurrentStep(Math.min(TOTAL_STEPS, Math.max(1, step)));
  };

  const goNext = () => {
    const nextErrors = validateStep(currentStep, data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    goToStep(currentStep + 1);
  };

  const goBack = () => goToStep(currentStep - 1);

  const submit = async () => {
    if (submissionStatus === 'submitting') return;
    for (const step of [1, 2, 3, 4]) {
      const nextErrors = validateStep(step, data);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        setCurrentStep(step);
        return;
      }
    }

    setSubmissionStatus('submitting');
    const completedAt = new Date().toISOString();
    const completedData = { ...data, completedAt };
    const payload = buildInterviewPayload(completedData, completedAt);
    try {
      const result = await submitInterview(payload);
      if (result.ok) {
        if (typeof window !== 'undefined') clearInterviewSession(window.sessionStorage);
        setSubmissionStatus('success');
        onSuccess(completedData, payload);
      }
    } catch {
      setSubmissionStatus('error');
    }
  };

  const meta = STEP_META[currentStep - 1];
  const common = { data, errors, onChange: setData };

  return <div className="interview-wizard">
    <nav className="interview-wizard-progress" aria-label="Interview progress">
      <p>Step {currentStep} of {TOTAL_STEPS}</p>
      <ol>{STEP_META.map(item => <li key={item.step} aria-current={item.step === currentStep ? 'step' : undefined}>{item.short}</li>)}</ol>
    </nav>
    <header className="interview-wizard-header">
      <p>{meta.short}</p>
      <h2 tabIndex={-1} ref={headingRef}>{meta.title}</h2>
    </header>
    {currentStep === 1 ? <StepParentStudent {...common} onYearChange={year => setData(current => sanitiseDataForYear(current, year))} /> : null}
    {currentStep === 2 ? <StepSubjects {...common} /> : null}
    {currentStep === 3 ? <StepCurrentSituation {...common} /> : null}
    {currentStep === 4 ? <StepConcernsGoals {...common} /> : null}
    {currentStep === 5 ? <StepLearningPreferences {...common} /> : null}
    {currentStep === 6 ? <><div className="interview-wizard-reassurance"><h3>You don’t need to know which class to choose. That’s what the conversation is for.</h3><p>You don’t need to arrive with the answer.</p><ul><li>You don’t need to know whether your child needs private tuition, a class, foundation work or extension.</li><li>You don’t need to know exactly why their marks have changed.</li><li>You don’t need to diagnose every weakness before speaking with us.</li></ul></div><StepReview data={data} onEdit={goToStep} /></> : null}
    <div className="interview-wizard-actions">
      {currentStep > 1 ? <button type="button" className="interview-wizard-back" onClick={goBack}><ArrowLeft aria-hidden="true" />Back</button> : <span />}
      {currentStep < TOTAL_STEPS
        ? <button type="button" className="interview-wizard-next" onClick={goNext}>Continue<ArrowRight aria-hidden="true" /></button>
        : <button type="button" className="interview-wizard-next" onClick={submit} disabled={submissionStatus === 'submitting'}>{submissionStatus === 'submitting' ? 'Sending…' : 'Send My Request'}<ArrowRight aria-hidden="true" /></button>}
    </div>
    <p className="interview-wizard-status" aria-live="polite">{submissionStatus === 'error' ? 'We couldn’t send your request. Your answers are still here—please try again.' : ''}</p>
  </div>;
}
