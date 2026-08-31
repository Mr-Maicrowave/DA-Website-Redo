import { Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  TUTOR_LIBRARY_AUDIO_DEFAULT_VOLUME,
  TUTOR_LIBRARY_AUDIO_MUTED_KEY,
  TUTOR_LIBRARY_AUDIO_URL,
  TUTOR_LIBRARY_AUDIO_VOLUME_KEY,
  getTutorLibraryAudioPreferences,
  getTutorLibraryPlaybackVolume,
} from './tutor-library-audio';

export type TutorLibraryAudioController = {
  muted: boolean;
  volume: number;
  start(): void;
  toggleMuted(): void;
  setVolume(volume: number): void;
};

export function useTutorLibraryAudio(enabled: boolean): TutorLibraryAudioController {
  const initial = useRef(getTutorLibraryAudioPreferences(typeof window === 'undefined' ? undefined : window.localStorage));
  const [volume, setVolumeState] = useState(initial.current.volume);
  const [muted, setMuted] = useState(initial.current.muted);
  const audioRef = useRef<HTMLAudioElement>();
  const mutedRef = useRef(muted);
  const volumeRef = useRef(volume);

  mutedRef.current = muted;
  volumeRef.current = volume;

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(TUTOR_LIBRARY_AUDIO_URL);
      audio.loop = true;
      audio.preload = 'auto';
      audio.setAttribute('playsinline', '');
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const start = useCallback(() => {
    if (mutedRef.current || document.hidden) return;
    const audio = getAudio();
    audio.volume = getTutorLibraryPlaybackVolume(volumeRef.current, false);
    if (!audio.paused) return;
    void audio.play().catch(() => {
      // Autoplay can be blocked until the next user gesture.
    });
  }, [getAudio]);

  useEffect(() => {
    if (!enabled) {
      audioRef.current?.pause();
      return;
    }

    start();
    const unlock = () => start();
    const visibilityChanged = () => document.hidden ? audioRef.current?.pause() : start();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      document.removeEventListener('visibilitychange', visibilityChanged);
    };
  }, [enabled, start]);

  useEffect(() => () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = getTutorLibraryPlaybackVolume(volume, muted);
    if (muted) audioRef.current.pause();
    else start();
  }, [muted, start, volume]);

  const persist = (nextVolume: number, nextMuted: boolean) => {
    try {
      window.localStorage.setItem(TUTOR_LIBRARY_AUDIO_VOLUME_KEY, String(nextVolume));
      window.localStorage.setItem(TUTOR_LIBRARY_AUDIO_MUTED_KEY, String(nextMuted));
    } catch {
      // Persistence is optional.
    }
  };

  const toggleMuted = () => {
    const nextVolume = volume <= 0 ? TUTOR_LIBRARY_AUDIO_DEFAULT_VOLUME : volume;
    const nextMuted = !muted;
    volumeRef.current = nextVolume;
    mutedRef.current = nextMuted;
    setVolumeState(nextVolume);
    setMuted(nextMuted);
    persist(nextVolume, nextMuted);
    if (nextMuted) audioRef.current?.pause();
    else start();
  };

  const setVolume = (nextVolume: number) => {
    const clamped = Math.min(1, Math.max(0, nextVolume));
    const nextMuted = clamped === 0;
    volumeRef.current = clamped;
    mutedRef.current = nextMuted;
    setVolumeState(clamped);
    setMuted(nextMuted);
    persist(clamped, nextMuted);
    if (nextMuted) audioRef.current?.pause();
    else start();
  };

  return { muted, volume, start, toggleMuted, setVolume };
}

export function TutorLibraryAudioControls({ controller }: { controller: TutorLibraryAudioController }) {
  const percentage = Math.round(controller.volume * 100);
  return <div className="tutor-library__audio" role="group" aria-label="Tutor library sound">
    <button
      type="button"
      aria-label={controller.muted ? 'Turn music on' : 'Mute music'}
      aria-pressed={controller.muted}
      onClick={controller.toggleMuted}
    >
      {controller.muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
    </button>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={controller.muted ? 0 : controller.volume}
      aria-label="Music volume"
      aria-valuetext={`${controller.muted ? 0 : percentage} percent`}
      onChange={event => controller.setVolume(Number(event.currentTarget.value))}
    />
  </div>;
}
