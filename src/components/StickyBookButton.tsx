import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, X, Phone, ArrowRight } from 'lucide-react';

const StickyBookButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 hidden md:flex bg-brand-highlight hover:bg-blue-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all animate-bounce-slow"
      >
        <Calendar className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up hidden md:block">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm border-2 border-brand-blue/20">
        {/* Close button */}
        <button
          onClick={() => setIsMinimized(true)}
          className="absolute top-2 right-2 text-gray-400 hover:text-brand-midnight/80"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-brand-midnight/80">Waitlist Active</span>
          </div>

          <div>
            <h3 className="font-bold text-lg text-brand-midnight mb-1">
              Book Interview
            </h3>
            <p className="text-sm text-brand-midnight/80">
              Due to high demand, spots are limited. Secure an interview to join our waiting list.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white group"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Interview
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <a
              href="tel:0401940207"
              className="flex items-center justify-center gap-2 w-full py-2 text-sm text-brand-blue hover:text-brand-blue-dark transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-semibold">0401 940 207</span>
            </a>
          </div>

          <div className="text-xs text-center text-brand-midnight/70 font-semibold bg-blue-50 py-2 rounded-lg mt-2 border border-blue-100">
            Accepting for Term 1 2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyBookButton;