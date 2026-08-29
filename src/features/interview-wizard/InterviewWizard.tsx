import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Heart, MessageCircle } from 'lucide-react';
import { STEP_META } from './config.ts';
import { sanitiseDataForYear } from './model.ts';
import { buildInterviewPayload } from './payload.ts';
import { clearInterviewSession, restoreInterviewSession, saveInterviewSession } from './persistence.ts';
import { getStudentName } from './personalisation.ts';
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
import './interview-wizard-reference.css';

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
  const studentName = getStudentName(data.studentFirstName);
  const headings = [
    { title: 'First, let’s meet your family.', support: 'Just the basics, so we know who we’ll be speaking with.' },
    { title: `What is ${studentName} working on?`, support: 'Choose the subjects and areas where support would be most helpful.' },
    { title: `How are things going for ${studentName} right now?`, support: 'This helps us understand the starting point before we speak.' },
    { title: `What would you love to see change for ${studentName}?`, support: 'Tell us what matters most, from confidence to stronger results.' },
    { title: `What helps ${studentName} learn best?`, support: 'A few preferences help us recommend the right format and tutor.' },
    { title: `Here’s what we’ve understood about ${studentName}.`, support: 'Have a quick look before sending it through. You can change anything.' },
  ] as const;
  const heading = headings[currentStep - 1];
  const common = { data, errors, onChange: setData };

  return <div className={`interview-wizard interview-wizard--step-${currentStep}`}>
    <nav className="interview-wizard-progress" aria-label="Interview progress">
      <p>Step {currentStep} of {TOTAL_STEPS}</p>
      <ol>{STEP_META.map(item => <li key={item.step} data-status={item.step < currentStep ? 'complete' : item.step === currentStep ? 'current' : 'upcoming'} aria-current={item.step === currentStep ? 'step' : undefined}><span>{item.step < currentStep ? <Check aria-label="Completed" /> : String(item.step).padStart(2, '0')}</span><b>{item.step === 1 ? 'ABOUT YOU' : item.short}</b></li>)}</ol>
    </nav>
    <header className="interview-wizard-header">
      <p>{meta.short}</p>
      <h2 tabIndex={-1} ref={headingRef}>{heading.title}</h2>
      <p className="interview-wizard-support">{heading.support}</p>
      {currentStep === 1 ? <img className="interview-wizard-still-life" src="/images/interview/family-form-still-life.png" alt="" aria-hidden="true" /> : null}
    </header>
    {currentStep === 1 ? <StepParentStudent {...common} onYearChange={year => setData(current => sanitiseDataForYear(current, year))} /> : null}
    {currentStep === 2 ? <StepSubjects {...common} studentName={studentName} /> : null}
    {currentStep === 3 ? <StepCurrentSituation {...common} studentName={studentName} /> : null}
    {currentStep === 4 ? <StepConcernsGoals {...common} studentName={studentName} /> : null}
    {currentStep === 5 ? <StepLearningPreferences {...common} studentName={studentName} /> : null}
    {currentStep === 6 ? <><div className="interview-wizard-reassurance interview-wizard-reassurance--editorial"><span>Almost there.</span><h3>You don’t need to know which class to choose.<br />That’s what the conversation is for.</h3><p>We’ll use what you’ve shared to understand the starting point, recommend the right pathway and match {studentName} with the right support.</p><small>We’ll work it out together.</small></div><StepReview data={data} onEdit={goToStep} /></> : null}
    {currentStep === 1 ? <div className="interview-wizard-kind-note"><Heart aria-hidden="true" /><p><strong>Every student starts somewhere different.</strong> We’ll get to know yours step by step.</p></div> : null}
    <div className={`interview-wizard-actions${currentStep === 1 ? ' interview-wizard-actions--intro' : ''}${currentStep === 2 ? ' interview-wizard-actions--subjects' : ''}`}>
      {currentStep > 1 ? <button type="button" className="interview-wizard-back" onClick={goBack}><ArrowLeft aria-hidden="true" />Back</button> : <span />}
      {currentStep === 1 ? <div className="interview-wizard-next-preview"><div><strong>COMING UP NEXT</strong><p>Next, we’ll look at what subjects your child needs help with.</p></div><ArrowRight aria-hidden="true" /></div> : null}
      {currentStep === 2 ? <div className="interview-wizard-subject-next"><MessageCircle aria-hidden="true" /><div><strong>UP NEXT</strong><p>We’ll explore how things are going right now.</p></div></div> : null}
      {currentStep >= 3 && currentStep <= 5 ? <div className="interview-wizard-subject-next"><MessageCircle aria-hidden="true" /><div><strong>UP NEXT</strong><p>{currentStep === 3 ? 'Tell us what you’d love to see change.' : currentStep === 4 ? `Help us understand how ${studentName} learns best.` : 'Check what we’ve understood before sending.'}</p></div></div> : null}
      {currentStep < TOTAL_STEPS
        ? <button type="button" className="interview-wizard-next" onClick={goNext}>{currentStep === 1 ? 'Continue to subjects' : currentStep === 2 ? 'Continue to right now' : currentStep === 3 ? 'Continue to goals' : currentStep === 4 ? 'Continue to learning' : `Review ${data.studentFirstName.trim() || 'your child'}’s details`}<ArrowRight aria-hidden="true" /></button>
        : <button type="button" className="interview-wizard-next" onClick={submit} disabled={submissionStatus === 'submitting'}>{submissionStatus === 'submitting' ? 'Sending…' : 'Send consultation details'}<ArrowRight aria-hidden="true" /></button>}
    </div>
    {currentStep === 6 ? <p className="interview-submit-note">No commitment. We’ll review this before speaking with you.</p> : null}
    <p className="interview-wizard-status" aria-live="polite">{submissionStatus === 'error' ? 'We couldn’t send your request. Your answers are still here—please try again.' : ''}</p>
  </div>;
}
