import { Phone, MapPin, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const FooterNew = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-gray-300" style={{ background: '#0A1B34' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <img 
              src="/lovable-uploads/7692e107-bde1-4906-b047-2458fe6a81ca.png" 
              alt="DA Tuition Logo" 
              className="h-16 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Award-winning education center specializing in exam excellence through our unique curriculum and teaching methodology.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Outstanding Education Service 2025</span>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-bold mb-6">Programs</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/hsc-excellence" className="hover:text-white transition-colors">
                  HSC Excellence
                </Link>
              </li>
              <li>
                <Link to="/programs/primary-school" className="hover:text-white transition-colors">
                  Primary School (K-6)
                </Link>
              </li>
              <li>
                <Link to="/programs/high-school" className="hover:text-white transition-colors">
                  High School (7-10)
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-6">About DA</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/our-approach" className="hover:text-white transition-colors">
                  Our Approach
                </Link>
              </li>
              <li>
                <Link to="/our-teachers" className="hover:text-white transition-colors">
                  Our Teachers
                </Link>
              </li>
              <li>
                <Link to="/learning-formats" className="hover:text-white transition-colors">
                  Learning Formats
                </Link>
              </li>
              <li>
                <Link to="/principal-reflections" className="hover:text-white transition-colors">
                  Principal's Reflection
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-white font-bold mb-6">Locations</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/tutoring-canley-heights" className="hover:text-white transition-colors">
                  Canley Heights
                </Link>
              </li>
              <li>
                <Link to="/tutoring-cabramatta" className="hover:text-white transition-colors">
                  Cabramatta
                </Link>
              </li>
              <li>
                <Link to="/tutoring-fairfield" className="hover:text-white transition-colors">
                  Fairfield
                </Link>
              </li>
              <li>
                <Link to="/tutoring-canley-vale" className="hover:text-white transition-colors">
                  Canley Vale
                </Link>
              </li>
              <li>
                <Link to="/tutoring-smithfield" className="hover:text-white transition-colors">
                  Smithfield
                </Link>
              </li>
              <li>
                <Link to="/tutoring-lansvale" className="hover:text-white transition-colors">
                  Lansvale
                </Link>
              </li>
            </ul>
          </div>

          {/* Success & Resources */}
          <div>
            <h3 className="text-white font-bold mb-6">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/success-stories" className="hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors">
                  Parent Reviews
                </Link>
              </li>
              <li>
                <Link to="/appreciation-advice" className="hover:text-white transition-colors">
                  Student Messages
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-white transition-colors">
                  Articles & Guides
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">Contact</h3>
            <div className="space-y-4 text-sm">
              <a 
                href="tel:0401940207"
                className="flex items-start hover:text-white transition-colors"
              >
                <Phone size={18} className="mr-3 mt-0.5 text-brand-blue-light flex-shrink-0" />
                <span>0401 940 207</span>
              </a>
              
              <div className="flex items-start">
                <MapPin size={18} className="mr-3 mt-0.5 text-brand-blue-light flex-shrink-0" />
                <div>
                  <Link to="/tutoring-canley-heights" className="hover:text-white transition-colors">
                    Level 1/229 Canley Vale Rd<br />
                    Canley Heights NSW 2166
                  </Link>
                </div>
              </div>

              <div className="flex items-start">
                <Clock size={18} className="mr-3 mt-0.5 text-brand-blue-light flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Business Hours</p>
                  <p>Tue-Fri: 5pm - 9pm</p>
                  <p>Sat: 9am - 6pm</p>
                  <p>Sun: 10am - 7pm</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Subject Links */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <h4 className="text-white font-bold mb-4">Subjects We Teach</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/subjects/mathematics" className="hover:text-white transition-colors">Mathematics</Link>
            <span className="text-gray-500">•</span>
            <Link to="/subjects/english" className="hover:text-white transition-colors">English</Link>
            <span className="text-gray-500">•</span>
            <Link to="/subjects/science" className="hover:text-white transition-colors">Science</Link>
            <span className="text-gray-500">•</span>
            <Link to="/subjects/business-studies" className="hover:text-white transition-colors">Business Studies</Link>
            <span className="text-gray-500">•</span>
            <Link to="/subjects/legal-studies" className="hover:text-white transition-colors">Legal Studies</Link>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">Physics • Chemistry • Biology</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {/* TODO: Replace with real ABN before launch */}
              © {currentYear} DA Tuition. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <Link to="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
