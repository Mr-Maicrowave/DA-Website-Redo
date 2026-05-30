import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // Hide until mouse moves
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Smooth springs for cursor followers
    const cursorX = useSpring(-100, { stiffness: 500, damping: 28, mass: 0.5 });
    const cursorY = useSpring(-100, { stiffness: 500, damping: 28, mass: 0.5 });

    const ringX = useSpring(-100, { stiffness: 150, damping: 20, mass: 0.8 });
    const ringY = useSpring(-100, { stiffness: 150, damping: 20, mass: 0.8 });

    useEffect(() => {
        // Check if it's a touch device - don't show cursor if it is
        if (window.matchMedia("(pointer: coarse)").matches) {
            setIsTouchDevice(true);
            return;
        }

        const manageMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            ringX.set(e.clientX);
            ringY.set(e.clientY);

            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Triggers scale-up on links, buttons, or elements meant to be interactive
            if (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('cursor-scale')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseLeave = () => {
            setIsVisible(false); // Hide when leaving the window
        };

        window.addEventListener("mousemove", manageMouseMove);
        window.addEventListener("mouseover", handleMouseOver);
        document.documentElement.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", manageMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
            document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [cursorX, cursorY, ringX, ringY, isVisible]);

    if (isTouchDevice || !isVisible) return null;

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-brand-teal rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isHovering ? 0 : 1, // Hide the inner dot when hovering to let the ring take focus
                    opacity: 1
                }}
                transition={{ duration: 0.15 }}
            />

            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-brand-teal rounded-full pointer-events-none z-[9998] mix-blend-difference"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? "rgba(94, 204, 197, 0.2)" : "transparent",
                    borderColor: isHovering ? "transparent" : "rgba(94, 204, 197, 1)",
                }}
                transition={{ duration: 0.15 }}
            />
        </>
    );
};

export default CustomCursor;
