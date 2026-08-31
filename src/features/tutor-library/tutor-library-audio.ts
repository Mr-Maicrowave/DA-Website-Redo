export const TUTOR_LIBRARY_AUDIO_URL = '/audio/tutor-library-ambient.mp3';
export const TUTOR_LIBRARY_AUDIO_VOLUME_KEY = 'complete-shelf-audio-volume';
export const TUTOR_LIBRARY_AUDIO_MUTED_KEY = 'complete-shelf-audio-muted';
export const TUTOR_LIBRARY_AUDIO_DEFAULT_VOLUME = 0.55;
export const TUTOR_LIBRARY_AUDIO_GAIN = 0.24;

type ReadableStorage = Pick<Storage, 'getItem'>;

export type TutorLibraryAudioPreferences = {
  volume: number;
  muted: boolean;
};

export function getTutorLibraryAudioPreferences(storage?: ReadableStorage): TutorLibraryAudioPreferences {
  let volume = TUTOR_LIBRARY_AUDIO_DEFAULT_VOLUME;
  let muted = false;

  try {
    const savedVolumeValue = storage?.getItem(TUTOR_LIBRARY_AUDIO_VOLUME_KEY);
    const savedVolume = Number(savedVolumeValue);
    if (savedVolumeValue !== null && Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1) {
      volume = savedVolume;
    }
    muted = storage?.getItem(TUTOR_LIBRARY_AUDIO_MUTED_KEY) === 'true';
  } catch {
    // Storage can be unavailable in privacy modes; in-memory controls still work.
  }

  return { volume, muted };
}

export function getTutorLibraryPlaybackVolume(volume: number, muted: boolean) {
  if (muted) return 0;
  return Math.min(1, Math.max(0, volume)) * TUTOR_LIBRARY_AUDIO_GAIN;
}

