import { useEffect, useRef, useState } from 'react';
import { BookOpen } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import SubjectHero from '@/components/subjects/SubjectHero';
import SEO from '@/components/SEO';
import { EnglishIntroVideoGate } from '@/features/english-intro-video/EnglishIntroVideoGate';

const English = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeResizeObserverRef = useRef<ResizeObserver | null>(null);
  const [iframeHeight, setIframeHeight] = useState('100svh');

  const updateIframeHeight = () => {
    const doc = iframeRef.current?.contentDocument;
    if (doc?.documentElement) {
      setIframeHeight(`${doc.documentElement.scrollHeight}px`);
    }
  };

  const handleIframeLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    updateIframeHeight();

    iframeResizeObserverRef.current?.disconnect();
    if (doc?.documentElement && 'ResizeObserver' in window) {
      iframeResizeObserverRef.current = new ResizeObserver(updateIframeHeight);
      iframeResizeObserverRef.current.observe(doc.documentElement);
      if (doc.body) iframeResizeObserverRef.current.observe(doc.body);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateIframeHeight);
    return () => {
      window.removeEventListener('resize', updateIframeHeight);
      iframeResizeObserverRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <EnglishIntroVideoGate />
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
        exploreTargetId="english-page-content"
        placeholderLabel="English classroom"
        backgroundImageSrc="/images/subjects/english/hero-background.png"
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
