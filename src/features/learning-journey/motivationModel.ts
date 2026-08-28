import { type MotivationAnswer } from "./assessmentTypes.ts";

export interface MotivationChoiceDefinition {
  value: MotivationAnswer;
  title: string;
  description: string;
}

export const motivationChoices: MotivationChoiceDefinition[] = [
  {
    value: "needs-encouragement",
    title: "Needs encouragement to continue",
    description: "A little support or reassurance helps them get moving again.",
  },
  {
    value: "persistent",
    title: "Keeps trying",
    description: "They usually persist, even if it takes several attempts.",
  },
  {
    value: "challenge-seeking",
    title: "Enjoys the challenge",
    description: "Difficult work often makes them more curious or determined.",
  },
];
