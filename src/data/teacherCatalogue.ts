export interface CatalogueTutor {
  id: string;
  tier: 'senior' | 'mid' | 'junior';
  primarySubject: 'english' | 'math' | 'science' | 'both';
  name: string;
  designation: string;
  tagline: string;
  motto: string;
  photo: string;       // filename without path, e.g. "linda"
  posY: string;        // object-position Y for browse card
  posX?: string;       // object-position X (default '50%')
  scale?: number;      // zoom scale (default 1)
  subjects: string;    // raw subjects string from Ha's data
  hasPrimary: boolean;
  profile?: {
    tags: string[];
    whyDA: string;
    goals: string;
    remembered: string;
  };
}

export const TUTORS: CatalogueTutor[] = [
  // ── SENIOR ──
  {
    id: 'T003', tier: 'senior', primarySubject: 'english',
    name: 'Mrs Jenny N.', designation: 'The Excellence Standard',
    tagline: "She doesn't teach to the test. She teaches to last.",
    motto: 'Every child deserves to know what excellent work feels like.',
    photo: 'jenny', posX: '51.5%', posY: '14%',
    subjects: 'Primary (English & Mathematics) / English (Yr 7–10) / English Standard / English Advanced',
    hasPrimary: true,
    profile: {
      tags: ['English specialist', '10+ years experience', 'Primary school manager'],
      whyDA: `I started as a part-time tutor at DA Tuition while I was studying my double degree of business and law at university. Even after being admitted as a lawyer in 2016, it was difficult to suppress my true passion for teaching and working with children, which inspired me to pursue a Master's in Teaching at Macquarie University, where I was honoured with the Highest Achiever Award in Secondary English Teaching and co-authored a chapter on teaching EAL/D students. Being part of DA has continually challenged me to reflect on and improve my teaching, fuelling my passion for learning and self-improvement. I particularly love my role as the primary school manager, as it's deeply rewarding to watch students' progress from developing a strong foundation in primary school into confident high school learners. I've had the privilege of mentoring students from Year 4 to Year 12; getting to know them as individuals allows me to tailor my teaching to their unique challenges, both academic and personal. I'm proud to have had hundreds of students who have topped their grade across a variety of high schools.`,
      goals: `My legal background gave me a deep appreciation of the power of words, while my Master's in Teaching equipped me with strategies to make English clear, structured and accessible. With over ten years of experience, I've developed a strong understanding of what teachers look for in student writing, and I hope to share that clarity with my students. I want to help students not only improve their skills to top their grade, but also appreciate the subject.`,
      remembered: `I want to be remembered as a teacher who gave students the skills to excel in English while helping them see the power of words and the beauty of language. I hope they remember growing more confident in expressing themselves and finding English less frustrating and more enjoyable.`,
    },
  },
  {
    id: 'T011', tier: 'senior', primarySubject: 'math',
    name: 'Mr A. King', designation: 'The Possible Proof',
    tagline: 'Stern, precise and patient, the method always works.',
    motto: "A student's potential deserves more than encouragement. It deserves structure, discipline, and expert direction.",
    photo: 'king', posX: '56%', posY: '41%', scale: 1.1,
    subjects: 'Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced / Mathematics Extension 1 / Mathematics Extension 2',
    hasPrimary: false,
    profile: {
      tags: ['Warm & safe environment', 'Growth mindset', 'Encourages big dreams'],
      whyDA: `I love working at DA Tuition because it isn't just a place to teach students but a place to help influence and shape the future. The reward of being able to help children shape their future is priceless. DA is a home, a warm and safe environment where children feel safe, a place where they can learn to be a better version of themselves and tap into their undiscovered talents and skills. I'm proud to be part of a warm and caring team who always put the children first.`,
      goals: `Children are the future of tomorrow. I hope to help children see each difficulty as a challenge that will help them grow and make them stronger, expand their views on life, help them dream big and motivate them to work harder to achieve their goals and dreams.`,
      remembered: `I hope to be a supportive and encouraging tutor who helped change lives and helped children open doors, creating a warm and safe environment for students of all levels to learn and thrive, building their knowledge and their belief in themselves.`,
    },
  },
  {
    id: 'T005', tier: 'senior', primarySubject: 'english',
    name: 'Ms Lai H.', designation: 'The Voice Sculptor',
    tagline: "She doesn't just teach English. She makes you fall in love with it.",
    motto: 'When students learn to value accuracy, depth, and pride in their work, marks become a reflection of who they are becoming.',
    photo: 'lai', posX: '56.5%', posY: '0%', scale: 1.05,
    subjects: 'English (Yr 7–10) / English Standard / English Advanced / English Extension 1',
    hasPrimary: false,
    profile: {
      tags: ['English', 'Believes in every student', 'Heart & dedication'],
      whyDA: `I love working at DA because it is a place where I can do something deeply meaningful and impactful for the younger generation. Knowing that I have played a part in shaping them and their future is enormously heart-warming for me and is more fulfilling than any other job. DA is built on values that I deeply resonate with: integrity, compassion and a genuine commitment and love for the kids. I know this because I experienced it first-hand with Miss Amanda as my mentor and guiding light throughout my high school years.`,
      goals: `I hope to help children achieve what they never thought would be possible for them. To see the disbelief and pride on their faces when they surpass their own expectations is truly the best feeling. My goal is to encourage children to see that they can defy any expectation, assumption and self-doubt, and instead discover and strengthen their abilities.`,
      remembered: `I want to be remembered as the teacher with a lot of heart and devotion to her students, willing to go to any lengths to help them achieve their goals. Someone who gave tough love when needed, but they would know it came from a place of genuine love. I hope they remember me as someone who believed in them, never gave up on them and made them feel confident, safe and valued.`,
    },
  },
  {
    id: 'T010', tier: 'senior', primarySubject: 'science',
    name: 'Mr Danny Q.', designation: 'The Believe and Build',
    tagline: 'He makes you laugh, think and remember, all in the same lesson.',
    motto: 'Believe and Achieve!',
    photo: 'danny', posX: '60.5%', posY: '11%',
    subjects: 'Science (Yr 7–10) / English Standard / English Advanced / Chemistry / Biology / Business Studies',
    hasPrimary: false,
    profile: {
      tags: ['Unlocks potential', 'Inspiring mentor', 'Believes in every student'],
      whyDA: `The team behind DA is a special group of people who have decided wholeheartedly to devote their time and effort to bringing out the best in their students, not only through their academic achievements but also through personal growth. There isn't anywhere else quite like DA.`,
      goals: `I believe that hope is a very important thing. In each and every student, regardless of their ability or level, there is a hidden spark lying dormant, a spark of curiosity, passion and resilience that I hope to ignite. It's more than just learning; it's about guiding them in such a way that their potential is unlocked.`,
      remembered: `I want to be remembered not just as a teacher, but as a mentor. A guiding light who left an undeniable mark on my students' journey of growth and self-discovery. I want them to look back and feel that every moment we shared helped shape their confidence, determination and vision for the future.`,
    },
  },
  {
    id: 'T012', tier: 'senior', primarySubject: 'math',
    name: 'Mr Bunsea K.', designation: 'The Precision Machine',
    tagline: "He doesn't give up on students. Not even the ones who've given up on themselves.",
    motto: 'The strongest support is the kind that makes a student more capable, not more dependent.',
    photo: 'bunsea', posX: '54%', posY: '69%', scale: 1.03,
    subjects: 'Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced / Mathematics Extension 1 / Mathematics Extension 2',
    hasPrimary: false,
    profile: {
      tags: ['Maths', 'Confidence-building', 'Patient & understanding'],
      whyDA: `Working at DA Tuition is more than just a job for me; it's a destiny. I love being part of a team that is truly committed to making a difference in students' lives. The loving and caring environment here allows all the tutors to focus on each student's unique needs, and I am proud to contribute to a place where education can be fun and meaningful.`,
      goals: `My goal as a tutor is to help my students realise what they are capable of and unlock their full potential, not just academically but in every aspect of their lives. I want them to be more confident, to believe in their abilities and to approach challenges with a positive mindset.`,
      remembered: `I want my students to remember me as a teacher who genuinely cared about their success, someone who believed in them even when they doubted themselves. I hope they think of me as the tutor who was patient, understanding, and always there to offer encouragement.`,
    },
  },
  {
    id: 'T015', tier: 'senior', primarySubject: 'math',
    name: 'Ms Linda L.', designation: 'The Mindset Shifter',
    tagline: 'Every lesson has a heartbeat. She makes sure students feel it.',
    motto: 'I believe students rise when expectations are high enough to stretch them and support is strong enough to carry them.',
    photo: 'linda', posX: '50%', posY: '2.5%', scale: 1.11,
    subjects: 'Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced',
    hasPrimary: false,
    profile: {
      tags: ['Confidence & positive mindset', 'Kind & empathetic', 'Resilience'],
      whyDA: `I always remember the days when I was a little girl and my parents couldn't afford to send me to tutoring like all my other friends. When I finally started, I met my tutor, more like my guardian angel. She was always very patient and understanding. She believed in me more than I believed in myself. Miss Amanda never once asked me for anything in return for her kindness and generosity. I owe all my success to her. I've grown roots at DA; working here allows me to help kids who could be going through struggles like I was.`,
      goals: `When I teach, I approach every lesson with purpose and heart. Beyond helping my students achieve better grades, my deepest hope is to inspire confidence and nurture a positive mindset within them. I want each student to believe in themselves, to truly understand that with determination, effort and resilience, they can accomplish anything they set their minds to.`,
      remembered: `I aspire to be the teacher who leaves a lasting imprint on my students' lives: the one who made them feel valued and seen, who extended kindness during their toughest moments, and who taught them lessons that extend far beyond the classroom. I want to be the teacher who equips them with the confidence to face their fears and the inspiration to embrace learning with joy and curiosity.`,
    },
  },
  // ── MID ──
  {
    id: 'T001', tier: 'mid', primarySubject: 'english',
    name: 'Ms Kassandra B.', designation: 'The Student Whisperer',
    tagline: 'She makes English feel like something worth fighting for.',
    motto: 'I believe students improve faster when they know their tutor is paying attention to who they are, not just what they score.',
    photo: 'kassandra', posX: '54.5%', posY: '0%', scale: 1.07,
    subjects: 'English (Yr 7–10) / English Standard / English Advanced',
    hasPrimary: false,
    profile: {
      tags: ['Builds genuine rapport', 'Sparks creativity', 'Passionate mentor'],
      whyDA: `Being part of this amazing team at DA gives me the opportunity to be surrounded by other like-minded individuals, striving to make a difference in the younger generations. I have an undeniable passion for teaching, and I absolutely love seeing our students evolve and grow throughout their journey to Year 12.`,
      goals: `I hope to help children develop a passion for learning. By creating fun and interactive lesson plans that engage with the syllabus, I'm able to change the perception of learning, so that each child always leaves the classroom having learnt something new.`,
      remembered: `A dedicated, passionate and caring teacher.`,
    },
  },
  {
    id: 'T002', tier: 'mid', primarySubject: 'math',
    name: 'Ms Helen A.', designation: 'The Evidence-Based Coach',
    tagline: 'Her energy is contagious, and so is her belief in you.',
    motto: 'The aim is not to protect students from challenge, but to teach them how to stand inside it without falling apart.',
    photo: 'helen', posX: '53.5%', posY: '43.5%',
    subjects: 'Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced',
    hasPrimary: false,
    profile: {
      tags: ['Resilience & confidence', 'Lifelong learners', 'Tailored teaching'],
      whyDA: `I am proud to be part of DA Tuition as I get the opportunity to work and learn with a diverse team. DA Tuition provides a reliable and safe space for students to learn at their best. I love being a teacher who is straightforward and dedicated, and I am most proud when I see my students improve.`,
      goals: `I hope to help students achieve their potential. I want my students to be lifelong learners, able to apply their skills to problem-solve outside the classroom. For me, there is nothing better than a student being confident in their ability and having a strong mentality where mistakes do not bring them down.`,
      remembered: `I want my students to remember me as a teacher who made an impact on them. Whether it is their education, future or mentality, I would be grateful for my students to remember me for a positive reason! I value providing a safe and comfortable space for my students to make mistakes and learn from them.`,
    },
  },
  {
    id: 'T009', tier: 'mid', primarySubject: 'math',
    name: 'Mr Jacob D.', designation: 'The Safe-to-Fail Zone',
    tagline: 'High standards, clear strategy, he gets students to where they want to be.',
    motto: 'True growth begins where students feel safe to make mistakes.',
    photo: 'jacob', posX: '50%', posY: '1.5%', scale: 1.03,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced',
    hasPrimary: true,
    profile: {
      tags: ['Maths', 'High expectations', 'Supportive mentor'],
      whyDA: `DA has always been one big family where everyone looks out for each other, takes care of one another, and encourages each of us to continually strive for improvement and become the best version of ourselves.`,
      goals: `As a teacher, I hope to equip my students with the academic skills they need to excel in any test they face. My goal is for them to become the top students they're capable of being, and to grow into highly ambitious, motivated individuals.`,
      remembered: `I can be a strict teacher with high expectations, constantly pushing students to recall and execute concepts. At the same time, I can be soft and nurturing, always willing to sacrifice my time or adapt to the needs of my students.`,
    },
  },
  {
    id: 'T004', tier: 'mid', primarySubject: 'math',
    name: 'Ms Huyen L.', designation: 'The Gap Finder',
    tagline: 'She sees the student first, the syllabus second.',
    motto: 'I help students move from remembering the answer to understanding the idea.',
    photo: 'huyen', posX: '50%', posY: '25.5%', scale: 1.06,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced / Mathematics Extension 1',
    hasPrimary: true,
    profile: {
      tags: ['Personalised learning plans', 'Curiosity & resilience', 'Holistic support'],
      whyDA: `Working at DA Tuition is rewarding because it aligns with my passion for education and helping students unlock their full potential. One of the things I love most is the personalised approach we take with every student.`,
      goals: `As a tutor, my greatest hope is to help children develop the confidence and skills they need to become lifelong learners. I want them to see challenges as opportunities for growth and to build a genuine passion for learning.`,
      remembered: `I want my students to remember me as a tutor who believed in their potential and encouraged them to push beyond their limits. I hope to be remembered as someone who made learning engaging, fun and meaningful.`,
    },
  },
  {
    id: 'T006', tier: 'mid', primarySubject: 'both',
    name: 'Ms Christina H.', designation: 'The Space to Climb',
    tagline: '"I can\'t do it" becomes "watch me" — in maths, English and everything in between.',
    motto: 'Patience is not lowering the bar. It is giving students the space to climb properly.',
    photo: 'christina h', posX: '50%', posY: '30%', scale: 1.07,
    subjects: 'Primary (English & Mathematics) / English (Yr 7–10) / Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced',
    hasPrimary: true,
    profile: {
      tags: ['Primary, maths & English', 'Confidence that lasts', 'Celebrates every win'],
      whyDA: `Teaching at DA has never felt like a job to me; it's a passion that has come full circle. I'm proud to be part of a family of tutors who genuinely care, where curiosity and creativity matter just as much as marks.`,
      goals: `I want every child to feel genuinely excited to learn, treating curiosity as their compass and challenges as stepping stones rather than roadblocks. My goal reaches far beyond better marks; I want to spark a love of learning that lasts a lifetime.`,
      remembered: `I hope to be remembered as the teacher whose classroom felt alive, where learning was genuinely fun and every child felt seen.`,
    },
  },
  {
    id: 'T007', tier: 'mid', primarySubject: 'english',
    name: 'Ms Christina L.', designation: 'The Deliberate Developer',
    tagline: "Failure isn't the opposite of success here, it's the beginning of it.",
    motto: 'Failure is SUCCESS in progress.',
    photo: 'christina l', posX: '53.5%', posY: '0%', scale: 1.2,
    subjects: 'English (Yr 7–10) / English Standard / English Advanced / English Extension 1 / Legal Studies',
    hasPrimary: false,
    profile: {
      tags: ['English', 'Resilience & confidence', 'Lifelong mentor'],
      whyDA: `Ever since I was first asked, "What do you want to be when you grow up?" I knew my dream was to make a difference in people's lives. Now, every day the sun rises and sets on the lives I have changed as a tutor. As a former DA student, I am beyond proud to be standing beside the most dedicated and inspiring team of tutors.`,
      goals: `I have always believed that "failure is success in progress," and I hope to highlight that setbacks are the stepping stones towards growth, not only academically but personally too. I want to be the person who believes in them first and empowers them to unlock their full potential.`,
      remembered: `I want students to remember me not just as a tutor who taught them how to write a TEEL paragraph, but as a confidant and lifelong mentor. Someone who has walked a mile in their shoes and can empathise with their journey.`,
    },
  },
  {
    id: 'T008', tier: 'mid', primarySubject: 'math',
    name: 'Mr Phillip H.', designation: 'The Logic Cartographer',
    tagline: 'Firm when you need a push. Nurturing when you need a hand.',
    motto: 'A student becomes independent when they can explain not only what they did, but why it works.',
    photo: 'phillip', posX: '56.5%', posY: '49%', scale: 1.08,
    subjects: 'Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced / Mathematics Extension 1',
    hasPrimary: false,
    profile: {
      tags: ['Maths', 'Drive & determination', 'Mentor for life'],
      whyDA: `Working at DA is an experience like no other because it never really feels like work. Every time I walk through the front doors I'm always looking forward to the ways I can pass on my knowledge and help students.`,
      goals: `My goal as a tutor is to help children develop their own sense of drive and determination. Not just for answering problems in a test, but for all the challenges and obstacles they'll face later in life.`,
      remembered: `I want my students to remember me as someone who was a teacher when they wanted it, but a mentor when they needed it. A teacher they would be excited to see every week.`,
    },
  },
  {
    id: 'T013', tier: 'mid', primarySubject: 'math',
    name: 'Ms Autumn P.', designation: 'The Momentum Builder',
    tagline: "She builds the kind of maths confidence that doesn't fade after the exam.",
    motto: 'A setback should become information, not identity.',
    photo: 'autumn', posX: '55.5%', posY: '16%', scale: 1.06,
    subjects: 'Mathematics (Yr 7–10) / Mathematics Advanced / Mathematics Extension 1 / Mathematics Extension 2',
    hasPrimary: false,
    profile: {
      tags: ['Maths', '5th in state, Maths Ext 1', 'High school & primary'],
      whyDA: `I am proud to be part of DA Tuition as it provides an exceptional platform to inspire and guide students across various stages of their educational journey.`,
      goals: `I aim to create a learning atmosphere that empowers students to reach their full potential, both academically and personally. Through my own experience of achieving 5th in the state for Maths Extension 1, I understand the importance of perseverance and a growth mindset.`,
      remembered: `I aspire to be remembered as a teacher who not only believed in each student's ability but also gave them the tools and encouragement to thrive.`,
    },
  },
  {
    id: 'T014', tier: 'mid', primarySubject: 'english',
    name: 'Ms Kathleen G.', designation: 'The Quiet Architect',
    tagline: 'Calm, prepared and always on your side, English finally feels manageable.',
    motto: 'I teach students to value preparation, honesty, and resilience because these qualities outlast every exam.',
    photo: 'kathleen', posX: '50%', posY: '18%', scale: 1.1,
    subjects: 'Primary (English & Mathematics) / English (Yr 7–10) / English Standard / English Advanced',
    hasPrimary: true,
    profile: {
      tags: ['Holistic development', 'Critical thinking', 'Emotional intelligence'],
      whyDA: `Being a member of the DA Tuition team gives me the remarkable opportunity to positively influence children's lives on a daily basis, making it more than simply a job.`,
      goals: `My mission at DA Tuition is to encourage students to grow into self-assured, inquisitive learners who are ready to take on new challenges. I aim to enrich a potent understanding of critical thinking and emotional intelligence.`,
      remembered: `I want my students to remember me as someone who helped them grow not only as students but as individuals, and paid attention to their needs.`,
    },
  },
  {
    id: 'T016', tier: 'mid', primarySubject: 'science',
    name: 'Ms Leyna N.', designation: 'The Thoughtful Shaper',
    tagline: "She finds the strengths students didn't know they had, and builds from there.",
    motto: "Every student has a strength they haven't noticed yet. I build their learning on top of it.",
    photo: 'leyna', posX: '57%', posY: '0%', scale: 1.05,
    subjects: 'Mathematics (Yr 7–10) / English (Yr 7–10) / English Standard / English Advanced / Biology',
    hasPrimary: false,
    profile: {
      tags: ['Wellbeing & academics', 'Growth mindset', 'Builds confidence'],
      whyDA: `To be part of the incredible team at DA Tuition is beyond a privilege. From being able to support students, not only through their academics but also their wellbeing, to contributing to a welcoming and safe learning environment.`,
      goals: `I hope to help students bring out their best potential by recognising their flaws, working on them together as a team, and further nurturing their strengths.`,
      remembered: `I aspire to be remembered as a tutor who is dedicated to inspiring excellence by manifesting growth alongside creating an uplifting learning space.`,
    },
  },
  {
    id: 'T017', tier: 'mid', primarySubject: 'both',
    name: 'Ms Tina L.', designation: 'The Strong Start',
    tagline: 'She holds students to high standards, because she knows they can reach them.',
    motto: 'High standards are a kindness. Children rise to what we truly believe they can do.',
    photo: 'tina', posX: '53%', posY: '30.5%', scale: 1.12,
    subjects: 'Primary (English & Mathematics)',
    hasPrimary: true,
    profile: {
      tags: ['10+ years at DA', 'Love of learning', 'Caring & committed'],
      whyDA: `I have been lucky enough to be at DA Tuition for over 10 years, both as a student and as a teacher. My love and dedication to teaching at DA is seen through my commitment to ensuring my students are both engaged and always striving to improve.`,
      goals: `While having high expectations of all my students, I hope to boost their confidence and stamina when learning, encouraging them to always try their best and to believe in their abilities.`,
      remembered: `I would like my students to remember me as a teacher who is caring, committed and compassionate about their learning, achievement and wellbeing.`,
    },
  },
  {
    id: 'T019', tier: 'mid', primarySubject: 'science',
    name: 'Mr Adem V.', designation: 'The Breakthrough Moment',
    tagline: 'He makes the hardest concepts feel like the best stories.',
    motto: 'When a student starts to understand what once defeated them, their whole attitude begins to change.',
    photo: 'adem', posX: '49.5%', posY: '0%',
    subjects: 'Primary (English & Mathematics) / Chemistry',
    hasPrimary: true,
    profile: {
      tags: ['Mentor & tutor', 'Academic & personal growth', 'Former DA student'],
      whyDA: `I passionately enjoy working at DA because I have an affinity for helping and guiding people on the right path, especially the younger generations. Being at DA allows me to achieve this by engaging with students not only as a tutor who helps them thrive academically, but also as a mentor who can advise them in life.`,
      goals: `Not only do I want to see my students unlock their academic potential and achieve the best marks possible, but I also want to see them grow into great people.`,
      remembered: `The cool tutor with a beard who is always smiling.`,
    },
  },
  {
    id: 'T020', tier: 'mid', primarySubject: 'math',
    name: 'Mr William T.', designation: 'The Standards Beyond Marks',
    tagline: 'He teaches beyond marks, building the mindset that makes success inevitable.',
    motto: 'My goal is not only to help students achieve more, but to help them become someone they are proud to be.',
    photo: 'william', posX: '53%', posY: '32%', scale: 1.14,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10) / Mathematics Standard',
    hasPrimary: true,
    profile: {
      tags: ['Growth mindset', 'Resilience', 'Role model'],
      whyDA: `DA Tuition provides a nurturing environment where students are able to flourish academically and personally. I am proud to be part of a team that values not only the marks on a paper, but also the holistic development of students.`,
      goals: `An individual's intelligence does not determine their success; rather, it's their mindset of growth and resilience. I wish to instil a mentality of viewing challenges as an opportunity for growth as opposed to an obstacle.`,
      remembered: `I would like to be remembered as a role model who's walked further down the path in life. Someone who can offer a new perspective or teach life lessons drawn from my own experiences.`,
    },
  },
  {
    id: 'T021', tier: 'mid', primarySubject: 'both',
    name: 'Ms Amy P.', designation: 'The Progress Revealer',
    tagline: "Bringing out the best in every child, especially the ones who don't believe they have it.",
    motto: 'I teach with high expectations, but never without humanity.',
    photo: 'amy', posX: '50%', posY: '10%', scale: 1.08,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10) / English (Yr 7–10) / English Standard / English Advanced',
    hasPrimary: true,
    profile: {
      tags: ['Engaging environment', 'Strives for excellence', 'Caring & supportive'],
      whyDA: `DA is a remarkable place that has allowed thousands of students to flourish and thrive in their academic studies. Seeing students happy to attend class, enjoying their studies, and growing into the best versions of themselves is something I am proud to be part of.`,
      goals: `My goal is to provide an engaging and dynamic learning environment where students are inspired to strive for excellence with enthusiasm. Ultimately, I want my students to thrive both personally and academically.`,
      remembered: `I aspire for my students to remember me as the kind and supportive teacher who genuinely cares about their wellbeing and success.`,
    },
  },
  {
    id: 'T022', tier: 'mid', primarySubject: 'math',
    name: 'Ms Serina H.', designation: 'The Trust Engineer',
    tagline: 'Every student leaves her session feeling more capable than when they walked in.',
    motto: 'I want students to feel safe enough to be honest and strong enough to improve.',
    photo: 'serina', posX: '50%', posY: '0%',
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10)',
    hasPrimary: true,
    profile: {
      tags: ['Maths', 'Confidence & wellbeing', 'Caring listener'],
      whyDA: `The wonderful environment and the genuine staff are part of the reason I love working at DA Tuition. I am so proud to be part of this team that makes an impact on students' lives, in both their education and shaping them to be the best versions of themselves.`,
      goals: `I hope to help children achieve confidence in their abilities and pursue great results. I want children to be passionate about learning and to be proud of themselves.`,
      remembered: `I want my students to remember me as the teacher who really cared for their studies and wellbeing. I always want to make sure my students are doing well both academically and mentally.`,
    },
  },
  {
    id: 'T023', tier: 'mid', primarySubject: 'math',
    name: 'Mr Daniel P.', designation: 'The Standards Setter',
    tagline: 'Reliable, real and transformative, he goes the extra mile every single time.',
    motto: 'I do not want students to memorise their way through confusion. I want them to understand their way out of it.',
    photo: 'daniel', posX: '50%', posY: '1.5%', scale: 1.04,
    subjects: 'Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced / Mathematics Extension 1 / Mathematics Extension 2',
    hasPrimary: false,
    profile: {
      tags: ['Results-focused', 'Lifelong learning', 'Reliable & approachable'],
      whyDA: `I believe that the DA team has the capabilities to help students improve and achieve results no matter their abilities or talents, and I am pleased to be part of a team that is committed to creating lasting and memorable changes in students.`,
      goals: `I want to help students achieve the results they deserve. Most importantly, I want students to be passionate about learning even after school, understanding that learning doesn't end when school does.`,
      remembered: `I want students to see me as a reliable and pragmatic tutor, someone who is always willing to help and someone who gave them confidence when they were at their lowest point.`,
    },
  },
  // ── JUNIOR ──
  {
    id: 'T024', tier: 'junior', primarySubject: 'english',
    name: 'Ms Michelle N.', designation: 'The Steady Anchor',
    tagline: 'She makes lessons so memorable, the concepts follow students home.',
    motto: 'Students remember the lessons that made them feel capable. I build every class around that feeling.',
    photo: 'michelle', posX: '53%', posY: '24.5%', scale: 1.14,
    subjects: 'Primary (English & Mathematics) / English (Yr 7–10) / English Standard / English Advanced',
    hasPrimary: true,
    profile: {
      tags: ['Confidence-building', 'Memorable lessons', 'Creative & engaging'],
      whyDA: `The atmosphere at DA Tuition is like no other. It's an incredibly warm and friendly environment that could not be matched by any other tutoring centre.`,
      goals: `For every child who begins their journey with me, I strive to grow their confidence in their academic performance.`,
      remembered: `I want students to remember me as the passionate and supportive teacher who truly cares about seeing them excel throughout their school journey.`,
    },
  },
  {
    id: 'T025', tier: 'junior', primarySubject: 'both',
    name: 'Mr Jimmy S.', designation: 'The Method Translator',
    tagline: 'Patient, multi-method and calm, he finds the way that works for you.',
    motto: 'A shallow method may survive one question. Deep understanding survives the unfamiliar.',
    photo: 'jimmy', posX: '53%', posY: '54%',
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10) / English (Yr 7–10) / Mathematics Standard / Mathematics Advanced',
    hasPrimary: true,
    profile: {
      tags: ['Patient & approachable', 'Multiple problem-solving methods', 'Makes learning fun'],
      whyDA: `I've always enjoyed the process of learning new concepts in any subject. When I first joined DA Tuition as a student, I discovered that many of the tutors had a genuine passion for helping students understand school material through a variety of approaches.`,
      goals: `I hope to help children achieve higher accomplishments in their academic journey, but also to enjoy the process. I want to make learning fun and easy to digest.`,
      remembered: `I have been told that I am extremely patient and can encourage learning in a way that makes people feel safe to ask any kind of question.`,
    },
  },
  {
    id: 'T026', tier: 'junior', primarySubject: 'both',
    name: 'Ms Delina N.', designation: 'The Warm Rigour',
    tagline: 'She helps students find their why, then walks beside them all the way.',
    motto: 'I help students move from remembering the answer to understanding the idea.',
    photo: 'delina', posX: '50%', posY: '0%', scale: 1.11,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced / Mathematics Extension 1 / Mathematics Extension 2',
    hasPrimary: true,
    profile: {
      tags: ['Goal-setting & purpose', 'Accountability', 'Builds independence'],
      whyDA: `I'm proud to be part of the team at DA Tuition because of the genuine dedication of our tutors to build strong connections with students. Working at DA Tuition is especially meaningful for me as it allows me to give back to the local community where I grew up.`,
      goals: `I hope to help children discover their sense of purpose in their learning and find their own motivations for wanting to succeed.`,
      remembered: `I want my students to remember me as a teacher who helped pave their own path, one who holds them accountable to their goals while remaining someone they can always rely on.`,
    },
  },
  {
    id: 'T027', tier: 'junior', primarySubject: 'english',
    name: 'Ms Shanzay A.', designation: 'The Clarity Builder',
    tagline: 'She builds confidence first, and watches everything else follow.',
    motto: 'Confidence is not personality. It is the result of knowing what to do when the question becomes hard.',
    photo: 'shanzay', posX: '50%', posY: '41%', scale: 1.1,
    subjects: 'Primary (English & Mathematics) / English (Yr 7–10) / English Standard / English Advanced / English Extension 1',
    hasPrimary: true,
    profile: {
      tags: ['Confidence & self-belief', 'Resilience', 'Approachable & caring'],
      whyDA: `DA is more than just a tutoring centre; it is a community that values growth, care and transformation. What truly sets DA apart is the sense of family it creates.`,
      goals: `I hope to help children achieve a genuine understanding of themselves and confidence in their own abilities, both academically and personally.`,
      remembered: `I would love my students to remember me as a teacher who inspired them to continually strive to achieve their very best in all avenues of their lives.`,
    },
  },
  {
    id: 'T028', tier: 'junior', primarySubject: 'math',
    name: 'Mr Marcus N.', designation: 'The Safe Space Challenger',
    tagline: 'Discipline without sacrifice. Growth without losing yourself.',
    motto: 'The goal is not to make students fearless. It is to make them prepared enough to continue even when fear appears.',
    photo: 'marcus', posX: '50%', posY: '35%', scale: 1.08,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced / Mathematics Extension 1 / Mathematics Extension 2',
    hasPrimary: true,
    profile: {
      tags: ['Builds independence', 'Discipline with care', 'Champions each student'],
      whyDA: `I love working at DA as it allows me to guide the next generation of children into hard-working, curious and independent individuals.`,
      goals: `My aim at DA is to allow students to flourish independently while also pushing them towards the best versions of themselves. I strive to accentuate my students' confidence, effort and perception of themselves.`,
      remembered: `I hope I am remembered by my students as someone who showed them support and care during their worst times, while also accentuating their individual gifts through hard work and discipline.`,
    },
  },
  {
    id: 'T029', tier: 'junior', primarySubject: 'math',
    name: 'Ms Phuong N.', designation: 'The Foundation First',
    tagline: 'Kind, steady and thorough, she builds the foundations students stand on for life.',
    motto: 'I teach students that consistency is not exciting, but it is powerful.',
    photo: 'phuong', posX: '50%', posY: '40%', scale: 1.1,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10)',
    hasPrimary: true,
    profile: {
      tags: ['Strong foundations', 'Exam & test prep', 'Patient & encouraging'],
      whyDA: `Teaching at DA is one of the most rewarding experiences of my life. I love helping students build confidence and find that learning can be joyful.`,
      goals: `I hope to give each student a strong academic foundation and the confidence to tackle any question they face.`,
      remembered: `A patient, caring teacher who always believed in her students.`,
    },
  },
  {
    id: 'T030', tier: 'junior', primarySubject: 'both',
    name: 'Mr Ethan N.', designation: 'The Character Builder',
    tagline: "He's been where you are. That's exactly why he knows how to get you through it.",
    motto: 'Being behind is not a permanent identity. It is a starting point that needs the right plan.',
    photo: 'ethan', posX: '55%', posY: '100%', scale: 1.01,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10) / English (Yr 7–10) / Mathematics Standard / Mathematics Advanced / English Standard / English Advanced',
    hasPrimary: true,
    profile: {
      tags: ['Growth mindset', 'Resilience', 'Role model'],
      whyDA: `I joined DA because I believe in what this team stands for: genuine care for every student, not just their marks.`,
      goals: `I want students to see that where they are now is not where they have to stay. With the right support and mindset, growth is always possible.`,
      remembered: `The tutor who understood what it felt like to struggle, and used that to help students push through.`,
    },
  },
  {
    id: 'T031', tier: 'junior', primarySubject: 'math',
    name: 'Mr George O.', designation: 'The Real Understanding Seeker',
    tagline: 'He always finds a way to explain it, no matter how many tries it takes.',
    motto: 'I believe deep understanding gives students freedom, because they are no longer trapped by memorised examples.',
    photo: 'george', posX: '55%', posY: '0%',
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10)',
    hasPrimary: true,
    profile: {
      tags: ['Maths', 'Patient', 'Deep understanding'],
      whyDA: `DA gives me the chance to make a real difference in students' mathematical understanding, not just their test scores.`,
      goals: `I want every student to understand maths deeply enough that they can tackle problems they've never seen before.`,
      remembered: `The tutor who never gave up explaining until the student truly understood.`,
    },
  },
  {
    id: 'T033', tier: 'junior', primarySubject: 'both',
    name: 'Ms Ngoc P.', designation: 'The Moment-Reader',
    tagline: 'She turns intimidation into enthusiasm, one session at a time.',
    motto: "I watch for the moment a subject stops being scary. Everything we build starts there.",
    photo: 'ngoc', posX: '51%', posY: '24.5%', scale: 1.07,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10)',
    hasPrimary: true,
    profile: {
      tags: ['Engaging', 'Builds confidence', 'Patient'],
      whyDA: `DA is a place where students feel safe to learn, and that's exactly the environment I want to be part of.`,
      goals: `I want students to leave each session feeling a little less scared and a little more capable.`,
      remembered: `A warm, encouraging teacher who made the classroom feel safe.`,
    },
  },
  {
    id: 'T034', tier: 'junior', primarySubject: 'science',
    name: 'Mr Jayden N.', designation: 'The Confidence Reconstructor',
    tagline: "It's not about cramming. It's about having a system that actually works.",
    motto: 'I believe confidence must be earned gently, through clarity, practice, and progress students can actually feel.',
    photo: 'jayden', posX: '50%', posY: '10%', scale: 1.02,
    subjects: 'Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced / Mathematics Extension 1 / Mathematics Extension 2 / Chemistry',
    hasPrimary: false,
    profile: {
      tags: ['Science & maths', 'System-based learning', 'Rebuilds confidence'],
      whyDA: `I'm proud to be part of a team that genuinely cares about students' wellbeing alongside their academic results.`,
      goals: `I want students to leave with a system they can rely on — not just answers, but a method for finding them.`,
      remembered: `The tutor who helped students find their method and believe in it.`,
    },
  },
  {
    id: 'T035', tier: 'junior', primarySubject: 'math',
    name: 'Mr Liam P.', designation: 'The Pattern Detective',
    tagline: "The tutor who's always in your corner, no matter what the last result said.",
    motto: 'I want students to leave each lesson with more control over their own learning than when they arrived.',
    photo: 'liam', posX: '52.5%', posY: '0%', scale: 1.1,
    subjects: 'Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced / Mathematics Extension 1 / Mathematics Extension 2',
    hasPrimary: false,
    profile: {
      tags: ['Maths', 'Builds independence', 'Always supportive'],
      whyDA: `The community at DA is something special. Everyone is working toward the same goal — genuine student growth.`,
      goals: `I want students to understand the patterns in mathematics, so they can solve problems they've never seen before.`,
      remembered: `The tutor who always had your back, whatever the last exam result was.`,
    },
  },
  {
    id: 'T036', tier: 'junior', primarySubject: 'both',
    name: 'Ms Breeanna L.', designation: 'The Love of Learning',
    tagline: "She doesn't just help students improve, she makes them fall in love with growing.",
    motto: 'A child who learns discipline, courage, and reflection has gained something no report card can fully measure.',
    photo: 'breeanna', posX: '50%', posY: '22%', scale: 1.13,
    subjects: 'Primary (English & Mathematics)',
    hasPrimary: true,
    profile: {
      tags: ['Primary focus', 'Love of learning', 'Character development'],
      whyDA: `I love watching young students discover that learning can be joyful. DA gives me the environment to make that happen.`,
      goals: `I want my students to leave primary school loving learning, ready to take on high school with confidence and curiosity.`,
      remembered: `The teacher who made learning something to look forward to.`,
    },
  },
  {
    id: 'T037', tier: 'junior', primarySubject: 'math',
    name: 'Ms Vy Vy N.', designation: 'The Comfortable Challenger',
    tagline: 'Strict but fair, she builds academic results and good character in equal measure.',
    motto: 'Comfort doesn\'t grow a student. The right challenge, met with the right support, does.',
    photo: 'vyvy', posX: '50%', posY: '11%', scale: 1.04,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced',
    hasPrimary: true,
    profile: {
      tags: ['High expectations', 'Character & results', 'Nurturing challenge'],
      whyDA: `DA's commitment to the whole student — not just their marks — is what drew me here and keeps me here.`,
      goals: `I want to push my students in a way that makes them stronger, not more anxious. Growth through challenge, always with support.`,
      remembered: `Strict but fair. The teacher who made them better.`,
    },
  },
  {
    id: 'T038', tier: 'junior', primarySubject: 'both',
    name: 'Ms Shuan L.', designation: 'The Safe Pair of Hands',
    tagline: 'She builds trust first, then she builds the student.',
    motto: 'A tutor should be someone a student can trust with both their mistakes and their ambition.',
    photo: 'shuan', posX: '53%', posY: '20%', scale: 1.15,
    subjects: 'Primary (English & Mathematics)',
    hasPrimary: true,
    profile: {
      tags: ['Trust-building', 'Primary focus', 'Safe & supportive'],
      whyDA: `DA is a place where students feel safe. That safety is the foundation for everything else we do.`,
      goals: `I want to be the tutor a student feels they can be honest with — about what they don't understand and what they dream of achieving.`,
      remembered: `The tutor they could always count on.`,
    },
  },
  {
    id: 'T040', tier: 'junior', primarySubject: 'math',
    name: 'Mr Slevin N.', designation: 'The Thinking Behind the Answer',
    tagline: 'The one who always shows up, no matter what.',
    motto: 'The answer matters, but the thinking behind it matters more.',
    photo: 'slevin', posX: '47%', posY: '20%', scale: 1.09,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10)',
    hasPrimary: true,
    profile: {
      tags: ['Deep thinking', 'Reliable', 'Maths'],
      whyDA: `I believe in the DA approach: that every student can grow when given the right support and held to the right standard.`,
      goals: `I want students to understand why the answer works, not just how to get it.`,
      remembered: `The tutor who was always there, and always made them think.`,
    },
  },
  {
    id: 'T041', tier: 'junior', primarySubject: 'math',
    name: 'Mr Adrian L.', designation: 'The Mark Maximiser',
    tagline: 'He finds the small things that cost big marks, and trains them out.',
    motto: 'A student becomes exceptional when they are taught to care about the small things before they become big mistakes.',
    photo: 'adrian', posX: '60.5%', posY: '1%', scale: 1.1,
    subjects: 'Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced / Mathematics Extension 1 / Mathematics Extension 2',
    hasPrimary: false,
    profile: {
      tags: ['Exam technique', 'Detail-focused', 'Mark maximisation'],
      whyDA: `The detail-oriented culture at DA matches how I teach. We care about the small things because that's where marks are won and lost.`,
      goals: `I want students to walk out of every exam knowing they left nothing on the table.`,
      remembered: `The tutor who showed them the marks hiding in the details.`,
    },
  },
  {
    id: 'T042', tier: 'junior', primarySubject: 'both',
    name: 'Ms Angelina N.', designation: 'The Character Through Learning',
    tagline: 'She pushes every student to go beyond what they thought they could do.',
    motto: 'I teach students that intelligence is valuable, but character decides how well they use it.',
    photo: 'angelina', posX: '52%', posY: '27.5%', scale: 1.2,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10) / English (Yr 7–10) / Mathematics Standard / Mathematics Advanced / English Standard / English Advanced',
    hasPrimary: true,
    profile: {
      tags: ['Character development', 'High expectations', 'Broad subjects'],
      whyDA: `DA cares about who students become, not just what they score. That philosophy is why I love teaching here.`,
      goals: `I want students to leave each lesson having grown not just academically, but as people.`,
      remembered: `The teacher who pushed them to be more than they thought they could be.`,
    },
  },
  {
    id: 'T043', tier: 'junior', primarySubject: 'math',
    name: 'Ms Karen N.', designation: 'The System Builder',
    tagline: 'She turns vague effort into structured, purposeful progress.',
    motto: 'Effort without a system is just hope. I give students the system.',
    photo: 'karen', posX: '50%', posY: '41%', scale: 1.04,
    subjects: 'Primary (English & Mathematics) / Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced / Mathematics Extension 1 / Mathematics Extension 2',
    hasPrimary: true,
    profile: {
      tags: ['Systems & structure', 'Maths', 'Purposeful progress'],
      whyDA: `I believe in structure as an act of care. DA gives me the environment to build that structure with students in a way that feels supportive, not rigid.`,
      goals: `I want students to leave with a clear system for approaching any problem, whether in maths or in life.`,
      remembered: `The teacher who gave them the system that made everything else possible.`,
    },
  },
  {
    id: 'T044', tier: 'junior', primarySubject: 'both',
    name: 'Ms Sophia V.', designation: 'The Foundation Builder',
    tagline: 'She turns shaky basics into solid, confident foundations.',
    motto: 'Confidence grows when students feel safe enough to try.',
    photo: 'sophia', posX: '50%', posY: '16%', scale: 1.1,
    subjects: 'Primary (English & Mathematics)',
    hasPrimary: true,
    profile: {
      tags: ['Primary', 'Builds foundations', 'Safe environment'],
      whyDA: `DA's warmth and genuine care for students is what makes this place special. I'm proud to be part of it.`,
      goals: `I want my students to leave primary school feeling ready — confident in the basics and excited for what's next.`,
      remembered: `The teacher who made the foundations feel solid.`,
    },
  },
  {
    id: 'T045', tier: 'junior', primarySubject: 'english',
    name: 'Ms Sasha F.', designation: 'The Resilience Builder',
    tagline: "Steady, encouraging, and always in your child's corner.",
    motto: 'Capability lies within everyone.',
    photo: 'sasha', posX: '50%', posY: '14%', scale: 1.07,
    subjects: 'Primary (English & Mathematics) / English (Yr 7–10)',
    hasPrimary: true,
    profile: {
      tags: ['Resilience', 'Encouraging', 'English & primary'],
      whyDA: `DA gives every student a chance to find their footing. I want to be the tutor who helps them find it.`,
      goals: `I want to build resilience in my students — the ability to try again, even when it's hard.`,
      remembered: `Steady, kind, and always encouraging.`,
    },
  },
  {
    id: 'T046', tier: 'junior', primarySubject: 'math',
    name: 'Mr Steven D.', designation: 'The Foundation Strengthener',
    tagline: 'He builds the confidence to take on the hardest questions.',
    motto: 'The difference between average and exceptional is often found in the details most students rush past.',
    photo: 'steven', posX: '50%', posY: '18%', scale: 1.04,
    subjects: 'Mathematics (Yr 7–10) / Mathematics Standard / Mathematics Advanced / Mathematics Extension 1 / Mathematics Extension 2',
    hasPrimary: false,
    profile: {
      tags: ['Maths', 'Detail-focused', 'Builds confidence'],
      whyDA: `The culture at DA — of caring about every student as an individual — is what makes teaching here meaningful.`,
      goals: `I want students to be confident tackling even the hardest questions, because they've built the foundations to handle them.`,
      remembered: `The tutor who made the details matter.`,
    },
  },
];

// Featured teachers for the home page (in order)
export const FEATURED_IDS = ['T015', 'T011', 'T010', 'T005', 'T012'];

export function getTutor(id: string): CatalogueTutor | undefined {
  return TUTORS.find(t => t.id === id);
}

export function getPhotoUrl(teacher: CatalogueTutor): string {
  return `/teachers/${encodeURIComponent(teacher.photo)}.png`;
}

export function getPhotoStyle(teacher: CatalogueTutor): React.CSSProperties {
  return {
    objectPosition: `${teacher.posX ?? '50%'} ${teacher.posY}`,
    transform: teacher.scale && teacher.scale !== 1 ? `scale(${teacher.scale})` : undefined,
    transformOrigin: `${teacher.posX ?? '50%'} ${teacher.posY}`,
  };
}

// Subject filter helpers
export function teachesEnglish(t: CatalogueTutor): boolean {
  return /English\s*\(Yr|English\s+(Standard|Advanced|Extension)/i.test(t.subjects);
}
export function teachesMath(t: CatalogueTutor): boolean {
  return /Mathematics\s*\(Yr|Mathematics\s+(Standard|Advanced|Extension)/i.test(t.subjects);
}
export function teachesScience(t: CatalogueTutor): boolean {
  return /chemistry|biology|science\s*\(yr|business/i.test(t.subjects);
}
export function teachesHSC(t: CatalogueTutor): boolean {
  return /Standard|Advanced|Extension|HSC/i.test(t.subjects);
}
