import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';

const PrincipalInterview = () => {
  return (
    <>
      <SEO
        title="Principal's Interview"
        description="Read Miss Amanda's principal interview, including the questions, answers and reflections behind DA Tuition's teaching philosophy."
        canonicalUrl="/principal-interview-paper"
      />
      <NavigationNew />
      <iframe
        src="/principal-interview/interview.html"
        style={{
          width: '100%',
          height: '100svh',
          border: 0,
          display: 'block',
        }}
        title="Principal's Interview"
      />
    </>
  );
};

export default PrincipalInterview;
