import React from 'react';

interface TrustedSchoolsStripProps {
  schools: TrustedSchool[];
  eyebrow?: string;
  className?: string;
}

export interface TrustedSchool {
  name: string;
  logoSrc?: string;
}

const crestTones = [
  'bg-emerald-50 border-emerald-600 text-emerald-700',
  'bg-sky-50 border-sky-700 text-sky-800',
  'bg-rose-50 border-rose-700 text-rose-800',
  'bg-amber-50 border-amber-600 text-amber-700',
  'bg-indigo-50 border-indigo-700 text-indigo-800',
  'bg-teal-50 border-teal-700 text-teal-800',
  'bg-slate-50 border-slate-700 text-slate-800',
];

const ignoredInitialWords = new Set([
  'and',
  'the',
  'of',
  'high',
  'school',
  'college',
  'catholic',
]);

const getInitials = (school: string) => {
  const significantWords = school
    .replace(/&/g, ' ')
    .replace(/-/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !ignoredInitialWords.has(word.toLowerCase()));

  const initials = significantWords
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

  return initials || school.slice(0, 2).toUpperCase();
};

const TrustedSchoolsStrip = ({
  schools,
  eyebrow = 'Trusted by students from',
  className = '',
}: TrustedSchoolsStripProps) => {
  const renderSchool = (school: TrustedSchool, index: number) => {
    const tone = crestTones[index % crestTones.length];

    return (
      <div
        key={school.name}
        className="flex min-w-[282px] shrink-0 items-center gap-4 sm:min-w-[330px]"
      >
        {school.logoSrc ? (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
            <img
              src={school.logoSrc}
              alt={`${school.name} logo`}
              className="h-full w-full object-contain"
            />
          </span>
        ) : (
          <span
            className={`relative flex h-12 w-12 shrink-0 items-center justify-center border shadow-sm ${tone} trusted-schools-crest`}
          >
            <span className="absolute inset-x-3 top-2 h-px bg-current/25" />
            <span className="text-[13px] font-black tracking-[0.08em]">
              {getInitials(school.name)}
            </span>
          </span>
        )}
        <span className="text-base font-semibold leading-tight text-brand-midnight sm:text-lg">
          {school.name}
        </span>
      </div>
    );
  };

  return (
    <section
      className={`trusted-schools-strip border-y border-slate-200 bg-white ${className}`}
      aria-label={eyebrow}
    >
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center gap-4">
          <p className="shrink-0 text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
            {eyebrow}
          </p>
          <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
        </div>

        <div className="-mx-5 overflow-hidden sm:-mx-6 lg:-mx-8 trusted-schools-marquee">
          <div className="flex w-max will-change-transform trusted-schools-track">
            <div className="flex shrink-0 gap-10 px-5 sm:gap-14 sm:px-6 lg:px-8">
              {schools.map(renderSchool)}
            </div>
            <div
              className="flex shrink-0 gap-10 px-5 sm:gap-14 sm:px-6 lg:px-8"
              aria-hidden="true"
            >
              {schools.map(renderSchool)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedSchoolsStrip;
