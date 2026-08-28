import { type ConfidenceAnswer } from "./assessmentTypes.ts";

export const confidenceChoices = [
  {
    value: "quiet",
    title: "Keeps it to themselves",
    description: "They may know the answer but rarely speak up without prompting.",
  },
  {
    value: "encouraged",
    title: "Answers when encouraged",
    description: "They respond when called on or gently encouraged.",
  },
  {
    value: "confident",
    title: "Puts their hand up immediately",
    description: "They are comfortable speaking up and volunteering answers.",
  },
] as const satisfies readonly {
  value: ConfidenceAnswer;
  title: string;
  description: string;
}[];
