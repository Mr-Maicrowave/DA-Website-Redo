import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(
  new URL('./MethodTransition.tsx', import.meta.url),
  'utf8',
);
const styles = readFileSync(
  new URL('./MethodTransition.css', import.meta.url),
  'utf8',
);
const mobileStyles = styles.slice(
  styles.indexOf('@media (max-width: 639px)'),
  styles.indexOf('@media (prefers-reduced-motion: reduce)'),
);

test('uses one reversible pinned master timeline', () => {
  assert.equal((source.match(/gsap\.timeline\(/g) ?? []).length, 1);
  assert.match(source, /scrub:\s*true/);
  assert.match(source, /invalidateOnRefresh:\s*true/);
  assert.match(source, /--method-transition-scroll/);
});

test('preserves the decorative handoff stage and reduced-motion fallback', () => {
  assert.match(source, /cardRef/);
  assert.match(source, /className="hsm-transition__card"/);
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.hsm-transition__center-bloom[\s\S]*display:\s*none/,
  );
});

test('mounts the interactive teaching deck after the pinned runway', () => {
  assert.match(source, /import \{ MethodTeachingDeck \} from ['"]\.\/MethodTeachingDeck['"]/);
  assert.match(source, /const \[deckReady, setDeckReady\] = useState\(false\)/);
  assert.match(source, /className="hsm-transition__runway"[\s\S]*className="hsm-transition__interaction"/);
  assert.match(source, /<MethodTeachingDeck ready=\{deckReady\}\s*\/>/);
  assert.match(styles, /\.hsm-transition__interaction\s*\{/);
});

test('makes deck readiness reversible at the completed companion handoff', () => {
  assert.match(
    source,
    /progress\s*>=\s*METHOD_TRANSITION_TIMING\.companionsEnd/,
  );
  assert.match(source, /setDeckReady\(/);
  assert.match(
    source,
    /conditions\.reduce[\s\S]*setDeckReady\(true\)/,
  );
});

test('keeps the pinned artwork cards decorative', () => {
  assert.equal((source.match(/className="hsm-transition__card"/g) ?? []).length, 1);
  assert.match(source, /className="hsm-transition__card-row"/);
  assert.match(source, /methodItems\.slice\(1\)\.map/);
});

test('measures source and green-card destination for the shared proxy', () => {
  assert.match(source, /data-method-transition-magnifier/);
  assert.match(source, /getBoundingClientRect/);
  assert.match(source, /proxyRef/);
  assert.match(source, /cardRef/);
});

test('normalizes the transformed finale before measuring the source', () => {
  assert.match(source, /measureUntransformedSource/);
  assert.match(source, /finale\.style\.transform\s*=\s*'none'/);
  assert.match(source, /finally\s*\{/);
  assert.match(source, /finale\.style\.transform\s*=\s*inlineTransform/);
});

test('prepares a viewport-continuous source handoff', () => {
  assert.doesNotMatch(styles, /margin-top:\s*-100(?:s)?vh/);
  assert.match(
    styles,
    /background:\s*linear-gradient\(to bottom,\s*transparent 0 100svh,\s*#fffdf8 100svh\)/,
  );
  assert.match(source, /start:\s*'top bottom'/);
  assert.match(source, /sourceYear\.style\.animation\s*=\s*'none'/);
  assert.match(source, /sourceYear\.style\.transform\s*=\s*'none'/);
  assert.match(
    source,
    /const handoffTravel\s*=\s*section\.offsetHeight\s*\*\s*SOURCE_HANDOFF_START/,
  );
  assert.match(source, /sourceRect\.top\s*-\s*stickyRect\.top\s*-\s*handoffTravel/);
});

test('projects the card landing destination into viewport coordinates', () => {
  assert.match(source, /const stageRect\s*=\s*stage\.getBoundingClientRect\(\)/);
  assert.match(source, /centerRect\.top\s*-\s*stageRect\.top/);
  assert.match(source, /cardRect\.top\s*-\s*stageRect\.top/);
});

test('keeps the transition stage sticky and reaches a viewport-dominant early peak', () => {
  assert.match(styles, /\.hsm-transition\s*\{[^}]*overflow:\s*visible/s);
  assert.match(
    styles,
    /\.hs-professional:has\(> \.hsm-transition\)\s*\{[^}]*overflow:\s*visible/s,
  );
  assert.match(source, /getViewportZoomTargets\(stageRect\.width, stageRect\.height\)/);
  assert.match(source, /zoomTargets\.fast/);
  assert.doesNotMatch(source, /zoomTargets\.portal/);
});

test('uses a 230vh pinned runway followed by intrinsic normal-flow interaction', () => {
  assert.match(styles, /--method-transition-scroll:\s*230vh/);
  assert.doesNotMatch(
    source,
    /style=\{\{\s*['"]--method-transition-scroll['"]:/,
  );
  assert.match(
    styles,
    /\.hsm-transition__runway\s*\{[^}]*height:\s*var\(--method-transition-scroll\)[^}]*min-height:\s*230svh/s,
  );
  assert.doesNotMatch(
    styles,
    /\.hsm-transition__interaction\s*\{[^}]*(?:position:\s*(?:sticky|fixed)|height:\s*var\(--method-transition-scroll\))/s,
  );
});

test('coordinates a downward glass with an upward card inside one master timeline', () => {
  assert.match(source, /yPercent:\s*115/);
  assert.match(source, /METHOD_TRANSITION_TIMING\.cardRiseStart/);
  assert.match(source, /METHOD_TRANSITION_TIMING\.insertionStart/);
  assert.match(source, /METHOD_TRANSITION_TIMING\.reactionEnd/);
  assert.match(source, /scale:\s*0\.985/);
});

test('moves the completed card down to join the four companion cards', () => {
  assert.match(source, /joinedCard/);
  assert.match(source, /joinedGlass/);
  assert.match(source, /METHOD_TRANSITION_TIMING\.joinStart/);
  assert.match(source, /METHOD_TRANSITION_TIMING\.joinEnd/);
  assert.match(source, /METHOD_TRANSITION_TIMING\.companionsEnd/);
  assert.match(source, /companionRefs/);
});

test('hands the larger magnifier to a static image inside the settled green card', () => {
  assert.match(source, /staticGlassRef/);
  assert.match(source, /className="hsm-transition__static-glass"/);
  assert.match(source, /slotRect\.width\s*\*\s*0\.72/);
  assert.match(source, /gsap\.set\(staticGlass,\s*\{\s*opacity:\s*0/);
  assert.match(source, /METHOD_TRANSITION_TIMING\.joinEnd[\s\S]*opacity:\s*0/);
  assert.match(source, /staticGlass[\s\S]*opacity:\s*1/);
  assert.match(styles, /\.hsm-transition__static-glass\s*\{[^}]*width:\s*72%/s);
});

test('keeps the single card centered and within mobile viewports', () => {
  assert.match(styles, /width:\s*clamp\(280px,\s*24vw,\s*380px\)/);
  assert.match(styles, /aspect-ratio:\s*2\s*\/\s*3/);
  assert.match(styles, /method-card-diagnose-forest-v1\.png/);
  assert.match(mobileStyles, /width:\s*min\(76vw,\s*310px\)/);
  assert.doesNotMatch(mobileStyles, /overflow-x:\s*auto/);
});
