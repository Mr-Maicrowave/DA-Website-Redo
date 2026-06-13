import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus, Trash2, ChevronRight, ArrowLeft } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';

// ── Design tokens (match homepage) ─────────────────────────────
const C = {
  navy:   '#0A1628',
  navy2:  '#0F1E38',
  card:   '#111f35',
  cardIn: '#0d1a2e',
  gold:   '#C9A227',
  goldL:  '#E8C040',
  white:  '#FAFAF8',
  muted:  'rgba(250,250,248,0.55)',
  dim:    'rgba(250,250,248,0.35)',
  border: 'rgba(201,162,39,0.18)',
  borderL:'rgba(201,162,39,0.10)',
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', 'Inter', sans-serif";

// ── Types ───────────────────────────────────────────────────────
interface ParentDetails  { title: string; firstName: string; lastName: string; mobile: string; email: string; }
interface StudentDetails { firstName: string; lastName: string; dobDay: string; dobMonth: string; dobYear: string; yearOfEntry: string; calendarYear: string; currentSchool: string; yearLevel: string; }
interface EnquiryDetails { contactMethod: string; hearAboutUs: string[]; message: string; }
const emptyStudent = (): StudentDetails => ({ firstName:'',lastName:'',dobDay:'',dobMonth:'',dobYear:'',yearOfEntry:'',calendarYear:'',currentSchool:'',yearLevel:'' });

// ── Step bar ────────────────────────────────────────────────────
const STEPS = [
  { n: '01', title: 'Your Details',    sub: 'Parent / Guardian' },
  { n: '02', title: 'Student Details', sub: 'Enter Information'  },
  { n: '03', title: 'Enquiry Details', sub: 'Enter Information'  },
];

const StepBar = ({ current, done }: { current: number; done: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
    {STEPS.map((s, i) => {
      const complete = done || i < current;
      const active   = !done && i === current;
      return (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            border: `2px solid ${complete || active ? C.gold : 'rgba(201,162,39,0.25)'}`,
            background: complete ? C.gold : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .3s',
          }}>
            {complete
              ? <Check size={14} color={C.navy} strokeWidth={3} />
              : <div style={{ width: 10, height: 10, borderRadius: '50%', background: active ? C.gold : 'rgba(201,162,39,0.25)' }} />
            }
          </div>
          <div style={{ marginLeft: 10, marginRight: 12 }}>
            <div style={{ fontFamily: sans, fontSize: '.78rem', fontWeight: 700, color: active || complete ? C.gold : 'rgba(201,162,39,0.4)', lineHeight: 1.3 }}>
              {s.n} {s.title}
            </div>
            <div style={{ fontFamily: sans, fontSize: '.68rem', color: C.dim }}>{s.sub}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 1, background: complete ? `linear-gradient(90deg,${C.gold},rgba(201,162,39,.2))` : 'rgba(201,162,39,0.12)', margin: '0 8px' }} />
          )}
        </div>
      );
    })}
  </div>
);

// ── Shared input styles ─────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: C.cardIn, border: `1px solid rgba(201,162,39,0.22)`,
  borderRadius: 10, padding: '12px 16px',
  fontFamily: sans, fontSize: '.875rem', color: C.white,
  outline: 'none', transition: 'border .2s',
};
const selectStyle: React.CSSProperties = { ...inputStyle, appearance: 'none', cursor: 'pointer' };
const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: sans, fontSize: '.65rem', fontWeight: 700,
  letterSpacing: '.13em', textTransform: 'uppercase', color: C.dim, marginBottom: 6,
};
const reqStar = <span style={{ color: C.gold, marginLeft: 2 }}>*</span>;

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    {label && <label style={labelStyle}>{label}{required && reqStar}</label>}
    {children}
  </div>
);

const SelectField = ({ label, required, value, onChange, options, placeholder }: {
  label: string; required?: boolean; value: string;
  onChange: (v: string) => void; options: string[]; placeholder?: string;
}) => (
  <Field label={label} required={required}>
    <div style={{ position: 'relative' }}>
      <select style={selectStyle} value={value} onChange={e => onChange(e.target.value)}>
        <option value="">{placeholder ?? '--- Select ---'}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: C.gold, pointerEvents: 'none', fontSize: '.8rem' }}>▾</span>
    </div>
  </Field>
);

const FormHeading = ({ title, sub }: { title: string; sub?: string }) => (
  <div style={{ marginBottom: 24 }}>
    <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: C.white, letterSpacing: '-.01em', marginBottom: 4 }}>{title}</h2>
    {sub && <p style={{ fontFamily: sans, fontSize: '.85rem', color: C.muted }}>{sub}</p>}
  </div>
);

