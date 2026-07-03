import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useIntro } from '@/lib/useIntro';
import styles from './IntroVideo.module.css';

const fadeEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
const fadeOutMs = 800;

const IntroVideo = () => {
  const { isReady, markAsSeen, shouldPlay } = useIntro();
  const videoRef = useRef<HTMLVideoElement>(null);
  const completeTimerRef = useRef<number>();
  const exitingRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    setVisible(isReady && shouldPlay);
  }, [isReady, shouldPlay]);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.dataset.daIntroActive = 'true';

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
    video.currentTime = 0;
    const playPromise = video.play();

    if (playPromise) {
      playPromise.catch(() => undefined);
    }
  }, [visible]);

  const handleVideoEnded = () => {
    setVideoEnded(true);
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroVideo;
