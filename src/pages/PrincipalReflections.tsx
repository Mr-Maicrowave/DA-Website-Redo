import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';

const PrincipalReflections = () => {
  return (
    <>
      <SEO
        title="Principal's Reflection"
        description="Read the principal's reflection. Miss Amanda shares the mission, values and teaching philosophy that shapes every lesson at DA Tuition."
        canonicalUrl="/principal-reflections"
      />
      <NavigationNew />
      <div
        style={{
          width: '100vw',
          height: '100svh',
          overflow: 'hidden',
          margin: 0,
          paddingTop: 96,
          boxSizing: 'border-box',
        }}
      >
        <iframe
          src="/principal-voice-book.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
          title="Principal's Reflection"
        />
      </div>
    </>
  );
};

export default PrincipalReflections;
