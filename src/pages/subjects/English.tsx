import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { BookOpen } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SubjectHero from '@/components/subjects/SubjectHero';
import SEO from '@/components/SEO';
import PageJourney from '@/components/page-journey/PageJourney';
import { EnglishIntroVideoGate } from '@/features/english-intro-video/EnglishIntroVideoGate';

const ENGLISH_JOURNEY_SECTIONS = [
  { id: 'english-introduction', sourceId: null, label: 'Introduction', description: 'Writing with clarity' },
  { id: 'english-year-map', sourceId: 'year-map-heading', label: 'Learning journey', description: 'Foundations to HSC' },
  { id: 'english-short-answer', sourceId: 'short-answer-transform', label: 'Short answers', description: 'Transform responses' },
  { id: 'english-resources', sourceId: 'resources', label: 'Resources', description: 'Learn from feedback' },
  { id: 'english-classes', sourceId: 'english-classes', label: 'Classes', description: 'Find the right fit' },
  { id: 'english-parent-questions', sourceId: 'parents-faq', label: 'Parent questions', description: 'What families ask' },
] as const;

const English = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeResizeObserverRef = useRef<ResizeObserver | null>(null);
  const [iframeHeight, setIframeHeight] = useState('100svh');
  const [bookletPreviewOpen, setBookletPreviewOpen] = useState(false);
  const [journeyOffsets, setJourneyOffsets] = useState<Record<string, number>>({});

  const updateIframeHeight = () => {
    const doc = iframeRef.current?.contentDocument;
    if (doc?.documentElement) {
      setIframeHeight(`${doc.documentElement.scrollHeight}px`);
      setJourneyOffsets(Object.fromEntries(ENGLISH_JOURNEY_SECTIONS.map(({ id, sourceId }) => [
        id,
        sourceId ? doc.getElementById(sourceId)?.getBoundingClientRect().top ?? 0 : 0,
      ])));
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

  useEffect(() => {
    const handlePreviewMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type !== 'da-english-preview') return;
      setBookletPreviewOpen(Boolean(event.data.open));
    };

    window.addEventListener('message', handlePreviewMessage);
    return () => window.removeEventListener('message', handlePreviewMessage);
  }, []);

  return (
    <>
      <EnglishIntroVideoGate />
      <SEO
        title="English Tutoring"
        description="English tuition for Years 7-12 students who need structure, confidence, sharper analysis, and detailed writing feedback."
        canonicalUrl="/subjects/english"
      />
      {!bookletPreviewOpen && <NavigationNew />}
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
      <div id="english-page-content" style={{ position: 'relative' }}>
        {ENGLISH_JOURNEY_SECTIONS.map(({ id }) => (
          <span
            key={id}
            id={id}
            aria-hidden="true"
            style={{ position: 'absolute', top: journeyOffsets[id] ?? 0, pointerEvents: 'none' } as CSSProperties}
          />
        ))}
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
      <PageJourney pageLabel="English" sections={ENGLISH_JOURNEY_SECTIONS.map(({ sourceId: _sourceId, ...section }) => section)} />
      <FooterNew />
    </>
  );
};

export default English;
