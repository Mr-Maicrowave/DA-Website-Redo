
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
}

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
        iconType: "trending"
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
        iconType: "award"
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
        iconType: "star"
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
        iconType: "trending"
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
        iconType: "award"
    }
];
