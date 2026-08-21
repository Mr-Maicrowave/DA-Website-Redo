import { finaleConfig, type FinaleLayerRegistrar } from "./finaleConfig";
import "./FinaleScene.css";

const streaks = [18, 29, 43, 58, 74, 84];
const years = [
  {
    number: "07",
    label: "YEAR 7",
    verb: "Explore.",
    tone: "blue",
    icon: "/high-school-journey/finale/year-07-paper-plane-ai.png",
  },
  {
    number: "08",
    label: "YEAR 8",
    verb: "Question.",
    tone: "green",
    icon: "/high-school-journey/finale/year-08-magnifying-glass-ai.png",
  },
  {
    number: "09",
    label: "YEAR 9",
    verb: "Discover.",
    tone: "purple",
    icon: "/high-school-journey/finale/year-09-star-ai.png",
  },
  {
    number: "10",
    label: "YEAR 10",
    verb: "Direction.",
    tone: "orange",
    icon: "/high-school-journey/finale/year-10-target-ai.png",
  },
] as const;
const fragments = [
  [42, 21, 10],
  [59, 17, 7],
  [47, 35, 6],
  [55, 41, 11],
  [39, 54, 8],
  [63, 59, 6],
  [45, 72, 12],
  [57, 77, 9],
  [36, 83, 6],
  [66, 31, 8],
];

export function FinaleScene({ register }: { register: FinaleLayerRegistrar }) {
  return (
    <section
      className="hs-finale hs-finale--student-only"
      ref={register("scene") as React.Ref<HTMLElement>}
      aria-label="Beyond Year 10"
    >
      <div className="hs-finale__background" />
      <svg
        className="hs-finale__hero"
        viewBox="0 0 1200 1000"
        ref={register("hero") as React.Ref<SVGSVGElement>}
        role="img"
        aria-label="A DA Tuition student surrounded by a multicolour watercolour burst"
      >
        <defs>
          <clipPath id="hs-finale-reveal">
            <path
              ref={register("reveal-0") as React.Ref<SVGPathElement>}
              d="M600 370c102-83 265-53 329 63 69 124 9 281-107 350-139 83-343 43-410-99-62-131 55-246 188-314Z"
            />
            <path
              ref={register("reveal-1") as React.Ref<SVGPathElement>}
              d="M425 252c78-75 198-111 295-61 80 42 103 149 56 225-64 103-229 130-321 50-65-57-91-154-30-214Z"
            />
            <path
              ref={register("reveal-2") as React.Ref<SVGPathElement>}
              d="M352 603c104-66 264-38 326 73 57 101 18 245-86 297-122 61-301 8-344-115-36-102 17-200 104-255Z"
            />
          </clipPath>
        </defs>
        <g clipPath="url(#hs-finale-reveal)">
          <image
            className="hs-finale__composite"
            ref={register("burst") as React.Ref<SVGImageElement>}
            href={finaleConfig.compositeAsset}
            x="270"
            y="0"
            width="660"
            height="1000"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>
      <header
        className="hs-finale__final-heading"
        ref={register("final-heading") as React.Ref<HTMLElement>}
      >
        <p>YEARS 7–10</p>
        <h3>
          The Four Years
          <br />
          That Change Everything.
        </h3>
      </header>
      <div className="hs-finale__years" aria-label="The Years 7 to 10 journey">
        {[0, 1, 2].map((index) => (
          <img
            key={index}
            className={`hs-finale__year-arrow hs-finale__year-arrow--${index + 1}`}
            ref={register(`year-arrow-${index}`) as React.Ref<HTMLImageElement>}
            src="/high-school-journey/finale/year-journey-arrow-ai.png"
            alt=""
          />
        ))}
        {years.map((year, index) => (
          <article
            key={year.number}
            className={`hs-finale__year hs-finale__year--${index + 1} hs-finale__year--${year.tone}`}
            ref={register(`year-${index}`) as React.Ref<HTMLElement>}
          >
            <img
              className="hs-finale__bubble-image"
              src={`/high-school-journey/finale/year-${year.number}-${year.tone}-bubble-ai.png`}
              alt=""
            />
            <div className="hs-finale__year-copy">
              <strong>{year.number}</strong>
              <span>{year.label}</span>
              <em>{year.verb}</em>
            </div>
            <img className="hs-finale__year-icon" src={year.icon} alt="" />
          </article>
        ))}
      </div>
      {(["left", "right"] as const).map((side) => (
        <svg
          key={side}
          className={`hs-finale__curtain hs-finale__curtain--${side}`}
          viewBox="0 0 700 900"
          preserveAspectRatio="none"
          ref={register(`curtain-${side}`) as React.Ref<SVGSVGElement>}
          aria-hidden="true"
        >
          <image
            href={finaleConfig.orangeWashAsset}
            x={side === "right" ? -170 : 0}
            width="900"
            height="900"
            preserveAspectRatio="xMidYMid slice"
          />
        </svg>
      ))}
      <div className="hs-finale__streaks" aria-hidden="true">
        {streaks.map((y, i) => (
          <svg
            key={i}
            className={`hs-finale__streak hs-finale__streak--${i % 2 ? "right" : "left"}`}
            ref={register(`streak-${i}`) as React.Ref<SVGSVGElement>}
            style={{ top: `${y}%` }}
            viewBox="0 0 500 55"
            preserveAspectRatio="none"
          >
            <path
              d={
                i % 2
                  ? "M4 31C82 5 142 24 223 12s161 16 272-5l-16 29c-97 21-187-9-273 8S74 42 4 50Z"
                  : "M3 13c93 18 142-9 238 4s153-1 254 14l-22 19c-86-9-161 8-244-4S83 55 3 35Z"
              }
            />
          </svg>
        ))}
      </div>
      <div className="hs-finale__fragments" aria-hidden="true">
        {fragments.map(([x, y, s], i) => (
          <span
            key={i}
            ref={register(`fragment-${i}`) as React.Ref<HTMLSpanElement>}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: s,
              height: s * 0.7,
              rotate: `${i % 2 ? i * 9 : -i * 7}deg`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
