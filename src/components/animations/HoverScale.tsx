import React from 'react';
import { motion } from 'framer-motion';

interface HoverScaleProps {
    children: React.ReactNode;
    className?: string;
    scale?: number;
}

export const HoverScale: React.FC<HoverScaleProps> = ({
    children,
    className = "",
    scale = 1.02
}) => {
    return (
        <motion.div
            whileHover={{ scale, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default HoverScale;
