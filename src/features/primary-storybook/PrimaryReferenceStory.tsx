import { useRef } from 'react';
import FamilyReasons from './FamilyReasons';
import FoundationCurriculum from './FoundationCurriculum';
import FoundationSection from './FoundationSection';
import GrowthCurriculum from './GrowthCurriculum';
import GrowthSection from './GrowthSection';
import HowWeTeach from './HowWeTeach';
import MasteryCurriculum from './MasteryCurriculum';
import MasterySection from './MasterySection';
import PrimaryJourneyOutro from './PrimaryJourneyOutro';
import ProgramBag from './ProgramBag';
import usePrimaryReferenceMotion from './usePrimaryReferenceMotion';
import './primary-reference.css';

const PrimaryReferenceStory = () => {
  const rootRef = useRef<HTMLElement>(null);
  usePrimaryReferenceMotion(rootRef);

  return (
    <main ref={rootRef} id="primary-page-content" className="primary-reference-story">
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
};

export default PrimaryReferenceStory;
