import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    ogType?: 'website' | 'article';
    ogImage?: string;
    noindex?: boolean;
    jsonLd?: object | object[];
}

const SEO = ({
    title,
    description,
    canonicalUrl,
    ogType = 'website',
    ogImage = '/lovable-uploads/7692e107-bde1-4906-b047-2458fe6a81ca.png',
    noindex = false,
    jsonLd,
}: SEOProps) => {
    const siteTitle = 'DA Tuition - Beyond Academic Excellence | Premium K-12 Tutoring Australia';
    const fullTitle = title ? `${title} | DA Tuition` : siteTitle;

    const siteDescription = 'DA Tuition provides personalized K-12 tutoring in Australia. Beyond academic excellence, we build confidence and support the whole child. Book an interview today.';
    const fullDescription = description || siteDescription;

    const siteUrl = 'https://datuition.com.au';
    const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

    const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={fullDescription} />
            {canonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
            {noindex && <meta name="robots" content="noindex, follow" />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content="DA Tuition" />
            <meta property="og:locale" content="en_AU" />
            <meta property="og:url" content={fullCanonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDescription} />
            <meta property="og:image" content={fullOgImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@datuition" />
            <meta name="twitter:url" content={fullCanonicalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={fullDescription} />
            <meta name="twitter:image" content={fullOgImage} />

            {/* Structured data */}
            {jsonLdArray.map((schema, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;
