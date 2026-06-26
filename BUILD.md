# DA Tuition Website — Build Spec

> Hand this file to Claude Code. Work through tasks **in order**. Do not start a
> task until the previous one is marked done. Stop before adding any article
> content to Task F — that content isn't ready yet.

---

## CONTEXT

**Who:** DA Tuition is a premium small-group tutoring centre in Australia serving
students in Years 7–10 and senior/HSC (Years 11–12). Parents are the primary
buyers; students (especially HSC students) are the secondary audience. Both must
feel catered to on every page.

**Goal of this build:** add interactive features to the Maths subject page and
fill out four Resources sub-pages (FAQ, Guides, Our Location, Articles stub).

**Design principle (Maths page):** Optimise for *demonstrated diagnostic quality*,
not playfulness. Parents evaluate in ~30 seconds before any interaction. Every
Maths feature should communicate "we catch the careless mistakes costing your kid
marks" before the user taps anything. The "student hands parent the phone" moment
is the conversion goal.

**Style reference — match these pages exactly:**
- The **English subject page** uses interactive/tappable accordion sections and
  inline previews of real student work examples.
- The **Science subject page** has a "curiosity grid" where users tap a question
  card and it flips or expands to reveal a surprising explanation.

New interactive features must feel equally alive — no static walls of text.
Tappable cards, smooth reveals, and plain-English explanations are the tone.

**Audiences to balance:**
- *Parents:* want reassurance (results, method, safety net for their kid).
- *Students:* want to feel capable, not talked down to. A Year 8 and an HSC
  student should both find the Maths page relevant.

---

## CONVENTIONS

Before touching any file, **read the existing codebase** to establish:

1. **File paths** — locate the Maths page and each Resources sub-page by
   searching for likely filenames (`maths`, `math`, `resources`, `faq`, `guides`,
   `location`, `articles`) in `/pages`, `/app`, or `/src`. Record the exact paths
   before proceeding.
2. **Brand tokens** — read the English and Science subject pages (and any shared
   CSS/Tailwind config) to extract: primary colour, accent colour, background
   colour, heading font, body font, border-radius convention, and shadow style.
   Apply these tokens to every new element — do **not** hard-code one-off colours.
3. **Component patterns** — note how the Science curiosity section is structured
   (component file, state management approach, CSS class naming) and mirror that
   pattern for the Maths curiosity grid (Task A).
4. **Tech stack:** React / Next.js. Write new interactive sections as React
   components or inline JSX — whichever matches the existing page files. No
   vanilla JS files unless the rest of the site uses them.
5. **Mobile-first:** every new section must be fully usable on a 375 px viewport.
   Grids collapse to single-column, tap targets ≥ 44 px, font sizes readable
   without zooming.
6. **No `localStorage` or `sessionStorage`** anywhere — **except on the FAQ page**
   (Task C). The FAQ page may use `localStorage` for 👍/👎 feedback state and
   ask-form draft persistence. Every localStorage write on the FAQ page must have
   a `// TODO: wire to backend endpoint` comment. No other page in the build
   uses localStorage.
7. **No new npm packages** unless one is already in `package.json`. Use React
   state for all interactivity.
8. **Maths rendering:** use **KaTeX** for all mathematical expressions on the Maths
   page. Check whether `katex` (or `react-katex`) is already in `package.json`;
   if not, add it (`npm install katex`). Import the KaTeX CSS in the relevant
   layout or component. QA every rendered expression on a 375 px mobile screen —
   fractions, surds, indices, calculus notation must not overflow or clip. Garbled
   equations on the Maths page are the worst-case failure.
9. **Google Maps embed:** use a plain `<iframe>` with `src` pointing to
   `https://maps.google.com/maps?q=[ENCODED_ADDRESS]&output=embed`. No Maps JS
   API, no API key required.

---

## ORDERED TASKS

---

### TASK A — Maths page · Feature 1: "Where this maths actually shows up"

> **Council note:** A design review recommended against this curiosity-grid
> pattern on the grounds that it replicates the Science page too closely and
> reads as a template rather than a premium custom build. It is retained here
> because it was part of the original brief and the decision to cut it rests with
> the product owner. **If the product owner decides to cut Task A, skip it and
> proceed directly to Task A2.** Do not cut it unilaterally.

**File:** the Maths subject page (discover path per Conventions §1).

**What it does:**
Add a tappable curiosity grid directly below the subject intro/hero section.
This section mirrors the Science page curiosity section — a grid of topic cards;
tapping one reveals a short, surprising real-world fact. The goal is to make
abstract maths feel tangible for both a Year 8 student and an HSC student.

**Section heading (visible on page):**
> "Where does this maths actually show up?"

**Sub-heading (smaller, below heading):**
> "Tap a topic."

**Cards — topic + fact pairs (implement all five):**

| Card label | Revealed fact |
|---|---|
| Parabolas | "Every time a basketball leaves someone's hands, it traces a parabola. Engineers use the exact same equation to design satellite dishes and suspension bridges." |
| Trigonometry | "Your phone knows which way is up because of trig. The accelerometer converts angles into sine and cosine values thousands of times per second." |
| Probability | "Spotify's shuffle isn't truly random — it uses probability weighting so you don't hear the same artist twice in a row. Pure randomness felt too random." |
| Logarithms | "The Richter scale is logarithmic. A magnitude 7 earthquake isn't twice as strong as a 6 — it's ten times stronger. Logs compress huge ranges into human-readable numbers." |
| Calculus | "Netflix uses calculus (gradient descent) to decide what to recommend next. Every time you press play, a derivative is being solved in the background." |

