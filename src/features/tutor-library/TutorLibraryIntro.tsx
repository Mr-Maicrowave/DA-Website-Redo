import { useEffect, useState } from 'react';
import './tutor-library.css';

const INTRO_SEEN_KEY = 'daTutorLibraryIntroSeen_v1';

export function TutorLibraryIntro({ onComplete }: { onComplete(): void }) {
  const [hasSeenIntro] = useState(() => window.localStorage.getItem(INTRO_SEEN_KEY) === 'true');
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== 'tutor-intro-complete') return;
      window.localStorage.setItem(INTRO_SEEN_KEY, 'true');
      setComplete(true);
    };
    window.addEventListener('message', receiveMessage);
    return () => window.removeEventListener('message', receiveMessage);
  }, []);

  const canEnter = complete || hasSeenIntro;

  return <section className="tutor-library-intro" aria-label="DA Tuition tutor selection story">
    <iframe title="DA Tuition tutor selection book" src="/dev/complete-shelf-reference/index.html?variant=tutor-intro" className="tutor-library-intro__complete-shelf" />
    {(hasSeenIntro || complete) && <button type="button" className="tutor-library-intro__enter" onClick={onComplete} disabled={!canEnter}>Enter library →</button>}
  </section>;
}
