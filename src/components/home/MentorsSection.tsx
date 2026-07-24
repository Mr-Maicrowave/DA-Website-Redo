import { useState } from "react";
import {
  FEATURED_IDS,
  TUTORS,
  getPhotoUrl,
  type CatalogueTutor,
} from "@/data/teacherCatalogue";
import "./MentorsSection.css";

export type Mentor = {
  id: string;
  name: string;
  role: string;
  title: string;
  subjects: string[];
  image: string;
  imageAlt: string;
  description: string;
  knownFor: string;
  href?: string;
  imagePosition?: string;
  imageScale?: number;
};

const subjectLabels = (subjects: string): string[] => {
  const labels: string[] = [];

  if (/Primary/i.test(subjects)) labels.push("Primary");
  if (/Mathematics/i.test(subjects)) labels.push("Mathematics");
  if (/English/i.test(subjects)) labels.push("English");
  if (/Science|Chemistry|Biology/i.test(subjects)) labels.push("Science");
  if (/Business/i.test(subjects)) labels.push("Business");
  if (/Legal Studies/i.test(subjects)) labels.push("Legal Studies");

  return labels.length > 0 ? labels.slice(0, 3) : ["All subjects"];
};

const toMentor = (teacher: CatalogueTutor): Mentor => ({
  id: teacher.id,
  name: teacher.name,
  role: subjectLabels(teacher.subjects).join(" · "),
  title: teacher.designation,
  subjects: teacher.profile?.tags.slice(0, 3) ?? subjectLabels(teacher.subjects),
  image: getPhotoUrl(teacher),
  imageAlt: `${teacher.name}, DA Tuition educator`,
  description: teacher.tagline,
  knownFor: teacher.profile?.remembered ?? teacher.motto,
  href: "/find-teacher",
  imagePosition: `${teacher.posX ?? "50%"} ${teacher.posY}`,
  imageScale: teacher.scale,
});

const featuredMentors: Mentor[] = FEATURED_IDS
  .map((id) => TUTORS.find((teacher) => teacher.id === id))
  .filter((teacher): teacher is CatalogueTutor => Boolean(teacher))
  .map(toMentor);

type MentorsSectionProps = {
  mentors?: Mentor[];
  allTeachersHref?: string;
};

export function MentorsSection({
  mentors = featuredMentors,
  allTeachersHref = "/find-teacher",
}: MentorsSectionProps) {
  const [activeMentorId, setActiveMentorId] = useState(mentors[0]?.id ?? "");

  const activeMentor =
    mentors.find((mentor) => mentor.id === activeMentorId) ?? mentors[0];

  if (!activeMentor) {
    return null;
  }

  const activeImageStyle = {
    objectPosition: activeMentor.imagePosition ?? "50% 35%",
    transform:
      activeMentor.imageScale && activeMentor.imageScale !== 1
        ? `scale(${activeMentor.imageScale})`
        : undefined,
    transformOrigin: activeMentor.imagePosition ?? "50% 35%",
  };

  return (
    <section
      id="mentors"
      className="mentors-section da-section da-section--ivory da-screen-section"
      aria-labelledby="mentors-heading"
    >
      <div className="da-paper-grain" aria-hidden="true" />

      <div className="da-container mentors-section__inner">
        <header className="mentors-section__header">
          <div>
            <p className="da-chapter">Chapter VIII · Meet the Mentors</p>

            <h2 id="mentors-heading" className="da-heading">
              The people behind
              <span className="da-accent"> the progress.</span>
            </h2>
          </div>

          <div className="mentors-section__introduction">
            <p>
              Great teaching is more than subject knowledge. It is the ability
              to notice when a student is uncertain, explain an idea another
              way and help them believe improvement is possible.
            </p>

            <a href={allTeachersHref}>
              Meet all educators
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </header>

        <div className="mentors-section__layout">
          <div className="mentors-section__portraits">
            {mentors.map((mentor) => {
              const isActive = mentor.id === activeMentorId;
              const imageStyle = {
                objectPosition: mentor.imagePosition ?? "50% 35%",
                transform:
                  mentor.imageScale && mentor.imageScale !== 1
                    ? `scale(${mentor.imageScale})`
                    : undefined,
                transformOrigin: mentor.imagePosition ?? "50% 35%",
              };

              return (
                <button
                  key={mentor.id}
                  type="button"
                  className={
                    isActive
                      ? "mentor-portrait mentor-portrait--active"
                      : "mentor-portrait"
                  }
                  aria-pressed={isActive}
                  onClick={() => setActiveMentorId(mentor.id)}
                  onMouseEnter={() => setActiveMentorId(mentor.id)}
                  onFocus={() => setActiveMentorId(mentor.id)}
                >
                  <span className="mentor-portrait__image">
                    <img
                      src={mentor.image}
                      alt={mentor.imageAlt}
                      width="720"
                      height="900"
                      loading="lazy"
                      style={imageStyle}
                    />
                  </span>

                  <span className="mentor-portrait__content">
                    <strong>{mentor.name}</strong>
                    <small>{mentor.role}</small>
                    <em>{mentor.title}</em>
                  </span>
                </button>
              );
            })}
          </div>

          <aside className="mentor-feature" aria-live="polite">
            <div className="mentor-feature__portrait">
              <img
                src={activeMentor.image}
                alt=""
                width="720"
                height="900"
                style={activeImageStyle}
              />

              <div
                className="mentor-feature__portrait-shade"
                aria-hidden="true"
              />
            </div>

            <div className="mentor-feature__content">
              <span className="mentor-feature__label">Currently featured</span>

              <h3>{activeMentor.name}</h3>

              <p className="mentor-feature__role">{activeMentor.role}</p>

              <div className="mentor-feature__subjects">
                {activeMentor.subjects.map((subject) => (
                  <span key={subject}>{subject}</span>
                ))}
              </div>

              <p className="mentor-feature__description">
                {activeMentor.description}
              </p>

              <dl>
                <div>
                  <dt>Known for</dt>
                  <dd>{activeMentor.knownFor}</dd>
                </div>

              </dl>

              {activeMentor.href && (
                <a href={activeMentor.href} className="da-button da-button--gold">
                  Meet this educator
                  <span className="da-button__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              )}
            </div>
          </aside>
        </div>

        <footer className="mentors-section__footer">
          <div>
            <strong>Expertise</strong>
            <span>Teachers selected for strong subject knowledge.</span>
          </div>

          <div>
            <strong>Communication</strong>
            <span>
              Clear explanations adapted to the student in front of them.
            </span>
          </div>

          <div>
            <strong>Care</strong>
            <span>
              Mentors who understand that confidence and connection matter.
            </span>
          </div>

          <div>
            <strong>Accountability</strong>
            <span>
              A culture of preparation, consistency and professional
              responsibility.
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
}