**Interaction:**
- Cards are in a responsive grid: 3 columns on desktop (≥ 768 px), 2 columns on
  tablet (≥ 480 px), 1 column on mobile (< 480 px).
- Default state: card shows topic label only, with a subtle "tap to reveal" cue
  (e.g. a small chevron or a faint italic hint).
- Tapped/active state: card expands or flips to show the fact text. Only one card
  open at a time — tapping a second card closes the first.
- Transition: smooth CSS transition (200–300 ms), no jarring jumps.
- Keyboard accessible: cards are focusable and togglable with Enter/Space.

**Done when:**
- [ ] Section is visible on the Maths page between the intro and the next existing
  section.
- [ ] All five cards render and reveal their facts on click/tap.
- [ ] Only one card is open at a time.
- [ ] Grid collapses correctly at 375 px, 480 px, 768 px.
- [ ] Brand colours, font, and border-radius match the rest of the page.
- [ ] No console errors.

---

---

### TASK A2 — Maths page · Hero Feature: "Spot the Mistake" (Exam Error Detective)

> **Council verdict:** This is the unanimous first-priority feature for the Maths
> page. Build it before Task B. Its quality is entirely content-bound, not
> code-bound — every example below has been hand-authored to use a genuinely
> plausible error. Do not change the mistakes or explanations without subject-matter
> review. The gating risk is mobile maths rendering: QA every KaTeX expression
> on a 375 px screen before marking this task done.

**File:** the Maths subject page (same file as Tasks A and B).

**Placement:** insert this section prominently on the page — above the
step-by-step walkthrough (Task B) and, if Task A is included, above the curiosity
grid. This is the hero interactive section.

---

**What it does:**
Show a student-style worked solution that contains one deliberate, plausible
mistake. The user's job is to find it. On reveal, the wrong line is highlighted
and a plain-English explanation appears. Content is split across three level tabs.
This signals DA's core teaching value — catching the careless errors that cost
marks — before the user taps anything.

---

**Section heading (visible on page, above tabs):**
> "Can you spot what cost this student marks?"

**Sub-heading:**
> "Every example below is a real mistake type. Tap 'Reveal mistake' when you've
> found it."

---

**Tabs:** `Year 7–8` | `Year 9–10` | `HSC`

Default tab on load: `Year 9–10` (broadest audience). Tab choice persists in
React state only (no localStorage).

Each tab contains multiple examples. Display one example at a time with
"Previous" / "Next" navigation (e.g. "Example 1 of 3"). Switching tabs resets to
example 1 of that tab.

---

**Interaction per example:**
1. Problem statement shown at top.
2. Worked solution displayed as numbered steps — each step on its own line.
3. A `Reveal mistake` button below the steps.
4. On click: the incorrect step highlights (e.g. red/amber left border + subtle
   background tint), all other steps remain visible but de-emphasised. An
   explanation block appears below, in the same visually-distinct style as the
   "thinking notes" in Task B (italic, accent-coloured left border).
5. Button changes to `Next example →` after reveal. On the last example, it
   changes to `Start over`.
6. Keyboard accessible: button is a `<button>`; highlighted line has `aria-live`
   announcement on reveal.

---

**YEAR 7–8 EXAMPLES (3 examples)**

---

**Example 1 — Order of operations**

*Problem:* Simplify $3 + 4 \times 2$.

*Worked solution:*

| Step | Working |
|---|---|
| Step 1 | $3 + 4 = 7$ |
| Step 2 ← **MISTAKE** | $7 \times 2 = 14$ |
| **Answer:** | $14$ |

*Mistake is at:* Step 1.

*Explanation:* Multiplication must come before addition (BODMAS/BIDMAS). The
correct order is $4 \times 2 = 8$ first, then $3 + 8 = \mathbf{11}$. Doing the
addition first is the most common order-of-operations error in Year 7.

---

**Example 2 — Substitution with negative numbers**

*Problem:* If $x = -2$, find the value of $x^2$.

*Worked solution:*

| Step | Working |
|---|---|
| Step 1 ← **MISTAKE** | $x^2 = -2^2 = -4$ |
| **Answer:** | $-4$ |

*Mistake is at:* Step 1.

*Explanation:* $-2^2$ without brackets means $-(2^2) = -4$ by convention, but
the question asks for $x^2$ where $x = -2$, which means $(-2)^2 = (-2) \times
(-2) = \mathbf{4}$. Always substitute with brackets around negative values:
$(-2)^2$. This mistake costs marks across every topic that uses substitution.

---

**Example 3 — Solving a one-step equation**

*Problem:* Solve $\dfrac{x}{3} = 7$.

*Worked solution:*

| Step | Working |
|---|---|
| Step 1 ← **MISTAKE** | $x = 7 - 3 = 4$ |
| **Answer:** | $x = 4$ |

*Mistake is at:* Step 1.

*Explanation:* To undo dividing by 3, you must **multiply** both sides by 3 — not
subtract. The correct working: $x = 7 \times 3 = \mathbf{21}$. The student
confused the inverse operation. Dividing → multiply to undo; subtracting → add
to undo.

---

**YEAR 9–10 EXAMPLES (3 examples)**

---

**Example 1 — Expanding a binomial product**

*Problem:* Expand $(x + 3)(x - 2)$.

*Worked solution:*

| Step | Working |
|---|---|
| Step 1 | $x \cdot x = x^2$ |
| Step 2 | $x \cdot (-2) = -2x$ |
| Step 3 | $3 \cdot x = 3x$ |
| Step 4 ← **MISTAKE** | $3 \cdot (-2) = \mathbf{+6}$ |
| **Answer:** | $x^2 + x + 6$ |

