import React, { useEffect, useRef } from 'react';

interface SmoothColorTransitionProps {
  children: React.ReactNode;
  colorStart: string;
  colorEnd: string;
  className?: string;
  intensity?: number;
}

const SmoothColorTransition: React.FC<SmoothColorTransitionProps> = ({
  children,
  colorStart,
  colorEnd,
  className = '',
  intensity = 0.3
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Calculate how much of the section is visible
          const ratio = entry.intersectionRatio;
          
          // Update CSS custom property for smooth transition
          document.documentElement.style.setProperty(
            '--current-section-color', 
            colorEnd
          );
          
          // Apply smooth transition to body background
          document.body.style.transition = 'background-color 2s ease-in-out';
          document.body.style.backgroundColor = `${colorEnd}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`;
        }
      },
      { 
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [colorEnd, intensity]);

  return (
    <div 
      ref={sectionRef}
      className={`relative ${className}`}
      style={{
        minHeight: '100vh'
      }}
    >
      {/* Multi-layered organic background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse 150% 100% at 20% 10%, ${colorStart} 0%, transparent 60%),
            radial-gradient(ellipse 120% 80% at 80% 90%, ${colorEnd} 0%, transparent 50%),
            linear-gradient(135deg, ${colorStart} 0%, ${colorEnd} 100%)
          `
        }}
      />
      
      {/* Organic texture layer */}
      <div 
        className="absolute inset-0 w-full h-full opacity-60"
        style={{
          background: `
            radial-gradient(circle at 30% 40%, ${colorStart} 0%, transparent 25%),
            radial-gradient(circle at 70% 20%, ${colorEnd} 0%, transparent 30%),
            radial-gradient(circle at 50% 80%, ${colorStart} 0%, transparent 20%),
            radial-gradient(circle at 90% 60%, ${colorEnd} 0%, transparent 35%)
          `
        }}
      />
      
      {/* Animated watercolor spots */}
      <div 
        className="absolute inset-0 w-full h-full opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 25% 30%, ${colorStart} 0%, transparent 40%),
            radial-gradient(ellipse 90% 70% at 75% 70%, ${colorEnd} 0%, transparent 45%)
          `,
          animation: 'watercolor-float 15s ease-in-out infinite'
        }}
      />
      
      {/* Soft blur transition at edges */}
      <div 
        className="absolute top-0 left-0 w-full h-40 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${colorStart}, transparent)`,
          filter: 'blur(30px)',
          opacity: 0.7
        }}
      />
      
      <div 
        className="absolute bottom-0 left-0 w-full h-40 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${colorEnd}, transparent)`,
          filter: 'blur(30px)',
          opacity: 0.7
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      <style>{`
        @keyframes watercolor-float {
          0%, 100% { 
            transform: translateY(0px) scale(1) rotate(0deg); 
            opacity: 0.4;
          }
          33% { 
            transform: translateY(-15px) scale(1.1) rotate(2deg); 
            opacity: 0.6;
          }
          66% { 
            transform: translateY(10px) scale(0.9) rotate(-1deg); 
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default SmoothColorTransition;