import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export type NavState = 'expanded' | 'collapsed';

const EXPAND_THRESHOLD = 90;   // net upward scroll (px) needed to expand
const COLLAPSE_THRESHOLD = 30; // net downward scroll (px) needed to collapse
const COOLDOWN_MS = 350;       // settle time after any transition before acting again
const IDLE_EXPIRE_MS = 750;    // a paused, incomplete gesture stops counting after this long

/**
 * Drives the desktop nav's collapsed/expanded state from scroll direction.
 *
 * Desktop only — mobile renders a persistent, non-scroll-reactive header and
 * never consumes `navState` at all. See docs/superpowers/specs (or the
 * conversation history) for the full design rationale; the short version:
 *
 * - Starts expanded on every route (first-time visitors need to see the
 *   brand name and "Book Consultation" immediately — never default to a
 *   collapsed, unlabelled state on arrival).
 * - A signed running accumulator (not two independent counters) means a
 *   brief reversal mid-gesture nudges the number back rather than wiping
 *   out real progress — but it takes sustained movement to actually cross
 *   a threshold, not a single tick.
 * - Asymmetric thresholds: easy to collapse while reading (30px), requires
 *   deliberate intent to bring back (90px).
 * - Cooldown after each transition absorbs the stray reverse tick that
 *   real scroll hardware (mouse wheels especially) often sends right at
 *   the start/end of a gesture; if a threshold is crossed *during* the
 *   cooldown, a timer re-evaluates at cooldown-expiry rather than waiting
 *   on another scroll event that may never come.
 * - Idle-expiry clears a stale partial gesture after a pause, so an old
 *   80px-but-not-quite-there attempt can't be finished off by an unrelated
 *   10px scroll long after the user forgot about the first one.
 * - scrollY is clamped to the valid document range before use — Safari
 *   can report negative/overshoot values during elastic overscroll.
 * - Rebases on route change, BFCache restore, and orientation change.
 * - Pinned open whenever `pin(true)` is called (focus inside the nav, or
 *   any dropdown/menu open) and won't auto-collapse until unpinned.
 */
export function useAdaptiveNav() {
  const [navState, setNavState] = useState<NavState>('expanded');
  const location = useLocation();

  const lastY = useRef(0);
  const netDelta = useRef(0);
  const lastChangeAt = useRef(0);
  const pinned = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();
  const cooldownTimer = useRef<ReturnType<typeof setTimeout>>();

  const clampY = useCallback((y: number) => {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(0, Math.min(y, max));
  }, []);

  const commit = useCallback((next: NavState) => {
    netDelta.current = 0;
    lastChangeAt.current = performance.now();
    setNavState((prev) => (prev === next ? prev : next));
  }, []);

  const evaluate = useCallback(() => {
    if (pinned.current) return;
    if (netDelta.current >= COLLAPSE_THRESHOLD) commit('collapsed');
    else if (netDelta.current <= -EXPAND_THRESHOLD) commit('expanded');
  }, [commit]);

  const rebase = useCallback(() => {
    lastY.current = clampY(window.scrollY);
    netDelta.current = 0;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
  }, [clampY]);

  const onScroll = useCallback(() => {
    const y = clampY(window.scrollY);
    const dy = y - lastY.current;
    lastY.current = y;
    netDelta.current += dy;

    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      netDelta.current = 0;
    }, IDLE_EXPIRE_MS);

    const sinceChange = performance.now() - lastChangeAt.current;
    if (sinceChange < COOLDOWN_MS) {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      cooldownTimer.current = setTimeout(evaluate, COOLDOWN_MS - sinceChange);
      return;
    }

    evaluate();
  }, [clampY, evaluate]);

  useEffect(() => {
    rebase();
    setNavState('expanded'); // re-assert full bar on every route change

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) rebase();
    };
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('orientationchange', rebase);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('orientationchange', rebase);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /** Call with `true` while focus is inside the nav or any dropdown/menu is
   * open, and `false` once neither is true — pins the bar expanded and
   * immune to scroll-driven collapse in the meantime. */
  const pin = useCallback((shouldPin: boolean) => {
    pinned.current = shouldPin;
    if (shouldPin) commit('expanded');
  }, [commit]);

  /** Manual expand, e.g. tapping the collapsed menu disclosure. */
  const expand = useCallback(() => commit('expanded'), [commit]);

  return { navState, pin, expand };
}
