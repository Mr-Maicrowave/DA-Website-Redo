import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { succeedVideo } from './succeedVideo';
import './WeSucceedSection.css';

export default function WeSucceedSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>();
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reflection, setReflection] = useState({ x: 50, y: 50 });

  useEffect(() => () => clearTimeout(controlsTimer.current), []);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video || !succeedVideo.src) return;
    if (video.paused) await video.play(); else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    setControlsVisible(true);
  };

  const revealControls = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setReflection({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 });
    if (!playing) return;
    setControlsVisible(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setControlsVisible(false), 1800);
  };

  const screenStyle = {
    '--succeed-position-desktop': succeedVideo.objectPositionDesktop,
    '--succeed-position-tablet': succeedVideo.objectPositionTablet,
    '--succeed-position-mobile': succeedVideo.objectPositionMobile,
    '--reflection-x': `${reflection.x}%`,
    '--reflection-y': `${reflection.y}%`,
  } as CSSProperties;

  return <section id="why-da-succeed" className={`why-da-succeed${playing ? ' is-playing' : ''}`} data-testid="why-da-succeed" aria-labelledby="why-da-succeed-title">
    <header className="succeed-intro" data-motion="succeed-intro">
      <div className="why-da-section-heading"><span>05 /</span><h2 id="why-da-succeed-title">WE SUCCEED</h2></div>
      <h3><span>Everything before this<br />leads </span><em>somewhere.</em></h3>
      <p>THE FINAL CHAPTER</p>
    </header>

    <div className="succeed-cinema" data-motion="succeed-screen-wrap">
      <div className="succeed-screen" style={screenStyle} onPointerMove={revealControls} onPointerLeave={() => setControlsVisible(false)}>
        <div className="succeed-film-rail succeed-film-rail--top" aria-hidden="true"><span>DA FILM</span><span>FINAL CHAPTER</span><span>05</span></div>
        <div className="succeed-film-rail succeed-film-rail--bottom" aria-hidden="true"><span>▶ 20</span><span>DA TUITION</span><span>CLASS OF 2020&nbsp; ▶</span></div>
        <span className="succeed-film-edge succeed-film-edge--left" aria-hidden="true"><b>DA TUITION</b><i>EST. 2010</i></span>
        <span className="succeed-film-edge succeed-film-edge--right" aria-hidden="true"><b>STORIES OF GROWTH</b><i>REAL RESULTS</i></span>
        <div className="succeed-screen__projection" data-motion="succeed-projection">
          {succeedVideo.src ? <video ref={videoRef} src={succeedVideo.src} poster={succeedVideo.poster ?? undefined} preload="metadata" playsInline controlsList="nodownload noplaybackrate" onPlay={() => { setPlaying(true); setHasStarted(true); setControlsVisible(true); }} onPause={() => setPlaying(false)} onVolumeChange={(event) => setMuted(event.currentTarget.muted)} onTimeUpdate={(event) => setProgress(event.currentTarget.duration ? event.currentTarget.currentTime / event.currentTarget.duration : 0)}>
            {succeedVideo.captions && <track kind="captions" src={succeedVideo.captions} srcLang="en" label="English" default />}
          </video> : <div className="succeed-screen__placeholder"><strong>VIDEO PENDING</strong><span>DA / FINAL CHAPTER / 05</span></div>}
        </div>
        <div className="succeed-screen__letterbox succeed-screen__letterbox--top"><span>DA TUITION&nbsp;&nbsp; FINAL CHAPTER</span><span>05 / WE SUCCEED</span></div>
        <div className="succeed-screen__letterbox succeed-screen__letterbox--bottom"><span>A DA FILM</span><span>SUCCESS / 001</span></div>
        <span className="succeed-screen__notation succeed-screen__notation--left">35MM · E 05</span><span className="succeed-screen__notation succeed-screen__notation--right">REG · 001</span>
        <div className="succeed-screen__grain" aria-hidden="true" /><div className="succeed-screen__light-leak" aria-hidden="true" /><div className="succeed-screen__reflection" aria-hidden="true" />
        <div className="succeed-screen__exposure" data-motion="succeed-exposure" aria-hidden="true" />
        <div className="succeed-screen__mask succeed-screen__mask--top" data-motion="succeed-aperture-top" aria-hidden="true" /><div className="succeed-screen__mask succeed-screen__mask--bottom" data-motion="succeed-aperture-bottom" aria-hidden="true" />
        <span className="succeed-screen__locked" data-motion="succeed-frame-locked">FRAME LOCKED</span>
        <button className="succeed-screen__play" type="button" aria-label="Play We Succeed film" aria-disabled={!succeedVideo.src} onClick={togglePlayback}><Play aria-hidden="true" />WATCH THE STORY<i /></button>
        {hasStarted && <div className={`succeed-screen__controls${controlsVisible || !playing ? ' is-visible' : ''}`}>
          <button type="button" onClick={togglePlayback} aria-label={playing ? 'Pause We Succeed film' : 'Play We Succeed film'}>{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}</button>
          <span aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></span>
          <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute We Succeed film' : 'Mute We Succeed film'}>{muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}</button>
        </div>}
      </div>
    </div>

    <div className="succeed-after" data-motion="succeed-after">
      <div className="succeed-quote"><small>AND THEN ONE DAY,</small><span className="succeed-quote__mark succeed-quote__mark--open" aria-hidden="true">“</span><blockquote aria-label="I didn’t think I could get this far.">“I didn’t think I could<br />get <em>this</em> far.”</blockquote><span className="succeed-quote__mark succeed-quote__mark--close" aria-hidden="true">”</span><i aria-hidden="true" /><p>This is why we do it.</p></div>
    </div>
  </section>;
}
