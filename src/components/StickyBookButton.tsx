import { useState } from 'react';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const StickyBookButton = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to="/book-interview"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="site-sticky-book-button fixed bottom-6 right-6 z-50 flex items-center overflow-hidden rounded-full shadow-2xl transition-all duration-300 ease-in-out"
      style={{
        backgroundColor: '#D4AF37',
        width: hovered ? '180px' : '56px',
        height: '56px',
      }}
    >
      {/* Phone icon — always visible */}
      <span
        className="flex items-center justify-center shrink-0 text-[#0A1B34]"
        style={{ width: '56px', height: '56px' }}
      >
        <Phone className="w-5 h-5" />
      </span>

      {/* Label — fades in on hover */}
      <span
        className="text-[#0A1B34] font-black uppercase tracking-[0.08em] text-xs whitespace-nowrap pr-6 transition-opacity duration-200"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        Book Interview
      </span>
    </Link>
  );
};

export default StickyBookButton;
