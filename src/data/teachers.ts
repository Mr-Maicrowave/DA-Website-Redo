export interface Badge {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface TeachingStyles {
  structured: number;    // 1-10 scale
  patient: number;       // 1-10 scale
  traditional: number;   // 1-10 scale
  supportive: number;    // 1-10 scale
}

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  qualifications: string[];
  image: string;
  philosophy: string;
  specialties: string[];
  testimonial: string;
  achievements?: string[];
  teachingStyle: string;
  additionalTestimonials?: string[];
  yearLevels?: string[]; // Added for filtering
  teachingAttributes?: string[]; // Added for discovery cards
  badges?: Badge[]; // Added for gamification
  teachingStyles?: TeachingStyles; // Added for spectrum filtering
}

export const teacherData: Teacher[] = [
  {
    id: 1,
    name: "Ms Christina Le",
    subject: "Senior English Advanced, Extension 1, Extension 2",
    qualifications: ["English Advanced", "Extension 1", "Extension 2", "Critical Analysis"],
    image: "/Photos and Videos/Christina - Edited.png",
    philosophy: "Christina combines rigorous analytical standards with genuine approachability. She reduces overwhelm by segmenting complex textual analysis into clear manageable steps and supports students through key transition points.",
    specialties: ["Essay Writing", "Critical Analysis", "Reading Comprehension"],
    testimonial: "Christina gets marked work back faster than anyone I have ever had, and every round of feedback lifts my analysis another level.",
    achievements: ["Rapid marking with detailed feedback", "Rebuilds confidence in uncertain students", "Transforms English anxiety into strength"],
    teachingStyle: "Christina combines rigorous analytical standards with genuine approachability. She reduces overwhelm by segmenting complex textual analysis into clear manageable steps and supports students through key transition points.",
    additionalTestimonials: [
      "She makes complex texts feel organised and manageable, so English stopped being overwhelming and started feeling strategic.",
      "Her comments are honest but encouraging, I always feel pushed and supported at the same time.",
      "Since working with Christina my essays tightened up, my confidence rose and English turned from a worry into a strength."
    ],
    yearLevels: ["Year 11", "Year 12"],
    teachingAttributes: ["Structured", "Analytical", "Supportive"],
    badges: [
      { id: "fast-feedback", icon: "🚀", title: "Quick Feedback", description: "Returns marked work faster than anyone", color: "bg-blue-100 text-blue-800" },
      { id: "hsc-expert", icon: "🎯", title: "HSC Expert", description: "Specializes in senior English excellence", color: "bg-green-100 text-green-800" },
      { id: "top-rated", icon: "⭐", title: "Top Rated", description: "Consistently high student satisfaction", color: "bg-yellow-100 text-yellow-800" }
    ],
    teachingStyles: {
      structured: 9,   // Highly organized, clear steps
      patient: 8,      // Very patient with struggling students
      traditional: 6,  // Mix of traditional and modern approaches
      supportive: 9    // Extremely supportive and encouraging
    }
  },
  {
    id: 2,
    name: "Mr Danny",
    subject: "Mathematics & Chemistry",
    qualifications: ["Advanced Mathematics", "Extension Mathematics", "Chemistry", "Study Skills"],
    image: "/Photos and Videos/Danny - Edited.png",
    philosophy: "Danny dismantles complexity into clear logical steps and builds firm early foundations before layering strategic exam technique. His lessons mix clarity, humour and personalised scaffolding to sustain motivation through demanding senior stages.",
    specialties: ["Mathematics all levels", "Chemistry", "General Study Skills"],
    testimonial: "Danny breaks heavy Maths and Chemistry ideas into simple steps that finally stick.",
    achievements: ["Transforms difficult subjects into strengths", "Creates durable conceptual understanding", "Makes complex math accessible"],
    teachingStyle: "Danny dismantles complexity into clear logical steps. He builds firm early foundations then layers strategic exam technique.",
    additionalTestimonials: [
      "He rebuilt my foundations then showed me how to apply them under exam pressure.",
      "When I hit a wall he rephrases it until the light switches on.",
      "My ranks moved because he kept drilling the basics while still stretching me."
    ],
    yearLevels: ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"],
    teachingAttributes: ["Patient", "Logical", "Humorous"],
    badges: [
      { id: "100-students", icon: "🏆", title: "100+ Students", description: "Taught over 100 students successfully", color: "bg-purple-100 text-purple-800" },
      { id: "problem-solver", icon: "🧠", title: "Problem Solver", description: "Makes complex math concepts simple", color: "bg-blue-100 text-blue-800" },
      { id: "foundation-builder", icon: "🔧", title: "Foundation Builder", description: "Builds strong mathematical foundations", color: "bg-orange-100 text-orange-800" }
    ],
    teachingStyles: {
      structured: 8,   // Methodical, clear logical steps
      patient: 9,      // Extremely patient, never rushes
      traditional: 7,  // Solid traditional foundation with some innovation
      supportive: 8    // Builds strong support systems
    }
  },
  {
    id: 3,
    name: "Miss Lai",
    subject: "English Core & Advanced",
    qualifications: ["English Core", "English Advanced", "Essay Writing", "Exam Strategy"],
    image: "/Photos and Videos/Lai - Edited.png",
    philosophy: "Lai combines high energy delivery with precise diagnostic feedback to isolate strengths and weaknesses early. She targets each gap with actionable steps and maintains momentum through engaging, focused sessions that drive measurable improvements.",
    specialties: ["Essay Writing", "Exam Strategy", "English Core"],
    testimonial: "Lai pinpoints exactly what is costing me marks then gives a direct fix.",
    achievements: ["Drives tangible rank improvements", "Creates sustained motivational momentum", "Connects with restless learners"],
    teachingStyle: "She isolates strengths and weaknesses early and targets each gap with actionable steps before assessments.",
    additionalTestimonials: [
      "Her energy keeps me engaged even when we are grinding through tough essay rewrites.",
      "I saw a clear rank jump after a term of her targeted feedback.",
      "She balances high expectations with real encouragement so I want to push further."
    ],
    yearLevels: ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"],
    teachingAttributes: ["Energetic", "Diagnostic", "Results-focused"],
    badges: [
      { id: "results-driven", icon: "📈", title: "Results Driven", description: "Drives tangible rank improvements", color: "bg-green-100 text-green-800" },
      { id: "energy-boost", icon: "⚡", title: "High Energy", description: "Keeps students engaged and motivated", color: "bg-yellow-100 text-yellow-800" },
      { id: "diagnostic-expert", icon: "🎯", title: "Diagnostic Expert", description: "Pinpoints exactly what costs marks", color: "bg-red-100 text-red-800" }
    ],
    teachingStyles: {
      structured: 7,   // Organized but flexible approach
      patient: 6,      // Energetic, moves at good pace
      traditional: 5,  // Balanced traditional and innovative
      supportive: 8    // High energy support and encouragement
    }
  },
  {
    id: 4,
    name: "Miss Jenny",
    subject: "English Creative & Analytical Writing",
    qualifications: ["English Creative Writing", "Analytical Writing", "Senior English Skills"],
    image: "/Photos and Videos/Jenny - Edited.png",
    philosophy: "Jenny blends warmth with structured iterative feedback to guide students through frequent draft submissions and gradual refinement. She creates a supportive environment where students discover their authentic voice while meeting rigorous academic standards.",
    specialties: ["Creative Writing", "Analytical Writing", "Reading Engagement"],
    testimonial: "Jenny's iterative feedback turned my drafts from wordy to sharp.",
    achievements: ["Makes English students' favourite subject", "Achieves consistently high scoring results", "Helps discover authentic writing voice"],
    teachingStyle: "She encourages frequent draft submission and gradual refinement, guiding students towards higher band sophistication.",
    additionalTestimonials: [
      "She helped me find a clearer voice while still ticking every rubric box.",
      "English shifted from something I avoided to a subject I looked forward to.",
      "Her patient rewrites were a big reason I reached a top band result."
    ],
    yearLevels: ["Year 9", "Year 10", "Year 11", "Year 12"],
    teachingAttributes: ["Warm", "Patient", "Creative"],
    badges: [
      { id: "student-favorite", icon: "💖", title: "Student Favorite", description: "Makes English students' favourite subject", color: "bg-pink-100 text-pink-800" },
      { id: "writing-guru", icon: "✍️", title: "Writing Guru", description: "Transforms drafts from wordy to sharp", color: "bg-indigo-100 text-indigo-800" },
      { id: "voice-finder", icon: "🎭", title: "Voice Finder", description: "Helps students find their authentic voice", color: "bg-purple-100 text-purple-800" }
    ],
    teachingStyles: {
      structured: 6,   // Flexible structure, adapts to student needs
      patient: 9,      // Extremely patient with iterative feedback
      traditional: 4,  // More creative and innovative approaches
      supportive: 10   // Maximum warmth and supportive environment
    }
  },
  {
    id: 5,
    name: "Miss Linda",
    subject: "Early Literacy & Numeracy",
    qualifications: ["Early Literacy", "Numeracy Foundations", "Study Habits"],
    image: "/Photos and Videos/Linda - Edited - Edited.png",
    philosophy: "Linda focuses on securing core skills and study routines that underpin later advanced progress. She delivers patient, structured lessons that build confidence and academic discipline from the early years, creating lasting foundations for future success.",
    specialties: ["Early Literacy", "Numeracy Foundations", "Study Habits"],
    testimonial: "Linda gave me the early literacy structure that everything else now rests on.",
    achievements: ["Builds strong academic foundations", "Provides early primary continuity", "Develops confidence and study discipline"],
    teachingStyle: "She delivers patient structured lessons that build confidence and academic discipline from the early years.",
    additionalTestimonials: [
      "She is patient yet organised, so I built good study habits without feeling pressured.",
      "Those foundation lessons made later senior content far less stressful.",
      "Her steady repetition and encouragement grew my confidence term by term."
    ],
    yearLevels: ["Kindergarten", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"],
    teachingAttributes: ["Patient", "Structured", "Encouraging"],
    badges: [
      { id: "foundation-specialist", icon: "🌱", title: "Foundation Specialist", description: "Builds strong early learning foundations", color: "bg-green-100 text-green-800" },
      { id: "confidence-builder", icon: "🌟", title: "Confidence Builder", description: "Develops confidence and study discipline", color: "bg-yellow-100 text-yellow-800" },
      { id: "early-years", icon: "👶", title: "Early Years Expert", description: "Specialized in K-6 education", color: "bg-blue-100 text-blue-800" }
    ],
    teachingStyles: {
      structured: 9,   // Highly structured for early learners
      patient: 10,     // Maximum patience with young children
      traditional: 8,  // Strong traditional early learning foundation
      supportive: 10   // Extremely nurturing and encouraging
    }
  },
  {
    id: 6,
    name: "Mr King",
    subject: "Mathematics Core to Extension",
    qualifications: ["Mathematics Core", "Mathematics Extension", "Problem Solving", "Logical Reasoning"],
    image: "/Photos and Videos/Abraham - Edited - Edited - Edited - Edited - Edited.png",
    philosophy: "King emphasises incremental mastery and clarity through methodical problem-solving approaches. He diagnoses misunderstandings early, corrects them concisely, then extends students into challenge problems that build resilience and exam adaptability.",
    specialties: ["Problem Solving", "Logical Reasoning", "Mathematics Extension"],
    testimonial: "King has a calm way of unpacking hard Extension questions so they feel logical.",
    achievements: ["Drives senior Maths improvement", "Ensures consistent steady progress", "Builds mathematical resilience and confidence"],
    teachingStyle: "He diagnoses misunderstanding early, corrects concisely, then extends students into challenge problems that build resilience and exam adaptability.",
    additionalTestimonials: [
      "He notices small errors early which saves me later in harder topics.",
      "Session by session my problem solving got cleaner and faster.",
      "His steady approach built real consistency rather than short bursts of luck."
    ],
    yearLevels: ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"],
    teachingAttributes: ["Calm", "Methodical", "Precise"],
    badges: [
      { id: "math-master", icon: "🔢", title: "Math Master", description: "Makes Extension math feel logical", color: "bg-blue-100 text-blue-800" },
      { id: "steady-progress", icon: "📊", title: "Steady Progress", description: "Ensures consistent improvement", color: "bg-green-100 text-green-800" },
      { id: "problem-detective", icon: "🕵️", title: "Problem Detective", description: "Diagnoses errors early to prevent issues", color: "bg-orange-100 text-orange-800" }
    ],
    teachingStyles: {
      structured: 8,   // Methodical problem-solving approach
      patient: 9,      // Calm, never rushes explanations
      traditional: 7,  // Strong traditional math foundations
      supportive: 7    // Quietly supportive, builds confidence
    }
  },
  {
    id: 7,
    name: "Miss Cassandra",
    subject: "English Development",
    qualifications: ["English Development", "Study Confidence", "Literacy Engagement"],
    image: "/images/v3/smiling_teacher.jpg",
    philosophy: "Cassandra prioritises authentic rapport and purposeful academic focus to create an engaging atmosphere where kindness and accountability coexist. She encourages students to invest in steady improvement through caring guidance and clear expectations.",
    specialties: ["Study Confidence", "Literacy Engagement", "English Development"],
    testimonial: "Cassie brings a caring tone that makes it easy to ask questions without feeling judged.",
    achievements: ["Provides caring supportive presence", "Shows passionate commitment to progress", "Enhances student engagement and motivation"],
    teachingStyle: "She creates an engaging atmosphere where kindness and accountability coexist, encouraging students to invest in steady improvement.",
    additionalTestimonials: [
      "She blends kindness with clear academic focus so I stay accountable.",
      "Her lessons keep me engaged and I actually want to improve between sessions.",
      "My confidence picked up because she notices effort and guides the next step instantly."
    ],
    yearLevels: ["Year 7", "Year 8", "Year 9", "Year 10"],
    teachingAttributes: ["Caring", "Engaging", "Motivating"],
    badges: [
      { id: "caring-mentor", icon: "🤗", title: "Caring Mentor", description: "Creates safe space for questions", color: "bg-pink-100 text-pink-800" },
      { id: "engagement-expert", icon: "🎪", title: "Engagement Expert", description: "Keeps lessons engaging and motivating", color: "bg-purple-100 text-purple-800" },
      { id: "confidence-coach", icon: "💪", title: "Confidence Coach", description: "Builds student confidence step by step", color: "bg-yellow-100 text-yellow-800" }
    ],
    teachingStyles: {
      structured: 6,   // Flexible structure to meet student needs
      patient: 10,     // Extremely patient with anxious students
      traditional: 5,  // Modern engaging approaches
      supportive: 10   // Maximum caring and supportive presence
    }
  }
];