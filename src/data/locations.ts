/**
 * Per-suburb content for DA Tuition's service-area landing pages.
 *
 * IMPORTANT FRAMING: DA Tuition has ONE physical centre at Level 1/229 Canley
 * Vale Rd, Canley Heights. These suburb pages are SERVICE AREA pages — they
 * describe who we serve, not where we are. All NAP references point to the
 * Canley Heights centre. Copy is framed as "tutoring for [suburb] families"
 * and "just X minutes from [suburb]".
 *
 * Each entry must have 100% unique intro / about / hero copy. Do NOT copy
 * paragraphs between suburbs — Google penalises doorway pages where only the
 * suburb name is swapped.
 */

export interface LocationSchool {
    name: string;
    type: string;
    distance?: string;
}

export interface LocationTransport {
    type: string;
    details: string;
    icon: 'Train' | 'Car' | 'Bus' | 'Navigation';
}

export interface LocationSuccessStory {
    student: string;
    school: string;
    achievement: string;
    year: string;
    quote: string;
}

export interface LocationContent {
    slug: string;
    path: string;
    suburb: string;
    postcode: string;

    // SEO meta
    title: string;
    metaDescription: string;

    // Hero
    heroBadge: string;
    heroHeadline: string;
    heroSubheadline: string;
    heroParagraph: string;
    heroImage: string;
    heroGradient: string; // Tailwind classes for overlay gradient

    // Travel info (shown in a ribbon between hero and NAP card)
    travelInfo: string;

    // Intro — "Why [suburb] families come to DA Tuition" (2 paragraphs)
    introHeading: string;
    introParagraphs: string[];

    // Nearby schools (4-6 per suburb)
    nearbySchools: LocationSchool[];

    // Transport options (specific to this suburb)
    transportOptions: LocationTransport[];

    // Success stories (2-3 per suburb, ideally from schools in that suburb)
    successStories: LocationSuccessStory[];

    // About section — 2 paragraphs, unique voice per suburb
    aboutHeading: string;
    aboutParagraphs: string[];

    // Schema
    areaServed: string[];
}

