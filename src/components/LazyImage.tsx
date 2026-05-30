import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  thumbnailSrc?: string;
  onLoad?: () => void;
}

const LazyImage = ({ src, alt, className = '', thumbnailSrc, onLoad }: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(thumbnailSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isInView && src !== imageSrc) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoading(false);
        onLoad?.();
      };
      img.onerror = () => {
        setIsLoading(false);
      };
    }
  }, [isInView, src, imageSrc, onLoad]);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        />
      )}
    </div>
  );
};

export default LazyImage;