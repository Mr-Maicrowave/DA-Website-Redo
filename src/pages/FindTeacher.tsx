import React, { useState, useMemo, useEffect } from 'react';
import { X, ArrowRight, Search, ChevronRight } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';
import {
  TUTORS,
  type CatalogueTutor,
  getPhotoUrl,
  getPhotoStyle,
  teachesEnglish,
  teachesMath,
  teachesScience,
} from '@/data/teacherCatalogue';

const NAVY = '#0A1F3F';
const GOLD = '#D4AF37';
const a = (hex: string, alpha: string) => hex + alpha;

function subjectPills(subjects: string): string[] {
  const result: string[] = [];
  const s = subjects || '';
  if (/Primary/i.test(s)) result.push('Primary');
  if (/English\s*\(Yr/i.test(s)) result.push('English Yr 7-10');
  if (/English Standard/i.test(s)) result.push('Eng Standard');
  if (/English Advanced/i.test(s)) result.push('Eng Advanced');
  if (/English Extension 1/i.test(s)) result.push('Eng Ext 1');
  if (/English Extension 2/i.test(s)) result.push('Eng Ext 2');
  if (/Mathematics\s*\(Yr/i.test(s)) result.push('Maths Yr 7-10');
  if (/Mathematics Standard/i.test(s)) result.push('Maths Standard');
  if (/Mathematics Advanced/i.test(s)) result.push('Maths Advanced');
  if (/Mathematics Extension 1/i.test(s)) result.push('Maths Ext 1');
  if (/Mathematics Extension 2/i.test(s)) result.push('Maths Ext 2');
  if (/Chemistry/i.test(s)) result.push('Chemistry');
  if (/Biology/i.test(s)) result.push('Biology');
  if (/Science\s*\(Yr/i.test(s)) result.push('Science Yr 7-10');
  if (/Business Studies/i.test(s)) result.push('Business Studies');
  if (/Legal Studies/i.test(s)) result.push('Legal Studies');
  return result;
}

type FilterKey = 'all' | 'english' | 'maths' | 'science' | 'primary';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All Teachers' },
  { key: 'english', label: 'English' },
  { key: 'maths', label: 'Mathematics' },
  { key: 'science', label: 'Science' },
  { key: 'primary', label: 'Primary' },
];

type ProfileTab = 'about' | 'teaching' | 'subjects';

const ProfileModal = ({
  teacher,
  onClose,
}: {
  teacher: CatalogueTutor;
  onClose: () => void;
}) => {
  const [tab, setTab] = useState<ProfileTab>('about');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const pills = subjectPills(teacher.subjects);

  const TABS: { key: ProfileTab; label: string }[] = [
    { key: 'about', label: 'About' },
    { key: 'teaching', label: 'Teaching style' },
    { key: 'subjects', label: 'Subjects' },
  ];

  const tierLabel = teacher.tier === 'senior'
    ? 'Senior Educator'
    : teacher.tier === 'mid'
    ? 'Experienced Educator'
    : 'Educator';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[88vh] overflow-hidden rounded-t-3xl sm:rounded-3xl flex flex-col"
        style={{ background: '#ffffff' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-52 sm:h-64 flex-shrink-0 overflow-hidden">
          <img
            src={getPhotoUrl(teacher)}
            alt={teacher.name}
            className="w-full h-full object-cover"
            style={getPhotoStyle(teacher)}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, ' + a(NAVY, 'f5') + ' 0%, ' + a(NAVY, '80') + ' 50%, transparent 80%)',
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="absolute bottom-4 left-5 right-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: GOLD }}>
              {teacher.designation}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {teacher.name}
            </h2>
          </div>
        </div>

        <div className="flex border-b flex-shrink-0" style={{ borderColor: a(NAVY, '18') }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 py-3 text-sm font-semibold transition-colors"
              style={{
                color: tab === t.key ? NAVY : a(NAVY, '80'),
                borderBottom: tab === t.key ? '2px solid ' + GOLD : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {tab === 'about' && (
            <div className="space-y-5">
              <blockquote
                className="text-base sm:text-lg font-medium leading-relaxed italic border-l-4 pl-4"
                style={{ color: NAVY, borderColor: GOLD }}
              >
                "{teacher.tagline}"
              </blockquote>
              {teacher.profile && (
                <>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>
                      Why DA?
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: a(NAVY, 'cc') }}>
                      {teacher.profile.whyDA}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>
                      What I hope to achieve
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: a(NAVY, 'cc') }}>
                      {teacher.profile.goals}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>
                      How students remember me
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: a(NAVY, 'cc') }}>
                      {teacher.profile.remembered}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === 'teaching' && (
            <div className="space-y-5">
              <div className="rounded-xl p-4" style={{ background: a(NAVY, '08') }}>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>
                  Personal motto
                </h4>
                <p className="text-sm font-medium italic leading-relaxed" style={{ color: NAVY }}>
                  "{teacher.motto}"
                </p>
              </div>
              {teacher.profile?.tags && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
                    At a glance
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.profile.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ background: a(NAVY, '12'), color: NAVY }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: a(GOLD, '18') }}
              >
                <span className="text-2xl">&#127891;</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: a(NAVY, '80') }}>
                    Experience level
                  </p>
                  <p className="text-sm font-semibold capitalize" style={{ color: NAVY }}>
                    {tierLabel}
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === 'subjects' && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: a(NAVY, '99') }}>
                {teacher.name.split(' ')[0]} teaches across the following areas:
              </p>
              <div className="flex flex-wrap gap-2">
                {pills.map(pill => (
                  <span
                    key={pill}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: NAVY, color: GOLD }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <div
                className="mt-6 rounded-xl p-4 text-center"
                style={{ background: a(NAVY, '08'), border: '1px solid ' + a(NAVY, '14') }}
              >
                <p className="text-sm font-medium mb-3" style={{ color: NAVY }}>
                  Want to check availability?
                </p>
                <a
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ background: NAVY, color: GOLD }}
                >
                  Book a consultation
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TutorCard = ({
  teacher,
  onClick,
}: {
  teacher: CatalogueTutor;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="group text-left flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full"
    style={{ background: NAVY }}
  >
    <div className="relative overflow-hidden" style={{ paddingBottom: '115%' }}>
      <img
        src={getPhotoUrl(teacher)}
        alt={teacher.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={getPhotoStyle(teacher)}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, ' + a(NAVY, 'f0') + ' 0%, ' + a(NAVY, '50') + ' 45%, transparent 70%)',
        }}
      />
      {teacher.tier === 'senior' && (
        <span
          className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: GOLD, color: NAVY }}
        >
          Senior
        </span>
      )}
    </div>
    <div className="p-3.5 flex flex-col gap-1">
      <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>
        {teacher.designation}
      </p>
      <h3 className="font-bold text-sm leading-snug text-white">
        {teacher.name}
      </h3>
      <p className="text-[11px] leading-snug mt-0.5 line-clamp-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {teacher.tagline}
      </p>
      <div className="flex items-center gap-1 mt-1.5" style={{ color: a(GOLD, '99') }}>
        <span className="text-[10px] font-medium">View profile</span>
        <ChevronRight className="w-3 h-3" />
      </div>
    </div>
  </button>
);

