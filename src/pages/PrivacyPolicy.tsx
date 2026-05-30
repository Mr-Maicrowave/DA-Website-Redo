import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { contactInfo } from '@/data/business-info';

const LAST_UPDATED = '8 April 2026';
const PHONE_TEL = `tel:${contactInfo.phone.replace(/\s/g, '')}`;
const HOURS_LINE = `${contactInfo.hours.weekday}, ${contactInfo.hours.saturday}, ${contactInfo.hours.sunday}`;

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Privacy Policy"
        description="DA Tuition's privacy policy. How we collect, use, store, and protect your personal information in accordance with the Australian Privacy Act 1988."
        canonicalUrl="/privacy-policy"
      />
      <NavigationNew />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <header className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-brand-midnight mb-4">Privacy Policy</h1>
          <p className="text-sm text-brand-midnight/60">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p>
            DA Tuition ("we", "us", "our") is committed to protecting the privacy of the families we serve.
            This Privacy Policy explains how we collect, use, hold, disclose, and protect your personal
            information in accordance with the <strong>Australian Privacy Act 1988 (Cth)</strong> and the
            13 Australian Privacy Principles (APPs).
          </p>

          <h2>1. What we collect</h2>
          <p>We collect personal information that is necessary to provide tutoring services. This includes:</p>
          <ul>
            <li><strong>Parent/guardian details:</strong> name, phone number, email address, suburb</li>
            <li><strong>Student details:</strong> name, age, year level, school, learning needs, subjects of interest</li>
            <li><strong>Booking and enrolment information:</strong> assessment bookings, class enrolments, attendance, payments</li>
            <li><strong>Communications:</strong> emails, phone calls, messages exchanged with our staff</li>
            <li><strong>Website analytics:</strong> pages visited, device type, approximate location (city-level), referring source — collected via Google Analytics 4 (see Section 6)</li>
          </ul>

          <h2>2. How we collect it</h2>
          <p>We collect information directly from you when you:</p>
          <ul>
            <li>Book an interview through our website at <Link to="/interview">datuition.com.au/interview</Link></li>
            <li>Call or message us on {contactInfo.phone}</li>
            <li>Visit our centre at {contactInfo.address}</li>
            <li>Browse our website (analytics cookies — see Section 6)</li>
          </ul>

          <h2>3. Why we collect it</h2>
          <p>We use your personal information to:</p>
          <ul>
            <li>Schedule and deliver tutoring assessments and classes</li>
            <li>Communicate with you about your child's progress</li>
            <li>Process payments and maintain enrolment records</li>
            <li>Comply with our legal and regulatory obligations as an Australian education provider</li>
            <li>Improve our website and service offering (anonymised analytics only)</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your personal information, and we do not share it with third parties
            for marketing purposes.
          </p>

          <h2>4. How we store and protect it</h2>
          <p>
            Personal information is stored on secure systems and is accessible only to authorised DA Tuition staff
            who need it to perform their duties. We retain enrolment records for the period required by Australian
            tax and education law, and we securely destroy personal information when it is no longer needed.
          </p>
          <p>
            Despite reasonable security measures, no system is completely secure. If a data breach occurs that is
            likely to result in serious harm, we will notify affected individuals and the Office of the Australian
            Information Commissioner (OAIC) in accordance with the Notifiable Data Breaches scheme.
          </p>

          <h2>5. Reviews and testimonials</h2>
          <p>
            DA Tuition publishes verified Google reviews and family testimonials on our website. We only publish
            reviews and testimonials with the consent of the person who provided them. If you would like a review
            or testimonial about you or your child removed, please contact us using the details in Section 9.
          </p>

          <h2>6. Cookies and Google Analytics</h2>
          <p>
            Our website uses <strong>Google Analytics 4 (GA4)</strong> to understand how visitors find and use our
            site. GA4 sets first-party cookies (typically named <code>_ga</code> and <code>_ga_*</code>) and collects:
          </p>
          <ul>
            <li>Pages you visit and how long you spend on them</li>
            <li>Device and browser type</li>
            <li>Approximate location (city-level only — your exact IP address is not stored by GA4)</li>
            <li>How you arrived at our site (search engine, direct visit, referral)</li>
          </ul>
          <p>
            This data is aggregated and used for website improvement only. It is stored on Google servers and is
            subject to Google's own privacy policy. You can opt out by:
          </p>
          <ul>
            <li>Installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
            <li>Enabling "Do Not Track" in your browser settings</li>
            <li>Blocking cookies from datuition.com.au in your browser</li>
          </ul>
          <p>
            We do not use Google Analytics for advertising, remarketing, or cross-site tracking. We do not enable
            Google Signals or share data with Google Ads.
          </p>

          <h2>7. Disclosure to third parties</h2>
          <p>We only disclose your personal information to:</p>
          <ul>
            <li><strong>Service providers</strong> who help us operate the business (e.g. payment processors, email providers, website hosting), under confidentiality obligations</li>
            <li><strong>Google Analytics</strong> (anonymised website usage data only — see Section 6)</li>
            <li><strong>Government or law enforcement</strong> if required by Australian law</li>
          </ul>
          <p>We do not transfer personal information overseas except as part of standard cloud service operations (e.g. Google Analytics servers in the United States).</p>

          <h2>8. Your rights</h2>
          <p>Under the Australian Privacy Principles, you have the right to:</p>
          <ul>
            <li><strong>Access</strong> the personal information we hold about you or your child</li>
            <li><strong>Correct</strong> any inaccurate or out-of-date information</li>
            <li><strong>Request deletion</strong> of personal information that is no longer needed</li>
            <li><strong>Lodge a complaint</strong> with us, or with the OAIC if you believe we have breached the APPs</li>
          </ul>
          <p>To exercise any of these rights, contact us using the details below. We will respond within a reasonable time, usually within 30 days.</p>

          <h2>9. Contact us</h2>
          <p>If you have any questions about this Privacy Policy or how we handle your personal information, please contact us:</p>
          <ul>
            <li><strong>Phone:</strong> <a href={PHONE_TEL}>{contactInfo.phone}</a></li>
            <li><strong>Address:</strong> {contactInfo.address}</li>
            <li><strong>Hours:</strong> {HOURS_LINE}</li>
          </ul>

          <h2>10. External complaint resolution</h2>
          <p>
            If you are not satisfied with how we handle a privacy complaint, you can contact the Office of the
            Australian Information Commissioner (OAIC):
          </p>
          <ul>
            <li><strong>Website:</strong> <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">oaic.gov.au</a></li>
            <li><strong>Phone:</strong> 1300 363 992</li>
          </ul>

          <h2>11. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or in the law.
            The "Last updated" date at the top of this page indicates when the policy was last revised. Material
            changes will be highlighted on our website.
          </p>
        </div>
      </main>

      <FooterNew />
    </div>
  );
};

export default PrivacyPolicy;
