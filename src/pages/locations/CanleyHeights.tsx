import React from 'react';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Phone, Car, Train, School, Users, Trophy, Star, CheckCircle, ArrowRight, Navigation } from 'lucide-react';
import { siteStats } from '@/data/site-stats';
import { educationalOrganizationSchema, breadcrumbSchema } from '@/lib/seo/schema';

const CanleyHeights = () => {
  const nearbySchools = [
    { name: "Canley Vale High School", distance: "800m", type: "Public" },
    { name: "Fairfield High School", distance: "2.3km", type: "Public" },
    { name: "Fairvale High School", distance: "3.1km", type: "Public" },
    { name: "Freeman Catholic College", distance: "1.8km", type: "Private" },
    { name: "Canley Heights Public School", distance: "500m", type: "Primary" },
    { name: "St Johns Park High School", distance: "3.5km", type: "Public" },
    { name: "Cabramatta High School", distance: "2.8km", type: "Public" },
    { name: "Lansvale Public School", distance: "2.2km", type: "Primary" }
  ];

  const transportOptions = [
    { type: "Train", details: "Canley Vale Station - 5 min walk", icon: Train },
    { type: "Bus", details: "Routes 802, 803, 804 stop nearby", icon: Navigation },
    { type: "Parking", details: "Free 2-hour street parking available", icon: Car },
    { type: "Drop-off", details: "Convenient drop-off zone at entrance", icon: MapPin }
  ];

  const localSuccess = [
    {
      student: "Jessica L.",
      school: "Canley Vale High School",
      achievement: "99.85 ATAR - Medicine at UNSW",
      year: "2024",
      quote: "DA Tuition's location was so convenient - just a 10-minute walk from school!"
    },
    {
      student: "Michael N.",
      school: "Fairfield High School",
      achievement: "99.25 ATAR - Medicine at UNSW",
      year: "2024",
      quote: "The Canley Heights centre became my second home during Year 6 preparation."
    },
    {
      student: "Sarah C.",
      school: "Freeman Catholic College",
      achievement: "Band 6 in All Subjects",
      year: "2023",
      quote: "Being so close to home meant I could attend extra sessions easily."
    }
  ];

  const programs = [
    { name: "Primary School Excellence", availability: "Limited spots", popular: true },
    { name: "High School Programs", availability: "3 spots left", popular: true },
    { name: "HSC Excellence", availability: "Open enrollment", popular: false },
    { name: "Primary School Support", availability: "Open enrollment", popular: false },
    { name: "High School (7-10)", availability: "Limited spots", popular: false }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Tutoring in Canley Heights — K-12 & HSC"
        description="Visit our Canley Heights tutoring centre for expert K-12 support. Conveniently located on Canley Vale Rd, we've helped Fairfield families achieve academic excellence since 2005."
        canonicalUrl="/tutoring-canley-heights"
        jsonLd={[
          educationalOrganizationSchema(siteStats.reviewCount),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Locations', url: '/tutoring-canley-heights' },
            { name: 'Canley Heights', url: '/tutoring-canley-heights' },
          ]),
        ]}
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero Section with Local Focus */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 pb-24 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/hero_entrance.jpg" alt="DA Tuition Canley Heights" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            {/* Friendly vibrant pastel glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-blue-500/30 to-cyan-400/40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <Badge className="mb-6 px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-md font-semibold">
              Serving Canley Heights & Surrounds Since 2005
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Tutoring in Canley Heights
              <span className="block text-4xl lg:text-5xl mt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                Your Local Education Excellence Centre
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
              Conveniently located at Level 1/229 Canley Vale Rd, DA Tuition Canley Heights
              has been helping local students achieve academic excellence for nearly 20 years.
            </p>
          </div>
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-20 mb-16">
        {/* Location Card */}
        <Card className="max-w-4xl mx-auto shadow-xl">
          <CardContent className="p-8">
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
                    <p className="text-brand-midnight/80">canleyheights@datuition.com.au</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-0 overflow-hidden h-64 shadow-inner border border-gray-200">
                <iframe
                  title="DA Tuition Canley Heights Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.393457591605!2d150.93299447668636!3d-33.882098619623864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129665c58965c5%3A0x1c1c1c1c1c1c1c1c!2s229%20Canley%20Vale%20Rd%2C%20Canley%20Heights%20NSW%202166!5e0!3m2!1sen!2sau!4v1711900000000!5m2!1sen!2sau"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:0401940207">
                <Button size="lg" variant="outline">
                  Call Now: 0401 940 207
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Why Choose Canley Heights */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Canley Heights Families Choose DA Tuition</h2>
            <p className="text-xl text-brand-midnight/80">Your trusted local education partner</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <Trophy className="w-12 h-12 text-yellow-500 mb-4" />
                <CardTitle>Outstanding Local Results</CardTitle>
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
                <CardTitle>Perfect Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-brand-midnight/80 mb-4">
                  Central Canley Heights location with easy access from all surrounding suburbs.
                  Walking distance from Canley Vale station and major bus routes.
                </p>
                <Badge className="bg-blue-100 text-blue-800">Free Parking</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section >

      {/* Schools We Serve */}
      < section className="py-16 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Schools We Serve</h2>
            <p className="text-xl text-brand-midnight/80">Supporting students from all local schools</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbySchools.map((school, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <School className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold mb-2">{school.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-midnight/80">{school.distance} away</span>
                    <Badge variant="outline">{school.type}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-brand-midnight/80">
              Plus students from: Cabramatta, Lansvale, Wakeley, Wetherill Park, and surrounding areas
            </p>
          </div>
        </div>
      </section >

      {/* Transport & Access */}
      < section className="py-16 bg-gray-50" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Easy to Get Here</h2>
            <p className="text-xl text-brand-midnight/80">Convenient transport options for every family</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transportOptions.map((option, index) => {
              const Icon = option.icon;
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
      </section >

      {/* Local Success Stories */}
      < section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Canley Heights Success Stories</h2>
            <p className="text-xl opacity-90">Local students achieving extraordinary results</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {localSuccess.map((story, index) => (
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
                  <p className="text-white/90 italic">"{story.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section >

      {/* Programs Available */}
      < section className="py-16 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Programs at Canley Heights</h2>
            <p className="text-xl text-brand-midnight/80">Comprehensive tutoring for all ages and stages</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {programs.map((program, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                        <div>
                          <h3 className="font-semibold text-lg">{program.name}</h3>
                          <p className="text-brand-midnight/80">{program.availability}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {program.popular && (
                          <Badge className="bg-yellow-100 text-yellow-800">Popular</Badge>
                        )}
                        <Button variant="outline">Learn More</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section >

      {/* Why This Location */}
      < section className="py-16 bg-gray-50" >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8">
                <h3 className="text-2xl font-bold mb-4">About DA Tuition Canley Heights</h3>
                <p className="text-lg mb-4">
                  For nearly 20 years, DA Tuition Canley Heights has been the cornerstone of educational
                  excellence in the Fairfield area. Our centre has grown from a small tutoring service to
                  the region's most trusted education provider, helping thousands of local students achieve
                  their academic dreams.
                </p>
                <p className="text-lg">
                  Located in the heart of Canley Heights, we understand the unique needs of our multicultural
                  community. Our teachers speak multiple languages and bring diverse perspectives that resonate
                  with local families.
                </p>
              </div>

              <div className="p-8">
                <h4 className="font-bold mb-4">What Makes Our Canley Heights Centre Special:</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Purpose-built learning spaces with modern technology</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Quiet study areas for HSC students</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Safe, supervised environment with CCTV</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Convenient lift access to Level 1</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Parent waiting area with free WiFi</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section >

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">
            Join {siteStats.reviewCount} Canley Heights Families
          </h2>
          <p className="text-xl text-brand-midnight/80 mb-8">
            Experience why we're Fairfield's most trusted tutoring centre.
            Book your {siteStats.tuitionSince === "2005" ? "assessment" : "session"} at our Canley Heights location today.
          </p>

          <Card className="bg-blue-50 border-blue-200 mb-8">
            <CardContent className="p-6">
              <p className="text-lg font-semibold text-blue-900 mb-2">Limited Spots Available</p>
              <p className="text-blue-700">
                HSC and primary school programs filling fast. Secure your spot now.
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open('https://maps.google.com/?q=229+Canley+Vale+Rd+Canley+Heights+NSW+2166', '_blank')}
            >
              Get Directions to Centre
            </Button>
          </div>

          <p className="mt-6 text-sm text-brand-midnight/70">
            Level 1/229 Canley Vale Rd, Canley Heights NSW 2166 • 0401 940 207
          </p>
        </div>
      </section >

      <FooterNew />
    </div >
  );
};

export default CanleyHeights;