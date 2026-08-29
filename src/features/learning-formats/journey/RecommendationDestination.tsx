import { journeyAssets } from "./journeyAssets";
import type { JourneyStartingPoint } from "../logic/buildJourneyStartingPoint";

interface RecommendationDestinationProps {
  result: JourneyStartingPoint;
  continued: boolean;
  onContinue: () => void;
  onChangeAnswers: () => void;
}

const RecommendationDestination = ({ result, continued, onContinue, onChangeAnswers }: RecommendationDestinationProps) => (
  <section className="lf-starting-destination" aria-labelledby="lf-starting-heading">
    <div className="lf-starting-destination__landscape" aria-hidden="true">
      <img className="lf-starting-destination__sign" src={journeyAssets.shared.junctionSignpostBlank.src} alt="" />
      <img className="lf-starting-destination__flag" src={journeyAssets.shared.daFlag.src} alt="" />
      <img className="lf-starting-destination__plant" src={journeyAssets.shared.shrubs.src} alt="" />
    </div>
    {!continued ? <div className="lf-starting-destination__copy">
      <p>Preliminary guidance</p>
      <h2 id="lf-starting-heading">Here&apos;s where we&apos;d start.</h2>
      <h3>{result.label}</h3>
      <p className="lf-starting-destination__summary">{result.summary}</p>
      <ul>{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
      <p className="lf-starting-destination__note">This is a preliminary recommendation, not a diagnosis or final placement.</p>
      <div className="lf-starting-destination__actions">
        <button type="button" className="lf-starting-destination__continue" onClick={onContinue}>Continue to subjects →</button>
        <button type="button" className="lf-starting-destination__change" onClick={onChangeAnswers}>Change my answers</button>
      </div>
    </div> : <div className="lf-starting-destination__continued" aria-live="polite"><p>Next destination</p><h2>Subjects are just ahead.</h2></div>}
  </section>
);

export default RecommendationDestination;
