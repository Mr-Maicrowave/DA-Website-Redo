import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  getActivePath,
  getHscStream,
  type HscStreamId,
} from './hsc-maths-pathway-model.ts';

const componentUrl = new URL('./HscMathsPathway.tsx', import.meta.url);
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('Mathematics page mounts the feature and removes the legacy HSC selector', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  assert.match(source, /import \{ HscMathsPathway \}/);
  assert.match(source, /<HscMathsPathway \/>/);
  assert.doesNotMatch(source, /aria-label="Choose an HSC mathematics stream"/);
  assert.doesNotMatch(source, /hscRoutePaths/);
  assert.doesNotMatch(source, /hscStreamButtonRefs/);
});

test('Mathematics keeps the year-level selector without the removed Fourier enrichment selector', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  const mathematicsComponent = source.slice(source.indexOf('const Mathematics = () => {'));
  assert.doesNotMatch(mathematicsComponent, /<FourierDrawing\s*\/>/);
  assert.match(source, /role="tablist" aria-label="Year level"/);
  assert.match(source, /role="tab"\s+aria-selected=\{activeTab === tab\.id\}/);
});

test('Standard remains separate from the Advanced extension pathway', () => {
  assert.deepEqual(getActivePath('standard'), ['standard']);
});

test('Advanced is the base of the extension pathway rather than a step after Standard', () => {
  assert.deepEqual(getActivePath('advanced'), ['advanced']);
});

test('Extension 1 retains its Advanced prerequisite in the active pathway', () => {
  assert.deepEqual(getActivePath('extension-1'), [
    'advanced',
    'extension-1',
  ] satisfies HscStreamId[]);
});

test('Extension 2 retains both prerequisites and is Year 12 only', () => {
  assert.deepEqual(getActivePath('extension-2'), [
    'advanced',
    'extension-1',
    'extension-2',
  ] satisfies HscStreamId[]);
  assert.equal(getHscStream('extension-2').year12Only, true);
  assert.deepEqual(getHscStream('extension-2').prerequisites, [
    'Advanced',
    'Extension 1',
  ]);
});

test('pathway leads with a vertical course ladder and a selected-course detail panel', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /hsc-pathway-ladder/);
  assert.match(source, /hsc-pathway-detail/);
  assert.match(source, /data-course-path/);
  assert.match(source, /data-active-course/);
  assert.match(source, /hsc-pathway-ladder__rail/);
  assert.match(source, /Course attributes/);
  assert.doesNotMatch(source, /How the courses connect/);
});

test('course selection retains the prerequisite path and moves the selected indicator', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /const activePath = getActivePath\(activeStreamId\);/);
  assert.match(source, /className=\{`hsc-pathway-ladder__course\$\{isSelected \? ' is-selected' : ''\}\$\{isInActivePath \? ' is-on-path' : ''\}`\}/);
  assert.match(source, /className="hsc-pathway-ladder__connector"/);
});

test('pathway makes each course a keyboard-accessible single selection', () => {
  const source = readFileSync(componentUrl, 'utf8');
  const styles = readFileSync(new URL('./hsc-maths-pathway.css', import.meta.url), 'utf8');
  assert.match(source, /role="tab" aria-selected=\{isSelected\}/);
  assert.match(source, /aria-controls="hsc-course-guide"/);
  assert.match(source, /role="tabpanel" aria-live="polite"/);
  assert.match(styles, /\.hsc-pathway-ladder__course:focus-visible/);
});

test('pathway presents the approved decision content and actions', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /Who it tends to suit/);
  assert.match(source, /What students underestimate/);
  assert.match(source, /What this course feels like/);
  assert.match(source, /Challenges & DA help/);
  assert.match(source, /Talk through your child/);
  assert.match(source, /to="\/book-interview"/);
  assert.match(source, /to="\/hsc-excellence"/);
  assert.match(source, /Representative topics/);
  assert.match(source, /Course attributes/);
});

test('secondary actions and disclosure rows keep compact usable targets', () => {
  const styles = readFileSync(new URL('./hsc-maths-pathway.css', import.meta.url), 'utf8');
  assert.match(styles, /\.hsc-pathway-detail__rows summary\{[^}]*min-height:2\.7rem/);
  assert.match(styles, /\.hsc-pathway-detail__primary\{[^}]*min-height:2\.85rem/);
});

test('course guide uses a stable heading relationship', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /id="hsc-course-guide-heading"/);
  assert.match(source, /aria-labelledby="hsc-course-guide-heading"/);
});

test('course colour remains an accent rather than the only source of meaning', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /'--course-accent': stream\.color/);
  assert.doesNotMatch(source, /backgroundColor: stream\.color/);
  assert.match(source, /\{stream\.availability\}/);
});

