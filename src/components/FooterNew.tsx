import type { ReactNode } from 'react';
import { Phone, MapPin, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const GOLD = '#c9a227';

const ColumnHeading = ({ children }: { children: ReactNode }) => (
  <h3 className="mb-6 flex items-center gap-2.5 font-bold text-white">
    <span className="h-[2px] w-5 shrink-0" style={{ background: GOLD }} />
    {children}
  </h3>
);

const FooterNew = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-gray-300" style={{ background: '#071629' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <img
              src="/lovable-uploads/7692e107-bde1-4906-b047-2458fe6a81ca.png"
              alt="DA Tuition Logo"
              className="h-16 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-gray-400 mb-6 leading-relaxed text-sm max-w-sm">
              Award-winning education center specializing in exam excellence through our unique curriculum and teaching methodology.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5" style={{ color: GOLD }} />
              <span className="text-sm">Outstanding Education Service 2025</span>
            </div>
          </div>

          {/* Programs */}
          <div>
            <ColumnHeading>Programs</ColumnHeading>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/hsc-excellence" className="hover:text-[#c9a227] transition-colors">
                  HSC Excellence
                </Link>
              </li>
              <li>
                <Link to="/programs/primary-school" className="hover:text-[#c9a227] transition-colors">
                  Primary School (K-6)
                </Link>
              </li>
              <li>
                <Link to="/programs/high-school" className="hover:text-[#c9a227] transition-colors">
                  High School (7-10)
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <ColumnHeading>About DA</ColumnHeading>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/our-approach" className="hover:text-[#c9a227] transition-colors">
                  Our Approach
                </Link>
              </li>
              <li>
                <Link to="/our-teachers" className="hover:text-[#c9a227] transition-colors">
                  Our Teachers
                </Link>
              </li>
              <li>
                <Link to="/learning-formats" className="hover:text-[#c9a227] transition-colors">
                  Learning Formats
                </Link>
              </li>
              <li>
                <Link to="/principal-reflections" className="hover:text-[#c9a227] transition-colors">
                  Principal's Reflection
                </Link>
              </li>
              <li>
                <Link to="/principal-interview-paper" className="hover:text-[#c9a227] transition-colors">
                  Principal's Interview
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <ColumnHeading>Resources</ColumnHeading>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/success-stories" className="hover:text-[#c9a227] transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-[#c9a227] transition-colors">
                  Articles & Guides
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#c9a227] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <ColumnHeading>Contact</ColumnHeading>
            <div className="space-y-4 text-sm">
              <a
                href="tel:0401940207"
                className="flex items-start hover:text-[#c9a227] transition-colors"
              >
                <Phone size={18} className="mr-3 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
                <span>0401 940 207</span>
              </a>

              <div className="flex items-start">
                <MapPin size={18} className="mr-3 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
                <div>
                  <Link to="/tutoring-canley-heights" className="hover:text-[#c9a227] transition-colors">
                    Level 1/229 Canley Vale Rd<br />
                    Canley Heights NSW 2166
                  </Link>
                </div>
              </div>

              <div className="flex items-start">
                <Clock size={18} className="mr-3 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
                <div>
                  <p className="font-semibold mb-1 text-white">Business Hours</p>
                  <p>Tue-Fri: 5pm - 9pm</p>
                  <p>Sat: 9am - 6pm</p>
                  <p>Sun: 10am - 7pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Links */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <ColumnHeading>Subjects We Teach</ColumnHeading>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/subjects/mathematics" className="hover:text-[#c9a227] transition-colors">Mathematics</Link>
            <span className="text-gray-600">•</span>
            <Link to="/subjects/english" className="hover:text-[#c9a227] transition-colors">English</Link>
            <span className="text-gray-600">•</span>
            <Link to="/subjects/science" className="hover:text-[#c9a227] transition-colors">Science</Link>
            <span className="text-gray-600">•</span>
            <Link to="/subjects/business-studies" className="hover:text-[#c9a227] transition-colors">Business Studies</Link>
            <span className="text-gray-600">•</span>
            <Link to="/subjects/legal-studies" className="hover:text-[#c9a227] transition-colors">Legal Studies</Link>
            <span className="text-gray-600">•</span>
            <span className="text-gray-500">Physics • Chemistry • Biology</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {/* TODO: Replace with real ABN before launch */}
              © {currentYear} DA Tuition. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-[#c9a227] text-sm transition-colors">Privacy Policy</Link>
              <a href="/sitemap.xml" className="text-gray-400 hover:text-[#c9a227] text-sm transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
