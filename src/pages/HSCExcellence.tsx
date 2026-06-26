import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';

const stakesCards = [
  {
    title: 'The ATAR Is Calculated on Everything',
    text: 'Every internal assessment and every HSC exam contributes to the ATAR. There are no throw-away marks. We help students understand this and act on it from Day 1 of Year 11.',
  },
  {
    title: 'Subject Selection Is Strategy',
    text: 'Scaling, workload, and personal strengths all determine which subject combination gives your child the best ATAR. Our tutors have guided hundreds of families through this decision.',
  },
  {
    title: 'The Gap Between Class and Exams',
    text: 'Many strong students underperform in HSC exams because they have not been trained in HSC-specific technique. We close that gap systematically.',
  },
  {
    title: 'Burnout Is a Real Risk',
    text: 'Year 12 is a marathon. Students who do not manage time, energy, and stress through the year perform well below their potential in the final exams. We build good habits alongside knowledge.',
  },
];

const focusRows = [
  {
    area: 'English Advanced and Standard',
    build: 'Essay writing, close study of texts, Area of Study',
    skills: 'Thesis, evidence, language techniques, multi-modal analysis',
  },
  {
    area: 'Mathematics Advanced and Extension 1',
    build: 'Calculus, statistics, algebra, proof',
    skills: 'Working mathematically, exam strategy, speed and accuracy',
    highlight: true,
  },
  {
    area: 'Mathematics Extension 2',
    build: 'Complex numbers, mechanics, harder 3-unit',
    skills: 'Abstract reasoning, proof by induction, integration techniques',
  },
  {
    area: 'Sciences (Physics / Chemistry / Biology)',
    build: 'Depth studies, inquiry skills, extended response',
    skills: 'Conceptual understanding, data analysis, HSC marking criteria',
    highlight: true,
  },
  {
    area: 'HSIE (Economics / Business / History / Legal Studies)',
    build: 'Extended response, case studies, source analysis',
    skills: 'Argument structure, current events application, time management',
  },
  {
    area: 'Exam and Study Skills',
    build: 'Past paper drilling, marking criteria, time-under-pressure',
    skills: 'Peak performance strategy, stress management, peak-week preparation',
    highlight: true,
  },
];

const approachCards = [
  {
    title: 'Subject-Specialist Tutors Only',
    text: 'Every HSC tutor at DA Tuition achieved a Band 6 (or equivalent high distinction) in the subject they teach. We do not compromise on this.',
  },
  {
    title: 'Internal Assessment Strategy',
    text: 'We do not just prepare students for the final exam. From Term 1 of Year 11 we work on internal task strategy, because 50% of the mark is already on the line.',
  },
  {
    title: 'HSC Exam Technique as a Discipline',
    text: 'Past papers, model answers, marking criteria. Every student knows exactly what a Band 6 response looks like before they sit the real thing.',
  },
  {
    title: 'Progress Reports and Parent Check-Ins',
    text: 'Written progress updates every term. Direct tutor access between sessions. You stay in the loop at every step.',
  },
];

const fitItems = [
  'Your child is entering Year 11 and wants to start strong from Day 1',
  'Marks are inconsistent between internal tasks and exams',
  'Your student is targeting an ATAR above 90, or above 99',
  'They are struggling with specific subjects and need specialist help',
  'You want a program built around the actual HSC marking criteria',
  'Your child needs support managing Year 12 workload and stress',
  'You want written progress updates, not just verbal reassurance',
];

