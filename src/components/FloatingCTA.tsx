
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import MagneticButton from '@/components/animations/MagneticButton';
import MeshGradient from '@/components/animations/MeshGradient';

const FloatingCTA = () => {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 100px
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Don't show on pages that might have their own primary actions or where it's distracting
    // For now, showing globally except maybe if we decide to exclude specific routes later

    // Only render on mobile (handled via CSS classes md:hidden)
    return (
        <div
            className={`fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white/95 backdrop-blur-md z-50 transition-transform duration-300 md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)] overflow-hidden ${isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
        >
            <MeshGradient className="absolute inset-0 opacity-50 z-[-1]" />
            <div className="p-4 relative z-10">
                <a href="#contact" onClick={(e) => {
                    // If we are on home page, scroll to contact
                    if (location.pathname === '/') {
                        e.preventDefault();
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        // Otherwise navigate to home#contact is handled by regular link behavior + hash
                        // But standard anchor tags with hash might not work perfectly with reacting routing if we don't handle it.
                        // For safety, let's just make it a direct link to booking or #contact
                    }
                }}>
                    <MagneticButton strength={10} className="w-full">
                        <Button className="w-full btn-primary h-12 text-base shadow-lg animate-pulse-gentle">
                            <Calendar className="mr-2 h-5 w-5" />
                            Book Interview
                        </Button>
                    </MagneticButton>
                </a>
            </div>
        </div>
    );
};

export default FloatingCTA;
