import "./journey-completion.css";

interface JourneyCompletionProps {
  complete: boolean;
  onRevealPathway: () => void;
  revealing: boolean;
}

export const JourneyCompletion = ({
  complete,
  onRevealPathway,
  revealing,
}: JourneyCompletionProps) => (
    <section
      className="journey-completion"
      data-journey-completion
      data-complete={complete ? "true" : "false"}
      aria-hidden={!complete}
    >
      <div className="journey-completion__memory" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} data-memory-marker={index + 1}><i /></span>
        ))}
        <b />
      </div>
      <span className="journey-completion__forward-light" aria-hidden="true" />
      <div className="journey-completion__message">
        <p>YOUR PATHWAY IS READY</p>
        <span>Five moments. One clearer picture.</span>
        <button
          type="button"
          onClick={onRevealPathway}
          disabled={revealing}
          aria-controls="learning-pathway-result"
        >
          {revealing ? "FINDING THEIR PATHWAY…" : "SEE THEIR PATHWAY →"}
        </button>
      </div>
    </section>
  );
