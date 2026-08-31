import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./YearCube.tsx', import.meta.url);
const mathematicsPageUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);
const originalExperienceUrl = new URL('../../../public/interactive/year-cube/index.html', import.meta.url);

test('provides a clean 3D cube toss, top-down geometric net unfolding, and rich Years 7–12 course details without AI tells or emojis', () => {
  assert.equal(existsSync(componentUrl), true, 'YearCube.tsx must provide the Mathematics page replacement');

  const source = readFileSync(componentUrl, 'utf8');
  const mathematicsPage = readFileSync(mathematicsPageUrl, 'utf8');
  const originalExperience = readFileSync(originalExperienceUrl, 'utf8');

  // Verify React embedding
  assert.match(source, /\/interactive\/year-cube\/index\.html/);
  assert.match(source, /title="Interactive Years 7 to 12 mathematics cube"/);
  assert.match(source, /id="year-cube"/);
  assert.match(mathematicsPage, /import \{ YearCube \} from '@\/features\/year-cube\/YearCube'/);
  assert.match(mathematicsPage, /<YearCube\s*\/>/);
  assert.doesNotMatch(mathematicsPage, /\{ label: 'Explore Years 7–12', href: '#year-cube' \}/);
  assert.match(mathematicsPage, /exploreTargetId="year-cube"/);
  assert.doesNotMatch(mathematicsPage, /id="year-cube-introduction"/);
  assert.doesNotMatch(mathematicsPage, /Explore Years 7–12 <ArrowRight/);
  assert.match(mathematicsPage, /<YearCube\s*\/>/);

  // Verify 3D Cube Structure & 6 Faces
  assert.match(originalExperience, /data-face="front"/);
  assert.match(originalExperience, /data-face="right"/);
  assert.match(originalExperience, /data-face="back"/);
  assert.match(originalExperience, /data-face="left"/);
  assert.match(originalExperience, /data-face="top"/);
  assert.match(originalExperience, /data-face="bottom"/);

  // Verify 3D Depth Toss & Top-Down Net Unfolding
  assert.match(originalExperience, /rollAndUnfold/);
  assert.match(originalExperience, /foldBackToCube/);
  assert.match(originalExperience, /buildNetStructure/);
  assert.match(originalExperience, /hinged-net-wrapper/);
  assert.match(originalExperience, /top-down-view/);
  assert.match(originalExperience, /net-panel/);
  assert.match(originalExperience, /classList\.add\('net-open'\)/);
  assert.match(originalExperience, /classList\.remove\('net-open'\)/);
  assert.doesNotMatch(originalExperience, /pips-overlay/);
  assert.doesNotMatch(originalExperience, /PIP_LAYOUTS/);

  // Verify Course Details Modal Structure
  assert.match(originalExperience, /id="masterclassModal"/);
  assert.match(originalExperience, /id="modalYearNav"/);
  assert.match(originalExperience, /id="modalContentArea"/);
  assert.match(originalExperience, /renderYearFieldGuide/);
  assert.match(originalExperience, /renderYearFieldGuide\(data, yearNum\)/);

  // Every year uses the open blueprint field guide with its real DA photograph,
  // rather than a separate boxed content schedule.
  assert.match(originalExperience, /year-field-guide/);
  assert.match(originalExperience, /Year shift/i);
  assert.match(originalExperience, /Core focus areas/i);
  assert.match(originalExperience, /At a glance/i);
  assert.match(originalExperience, /How DA teaches it/i);
  assert.match(originalExperience, /Common mistakes we fix/i);
  assert.match(originalExperience, /highschool-tutor-1on1-1\.jpg/);
  assert.match(originalExperience, /yfg-year-shift/);
  assert.match(originalExperience, /yfg-core-focus/);
  assert.match(originalExperience, /yfg-at-glance/);
  assert.match(originalExperience, /yfg-common-mistakes/);
  assert.doesNotMatch(originalExperience, /\['Year level', 'Year 7(?: of 12)?'\]/);
  assert.doesNotMatch(originalExperience, /\['Ideal for',/);
  assert.doesNotMatch(originalExperience, /<p class="yfg-kicker">Year 7<\/p>/);
  assert.doesNotMatch(originalExperience, /<span>Year 7<\/span>/);

  // Desktop field-guide content must use the available viewport width rather
  // than forcing the Year 7 sheet into a tall internally-scrolling column.
  assert.match(originalExperience, /\.modal-window\s*\{[^}]*max-width:\s*min\(96vw,\s*1600px\)/);
  assert.doesNotMatch(originalExperience, /\.modal-content-area\s*\{[^}]*overflow-y:\s*hidden/);
  assert.match(originalExperience, /\.yfg-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1\.3fr\)\s+minmax\(0,\s*1fr\)/);
  assert.match(originalExperience, /\.yfg-title\s*\{[^}]*max-width:\s*none;[^}]*font-size:\s*clamp\(3\.25rem,\s*3\.3vw,\s*3\.625rem\)/);
  assert.match(originalExperience, /\.yfg-table div\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*\.3fr\)\s+minmax\(0,\s*\.7fr\)/);
  assert.doesNotMatch(originalExperience, /\.yfg-table div\s*\{[^}]*border-bottom:/);
  assert.match(originalExperience, /@media \(max-height:\s*900px\) and \(min-width:\s*821px\)/);

  // One treatment ships: the blueprint sheet, on every face and every card.
  assert.match(originalExperience, /layout-concept-4/);
  assert.equal(
    (originalExperience.match(/data-face="[a-z]+" data-design="4"/g) || []).length,
    6,
    'all six faces must carry the blueprint treatment',
  );

  // The design-review scaffolding was for choosing a treatment. It must not ship.
  assert.doesNotMatch(originalExperience, /design-lab/);
  assert.doesNotMatch(originalExperience, /modalDesignSwitch/);
  assert.doesNotMatch(originalExperience, /renderModalConcept/);

  // Throwing is a deliberate gesture: double-click or an upward flick, never a
  // stray single click, and the instruction sits with the dice.
  assert.match(originalExperience, /addEventListener\('dblclick'/);
  assert.match(originalExperience, /FLICK_MIN_SPEED/);
  assert.match(originalExperience, /cube-hint/);

  // A rotated face can extend beyond the cube's original layout box. The full
  // 3D stage must therefore own pointer capture, so every visible angle stays
  // draggable rather than leaving an unresponsive projected face.
  assert.match(originalExperience, /const dragSurface = stage/);
  assert.match(originalExperience, /dragSurface\.addEventListener\('pointerdown'/);

  // The cube's own contact shadow is enough. A rectangular stage glow leaves a
  // visible horizontal seam under the object at some viewport sizes.
  assert.doesNotMatch(originalExperience, /\.stage::after/);

  // Nothing on the dice may be selectable: double-clicking to throw would
  // otherwise select the word under the cursor, and a select-all paints the
  // highlight through onto faces that backface-visibility has hidden.
  assert.match(originalExperience, /-moz-user-select: none/);
  assert.match(originalExperience, /addEventListener\('selectstart'/);
  assert.match(originalExperience, /if \(e\.detail > 1\) e\.preventDefault\(\)/);
  assert.match(originalExperience, /\.hinged-net-wrapper ::selection/);

  // Verify Authentic Photography
  assert.match(originalExperience, /\/images\/programs\/highschool-tutor-1on1-1\.jpg/);
  assert.match(originalExperience, /\/images\/programs\/highschool-whiteboard-teach-2\.jpg/);
  assert.match(originalExperience, /\/images\/programs\/highschool-tutor-whiteboard\.jpg/);
  assert.match(originalExperience, /\/images\/programs\/highschool-laptop-group-1\.jpg/);
  assert.match(originalExperience, /\/images\/programs\/highschool-whiteboard-teach-1\.jpg/);
  assert.match(originalExperience, /\/images\/programs\/hsc-maths\.jpg/);

  // Verify Authentic Pedagogical & Curriculum Content
  assert.match(originalExperience, /Bracket Substitution Protocol/);
  assert.match(originalExperience, /Directed Numbers & Negative Arithmetic/);
  assert.match(originalExperience, /Algebraic Fluency & Geometric Reasoning/);
  assert.match(originalExperience, /Monic Quadratic Equations & Factorisation/);
  assert.match(originalExperience, /Surds, Rationalising Denominators & Exact Values/);
  assert.match(originalExperience, /Differential Calculus \(First Principles & Product\/Quotient\/Chain Rules\)/);
  assert.match(originalExperience, /Past Paper Marking Workshop/);

  // Verify NO Emojis are used
  assert.doesNotMatch(originalExperience, /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u);

  // Verify Old Placeholders & AI tropes are Cleaned Up
  assert.doesNotMatch(originalExperience, /Sample copy — swap in real syllabus hooks/);
  assert.doesNotMatch(originalExperience, /Prototype for discussion/);
  assert.doesNotMatch(originalExperience, /Unshakeable/i);
});

test('renders curriculum equations with KaTeX inside non-overflowing topic rows', () => {
  const experience = readFileSync(originalExperienceUrl, 'utf8');

  assert.match(experience, /katex@0\.17\.0\/dist\/katex\.min\.css/);
  assert.match(experience, /katex@0\.17\.0\/dist\/katex\.min\.js/);
  assert.match(experience, /function renderMathText\(value\)/);
  assert.match(experience, /katex\.renderToString\(tex, \{ throwOnError: false \}\)/);
  assert.match(experience, /class="math-inline"/);
  assert.match(experience, /\.math-inline\s*\{[^}]*max-width:\s*100%;[^}]*overflow-x:\s*auto/);
  assert.match(experience, /Linear Relationships & Graphing — \$y = mx \+ b\$/);
  assert.match(experience, /\$-3\^2\$ vs \$\(-3\)\^2\$/);
});

