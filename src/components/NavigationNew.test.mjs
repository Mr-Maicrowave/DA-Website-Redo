import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (await readFile(new URL('./NavigationNew.tsx', import.meta.url), 'utf8')).replace(/\r\n/g, '\n');

test('places a Why DA desktop tab directly after Home', () => {
  assert.match(
    source,
    /<Link to="\/"[\s\S]*?>Home<\/Link>[\s\S]{0,120}<Link[\s\S]{0,120}to="\/why-choose-da"[\s\S]*?>\s*Why DA\s*<\/Link>/,
  );
});

test('keeps search immediately before the desktop consultation action', () => {
  assert.match(
    source,
    /<GlobalSearch[\s\S]*?<Link\s+to="\/book-interview"/,
  );
  assert.match(source, /aria-label="Search DA Tuition"/);
});

test('places Contact Us after desktop Resources and before search', () => {
  assert.match(
    source,
    /Resources[\s\S]*?<Link\s+to="\/contact"[\s\S]*?>Contact Us<\/Link>[\s\S]*?<GlobalSearch/,
  );
});

test('passes an explicit mobile search state to the mobile navigation sheet', () => {
  assert.match(source, /<MobileNavSheet[\s\S]*?searchOpen=\{mobileSearchOpen\}/);
  assert.match(source, /setMobileSearchOpen\(true\)/);
});

test('keeps Huyen’s centred desktop navigation while retaining search', () => {
  assert.match(source, /flex items-center flex-1 justify-center/);
  assert.match(source, /hidden lg:block/);
  assert.match(source, /<GlobalSearch[\s\S]*?Book Consultation/);
});
