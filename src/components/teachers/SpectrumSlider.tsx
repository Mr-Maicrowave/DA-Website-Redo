import React, { useState } from 'react';

interface SpectrumSliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number; // 1-10 scale
  onChange: (value: number) => void;
  className?: string;
}

export const SpectrumSlider: React.FC<SpectrumSliderProps> = ({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
  className = ''
}) => {
  const [isHovering, setIsHovering] = useState(false);

  // Convert 1-10 scale to 0-100 for slider
  const sliderValue = (value - 1) * (100 / 9);
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sliderVal = parseInt(e.target.value);
    // Convert 0-100 back to 1-10 scale
    const teachingStyleValue = Math.round(1 + (sliderVal * 9) / 100);
    onChange(teachingStyleValue);
  };

  const getSliderBackground = () => {
    const percentage = sliderValue;
    return {
      background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
    };
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Labels */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-brand-midnight/80 font-medium">{leftLabel}</span>
        <span className="text-xs text-brand-midnight/70 hidden md:inline">{label}</span>
        <span className="text-brand-midnight/80 font-medium">{rightLabel}</span>
      </div>

      {/* Slider */}
      <div 
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
          style={getSliderBackground()}
        />
        
        {/* Value tooltip on hover */}
        {isHovering && (
          <div 
            className="absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none"
            style={{ 
              left: `calc(${sliderValue}% - 12px)`,
            }}
          >
            {value}/10
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #1F2937;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
        }

        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #1F2937;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
        }

        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
        }

        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
};