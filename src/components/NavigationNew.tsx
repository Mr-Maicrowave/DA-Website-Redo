import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const NavigationNew = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
      title: "Principal's Reflections",
      href: "/principal-reflections",
      description: "Philosophy, values, and vision"
    },
    {
      title: "Learning Formats",
      href: "/learning-formats",
      description: "Small groups and classes explained"
    },
    {
      title: "Principal's Interview",
      href: "/interview",
      description: "Our vision and mission"
    }
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);

    if (href.startsWith('#') && location.pathname !== '/') {
      window.location.href = '/' + href;
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] p-4 pointer-events-none transition-all duration-300">
      <nav className="w-full max-w-7xl mx-auto pointer-events-auto bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/40 rounded-2xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-2 group">
                <img
                  src="/lovable-uploads/7692e107-bde1-4906-b047-2458fe6a81ca.png"
                  alt="DA Tuition Logo"
                  className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
                />
                <span className="text-xl font-extrabold tracking-tight text-brand-navy whitespace-nowrap">
                  DA<span className="text-brand-blue">Tuition</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-end flex-1 ml-4 lg:ml-8">
              <div className="flex gap-1 items-center">
                <Link to="/" className="px-2 xl:px-3 py-2 text-sm xl:text-base text-brand-midnight/80 hover:text-brand-blue-dark transition-colors whitespace-nowrap">
                  Home
                </Link>

                {/* Programs Dropdown */}
                <HoverCard openDelay={120} closeDelay={180}>
                  <HoverCardTrigger asChild>
                    <button type="button" className="px-2 xl:px-3 py-2 text-sm xl:text-base text-brand-midnight/80 hover:text-brand-blue-dark transition-colors inline-flex items-center gap-1 whitespace-nowrap">
                      Programs <ChevronDown className="h-4 w-4" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent align="center" side="bottom" sideOffset={4} className="p-0 w-auto">
                    <ul className="grid w-[400px] gap-3 p-4">
                      {programsItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </HoverCardContent>
                </HoverCard>

                {/* Subjects Dropdown */}
                <HoverCard openDelay={120} closeDelay={180}>
                  <HoverCardTrigger asChild>
                    <button type="button" className="px-2 xl:px-3 py-2 text-sm xl:text-base text-brand-midnight/80 hover:text-brand-blue-dark transition-colors inline-flex items-center gap-1 whitespace-nowrap">
                      Subjects <ChevronDown className="h-4 w-4" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent align="center" side="bottom" sideOffset={4} className="p-0 w-auto">
                    <ul className="grid w-[350px] gap-3 p-4">
                      {subjectsItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </HoverCardContent>
                </HoverCard>

                {/* About Dropdown */}
                <HoverCard openDelay={120} closeDelay={180}>
                  <HoverCardTrigger asChild>
                    <button type="button" className="px-2 xl:px-3 py-2 text-sm xl:text-base text-brand-midnight/80 hover:text-brand-blue-dark transition-colors inline-flex items-center gap-1 whitespace-nowrap">
                      About <ChevronDown className="h-4 w-4" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent align="center" side="bottom" sideOffset={4} className="p-0 w-auto">
                    <ul className="grid w-[400px] gap-3 p-4">
                      {aboutItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </HoverCardContent>
                </HoverCard>

                <Link to="/success-stories" className="px-2 xl:px-3 py-2 text-sm xl:text-base text-brand-midnight/80 hover:text-brand-blue-dark transition-colors whitespace-nowrap">
                  Success Stories
                </Link>

                {/* Resources Dropdown */}
                <HoverCard openDelay={120} closeDelay={180}>
                  <HoverCardTrigger asChild>
                    <button type="button" className="px-2 xl:px-3 py-2 text-sm xl:text-base text-brand-midnight/80 hover:text-brand-blue-dark transition-colors inline-flex items-center gap-1 whitespace-nowrap">
                      Resources <ChevronDown className="h-4 w-4" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent align="center" side="bottom" sideOffset={4} className="p-0 w-auto">
                    <ul className="grid w-[350px] gap-3 p-4">
                      <li>
                        <Link
                          to="/faq"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">FAQ</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get answers to common questions
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tutoring-canley-heights"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Our Location</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Visit us in Canley Heights
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/articles"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Articles & Guides</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Educational insights and tips
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </HoverCardContent>
                </HoverCard>

                <a
                  href="#contact"
                  onClick={() => handleNavClick('#contact')}
                  className="px-2 xl:px-3 py-2 text-sm xl:text-base text-brand-midnight/80 hover:text-brand-blue-dark transition-colors whitespace-nowrap"
                >
                  Contact
                </a>
              </div>

              <div className="flex items-center gap-2 xl:gap-4 ml-2 xl:ml-6 shrink-0">
                <a
                  href="tel:0401940207"
                  className="flex items-center text-brand-blue-dark hover:text-brand-blue-light transition-colors font-semibold"
                >
                  <Phone className="w-4 h-4 mr-1 xl:mr-2 shrink-0" />
                  <span className="hidden xl:inline whitespace-nowrap text-sm">0401 940 207</span>
                </a>
                <Link
                  to="/book-interview"
                  className="inline-flex items-center rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#0A1B34] transition-colors hover:bg-[#F0C86A] whitespace-nowrap shadow-md"
                >
                  Book Interview
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-brand-midnight/80 hover:text-brand-blue-dark transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 max-h-[80vh] overflow-y-auto">
              <div className="px-4 py-6 space-y-4">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="block text-brand-midnight/80 hover:text-brand-blue-dark font-medium py-3"
                >
                  Home
                </Link>

                {/* Mobile Programs Section */}
                <div className="space-y-2">
                  <div className="font-semibold text-brand-midnight py-3 border-b">Programs</div>
                  {programsItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block pl-4 text-brand-midnight/80 hover:text-brand-blue-dark py-3"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                {/* Mobile Subjects Section */}
                <div className="space-y-2">
                  <div className="font-semibold text-brand-midnight py-3 border-b">Subjects</div>
                  {subjectsItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block pl-4 text-brand-midnight/80 hover:text-brand-blue-dark py-3"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                {/* Mobile About Section */}
                <div className="space-y-2">
                  <div className="font-semibold text-brand-midnight py-3 border-b">About</div>
                  {aboutItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block pl-4 text-brand-midnight/80 hover:text-brand-blue-dark py-3"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                <Link
                  to="/success-stories"
                  onClick={() => setIsOpen(false)}
                  className="block text-brand-midnight/80 hover:text-brand-blue-dark font-medium py-3"
                >
                  Success Stories
                </Link>

                <a
                  href="#contact"
                  onClick={() => handleNavClick('#contact')}
                  className="block text-brand-midnight/80 hover:text-brand-blue-dark font-medium py-3"
                >
                  Contact
                </a>

              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavigationNew;