/**
 * SUBJECT CONFIG  ("Build Their Program")
 * ======================================
 *
 * WHERE TO EDIT which subjects appear per stage: `SUBJECT_ELIGIBILITY`.
 * WHERE TO EDIT per-year exceptions: `SUBJECT_YEAR_OVERRIDES` (empty for now).
 * WHERE TO EDIT the extra follow-up questions: `SUBJECT_FOLLOW_UPS` below.
 *
 * Most subjects need NO follow-up — they simply inherit the core environment
 * (Private or Class) from the journey. Only subjects with specialist pathways
 * (English at every stage; Maths at High School and HSC) ask one more question.
 */

import type {
  LearningStage,
  SubjectFollowUpConfig,
  SubjectId,
} from "../logic/types.ts";

export interface SubjectConfig {
  id: SubjectId;
  label: string;
}

export const SUBJECTS: SubjectConfig[] = [
  { id: "english", label: "English" },
  { id: "maths", label: "Mathematics" },
  { id: "science", label: "Science" },
  { id: "physics", label: "Physics" },
  { id: "chemistry", label: "Chemistry" },
  { id: "biology", label: "Biology" },
  { id: "business-studies", label: "Business Studies" },
  { id: "legal-studies", label: "Legal Studies" },
];

export function subjectLabel(id: SubjectId): string {
  return SUBJECTS.find((s) => s.id === id)?.label ?? id;
}

/** Which subjects are offered at each stage. */
export const SUBJECT_ELIGIBILITY: Record<LearningStage, SubjectId[]> = {
  primary: ["english", "maths"],
  "high-school": [
    "english",
    "maths",
    "science",
    "physics",
    "chemistry",
    "biology",
    "business-studies",
    "legal-studies",
  ],
  hsc: [
    "english",
    "maths",
    "physics",
    "chemistry",
    "biology",
    "business-studies",
    "legal-studies",
  ],
};

/**
 * Per-year removals, layered on top of `SUBJECT_ELIGIBILITY`.
 * e.g. `{ 7: ["physics", "chemistry"] }` would hide Physics/Chemistry for Year 7.
 * Left empty until DA confirms year-by-year availability.
 */
export const SUBJECT_YEAR_OVERRIDES: Partial<Record<number, SubjectId[]>> = {};

export function subjectsForStage(stage: LearningStage | null): SubjectId[] {
  return stage ? SUBJECT_ELIGIBILITY[stage] : [];
}

