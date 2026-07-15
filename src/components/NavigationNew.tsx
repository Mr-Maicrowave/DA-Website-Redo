import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const NavigationNew = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const programsItems = [
    {
      title: "Primary School (K-6)",
      href: "/programs/primary-school",
      description: "Building strong foundations in literacy and numeracy"
    },
    {
      title: "High School (7-10)",
      href: "/programs/high-school",
      description: "Core subject support and study skills development"
    },
    {
      title: "HSC Excellence Program",
      href: "/hsc-excellence",
      description: "Maximize your ATAR with expert HSC preparation"
    }
  ];

  const subjectsItems = [
    {
      title: "Mathematics",
      href: "/subjects/mathematics",
      description: "From times tables to calculus"
    },
    {
      title: "English",
      href: "/subjects/english",
      description: "Reading, writing, and critical analysis"
    },
    {
      title: "Sciences",
      href: "/subjects/science",
      description: "Physics, Chemistry, Biology"
    },
    {
      title: "All Subjects",
      href: "/subjects",
      description: "View our complete subject offerings"
    }
  ];

  const aboutItems = [
    {
      title: "The DA Difference",
      href: "/why-choose-da",
      description: "Our unique approach and why parents trust us"
    },
    {
      title: "Find a Tutor",
      href: "/find-teacher",
      description: "Search our exceptional educators"
    },
    {
      title: "Principal's Reflection",
      href: "/principal-reflections",
      description: "Philosophy, values, and vision"
    },
    {
      title: "Learning Formats",
      href: "/learning-formats",
      description: "Small groups and classes explained"
    }
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);

    if (href.startsWith('#') && location.pathname !== '/') {
      window.location.href = '/' + href;
    }
  };

  const linkClass = "px-2 xl:px-3 py-1.5 text-sm xl:text-[0.9rem] text-brand-midnight hover:text-brand-blue-dark transition-colors whitespace-nowrap";

  return (
    <div className="fixed top-0 left-0 right-0 z-[60]">
      <nav
        className="w-full backdrop-blur-xl backdrop-saturate-150 border-b border-white/60 transition-shadow duration-300"
        style={{
          background: scrolled
            ? 'linear-gradient(135deg, rgba(247,244,238,0.92), rgba(255,250,240,0.86) 58%, rgba(240,200,106,0.18))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.78), rgba(247,244,238,0.72) 58%, rgba(240,200,106,0.16))',
          boxShadow: scrolled
            ? '0 10px 30px rgba(10,27,52,0.14), inset 0 1px 0 rgba(255,255,255,0.8)'
            : '0 2px 12px rgba(10,27,52,0.08), inset 0 1px 0 rgba(255,255,255,0.72)',
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5 gap-4">

            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-2 group">
                <img
                  src="/images/da-logo.png"
                  alt="DA Tuition"
                  className="h-9 w-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className="text-[1.08rem] font-bold text-brand-navy whitespace-nowrap leading-none"
                  style={{ fontFamily: "'Libre Baskerville', Georgia, serif", letterSpacing: '-0.01em' }}
                >
                  DA <span className="text-brand-gold italic font-bold">Tuition</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation – centred */}
            <div className="hidden lg:flex items-center flex-1 justify-center">
              <div className="flex gap-0.5 items-center">
                <Link to="/" className={linkClass}>Home</Link>

                {/* Programs */}
                <HoverCard openDelay={120} closeDelay={180}>
                  <HoverCardTrigger asChild>
                    <button type="button" className={`${linkClass} inline-flex items-center gap-0.5`}>
                      Programs <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent align="center" side="bottom" sideOffset={6} className="p-0 w-auto">
                    <ul className="grid w-[400px] gap-3 p-4">
                      {programsItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </HoverCardContent>
                </HoverCard>

                {/* Subjects */}
                <HoverCard openDelay={120} closeDelay={180}>
                  <HoverCardTrigger asChild>
                    <button type="button" className={`${linkClass} inline-flex items-center gap-0.5`}>
                      Subjects <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent align="center" side="bottom" sideOffset={6} className="p-0 w-auto">
                    <ul className="grid w-[350px] gap-3 p-4">
                      {subjectsItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </HoverCardContent>
                </HoverCard>

                {/* About */}
                <HoverCard openDelay={120} closeDelay={180}>
                  <HoverCardTrigger asChild>
                    <button type="button" className={`${linkClass} inline-flex items-center gap-0.5`}>
                      About <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent align="center" side="bottom" sideOffset={6} className="p-0 w-auto">
                    <ul className="grid w-[400px] gap-3 p-4">
                      {aboutItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </HoverCardContent>
                </HoverCard>

                <Link to="/success-stories" className={linkClass}>Success Stories</Link>

                {/* Resources */}
                <HoverCard openDelay={120} closeDelay={180}>
                  <HoverCardTrigger asChild>
                    <button type="button" className={`${linkClass} inline-flex items-center gap-0.5`}>
                      Resources <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent align="center" side="bottom" sideOffset={6} className="p-0 w-auto">
                    <ul className="grid w-[350px] gap-3 p-4">
                      <li>
                        <Link
                          to="/faq"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">FAQ</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Get answers to common questions</p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tutoring-canley-heights"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Our Location</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Visit us in Canley Heights</p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/articles"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Articles & Guides</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Educational insights and tips</p>
                        </Link>
                      </li>
                    </ul>
                  </HoverCardContent>
                </HoverCard>

                <a
                  href="#contact"
                  onClick={() => handleNavClick('#contact')}
                  className={linkClass}
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Right: CTA (desktop) + Mobile burger */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/book-interview"
                className="hidden lg:inline-flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg whitespace-nowrap transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #0A1B34 0%, #1a3a6b 100%)' }}
              >
                Book Consultation
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                className="lg:hidden text-brand-midnight/80 hover:text-brand-blue-dark transition-colors p-1"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-brand-ivory/95 backdrop-blur-xl backdrop-saturate-150 shadow-lg border-t border-white/60 max-h-[80vh] overflow-y-auto">
              <div className="px-4 py-5 space-y-3">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="block text-brand-midnight/80 hover:text-brand-blue-dark font-medium py-2.5 border-b border-brand-gold/10"
                >
                  Home
                </Link>

                <div className="space-y-1">
                  <div className="font-semibold text-brand-midnight py-2.5 border-b border-brand-gold/10">Programs</div>
                  {programsItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block pl-4 text-brand-midnight/75 hover:text-brand-blue-dark py-2.5"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="font-semibold text-brand-midnight py-2.5 border-b border-brand-gold/10">Subjects</div>
                  {subjectsItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block pl-4 text-brand-midnight/75 hover:text-brand-blue-dark py-2.5"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="font-semibold text-brand-midnight py-2.5 border-b border-brand-gold/10">About</div>
                  {aboutItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block pl-4 text-brand-midnight/75 hover:text-brand-blue-dark py-2.5"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                <Link
                  to="/success-stories"
                  onClick={() => setIsOpen(false)}
                  className="block text-brand-midnight/80 hover:text-brand-blue-dark font-medium py-2.5 border-b border-brand-gold/10"
                >
                  Success Stories
                </Link>

                <div className="space-y-1">
                  <div className="font-semibold text-brand-midnight py-2.5 border-b border-brand-gold/10">Resources</div>
                  <Link to="/faq" onClick={() => setIsOpen(false)} className="block pl-4 text-brand-midnight/75 hover:text-brand-blue-dark py-2.5">FAQ</Link>
                  <Link to="/tutoring-canley-heights" onClick={() => setIsOpen(false)} className="block pl-4 text-brand-midnight/75 hover:text-brand-blue-dark py-2.5">Our Location</Link>
                  <Link to="/articles" onClick={() => setIsOpen(false)} className="block pl-4 text-brand-midnight/75 hover:text-brand-blue-dark py-2.5">Articles & Guides</Link>
                </div>

                <a
                  href="#contact"
                  onClick={() => handleNavClick('#contact')}
                  className="block text-brand-midnight/80 hover:text-brand-blue-dark font-medium py-2.5 border-b border-brand-gold/10"
                >
                  Contact
                </a>

                <div className="pt-2 pb-1">
                  <Link
                    to="/book-interview"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-white rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #0A1B34 0%, #1a3a6b 100%)' }}
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavigationNew;
