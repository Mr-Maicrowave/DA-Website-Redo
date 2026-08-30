import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import AquariumFactCard from './AquariumFactCard';
import { aquariumBackgroundFish, aquariumFish } from './primaryStoryData';
import { markDiscovered } from './aquariumPhysics';
import { useAquariumEngine } from './useAquariumEngine';
import { AquariumExitConnector } from './StoryConnectors';

const PrimaryAquarium = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>();
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [factPosition, setFactPosition] = useState<CSSProperties>();
  useAquariumEngine(hostRef);

  useEffect(() => {
    if (!selectedId) return;
    const timeout = window.setTimeout(() => setSelectedId(undefined), 4800);
    return () => window.clearTimeout(timeout);
  }, [selectedId]);

  const selectFish = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    const section = event.currentTarget.closest('.primary-aquarium')?.getBoundingClientRect();
    const button = event.currentTarget.getBoundingClientRect();
    if (section) {
      setFactPosition({ '--fact-x': `${button.left - section.left + button.width / 2}px`, '--fact-y': `${button.top - section.top + button.height / 2}px` } as CSSProperties);
    }
    setSelectedId(id);
    setDiscovered((current) => markDiscovered(current, id));
    hostRef.current?.dispatchEvent(new CustomEvent('aquarium:fish-click', { detail: { id }, bubbles: false }));
  };
  const selected = aquariumFish.find((fish) => fish.id === selectedId);

  return (
    <section id="primary-aquarium" className="primary-aquarium" aria-labelledby="primary-aquarium-title">
      <div className="primary-aquarium__surface" aria-hidden="true" />
      <div className="primary-aquarium__moving-waves" aria-hidden="true"><span /><span /></div>
      <div className="primary-aquarium__waterline" aria-hidden="true"><i /><i /><i /></div>
      <p className="primary-aquarium__chapter-label">Curiosity corner</p>
      <div className="primary-aquarium__copy">
        <h2 id="primary-aquarium-title">Curiosity grows<br />when children explore.</h2>
        <span className="primary-aquarium__instruction primary-aquarium__instruction--desktop">Chase a fish <b>•</b> Click to discover</span>
        <span className="primary-aquarium__instruction primary-aquarium__instruction--touch">Tap a fish <b>•</b> Tap water to ripple</span>
      </div>
      <div ref={hostRef} className="primary-aquarium__canvas" aria-hidden="true">
        <img className="primary-aquarium__water primary-aquarium__reference-plate" src="/primary-reference/aquarium/reference-tank-background.png" alt="" loading="lazy" decoding="async" />
        <img className="primary-aquarium__bubbles" src="/primary-reference/aquarium/bubbles.png" alt="" loading="lazy" decoding="async" />
      </div>
      <div className="primary-aquarium__sprite-fallbacks" aria-hidden="true">
        {[...aquariumFish, ...aquariumBackgroundFish].map((fish, index) => (
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
      <AquariumFactCard fish={selected} onDismiss={() => setSelectedId(undefined)} style={factPosition} />
      <div className="primary-aquarium__progress" role="status" aria-label={`${discovered.length} of ${aquariumFish.length} creatures discovered`}>
        <span className="sr-only">{discovered.length} of {aquariumFish.length} creatures discovered</span>
        <strong>Discover them all</strong>
        {aquariumFish.map((fish) => <span key={fish.id} className={discovered.includes(fish.id) ? 'is-found' : ''} aria-hidden="true">★</span>)}
      </div>
      {discovered.length === 5 ? <div className="primary-aquarium__celebration" aria-hidden="true">✦ 𓆝 𓆟 𓆞 ✦</div> : null}
      <AquariumExitConnector />
    </section>
  );
};

export default PrimaryAquarium;
