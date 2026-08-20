import "./BeginJourneyCTA.css";

type BeginJourneyCTAProps = {
  consultationHref?: string;
  programsHref?: string;
  backgroundImage?: string;
};

export function BeginJourneyCTA({
  consultationHref = "/book-interview",
  programsHref = "#programs",
  backgroundImage = "/images/homepage/academy-doors.png",
}: BeginJourneyCTAProps) {
  return (
    <section
      id="begin-your-story"
      className="begin-journey da-screen-section"
      aria-labelledby="begin-journey-heading"
    >
      <div
        className="begin-journey__background"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
        }}
        aria-hidden="true"
      />

      <div className="begin-journey__shade" aria-hidden="true" />
      <div className="begin-journey__dust" aria-hidden="true" />

      <div className="da-container begin-journey__inner">
        <div className="begin-journey__content">
          <p className="da-chapter da-chapter--light">
            Chapter X · Your Story Begins
          </p>

          <h2 id="begin-journey-heading">
            Begin your story
            <span> with DA today.</span>
          </h2>

          <p>
            Every student begins from a different page. A consultation helps us
            understand your child’s needs, recommend the right program and
            identify a clear starting point.
          </p>

          <div className="begin-journey__actions">
            <a href={consultationHref} className="da-button da-button--gold">
              Book a Consultation
              <span className="da-button__arrow" aria-hidden="true">
                →
              </span>
            </a>

            <a href={programsHref} className="begin-journey__secondary-link">
              Explore Programs First
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <aside className="begin-journey__promises">
          <article>
            <span aria-hidden="true">I</span>

            <div>
              <h3>Personalised Consultation</h3>
              <p>A focused conversation about the student behind the marks.</p>
            </div>
          </article>

          <article>
            <span aria-hidden="true">II</span>

            <div>
              <h3>Thoughtful Recommendation</h3>
              <p>
                The program, level and teacher that best match the student’s
                needs.
              </p>
            </div>
          </article>

          <article>
            <span aria-hidden="true">III</span>

            <div>
              <h3>A Clear Path Forward</h3>
              <p>
                Practical next steps for confidence, progress and stronger
                learning habits.
              </p>
            </div>
          </article>
        </aside>

        <blockquote className="begin-journey__quote">
          “The future belongs to those who believe in the beauty of their
          dreams.”
          <cite>— Eleanor Roosevelt</cite>
        </blockquote>
      </div>
    </section>
  );
}
