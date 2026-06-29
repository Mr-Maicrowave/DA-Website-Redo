import SEO from '@/components/SEO';

const PrincipalReflections = () => {
  return (
    <>
      <SEO
        title="Principal's Reflection"
        description="Read the principal's reflection. Miss Amanda shares the mission, values and teaching philosophy that shapes every lesson at DA Tuition."
        canonicalUrl="/principal-reflections"
      />
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
    </>
  );
};

export default PrincipalReflections;
