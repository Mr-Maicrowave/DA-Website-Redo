export interface ProfileFocusTarget {
  isConnected: boolean;
  focus: () => void;
}

export function restoreProfileReturnFocus(
  preferred: ProfileFocusTarget | null,
  fallback: ProfileFocusTarget | null,
): boolean {
  const target = preferred?.isConnected
    ? preferred
    : fallback?.isConnected
      ? fallback
      : null;
  if (!target) return false;
  target.focus();
  return true;
}
