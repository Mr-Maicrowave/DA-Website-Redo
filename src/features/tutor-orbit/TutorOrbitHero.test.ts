import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const component = readFileSync(new URL('./TutorOrbitHero.tsx', import.meta.url), 'utf8');
const stage = readFileSync(new URL('./TutorOrbitStage.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('./tutor-orbit.css', import.meta.url), 'utf8');
const page = readFileSync(new URL('../../pages/Tutors.tsx', import.meta.url), 'utf8');
const profileUrl = new URL('./TutorOrbitProfile.tsx', import.meta.url);
const profile = existsSync(profileUrl) ? readFileSync(profileUrl, 'utf8') : '';
const navigatorUrl = new URL('./TutorOrbitMobileNavigator.tsx', import.meta.url);
const navigator = existsSync(navigatorUrl) ? readFileSync(navigatorUrl, 'utf8') : '';
const procession = readFileSync(new URL('./TutorProcessionStage.tsx', import.meta.url), 'utf8');
const processionCss = readFileSync(new URL('./tutor-procession.css', import.meta.url), 'utf8');
const geometry = readFileSync(new URL('./procession-geometry.ts', import.meta.url), 'utf8');

test('keeps the existing editorial hero and non-marketplace routes', () => {
  assert.match(component, /Meet the educators[\s\S]*students[\s\S]*remember\./);
  assert.match(component, /Great teaching is more than knowledge/);
  assert.match(component, /Explore the whole team/);
  assert.match(profile, /\/find-teacher\?tutor=\$\{tutor\.id\}/);
  assert.doesNotMatch(component, /Book this tutor|Check availability|matching questionnaire/i);
  assert.doesNotMatch(page, /tutor-match-proof-heading|Book a Consultation/);
});

test('mounts one featured educator and a single ring of stations from real catalogue ids', () => {
  assert.match(component, /import \{ TutorProcessionStage \} from '\.\/TutorProcessionStage'/);
  assert.match(component, /<TutorProcessionStage/);
  assert.match(component, /roster=\{roster\}/);
  assert.match(component, /FACULTY_ROSTER_IDS/);
  assert.match(procession, /className="tp__station"/);
  assert.match(procession, /Array\.from\(\{ length: ring\.stations \}/);
  assert.doesNotMatch(component, /INNER_ORBIT_TUTOR_IDS|OUTER_ORBIT_TUTOR_IDS/);
});

test('renders the faculty stage from safe sectors with shared clocks and pointer response', () => {
  assert.match(stage, /SAFE_SECTORS\[band\]/);
  assert.match(stage, /poseForSector\(sector, progress\)/);
  assert.match(stage, /useMotionValue/);
  assert.match(stage, /useSpring/);
  assert.match(stage, /onPointerMove/);
  assert.match(stage, /parallaxLimitsForBand\(band\)/);
  assert.match(stage, /document\.hidden/);
  assert.match(stage, /visibilitychange/);
  assert.match(stage, /elapsedMs\.current \+= time - lastFrameAt\.current/);
  assert.doesNotMatch(css, /rotate\([^)]*turn/);
});

test('derives position, depth, sort order and labels from one angle per educator', () => {
  assert.match(procession, /const pose = poseAt\(base \+ rotationDeg, geometry\)/);
  assert.match(procession, /el\.style\.zIndex = String\(pose\.z\)/);
  assert.match(procession, /label\.style\.opacity = pose\.labelOpacity/);
  assert.match(geometry, /const depth = \(Math\.sin\(radians\) \+ 1\) \/ 2/);
  assert.match(geometry, /z: Math\.round\(depth \* 1000\)/);
  assert.match(geometry, /export const FEATURED_Z = 500/);
  assert.match(geometry, /blurCeiling/);
  assert.doesNotMatch(procession, /tutor-orbit__promotion-portrait|isPromotedSource/);
});

test('renders two directional promotion-corridor segments from the authored origin, waypoint, and centre', () => {
  assert.match(stage, /function promotionCorridorStyle\(\s*from:[\s\S]*?to:[\s\S]*?CSSProperties/);
  assert.match(stage, /const deltaX = to\.x - from\.x/);
  assert.match(stage, /const deltaY = to\.y - from\.y/);
  assert.match(stage, /width:\s*Math\.hypot\(deltaX, deltaY\)/);
  assert.match(stage, /transform:\s*`rotate\(\$\{Math\.atan2\(deltaY, deltaX\)\}rad\)`/);
  assert.match(stage, /promotionCorridorStyle\(promotionJourney\.origin, promotionJourney\.waypoint\)/);
  assert.match(stage, /promotionCorridorStyle\(promotionJourney\.waypoint, \{ x: 0, y: 0 \}\)/);
  assert.equal((stage.match(/className="tutor-orbit__promotion-corridor-segment/g) ?? []).length, 2);
  assert.match(stage, /phase !== 'idle' && promotionJourney[\s\S]*?tutor-orbit__promotion-corridor[\s\S]*?originToWaypoint[\s\S]*?waypointToCentre/);
  assert.match(css, /\.tutor-orbit__promotion-corridor\s*\{[\s\S]*?z-index:\s*6[\s\S]*?pointer-events:\s*none/);
  assert.match(css, /\.tutor-orbit__promotion-corridor-segment\s*\{[\s\S]*?height:\s*(?:1|1\.5|2)px[\s\S]*?linear-gradient[\s\S]*?transform-origin:\s*left center/);
});

test('pauses ambient motion for hover, focus, transition, and reduced motion', () => {
  assert.match(stage, /const paused = holdKeys\.size > 0 \|\| phase !== 'idle'/);
  assert.match(stage, /setMotionHold\(`hover:\$\{tutor\.id\}`/);
  assert.match(stage, /setMotionHold\(`focus:\$\{tutor\.id\}`/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test('makes the featured centre a named profile link that participates in exact holds and keyboard focus handoff', () => {
  assert.match(stage, /className="tutor-orbit__featured-action"/);
  assert.match(stage, /to=\{`\/find-teacher\?tutor=\$\{active\.id\}`\}/);
  assert.match(stage, /aria-label=\{`Open \$\{active\.name\}'s full profile`\}/);
  assert.match(stage, /setMotionHold\(`hover:\$\{active\.id\}`/);
  assert.match(stage, /setMotionHold\(`focus:\$\{active\.id\}`/);
  assert.match(component, /pendingCentreFocusId/);
  assert.match(component, /featuredActionRef\.current\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(stage, /featuredActionRef/);
});

test('freezes every shared parallax layer and featured float for portrait holds', () => {
  assert.match(stage, /if \(!paused\) return;/);
  assert.match(stage, /fieldX\.jump\(0\)/);
  assert.match(stage, /fieldY\.jump\(0\)/);
  assert.match(stage, /haloX\.jump\(0\)/);
  assert.match(stage, /haloY\.jump\(0\)/);
  assert.match(stage, /geometryX\.jump\(0\)/);
  assert.match(stage, /geometryY\.jump\(0\)/);
  assert.match(stage, /parallax\.field === 0 \|\| paused/);
  assert.match(css, /\.tutor-orbit__stage\.is-paused \.tutor-orbit__featured-float[\s\S]*animation-play-state:\s*paused/);
});

test('simplifies the outer tier on tablet and mobile while preserving interaction', () => {
  assert.match(css, /@media \(max-width: 1199px\)[\s\S]*tutor-orbit__outer-slot:nth-child\(n\+7\)/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*tutor-orbit__inner-orbit,[\s\S]*tutor-orbit__outer-orbit[\s\S]*display:\s*none/);
  assert.match(stage, /aria-label=\{`View \$\{tutor\.name\}`\}/);
  assert.match(stage, /Select an educator to learn more/);
  assert.doesNotMatch(css, /tutor-orbit__outer-slot[\s\S]{0,300}opacity:\s*0\.58/);
});

test('maps every responsive band to its authored safe-sector capacity', () => {
  assert.match(stage, /tutorsForGeometryBand\(innerTutors, band, 'inner'\)/);
  assert.match(stage, /tutorsForGeometryBand\(outerTutors, band, 'outer'\)/);
});

test('wires accepted-selection cleanup, clamped pointer input, and the imperative selection lock', () => {
  assert.match(stage, /applySelectionHolds\(tutor\.id, accepted\)/);
  assert.match(stage, /onSelect: \(id: string, options\?: \{ focusCentre\?: boolean \}\) => boolean/);
  assert.match(stage, /normalizeStagePointer\(event\.clientX, rect\.left, rect\.width\)/);
  assert.match(component, /canBeginSelection\(selectionLock\.current\)/);
  assert.match(component, /transitionSelectionLock\(selectionLock\.current, 'select'\)/);
  assert.match(component, /transitionSelectionLock\(selectionLock\.current, 'idle'\)/);
});

test('locks, times out and clears a centre exchange', () => {
  assert.match(component, /if \(!canBeginSelection\(selectionLock\.current\)\) return false;/);
  assert.match(component, /timers\.current\.forEach\(\(timer\) => window\.clearTimeout\(timer\)\)/);
  assert.match(component, /setExchanging\(true\)/);
  assert.match(component, /setActiveId\(selectedId\)/);
  assert.match(component, /transitionSelectionLock\(selectionLock\.current, 'idle'\)/);
  assert.match(procession, /holds\.current\.size > 0 \|\| exchanging \? 0 : 1/);
  assert.doesNotMatch(component, /selectionSequenceFor|swapFacultyTutor/);
});

test('carries the featured name on the portrait instead of a profile card', () => {
  assert.match(procession, /className="tp__plate"/);
  assert.match(procession, /className="tp__plate-name">\{active\.name\}/);
  assert.match(procession, /className="tp__plate-designation">\{active\.designation\}/);
  assert.match(processionCss, /\.tp__plate::before/);
  assert.match(processionCss, /\.tp__occluder/);
  assert.match(processionCss, /mask-image: radial-gradient/);
  assert.doesNotMatch(component, /TutorOrbitProfile/);
});

test('rebalances stage tutors and paths only within safe transition bounds', () => {
  assert.match(stage, /phase === 'promoting'/);
  assert.match(stage, /selectedId !== tutor\.id/);
  assert.match(stage, /-4/);
  assert.match(stage, /phase === 'exchanging'/);
  assert.match(stage, /\? 3 : 0/);
  assert.match(stage, /value \* 0\.[0-9]/);
});

test('keeps the profile sequence responsive without inline grid overrides', () => {
  assert.doesNotMatch(profile, /style=\{\{\s*display:\s*'grid'/);
  assert.match(css, /\.tutor-orbit__profile\s*\{[\s\S]*?grid-template-rows:\s*minmax\(0, 1fr\)/);
  assert.match(css, /\.tutor-orbit__profile-sequence\s*\{[\s\S]*?display:\s*grid/);
  assert.match(css, /\.tutor-orbit__profile-cta\s*\{[\s\S]*?grid-row:\s*7/);
});

test('keeps each selected profile item in the keyed stagger from tier through CTA', () => {
  const keyedSequence = profile.slice(profile.indexOf('key={tutor.id}'), profile.indexOf('</AnimatePresence>'));
  const orderedClasses = [
    'tutor-orbit__profile-heading',
    'tutor-orbit__profile-name',
    'tutor-orbit__designation',
    'tutor-orbit__profile-details',
    'tutor-orbit__profile-teaching',
    'tutor-orbit__strengths',
    'tutor-orbit__profile-cta',
  ];
  const orderedIndexes = orderedClasses.map((className) => keyedSequence.indexOf(className));

  assert.ok(orderedIndexes.every((index) => index !== -1));
  assert.ok(orderedIndexes.every((index, position) => position === 0 || index > orderedIndexes[position - 1]));
  assert.equal((keyedSequence.match(/variants=\{reduced \? undefined : itemVariants\}/g) ?? []).length, 7);
  assert.match(keyedSequence, /tutor-orbit__profile-cta[\s\S]*Open full profile/);
});

test('reaches every educator through the rear handover and a reduced-motion advance control', () => {
  assert.match(geometry, /export function handoverStride/);
  assert.match(geometry, /export function occupantIndex/);
  assert.match(procession, /occupantIndex\(i, geometry\.stations, base, rotationDeg, poolSizeRef\.current\)/);
  assert.match(procession, /className="tp__advance"/);
  assert.match(procession, /aria-label="Show the next educators"/);
  assert.match(procession, /aria-label=\{`Feature \$\{tutor\.name\}, \$\{tutor\.designation\}`\}/);
  assert.doesNotMatch(component, /TutorOrbitMobileNavigator|rosterWindow/);
});

test('keeps the full roster and rescales the ring for every band', () => {
  assert.match(component, /FACULTY_ROSTER_IDS/);
  assert.match(procession, /roster\.filter\(\(tutor\) => tutor\.id !== active\.id\)/);
  assert.match(procession, /ringGeometryFor\(band, box\.width \? box : \{ width: 1080, height: 720 \}\)/);
  assert.match(procession, /new ResizeObserver\(measure\)/);
  assert.match(geometry, /wide:|desktop:|tablet:|mobile:/);
  assert.match(geometry, /stations: 3/);
  assert.match(procession, /reduced \? RESTING_ROTATION : 0/);
});

test('keeps one outer promotion layer mounted through exchanging and keyframes origin waypoint centre', () => {
  assert.match(stage, /phase !== 'idle' && promotionJourney/);
  assert.match(stage, /x:\s*\[promotionJourney\.origin\.x, promotionJourney\.waypoint\.x, 0\]/);
  assert.match(stage, /y:\s*\[promotionJourney\.origin\.y, promotionJourney\.waypoint\.y, 0\]/);
  assert.match(stage, /times:\s*\[0,\s*0\.28[0-9],\s*1\]/);
  assert.match(stage, /duration:\s*0\.84/);
});

test('uses the tablet and mobile topology without hiding profile layout boxes', () => {
  assert.match(css, /@media \(max-width: 1199px\)[\s\S]*grid-template-columns:\s*minmax\(250px,\s*\.72fr\)\s*minmax\(0,\s*1\.28fr\)/);
  assert.match(css, /@media \(max-width: 1199px\)[\s\S]*tutor-orbit__outer-slot:nth-child\(n\s*\+\s*7\)[\s\S]*display:\s*none/);
  assert.match(css, /@media \(max-width: 1199px\)[\s\S]*tutor-orbit__mobile-navigator[\s\S]*display:\s*grid/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*tutor-orbit__inner-orbit,[\s\S]*tutor-orbit__outer-orbit[\s\S]*display:\s*none/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*tutor-orbit__mobile-navigator[\s\S]*display:\s*grid/);
  assert.doesNotMatch(css, /display:\s*contents/);
});

test('keeps short reduced-motion navigator and selection transitions', () => {
  assert.match(navigator, /duration:\s*reduced\s*\?\s*0\.12\s*:\s*0\.16/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*tutor-orbit__marker[\s\S]*animation:\s*none !important/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*tutor-orbit__stage[\s\S]*transform:\s*none !important/);
});

test('wires the stable full-faculty navigator and hardened pointer controls', () => {
  assert.match(component, /FACULTY_ROSTER_IDS/);
  const pointerDown = navigator.slice(navigator.indexOf('onPointerDown'), navigator.indexOf('onPointerMove'));
  assert.doesNotMatch(pointerDown, /setPointerCapture/);
  assert.match(navigator, /onPointerMove=\{trackSwipe\}/);
  assert.match(navigator, /setPointerCapture\(event\.pointerId\)/);
  assert.match(navigator, /onClickCapture/);
  assert.match(navigator, /event\.detail === 0/);
  assert.match(navigator, /onLostPointerCapture/);
  assert.match(navigator, /consumeNavigatorClickSuppression/);
  assert.match(css, /touch-action:\s*pan-y/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*tutor-orbit__marker[\s\S]*display:\s*none/);
});

test('keeps short visible reduced-motion profile and centre selection transitions', () => {
  assert.match(stage, /layout: \{ duration: reduced \? 0 : 0\.8/);
  assert.match(stage, /opacity: \{ duration: reduced \? 0\.15 : 0\.8/);
  assert.match(stage, /opacity: \[1, 0\.78, 1\], scale: \[1, 0\.985, 1\]/);
  assert.match(profile, /reducedShellVariants/);
  assert.match(profile, /changing: \{ y: 0 \}/);
  assert.match(profile, /duration: reduced \? 0\.15 : 0\.2/);
  assert.match(profile, /reducedContentVariants/);
});

test('uses semantic tokens for the safe stage, portrait hierarchy, spacing, and card exclusion', () => {
  assert.match(css, /--orbit-centre-size:\s*clamp\(300px,\s*23vw,\s*360px\)/);
  assert.match(css, /--orbit-primary-size:\s*clamp\(68px,\s*5vw,\s*82px\)/);
  assert.match(css, /--orbit-secondary-size:\s*clamp\(40px,\s*3vw,\s*50px\)/);
  assert.match(css, /--orbit-safe-stage-width:\s*min\(100%,\s*720px\)/);
  assert.match(css, /--orbit-safe-stage-height:\s*640px/);
  assert.match(css, /--orbit-gap-tight:\s*8px/);
  assert.match(css, /--orbit-gap-standard:\s*16px/);
  assert.match(css, /--orbit-gap-generous:\s*32px/);
  assert.match(css, /--orbit-card-exclusion:\s*92px/);
  assert.match(css, /\.tutor-orbit__stage\s*\{[\s\S]*?width:\s*var\(--orbit-safe-stage-width\)[\s\S]*?min-height:\s*var\(--orbit-safe-stage-height\)/);
  assert.match(css, /\.tutor-orbit__featured\s*\{[\s\S]*?width:\s*var\(--orbit-centre-size\)/);
  assert.match(css, /\.tutor-orbit__satellite--inner\s*\{[\s\S]*?width:\s*var\(--orbit-primary-size\)/);
  assert.match(css, /\.tutor-orbit__satellite--outer\s*\{[\s\S]*?width:\s*var\(--orbit-secondary-size\)/);
  assert.match(css, /\.tutor-orbit__navigator-heading\s*\{[\s\S]*?gap:\s*var\(--orbit-gap-standard\)/);
});

test('keeps primary names readable and discloses secondary names only on hover or focus', () => {
  assert.match(css, /\.tutor-orbit__inner-slot \.tutor-orbit__satellite-name\s*\{[\s\S]*?opacity:\s*1/);
  assert.match(css, /\.tutor-orbit__outer-slot \.tutor-orbit__satellite-name\s*\{[\s\S]*?opacity:\s*0[\s\S]*?transform:\s*translateY\(4px\)[\s\S]*?pointer-events:\s*none/);
  assert.match(css, /\.tutor-orbit__outer-slot:hover \.tutor-orbit__satellite-name,\s*\.tutor-orbit__outer-slot:focus-within \.tutor-orbit__satellite-name\s*\{[\s\S]*?opacity:\s*1[\s\S]*?transform:\s*translateY\(0\)/);

  const outerNameRule = css.match(/\.tutor-orbit__outer-slot \.tutor-orbit__satellite-name\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.doesNotMatch(outerNameRule, /opacity:\s*(?!0(?:\D|$))\d/);
});

test('styles promotion and exchange as restrained hierarchy states with marker-only profile masking', () => {
  assert.match(css, /\.tutor-orbit__stage\.is-promoting,\s*\.tutor-orbit__stage:has\(\.tutor-orbit__promotion-portrait\)/);
  assert.match(css, /\.tutor-orbit__stage\.is-exchanging,\s*\.tutor-orbit__stage\.is-transitioning:not\(:has\(\.tutor-orbit__promotion-portrait\)\)/);
  assert.match(css, /\.tutor-orbit__stage::before\s*\{[\s\S]*?opacity:\s*var\(--orbit-field-response\)[\s\S]*?transition:\s*opacity/);
  assert.match(css, /\.tutor-orbit__stage\.is-transitioning \.tutor-orbit__satellite:not\(:hover\):not\(:focus\)\s*\{[\s\S]*?brightness\(\.88\)/);
  assert.match(css, /\.tutor-orbit__stage\.is-transitioning \.tutor-orbit__satellite:hover,[\s\S]*?\.tutor-orbit__satellite:focus\s*\{[\s\S]*?brightness\(1\.1\)/);
  assert.match(css, /\.tutor-orbit__promotion-portrait\s*\{[\s\S]*?z-index:\s*8[\s\S]*?drop-shadow\(0 0 18px rgba\(214,\s*160,\s*68,\s*\.42\)\)/);
  assert.match(css, /\.tutor-orbit__stage::after\s*\{[\s\S]*?width:\s*var\(--orbit-card-exclusion\)[\s\S]*?z-index:\s*2[\s\S]*?mask-image:[\s\S]*?pointer-events:\s*none/);
  assert.match(css, /\.tutor-orbit__outer-orbit\s*\{[\s\S]*?z-index:\s*3/);
  assert.match(css, /\.tutor-orbit__satellite--outer\s*\{[\s\S]*?opacity:\s*0\.78/);
  assert.match(profile, /changing:\s*\{\s*y:\s*-6\s*\}/);
});

test('keeps the profile wedge desktop-only and scopes profile transform promotion to transitions', () => {
  assert.match(css, /@media \(max-width: 1199px\)[\s\S]*?\.tutor-orbit__stage::after\s*\{[\s\S]*?display:\s*none/);

  const baseProfileRule = css.match(/\.tutor-orbit__profile\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.doesNotMatch(baseProfileRule, /will-change:\s*transform/);
  assert.match(css, /\.tutor-orbit:has\(\.tutor-orbit__stage\.is-transitioning\) \.tutor-orbit__profile\s*\{[\s\S]*?will-change:\s*transform/);
});

test('keeps centre motion bounded and disables every continuous visual motion layer when requested', () => {
  assert.match(css, /@keyframes tutor-orbit-centre-float\s*\{[\s\S]*?translateY\(-2px\)[\s\S]*?translateY\(3px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.tutor-orbit__featured-float,[\s\S]*?\.tutor-orbit__portrait-field,[\s\S]*?\.tutor-orbit__halo,[\s\S]*?\.tutor-orbit__geometry,[\s\S]*?\.tutor-orbit__marker[\s\S]*?animation:\s*none !important/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.tutor-orbit__portrait-field,[\s\S]*?\.tutor-orbit__halo,[\s\S]*?\.tutor-orbit__geometry[\s\S]*?transform:\s*none !important/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.tutor-orbit__promotion-corridor[\s\S]*?display:\s*none/);
  assert.doesNotMatch(css, /transition:\s*all(?:\s|;)/);

  const portraitRules = [...css.matchAll(/\.tutor-orbit__(?:featured|satellite)[^{]*\{([^}]*)\}/g)]
    .map((match) => match[1])
    .join('\n');
  assert.doesNotMatch(portraitRules, /blur\((?:[2-9]|\d{2,})(?:\.\d+)?px\)/);
});

test('gives responsive navigator controls a minimum 44px pointer target', () => {
  assert.match(css, /\.tutor-orbit__navigator-controls button\s*\{[\s\S]*?width:\s*44px[\s\S]*?height:\s*44px/);
});
