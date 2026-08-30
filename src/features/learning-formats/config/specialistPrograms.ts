/**
 * SPECIALIST PROGRAM CONFIG  (Layer B)
 * ===================================
 *
 * Specialist programs are subject-specific pathways that sit ALONGSIDE the
 * core Private / Class environment. They never replace it.
 *
 * WHERE TO CONFIGURE ELIGIBILITY:
 *  - Simple signal-threshold programs (Primary Creative Writing, Focus Maths,
 *    HSC Prep, Trial Class): tune numbers in `SPECIALIST_THRESHOLDS` (./scoringRules.ts).
 *  - Year 7–10 English (General / Creative Writing / GAT / Bullet / Focus):
 *    need→pathway map in `HIGH_SCHOOL_ENGLISH_RULES` below; numeric gates for
 *    GAT and Bullet in `HIGH_SCHOOL_ENGLISH_GATES` (./scoringRules.ts).
 *  - HSC Focus English: `HSC_FOCUS_ENGLISH_RULES` below.
 *
 * STATUS:
 *  - Year 7–10 English (Creative Writing / GAT / Bullet / Focus / General):
 *    CONFIRMED (Aug 2026). See HIGH_SCHOOL_ENGLISH_RULES below.
 *  - HSC Focus English: still a PLACEHOLDER — see HSC_FOCUS_ENGLISH_RULES.
 */

export interface SpecialistProgramMeta {
  id: string;
  label: string;
}

export const SPECIALIST_PROGRAMS: Record<string, SpecialistProgramMeta> = {
  "creative-writing": { id: "creative-writing", label: "Creative Writing" },
  "focus-maths": { id: "focus-maths", label: "Focus Maths" },
  "hsc-prep": { id: "hsc-prep", label: "HSC Prep Maths" },
  "trial-class": { id: "trial-class", label: "Trial Class Maths" },
  // Year 7–10 English specialists (confirmed)
  "creative-writing-english": {
    id: "creative-writing-english",
    label: "Creative Writing",
  },
  "gat-english": { id: "gat-english", label: "GAT English" },
  "bullet-english": { id: "bullet-english", label: "Bullet English" },
  "focus-english-hs": { id: "focus-english-hs", label: "Focus English" },
  // HSC English specialist
  "focus-english-hsc": { id: "focus-english-hsc", label: "Focus English" },
};

// ---------------------------------------------------------------------------
// HIGH SCHOOL ENGLISH SPECIALIST RULES
// ---------------------------------------------------------------------------

/**
 * How each English follow-up need maps to a specialist pathway.
 *
 *   gate "none"   — surfaces on the parent's choice alone
 *   gate "gat"    — needs independence/challenge signals; softens under strong
 *                   support signals (still shown, "discuss at interview")
 *   gate "bullet" — strictest: needs challenge + performance + independence,
 *                   otherwise replaced by a neutral "discuss at interview" note
 *
 * Numeric thresholds live in HIGH_SCHOOL_ENGLISH_GATES (../config/scoringRules.ts).
 */
export interface HighSchoolEnglishRule {
  need: string;
  /** null = general support: keep Private/Class only, no specialist. */
  programId: string | null;
  gate: "none" | "gat" | "bullet";
}

export const HIGH_SCHOOL_ENGLISH_RULES: HighSchoolEnglishRule[] = [
  { need: "general-support", programId: null, gate: "none" },
  { need: "creative-writing", programId: "creative-writing-english", gate: "none" },
  { need: "gat", programId: "gat-english", gate: "gat" },
  { need: "bullet", programId: "bullet-english", gate: "bullet" },
  { need: "focus", programId: "focus-english-hs", gate: "none" },
];

/** Parent-facing copy for each Year 7–10 English outcome. Edit freely. */
export const HIGH_SCHOOL_ENGLISH_COPY = {
  creativeWriting:
    "They're looking to become a stronger, more confident and adaptable writer.",
  gatFull:
    "They appear comfortable working independently and you're looking for deeper, higher-order English challenge.",
  gatSoften:
    "Their answers point to needing more direct support first, so GAT is best confirmed together at your interview.",
  bulletFull:
    "They're performing strongly, work independently, and want faster, sharper and more precise English.",
  bulletFallback:
    "High-performance English is one of your goals. We'd recommend discussing the most appropriate pathway at your interview.",
  focus:
    "This keeps the work aligned to the exact texts, assessments and content they're doing at school.",
};

// ---------------------------------------------------------------------------
// HSC FOCUS ENGLISH RULES
// ---------------------------------------------------------------------------

export interface HscFocusEnglishRule {
  programId: string;
  enabled: boolean;
  /** `hscEnglishNeed` values that make Focus English relevant. */
  matchingNeeds: string[];
  /** Minimum focusEnglishSignal required (see SPECIALIST_THRESHOLDS). */
  useSignalThreshold: boolean;
}

/**
 * TODO(DA): Confirm exact Focus English (HSC) eligibility. Currently inert:
 * no matching needs, and the signal threshold in scoringRules.ts is 999.
 * When DA confirms, either populate `matchingNeeds` (e.g.
 * ["analysis-sophistication", "consistency"]) or lower the signal threshold.
 */
export const HSC_FOCUS_ENGLISH_RULES: HscFocusEnglishRule = {
  programId: "focus-english-hsc",
  enabled: true,
  matchingNeeds: [], // TODO(DA): confirm
  useSignalThreshold: true,
};
