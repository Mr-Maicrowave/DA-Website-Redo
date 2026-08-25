import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const component = readFileSync(new URL('./TutorOrbitHero.tsx', import.meta.url), 'utf8');
const stage = readFileSync(new URL('./TutorOrbitStage.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('./tutor-orbit.css', import.meta.url), 'utf8');
const page = readFileSync(new URL('../../pages/Tutors.tsx', import.meta.url), 'utf8');
const profileUrl = new URL('./TutorOrbitProfile.tsx', import.meta.url);
const profile = existsSync(profileUrl) ? readFileSync(profileUrl, 'utf8') : '';

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
  assert.match(stage, /Math\.abs\([^)]*\) \* 5/);
  assert.match(stage, /document\.hidden/);
  assert.match(stage, /visibilitychange/);
  assert.match(stage, /elapsedMs\.current \+= time - lastFrameAt\.current/);
  assert.doesNotMatch(css, /rotate\([^)]*turn/);
});

test('uses shared-layout motion, promotion, and marker layers for selections', () => {
  assert.match(component, /swapFacultyTutor\(activeId, innerIds, outerIds, selectedId\)/);
  assert.match(stage, /layoutId=\{`tutor-\$\{active\.id\}`\}/);
  assert.match(stage, /layoutId=\{`tutor-\$\{tutor\.id\}`\}/);
  assert.match(stage, /duration: reduced \? 0 : 0\.8/);
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
  assert.match(css, /@media \(max-width: 1100px\)[\s\S]*tutor-orbit__outer-slot:nth-child\(n\+7\)/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*tutor-orbit__outer-slot:nth-child\(n\+5\)/);
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
