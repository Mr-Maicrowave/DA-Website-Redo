import { useEffect, useState } from 'react';
import { colors, fonts } from '@/lib/theme';

/**
 * ChapterTabs — right-side vertical chapter tabs shown on chapter-opening
 * layouts. Desktop only (hidden below lg); links scroll to page sections.
 */
const ChapterTabs = ({ tabs }: {
  tabs: { id: string; label: string }[];
}) => {
  const [active, setActive] = useState<string>(tabs[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    tabs.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tabs]);

  return (
    <nav
      aria-label="Page sections"
      className="hidden lg:flex"
      style={{
        position: 'fixed',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        flexDirection: 'column',
        gap: 6,
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              fontFamily: fonts.sans,
              fontSize: '.66rem',
              fontWeight: 700,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: isActive ? colors.navy : 'rgba(10,27,52,0.55)',
              background: isActive ? colors.goldL : 'rgba(247,244,238,0.92)',
              border: '1px solid rgba(212,175,55,0.35)',
              borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              padding: '10px 14px 10px 16px',
              boxShadow: '0 2px 10px rgba(10,27,52,0.10)',
              transition: 'background .25s ease, color .25s ease, transform .25s ease',
              transform: isActive ? 'translateX(0)' : 'translateX(4px)',
            }}
          >
            {tab.label}
          </a>
        );
      })}
    </nav>
  );
};

export default ChapterTabs;
