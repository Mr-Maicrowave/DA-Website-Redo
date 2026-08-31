import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Minus,
  Plus,
  Search,
  X,
} from "lucide-react";
import SEO from "@/components/SEO";
import NavigationNew from "@/components/NavigationNew";
import FooterNew from "@/components/FooterNew";
import { faqPageSchema } from "@/lib/seo/schema";
import { searchRecords } from "@/lib/search";
import "./FAQ.css";

type Category =
  | "all"
  | "start"
  | "programs"
  | "classes"
  | "teachers"
  | "results"
  | "safety";
type FAQ = {
  category: Exclude<Category, "all">;
  question: string;
  answer: string;
  keywords: string[];
  links?: { label: string; href: string }[];
  popular?: boolean;
};
const categories: { id: Category; label: string; description: string }[] = [
  {
    id: "all",
    label: "All questions",
    description: "Every answer, in one considered place.",
  },
  {
    id: "start",
    label: "Starting at DA",
    description: "Interviews, placement and joining DA.",
  },
  {
    id: "programs",
    label: "Programs and subjects",
    description: "Subjects, year levels and syllabus.",
  },
  {
    id: "classes",
    label: "Classes and timing",
    description: "Classroom fit, timing and learning formats.",
  },
  {
    id: "teachers",
    label: "Teachers and support",
    description: "The people and support behind each class.",
  },
  {
    id: "results",
    label: "Results and progress",
    description: "Progress, evidence and expectations.",
  },
  {
    id: "safety",
    label: "Safety and policies",
    description: "Care, absences and centre expectations.",
  },
];
const faqs: FAQ[] = [
  {
    category: "start",
    question: "How do I enrol my child at DA Tuition?",
    answer:
      "Simply complete our enrolment form, with a $50 deposit to secure your child’s place in the enrolment process. Within approximately one week, a DA coordinator will contact you to arrange an interview, where we take the time to carefully understand your child, their current needs, and what you’re hoping to achieve before guiding you towards the most suitable class. We want every family to feel confident that DA is the right fit before their journey begins.",
    keywords: ["enrol", "enroll", "start", "interview", "assessment", "book"],
    popular: true,
    links: [{ label: "Book a consultation", href: "/book-interview" }],
  },
  {
    category: "classes",
    question: "What are your class sizes?",
    answer:
      "At DA, we understand that every student learns differently, which is why we offer a range of class environments to suit each child’s pace, confidence and academic goals. Students who thrive with more individual attention can be placed in smaller or private classes, while highly driven students may benefit from larger, more competitive classes that challenge them alongside peers striving for top results. We take the time to understand your child and place them in the environment where they are most likely to feel supported, motivated and capable of reaching their potential.",
    keywords: ["class size", "small class", "private", "competitive", "individual attention"],
    popular: true,
  },
  {
    category: "start",
    question: "What is the purpose of the interview?",
    answer:
      "The interview allows us to get to know your child before we begin teaching them: their strengths, challenges, confidence, study habits, goals, and how they learn best. It also helps us understand the type of tutor and class environment most likely to suit their learning style, whether they need more individual support, greater challenge or a more competitive setting. The more we understand from the beginning, the more thoughtfully we can place and support your child from day one.",
    keywords: ["interview", "assessment", "placement", "learning style", "tutor fit"],
  },
  {
    category: "programs",
    question: "Do you help with school homework and exam preparation?",
    answer:
      "Yes! While our lessons follow a structured learning program, we also understand that students sometimes need extra support with school homework, assessments, and upcoming exams. Rather than simply helping them complete the task, our tutors focus on strengthening the understanding, skills and strategies behind it so students know how to approach similar work independently in the future. The goal is not just to get through the next deadline, but to help students become more confident, capable and prepared over time.",
    keywords: ["homework", "assessment", "exam", "exam preparation", "school work"],
    popular: true,
  },
  {
    category: "results",
    question: "What results do DA students achieve?",
    answer:
      "We are incredibly proud of what DA students have achieved, from students rebuilding their foundations to high achievers reaching exceptional academic results. Read our Success Stories to find out more about the significant improvements in academic performance and confidence in our students, as well as the dedication tutors invest in helping students succeed.",
    keywords: ["results", "success", "improvement", "academic performance", "confidence"],
    popular: true,
    links: [{ label: "Read success stories", href: "/success-stories" }],
  },
  {
    category: "results",
    question: "How do you monitor and follow a child's progress?",
    answer:
      "We believe progress should be visible, not assumed. That is why we look at more than a single test mark. We track how your child is performing over time: their understanding, accuracy, homework, confidence, engagement, recurring mistakes and how well they can apply what they have learned. Our tutors use this information to identify patterns early, recognise improvement and respond the moment something is not progressing as expected.\n\nWe also look at whether weaknesses are genuinely being resolved. If a student struggles with a skill, we do not move on simply because it has been taught. We follow up, revisit it where needed and check that they can apply it independently, not just recall it.\n\nParents are kept informed through regular, honest communication about where their child stands, what we are seeing and what needs to happen next.",
    keywords: ["progress", "monitor", "tracking", "feedback", "parents", "improving"],
    popular: true,
  },
  {
    category: "teachers",
    question: "How do you make sure my child has the right tutor?",
    answer:
      "We don’t believe the right tutor is simply the person who knows the subject. Through our Tutor Fit Assessment, we consider your child’s academic level, learning needs, confidence, personality, pace and the type of teaching they respond to best before matching them with the tutor and class environment most likely to help them progress. If we believe a different tutor, class or teaching approach would support them better, we’ll make that change, because our goal is to place every child where they are most likely to improve, feel understood and thrive.",
    keywords: ["tutor", "tutor fit", "match", "personality", "learning needs", "teacher"],
    popular: true,
  },
  {
    category: "start",
    question: "Is there an entrance exam?",
    answer:
      "No, our philosophy is that a child shouldn't have to prove they are already “good enough” before they can receive support. At DA, we believe every child deserves support that meets them where they are, without feeling judged by what they may not know yet. Getting to know your child helps us understand their current strengths, challenges and confidence so we can guide them forward in a way that feels encouraging and achievable.",
    keywords: ["entrance exam", "test", "entry", "assessment", "enrolment"],
  },
  {
    category: "classes",
    question: "Can my child join during the term?",
    answer:
      "Absolutely! We understand that every child’s learning journey is different, and the need for extra support doesn’t always begin at the start of a term. If a session is available, we’ll take the time to understand where your child is currently at and help them transition into the right class with confidence and support.",
    keywords: ["join", "during term", "mid term", "availability", "start date"],
  },
  {
    category: "safety",
    question: "How do you handle student behaviour?",
    answer:
      "At DA, we believe students thrive when they feel respected, supported and held to clear expectations. Our tutors build strong relationships with students so they can guide behaviour positively, encourage responsibility and keep the classroom focused without making students feel judged. We want every student to feel that DA is a place where they can enjoy learning, grow in confidence and become the best version of themselves.",
    keywords: ["behaviour", "classroom", "expectations", "respect", "discipline"],
    links: [{ label: "See why families choose DA", href: "/why-choose-da" }],
  },
  {
    category: "programs",
    question: "Are learning materials included?",
    answer:
      "Yes, students receive structured learning materials that complement what they are learning in class and provide purposeful opportunities to practise and strengthen key skills. Our resources are designed to build confidence, reinforce understanding and help students develop more consistent and effective study habits over time.",
    keywords: ["materials", "resources", "books", "worksheets", "study habits"],
  },
  {
    category: "safety",
    question: "What happens when my child is absent?",
    answer:
      "We understand that absences can sometimes be unavoidable, so let our team know as early as possible. If a suitable space becomes available in another class, we may be able to place your child into that session so they can catch up while still learning in an environment appropriate for their level and needs. This allows us to support continuity without compromising the quality and balance of each class.",
    keywords: ["absent", "absence", "miss class", "catch up", "sick"],
  },
  {
    category: "safety",
    question: "Is DA Tuition safe for younger students?",
    answer:
      "We know that for parents of younger children, feeling that your child is comfortable, noticed and cared for matters just as much as what they learn. We aim to create an environment where younger students feel secure enough to ask questions, make mistakes and gradually grow in confidence. Public reviews consistently describe DA's environment as caring, supportive, comfortable and inviting.",
    keywords: ["safe", "safety", "younger", "child", "comfortable", "cared for"],
  },
  {
    category: "programs",
    question: "What is DA's core purpose and values?",
    answer:
      "We believe every student deserves to be truly understood, not just taught and not just marked. Marks matter, but they are the outcome, not the method. That is why we begin by understanding your child: where they are strong, where they are struggling, and what may be holding them back, before deciding how best to help.\n\nParents should never be left guessing; we believe in honest, regular communication about where your child stands, what we are seeing, and what needs to happen next, combining high expectations with genuine care. Our goal is for every student to become more capable, more confident, and more independent, not simply better prepared for the next test.\n\nFamilies trust us with something that matters enormously: their child’s education, confidence and future potential. We do not take that responsibility lightly.\n\nTrusted by Families. Transforming Futures.",
    keywords: ["purpose", "values", "mission", "approach", "understood", "trusted"],
  },
  {
    category: "results",
    question: "How do you help students stop repeating the same mistakes?",
    answer:
      "Simply correcting an answer doesn’t teach a student how to avoid the same mistake next time. Through our Exam Analysis System, tutors look beyond the mark to identify patterns, whether the issue comes from gaps in knowledge, rushing, misreading questions, weak exam technique or difficulty applying what they know. This helps students understand why they lost marks, learn what to change and become more accurate, reflective and independent over time.",
    keywords: ["mistakes", "exam analysis", "exam technique", "accuracy", "lost marks"],
  },
  {
    category: "teachers",
    question: "How do you know when my child is struggling, even if they don't say anything?",
    answer:
      "Some students will ask for help straight away, while others go quiet, hesitate or try to work through it on their own. Our tutors get to know the students they teach, so they can often notice when something feels off and check in before a small difficulty turns into a bigger one. We want your child to know there is always someone paying attention and ready to help.",
    keywords: ["struggling", "help", "quiet", "support", "tutor", "notice"],
  },
  {
    category: "results",
    question: "Why do families stay with DA for years?",
    answer:
      "For many families, DA becomes more than a place their child comes to study. Over time, tutors get to know their students, understand what motivates them and support them through different stages of school, which is why so many parents value the relationships just as much as the results. As students grow in confidence and ability, families stay because they can see that their child is genuinely known, supported and encouraged to keep improving.",
    keywords: ["families", "years", "relationships", "confidence", "support", "results"],
    links: [{ label: "See why families choose DA", href: "/why-choose-da" }],
  },
  {
    category: "teachers",
    question: "What if tutoring hasn't worked for my child before?",
    answer:
      "We know it can be discouraging when you’ve tried tutoring and haven’t seen the change you hoped for. That’s why we take the time to understand your child specifically: what hasn’t worked, what they respond to, where their confidence may have dropped, and what kind of support they need now. Sometimes the difference is finding the right tutor, the right environment and an approach that finally feels right for them.",
    keywords: ["tutoring hasn't worked", "discouraging", "confidence", "right tutor", "approach"],
  },
  {
    category: "teachers",
    question: "Why do students actually enjoy coming to DA?",
    answer:
      "Students enjoy DA because they feel comfortable being themselves, asking questions and having a laugh while they learn. Over time, they build real relationships with their tutors and classmates, celebrate their progress and begin to feel more confident in what they can do. We take learning seriously, but we also want DA to be a place students genuinely look forward to coming to each week.",
    keywords: ["enjoy", "fun", "relationships", "tutors", "classmates", "confidence"],
    links: [{ label: "Read success stories", href: "/success-stories" }],
  },
  {
    category: "results",
    question: "Will tutoring put even more pressure on my child?",
    answer:
      "At DA, we make school feel less overwhelming, not more stressful. By helping your child understand their work more clearly, stay organised and feel better prepared, we aim to reduce the frustration and uncertainty that often creates pressure. We will still challenge them, but in a way that builds confidence, resilience and a stronger belief in what they can handle.",
    keywords: ["pressure", "stress", "overwhelming", "organised", "confidence", "resilience"],
  },
  {
    category: "programs",
    question: "My child is already doing well. How can DA further their academic ability?",
    answer:
      "Tutoring isn't only for students who are behind. For high-achieving students, the focus becomes less about catching up and more about pushing beyond what they already know through greater depth, more challenging questions, stronger exam technique and sharper precision. We want to keep capable students stretched, motivated and working towards the highest level they are ready to achieve.",
    keywords: ["doing well", "high achieving", "extension", "challenge", "academic ability", "advanced"],
  },
  {
    category: "programs",
    question: "How do you help students become independent learners?",
    answer:
      "We want your child to feel confident enough to have a go on their own. Our tutors support them closely at first, then gradually step back as they become more comfortable planning their work, checking their thinking and solving problems independently. For us, one of the best signs of progress is hearing a student say, “Let me try first.”",
    keywords: ["independent", "independent learner", "confidence", "problem solving", "study skills"],
  },
  {
    category: "teachers",
    question: "What if my child has no motivation to study?",
    answer:
      "Sometimes a student who seems unmotivated is actually feeling discouraged, overwhelmed or unsure whether their effort will make a difference. We take the time to understand what is holding your child back, then use encouragement, achievable goals and consistent support to help them experience progress again. As their confidence grows and they begin to see what they are capable of, motivation follows.",
    keywords: ["motivation", "unmotivated", "study", "discouraged", "goals", "confidence"],
  },
  {
    category: "safety",
    question: "How do you create a positive learning environment?",
    answer:
      "For us, the greatest reflection of DA’s environment is in the hundreds of heartfelt reviews and messages from students and families who still speak about the difference DA made in their lives. Many students look back years later grateful not only for the marks they achieved, but for the tutors who believed in them, motivated them and helped them become more confident in themselves. That is the environment we want every child to experience; a place where they feel happy, genuinely cared for and inspired to become more than they thought they could be.",
    keywords: ["positive environment", "learning environment", "reviews", "happy", "cared for", "inspired"],
    popular: true,
    links: [{ label: "Read family reviews", href: "/reviews" }],
  },
];
const id = (q: string) =>
  `faq-${q
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
const filterDeskFAQs = (items: FAQ[], category: Category, query: string) => {
  const inCategory = items.filter((item) => category === "all" || item.category === category);
  const conceptsByCategory: Partial<Record<Category, string[]>> = { teachers: ['teachers'], safety: ['absence'], start: ['enrolment', 'interview'], classes: ['classes'], programs: ['mathematics'] };
  return searchRecords(inCategory.map((item) => ({ ...item, title: item.question, body: item.answer, concepts: conceptsByCategory[item.category] })), query);
};
const counts = faqs.reduce<Record<Category, number>>(
  (a, x) => ({ ...a, all: a.all + 1, [x.category]: a[x.category] + 1 }),
  {
    all: 0,
    start: 0,
    programs: 0,
    classes: 0,
    teachers: 0,
    results: 0,
    safety: 0,
  },
);
export default function FAQPage() {
  const location = useLocation();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [mobile, setMobile] = useState(false);
  const filtered = useMemo(() => filterDeskFAQs(faqs, cat, q), [cat, q]);
  const pages = Math.ceil(filtered.length / 5);
  const visible = filtered.slice((page - 1) * 5, page * 5);
  const active = categories.find((x) => x.id === cat)!;
  const choose = (f: FAQ) => {
    setQ("");
    setCat(f.category);
    setPage(1);
    setOpen(f.question);
    setTimeout(
      () =>
        document
          .getElementById("faq-browser")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      20,
    );
  };
  const select = (next: Category) => {
    setCat(next);
    setQ("");
    setOpen(null);
    setPage(1);
    setMobile(false);
    history.replaceState(null, "", next === "all" ? "/faq" : `/faq#${next}`);
  };
  useEffect(() => {
    const h = location.hash.slice(1);
    if (categories.some((x) => x.id === h)) setCat(h as Category);
    const f = faqs.find((x) => id(x.question) === h);
    if (f) choose(f);
  }, [location.hash]);
  return (
    <div className="min-h-screen bg-[#f8f3e8] text-[#091a31]">
      <SEO
        title="Frequently Asked Questions"
        description="Clear answers about DA Tuition programs, fees, class sizes, teachers, results, safety, and how to book an interview."
        canonicalUrl="/faq"
        jsonLd={faqPageSchema(
          faqs.map((x) => ({ question: x.question, answer: x.answer })),
        )}
      />
      <NavigationNew />
      <main>
        <section className="relative grid min-h-[720px] overflow-hidden bg-[#091a31] text-white">
          <img
            className="absolute inset-0 h-full w-full object-cover object-[54%_40%]"
            src="/images/faq/faq-hero-tutor-student-brow-touchup.png"
            alt="A DA Tuition tutor and student working through mathematics together"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,14,28,.94),rgba(4,14,28,.78)_46%,rgba(4,14,28,.18))]" />
          <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-center px-6 py-32 lg:px-24">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#efd88f]">
              DA Answer Desk
            </p>
            <h1 className="mt-5 max-w-3xl font-serif text-[clamp(3.6rem,7vw,6.4rem)] font-medium leading-[.92] tracking-[-.035em]">
              Start with <span className="text-[#e6c86f]">what’s</span> on your
              mind.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/85">
              Clear answers before you commit: classes, fees, teachers, progress
              and getting started.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("faq-browser")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#c69a38] px-6 py-3 font-bold text-[#091a31]"
            >
              Find an answer <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
        <section className="faq-editorial-discovery px-5 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#806020]">
              You ask. DA answers.
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2.7rem,5vw,4.6rem)] font-medium leading-none tracking-[-.035em]">
              What would you like to know?
            </h2>
            <label className="mt-8 flex items-center gap-4 border-b-2 border-[#091a31] bg-white px-5">
              <Search className="h-5 w-5 text-[#c69a38]" />
              <span className="sr-only">Search frequently asked questions</span>
              <input
                className="h-[72px] w-full bg-transparent text-lg outline-none"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setCat("all");
                  setPage(1);
                  setOpen(null);
                }}
                placeholder="Search classes, fees, teachers, enrolment…"
              />
              {q && (
                <button onClick={() => setQ("")} aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            <p className="mt-3 text-sm text-[#576577]" aria-live="polite">
              {q
                ? `${filtered.length} answers for “${q}”`
                : `${faqs.length} answers, organised for quick reference`}
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <b className="text-[#806020]">Common questions</b>
              {faqs
                .filter((x) => x.popular)
                .slice(0, 3)
                .map((x) => (
                  <button
                    className="inline-flex items-center gap-1 border-b border-[#c69a38] text-left font-semibold"
                    onClick={() => choose(x)}
                    key={x.question}
                  >
                    {x.question}
                    <ArrowRight className="h-3 w-3" />
                  </button>
                ))}
            </div>
          </div>
        </section>
        <section id="faq-browser" className="faq-editorial-browser">
          <div className="faq-editorial-layout">
            <aside className="faq-editorial-index hidden lg:block">
              <p className="mb-3 text-xs font-black uppercase tracking-[.15em] text-[#806020]">
                Browse the desk
              </p>
              {categories.map((x, i) => (
                <button
                  onClick={() => select(x.id)}
                  aria-pressed={x.id === cat}
                  className={`grid w-full grid-cols-[2rem_1fr_auto] border-b py-3 text-left text-sm ${x.id === cat ? "border-b-2 border-[#c69a38] font-bold" : "border-[#091a31]/15 text-[#091a31]/65"}`}
                  key={x.id}
                >
                  <i className="font-serif not-italic text-[#977530]">
                    {String(i + 1).padStart(2, "0")}
                  </i>
                  <span>{x.label}</span>
                  <b className="text-xs">{counts[x.id]}</b>
                </button>
              ))}
            </aside>
            <div className="relative lg:hidden">
              <button
                onClick={() => setMobile(!mobile)}
                aria-expanded={mobile}
                className="flex w-full items-center justify-between border border-[#091a31]/25 bg-white px-4 py-3 font-bold"
              >
                <span>{active.label}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {mobile && (
                <div className="absolute z-10 w-full border border-t-0 border-[#091a31]/25 bg-white p-2">
                  {categories.map((x) => (
                    <button
                      className="block w-full p-2 text-left text-sm"
                      onClick={() => select(x.id)}
                      key={x.id}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <section className="faq-editorial-answers">
              <header className="faq-editorial-heading">
                <p className="text-xs font-black uppercase tracking-[.15em] text-[#806020]">
                  {q ? "Search results" : active.label}
                </p>
                <h2 className="mt-2 font-serif text-5xl font-medium leading-none tracking-[-.035em]">
                  {q ? `Results for “${q}”` : active.label}
                </h2>
                <span className="mt-3 block text-sm text-[#576577]">
                  {q
                    ? "Searches include question and answer text."
                    : active.description}
                </span>
              </header>
              {visible.length ? (
                visible.map((x) => (
                  <article
                    id={id(x.question)}
                    className={`faq-editorial-question ${open === x.question ? "is-open" : ""}`}
                    key={x.question}
                  >
                    <button
                      className="grid w-full grid-cols-[2rem_1fr] gap-3 py-6 text-left"
                      onClick={() =>
                        setOpen(open === x.question ? null : x.question)
                      }
                      aria-expanded={open === x.question}
                    >
                      <span className="grid h-6 w-6 place-items-center rounded-full border border-[#c69a38] text-[#806020]">
                        {open === x.question ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </span>
                      <strong className="font-serif text-xl leading-6">
                        {x.question}
                      </strong>
                    </button>
                    {open === x.question && (
                      <div className="mb-7 ml-9 border-t border-[#c69a38] pt-4 text-[#354359] leading-7">
                        <p className="whitespace-pre-line">{x.answer}</p>
                        {x.links && (
                          <nav className="mt-4 flex flex-wrap gap-4">
                            {x.links.map((l) => (
                              <Link
                                className="inline-flex items-center gap-1 font-bold text-[#725313]"
                                key={l.href}
                                to={l.href}
                              >
                                {l.label}
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            ))}
                          </nav>
                        )}
                      </div>
                    )}
                  </article>
                ))
              ) : (
                <div className="py-16 text-center">
                  <Search className="mx-auto h-7 w-7 text-[#c69a38]" />
                  <h3 className="mt-4 font-serif text-3xl">
                    No close answer yet.
                  </h3>
                  <p className="mt-2 text-[#576577]">
                    Try “fees”, “HSC”, “teachers” or “class size”.
                  </p>
                  <button
                    onClick={() => {
                      setQ("");
                      setCat("all");
                    }}
                    className="mt-5 border-b border-[#c69a38] font-bold"
                  >
                    Clear search
                  </button>
                </div>
              )}
              {pages > 1 && (
                <nav className="flex justify-between pt-8 text-sm font-bold">
                  <button
                    disabled={page === 1}
                    className="inline-flex items-center gap-2 disabled:invisible"
                    onClick={() => setPage(page - 1)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <span>
                    {page} / {pages}
                  </span>
                  <button
                    disabled={page === pages}
                    className="inline-flex items-center gap-2 disabled:invisible"
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </nav>
              )}
            </section>
            <aside className="faq-editorial-help overflow-hidden bg-[#091a31] text-white">
              <img
                className="h-48 w-full object-cover"
                src="/images/faq/faq-human-answer-meeting-room.png"
                alt="DA Tuition's meeting room, ready for a parent conversation"
              />
              <div className="p-6">
                <h2 className="font-serif text-4xl leading-none">
                  Still have a question?
                </h2>
                <p className="mt-4 text-sm leading-6 text-white/75">
                  A conversation can make the next step clearer.
                </p>
                <Link
                  className="mt-6 flex items-center justify-between font-bold"
                  to="/contact"
                >
                  Contact DA <ArrowRight className="h-4 w-4 text-[#e7ca73]" />
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <FooterNew />
    </div>
  );
}
