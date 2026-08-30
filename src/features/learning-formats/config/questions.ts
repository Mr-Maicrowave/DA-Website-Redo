/** Parent-facing behavioural assessment. Scores remain internal. */
import type { AssessmentQuestionConfig, LearningStage } from "../logic/types.ts";

const q = (stage: LearningStage, slot: AssessmentQuestionConfig["slot"], question: string, options: AssessmentQuestionConfig["options"]): AssessmentQuestionConfig => ({ stage, slot, question, options });

const PRIMARY_QUESTIONS = [
  q("primary", "q1", "When schoolwork becomes difficult, what usually happens?", [
    { id:"a", label:"They become frustrated or lose confidence quite quickly.", scores:{privateScore:3,confidenceSupportSignal:2}, tags:["confidence"] },
    { id:"b", label:"They'll try, but usually need someone to guide them through it.", scores:{privateScore:2}, tags:["foundation"] },
    { id:"c", label:"They'll keep working and ask for help when they need it.", scores:{classScore:2}, tags:["independence"] },
    { id:"d", label:"They usually enjoy the challenge and want to keep going.", scores:{classScore:3,challengeSignal:2}, tags:["challenge","advanced"] },
  ]),
  q("primary", "q2", "Which description feels closest to where they are now?", [
    { id:"a", label:"There are important gaps we need to rebuild.", scores:{privateScore:3,foundationSignal:2}, tags:["foundation"] },
    { id:"b", label:"They understand some things, but their results are inconsistent.", scores:{privateScore:2}, tags:["consistency"] },
    { id:"c", label:"They're generally keeping up and we want stronger progress.", scores:{classScore:2}, tags:["consistency"] },
    { id:"d", label:"They're already ahead and need more challenge.", scores:{classScore:3,challengeSignal:3}, tags:["challenge","advanced"] },
  ]),
  q("primary", "q3", "What would make the biggest difference to them right now?", [
    { id:"a", label:"More confidence and patience.", scores:{privateScore:2,confidenceSupportSignal:2}, tags:["confidence"] },
    { id:"b", label:"Someone noticing exactly where they're getting stuck.", scores:{privateScore:3,foundationSignal:1}, tags:["foundation"] },
    { id:"c", label:"More structure and consistency.", scores:{classScore:2,accountabilitySignal:2}, tags:["consistency"] },
    { id:"d", label:"Being challenged alongside other capable students.", scores:{classScore:3,challengeSignal:2}, tags:["challenge","advanced"] },
  ]),
  q("primary", "q4", "Six months from now, what change would make you happiest?", [
    { id:"a", label:"They no longer feel anxious or defeated by the subject.", scores:{privateScore:2,confidenceSupportSignal:2}, tags:["confidence"] },
    { id:"b", label:"Their foundations are much stronger.", scores:{privateScore:2,foundationSignal:2}, tags:["foundation"] },
    { id:"c", label:"They're more independent and consistent.", scores:{classScore:2,accountabilitySignal:1}, tags:["independence","consistency"] },
    { id:"d", label:"They're working beyond their current level.", scores:{classScore:3,challengeSignal:2}, tags:["challenge","advanced"] },
  ]),
];

const HIGH_SCHOOL_QUESTIONS = [
  q("high-school", "q1", "When they receive a result they're unhappy with, what tends to happen?", [
    { id:"a", label:"They lose confidence or avoid the subject.", scores:{privateScore:3,confidenceSupportSignal:2}, tags:["confidence"] },
    { id:"b", label:"They know they need help but aren't sure what went wrong.", scores:{privateScore:2,assessmentSignal:1}, tags:["foundation"] },
    { id:"c", label:"They review it and can usually identify what needs improving.", scores:{classScore:2,accuracySignal:1}, tags:["independence"] },
    { id:"d", label:"They're disappointed because they expect very high results from themselves.", scores:{classScore:3,challengeSignal:2}, tags:["advanced","challenge"] },
  ]),
  q("high-school", "q2", "Which situation sounds most familiar?", [
    { id:"a", label:"They've fallen behind and school is moving on too quickly.", scores:{privateScore:3,foundationSignal:2}, tags:["foundation"] },
    { id:"b", label:"They understand lessons, but there are gaps underneath.", scores:{privateScore:2,foundationSignal:1}, tags:["foundation"] },
    { id:"c", label:"They're doing okay, but could achieve more with stronger structure.", scores:{classScore:2,accountabilitySignal:1}, tags:["consistency"] },
    { id:"d", label:"They're performing strongly and need greater challenge.", scores:{classScore:3,challengeSignal:3}, tags:["advanced","challenge"] },
  ]),
  q("high-school", "q3", "When they don't understand something, what are they most likely to do?", [
    { id:"a", label:"Stay quiet and hope it makes sense later.", scores:{privateScore:3,confidenceSupportSignal:1}, tags:["confidence"] },
    { id:"b", label:"Ask for help, but need someone to work through it closely.", scores:{privateScore:2}, tags:["foundation"] },
    { id:"c", label:"Ask a question and continue once it's clarified.", scores:{classScore:2}, tags:["independence"] },
    { id:"d", label:"Try different approaches independently before asking.", scores:{classScore:3,challengeSignal:1}, tags:["independence","advanced"] },
  ]),
  q("high-school", "q4", "What are you most hoping tuition changes?", [
    { id:"a", label:"Rebuild their confidence.", scores:{privateScore:3,confidenceSupportSignal:2}, tags:["confidence"] },
    { id:"b", label:"Close gaps and improve results.", scores:{privateScore:2,classScore:1,foundationSignal:2}, tags:["foundation"] },
    { id:"c", label:"Create consistency, discipline and stronger results.", scores:{classScore:2,accountabilitySignal:2}, tags:["consistency"] },
    { id:"d", label:"Push them towards the top of their cohort.", scores:{classScore:3,challengeSignal:3}, tags:["advanced","challenge"] },
  ]),
];

