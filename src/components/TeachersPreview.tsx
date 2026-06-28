import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TUTORS, FEATURED_IDS, getPhotoUrl, getPhotoStyle } from '@/data/teacherCatalogue';

const NAVY = '#0A1F3F';
const GOLD = '#D4AF37';
const a = (hex: string, alpha: string) => hex + alpha;

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
  const featured = FEATURED_IDS.map(id => TUTORS.find(t => t.id === id)).filter(Boolean) as typeof TUTORS;

  return (
    <section id="teachers" className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: NAVY }}>
            The People Behind the Results
          </h2>
          <p className="text-lg" style={{ color: a(NAVY, 'bb') }}>
            Teachers who care as much about who your child is becoming as they do about grades.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 mb-10">
          {featured.map((teacher) => (
            <Link
              key={teacher.id}
              to="/find-teacher"
              className="group flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ background: NAVY }}
            >
              <div className="relative overflow-hidden" style={{ paddingBottom: '120%' }}>
                <img
                  src={getPhotoUrl(teacher)}
                  alt={teacher.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={getPhotoStyle(teacher)}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, ' + a(NAVY, 'f0') + ' 0%, ' + a(NAVY, '60') + ' 40%, transparent 70%)',
                  }}
                />
              </div>

              <div className="p-4 flex flex-col gap-1 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: GOLD }}>
                  {teacher.designation}
                </p>
                <h3 className="font-bold text-sm leading-snug" style={{ color: '#ffffff' }}>
                  {teacher.name}
                </h3>
                <p className="text-[11px] leading-relaxed mt-1 line-clamp-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {teacher.tagline}
                </p>
                <p className="text-[10px] mt-auto pt-2 font-medium" style={{ color: a(GOLD, 'aa') }}>
                  {subjectLabel(teacher.subjects)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/find-teacher"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:shadow-lg"
            style={{ background: NAVY, color: GOLD, boxShadow: '0 4px 18px ' + a(NAVY, '40') }}
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
  );
};

export default TeachersPreview;
