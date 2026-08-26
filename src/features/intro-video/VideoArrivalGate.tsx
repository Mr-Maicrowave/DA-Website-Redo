import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type VideoArrivalGateProps = {
  subject: string;
  videoSrc: string;
  posterSrc: string;
  onShow?: () => void;
};

export const VideoArrivalGate = ({ subject, videoSrc, posterSrc, onShow }: VideoArrivalGateProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  const dismiss = () => {
    if (isClosing) return;

    setIsClosing(true);
    setTimeout(() => setIsOpen(false), 500);
  };

  useEffect(() => {
    if (!isOpen) return;

    onShow?.();

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    skipButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen, onShow]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[10000] isolate overflow-hidden bg-[#071629] transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-video-title"
      onKeyDown={(event) => {
        if (event.key === 'Escape') dismiss();
      }}
    >
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isVideoReady ? 'opacity-0' : 'opacity-100'}`}
      />
      <div className={`absolute inset-0 bg-[#071629]/70 transition-opacity duration-700 ${isVideoReady ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true" />
      <div className={`absolute inset-0 bg-[linear-gradient(120deg,rgba(7,22,41,0.88),rgba(7,22,41,0.3)_52%,rgba(7,22,41,0.76))] transition-opacity duration-700 ${isVideoReady ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true" />

      <video
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        playsInline
        onCanPlay={() => setIsVideoReady(true)}
        onEnded={dismiss}
        onError={() => setHasVideoError(true)}
      />

      <div className={`absolute inset-0 bg-[#071629]/45 transition-opacity duration-700 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />

      <div className={`pointer-events-none absolute inset-x-6 bottom-8 flex flex-col items-center text-center text-white transition-opacity duration-500 sm:bottom-12 ${isVideoReady || hasVideoError ? 'opacity-0' : 'opacity-100'}`}>
        <img src="/images/da-logo.png" alt="" aria-hidden="true" className="mb-5 h-14 w-14 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]" />
        <h2 id="intro-video-title" className="max-w-xl font-display text-3xl leading-tight text-white sm:text-5xl">
          Preparing your {subject} introduction
        </h2>
        <div className="mt-6 h-px w-36 overflow-hidden bg-white/30">
          <span className="block h-full w-1/2 animate-[intro-prelude_1.8s_ease-in-out_infinite] bg-[#f1c94a]" />
        </div>
      </div>

      <div
        className={`absolute inset-x-6 bottom-8 flex flex-col items-center text-center text-white transition-opacity duration-500 sm:bottom-12 ${hasVideoError ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-live="polite"
      >
        <p className="mb-4 text-sm text-white/80">Video preview unavailable</p>
        <button
          type="button"
          onClick={dismiss}
          className="border border-[#d7b552] bg-[#d7b552] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#071629] transition-colors hover:bg-[#ebcf7e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Continue to {subject}
        </button>
      </div>

      <button
        ref={skipButtonRef}
        type="button"
        onClick={dismiss}
        className="absolute right-4 top-4 rounded-full border border-white/45 bg-[#071629]/80 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm transition hover:border-[#f1df9a] hover:bg-white hover:text-[#071629] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1df9a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071629] sm:right-6 sm:top-6"
      >
        Skip introduction
      </button>
    </div>,
    document.body,
  );
};
