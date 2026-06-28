
import { Award, TrendingUp, Star } from 'lucide-react';
import React from 'react';

export interface SuccessStory {
    name: string;
    achievement: string;
    school: string;
    subject: string;
    quote: string;
    appreciation: string;
    advice: string;
    improvement: string;
    reviewId: string;
    iconType: 'award' | 'trending' | 'star';
    /** Where they started, in their own words — used for the before/turning-point/after journey layout */
    before: string;
    /** The pivotal moment they describe, in their own words */
    turningPoint: string;
    /** Where they ended up, in their own words */
    after: string;
    /** Pastel tone (matches the program-page palette) for cards/avatars tied to this story */
    tone: { bg: string; avatarBg: string; avatarText: string };
}

/** Shared 5-tone pastel palette, consistent with the program pages */
export const storyTones = {
    blue: { bg: 'linear-gradient(180deg, #f7fbff, #e8f2ff)', avatarBg: '#e8f2ff', avatarText: '#2563a8' },
    green: { bg: 'linear-gradient(180deg, #fbfff8, #eaf8ef)', avatarBg: '#eaf8ef', avatarText: '#2f8f5b' },
    gold: { bg: 'linear-gradient(180deg, #fffdf7, #fff1cd)', avatarBg: '#fff1cd', avatarText: '#9a7517' },
    purple: { bg: 'linear-gradient(180deg, #fbf8ff, #ede5fb)', avatarBg: '#ede5fb', avatarText: '#6b3fa0' },
    peach: { bg: 'linear-gradient(180deg, #fff9f6, #ffe1d6)', avatarBg: '#ffe1d6', avatarText: '#b5562f' },
};

