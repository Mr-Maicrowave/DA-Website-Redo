import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    wordMode?: boolean; // If true, animates by word. If false, animates by character.
}

export const TextReveal: React.FC<TextRevealProps> = ({
    text,
    className = "",
    delay = 0,
    wordMode = true
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const items = wordMode ? text.split(" ") : text.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: wordMode ? 0.08 : 0.03, delayChildren: delay * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            className={`flex flex-wrap ${className}`}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {items.map((item, index) => (
                <motion.span
                    variants={child}
                    key={index}
                    className="inline-block"
                    style={{ marginRight: wordMode && item !== "" ? "0.25em" : "0px" }}
                >
                    {item === " " && !wordMode ? "\u00A0" : item}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default TextReveal;
