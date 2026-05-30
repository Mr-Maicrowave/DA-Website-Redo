import React, { useEffect } from 'react';

interface NaturalWatercolorBackgroundProps {
  children: React.ReactNode;
}

const NaturalWatercolorBackground: React.FC<NaturalWatercolorBackgroundProps> = ({ children }) => {
  useEffect(() => {
    // Apply the watercolor background to the body
    document.body.style.background = `
      linear-gradient(
        180deg,
        rgba(107, 154, 196, 0.15) 0%,     /* Pure blue start */
        rgba(101, 174, 190, 0.12) 15%,    /* Blue-teal blend */
        rgba(94, 194, 185, 0.14) 25%,     /* Intermediate blue-teal */
        rgba(94, 204, 197, 0.16) 35%,     /* Pure teal */
        rgba(114, 209, 156, 0.14) 45%,    /* Teal-green blend */
        rgba(134, 212, 125, 0.15) 55%,    /* Intermediate teal-green */
        rgba(164, 214, 94, 0.17) 65%,     /* Pure green */
        rgba(199, 215, 70, 0.14) 75%,     /* Green-yellow blend */
        rgba(232, 208, 57, 0.12) 85%,     /* Intermediate green-yellow */
        rgba(255, 201, 20, 0.15) 90%,     /* Pure yellow */
        rgba(249, 138, 31, 0.13) 95%,     /* Yellow-red blend */
        rgba(233, 75, 60, 0.12) 100%      /* Pure red end */
      )
    `;
    document.body.style.backgroundSize = '100% 500vh'; // Much larger than viewport
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';
    
    return () => {
      // Cleanup when component unmounts
      document.body.style.background = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.backgroundRepeat = '';
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Watercolor texture overlay */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 10%, rgba(0,0,0,0.03) 0%, transparent 30%),
            radial-gradient(circle at 40% 70%, rgba(255,255,255,0.08) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, rgba(0,0,0,0.02) 0%, transparent 35%),
            radial-gradient(circle at 10% 90%, rgba(255,255,255,0.06) 0%, transparent 45%)
          `,
          filter: 'blur(0.5px)',
          opacity: 0.7
        }}
      />
      
      {/* Subtle grain/noise overlay */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 1px,
              rgba(255,255,255,0.01) 1px,
              rgba(255,255,255,0.01) 2px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 1px,
              rgba(0,0,0,0.005) 1px,
              rgba(0,0,0,0.005) 2px
            )
          `,
          opacity: 0.3
        }}
      />
      
      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default NaturalWatercolorBackground;