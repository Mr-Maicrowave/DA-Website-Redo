import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TUTORS, FEATURED_IDS as _FI, getPhotoUrl, getPhotoStyle } from '@/data/teacherCatalogue';

const NAVY = '#0A1F3F';
const GOLD = '#D4AF37';
const a = (hex: string, alpha: string) => hex + alpha;

// King first, then Linda — swap from original order
const FEATURED_IDS = [_FI[1], _FI[0], _FI[2], _FI[3], _FI[4]];

// Crown heights only — no rotation
const CARD_CFG = [
  { height: '132%', delay: '0ms'   },
  { height: '148%', delay: '80ms'  },
  { height: '162%', delay: '160ms' },
  { height: '148%', delay: '240ms' },
  { height: '132%', delay: '320ms' },
];

const KEYFRAMES = `
  @keyframes teacherFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
`;

const subjectLabel = (subjects: string): string => {
  const parts: string[] = [];
  if (/Mathematics\s*\(Yr|Mathematics\s+(Standard|Advanced|Extension)/i.test(subjects)) parts.push('Mathematics');
  if (/English\s*\(Yr|English\s+(Standard|Advanced|Extension)/i.test(subjects)) parts.push('English');
  if (/chemistry|biology|science\s*\(yr/i.test(subjects)) parts.push('Science');
  if (/Business/i.test(subjects)) parts.push('Business');
  if (/Primary/i.test(subjects)) parts.push('Primary');
  return parts.slice(0, 2).join(' · ') || 'All subjects';
};

const TeachersPreview = () => {
  const featured = FEATURED_IDS
    .map(id => TUTORS.find(t => t.id === id))
    .filter(Boolean) as typeof TUTORS;

  return (
    <>
      <style>{KEYFRAMES}</style>

      <section
        id="teachers"
        className="relative py-20 overflow-hidden"
        style={{
          background:
            'linear-gradient(180deg, #f7f8ff 0%, rgba(10,31,63,0.05) 50%, #f7f8ff 100%)',
        }}
      >
        {/* ── Atmospheric glow blobs ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            style={{
              position: 'absolute',
              left: '6%',
              top: '15%',
              width: 340,
              height: 340,
              background:
                'radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)',
              filter: 'blur(55px)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '6%',
              top: '20%',
              width: 280,
              height: 280,
              background:
                'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)',
              filter: 'blur(55px)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '43%',
              bottom: '8%',
              width: 220,
              height: 220,
              background:
                'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)',
              filter: 'blur(40px)',
              borderRadius: '50%',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Section heading ── */}
          <div className="text-center max-w-3xl mx-auto mb-14">

            {/* Count chip */}
            <div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{
                border: '1px solid ' + a(GOLD, '55'),
                color: GOLD,
                background: a(NAVY, '08'),
              }}
            >
              ✦ {TUTORS.length} Educators &middot; All Subjects
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: NAVY }}>
              The People Behind{' '}
              <span
                style={{
                  background:
                    'linear-gradient(135deg, ' + NAVY + ' 0%, ' + GOLD + ' 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                the Results
              </span>
            </h2>

            {/* Decorative ruled divider */}
            <div className="flex items-center justify-center gap-3 my-4">
              <div
                style={{
                  height: 1,
                  width: 52,
                  background:
                    'linear-gradient(to right, transparent, ' + a(GOLD, '80') + ')',
                }}
              />
              <span style={{ color: GOLD, fontSize: 13 }}>✦</span>
              <div
                style={{
                  height: 1,
                  width: 52,
                  background:
                    'linear-gradient(to left, transparent, ' + a(GOLD, '80') + ')',
                }}
              />
            </div>

            <p className="text-lg" style={{ color: a(NAVY, 'bb') }}>
              Teachers who care as much about who your child is becoming as they do about grades.
            </p>
          </div>

          {/* ── Teacher cards — aligned to bottom so crown heights read upward ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-14 items-end">
            {featured.map((teacher, i) => {
              const cfg = CARD_CFG[i];

              return (
                <div
                  key={teacher.id}
                  style={{
                    animation:
                      'teacherFadeUp 0.6s ease-out ' + cfg.delay + ' both',
                  }}
                >
                  <Link
                    to="/find-teacher"
                    className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl"
                    style={{
                      background: NAVY,
                      boxShadow:
                        '0 0 0 1px rgba(212,175,55,0.28), 0 14px 44px rgba(10,31,63,0.38)',
                      transformOrigin: 'bottom center',
                    }}
                  >
                    {/* Photo area */}
                    <div
                      className="relative overflow-hidden"
                      style={{ paddingBottom: cfg.height }}
                    >
                      <img
                        src={getPhotoUrl(teacher)}
                        alt={teacher.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={getPhotoStyle(teacher)}
                      />
                      {/* Dark gradient overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to top, ' +
                            a(NAVY, 'f0') +
                            ' 0%, ' +
                            a(NAVY, '55') +
                            ' 38%, transparent 68%)',
                        }}
                      />
                      {/* Gold radial glow at bottom centre */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(212,175,55,0.22) 0%, transparent 70%)',
                        }}
                      />
                    </div>

                    {/* Text body — name first, designation below */}
                    <div className="p-4 flex flex-col gap-0.5 flex-1">

                      {/* Name — hero text */}
                      <h3
                        className="font-bold text-[16px] leading-snug"
                        style={{ color: '#ffffff' }}
                      >
                        {teacher.name}
                      </h3>

                      {/* Designation — subtitle in gold */}
                      <p
                        className="text-[9px] font-bold uppercase tracking-widest leading-tight mt-0.5"
                        style={{ color: GOLD }}
                      >
                        {teacher.designation}
                      </p>

                      {/* Tagline with sparkle */}
                      <p
                        className="text-[10px] leading-relaxed mt-2 line-clamp-2"
                        style={{ color: 'rgba(255,255,255,0.52)' }}
                      >
                        <span style={{ color: GOLD }}>✦</span>{' '}
                        {teacher.tagline}
                      </p>

                      {/* Subject label */}
                      <p
                        className="text-[10px] mt-auto pt-2 font-semibold tracking-wide"
                        style={{ color: a(GOLD, '99') }}
                      >
                        {subjectLabel(teacher.subjects)}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* ── CTA ── */}
          <div className="text-center">
            <Link
              to="/find-teacher"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: NAVY,
                color: GOLD,
                boxShadow: '0 4px 18px ' + a(NAVY, '40'),
              }}
            >
              Meet All Our Teachers
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-3 text-sm" style={{ color: a(NAVY, '80') }}>
              {TUTORS.length}+ expert educators across all subjects and year levels
            </p>
          </div>

        </div>
      </section>
    </>
  );
};

export default TeachersPreview;
