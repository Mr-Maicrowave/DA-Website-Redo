import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { referenceStoryAssets } from './referenceStoryData';

const PrimaryJourneyOutro = () => (
  <section
    id="primary-journey-outro"
    className="primary-journey-outro"
    aria-labelledby="primary-journey-outro-title"
    data-primary-reference-section="primary-journey-outro"
  >
    <img
      className="primary-journey-outro__landscape"
      src={referenceStoryAssets.closingLandscape}
      alt="A flower-lined path winding through blue and green hills beneath an open sky"
      loading="lazy"
      decoding="async"
    />

    <div className="primary-journey-outro__content">
      <p className="primary-journey-outro__chapter">Their next chapter starts here</p>
      <h2 id="primary-journey-outro-title">A clear path. Every step matters.</h2>
      <p className="primary-journey-outro__lead">We’re here beside your child at every stage.</p>
      <div className="primary-journey-outro__actions">
        <Link className="primary-journey-outro__primary" to="/book-interview">
          Book a Consultation <ArrowRight aria-hidden="true" />
        </Link>
        <a className="primary-journey-outro__secondary" href="#pathway">See How It Works</a>
      </div>
    </div>
  </section>
);

export default PrimaryJourneyOutro;