const HSCExcellence = () => {
  return (
    <div className="hsc-page">
      <SEO
        title="HSC Excellence Years 11-12"
        description="HSC Excellence tutoring for Years 11-12 at DA Tuition, built for students targeting their best possible ATAR."
        canonicalUrl="/hsc-excellence"
      />

      <style>{`
        .hsc-page {
          --navy:#0c1f4a; --navy-mid:#1a3870;
          --gold:#b8860b; --gold-light:#d4a017; --gold-pale:#fdf6dc; --gold-mid:#e8c84a; --gold-dark:#92660a;
          --white:#ffffff; --text:#0c1f4a; --muted:#4a5568; --border:#e2e8f0; --soft:#f8fafc;
          --amber:#fef3c7; --amber-mid:#fcd34d;
          min-height: 100vh;
          background: var(--white);
          color: var(--text);
          font-family: 'Segoe UI', system-ui, sans-serif;
          line-height: 1.6;
          padding-top: 120px;
        }

        .hsc-page *, .hsc-page *::before, .hsc-page *::after { box-sizing: border-box; }

        .hsc-breadcrumb { background: var(--soft); border-bottom: 1px solid var(--border); padding: 14px 52px; font-size: .82rem; color: var(--muted); }
        .hsc-breadcrumb a { color: var(--navy); text-decoration: none; font-weight: 600; }
        .hsc-breadcrumb a:hover { text-decoration: underline; }
        .hsc-breadcrumb span { margin: 0 8px; }

        .hsc-sibling-tabs { background: var(--white); border-bottom: 2px solid var(--border); display: flex; justify-content: center; overflow-x: auto; }
        .hsc-stab { padding: 14px 32px; font-size: .88rem; font-weight: 700; text-decoration: none; color: var(--muted); border-bottom: 3px solid transparent; margin-bottom: -2px; white-space: nowrap; transition: all .2s; }
        .hsc-stab:hover { color: var(--navy); }
        .hsc-stab.active { color: var(--gold-dark); border-bottom-color: var(--gold-light); }

        .hsc-urgency-banner { background: linear-gradient(135deg,var(--amber) 0%,#fef9c3 100%); border-top: 3px solid var(--amber-mid); border-bottom: 3px solid var(--amber-mid); padding: 16px 52px; display: flex; align-items: center; justify-content: center; gap: 32px; flex-wrap: wrap; }
        .hsc-urgency-item { display: flex; align-items: center; gap: 10px; font-size: .88rem; font-weight: 700; color: var(--navy); }
        .hsc-urgency-highlight { background: var(--navy); color: #fff; font-size: .75rem; font-weight: 800; padding: 3px 12px; border-radius: 999px; white-space: nowrap; }

        .hsc-hero { background: linear-gradient(160deg,#fdf6dc 0%,#fef3c7 50%,#fef9c3 100%); padding: 80px 52px 72px; text-align: center; border-bottom: 1px solid #e8d280; }
        .hsc-hero-tag { display: inline-block; font-size: .72rem; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: var(--gold-dark); background: #fff; border: 1.5px solid var(--gold-mid); padding: 6px 20px; border-radius: 4px; margin-bottom: 24px; }
        .hsc-hero h1 { font-size: clamp(2.4rem,5vw,3.6rem); font-weight: 900; line-height: 1.1; letter-spacing: -1.5px; color: var(--navy); margin: 0 0 20px; text-wrap: balance; }
        .hsc-hero h1 em { font-style: normal; color: var(--gold-dark); }
        .hsc-hero-sub { font-size: 1.1rem; color: var(--muted); max-width: 580px; margin: 0 auto 40px; line-height: 1.75; text-wrap: pretty; }
        .hsc-hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 36px; }
        .hsc-btn-navy { background: var(--navy); color: #fff; border: none; padding: 14px 32px; border-radius: 8px; font-size: .97rem; font-weight: 800; cursor: pointer; transition: all .2s; text-decoration: none; display: inline-block; }
        .hsc-btn-navy:hover { background: var(--navy-mid); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(12,31,74,.3); }
        .hsc-hero-badge { display: inline-flex; align-items: center; gap: 14px; background: #fff; border: 1.5px solid var(--gold-mid); border-radius: 8px; padding: 12px 22px; box-shadow: 0 2px 10px rgba(184,134,11,.12); }
        .hsc-hero-badge-bold { font-size: .92rem; font-weight: 800; color: var(--navy); }
        .hsc-hero-badge-small { font-size: .76rem; color: var(--muted); margin-top: 2px; }

        .hsc-section { padding: 72px 52px; }
        .hsc-section-tag { display: inline-block; font-size: .7rem; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); background: var(--gold-pale); border: 1px solid #e8d280; padding: 5px 16px; border-radius: 4px; margin-bottom: 16px; }
        .hsc-section-h2 { font-size: clamp(1.8rem,3.2vw,2.6rem); font-weight: 900; letter-spacing: -1px; color: var(--navy); margin: 0 0 14px; text-wrap: balance; }
        .hsc-section-sub { font-size: 1.03rem; color: var(--muted); max-width: 620px; line-height: 1.7; margin: 0 0 40px; text-wrap: pretty; }
        .hsc-center { text-align: center; }
        .hsc-section-sub.hsc-center { margin: 0 auto 40px; }

        .hsc-stakes-section { background: var(--soft); }
        .hsc-stakes-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 20px; max-width: 1100px; margin: 0 auto; }
        .hsc-stakes-card { background: var(--white); border-radius: 12px; padding: 28px 24px; border: 1.5px solid var(--border); border-top: 4px solid var(--gold-light); box-shadow: 0 2px 8px rgba(12,31,74,.05); transition: all .22s; }
        .hsc-stakes-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(184,134,11,.1); border-color: var(--gold-mid); background: var(--gold-pale); }
        .hsc-stakes-card h3 { font-size: 1rem; font-weight: 800; color: var(--navy); margin: 0 0 10px; }
        .hsc-stakes-card p { font-size: .9rem; color: var(--muted); line-height: 1.7; margin: 0; }

        .hsc-focus-section { background: var(--white); }
        .hsc-focus-wrap { max-width: 960px; margin: 0 auto; overflow-x: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(12,31,74,.07); border: 1.5px solid var(--border); }
        .hsc-focus-table { width: 100%; border-collapse: collapse; }
        .hsc-focus-table thead th { background: var(--navy); color: #fff; padding: 15px 22px; font-size: .85rem; font-weight: 800; text-align: left; letter-spacing: .3px; }
        .hsc-focus-table tbody tr { border-bottom: 1px solid var(--border); transition: background .18s; }
        .hsc-focus-table tbody tr:last-child { border-bottom: none; }
        .hsc-focus-table tbody tr:hover { background: var(--gold-pale); }
        .hsc-focus-table tbody tr.highlight-row { background: var(--amber); }
        .hsc-focus-table tbody tr.highlight-row:hover { background: var(--gold-pale); }
        .hsc-focus-table td { padding: 15px 22px; font-size: .9rem; color: var(--text); }
        .hsc-focus-table td:first-child { font-weight: 800; color: var(--gold-dark); min-width: 200px; }

        .hsc-approach-section { background: var(--soft); }
        .hsc-approach-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 20px; max-width: 1100px; margin: 0 auto; }
        .hsc-approach-card { background: var(--white); border-radius: 12px; padding: 28px 24px; border: 1.5px solid var(--border); border-left: 4px solid var(--gold-light); transition: all .22s; }
        .hsc-approach-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(184,134,11,.1); background: var(--gold-pale); }
        .hsc-approach-num { width: 32px; height: 32px; border-radius: 6px; background: var(--gold-pale); display: flex; align-items: center; justify-content: center; font-size: .85rem; font-weight: 900; color: var(--gold-dark); margin-bottom: 14px; border: 1px solid var(--gold-mid); }
        .hsc-approach-card h3 { font-size: 1rem; font-weight: 800; color: var(--navy); margin: 0 0 9px; }
        .hsc-approach-card p { font-size: .9rem; color: var(--muted); line-height: 1.7; margin: 0; }

        .hsc-testi-section { background: var(--white); text-align: center; }
        .hsc-testi-card { max-width: 660px; margin: 0 auto; background: var(--white); border: 1.5px solid var(--border); border-top: 4px solid var(--gold-light); border-radius: 12px; padding: 44px 40px; box-shadow: 0 6px 28px rgba(12,31,74,.07); }
        .hsc-testi-stars { color: var(--gold-light); font-size: 1.3rem; letter-spacing: 4px; margin-bottom: 20px; }
        .hsc-testi-quote-icon { font-size: 3rem; line-height: 1; color: var(--gold-mid); margin-bottom: 8px; }
        .hsc-testi-text { font-size: 1.05rem; color: var(--text); line-height: 1.8; font-style: italic; margin: 0 0 28px; text-wrap: pretty; }
        .hsc-testi-text strong { font-style: normal; color: var(--navy); }
        .hsc-testi-author { display: flex; align-items: center; justify-content: center; gap: 14px; }
        .hsc-testi-avatar { width: 46px; height: 46px; border-radius: 50%; background: var(--gold-pale); border: 2px solid var(--gold-mid); display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 900; color: var(--gold-dark); }
        .hsc-testi-name { font-size: .9rem; font-weight: 800; color: var(--navy); text-align: left; }
        .hsc-testi-role { font-size: .79rem; color: var(--muted); text-align: left; }

        .hsc-fit-section { background: var(--amber); border-top: 2px solid var(--amber-mid); border-bottom: 2px solid var(--amber-mid); }
        .hsc-fit-inner { max-width: 820px; margin: 0 auto; }
        .hsc-fit-list { list-style: none; display: grid; grid-template-columns: repeat(auto-fit,minmax(320px,1fr)); gap: 12px; margin: 0 0 36px; padding: 0; }
        .hsc-fit-list li { display: flex; align-items: flex-start; gap: 12px; font-size: .95rem; color: var(--text); line-height: 1.6; }
        .hsc-fit-check { width: 24px; height: 24px; min-width: 24px; background: #fff; border: 1.5px solid var(--gold-light); border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: .82rem; color: var(--gold); margin-top: 2px; }
        .hsc-fit-cta-row { text-align: center; margin-top: 8px; }

        .hsc-cta-section { background: var(--navy); border-top: 4px solid var(--gold); padding: 80px 52px; text-align: center; }
        .hsc-cta-section h2 { font-size: clamp(1.9rem,3.8vw,2.8rem); font-weight: 900; color: #fff; letter-spacing: -1px; margin: 0 0 16px; text-wrap: balance; }
        .hsc-cta-section p { font-size: 1.03rem; color: rgba(255,255,255,.72); max-width: 540px; margin: 0 auto 36px; line-height: 1.72; text-wrap: pretty; }
        .hsc-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }
        .hsc-btn-gold { background: var(--gold-light); color: var(--navy); border: none; padding: 15px 36px; border-radius: 8px; font-size: 1rem; font-weight: 900; cursor: pointer; transition: all .2s; text-decoration: none; display: inline-block; }
        .hsc-btn-gold:hover { background: var(--gold); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(184,134,11,.4); }
        .hsc-btn-outline-cta { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,.35); padding: 15px 36px; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all .2s; text-decoration: none; display: inline-block; }
        .hsc-btn-outline-cta:hover { border-color: #fff; background: rgba(255,255,255,.08); }
        .hsc-cta-note { font-size: .82rem !important; color: rgba(255,255,255,.45) !important; margin: 0 !important; }

        .hsc-footer { background: var(--navy); border-top: 1px solid rgba(255,255,255,.1); padding: 28px 52px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; }
        .hsc-footer-logo { font-size: 1rem; font-weight: 900; color: #fff; }
        .hsc-footer-logo span { color: var(--gold-light); }
        .hsc-footer p { font-size: .8rem; color: rgba(255,255,255,.45); margin: 0; }

        @media (max-width: 768px) {
          .hsc-page { padding-top: 104px; }
          .hsc-hero, .hsc-section, .hsc-cta-section { padding-left: 20px; padding-right: 20px; }
          .hsc-breadcrumb, .hsc-urgency-banner { padding-left: 20px; padding-right: 20px; }
          .hsc-sibling-tabs { justify-content: flex-start; }
          .hsc-stab { padding: 14px 20px; }
          .hsc-testi-card { padding: 28px 20px; }
          .hsc-fit-list { grid-template-columns: 1fr; }
          .hsc-footer { padding: 20px; flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <NavigationNew />

      <div className="hsc-breadcrumb">
        <Link to="/">Home</Link><span>&rsaquo;</span>
        <Link to="/#programs">Programs</Link><span>&rsaquo;</span>
        HSC Excellence
      </div>

      <div className="hsc-sibling-tabs">
        <Link className="hsc-stab" to="/programs/high-school">High School (Y7-10)</Link>
        <Link className="hsc-stab active" to="/hsc-excellence">HSC Excellence (Y11-12)</Link>
      </div>

      <div className="hsc-urgency-banner">
        <div className="hsc-urgency-item">Limited Places This Term <div className="hsc-urgency-highlight">Filling Fast</div></div>
        <div className="hsc-urgency-item">Years 11-12 HSC Preparation</div>
        <div className="hsc-urgency-item">Band 6 Results Track Record</div>
        <div className="hsc-urgency-item">Enrolments Now Open</div>
      </div>

      <main>
        <div className="hsc-hero">
          <div className="hsc-hero-tag">HSC EXCELLENCE &middot; YEARS 11-12</div>
          <h1>The HSC Is <em>Two Years of Decisions</em></h1>
          <p className="hsc-hero-sub">
            Every subject choice, every assessment mark, every study hour counts toward the ATAR. DA Tuition's HSC
            Excellence program is built for students who want to walk out with their best possible result.
          </p>
          <div className="hsc-hero-btns">
            <Link className="hsc-btn-navy" to="/book-interview">Secure a Spot - Limited Places</Link>
          </div>
          <div className="hsc-hero-badge">
            <div>
              <div className="hsc-hero-badge-bold">100+ Band 6 Results</div>
              <div className="hsc-hero-badge-small">Across English, Maths, Science and Humanities</div>
            </div>
          </div>
        </div>

        <section className="hsc-section hsc-stakes-section" id="programs">
          <div className="hsc-center">
            <div className="hsc-section-tag">WHY THIS STAGE IS CRITICAL</div>
            <h2 className="hsc-section-h2">What Makes the HSC the Most Important Two Years</h2>
            <p className="hsc-section-sub hsc-center">The HSC is not just an exam. It is a two-year performance. Here is what we prepare students for.</p>
          </div>
          <div className="hsc-stakes-grid">
            {stakesCards.map((card) => (
              <article className="hsc-stakes-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="hsc-section hsc-focus-section">
          <div className="hsc-center">
            <div className="hsc-section-tag">SUBJECTS COVERED</div>
            <h2 className="hsc-section-h2">HSC Excellence Curriculum Focus Areas</h2>
            <p className="hsc-section-sub hsc-center">Every subject group has a dedicated tutor with HSC marking experience, not just content knowledge.</p>
          </div>
          <div className="hsc-focus-wrap">
            <table className="hsc-focus-table">
              <thead>
                <tr>
                  <th>Subject / Focus Area</th>
                  <th>What We Build</th>
                  <th>Key Skills Developed</th>
                </tr>
              </thead>
              <tbody>
                {focusRows.map((row) => (
                  <tr className={row.highlight ? 'highlight-row' : undefined} key={row.area}>
                    <td>{row.area}</td>
                    <td>{row.build}</td>
                    <td>{row.skills}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="hsc-section hsc-approach-section">
          <div className="hsc-center" style={{ marginBottom: 44 }}>
            <div className="hsc-section-tag">OUR APPROACH</div>
            <h2 className="hsc-section-h2">How We Teach HSC Excellence</h2>
          </div>
          <div className="hsc-approach-grid">
            {approachCards.map((card, index) => (
              <article className="hsc-approach-card" key={card.title}>
                <div className="hsc-approach-num">{index + 1}</div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="hsc-section hsc-testi-section">
          <div className="hsc-section-tag" style={{ marginBottom: 32 }}>Real Families, Real Results</div>
          <div className="hsc-testi-card">
            <div className="hsc-testi-stars" aria-label="Five star review">*****</div>
            <div className="hsc-testi-quote-icon">"</div>
            <p className="hsc-testi-text">
              Our daughter came into Year 12 thinking she would be lucky to get an <strong>ATAR of 80</strong>.
              She finished with <strong>94.35</strong>. The tutors knew the HSC inside out: not just the content,
              but how the markers think. That is the difference.
            </p>
            <div className="hsc-testi-author">
              <div className="hsc-testi-avatar">D</div>
              <div>
                <div className="hsc-testi-name">Dad of Year 12 student, Chatswood</div>
                <div className="hsc-testi-role">ATAR 94.35</div>
              </div>
            </div>
          </div>
        </section>

        <section className="hsc-section hsc-fit-section">
          <div className="hsc-fit-inner">
            <div className="hsc-center" style={{ marginBottom: 32 }}>
              <div className="hsc-section-tag">Is This Right For Us?</div>
              <h2 className="hsc-section-h2">DA Tuition HSC Excellence Is Perfect If...</h2>
            </div>
            <ul className="hsc-fit-list">
              {fitItems.map((item) => (
                <li key={item}>
                  <div className="hsc-fit-check">✓</div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="hsc-fit-cta-row">
              <Link className="hsc-btn-navy" to="/book-interview">Secure a Spot - Limited Places</Link>
            </div>
          </div>
        </section>

        <div className="hsc-cta-section">
          <h2>The HSC Does Not Wait.<br />Neither Should You.</h2>
          <p>
            Every term without the right support is a term of marks that cannot be recovered. Book an interview
            and find out exactly what is possible for your child's ATAR.
          </p>
          <div className="hsc-cta-btns">
            <Link className="hsc-btn-gold" to="/book-interview">Secure a Spot - Limited Places Available</Link>
            <Link className="hsc-btn-outline-cta" to="/book-interview">Book an Interview Now</Link>
          </div>
          <p className="hsc-cta-note">No entrance exam &nbsp;&middot;&nbsp; No lock-in contract &nbsp;&middot;&nbsp; Results guaranteed or additional support at no cost</p>
        </div>
      </main>

      <footer className="hsc-footer">
        <div className="hsc-footer-logo">DA <span>Tuition</span></div>
        <p>&copy; 2025 DA Tuition &middot; Sydney, Australia</p>
        <p>hello@datuition.com.au</p>
      </footer>
    </div>
  );
};

export default HSCExcellence;
