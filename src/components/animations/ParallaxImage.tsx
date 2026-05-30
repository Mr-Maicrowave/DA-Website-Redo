import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxImageProps {
    src: string;
    alt: string;
    className?: string;
    offset?: number;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
    src,
    alt,
    className = "",
    offset = 50
}) => {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Moves the image on the Y axis from -offset to +offset as it scrolls through the viewport
    const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

    return (
        <div ref={ref} className={`overflow-hidden relative ${className}`}>
            <motion.img
                src={src}
                alt={alt}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ y, scale: 1.15 }} // Scale up slightly to prevent edges showing during parallax
            />
        </div>
    );
};

export default ParallaxImage;
