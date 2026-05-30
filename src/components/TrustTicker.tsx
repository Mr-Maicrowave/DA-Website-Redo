import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap, Award, Scroll, BookOpen, University } from "lucide-react";

const universities = [
    { name: "University of Sydney", icon: University },
    { name: "UNSW Sydney", icon: BookOpen },
    { name: "University of Melbourne", icon: GraduationCap },
    { name: "Monash University", icon: Scroll },
    { name: "Harvard University", icon: University }, // Aspirational
    { name: "Oxford University", icon: BookOpen },     // Aspirational
    { name: "James Ruse", icon: Award },
    { name: "North Sydney Boys", icon: Award },
];

const TrustTicker = () => {
    return (
        <section className="py-10 bg-white border-b border-gray-100 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
                <p className="text-sm font-semibold text-brand-midnight/70 uppercase tracking-widest">
                    Graduates accepted into world-class institutions
                </p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                {/* Gradient Masks for smooth fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                {/* Rolling Ticker Wrapper */}
                <div className="animate-marquee flex whitespace-nowrap gap-16 items-center">
                    {/* Double the list to create seamless loop */}
                    {[...universities, ...universities, ...universities].map((uni, idx) => (
                        <div
                            key={`${uni.name}-${idx}`}
                            className="flex items-center gap-3 text-gray-400 hover:text-brand-highlight transition-colors duration-300 cursor-default"
                        >
                            <uni.icon className="w-8 h-8 opacity-80" />
                            <span className="text-xl font-bold font-heading">{uni.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustTicker;