*Mistake is at:* Step 4.

*Explanation:* A positive times a negative is negative: $3 \times (-2) = -6$, not
$+6$. The correct expansion is $x^2 + x - 6$. Sign errors in the last term of a
FOIL expansion are the single most common algebra mistake at this level — always
check the sign of the constant term last.

---

**Example 2 — Index laws**

*Problem:* Simplify $x^3 \times x^4$.

*Worked solution:*

| Step | Working |
|---|---|
| Step 1 ← **MISTAKE** | $x^3 \times x^4 = x^{3 \times 4} = x^{12}$ |
| **Answer:** | $x^{12}$ |

*Mistake is at:* Step 1.

*Explanation:* When **multiplying** terms with the same base, you **add** the
indices: $x^3 \times x^4 = x^{3+4} = \mathbf{x^7}$. Multiplying the indices
($3 \times 4$) is the rule for a **power of a power** — $(x^3)^4 = x^{12}$.
These two index laws are commonly confused.

---

**Example 3 — Solving a linear equation**

*Problem:* Solve $2x + 5 = 13$.

*Worked solution:*

| Step | Working |
|---|---|
| Step 1 ← **MISTAKE** | $2x = 13 + 5 = 18$ |
| Step 2 | $x = 18 \div 2 = 9$ |
| **Answer:** | $x = 9$ |

*Mistake is at:* Step 1.

*Explanation:* To isolate $2x$, subtract 5 from both sides: $2x = 13 - 5 = 8$.
The student added instead of subtracted. Correct answer: $x = 8 \div 2 =
\mathbf{4}$. A quick check: $2(4) + 5 = 13$ ✓. Always substitute back to verify.

---

**HSC EXAMPLES (4 examples)**

---

**Example 1 — Chain rule (differentiation)**

*Problem:* Differentiate $y = (2x + 1)^3$.

*Worked solution:*

| Step | Working |
|---|---|
| Step 1 ← **MISTAKE** | $\dfrac{dy}{dx} = 3(2x+1)^2$ |
| **Answer:** | $3(2x+1)^2$ |

*Mistake is at:* Step 1.

*Explanation:* The chain rule requires multiplying by the derivative of the inner
function. The inner function is $2x + 1$, whose derivative is $2$. Correct answer:
$\dfrac{dy}{dx} = 3(2x+1)^2 \times 2 = \mathbf{6(2x+1)^2}$. Forgetting the
chain rule multiplier is the most common differentiation error in the HSC.

---

**Example 2 — Indefinite integration (missing constant)**

*Problem:* Find $\displaystyle\int (3x^2 + 2x)\,dx$.

*Worked solution:*

| Step | Working |
|---|---|
| Step 1 | $= \dfrac{3x^3}{3} + \dfrac{2x^2}{2}$ |
| Step 2 ← **MISTAKE** | $= x^3 + x^2$ |
| **Answer:** | $x^3 + x^2$ |

*Mistake is at:* Step 2.

*Explanation:* Every indefinite integral requires a constant of integration
$+\,C$. The correct answer is $\mathbf{x^3 + x^2 + C}$. In the HSC, omitting
$+C$ from an indefinite integral costs the mark outright — markers are
specifically instructed to penalise this every time.

---

**Example 3 — Trig equations (missing second solution)**

*Problem:* Solve $\sin x = \dfrac{1}{2}$ for $0 \leq x \leq 2\pi$.

*Worked solution:*

| Step | Working |
|---|---|
| Step 1 ← **MISTAKE** | $x = \dfrac{\pi}{6}$ |
| **Answer:** | $x = \dfrac{\pi}{6}$ |

*Mistake is at:* Step 1.

*Explanation:* Sine is positive in both the first and second quadrants. The full
solution is $x = \dfrac{\pi}{6}$ **and** $x = \pi - \dfrac{\pi}{6} =
\dfrac{5\pi}{6}$. Only giving one solution when the domain allows two is a
systematic HSC error — always check all four quadrants against the given domain
before writing the final answer.

---

**Example 4 — Logarithm arithmetic**

*Problem:* Solve $\log_2 x + \log_2 4 = \log_2 12$.

*Worked solution:*

| Step | Working |
|---|---|
| Step 1 | $\log_2(4x) = \log_2 12$ |
| Step 2 | $4x = 12$ |
| Step 3 ← **MISTAKE** | $x = 4$ |
| **Answer:** | $x = 4$ |

*Mistake is at:* Step 3.

*Explanation:* $4x = 12$ gives $x = 12 \div 4 = \mathbf{3}$, not $4$. The log
manipulation in Steps 1–2 is correct; the error is a simple division slip at the
final arithmetic step. This illustrates why checking $4 \times 3 = 12$ (not
$4 \times 4$) before writing the answer is worth two seconds of every HSC
student's time.

---

**Visual / UX requirements:**

- **Glance communication:** before any interaction, the section heading and the
  visible first example must communicate "this is about catching exam errors" —
  not just "here is some maths."
- **Step table:** render as a styled table or a numbered list — each step on its
  own line, with enough line-height to be comfortable on mobile.
- **Highlighted mistake line:** when revealed, use a left-border accent (e.g.
  red/amber, 3–4 px) + very subtle background tint on the incorrect row. Do not
  hide the other rows — context matters.
- **Explanation block:** same visual treatment as "thinking notes" in Task B
  (italic text, accent-colour left border, slightly lighter background).
- **All maths rendered via KaTeX** (see Conventions §8). No plain-text
  approximations for mathematical expressions.
- **Tab pills:** match the visual style of any existing tab/toggle components on
  the site.
