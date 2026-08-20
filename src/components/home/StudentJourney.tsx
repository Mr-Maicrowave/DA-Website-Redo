import { Link } from "react-router-dom";
import "./StudentJourney.css";

type JourneyStep = {
  number: string;
  shortLabel: string;
  title: string;
  description: string;
};

const journeySteps: JourneyStep[] = [
  {
    number: "01",
    shortLabel: "Listen",
    title: "Consultation",
    description:
      "We begin by understanding your child’s year level, needs, concerns and goals.",
  },
  {
    number: "02",
    shortLabel: "Discover",
    title: "Learning Check",
    description:
      "We identify strengths, knowledge gaps and the most appropriate starting point.",
  },
  {
    number: "03",
    shortLabel: "Plan",
    title: "Learning Path",
    description:
      "A clear learning plan is developed around priorities, confidence and progression.",
  },
  {
    number: "04",
    shortLabel: "Connect",
    title: "Teacher Match",
    description:
      "Your child is matched with a teacher suited to their subject, level and learning needs.",
  },
  {
    number: "05",
    shortLabel: "Learn",
    title: "Weekly Lessons",
    description:
      "Structured teaching, guided practice and meaningful feedback build stronger understanding.",
  },
  {
    number: "06",
    shortLabel: "Track",
    title: "Progress Updates",
    description:
      "Parents receive visibility into learning progress, priorities and emerging areas for support.",
  },
  {
    number: "07",
    shortLabel: "Grow",
    title: "Confidence and Results",
    description:
      "As understanding strengthens, students become more confident, independent and capable.",
  },
];

type StudentJourneyProps = {
  consultationHref?: string;
  portalHref?: string;
};

export function StudentJourney({
  consultationHref = "/book-interview",
  portalHref = "/faq",
}: StudentJourneyProps) {
  return (
    <section
      id="student-journey"
      className="journey-section da-section da-section--ivory da-screen-section"
      aria-labelledby="journey-heading"
    >
      <div className="da-paper-grain" aria-hidden="true" />

      <div className="da-container journey-section__inner">
        <header className="journey-section__header">
          <div>
            <p className="da-chapter">Chapter IV · The Student Journey</p>

            <h2 id="journey-heading" className="da-heading">
              A clear path,
              <span className="da-accent">
                {" "}
                personalised for every child.
              </span>
            </h2>
          </div>

          <p>
            Families should always understand what comes next. From the first
            conversation to ongoing progress, every stage is designed to be
            thoughtful, transparent and purposeful.
          </p>
        </header>

        <div className="journey-section__timeline">
          <div className="journey-section__path" aria-hidden="true">
            <span />
          </div>

          <ol className="journey-section__steps">
            {journeySteps.map((step) => (
              <li className="journey-step" key={step.number}>
                <div className="journey-step__marker">
                  <span className="journey-step__number">{step.number}</span>

                  <span className="journey-step__dot" aria-hidden="true" />
                </div>

                <span className="journey-step__short-label">
                  {step.shortLabel}
                </span>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="journey-section__support">
          <article className="journey-support-card">
            <span className="journey-support-card__index" aria-hidden="true">
              I
            </span>

            <div>
              <h3>Regular Communication</h3>

              <p>
                Families are kept informed rather than left wondering how
                learning is progressing.
              </p>
            </div>
          </article>

          <article className="journey-support-card">
            <span className="journey-support-card__index" aria-hidden="true">
              II
            </span>

            <div>
              <h3>Parent Visibility</h3>

              <p>
                Parents are kept across class performance, teacher feedback,
                assessment and areas for support.
              </p>
            </div>
          </article>

          <article className="journey-support-card">
            <span className="journey-support-card__index" aria-hidden="true">
              III
            </span>

            <div>
              <h3>Ongoing Support</h3>

              <p>
                Plans can evolve as students improve, encounter new challenges
                or establish new goals.
              </p>
            </div>
          </article>
        </div>

        <footer className="journey-section__footer">
          <div>
            <p className="journey-section__footer-label">
              Every journey begins differently.
            </p>

            <p className="journey-section__footer-title">
              Let us help you identify the right starting point.
            </p>
          </div>

          <div className="journey-section__actions">
            <Link to={consultationHref} className="da-button da-button--gold">
              Book a Consultation
              <span className="da-button__arrow" aria-hidden="true">
                →
              </span>
            </Link>

            <Link to={portalHref} className="journey-section__text-link">
              See how parents stay informed
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </footer>
      </div>
    </section>
  );
}