test('course model uses four descriptive attributes rather than ranked scores', () => {
  for (const stream of ['standard', 'advanced', 'extension-1', 'extension-2'] satisfies HscStreamId[]) {
    const course = getHscStream(stream);
    assert.equal(course.attributes.length, 4);
    for (const attribute of course.attributes) {
      assert.ok(attribute.label.length > 0);
      assert.ok(attribute.description.length > 0);
    }
  }
});

test('refined detail prioritises visible guidance and topics over a stack of matching accordions', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /hsc-pathway-detail__overview/);
  assert.match(source, /hsc-pathway-detail__topics/);
  assert.match(source, /hsc-pathway-detail__explore/);
  assert.match(source, /Expect/);
  assert.match(source, /Questions/);
  assert.match(source, /Challenges & DA help/);
  assert.doesNotMatch(source, /BookOpenCheck/);
  assert.doesNotMatch(source, /Target,/);
  assert.doesNotMatch(source, /TrendingUp/);
  assert.doesNotMatch(source, /HelpCircle/);
  assert.doesNotMatch(source, /Compass,/);
});

test('refined selector removes row arrows and shares one rail coordinate with every node', () => {
  const source = readFileSync(componentUrl, 'utf8');
  const styles = readFileSync(new URL('./hsc-maths-pathway.css', import.meta.url), 'utf8');
  assert.doesNotMatch(source.slice(source.indexOf('HSC_STREAMS.map')), /<ArrowRight aria-hidden="true" \/>/);
  assert.match(source, /hsc-pathway-ladder__connector/);
  assert.match(styles, /--rail-x/);
  assert.match(styles, /left:var\(--rail-x\)/);
});

test('pathway is responsive and keeps the selector free of redundant notes', () => {
  const source = readFileSync(componentUrl, 'utf8');
  const styles = readFileSync(new URL('./hsc-maths-pathway.css', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /Pathway note/);
  assert.doesNotMatch(source, /Extension 1 is studied with Advanced\. Extension 2/);
  assert.doesNotMatch(source, /A practical course-choice checklist/);
  assert.match(styles, /@media\(max-width:950px\)/);
  assert.match(styles, /@media\(max-width:600px\)/);
});

test('Extension 2 is a Year 12 course studied with Advanced and Extension 1', () => {
  const extensionTwo = getHscStream('extension-2');
  assert.match(extensionTwo.badge, /studied with Advanced and Extension 1/);
  assert.doesNotMatch(extensionTwo.whatChanges, /replaces/);
});

test('compact refinement removes decorative artwork, rankings and duplicated Extension 2 metadata', () => {
  const source = readFileSync(componentUrl, 'utf8');
  const styles = readFileSync(new URL('./hsc-maths-pathway.css', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /hsc-pathway-detail__diagram/);
  assert.doesNotMatch(source, /hsc-pathway-character/);
  assert.match(source, /Year 11–12 mathematics/);
  assert.match(source, /hsc-pathway-attributes/);
  assert.match(source, /Year 11 Mathematics Standard is shared/);
  assert.doesNotMatch(styles, /hsc-pathway-character__scale/);
  assert.doesNotMatch(styles, /hsc-pathway-detail__diagram/);
});

test('final density pass uses a compact introduction and resets disclosures on course changes', () => {
  const source = readFileSync(componentUrl, 'utf8');
  const styles = readFileSync(new URL('./hsc-maths-pathway.css', import.meta.url), 'utf8');
  assert.match(source, /Choose a course to explore its content, suitability and pathway/);
  assert.match(source, /key=\{`\$\{activeStreamId\}-\$\{standardYear12Id\}`\}/);
  assert.doesNotMatch(source, /<details open/);
  assert.match(styles, /\.hsc-pathway-intro\{[^}]*margin:0 0 \.85rem/);
  assert.match(styles, /\.hsc-pathway-detail__actions\{[^}]*margin-top:\.75rem/);
});

test('course explorer separates the Year 12 Standard branch and reveals richer course guidance progressively', () => {
  const source = readFileSync(componentUrl, 'utf8');
  const model = readFileSync(new URL('./hsc-maths-pathway-model.ts', import.meta.url), 'utf8');
  assert.match(model, /STANDARD_YEAR12_OPTIONS/);
  assert.match(model, /feelsLike/);
  assert.match(model, /underestimate/);
  assert.match(model, /name: 'Standard 1'/);
  assert.match(model, /name: 'Standard 2'/);
  assert.match(source, /What this course feels like/);
  assert.match(source, /What students underestimate/);
  assert.match(source, /Expect/);
  assert.match(source, /Questions/);
  assert.match(source, /Challenges & DA help/);
  assert.doesNotMatch(model, /replaces the Advanced HSC course/);
});
