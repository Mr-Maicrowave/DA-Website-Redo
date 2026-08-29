/**
 * SECTION 01 CONTENT — "How learning works at DA"
 *
 * Educational only. NONE of this affects the recommendation score.
 * Edit copy here.
 */

import type { Environment } from "../logic/types";

export interface LessonStep {
  number: string;
  title: string;
  detail: string;
}

export interface LessonProcessContent {
  environment: Environment;
  label: string;
  intro: string;
  steps: LessonStep[];
}

export const LESSON_PROCESSES: Record<Environment, LessonProcessContent> = {
  private: {
    environment: "private",
    label: "Private Learning",
    intro:
      "One-to-one. The lesson is shaped around where this student actually is.",
    steps: [
      {
        number: "01",
        title: "Understand",
        detail:
          "Find where the student currently is — strengths, gaps and priorities.",
      },
      {
        number: "02",
        title: "Explain",
        detail: "Teach the concept clearly, at the student's pace.",
      },
      {
        number: "03",
        title: "Try",
        detail: "The student applies the concept with guided questions.",
      },
      {
        number: "04",
        title: "Check",
        detail:
          "Check actual understanding — not simply whether the work was completed.",
      },
      {
        number: "05",
        title: "Correct",
        detail: "Identify exactly where the student's thinking went wrong.",
      },
      {
        number: "06",
        title: "Practise",
        detail: "Give more targeted practice.",
      },
      {
        number: "07",
        title: "Report",
        detail:
          "Communicate what was covered and how the student performed.",
      },
    ],
  },
  class: {
    environment: "class",
    label: "Class Learning",
    intro:
      "A small structured class. A clear objective, taught and checked across the group.",
    steps: [
      {
        number: "01",
        title: "Prepare",
        detail: "Set a clear lesson objective.",
      },
      {
        number: "02",
        title: "Teach",
        detail: "Teach theory and concepts using worked examples.",
      },
      {
        number: "03",
        title: "Practise",
        detail: "Students attempt structured questions.",
      },
      {
        number: "04",
        title: "Check",
        detail: "The tutor checks understanding across the class.",
      },
      {
        number: "05",
        title: "Challenge",
        detail: "Differentiate or extend where appropriate.",
      },
      {
        number: "06",
        title: "Correct",
        detail: "Work through mistakes and misconceptions together.",
      },
      {
        number: "07",
        title: "Report",
        detail: "Communicate progress.",
      },
    ],
  },
};

/**
 * The private "understanding loop": Explain -> Try -> Check, then branch.
 */
export const PRIVATE_LOOP = {
  cycle: ["Explain", "Try", "Check"],
  understood: {
    label: "Understood",
    outcome: "Move on to the next skill.",
  },
  notUnderstood: {
    label: "Not yet",
    outcome: "Correct → Practise again → Check again.",
  },
};
