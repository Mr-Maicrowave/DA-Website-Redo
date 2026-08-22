import { Navigate, useLocation } from 'react-router-dom';

export function LegacyTutorRedirect() {
  const { search } = useLocation();

  return <Navigate to={`/tutors${search}`} replace />;
}
