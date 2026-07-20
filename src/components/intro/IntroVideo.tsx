import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useIntro } from '@/lib/useIntro';
import styles from './IntroVideo.module.css';

const fadeEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
const fadeOutMs = 800;

const IntroVideo = () => {
  const { isReady, markAsSeen, shouldPlay } = useIntro();
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const beginButtonRef = useRef<HTMLButtonElement>(null);
  const completeTimerRef = useRef<number>();
  const exitingRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [soundBlocked, setSoundBlocked] = useState(false);

  useEffect(() => {
    setVisible(isReady && shouldPlay);
  }, [isReady, shouldPlay]);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.dataset.daIntroActive = 'true';
    window.requestAnimationFrame(() => skipButtonRef.current?.focus({ preventScroll: true }));

    return () => {
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.daIntroActive;
      window.clearTimeout(completeTimerRef.current);
    };
  }, [visible]);

  const completeIntro = useCallback(() => {
    markAsSeen();
    setVisible(false);
    setExiting(false);
    setVideoEnded(false);
    setSoundBlocked(false);
    exitingRef.current = false;
  }, [markAsSeen]);

  const finishIntro = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;

    setExiting(true);

    completeTimerRef.current = window.setTimeout(() => {
      completeIntro();
    }, fadeOutMs);
  }, [completeIntro]);

  useEffect(() => {
    if (!visible || !videoRef.current) return;

    const video = videoRef.current;
    setVideoEnded(false);
    setSoundBlocked(false);
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    const playPromise = video.play();

    if (playPromise) {
      playPromise.catch(() => {
        video.muted = true;
        setSoundBlocked(true);
        void video.play();
      });
    }
  }, [visible]);

  const handleVideoEnded = () => {
    setVideoEnded(true);
    window.requestAnimationFrame(() => beginButtonRef.current?.focus({ preventScroll: true }));
  };

  const containKeyboardFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;

    const controls = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([disabled])'),
    );
    if (controls.length === 0) {
      event.preventDefault();
      return;
    }

    const first = controls[0];
    const last = controls[controls.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const skipIntro = () => {
    const video = videoRef.current;

    if (video) {
      const finalFrameTime = Number.isFinite(video.duration) ? Math.max(video.duration - 0.05, 0) : video.currentTime;
      video.currentTime = finalFrameTime;
      video.pause();
    }

    handleVideoEnded();
  };

  const beginJourney = () => {
    videoRef.current?.pause();
    finishIntro();
  };

  const enableSound = () => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = false;
    video.volume = 1;
    setSoundBlocked(false);
    void video.play();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="DA Tuition cinematic intro"
          className={styles.overlay}
          onKeyDown={containKeyboardFocus}
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeOutMs / 1000, ease: fadeEase }}
        >
          <motion.video
            ref={videoRef}
            className={styles.video}
            src="/intro.mp4"
            autoPlay
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            onEnded={handleVideoEnded}
            onPlay={() => setVideoEnded(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={{ duration: exiting ? fadeOutMs / 1000 : 1.15, ease: fadeEase }}
          />

          <AnimatePresence>
            {videoEnded && (
              <motion.div
                className={styles.beginLayer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: fadeEase }}
              >
                <button
                  ref={beginButtonRef}
                  type="button"
                  aria-label="Begin the Journey"
                  className={styles.beginHitArea}
                  onClick={beginJourney}
                  disabled={exiting}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!videoEnded && !exiting && (
            <button ref={skipButtonRef} type="button" className={styles.skipButton} onClick={skipIntro}>
              Skip Intro
            </button>
          )}

          {soundBlocked && !videoEnded && !exiting && (
            <button type="button" className={styles.soundButton} onClick={enableSound}>
              Enable Sound
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroVideo;