export const locations: LocationContent[] = [
    // ──────────────────────────────────────────────────────────────
    // CABRAMATTA
    // ──────────────────────────────────────────────────────────────
    {
        slug: 'cabramatta',
        path: '/tutoring-cabramatta',
        suburb: 'Cabramatta',
        postcode: '2166',

        title: 'Tutoring in Cabramatta — K-12 & HSC',
        metaDescription:
            'Trusted K-12 tutoring for Cabramatta families at our Canley Heights centre. Small groups, Band 6 teachers, and a 5-minute drive from Cabramatta Station.',

        heroBadge: 'Serving Cabramatta Families Since 2005',
        heroHeadline: 'Tutoring for Cabramatta Families',
        heroSubheadline: 'A Short Drive From Cabramatta Station',
        heroParagraph:
            'DA Tuition has been working with Cabramatta students for nearly 20 years. Our Canley Heights centre is just a short drive or train stop away, making it easy for families from every corner of Cabramatta to access premium tutoring without the long commute.',
        heroImage: '/images/v3/hero_landscape_1.jpg',
        heroGradient:
            'bg-gradient-to-tr from-brand-navy/90 via-red-500/20 to-amber-400/30',

        travelInfo:
            'Just a 6-minute drive or one stop on the T2 line from Cabramatta Station.',

        introHeading: 'Why Cabramatta Families Choose DA Tuition',
        introParagraphs: [
            'Cabramatta is home to some of the most education-focused families in Sydney. Parents here take their children\'s learning seriously, and they expect tutors who do the same. We built DA Tuition around that exact standard — rigorous curriculum, careful teaching, and honest conversations about progress.',
            'Many of our students come from Cabramatta High School, Cabramatta Public School, and the surrounding primary schools. They arrive with the drive to succeed. Our job is to channel that drive — giving them the structure, exam technique, and confidence they need to turn effort into top marks.',
        ],

        nearbySchools: [
            { name: 'Cabramatta High School', type: 'Public', distance: '2.8km' },
            { name: 'Cabramatta Public School', type: 'Public', distance: '3.0km' },
            { name: 'Cabramatta West Public School', type: 'Public', distance: '3.5km' },
            { name: 'Sacred Heart Primary Cabramatta', type: 'Catholic', distance: '2.9km' },
            { name: 'Mount Pritchard East Public', type: 'Public', distance: '4.2km' },
            { name: 'John Edmondson High School', type: 'Public', distance: '5.1km' },
        ],

        transportOptions: [
            { type: 'Train', details: 'One stop from Cabramatta Station on the T2 line to Canley Vale', icon: 'Train' },
            { type: 'Bus', details: 'Routes 802 and 803 connect Cabramatta directly to Canley Heights', icon: 'Bus' },
            { type: 'Car', details: 'Approximately 6 minutes via Canley Vale Rd or Railway Pde', icon: 'Car' },
            { type: 'Parking', details: 'Free 2-hour street parking available at our Canley Heights centre', icon: 'Navigation' },
        ],

        successStories: [
            {
                student: 'Tu Nguyen',
                school: '2025 HSC Graduate',
                achievement: '99.05 ATAR — Ranked 1st in every subject in Year 12',
                year: '2025',
                quote: 'DA Tuition did not merely improve my grades; it reshaped my belief in what is possible. I was a bird with no wings. I wasn\'t as talented as the others but that doesn\'t mean I\'m any less capable.',
            },
        ],

        aboutHeading: 'A Trusted Partner for Cabramatta Families',
        aboutParagraphs: [
            'For nearly two decades, Cabramatta families have trusted DA Tuition with their children\'s education. We understand the community, we understand the schools, and we understand the ambition that sits at the heart of most Cabramatta households — the belief that a strong education is the foundation of everything else.',
            'Our teachers include many who grew up attending schools in the Fairfield and Cabramatta area. They know the local context, they speak the language of the students they teach, and they hold their classes to a genuinely high standard. It is not unusual for Cabramatta parents to recommend DA Tuition to other families they meet at school gates, sports days, or community events — and that word-of-mouth is the foundation we have been building on since 2005.',
        ],

        areaServed: ['Cabramatta', 'Cabramatta West', 'Canley Heights', 'Canley Vale', 'Lansvale', 'Mount Pritchard'],
    },

    // ──────────────────────────────────────────────────────────────
    // FAIRFIELD
    // ──────────────────────────────────────────────────────────────
    {
        slug: 'fairfield',
        path: '/tutoring-fairfield',
        suburb: 'Fairfield',
        postcode: '2165',

        title: 'Tutoring in Fairfield — K-12 & HSC',
        metaDescription:
            'Premium K-12 and HSC tutoring for Fairfield families at our Canley Heights centre. Band 6 teachers, small groups, and a short commute from Fairfield Station.',

        heroBadge: 'Trusted by Fairfield Families Since 2005',
        heroHeadline: 'Tutoring for Fairfield Families',
        heroSubheadline: 'Minutes From Fairfield in the Heart of Canley Heights',
        heroParagraph:
            'DA Tuition has been supporting Fairfield students for almost 20 years. Our Canley Heights centre is a short drive or two stops by train from Fairfield, making it easy to fit world-class tutoring around school, work, and family life.',
        heroImage: '/images/v3/hero_landscape_2.jpg',
        heroGradient:
            'bg-gradient-to-tr from-brand-navy/90 via-emerald-500/20 to-cyan-400/30',

        travelInfo:
            'Approximately 7 minutes by car, or two stops from Fairfield Station on the T2 line.',

        introHeading: 'Why Fairfield Families Choose DA Tuition',
        introParagraphs: [
            'Fairfield is one of the most culturally rich corners of Sydney, and the families who live here come from every background imaginable. What unites them is a belief that their children deserve every opportunity to succeed. At DA Tuition, we have built our entire approach around honouring that belief with teaching that is careful, rigorous, and personalised.',
            'Our students from Fairfield attend schools like Fairfield High, Patrician Brothers College, and Fairfield West Public. They come to us for different reasons — some need help catching up, some are pushing for Band 6 results, and some are aiming for medicine or engineering at a top university. Whatever the goal, we meet each student where they are and build a clear path forward.',
        ],

        nearbySchools: [
            { name: 'Fairfield High School', type: 'Public', distance: '2.3km' },
            { name: 'Fairfield Public School', type: 'Public', distance: '2.5km' },
            { name: 'Fairfield West Public School', type: 'Public', distance: '3.1km' },
            { name: 'Patrician Brothers College', type: 'Catholic', distance: '2.7km' },
            { name: 'Our Lady of the Rosary Primary', type: 'Catholic', distance: '2.4km' },
            { name: 'Fairvale High School', type: 'Public', distance: '3.1km' },
        ],

        transportOptions: [
            { type: 'Train', details: 'Two stops from Fairfield Station on the T2 line to Canley Vale', icon: 'Train' },
            { type: 'Bus', details: 'Routes 802, 803, and 904 serve the Canley Heights corridor from Fairfield', icon: 'Bus' },
            { type: 'Car', details: 'Approximately 7 minutes via The Horsley Dr or Canley Vale Rd', icon: 'Car' },
            { type: 'Parking', details: 'Free 2-hour street parking outside our centre on Canley Vale Rd', icon: 'Navigation' },
        ],

        successStories: [
            {
                student: 'Katelin Trinh',
                school: 'HSC Student',
                achievement: 'English rank 15th → 6th, Band 5-6 across assignments',
                year: '2024',
                quote: 'Thanks to Ms Jenny\'s patience and encouragement, I had a drastic improvement for my assessment rank, moving from 15th to 6th in my final HSC assessment.',
            },
        ],

        aboutHeading: 'Part of the Fairfield Community',
        aboutParagraphs: [
            'DA Tuition is not a chain. We are a single centre built and run by people who live and work in this community. When Fairfield families walk through our doors, they are not a number in a franchise system — they are parents and students we get to know personally, often across multiple years and sometimes across siblings.',
            'We have watched Fairfield students grow from shy Year 7s into confident HSC graduates heading off to university. We have seen parents who were worried about a C-grade child celebrate a Band 6 result three years later. These long relationships are what make the work meaningful, and they are the reason we still show up every Tuesday through Sunday with the same care we brought on day one.',
        ],

        areaServed: ['Fairfield', 'Fairfield West', 'Fairfield Heights', 'Canley Heights', 'Villawood'],
    },

    // ──────────────────────────────────────────────────────────────
    // CANLEY VALE
    // ──────────────────────────────────────────────────────────────
    {
        slug: 'canley-vale',
        path: '/tutoring-canley-vale',
        suburb: 'Canley Vale',
        postcode: '2166',

        title: 'Tutoring in Canley Vale — Walking Distance',
        metaDescription:
            'Premium K-12 and HSC tutoring for Canley Vale families at our centre on Canley Vale Rd — walking distance from Canley Vale Station and Canley Vale High School.',

        heroBadge: 'Your Local Tutoring Centre',
        heroHeadline: 'Tutoring in Canley Vale',
        heroSubheadline: 'Walking Distance From Canley Vale Station',
        heroParagraph:
            'If you live in Canley Vale, DA Tuition is about as local as tutoring gets. Our centre sits on Canley Vale Rd itself, a short walk from the train station and from Canley Vale High School — which means no long drives, no parking worries, just learning.',
        heroImage: '/images/v3/hero_storefront.jpg',
        heroGradient:
            'bg-gradient-to-tr from-brand-navy/90 via-sky-500/30 to-blue-400/30',

        travelInfo:
            'Walking distance from Canley Vale Station and Canley Vale High School.',

        introHeading: 'The Closest Premium Tutoring for Canley Vale',
        introParagraphs: [
            'For Canley Vale families, distance is never the reason to skip after-school tutoring. Our centre is on Canley Vale Rd itself — the same road you probably drive down every day. Students walk here straight from Canley Vale High School, and parents drop off without ever leaving the suburb.',
            'Being a genuinely local centre changes the way we work. We know the schools. We know the teachers. We know which topics show up on which trial papers year after year. That local knowledge, combined with our curriculum, is why Canley Vale families have kept recommending us to their friends and neighbours for nearly 20 years.',
        ],

        nearbySchools: [
            { name: 'Canley Vale High School', type: 'Public', distance: '0.8km' },
            { name: 'Canley Vale Public School', type: 'Public', distance: '1.1km' },
            { name: "St Gertrude's Primary Canley Vale", type: 'Catholic', distance: '0.9km' },
            { name: 'Canley Heights Public School', type: 'Public', distance: '0.5km' },
            { name: 'Canley Vale Public Annexe', type: 'Public', distance: '1.3km' },
        ],

        transportOptions: [
            { type: 'Train', details: 'Walking distance from Canley Vale Station on the T2 line', icon: 'Train' },
            { type: 'Walk', details: 'About 10 minutes on foot from Canley Vale High School', icon: 'Navigation' },
            { type: 'Bus', details: 'Local bus routes stop directly outside our Canley Vale Rd entrance', icon: 'Bus' },
            { type: 'Car', details: 'Free 2-hour street parking and a safe drop-off zone out the front', icon: 'Car' },
        ],

        successStories: [
            {
                student: 'Joie Lim',
                school: 'Year 12 Student',
                achievement: 'Maths rank 13th → 1st, 100% in trial assessments',
                year: '2024',
                quote: 'After I joined DA I got 100% in both assessments 2 and 3. And in my math trials I got the highest score which was 97%. My rank had gone from a 13 in semester 1 to ranking 1st overall.',
            },
        ],

        aboutHeading: 'Tutoring That Is Genuinely Local',
        aboutParagraphs: [
            'There is something unique about being the neighbourhood tutoring centre. Our students walk past our windows every day on their way to and from school. We know their parents by name. We run into them at the local bakery and the Canley Vale Station platform. That closeness is part of why the care we give feels different — this is not a distant service, it is our community.',
            'Canley Vale High School sits just down the road from us, and we have worked with hundreds of its students over the years. Many come to us in Year 9 or 10, stay through their HSC, and leave with ATARs that open doors they did not think were open. For Canley Vale Public School students, we are often the very first place they experience structured tutoring outside of school — and we take that responsibility seriously.',
        ],

        areaServed: ['Canley Vale', 'Canley Heights', 'Lansvale', 'Cabramatta'],
    },

    // ──────────────────────────────────────────────────────────────
    // SMITHFIELD
    // ──────────────────────────────────────────────────────────────
    {
        slug: 'smithfield',
        path: '/tutoring-smithfield',
        suburb: 'Smithfield',
        postcode: '2164',

        title: 'Tutoring in Smithfield — K-12 & HSC',
        metaDescription:
            'Expert K-12 and HSC tutoring for Smithfield families at our Canley Heights centre. Short drive via The Horsley Dr, small groups, and Band 6 subject teachers.',

        heroBadge: 'Serving Smithfield Families',
        heroHeadline: 'Tutoring for Smithfield Families',
        heroSubheadline: 'A Quick Drive to Our Canley Heights Centre',
        heroParagraph:
            'Smithfield is only a short drive from our Canley Heights centre, and we have been working with Smithfield families for years. For parents who want serious tutoring without trekking into the city, we offer the closest premium option in the Fairfield area.',
        heroImage: '/images/v3/hero_landscape_3.jpg',
        heroGradient:
            'bg-gradient-to-tr from-brand-navy/90 via-purple-500/25 to-pink-400/30',

        travelInfo:
            'Approximately 9 minutes by car via The Horsley Dr and Canley Vale Rd.',

        introHeading: 'Why Smithfield Families Travel to DA Tuition',
        introParagraphs: [
            'Smithfield does not have many dedicated tutoring centres of its own, and the ones that exist rarely offer the small-group, curriculum-driven teaching that serious HSC students need. That gap is why so many Smithfield families have found their way to DA Tuition over the years — we sit a short drive away in Canley Heights, and the difference in quality is worth the extra few minutes on the road.',
            'Parents tell us that the drive from Smithfield feels worth it almost immediately. Their children come home with homework they are actually doing, concepts they can actually explain, and a quiet confidence that was not there before. That is the kind of change we aim for — not loud, not flashy, but real.',
        ],

        nearbySchools: [
            { name: 'Smithfield Public School', type: 'Public', distance: '3.3km' },
            { name: 'Smithfield West Public School', type: 'Public', distance: '3.8km' },
            { name: 'Holy Spirit Catholic Primary Smithfield', type: 'Catholic', distance: '3.5km' },
            { name: 'St Johns Park High School', type: 'Public', distance: '3.5km' },
            { name: 'Fairfield Intensive English Centre', type: 'Public', distance: '3.0km' },
        ],

        transportOptions: [
            { type: 'Car', details: 'Approximately 9 minutes via The Horsley Dr and Canley Vale Rd', icon: 'Car' },
            { type: 'Bus', details: 'Route 904 connects Smithfield through to the Canley Heights area', icon: 'Bus' },
            { type: 'Train', details: 'Nearest station is Fairfield — transfer by bus or short drive to Canley Vale', icon: 'Train' },
            { type: 'Parking', details: 'Free 2-hour street parking available at our centre', icon: 'Navigation' },
        ],

        successStories: [
            {
                student: 'Melissa Ly',
                school: 'St Johns Park High School',
                achievement: 'Ranked 1st in 2-Unit Mathematics Trial, boosted to 80-100% range',
                year: '2024',
                quote: 'You know what else I\'ve never dreamed of happening ever? Ranking 1st in a 2-unit trial exam. It was the first time in my whole high school life where I achieved 100% on a 2-unit exam.',
            },
        ],

        aboutHeading: 'Worth the Short Drive From Smithfield',
        aboutParagraphs: [
            'We understand that choosing a tutoring centre means trusting someone with your child\'s time, confidence, and future. Smithfield families who commit to the short drive to Canley Heights are making a real investment — of hours each week, of fuel, of planning around school pickups — and we do not take that lightly.',
            'That is why we work the way we do. Small groups. Careful matching of student to teacher. Regular check-ins with parents. Honest assessments when something is not working. The families who come to us from Smithfield stay with us because the work is visible, the progress is measurable, and the care behind it is genuine.',
        ],

        areaServed: ['Smithfield', 'Smithfield West', 'Canley Heights', 'Fairfield', 'Wetherill Park'],
    },

    // ──────────────────────────────────────────────────────────────
    // LANSVALE
    // ──────────────────────────────────────────────────────────────
    {
        slug: 'lansvale',
        path: '/tutoring-lansvale',
        suburb: 'Lansvale',
        postcode: '2166',

        title: 'Tutoring in Lansvale — K-12 & HSC',
        metaDescription:
            'Trusted K-12 and HSC tutoring for Lansvale families at our Canley Heights centre. A short 5-minute drive away, small groups, Band 6 teachers, proven results.',

        heroBadge: 'Just Minutes From Lansvale',
        heroHeadline: 'Tutoring for Lansvale Families',
        heroSubheadline: 'A Five-Minute Drive to Canley Heights',
        heroParagraph:
            'Lansvale sits right between Canley Heights and Cabramatta, which means DA Tuition is barely a five-minute drive from anywhere in the suburb. For Lansvale families who want serious tutoring close to home, our centre is the obvious choice.',
        heroImage: '/images/v3/classroom_active.jpg',
        heroGradient:
            'bg-gradient-to-tr from-brand-navy/90 via-teal-500/25 to-green-400/30',

        travelInfo: 'Just a 5-minute drive from anywhere in Lansvale via Cabramatta Rd.',

        introHeading: 'Premium Tutoring, Five Minutes From Lansvale',
        introParagraphs: [
            'Lansvale is a quiet, close-knit suburb — the kind of place where families know their neighbours and children walk to school. It is also a place that does not have its own dedicated tutoring centre, which is why so many Lansvale parents make the short drive to our Canley Heights centre when they want serious, structured support for their child.',
            'Our teachers understand that Lansvale students are often attending Canley Vale High School, Lansvale Public School, or nearby Cabramatta schools. We tailor our programs to the schools they actually attend and the teachers they actually have, so the work we do at DA Tuition reinforces and extends what is happening in the classroom — not a second set of unrelated lessons to add to an already full week.',
        ],

        nearbySchools: [
            { name: 'Lansvale Public School', type: 'Public', distance: '2.2km' },
            { name: 'Lansvale East Public School', type: 'Public', distance: '2.6km' },
            { name: 'Canley Vale High School', type: 'Public', distance: '1.8km' },
            { name: 'Canley Heights Public School', type: 'Public', distance: '2.1km' },
            { name: 'Cabramatta High School', type: 'Public', distance: '3.0km' },
        ],

        transportOptions: [
            { type: 'Car', details: 'Approximately 5 minutes via Cabramatta Rd', icon: 'Car' },
            { type: 'Bus', details: 'Routes 802 and 803 serve Lansvale through to Canley Heights', icon: 'Bus' },
            { type: 'Train', details: 'Canley Vale Station is the closest train stop — a short walk to our centre', icon: 'Train' },
            { type: 'Parking', details: 'Free 2-hour street parking and a safe drop-off zone outside', icon: 'Navigation' },
        ],

        successStories: [
            {
                student: 'Bryant Lam',
                school: 'HSC Student',
                achievement: 'Five Band 6 HSC results, desirable ATAR',
                year: '2024',
                quote: 'Being a student at DA for the last 8 years has been an absolute life changer. Through the lessons from DA I was able to achieve five of BAND 6\'s in the HSC exam and achieved my desirable ATAR that made my parents proud.',
            },
        ],

        aboutHeading: 'A Short Drive, A Big Difference',
        aboutParagraphs: [
            'Lansvale families often tell us that they chose DA Tuition because proximity made it realistic. A 30-minute drive to a tutoring centre in another part of Sydney is a weekly chore; a 5-minute drive to Canley Heights is not. That small difference adds up over months and years — it means fewer missed classes, less homework time lost to travel, and more consistent progress.',
            'But proximity alone is not why they stay. They stay because the teaching works. They stay because their children enjoy coming. They stay because the progress they see in reports and school marks matches the effort being put in. Those are the real reasons our Lansvale families have been with us, in some cases, across two or three children.',
        ],

        areaServed: ['Lansvale', 'Canley Heights', 'Canley Vale', 'Cabramatta'],
    },
];

export function getLocationBySlug(slug: string): LocationContent | undefined {
    return locations.find((l) => l.slug === slug);
}
