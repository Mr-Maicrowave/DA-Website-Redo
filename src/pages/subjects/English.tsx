import SEO from '@/components/SEO';

const English = () => {
  return (
    <>
      <SEO
        title="English Tutoring"
        description="English tuition for Years 7-12 students who need structure, confidence, sharper analysis, and detailed writing feedback."
        canonicalUrl="/subjects/english"
      />
      <iframe
        src="/english-page/index.html"
        title="DA Tuition English"
        style={{
          width: '100%',
          height: '100svh',
          border: 0,
          display: 'block',
        }}
      />
    </>
  );
};

export default English;