export function isSubjectAvailable(
  subject: SubjectId,
  year: number | null,
  stage: LearningStage | null,
): boolean {
  if (!stage) return false;
  if (!SUBJECT_ELIGIBILITY[stage].includes(subject)) return false;
  if (year != null && SUBJECT_YEAR_OVERRIDES[year]?.includes(subject)) {
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// SUBJECT FOLLOW-UP QUESTIONS
// ---------------------------------------------------------------------------

const PRIMARY_ENGLISH: SubjectFollowUpConfig = {
  key: "primaryEnglish",
  subject: "english",
  stage: "primary",
  question:
    "When it comes to English, is writing itself one of the main concerns?",
  options: [
    {
      id: "a",
      label: "Yes — getting ideas onto the page is difficult.",
      scores: { creativeWritingSignal: 3 },
    },
    {
      id: "b",
      label: "Yes — structure and expression need improvement.",
      scores: { creativeWritingSignal: 3 },
    },
    {
      id: "c",
      label: "They're already confident but want stronger creative writing.",
      scores: { creativeWritingSignal: 3 },
    },
    {
      id: "d",
      label: "No — we're looking for broader English support.",
      scores: {},
    },
  ],
};

const HIGH_SCHOOL_ENGLISH: SubjectFollowUpConfig = {
  key: "highSchoolEnglish",
  subject: "english",
  stage: "high-school",
  question: "If English improved in one way, what would make the biggest difference?",
  // Year 7–10 English specialist definitions are CONFIRMED (Aug 2026).
  // The `need` slug drives which specialist pathway is in play; whether GAT /
  // Bullet actually surface is gated by core-assessment signals — see
  // HIGH_SCHOOL_ENGLISH_RULES in ../config/specialistPrograms.ts and the
  // thresholds in ../config/scoringRules.ts.
  options: [
    {
      id: "a",
      label:
        "They need broader help with English — understanding, confidence and schoolwork.",
      need: "general-support",
    },
    {
      id: "b",
      label:
        "They need to become a stronger, more confident and adaptable writer.",
      need: "creative-writing",
    },
    {
      id: "c",
      label:
        "They're already capable and would benefit from deeper, more challenging English.",
      need: "gat",
    },
    {
      id: "d",
      label:
        "They're performing strongly and want to become faster, sharper and more precise.",
      need: "bullet",
    },
    {
      id: "e",
      label:
        "They mainly need support with the exact texts, assessments and content they're doing at school.",
      need: "focus",
    },
  ],
};

const HIGH_SCHOOL_MATHS: SubjectFollowUpConfig = {
  key: "highSchoolMaths",
  subject: "maths",
  stage: "high-school",
  question: "What kind of Maths support would make the biggest difference right now?",
  options: [
    {
      id: "a",
      label: "Broader support rebuilding concepts and confidence.",
      scores: { focusMathsSignal: 0 },
    },
    {
      id: "b",
      label: "Support aligned closely with their current school topics and assessments.",
      scores: { focusMathsSignal: 3 },
    },
    {
      id: "c",
      label: "Targeted preparation for an upcoming school assessment.",
      scores: { focusMathsSignal: 3 },
    },
    {
      id: "d",
      label: "More challenge and extension beyond their current schoolwork.",
      scores: { focusMathsSignal: 0 },
    },
  ],
};

const HSC_ENGLISH: SubjectFollowUpConfig = {
  key: "hscEnglish",
  subject: "english",
  stage: "hsc",
  question:
    "If you could strengthen one part of their English performance, which would make the biggest difference?",
  // NOTE: focusEnglishSignal deltas below are PLACEHOLDER weights so the
  // mechanism is wired end-to-end. Whether Focus English actually surfaces is
  // gated by HSC_FOCUS_ENGLISH_RULES in ./specialistPrograms.ts — currently a
  // no-op until DA confirms eligibility.
  options: [
    {
      id: "a",
      label: "Understanding content and texts more deeply.",
      need: "content-understanding",
      scores: { focusEnglishSignal: 0 },
    },
    {
      id: "b",
      label: "Structuring stronger responses.",
      need: "structure",
      scores: { focusEnglishSignal: 0 },
    },
    {
      id: "c",
      label: "Adapting what they know to the exact question.",
      need: "adaptation",
      scores: { focusEnglishSignal: 1 },
    },
    {
      id: "d",
      label: "Producing stronger analysis and more sophisticated writing.",
      need: "analysis-sophistication",
      scores: { focusEnglishSignal: 2 },
    },
    {
      id: "e",
      label: "Performing more consistently under assessment conditions.",
      need: "consistency",
      scores: { focusEnglishSignal: 1 },
    },
  ],
};

const HSC_MATHS: SubjectFollowUpConfig = {
  key: "hscMaths",
  subject: "maths",
  stage: "hsc",
  question:
    "If they sat a full HSC-style Maths paper tomorrow, what would concern you most?",
  options: [
    {
      id: "a",
      label:
        "There are still areas of content they wouldn't know how to approach.",
      // No special program signal — pure Private/Class content support.
      scores: {},
    },
    {
      id: "b",
      label:
        "They know much of the content, but their preparation hasn't been systematic enough.",
      scores: { hscPrepSignal: 3 },
    },
    {
      id: "c",
      label:
        "They could attempt most of it, but timing, pressure and avoidable mistakes would cost marks.",
      scores: { trialSignal: 3 },
    },
    {
      id: "d",
      label:
        "They're already completing papers and need stronger feedback, refinement and harder practice.",
      scores: { trialSignal: 2, hscPrepSignal: 1 },
    },
  ],
};

/** All follow-ups, keyed by their answer key. */
export const SUBJECT_FOLLOW_UPS: Record<string, SubjectFollowUpConfig> = {
  primaryEnglish: PRIMARY_ENGLISH,
  highSchoolEnglish: HIGH_SCHOOL_ENGLISH,
  highSchoolMaths: HIGH_SCHOOL_MATHS,
  hscEnglish: HSC_ENGLISH,
  hscMaths: HSC_MATHS,
};

/**
 * Which follow-up (if any) a given subject needs at a given stage.
 * Returns the config, or null when the subject just inherits the core
 * environment with no extra questions.
 */
export function getSubjectFollowUp(
  subject: SubjectId,
  stage: LearningStage | null,
): SubjectFollowUpConfig | null {
  if (!stage) return null;
  if (subject === "english") {
    if (stage === "primary") return PRIMARY_ENGLISH;
    if (stage === "high-school") return HIGH_SCHOOL_ENGLISH;
    if (stage === "hsc") return HSC_ENGLISH;
  }
  if (subject === "maths") {
    if (stage === "high-school") return HIGH_SCHOOL_MATHS;
    if (stage === "hsc") return HSC_MATHS;
  }
  return null;
}
