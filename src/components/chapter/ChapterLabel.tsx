import React from 'react';
import { colors, fonts } from '@/lib/theme';

/**
 * Small gold uppercase tag used above headings — e.g. "Chapter 03 · Programs".
 */
const ChapterLabel = ({ children, light = false, style = {} }: {
  children: React.ReactNode;
  light?: boolean;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      fontFamily: fonts.sans,
      fontSize: '.7rem',
      fontWeight: 700,
      letterSpacing: '.17em',
      textTransform: 'uppercase',
      color: light ? colors.goldL : colors.gold,
      ...style,
    }}
  >
    {children}
  </div>
);

export default ChapterLabel;
