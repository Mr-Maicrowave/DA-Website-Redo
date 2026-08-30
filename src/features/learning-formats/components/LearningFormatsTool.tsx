import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLearningFormatsState } from "../state/useLearningFormatsState";
import AssessmentJourney from "./AssessmentJourney";
import DebugPanel from "./DebugPanel";
import LessonProcess from "./LessonProcess";
import RecommendationSummary from "./RecommendationSummary";
import SubjectFollowUps from "./SubjectFollowUps";
import SubjectSelector from "./SubjectSelector";
import { WF } from "./wireframe";

interface SectionProps { kicker: string; title: string; children: ReactNode }
const Section = ({ kicker, title, children }: SectionProps) => (
  <section className="border-t border-brand-navy/10 py-10 first:border-t-0">
    <p className={WF.sectionKicker}>{kicker}</p>
    <h2 className={cn(WF.sectionTitle, "mt-1")}>{title}</h2>
    <div className="mt-5">{children}</div>
  </section>
);

const LearningFormatsTool = () => {
  const controller = useLearningFormatsState();
  const { state, eligibleSubjects, assessmentComplete, allFollowUpsAnswered, bundle, toggleSubject, reset } = controller;
  const hasSubjects = state.selectedSubjects.length > 0;
  const showPathway = assessmentComplete && hasSubjects && allFollowUpsAnswered;
  const selectAll = () => { for (const subject of eligibleSubjects) if (!state.selectedSubjects.includes(subject)) toggleSubject(subject); };
  const clearAll = () => { for (const subject of [...state.selectedSubjects]) toggleSubject(subject); };

  return (
    <main className={cn(WF.page, "min-h-screen")}>
      <div className={cn(WF.wideContainer, "py-10")}>
        <header className="max-w-2xl">
          <h1 className={cn(WF.sectionTitle, "text-3xl sm:text-4xl")}>Find the right learning format</h1>
          <p className={cn(WF.body, "mt-2")}>A short guided tool to help you explore whether Private or Class learning is the stronger starting point — and which specialist programs are worth a look for each subject.</p>
          {(state.year != null || assessmentComplete) && <button type="button" onClick={reset} className={cn(WF.btnGhost, "mt-4")}>Restart assessment</button>}
        </header>
        <Section kicker="01" title="How learning works at DA"><LessonProcess /></Section>
        <Section kicker="02" title="Find their fit"><p className={cn(WF.body, "mb-4 max-w-2xl")}>These questions are about your child, not any one subject — so you only answer them once.</p><AssessmentJourney controller={controller} /></Section>
        {assessmentComplete && <Section kicker="03" title="Build their program"><div className="grid gap-6"><div className={WF.card}><SubjectSelector eligibleSubjects={eligibleSubjects} selected={state.selectedSubjects} onToggle={toggleSubject} onSelectAll={selectAll} onClear={clearAll} /></div>{hasSubjects && <SubjectFollowUps controller={controller} />}</div></Section>}
        {showPathway && bundle.recommendation && <Section kicker="04" title="Your DA pathway"><RecommendationSummary recommendation={bundle.recommendation} /></Section>}
        {assessmentComplete && hasSubjects && !allFollowUpsAnswered && <p className={cn(WF.body, "py-6 text-brand-navy/50")}>Answer the subject follow-ups above to see the full pathway.</p>}
      </div>
      {import.meta.env.DEV && <DebugPanel controller={controller} />}
    </main>
  );
};
export default LearningFormatsTool;
