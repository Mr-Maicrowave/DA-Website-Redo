import { useRef, useState, type MouseEvent } from 'react';
import AquariumFactCard from './AquariumFactCard';
import { aquariumFish } from './primaryStoryData';
import { markDiscovered } from './aquariumPhysics';
import { useAquariumEngine } from './useAquariumEngine';
import { AquariumExitConnector } from './StoryConnectors';

const PrimaryAquarium = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>();
  const [discovered, setDiscovered] = useState<string[]>([]);
  useAquariumEngine(hostRef);

  const selectFish = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    setSelectedId(id);
    setDiscovered((current) => markDiscovered(current, id));
  };
  const selected = aquariumFish.find((fish) => fish.id === selectedId);

  return (
    <section id="primary-aquarium" className="primary-aquarium" aria-labelledby="primary-aquarium-title">
      <div className="primary-aquarium__surface" aria-hidden="true" />
      <div className="primary-aquarium__copy">
        <p>Curiosity corner</p>
        <h2 id="primary-aquarium-title">Curiosity grows when children explore.</h2>
        <span className="primary-aquarium__instruction primary-aquarium__instruction--desktop">Move your cursor to chase the fish<br />or click to learn a fun fact!</span>
        <span className="primary-aquarium__instruction primary-aquarium__instruction--touch">Tap a fish to discover<br />a fun fact!</span>
      </div>
      <div ref={hostRef} className="primary-aquarium__canvas" aria-hidden="true">
        <img className="primary-aquarium__water" src="/primary-reference/aquarium/water-background.png" alt="" loading="lazy" decoding="async" />
        <img className="primary-aquarium__far" src="/primary-reference/aquarium/distant-reef.png" alt="" loading="lazy" decoding="async" />
        <img className="primary-aquarium__mid" src="/primary-reference/aquarium/midground-reef.png" alt="" loading="lazy" decoding="async" />
        <img className="primary-aquarium__front" src="/primary-reference/aquarium/foreground-reef.png" alt="" loading="lazy" decoding="async" />
        <img className="primary-aquarium__bubbles" src="/primary-reference/aquarium/bubbles.png" alt="" loading="lazy" decoding="async" />
      </div>
      <div className="primary-aquarium__sprite-fallbacks" aria-hidden="true">
        {aquariumFish.map((fish, index) => (
          <img
            key={fish.id}
            className={`primary-aquarium__sprite primary-aquarium__sprite--${index + 1}`}
            src={fish.src}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
      <div className="primary-aquarium__controls" aria-label="Discover aquarium creatures">
        {aquariumFish.map((fish, index) => (
          <button
            key={fish.id}
            type="button"
            className={`primary-aquarium__fish-button primary-aquarium__fish-button--${index + 1}`}
            aria-label={`Show fun fact about ${fish.label}`}
            aria-pressed={selectedId === fish.id}
            onClick={(event) => selectFish(event, fish.id)}
          ><span className="sr-only">{fish.label}</span></button>
        ))}
      </div>
      <AquariumFactCard fish={selected} />
      <div className="primary-aquarium__progress" role="status" aria-label={`${discovered.length} of ${aquariumFish.length} creatures discovered`}>
        <span className="sr-only">{discovered.length} of {aquariumFish.length} creatures discovered</span>
        {aquariumFish.map((fish) => <span key={fish.id} className={discovered.includes(fish.id) ? 'is-found' : ''} aria-hidden="true">★</span>)}
      </div>
      <AquariumExitConnector />
    </section>
  );
};

export default PrimaryAquarium;
