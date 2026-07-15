import React from 'react';
/**
 * Ivory paper section wrapper — warm background + fine grain + optional page-edge shadow.
 */
const PaperSection = ({ children, pageEdge = false, className = '', style = {}, id }: {
  children: React.ReactNode;
  pageEdge?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}) => (
  <section id={id} className={`da-paper ${pageEdge ? 'da-page-edge' : ''} ${className}`} style={style}>
    <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
  </section>
);

export default PaperSection;
