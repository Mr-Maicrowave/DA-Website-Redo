import React from 'react';
import { motion } from 'framer-motion';

interface MeshGradientProps {
    className?: string;
    colors?: string[]; // Array of hex/rgba colors
}

export const MeshGradient: React.FC<MeshGradientProps> = ({
    className = "",
    colors = [
        "rgba(107, 154, 196, 0.4)", // Brand Blue
        "rgba(94, 204, 197, 0.4)",  // Brand Teal
        "rgba(255, 183, 178, 0.4)", // Brand Peach
    ]
}) => {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Base layer */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl z-10" />

            {/* Animated blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
                style={{ backgroundColor: colors[0] }}
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -40, 0],
                    y: [0, 50, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
                style={{ backgroundColor: colors[1] }}
            />

            {colors[2] && (
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [-20, 30, -20],
                        y: [-20, 40, -20],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                    className="absolute top-1/4 right-1/4 w-1/2 h-1/2 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
                    style={{ backgroundColor: colors[2] }}
                />
            )}
        </div>
    );
};

export default MeshGradient;
