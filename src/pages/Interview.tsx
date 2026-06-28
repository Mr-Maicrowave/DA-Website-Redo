import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';

const Interview = () => {
  return (
    <>
      <SEO
        title="Principal's Voice — Reflections & Interview"
        description="An intimate conversation with DA Tuition's founder. Miss Amanda shares the mission, values and teaching philosophy that shapes every lesson."
        canonicalUrl="/interview"
      />
      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <NavigationNew />
        <iframe
          src="/principal-voice-book.html"
          style={{
            flex: 1,
            width: '100%',
            border: 'none',
            display: 'block',
          }}
          title="Principal's Voice — Reflections & Interview"
        />
      </div>
    </>
  );
};

export default Interview;
