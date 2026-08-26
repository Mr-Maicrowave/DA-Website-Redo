# Tutor Orbit Safe-Sector Refinement Design

## Context

The `/tutors` hero already has the correct visual world and product structure: editorial copy on
the left, a featured educator surrounded by the wider team, and a cream profile panel on the
right. The current implementation also has real catalogue data, keyboard-accessible tutor
buttons, shared-layout centre exchanges, two accumulated animation clocks, and reduced-motion
handling.

The remaining problem is structural. The centre, inner orbit, and outer orbit use unrestricted
elliptical paths whose clearances are smaller than the portrait footprints. The two independently
moving tiers will therefore collide eventually, and the profile card masks right-side portraits
instead of providing a genuine exclusion zone. Adding more decorative movement to that geometry
would make the crowding more obvious.

This refinement keeps the existing concept, copy, palette, routes, profile information, and
approximately fifteen-person desktop faculty presence. It replaces unsafe full-path portrait
travel with authored safe sectors, then adds layered motion within that controlled geometry.

## Goals

- Preserve one dominant centre tutor, five readable primary tutors, and nine quieter secondary
  tutors on desktop.
- Guarantee that portraits and permanently visible labels do not collide at the required desktop
  viewports.
- Keep a protected negative-space zone around the featured tutor, headline, and profile panel.
- Make the hero feel more alive through layered orbit drift, local portrait motion, moving markers,
  pointer response, entrance choreography, and a spatial selection transition.
- Give outer-origin selections a visible promotion through the primary layer before they become
  the centre tutor.
- Make profile changes feel authored through a short staggered reveal.
- Simplify tablet and mobile structurally rather than shrinking the desktop composition.
- Preserve immediate interaction, keyboard access, and useful reduced-motion behavior.

## Non-goals

- No new visual concept, palette, copy system, tutor catalogue, route, booking flow, or marketplace
  behavior.
- No random positioning, runtime physics engine, or continuously resolving collision solver.
- No chaotic spinning, bouncing, elastic easing, heavy blur, dense star field, or novelty cursor.
- No attempt to fit all fifteen portraits into the mobile orbit.
- No scroll-triggered, pinned, or scrubbed animation architecture.

## Spatial thesis

The desktop reading path is editorial promise → featured educator → selected educator evidence in
the profile card. The primary tutors support the centre; the secondary tutors establish team scale
without competing for attention.

The stage is divided into explicit regions:

1. **Centre exclusion zone** — featured portrait radius plus the largest primary portrait radius
   and a minimum optical gap. No orbit tutor or label may enter it.
2. **Primary sectors** — five authored curved lanes around the centre, biased toward the top,
   lower-left, and lower-right zones where names remain readable.
3. **Secondary sectors** — nine smaller lanes near the perimeter. These deliberately leave an empty
   right-side wedge beside the profile card and a smaller left-side gap beside the headline.
4. **Profile exclusion zone** — the card edge, arrow notch, shadow, and focus halo form one protected
   polygon. Interactive portraits never move underneath it.
5. **Promotion corridor** — a temporary, portrait-only path from a selected outer slot to a clear
   primary waypoint and then into the centre. Other tutors soften and nudge away while this corridor
   is active.

The safe sectors are deterministic data, not CSS `nth-child` improvisation. Each sector defines a
base point, a short local curve, label direction, depth range, and maximum portrait size. The same
geometry module supplies runtime transforms and geometry tests.

## Desktop geometry

### Wide desktop: 1600px and above

- Centre portrait remains dominant but its maximum diameter is coordinated with the primary sector
  radius rather than growing independently.
- Five primary portraits remain fully readable and labelled.
- Nine secondary portraits remain represented. They are smaller, lower contrast, and unlabelled by
  default; the focused portrait reveals one collision-safe floating name.
- The rightmost profile wedge remains empty at every animation phase.
- One or two secondary portraits may be deliberately clipped by the stage perimeter, never by the
  profile card or section boundary.

### Standard desktop: 1200–1599px

