import { useEffect, useRef, useState } from 'react';
import { BookOpen } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import SubjectHero from '@/components/subjects/SubjectHero';
import SEO from '@/components/SEO';

const English = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState('100svh');

  const handleIframeLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (doc?.documentElement) {
      setIframeHeight(`${doc.documentElement.scrollHeight}px`);
    }
  };

  useEffect(() => {
    const updateHeight = () => {
      const doc = iframeRef.current?.contentDocument;
      if (doc?.documentElement) setIframeHeight(`${doc.documentElement.scrollHeight}px`);
    };

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <>
      <SEO
        title="English Tutoring"
        description="English tuition for Years 7-12 students who need structure, confidence, sharper analysis, and detailed writing feedback."
        canonicalUrl="/subjects/english"
      />
      <NavigationNew />
      <SubjectHero
        eyebrow="Years 7-12 English"
        icon={BookOpen}
        headlineWhite="Writing with clarity."
        headlineGold="Thinking with depth."
        subtext="English tuition for students who need structure, confidence, and sharper analysis - from early essay foundations through to high-level HSC responses."
        proofPills={['Booklet-led lessons', 'Marked feedback', 'Clear writing pathway']}
        exploreTargetId="english-page-content"
        placeholderLabel="English classroom"
        backgroundImageSrc="/english-page/images/subjects/english/structured-classroom-cr4.jpeg"
        backgroundImageAlt="DA Tuition English classroom"
        mobileBackgroundPosition="72% center"
        mobileContentPosition="bottom"
      />
      <div id="english-page-content">
        <iframe
          ref={iframeRef}
          src="/english-page/index.html"
          title="DA Tuition English"
          onLoad={handleIframeLoad}
          scrolling="no"
          style={{
            width: '100%',
            height: iframeHeight,
            border: 0,
            display: 'block',
          }}
        />
      </div>
    </>
  );
};

export default English;
