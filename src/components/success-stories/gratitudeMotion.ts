const power2In = [0.55, 0.085, 0.68, 0.53] as const;
const easeOut = [0.22, 1, 0.36, 1] as const;

export const getEnvelopeShellMotion = (isOpen: boolean, reduceMotion: boolean | null) => {
  if (isOpen) {
    return {
      animate: {
        opacity: 0,
        scale: 0.92,
        y: 40,
        visibility: 'visible' as const,
        pointerEvents: 'auto' as const,
        transitionEnd: { visibility: 'hidden' as const, pointerEvents: 'none' as const },
      },
      transition: {
        duration: reduceMotion ? 0.01 : 0.3,
        delay: reduceMotion ? 0 : 0.86,
        ease: power2In,
      },
    };
  }

  return {
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      visibility: 'visible' as const,
      pointerEvents: 'auto' as const,
    },
    transition: {
      duration: reduceMotion ? 0.01 : 0.3,
      delay: 0,
      ease: easeOut,
    },
  };
};
