import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";

const impactStats = [
  {
    id: "years",
    value: "20+",
    endValue: 20,
    suffix: "+",
    label: "YEARS",
    description: "of educational excellence",
    position: "left-[39%] top-[4%]",
  },
  {
    id: "students",
    value: "650+",
    endValue: 650,
    suffix: "+",
    label: "STUDENTS",
    description: "empowered every year",
    position: "right-[8%] top-[4%]",
  },
  {
    id: "educators",
    value: "43",
    endValue: 43,
    label: "PASSIONATE",
    description: "Educators",
    position: "left-[10%] top-[42%]",
  },
  {
    id: "rating",
    value: "450+",
    endValue: 450,
    suffix: "+",
    label: "FIVE-STAR STORIES",
    description: "Google Reviews",
    position: "right-[8%] top-[42%]",
  },
];

type ImpactStat = (typeof impactStats)[number];

const particles = [
  "left-[50%] top-[28%] delay-0",
  "left-[62%] top-[25%] delay-300",
  "left-[72%] top-[33%] delay-700",
  "left-[83%] top-[45%] delay-1000",
  "left-[61%] top-[64%] delay-500",
  "left-[74%] top-[70%] delay-150",
  "left-[88%] top-[61%] delay-1000",
  "left-[52%] top-[48%] delay-700",
  "left-[68%] top-[51%] delay-300",
  "left-[79%] top-[26%] delay-500",
];

