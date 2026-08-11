import { ArrowRight, Clock3, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const programPaths = [
  {
    years: 'K–6',
    title: 'Primary School',
    description: 'Build curiosity, confidence and strong foundations.',
    to: '/programs/primary-school',
  },
  {
    years: 'Y7–10',
    title: 'High School',
    description: 'Develop stronger habits before senior school begins.',
    to: '/programs/high-school',
  },
  {
    years: 'Y11–12',
    title: 'HSC Excellence',
    description: 'Prepare with purpose for the two years that matter most.',
    to: '/hsc-excellence',
  },
];

const subjectLinks = [
  { label: 'Mathematics', to: '/subjects/mathematics' },
  { label: 'English', to: '/subjects/english' },
  { label: 'Science', to: '/subjects/science' },
  { label: 'Business Studies', to: '/subjects/business-studies' },
  { label: 'Legal Studies', to: '/subjects/legal-studies' },
];

const exploreLinks = [
  { label: 'Our Approach', to: '/our-approach' },
  { label: 'Our Teachers', to: '/our-teachers' },
  { label: 'Success Stories', to: '/success-stories' },
  { label: 'Articles & Guides', to: '/articles' },
  { label: 'FAQ', to: '/faq' },
];

const HomeFooterTrial = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#071629] text-[#edf3f8]" aria-label="DA Tuition footer">
      <section className="mx-auto grid max-w-7xl items-center gap-7 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_auto] lg:px-10">
        <div className="grid grid-cols-[34px_1fr] gap-4">
          <span className="mt-4 h-0.5 w-7 bg-[#d9ae2a]" aria-hidden="true" />
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[#d9ae2a]">DA Tuition, Canley Heights</p>
            <h2 className="max-w-2xl font-serif text-3xl leading-none tracking-[-0.03em] text-white sm:text-4xl">
              A clearer academic path starts with one conversation.
            </h2>
          </div>
        </div>
        <Link
          to="/book-interview"
          className="inline-flex w-fit items-center gap-2 rounded-md bg-[#d9ae2a] px-5 py-3.5 text-sm font-extrabold text-[#071629] transition-colors hover:bg-[#efc64a]"
        >
          Book a consultation <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <div className="border-t border-white/15">
        <div className="mx-auto grid max-w-7xl gap-11 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(15rem,.8fr)_minmax(0,1.25fr)] lg:px-10">
          <section>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.1em] text-[#d9ae2a]">Visit DA Tuition</p>
            <h3 className="mb-3 max-w-sm font-serif text-3xl leading-tight tracking-[-0.025em] text-white">
              Local support, built around each student.
            </h3>
            <p className="mb-6 max-w-sm text-[15px] leading-6 text-[#b4c2d0]">
              Find us in Canley Heights for small-group learning, clear feedback and a considered next step.
            </p>
            <div className="grid gap-3 text-[15px] leading-6">
              <a href="tel:0401940207" className="flex gap-3 text-white transition-colors hover:text-[#d9ae2a]">
                <Phone size={18} className="mt-1 shrink-0 text-[#d9ae2a]" aria-hidden="true" />
                <span>0401 940 207</span>
              </a>
              <Link to="/tutoring-canley-heights" className="flex gap-3 text-white transition-colors hover:text-[#d9ae2a]">
                <MapPin size={18} className="mt-1 shrink-0 text-[#d9ae2a]" aria-hidden="true" />
                <span>Level 1/229 Canley Vale Rd, Canley Heights NSW 2166</span>
              </Link>
              <div className="flex gap-3 text-[#b4c2d0]">
                <Clock3 size={18} className="mt-1 shrink-0 text-[#d9ae2a]" aria-hidden="true" />
                <span>Tue–Fri 5–9pm · Sat 9am–6pm · Sun 10am–7pm</span>
              </div>
            </div>
          </section>

          <nav aria-label="Choose a program">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.1em] text-[#d9ae2a]">Find the right starting point</p>
            <h3 className="mb-6 max-w-xl font-serif text-3xl leading-tight tracking-[-0.025em] text-white">
              Every stage needs a different kind of support.
            </h3>
            <div className="border-t border-white/15">
              {programPaths.map((program) => (
                <Link
                  key={program.to}
                  to={program.to}
                  className="grid grid-cols-[54px_minmax(0,1fr)_20px] items-center gap-x-3 border-b border-white/15 py-4 transition-colors hover:text-[#d9ae2a] sm:grid-cols-[68px_minmax(120px,.7fr)_minmax(160px,1.2fr)_20px] sm:gap-x-5"
                >
                  <span className="text-xs font-extrabold tracking-[0.08em] text-[#d9ae2a]">{program.years}</span>
                  <span className="text-base font-bold text-white">{program.title}</span>
                  <span className="hidden text-sm leading-5 text-[#b4c2d0] sm:block">{program.description}</span>
                  <ArrowRight size={20} className="justify-self-end text-[#d9ae2a]" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 md:grid-cols-[1.35fr_1fr] lg:px-10">
          <nav aria-label="Explore subjects">
            <h3 className="mb-4 text-[15px] font-bold text-white">Explore subjects</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {subjectLinks.map((link) => <Link key={link.to} to={link.to} className="text-[15px] text-[#b4c2d0] transition-colors hover:text-[#d9ae2a]">{link.label}</Link>)}
            </div>
          </nav>
          <nav aria-label="Explore DA Tuition">
            <h3 className="mb-4 text-[15px] font-bold text-white">Keep exploring</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {exploreLinks.map((link) => <Link key={link.to} to={link.to} className="text-[15px] text-[#b4c2d0] transition-colors hover:text-[#d9ae2a]">{link.label}</Link>)}
            </div>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-7xl px-5 py-6 text-sm text-[#91a3b5] sm:px-8 lg:px-10">© {currentYear} DA Tuition. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default HomeFooterTrial;
