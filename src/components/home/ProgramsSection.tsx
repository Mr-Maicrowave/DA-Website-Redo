import { Link } from "react-router-dom";
import { siteStats } from "@/data/site-stats";
import "./ProgramsSection.css";

type Program = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  outcome: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  href: string;
  tags: string[];
  chapterMark: string;
};

const programs: Program[] = [
  {
    id: "primary",
    eyebrow: "Years 1–6",
    title: "Primary School",
    description:
      "Build strong foundations in literacy, numeracy and independent learning through encouraging, structured lessons.",
    outcome:
      "Designed to develop confidence, curiosity and the learning habits students will carry into high school.",
    image: "/primary-boy.png",
    imageAlt:
      "Primary school student smiling while writing during a DA Tuition lesson.",
    imagePosition: "50% 58%",
    href: "/programs/primary-school",
    tags: ["Literacy", "Numeracy", "Confidence"],
    chapterMark: "I",
  },
  {
    id: "high-school",
    eyebrow: "Years 7–10",
    title: "High School",
    description:
      "Strengthen subject knowledge, study habits and analytical thinking as academic expectations become more demanding.",
    outcome:
      "Students learn how to approach complex work, study effectively and take greater ownership of their progress.",
    image: "/highschool-girl.png",
    imageAlt:
      "High school student writing notes during a DA Tuition lesson.",
    imagePosition: "50% 50%",
    href: "/programs/high-school",
    tags: ["Skills", "Understanding", "Independence"],
    chapterMark: "II",
  },
  {
    id: "hsc",
    eyebrow: "Years 11–12",
    title: "HSC Excellence",
    description:
      "Receive focused subject guidance, examination strategy and disciplined preparation for senior assessments and the HSC.",
    outcome:
      "A structured pathway for students pursuing stronger results, confidence and ambitious post-school goals.",
    image: "/hsc-student.jpeg",
    imageAlt:
      "HSC student smiling in a DA Tuition learning space.",
    imagePosition: "50% 48%",
    href: "/hsc-excellence",
    tags: ["Results", "Strategy", "Direction"],
    chapterMark: "III",
  },
];

type ProgramsSectionProps = {
  allProgramsHref?: string;
  educatorCount?: string | number;
};

export function ProgramsSection({
  allProgramsHref = "/learning-formats",
  educatorCount = siteStats.educatorCount,
}: ProgramsSectionProps) {
  return (
    <section
      id="programs"
      className="programs-section da-section da-section--parchment da-screen-section"
      aria-labelledby="programs-heading"
    >
      <div className="da-paper-grain" aria-hidden="true" />

      <div className="da-container programs-section__inner">
        <header className="programs-section__header">
          <div>
            <p className="da-chapter">Chapter III · Academic Programs</p>

            <h2 id="programs-heading" className="da-heading">
              Programs for
              <span className="da-accent"> every stage.</span>
            </h2>
          </div>

          <div className="programs-section__introduction">
            <p>
              From the first years of school to the final HSC examinations,
              every stage requires a different kind of guidance.
            </p>

            <Link className="programs-section__all-link" to={allProgramsHref}>
              View all programs
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        <div className="programs-section__layout">
          <div className="programs-section__cards">
            {programs.map((program) => (
              <article className="program-card" key={program.id}>
                <Link
                  to={program.href}
                  className="program-card__image-link"
                  aria-label={`Explore ${program.title}`}
                >
                  <img
                    src={program.image}
                    alt={program.imageAlt}
                    width="1400"
                    height="933"
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: program.imagePosition }}
                  />

                  <div
                    className="program-card__image-shade"
                    aria-hidden="true"
                  />

                  <span
                    className="program-card__chapter-mark"
                    aria-hidden="true"
                  >
                    {program.chapterMark}
                  </span>

                  <span className="program-card__eyebrow">
                    {program.eyebrow}
                  </span>
                </Link>

                <div className="program-card__content">
                  <h3>
                    <Link to={program.href}>{program.title}</Link>
                  </h3>

                  <p className="program-card__description">
                    {program.description}
                  </p>

                  <p className="program-card__outcome">{program.outcome}</p>

                  <div className="program-card__footer">
                    <ul
                      className="program-card__tags"
                      aria-label={`${program.title} focus areas`}
                    >
                      {program.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>

                    <Link
                      to={program.href}
                      className="program-card__arrow"
                      aria-label={`View ${program.title}`}
                    >
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside
            className="programs-section__educators"
            aria-label="DA educators"
          >
            <span className="programs-section__educator-icon">DA</span>

            <strong>{educatorCount}</strong>

            <h3>Passionate Educators</h3>

            <p>
              Across subjects and year levels, every student is supported by
              educators selected for both expertise and care.
            </p>

            <Link to="/find-teacher">
              Meet our educators
              <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>

        <footer className="programs-section__footer">
          <p>Unsure which program is right for your child?</p>

          <Link to="/book-interview" className="da-button da-button--primary">
            Find the Right Starting Point
            <span className="da-button__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </footer>
      </div>
    </section>
  );
}
