import { useState } from 'react';
import BookIntro from '@/components/intro/BookIntro';
import IntroVideo from '@/components/intro/IntroVideo';
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
