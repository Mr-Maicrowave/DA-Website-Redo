# Privacy & Cookie Consent — Decision Brief for GA4

**Question:** Before turning on Google Analytics 4, do we need to ship a cookie consent banner?

**TL;DR recommendation:** **No banner required today**, but ship a privacy policy update covering GA4 before the GA4 measurement ID goes live, and revisit the banner question in late 2026 when the AU Privacy Act reforms (Tranche 2) actually land.

---

## Australian legal state of play (as of 2026-04-08)

| Regime | Applies to DA Tuition? | Banner required? |
|---|---|---|
| **Privacy Act 1988 (Cth)** | Yes (collects personal info via the Interview/Assessment booking form) | **Privacy policy required**, banner not legally required |
| **Spam Act 2003** | Yes (any email follow-up) | Not relevant to cookies |
| **APP 1 (open and transparent management)** | Yes | Privacy policy must disclose what's collected, including analytics cookies |
| **GDPR (EU)** | Only if you have EU visitors AND offer services to them | Probably not — DA Tuition is a Sydney-suburb tutoring service |
| **CCPA / CPRA (California)** | Only if Californian visitors AND $25M+ revenue | No |
| **Privacy Act reforms (Tranche 2, expected late 2026)** | Yes (when enacted) | **Likely yes** — reforms align Australia closer to GDPR-style consent |

**Bottom line for today:** Australian law requires a **privacy policy** that discloses analytics tracking, but does NOT require a click-to-consent banner. The Tranche 2 reforms will likely change that within 12-18 months.

---

## What competitors do (Sydney tutoring services, spot check)

This pattern is the de-facto Australian SME standard:
- Most Sydney tutoring sites: **GA4 + privacy policy, no banner**
- Some larger players (national franchises): **GA4 + small "we use cookies" footer notice, no consent gate**
- A handful (international franchises): **full GDPR-style consent banner** — usually because the parent company operates in the EU

DA Tuition is a single-suburb local business serving Australian families. The minimum compliant posture is the right one.

---

## Recommended posture

### Today (alongside GA4 launch)
1. **Update the privacy policy** to disclose:
   - Google Analytics 4 is used to measure site traffic
   - GA4 sets cookies (`_ga`, `_ga_*`) and collects: pages visited, time on site, device type, approximate location (city-level)
   - Visitors can opt out via [Google's opt-out browser add-on](https://tools.google.com/dlpage/gaoptout) or by enabling "Do Not Track" in their browser
   - Data is stored on Google servers (US)
2. **Anonymize IPs** in the GA4 config — already the GA4 default since GA4 doesn't store full IPs, but worth noting in the policy
3. **Enable Google Signals = OFF** in GA4 admin (it cross-references signed-in Google users — overkill for a local tutoring service and adds privacy exposure)
4. **Do not** enable Google Ads remarketing audiences without an explicit consent layer (irrelevant unless DA Tuition starts running ads)

### When the Privacy Act reforms land (likely late 2026)
1. Add a **simple footer banner** with two buttons: "Accept analytics" / "Reject". Default = analytics off until accept.
2. Use a lightweight library (e.g. `cookieconsent` ~6KB) — no need for a $50/mo SaaS
3. Wire GA4 loading behind the consent gate (don't load gtag.js until accepted)
4. Honor "Reject" persistently via localStorage

This is a 1-2 hour future task — no need to pre-build it now.

---

## What to add to the website right now

If there's no privacy policy page yet, ship one **before** the GA4 measurement ID gets uncommented. The page should live at `/privacy-policy` and be linked from the footer.

Suggested ticket: `T?? — Add /privacy-policy page covering GA4, cookies, and APP-compliant collection notice`. ~30 minutes of work.

If a privacy policy already exists, the analytics-disclosure paragraph can be appended in <10 minutes.

---

## Sources

- OAIC — [Australian Privacy Principles guide](https://www.oaic.gov.au/privacy/australian-privacy-principles)
- OAIC — [Privacy Act review report](https://www.ag.gov.au/rights-and-protections/publications/privacy-act-review-report) (basis for Tranche 2 reforms)
- Google — [How GA4 handles privacy](https://support.google.com/analytics/answer/12017362)

---

## Decision checklist

- [ ] Confirm whether `/privacy-policy` page exists today (if not, open ticket)
- [ ] Draft the GA4 disclosure paragraph (Claude can produce on request)
- [ ] Decide: ship the privacy policy update **before** uncommenting the GA4 snippet in `index.html`
- [ ] Set a calendar reminder for Q4 2026 to revisit the banner decision once Tranche 2 reform timeline firms up
