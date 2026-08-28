import { type LearningHabitsAnswer } from "./assessmentTypes.ts";

export const learningHabitsChoices = [
  {
    value: "guided",
    title: "Needs regular guidance",
    description: "They work best with frequent explanation, checking and reassurance.",
  },
  {
    value: "check-in",
    title: "Checks in sometimes",
    description: "They can work on their own but still benefit from occasional guidance.",
  },
  {
    value: "independent",
    title: "Works independently",
    description: "Once shown what to do, they usually manage the task on their own.",
  },
] as const satisfies readonly {
  value: LearningHabitsAnswer;
  title: string;
  description: string;
}[];
