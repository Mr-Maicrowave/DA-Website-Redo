import React from 'react';
import { colors } from '@/lib/theme';

/**
 * Full-width deep-navy band with light text and gold accent context.
 */
const NavySection = ({ children, className = '', style = {}, id }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}) => (
  <section
    id={id}
    className={className}
    style={{
      background: `linear-gradient(180deg, ${colors.navy2} 0%, ${colors.navy} 100%)`,
      color: colors.white,
      position: 'relative',
      ...style,
    }}
  >
    {children}
  </section>
);

export default NavySection;