const HSC_QUESTIONS = [
  q("hsc", "q1", "Where does the pressure feel greatest right now?", [
    { id:"a", label:"They're struggling with the content itself.", scores:{privateScore:3,foundationSignal:2}, tags:["foundation"] },
    { id:"b", label:"They understand parts of the course but have significant gaps.", scores:{privateScore:2,foundationSignal:2}, tags:["foundation"] },
    { id:"c", label:"They know the content but aren't converting it into marks.", scores:{classScore:2,assessmentSignal:2}, tags:["examTechnique"] },
    { id:"d", label:"They're already strong and want to maximise their result.", scores:{classScore:3,challengeSignal:2}, tags:["advanced","challenge"] },
  ]),
  q("hsc", "q2", "After losing marks in an assessment, what usually happens?", [
    { id:"a", label:"They aren't really sure why they lost them.", scores:{privateScore:3,assessmentSignal:1}, tags:["foundation"] },
    { id:"b", label:"They understand the feedback but struggle to apply it next time.", scores:{privateScore:2,assessmentSignal:1}, tags:["consistency"] },
    { id:"c", label:"They can identify the issue and want more practice under exam conditions.", scores:{classScore:2,examReadinessSignal:2}, tags:["examTechnique"] },
    { id:"d", label:"They analyse every mark and are looking for marginal gains.", scores:{classScore:3,challengeSignal:2,accuracySignal:1}, tags:["advanced","examTechnique"] },
  ]),
  q("hsc", "q3", "What kind of support would reduce the most stress?", [
    { id:"a", label:"Someone working closely through the content with them.", scores:{privateScore:3}, tags:["foundation"] },
    { id:"b", label:"A clear plan for fixing weaknesses.", scores:{privateScore:2,organisationSignal:1}, tags:["foundation","consistency"] },
    { id:"c", label:"Regular structured practice and accountability.", scores:{classScore:2,accountabilitySignal:2}, tags:["consistency"] },
    { id:"d", label:"High-level exam strategy and challenging preparation.", scores:{classScore:3,examReadinessSignal:2,challengeSignal:2}, tags:["advanced","examTechnique"] },
  ]),
  q("hsc", "q4", "What's the goal from here?", [
    { id:"a", label:"Get back on track.", scores:{privateScore:3,foundationSignal:1}, tags:["foundation"] },
    { id:"b", label:"Lift their marks significantly.", scores:{privateScore:1,classScore:1,assessmentSignal:1}, tags:["consistency"] },
    { id:"c", label:"Become consistent and exam-ready.", scores:{classScore:2,examReadinessSignal:2}, tags:["consistency","examTechnique"] },
    { id:"d", label:"Push towards their highest possible ATAR/Band result.", scores:{classScore:3,challengeSignal:2}, tags:["advanced","challenge"] },
  ]),
];

export const ASSESSMENT_QUESTIONS: Record<LearningStage, AssessmentQuestionConfig[]> = { primary: PRIMARY_QUESTIONS, "high-school": HIGH_SCHOOL_QUESTIONS, hsc: HSC_QUESTIONS };
export function getStageQuestions(stage: LearningStage | null): AssessmentQuestionConfig[] { return stage ? ASSESSMENT_QUESTIONS[stage] : []; }