// ── Step 1: Parent Details ──────────────────────────────────────
const Step1 = ({ data, onChange }: { data: ParentDetails; onChange: (d: ParentDetails) => void }) => {
  const set = (k: keyof ParentDetails) => (v: string) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <FormHeading title="Your Name" sub="Parent or guardian details" />
      <SelectField label="Title" required value={data.title} onChange={set('title')} options={['Mr','Mrs','Ms','Miss','Dr','Prof']} />
      <Field label="First Name" required>
        <input style={inputStyle} value={data.firstName} onChange={e => set('firstName')(e.target.value)} placeholder="e.g. Sarah" />
      </Field>
      <Field label="Last Name" required>
        <input style={inputStyle} value={data.lastName} onChange={e => set('lastName')(e.target.value)} placeholder="e.g. Johnson" />
      </Field>
      <div style={{ borderTop: `1px solid ${C.borderL}`, paddingTop: 24, marginTop: 8 }}>
        <FormHeading title="Contact" />
      </div>
      <Field label="Mobile Phone" required>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ ...inputStyle, width: 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 12, paddingRight: 12, color: C.muted }}>
            🇦🇺 +61
          </div>
          <input style={{ ...inputStyle, flex: 1 }} value={data.mobile} onChange={e => set('mobile')(e.target.value)} placeholder="4XX XXX XXX" />
        </div>
      </Field>
      <Field label="Email Address" required>
        <input style={inputStyle} type="email" value={data.email} onChange={e => set('email')(e.target.value)} placeholder="e.g. sarah@email.com" />
      </Field>
    </div>
  );
};

// ── Step 2: Student Details ─────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const YEAR_LEVELS = ['Kindergarten','Year 1','Year 2','Year 3','Year 4','Year 5','Year 6','Year 7','Year 8','Year 9','Year 10','Year 11','Year 12'];

