import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] }
    }
};

interface StaggerProps {
    children: ReactNode;
    className?: string;
}

export const StaggerContainer = ({ children, className = "" }: StaggerProps) => (
    <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className={className}
    >
        {children}
    </motion.div>
);

export const StaggerItem = ({ children, className = "" }: StaggerProps) => (
    <motion.div variants={itemVariants} className={className}>
        {children}
    </motion.div>
);
