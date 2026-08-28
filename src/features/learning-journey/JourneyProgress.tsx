const stages = ["Academic Level", "Confidence", "Learning Habits", "Motivation", "Goals"] as const;
export type JourneyStage = (typeof stages)[number];

interface JourneyProgressProps {
  completed: readonly JourneyStage[];
  current: JourneyStage;
}

export const JourneyProgress = ({ completed, current }: JourneyProgressProps) => (
  <ol className="journey-progress" aria-label="Assessment journey progress">
    {stages.map((stage) => {
      const state = completed.includes(stage)
        ? "complete"
        : stage === current
          ? "current"
          : "upcoming";
      return (
        <li key={stage} data-progress-state={state}>
          <span aria-hidden="true" />
          <span className="journey-progress__sr">{stage}: {state}</span>
        </li>
      );
    })}
  </ol>
);
