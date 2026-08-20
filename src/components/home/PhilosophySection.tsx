import { Link } from "react-router-dom";
import "./PhilosophySection.css";

type PhilosophyItem = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

const philosophyItems: PhilosophyItem[] = [
  {
    number: "01",
    title: "Belief",
    description:
      "Every student can grow when supported by the right teacher, environment and encouragement.",
    icon: "✦",
  },
  {
    number: "02",
    title: "Understanding",
    description:
      "We teach students to think deeply, ask meaningful questions and understand—not simply memorise.",
    icon: "◇",
  },
  {
    number: "03",
    title: "Growth",
    description:
      "Academic progress follows confidence, curiosity, consistency and the courage to keep trying.",
    icon: "⌁",
  },
  {
    number: "04",
    title: "Character",
    description:
      "We nurture resilience, independence, responsibility and a genuine love of learning.",
    icon: "♜",
  },
];

type PhilosophySectionProps = {
  approachHref?: string;
};

export function PhilosophySection({
  approachHref = "/our-approach",
}: PhilosophySectionProps) {
  return (
    <section
      id="philosophy"
      className="philosophy-section da-section da-section--parchment da-screen-section"
      aria-labelledby="philosophy-heading"
    >
      <div className="da-paper-grain" aria-hidden="true" />

      <div className="philosophy-section__skyline" aria-hidden="true" />

      <div className="da-container philosophy-section__inner">
        <header className="philosophy-section__header">
          <div>
            <p className="da-chapter">Chapter I · Our Philosophy</p>

            <h2 id="philosophy-heading" className="da-heading">
              The beliefs that shape
              <span className="da-accent"> every lesson.</span>
            </h2>
          </div>

          <div className="philosophy-section__introduction">
            <p>
              At DA Tuition, academic success begins before the marks improve.
              It begins when a student feels understood, supported and capable
              of achieving more.
            </p>

            <p>
              Our philosophy brings together high expectations, thoughtful
              teaching and genuine relationships.
            </p>
          </div>
        </header>

        <div className="philosophy-section__divider" aria-hidden="true">
          <span />
          <div className="philosophy-section__crest">✦</div>
          <span />
        </div>

        <div className="philosophy-section__grid">
          {philosophyItems.map((item) => (
            <article key={item.number} className="philosophy-card">
              <div className="philosophy-card__top">
                <span className="philosophy-card__number">{item.number}</span>

                <span className="philosophy-card__icon" aria-hidden="true">
                  {item.icon}
                </span>
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <div className="philosophy-card__ornament" aria-hidden="true" />
            </article>
          ))}
        </div>

        <footer className="philosophy-section__footer">
          <blockquote>
            “Confidence often comes before achievement.”
          </blockquote>

          <Link to={approachHref} className="da-button da-button--primary">
            Discover Our Approach
            <span className="da-button__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </footer>
      </div>
    </section>
  );
}
