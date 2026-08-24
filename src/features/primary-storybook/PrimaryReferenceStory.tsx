import {
  curriculumBands,
  familyReasons,
  foundationOutcomes,
  programChoices,
  referenceStoryAssets,
  stagePhotos,
  teachingSteps,
} from './referenceStoryData';

type StorySectionProps = {
  id: string;
  label: string;
};

const StorySection = ({ id, label }: StorySectionProps) => (
  <section id={id} aria-labelledby={`${id}-title`} data-primary-reference-section={id}>
    <h2 id={`${id}-title`}>{label}</h2>
  </section>
);

// These semantic slots deliberately own no visual composition. Their focused
// implementations arrive in Tasks 3–6 without changing the story boundary.
const FoundationSection = () => (
  <StorySection id="foundation" label={`Years 1–2 foundations: ${foundationOutcomes.length} ways we build confidence`} />
);

const FoundationCurriculum = () => (
  <StorySection id="foundation-curriculum" label={`${curriculumBands.foundation.years} ${curriculumBands.foundation.title}`} />
);

const HowWeTeach = () => (
  <StorySection id="pathway" label={`How we teach in ${teachingSteps.length} connected moments`} />
);

const GrowthSection = () => (
  <StorySection id="growth" label={`Years 3–4 growth with ${stagePhotos.growth.alt.toLowerCase()}`} />
);

const GrowthCurriculum = () => (
  <StorySection id="growth-curriculum" label={`${curriculumBands.growth.years} ${curriculumBands.growth.title}`} />
);

const MasterySection = () => (
  <StorySection id="mastery" label={`Years 5–6 mastery with ${stagePhotos.mastery.alt.toLowerCase()}`} />
);

const MasteryCurriculum = () => (
  <StorySection id="mastery-curriculum" label={`${curriculumBands.mastery.years} ${curriculumBands.mastery.title}`} />
);

const ProgramBag = () => (
  <StorySection id="programs" label={`Find their place across ${programChoices.length} DA programs`} />
);

const FamilyReasons = () => (
  <StorySection id="family-reasons" label={`${familyReasons.length} reasons families choose DA`} />
);

const PrimaryJourneyOutro = () => (
  <StorySection id="primary-journey-outro" label={`The journey continues with ${referenceStoryAssets.closingLandscape}`} />
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
