import FooterNew from "@/components/FooterNew";
import NavigationNew from "@/components/NavigationNew";
import SEO from "@/components/SEO";
import LearningFormatsJourney from "@/features/learning-formats/journey/LearningFormatsJourney";
import { useLearningFormatsState } from "@/features/learning-formats/state/useLearningFormatsState";

const LearningFormats = () => {
  const controller = useLearningFormatsState();
  return (
  <div className="min-h-screen">
    <SEO
      title="Learning Formats — DA Tuition"
      description="A guided tool to explore whether Private or Class learning suits your child, plus the specialist programs worth considering for each subject."
      canonicalUrl="/learning-formats"
    />
    <NavigationNew />
    <main className="bg-brand-ivory">
      <LearningFormatsJourney controller={controller} />
    </main>
    <FooterNew />
  </div>
  );
};

export default LearningFormats;
