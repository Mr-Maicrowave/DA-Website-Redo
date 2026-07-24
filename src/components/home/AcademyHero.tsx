import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import "./AcademyHero.css";

type AcademyHeroProps = {
  onExplore?: () => void;
  consultationHref?: string;
};

export function AcademyHero({
  onExplore,
  consultationHref = "/book-interview",
}: AcademyHeroProps) {
  const handleExplore = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onExplore) return;

    event.preventDefault();
    onExplore();
  };

  return (
    <section className="academy-hero da-screen-section" aria-labelledby="academy-hero-title">
      <div className="academy-hero__background" aria-hidden="true" />
      <div className="academy-hero__light" aria-hidden="true" />
      <div className="academy-hero__particles" aria-hidden="true" />
      <div className="academy-hero__shade" aria-hidden="true" />

      <div className="da-container academy-hero__inner">
        <div className="academy-hero__content da-reveal">
          <p className="da-chapter da-chapter--light">The DA Journey</p>

          <h1 id="academy-hero-title" className="academy-hero__title">
            Every great story begins with a <span>single page.</span>
          </h1>

          <p className="academy-hero__welcome">Welcome to DA Tuition.</p>

          <p className="academy-hero__description">
            A place where students from Year 1 to Year 12 build confidence,
            discover their potential and pursue academic excellence with
            teachers who genuinely care.
          </p>

          <div className="academy-hero__actions">
            <a
              href="#philosophy"
              className="da-button da-button--primary"
              onClick={handleExplore}
            >
              Explore Our Academy
              <span className="da-button__arrow" aria-hidden="true">
                →
              </span>
            </a>

            <Link to={consultationHref} className="da-button da-button--ghost">
              Book a Consultation
              <span className="da-button__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <div className="academy-hero__trust">
            <div className="academy-hero__trust-item">
              <strong>20+</strong>
              <span>Years of Guidance</span>
            </div>

            <div className="academy-hero__trust-separator" />

            <div className="academy-hero__trust-item">
              <strong>450+</strong>
              <span>Five-Star Stories</span>
            </div>

            <div className="academy-hero__trust-separator" />

            <div className="academy-hero__trust-item">
              <strong>Year 1–12</strong>
              <span>Complete Learning Journey</span>
            </div>
          </div>
        </div>

        <div className="academy-hero__chapter-marker" aria-hidden="true">
          <span>Chapter I</span>
          <div />
          <span>Scroll to explore</span>
        </div>

        <div className="heroBookWrapper">
          <div className="heroBookShadow" aria-hidden="true" />
          <img
            className="heroBook"
            src="/images/homepage/hero-book-closed.png"
            alt="DA Tuition academy book"
            width="1536"
            height="1024"
          />
        </div>
      </div>
    </section>
  );
}
