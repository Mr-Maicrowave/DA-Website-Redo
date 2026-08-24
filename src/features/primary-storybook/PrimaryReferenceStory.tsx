import {
  familyReasons,
} from './referenceStoryData';
import FoundationCurriculum from './FoundationCurriculum';
import FoundationSection from './FoundationSection';
import GrowthCurriculum from './GrowthCurriculum';
import GrowthSection from './GrowthSection';
import HowWeTeach from './HowWeTeach';
import MasteryCurriculum from './MasteryCurriculum';
import MasterySection from './MasterySection';
import ProgramBag from './ProgramBag';
import './primary-reference.css';

const FamilyReasons = () => (
  <section id="family-reasons" aria-labelledby="family-reasons-title" data-primary-reference-section="family-reasons">
    <h2 id="family-reasons-title">Why families choose DA.</h2>
    <ul>
      {familyReasons.map((reason) => <li key={reason.title}><h3>{reason.title}</h3><p>{reason.body}</p></li>)}
    </ul>
  </section>
);

const PrimaryJourneyOutro = () => (
  <section id="primary-journey-outro" aria-labelledby="primary-journey-outro-title" data-primary-reference-section="primary-journey-outro">
    <h2 id="primary-journey-outro-title">A clear path. Every step matters.</h2>
    <p>We’re here beside your child at every stage.</p>
  </section>
);

const PrimaryReferenceStory = () => (
  <main id="primary-page-content" className="primary-reference-story">
    <nav className="primary-reference-year-nav" aria-label="Primary school year groups">
      <a href="#foundation">Years 1–2</a>
      <a href="#growth">Years 3–4</a>
      <a href="#mastery">Years 5–6</a>
    </nav>
    <FoundationSection />
    <FoundationCurriculum />
    <HowWeTeach />
    <GrowthSection />
    <GrowthCurriculum />
    <MasterySection />
    <MasteryCurriculum />
    <ProgramBag />
    <FamilyReasons />
    <PrimaryJourneyOutro />
  </main>
);

export default PrimaryReferenceStory;
