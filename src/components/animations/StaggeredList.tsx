import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StaggeredListProps {
    children: React.ReactNode[];
    className?: string;
    delay?: number;
    staggerDuration?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
    children,
    className = "",
    delay = 0,
    staggerDuration = 0.1
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDuration,
                delayChildren: delay,
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <motion.ul
            ref={ref}
            className={className}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {React.Children.map(children, (child, i) => (
                <motion.li key={i} variants={item}>
                    {child}
                </motion.li>
            ))}
        </motion.ul>
    );
};

export default StaggeredList;
