import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const component = readFileSync(new URL('./TutorOrbitHero.tsx', import.meta.url), 'utf8');
const stage = readFileSync(new URL('./TutorOrbitStage.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('./tutor-orbit.css', import.meta.url), 'utf8');
const page = readFileSync(new URL('../../pages/Tutors.tsx', import.meta.url), 'utf8');

test('keeps the existing editorial hero and non-marketplace routes', () => {
  assert.match(component, /Meet the educators[\s\S]*students[\s\S]*remember\./);
  assert.match(component, /Great teaching is more than knowledge/);
  assert.match(component, /Explore the whole team/);
  assert.match(component, /\/find-teacher\?tutor=\$\{active\.id\}/);
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
  assert.match(stage, /elapsedMs\.current \+= time - lastFrameAt\.current/);
  assert.doesNotMatch(css, /rotate\([^)]*turn/);
});

test('uses shared-layout motion, promotion, and marker layers for selections', () => {
  assert.match(component, /swapFacultyTutor\(activeId, innerIds, outerIds, selectedId\)/);
  assert.match(stage, /layoutId=\{`tutor-\$\{active\.id\}`\}/);
  assert.match(stage, /layoutId=\{`tutor-\$\{tutor\.id\}`\}/);
  assert.match(stage, /duration: reduced \? 0 : 0\.9/);
  assert.match(stage, /tutor-orbit__promotion-portrait/);
  assert.match(stage, /phase === 'promoting'/);
  assert.match(stage, /tutor-orbit__marker/);
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

test('limits mobile portraits to their authored safe-sector maps', () => {
  assert.match(stage, /innerTutors\.slice\(0, SAFE_SECTORS\[band\]\.inner\.length\)/);
  assert.match(stage, /outerTutors\.slice\(0, SAFE_SECTORS\[band\]\.outer\.length\)/);
});

test('keeps the selected tutor panel concise and data driven', () => {
  assert.match(component, /active\.designation/);
  assert.match(component, /active\.tagline/);
  assert.match(component, /active\.profile\?\.tags/);
  assert.match(component, /Subjects/);
  assert.match(component, /Year levels/);
  assert.match(component, /Teaching style/);
  assert.match(component, /Strengths/);
  assert.match(component, /Open full profile/);
});
