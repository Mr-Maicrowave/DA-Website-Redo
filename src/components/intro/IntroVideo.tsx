import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useIntro } from '@/lib/useIntro';
import styles from './IntroVideo.module.css';

const fadeEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
const fadeOutMs = 800;

const IntroVideo = () => {
  const { isReady, markAsSeen, prefersReducedMotion, shouldPlay } = useIntro();
  const videoRef = useRef<HTMLVideoElement>(null);
  const completeTimerRef = useRef<number>();
  const exitingRef = useRef(false);
  const scrollLockRef = useRef<{
    htmlOverflow: string;
    bodyOverflow: string;
    bodyPosition: string;
    bodyTop: string;
    bodyWidth: string;
    scrollY: number;
  }>();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    setVisible(isReady && shouldPlay);
  }, [isReady, shouldPlay]);

  useEffect(() => {
    if (!visible) return;

    const scrollY = window.scrollY;
    scrollLockRef.current = {
      htmlOverflow: document.documentElement.style.overflow,
      bodyOverflow: document.body.style.overflow,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyWidth: document.body.style.width,
      scrollY,
    };

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.dataset.daIntroActive = 'true';

    return () => {
      const previous = scrollLockRef.current;

      if (previous) {
        document.documentElement.style.overflow = previous.htmlOverflow;
        document.body.style.overflow = previous.bodyOverflow;
        document.body.style.position = previous.bodyPosition;
        document.body.style.top = previous.bodyTop;
        document.body.style.width = previous.bodyWidth;
        window.scrollTo(0, previous.scrollY);
      }

      delete document.body.dataset.daIntroActive;
      window.clearTimeout(completeTimerRef.current);
    };
  }, [visible]);

  const completeIntro = useCallback(() => {
    markAsSeen();
    setVisible(false);
    setExiting(false);
    setVideoEnded(false);
    setSoundEnabled(false);
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

  const showFinalFrame = useCallback(() => {
    const video = videoRef.current;

    if (video && Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = Math.max(video.duration - 0.05, 0);
      video.pause();
    }

    setVideoEnded(true);
  }, []);

  useEffect(() => {
    if (!visible || !videoRef.current) return;
    const video = videoRef.current;

    setVideoEnded(false);
    setSoundEnabled(false);
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 1;
    video.currentTime = 0;

    if (prefersReducedMotion) {
      showFinalFrame();
      return;
    }

    const playPromise = video.play();

    if (playPromise) {
      playPromise.catch(() => undefined);
    }
  }, [prefersReducedMotion, showFinalFrame, visible]);

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  const handleVideoLoadedMetadata = () => {
    if (prefersReducedMotion) {
      showFinalFrame();
    }
  };

  const skipIntro = () => {
    showFinalFrame();
  };

  const beginJourney = () => {
    videoRef.current?.pause();
    finishIntro();
  };

  const enableSound = () => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
    setSoundEnabled(true);

    const playPromise = video.play();

    if (playPromise) {
      playPromise.catch(() => undefined);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-label="DA Tuition cinematic intro"
          className={styles.overlay}
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeOutMs / 1000, ease: fadeEase }}
        >
          <motion.video
            ref={videoRef}
            className={styles.video}
            src="/intro.mp4"
            muted
            autoPlay
            playsInline
            preload="auto"
            controls={false}
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            onEnded={handleVideoEnded}
            onLoadedMetadata={handleVideoLoadedMetadata}
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
            <button type="button" className={styles.skipButton} onClick={skipIntro}>
              Skip Intro
            </button>
          )}

          {!videoEnded && !exiting && !soundEnabled && (
            <button
              type="button"
              aria-label="Enable intro sound"
              className={styles.soundButton}
              onClick={enableSound}
            >
              Enable Sound
            </button>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroVideo;
