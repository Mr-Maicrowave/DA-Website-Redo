import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { AquariumFish } from './primaryStoryData';

const AquariumFactCard = ({ fish }: { fish?: AquariumFish }) => {
  const reducedMotion = useReducedMotion();
  return (
    <AnimatePresence mode="wait">
      {fish ? (
        <motion.aside
          key={fish.id}
          className="primary-aquarium__fact"
          role="status"
          initial={reducedMotion ? false : { opacity: 0, y: 14, rotate: -1 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotate: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: reducedMotion ? 0 : .24 }}
        >
          <span aria-hidden="true">☆</span>
          <strong>{fish.label}</strong>
          <p>{fish.fact}</p>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
};

export default AquariumFactCard;
