import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const featureSource = readFileSync(new URL('./MathsAmbientMotion.tsx', import.meta.url), 'utf8');
const featureCss = readFileSync(new URL('./maths-ambient-motion.css', import.meta.url), 'utf8');
const heroSource = readFileSync(new URL('../../components/subjects/SubjectHero.tsx', import.meta.url), 'utf8');
const mathsSource = readFileSync(new URL('../../pages/subjects/Mathematics.tsx', import.meta.url), 'utf8');
const mathematicsComponent = mathsSource.slice(mathsSource.indexOf('const Mathematics = () => {'));
const guidedJourneyPanelSource = readFileSync(new URL('../graph-lab/GuidedJourneyPanel.tsx', import.meta.url), 'utf8');
const teachingProofSource = readFileSync(new URL('../maths-teaching-proof/MathsTeachingProof.tsx', import.meta.url), 'utf8');

test('exports only the three approved ambient concepts', () => {
  for (const component of ['NetworkAmbientMoment', 'DerivativeAmbientMoment', 'VectorAmbientMoment']) {
    assert.match(featureSource, new RegExp(`export const ${component}`));
  }
  for (const removed of ['SineMotionStage', 'IntegralMotionStage', 'MathsMotionStage']) {
    assert.doesNotMatch(featureSource, new RegExp(`export const ${removed}`));
  }
});

