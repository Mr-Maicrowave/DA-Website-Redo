import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Play } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';
import SubjectHero from '@/components/subjects/SubjectHero';
import { featuredStudentStory, hasFeaturedVideo, startingPoints } from '@/data/why-da';

const STUDENT_GAINS = [
  {
    title: 'A voice of their own',
    body: 'They learn to ask a question, explain a method and contribute when an idea is still taking shape.',
  },
  {
    title: 'Habits that travel',
    body: 'Preparation, follow-through and a calmer way to approach difficult work become part of how they learn everywhere.',
  },
  {
    title: 'The courage to persist',
    body: 'Students discover that challenge is not a verdict on their ability. It is where capability is built.',
  },
  {
    title: 'People in their corner',
    body: 'Friendships and trusted tutors make it easier to take healthy risks, recover from a setback and keep aiming higher.',
  },
] as const;

const LIFE_AT_DA = [
  {
    moment: 'Arrive',
    title: 'Walk into a familiar room.',
    body: 'The welcome is real. Faces are familiar, names are remembered and students can settle before the work begins.',
    image: '/images/community/hallway_group.jpg',
    alt: 'Students arriving together at DA Tuition',
  },
  {
    moment: 'Feel known',
    title: 'Be seen as a whole person.',
    body: 'Tutors notice confidence as well as content, and understand the goals and pressures a student brings from school.',
    image: '/images/community/teacher_kids_warmth.jpg',
    alt: 'A DA tutor sharing a warm moment with students',
  },
  {
    moment: 'Be challenged',
    title: 'Do work worth being proud of.',
    body: 'Thoughtful teaching gives students enough support to start, and enough room to think for themselves.',
    image: '/images/community/class_induction.jpg',
    alt: 'Students working through a DA lesson together',
  },
  {
    moment: 'Grow',
    title: 'Notice what they can now do.',
    body: 'A clearer method, a raised hand, a better question: progress becomes visible in the way students carry themselves.',
    image: '/images/community/student_raising_hand.jpg',
    alt: 'A student raising their hand during a DA lesson',
  },
  {
    moment: 'Belong',
    title: 'Leave with more than a finished worksheet.',
    body: 'They leave with direction, encouragement and a community that expects good things from them.',
    image: '/images/community/teen_friends.jpg',
    alt: 'DA students spending time together between lessons',
  },
] as const;

