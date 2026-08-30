import { journeyAssets } from "./journeyAssets";
import type { JourneyStartingPoint } from "../logic/buildJourneyStartingPoint";

interface RecommendationDestinationProps {
  result: JourneyStartingPoint;
  onContinue: () => void;
  onChangeAnswers: () => void;
}

const RecommendationDestination = ({ result, onContinue, onChangeAnswers }: RecommendationDestinationProps) => (
  <section className="lf-starting-destination" aria-labelledby="lf-starting-heading">
    <div className="lf-starting-destination__landscape" aria-hidden="true">
      <span className="lf-starting-destination__marker" />
      <img className="lf-starting-destination__flag" src={journeyAssets.shared.daFlag.src} alt="" />
      <img className="lf-starting-destination__plant" src={journeyAssets.shared.shrubs.src} alt="" />
      <img className="lf-starting-destination__books" src={journeyAssets.shared.books.src} alt="" />
    </div>
    <div className="lf-starting-destination__copy">
      <p>Preliminary guidance</p>
      <h2 id="lf-starting-heading">Here&apos;s where we&apos;d start.</h2>
      <h3>{result.label}</h3>
      <p className="lf-starting-destination__summary">{result.summary}</p>
      <ul>{result.reasons.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}</ul>
      <div className="lf-starting-destination__actions">
        <button type="button" className="lf-starting-destination__continue" onClick={onContinue}>Continue to subjects →</button>
        <button type="button" className="lf-starting-destination__change" onClick={onChangeAnswers}>← Change my answers</button>
      </div>
    </div>
  </section>
);

export default RecommendationDestination;
