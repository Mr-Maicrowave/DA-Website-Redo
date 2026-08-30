import type {
  AcademicLevelAnswer,
  ConfidenceAnswer,
  GoalsAnswer,
  LearningHabitsAnswer,
  MotivationAnswer,
} from "./assessmentTypes";
import type {
  DirectionDefinition,
  DirectionId,
  EnvironmentDefinition,
  EnvironmentId,
  RecommendationCombination,
} from "./recommendationTypes";

export const SECONDARY_ENVIRONMENT_MAX_GAP = 2;

export const ENVIRONMENT_TIE_PRIORITY: readonly EnvironmentId[] = [
  "small-group",
  "private",
  "class",
];

export const DIRECTION_TIE_PRIORITY: readonly DirectionId[] = [
  "core",
  "foundation",
  "accelerated",
];

export const environmentConfig: Record<EnvironmentId, EnvironmentDefinition> = {
  private: {
    id: "private",
    label: "Private Learning",
    shortLabel: "Private",
    tagline: "Focused attention. A pace shaped around them.",
    description:
      "A one-to-one environment that gives the tutor room to respond closely to the student's pace, questions and current understanding.",
    illustration: "/learning-journey/results/private-learning-1536w.webp",
    illustrationAlt:
      "A tutor and one student working together at a warmly lit study desk",
    strengths: ["Individual pacing", "Close guidance", "Targeted support"],
    reasons: [
      "One-to-one attention creates more room to notice hesitation and respond immediately.",
      "The pace can adjust closely around current understanding.",
      "Regular reassurance can be built naturally into the lesson.",
      "Individual guidance can focus on the areas that need the most attention.",
    ],
    colorAccent: "#a97818",
    practicalCharacteristics: [
      {
        label: "ONE STUDENT",
        description: "All attention is focused on their learning.",
      },
      {
        label: "ONE TUTOR",
        description: "A consistent guide can get to know how they learn.",
      },
      {
        label: "THEIR PACE",
        description: "Learning can move faster or slower where appropriate.",
      },
      {
        label: "TARGETED FEEDBACK",
        description: "Questions, misconceptions and next steps can be addressed directly.",
      },
    ],
  },
  "small-group": {
    id: "small-group",
    label: "Small Group Learning",
    shortLabel: "Small Group",
    tagline: "A little more attention. A lot more room to grow.",
    description:
      "A focused peer environment balancing tutor guidance, participation, adaptable pacing and the momentum of learning alongside others.",
    illustration: "/learning-journey/results/small-group-learning-1536w.webp",
    illustrationAlt:
      "A tutor guiding a small group of students around a welcoming shared table",
    strengths: ["Tutor check-ins", "Peer momentum", "Safer participation"],
    reasons: [
      "The tutor has more opportunities to notice hesitation and check understanding.",
      "A smaller peer setting can make participation feel more approachable.",
      "Students keep the benefits of discussion while receiving closer guidance.",
      "The pace has more room to adapt without removing collaborative learning.",
    ],
    colorAccent: "#b7892e",
    practicalCharacteristics: [
      {
        label: "FOCUSED GROUP",
        description: "Students can learn together without getting lost in a crowd.",
      },
      {
        label: "TUTOR GUIDANCE",
        description: "Students still receive direct questioning and feedback.",
      },
      {
        label: "ADAPTIVE PACE",
        description: "There is more room to respond to the group's understanding.",
      },
      {
        label: "ACTIVE PARTICIPATION",
        description: "A smaller setting makes it easier to involve each student naturally.",
      },
    ],
  },
  class: {
    id: "class",
    label: "Class Environment",
    shortLabel: "Class",
    tagline: "Shared momentum. Structured challenge.",
    description:
      "A structured shared learning environment with discussion, consistent lesson momentum and opportunities to learn alongside a broader peer group.",
    illustration: "/learning-journey/results/class-environment-1536w.webp",
    illustrationAlt:
      "A tutor teaching students in an open, orderly classroom",
    strengths: ["Shared pace", "Discussion", "Independent momentum"],
    reasons: [
      "A shared pace can suit students who are comfortable working independently.",
      "Discussion and peer approaches can add energy to learning.",
      "A structured environment can support consistent academic momentum.",
      "Greater independence creates room for productive challenge.",
    ],
    colorAccent: "#756c91",
    practicalCharacteristics: [
      {
        label: "SHARED STRUCTURE",
        description: "Lessons move through a clear sequence at an appropriate group pace.",
      },
      {
        label: "DISCUSSION",
        description: "Students can hear questions and approaches from a wider peer group.",
      },
      {
        label: "REGULAR MOMENTUM",
        description: "Consistent lessons support continued curriculum progress.",
      },
      {
        label: "INDEPENDENT PRACTICE",
        description: "Students have room to apply ideas with increasing independence.",
      },
    ],
  },
};

