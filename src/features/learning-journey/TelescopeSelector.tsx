import { AssessmentChoice } from "./AssessmentChoice";
import { goalsChoices } from "./goalsModel";
import { type GoalsAnswer } from "./assessmentTypes";

const FutureIllustration = ({ value }: { value: GoalsAnswer }) => (
  <span className={`goals-future goals-future--${value}`} aria-hidden="true">
    <span className="goals-future__horizon" />
    {value === "confidence-foundations" ? (
      <>
        <span className="goals-future__bridge"><i /><i /><i /></span>
        <span className="goals-future__lamp" />
        <span className="goals-future__plant"><i /><i /></span>
      </>
    ) : null}
    {value === "steady-progress" ? (
      <>
        <span className="goals-future__path" />
        <span className="goals-future__milestones"><i /><i /><i /></span>
        <span className="goals-future__sun" />
      </>
    ) : null}
    {value === "extension" ? (
      <>
        <span className="goals-future__observatory"><i /></span>
        <span className="goals-future__constellation"><i /><i /><i /></span>
        <span className="goals-future__star">✦</span>
      </>
    ) : null}
  </span>
);

interface TelescopeSelectorProps {
  value: GoalsAnswer | null;
  disabled: boolean;
  onSelect: (answer: GoalsAnswer) => void;
}

export const TelescopeSelector = ({ value, disabled, onSelect }: TelescopeSelectorProps) => (
  <div className="telescope-selector" data-telescope-selector data-selected-goal={value ?? "none"}>
    <div className="telescope-lookout" aria-hidden="true">
      <span className="telescope-lookout__tree"><i /><i /><i /></span>
      <span className="telescope-lookout__bench" />
      <span className="telescope-lookout__scope"><i /><b /></span>
      <span className="telescope-lookout__glint">✦</span>
    </div>
    {goalsChoices.map((choice) => (
      <AssessmentChoice
        key={choice.value}
        name="goals"
        {...choice}
        selected={value === choice.value}
        disabled={disabled}
        dimmed={value !== null && value !== choice.value}
        illustration={<FutureIllustration value={choice.value} />}
        onSelect={onSelect}
      />
    ))}
  </div>
);
