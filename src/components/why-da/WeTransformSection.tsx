import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, ChartNoAxesColumnIncreasing, Heart, Pause, Play, Trophy, Volume2, VolumeX, X } from 'lucide-react';
import { transformStories, type TransformStory } from './transformStories';
import './WeTransformSection.css';

const icons = [Heart, BookOpen, ArrowDown, ChartNoAxesColumnIncreasing, Trophy];

const storyStyle = (story: TransformStory) => ({
  '--transform-position-desktop': story.objectPositionDesktop,
  '--transform-position-tablet': story.objectPositionTablet,
  '--transform-position-mobile': story.objectPositionMobile,
}) as CSSProperties;

function Quote({ story }: { story: TransformStory }) {
  const [before, after = ''] = story.quote.split(story.emphasis);
  return <>{before}<em>{story.emphasis}</em>{after}</>;
}

function StoryPanel({ story, index, active, onActivate, onWatch, panelRef }: { story: TransformStory; index: number; active: boolean; onActivate: () => void; onWatch: (event: MouseEvent<HTMLButtonElement>) => void; panelRef: (node: HTMLElement | null) => void }) {
  const Icon = icons[index];
  return <article ref={panelRef} className={`transform-panel${active ? ' is-active' : ''}`} style={storyStyle(story)} data-motion="transform-panel" onPointerEnter={(event) => { if (event.pointerType === 'mouse') onActivate(); }}>
    <button className="transform-panel__select" type="button" aria-label={`Show story ${story.number}: ${story.category}`} aria-pressed={active} onClick={onActivate} />
    {story.videoSrc ? <video src={story.videoSrc} poster={story.poster ?? undefined} muted loop playsInline preload={active ? 'metadata' : 'none'}>
      {story.captions && <track kind="captions" src={story.captions} srcLang="en" label="English" default />}
    </video> : <div className="transform-panel__placeholder"><span>VIDEO {story.number} PENDING</span></div>}
    <span className="transform-panel__number">{story.number}</span>
    <div className="transform-panel__active-copy" aria-hidden={!active}>
      <button type="button" className="transform-panel__play" onClick={onWatch} aria-label={`Watch story ${story.number}`}><Play aria-hidden="true" /></button>
      <blockquote><Quote story={story} /></blockquote>
      <p>{story.shortLine}</p>
      <button type="button" className="transform-panel__watch" onClick={onWatch}>WATCH STORY <ArrowRight aria-hidden="true" /></button>
    </div>
    <footer><Icon aria-hidden="true" /><strong>{story.category}</strong><span>{story.shortLine}</span></footer>
  </article>;
}

