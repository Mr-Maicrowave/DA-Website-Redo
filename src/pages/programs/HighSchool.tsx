import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';

const cardTones = ['hs-tone-blue', 'hs-tone-green', 'hs-tone-gold'];

const focusRows = [
  {
    area: 'English and Essay Writing',
    build: 'Analytical writing, close reading, text response',
    skills: 'Thesis construction, evidence integration, language techniques',
  },
  {
    area: 'Mathematics',
    build: 'Algebra, geometry, statistics, calculus foundations',
    skills: 'Problem-solving, working mathematically, exam technique',
    highlight: true,
  },
  {
    area: 'Sciences',
    build: 'Physics, Chemistry, Biology concepts and inquiry skills',
    skills: 'Scientific reasoning, data analysis, extended response writing',
  },
  {
    area: 'HSIE / Humanities',
    build: 'Geography, History, critical thinking, source analysis',
    skills: 'Argument structure, perspective taking, extended response',
    highlight: true,
  },
  {
    area: 'Exam and Study Skills',
    build: 'Organisation, note-taking, revision strategies',
    skills: 'Time management, past-paper practice, reducing exam anxiety',
  },
];

const stakesCards = [
  {
    title: 'The Curriculum Gets Serious',
    text: 'Year 7 introduces abstract concepts: algebra, essay writing, scientific reasoning. These compound year on year. Students who build strong foundations early keep more options open all the way to the HSC.',
  },
  {
    title: 'Habits Form Now or Not at All',
    text: 'The study habits a student develops in Years 7-8 determine how they handle the pressure of Years 11-12. We teach method, not just content.',
  },
  {
    title: 'Selective and Scholarship Pressure',
    text: 'Many families are managing Year 9-10 class selection or scholarship applications at the same time. Our tutors know what selective and private schools are looking for.',
  },
  {
    title: 'Confidence Decides Outcomes',
    text: 'A teenager who believes they can do hard things will attempt hard things. We build that belief deliberately, through visible progress every session.',
  },
];

const approachCards = [
  {
    title: 'We Diagnose Before We Teach',
    text: "We identify exactly where each student's gaps are and why. Then we fix the root cause, not just the symptom.",
  },
  {
    title: 'Small Groups, Expert Attention',
    text: 'High school groups are capped at 5 students. Every student gets individual feedback every session, not just group instruction.',
  },
  {
    title: 'Past Papers and Exam Technique',
    text: 'From Year 8 onwards we integrate past paper practice, marking criteria, and time-pressure drills so students know exactly how to perform on test day.',
  },
  {
    title: 'Parent Visibility at Every Step',
    text: 'You receive a written progress update every term. You will never wonder whether the lessons are working.',
  },
];

const fitItems = [
  'Your child is finding the jump from primary to high school harder than expected',
  'Marks are inconsistent: strong in class, weaker in exams',
  'Your teenager lacks confidence in one or more subjects',
  'You want selective school or scholarship preparation built into the program',
  'Your child needs better study habits before Year 11 hits',
  'You want written progress updates, not just anecdotal feedback',
];

