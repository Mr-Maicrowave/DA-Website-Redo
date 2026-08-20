import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const MathsIntroVideoGate = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  const dismiss = () => {
    if (isClosing) return;

    setIsClosing(true);
    setTimeout(() => setIsOpen(false), 500);
  };

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    skipButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#071629] transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="maths-intro-video-title"
      onKeyDown={(event) => {
        if (event.key === 'Tab') event.preventDefault();
      }}
    >
      <h2 id="maths-intro-video-title" className="sr-only">Mathematics introduction</h2>
      <video
        className="h-full w-full object-cover"
        src="/math_intro_video.mp4"
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        onError={dismiss}
      />
      <button
        ref={skipButtonRef}
        type="button"
        onClick={dismiss}
        className="absolute right-6 top-6 rounded-full border border-white/35 bg-[#071629]/85 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur transition hover:bg-white hover:text-[#071629] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1df9a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071629]"
      >
        Skip intro
      </button>
    </div>
    ,
    document.body,
  );
};
