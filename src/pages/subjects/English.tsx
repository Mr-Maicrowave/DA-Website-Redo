import { useRef, useState } from 'react';
import { BookOpen } from 'lucide-react';
import BookIntro from '@/components/intro/BookIntro';
import IntroVideo from '@/components/intro/IntroVideo';
import NavigationNew from '@/components/NavigationNew';
import SubjectHero from '@/components/subjects/SubjectHero';
import SEO from '@/components/SEO';
import {
  ENGLISH_SUBJECT_BOOK_INTRO_SESSION_KEY,
  shouldShowBookIntro,
} from '@/lib/bookIntroSession';
import { ENGLISH_SUBJECT_INTRO_VIDEO_SESSION_KEY } from '@/lib/useIntro';

const English = () => {
  const [showBookIntro, setShowBookIntro] = useState(() =>
    shouldShowBookIntro(ENGLISH_SUBJECT_BOOK_INTRO_SESSION_KEY),
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState('100svh');

  const handleIframeLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (doc?.documentElement) {
      setIframeHeight(`${doc.documentElement.scrollHeight}px`);
    }
  };

  return (
    <>
      <SEO
        title="English Tutoring"
        description="English tuition for Years 7-12 students who need structure, confidence, sharper analysis, and detailed writing feedback."
        canonicalUrl="/subjects/english"
      />
      <IntroVideo storageKey={ENGLISH_SUBJECT_INTRO_VIDEO_SESSION_KEY} />
      {showBookIntro && (
        <BookIntro
          storageKey={ENGLISH_SUBJECT_BOOK_INTRO_SESSION_KEY}
          onComplete={() => setShowBookIntro(false)}
        />
      )}
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
      />
      <div id="english-page-content">
        <iframe
          ref={iframeRef}
          src="/english-page/index.html"
          title="DA Tuition English"
          onLoad={handleIframeLoad}
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