const HighSchool = () => {
  return (
    <div className="hs-page">
      <SEO
        title="High School Tutoring Years 7-10"
        description="Years 7-10 tutoring at DA Tuition builds the skills, habits, and confidence students need for senior school and beyond."
        canonicalUrl="/programs/high-school"
      />

      <style>{`
        .hs-page {
          --navy:#071629; --navy-mid:#1a3a6e;
          --gold:#c9a227; --gold-light:#e0bd4b; --gold-pale:#fff6e7;
          --blue:#fff6e7; --blue-mid:#e0bd4b; --blue-text:#071629; --blue-deep:#c9a227; --blue-dark:#071629;
          --white:#fffdf8; --text:#071629; --muted:#61708a; --border:rgba(201,162,39,0.22); --soft:#fff6e7;
          min-height: 100vh;
          background: var(--white);
          color: var(--text);
          font-family: 'Segoe UI', system-ui, sans-serif;
          line-height: 1.6;
          padding-top: 120px;
        }

        .hs-page *, .hs-page *::before, .hs-page *::after { box-sizing: border-box; }

        .hs-page h1, .hs-page h2, .hs-page h3 {
          font-family: 'Merriweather', Georgia, serif;
        }

        .hs-breadcrumb { background: var(--soft); border-bottom: 1px solid var(--border); padding: 14px 52px; font-size: .82rem; color: var(--muted); }
        .hs-breadcrumb a { color: var(--navy); text-decoration: none; font-weight: 600; }
        .hs-breadcrumb a:hover { text-decoration: underline; }
        .hs-breadcrumb span { margin: 0 8px; }

        .hs-sibling-tabs { background: var(--white); border-bottom: 2px solid var(--border); display: flex; justify-content: center; overflow-x: auto; }
        .hs-stab { padding: 14px 32px; font-size: .88rem; font-weight: 700; text-decoration: none; color: var(--muted); border-bottom: 3px solid transparent; margin-bottom: -2px; white-space: nowrap; transition: all .2s; }
        .hs-stab:hover { color: var(--navy); }
        .hs-stab.active { color: var(--blue-dark); border-bottom-color: var(--blue-deep); }

        .hs-urgency-banner { background: linear-gradient(135deg,var(--gold-pale) 0%,var(--soft) 100%); border-top: 3px solid var(--gold-light); border-bottom: 3px solid var(--gold-light); padding: 16px 52px; display: flex; align-items: center; justify-content: center; gap: 32px; flex-wrap: wrap; }
        .hs-urgency-item { display: flex; align-items: center; gap: 10px; font-size: .88rem; font-weight: 700; color: var(--navy); }
        .hs-urgency-highlight { background: var(--navy); color: #fff; font-size: .75rem; font-weight: 800; padding: 3px 12px; border-radius: 999px; white-space: nowrap; }

        .hs-hero { background: linear-gradient(160deg,#fff6e7 0%,#fffdf8 55%,rgba(201,162,39,0.1) 100%); padding: 80px 52px 72px; text-align: center; border-bottom: 1px solid var(--border); }
        .hs-hero-tag { display: inline-block; font-size: .72rem; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: var(--blue-dark); background: #fff; border: 1.5px solid var(--blue-mid); padding: 6px 20px; border-radius: 999px; margin-bottom: 24px; }
        .hs-hero h1 { font-family: 'Merriweather', Georgia, serif; font-size: clamp(2.4rem,5vw,3.6rem); font-weight: 900; line-height: 1.1; letter-spacing: -1.5px; color: var(--navy); margin: 0 0 20px; text-wrap: balance; }
        .hs-hero h1 em { font-style: normal; color: var(--blue-dark); }
        .hs-hero-sub { font-size: 1.1rem; color: var(--muted); max-width: 560px; margin: 0 auto 40px; line-height: 1.75; text-wrap: pretty; }
        .hs-hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 36px; }
        .hs-btn-navy { background: var(--gold); color: var(--navy); border: none; padding: 14px 32px; border-radius: 999px; font-size: .97rem; font-weight: 800; cursor: pointer; transition: all .2s; text-decoration: none; display: inline-block; }
        .hs-btn-navy:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201,162,39,.35); }
        .hs-btn-outline { background: var(--white); color: var(--navy); border: 2px solid var(--navy); padding: 14px 32px; border-radius: 999px; font-size: .97rem; font-weight: 700; cursor: pointer; transition: all .2s; text-decoration: none; display: inline-block; }
        .hs-btn-outline:hover { background: var(--blue); transform: translateY(-2px); }
        .hs-hero-badge { display: inline-flex; align-items: center; gap: 14px; background: #fffdf8; border: 1.5px solid var(--blue-mid); border-radius: 8px; padding: 12px 22px; box-shadow: 0 2px 10px rgba(201,162,39,.15); }
        .hs-hero-badge-bold { font-size: .92rem; font-weight: 800; color: var(--navy); }
        .hs-hero-badge-small { font-size: .76rem; color: var(--muted); margin-top: 2px; }

        .hs-section { padding: 72px 52px; }
        .hs-section-tag { display: inline-block; font-size: .7rem; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); background: var(--gold-pale); border: 1px solid rgba(201,162,39,0.45); padding: 5px 16px; border-radius: 999px; margin-bottom: 16px; }
        .hs-section-h2 { font-family: 'Merriweather', Georgia, serif; font-size: clamp(1.8rem,3.2vw,2.6rem); font-weight: 900; letter-spacing: -1px; color: var(--navy); margin: 0 0 14px; text-wrap: balance; }
        .hs-section-sub { font-size: 1.03rem; color: var(--muted); max-width: 620px; line-height: 1.7; margin: 0 0 40px; text-wrap: pretty; }
        .hs-center { text-align: center; }
        .hs-section-sub.hs-center { margin: 0 auto 40px; }

        .hs-stakes-section { background: var(--soft); }
        .hs-stakes-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 20px; max-width: 1100px; margin: 0 auto; }
        .hs-stakes-card { border-radius: 20px; padding: 28px 24px; border: 1px solid rgba(7,22,41,0.1); box-shadow: 0 2px 8px rgba(7,22,41,.05); transition: all .22s; }
        .hs-stakes-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(7,22,41,.1); }
        .hs-stakes-card h3 { font-family: 'Merriweather', Georgia, serif; font-size: 1rem; font-weight: 800; color: var(--navy); margin: 0 0 10px; }
        .hs-stakes-card p { font-size: .9rem; color: var(--muted); line-height: 1.7; margin: 0; }

        .hs-tone-blue { background: linear-gradient(to bottom, #f7fbff, #e8f2ff); }
        .hs-tone-blue:hover { border-color: rgba(16,35,63,0.25); }
        .hs-tone-green { background: linear-gradient(to bottom, #fbfff8, #eaf8ef); }
        .hs-tone-green:hover { border-color: rgba(16,35,63,0.25); }
        .hs-tone-gold { background: linear-gradient(to bottom, #fffdf7, #fff1cd); }
        .hs-tone-gold:hover { border-color: var(--gold-light); }

        .hs-focus-section { background: var(--white); }
        .hs-focus-wrap { max-width: 920px; margin: 0 auto; overflow-x: auto; border-radius: 20px; box-shadow: 0 4px 20px rgba(7,22,41,.07); border: 1.5px solid var(--border); }
        .hs-focus-table { width: 100%; border-collapse: collapse; }
        .hs-focus-table thead th { background: var(--navy); color: #fff; padding: 15px 22px; font-size: .85rem; font-weight: 800; text-align: left; letter-spacing: .3px; }
        .hs-focus-table tbody tr { border-bottom: 1px solid var(--border); transition: background .18s; }
        .hs-focus-table tbody tr:last-child { border-bottom: none; }
        .hs-focus-table tbody tr:hover { background: var(--gold-pale); }
        .hs-focus-table tbody tr.highlight-row { background: var(--soft); }
        .hs-focus-table tbody tr.highlight-row:hover { background: var(--gold-pale); }
        .hs-focus-table td { padding: 15px 22px; font-size: .9rem; color: var(--text); }
        .hs-focus-table td:first-child { font-weight: 800; color: var(--blue-dark); min-width: 180px; }

        .hs-approach-section { background: var(--white); }
        .hs-approach-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 20px; max-width: 1100px; margin: 0 auto; }
        .hs-approach-card { border-radius: 20px; padding: 28px 24px; border: 1px solid rgba(7,22,41,0.1); box-shadow: 0 2px 8px rgba(7,22,41,.05); transition: all .22s; }
        .hs-approach-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(7,22,41,.1); }
        .hs-approach-num { width: 32px; height: 32px; border-radius: 8px; background: #10233f; display: flex; align-items: center; justify-content: center; font-size: .85rem; font-weight: 900; color: #f1df9a; margin-bottom: 14px; }
        .hs-approach-card h3 { font-family: 'Merriweather', Georgia, serif; font-size: 1rem; font-weight: 800; color: var(--navy); margin: 0 0 9px; }
        .hs-approach-card p { font-size: .9rem; color: var(--muted); line-height: 1.7; margin: 0; }

        .hs-testi-section { background: var(--soft); text-align: center; }
        .hs-testi-card { max-width: 660px; margin: 0 auto; background: var(--white); border: 1.5px solid var(--border); border-top: 4px solid var(--gold); border-radius: 24px; padding: 44px 40px; box-shadow: 0 6px 28px rgba(7,22,41,.07); }
        .hs-testi-stars { color: var(--gold-light); font-size: 1.3rem; letter-spacing: 4px; margin-bottom: 20px; }
        .hs-testi-quote-icon { font-size: 3rem; line-height: 1; color: var(--blue-mid); margin-bottom: 8px; }
        .hs-testi-text { font-family: 'Merriweather', Georgia, serif; font-size: 1.05rem; color: var(--text); line-height: 1.8; font-style: italic; margin: 0 0 28px; text-wrap: pretty; }
        .hs-testi-text strong { font-style: normal; color: var(--navy); }
        .hs-testi-author { display: flex; align-items: center; justify-content: center; gap: 14px; }
        .hs-testi-avatar { width: 46px; height: 46px; border-radius: 50%; background: var(--blue); border: 2px solid var(--blue-mid); display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 900; color: var(--blue-dark); }
        .hs-testi-name { font-size: .9rem; font-weight: 800; color: var(--navy); text-align: left; }
        .hs-testi-role { font-size: .79rem; color: var(--muted); text-align: left; }

        .hs-fit-section { background: var(--gold-pale); border-top: 2px solid var(--gold-light); border-bottom: 2px solid var(--gold-light); }
        .hs-fit-inner { max-width: 820px; margin: 0 auto; }
        .hs-fit-list { list-style: none; display: grid; grid-template-columns: repeat(auto-fit,minmax(320px,1fr)); gap: 12px; margin: 0 0 36px; padding: 0; }
        .hs-fit-list li { display: flex; align-items: flex-start; gap: 12px; font-size: .95rem; color: var(--text); line-height: 1.6; }
        .hs-fit-check { width: 24px; height: 24px; min-width: 24px; background: var(--gold-pale); border: 1.5px solid var(--gold-light); border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: .82rem; color: var(--gold); margin-top: 2px; }
        .hs-fit-cta-row { text-align: center; margin-top: 8px; }

        .hs-cta-section { background: var(--navy); border-top: 4px solid var(--gold); padding: 80px 52px; text-align: center; }
        .hs-cta-section h2 { font-family: 'Merriweather', Georgia, serif; font-size: clamp(1.9rem,3.8vw,2.8rem); font-weight: 900; color: #fff; letter-spacing: -1px; margin: 0 0 16px; text-wrap: balance; }
        .hs-cta-section p { font-size: 1.03rem; color: rgba(255,255,255,.72); max-width: 540px; margin: 0 auto 36px; line-height: 1.72; text-wrap: pretty; }
        .hs-btn-gold { background: var(--gold); color: var(--navy); border: none; padding: 15px 36px; border-radius: 999px; font-size: 1rem; font-weight: 900; cursor: pointer; transition: all .2s; text-decoration: none; display: inline-block; }
        .hs-btn-gold:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201,162,39,.4); }
        .hs-cta-note { margin-top: 18px !important; margin-bottom: 0 !important; font-size: .82rem !important; color: rgba(255,255,255,.45) !important; }

        .hs-footer { background: var(--navy); border-top: 1px solid rgba(255,255,255,.1); padding: 28px 52px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; }
        .hs-footer-logo { font-size: 1rem; font-weight: 900; color: #fff; }
        .hs-footer-logo span { color: var(--gold-light); }
        .hs-footer p { font-size: .8rem; color: rgba(255,255,255,.45); margin: 0; }

        .hs-photo-section { padding: 0 52px; max-width: 1140px; margin: 0 auto; }
        .hs-photo-split { display: grid; grid-template-columns: 1fr 1fr; border-radius: 24px; overflow: hidden; border: 1.5px solid var(--border); box-shadow: 0 8px 32px rgba(7,22,41,0.08); }
        .hs-photo-split-img { background-size: cover; background-position: center; min-height: 360px; }
        .hs-photo-split-copy { background: var(--soft); padding: 52px 44px; display: flex; flex-direction: column; justify-content: center; }
        .hs-photo-split-copy h2 { font-family: 'Merriweather', Georgia, serif; font-size: 1.85rem; font-weight: 900; color: var(--navy); margin: 0 0 16px; line-height: 1.2; letter-spacing: -0.5px; }
        .hs-photo-split-copy p { font-size: 0.97rem; color: var(--muted); line-height: 1.75; margin: 0; }
        .hs-photo-pair-section { padding: 72px 52px; max-width: 1140px; margin: 0 auto; }
        .hs-photo-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .hs-photo-pair-item { border-radius: 16px; overflow: hidden; position: relative; }
        .hs-photo-pair-item img { width: 100%; height: 300px; object-fit: cover; display: block; transition: transform .4s; }
        .hs-photo-pair-item:hover img { transform: scale(1.03); }
        .hs-photo-pair-label { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(7,22,41,0.72), transparent); color: #fff; padding: 20px 20px 14px; font-size: .8rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }

        @media (max-width: 768px) {
          .hs-page { padding-top: 104px; }
          .hs-hero, .hs-section, .hs-cta-section { padding-left: 20px; padding-right: 20px; }
          .hs-breadcrumb, .hs-urgency-banner { padding-left: 20px; padding-right: 20px; }
          .hs-sibling-tabs { justify-content: flex-start; }
          .hs-stab { padding: 14px 20px; }
          .hs-testi-card { padding: 28px 20px; }
          .hs-fit-list { grid-template-columns: 1fr; }
          .hs-footer { padding: 20px; flex-direction: column; align-items: flex-start; }
          .hs-photo-split { grid-template-columns: 1fr; }
          .hs-photo-section, .hs-photo-pair-section { padding-left: 20px; padding-right: 20px; }
          .hs-photo-pair { grid-template-columns: 1fr; }
          .hs-photo-split-img { min-height: 240px; }
        }
      `}</style>

      <NavigationNew />

      <div className="hs-breadcrumb">
        <Link to="/">Home</Link><span>&rsaquo;</span>
        <Link to="/#programs">Programs</Link><span>&rsaquo;</span>
        High School
      </div>

      <div className="hs-sibling-tabs">
        <Link className="hs-stab active" to="/programs/high-school">High School (Y7-10)</Link>
        <Link className="hs-stab" to="/hsc-excellence">HSC Excellence (Y11-12)</Link>
      </div>

      <div className="hs-urgency-banner">
        <div className="hs-urgency-item">Limited Places This Term <div className="hs-urgency-highlight">Filling Fast</div></div>
        <div className="hs-urgency-item">Years 7-10 Programs</div>
        <div className="hs-urgency-item">Selective School Preparation</div>
        <div className="hs-urgency-item">HSC Ready from Year 7</div>
      </div>

      <main>
        <div className="hs-hero">
          <div className="hs-hero-tag">HIGH SCHOOL TUITION &middot; YEARS 7-10</div>
          <h1>The Years That Shape <em>Everything</em></h1>
          <p className="hs-hero-sub">
            Years 7-10 are where academic trajectories lock in. Our small-group tutoring builds the skills,
            habits, and confidence your child needs to perform well in senior school and beyond.
          </p>
          <div className="hs-hero-btns">
            <Link className="hs-btn-navy" to="/book-interview">Book an Interview</Link>
            <a className="hs-btn-outline" href="#programs">See Our Programs</a>
          </div>
          <div className="hs-hero-badge">
            <div>
              <div className="hs-hero-badge-bold">Selective School and HSC Preparation</div>
              <div className="hs-hero-badge-small">Built into every session from Year 7</div>
            </div>
          </div>
        </div>

        <div className="hs-photo-section" style={{ paddingTop: 52 }}>
          <div className="hs-photo-split">
            <div className="hs-photo-split-img" style={{ backgroundImage: 'url(/images/programs/highschool-tutoring.jpg)' }} />
            <div className="hs-photo-split-copy">
              <div className="hs-section-tag" style={{ marginBottom: 18 }}>Expert Instruction</div>
              <h2>Your Teacher Beside You, Every Step</h2>
              <p>At DA Tuition, high school students don't just receive instruction. They get an experienced tutor working beside them, identifying exactly where they're losing marks and showing them how to fix it.</p>
            </div>
          </div>
        </div>

        <section className="hs-section hs-stakes-section" id="programs">
          <div className="hs-center">
            <div className="hs-section-tag">WHY THIS STAGE IS CRITICAL</div>
            <h2 className="hs-section-h2">What Makes Years 7-10 So Important</h2>
            <p className="hs-section-sub hs-center">
              The move from primary to secondary school is the most significant academic shift a child faces. Here is what is at stake.
            </p>
          </div>
          <div className="hs-stakes-grid">
            {stakesCards.map((card, index) => (
              <article className={`hs-stakes-card ${cardTones[index % cardTones.length]}`} key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="hs-section hs-focus-section">
          <div className="hs-center">
            <div className="hs-section-tag">CURRICULUM COVERAGE</div>
            <h2 className="hs-section-h2">Year 7-10 Curriculum Focus Areas</h2>
            <p className="hs-section-sub hs-center">Aligned to the NSW syllabus and structured to build on what your child already knows.</p>
          </div>
          <div className="hs-focus-wrap">
            <table className="hs-focus-table">
              <thead>
                <tr>
                  <th>Focus Area</th>
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

        <section className="hs-section hs-approach-section">
          <div className="hs-center" style={{ marginBottom: 44 }}>
            <div className="hs-section-tag">OUR APPROACH</div>
            <h2 className="hs-section-h2">How We Teach High School</h2>
          </div>
          <div className="hs-approach-grid">
            {approachCards.map((card, index) => (
              <article className={`hs-approach-card ${cardTones[index % cardTones.length]}`} key={card.title}>
                <div className="hs-approach-num">{index + 1}</div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="hs-photo-pair-section">
          <div className="hs-photo-pair">
            <div className="hs-photo-pair-item">
              <img src="/images/programs/highschool-group.jpg" alt="High school students collaborating at DA Tuition" />
              <div className="hs-photo-pair-label">Collaborative group sessions</div>
            </div>
            <div className="hs-photo-pair-item">
              <img src="/images/programs/highschool-english.jpg" alt="English tutoring at DA Tuition" />
              <div className="hs-photo-pair-label">Expert English instruction</div>
            </div>
          </div>
        </div>

        <section className="hs-section hs-testi-section">
          <div className="hs-section-tag" style={{ marginBottom: 32 }}>Real Families, Real Results</div>
          <div className="hs-testi-card">
            <div className="hs-testi-stars" aria-label="Five star review">*****</div>
            <div className="hs-testi-quote-icon">"</div>
            <p className="hs-testi-text">
              My son started Year 9 <strong>two years behind in maths</strong>. After two terms with DA Tuition he passed his
              half-yearly with a B, something I genuinely did not think was possible. The progress updates kept us in the loop
              the whole way through.
            </p>
            <div className="hs-testi-author">
              <div className="hs-testi-avatar">M</div>
              <div>
                <div className="hs-testi-name">Mum of Year 9 student</div>
                <div className="hs-testi-role">Parramatta</div>
              </div>
            </div>
          </div>
        </section>

        <section className="hs-section hs-fit-section">
          <div className="hs-fit-inner">
            <div className="hs-center" style={{ marginBottom: 32 }}>
              <div className="hs-section-tag">Is This Right For Us?</div>
              <h2 className="hs-section-h2">DA Tuition High School Is Perfect If...</h2>
            </div>
            <ul className="hs-fit-list">
              {fitItems.map((item) => (
                <li key={item}>
                  <div className="hs-fit-check">✓</div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="hs-fit-cta-row">
              <Link className="hs-btn-navy" to="/book-interview">Book an Interview</Link>
            </div>
          </div>
        </section>

        <div className="hs-photo-pair-section">
          <div className="hs-photo-pair">
            <div className="hs-photo-pair-item">
              <img src="/images/v3/teacher_whiteboard.jpg" alt="DA Tuition teacher explaining a concept on the whiteboard to high school students" />
              <div className="hs-photo-pair-label">Concepts explained step by step</div>
            </div>
            <div className="hs-photo-pair-item">
              <img src="/images/v3/small_group_tutoring.jpg" alt="Small group of Years 7-10 students receiving individual attention from a DA Tuition tutor" />
              <div className="hs-photo-pair-label">Individual attention, every session</div>
            </div>
          </div>
        </div>

        <div className="hs-cta-section">
          <h2>Do Not Wait for the<br />Report Card</h2>
          <p>
            The sooner we identify the gaps, the easier they are to close. Book an interview and we will help you find
            the right starting point.
          </p>
          <Link className="hs-btn-gold" to="/book-interview">Book an Interview</Link>
          <p className="hs-cta-note">No entrance exam &nbsp;&middot;&nbsp; Honest placement advice &nbsp;&middot;&nbsp; Limited spots each term</p>
        </div>
      </main>

      <FooterNew />
    </div>
  );
};

export default HighSchool;
