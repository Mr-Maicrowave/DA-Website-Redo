import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';

const PrincipalReflections = () => {
  return (
    <>
      <SEO
        title="Principal's Reflection"
        description="Read the principal's reflection. Miss Amanda shares the mission, values and teaching philosophy that shapes every lesson at DA Tuition."
        canonicalUrl="/principal-reflections"
      />
      <NavigationNew />
      <iframe
        src="/principal-interview/index.html"
        style={{
          width: '100%',
          height: '100svh',
          border: 0,
          display: 'block',
        }}
        title="Principal's Reflection"
      />
      <FooterNew />
    </>
  );
};

export default PrincipalReflections;
