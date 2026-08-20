# Aurum, the Midnight Scholar

## 1. Theme and personality profile

### Visual concept

Aurum is a tiny, clever Australian magpie presented as an original magician-detective and academy companion. The design should feel theatrical, intelligent, warm, and readable at small sizes.

- **Body:** Compact pear-shaped body, slightly oversized head, short legs, and broad wings that can act like expressive hands.
- **Silhouette:** A pointed feather crest, a fan-shaped tail, and a short half-cape create three instantly recognisable shapes.
- **Face:** Large sapphire-blue eyes, flexible brows, a small charcoal beak, and a pale ivory cheek patch. Expressions must remain readable when the sprite is reduced.
- **Palette:** Midnight navy `#0A1B34`, deep blue `#2563EB`, academy gold `#D4AF37`, light gold `#F0C86A`, ivory `#F7F4EE`, charcoal `#17243A`, and sapphire glow `#67B7FF`.
- **Costume:** A short navy academy cape with an ivory lining, held by a round gold clasp. Avoid a top hat, white tuxedo, bow tie, or other costume details that would make Aurum resemble an existing anime character.
- **Props:** A gold-rimmed clue lens, pocket notebook, fountain pen, and small cards marked with abstract diagrams or equations.
- **Magic language:** Solved ideas appear as restrained gold sparks, constellation lines, and geometric sigils. Effects should support the silhouette rather than obscure it.
- **Rendering style:** Polished 2D game sprite; clean outer contour, soft cel shading, subtle feather texture, and no hard cast shadow.

### AI personality

Aurum is observant, encouraging, playfully dramatic, and never condescending. It treats each request like a mystery worth solving and celebrates the user's role in the answer.

- **Tone of voice:** Warm, precise, lightly theatrical, and occasionally cheeky. It uses short deduction-themed phrases without turning every sentence into a gimmick.
- **Greeting style:** Notices a useful detail, welcomes the user, and invites the next clue. Example: “Ah, you’re here. Excellent timing—the next mystery appears to be yours. What are we solving?”
- **When uncertain:** Says what is missing plainly and asks one focused question.
- **When working:** Gives calm progress cues such as “Following the strongest lead now.”
- **When finished:** Celebrates briefly, then presents the useful result.

Example reactions:

1. **User shares a difficult task:** “A stubborn little mystery. Good. Those tend to leave the clearest clues—let’s start with what we know.”
2. **A surprising connection is found:** “There it is! The quiet clue hiding in plain sight. That changes our whole line of reasoning.”
3. **The user corrects Aurum:** “Sharp catch. I followed the wrong feather trail—updating the deduction now.”

## 2. Sprite sheet state descriptions

Every row contains four animation frames read left to right. Aurum's feet or lowest body point stay on the shared baseline at local `y = 420` in every cell. The visual centre stays near local `x = 192`; effects may extend into the safe area but never cross a cell boundary.

### Row 1 — Idle / Resting

- **Frame 1:** Aurum sits three-quarter-facing right on a closed ivory book. Wings rest against the body, cape settles behind, eyes open with a small confident smile.
- **Frame 2:** Chest rises by 4–6 pixels and the crest lifts slightly. Eyes soften to a half-lidded expression.
- **Frame 3:** A slow blink; head dips 3–4 pixels while the gold clue lens glints once beside the chest.
- **Frame 4:** Eyes reopen, head tilts subtly toward the user, and one tail feather gives a small flick before returning to frame 1.
- **Loop:** Calm 1.6–2.0 second loop with minimal movement and no effects beyond the single lens glint.

### Row 2 — Thinking / Working

- **Frame 1:** Aurum stands upright, holds the clue lens over the right eye, and studies one floating gold diagram card. Brows angle inward in concentration.
- **Frame 2:** The free wing writes in the notebook while two diagram cards orbit clockwise. The eye behind the lens appears slightly magnified.
- **Frame 3:** Aurum leans forward; three sapphire constellation lines connect the cards. Beak is closed and expression intensely focused.
- **Frame 4:** A tiny gold spark appears above the crest as Aurum looks up with the beginning of a knowing smile.
- **Loop:** 0.9–1.2 seconds. Orbiting assets must remain separated from the head and preserve a clear silhouette.

### Row 3 — Needing Input

- **Frame 1:** Aurum faces forward and lowers the notebook. Brows rise asymmetrically; the smile becomes an inquisitive neutral expression.
- **Frame 2:** Head tilts left while one wing opens palm-up. A small sapphire question-mark sigil appears above that wing.
- **Frame 3:** Aurum brings the clue lens toward the viewer, making one eye appear larger. The question mark gives a gentle pulse.
- **Frame 4:** Aurum points from the empty notebook page toward the user, clearly inviting an answer; cape and tail settle for a clean looping return.
- **Loop:** 1.2–1.5 seconds. Curious and patient, never worried, sad, or accusatory.

### Row 4 — Success / Finished

- **Frame 1:** Aurum spots the solution; eyes widen, crest springs upward, and a small gold star ignites over the notebook.
- **Frame 2:** Aurum hops 14–18 pixels upward and opens both wings. The cape fans into a bold triangular silhouette.
- **Frame 3:** Peak celebration pose: one wing points upward, the other presents the solved card, and a restrained arc of gold geometric confetti frames the body.
- **Frame 4:** Aurum lands in a confident three-quarter stance, holding the completed card toward the viewer with a bright closed-beak smile.
- **Loop:** Play once over 0.8–1.0 seconds, then hold frame 4. Keep confetti inside the safe area.

## 3. Sprite formatting specifications

### Canvas and grid

- **Canvas:** Exactly `1536 × 1872` pixels in RGBA mode.
- **Grid:** `4 columns × 4 rows`, producing 16 frames.
- **Frame size:** Exactly `384 × 468` pixels because `1536 / 4 = 384` and `1872 / 4 = 468`.
- **Frame origins:** `x = 0, 384, 768, 1152`; `y = 0, 468, 936, 1404`.
- **Cell coordinates:** Left and top edges are inclusive; right and bottom edges are exclusive. For example, the first frame occupies `x=0..383`, `y=0..467`.
- **Safe art area:** 32 pixels from the left and right edges, 32 pixels from the top, and 48 pixels from the bottom. This gives a local safe rectangle of `x=32..351`, `y=32..419`.
- **Anchor:** Local centre `x = 192`; shared local baseline `y = 420`. Preserve these anchors to prevent visible jumping.
- **Bleed:** No artwork, glow, label, or particle may cross a cell boundary.

### Transparency and export

- Final production background must be fully transparent: `(0, 0, 0, 0)`.
- Export as a 32-bit RGBA PNG with straight alpha. Do not flatten against white, add a matte, or export as indexed colour.
- Use sRGB colour. Do not apply lossy compression.
- Keep empty pixels truly transparent. RGB values in fully transparent pixels should be zeroed when the target engine is vulnerable to colour fringing.
- Use nearest-neighbour filtering only if the final art is pixel art. For the specified polished 2D style, use high-quality downsampling and test the final sprite at its actual UI size.
- The generated labelled template is a placement guide, not a shippable sprite sheet. Remove every guide, tint, label, centreline, and baseline from the production export.

## 4. Automated Pillow template

Run from this directory:

```powershell
python aurum_sprite_template.py
```

The script writes `aurum_sprite_template.png`, a `1536 × 1872` RGBA guide containing 16 labelled, semi-transparent placement cells. Use `--output` to choose another path.

