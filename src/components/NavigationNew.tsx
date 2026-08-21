import { useEffect, useRef, useState } from 'react';
import { Menu, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { useAdaptiveNav } from '@/hooks/useAdaptiveNav';
import MobileNavSheet from '@/components/nav/MobileNavSheet';

// Desktop shape morph, expressed as a clip-path wipe rather than an
// animated width/margin/height. Those are layout properties — every frame
// forces the browser to recompute layout, which is what made the old
// version feel choppy. clip-path (and opacity, below) can run entirely on
// the compositor, the same category of property as `transform`.
//
// The outer box never moves or resizes — it's always the full flush bar
// (matching the site's existing nav exactly). What changes is how much of
// it clip-path reveals: a small circular inset (the collapsed pill, now
// sized for just the hamburger button) or the whole thing (round 0, i.e.
// no clipping at all). Since the box is a constant size, the circle's
// position within it is expressed as fixed insets from that box's own
// edges — NAV_HEIGHT and PILL_* below are the numbers that produce that
// inset() value; keep them in sync if the circle's size or position ever
// changes. An equal width/height inset with round 999px is what makes the
// clipped shape a true circle rather than a stadium/pill.
const NAV_HEIGHT = 56; // matches the expanded bar's actual content height
const PILL_SIZE = 40;
const PILL_RIGHT = 20; // pulled in from the expanded bar's lg:px-8 so the circle sits nearer the corner
// Biased toward the bottom of the 56px bar (rather than centered) so the
// circle sits a little further from the browser chrome/viewport edge above it.
const PILL_TOP = 12;
const PILL_BOTTOM = NAV_HEIGHT - PILL_TOP - PILL_SIZE;
const COLLAPSED_CLIP = `inset(${PILL_TOP}px ${PILL_RIGHT}px ${PILL_BOTTOM}px calc(100% - ${PILL_RIGHT + PILL_SIZE}px) round 999px)`;
const EXPANDED_CLIP = 'inset(0px 0px 0px 0px round 0px)';
const SHAPE_MS = 320;
const FADE_MS = 160;
const FADE_DELAY = Math.round(SHAPE_MS * 0.4); // the layer becoming visible waits for the shape to mostly finish; the one leaving fades immediately

const NavigationNew = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobileHeaderHidden, setMobileHeaderHidden] = useState(false);
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const isEnglishMobileTrial = location.pathname === '/subjects/english';

  const { navState, pin, expand } = useAdaptiveNav();
  const isCollapsed = navState === 'collapsed';

  const desktopNavRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const collapsedLayerRef = useRef<HTMLDivElement>(null);
  const expandedLayerRef = useRef<HTMLDivElement>(null);
  const mobileLastScrollYRef = useRef(0);

  // Whichever content layer is faded out must also drop out of the tab
  // order and the accessibility tree — both layers stay mounted for the
  // cross-fade, so `inert` (not conditional rendering) is what keeps the
  // hidden one from being reachable.
  useEffect(() => {
    collapsedLayerRef.current?.toggleAttribute('inert', !isCollapsed);
    expandedLayerRef.current?.toggleAttribute('inert', isCollapsed);
  }, [isCollapsed]);

  useEffect(() => {
    if (!isEnglishMobileTrial) {
      setMobileHeaderHidden(false);
      return;
    }

    mobileLastScrollYRef.current = window.scrollY;
    const onMobileScroll = () => {
      const currentY = window.scrollY;
      const difference = currentY - mobileLastScrollYRef.current;

      if (currentY <= 72 || difference < -8) setMobileHeaderHidden(false);
      else if (difference > 8) setMobileHeaderHidden(true);

      mobileLastScrollYRef.current = currentY;
    };

    window.addEventListener('scroll', onMobileScroll, { passive: true });
    return () => window.removeEventListener('scroll', onMobileScroll);
  }, [isEnglishMobileTrial]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  // Pin the nav expanded while any dropdown is open or focus is inside it —
  // it must never scroll-collapse out from under an active interaction.
  // Called directly from each HoverCard's onOpenChange (not via a useEffect
  // watching openDropdown) so there's no render-then-effect lag for a
  // same-frame scroll event to race against. Tracked as a set, not just the
  // latest call's boolean — moving the pointer between two triggers can fire
  // the new one's open(true) before the old one's close(false) resolves
  // (open/close delays differ), and a last-write-wins boolean would drop the
  // pin mid-switch even though a dropdown is still genuinely open.
  const openDropdownsRef = useRef(new Set<string>());
  const handleDropdownChange = (id: string, open: boolean) => {
    if (open) openDropdownsRef.current.add(id);
    else openDropdownsRef.current.delete(id);
    setOpenDropdown(open ? id : (openDropdownsRef.current.size > 0 ? id : null));
    pin(openDropdownsRef.current.size > 0);
  };

  const handleNavFocus = () => pin(true);
  const handleNavBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null) && openDropdownsRef.current.size === 0) {
      pin(false);
    }
  };

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
      title: "Business Studies",
      href: "/subjects/business-studies",
      description: "Case studies, reports and strategic thinking"
    },
    {
      title: "Legal Studies",
      href: "/subjects/legal-studies",
      description: "Case law, statutory interpretation and essay technique"
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
      title: "Tutors",
      href: "/tutors",
      description: "Meet the people behind the progress"
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

  const linkClass = 'relative px-2.5 xl:px-3.5 py-2 text-sm xl:text-[0.9rem] font-medium transition-colors whitespace-nowrap text-brand-navy hover:text-brand-blue-dark';
  const navLinkClass = (active = false) => `${linkClass} ${active ? 'after:absolute after:left-2.5 after:right-2.5 after:-bottom-0.5 after:h-px after:bg-brand-gold/80' : ''}`;
  const logoTextClass = 'text-brand-navy';
  const hamburgerIconClass = 'text-brand-midnight/80 hover:text-brand-blue-dark';
  const collapsedPillIconClass = 'text-brand-navy hover:bg-brand-navy/10';
  const barBackground = 'linear-gradient(110deg, rgba(250,245,234,0.95), rgba(247,239,222,0.92) 58%, rgba(235,215,175,0.88))';
  const barShadow = '0 5px 14px rgba(10,27,52,0.10), inset 0 1px 0 rgba(255,250,239,0.72)';

  const shapeTransition = reducedMotion ? 'none' : `clip-path ${SHAPE_MS}ms cubic-bezier(0.16,1,0.3,1)`;
  const collapsedLayerTransition = reducedMotion ? 'none' : `opacity ${FADE_MS}ms ease ${isCollapsed ? FADE_DELAY : 0}ms`;
  const expandedLayerTransition = reducedMotion ? 'none' : `opacity ${FADE_MS}ms ease ${!isCollapsed ? FADE_DELAY : 0}ms`;

  return (
    <>
      {/* ── Mobile / touch header — persistent, deliberately not scroll-reactive ── */}
      <div className={`fixed top-0 left-0 right-0 z-[60] transition-transform duration-300 ease-out lg:hidden ${isEnglishMobileTrial && mobileHeaderHidden && !sheetOpen ? '-translate-y-full' : 'translate-y-0'}`}>
        <nav
          className="w-full h-14 backdrop-blur-md backdrop-saturate-125 border-b"
          style={{ borderColor: 'rgba(169,120,37,0.42)', background: barBackground, boxShadow: barShadow }}
        >
          <div className="flex h-full items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/images/da-logo.png"
                alt="DA Tuition"
                className="h-8 w-8 object-contain drop-shadow-sm"
              />
              <span
                className={`text-[1.02rem] font-bold whitespace-nowrap leading-none ${logoTextClass}`}
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: '-0.01em' }}
              >
                DA <span className="text-brand-gold italic font-bold">Tuition</span>
              </span>
            </Link>

            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => {
                setMobileHeaderHidden(false);
                setSheetOpen(true);
              }}
              aria-label="Open menu"
              aria-expanded={sheetOpen}
              aria-controls="mobile-nav-sheet"
              className={`flex h-11 w-11 items-center justify-center transition-colors -mr-1.5 ${hamburgerIconClass}`}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </div>

      {isEnglishMobileTrial && mobileHeaderHidden && !sheetOpen && (
        <button
          type="button"
          onClick={() => {
            setMobileHeaderHidden(false);
            setSheetOpen(true);
          }}
          aria-label="Open menu"
          aria-expanded={sheetOpen}
          aria-controls="mobile-nav-sheet"
          className="fixed right-4 top-3 z-[61] flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a227]/50 bg-[#071629] text-white shadow-lg shadow-[#071629]/30 transition-transform duration-300 ease-out lg:hidden"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      )}

      <MobileNavSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        triggerRef={hamburgerRef}
        programsItems={programsItems}
        subjectsItems={subjectsItems}
        aboutItems={aboutItems}
      />

      {/* ── Desktop header — scroll-adaptive: collapses while reading, expands on deliberate scroll-up ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] hidden lg:block">
        <nav
          ref={desktopNavRef}
          className="backdrop-blur-md backdrop-saturate-125 overflow-hidden"
          style={{
            position: 'relative',
            width: '100%',
            height: NAV_HEIGHT,
            border: '1px solid rgba(169,120,37,0.42)',
            background: barBackground,
            boxShadow: barShadow,
            clipPath: isCollapsed ? COLLAPSED_CLIP : EXPANDED_CLIP,
            WebkitClipPath: isCollapsed ? COLLAPSED_CLIP : EXPANDED_CLIP,
            transition: shapeTransition,
          }}
        >
          <div
            ref={collapsedLayerRef}
            className="absolute flex items-center justify-center"
            style={{
              top: PILL_TOP,
              right: PILL_RIGHT,
              width: PILL_SIZE,
              height: PILL_SIZE,
              opacity: isCollapsed ? 1 : 0,
              transition: collapsedLayerTransition,
              pointerEvents: isCollapsed ? 'auto' : 'none',
            }}
          >
            <button
              type="button"
              onClick={expand}
              aria-expanded={false}
              aria-controls="primary-desktop-nav"
              aria-label="Open menu"
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${collapsedPillIconClass}`}
            >
              <Menu size={18} aria-hidden="true" />
            </button>
          </div>

          <div
            ref={expandedLayerRef}
            id="primary-desktop-nav"
            onFocus={handleNavFocus}
            onBlur={handleNavBlur}
            className="absolute inset-0 px-4 sm:px-6 lg:px-8"
            style={{
              opacity: isCollapsed ? 0 : 1,
              transition: expandedLayerTransition,
              pointerEvents: isCollapsed ? 'none' : 'auto',
            }}
          >
              <div className="flex items-center justify-between py-2.5 gap-4">
                <div className="flex items-center shrink-0">
                  <Link to="/" className="flex items-center gap-2 group">
                    <img
                      src="/images/da-logo.png"
                      alt="DA Tuition"
                      className="h-9 w-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`text-[1.08rem] font-bold whitespace-nowrap leading-none ${logoTextClass}`}
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: '-0.01em' }}
                    >
                      DA <span className="text-brand-gold italic font-bold">Tuition</span>
                    </span>
                  </Link>
                </div>

                <div className="flex items-center flex-1 justify-center">
                  <div className="flex gap-0.5 items-center">
                    <Link to="/" className={navLinkClass(isHomepage)}>Home</Link>

                    <HoverCard openDelay={120} closeDelay={180} onOpenChange={(open) => handleDropdownChange('programs', open)}>
                      <HoverCardTrigger asChild>
                        <button type="button" className={`${navLinkClass(location.pathname.startsWith('/programs') || location.pathname === '/hsc-excellence')} inline-flex items-center gap-0.5`}>
                          Programs <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent align="center" side="bottom" sideOffset={6} className="p-0 w-auto border-brand-gold/25 bg-brand-ivory/95 backdrop-blur-xl shadow-md">
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

                    <HoverCard openDelay={120} closeDelay={180} onOpenChange={(open) => handleDropdownChange('subjects', open)}>
                      <HoverCardTrigger asChild>
                        <button type="button" className={`${navLinkClass(location.pathname.startsWith('/subjects'))} inline-flex items-center gap-0.5`}>
                          Subjects <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent align="center" side="bottom" sideOffset={6} className="p-0 w-auto border-brand-gold/25 bg-brand-ivory/95 backdrop-blur-xl shadow-md">
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

                    <HoverCard openDelay={120} closeDelay={180} onOpenChange={(open) => handleDropdownChange('about', open)}>
                      <HoverCardTrigger asChild>
                        <button type="button" className={`${navLinkClass(['/why-choose-da', '/find-teacher', '/tutors', '/principal-reflections', '/learning-formats'].includes(location.pathname))} inline-flex items-center gap-0.5`}>
                          About <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent align="center" side="bottom" sideOffset={6} className="p-0 w-auto border-brand-gold/25 bg-brand-ivory/95 backdrop-blur-xl shadow-md">
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

                    <Link to="/success-stories" className={navLinkClass(location.pathname === '/success-stories')}>Success Stories</Link>

                    <HoverCard openDelay={120} closeDelay={180} onOpenChange={(open) => handleDropdownChange('resources', open)}>
                      <HoverCardTrigger asChild>
                        <button type="button" className={`${navLinkClass(['/faq', '/tutoring-canley-heights', '/articles'].some((path) => location.pathname.startsWith(path)))} inline-flex items-center gap-0.5`}>
                          Resources <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent align="center" side="bottom" sideOffset={6} className="p-0 w-auto border-brand-gold/25 bg-brand-ivory/95 backdrop-blur-xl shadow-md">
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

                    <Link to="/contact" className={linkClass}>
                      Contact
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to="/book-interview"
                    className="inline-flex items-center px-3.5 py-1.5 text-[0.8rem] font-semibold text-[#fff3d6] rounded-sm whitespace-nowrap transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #0A1B34 0%, #122b4d 100%)', border: '1px solid rgba(200,149,52,.76)', boxShadow: '0 2px 5px rgba(10,27,52,.16)' }}
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </div>
        </nav>
      </div>
    </>
  );
};

export default NavigationNew;
