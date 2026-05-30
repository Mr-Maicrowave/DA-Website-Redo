import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInUpProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    duration?: number;
}

export const FadeInUp = ({ children, delay = 0, className = "", duration = 0.5 }: FadeInUpProps) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration, ease: "easeOut", delay }}
        className={className}
    >
        {children}
    </motion.div>
);
