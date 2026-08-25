type TeachingPathSegmentProps = {
  index: number;
};

const CrayonStroke = ({ d }: { d: string }) => (
  <>
    <path className="primary-story-connector__understroke" d={d} pathLength="1" />
    <path className="primary-story-connector__stroke" d={d} pathLength="1" />
  </>
);

const PaperPlane = () => (
  <g className="primary-story-connector__plane">
    <path d="M1 9 27 1 18 25 12 14Z" />
    <path d="m12 14 15-13M12 14l6 11" />
  </g>
);

export const CurriculumToAquariumConnector = () => (
  <div
    className="primary-story-connector primary-story-connector--curriculum"
    data-story-connector="curriculum-to-aquarium"
    aria-hidden="true"
  >
    <svg viewBox="0 0 260 150" role="presentation">
      <CrayonStroke d="M8 32 C58 4 86 78 132 60 S196 56 226 112" />
      <g transform="translate(218 102) rotate(28)"><PaperPlane /></g>
      <circle cx="231" cy="126" r="4" />
      <circle cx="244" cy="138" r="2.5" />
    </svg>
  </div>
);

export const AquariumExitConnector = () => (
  <div
    className="primary-story-connector primary-aquarium__exit"
    data-story-connector="aquarium-exit"
    aria-hidden="true"
  >
    <svg viewBox="0 0 260 130" role="presentation">
      <CrayonStroke d="M20 92 C76 40 126 116 218 44" />
      <g className="primary-aquarium__exit-fish" transform="translate(185 30)">
        <path d="M0 18 C13 2 38 2 52 18 C38 35 13 34 0 18Z" />
        <path d="m2 18-17-12v24Z" />
        <circle cx="40" cy="14" r="2" />
      </g>
      <circle className="primary-aquarium__exit-bubble" cx="93" cy="50" r="6" />
      <circle className="primary-aquarium__exit-bubble" cx="122" cy="34" r="3.5" />
      <circle className="primary-aquarium__exit-bubble" cx="150" cy="19" r="2.5" />
    </svg>
  </div>
);

export const TeachingPathSegment = ({ index }: TeachingPathSegmentProps) => (
  <div
    className={`primary-reference-teaching__segment primary-reference-teaching__segment--${index + 1}`}
    data-teaching-segment={index + 1}
    aria-hidden="true"
  >
    <svg className="primary-reference-teaching__segment-row" viewBox="0 0 180 80" preserveAspectRatio="none" role="presentation">
      <CrayonStroke d="M4 48 C44 8 112 73 176 28" />
      <g transform="translate(148 18) rotate(-10)"><PaperPlane /></g>
    </svg>
    <svg className="primary-reference-teaching__segment-turn" viewBox="0 0 360 150" preserveAspectRatio="none" role="presentation">
      <CrayonStroke d="M338 18 C338 118 80 18 20 130" />
      <g transform="translate(14 112) rotate(112)"><PaperPlane /></g>
    </svg>
    <svg className="primary-reference-teaching__segment-column" viewBox="0 0 80 180" preserveAspectRatio="none" role="presentation">
      <CrayonStroke d="M38 4 C8 50 70 118 38 176" />
      <g transform="translate(22 148) rotate(78)"><PaperPlane /></g>
    </svg>
  </div>
);

export const GrowthBridgeConnector = () => (
  <div
    className="primary-story-connector primary-story-connector--growth"
    data-story-connector="aquarium-to-growth"
    aria-hidden="true"
  >
    <svg viewBox="0 0 1000 140" preserveAspectRatio="none" role="presentation">
      <circle cx="28" cy="26" r="5" />
      <circle cx="50" cy="44" r="3" />
      <circle cx="70" cy="60" r="2" />
      <CrayonStroke d="M76 64 C244 142 402 2 594 78 S824 132 958 56" />
      <g transform="translate(930 44) rotate(-8)"><PaperPlane /></g>
    </svg>
  </div>
);
