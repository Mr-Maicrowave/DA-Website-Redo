export type FooterLink = {
  label: string;
  to: string;
};

export const footerConfig = {
  logo: {
    src: '/images/brand/da-footer-crest-laurel.png',
    alt: 'DA Tuition crest',
  },
  explore: [
    { label: 'Our Approach', to: '/our-approach' },
    { label: 'Our Teachers', to: '/our-teachers' },
    { label: 'Success Stories', to: '/success-stories' },
    { label: 'Articles & Guides', to: '/articles' },
    { label: 'FAQ', to: '/faq' },
  ] satisfies FooterLink[],
  subjects: [
    { label: 'Mathematics', to: '/subjects/mathematics' },
    { label: 'English', to: '/subjects/english' },
    { label: 'Science', to: '/subjects/science' },
    { label: 'Business Studies', to: '/subjects/business-studies' },
    { label: 'Legal Studies', to: '/subjects/legal-studies' },
  ] satisfies FooterLink[],
  legal: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
  ] satisfies FooterLink[],
  primaryAction: {
    label: 'Book a consultation',
    to: '/book-interview',
  } satisfies FooterLink,
  directionsUrl:
    'https://maps.google.com/?q=229+Canley+Vale+Rd+Canley+Heights+NSW+2166',
} as const;
