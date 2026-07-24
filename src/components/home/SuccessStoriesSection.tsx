import { useMemo, useState } from "react";
import "./SuccessStoriesSection.css";

type SuccessStoryCategory =
  | "All"
  | "HSC"
  | "Mathematics"
  | "English"
  | "Confidence"
  | "Academic Growth";

export type SuccessStory = {
  id: string;
  studentName: string;
  studentDetails: string;
  category: Exclude<SuccessStoryCategory, "All">;
  secondaryCategory?: Exclude<SuccessStoryCategory, "All">;
  image?: string;
  imageAlt?: string;
  eyebrow: string;
  transformationBefore: string;
  transformationAfter: string;
  quote: string;
  href?: string;
};

const categories: SuccessStoryCategory[] = [
  "All",
  "HSC",
  "Mathematics",
  "English",
  "Confidence",
  "Academic Growth",
];

type SuccessStoriesSectionProps = {
  stories: SuccessStory[];
  allStoriesHref?: string;
  onReadStory?: (story: SuccessStory) => void;
};

export function SuccessStoriesSection({
  stories,
  allStoriesHref = "/success-stories",
  onReadStory,
}: SuccessStoriesSectionProps) {
  const [activeCategory, setActiveCategory] =
    useState<SuccessStoryCategory>("All");

  const visibleCategories = useMemo(() => {
    const available = new Set<SuccessStoryCategory>(["All"]);

    stories.forEach((story) => {
      available.add(story.category);
      if (story.secondaryCategory) {
        available.add(story.secondaryCategory);
      }
    });

    return categories.filter((category) => available.has(category));
  }, [stories]);

  const filteredStories = useMemo(() => {
    if (activeCategory === "All") {
      return stories;
    }

    return stories.filter(
      (story) =>
        story.category === activeCategory ||
        story.secondaryCategory === activeCategory,
    );
  }, [activeCategory, stories]);

  const visibleStories = filteredStories.slice(0, 5);

  return (
    <section
      id="success-stories"
      className="success-stories da-section da-section--parchment da-screen-section"
      aria-labelledby="success-stories-heading"
    >
      <div className="da-paper-grain" aria-hidden="true" />

      <div className="da-container success-stories__inner">
        <header className="success-stories__header">
          <div>
            <p className="da-chapter">Chapter VII · Real Stories</p>

            <h2 id="success-stories-heading" className="da-heading">
              Real stories.
              <span className="da-accent"> Real transformations.</span>
            </h2>
          </div>

          <div className="success-stories__introduction">
            <p>
              Behind every result is a student who worked through uncertainty,
              developed stronger habits and discovered what they were capable of
              achieving.
            </p>

            <a href={allStoriesHref}>
              Explore all stories
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </header>

        <div
          className="success-stories__filters"
          aria-label="Filter success stories"
        >
          {visibleCategories.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                className={
                  isActive
                    ? "success-stories__filter success-stories__filter--active"
                    : "success-stories__filter"
                }
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="success-stories__grid">
          {visibleStories.map((story) => (
            <article key={story.id} className="success-story-card">
              <div className="success-story-card__identity">
                {story.image ? (
                  <img
                    src={story.image}
                    alt={story.imageAlt ?? ""}
                    width="96"
                    height="96"
                    loading="lazy"
                  />
                ) : (
                  <span
                    className="success-story-card__initial"
                    aria-hidden="true"
                  >
                    {story.studentName.charAt(0)}
                  </span>
                )}

                <div>
                  <h3>{story.studentName}</h3>
                  <p>{story.studentDetails}</p>
                </div>
              </div>

              <span className="success-story-card__eyebrow">
                {story.eyebrow}
              </span>

              <div
                className="success-story-card__transformation"
                aria-label={`${story.transformationBefore} to ${story.transformationAfter}`}
              >
                <span>{story.transformationBefore}</span>

                <i aria-hidden="true">→</i>

                <strong>{story.transformationAfter}</strong>
              </div>

              <blockquote>“{story.quote}”</blockquote>

              {story.href ? (
                <a href={story.href} className="success-story-card__read">
                  Read full story
                  <span aria-hidden="true">→</span>
                </a>
              ) : onReadStory ? (
                <button
                  type="button"
                  className="success-story-card__read"
                  onClick={() => onReadStory(story)}
                >
                  Read Full Story
                  <span aria-hidden="true">→</span>
                </button>
              ) : null}

              <div className="success-story-card__quill" aria-hidden="true">
                ✦
              </div>
            </article>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <p className="success-stories__empty">
            More stories in this category are coming soon.
          </p>
        )}

        <footer className="success-stories__footer">
          <a href={allStoriesHref} className="da-button da-button--primary">
            Discover More Student Stories
            <span className="da-button__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </footer>
      </div>
    </section>
  );
}