test('ambient interaction uses deliberate progressive disclosure on ordinary desktop widths', () => {
  assert.match(featureSource, /const AmbientMathsMoment/);
  assert.match(featureSource, /aria-expanded=/);
  assert.match(featureSource, /setTimeout\([\s\S]*220/);
  assert.match(featureSource, /event\.key === 'Escape'/);
  assert.match(featureSource, /maths-ambient-moment__card/);
  assert.doesNotMatch(featureSource, /maths-ambient-moment__wash/);
  assert.doesNotMatch(featureSource, /maths-ambient-moment__close/);
  assert.doesNotMatch(featureSource, /closeRef/);
  assert.match(featureSource, /closest\('\.maths-ambient-moment__card'\)/);
  assert.match(featureSource, /onClickCapture=\{\(event\)/);
  assert.doesNotMatch(featureSource, /<motion\.div\s*\n\s*layout/);
  assert.doesNotMatch(featureSource, /onPointerDown=\{close\}/);
  assert.doesNotMatch(featureSource, /onMouseDown=\{close\}/);
  assert.match(featureCss, /@media \(min-width: 1440px\)/);
  assert.doesNotMatch(featureCss, /@media \(min-width: 1680px\)/);
  assert.match(featureCss, /scale\(1\.07\)/);
  assert.match(featureCss, /\.maths-ambient-moment\.is-expanded\s*\{[\s\S]*inset:\s*0/);
  assert.match(featureCss, /\.maths-ambient-moment\.is-expanded\s*\{[\s\S]*z-index:\s*122/);
  assert.match(featureCss, /\.maths-ambient-moment\.is-expanded\s*\{[\s\S]*transform:\s*none/);
  assert.match(featureCss, /background:\s*rgba\(255, 250, 240, 0\.94\)/);
  assert.match(featureCss, /body:has\(\.maths-ambient-moment\.is-expanded\)[\s\S]*\.site-scroll-to-top/);
  assert.match(featureCss, /body:has\(\.maths-ambient-moment\.is-expanded\)[\s\S]*\.site-sticky-book-button/);
  assert.doesNotMatch(featureCss, /background:\s*#071629/);
});

test('approved ink and champagne palette replaces cobalt blue and strengthens the ambient marks', () => {
  assert.doesNotMatch(featureSource, /#2563eb/i);
  assert.doesNotMatch(featureCss, /#2563eb/i);
  assert.match(featureCss, /--maths-ambient-ink:\s*#071629/);
  assert.match(featureCss, /--maths-ambient-gold:\s*#f0c86a/);
  assert.match(featureCss, /\.maths-network-ambient__base line\s*\{[\s\S]*stroke-width:\s*1\.45/);
  assert.match(featureCss, /drop-shadow/);
});

test('compact moments are muted invitations that brighten on deliberate hover', () => {
  assert.match(featureCss, /--maths-ambient-idle-ink:/);
  assert.match(featureCss, /\.maths-ambient-moment\s*\{[\s\S]*opacity:\s*0\.8[24]/);
  assert.match(featureCss, /\.maths-ambient-moment\s*\{[\s\S]*filter:\s*saturate\(0\.[67]/);
  assert.match(featureCss, /\.maths-ambient-moment\.is-hover-ready\s*\{[\s\S]*opacity:\s*1/);
  assert.match(featureCss, /\.maths-ambient-moment\.is-hover-ready\s*\{[\s\S]*saturate\(1\.[01]/);
  assert.match(featureSource, /fffbe[0-9a-f]/i);
});

test('expanded lessons use more of the viewport and keep long equations contained', () => {
  assert.match(featureCss, /width:\s*min\(72rem,\s*calc\(100vw - 3rem\)\)/);
  assert.doesNotMatch(featureCss, /\.maths-ambient-moment\.is-expanded \.maths-ambient-equation\s*\{/);
  assert.match(featureCss, /\.maths-ambient-moment\.is-expanded \.maths-ambient-moment__explanation > \.maths-ambient-equation\s*\{[\s\S]*font-size:\s*clamp\(/);
  assert.match(featureCss, /\.maths-ambient-moment\.is-expanded \.maths-ambient-moment__scene svg\s*\{[\s\S]*max-height:\s*22rem/);
});

test('expanded explanations link each formula to visible mathematical steps', () => {
  assert.match(featureSource, /maths-ambient-derivation/);
  assert.match(featureSource, /maths-ambient-derivation__step/);
  assert.doesNotMatch(featureSource, /d\(v\)|d\(u\)\+w_\{uv\}|relaxation/i);
  assert.match(featureSource, /weighted edges/i);
  assert.match(featureSource, /3\+4\+2\+3=12/);
  assert.match(featureSource, /shortest path has the smallest total weight/i);
  assert.match(featureSource, /f'\(x\)/);
  assert.match(featureSource, /gradient function/i);
  assert.match(featureSource, /\\operatorname\{proj\}/);
  assert.equal((featureSource.match(/<InlineMath/g) ?? []).length >= 7, true);
});

test('vector diagram labels both vectors without displaying curriculum metadata', () => {
  assert.match(featureSource, /maths-vector-ambient__label--a[^>]*>a<\/text>/);
  assert.match(featureSource, /maths-vector-ambient__label--b[^>]*>b<\/text>/);
  assert.match(featureSource, /scalar \(dot\) product/i);
  assert.doesNotMatch(featureSource, /New Extension 1 syllabus|first HSC 2027|contextNote/);
});

test('each mathematical scene exposes its derivation rather than decorative motion', () => {
  assert.match(featureSource, /maths-network-ambient__frontier/);
  assert.match(featureSource, /maths-network-ambient__final-path/);
  assert.match(featureSource, /clipPath id="derivative-reveal-clip"/);
  assert.match(featureSource, /progress\.get\(\)/);
  assert.match(featureSource, /maths-vector-ambient__perpendicular/);
  assert.match(featureSource, /maths-vector-ambient__projection/);
});

test('normal Mathematics route opens straight into the cube without an ambient transition', () => {
  assert.doesNotMatch(heroSource, /visualOverlay/);
  assert.doesNotMatch(mathematicsComponent, /isMathsAmbientPreview|motionPreview/);
  assert.equal((mathematicsComponent.match(/<NetworkAmbientMoment\s+passive\s*\/>/g) ?? []).length, 0);
  assert.equal((mathematicsComponent.match(/<DerivativeAmbientMoment\s+passive\s*\/>/g) ?? []).length, 1);
  assert.equal((mathematicsComponent.match(/<VectorAmbientMoment\s+passive\s*\/>/g) ?? []).length, 0);
  assert.ok(mathematicsComponent.indexOf('<YearCube />') > mathematicsComponent.indexOf('aria-label="Mathematics page sections"'));
  assert.ok(mathematicsComponent.indexOf('<DerivativeAmbientMoment passive />') > mathematicsComponent.indexOf('<MathsGraphLabInvitation />'));
  assert.doesNotMatch(mathematicsComponent, /<(Sine|Integral)MotionStage\s*\/>/);
  assert.match(featureSource, /side="right"[\s\S]*side="left"[\s\S]*side="right"/);
});

test('live Mathematics page omits the retired Fourier enrichment and keeps the teaching proof', () => {
  assert.match(mathsSource, /const SHOW_LEGACY_MATHS_INTERACTIONS = false/);
  assert.equal((mathematicsComponent.match(/<FourierDrawing\s*\/>/g) ?? []).length, 0);
  assert.doesNotMatch(mathematicsComponent, /How can simple rotations draw a picture\?|id="fourier-drawing"/);
  assert.doesNotMatch(guidedJourneyPanelSource, /\/subjects\/mathematics#fourier-drawing|optional Fourier enrichment/i);
  assert.doesNotMatch(mathsSource, /Now take the picture apart|href="#fourier-waves"/);
  assert.match(mathematicsComponent, /SHOW_LEGACY_MATHS_INTERACTIONS \? <BasketballCalculusJourney \/> : null/);
  assert.match(mathematicsComponent, /SHOW_LEGACY_MATHS_INTERACTIONS \? <FourierDecomposition \/> : null/);
  assert.match(mathematicsComponent, /\{SHOW_LEGACY_MATHS_INTERACTIONS \? \([\s\S]*id="math-method"[\s\S]*id="maths-interactive"[\s\S]*\) : null\}/);
  assert.match(mathematicsComponent, /<MathsTeachingProof\s*\/>/);
  assert.match(mathematicsComponent, /<MathsGraphLabInvitation\s*\/>/);
  assert.match(mathematicsComponent, /\{ label: 'How progress is built', href: '#math-teaching-proof' \}/);
  assert.match(mathematicsComponent, /\{ label: 'Optional exploration', href: '\/maths-graph-lab', opensPage: true \}/);
});

test('below the safe floating threshold, moments render in document flow instead of floating over content', () => {
  // This page's widest sections run at max-w-[1480px] and only gain their own centred
  // margin above ~1540px viewport width; a floating side element below that has no real
  // gutter to sit in. The 768-1439.98px band must render in-flow (position: static) so it
  // cannot overlap content by construction, and only the 1440px+ tier may float.
  assert.match(featureCss, /@media \(min-width: 768px\) and \(max-width: 1439\.98px\)[\s\S]*position:\s*static/);
  assert.doesNotMatch(featureCss, /@media \(min-width: 1180px\)/);
  const floatingTier = featureCss.slice(featureCss.indexOf('@media (min-width: 1440px)'));
  assert.match(floatingTier, /display:\s*block/);
  assert.match(featureCss, /maths-ambient-moment__caption\s*\{\s*display:\s*none/);
  assert.match(featureCss, /max-width:\s*1439\.98px\)[\s\S]*maths-ambient-moment__caption\s*\{\s*display:\s*block/);
  assert.match(featureSource, /maths-ambient-moment__caption/);
});

test('passive ambient mode is decorative and cannot open focused lessons', () => {
  assert.match(featureSource, /passive\?: boolean/);
  assert.match(featureSource, /if \(passive\)/);
  assert.match(featureSource, /aria-hidden="true"/);
  assert.match(featureSource, /is-passive/);
  assert.match(featureCss, /\.maths-ambient-moment\.is-passive\s*\{[\s\S]*pointer-events:\s*none/);
});

test('the network constellation lives within the teaching-progress section rather than between page sections', () => {
  assert.doesNotMatch(mathematicsComponent, /<NetworkAmbientMoment\s+passive\s*\/>/);
  assert.match(teachingProofSource, /import \{ NetworkAmbientMoment \} from '@\/features\/maths-ambient-motion\/MathsAmbientMotion'/);
  assert.match(teachingProofSource, /id="math-teaching-proof"[\s\S]*<NetworkAmbientMoment passive \/>/);
});

test('the teaching sequence traces one calm connection before resting', () => {
  const teachingProofSource = readFileSync(new URL('../maths-teaching-proof/MathsTeachingProof.tsx', import.meta.url), 'utf8');
  assert.match(teachingProofSource, /maths-teaching-sequence/);
  assert.match(teachingProofSource, /maths-teaching-sequence-trace/);
  assert.match(teachingProofSource, /maths-teaching-proof-motion\.css/);
});