- Uses a compact safe-sector map with reduced portrait sizes and shorter local drift.
- The profile remains alongside the orbit, but the exclusion wedge grows as the middle grid column
  narrows.
- The 1366×768 layout reduces vertical stage height and moves the hint into unused lower-stage space
  so it does not compete with portraits.

### Tablet: 721–1199px

- The profile moves below the stage for the entire range; there is no unsafe 1101–1199px band with
  the card still beside static edge anchors.
- Five primary tutors remain visible. Six secondary tutors form a quiet static or lightly drifting
  perimeter; the remaining secondary tutors are available through the educator navigator.
- Pointer parallax and continuous portrait drift are reduced.
- The profile animation uses real layout boxes rather than `display: contents`.

### Mobile: 720px and below

- The centre remains dominant.
- A compact radial group shows four supporting educators at a time.
- Previous/next controls and horizontal swipe move through the fifteen-person faculty roster in
  labelled groups. Tapping a portrait selects it.
- Continuous orbit drift and pointer parallax are disabled. Selection uses a short fade/scale
  transition and the profile remains immediately reachable below the group.

## Motion system

### Entrance

The entrance takes approximately 1.8 seconds but never blocks input:

1. background atmosphere fades in;
2. eyebrow and headline lines rise with a small stagger;
3. centre portrait fades/scales into focus;
4. orbit paths and primary tutors enter;
5. secondary tutors enter with a lighter stagger;
6. the profile card lifts in last;
7. ambient clocks begin after the major composition is legible.

All entrance transforms use opacity, translate, and scale. Easing is a restrained cubic Bézier with
no bounce or spring overshoot.

### Ambient orbit movement

- Primary sectors use a shared 54-second base clock. Each portrait travels only along its authored
  safe curve with a small individual phase and amplitude modifier.
- Secondary sectors use a shared 92-second clock in the opposite direction, again confined to safe
  local curves.
- Portraits remain upright. Depth is communicated with small scale, opacity, glow, and z-index
  changes rather than rotation.
- Each portrait receives a 7–11 second independent breathing value limited to approximately 2px and
  a restrained edge-glow pulse.
- Three small orbit markers travel along the decorative SVG paths. Markers may pass behind the card
  because they are non-interactive and masked; portraits may not.
- The centre portrait retains a 2–4px, 7–9 second float and a subtle halo breath.

### Pointer response

Pointer position is converted into shared Framer Motion values. The orbit field shifts at most 5px,
the halo at most 8px, and the SVG geometry at most 3px. Safe-sector padding includes this maximum
displacement, so parallax cannot create collisions. Hovered or focused portraits brighten and rise
slightly; no runtime nearest-neighbour calculation is required.

### Pause behavior

Hover, focus, document visibility loss, reduced motion, and selection reset the last-frame timestamp
without changing accumulated elapsed time. Resuming therefore continues from the exact previous
position. Independent decorative marker motion may continue during portrait hover, but all spatial
portrait motion pauses.

## Selection choreography

The main selection sequence lasts 900–1200ms.

1. Portrait orbit clocks pause and the field glow softens.
2. The selected portrait brightens; non-selected portraits reduce emphasis and nudge within their
   safe sectors.
3. A primary selection exchanges directly with the centre through the existing shared identity.
4. A secondary selection first travels to the dedicated promotion waypoint for approximately
   220ms, grows to primary scale, then continues to the centre.
5. The previous centre moves into the selected tutor's original tier and slot.
6. SVG paths rotate or offset by only a few pixels to make the field feel reoriented.
7. The centre halo changes its gradient position and intensity for the selected educator.
8. Ambient movement resumes from the accumulated position after the exchange finishes.

The promotion portrait is a temporary motion layer with one job: render the selected educator along
the authored corridor. The underlying tutor arrays remain the source of truth, and the existing
exact-tier swap function remains deterministic.

## Profile choreography

The card shell lifts by no more than 6px during a selection. Existing content fades/slides out, then
the new content enters over 600–750ms:

1. educator tier label;
2. name;
3. designation;
4. subjects and year levels;
5. teaching style;
6. strengths with a restrained stagger;
7. profile CTA.

