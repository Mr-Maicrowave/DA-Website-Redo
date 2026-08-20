// src/features/maths-topic-network/MathsTopicNetworkMobile.tsx
import { useState } from 'react';
import { CORE_TOPICS, DOMAIN_TOPICS, SUBTOPICS } from './topic-network-data';

// Deviation from brief: the brief's reference code defaulted to
// `DOMAIN_TOPICS[0]?.id`, but Task 8's own verification step calls for
// "Probability pre-expanded". DOMAIN_TOPICS[0] is 'functions', not
// 'probability' (see topic-network-data.ts), so the literal reference code
// would open the wrong panel. Resolving the id by name (with a fallback to
// the first domain if 'probability' is ever removed) delivers the specified
// behaviour without hardcoding an index that could silently drift.
const DEFAULT_OPEN_ID = DOMAIN_TOPICS.find((domain) => domain.id === 'probability')?.id
  ?? DOMAIN_TOPICS[0]?.id
  ?? null;

export default function MathsTopicNetworkMobile() {
  const [openId, setOpenId] = useState<string | null>(DEFAULT_OPEN_ID);

  return (
    <div className="maths-topic-network__phone">
      <div className="maths-topic-network__phone-core-row">
        {CORE_TOPICS.map((core) => (
          <span key={core.id} className="maths-topic-network__phone-core-chip">
            {core.label}
          </span>
        ))}
      </div>
      {DOMAIN_TOPICS.map((domain) => {
        const isOpen = openId === domain.id;
        const kids = SUBTOPICS.filter((s) => s.parent === domain.id);
        return (
          <div key={domain.id}>
            <button
              type="button"
              className="maths-topic-network__phone-domain"
              onClick={() => setOpenId((current) => (current === domain.id ? null : domain.id))}
              aria-expanded={isOpen}
            >
              <span>
                <i className="maths-topic-network__phone-domain-dot" style={{ background: domain.dotColor }} />
                {domain.label}
              </span>
              <span className={`maths-topic-network__phone-chevron ${isOpen ? 'maths-topic-network__phone-chevron--open' : ''}`}>›</span>
            </button>
            <div className={`maths-topic-network__phone-sublist ${isOpen ? 'maths-topic-network__phone-sublist--open' : ''}`}>
              <div className="maths-topic-network__phone-sublist-inner">
                {kids.length > 0
                  ? kids.map((sub) => (
                    <div key={sub.id} className="maths-topic-network__phone-sub-row">
                      {sub.label}
                    </div>
                  ))
                  : (
                    <div className="maths-topic-network__phone-sub-row">{domain.blurb}</div>
                  )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
