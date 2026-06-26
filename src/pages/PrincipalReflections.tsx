import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const PrincipalReflections = () => {
  return (
    <>
      <SEO
        title="Principal's Reflections — Why DA Tuition Exists"
        description="Read the principal's reflections on thoughtful guidance, high standards, and the deeply personalised care that helps every child at DA Tuition rise."
        canonicalUrl="/principal-reflections"
      />
      <NavigationNew />

      <style>{`
        .pr-wrap{padding:24px 0 60px;background:#ebe4db;font-family:"Baskerville","Palatino Linotype",Georgia,serif;color:#3d352f;}
        .pr-page{width:100%;max-width:210mm;min-height:auto;margin:0 auto 18px;background:linear-gradient(180deg,#f7f1e8 0%, #f2ece4 100%);border:4px solid #d7c3a4;box-shadow:0 22px 60px rgba(75,54,27,.14);position:relative;overflow:hidden;}
        .pr-page-inner{margin:10px;background:linear-gradient(180deg,#fdfbf8 0%, #fbf8f3 100%);border:1px solid #e8ddd0;position:relative;padding:32px 32px 26px 60px;}
        .pr-side-bar{position:absolute;left:0;top:0;bottom:0;width:32px;}
        .pr-top-band{position:absolute;left:32px;top:0;height:10px;width:56%;}
        .pr-page-no{position:absolute;right:26px;top:20px;font:11px/1.2 "Helvetica Neue",Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#9c9185;}
        .pr-page-rule{position:absolute;right:26px;top:40px;width:108px;height:2px;background:#dcc6a4;}
        .pr-motif{position:absolute;right:24px;bottom:18px;font:10px/1 "Helvetica Neue",Arial,sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#c8baa7;opacity:.72;}
        .pr-motif:before,.pr-motif:after{content:"";display:inline-block;width:20px;height:1px;background:#d8c7ad;vertical-align:middle;margin:0 7px 2px;}

        .pr-label{font:10px/1.2 "Helvetica Neue",Arial,sans-serif;letter-spacing:.34em;text-transform:uppercase;margin-bottom:10px;color:var(--pr-box);}
        .pr-eyebrow{display:inline-block;padding:6px 12px;border-radius:999px;border:1px solid;font:9px/1.2 "Helvetica Neue",Arial,sans-serif;letter-spacing:.24em;text-transform:uppercase;margin-bottom:14px;background:var(--pr-chipbg);color:var(--pr-chip);border-color:color-mix(in srgb, var(--pr-chip) 35%, white);}
        .pr-page h2{margin:0;font-family:"Garamond","EB Garamond","Baskerville","Palatino Linotype",Georgia,serif;font-size:32px;line-height:0.97;letter-spacing:-.015em;white-space:pre-line;font-weight:600;max-width:76%;color:var(--pr-title);}
        .pr-subtitle{margin-top:13px;font-size:15.2px;line-height:1.5;color:#776b5f;max-width:79%;}

        .pr-hero-quote{margin-top:20px;padding:15px 17px 15px;border-left:4px solid var(--pr-accent2);background:linear-gradient(180deg,rgba(255,255,255,.82),rgba(251,246,238,.88));font-size:15.7px;line-height:1.44;color:var(--pr-title);border-radius:0 6px 6px 0;max-width:86%;}
        .pr-page.pr-open .pr-hero-quote{margin-top:22px;padding:17px 19px 17px;max-width:82%;box-shadow:0 8px 18px rgba(67,48,27,.04);}
        .pr-hero-quote strong{font-weight:600;}

        .pr-two-col{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-top:22px;align-items:start;}
        .pr-page.pr-open .pr-two-col{gap:36px;margin-top:24px;}
        .pr-col p{margin:0 0 17px;font-size:14.2px;line-height:1.68;}
        .pr-col p:first-child{font-size:15.05px;line-height:1.62;}
        .pr-col p:first-child::first-letter{float:left;font-size:44px;line-height:.82;padding-right:7px;padding-top:4px;font-weight:500;color:var(--pr-title);}
        .pr-accent-line{display:block;width:86px;height:3px;margin:0 0 18px;background:var(--pr-accent2);opacity:.82;}
        .pr-lead{color:var(--pr-title);font-weight:600;}

        .pr-pull-quote{margin:0 0 18px;padding:16px 17px;border:1px solid var(--pr-pbd);background:linear-gradient(180deg,rgba(255,255,255,.95),rgba(252,248,241,.97));border-radius:8px;box-shadow:0 6px 16px rgba(67,48,27,.04);}
        .pr-pull-quote .pr-small{font:10px/1.2 "Helvetica Neue",Arial,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:var(--pr-box);margin-bottom:8px;}
        .pr-pull-quote .pr-line{font-size:14.7px;line-height:1.42;color:var(--pr-title);font-weight:500;}
        .pr-midline{margin:18px 0 20px;font-size:14.45px;line-height:1.52;color:var(--pr-title);font-style:italic;padding-left:14px;border-left:3px solid color-mix(in srgb, var(--pr-accent2) 70%, white);}
        .pr-anchor{display:block;margin:0 0 14px;font:10px/1.2 "Helvetica Neue",Arial,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:var(--pr-box);}
        .pr-anchor-line{display:block;margin:0 0 16px;font-size:15.2px;line-height:1.42;color:var(--pr-title);font-weight:600;}
        .pr-micro-head{display:block;margin:2px 0 8px;font:10px/1.2 "Helvetica Neue",Arial,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:var(--pr-box);}

        .pr-footer{margin-top:24px;padding-top:13px;border-top:1px solid #e2d8cb;display:flex;justify-content:space-between;align-items:center;gap:18px;}
        .pr-footer-left{font-size:15.2px;line-height:1.3;font-weight:600;color:var(--pr-title);}
        .pr-footer-right{font:10px/1.2 "Helvetica Neue",Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#776b5f;}
        .pr-closing{margin-top:18px;padding:17px 19px;border:1px solid var(--pr-pbd);border-left-width:6px;border-radius:10px;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(251,246,239,.97));box-shadow:0 8px 18px rgba(67,48,27,.04);}
        .pr-closing .pr-small{font:10px/1.2 "Helvetica Neue",Arial,sans-serif;letter-spacing:.24em;text-transform:uppercase;margin-bottom:8px;color:var(--pr-box);}
        .pr-closing .pr-line{font-size:15.5px;line-height:1.42;font-weight:500;color:var(--pr-title);}

        .pr-navygold{--pr-accent:#2f4d79;--pr-accent2:#d2b07a;--pr-title:#233f65;--pr-chipbg:#f4ead9;--pr-chip:#b28447;--pr-pbd:#e7dfd6;--pr-box:#b28447;}
        .pr-goldrose{--pr-accent:#d7a34a;--pr-accent2:#d27a6f;--pr-title:#8c4f4a;--pr-chipbg:#fff3e4;--pr-chip:#bf7d27;--pr-pbd:#e7dfd6;--pr-box:#bf7d27;}
        .pr-sagegold{--pr-accent:#7f9a7d;--pr-accent2:#c9a56a;--pr-title:#4b6250;--pr-chipbg:#eef6ea;--pr-chip:#6f8b6e;--pr-pbd:#e7dfd6;--pr-box:#8c7a46;}
        .pr-bluegold{--pr-accent:#4a6e97;--pr-accent2:#d0ad77;--pr-title:#2f4d74;--pr-chipbg:#edf4fb;--pr-chip:#54759a;--pr-pbd:#e7dfd6;--pr-box:#b28447;}
        .pr-plumgold{--pr-accent:#8b6b8f;--pr-accent2:#d2b07a;--pr-title:#5b4563;--pr-chipbg:#f6eff8;--pr-chip:#896792;--pr-pbd:#e7dfd6;--pr-box:#b28447;}

        .pr-theme .pr-side-bar{background:var(--pr-accent);}
        .pr-theme .pr-top-band{background:linear-gradient(90deg,var(--pr-accent),var(--pr-accent2));}

        @media (max-width: 768px) {
          .pr-wrap{padding:16px 8px 40px;}
          .pr-page{border-width:2px;}
          .pr-page-inner{padding:20px 16px 20px 36px;margin:6px;}
          .pr-side-bar{width:20px;}
          .pr-page h2{font-size:22px;max-width:90%;}
          .pr-subtitle{font-size:13.5px;max-width:95%;}
          .pr-hero-quote{font-size:14px;max-width:95%;}
          .pr-two-col{grid-template-columns:1fr;gap:20px;}
          .pr-col p{font-size:13.5px;}
          .pr-col p:first-child{font-size:14px;}
          .pr-col p:first-child::first-letter{font-size:36px;}
          .pr-page-no{right:14px;top:14px;font-size:9px;}
          .pr-page-rule{right:14px;top:30px;width:60px;}
          .pr-motif{right:14px;bottom:12px;font-size:8px;}
          .pr-footer{flex-direction:column;align-items:flex-start;gap:8px;}
          .pr-footer-left{font-size:13.5px;}
        }
      `}</style>

      <div className="pr-wrap">

        {/* Page 1: More Than Tutoring */}
        <section className="pr-page pr-theme pr-navygold pr-open">
          <div className="pr-page-inner">
            <div className="pr-side-bar"></div>
            <div className="pr-top-band"></div>
            <div className="pr-page-no">Page 1</div>
            <div className="pr-page-rule"></div>
            <div className="pr-motif">DA</div>
            <div className="pr-label">DA TUITION</div>
            <div className="pr-eyebrow">Principal Reflection</div>
            <h2>{"More Than Tutoring.\nWhere Children Rise."}</h2>
            <div className="pr-subtitle">DA Tuition helps students move beyond what has been holding them back, rebuild confidence, and pursue strong academic growth through thoughtful guidance, high standards, and deeply personalised care.</div>
            <div className="pr-hero-quote"><strong>"A child's starting point should never be mistaken for their potential."</strong></div>
            <div className="pr-two-col" style={{ marginTop: 28, gap: 38 }}>
              <div className="pr-col">
                <span className="pr-accent-line"></span>
                <span className="pr-anchor">Core Idea</span>
                <p><span className="pr-lead">I love working at DA Tuition because the work we do is deeply meaningful.</span> It reaches far beyond academic improvement and allows us to play a careful part in helping young people move forward with greater confidence, direction, and hope.</p>
                <div className="pr-midline" style={{ margin: '20px 0 22px' }}>This is a place where students are known carefully, guided thoughtfully, and supported to grow well from where they are.</div>
                <p>What I value most about DA is the thoughtfulness behind the way we work. Every child is different, and we take that seriously. We do not approach students as though the same formula should apply to everyone. We take the time to understand where each child is, what they are aiming for, and how we can support them well from that point.</p>
              </div>
              <div className="pr-col">
                <span className="pr-micro-head">What Families Sense</span>
                <p>I am also very proud of the team around me. This is a team of people who care deeply, think carefully, and hold a great deal of respect for one another.</p>
                <p>There is a calm, genuine warmth in the culture here, and that matters. Children grow best in environments where there is steadiness, sincerity, and thoughtful care behind the work.</p>
                <p>Partnership with parents is also central to what we do. Every family comes with its own hopes, concerns, and goals for their child, and we take that responsibility seriously. We listen carefully, communicate honestly, and work closely with parents because progress is strongest when the adults around a child are working with trust and shared purpose.</p>
                <div className="pr-pull-quote" style={{ marginTop: 20 }}>
                  <div className="pr-small">What Families Value</div>
                  <div className="pr-line">A child who is genuinely known, guided carefully, and taken seriously from the beginning.</div>
                </div>
                <div className="pr-anchor-line">Thoughtful care and strong guidance can exist together.</div>
                <p style={{ marginTop: 18 }}>That is why I am so proud to be part of DA. It is a place where students are known carefully, guided thoughtfully, and supported to grow well from where they are.</p>
              </div>
            </div>
            <div className="pr-footer" style={{ marginTop: 28 }}>
              <div className="pr-footer-left">Why I love working at DA Tuition</div>
              <div className="pr-footer-right">DA Tuition</div>
            </div>
          </div>
        </section>

        {/* Page 2: Student Growth */}
        <section className="pr-page pr-theme pr-goldrose">
          <div className="pr-page-inner">
            <div className="pr-side-bar"></div>
            <div className="pr-top-band"></div>
            <div className="pr-page-no">Page 2</div>
            <div className="pr-page-rule"></div>
            <div className="pr-motif">DA</div>
            <div className="pr-label">STUDENT GROWTH</div>
            <div className="pr-eyebrow">Results And Transformation</div>
            <h2>{"What do you hope to\nhelp children achieve?"}</h2>
            <div className="pr-subtitle">Helping students move from discouragement to discipline, from uncertainty to stronger results, and from low expectations to meaningful ambition.</div>
            <div className="pr-hero-quote"><strong>"That kind of progress reaches further than a report. It changes the way a child begins to carry themselves."</strong></div>
            <div className="pr-two-col">
              <div className="pr-col">
                <span className="pr-accent-line"></span>
                <span className="pr-anchor">Core Idea</span>
                <p><span className="pr-lead">I hope to help children achieve what may once have felt beyond them.</span></p>
                <p>For some students, that means rebuilding from the ground up. For others, it means refining their skills and pursuing exceptional results with clarity, discipline, and consistency. Whatever their starting point, I want each child to know that where they begin should never be mistaken for their potential.</p>
                <div className="pr-midline">Excellent results are earned through clear guidance, high standards, honest feedback, and sustained effort.</div>
                <p>I care deeply about strong academic outcomes. I want my students to build solid foundations, think clearly, write with purpose, and develop the habits that high achievement requires. For students aiming high, I want to help them pursue those goals with maturity, precision, and seriousness.</p>
              </div>
              <div className="pr-col">
                <div className="pr-pull-quote">
                  <div className="pr-small">Transformation</div>
                  <div className="pr-line">To see a child move from thirty percent to ninety percent is deeply rewarding. Beyond the mark itself, I value the ambition, responsibility, and belief that make that result possible.</div>
                </div>
                <div className="pr-anchor-line">Strong results matter, but the deeper aim is a child who works with purpose.</div>
                <p>What makes this work especially meaningful is seeing children change in the way they approach their own future. A student who once felt far behind begins to work with purpose. A child who had stopped aiming high begins to set goals again. A young person who doubted what was possible begins to see that stronger outcomes can be earned through steady effort.</p>
                <p>To see a child move from thirty percent to ninety percent is deeply rewarding. But beyond the mark itself, I value the growth in ambition, responsibility, and belief that often makes that result possible. That kind of progress reaches further than a report. It changes the way a child begins to carry themselves.</p>
                <p>My hope is that every child leaves not only with stronger results, but with clearer goals, stronger habits, and a firmer belief in what they can achieve.</p>
              </div>
            </div>
            <div className="pr-footer">
              <div className="pr-footer-left">Helping students achieve more than they once believed possible</div>
              <div className="pr-footer-right">DA Tuition</div>
            </div>
          </div>
        </section>

        {/* Page 3: What Holds Children Back */}
        <section className="pr-page pr-theme pr-sagegold">
          <div className="pr-page-inner">
            <div className="pr-side-bar"></div>
            <div className="pr-top-band"></div>
            <div className="pr-page-no">Page 3</div>
            <div className="pr-page-rule"></div>
            <div className="pr-motif">DA</div>
            <div className="pr-label">WHAT HOLDS CHILDREN BACK</div>
            <div className="pr-eyebrow">Psychological Insight</div>
            <h2>{"What have you learned\nis often really\nholding children back?"}</h2>
            <div className="pr-subtitle">Often, the greatest obstacle is not ability alone, but the meaning a child begins to attach to difficulty, mistakes, and effort.</div>
            <div className="pr-hero-quote"><strong>"Many children do not need more pressure first. They need help seeing that growth is still possible for them."</strong></div>
            <div className="pr-two-col">
              <div className="pr-col">
                <span className="pr-accent-line"></span>
                <span className="pr-anchor">Core Idea</span>
                <p><span className="pr-lead">I have learned that what holds children back is often deeper than the work itself.</span></p>
                <p>Sometimes it is weak foundations. Sometimes it is fear of getting things wrong. Sometimes it is discouragement after a long period of struggle. Sometimes it is the quiet belief that no matter how hard they try, they will still fall short. In many cases, what appears to be an academic issue is only part of the story.</p>
                <p>A child can become trapped not only by gaps in knowledge, but by the meaning they attach to those gaps. Difficulty begins to feel like proof that they are behind. Mistakes begin to feel embarrassing. Effort begins to feel risky because it may lead to disappointment. Over time, some children stop engaging fully, not because they do not care, but because learning has become tied to discouragement rather than progress.</p>
              </div>
              <div className="pr-col">
                <div className="pr-pull-quote">
                  <div className="pr-small">Where Growth Begins</div>
                  <div className="pr-line">Real confidence is not built by avoiding challenge. It is built by learning that they can meet challenge and grow through it.</div>
                </div>
                <div className="pr-anchor-line">Many children need belief rebuilt before performance can rise.</div>
                <p>That is why many children do not need more pressure first. They need help seeing that struggle is not a verdict on their ability. They need support that rebuilds trust in the learning process and helps them experience effort differently. When a child begins to understand that difficulty can be worked through, rather than feared, something important starts to shift.</p>
                <p>I have also learned that children grow best when they are neither over-handled nor left to drift. They need warmth, but they also need clear expectations. They need encouragement, but they also need adults steady enough to guide them through discomfort without letting them give up too quickly. Real confidence is not built by avoiding challenge. It is built by learning that they can meet challenge and grow through it.</p>
                <p>Very often, before a child can achieve more, they need to believe that growth is genuinely possible for them. That change in belief is not everything, but it is often where everything begins.</p>
              </div>
            </div>
            <div className="pr-footer">
              <div className="pr-footer-left">Understanding what sits beneath struggle</div>
              <div className="pr-footer-right">DA Tuition</div>
            </div>
          </div>
        </section>

        {/* Page 4: Why DA Works */}
        <section className="pr-page pr-theme pr-bluegold">
          <div className="pr-page-inner">
            <div className="pr-side-bar"></div>
            <div className="pr-top-band"></div>
            <div className="pr-page-no">Page 4</div>
            <div className="pr-page-rule"></div>
            <div className="pr-motif">DA</div>
            <div className="pr-label">WHY DA WORKS</div>
            <div className="pr-eyebrow">The DA Approach</div>
            <h2>{"Why do families see\nsuch meaningful\nchange at DA?"}</h2>
            <div className="pr-subtitle">Because progress here is deliberate, individualised, and supported by care, structure, partnership, and high expectations.</div>
            <div className="pr-hero-quote"><strong>"We are trying to strengthen the child behind the result."</strong></div>
            <div className="pr-two-col">
              <div className="pr-col">
                <span className="pr-accent-line"></span>
                <span className="pr-anchor">Core Idea</span>
                <p><span className="pr-lead">Families often see meaningful change at DA because our support is deliberate, individualised, and consistent.</span></p>
                <p>We do not treat progress as something generic. We look closely at the whole picture and consider what kind of guidance, structure, and accountability will help each child move forward in a meaningful way. Our work is not only to teach, but to respond wisely to what each student needs most.</p>
                <p>That is why our approach is never one-size-fits-all. Some students need patient rebuilding. Others need sharper thinking, stronger discipline, and greater refinement in order to reach the highest levels. We take both kinds of students seriously. In each case, our role is to bring direction, structure, and momentum to the growth process.</p>
              </div>
              <div className="pr-col">
                <div className="pr-pull-quote">
                  <div className="pr-small">What Parents Notice</div>
                  <div className="pr-line">Students learn best when they feel supported enough to persist, challenged enough to grow, and engaged enough to take ownership of their progress.</div>
                </div>
                <div className="pr-anchor-line">Meaningful change is rarely accidental. It is carefully guided.</div>
                <p>We are also very intentional about the way children experience learning. Students learn best when they feel supported enough to persist, challenged enough to grow, and engaged enough to take ownership of their progress. We want them to develop clarity, discipline, self-respect, and a stronger sense of purpose in their effort. That is what makes progress more lasting.</p>
                <div className="pr-midline">Progress here is not only about improvement. It is about well-guided improvement.</div>
                <p>Another important part of the DA approach is partnership. We place great value on working closely with parents, because children grow best when the adults around them are aligned. This allows us to support each student with greater consistency and understanding over time.</p>
                <p>At the heart of it, families often see meaningful change at DA because we are committed not only to improvement, but to well-guided improvement. We are trying to strengthen the child behind the result. When that happens, academic progress often becomes both stronger and more lasting.</p>
              </div>
            </div>
            <div className="pr-footer">
              <div className="pr-footer-left">The care, structure, and consistency behind progress</div>
              <div className="pr-footer-right">DA Tuition</div>
            </div>
          </div>
        </section>

        {/* Page 5: The Teacher I Hope To Be */}
        <section className="pr-page pr-theme pr-plumgold pr-open">
          <div className="pr-page-inner">
            <div className="pr-side-bar"></div>
            <div className="pr-top-band"></div>
            <div className="pr-page-no">Page 5</div>
            <div className="pr-page-rule"></div>
            <div className="pr-motif">DA</div>
            <div className="pr-label">THE TEACHER I HOPE TO BE</div>
            <div className="pr-eyebrow">Lasting Imprint</div>
            <h2>{"What kind of teacher\ndo you want your\nstudents to remember\nyou as?"}</h2>
            <div className="pr-subtitle">A teacher who cared deeply, treated them with kindness, and never took their potential lightly.</div>
            <div className="pr-hero-quote"><strong>"I do not only want students to remember what they learned from me. I want them to remember how they were treated, what was strengthened in them, and who they became while they were under my care."</strong></div>
            <div className="pr-two-col" style={{ marginTop: 24, gap: 34 }}>
              <div className="pr-col">
                <span className="pr-accent-line"></span>
                <span className="pr-anchor">Core Idea</span>
                <p><span className="pr-lead">I hope my students remember me as a teacher who cared for them deeply, treated them with kindness, and never took their potential lightly.</span></p>
                <p>More than anything, I would want them to feel safe in my care.</p>
                <p>I would want them to know that they were never reduced to a mark, a weakness, or a difficult season. There is often far more in a child than is visible at first, and I would hope my students felt that I recognised that with patience, honesty, and genuine belief.</p>
                <div className="pr-midline" style={{ margin: '20px 0 22px' }}>Safe, seen, and strengthened by both warmth and clear expectations.</div>
                <p>I hope they remember me as someone who offered both warmth and steadiness. I believe children need gentleness, but they also need clear expectations. They need encouragement, but they also need someone willing to ask more of them because they are worth that effort. Not out of harshness, but out of sincere belief that their future matters and that they are capable of more than they may currently see in themselves.</p>
              </div>
              <div className="pr-col">
                <div className="pr-pull-quote">
                  <div className="pr-small">Lasting Honour</div>
                  <div className="pr-line">If, years from now, my students remember me as someone who believed in them when they could not yet do that well for themselves, someone who lifted their standards with kindness, and someone who helped expand what they believed was possible for their life, I would consider that one of the greatest honours of my life.</div>
                </div>
                <div className="pr-anchor-line">The deepest imprint of teaching is often who a child becomes while learning.</div>
                <p>I would also hope they remember me as a teacher who helped them grow not only in knowledge, but in character. Someone who helped them become more disciplined, more resilient, more thoughtful, and more assured in themselves. To me, teaching has never only been about content. It is about helping a young person develop the inner strength, judgment, and self-belief that will serve them long after they leave the classroom.</p>
                <p>Because in the end, I do not only want students to remember what they learned from me. I want them to remember how they were treated, what was strengthened in them, and who they became while they were under my care.</p>
                <div className="pr-closing" style={{ marginTop: 24, padding: '20px 22px', borderLeftWidth: 7, boxShadow: '0 12px 26px rgba(67,48,27,.06)' }}>
                  <div className="pr-small">DA Philosophy</div>
                  <div className="pr-line" style={{ fontSize: '16.2px', lineHeight: 1.46 }}>When children are supported with care, clarity, and high expectations, they begin to rise in ways that can shape their future.</div>
                </div>
              </div>
            </div>
            <div className="pr-footer" style={{ marginTop: 28 }}>
              <div className="pr-footer-left">The kind of teacher I hope to remain in their memory</div>
              <div className="pr-footer-right">DA Tuition</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div style={{ maxWidth: '210mm', margin: '32px auto 0', textAlign: 'center' as const }}>
          <p style={{ fontSize: 18, color: '#3d352f', marginBottom: 8, fontFamily: '"Garamond","EB Garamond","Baskerville","Palatino Linotype",Georgia,serif' }}>
            Interested in learning more about DA Tuition?
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <Link
              to="/interview"
              className="inline-block px-8 py-3 bg-[#2f4d79] text-white rounded-lg font-sans text-sm tracking-wide hover:bg-[#233f65] transition-colors"
            >
              Read the Full Interview
            </Link>
            <a
              href="tel:0401940207"
              className="inline-block px-8 py-3 border-2 border-[#d2b07a] text-[#3d352f] rounded-lg font-sans text-sm tracking-wide hover:bg-[#f4ead9] transition-colors"
            >
              Book an Interview — 0401 940 207
            </a>
          </div>
        </div>
      </div>

      <FooterNew />
    </>
  );
};

export default PrincipalReflections;