export const successStories: SuccessStory[] = [
    {
        name: "Katelin Trinh",
        achievement: "Rank 15th to 6th",
        school: "HSC Student",
        subject: "English",
        quote: "Thanks to her, I had a drastic improvement for my assessment rank, moving from 15th to 6th in my final HSC assessment.",
        appreciation: `I am so grateful for DA Tuition for helping me improve my English results and boosting my confidence in the subject. My tutor Ms Jenny has been exceptionally patient, kind, knowledgeable and always willing to go above and beyond for her students to succeed. Her commitment to my learning has played a significant role in my academic journey.

At the beginning of my senior studies I found that English became a challenge and I didn't achieve the results I had hoped for. With her help and encouragement, she motivated me to push myself further.`,
        advice: `Furthermore, I have received band 5-6 across all my English assignments. Beyond academics, Ms Jenny also inspired me to develop a genuine passion and interest in English, which I am truly grateful for. I cannot thank Ms Jenny enough for her dedication and positivity. The staff are incredibly friendly and supportive. The learning environment is excellent and allowed me to feel comfortable asking questions and make mistakes to improve. Highly recommend DA Tuition to anyone looking to excel in their studies.`,
        improvement: "Improved to Band 5-6",
        reviewId: "review-216",
        iconType: "trending",
        before: "Ranked 15th in her year, English had become a challenge in senior studies.",
        turningPoint: "Ms Jenny's patience and encouragement motivated her to push further when results weren't where she hoped.",
        after: "Climbed to 6th in her final HSC assessment, with Band 5–6 across every English assignment.",
        tone: storyTones.blue,
    },
    {
        name: "Emily Nguyen",
        achievement: "2nd Place in Maths",
        school: "HSC Student",
        subject: "Mathematics",
        quote: "My test results are now in the high 90's, plus getting 2nd place in maths in my grade & 100% in my recent test.",
        appreciation: `I've been going to DA tuiton since year 5, and I can't explain how much this place has helped me improve academically throughout the years. My experience here has been great and the tutors here have helped me to continuously improve in school & achieve high marks.

I used to be only an above-average kid, but with the help of Miss Linda and Miss Lai, my test results are now in the high 90's, plus getting 2nd place in maths in my grade & 100% in my recent test.`,
        advice: `My confidence in learning has improved significantly and now I'm determined in achieving above 90% for all my tests. I can't thank DA plus the teachers enough for their expertise and engaging lessons. With these incredible teachers & the great learning environment I'm looking forward to continue my journey here !`,
        improvement: "High 90s Average",
        reviewId: "review-119",
        iconType: "award",
        before: "An \"above-average kid\" since Year 5, with room to grow in maths.",
        turningPoint: "Consistent, patient teaching from Miss Linda and Miss Lai turned steady effort into real momentum.",
        after: "Test results now in the high 90s — 2nd place in maths in her grade, and 100% on her most recent test.",
        tone: storyTones.green,
    },
    {
        name: "Melissa Ly",
        achievement: "Ranked 1st in Trial",
        school: "St Johns Park High School",
        subject: "Mathematics",
        quote: "You know what else I’ve never dreamed of happening ever? Ranking 1st in a 2unit trial exam.",
        appreciation: `I started out my experience with the amazing tutors at DA as a struggling maths student who found it difficult to learn new concepts and had a weak foundation with the basics of high school maths. I entered GAT class with Miss Amanda, this moment was a turning point for me, in my mind it allowed me to see that this was another chance to achieve my goals with every exam that came up.

It was in the two years where I worked my way up, boosting my marks range to 80-100% It was the first time in my whole high school life, where I achieved 100% on a 2unit exam! You know what else I’ve never dreamed of happening ever? Ranking 1st in a 2unit trial exam.`,
        advice: `I’m seriously not trying to boast, but the main point of this is that throughout all my struggles whether they’re academic or personal, Miss Amanda was always there to provide me with help. It’s because of that, that I made achievements that I could be proud of for as long as I live!

Finally a special note to the current and future students of DA, I’d like to say that DA is one of the best tutoring places ever! You’ll never meet anyone as friendly, helpful and as welcoming and intelligent as the tutors at DA.`,
        improvement: "Struggling to 100%",
        reviewId: "review-265",
        iconType: "star",
        before: "A struggling maths student with a weak foundation in the basics of high school maths.",
        turningPoint: "\"I entered GAT class with Miss Amanda — this moment was a turning point for me.\"",
        after: "Marks climbed to the 80–100% range, including her first-ever 100% on a 2-unit exam and 1st place in her trial.",
        tone: storyTones.gold,
    },
    {
        name: "Bryant Lam",
        achievement: "Five Band 6s",
        school: "HSC Student",
        subject: "Mathematics",
        quote: "Through the lessons from DA I was able to achieve five of BAND 6’s in the hsc exam and achieved my desirable ATAR that made my parents proud.",
        appreciation: `Being a student at DA for the last 8 years has been an absolute life changer and I believe it can be for you too. Throughout my entire life, DA has guided and supported me to achieve academic excellence. Initially, it was through the selective program which helped me enter a selective school despite being an “average student” at the time.

The tutors at DA are what has made the tuition such a special place. Despite having confidence issues in my academic abilities, these tutors were able to draw out my best ability and motivate me to strive for success in school. On top of this, they helped and guided me to build strong fundamental skills needed for my education.`,
        advice: `The tuition has also cultivated their students to truly love the subject they are studying. Ms Amanda’s passion for mathematics was infectious and it made me more hungry to be faster and accurate in the subject. Ms Lai always encouraged us to really connect with the texts and peek behind the literary curtains in order to understand their messages on a higher level.

If you’re looking for a place to develop a strong foundation for academics and studying and achieve your maximum potential then DA is the place for you as they make it happen!`,
        improvement: "Desirable ATAR",
        reviewId: "review-051",
        iconType: "trending",
        before: "An \"average student\" with confidence issues in his own academic ability.",
        turningPoint: "Eight years of tutors drawing out his best ability, building strong fundamentals alongside genuine subject confidence.",
        after: "Five Band 6 results in the HSC and the ATAR that made his parents proud.",
        tone: storyTones.purple,
    },
    {
        name: "Joie Lim",
        achievement: "100% in Assessments",
        school: "Year 12 Student",
        subject: "Maths & English",
        quote: "After I joined DA I got 100% in both assessments 2 and 3. And in my math trials I got the highest score which was 97%.",
        appreciation: `I enrolled into DA tuition at the start of 2024 in my second term of year 12. I can confidently say that having a tutor was one of the best academic decisions I’ve ever made! This was made possible by the amazing teachers at DA, who gave me the resources I needed to reach my full potential in high school math and english.

DA also has a ton of resources for maths such as flash cards, past trial papers and HSC questions (sorted by topics) and trial classes in preparation for assessments, trials and hsc. Providing me with the necessary practice with non-routine questions to build confidence in exams.`,
        advice: `With all of these resources and Mr. Bunsea's immense help I was able achieve truly incredible feats that I could never have imagined. After I joined DA I got 100% in both assessments 2 and 3. And in my math trials I got the highest score which was 97%. My rank had gone from a 13 in semester 1 to ranking 1st overall in my school’s maths standard course at the end of year 12.

Overall DA has given me the best chance of success in high school. With the incredible teachers and positive learning environment I was able to reach unimaginable heights.`,
        improvement: "Rank 13 to 1st",
        reviewId: "review-195",
        iconType: "award",
        before: "Ranked 13th in her year-12 maths course at the start of second term, looking for a turning point.",
        turningPoint: "Mr Bunsea's structured resources — flashcards, past trials, topic-sorted HSC questions — built genuine exam confidence.",
        after: "100% on two major assessments, 97% in trials, and 1st overall in her school's maths course.",
        tone: storyTones.peach,
    }
];
