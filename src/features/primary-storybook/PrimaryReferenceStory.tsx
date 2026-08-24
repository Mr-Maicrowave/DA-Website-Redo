import {
  curriculumBands,
  familyReasons,
  foundationOutcomes,
  programChoices,
  teachingSteps,
} from './referenceStoryData';

const FoundationSection = () => (
  <section id="foundation" aria-labelledby="foundation-title" data-primary-reference-section="foundation">
    <p>Years 1–2</p>
    <h2 id="foundation-title">Strong foundations shape everything that follows.</h2>
    <p>We build core skills, spark curiosity and nurture confidence—creating the strongest start for your child’s future.</p>
    <ul>
      {foundationOutcomes.map((outcome) => <li key={outcome.number}>{outcome.title}</li>)}
    </ul>
  </section>
);

const FoundationCurriculum = () => (
  <section id="foundation-curriculum" aria-labelledby="foundation-curriculum-title" data-primary-reference-section="foundation-curriculum">
    <p>{curriculumBands.foundation.years} {curriculumBands.foundation.title}</p>
    <h2 id="foundation-curriculum-title">Explore what they’ll learn.</h2>
    <ul>
      {curriculumBands.foundation.items.map((item) => <li key={item.title}>{item.detail}</li>)}
    </ul>
  </section>
);

const HowWeTeach = () => (
  <section id="pathway" aria-labelledby="pathway-title" data-primary-reference-section="pathway">
    <h2 id="pathway-title">How we teach</h2>
    <p>Clear teaching, guided practice and independent confidence make every lesson count.</p>
    <ol>
      {teachingSteps.map((step) => <li key={step.number}><h3>{step.title}</h3><p>{step.body}</p></li>)}
    </ol>
  </section>
);

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
    <nav aria-label="Primary school year groups">
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