- **Mobile:** step tables must not cause horizontal scroll at 375 px. Use
  `overflow-x: auto` on the table wrapper if needed, but prefer layout that
  avoids it.

---

**Done when:**
- [ ] Section is visible on the Maths page, above the step-by-step walkthrough
  (Task B).
- [ ] All three tabs render their examples correctly.
- [ ] Switching tabs resets to example 1 of the new tab.
- [ ] "Reveal mistake" highlights only the correct incorrect step and shows the
  explanation.
- [ ] Example navigation (Previous / Next) works within each tab.
- [ ] All mathematical expressions render via KaTeX — no raw LaTeX strings visible
  in the browser.
- [ ] No KaTeX expression clips or overflows at 375 px.
- [ ] Tab labels, heading, and sub-heading visible before any tap.
- [ ] Keyboard accessible: tabs and buttons operable via keyboard.
- [ ] No console errors.

---

### TASK B — Maths page · Feature 2: "Watch a scary problem become easy"

**File:** same Maths subject page as Task A.

**What it does:**
Add a step-by-step problem walkthrough section below the curiosity grid (Task A).
One intimidating problem is shown. Users tap "Next step" (or tap the step itself)
to reveal the solution one step at a time. A plain-English "thinking note" appears
beside each step so the problem feels calm and approachable. There is a toggle
to switch between a Year 8 version and an HSC version.

**Section heading (visible on page):**
> "Watch a scary problem become easy."

**Toggle labels:** "Year 8" / "HSC" — displayed as a two-option pill toggle above
the problem. Default to "HSC" on load.

---

**HSC VERSION — Quadratic + discriminant problem:**

*Problem statement (shown upfront):*
> "Find the values of *k* for which the equation 3x² − kx + 3 = 0 has no real
> solutions."

*Steps (each hidden until the previous is revealed):*

| Step # | Step content | Thinking note |
|---|---|---|
| 1 | Recall that a quadratic ax² + bx + c = 0 has **no real solutions** when the discriminant Δ < 0, where Δ = b² − 4ac. | "No real solutions" is the key phrase. That's the discriminant test. Lock it in before touching the numbers. |
| 2 | Identify the coefficients: a = 3, b = −k, c = 3. | Don't rush. Write out a, b, c explicitly. Dropping a negative sign here is the most common mistake in the HSC. |
| 3 | Substitute into Δ = b² − 4ac: Δ = (−k)² − 4(3)(3) = k² − 36. | (−k)² = k² — the negative disappears when you square. |
| 4 | Set Δ < 0: k² − 36 < 0, so k² < 36. | We want *no* real solutions, so the discriminant must be *negative*. Flip the condition. |
| 5 | Solve: −6 < k < 6. | Square-root both sides of k² < 36. Remember: square root of an inequality gives *both* a positive and negative bound. Final answer: −6 < k < 6. |

---

**YEAR 8 VERSION — Perimeter/algebra problem:**

*Problem statement (shown upfront):*
> "A rectangle has a length that is 4 cm more than twice its width. Its perimeter
> is 50 cm. Find the dimensions."

*Steps:*

| Step # | Step content | Thinking note |
|---|---|---|
| 1 | Let the width = w. Then the length = 2w + 4. | Pick one unknown and build the other from the words. "4 more than twice the width" → 2w + 4. |
| 2 | Perimeter of a rectangle = 2(length + width). So: 2(2w + 4 + w) = 50. | Write the perimeter formula first, then substitute — don't skip straight to numbers. |
| 3 | Simplify inside the bracket: 2(3w + 4) = 50. | Collect the w terms: 2w + w = 3w. |
| 4 | Expand: 6w + 8 = 50. Then 6w = 42, so w = 7. | Divide both sides by 6 cleanly. |
| 5 | Width = 7 cm, length = 2(7) + 4 = 18 cm. **Check:** 2(18 + 7) = 2(25) = 50 ✓ | Always substitute back. If it doesn't check out, something went wrong earlier. |

---

**Interaction:**
- Toggle switches the entire problem (statement + steps) — steps reset to zero
  when the version changes.
- Steps are hidden behind a "Show next step" button below the current revealed
  content. Once all steps are shown, the button changes to "Start again" (resets
  to step 0, problem statement visible again).
- Thinking notes are displayed in a visually distinct style (e.g. italicised, a
  lighter background, or a subtle left border in the accent colour) so they read
  as commentary, not part of the working.
- Smooth slide-down or fade-in transition per step reveal (150–200 ms).
- Keyboard accessible: the button is a proper `<button>` element.

**Done when:**
- [ ] Section appears below Task A on the Maths page.
- [ ] HSC version loads by default; toggle switches to Year 8 and back.
- [ ] Steps reveal one at a time; thinking notes are visually distinct.
- [ ] Switching version resets step count.
- [ ] "Start again" resets to step 0.
- [ ] Mobile: problem statement and steps are readable at 375 px without horizontal
  scroll.
- [ ] No console errors.

---

### TASK C — Resources · FAQ page

> **Council verdict:** Phase 1 (contradiction fixes) must be completed before any
> feature work begins — shipping contradictory copy is worse than shipping nothing.
> Core features are: fix pass + WhatsApp CTA + ask-a-question form. Everything
> else (search highlight polish, per-category colours, thumbs-up UI beyond
> localStorage) is deferred and must not block this task.
>
> **localStorage exception:** this task is the only place in the codebase where
> `localStorage` is permitted. Use it for 👍/👎 feedback state and ask-form
> drafts. Add a `// TODO: wire to backend endpoint` comment wherever localStorage
> is written. All other pages retain the no-localStorage rule.

