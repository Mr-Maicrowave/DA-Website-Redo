/**
 * Schema.org JSON-LD builders for DA Tuition.
 *
 * All helpers return plain objects that can be passed to the SEO component's
 * `jsonLd` prop, which will serialize them into
 * <script type="application/ld+json"> tags in the document head.
 */

const SITE_URL = 'https://datuition.com.au';
const LOGO_URL = `${SITE_URL}/lovable-uploads/7692e107-bde1-4906-b047-2458fe6a81ca.png`;

const NAP = {
    name: 'DA Tuition',
    legalName: 'DA Tuition',
    telephone: '+61401940207',
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Level 1, 229 Canley Vale Rd',
        addressLocality: 'Canley Heights',
        addressRegion: 'NSW',
        postalCode: '2166',
        addressCountry: 'AU',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: -33.8821,
        longitude: 150.9330,
    },
    // ISO 8601 day-of-week abbreviations — one entry per opening block
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '17:00',
            closes: '21:00',
        },
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '09:00',
            closes: '18:00',
        },
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Sunday',
            opens: '10:00',
            closes: '19:00',
        },
    ],
} as const;

// sameAs URLs (social profiles) — populate once Jared provides them
const SAME_AS: string[] = [];

export function organizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: NAP.name,
        url: SITE_URL,
        logo: LOGO_URL,
        telephone: NAP.telephone,
        address: NAP.address,
        sameAs: SAME_AS,
        foundingDate: '2005',
        slogan: 'Beyond Academic Excellence',
    };
}

export function localBusinessSchema(reviewCount: number) {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#localbusiness`,
        name: NAP.name,
        image: LOGO_URL,
        url: SITE_URL,
        telephone: NAP.telephone,
        address: NAP.address,
        geo: NAP.geo,
        openingHoursSpecification: NAP.openingHoursSpecification,
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            bestRating: '5',
            reviewCount: String(reviewCount),
        },
        sameAs: SAME_AS,
    };
}

/**
 * EducationalOrganization schema — more specific than LocalBusiness for a
 * tuition centre. Use on the CanleyHeights location page for richest local
 * markup.
 */
export function educationalOrganizationSchema(reviewCount: number) {
    return {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        '@id': `${SITE_URL}/#educationalorganization`,
        name: NAP.name,
        alternateName: 'DA Tuition Centre',
        description:
            'Premium K-12 tuition centre in Canley Heights NSW. Small-group classes, Band 6 teachers, specialised HSC preparation and a curriculum designed for examination excellence.',
        url: `${SITE_URL}/tutoring-canley-heights`,
        logo: LOGO_URL,
        image: LOGO_URL,
        telephone: NAP.telephone,
        address: NAP.address,
        geo: NAP.geo,
        openingHoursSpecification: NAP.openingHoursSpecification,
        areaServed: [
            {
                '@type': 'City',
                name: 'Canley Heights',
            },
            {
                '@type': 'City',
                name: 'Canley Vale',
            },
            {
                '@type': 'City',
                name: 'Cabramatta',
            },
            {
                '@type': 'City',
                name: 'Fairfield',
            },
            {
                '@type': 'City',
                name: 'Smithfield',
            },
            {
                '@type': 'AdministrativeArea',
                name: 'South-West Sydney',
            },
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            bestRating: '5',
            reviewCount: String(reviewCount),
        },
        hasMap:
            'https://www.google.com/maps/place/229+Canley+Vale+Rd,+Canley+Heights+NSW+2166',
        sameAs: SAME_AS,
    };
}

/**
 * Service-area schema for suburb landing pages.
 *
 * Uses the Canley Heights physical address (since that IS the physical centre)
 * but frames `areaServed` around the target suburb. This is the correct Schema.org
 * pattern for businesses serving a wider area from one physical location.
 */
export function serviceAreaLocalBusinessSchema(
    suburb: string,
    areaServed: string[],
    reviewCount: number
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/tutoring-${suburb.toLowerCase().replace(/\s+/g, '-')}#localbusiness`,
        name: `DA Tuition — serving ${suburb}`,
        image: LOGO_URL,
        url: SITE_URL,
        telephone: NAP.telephone,
        address: NAP.address, // The Canley Heights centre — the actual physical address
        geo: NAP.geo,
        openingHoursSpecification: NAP.openingHoursSpecification,
        areaServed: areaServed.map((area) => ({
            '@type': 'City',
            name: area,
        })),
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            bestRating: '5',
            reviewCount: String(reviewCount),
        },
        sameAs: SAME_AS,
    };
}

export function aggregateRatingSchema(reviewCount: number) {
    return {
        '@context': 'https://schema.org',
        '@type': 'AggregateRating',
        itemReviewed: {
            '@type': 'LocalBusiness',
            name: NAP.name,
            address: NAP.address,
        },
        ratingValue: '5.0',
        bestRating: '5',
        reviewCount: String(reviewCount),
    };
}

export interface FaqItem {
    question: string;
    answer: string;
}

export function faqPageSchema(faqs: FaqItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

export interface BreadcrumbItem {
    name: string;
    url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
        })),
    };
}
