import "./WhyFamiliesStay.css";

type FamilyPrinciple = {
  title: string;
  description: string;
};

const familyPrinciples: FamilyPrinciple[] = [
  {
    title: "Consistent Communication",
    description:
      "Parents receive honest feedback about learning progress, priorities and next steps.",
  },
  {
    title: "Thoughtful Teacher Matching",
    description:
      "Students are guided toward the class, level and teacher fit that can support their needs.",
  },
  {
    title: "Long-Term Relationships",
    description:
      "Families can grow with DA through different stages without starting again each year.",
  },
  {
    title: "Support That Evolves",
    description:
      "Teaching priorities adjust as confidence, habits and academic demands change.",
  },
];

type WhyFamiliesStayProps = {
  portalImage?: string;
  portalHref?: string;
  principles?: FamilyPrinciple[];
};

export function WhyFamiliesStay({
  // TODO: Replace with /images/homepage/final/parent-portal-preview.png once an anonymised, approved parent preview asset is available.
  portalImage = "/images/homepage/homepage-academy-hero.png",
  portalHref = "/faq",
  principles = familyPrinciples,
}: WhyFamiliesStayProps) {
  return (
    <section
      id="why-families-stay"
      className="families-stay da-section da-section--parchment da-screen-section"
      aria-labelledby="families-stay-heading"
    >
      <div className="da-paper-grain" aria-hidden="true" />

      <div className="da-container families-stay__inner">
        <header className="families-stay__header">
          <div>
            <p className="da-chapter">Chapter IX · Why Families Stay</p>

            <h2 id="families-stay-heading" className="da-heading">
              More than results.
              <span className="da-accent">
                {" "}
                A relationship built on trust.
              </span>
            </h2>
          </div>

          <p>
            Families should never be left wondering what their child is
            learning or how they are progressing. Clear communication,
            thoughtful teacher matching and ongoing support make the DA
            experience feel organised and personal.
          </p>
        </header>

        <div className="families-stay__layout">
          <div className="families-stay__statistics">
            {principles.map((principle, index) => (
              <article
                className="family-statistic"
                key={principle.title}
              >
                <span className="family-statistic__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{principle.title}</h3>

                <p>{principle.description}</p>
              </article>
            ))}
          </div>

          <article className="parent-visibility">
            <div className="parent-visibility__content">
              <p className="parent-visibility__label">
                How Parents Stay Informed
              </p>

              <h3>Clear feedback. Practical next steps.</h3>

              <p>
                DA Tuition tracks student progress through class performance,
                teacher feedback, assessment and parent communication.
              </p>

              <ul>
                <li>Class performance and learning progress</li>
                <li>Homework and learning priorities</li>
                <li>Teacher observations and feedback</li>
                <li>Assessment and achievement updates</li>
                <li>Clear next steps for continued growth</li>
              </ul>

              <a className="da-button da-button--gold" href={portalHref}>
                See How Parents Stay Informed
                <span className="da-button__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>

            <div className="parent-visibility__preview" aria-hidden={!portalImage}>
              {portalImage ? (
                <>
                  <div className="parent-visibility__device">
                    <div
                      className="parent-visibility__device-bar"
                      aria-hidden="true"
                    >
                      <span />
                      <span />
                      <span />
                    </div>

                    <img
                      src={portalImage}
                      alt="Temporary DA academy visual placeholder for the parent communication panel"
                      width="1000"
                      height="760"
                      loading="lazy"
                    />
                  </div>

                  <p>
                    Temporary visual placeholder. Replace with an anonymised
                    parent communication preview before publication.
                  </p>
                </>
              ) : (
                <div className="parent-visibility__printed-card">
                  <span>Progress</span>
                  <span>Feedback</span>
                  <span>Communication</span>
                </div>
              )}
            </div>
          </article>
        </div>

        <footer className="families-stay__footer">
          <a href="/our-approach">
            Discover the DA difference
            <span aria-hidden="true">→</span>
          </a>
        </footer>
      </div>
    </section>
  );
}
