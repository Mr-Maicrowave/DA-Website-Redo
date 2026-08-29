# Success Stories Gratitude Envelope Design

## Objective

Replace only the existing `GratitudeSection` on the Success Stories page with an interactive letter-from-DA experience. The section should communicate that families have shared meaningful messages with DA and DA is now writing back to them. It must closely follow the supplied reference composition while remaining responsive, keyboard accessible, and reversible.

## Visual Direction

The closed state centres a large warm-ivory envelope on the existing paper-toned section. Small torn-paper review notes sit around it as secondary elements. The open state visually matches the reference: a large cream letter dominates the centre, the envelope remains partially visible underneath, and the surrounding notes spread outward and become more legible.

The palette remains DA navy, muted antique gold, warm ivory, and soft beige. Materials should feel tactile and premium, with subtle paper fibres and restrained shadows. The interaction must not feel cartoonish, brightly coloured, glossy, or glass-like.

## Generated Asset Set

Use the built-in ChatGPT Image Generator with the supplied image as a composition and material reference. Generate each asset separately with a transparent background and no text, logo, watermark, or decorative lettering:

1. `gratitude-envelope-back-v1.png` — rectangular cream envelope back with subtle paper fibres.
2. `gratitude-envelope-flap-v1.png` — matching triangular top flap, front-facing and suitable for a 3D X-axis rotation.
3. `gratitude-envelope-pocket-v1.png` — matching front pocket with the diagonal fold geometry visible in the reference.
4. `gratitude-letter-paper-v1.png` — flat premium ivory letter sheet with subtle fibres and softly imperfect edges.
5. `gratitude-heart-seal-v1.png` — understated antique-gold paper heart seal with light dimensional texture.

Final project assets will live in `public/images/success-stories/`. Live HTML supplies all wording and review text so typography remains exact and accessible. CSS controls geometry and responsive scaling; the generated images supply the premium material appearance.

## Component Structure

`GratitudeSection.tsx` will own one boolean `isOpen` state and render these layers in strict order:

1. section background and surrounding review notes;
2. envelope back;
3. letter;
4. envelope flap;
5. envelope front pocket;
6. heart seal and interaction copy.

The letter is therefore above the envelope back but below the front pocket while closed and during extraction. The envelope assembly is activated by a semantic `button` with `aria-expanded`, an accessible open/close label, and keyboard support through native button behavior. A separate subtle close control appears on the open letter.

## Closed State

- Centre the envelope at approximately `min(58rem, 72vw)` on desktop and `86vw` on mobile.
- Place “A NOTE FROM DA” above the envelope.
- Place “To every family who has trusted us ♡” and “Open our note →” on the envelope as live text.
- On hover or focus-visible, move the envelope up 4px, deepen the compact shadow, strengthen the hint, and pulse the heart once from 1 to 1.06 to 1.
- Do not autoplay the opening or continuously bounce any element.

## Open Animation

Use Framer Motion variants with the existing premium easing curve `[0.22, 1, 0.36, 1]`.

1. Seal compresses for roughly 150ms.
2. Flap rotates from `rotateX(0deg)` to `rotateX(180deg)` over roughly 720ms with `transform-origin: top center` and a 1000px perspective.
3. After the flap is sufficiently open, the letter slides upward without fading. Desktop motion starts at `translateY(0) scale(.94) rotate(-1deg)` and settles near `translateY(-390px) scale(1) rotate(0deg)` with a tiny non-bouncy overshoot.
4. The envelope assembly moves down roughly 96px while the letter rises.
5. Review notes stagger outward at 80ms intervals and increase from approximately 0.55 to 0.96 opacity.

Closing reverses the choreography: letter descends behind the pocket, flap closes, seal returns, and the envelope recentres. Reduced-motion mode switches between closed and open arrangements with a short opacity transition and no 3D travel.

## Letter Content

All copy is live text:

- `A NOTE FROM DA`
- `These words mean`
- `more than you know. ♡`
- `Thank you for trusting us with a small part of your child's journey.`
- `Every message, every review and every story of progress reminds us that behind every lesson is a child finding a little more confidence, understanding and belief in themselves.`
- `We're grateful to grow with you. ♡`

Use the existing Cormorant/DA display serif for the headline, muted antique-gold italics for “more than you know.”, the existing body sans for paragraphs, and the already-loaded `Caveat` treatment only for the closing line.

## Unused Real Review Notes

The following fragments come from `src/data/reviews.json` and use reviewers not present in the current ten-card review marquee. No wording is invented:

1. Lisa Vu — “I am now looking forward to a bright future”
2. Chau Ho — “My English has improved significantly”
3. Florence Nguyen — “it’s helped raise my grades tremendously !!”
4. Khushleen Kaur — “I went from a 60% in math to a 97%.”
5. Harry Kha — “They always had my back whenever I needed them”
6. Charlie Kien — “They have made me believe in myself”

Desktop shows all six. Mobile shows four: Lisa Vu, Chau Ho, Khushleen Kaur, and Charlie Kien. Each note includes a coloured initial badge and a small heart outline. Notes are decorative excerpts but remain readable to assistive technology as a labelled list.

## Responsive Composition

Desktop letter width is `clamp(38.75rem, 46vw, 43.75rem)`. The envelope remains partially visible below it. Review notes occupy the outer left and right columns and never overlap the letter’s readable area.

Below 860px, the letter becomes approximately `90vw`, the envelope approximately `86vw`, the extraction distance shortens, and two notes are hidden. The open letter may extend vertically beyond one viewport but must never overflow horizontally. Body copy scales only enough to preserve comfortable reading.

## Accessibility and Interaction

- Native button semantics for the envelope trigger.
- `aria-expanded` reflects state.
- Accessible label changes between “Open a thank-you note from DA Tuition” and “Close the thank-you note from DA Tuition”.
- Visible focus ring uses DA gold with sufficient contrast.
- The open close control has a 44px minimum target.
- Decorative assets use empty alt text; the letter’s content remains semantic HTML.
- `prefers-reduced-motion` removes the choreographed rotation and translation.
- Focus remains on the trigger when opening and can move to the explicit close control through normal tab order.

## Testing and Verification

Add focused tests before implementation for:

1. semantic button and `aria-expanded` state;
2. open and close state transitions;
3. generated layer ordering and class contract;
4. all six fragments matching source review text and excluding marquee authors;
5. reduced-motion class/variant behavior;
6. desktop and mobile sizing contracts.

Run focused component tests, existing Success Stories tests, `git diff --check`, and the project typecheck. Validate the rendered section in the in-app browser at 1440×900 and 390×844, exercising mouse click, keyboard activation, close reversal, and reduced-motion rendering. Existing unrelated project errors will be reported separately rather than attributed to this component.

## Scope Boundaries

- Do not alter the Success Stories hero, story carousel, review marquee, parent flip cards, or 3D review field.
- Do not modify existing review wording or reuse any of the ten marquee reviewers.
- Do not add a new font.
- Do not flatten the interactive composition into one image.
- Do not autoplay the emotional opening interaction.
