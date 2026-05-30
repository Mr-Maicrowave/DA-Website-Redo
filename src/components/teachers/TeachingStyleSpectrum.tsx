import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SpectrumSlider } from './SpectrumSlider';
import { Sliders, RotateCcw, ChevronUp } from 'lucide-react';
import type { TeachingStyles } from '@/data/teachers';

interface TeachingStyleSpectrumProps {
  onFilterChange: (preferences: TeachingStyles) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TeachingStyleSpectrum: React.FC<TeachingStyleSpectrumProps> = ({
  onFilterChange,
  isCollapsed = false,
  onToggleCollapse
}) => {
  // Default neutral preferences (middle of each scale)
  const [preferences, setPreferences] = useState<TeachingStyles>({
    structured: 5,
    patient: 5,
    traditional: 5,
    supportive: 5
  });

  const handleSliderChange = (dimension: keyof TeachingStyles, value: number) => {
    const newPreferences = { ...preferences, [dimension]: value };
    setPreferences(newPreferences);
    onFilterChange(newPreferences);
  };

  const handleReset = () => {
    const neutralPreferences = {
      structured: 5,
      patient: 5,
      traditional: 5,
      supportive: 5
    };
    setPreferences(neutralPreferences);
    onFilterChange(neutralPreferences);
  };

  const hasNonNeutralPreferences = Object.values(preferences).some(val => val !== 5);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 bg-gradient-to-r from-brand-blue-light to-brand-blue-dark text-white cursor-pointer"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center">
          <Sliders className="w-6 h-6 mr-3" />
          <div>
            <h3 className="text-lg font-semibold">Find Your Perfect Teaching Match</h3>
            <p className="text-sm opacity-90">Adjust the sliders to match your preferences</p>
          </div>
        </div>
        {onToggleCollapse && (
          <ChevronUp 
            className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          />
        )}
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="p-6 space-y-6">
          {/* Spectrum Sliders */}
          <div className="grid gap-6 md:grid-cols-2">
            <SpectrumSlider
              label="Structure vs Creativity"
              leftLabel="Structured"
              rightLabel="Creative"
              value={preferences.structured}
              onChange={(value) => handleSliderChange('structured', value)}
            />
            
            <SpectrumSlider
              label="Pace and Patience"
              leftLabel="Patient"
              rightLabel="Energetic"
              value={preferences.patient}
              onChange={(value) => handleSliderChange('patient', value)}
            />
            
            <SpectrumSlider
              label="Teaching Approach"
              leftLabel="Traditional"
              rightLabel="Innovative"
              value={preferences.traditional}
              onChange={(value) => handleSliderChange('traditional', value)}
            />
            
            <SpectrumSlider
              label="Support Style"
              leftLabel="Supportive"
              rightLabel="Challenging"
              value={preferences.supportive}
              onChange={(value) => handleSliderChange('supportive', value)}
            />
          </div>

          {/* Reset Button */}
          {hasNonNeutralPreferences && (
            <div className="flex justify-center pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-brand-midnight/80 hover:text-brand-midnight"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Show All Teachers
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};