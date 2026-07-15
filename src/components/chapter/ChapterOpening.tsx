import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { colors, fonts, fadeUp, stagger, headingXL } from '@/lib/theme';
import ChapterLabel from './ChapterLabel';
import GoldDivider from './GoldDivider';
import EditorialImage from './EditorialImage';

/**
 * ChapterOpening — refined open-book chapter layout used at the top of major pages.
 *
 * Desktop: ivory paper spread with a navy leather edge, gold corner details,
 * chapter number, serif title, short introduction and one strong image.
 * The book frame softens as the visitor scrolls so content expands into
 * the normal site layout.
 *
 * Mobile: collapses into a single-page vertical editorial header — no
 * miniature book shape, full-width imagery, large readable type.
 */
const ChapterOpening = ({
  number,
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  children,
  minHeight = '78vh',
}: {
  number: string;           // e.g. "01"
  eyebrow?: React.ReactNode; // optional small tag next to the chapter label (e.g. "Years 11 & 12")
  title: React.ReactNode;   // serif heading
  intro?: React.ReactNode;  // short introduction paragraph
  image?: string;           // one strong image
  imageAlt?: string;
  children?: React.ReactNode; // optional CTAs under the intro
  minHeight?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Book frame softens away as the reader scrolls
  const frameOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <div ref={ref} className="da-paper da-page-edge" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Navy leather edge + gold corners — the "book frame", fades on scroll */}
      <motion.div style={{ opacity: frameOpacity, position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }} aria-hidden="true">
        <div className="da-leather-edge hidden md:block" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 14 }} />
        <div className="da-gold-corners hidden md:block" style={{ position: 'absolute', inset: 0 }} />
        {/* Mobile: slim navy top band instead of a side edge */}
        <div className="md:hidden da-leather-edge" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8 }} />
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        style={{ position: 'relative', zIndex: 1, minHeight, display: 'flex', alignItems: 'center' }}
      >
        <div
          className="mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-16"
          style={{ paddingTop: 'clamp(120px, 16vh, 180px)', paddingBottom: 'clamp(56px, 9vh, 110px)' }}
        >
          <div className="grid items-center gap-10 md:gap-16 md:grid-cols-[1.05fr_0.95fr]">
            {/* Text side */}
            <div>
              <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 22 }}>
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: fonts.serif,
                    fontStyle: 'italic',
                    fontWeight: 500,
                    fontSize: 'clamp(2.6rem, 5vw, 4rem)',
                    lineHeight: 1,
                    color: colors.goldSoft,
                  }}
                >
                  {number}
                </span>
                <ChapterLabel>Chapter {number}{eyebrow ? <> · {eyebrow}</> : null}</ChapterLabel>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                style={{
                  fontFamily: fonts.serif,
                  fontWeight: 600,
                  fontSize: headingXL,
                  letterSpacing: '-.02em',
                  lineHeight: 1.06,
                  color: colors.navy,
                  marginBottom: 26,
                }}
              >
                {title}
              </motion.h1>

              <motion.div variants={fadeUp}>
                <GoldDivider width={120} style={{ margin: '0 0 26px' }} />
              </motion.div>

              {intro && (
                <motion.p
                  variants={fadeUp}
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: '1.08rem',
                    lineHeight: 1.7,
                    color: colors.muted,
                    maxWidth: 560,
                    marginBottom: children ? 34 : 0,
                  }}
                >
                  {intro}
                </motion.p>
              )}

              {children && <motion.div variants={fadeUp}>{children}</motion.div>}
            </div>

            {/* Image side — one strong photo on an editorial mount */}
            {image && (
              <motion.div variants={fadeUp}>
                <EditorialImage src={image} alt={imageAlt ?? ''} ratio="4 / 3.4" />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChapterOpening;
