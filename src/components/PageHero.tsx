import React from 'react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  children?: React.ReactNode;
}

const PageHero = ({
  title,
  subtitle,
  image,
  imageAlt = "",
  gradientFrom = "from-brand-navy/90",
  gradientVia = "via-sky-500/30",
  gradientTo = "to-blue-400/40",
  children,
}: PageHeroProps) => {
  return (
    <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
      <div className="absolute inset-0">
        <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
        <div className={`absolute inset-0 bg-gradient-to-tr ${gradientFrom} ${gradientVia} ${gradientTo} mix-blend-overlay`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/60 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center py-20 px-4 sm:px-6 lg:py-28">
        <h1
          className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        {subtitle && (
          <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md font-medium">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </section>
  );
};

export default PageHero;
