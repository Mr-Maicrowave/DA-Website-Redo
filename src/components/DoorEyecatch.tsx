import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const STORAGE_KEY = 'da_eyecatch_seen';
const FADE_MS = 1200;

const MASK = 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)';

const DoorEyecatch = () => {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) { setVisible(false); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setVisible(false);
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const t = setTimeout(() => setOpacity(1), 50);

    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    if (v.duration - v.currentTime <= FADE_MS / 1000) {
      setOpacity(0);
    }
  };

  const handleEnded = () => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    sessionStorage.setItem(STORAGE_KEY, '1');
    setTimeout(() => setVisible(false), FADE_MS);
  };

  if (!visible) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2147483647,
      opacity,
      transition: `opacity ${FADE_MS}ms ease`,
    }}>
      <div style={{
        position: 'absolute',
        inset: '-20px',
        backgroundImage: 'url(/images/eyecatch/door-closed.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(18px)',
        transform: 'scale(1.05)',
      }} />

      <video
        ref={videoRef}
        src="/images/eyecatch/Use_the_first_image_the_close.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center top',
          maskImage: MASK,
          WebkitMaskImage: MASK,
        }}
      />
    </div>,
    document.body
  );
};

export default DoorEyecatch;
