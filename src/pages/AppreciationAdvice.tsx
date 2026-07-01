import { useEffect, useRef, useState } from 'react'
import NavigationNew from '@/components/NavigationNew'
import FooterNew from '@/components/FooterNew'
import SEO from '@/components/SEO'
import CTASection from '@/components/CTASection'
import { sectionizeMarkdown } from '@/lib/markdown/sectionize'
import { Heart, Trophy, Star, CheckCircle } from 'lucide-react'
import { StudentAppreciationCard } from '@/components/StudentAppreciationCard'

interface ManifestItem {
  filename: string
  slug: string
  name: string
}

interface StudentData {
  slug: string
  name: string
  appreciation?: string
  advice?: string
}

function extractSection(markdown: string, title: string): string | undefined {
  const sections = sectionizeMarkdown(markdown, { splitBy: 'h2' })
  const match = sections.find((s) => /^##\s+/.test(s) && s.toLowerCase().startsWith(`## ${title}`.toLowerCase()))
  if (!match) return undefined
  return match.replace(/^##\s+.*\n?/, '').trim()
}

function useInView<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function AppreciationAdvice() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        const manifestRes = await fetch('/Appreciation%20and%20advice/index.json')
        const manifest: ManifestItem[] = await manifestRes.json()
        const loaded: StudentData[] = []
        for (const m of manifest) {
          const url = `/Appreciation%20and%20advice/${encodeURIComponent(m.filename)}`
          const md = await fetch(url).then((r) => r.text())
          const appreciation = extractSection(md, 'Appreciation')
          const advice = extractSection(md, 'Advice')
          loaded.push({ slug: m.slug, name: m.name, appreciation, advice })
        }
        setStudents(loaded)
      } catch (e) {
        console.error('Failed to load Appreciation & Advice page:', e)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO
        title="Student Appreciation & Advice | Wisdom from High Achievers"
        description="Read heartfelt messages of appreciation and academic advice from DA Tuition's highest-achieving students. Discover the mindset of excellence."
      />
      <NavigationNew />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
        <div className="absolute inset-0">
          <img
            src="/images/programs/primary-tutor-1on1-2.jpg"
            alt="Student Appreciation"
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-5 pb-24 text-center lg:px-8 lg:pb-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
            <Heart className="h-4 w-4 fill-[#f1df9a]" />
            In Their Own Words
          </div>

          <h1 className="mx-auto max-w-3xl font-serif text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Appreciation <span className="bg-gradient-to-r from-[#c9a227] to-[#f1df9a] bg-clip-text text-transparent">&amp; Advice</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75">
            Wisdom passed down from our highest achievers to the next generation of learners.
          </p>
        </div>
      </section>

      {/* ── Intro Philosophy Section ── */}
      <section className="bg-[#fff6e7] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] border border-[#071629]/8 bg-[#fffdf8] shadow-lg shadow-[#071629]/5">
          <div className="grid md:grid-cols-[1.5fr,1fr]">
            <div className="p-8 md:p-12">
              <div className="mb-6 flex items-center gap-3">
                <Trophy className="h-5 w-5 text-[#c9a227]" />
                <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] text-[#071629]">The High Achiever Mindset</h2>
              </div>

              <div className="prose prose-lg mb-8 max-w-none text-[#61708a]">
                <p>
                  Coming first in one exam is tough. Consistently topping the class? That's a craft.
                  The students featured below didn't rely on luck. They relied on <strong className="text-[#10233f]">discipline, strategy, and resilience.</strong>
                </p>
                <p>
                  They maximized every tool, asked every question, and treated every lesson with intent.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Using provided help to its full potential",
                  "Spending time where it matters most",
                  "Treating revision like the real exam",
                  "Turning tutor advice into immediate action"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-[#c9a227]" />
                    <span className="font-medium text-[#10233f]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center border-t border-[#071629]/8 bg-[#071629] p-8 md:border-l md:border-t-0 md:p-12">
              <blockquote className="mb-6 font-serif text-2xl font-medium italic leading-relaxed text-white">
                "Success doesn't happen by chance; it's earned. These students prove that excellence is a habit, not a gift."
              </blockquote>
              <div className="flex items-center gap-2 font-semibold text-[#f1df9a]">
                <Star className="h-5 w-5 fill-[#f1df9a] text-[#f1df9a]" />
                DA Tuition Excellence Team
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Student Cards List ── */}
      <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Student Voices</p>
            <h2 className="font-serif text-3xl font-medium tracking-[-0.03em] text-[#071629] md:text-4xl">
              A Thread of Gratitude
            </h2>
            <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#c9a227] to-[#f1df9a]" />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#c9a227]/20 border-t-[#c9a227]"></div>
              <p className="text-[#61708a]">Loading wisdom...</p>
            </div>
          ) : (
            <div className="relative">
              {/* center timeline line — desktop only */}
              <div className="hidden md:block absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-gradient-to-b from-[#c9a227]/30 via-[#c9a227]/15 to-transparent" />

              <div className="space-y-12 md:space-y-16">
                {students.map((student, index) => (
                  <Reveal key={student.slug} delay={(index % 4) * 90}>
                    <StudentAppreciationCard student={student} index={index} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CTASection
        heading="Start Your Own Success Story"
        subheading="Let our exceptional educators guide you to your full potential. Book your assessment today."
        className="bg-[#071629]"
      />

      <FooterNew />
    </div>
  )
}
