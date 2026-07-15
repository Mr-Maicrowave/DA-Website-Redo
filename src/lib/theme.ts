/**
 * theme.ts — DA Tuition shared design tokens
 * Single source of truth for the "academy journal" design system.
 * Matches the tailwind `brand-*` palette; use whichever fits the component style
 * (inline styles → import from here, className styles → use tailwind brand tokens).
 */

export const colors = {
  navy:   '#0A1B34',
  navy2:  '#0F2244',
  gold:   '#D4AF37',
  goldL:  '#F0C86A',
  ivory:  '#F7F4EE',
  ivory2: '#EDE5D4',
  white:  '#FAFAF8',
  pureWhite: '#FFFFFF',
  muted:  'rgba(10,27,52,0.52)',
  goldSoft: 'rgba(212,175,55,0.3)',
} as const;

export const fonts = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'DM Sans', 'Inter', sans-serif",
} as const;

/** Standard framer-motion variants used across chapter layouts */
export const fadeUp = {
  hidden:  { opacity: 0, y: 52 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' as const } },
};

export const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.08 } },
};

/** Heading scale helpers */
export const headingXL = 'clamp(2.6rem, 5.5vw, 4.6rem)';
export const headingL  = 'clamp(2.2rem, 4.5vw, 3.8rem)';
export const headingM  = 'clamp(1.6rem, 3vw, 2.4rem)';