const StudentCard = ({ data, index, onChange, onRemove, canRemove }: {
  data: StudentDetails; index: number;
  onChange: (d: StudentDetails) => void;
  onRemove: () => void; canRemove: boolean;
}) => {
  const set = (k: keyof StudentDetails) => (v: string) => onChange({ ...data, [k]: v });
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.borderL}`, borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: serif, fontSize: '1.1rem', color: C.gold }}>Student {index + 1}</span>
        {canRemove && (
          <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(250,250,248,0.3)', padding: 4 }}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="First Name" required>
          <input style={inputStyle} value={data.firstName} onChange={e => set('firstName')(e.target.value)} placeholder="First name" />
        </Field>
        <Field label="Last Name" required>
          <input style={inputStyle} value={data.lastName} onChange={e => set('lastName')(e.target.value)} placeholder="Last name" />
        </Field>
      </div>
      <Field label="Date of Birth" required>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <select style={selectStyle} value={data.dobDay} onChange={e => set('dobDay')(e.target.value)}>
              <option value="">DD</option>
              {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={String(d)}>{d}</option>)}
            </select>
            <span style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',color:C.gold,pointerEvents:'none',fontSize:'.8rem' }}>▾</span>
          </div>
          <div style={{ position: 'relative' }}>
            <select style={selectStyle} value={data.dobMonth} onChange={e => set('dobMonth')(e.target.value)}>
              <option value="">Month</option>
              {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
            <span style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',color:C.gold,pointerEvents:'none',fontSize:'.8rem' }}>▾</span>
          </div>
          <div style={{ position: 'relative' }}>
            <select style={selectStyle} value={data.dobYear} onChange={e => set('dobYear')(e.target.value)}>
              <option value="">YYYY</option>
              {Array.from({length:20},(_,i)=>2025-i).map(y=><option key={y} value={String(y)}>{y}</option>)}
            </select>
            <span style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',color:C.gold,pointerEvents:'none',fontSize:'.8rem' }}>▾</span>
          </div>
        </div>
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <SelectField label="Year Level" required value={data.yearLevel} onChange={set('yearLevel')} options={YEAR_LEVELS} />
        <Field label="Current School">
          <input style={inputStyle} value={data.currentSchool} onChange={e => set('currentSchool')(e.target.value)} placeholder="School name" />
        </Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Desired Year of Entry" required>
          <div style={{ position: 'relative' }}>
            <select style={selectStyle} value={data.yearOfEntry} onChange={e => set('yearOfEntry')(e.target.value)}>
              <option value="">--- Select ---</option>
              {Array.from({length:4},(_,i)=>2025+i).map(y=><option key={y} value={String(y)}>{y}</option>)}
            </select>
            <span style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',color:C.gold,pointerEvents:'none',fontSize:'.8rem' }}>▾</span>
          </div>
        </Field>
        <Field label="Calendar Year">
          <div style={{ position: 'relative' }}>
            <select style={selectStyle} value={data.calendarYear} onChange={e => set('calendarYear')(e.target.value)}>
              <option value="">--- Select ---</option>
              {Array.from({length:4},(_,i)=>2025+i).map(y=><option key={y} value={String(y)}>{y}</option>)}
            </select>
            <span style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',color:C.gold,pointerEvents:'none',fontSize:'.8rem' }}>▾</span>
          </div>
        </Field>
      </div>
    </div>
  );
};

const Step2 = ({ data, onChange }: { data: StudentDetails[]; onChange: (d: StudentDetails[]) => void }) => {
  const update = (i: number) => (d: StudentDetails) => { const next=[...data]; next[i]=d; onChange(next); };
  const remove = (i: number) => () => onChange(data.filter((_,idx)=>idx!==i));
  const add = () => onChange([...data, emptyStudent()]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <FormHeading title="Student Details" sub="Add one or more students" />
      {data.map((s,i)=>(
        <StudentCard key={i} data={s} index={i} onChange={update(i)} onRemove={remove(i)} canRemove={data.length>1} />
      ))}
      <button onClick={add} style={{
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        background:'transparent', border:`1px dashed rgba(201,162,39,0.35)`,
        borderRadius:12, padding:'14px 24px', cursor:'pointer',
        fontFamily:sans, fontSize:'.82rem', fontWeight:600, color:C.gold, letterSpacing:'.06em',
        transition:'all .2s',
      }}>
        <Plus size={16} /> Add Another Student
      </button>
    </div>
  );
};

// ── Step 3: Enquiry Details ─────────────────────────────────────
const HEAR_OPTIONS = ['Google Search','Social Media','Friend / Family Referral','School / Teacher','Flyer / Poster','Drive Past','Other'];
const CONTACT_OPTIONS = ['Phone Call','SMS / Text','Email','WhatsApp'];

const Step3 = ({ data, onChange }: { data: EnquiryDetails; onChange: (d: EnquiryDetails) => void }) => {
  const toggleHear = (opt: string) => {
    const next = data.hearAboutUs.includes(opt)
      ? data.hearAboutUs.filter(x=>x!==opt)
      : [...data.hearAboutUs, opt];
    onChange({ ...data, hearAboutUs: next });
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <FormHeading title="Enquiry Details" sub="A few final details to help us prepare" />
      <Field label="Preferred Contact Method" required>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
          {CONTACT_OPTIONS.map(opt => {
            const active = data.contactMethod === opt;
            return (
              <button key={opt} onClick={() => onChange({ ...data, contactMethod: opt })} style={{
                background: active ? `rgba(201,162,39,0.12)` : 'transparent',
                border: `1px solid ${active ? C.gold : 'rgba(201,162,39,0.2)'}`,
                borderRadius: 10, padding: '11px 16px', cursor: 'pointer',
                fontFamily: sans, fontSize: '.82rem', color: active ? C.gold : C.muted,
                fontWeight: active ? 600 : 400, transition: 'all .2s', textAlign: 'left',
              }}>
                {active && <span style={{ marginRight: 6 }}>✦</span>}{opt}
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="How did you hear about us?">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {HEAR_OPTIONS.map(opt => {
            const active = data.hearAboutUs.includes(opt);
            return (
              <button key={opt} onClick={() => toggleHear(opt)} style={{
                background: active ? `rgba(201,162,39,0.12)` : 'transparent',
                border: `1px solid ${active ? C.gold : 'rgba(201,162,39,0.2)'}`,
                borderRadius: 50, padding: '8px 16px', cursor: 'pointer',
                fontFamily: sans, fontSize: '.78rem', color: active ? C.gold : C.muted,
                fontWeight: active ? 600 : 400, transition: 'all .2s',
              }}>
                {opt}
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="Additional Notes">
        <textarea
          style={{ ...inputStyle, minHeight: 120, resize: 'vertical', lineHeight: 1.6 }}
          value={data.message}
          onChange={e => onChange({ ...data, message: e.target.value })}
          placeholder="Tell us about your child's goals, any specific subjects, or anything else we should know..."
        />
      </Field>
    </div>
  );
};

// ── Confirmation ────────────────────────────────────────────────
const Confirmation = ({ name }: { name: string }) => (
  <div style={{ textAlign: 'center', padding: '40px 0' }}>
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 28px', background: 'rgba(201,162,39,0.08)',
    }}>
      <Check size={32} color={C.gold} strokeWidth={2} />
    </div>
    <h2 style={{ fontFamily: serif, fontSize: 'clamp(2rem,4vw,2.8rem)', color: C.white, fontWeight: 500, marginBottom: 12 }}>
      Thank you, {name}
    </h2>
    <div style={{ width: 48, height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)`, margin: '0 auto 20px' }} />
    <p style={{ fontFamily: sans, fontSize: '.95rem', color: C.muted, maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.7 }}>
      Your enquiry has been received. A member of our team will be in touch within one business day to arrange your personal interview.
    </p>
    <Link to="/" style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: `linear-gradient(135deg, ${C.gold}, ${C.goldL})`,
      color: C.navy, borderRadius: 50, padding: '14px 32px',
      fontFamily: sans, fontWeight: 800, fontSize: '.82rem', letterSpacing: '.06em',
      textDecoration: 'none', textTransform: 'uppercase',
    }}>
      Return Home
    </Link>
  </div>
);