**Files touched:**
- The FAQ page component (discover path per Conventions §1, likely `FAQ.tsx` or
  similar).
- `Contact.tsx` (or equivalent contact page file) — touched only for Phase 1 fixes.

---

#### PHASE 1 — Fix contradictions (do these before any feature work)

Read the existing FAQ and Contact page files in full before writing a single line.
Identify every instance of the following and correct them:

**1. Terminology — replace all instances of "free assessment" and "Book
Consultation" with "Book an Interview"** across `FAQ.tsx`, `Contact.tsx`, and any
other component or page file. The intended meaning: if you have questions, book an
appointment to come into the centre and talk. This is the only approved CTA
wording. Do not use "free assessment", "free consultation", or "Book Consultation"
anywhere on the site.

**2. Guarantee policy — no refund; additional support at no cost.** Locate the
existing guarantee answer in `FAQ.tsx` (currently around line 145) and the
corresponding copy in `Contact.tsx` (currently around line 164). Both must say the
same thing: if a student does not make progress, DA Tuition provides additional
support at no cost. Remove all mention of refunds from both files.

**3. Online sessions — in-person only; out-of-class help can be arranged online.**
Both `FAQ.tsx` (currently around line 102) and `Contact.tsx` (currently around
line 159) must use a consistent formulation:

> "Our classes are in-person only. For students who need additional help between
> sessions, we can arrange online support."

Remove any copy that implies online classes are a co-equal alternative to
in-person sessions.

**4. Wire the dead button.** `Contact.tsx` (currently around line 173) has a
"View All FAQs" button with no `href`. Set it to `href="/faq"` (or the correct
route for the FAQ page as discovered in Conventions §1).

**5. Fix search input accessibility.** The FAQ page's existing search input
(currently around line 211) has no `aria-label`. Add:
```tsx
aria-label="Search frequently asked questions"
```
This fix is required regardless of whether any other search UI work is done.

---

#### PHASE 2 — Features

Complete Phase 1 in full before starting Phase 2.

---

**Feature C1 — WhatsApp primary CTA + mailto fallback**

Add a contact CTA block to the FAQ page (position: below the heading/sub-heading,
above the first FAQ category). This is the primary conversion action on the page.

Primary button (large, prominent, in brand accent colour):
```
💬 Text us on WhatsApp
```
Links to: `https://wa.me/61401940207`

Secondary / fallback link (smaller, below the primary button):
```
Prefer email? Contact us →
```
Links to the site's existing contact page/form (discover path).

**Rationale (do not remove this comment from the code):**
```tsx
{/* WhatsApp is the primary CTA: Australian parents have higher response rates
    via WhatsApp than email. mailto: is kept as fallback for users without a
    configured mail client. */}
```

---

**Feature C2 — Ask-a-question form with localStorage draft persistence**

Add a collapsible "Still have a question?" section at the bottom of the FAQ page,
above the footer.

Form fields:
- Name (text input, required)
- Email (email input, required)
- Question (textarea, required, max 500 characters with live character count)
- Submit button: "Send question"

Submission: `mailto:` link using the site's contact email (discover from existing
Contact page or CLAUDE.md). On submit, open the user's mail client pre-populated
with name, email, and question in the body. Add a visible note beneath the form:

```
📱 Or text us directly on WhatsApp — we usually reply within a few hours.
```

**localStorage (exception to site-wide rule — FAQ only):**
- Save form draft to `localStorage` under key `da_faq_draft` on every keystroke.
- Pre-populate the form from `localStorage` on mount.
- Clear `localStorage` on successful submit.
- Add comment:
  ```tsx
  // TODO: wire to backend endpoint (currently sends via mailto fallback)
  // localStorage key: 'da_faq_draft'
  ```

---

**Feature C3 — URL-driven category filter and search**

The FAQ page should support shareable, deep-linkable URLs:

```
/faq                          → default (all categories, no search)
/faq?category=pricing         → pre-selects the Pricing category tab
/faq?q=online                 → pre-populates search with "online"
/faq?category=hsc&q=trial     → both
```

On mount, read `searchParams` (Next.js `useSearchParams`) and apply the
corresponding category filter and/or search term. When the user changes category
or search, update the URL via `router.replace` (not `router.push`) so the back
button works correctly.

Category slugs to support (derive from the existing FAQ categories in the file;
add `pricing`, `classes`, `results`, `enrolment` as minimum set).

---

**Feature C4 — Group results by category when "All" is selected**

When no category filter is active (i.e. "All" tab selected), render the FAQ items
grouped under their category headings rather than as a flat list. Category
headings should be visually distinct (larger text, brand colour, or a rule) but
not themselves expandable.

When a specific category is selected, render only that category's items with no
grouping header needed.

This is the primary fix for the "26 flat items is a wall" problem.

---

**Feature C5 — Keyboard shortcut: press `/` to focus search**

When the user presses the `/` key (and focus is not already on an input), move
focus to the search input. Add a small keyboard hint beside the search input:

```
Press / to search
```

Hide this hint on touch devices (`@media (hover: none)`).

---

**Feature C6 — BreadcrumbList JSON-LD**

