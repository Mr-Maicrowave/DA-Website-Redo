import React from 'react';

interface SectionConfig {
  id: string;
  color: string;
  opacity?: number;
}

interface SmoothTransitionsProps {
  sections: SectionConfig[];
  children: React.ReactNode;
}

const SmoothTransitions: React.FC<SmoothTransitionsProps> = ({ sections, children }) => {
  // Generate smooth gradient stops with easing
  const generateGradientStops = () => {
    const stops: string[] = [];
    const totalSections = sections.length;
    
    sections.forEach((section, index) => {
      const position = (index / (totalSections - 1)) * 100;
      const opacity = section.opacity || 0.15;
      
      // Add main color stop
      stops.push(`${section.color} ${position}%`);
      
      // Add intermediate blending stops for smoother transitions
      if (index < totalSections - 1) {
        const nextSection = sections[index + 1];
        const nextOpacity = nextSection.opacity || 0.15;
        const blendPosition = position + (100 / (totalSections - 1)) * 0.5;
        
        // Create a blend color (simplified mixing)
        const blendOpacity = (opacity + nextOpacity) / 2;
        stops.push(`${section.color}${Math.round(blendOpacity * 255).toString(16).padStart(2, '0')} ${blendPosition}%`);
        stops.push(`${nextSection.color}${Math.round(blendOpacity * 255).toString(16).padStart(2, '0')} ${blendPosition}%`);
      }
    });
    
    return stops.join(', ');
  };

  // Generate CSS custom properties for each section
  const generateCSSVariables = () => {
    const vars: { [key: string]: string } = {};
    sections.forEach((section) => {
      vars[`--section-${section.id}-color`] = section.color;
      vars[`--section-${section.id}-opacity`] = String(section.opacity || 0.15);
    });
    return vars;
  };

  const gradientStops = generateGradientStops();
  const cssVariables = generateCSSVariables();

  return (
    <div 
      className="smooth-transitions-container"
      style={{
        ...cssVariables,
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      {/* Primary gradient background */}
      <div 
        className="gradient-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg, ${gradientStops})`,
          zIndex: -3,
        }}
      />
      
      {/* Smooth blending overlay */}
      <div 
        className="blend-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse at top, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(255,255,255,0.05) 0%, transparent 50%)
          `,
          mixBlendMode: 'soft-light',
          zIndex: -2,
        }}
      />
      
      {/* Noise texture for organic feel */}
      <div 
        className="texture-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.1) 2px,
              rgba(255,255,255,0.1) 4px
            )
          `,
          zIndex: -1,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Helper component for individual section transitions
export const SectionTransition: React.FC<{
  from: string;
  to: string;
  height?: number;
  curve?: 'linear' | 'ease' | 'smooth';
}> = ({ from, to, height = 80, curve = 'smooth' }) => {
  const getCurveFunction = () => {
    switch (curve) {
      case 'linear':
        return '0%, 100%';
      case 'ease':
        return '0%, 25%, 75%, 100%';
      case 'smooth':
      default:
        return '0%, 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100%';
    }
  };

  const stops = getCurveFunction().split(', ').map((stop, index, array) => {
    const position = parseFloat(stop);
    const t = position / 100;
    
    // Smooth easing function (ease-in-out cubic)
    const eased = t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    // Interpolate between colors
    const fromOpacity = 1 - eased;
    const toOpacity = eased;
    
    return {
      position,
      fromOpacity,
      toOpacity,
    };
  });

  return (
    <div 
      className="section-transition"
      style={{
        height: `${height}px`,
        position: 'relative',
        marginTop: `-${height / 2}px`,
        marginBottom: `-${height / 2}px`,
        background: `linear-gradient(180deg, ${
          stops.map(s => 
            `${from}${Math.round(s.fromOpacity * 255).toString(16).padStart(2, '0')} ${s.position}%`
          ).join(', ')
        })`,
        zIndex: 1,
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg, ${
            stops.map(s => 
              `${to}${Math.round(s.toOpacity * 255).toString(16).padStart(2, '0')} ${s.position}%`
            ).join(', ')
          })`,
        }}
      />
    </div>
  );
};

export default SmoothTransitions;