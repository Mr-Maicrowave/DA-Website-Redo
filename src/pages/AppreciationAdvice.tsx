import { useEffect, useState } from 'react'
import NavigationNew from '@/components/NavigationNew'
import FooterNew from '@/components/FooterNew'
import SEO from '@/components/SEO'
import CTASection from '@/components/CTASection'
import { sectionizeMarkdown } from '@/lib/markdown/sectionize'
import { Heart, Sparkles, Trophy, Star, CheckCircle } from 'lucide-react'
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
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <SEO 
        title="Student Appreciation & Advice | Wisdom from High Achievers"
        description="Read heartfelt messages of appreciation and academic advice from DA Tuition's highest-achieving students. Discover the mindset of excellence."
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/smiling_teacher.jpg" alt="Student Appreciation" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-purple-500/30 to-pink-400/40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 shadow-sm">
              <Heart className="w-8 h-8 text-pink-300 fill-pink-300 animate-pulse-gentle" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Appreciation <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">&</span> Advice
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
              Wisdom passed down from our highest achievers to the next generation of learners.
            </p>
          </div>
        </section>
      </div>

      {/* Intro Philosophy Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid md:grid-cols-[1.5fr,1fr]">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-bold text-brand-midnight">The High Achiever Mindset</h2>
              </div>

              <div className="prose prose-lg text-brand-midnight/80 mb-8">
                <p>
                  Coming first in one exam is tough. Consistently topping the class? That's a craft.
                  The students featured below didn't rely on luck. They relied on <strong>discipline, strategy, and resilience.</strong>
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
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                    <span className="text-brand-midnight/80 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 md:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100">
              <blockquote className="text-2xl font-serif italic text-amber-900 leading-relaxed mb-6">
                "Success doesn’t happen by chance; it’s earned. These students prove that excellence is a habit, not a gift."
              </blockquote>
              <div className="flex items-center gap-2 text-amber-700 font-semibold">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                DA Tuition Excellence Team
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Cards List */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-brand-midnight/70">Loading wisdom...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {students.map((student, index) => (
              <StudentAppreciationCard
                key={student.slug}
                student={student}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      <CTASection 
        heading="Start Your Own Success Story"
        subheading="Let our exceptional educators guide you to your full potential. Book your assessment today."
        className="bg-brand-navy"
      />

      <FooterNew />
    </div>
  )
}
