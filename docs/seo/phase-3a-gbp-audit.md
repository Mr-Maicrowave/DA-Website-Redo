# Google Business Profile (GBP) Audit Checklist — DA Tuition

The single highest-leverage local SEO asset for a physical-location service business. GBP shows up in the Map Pack, Knowledge Panel, and "near me" results — the things that drive walk-ins and phone calls.

**Where:** https://business.google.com (must be admin)
**Listed business:** DA Tuition, Level 1/229 Canley Vale Rd, Canley Heights NSW 2166, 0401 940 207

---

## 1. NAP consistency (Name / Address / Phone)

NAP must match **exactly** between GBP, the website, and every directory citation. Even a comma difference can dilute trust.

Check all three sources match:

- [ ] **Name**: `DA Tuition` (not "DA Tutoring", "D.A. Tuition", "Daniel's Academy", etc.)
- [ ] **Address**: `Level 1/229 Canley Vale Rd, Canley Heights NSW 2166` (matches `src/lib/seo/schema.ts` and footer)
- [ ] **Phone**: `0401 940 207` (single primary number — no secondary numbers competing)
- [ ] **Website URL**: `https://datuition.com.au` (with HTTPS, no trailing slash variation)

---

## 2. Categories

The primary category is the single biggest ranking signal in GBP. Pick the most specific one Google offers.

- [ ] **Primary**: `Tutoring service` (not "Educational consultant" — too generic)
- [ ] **Secondary** (up to 9): `After school program`, `Coaching center`, `Educational institution`, `Test preparation center`
- [ ] Don't add categories you don't actually deliver — Google penalizes mismatch

---

## 3. Hours

Must match the website footer and the `LocalBusiness` schema in `src/lib/seo/schema.ts`. Per `CLAUDE.md`:

| Day | Hours |
|---|---|
| Mon | Closed |
| Tue–Fri | 5pm – 9pm |
| Sat | 9am – 6pm |
| Sun | 10am – 7pm |

- [ ] Hours match website + schema exactly
- [ ] **Special hours** set for school holidays / public holidays (Easter, ANZAC Day, school holiday extended hours, end-of-year break)
- [ ] No "permanently closed" or "temporarily closed" flags accidentally set

---

## 4. Photos

GBP listings with 10+ photos get ~2× more clicks. Aim for 20+, refresh quarterly.

- [ ] **Logo** — square, high-res, transparent background
- [ ] **Cover photo** — landscape, branded, ideally with the building or a class in session
- [ ] **Interior** — 5-10 shots of classrooms, study spaces, library
- [ ] **Exterior** — building entrance, signage, street view
- [ ] **Team** — principal + teachers (with consent)
- [ ] **At work** — students in lessons (with parent consent — no faces if unsure)
- [ ] **Awards** — Outstanding Education Service award (Fairfield City Local Business Awards 2025) photo
- [ ] All photos geotagged to Canley Heights (most phones do this automatically)

---

## 5. Services

GBP lets you list specific services with descriptions. Each one is a long-tail keyword opportunity.

- [ ] **Primary School Tutoring** (Years 1-6) — short description with unique copy
- [ ] **High School Tutoring** (Years 7-10)
- [ ] **HSC Preparation** (Years 11-12)
- [ ] **English Tutoring**
- [ ] **Mathematics Tutoring**
- [ ] **Science Tutoring**
- [ ] **Business Studies Tutoring**
- [ ] **Legal Studies Tutoring**
- [ ] **Selective School Test Preparation** (if offered — confirm with Jared)
- [ ] **OC Test Preparation** (Year 4 → Year 5 OC class — if offered)
- [ ] Each service: 1-2 sentence unique description, ideally with the service area suburb mentioned

---

## 6. Attributes

GBP attributes are checkbox flags that surface in search filters. Easy wins.

- [ ] **Wheelchair accessible entrance** (yes/no — confirm building access)
- [ ] **Wheelchair accessible parking** (if applicable)
- [ ] **Online classes** (yes — DA Tuition offers online learning per `LearningFormats.tsx`)
- [ ] **Onsite services** (yes)
- [ ] **Identifies as women-owned / family-owned** (set if applicable)
- [ ] **Free Wi-Fi** (if offered to students)
- [ ] **Toilets** (yes/no)

---

## 7. Posts (the secret weapon)

GBP Posts appear directly in the Knowledge Panel. They expire after 7 days (offer posts last longer). Aim for 1-2 posts/week — Google rewards active profiles.

- [ ] **What's New** post: featured testimonial, new article from `/articles`, awards news
- [ ] **Event** post: parent info nights, exam prep workshops
- [ ] **Offer** post: "Book Assessment" (or "Book Interview" — see CTA decision) with the same CTA copy as the website
- [ ] Each post links back to the matching website page (drives schema-rich landing-page hits)

---

## 8. Q&A

Anyone can post a question on a GBP listing. If you don't answer them, random users will — and they're often wrong.

- [ ] Pre-seed 5-10 common Q&As yourself (use questions from `src/pages/FAQ.tsx`):
  - What ages do you teach?
  - What's the class size?
  - Do you teach the new HSC syllabus?
  - Where are you located?
  - How do I book an assessment?
- [ ] Set up email alerts for new questions
- [ ] Respond to all unanswered questions (yours or others')

---

## 9. Reviews

You have 450+ Google reviews per `src/data/reviews.json`. The optimization is now about *response rate*, not collection.

- [ ] **Respond to every new review** within 48 hours (positive AND negative)
- [ ] Response template for 5-star: thank by name, mention something specific from their review, soft CTA ("looking forward to seeing [student name] in next term's classes")
- [ ] Response template for 1-3 star: acknowledge, never argue, offer to take it offline ("please reach out to us at 0401 940 207 so we can make this right")
- [ ] **Never** offer incentives for reviews (Google policy violation, hard ban)
- [ ] Set a recurring reminder: ask new families to leave a Google review at the end of their first term

---

## 10. Bookings + messaging

- [ ] **Booking link**: point to `/interview` page (or whatever the assessment booking URL is)
- [ ] **Messaging**: enable if you can commit to <24h response time. Otherwise leave off — slow responses hurt the listing.
- [ ] **Phone call button**: confirm `0401 940 207` is the click-to-call number

---

## After the audit

- Open a Linear/AGENTS.md ticket for any code-side fixes the audit surfaces (NAP mismatches, wrong hours in schema, missing services).
- Schedule the next audit for **6 months out** (or whenever you change premises, hours, or pricing).
- Monitor: GBP **Insights** tab → impressions, calls, direction requests, website clicks. These are the actual KPIs for local SEO.