The FAQ page already has a FAQPage JSON-LD schema block. Alongside it (not
replacing it), add a BreadcrumbList structured data block:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://[SITE_DOMAIN]/" },
    { "@type": "ListItem", "position": 2, "name": "Resources", "item": "https://[SITE_DOMAIN]/resources" },
    { "@type": "ListItem", "position": 3, "name": "FAQ", "item": "https://[SITE_DOMAIN]/faq" }
  ]
}
```

Discover the site domain from existing JSON-LD, `next.config.js`, or environment
config. Replace `[SITE_DOMAIN]` with the real value; do not leave it as a literal
placeholder.

---

**Feature C7 — 👍/👎 per-question feedback with localStorage**

> **Scope note:** implement the data layer only — localStorage read/write and a
> minimal visible thumbs-up/down toggle. Full UI polish (animations, aggregate
> counts, per-category colours) is explicitly deferred and must not be built here.

For each FAQ accordion item, add a small "Was this helpful? 👍 👎" row below the
answer text (visible only when the item is open).

On click, write to localStorage:

```ts
// localStorage key structure: 'da_faq_feedback'
// Value: Record<questionId, 'up' | 'down'>
// TODO: wire to backend endpoint to aggregate feedback
```

On mount, read from localStorage and restore the toggle state so feedback
persists across page reloads.

Each question needs a stable `id` (e.g. a slug derived from the question text, or
an existing `id` field in the FAQ data). Discover whether one already exists in
the FAQ data structure before adding new ones.

---

#### CONTENT — Additional Q&As to add

The following Q&As are supplementary to whatever the existing FAQ already
contains. Before adding them, check whether a similar question already exists; if
it does, update the existing answer rather than duplicating it. Write answers in a
warm, confident tone — reassuring for parents, credible for students, 2–4
sentences each.

*Group: About DA Tuition*

- **Q: What makes DA Tuition different from a big tutoring chain?**
  A: We cap every class at a small number of students so your child is never lost
  in a crowd. Our tutors are subject specialists, not generalists, and every
  session is planned around the specific syllabus your child is studying — not a
  generic worksheet. Parents tell us the difference shows in the first few weeks.

- **Q: What subjects and year groups do you cover?**
  A: We run classes for students from Year 7 through to the HSC (Year 12) across
  English, Mathematics, and Sciences. If you're unsure whether we cover your
  child's exact course or level, get in touch and we'll confirm within 24 hours.

- **Q: Are your tutors qualified teachers?**
  A: Our tutors hold university degrees in their subject areas and many are current
  or former classroom teachers. All tutors are vetted, hold Working With Children
  Checks, and are trained in our teaching method before taking a class.

*Group: Classes & scheduling*

- **Q: How big are the classes?**
  A: Our small-group sessions are intentionally small — typically 3 to 6 students.
  This gives your child access to personalised attention while still benefiting
  from the collaborative energy of a group.

- **Q: How often do students attend?**
  A: Most students attend once a week. During the HSC period, some students opt
  for two sessions per week — we can advise on what suits your child's workload.

- **Q: Can we trial a class before committing?**
  A: Yes. We offer a trial session so your child can experience the environment
  before you commit to a term. Book an Interview and we'll arrange it.

- **Q: What happens if my child misses a class?**
  A: Students who miss a class receive notes and any materials covered, and can ask
  questions at the start of the next session. We'll do our best to support
  continuity — just let us know in advance where possible.

*Group: Results & HSC*

- **Q: What kind of results do your students achieve?**
  A: Many of our HSC students achieve Band 5 and Band 6 results, and a number go
  on to their first-preference university courses. We also measure success by the
  confidence students gain — that matters well beyond the ATAR.

- **Q: Do you offer HSC-specific preparation?**
  A: Absolutely. Our senior classes are built around the HSC syllabus, past paper
  practice, marking criteria, and exam technique. We time the curriculum so
  students are exam-ready before the Trial HSC, not scrambling the week before.

- **Q: My child is really behind — is DA Tuition still right for them?**
  A: Yes. We regularly work with students who feel behind and need to rebuild
  confidence alongside content knowledge. Our tutors identify gaps early and fill
  them systematically. Starting sooner is always better than waiting.

*Group: Enrolment & fees*

- **Q: How do I enrol?**
  A: Book an Interview to come in and talk with us. We'll confirm availability,
  match your child to the right class, and set up a trial session.

- **Q: What are your fees?**
  A: Fees depend on the year group and subject. Contact us for a current fee
  schedule — we're transparent about pricing and there are no hidden costs.

- **Q: Do you offer any discounts for siblings?**
  A: We offer a sibling discount for families enrolling more than one child.
  Ask us about this when you get in touch.

---

**Accordion interaction (applies to all items):**
- Click/tap to expand; tapping an open item collapses it. Only one item open at
  a time per category group.
- Smooth expand/collapse (150–200 ms).
- Each question is a `<button>` element — keyboard accessible, operable with
  Enter/Space.

---

**Deferred — do NOT build in this task:**
- Search highlight animation (`<mark>` styling beyond basic) — deferred.
- Per-category accent colours — deferred.
- Thumbs-up/down aggregate display or analytics reporting — deferred.
- Any backend endpoint for ask-form or feedback — deferred (leave TODO comments).

---

**Done when:**
- [ ] **Phase 1 complete:** "Book an Interview" is the only CTA wording on both
  FAQ and Contact pages. No "free assessment", "Book Consultation" anywhere.
- [ ] **Phase 1 complete:** FAQ and Contact pages both say "additional support at
  no cost" — no refund language anywhere.
- [ ] **Phase 1 complete:** Both pages say classes are in-person; online support
  available between sessions.
- [ ] **Phase 1 complete:** Contact "View All FAQs" button links to `/faq`.
- [ ] **Phase 1 complete:** Search input has `aria-label`.
- [ ] Feature C1: WhatsApp button visible above first FAQ item; links to
  `https://wa.me/61401940207`; email fallback link present.
- [ ] Feature C2: Ask-a-question form present at bottom; draft saved to
  `localStorage`; `// TODO: endpoint` comment in code; mailto submit works.
