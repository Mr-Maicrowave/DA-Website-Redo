import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const mathematics = readFileSync(new URL('../../pages/subjects/Mathematics.tsx', import.meta.url), 'utf8');
const locations = readFileSync(new URL('../../features/wayfinder/WayfinderLocationsPage.tsx', import.meta.url), 'utf8');
const primary = readFileSync(new URL('../../pages/programs/PrimarySchool.tsx', import.meta.url), 'utf8');
const english = readFileSync(new URL('../../pages/subjects/English.tsx', import.meta.url), 'utf8');
const science = readFileSync(new URL('../../pages/subjects/Science.tsx', import.meta.url), 'utf8');
const businessStudies = readFileSync(new URL('../../pages/subjects/BusinessStudies.tsx', import.meta.url), 'utf8');
const legalStudies = readFileSync(new URL('../../pages/subjects/LegalStudies.tsx', import.meta.url), 'utf8');
const highSchool = readFileSync(new URL('../../pages/programs/HighSchool.tsx', import.meta.url), 'utf8');
const whyDa = readFileSync(new URL('../../pages/WhyChooseDA.tsx', import.meta.url), 'utf8');
const journey = readFileSync(new URL('./PageJourney.tsx', import.meta.url), 'utf8');
const journeyCss = readFileSync(new URL('./page-journey.css', import.meta.url), 'utf8');

test('the three approved long-form routes mount the shared PageJourney', () => {
  assert.match(mathematics, /<PageJourney pageLabel="Mathematics" sections=\{MATHS_JOURNEY_SECTIONS\}/);
  assert.match(locations, /<PageJourney pageLabel="Locations" sections=\{LOCATION_JOURNEY_SECTIONS\}/);
  assert.match(primary, /<PageJourney pageLabel="Primary School" sections=\{PRIMARY_JOURNEY_SECTIONS\}/);
});

test('the shared journey is available across the remaining long-form subject and programme routes', () => {
  assert.match(english, /<PageJourney pageLabel="English"/);
  assert.match(science, /<PageJourney pageLabel="Science" sections=\{SCIENCE_JOURNEY_SECTIONS\}/);
  assert.match(businessStudies, /<PageJourney pageLabel="Business Studies" sections=\{BUSINESS_JOURNEY_SECTIONS\}/);
  assert.match(legalStudies, /<PageJourney pageLabel="Legal Studies" sections=\{LEGAL_JOURNEY_SECTIONS\}/);
  assert.match(highSchool, /<PageJourney pageLabel="High School" sections=\{HIGH_SCHOOL_JOURNEY_SECTIONS\}/);
  assert.match(whyDa, /<PageJourney pageLabel="Why DA" sections=\{WHY_DA_JOURNEY_SECTIONS\}/);
});

test('English maps its embedded document chapters onto the shared journey without altering the iframe scroll model', () => {
  assert.match(english, /const ENGLISH_JOURNEY_SECTIONS/);
  assert.match(english, /sourceId: 'year-map-heading'/);
  assert.match(english, /setJourneyOffsets/);
  assert.match(english, /contentDocument/);
  assert.match(english, /scrolling="no"/);
  assert.doesNotMatch(english, /scrollIntoView/);
});

test('the chapter maps retain the long scroll experiences as single destinations', () => {
  assert.match(mathematics, /id: 'year-cube'[\s\S]*longScroll: true/);
  assert.match(locations, /id: 'location-community'[\s\S]*longScroll: true/);
  assert.match(primary, /id: 'foundation'[\s\S]*label: 'Learning journey'/);
  assert.match(science, /id: 'science-concerns'[\s\S]*longScroll: true/);
});

test('the collapsed journey keeps its chapter marks visible before the index opens', () => {
  assert.match(journey, /page-journey__markers/);
  assert.match(journey, /page-journey__active-indicator/);
  assert.match(journey, /calc\(19px \+ \(100% - 38px\)/);
  assert.match(journeyCss, /\.page-journey__markers\s*\{[^}]*flex-direction:\s*column/);
});

test('the desktop rail itself can initiate the expanded state', () => {
  assert.match(journeyCss, /\.page-journey__rail\s*\{[^}]*pointer-events:\s*auto/);
});

test('the expanded index unfolds leftward from the fixed rail spine', () => {
  assert.match(journeyCss, /\.page-journey__index\s*\{[^}]*border:\s*0/);
  assert.match(journeyCss, /\.page-journey__index\s*\{[^}]*transform-origin:\s*right center/);
  assert.match(journeyCss, /\.page-journey__index\s*\{[^}]*width:\s*288px/);
  assert.match(journeyCss, /\.page-journey__index\s*\{[^}]*border-radius:\s*14px 0 0 14px/);
  assert.match(journeyCss, /\.page-journey:hover \.page-journey__markers[\s\S]*?opacity:\s*0/);
  assert.match(journeyCss, /\.page-journey li\.is-active::after\s*\{[^}]*background:\s*var\(--journey-folio-accent\)/);
  assert.doesNotMatch(journeyCss, /\.page-journey li\.is-active button\s*\{[^}]*background:/);
});

test('the expanded header is a compact journey position, not decorative chrome', () => {
  assert.match(journey, /page-journey__heading/);
  assert.match(journey, />Journey<\/p>/);
  assert.match(journey, /page-journey__heading-progress/);
  assert.match(journeyCss, /\.page-journey__active-indicator\s*\{[^}]*transition:\s*top/);
});

test('the expanded folio uses one ivory surface across light and dark page sections', () => {
  assert.match(journeyCss, /\.page-journey__index\s*\{[^}]*color:\s*var\(--journey-folio-ink\)/);
  assert.match(journeyCss, /\.page-journey__index\s*\{[^}]*--journey-folio-surface/);
  assert.match(journeyCss, /\.page-journey--dark\s*\{[^}]*--journey-closed-ink:\s*#fff8e9/);
  assert.doesNotMatch(journeyCss, /\.page-journey--dark\s*\{[^}]*--journey-folio-surface:/);
});