export const directionConfig: Record<DirectionId, DirectionDefinition> = {
  foundation: {
    id: "foundation",
    label: "Foundation Focus",
    shortLabel: "Foundation",
    tagline: "Strengthen what comes next by securing what comes first.",
    description:
      "A direction that consolidates important understanding while rebuilding confidence and readiness for future learning.",
    illustration: "/learning-journey/objects/books-and-daisy.webp",
    strengths: ["Consolidation", "Confidence", "Essential understanding"],
    reasons: ["Important gaps may benefit from careful consolidation."],
    colorAccent: "#a97818",
  },
  core: {
    id: "core",
    label: "Core Progression",
    shortLabel: "Core",
    tagline: "Steady progress with the right structure around it.",
    description:
      "A balanced direction that supports consistent curriculum progress, understanding and accountability.",
    illustration: "/learning-journey/objects/open-book.webp",
    strengths: ["Consistency", "Curriculum progress", "Accountability"],
    reasons: ["A balanced structure may support continued steady progress."],
    colorAccent: "#9a7a32",
  },
  accelerated: {
    id: "accelerated",
    label: "Accelerated Pathway",
    shortLabel: "Accelerated",
    tagline: "Greater challenge for curiosity ready to travel further.",
    description:
      "A direction that introduces deeper challenge, extension and opportunities to progress beyond expected material.",
    illustration: "/learning-journey/objects/signpost.webp",
    strengths: ["Extension", "Greater challenge", "Deeper thinking"],
    reasons: ["Their answers indicate an appetite for greater academic challenge."],
    colorAccent: "#82759a",
  },
};

const combinationSummaries = {
  "private:foundation":
    "Individual attention and flexible pacing while important foundations are rebuilt with care.",
  "private:core":
    "Individual attention and pacing while maintaining steady progress through the appropriate curriculum.",
  "private:accelerated":
    "Individual pacing that creates room for deeper challenge and extension beyond the expected level.",
  "small-group:foundation":
    "A closer learning environment where foundations can be strengthened without removing the benefits of learning alongside peers.",
  "small-group:core":
    "Regular tutor attention, peer momentum and an adaptable pace supporting consistent progress.",
  "small-group:accelerated":
    "A focused peer environment that combines greater challenge with discussion, feedback and shared momentum.",
  "class:foundation":
    "A structured shared environment paired with deliberate consolidation and appropriate tutor guidance.",
  "class:core":
    "A structured, energetic learning environment supporting steady progress at an appropriate shared pace.",
  "class:accelerated":
    "A more independent, energetic learning environment paired with greater academic challenge and extension.",
} as const;

export const combinationCopy = Object.fromEntries(
  Object.entries(combinationSummaries).map(([key, summary]) => {
    const [environment, direction] = key.split(":") as [
      EnvironmentId,
      DirectionId,
    ];
    return [key, { environment, direction, summary }];
  }),
) as Record<`${EnvironmentId}:${DirectionId}`, RecommendationCombination>;

export const assessmentTopicLabels = {
  academicLevel: "ACADEMIC LEVEL",
  confidence: "CONFIDENCE",
  learningHabits: "LEARNING HABITS",
  motivation: "WHEN IT GETS HARD",
  goals: "LOOKING AHEAD",
} as const;

export const answerObservations: {
  academicLevel: Record<AcademicLevelAnswer, string>;
  confidence: Record<ConfidenceAnswer, string>;
  learningHabits: Record<LearningHabitsAnswer, string>;
  motivation: Record<MotivationAnswer, string>;
  goals: Record<GoalsAnswer, string>;
} = {
  academicLevel: {
    rebuilding: "Rebuilding important foundations",
    "year-level": "Working around year level",
    "above-level": "Ready for greater academic challenge",
  },
  confidence: {
    quiet: "May hesitate to speak up",
    encouraged: "Benefits from encouragement",
    confident: "Participates with confidence",
  },
  learningHabits: {
    guided: "Benefits from regular guidance",
    "check-in": "Works well with check-ins",
    independent: "Usually works independently",
  },
  motivation: {
    "needs-encouragement": "Benefits from reassurance when work gets hard",
    persistent: "Usually keeps trying",
    "challenge-seeking": "Responds positively to challenge",
  },
  goals: {
    "confidence-foundations": "Build greater confidence",
    "steady-progress": "Maintain steady progress",
    extension: "Stretch beyond year level",
  },
};
