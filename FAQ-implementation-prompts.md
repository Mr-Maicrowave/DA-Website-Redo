# DA Tuition — FAQ Page Improvement: Batched Implementation Prompts

These prompts upgrade `src/pages/FAQ.tsx` so the page feels human and interactive, and — most importantly — gives visitors a real way to **ask a question and get it answered** (today both "contact" buttons just dial the phone, and a computed list of popular questions is never rendered).

**How to use this file:** Hand the model **one batch at a time**, in order. Always paste the "Shared Project Context" block first, then the batch. After each batch, run the verification commands and confirm before moving on. Batches are ordered low-risk → high-value; each is self-contained.

---

## Shared Project Context (paste this before EVERY batch)

> You are working in an existing React + TypeScript + Vite codebase for DA Tuition, an Australian K-12 tutoring website. Follow existing conventions exactly — do not introduce new libraries unless the batch says so.
>
> **Stack:** React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui (components in `src/components/ui/`), Radix primitives, lucide-react icons. Path alias `@/` maps to `src/`.
>
> **The file you are editing:** `src/pages/FAQ.tsx` (unless a batch says otherwise). Read it fully before changing anything.
>
> **Key facts about the current FAQ page:**
> - It has local state `searchTerm` and `selectedCategory`.
> - `faqCategories` = 8 categories (`all`, `enrollment`, `programs`, `pricing`, `classes`, `teachers`, `results`, `safety`), each with a lucide `icon`.
> - `faqs` = an array of objects: `{ category, question, answer, popular? }`. Some answers use template literals pulling from `siteStats` (imported from `@/data/site-stats`).
> - `filteredFAQs` filters by category + search. `popularFAQs` is computed (`faqs.filter(f => f.popular)`) but **never rendered** — this is dead code you will use later.
> - Results render in a shadcn `Accordion` (`type="single" collapsible`).
> - Two contact areas exist: a hero "Quick Contact" (two buttons) and a bottom "Still Have Questions?" section (three cards + a CTA button).
>
> **Known issues to respect:**
> - In the hero, both buttons ("Call 0401 940 207" and "Direct Support") link to `tel:0401940207`. In the bottom section, "Call Us" and "Direct Message" cards both link to `tel:0401940207`, and "Visit Us" + the main CTA both go to `/#contact`. These duplications are intentional targets for cleanup.
> - There is **no backend/API for form submission**. The existing booking form in `src/components/Contact.tsx` is a plain `<form>` with no `onSubmit`. Any new form must work without a backend (use a `mailto:` action or clearly-marked TODO), and must not pretend to send data it can't send.
>
> **Brand tokens (Tailwind):** `brand-navy`, `brand-midnight`, `brand-blue`, `brand-blue-light`, `brand-blue-dark`, `brand-highlight`. Buttons: `.btn-primary`, `.btn-secondary`. Use existing tokens — do not hardcode hex values.
>
> **Animations available:** `FadeInUp` from `@/components/animations/FadeInUp`, and `StaggerContainer` / `StaggerItem` from `@/components/animations/StaggerChildren`.
>
> **After making changes you MUST run:**
> ```bash
> npm run lint
> npm run build:dev
> ```
> Both must pass with no new errors. Do not start the dev server. Keep changes scoped to the files named in the batch. Do not reformat unrelated code.

---

## Batch 1 — Cleanup & quick wins (low risk, no new features)

> **Goal:** Remove the "AI-generated" tells caused by redundant/misleading controls, and make search feel responsive. No new components.
>
> **Tasks (all in `src/pages/FAQ.tsx`):**
> 1. **Fix the misleading hero buttons.** The two hero buttons currently both dial the phone. Keep the first as "Call 0401 940 207" (`tel:`). Change the second from "Direct Support" to **"Text Us"** linking to `sms:0401940207`. Keep the `MessageCircle` icon.
> 2. **Fix the bottom "Still Have Questions?" cards** so each does something distinct: "Call Us" → `tel:0401940207` (keep); change "Direct Message" → **"Text Us"** → `sms:0401940207`; keep "Visit Us" but point the main bottom CTA button to a clearer target — leave "Visit Us" → `/#contact` and change the large CTA button text to **"Book a Free Assessment"** (still `/#contact` for now).
> 3. **Add a clear (X) button inside the search input** that appears only when `searchTerm` is non-empty and resets it. Use the lucide `X` icon, positioned on the right side of the input (mirror the existing left `Search` icon pattern).
> 4. **Add a live results count.** Directly above the accordion, render muted text like `Showing {filteredFAQs.length} of {faqs.length} questions` (and when a category other than `all` is selected, append the category label). Hide it when there are zero results (the empty state already handles that case).
>
> **Acceptance criteria:**
> - No two interactive controls perform the identical action with different labels.
> - The search box can be cleared with one click when it has text.
> - A count is visible and updates as you type/filter.
> - `npm run lint` and `npm run build:dev` pass.