The component reserves stable regions for variable-length teaching styles and strengths so the CTA
does not jump between tutors. Tablet and mobile use the same semantic order and a simpler stagger.

## Component architecture

- `tutor-orbit-config.ts` owns tutor cohorts, safe-sector definitions, responsive geometry variants,
  local curve sampling, protected-zone bounds, and deterministic swap results.
- `TutorOrbitHero.tsx` owns state, clocks, pointer motion values, selection phases, entrance variants,
  the temporary promotion portrait, profile variants, and mobile roster navigation.
- `tutor-orbit.css` owns the incumbent navy/gold/cream visual treatment, responsive topology,
  portrait sizing, label tooltip treatment, masking, stacking, and reduced-motion overrides.
- A small geometry utility may be extracted only if the config becomes difficult to test in place.
  No general animation abstraction or new dependency is introduced.

Selection state is explicit: `idle`, `promoting`, and `exchanging`. Timeout cleanup and repeated-click
guards prevent stale transitions. Buttons remain real buttons, use visible focus states, and expose
the selected tutor through the live profile region.

## Accessibility

- `prefers-reduced-motion` disables continuous clocks, pointer parallax, centre float, breathing, and
  decorative marker travel.
- Reduced-motion selection uses a short fade/scale transition while preserving the tutor exchange,
  profile update, and keyboard focus.
- Every portrait remains a button with an accessible tutor name. Outer visual labels are decorative
  and may be hidden without removing accessible names.
- Mobile previous/next controls have explicit labels and a roster status such as “Educators 5–8 of
  15”. Swipe is supplementary, never the only navigation method.
- DOM order remains editorial, primary tutors, secondary tutors, mobile navigation, then profile.

## Performance

- Continuous motion uses Framer Motion values and transform/opacity properties only.
- All portraits in a tier share one clock; independent life is derived from phase and amplitude, not
  separate animation loops.
- Pointer response is shared at the stage level rather than attaching a listener to each portrait.
- No runtime collision solver, layout reads per frame, canvas, WebGL, or additional motion library is
  introduced.
- Decorative motion is reduced on tablet and removed on mobile/reduced-motion modes.

## Verification contract

### Automated tests

- Safe-sector samples never enter the centre, headline, or profile protected zones.
- Pairwise portrait bounds remain separated across representative samples of both clocks and all
  desktop geometry variants.
- Primary labels remain inside their authored label zones and do not intersect one another.
- Secondary names are hidden until hover/focus.
- Outer selection passes through `promoting` before `exchanging`; primary selection exchanges
  directly.
- Exact-tier slot replacement remains correct.
- Pause/resume retains accumulated clock position.
- Reduced motion disables continuous and pointer-driven transforms.
- Mobile roster pagination wraps correctly and exposes every tutor.

### Rendered checks

Test `/tutors` at 1920×1080, 1440×900, 1366×768, 1024×768, and 390×844. At each viewport:

- inspect portrait, label, centre, headline, profile-card, and viewport-edge bounds;
- confirm no prohibited intersections in the initial state and sampled ambient states;
- verify hover/focus pause, keyboard selection, outer promotion, exact-slot replacement, profile
  stagger, and reduced motion;
- inspect browser console output and horizontal overflow;
- capture updated desktop and mobile screenshots.

If the local capture environment supports animated output without adding a production dependency,
also provide a short GIF or screen recording of entrance, hover pause, and outer selection. Otherwise,
provide the static screenshots and report that motion capture was unavailable.

## Tradeoffs

- Portraits imply orbital travel through safe curved sectors rather than completing unrestricted
  revolutions. This sacrifices literal solar-system motion to guarantee premium spacing.
- Outer names move to hover/focus disclosure, improving clarity at the cost of immediate visual
  identification; accessible button names remain available.
- Tablet shows only six secondary portraits at once, and mobile shows four supporting tutors per
  roster page. The full team remains reachable through navigation and the directory route.
- The system uses authored geometry variants for predictability. Adding or resizing cohorts requires
  updating and re-running geometry tests rather than relying on automatic packing.
