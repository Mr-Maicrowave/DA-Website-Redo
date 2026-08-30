import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (await readFile(new URL('./NavigationNew.tsx', import.meta.url), 'utf8')).replace(/\r\n/g, '\n');

test('places a Why DA desktop tab directly after Home', () => {
  assert.match(
    source,
    /<Link to="\/"[\s\S]*?>Home<\/Link>\s*<Link\s+to="\/why-choose-da"[\s\S]*?>\s*Why DA\s*<\/Link>/,
  );
});

test('keeps search immediately before the desktop consultation action', () => {
  assert.match(
    source,
    /<GlobalSearch[\s\S]*?<Link\s+to="\/book-interview"/,
  );
  assert.match(source, /aria-label="Search DA Tuition"/);
});

test('passes an explicit mobile search state to the mobile navigation sheet', () => {
  assert.match(source, /<MobileNavSheet[\s\S]*?searchOpen=\{false\}/);
});

test('centres the link cluster between equal outer grid tracks', () => {
  assert.match(source, /grid-cols-\[1fr_auto_1fr\]/);
  assert.doesNotMatch(source, /ml-\[clamp\(5rem,8vw,8\.5rem\)\]/);
  assert.match(source, /justify-self-center/);
  assert.match(source, /hidden min-\[1100px\]:block/);
  assert.match(source, /items-center justify-self-end[\s\S]*?<GlobalSearch[\s\S]*?Book Consultation/);
});
