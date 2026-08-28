import FooterNew from "@/components/FooterNew";
import NavigationNew from "@/components/NavigationNew";
import SEO from "@/components/SEO";
import LearningJourney from "@/features/learning-journey/LearningJourney";

const LearningFormats = () => (
  <div className="min-h-screen">
    <SEO
      title="Learning Formats — DA Tuition"
      description="Explore how DA Tuition helps identify the learning environment where your child can thrive."
      canonicalUrl="/learning-formats"
    />
    <NavigationNew />
    <LearningJourney />
    <FooterNew />
  </div>
);

export default LearningFormats;
