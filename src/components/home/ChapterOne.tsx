import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  FocusEvent,
  KeyboardEvent,
} from "react";
import styles from "./ChapterOne.module.css";

const ROTATION_DURATION = 5000;
const PHILOSOPHY_MEMORY_IMAGE = "/images/philosophy-memory-oval.png?v=20260727-oval";

type Philosophy = {
  id: string;
  number: string;
  title: string;
  lead: string;
  body: string;
  image: string;
  preferredImage: string;
  imageAlt: string;
};

const philosophies: Philosophy[] = [
  {
    id: "known",
    number: "01",
    title: "Known",
    lead: "Students deserve to be known before they are judged.",
    body: "Every student arrives with a different story. We take the time to understand where they are—because the gap between their starting point and their potential is exactly where real growth lives.",
    image: PHILOSOPHY_MEMORY_IMAGE,
    preferredImage: "/images/philosophy-known.png",
    imageAlt: "DA Tuition educators sharing a supportive learning moment over an open book",
  },
  {
    id: "belief",
    number: "02",
    title: "Belief",
    lead: "Confidence often comes before achievement.",
    body: "We have seen it hundreds of times: the moment a student believes they can, the results follow. Building that belief is not a side effect of our teaching—it is the purpose of it.",
    image: PHILOSOPHY_MEMORY_IMAGE,
    preferredImage: "/images/philosophy-belief.png",
    imageAlt: "DA Tuition educators sharing a supportive learning moment over an open book",
  },
  {
    id: "understanding",
    number: "03",
    title: "Understanding",
    lead: "Understanding matters more than memorisation.",
    body: "Real mastery is knowing why something works, not just that it does. We teach students to think deeply, so knowledge becomes theirs permanently—not just until the exam.",
    image: PHILOSOPHY_MEMORY_IMAGE,
    preferredImage: "/images/philosophy-understanding.png",
    imageAlt: "DA Tuition educators sharing a supportive learning moment over an open book",
  },
  {
    id: "growth",
    number: "04",
    title: "Growth",
    lead: "We strengthen the child behind the result.",
    body: "Marks improve when students feel capable, seen and guided. Our goal is not to chase grades—it is to build the resilience, curiosity and self-belief that make sustained excellence possible.",
    image: PHILOSOPHY_MEMORY_IMAGE,
    preferredImage: "/images/philosophy-growth.png",
    imageAlt: "DA Tuition educators sharing a supportive learning moment over an open book",
  },
];

export function ChapterOne() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const selectorRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const bookContentRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const activeItem = philosophies[activeIndex];
  const isPaused =
    isHovering || hasFocusWithin || !isVisible || !isTabVisible;

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % philosophies.length);
    }, ROTATION_DURATION);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.28,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsTabVisible(document.visibilityState === "visible");

    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);

  const activePanelId = useMemo(
    () => `chapter-one-${activeItem.id}-panel`,
    [activeItem.id],
  );

  const selectPhilosophy = (index: number) => {
    setActiveIndex(index);
  };

  const handleSelectorKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const lastIndex = philosophies.length - 1;
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = index === 0 ? lastIndex : index - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    } else {
      return;
    }

    event.preventDefault();
    selectPhilosophy(nextIndex);
    selectorRefs.current[nextIndex]?.focus();
  };

  const handleBookBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (
      event.currentTarget.contains(event.relatedTarget as Node | null)
    ) {
      return;
    }

    setHasFocusWithin(false);
  };

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className={styles.philosophySection}
      aria-labelledby="chapter-one-title"
    >
      <div className={styles.bookStage}>
        <div className={styles.bookWrapper}>
          <img
            src="/images/homepage/book-page-chapter.png"
            alt=""
            className={styles.bookImage}
            aria-hidden="true"
            data-book-asset="book-page-chapter.png"
          />

          <div
            ref={bookContentRef}
            className={styles.bookContent}
            data-paused={isPaused ? "true" : "false"}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onFocus={() => setHasFocusWithin(true)}
            onBlur={handleBookBlur}
          >
            <div className={styles.leftPage}>
              <div className={styles.chapterIntro}>
                <span className={styles.chapterLabel}>Chapter I</span>
                <h2 id="chapter-one-title" className={styles.chapterTitle}>
                  Our Philosophy
                </h2>
              </div>

              <div className={styles.photoStage}>
                <AnimatePresence mode="wait">
                  <motion.figure
                    key={activeItem.id}
                    className={styles.activePhoto}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, x: -8, y: 4 }
                    }
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, x: 8, y: -4 }
                    }
                    transition={{
                      duration: prefersReducedMotion ? 0.22 : 0.72,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <PhilosophyImage
                      item={activeItem}
                      loading={activeIndex === 0 ? "eager" : "lazy"}
                    />
                  </motion.figure>
                </AnimatePresence>
              </div>
            </div>

            <div className={styles.rightPage}>
              <div
                className={styles.philosophySelectors}
                role="tablist"
                aria-label="Our philosophy"
              >
                {philosophies.map((philosophy, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={philosophy.id}
                      ref={(node) => {
                        selectorRefs.current[index] = node;
                      }}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-pressed={isActive}
                      aria-controls={activePanelId}
                      id={`chapter-one-${philosophy.id}-tab`}
                      tabIndex={isActive ? 0 : -1}
                      className={styles.philosophySelector}
                      data-active={isActive ? "true" : "false"}
                      onClick={() => selectPhilosophy(index)}
                      onKeyDown={(event) =>
                        handleSelectorKeyDown(event, index)
                      }
                    >
                      <span className={styles.selectorNumber}>
                        {philosophy.number}
                      </span>
                      <span className={styles.selectorTitle}>
                        {philosophy.title}
                      </span>
                      {isActive ? (
                        <span
                          key={philosophy.id}
                          className={styles.selectorProgress}
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className={styles.revealArea}>
                <div
                  key={`sweep-${activeItem.id}`}
                  className={styles.transitionSweep}
                  aria-hidden="true"
                />
                <AnimatePresence mode="wait">
                  <motion.article
                    key={activeItem.id}
                    id={activePanelId}
                    role="tabpanel"
                    aria-labelledby={`chapter-one-${activeItem.id}-tab`}
                    className={styles.activePhilosophy}
                    aria-live="polite"
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -6 }
                    }
                    transition={{
                      duration: prefersReducedMotion ? 0.22 : 0.76,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span className={styles.activeNumber}>
                      {activeItem.number}
                    </span>
                    <h3 className={styles.activeTitle}>
                      {activeItem.title}
                    </h3>
                    <p className={styles.activeLead}>{activeItem.lead}</p>
                    <div className={styles.activeDivider} aria-hidden="true" />
                    <motion.p
                      className={styles.activeDescription}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 8 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: prefersReducedMotion ? 0 : 0.12,
                        duration: prefersReducedMotion ? 0.22 : 0.62,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {activeItem.body}
                    </motion.p>
                  </motion.article>
                </AnimatePresence>
                <div
                  key={`dust-${activeItem.id}`}
                  className={styles.transitionDust}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhilosophyImage({
  item,
  loading,
}: {
  item: Philosophy;
  loading: "eager" | "lazy";
}) {
  const [shouldUseFallback, setShouldUseFallback] = useState(false);

  useEffect(() => {
    setShouldUseFallback(false);
  }, [item.id]);

  return (
    <img
      src={shouldUseFallback ? item.image : item.preferredImage}
      alt={item.imageAlt}
      loading={loading}
      onError={() => setShouldUseFallback(true)}
    />
  );
}

export default ChapterOne;
