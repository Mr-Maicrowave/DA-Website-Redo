import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentUrl = new URL('./YearCube.tsx', import.meta.url);
const mathematicsPageUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);
const originalExperienceUrl = new URL('../../../public/interactive/year-cube/index.html', import.meta.url);

test('provides 3D depth dice toss, top-down geometric net unfolding, and rich Years 7–12 course details without AI tells or emojis', () => {
  assert.equal(existsSync(componentUrl), true, 'YearCube.tsx must provide the Mathematics page replacement');

  const source = readFileSync(componentUrl, 'utf8');
  const mathematicsPage = readFileSync(mathematicsPageUrl, 'utf8');
  const originalExperience = readFileSync(originalExperienceUrl, 'utf8');

  // Verify React embedding
  assert.match(source, /\/interactive\/year-cube\/index\.html/);
  assert.match(source, /title="Interactive Years 7 to 12 mathematics cube"/);
  assert.match(mathematicsPage, /import \{ YearCube \} from '@\/features\/year-cube\/YearCube'/);
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
  assert.match(originalExperience, /pips-overlay/);

  // Verify Course Details Modal Structure
  assert.match(originalExperience, /id="masterclassModal"/);
  assert.match(originalExperience, /id="modalYearNav"/);
  assert.match(originalExperience, /id="modalContentArea"/);
  assert.match(originalExperience, /renderYearCard/);

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