- [ ] Feature C3: `/faq?category=X&q=Y` URL params applied on mount; URL updates
  on filter/search change without adding to browser history.
- [ ] Feature C4: "All" view shows items grouped by category with visible headers;
  category-filtered view shows flat list.
- [ ] Feature C5: Pressing `/` focuses the search input; keyboard hint visible
  on non-touch devices.
- [ ] Feature C6: BreadcrumbList JSON-LD present in page `<head>` alongside
  existing FAQPage schema.
- [ ] Feature C7: 👍/👎 toggles present below each open answer; state persists in
  localStorage across reload; `// TODO: endpoint` comment present.
- [ ] All additional Q&As from the content section above are present (merged with
  existing items, no duplicates).
- [ ] Accordion opens/closes; only one item open per group at a time.
- [ ] Renders cleanly at 375 px — no overflow, tap targets ≥ 44 px.
- [ ] No console errors.

---

### TASK D — Resources · Guides page

**File:** the existing Guides page under Resources (discover path per Conventions §1).

**What it does:**
Fill the Guides page with a set of guide cards. Each card has a title, a 1–2
sentence description, and a "Read guide" CTA. For this build, the guides are not
full articles — each "Read guide" button links to `#` (placeholder) so the page
is functional but content is deferred. Add a clearly visible note at the top of
the page: `[GUIDE CONTENT COMING SOON — link targets are placeholders]` as a
visible HTML comment **and** a visually rendered banner visible only in development
(wrap it in a `{process.env.NODE_ENV === 'development' && ...}` condition).

**Page heading:** "Study Guides & Resources"
**Sub-heading:** "Practical tools to help students and parents get more out of
every study session."

**Guide cards — include all of these:**

1. **How to Study for the HSC (Without Burning Out)**
   Covers time management, subject prioritisation, and how to structure a study
   week so the final months are manageable, not miserable.

2. **A Parent's Guide to Supporting Your Child Through the HSC**
   What helps, what doesn't, and how to have the conversations that actually
   reduce exam stress rather than adding to it.

3. **How to Write a Band 6 English Essay**
   The structure, evidence selection, and language choices that separate a Band 5
   essay from a Band 6 one — with annotated examples.

4. **Year 7–10 Maths: Filling the Gaps Before They Become Problems**
   The topics that trip up senior students are almost always gaps from junior
   years. This guide helps families identify and address them early.

5. **Understanding the HSC Marking Criteria**
   How markers actually assess responses — and how students can write to the
   criteria rather than just writing a lot.

6. **Making the Most of Small-Group Tutoring**
   How to prepare for sessions, what to bring, how to follow up, and why the
   students who improve fastest treat tutoring as active, not passive.

**Card layout:**
- Responsive grid: 3 columns desktop, 2 columns tablet, 1 column mobile.
- Each card: title (heading), description (2 sentences), "Read guide →" link/button.
- Cards match the visual style of other card grids on the site (border-radius,
  shadow, colour — inherit from brand tokens).

**Done when:**
- [ ] All 6 guide cards present with correct titles and descriptions.
- [ ] "Read guide" buttons link to `#` (no 404s).
- [ ] Development-only banner visible when `NODE_ENV=development`.
- [ ] HTML comment `[GUIDE CONTENT COMING SOON]` present in source.
- [ ] Grid collapses correctly at 375 px, 480 px, 768 px.
- [ ] No console errors.

---

### TASK E — Resources · Our Location page

**File:** the existing Our Location page under Resources (discover path per Conventions §1).

**What it does:**
Build out the Our Location page with contact details, a Google Maps embed, and
business hours. All specific details (address, phone, email) are left as clearly
labelled placeholders.

**Page heading:** "Find Us"
**Sub-heading:** "We're conveniently located and easy to reach by car or public
transport."

**Layout (top to bottom on page):**

1. **Map embed** — full-width (or near-full-width) Google Maps iframe:
   ```html
   <iframe
     src="https://maps.google.com/maps?q=[INSERT_ENCODED_ADDRESS]&output=embed"
     width="100%"
     height="400"
     style="border:0;"
     allowfullscreen=""
     loading="lazy"
     referrerpolicy="no-referrer-when-downgrade"
     title="DA Tuition location map"
   />
   ```
   Leave `[INSERT_ENCODED_ADDRESS]` as a literal placeholder comment in the code
   and replace the `src` value with `about:blank` so the iframe doesn't error.
   Add a visible HTML comment: `<!-- TODO: replace src with encoded address -->`.

2. **Contact details block** — display the following as labelled fields:
   - **Address:** `[INSERT STREET ADDRESS, SUBURB, STATE, POSTCODE]`
   - **Phone:** `[INSERT PHONE NUMBER]`
   - **Email:** `[INSERT EMAIL ADDRESS]`
   - **Website:** link to the site root `/`

3. **Business hours table:**

   | Day | Hours |
   |---|---|
   | Monday – Friday | `[INSERT WEEKDAY HOURS]` |
   | Saturday | `[INSERT SATURDAY HOURS]` |
   | Sunday | Closed |

4. **"Get in touch" CTA button** — links to the site's existing contact form or
   contact page. Discover the correct path from the site nav. If no contact page
   exists, link to `#contact` with an HTML comment `<!-- TODO: confirm contact URL -->`.

**Accessibility:**
- The iframe must have `title="DA Tuition location map"`.
- Contact detail labels must be visually and semantically clear (use `<dl>`/`<dt>`/
  `<dd>` or equivalent).