export function ChapterTwoImpact() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="impact"
      className="relative isolate overflow-hidden bg-[#071C3B] pt-0 text-[#fff8e8]"
      aria-labelledby="chapter-two-impact-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_18%,rgba(226,178,75,0.18),transparent_34%),linear-gradient(180deg,rgba(7,28,59,1),rgba(4,14,32,1))]" />

      <div className="mx-auto flex w-full justify-center overflow-visible">
        <div className="relative -mt-3 w-[min(95vw,1700px)] aspect-[1536/1024] overflow-visible">
          <img
            src="/images/homepage/chapter-2-book.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 block h-full w-full select-none object-contain"
            draggable={false}
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-[49%] top-[22%] z-[1] h-[46%] w-[42%] rounded-[45%] bg-[radial-gradient(ellipse_at_center,rgba(246,207,111,0.18),rgba(246,207,111,0.08)_34%,transparent_70%)] blur-sm"
            animate={
              reducedMotion
                ? undefined
                : {
                    y: [-4, 5, -4],
                    opacity: [0.62, 0.92, 0.62],
                  }
            }
            transition={{
              duration: 7.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <motion.span
                key={item}
                className="absolute h-[0.55%] w-[0.55%] rounded-full bg-[#f7d881] shadow-[0_0_18px_rgba(247,216,129,0.65)]"
                style={{
                  left: `${58 + item * 4.5}%`,
                  top: `${35 + (item % 3) * 7}%`,
                }}
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        opacity: [0.25, 0.95, 0.25],
                        scale: [0.8, 1.25, 0.8],
                      }
                }
                transition={{
                  duration: 2.8 + item * 0.18,
                  repeat: Infinity,
                  delay: item * 0.24,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
            {particles.map((particle, index) => (
              <motion.span
                key={particle}
                className={`absolute h-1 w-1 rounded-full bg-[#f2c65a] opacity-0 shadow-[0_0_10px_rgba(242,198,90,0.55)] ${particle}`}
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        opacity: [0, 0.56, 0],
                        y: [16, -34],
                        x: index % 2 === 0 ? [0, 10] : [0, -9],
                      }
                }
                transition={{
                  duration: 5.6 + index * 0.32,
                  repeat: Infinity,
                  delay: index * 0.18,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="absolute left-[8.6%] top-[17.6%] z-[3] w-[33%] text-[#F7F1E5]">
            <motion.p
              className="mb-[clamp(8px,1.05cqw,16px)] font-[var(--font-heading)] text-[clamp(12px,0.92cqw,17px)] font-black uppercase leading-none tracking-[0.17em] text-[#af791d] [text-shadow:0_0_0.45px_currentColor]"
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              Chapter II
            </motion.p>

            <motion.h2
              id="chapter-two-impact-heading"
              className="m-0 max-w-[500px] font-['Cormorant_Garamond',Georgia,serif] text-[clamp(64px,6vw,90px)] font-medium leading-[0.9] tracking-[-0.025em] text-[#F7F1E5]"
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.82, delay: 0.08, ease: "easeOut" }}
            >
              Our Impact
            </motion.h2>

            <motion.p
              className="mt-7 max-w-[500px] font-['Cormorant_Garamond',Georgia,serif] text-[clamp(34px,3vw,52px)] font-normal italic leading-[1.02] tracking-[-0.015em] text-[#D8B05B]"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.74, delay: 0.18, ease: "easeOut" }}
            >
              Guiding thousands.
              <br />
              Inspiring futures.
            </motion.p>

          </div>

          <motion.p
            className="absolute left-[68%] top-[14%] z-[3] w-[23%] max-w-[390px] font-['EB_Garamond',Georgia,serif] text-[clamp(14px,1.1vw,19px)] leading-[1.65] text-[rgba(247,241,229,0.9)]"
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.74, delay: 0.28, ease: "easeOut" }}
          >
            The numbers tell only part of the story. Behind every one is a
            student who became more confident, more capable and more hopeful
            about what comes next.
          </motion.p>

          <div
            className="absolute inset-0 z-[4] hidden lg:block"
            aria-label="DA Tuition impact statistics"
          >
            {impactStats.map((stat, index) => (
              <StatMark
                key={stat.id}
                stat={stat}
                index={index}
                reducedMotion={reducedMotion}
                className={`absolute ${stat.position} w-[clamp(150px,11.8vw,210px)]`}
              />
            ))}
          </div>

          <div
            className="absolute inset-x-[10%] bottom-[4%] z-[4] grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:hidden"
            aria-label="DA Tuition impact statistics"
          >
            {impactStats.map((stat, index) => (
              <StatMark
                key={stat.id}
                stat={stat}
                index={index}
                reducedMotion={reducedMotion}
                className="w-[min(72vw,230px)]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatMark({
  stat,
  index,
  reducedMotion,
  className,
}: {
  stat: ImpactStat;
  index: number;
  reducedMotion: boolean | null;
  className: string;
}) {
  const statRef = useRef<HTMLElement | null>(null);
  const replayKey = useReplayOnEnter(statRef);
  const count = useMotionValue(reducedMotion ? stat.endValue : 0);
  const displayValue = useTransform(count, (latest) =>
    formatStatValue(latest, stat),
  );

  useEffect(() => {
    if (reducedMotion) {
      count.set(stat.endValue);
      return;
    }

    count.set(0);

    const controls = animate(count, stat.endValue, {
      duration: 1.8,
      ease: [0.215, 0.61, 0.355, 1],
    });

    return () => controls.stop();
  }, [count, reducedMotion, replayKey, stat.endValue]);

  return (
    <motion.article
      ref={statRef}
      className={`${className} group text-center text-[#fff8e8]`}
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              scale: 1.03,
            }
      }
      viewport={{ once: false, amount: 0.45 }}
      transition={{
        duration: 0.72,
        delay: 0.18 + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span
        className="mx-auto mb-3 block h-1.5 w-1.5 rounded-full bg-[#E8C36A] shadow-[0_0_12px_rgba(232,195,106,0.45)] transition duration-300 group-hover:shadow-[0_0_22px_rgba(232,195,106,0.78)]"
        aria-hidden="true"
      />
      <div className="mb-3 flex items-center justify-center gap-3 text-[#E8C36A]" aria-hidden="true">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#E8C36A]/60" />
        <span className="text-[0.7rem] leading-none">✦</span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#E8C36A]/60" />
      </div>
      <div className="relative z-[1] flex flex-col items-center justify-center text-center">
        <motion.strong className="block whitespace-nowrap font-['Playfair_Display',Georgia,serif] text-[clamp(56px,6vw,72px)] font-bold leading-none text-[#E8C36A] transition duration-300 group-hover:text-[#F4D07A] group-hover:[text-shadow:0_0_18px_rgba(232,195,106,0.42)]">
          {displayValue}
        </motion.strong>
        <span className="mt-3 block max-w-full font-['Cinzel',serif] text-[15px] font-semibold uppercase leading-[1.25] tracking-[0.25em] text-[#F6EFD8]">
          {stat.label}
        </span>
        <span className="mt-3 block max-w-[13ch] font-['Cormorant_Garamond',Georgia,serif] text-[24px] font-normal leading-[1.5] text-[rgba(255,245,220,0.92)]">
          {stat.description}
        </span>
      </div>
    </motion.article>
  );
}

function useReplayOnEnter(ref: RefObject<Element>) {
  const [replayKey, setReplayKey] = useState(0);
  const wasInView = useRef(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasInView.current) {
          wasInView.current = true;
          setReplayKey((key) => key + 1);
        }

        if (!entry.isIntersecting) {
          wasInView.current = false;
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return replayKey;
}

function formatStatValue(value: number, stat: ImpactStat) {
  const formatted = Math.round(value).toLocaleString("en-AU");

  return `${formatted}${stat.suffix ?? ""}`;
}
