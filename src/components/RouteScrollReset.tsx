import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets the scroll position to the top whenever the route changes.
 *
 * React Router's client-side navigation swaps page content in place without
 * a real browser page load, so the browser has no reason to scroll back to
 * the top the way it would on a fresh load — pages can open wherever the
 * visitor last scrolled to instead. This listens for route changes and
 * jumps back to the top each time.
 */
const RouteScrollReset = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default RouteScrollReset;
