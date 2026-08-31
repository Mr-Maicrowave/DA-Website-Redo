import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readSource = (relativePath: string) =>
  readFileSync(new URL(`../../../${relativePath}`, import.meta.url), 'utf8');

const directlyFootedPages = [
  'src/pages/Index.tsx',
  'src/pages/BookInterview.tsx',
  'src/pages/FindTeacher.tsx',
  'src/pages/Tutors.tsx',
  'src/pages/Articles.tsx',
  'src/pages/ArticleView.tsx',
  'src/pages/LearningFormats.tsx',
  'src/pages/HSCExcellence.tsx',
  'src/pages/locations/CanleyHeights.tsx',
  'src/pages/SuccessStories.tsx',
  'src/pages/FAQ.tsx',
  'src/pages/ContactUs.tsx',
  'src/pages/PrivacyPolicy.tsx',
  'src/pages/WhyChooseDA.tsx',
  'src/pages/PrincipalReflections.tsx',
  'src/pages/PrincipalInterview.tsx',
  'src/pages/programs/PrimarySchool.tsx',
  'src/pages/programs/EarlyYears.tsx',
  'src/pages/programs/Year34.tsx',
  'src/pages/programs/Year56.tsx',
  'src/pages/programs/HighSchool.tsx',
  'src/pages/subjects/Mathematics.tsx',
  'src/pages/MathsGraphLab.tsx',
  'src/pages/subjects/English.tsx',
  'src/pages/subjects/Science.tsx',
  'src/pages/subjects/BusinessStudies.tsx',
  'src/pages/subjects/LegalStudies.tsx',
  'src/pages/TestimonialDetail.tsx',
  'src/pages/NotFound.tsx',
] as const;

test('every public routed page includes the shared footer', () => {
  for (const page of directlyFootedPages) {
    assert.match(readSource(page), /<(?:FooterNew|HomeFooterTrial)\b/, page);
  }

  const locationTemplate = readSource('src/components/location/LocationPageTemplate.tsx');
  assert.match(locationTemplate, /<FooterNew\b/);

  for (const page of ['Cabramatta', 'Fairfield', 'CanleyVale', 'Smithfield', 'Lansvale']) {
    assert.match(
      readSource(`src/pages/locations/${page}.tsx`),
      /<LocationPageTemplate\b/,
      `${page} must use the footed location template`,
    );
  }
});

test('dedicated closing booking panels do not duplicate the footer action', () => {
  const retiredPanels = [
    ['src/pages/Index.tsx', /ClosingCTASection/],
    ['src/pages/FAQ.tsx', /faq-editorial-closing/],
    ['src/pages/FindTeacher.tsx', /faculty-mobile-guidance/],
    ['src/pages/HSCExcellence.tsx', /hsc-(?:cta-section|fit-cta-row)/],
    ['src/pages/WhyChooseDA.tsx', /why-da-closing/],
    ['src/pages/subjects/Mathematics.tsx', /\{\/\* Final CTA \*\/\}/],
    ['src/pages/subjects/Science.tsx', /science-next-step/],
    ['src/pages/subjects/LegalStudies.tsx', /\{\/\* CTA Section \*\/\}/],
    ['src/pages/ArticleView.tsx', /Ready to Get Started\?/],
    ['src/components/location/LocationPageTemplate.tsx', /\{\/\* CTA \*\/\}/],
  ] as const;

  for (const [page, pattern] of retiredPanels) {
    assert.doesNotMatch(readSource(page), pattern, page);
  }
});

test('the shared footer stays on the base layer so page overlays can never be covered by it', () => {
  const footer = readSource('src/components/FooterNew.tsx');
  const tailwindConfig = readSource('tailwind.config.ts');

  assert.doesNotMatch(footer, /z-site-footer/);
  assert.doesNotMatch(tailwindConfig, /['"]site-footer['"]/);
});
