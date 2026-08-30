import { type GoalsAnswer } from "./assessmentTypes.ts";

export interface GoalsChoiceDefinition {
  value: GoalsAnswer;
  title: string;
  description: string;
}

export const goalsChoices: GoalsChoiceDefinition[] = [
  {
    value: "confidence-foundations",
    title: "Build confidence & foundations",
    description: "Help them feel secure in what they know and strengthen important gaps.",
  },
  {
    value: "steady-progress",
    title: "Keep progressing strongly",
    description: "Maintain consistent progress with the right support, structure and accountability.",
  },
  {
    value: "extension",
    title: "Stretch beyond year level",
    description: "Give them greater challenge, faster progression or extension.",
  },
];
