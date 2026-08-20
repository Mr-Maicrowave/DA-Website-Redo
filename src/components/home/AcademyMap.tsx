import { useState } from "react";
import "./AcademyMap.css";

type AcademyDestination = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  x: number;
  y: number;
};

const destinations: AcademyDestination[] = [
  {
    id: "reading-hall",
    title: "Reading Hall",
    subtitle: "Primary literacy",
    description:
      "Develop confident readers through vocabulary, comprehension and thoughtful discussion.",
    href: "/subjects/english",
    x: 22,
    y: 58,
  },
  {
    id: "maths-tower",
    title: "Maths Tower",
    subtitle: "Numeracy and problem solving",
    description:
      "Build mathematical confidence through understanding, reasoning and carefully sequenced practice.",
    href: "/subjects/mathematics",
    x: 40,
    y: 28,
  },
  {
    id: "science-observatory",
    title: "Science Observatory",
    subtitle: "Curiosity and discovery",
    description:
      "Explore the scientific world through investigation, explanation and evidence-based thinking.",
    href: "/subjects/science",
    x: 70,
    y: 28,
  },
  {
    id: "writing-studio",
    title: "Writing Studio",
    subtitle: "Expression and communication",
    description:
      "Develop clear, persuasive and imaginative writing for school and beyond.",
    href: "/subjects/english",
    x: 81,
    y: 51,
  },
  {
    id: "hsc-academy",
    title: "HSC Academy",
    subtitle: "Senior excellence",
    description:
      "Focused subject preparation, exam strategy and guidance for Years 11 and 12.",
    href: "/hsc-excellence",
    x: 57,
    y: 75,
  },
  {
    id: "discovery-garden",
    title: "Discovery Garden",
    subtitle: "Confidence and curiosity",
    description:
      "A place representing personal growth, curiosity and learning beyond marks alone.",
    href: "/our-approach",
    x: 75,
    y: 72,
  },
];

type AcademyMapProps = {
  mapImage?: string;
};

export function AcademyMap({
  mapImage = "/images/homepage/academy-map.png",
}: AcademyMapProps) {
  const [activeId, setActiveId] = useState(destinations[0].id);

  const activeDestination =
    destinations.find((destination) => destination.id === activeId) ??
    destinations[0];

  return (
    <section
      id="academy-map"
      className="academy-map da-section da-section--navy da-screen-section"
      aria-labelledby="academy-map-heading"
    >
      <div className="academy-map__dust" aria-hidden="true" />

      <div className="da-container academy-map__inner">
        <header className="academy-map__header">
          <div>
            <p className="da-chapter da-chapter--light">
              Chapter VI · Explore Our Academy
            </p>

            <h2 id="academy-map-heading">
              Every room.
              <span> Every subject.</span>
              <br />
              Every adventure.
            </h2>
          </div>

          <p>
            Explore DA through an illustrated academy. Each destination
            represents a real learning pathway, program or part of our
            educational philosophy.
          </p>
        </header>

        <div className="academy-map__layout">
          <div className="academy-map__canvas">
            <img
              className="academy-map__image"
              src={mapImage}
              alt="Illustrated DA academy campus with interactive subject destinations"
              width="2000"
              height="1050"
              loading="lazy"
            />

            <div className="academy-map__wash" aria-hidden="true" />

            {destinations.map((destination) => {
              const isActive = destination.id === activeId;

              return (
                <button
                  key={destination.id}
                  type="button"
                  className={`academy-map__marker${
                    isActive ? " academy-map__marker--active" : ""
                  }`}
                  style={{
                    left: `${destination.x}%`,
                    top: `${destination.y}%`,
                  }}
                  aria-pressed={isActive}
                  aria-label={`Show ${destination.title}`}
                  onClick={() => setActiveId(destination.id)}
                  onMouseEnter={() => setActiveId(destination.id)}
                  onFocus={() => setActiveId(destination.id)}
                >
                  <span className="academy-map__marker-dot" />
                  <span className="academy-map__marker-label">
                    {destination.title}
                  </span>
                </button>
              );
            })}

            <div className="academy-map__compass" aria-hidden="true">
              <img
                src="/images/homepage/gold-compass-symbol.png"
                alt=""
                width="220"
                height="220"
                loading="lazy"
              />
            </div>
          </div>

          <aside className="academy-map__information" aria-live="polite">
            <p className="academy-map__information-label">
              Currently exploring
            </p>

            <h3>{activeDestination.title}</h3>

            <span className="academy-map__subtitle">
              {activeDestination.subtitle}
            </span>

            <div className="da-divider">
              <span className="da-divider__star" aria-hidden="true">
                ✦
              </span>
            </div>

            <p>{activeDestination.description}</p>

            <a
              className="da-button da-button--gold"
              href={activeDestination.href}
            >
              Enter this chapter
              <span className="da-button__arrow" aria-hidden="true">
                →
              </span>
            </a>

            <small>
              Select another location on the map to continue exploring.
            </small>
          </aside>
        </div>

        <nav
          className="academy-map__mobile-navigation"
          aria-label="Academy destinations"
        >
          {destinations.map((destination) => {
            const isActive = destination.id === activeId;

            return (
              <button
                key={destination.id}
                type="button"
                className={
                  isActive
                    ? "academy-map__mobile-button academy-map__mobile-button--active"
                    : "academy-map__mobile-button"
                }
                aria-pressed={isActive}
                onClick={() => setActiveId(destination.id)}
              >
                {destination.title}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
