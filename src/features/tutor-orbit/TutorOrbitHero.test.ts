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

test('keeps the existing editorial hero and non-marketplace routes', () => {
  assert.match(component, /Meet the educators[\s\S]*students[\s\S]*remember\./);
  assert.match(component, /Great teaching is more than knowledge/);
  assert.match(component, /Explore the whole team/);
  assert.match(profile, /\/find-teacher\?tutor=\$\{tutor\.id\}/);
  assert.doesNotMatch(component, /Book this tutor|Check availability|matching questionnaire/i);
  assert.doesNotMatch(page, /tutor-match-proof-heading|Book a Consultation/);
});

test('renders one centre, five inner tutors, and nine outer tutors from real catalogue ids', () => {
  assert.match(component, /useState<string\[]>\(\(\) => \[\.\.\.INNER_ORBIT_TUTOR_IDS\]\)/);
  assert.match(component, /useState<string\[]>\(\(\) => \[\.\.\.OUTER_ORBIT_TUTOR_IDS\]\)/);
  assert.match(component, /<TutorOrbitStage/);
  assert.match(stage, /className="tutor-orbit__inner-orbit"/);
  assert.match(stage, /className="tutor-orbit__outer-orbit"/);
  assert.match(stage, /tier="inner"/);
  assert.match(stage, /tier="outer"/);
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

test('uses shared-layout motion, promotion, and marker layers for selections', () => {
  assert.match(component, /swapFacultyTutor\(activeId, innerIds, outerIds, selectedId\)/);
  assert.match(stage, /layoutId=\{`tutor-\$\{active\.id\}`\}/);
  assert.match(stage, /layoutId=\{`tutor-\$\{tutor\.id\}`\}/);
  assert.match(stage, /layout: \{ duration: reduced \? 0 : 0\.8/);
  assert.match(stage, /tutor-orbit__promotion-portrait/);
  assert.match(stage, /phase === 'promoting'/);
  assert.match(stage, /tutor-orbit__marker/);
  assert.match(stage, /isPromotedSource/);
  assert.match(stage, /zIndex: 7/);
  assert.match(stage, /objectFit: 'cover'/);
});

test('pauses ambient motion for hover, focus, transition, and reduced motion', () => {
  assert.match(stage, /const paused = holdKeys\.size > 0 \|\| phase !== 'idle'/);
  assert.match(stage, /setMotionHold\(`hover:\$\{tutor\.id\}`/);
  assert.match(stage, /setMotionHold\(`focus:\$\{tutor\.id\}`/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
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
  assert.match(stage, /onSelect: \(id: string\) => boolean/);
  assert.match(stage, /normalizeStagePointer\(event\.clientX, rect\.left, rect\.width\)/);
  assert.match(component, /canBeginSelection\(selectionLock\.current\)/);
  assert.match(component, /transitionSelectionLock\(selectionLock\.current, 'select'\)/);
  assert.match(component, /transitionSelectionLock\(selectionLock\.current, 'idle'\)/);
});

test('choreographs each selection through the configured phase sequence and clears timers', () => {
  assert.match(component, /selectionSequenceFor\(originTier, reduced\)/);
  assert.match(component, /const \[selection, setSelection\] = useState<\{ phase: SelectionPhase; selectedId: string \| null; originTier: OrbitTier \| null \}>/);
  assert.match(component, /timers\.current\.forEach\(\(timer\) => window\.clearTimeout\(timer\)\)/);
  assert.match(component, /if \(selection\.phase !== 'idle' \|\| !canBeginSelection\(selectionLock\.current\)\) return false;/);
  assert.match(component, /step\.phase === 'exchanging'/);
  assert.match(component, /swapFacultyTutor\(activeId, innerIds, outerIds, selectedId\)/);
});

test('extracts the polite profile with staggered semantic content and stable CTA order', () => {
  assert.match(component, /import \{ TutorOrbitProfile \} from '\.\/TutorOrbitProfile'/);
  assert.match(component, /<TutorOrbitProfile tutor=\{active\} reduced=\{reduced\} changing=\{selection\.phase !== 'idle'\} \/>/);
  assert.match(profile, /export const shellVariants/);
  assert.match(profile, /export const contentVariants/);
  assert.match(profile, /export const itemVariants/);
  assert.match(profile, /staggerChildren:\s*0\.0[4-7]/);
  assert.match(profile, /changing:\s*\{\s*y:\s*-?[4-6]\s*\}/);
  assert.match(profile, /aria-live="polite"/);
  assert.match(profile, /Senior educator[\s\S]*motion\.h2[\s\S]*designation[\s\S]*tutor-orbit__details[\s\S]*Teaching style[\s\S]*tutor-orbit__strengths[\s\S]*Open full profile/);
  assert.match(css, /\.tutor-orbit__profile-sequence\s*\{[\s\S]*?grid-template-rows/);
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

test('provides every educator through a four-person responsive navigator', () => {
  assert.ok(existsSync(navigatorUrl));
  assert.match(component, /<TutorOrbitMobileNavigator[\s\S]*tutors=\{supportingTutors\}[\s\S]*onSelect=\{selectTutor\}/);
  assert.match(component, /const supportingTutors = useMemo\([\s\S]*supportingTutorIds\(activeId, innerIds, outerIds\)/);
  assert.match(navigator, /rosterWindow\(tutors\.map\(\(tutor\) => tutor\.id\), page, NAVIGATOR_PAGE_SIZE\)/);
  assert.match(navigator, /aria-label="Previous educators"/);
  assert.match(navigator, /aria-label="Next educators"/);
  assert.match(navigator, /navigatorRosterStatus\(tutors\.length, page\)/);
  assert.match(navigator, /trackNavigatorSwipe/);
  assert.match(navigator, /nextRosterPage\(current, result\.direction, tutors\.length, NAVIGATOR_PAGE_SIZE\)/);
  assert.match(navigator, /onSelect\(tutor\.id\)/);
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

test('wires the supporting-only navigator and hardened pointer controls', () => {
  assert.match(component, /supportingTutorIds\(activeId, innerIds, outerIds\)/);
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

test('keeps centre motion bounded and disables every continuous visual motion layer when requested', () => {
  assert.match(css, /@keyframes tutor-orbit-centre-float\s*\{[\s\S]*?translateY\(-2px\)[\s\S]*?translateY\(3px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.tutor-orbit__featured-float,[\s\S]*?\.tutor-orbit__portrait-field,[\s\S]*?\.tutor-orbit__halo,[\s\S]*?\.tutor-orbit__geometry,[\s\S]*?\.tutor-orbit__marker[\s\S]*?animation:\s*none !important/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.tutor-orbit__portrait-field,[\s\S]*?\.tutor-orbit__halo,[\s\S]*?\.tutor-orbit__geometry[\s\S]*?transform:\s*none !important/);
  assert.doesNotMatch(css, /transition:\s*all(?:\s|;)/);

  const portraitRules = [...css.matchAll(/\.tutor-orbit__(?:featured|satellite)[^{]*\{([^}]*)\}/g)]
    .map((match) => match[1])
    .join('\n');
  assert.doesNotMatch(portraitRules, /blur\((?:[2-9]|\d{2,})(?:\.\d+)?px\)/);
});
