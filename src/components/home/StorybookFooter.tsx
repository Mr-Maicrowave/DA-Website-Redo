import { Link } from "react-router-dom";
import { contactInfo } from "@/data/business-info";
import "./StorybookFooter.css";

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    title: "Programs",
    links: [
      {
        label: "Primary School",
        href: "/programs/primary-school",
      },
      {
        label: "High School",
        href: "/programs/high-school",
      },
      {
        label: "HSC Excellence",
        href: "/hsc-excellence",
      },
    ],
  },
  {
    title: "About DA",
    links: [
      {
        label: "Our Approach",
        href: "/our-approach",
      },
      {
        label: "Our Teachers",
        href: "/our-teachers",
      },
      {
        label: "Learning Formats",
        href: "/learning-formats",
      },
      {
        label: "Principal's Reflection",
        href: "/principal-reflections",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "Success Stories",
        href: "/success-stories",
      },
      {
        label: "Parent Reviews",
        href: "/reviews",
      },
      {
        label: "Student Messages",
        href: "/appreciation-advice",
      },
      {
        label: "Articles & Guides",
        href: "/articles",
      },
      {
        label: "FAQ",
        href: "/faq",
      },
    ],
  },
  {
    title: "Locations",
    links: [
      {
        label: "Canley Heights",
        href: "/tutoring-canley-heights",
      },
      {
        label: "Cabramatta",
        href: "/tutoring-cabramatta",
      },
      {
        label: "Fairfield",
        href: "/tutoring-fairfield",
      },
      {
        label: "Canley Vale",
        href: "/tutoring-canley-vale",
      },
      {
        label: "Smithfield",
        href: "/tutoring-smithfield",
      },
      {
        label: "Lansvale",
        href: "/tutoring-lansvale",
      },
    ],
  },
];

const subjectLinks: FooterLink[] = [
  { label: "Mathematics", href: "/subjects/mathematics" },
  { label: "English", href: "/subjects/english" },
  { label: "Science", href: "/subjects/science" },
  { label: "Business Studies", href: "/subjects/business-studies" },
  { label: "Legal Studies", href: "/subjects/legal-studies" },
];

type StorybookFooterProps = {
  logoSrc?: string;
  phone?: string;
  phoneHref?: string;
  address?: string;
  consultationHref?: string;
  onReplayIntro?: () => void;
};

const isInternalHref = (href: string) => href.startsWith("/");

const FooterNavLink = ({ href, label }: FooterLink) =>
  isInternalHref(href) ? <Link to={href}>{label}</Link> : <a href={href}>{label}</a>;

export function StorybookFooter({
  logoSrc = "/lovable-uploads/7692e107-bde1-4906-b047-2458fe6a81ca.png",
  phone = contactInfo.phone,
  phoneHref = "tel:0401940207",
  address = contactInfo.address,
  consultationHref = "/book-interview",
  onReplayIntro,
}: StorybookFooterProps) {
  return (
    <footer className="storybook-footer">
      <div className="storybook-footer__top-line" aria-hidden="true">
        <span />
        <i>✦</i>
        <span />
      </div>

      <div className="da-container storybook-footer__inner">
        <div className="storybook-footer__brand">
          <Link
            to="/"
            className="storybook-footer__logo"
            aria-label="DA Tuition homepage"
          >
            <img src={logoSrc} alt="DA Tuition" width="180" height="100" />
          </Link>

          <p>
            Award-winning education focused on academic growth, confidence and
            meaningful relationships.
          </p>

          <span className="storybook-footer__award">
            ✦ Outstanding Education Service 2025
          </span>

          <Link
            to={consultationHref}
            className="storybook-footer__consultation"
          >
            Book a consultation
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <nav
          className="storybook-footer__navigation"
          aria-label="Footer navigation"
        >
          {footerColumns.map((column) => (
            <div className="storybook-footer__column" key={column.title}>
              <h2>{column.title}</h2>

              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <FooterNavLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="storybook-footer__contact">
          <h2>Contact</h2>

          <a href={phoneHref}>{phone}</a>

          <address>
            <Link to="/tutoring-canley-heights">{address}</Link>
          </address>

          <div>
            <strong>Business Hours</strong>
            <span>{contactInfo.hours.weekday}</span>
            <span>{contactInfo.hours.saturday}</span>
            <span>{contactInfo.hours.sunday}</span>
          </div>
        </div>
      </div>

      <div className="da-container storybook-footer__subjects">
        <strong>Subjects We Teach</strong>

        <p>
          {subjectLinks.map((link, index) => (
            <span className="storybook-footer__subject-item" key={link.href}>
              {index > 0 && <span aria-hidden="true">•</span>}
              <FooterNavLink {...link} />
            </span>
          ))}
          <span className="storybook-footer__subject-item">
            <span aria-hidden="true">•</span>
            <span>Physics</span>
          </span>
          <span className="storybook-footer__subject-item">
            <span aria-hidden="true">•</span>
            <span>Chemistry</span>
          </span>
          <span className="storybook-footer__subject-item">
            <span aria-hidden="true">•</span>
            <span>Biology</span>
          </span>
        </p>
      </div>

      <div className="da-container storybook-footer__closing">
        <p>
          <span>The end…</span>
          or perhaps, just the beginning.
        </p>

        <div className="storybook-footer__bottom-links">
          {onReplayIntro && (
            <button type="button" onClick={onReplayIntro}>
              Replay Intro
            </button>
          )}

          <Link to="/privacy-policy">Privacy Policy</Link>
          <span aria-disabled="true">
            Terms of Service
          </span>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
      </div>

      <div className="storybook-footer__copyright">
        <div className="da-container">
          <span>
            © {new Date().getFullYear()} DA Tuition. All rights reserved.
          </span>

          <a href="#top" aria-label="Return to the top of the page">
            ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
