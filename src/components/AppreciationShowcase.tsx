import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { sectionizeMarkdown } from '@/lib/markdown/sectionize'
import FeaturedStory from './appreciation/FeaturedStory'

interface ManifestItem {
  filename: string
  slug: string
  name: string
}

interface StudentCardData {
  slug: string
  name: string
  appreciation?: string
  advice?: string
}

function extractSection(markdown: string, title: string): string | undefined {
  // Split by H2 and find section starting with the desired heading
  const sections = sectionizeMarkdown(markdown, { splitBy: 'h2' })
  const match = sections.find((s) => /^##\s+/.test(s) && s.toLowerCase().startsWith(`## ${title}`.toLowerCase()))
  if (!match) return undefined
  // Drop the top H2 line for concise rendering in cards
  return match.replace(/^##\s+.*\n?/, '').trim()
}

export default function AppreciationShowcase() {
  const [items, setItems] = useState<StudentCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [featuredIndex, setFeaturedIndex] = useState(0)

  useEffect(() => {
    const run = async () => {
      try {
        const manifestRes = await fetch('/Appreciation%20and%20advice/index.json')
        const manifest: ManifestItem[] = await manifestRes.json()
        const subset = manifest.slice(0, 9) // Get 9 items: 1 featured + 8 grid
        const loaded: StudentCardData[] = []
        for (const m of subset) {
          const url = `/Appreciation%20and%20advice/${encodeURIComponent(m.filename)}`
          const md = await fetch(url).then((r) => r.text())
          const appreciation = extractSection(md, 'Appreciation')
          const advice = extractSection(md, 'Advice')
          loaded.push({ slug: m.slug, name: m.name, appreciation, advice })
        }
        setItems(loaded)
        // Randomly select a featured student
        setFeaturedIndex(Math.floor(Math.random() * Math.min(3, loaded.length)))
      } catch (e) {
        console.error('Failed to load appreciation showcase:', e)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  // Filter items with content and get featured item
  const validItems = items.filter((it) => it.appreciation || it.advice)
  const featuredItem = validItems[featuredIndex]

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!validItems.length) return null

  return (
    <section className="relative py-12 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-midnight mb-3">
            Student <span className="gradient-text">Appreciation & Advice</span>
          </h2>
          <p className="text-lg text-brand-midnight/80 max-w-2xl mx-auto">
            Hear from our successful students about their journey and the advice they have for others
          </p>
        </div>

        {/* Featured Story */}
        {featuredItem && (
          <div className="mb-8 animate-fade-in">
            <FeaturedStory
              name={featuredItem.name}
              appreciation={featuredItem.appreciation}
              advice={featuredItem.advice}
              achievements={[
                "Consistent 1st place in tests",
                "100% on 3 exams",
                "99% average in maths"
              ]}
            />
          </div>
        )}


        {/* Call to Action */}
        <div className="text-center">
          <Link to="/appreciation-advice">
            <Button size="lg" className="btn-primary group">
              Read All Student Stories
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-brand-midnight/80">
            Discover how DA Tuition has helped {validItems.length}+ students achieve their goals
          </p>
        </div>
      </div>
    </section>
  )
}
