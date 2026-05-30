import React from 'react';

interface WatercolorTransitionProps {
  topColor: string;
  bottomColor: string;
  height?: number;
  className?: string;
}

const WatercolorTransition: React.FC<WatercolorTransitionProps> = ({
  topColor,
  bottomColor,
  height = 200,
  className = ''
}) => {
  return (
    <div 
      className={`relative w-full ${className}`}
      style={{ height: `${height}px`, marginTop: '-50px', marginBottom: '-50px' }}
    >
      {/* Main gradient transition */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(to bottom, ${topColor} 0%, ${bottomColor} 100%)`
        }}
      />
      
      {/* Organic watercolor blending layers */}
      <div 
        className="absolute inset-0 w-full h-full opacity-70"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 30% 20%, ${topColor} 0%, transparent 50%),
                       radial-gradient(ellipse 80% 100% at 70% 80%, ${bottomColor} 0%, transparent 50%)`
        }}
      />
      
      {/* Additional organic shapes for more natural blending */}
      <div 
        className="absolute inset-0 w-full h-full opacity-50"
        style={{
          background: `radial-gradient(ellipse 150% 60% at 80% 40%, ${topColor} 0%, transparent 40%),
                       radial-gradient(ellipse 100% 120% at 20% 60%, ${bottomColor} 0%, transparent 40%)`
        }}
      />
      
      {/* Irregular SVG wave */}
      <svg 
        className="absolute bottom-0 w-full h-20" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        style={{ transform: 'rotate(180deg)' }}
      >
        <path 
          d="M0,64L40,58.7C80,53,160,43,240,48C320,53,400,75,480,80C560,85,640,75,720,64C800,53,880,43,960,48C1040,53,1120,75,1200,80L1200,120L0,120Z" 
          fill={bottomColor}
          opacity="0.6"
        />
        <path 
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,117.3C672,107,768,117,864,128C960,139,1056,149,1152,133.3C1248,117,1344,75,1392,53.3L1440,32L1440,120L0,120Z" 
          fill={bottomColor}
          opacity="0.4"
        />
      </svg>
      
      {/* Subtle floating animation */}
      <div 
        className="absolute inset-0 w-full h-full opacity-30"
        style={{
          background: `radial-gradient(circle at 40% 30%, ${topColor} 0%, transparent 30%),
                       radial-gradient(circle at 60% 70%, ${bottomColor} 0%, transparent 30%)`,
          animation: 'subtle-float 12s ease-in-out infinite'
        }}
      />
      
      <style>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default WatercolorTransition;