const FindTeacher = () => {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CatalogueTutor | null>(null);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  const filtered = useMemo(() => {
    let list = [...TUTORS];
    if (filter === 'english') list = list.filter(teachesEnglish);
    else if (filter === 'maths') list = list.filter(teachesMath);
    else if (filter === 'science') list = list.filter(teachesScience);
    else if (filter === 'primary') list = list.filter(t => t.hasPrimary);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.designation.toLowerCase().includes(q) ||
          t.subjects.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, search]);

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f5' }}>
      <SEO
        title="Find a Tutor"
        description="Browse our team of 40+ expert educators and find the perfect match for your child. DA Tuition, Canley Heights."
        canonicalUrl="/find-teacher"
      />
      <NavigationNew />

      <div className="pt-28 pb-14 px-4 text-center" style={{ background: NAVY }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
            Meet the team
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Find Your Perfect Tutor
          </h1>
          <p className="text-base sm:text-lg mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Over 40 educators, each with their own approach. Browse until one feels right.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: a(NAVY, '80') }} />
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full text-sm outline-none border-0"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', caretColor: GOLD }}
            />
          </div>
        </div>
      </div>

      <div
        className="sticky top-[72px] z-30 py-3 px-4 overflow-x-auto"
        style={{ background: NAVY, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex gap-2 justify-center min-w-max mx-auto">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap"
              style={{
                background: filter === f.key ? GOLD : 'rgba(255,255,255,0.08)',
                color: filter === f.key ? NAVY : 'rgba(255,255,255,0.75)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium" style={{ color: a(NAVY, '80') }}>
              No teachers found.{' '}
              <button
                onClick={() => { setFilter('all'); setSearch(''); }}
                style={{ color: NAVY }}
                className="underline"
              >
                Clear filters
              </button>
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-6" style={{ color: a(NAVY, '70') }}>
              Showing {filtered.length} educator{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(teacher => (
                <TutorCard
                  key={teacher.id}
                  teacher={teacher}
                  onClick={() => setSelected(teacher)}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-16 rounded-2xl p-8 text-center" style={{ background: NAVY }}>
          <h3 className="text-xl font-bold text-white mb-2">
            Not sure who is right for your child?
          </h3>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Our team can help match your child to the right tutor based on needs, personality, and goals.
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-85"
            style={{ background: GOLD, color: NAVY }}
          >
            Request a teacher match
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <FooterNew />

      {selected && (
        <ProfileModal teacher={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default FindTeacher;