// ── Main Page ───────────────────────────────────────────────────
const BookInterview = () => {
  const [step, setStep]         = useState(0);
  const [done, setDone]         = useState(false);
  const [parent, setParent]     = useState<ParentDetails>({ title:'', firstName:'', lastName:'', mobile:'', email:'' });
  const [students, setStudents] = useState<StudentDetails[]>([emptyStudent()]);
  const [enquiry, setEnquiry]   = useState<EnquiryDetails>({ contactMethod:'', hearAboutUs:[], message:'' });

  const next = () => step < 2 ? setStep(s => s + 1) : setDone(true);
  const back = () => setStep(s => s - 1);

  return (
    <div style={{ minHeight: '100vh', background: C.navy, fontFamily: sans }}>
      <SEO
        title="Book a Principal's Interview | DA Tuition"
        description="Book a personal interview with DA Tuition's principal to discuss your child's needs and goals."
      />
      <NavigationNew />

      {/* Hero banner */}
      <div style={{
        background: `linear-gradient(180deg, #071020 0%, ${C.navy} 100%)`,
        padding: 'clamp(100px,14vw,140px) 24px clamp(48px,6vw,72px)',
        textAlign: 'center',
        borderBottom: `1px solid ${C.borderL}`,
      }}>
        <div style={{ fontFamily: sans, fontSize: '.72rem', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: C.gold, marginBottom: 16 }}>
          ✦ &nbsp; Begin Your Journey &nbsp; ✦
        </div>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.2rem,5vw,3.6rem)', fontWeight: 400, color: C.white, letterSpacing: '-.02em', lineHeight: 1.15, marginBottom: 16 }}>
          Ready to Transform<br />
          <em style={{ fontStyle: 'italic', color: C.gold }}>Your Child&apos;s Future?</em>
        </h1>
        <p style={{ fontFamily: sans, fontSize: '.9rem', color: C.muted, maxWidth: 480, margin: '0 auto' }}>
          Complete the form below and we&apos;ll be in touch within one business day.
        </p>
      </div>

      {/* Form container */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(32px,5vw,64px) 24px 80px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: C.muted, fontFamily: sans, fontSize: '.8rem', textDecoration: 'none', marginBottom: 32 }}>
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div style={{
          background: `linear-gradient(160deg, ${C.card}, #0e1b30)`,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 'clamp(28px,5vw,48px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,162,39,0.08)',
        }}>
          {done ? (
            <Confirmation name={parent.firstName || 'there'} />
          ) : (
            <>
              <StepBar current={step} done={done} />

              {step === 0 && <Step1 data={parent} onChange={setParent} />}
              {step === 1 && <Step2 data={students} onChange={setStudents} />}
              {step === 2 && <Step3 data={enquiry} onChange={setEnquiry} />}

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, paddingTop: 32, borderTop: `1px solid ${C.borderL}` }}>
                {step > 0 ? (
                  <button onClick={back} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontFamily: sans, fontSize: '.82rem' }}>
                    <ArrowLeft size={14} /> Back
                  </button>
                ) : <div />}
                <button onClick={next} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: `linear-gradient(135deg, ${C.gold}, ${C.goldL})`,
                  border: 'none', borderRadius: 50, cursor: 'pointer',
                  padding: '14px 32px',
                  fontFamily: sans, fontWeight: 800, fontSize: '.82rem',
                  letterSpacing: '.06em', textTransform: 'uppercase', color: C.navy,
                  boxShadow: `0 8px 24px rgba(201,162,39,0.4)`,
                  transition: 'all .2s',
                }}>
                  {step < 2 ? <>Continue <ChevronRight size={16} /></> : 'Submit Enquiry'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <FooterNew />
    </div>
  );
};

export default BookInterview;
