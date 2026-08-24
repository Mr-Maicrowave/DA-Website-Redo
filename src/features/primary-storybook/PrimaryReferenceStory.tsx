import {
  curriculumBands,
  familyReasons,
  programChoices,
} from './referenceStoryData';
import FoundationCurriculum from './FoundationCurriculum';
import FoundationSection from './FoundationSection';
import HowWeTeach from './HowWeTeach';
import './primary-reference.css';

const GrowthSection = () => (
  <section id="growth" aria-labelledby="growth-title" data-primary-reference-section="growth">
    <p>Years 3–4</p>
    <h2 id="growth-title">Growing skills. Building independence.</h2>
    <p>We help students think deeper, work independently and take on new challenges with confidence.</p>
  </section>
);

const GrowthCurriculum = () => (
  <section id="growth-curriculum" aria-labelledby="growth-curriculum-title" data-primary-reference-section="growth-curriculum">
    <p>{curriculumBands.growth.years} {curriculumBands.growth.title}</p>
    <h2 id="growth-curriculum-title">Explore what they’ll master next.</h2>
    <ul>
      {curriculumBands.growth.items.map((item) => <li key={item.title}>{item.detail}</li>)}
    </ul>
  </section>
);

const MasterySection = () => (
  <section id="mastery" aria-labelledby="mastery-title" data-primary-reference-section="mastery">
    <p>Years 5–6</p>
    <h2 id="mastery-title">Ready for what comes next.</h2>
    <p>We prepare students for selective entry, Year 7 transition and high school success with academic excellence and resilience.</p>
  </section>
);

const MasteryCurriculum = () => (
  <section id="mastery-curriculum" aria-labelledby="mastery-curriculum-title" data-primary-reference-section="mastery-curriculum">
    <p>{curriculumBands.mastery.years} {curriculumBands.mastery.title}</p>
    <h2 id="mastery-curriculum-title">Preparing them for the next chapter.</h2>
    <ul>
      {curriculumBands.mastery.items.map((item) => <li key={item.title}>{item.detail}</li>)}
    </ul>
  </section>
);

const ProgramBag = () => (
  <section id="programs" aria-labelledby="programs-title" data-primary-reference-section="programs">
    <h2 id="programs-title">Find their place.</h2>
    <p>Every child can find the support that suits how they learn best.</p>
    <ul>
      {programChoices.map((program) => <li key={program.id}><h3>{program.title}</h3><p>{program.description}</p></li>)}
    </ul>
  </section>
);

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
