import './tutor-library.css';

type TutorLibraryLoadingSurfaceProps = {
  departing?: boolean;
  standalone?: boolean;
  statusText?: string;
};

export function TutorLibraryLoadingSurface({
  departing = false,
  standalone = false,
  statusText = 'Preparing the reading room',
}: TutorLibraryLoadingSurfaceProps) {
  const loadingSurface = <div
    className={`tutor-library__loading${departing ? ' tutor-library__loading--departing' : ''}`}
    role="status"
    aria-live="polite"
  >
    <div className="tutor-library__loading-card">
      <p>DA Tuition faculty</p>
      <h2>The tutor library is opening</h2>
      <div className="tutor-library__loading-shelf" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, index) => <i key={index} />)}
      </div>
      <span>{statusText}</span>
    </div>
  </div>;

  if (!standalone) return loadingSurface;
  return <section className="tutor-library tutor-library--loading-only" aria-label="Opening tutor library">
    {loadingSurface}
  </section>;
}