export default function WhyChooseDA() {
  const [selectedStartingPointId, setSelectedStartingPointId] = useState(startingPoints[0].id);
  const selectedStartingPoint = startingPoints.find((point) => point.id === selectedStartingPointId) ?? startingPoints[0];

  return (
    <>
      <SEO
        title="The DA Difference | Teaching, Belonging and Confidence"
        description="Discover how DA Tuition combines careful small-group teaching, genuine tutor relationships and a welcoming environment to help students grow in confidence and results."
        canonicalUrl="/why-choose-da"
      />
      <NavigationNew />

      <main className="overflow-hidden bg-[#f8f7f3]">
        <SubjectHero
          eyebrow="The DA Difference"
          icon={Heart}
          headlineWhite="More than tutoring."
          headlineGold="A place they belong."
          subtext="Students learn best when they feel known, supported and capable. At DA, thoughtful teaching and a genuinely welcoming environment work together to build confidence that reaches far beyond the classroom."
          proofPills={['Small-group learning', 'Tutors who know them', 'Confidence that lasts']}
          exploreTargetId="why-students-thrive"
          placeholderLabel="DA Tuition classroom community"
          backgroundImageSrc="/images/community/class_hands_raised.jpg"
          backgroundImageAlt="DA Tuition students learning together in class"
          mobileBackgroundPosition="58% center"
        />

        <section id="why-students-thrive" className="relative bg-[#fbf8ef] px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
            <div>
              <p className="text-sm font-black text-[#a88314]">The DA Difference</p>
              <h2 className="mt-5 max-w-3xl font-serif text-4xl font-medium leading-[1.06] tracking-[-0.03em] text-[#071629] [text-wrap:balance] sm:text-5xl lg:text-6xl">
                A learning community where students are known, challenged and believed in.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#30445e] [text-wrap:pretty] sm:text-lg">
                DA is not simply somewhere to get through homework. It is a place for young people to build the confidence, habits and ambition that let academic growth mean something lasting.
              </p>
            </div>
            <div className="border-t border-[#c9a227]/70 pt-7 lg:pb-2">
              <p className="font-serif text-xl leading-8 text-[#19324d] sm:text-2xl sm:leading-9">
                Students learn to communicate, take responsibility, recover from a hard question, make friends and discover what they are capable of.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-7xl gap-5 sm:grid-cols-[1.08fr_0.92fr] lg:mt-16 lg:grid-cols-[1.32fr_0.68fr]">
            <figure className="overflow-hidden rounded-2xl bg-[#dce2df] shadow-[0_12px_28px_rgba(7,22,41,0.08)]">
              <img src="/images/community/tutor_one_on_one.jpg" alt="A DA tutor working closely with a student" className="h-[300px] w-full object-cover sm:h-[420px]" />
            </figure>
            <div className="grid gap-6 sm:grid-rows-[0.8fr_1.2fr]">
              <figure className="overflow-hidden rounded-2xl bg-[#dce2df] shadow-[0_12px_28px_rgba(7,22,41,0.08)]">
                <img src="/images/community/student_laptop_smile.jpg" alt="A student smiling while learning at DA" className="h-48 w-full object-cover sm:h-full" loading="lazy" />
              </figure>
              <p className="flex items-end rounded-2xl bg-[#e7dcc0] p-6 font-serif text-xl leading-8 text-[#19324d] sm:p-8 sm:text-2xl sm:leading-9">
                High expectations feel different when someone knows how to help you reach them.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#eee3c8] px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="text-sm font-black text-[#a88314]">Start where they are</p>
              <h2 className="mt-4 max-w-md font-serif text-4xl font-medium leading-[1.06] tracking-[-0.03em] text-[#071629] [text-wrap:balance] sm:text-5xl">What would help most right now?</h2>
              <p className="mt-5 max-w-md text-base leading-8 text-[#30445e]">Choose the thought that feels most familiar. There is no diagnosis here—just a glimpse of how DA could meet a student where they are.</p>

              <div className="mt-8 space-y-3" aria-label="Choose a starting point">
                {startingPoints.map((point) => {
                  const isSelected = point.id === selectedStartingPointId;
                  return (
                    <button
                      key={point.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedStartingPointId(point.id)}
                      className={`w-full rounded-xl px-5 py-4 text-left text-sm font-bold leading-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a88314] ${isSelected ? 'bg-[#173552] text-white' : 'bg-white/75 text-[#19324d] hover:bg-white'}`}
                    >
                      {point.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <article className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_28px_rgba(7,22,41,0.08)] sm:grid sm:grid-cols-[0.9fr_1.1fr]">
              <figure className="bg-[#dce2df]">
                <img src={selectedStartingPoint.image} alt={selectedStartingPoint.alt} className="h-64 w-full object-cover sm:h-full" />
              </figure>
              <div className="p-7 sm:p-9">
                <p className="text-sm font-black text-[#a88314]">How DA responds</p>
                <h3 className="mt-4 font-serif text-3xl leading-tight text-[#071629]">{selectedStartingPoint.responseHeading}</h3>
                <p className="mt-5 text-[15px] leading-7 text-[#40536a]">{selectedStartingPoint.response}</p>
                <Link to="/book-interview" className="mt-7 inline-flex items-center gap-2 border-b border-[#a88314] pb-2 text-sm font-black text-[#a88314] transition-colors hover:text-[#071629]">
                  Talk through this with us <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-[#102b47] px-5 py-20 text-white sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-black text-[#e4c76c]">Featured student film</p>
              <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.06] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">
                The people who live DA explain it best.
              </h2>
              <p className="mt-5 text-base leading-7 text-[#ccd6e1]">Students describe the support, friendships and confidence that make DA feel different from a tutoring service.</p>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl bg-[#173a5a] shadow-[0_16px_34px_rgba(4,15,29,0.2)] lg:mt-12">
              {hasFeaturedVideo(featuredStudentStory) ? (
                <video controls className="aspect-video w-full" aria-label={featuredStudentStory.title}>
                  <source src={featuredStudentStory.src} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center px-6 text-center sm:px-12">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#e4c76c] text-[#e4c76c]" aria-hidden="true"><Play className="ml-0.5 h-6 w-6" fill="currentColor" /></span>
                  <p className="mt-6 font-serif text-2xl text-white sm:text-4xl">Featured student story coming soon.</p>
                  <p className="mt-4 max-w-xl text-base leading-7 text-[#c5cfdb]">The film will be added here when the selected student story is ready to share.</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-5 border-t border-white/20 pt-6 sm:flex-row sm:items-start sm:justify-between">
              <p className="max-w-2xl text-sm leading-7 text-[#b9c6d4]">{featuredStudentStory.summary}</p>
              {featuredStudentStory.moreStudentStoriesUrl ? (
                <a href={featuredStudentStory.moreStudentStoriesUrl} className="inline-flex shrink-0 items-center gap-2 text-sm font-black text-[#e4c76c] hover:text-white">
                  More student stories <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f1e7] px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-24">
              <h2 className="max-w-xl font-serif text-4xl font-medium leading-[1.06] tracking-[-0.03em] text-[#071629] [text-wrap:balance] sm:text-5xl">What students gain here does not stop at the syllabus.</h2>
              <p className="max-w-xl text-base leading-8 text-[#30445e] sm:justify-self-end">It shows up in a student who can explain their thinking, plan their next move, face a setback with perspective and walk into the room knowing they belong there.</p>
            </div>

            <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
              <figure className="overflow-hidden rounded-2xl bg-[#dce2df] shadow-[0_12px_28px_rgba(7,22,41,0.08)]">
                <img src="/images/community/class_smiling_camera.jpg" alt="Students enjoying a lesson at DA Tuition" className="h-[330px] w-full object-cover sm:h-[440px] lg:h-full" loading="lazy" />
              </figure>
              <div className="grid gap-5 sm:grid-cols-2 lg:content-center">
                {STUDENT_GAINS.map((gain, index) => (
                  <article key={gain.title} className={`rounded-2xl p-6 ${index === 1 ? 'bg-[#e4d39e]' : index === 2 ? 'bg-[#dfe8e1]' : 'bg-white shadow-[0_8px_20px_rgba(7,22,41,0.06)]'}`}>
                    <h3 className="font-serif text-2xl leading-tight text-[#071629]">{gain.title}</h3>
                    <p className="mt-4 text-[15px] leading-7 text-[#30445e]">{gain.body}</p>
                  </article>
                ))}
                <figure className="overflow-hidden rounded-2xl bg-[#dce2df] sm:col-span-2">
                  <img src="/images/community/teen_girls_session.jpg" alt="Students collaborating during a DA session" className="h-40 w-full object-cover" loading="lazy" />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f8f7f3] px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black text-[#a88314]">Life at DA</p>
              <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.06] tracking-[-0.03em] text-[#071629] [text-wrap:balance] sm:text-5xl">A weekly rhythm that changes how students see themselves.</h2>
            </div>
            <ol className="mt-12 grid gap-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              {LIFE_AT_DA.map((chapter, index) => (
                <li key={chapter.moment} className="group">
                  <figure className="overflow-hidden rounded-2xl bg-[#dce2df] shadow-[0_10px_22px_rgba(7,22,41,0.07)]">
                    <img src={chapter.image} alt={chapter.alt} className="h-52 w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105 lg:h-56" loading="lazy" />
                  </figure>
                  <div className="mt-5 px-1">
                    <p className="text-sm font-black text-[#a88314]">{index + 1}. {chapter.moment}</p>
                    <h3 className="mt-2 font-serif text-xl leading-7 text-[#071629]">{chapter.title}</h3>
                    <p className="mt-3 text-[15px] leading-7 text-[#40536a]">{chapter.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#eef1ec] px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 border-b border-[#071629]/15 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <h2 className="max-w-3xl font-serif text-4xl font-medium leading-[1.06] tracking-[-0.03em] text-[#071629] [text-wrap:balance] sm:text-5xl">The proof is in the way students talk about their time here.</h2>
              <p className="max-w-lg text-base leading-8 text-[#40536a] lg:justify-self-end">Long after a lesson, students remember the people who made them feel capable enough to keep trying.</p>
            </div>
            <div className="grid gap-5 py-14 lg:grid-cols-12 lg:py-20">
              <blockquote className="rounded-2xl bg-[#173552] p-7 text-white shadow-[0_14px_30px_rgba(7,22,41,0.16)] sm:p-8 lg:col-span-7">
                <p className="font-serif text-2xl leading-[1.35] [text-wrap:pretty] sm:text-3xl lg:text-4xl">&ldquo;DA has created an inviting and comfortable environment that makes you look forward to learning.&rdquo;</p>
                <footer className="mt-9 border-t border-white/20 pt-5"><p className="font-black text-[#e4c76c]">Ellie Dang</p><p className="mt-1 text-sm text-[#c5cfdb]">DA student for eight years</p></footer>
              </blockquote>
              <figure className="overflow-hidden rounded-2xl lg:col-span-5"><img src="/images/community/tutor_mentor_girls.jpg" alt="A tutor mentoring students at DA" className="h-[330px] w-full object-cover lg:h-full" loading="lazy" /></figure>
              <blockquote className="rounded-2xl bg-white p-8 lg:col-span-5">
                <p className="font-serif text-2xl leading-[1.45] text-[#19324d] sm:text-3xl">&ldquo;He had both a calm and encouraging attitude that made me feel very comfortable.&rdquo;</p>
                <footer className="mt-7"><p className="font-black text-[#a88314]">Emma Thomas</p><p className="mt-1 text-sm text-[#52657b]">DA Mathematics student</p></footer>
              </blockquote>
              <div className="flex items-end lg:col-span-7 lg:justify-end"><Link to="/success-stories" className="inline-flex items-center gap-2 border-b border-[#a88314] pb-2 text-sm font-black text-[#a88314] transition-colors hover:text-[#071629]">Read more written stories <ArrowRight className="h-4 w-4" /></Link></div>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#071629]">
          <img src="/images/community/primary_colorful_class.jpg" alt="Students learning together at DA Tuition" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[#071629]/72" />
          <div className="relative mx-auto flex min-h-[460px] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center text-white sm:min-h-[520px]">
            <p className="text-sm font-black text-[#e4c76c]">A conversation about your child</p>
            <h2 className="mt-5 font-serif text-4xl font-medium leading-[1.06] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl lg:text-6xl">Let&apos;s talk about where they are now, and where they could grow.</h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#d4dce5] sm:text-lg">Bring your questions, concerns and hopes for your child. We will listen first, share how DA works, and help you decide whether it feels like the right fit. No pressure.</p>
            <Link to="/book-interview" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-8 py-4 text-sm font-black text-[#071629] transition-colors hover:bg-[#e0bd4b]">Book a conversation <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>

      <FooterNew />
    </>
  );
}
