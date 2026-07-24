import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Link } from "react-router-dom";
import { siteStats } from "@/data/site-stats";
import "./ImpactStatistics.css";

type Statistic = {
  value: number;
  suffix: string;
  decimals?: number;
  title: string;
  description: string;
  icon: string;
};

function splitStatValue(value: string | number) {
  const text = String(value);
  const numericValue = Number(text.replace(/[^\d.]/g, ""));
  const suffix = text.replace(/[\d,.\s]/g, "");

  return {
    value: Number.isFinite(numericValue) ? numericValue : 0,
    suffix,
  };
}

const yearsExperience = splitStatValue(siteStats.yearsExperience);
const studentsHelped = splitStatValue(siteStats.studentsHelped);
const googleRating = splitStatValue(siteStats.googleRating);
const educatorCount = splitStatValue(siteStats.educatorCount);

const statistics: Statistic[] = [
  {
    value: yearsExperience.value,
    suffix: yearsExperience.suffix,
    title: "Years of Guidance",
    description:
      "Two decades supporting students and families through every stage of learning.",
    icon: "⌛",
  },
  {
    value: studentsHelped.value,
    suffix: studentsHelped.suffix,
    title: "Students Supported",
    description:
      "Thousands of students guided toward stronger skills, confidence and results.",
    icon: "✦",
  },
  {
    value: googleRating.value,
    suffix: "★",
    decimals: 1,
    title: "Trusted by Families",
    description:
      "A five-star reputation built through meaningful relationships and lasting progress.",
    icon: "★",
  },
  {
    value: siteStats.reviewCount,
    suffix: "+",
    title: "Five-Star Stories",
    description:
      "Real experiences shared by families who have seen their children grow.",
    icon: "❝",
  },
  {
    value: educatorCount.value,
    suffix: educatorCount.suffix,
    title: "Passionate Educators",
    description:
      "Teachers across subjects and year levels, carefully matched to each student.",
    icon: "♜",
  },
];

function useCountUp(target: number, duration = 1600, decimals = 0) {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    let animationFrame = 0;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted) return;

        setHasStarted(true);

        if (reducedMotion) {
          setValue(target);
          observer.disconnect();
          return;
        }

        const start = performance.now();

        const animate = (time: number) => {
          const progress = Math.min((time - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);

          setValue(target * eased);

          if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
          }
        };

        animationFrame = requestAnimationFrame(animate);
        observer.disconnect();
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [target, duration, decimals, hasStarted]);

  return {
    ref,
    formatted:
      decimals > 0
        ? value.toFixed(decimals)
        : Math.round(value).toLocaleString("en-AU"),
  };
}

function StatisticItem({
  statistic,
  index,
}: {
  statistic: Statistic;
  index: number;
}) {
  const { ref, formatted } = useCountUp(
    statistic.value,
    1500 + index * 140,
    statistic.decimals ?? 0,
  );

  return (
    <article
      ref={ref}
      className="impact-statistic"
      style={
        {
          "--stat-index": index,
        } as CSSProperties
      }
    >
      <span className="impact-statistic__icon" aria-hidden="true">
        {statistic.icon}
      </span>

      <div className="impact-statistic__value">
        {formatted}
        <span>{statistic.suffix}</span>
      </div>

      <h3>{statistic.title}</h3>

      <p>{statistic.description}</p>
    </article>
  );
}

export function ImpactStatistics() {
  return (
    <section
      className="impact-section da-section da-section--navy da-screen-section"
      aria-labelledby="impact-heading"
    >
      <div className="impact-section__dust" aria-hidden="true" />
      <div className="impact-section__constellation" aria-hidden="true" />

      <div className="da-container impact-section__inner">
        <header className="impact-section__header">
          <div>
            <p className="da-chapter da-chapter--light">
              Chapter II · Our Impact
            </p>

            <h2 id="impact-heading">
              Guiding thousands.
              <span> Inspiring futures.</span>
            </h2>
          </div>

          <p>
            The numbers tell only part of the story. Behind every one is a
            student who became more confident, more capable and more hopeful
            about what comes next.
          </p>
        </header>

        <div className="impact-section__path" aria-hidden="true">
          <svg
            viewBox="0 0 1200 160"
            preserveAspectRatio="none"
            role="presentation"
          >
            <path
              d="M10,95 C165,5 265,150 410,80 C545,15 610,145 760,85 C900,26 1010,138 1190,55"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        <div className="impact-section__grid">
          {statistics.map((statistic, index) => (
            <StatisticItem
              key={statistic.title}
              statistic={statistic}
              index={index}
            />
          ))}
        </div>

        <footer className="impact-section__footer">
          <span>Trusted by local families since {siteStats.tuitionSince}</span>

          <Link to="/success-stories">
            Explore Our Stories
            <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </div>
    </section>
  );
}
