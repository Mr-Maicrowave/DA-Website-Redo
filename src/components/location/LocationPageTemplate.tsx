import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    MapPin,
    Clock,
    Phone,
    Car,
    Train,
    Bus,
    School,
    Users,
    Trophy,
    Star,
    CheckCircle,
    ArrowRight,
    Navigation,
} from 'lucide-react';
import { siteStats } from '@/data/site-stats';
import { locations, type LocationContent, type LocationTransport } from '@/data/locations';
import {
    serviceAreaLocalBusinessSchema,
    breadcrumbSchema,
} from '@/lib/seo/schema';
import { Link } from 'react-router-dom';

const transportIconMap: Record<LocationTransport['icon'], typeof Train> = {
    Train,
    Car,
    Bus,
    Navigation,
};

interface LocationPageTemplateProps {
    content: LocationContent;
}

const LocationPageTemplate = ({ content }: LocationPageTemplateProps) => {
    const otherLocations = locations.filter((l) => l.slug !== content.slug);

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title={content.title}
                description={content.metaDescription}
                canonicalUrl={content.path}
                jsonLd={[
                    serviceAreaLocalBusinessSchema(
                        content.suburb,
                        content.areaServed,
                        siteStats.reviewCount
                    ),
                    breadcrumbSchema([
                        { name: 'Home', url: '/' },
                        { name: 'Locations', url: '/tutoring-canley-heights' },
                        { name: content.suburb, url: content.path },
                    ]),
                ]}
            />
            <NavigationNew />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
                {/* Hero */}
                <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 pb-24 mb-16">
                    <div className="absolute inset-0">
                        <img
                            src={content.heroImage}
                            alt={`DA Tuition — serving ${content.suburb}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply" />
                        <div className={`absolute inset-0 ${content.heroGradient} mix-blend-overlay`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-transparent" />
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
                        <Badge className="mb-6 px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-md font-semibold">
                            {content.heroBadge}
                        </Badge>

                        <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
                            {content.heroHeadline}
                            <span className="block text-2xl lg:text-4xl mt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                                {content.heroSubheadline}
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
                            {content.heroParagraph}
                        </p>
                    </div>
                </section>
            </div>

            {/* Travel info ribbon */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-4 text-center">
                    <p className="text-brand-navy font-semibold">
                        <Navigation className="inline-block w-4 h-4 mr-2 mb-1" />
                        {content.travelInfo}
                    </p>
                </div>
            </div>

            {/* NAP card with map (always points to Canley Heights — the actual physical centre) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mb-16">
                <Card className="max-w-4xl mx-auto shadow-xl">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold mb-6 text-center">Visit Our Canley Heights Centre</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="text-left space-y-4">
                                <div className="flex items-start">
                                    <MapPin className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Address</p>
                                        <p className="text-brand-midnight/80">Level 1/229 Canley Vale Rd</p>
                                        <p className="text-brand-midnight/80">Canley Heights NSW 2166</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Clock className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Opening Hours</p>
                                        <p className="text-brand-midnight/80">Tue-Fri: 5:00pm - 9:00pm</p>
                                        <p className="text-brand-midnight/80">Sat: 9:00am - 6:00pm</p>
                                        <p className="text-brand-midnight/80">Sun: 10:00am - 7:00pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Phone className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Contact</p>
                                        <p className="text-brand-midnight/80">0401 940 207</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-100 rounded-lg p-0 overflow-hidden h-64 shadow-inner border border-gray-200">
                                <iframe
                                    title={`DA Tuition Canley Heights Map — serving ${content.suburb}`}
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.393457591605!2d150.93299447668636!3d-33.882098619623864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129665c58965c5%3A0x1c1c1c1c1c1c1c1c!2s229%20Canley%20Vale%20Rd%2C%20Canley%20Heights%20NSW%202166!5e0!3m2!1sen!2sau!4v1711900000000!5m2!1sen!2sau"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="btn-primary group"
                                onClick={() => (window.location.href = '/#contact')}
                            >
                                Book Interview
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <a href="tel:0401940207">
                                <Button size="lg" variant="outline">
                                    Call Now: 0401 940 207
                                </Button>
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Intro — unique per suburb */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-6 text-center">{content.introHeading}</h2>
                    <div className="space-y-4 text-lg text-brand-midnight/80 leading-relaxed">
                        {content.introParagraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why families choose us — shared 3 cards */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Why Families From {content.suburb} Choose DA Tuition</h2>
                        <p className="text-xl text-brand-midnight/80">Your trusted local education partner</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <Card className="hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <Trophy className="w-12 h-12 text-yellow-500 mb-4" />
                                <CardTitle>Proven Local Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-brand-midnight/80 mb-4">
                                    Thousands of local students have achieved their academic goals with us,
                                    including {siteStats.atar95Plus} students with 95+ ATARs and {siteStats.band6Results} Band 6 HSC results.
                                </p>
                                <Badge className="bg-green-100 text-green-800">2025 Award Winner</Badge>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <Users className="w-12 h-12 text-blue-500 mb-4" />
                                <CardTitle>Community Trusted</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-brand-midnight/80 mb-4">
                                    Recommended by local schools and trusted by over {siteStats.reviewCount} Fairfield area families.
                                    Our reputation is built on two decades of exceptional results.
                                </p>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <MapPin className="w-12 h-12 text-green-500 mb-4" />
                                <CardTitle>Easy to Reach</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-brand-midnight/80 mb-4">
                                    {content.travelInfo} Free parking and a safe drop-off zone right outside our entrance.
                                </p>
                                <Badge className="bg-blue-100 text-blue-800">Free Parking</Badge>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Schools we serve */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">{content.suburb} Schools We Support</h2>
                        <p className="text-xl text-brand-midnight/80">Helping students from every local school succeed</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.nearbySchools.map((school, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <School className="w-8 h-8 text-blue-600 mb-3" />
                                    <h3 className="font-semibold mb-2">{school.name}</h3>
                                    <div className="flex items-center justify-between text-sm">
                                        {school.distance && (
                                            <span className="text-brand-midnight/80">{school.distance} from our centre</span>
                                        )}
                                        <Badge variant="outline">{school.type}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transport */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Getting Here From {content.suburb}</h2>
                        <p className="text-xl text-brand-midnight/80">Easy access by car, train, bus, or on foot</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {content.transportOptions.map((option, index) => {
                            const Icon = transportIconMap[option.icon];
                            return (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6 text-center">
                                        <Icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                        <h3 className="font-semibold mb-2">{option.type}</h3>
                                        <p className="text-brand-midnight/80 text-sm">{option.details}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Success stories */}
            {content.successStories.length > 0 && (
                <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4">Real Stories From DA Tuition Students</h2>
                            <p className="text-xl opacity-90">Verified testimonials from students we have worked with</p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {content.successStories.map((story, index) => (
                                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-white/20 text-white">{story.year}</Badge>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <CardTitle className="text-white mt-3">{story.student}</CardTitle>
                                        <p className="text-white/80 text-sm">{story.school}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-white font-semibold mb-3">{story.achievement}</p>
                                        <p className="text-white/90 italic">&ldquo;{story.quote}&rdquo;</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* About */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8">
                                <h3 className="text-2xl font-bold mb-4">{content.aboutHeading}</h3>
                                {content.aboutParagraphs.map((p, i) => (
                                    <p key={i} className="text-lg mb-4 last:mb-0">
                                        {p}
                                    </p>
                                ))}
                            </div>

                            <div className="p-8">
                                <h4 className="font-bold mb-4">What {content.suburb} families tell us they value:</h4>
                                <div className="space-y-3">
                                    {[
                                        'Small groups of 3–5 students so every child is seen and known',
                                        'Band 6 subject teachers who know the NSW syllabus inside out',
                                        'Regular progress reports and honest parent conversations',
                                        'A purpose-built centre with quiet study areas and modern classrooms',
                                        'Safe, supervised environment with CCTV and secure entry',
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Other locations */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Other Areas We Serve</h2>
                        <p className="text-lg text-brand-midnight/80">
                            We also support families from these nearby suburbs
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                        <Link
                            to="/tutoring-canley-heights"
                            className="group block bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 text-center transition-all"
                        >
                            <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                            <p className="font-semibold text-sm group-hover:text-blue-700">Canley Heights</p>
                            <p className="text-xs text-brand-midnight/60">Main centre</p>
                        </Link>
                        {otherLocations.map((loc) => (
                            <Link
                                key={loc.slug}
                                to={loc.path}
                                className="group block bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 text-center transition-all"
                            >
                                <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                                <p className="font-semibold text-sm group-hover:text-blue-700">{loc.suburb}</p>
                                <p className="text-xs text-brand-midnight/60">Service area</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-xl text-brand-midnight/80 mb-8">
                        Book your interview at our Canley Heights centre and discover why {content.suburb} families
                        have trusted DA Tuition for nearly 20 years.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="btn-primary group"
                            onClick={() => (window.location.href = '/#contact')}
                        >
                            Book Interview
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() =>
                                window.open(
                                    'https://maps.google.com/?q=229+Canley+Vale+Rd+Canley+Heights+NSW+2166',
                                    '_blank'
                                )
                            }
                        >
                            Get Directions
                        </Button>
                    </div>

                    <p className="mt-6 text-sm text-brand-midnight/70">
                        Level 1/229 Canley Vale Rd, Canley Heights NSW 2166 • 0401 940 207
                    </p>
                </div>
            </section>

            <FooterNew />
        </div>
    );
};

export default LocationPageTemplate;
