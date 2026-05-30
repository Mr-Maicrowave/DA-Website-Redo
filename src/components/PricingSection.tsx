import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { pricingData } from '@/data/pricing';

const PricingSection = () => {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden" id="pricing">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-brand-navy mb-4">Transparent, Simple Pricing</h2>
          <p className="text-lg text-brand-midnight/70">No hidden fees. Everything included in one simple rate.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Main Pricing Card */}
          <Card className="overflow-hidden border-2 border-brand-blue/10 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="bg-white border-b border-gray-100 p-8">
              <div>
                <CardTitle className="text-3xl font-bold text-brand-navy">Small Group Tutoring</CardTitle>
                <CardDescription className="text-lg mt-2">{pricingData.smallGroup.description}</CardDescription>
              </div>
              <div className="mt-4">
                <span className="text-5xl font-black text-brand-blue">${pricingData.smallGroup.price}</span>
                <span className="text-sm font-bold text-brand-midnight/50 uppercase tracking-wider ml-2">per {pricingData.smallGroup.duration} session</span>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-sm text-brand-midnight/60 mb-4">{pricingData.smallGroup.groupSize} per group</p>
              <ul className="space-y-3">
                {pricingData.smallGroup.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-brand-midnight/80">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="btn-primary w-full mt-8 shadow-lg"
                onClick={() => window.location.href = '/#contact'}
              >
                Book Interview <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="p-8 border-brand-blue/10 shadow-lg">
            <h3 className="font-bold text-brand-navy text-xl mb-4">Have questions about fees?</h3>
            <p className="text-brand-midnight/70 mb-6">
              Give us a call to discuss your child's needs and we'll find the right program for them.
            </p>
            <a href="tel:0401940207">
              <Button variant="outline" className="w-full">Call 0401 940 207</Button>
            </a>
            <p className="mt-6 text-xs text-brand-midnight/50 italic">
              *Contact us for details on scheduling and availability.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