---

## Batch 2 — Surface popular questions & make filtering legible

> **Goal:** Use the already-computed `popularFAQs` and make the category bar more informative. This is what makes the page feel curated rather than a flat dump of 27 items.
>
> **Tasks (all in `src/pages/FAQ.tsx`):**
> 1. **Render a "Most Asked" quick-access strip** between the hero and the "Browse by Category" section. Map over `popularFAQs` and render each question as a clickable pill/chip (rounded, brand-styled, hover state). Clicking a chip should set `searchTerm` to that question's text (so the accordion filters down to it) and smooth-scroll to the accordion. Include a small heading like "⭐ Most asked by parents" (use a lucide `Star` or `TrendingUp` icon, not an emoji, to match the icon-based design).
> 2. **Add a count badge to each category pill** in the existing category filter row. For each category, show how many FAQs it contains, e.g. `Pricing · 2`. For the `all` pill use the total. Compute counts from `faqs` (don't hardcode). Keep the active/inactive styling that already exists.
> 3. **Highlight the matched search term** inside rendered questions (and optionally the answer) when `searchTerm` is non-empty. Implement a small helper that splits the text on the (case-insensitive) match and wraps matches in a `<mark>` styled with a soft brand-highlight background. Do not use `dangerouslySetInnerHTML`; build React nodes.
>
> **Acceptance criteria:**
> - The popular-questions strip renders and clicking a chip filters + scrolls to the matching question.
> - Each category pill shows an accurate count.
> - Typing in search visibly highlights matched text.
> - `npm run lint` and `npm run build:dev` pass.

---

## Batch 3 — "Ask a Question" feature (the core goal)

> **Goal:** Give visitors a real way to ask a question that isn't already answered, and turn search dead-ends into that flow. There is no backend, so submission uses `mailto:` and is clearly honest about what happens.
>
> **Tasks:**
> 1. **Create a new component** `src/components/faq/AskQuestionForm.tsx`. Use shadcn `Input`, `Textarea`, `Label`, and `Button` (import from `@/components/ui/...`), matching the field styling in `src/components/Contact.tsx`. Fields: Parent name (required), Email (required, type=email), Child's year level (a `<select>` styled like the one in `Contact.tsx`, options Kindergarten / Year 1–12), and Your question (required `Textarea`). Accept an optional prop `defaultQuestion?: string` to prefill the question field.
> 2. **Submission without a backend:** On submit, build a `mailto:` link to `info@datuition.com.au` with a useful subject (e.g. `FAQ question from {name}`) and a body containing all field values (use `encodeURIComponent`), then open it (`window.location.href = mailtoUrl`). Validate required fields client-side first and show inline errors. Add a short honest helper line under the button: "This opens your email app pre-filled — or call/text us on 0401 940 207." Leave a clear `// TODO: replace mailto with a real form endpoint (e.g. Formspree) when available` comment.
> 3. **Embed the form on the FAQ page.** Add a new section (before or replacing the redundant parts of the bottom "Still Have Questions?" section) titled e.g. "Didn't find your answer? Ask us." that renders `<AskQuestionForm />`. Keep one set of contact methods (call / text / visit) nearby, but remove the duplication left over from Batch 1 so the page has a single, clear "ask or contact" area.
> 4. **Wire the empty state to the form.** In the existing "No questions found" block, add a primary button "Ask this question →" that scrolls to the form and prefills it with the current `searchTerm` (pass it down as `defaultQuestion`, e.g. via shared state or a ref + setter).
>
> **Acceptance criteria:**
> - A visitor can fill the form and submitting opens a correctly pre-filled email draft.
> - Required-field validation works and is accessible (labels tied to inputs).
> - Searching for something with no results offers a one-click path to ask it, prefilled.
> - No claim is made that a message was "sent" when it only opened an email draft.
> - `npm run lint` and `npm run build:dev` pass.

---

## Batch 4 — Feedback & shareable answers

> **Goal:** Add lightweight interactivity that gives users agency and helps the business learn which answers fall short.
>
> **Tasks (in `src/pages/FAQ.tsx`, plus a small component if helpful):**
> 1. **"Was this helpful?" control** under each answer inside `AccordionContent`. Render 👍 / 👎 as lucide `ThumbsUp` / `ThumbsDown` icon buttons. Track selection per-question in local component state (e.g. a `Record<number, 'up' | 'down'>`); no backend needed. When a user clicks 👎, reveal a short prompt linking to the Ask-a-Question form from Batch 3 ("Sorry! Ask us directly →"). Keep it accessible (aria-labels, button elements).
> 2. **Deep-linkable questions.** Give each `AccordionItem` a stable `id` derived from a slug of the question. Add a small "copy link" icon button (lucide `Link` / `Link2`) in each answer that copies `window.location.origin + '/faq#' + slug` to the clipboard (`navigator.clipboard.writeText`) and briefly shows a "Copied!" confirmation. On page mount, if `window.location.hash` matches a question slug, open that accordion item and scroll to it.
> 3. Keep the `Accordion` usable: if needed, switch `type="single"` to `type="multiple"` only if it's required to support opening a hash-linked item; otherwise leave as-is and document why.
>
> **Acceptance criteria:**
> - Each answer has working thumbs up/down with visible state; thumbs-down surfaces the ask path.
> - Each answer has a copy-link button that copies a correct deep link and confirms.
> - Visiting `/faq#<question-slug>` opens and scrolls to that question.
> - `npm run lint` and `npm run build:dev` pass.

---

## Batch 5 — Voice & visual polish (highest "feel" payoff)

> **Goal:** Kill the remaining generic/AI tone and add visual variety so the page feels alive for both parents and students. This batch is content + styling; make changes conservatively and preserve all `siteStats` template values.
>
> **Tasks:**
> 1. **Rewrite stilted answers** in `faqs` to sound like a warm, specific human. Replace corporate filler such as "Student safety is paramount" and "Our track record speaks for itself" with concrete, friendly phrasing. **Do not change facts, numbers, hours, phone numbers, or any `${siteStats...}` expressions** — only tone and wording. Keep each answer roughly the same length or shorter.
> 2. **Add 2–3 "real parent voice" questions** phrased the way parents actually type (e.g. "My son hates maths — will tutoring make it worse?"), with reassuring, specific answers. Assign appropriate categories and mark the strongest one `popular: true`.
> 3. **Per-category color + icon on each accordion item.** Each `faqCategories` entry already has an `icon`. Add an accent color per category (using existing brand tokens / Tailwind classes — define a small lookup map, no new hex). On each accordion item, show the category's icon in its accent color instead of the single generic blue `ChevronRight`, and apply a subtle left-border or background tint in that accent. Keep contrast accessible.
> 4. **Add entrance animation** to the FAQ list and section headers using the existing `FadeInUp` / `StaggerContainer` / `StaggerItem` components (already used elsewhere). Keep transitions ~300ms and subtle.
>
> **Acceptance criteria:**
> - No remaining boilerplate-sounding sentences; tone reads human and specific.
> - All numbers, hours, contact details, and `siteStats` interpolations are unchanged.
> - Accordion items are visually differentiated by category (icon + accent), with readable contrast.
> - Sections/list animate in subtly; no jank.
> - `npm run lint` and `npm run build:dev` pass.

---

## Final verification (after all batches)

> Run a full check and a manual pass:
> ```bash
> npm run lint
> npm run build:dev
> ```
> Then in `npm run dev` (http://localhost:8080/faq) confirm: search + clear works; category counts are correct; popular chips filter & scroll; the Ask form opens a prefilled email; thumbs up/down works and 👎 surfaces the ask path; deep links open the right question; no console errors; mobile layout (narrow viewport) is intact.
