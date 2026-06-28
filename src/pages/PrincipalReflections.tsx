import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';

const PrincipalReflections = () => {
  return (
    <>
      <SEO
        title="Principal's Voice — Reflections & Interview"
        description="Read the principal's reflections and intimate interview. Miss Amanda shares the mission, values and teaching philosophy that shapes every lesson at DA Tuition."
        canonicalUrl="/principal-reflections"
      />
      <NavigationNew />
      <div style={{ width: '100vw', height: 'calc(100vh - 80px)', overflow: 'hidden', margin: 0, padding: 0 }}>
        <iframe
          src="/principal-voice-book.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
          title="Principal's Voice — Reflections & Interview"
        />
      </div>
    </>
  );
};

export default PrincipalReflections;
