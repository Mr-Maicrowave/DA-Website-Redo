import React from 'react';
/**
 * Real DA photos with a warm grade and an ivory editorial mount.
 * Never replaces images — styling only.
 */
const EditorialImage = ({ src, alt, ratio = '4 / 3', mount = true, className = '', style = {} }: {
  src: string;
  alt: string;
  ratio?: string;
  mount?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <figure className={`${mount ? 'da-photo-mount' : ''} ${className}`} style={{ margin: 0, ...style }}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="da-photo-warm"
      style={{ display: 'block', width: '100%', aspectRatio: ratio, objectFit: 'cover' }}
    />
  </figure>
);

export default EditorialImage;
