import type { MouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
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
  const prefersReducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, {
    stiffness: 170,
    damping: 24,
  });

  const springY = useSpring(rotateY, {
    stiffness: 170,
    damping: 24,
  });

  const clampTilt = (value: number) => Math.max(-2, Math.min(2, value));

  const handleHeroMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = (x / rect.width - 0.5) * 2;
    const py = (y / rect.height - 0.5) * 2;

    rotateY.set(clampTilt(px * 2));
    rotateX.set(clampTilt(-py * 2));
  };

  const resetHeroTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleExplore = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onExplore) return;

    event.preventDefault();
    onExplore();
  };

  return (
    <section
      className="academy-hero da-screen-section"
      aria-labelledby="academy-hero-title"
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={resetHeroTilt}
    >
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

        </div>

        <div className="academy-hero__chapter-marker" aria-hidden="true">
          <span>Chapter I</span>
          <div />
          <span>Scroll to explore</span>
        </div>

        <div className="heroBookWrapper">
          <div className="heroBookShadow" aria-hidden="true" />
          <div className="heroBookFloat">
            <motion.img
              className="heroBook"
              src="/images/homepage/hero-book-closed.png"
              alt="DA Tuition academy book"
              width="1536"
              height="1024"
              style={
                prefersReducedMotion
                  ? undefined
                  : {
                      transformPerspective: 780,
                      rotateX: springX,
                      rotateY: springY,
                    }
              }
            />
            <span className="heroBookShimmer" aria-hidden="true" />
            <div className="heroBookParticles" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={index}
                  className={`heroParticle heroParticle${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
