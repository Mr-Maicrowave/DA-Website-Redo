
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to given distance
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top cordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-[5.5rem] right-6 z-[100] animate-fade-in">
            <Button
                onClick={scrollToTop}
                size="icon"
                className="h-14 w-14 rounded-full bg-brand-blue-dark text-white shadow-lg hover:bg-brand-blue-light hover:-translate-y-1 transition-all duration-300"
                aria-label="Scroll to top"
            >
                <ArrowUp className="h-6 w-6" />
            </Button>
        </div>
    );
};

export default ScrollToTop;