**Done when:**
- [ ] Page renders with map section, contact details, hours table, and CTA button.
- [ ] iframe `src` is `about:blank` and carries the TODO comment.
- [ ] All placeholder strings (`[INSERT …]`) are present verbatim and easy to find
  with a text search.
- [ ] Hours table renders correctly on mobile (no horizontal overflow).
- [ ] CTA button links somewhere valid (not a 404).
- [ ] No console errors.

---

### TASK F — Resources · Articles page (SCAFFOLD/STUB ONLY)

> **⚠️ STOP HERE IF EARLIER TASKS ARE NOT COMPLETE.**
> Do not invent article content. Source files are missing. This task is a
> structural scaffold only.

**File:** the existing Articles page under Resources (discover path per Conventions §1).

**What it does:**
Set up the page layout and navigation structure for the Articles section so it is
ready to receive content once source files are provided. Do not write any article
titles, summaries, or body content.

**Page heading:** "Articles"
**Sub-heading:** "In-depth reads for students and parents — coming soon."

**Visible banner at the top of the page (always shown, not dev-only):**
```
┌─────────────────────────────────────────────────────────────┐
│  🚧  Articles coming soon. Content will be added shortly.  │
└─────────────────────────────────────────────────────────────┘
```
Style this as a clearly visible banner (e.g. amber/yellow background, dark text,
full-width). It is intentional and should remain in production until removed.

**Page structure to scaffold (no content):**
- A filter/tag bar area — placeholder `<div>` with a comment:
  `{/* TODO: add category filter tags once articles are defined */}`
- An article grid area — placeholder `<div>` with a comment:
  `{/* TODO: map over articles array and render ArticleCard components */}`
- A pagination placeholder `<div>` with a comment:
  `{/* TODO: add pagination once article count is known */}`

**Navigation:**
- Confirm that the Articles page is linked from the Resources section nav (sidebar
  or tab bar, whichever pattern the site uses). If the link is missing, add it.
  If it already exists and is broken, fix it. If it exists and works, leave it.

**Do NOT:**
- Invent article titles, body text, authors, dates, or categories.
- Create any `ArticleCard` component (leave that for when content is ready).
- Fetch from any API or data file.

**Done when:**
- [ ] Page renders with heading, sub-heading, and the "coming soon" banner.
- [ ] Three placeholder `<div>`s with JSX comments are in place (filter, grid,
  pagination).
- [ ] Articles page is reachable from the Resources nav.
- [ ] No article content has been invented.
- [ ] No console errors.

---

### TASK G — Final Verification

**What it does:**
Systematic self-check across all tasks A–F before declaring the build complete.

**Run through this checklist:**

**Links & routing:**
- [ ] Maths page is reachable via site nav.
- [ ] All Resources sub-pages (FAQ, Guides, Our Location, Articles) are reachable.
- [ ] No internal links return 404s (check nav, CTAs, "Read guide" buttons).
- [ ] Articles banner is visible; Articles page has no fabricated content.

**Interactivity:**
- [ ] Task A (if built): all five curiosity cards open and close; only one open at
  a time.
- [ ] Task A2: all three tabs render; tab switch resets to example 1; "Reveal
  mistake" highlights the correct step and shows explanation; Previous/Next
  navigation works within each tab.
- [ ] Task B: HSC and Year 8 toggles work; steps reveal one at a time; "Start
  again" resets correctly.
- [ ] Task C — Phase 1: grep the codebase for "free assessment", "Book
  Consultation", "refund", and "online sessions" — none of the old copy should
  survive. All should read "Book an Interview", "additional support at no cost",
  and "in-person only" respectively.
- [ ] Task C — Features: WhatsApp button links correctly; ask-form draft saves and
  restores from localStorage; `/faq?category=X` URL param applies filter on load;
  "All" view groups items by category; `/` key focuses search; BreadcrumbList
  JSON-LD present; 👍/👎 state persists in localStorage.
- [ ] Task C: accordion opens/closes; only one item open per group at a time.

**Mobile (test at 375 px viewport width):**
- [ ] Task A grid (if built): collapses to 1 column, cards readable, tap targets ≥ 44 px.
- [ ] Task A2: KaTeX expressions in all examples render without clipping or
  overflow at 375 px. Step tables do not cause horizontal scroll (or if they do,
  the wrapper has `overflow-x: auto` and scrolls cleanly).
- [ ] Task B: problem statement and steps not horizontally clipped.
- [ ] Task C: accordion labels fully visible, not truncated.
- [ ] Task D: guide cards stack to 1 column.
- [ ] Task E: hours table not overflowing, contact block readable.
- [ ] Task F: "coming soon" banner full-width.

**Visual consistency:**
- [ ] All new sections use brand colour tokens — no hard-coded hex values that
  differ from the rest of the site.
- [ ] Font sizes, weights, and border-radius match existing pages.

**Console:**
- [ ] Open browser dev tools. Navigate to each new/modified page. Confirm zero
  errors in the console (warnings are acceptable if pre-existing).

**Placeholders still in place (do not fill these):**
- [ ] `[INSERT_ENCODED_ADDRESS]` comment in Our Location map iframe.
- [ ] `[INSERT STREET ADDRESS …]`, `[INSERT PHONE …]`, `[INSERT EMAIL …]` in
  contact block.
- [ ] `[INSERT WEEKDAY HOURS]`, `[INSERT SATURDAY HOURS]` in hours table.
- [ ] `[GUIDE CONTENT COMING SOON]` HTML comment in Guides page source.
- [ ] Guide "Read guide" buttons all link to `#`.
- [ ] Articles page: no article content, three JSX placeholder comments present.

**Done when:** every checkbox above is ticked. Build is complete.
