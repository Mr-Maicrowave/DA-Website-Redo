import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { contactInfo, ctaDefaults } from '@/data/business-info';

interface CTASectionProps {
  heading?: string;
  subheading?: string;
  showPhone?: boolean;
  showHours?: boolean;
  className?: string;
  primaryText?: string;
  primaryLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
}

const CTASection = ({
  heading = "Ready to Experience the DA Tuition Difference?",
  subheading = "Join thousands of successful students who've transformed their academic journey",
  showPhone = true,
  showHours = true,
  className = "bg-gradient-to-r from-brand-highlight to-brand-midnight",
  primaryText = ctaDefaults.primaryText,
  primaryLink = ctaDefaults.primaryLink,
  secondaryText,
  secondaryLink,
}: CTASectionProps) => {
  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-3xl font-bold mb-6">{heading}</h2>
        <p className="text-xl mb-8 opacity-90">{subheading}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={primaryLink}>
            <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100">
              {primaryText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          {secondaryText && secondaryLink && (
            <Link to={secondaryLink}>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                {secondaryText}
              </Button>
            </Link>
          )}
        </div>

        {(showPhone || showHours) && (
          <div className="mt-8 text-lg">
            {showPhone && (
              <p className="mb-2">
                Call us today:{" "}
                <a href={ctaDefaults.secondaryPhone} className="font-bold hover:underline">
                  {contactInfo.phone}
                </a>
              </p>
            )}
            {showHours && (
              <p className="opacity-90">
                Canley Heights &bull; {contactInfo.hours.weekday} &bull; {contactInfo.hours.saturday} &bull; {contactInfo.hours.sunday}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CTASection;