export default function WeTransformSection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [viewerStory, setViewerStory] = useState<TransformStory | null>(null);
  const [viewerPlaying, setViewerPlaying] = useState(false);
  const [viewerMuted, setViewerMuted] = useState(false);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const viewerVideoRef = useRef<HTMLVideoElement>(null);
  const viewerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const tracks = useMemo(() => transformStories.map((_, index) => index === activeIndex ? '1.75fr' : '1fr').join(' '), [activeIndex]);

  const activate = (index: number) => {
    setActiveIndex(index);
    if (matchMedia('(max-width: 900px)').matches) panelRefs.current[index]?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
  };
  const activatePrevious = () => activate((activeIndex + transformStories.length - 1) % transformStories.length);
  const activateNext = () => activate((activeIndex + 1) % transformStories.length);
  const handleGalleryKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); activatePrevious(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); activateNext(); }
  };
  const openViewer = (story: TransformStory, trigger: HTMLButtonElement) => {
    if (!story.videoSrc) return;
    viewerTriggerRef.current = trigger;
    setViewerStory(story);
  };
  const closeViewer = () => {
    viewerVideoRef.current?.pause();
    setViewerStory(null);
    setViewerPlaying(false);
    requestAnimationFrame(() => viewerTriggerRef.current?.focus());
  };

  useEffect(() => {
    if (!viewerStory) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') closeViewer(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [viewerStory]);

  const toggleViewerPlayback = async () => {
    const video = viewerVideoRef.current;
    if (!video) return;
    if (video.paused) await video.play(); else video.pause();
  };
  const toggleViewerMute = () => {
    const video = viewerVideoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setViewerMuted(video.muted);
  };

  return <section id="why-da-transform" className="why-da-transform" data-testid="why-da-transform" aria-labelledby="why-da-transform-title">
    <header className="transform-intro">
      <div className="why-da-section-heading" data-motion="transform-label"><span>04 /</span><h2 id="why-da-transform-title">WE TRANSFORM</h2></div>
      <h3 data-motion="transform-headline">Change looks different<br />on <em data-motion="transform-emphasis">everyone.</em></h3>
      <p data-motion="transform-support">Five stories. Five different journeys.</p>
      <span className="transform-note transform-note--left" aria-hidden="true">Real students.</span><span className="transform-note transform-note--right" aria-hidden="true">Real journeys.</span>
    </header>

    <div className="transform-gallery" tabIndex={0} onKeyDown={handleGalleryKeyDown} aria-label="Student transformation stories">
      <button type="button" className="transform-gallery__arrow transform-gallery__arrow--left" onClick={activatePrevious} aria-label="Previous transformation story"><ArrowLeft aria-hidden="true" /></button>
      <div className="transform-gallery__panels" style={{ '--transform-tracks': tracks } as CSSProperties}>
        {transformStories.map((story, index) => <StoryPanel story={story} index={index} active={index === activeIndex} onActivate={() => activate(index)} onWatch={(event) => openViewer(story, event.currentTarget)} panelRef={(node) => { panelRefs.current[index] = node; }} key={story.id} />)}
      </div>
      <button type="button" className="transform-gallery__arrow transform-gallery__arrow--right" onClick={activateNext} aria-label="Next transformation story"><ArrowRight aria-hidden="true" /></button>
    </div>

    <nav className="transform-progress" aria-label="Choose a transformation story">
      <span className="transform-progress__line" aria-hidden="true"><i className="transform-progress__indicator" style={{ left: `${activeIndex * 25}%` }} /></span>
      {transformStories.map((story, index) => <button type="button" aria-label={`Show story ${story.number}: ${story.category}`} aria-current={index === activeIndex ? 'step' : undefined} onClick={() => activate(index)} key={story.id}><i /><span>{story.number} {story.category}</span></button>)}
    </nav>

    <div className="transform-closing" data-motion="transform-finale-handoff"><p>Five different stories.<br /><em>One reason we keep going.</em></p><span><ArrowDown aria-hidden="true" /> SCROLL TO THE FINALE</span></div>

    {viewerStory && <div className="transform-viewer" role="dialog" aria-modal="true" aria-label={`${viewerStory.category} transformation story`}>
      <button type="button" className="transform-viewer__close" onClick={closeViewer} aria-label="Close story viewer"><X aria-hidden="true" /></button>
      <video ref={viewerVideoRef} src={viewerStory.videoSrc ?? undefined} poster={viewerStory.poster ?? undefined} playsInline preload="metadata" onPlay={() => setViewerPlaying(true)} onPause={() => setViewerPlaying(false)} onVolumeChange={(event) => setViewerMuted(event.currentTarget.muted)}>
        {viewerStory.captions && <track kind="captions" src={viewerStory.captions} srcLang="en" label="English" default />}
      </video>
      <div className="transform-viewer__controls"><button type="button" onClick={toggleViewerPlayback} aria-label={viewerPlaying ? 'Pause story video' : 'Play story video'}>{viewerPlaying ? <Pause /> : <Play />}</button><button type="button" onClick={toggleViewerMute} aria-label={viewerMuted ? 'Unmute story video' : 'Mute story video'}>{viewerMuted ? <VolumeX /> : <Volume2 />}</button></div>
    </div>}
  </section>;
}
