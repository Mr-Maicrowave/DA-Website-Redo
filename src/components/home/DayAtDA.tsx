import "./DayAtDA.css";

type DayAtDAImage = {
  src: string;
  alt: string;
  position?: string;
};

type DayAtDAProps = {
  environmentHref?: string;
  images: [DayAtDAImage, DayAtDAImage, DayAtDAImage];
};

const schedule = [
  {
    time: "Arrival",
    title: "Students arrive",
    description:
      "Students settle in, greet their teachers and prepare for the lesson ahead.",
  },
  {
    time: "Check-in",
    title: "A warm check-in",
    description:
      "Tutors reconnect with students and identify anything requiring extra attention.",
  },
  {
    time: "Learning",
    title: "Focused learning begins",
    description:
      "Clear explanations, guided examples and purposeful practice build understanding.",
  },
  {
    time: "Reset",
    title: "A moment to reset",
    description:
      "Short breaks and positive interaction help students return with renewed focus.",
  },
  {
    time: "Practice",
    title: "Practice and support",
    description:
      "Students apply what they have learned while tutors provide individual guidance.",
  },
  {
    time: "Feedback",
    title: "Feedback and next steps",
    description:
      "The lesson concludes with clear feedback, priorities and direction for continued growth.",
  },
  {
    time: "Departure",
    title: "Students leave with confidence",
    description:
      "Parents collect students who understand what they achieved and what comes next.",
  },
];

const homepageSchedule = schedule.filter((item) =>
  ["Arrival", "Check-in", "Learning", "Practice", "Feedback"].includes(
    item.time,
  ),
);

export function DayAtDA({
  environmentHref = "/why-choose-da#a-day-at-da",
  images,
}: DayAtDAProps) {
  return (
    <section
      id="day-at-da"
      className="day-at-da da-section da-section--parchment da-screen-section"
      aria-labelledby="day-at-da-heading"
    >
      <div className="da-paper-grain" aria-hidden="true" />

      <div className="da-container day-at-da__inner">
        <header className="day-at-da__header">
          <div>
            <p className="da-chapter">Chapter V · A Day at DA</p>

            <h2 id="day-at-da-heading" className="da-heading">
              Learning, laughter
              <span className="da-accent"> and growth.</span>
            </h2>
          </div>

          <div className="day-at-da__introduction">
            <p>
              A DA lesson is structured and purposeful, but it should never feel
              cold. Students learn in an environment where questions are
              welcomed, teachers pay attention and progress is recognised.
            </p>

            <a href={environmentHref}>
              Discover our environment
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </header>

        <div className="day-at-da__spread da-page">
          <div className="day-at-da__timeline">
            <p className="day-at-da__page-label">
              The rhythm of a lesson
            </p>

            <ol>
              {homepageSchedule.map((item, index) => (
                <li key={`${item.time}-${item.title}`}>
                  <div className="day-at-da__time">
                    <span>{item.time}</span>
                    <i aria-hidden="true">{index + 1}</i>
                  </div>

                  <div className="day-at-da__event">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="day-at-da__gallery">
            <figure className="day-at-da__image day-at-da__image--large">
              <img
                src={images[0].src}
                alt={images[0].alt}
                loading="lazy"
                width="1200"
                height="800"
                style={{
                  objectPosition: images[0].position ?? "50% 50%",
                }}
              />
            </figure>

            <figure className="day-at-da__image">
              <img
                src={images[1].src}
                alt={images[1].alt}
                loading="lazy"
                width="900"
                height="650"
                style={{
                  objectPosition: images[1].position ?? "50% 50%",
                }}
              />
            </figure>

            <figure className="day-at-da__image">
              <img
                src={images[2].src}
                alt={images[2].alt}
                loading="lazy"
                width="900"
                height="650"
                style={{
                  objectPosition: images[2].position ?? "50% 50%",
                }}
              />
            </figure>

            <blockquote>
              “Every lesson should leave a student feeling more capable than
              when they arrived.”
            </blockquote>
          </div>
        </div>

        <footer className="day-at-da__footer">
          <div>
            <strong>A supportive environment</strong>
            <span>Students feel safe asking questions.</span>
          </div>

          <div>
            <strong>Meaningful relationships</strong>
            <span>Tutors understand the student behind the work.</span>
          </div>

          <div>
            <strong>Purposeful learning</strong>
            <span>Every lesson has clear priorities and next steps.</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
