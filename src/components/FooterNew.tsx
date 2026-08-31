import { Clock3, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

import { contactInfo } from '@/data/business-info';
import { footerConfig, type FooterLink } from '@/components/footer/footer-config';

const linkClass =
  'inline-flex min-h-11 min-w-11 items-center text-[15px] leading-6 text-[#243a54] transition-colors duration-200 hover:text-[#765416] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-4 focus-visible:ring-offset-[#e9d8c8] lg:min-h-8';

const FooterHeading = ({ id, children }: { id: string; children: string }) => (
  <h2
    id={id}
    className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#765416] lg:mb-3"
  >
    {children}
  </h2>
);

const FooterNavigation = ({
  id,
  title,
  links,
}: {
  id: string;
  title: string;
  links: readonly FooterLink[];
}) => (
  <nav aria-labelledby={id}>
    <FooterHeading id={id}>{title}</FooterHeading>
    <ul className="space-y-1">
      {links.map((link) => (
        <li key={link.to}>
          <Link to={link.to} className={linkClass}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

const FooterNew = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative z-site-footer bg-[#e9d8c8] font-sans text-brand-navy"
      aria-label="DA Tuition footer"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-11 px-5 pb-12 pt-16 sm:grid-cols-2 sm:px-8 sm:pb-14 sm:pt-[4.5rem] lg:grid-cols-[1.35fr_0.85fr_0.9fr_1.25fr] lg:gap-x-16 lg:px-8 lg:pb-12 lg:pt-16">
        <section aria-label="DA Tuition">
          <Link
            to="/"
            className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-4 focus-visible:ring-offset-[#e9d8c8]"
          >
            <span className="flex h-40 w-40 items-center justify-start">
              <img
                src={footerConfig.logo.src}
                alt={footerConfig.logo.alt}
                width="1254"
                height="1254"
                className="h-full w-full object-contain object-left"
                loading="lazy"
                decoding="async"
              />
            </span>
          </Link>
          <p className="mt-5 max-w-[15rem] font-serif text-[17px] leading-7 text-[#40546a]">
            Local support, built around each student.
          </p>
          <Link
            to={footerConfig.primaryAction.to}
            className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-sm bg-brand-navy px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#f6ead8] transition-colors duration-200 hover:bg-[#243a54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-4 focus-visible:ring-offset-[#e9d8c8]"
          >
            {footerConfig.primaryAction.label}
            <span className="text-[#d6ad4b]" aria-hidden="true">→</span>
          </Link>
        </section>

        <FooterNavigation
          id="footer-explore-heading"
          title="Explore"
          links={footerConfig.explore}
        />

        <FooterNavigation
          id="footer-subjects-heading"
          title="Subjects"
          links={footerConfig.subjects}
        />

        <section aria-labelledby="footer-visit-heading">
          <FooterHeading id="footer-visit-heading">Visit DA Tuition</FooterHeading>
          <address className="space-y-1 not-italic text-[15px] leading-6">
            <a href="tel:0401940207" className={`${linkClass} gap-3`}>
              <Phone className="h-4 w-4 shrink-0 text-[#765416]" aria-hidden="true" />
              {contactInfo.phone}
            </a>
            <div className="flex gap-3 text-[#243a54]">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#765416]" aria-hidden="true" />
              <span>
                Level 1/229 Canley Vale Rd
                <br />
                Canley Heights NSW 2166
              </span>
            </div>
            <div className="flex gap-3 text-[#40546a]">
              <Clock3 className="mt-1 h-4 w-4 shrink-0 text-[#765416]" aria-hidden="true" />
              <span>
                Tue–Fri 5–9pm
                <br />
                Sat 9am–6pm
                <br />
                Sun 10am–7pm
              </span>
            </div>
          </address>
          <a
            href={footerConfig.directionsUrl}
            target="_blank"
            rel="noreferrer"
            className={`${linkClass} mt-2 text-brand-navy`}
            aria-label="Get directions to DA Tuition (opens in a new tab)"
          >
            Get directions <span className="ml-1 text-[#765416]" aria-hidden="true">→</span>
          </a>
        </section>
      </div>

      <div className="border-t border-brand-navy/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-[13px] leading-5 text-[#526477] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:py-3">
          <p>© {currentYear} DA Tuition. All rights reserved.</p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {footerConfig.legal.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex min-h-11 min-w-11 items-center transition-colors duration-200 hover:text-[#765416] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-4 focus-visible:ring-offset-[#e9d8c8] lg:min-h-8"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
