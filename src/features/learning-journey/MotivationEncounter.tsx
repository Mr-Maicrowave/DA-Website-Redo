import { AssessmentChoice } from "./AssessmentChoice";
import { AssessmentEncounter } from "./AssessmentEncounter";
import { JourneyProgress } from "./JourneyProgress";
import { journeyAssets } from "./journeyAssets";
import { motivationChoices } from "./motivationModel";
import { type EncounterPhase, type MotivationAnswer } from "./assessmentTypes";
import "./motivation-encounter.css";

const ObstacleStory = ({ value }: { value: MotivationAnswer }) => (
  <span className={`motivation-story motivation-story--${value}`} aria-hidden="true">
    <span className="motivation-story__road" />
    <img className="motivation-story__rock" src={journeyAssets.flora[2]} alt="" />
    {value === "needs-encouragement" ? (
      <>
        <span className="motivation-story__sign">Keep going</span>
        <span className="motivation-story__warmth" data-motivation-warmth />
        <span className="motivation-story__leaf" />
      </>
    ) : null}
    {value === "persistent" ? (
      <span className="motivation-story__attempts">
        <i /><i /><i data-attempt-complete />
      </span>
    ) : null}
    {value === "challenge-seeking" ? (
      <>
        <img className="motivation-story__book" src={journeyAssets.objects[2]} alt="" />
        <span className="motivation-story__question">?</span>
        <span className="motivation-story__star">✦</span>
      </>
    ) : null}
  </span>
);

interface MotivationEncounterProps {
  value: MotivationAnswer | null;
  phase: EncounterPhase;
  onSelect: (answer: MotivationAnswer) => void;
}

export const MotivationEncounter = ({ value, phase, onSelect }: MotivationEncounterProps) => (
  <div className="motivation-scene" data-journey-motivation-arrival>
    <div className="motivation-obstacle" aria-hidden="true">
      <span className="motivation-obstacle__worksheet" />
      <span className="motivation-obstacle__pencil" />
      <span className="motivation-obstacle__twig" />
      <span className="motivation-obstacle__stone motivation-obstacle__stone--one" />
      <span className="motivation-obstacle__stone motivation-obstacle__stone--two" />
      <span className="motivation-obstacle__light" />
    </div>
    <JourneyProgress
      completed={value === null
        ? ["Academic Level", "Confidence", "Learning Habits"]
        : ["Academic Level", "Confidence", "Learning Habits", "Motivation"]}
      current={value === null ? "Motivation" : "Goals"}
    />
    <AssessmentEncounter
      id="motivation"
      label="04 — WHEN IT GETS HARD"
      heading="When the work becomes difficult, what usually happens next?"
      supportingText="Think about homework, unfamiliar questions or challenging new concepts."
      phase={phase}
    >
      {motivationChoices.map((choice) => (
        <AssessmentChoice
          key={choice.value}
          name="motivation"
          {...choice}
          selected={value === choice.value}
          disabled={phase === "confirming"}
          dimmed={value !== null && value !== choice.value}
          illustration={<ObstacleStory value={choice.value} />}
          onSelect={onSelect}
        />
      ))}
    </AssessmentEncounter>
  </div>
);
