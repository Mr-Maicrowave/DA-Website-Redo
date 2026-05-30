import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    strength?: number; // How far it pulls (pixels)
    onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = "",
    strength = 15,
    onClick
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Use springs for smooth return to center
    const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.5 });
    const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.5 });

    useEffect(() => {
        if (!ref.current) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isHovered || !ref.current) return;

            const { clientX, clientY } = e;
            const { height, width, left, top } = ref.current.getBoundingClientRect();

            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const distanceX = clientX - centerX;
            const distanceY = clientY - centerY;

            // Max pull is 'strength'
            const pullX = (distanceX / (width / 2)) * strength;
            const pullY = (distanceY / (height / 2)) * strength;

            x.set(pullX);
            y.set(pullY);
        };

        const handleMouseLeave = () => {
            setIsHovered(false);
            x.set(0);
            y.set(0);
        };

        const handleMouseEnter = () => setIsHovered(true);

        const element = ref.current;

        // Add event listeners tracking the whole window while hovered for smoother pull
        window.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);
        element.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            element.removeEventListener("mouseleave", handleMouseLeave);
            element.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [isHovered, strength, x, y]);

    return (
        <motion.div
            ref={ref}
            className={`inline-block ${className}`}
            style={{ x, y }}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

export default MagneticButton;
