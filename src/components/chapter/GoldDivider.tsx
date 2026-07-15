import React from 'react';
import { colors } from '@/lib/theme';

/**
 * Fine gold rule with optional centred diamond motif.
 */
const GoldDivider = ({ motif = true, width = '100%', style = {} }: {
  motif?: boolean;
  width?: string | number;
  style?: React.CSSProperties;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, width, margin: '0 auto', ...style }} aria-hidden="true">
    <div className="da-gold-rule" style={{ flex: 1 }} />
    {motif && (
      <span style={{ color: colors.goldSoft, fontSize: '.8rem', lineHeight: 1 }}>◆</span>
    )}
    {motif && <div className="da-gold-rule" style={{ flex: 1 }} />}
  </div>
);

export default GoldDivider;