test('keeps the existing blueprint face typography while making the cube labels readable at a glance', () => {
  const experience = readFileSync(originalExperienceUrl, 'utf8');

  assert.match(experience, /\.fs-num\s*\{[^}]*font-size:\s*clamp\(2\.35rem,\s*3\.6vw,\s*3\.25rem\)/);
  assert.match(experience, /\.fs-tag\s*\{[^}]*font-size:\s*\.66rem/);
  assert.match(experience, /\.fs-title\s*\{[^}]*font-size:\s*\.70rem/);
  assert.match(experience, /\[data-design="4"\]\s*>\s*\.face-skin\s*\.fs-hook\s*\{[^}]*font-size:\s*\.84rem/);
  assert.match(experience, /\.fs-go\s*\{[^}]*font-size:\s*\.78rem/);
  assert.match(experience, /\.hinged-net-wrapper\.unfolded\s+\.fs-title\s*\{[^}]*font-size:\s*\.88rem/);
  assert.match(experience, /\.hinged-net-wrapper\.unfolded\s+\[data-design="4"\]\s*>\s*\.face-skin\s+\.fs-hook\s*\{[^}]*font-size:\s*1\.05rem/);
  assert.match(experience, /\.hinged-net-wrapper\.unfolded\s+\.fs-go\s*\{[^}]*font-size:\s*\.96rem/);
});
