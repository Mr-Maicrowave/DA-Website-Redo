import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties } from 'react';
import type { AquariumFish } from './primaryStoryData';

const AquariumFactCard = ({ fish, onDismiss, style }: { fish?: AquariumFish; onDismiss: () => void; style?: CSSProperties }) => {
  const reducedMotion = useReducedMotion();
  return (
    <AnimatePresence mode="wait">
      {fish ? (
        <motion.aside
          key={fish.id}
          className="primary-aquarium__fact"
          role="status"
          style={style}
          initial={reducedMotion ? false : { opacity: 0, y: 14, rotate: -1 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotate: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: reducedMotion ? 0 : .24 }}
        >
          <span className="primary-aquarium__fact-fish" aria-hidden="true">
            <img src={fish.src} alt="" />
          </span>
          <span aria-hidden="true">☆</span>
          <button type="button" onClick={onDismiss} aria-label="Close fish fact">×</button>
          <strong>{fish.label}</strong>
          <p>{fish.fact}</p>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
};

export default AquariumFactCard;
