import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
  | "fees"
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
    id: "fees",
    label: "Fees and payments",
    description: "Costs, inclusions and enrolment questions.",
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
    question: "What is the best way to get started at DA Tuition?",
    answer:
      "Start with a booked interview. We use that time to understand your child's current level, goals, confidence, and the class fit that will actually help. You do not need to know the exact subject or program before contacting us.",
    keywords: ["enrol", "enroll", "start", "interview", "assessment", "book"],
    popular: true,
    links: [{ label: "Book an interview", href: "/book-interview" }],
  },
  {
    category: "start",
    question: "Is the interview a test?",
    answer:
      "No. It is a guided conversation and learning check, not a pass-or-fail exam. The goal is to place your child where they can improve without feeling lost or held back.",
    keywords: ["test", "assessment", "interview", "nervous", "entry"],
    popular: true,
    links: [{ label: "Book an interview", href: "/book-interview" }],
  },
  {
    category: "start",
    question: "Can my child join during the term?",
    answer:
      "Usually, yes, if there is a suitable class available. The interview helps us choose the right level and timing before they start.",
    keywords: ["join", "mid term", "during term", "availability", "start date"],
    links: [{ label: "View learning formats", href: "/learning-formats" }],
  },
  {
    category: "programs",
    question: "Which year levels do you teach?",
    answer: "We teach from primary school through HSC.",
    keywords: [
      "year",
      "primary",
      "high school",
      "hsc",
      "k-6",
      "7-10",
      "year 12",
    ],
    popular: true,
    links: [{ label: "View our programs", href: "/programs" }],
  },
  {
    category: "programs",
    question: "What subjects are available?",
    answer:
      "Core subjects include Mathematics, English, Science, Business Studies, Legal Studies, and HSC preparation.",
    keywords: [
      "subjects",
      "maths",
      "mathematics",
      "english",
      "science",
      "business",
      "legal",
    ],
    links: [{ label: "View all subjects", href: "/subjects" }],
  },
  {
    category: "programs",
    question: "Do you follow the NSW curriculum?",
    answer:
      "Yes. Lessons are aligned with NSW syllabus expectations, while also teaching exam technique, response structure, and deeper understanding.",
    keywords: ["nsw", "nesa", "curriculum", "syllabus", "school"],
  },
  {
    category: "fees",
    question: "How much does tutoring cost?",
    answer:
      "Fees depend on the year level, subject, and program. The simplest way to get an accurate answer is to book an interview so we can recommend the right class before discussing the fee.",
    keywords: ["price", "pricing", "cost", "fees", "payment", "how much"],
    popular: true,
    links: [{ label: "Book an interview", href: "/book-interview" }],
  },
  {
    category: "fees",
    question: "Are learning materials included?",
    answer:
      "Yes, regular class materials and learning resources are included unless a specific exception is explained before enrolment.",
    keywords: ["materials", "resources", "books", "extra costs", "worksheets"],
  },
  {
    category: "classes",
    question: "How big are the classes?",
    answer:
      "Groups are intentionally kept small so students have room to ask questions and receive meaningful feedback while still benefiting from peer discussion.",
    keywords: ["class size", "small group", "one on one", "1 on 1", "students"],
    popular: true,
    links: [{ label: "Learning formats", href: "/learning-formats" }],
  },
  {
    category: "classes",
    question: "When are classes held?",
    answer:
      "Classes run after school and on weekends. Exact times depend on the subject, year level, and current availability.",
    keywords: ["time", "schedule", "weekend", "after school", "hours"],
    links: [{ label: "Contact DA", href: "/#contact" }],
  },
  {
    category: "classes",
    question: "Do you offer online classes?",
    answer:
      "DA is primarily an in-person centre. If your family has a specific access issue, ask us directly.",
    keywords: ["online", "zoom", "remote", "in person", "face to face"],
  },
  {
    category: "teachers",
    question: "Who teaches the classes?",
    answer:
      "Classes are taught by trained tutors who understand the subject, syllabus, and student experience.",
    keywords: ["teacher", "tutor", "who teaches", "staff", "mentor"],
    popular: true,
    links: [{ label: "Find a tutor", href: "/find-teacher" }],
  },
  {
    category: "teachers",
    question: "Can we request a specific teacher?",
    answer:
      "You can ask, and we will consider availability alongside class fit, level, subject, and personality.",
    keywords: ["request", "specific teacher", "choose tutor", "teacher change"],
  },
  {
    category: "results",
    question: "What results do DA students achieve?",
    answer:
      "Read our real success stories for the most useful version of that proof.",
    keywords: ["results", "atar", "band 6", "success", "reviews", "proof"],
    popular: true,
    links: [{ label: "Success stories", href: "/success-stories" }],
  },
  {
    category: "results",
    question: "How do parents know if their child is improving?",
    answer:
      "Improvement is tracked through class performance, teacher feedback, assessment, and parent communication.",
    keywords: ["progress", "reports", "feedback", "improvement", "parents"],
  },
  {
    category: "results",
    question: "Do you guarantee marks?",
    answer:
      "We do not guarantee a specific mark because effort, attendance, practice, and school assessment conditions matter.",
    keywords: ["guarantee", "marks", "improve", "promise"],
  },
  {
    category: "safety",
    question: "Is DA Tuition safe for younger students?",
    answer:
      "Student safety is treated seriously, especially for younger students. Staff expectations, supervision, parent communication, and Working With Children Check requirements are part of how the centre operates.",
    keywords: ["safe", "safety", "younger", "child", "wwcc"],
    popular: true,
  },
  {
    category: "safety",
    question: "What should we do if our child is sick or misses class?",
    answer:
      "Keep sick children at home and contact us as early as possible. We can advise what catch-up support or materials are available.",
    keywords: ["sick", "miss class", "absence", "catch up", "make up"],
    links: [{ label: "Contact DA", href: "/#contact" }],
  },
];
const id = (q: string) =>
  `faq-${q
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
const filterDeskFAQs = (items: FAQ[], category: Category, query: string) => {
  const inCategory = items.filter((item) => category === "all" || item.category === category);
  const conceptsByCategory: Partial<Record<Category, string[]>> = { fees: ['pricing'], teachers: ['teachers'], safety: ['absence'], start: ['enrolment', 'interview'], classes: ['classes'], programs: ['mathematics'] };
  return searchRecords(inCategory.map((item) => ({ ...item, title: item.question, body: item.answer, concepts: conceptsByCategory[item.category] })), query);
};
const counts = faqs.reduce<Record<Category, number>>(
  (a, x) => ({ ...a, all: a.all + 1, [x.category]: a[x.category] + 1 }),
  {
    all: 0,
    start: 0,
    programs: 0,
    fees: 0,
    classes: 0,
    teachers: 0,
    results: 0,
    safety: 0,
  },
);
export default function FAQPage() {
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
  }, []);
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
                    {String(i).padStart(2, "0")}
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
                        <p>{x.answer}</p>
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
            <aside className="faq-editorial-help h-fit overflow-hidden bg-[#091a31] text-white">
              <img
                className="h-48 w-full object-cover"
                src="/images/faq/faq-human-answer-focus-with-tables.png"
                alt="A DA Tuition tutor and student working together"
              />
              <div className="p-6">
                <p className="text-xs font-black tracking-[.14em] text-[#e7ca73]">
                  THE HUMAN ANSWER DESK
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-none">
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
        <section className="faq-editorial-closing text-white">
          <div className="faq-editorial-closing-copy">
            <p className="text-xs font-black uppercase tracking-[.15em] text-[#e7ca73]">
              When a page is not enough
            </p>
            <h2 className="mt-4 max-w-xl font-serif text-[clamp(2.8rem,5vw,4.5rem)] leading-none tracking-[-.035em]">
              Some questions are easier answered together.
            </h2>
            <p className="mt-6 max-w-xl leading-7 text-white/75">
              Tell us what is on your mind and we’ll help you work out the most
              useful next step.
            </p>
            <Link
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c69a38] px-6 py-3 font-bold text-[#091a31]"
              to="/book-interview"
            >
              Book an interview <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <FooterNew />
    </div>
  );
}
