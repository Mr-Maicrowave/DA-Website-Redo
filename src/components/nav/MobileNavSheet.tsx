import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import GlobalSearch from './GlobalSearch';

interface NavLinkItem {
  title: string;
  href: string;
}

interface MobileNavSheetProps {
  isOpen: boolean;
  searchOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  programsItems: NavLinkItem[];
  subjectsItems: NavLinkItem[];
  aboutItems: NavLinkItem[];
}

/**
 * Full-height mobile menu, rendered via portal so it sits outside #root —
 * that lets us make #root genuinely `inert` while this is open, rather
 * than relying on focus-trapping alone to keep background content out of
 * reach for keyboard and screen-reader users.
 */
const MobileNavSheet = ({
  isOpen,
  searchOpen,
  onClose,
  triggerRef,
  programsItems,
  subjectsItems,
  aboutItems,
}: MobileNavSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.getElementById('root');
    const trigger = triggerRef.current;

    if (isOpen) {
      root?.setAttribute('inert', '');
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    }

    // Runs on the way out too (isOpen: true -> false), after `root`'s
    // `inert` is removed above — restoring focus to the trigger here,
    // rather than at each individual close call site (Escape, the X
    // button, clicking a link), guarantees it happens after `inert` is
    // gone. Focusing the trigger while `#root` is still inert silently
    // fails (inert subtrees aren't focusable), which is why it was
    // landing on <body> instead.
    return () => {
      root?.removeAttribute('inert');
      document.body.style.overflow = '';
      if (isOpen) trigger?.focus();
    };
  }, [isOpen, triggerRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(); // focus restoration happens centrally once `inert` clears — see the isOpen effect above
        return;
      }

      if (event.key !== 'Tab' || !sheetRef.current) return;
      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>('a, button:not([disabled])'),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const renderGroup = (label: string, items: NavLinkItem[]) => (
    <div className="space-y-1">
      <div className="font-semibold text-brand-midnight py-2.5 border-b border-brand-gold/10">{label}</div>
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={onClose}
          className="block pl-4 text-brand-midnight/75 hover:text-brand-blue-dark py-2.5"
        >
          {item.title}
        </Link>
      ))}
    </div>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[110] bg-brand-ivory min-[1100px]:hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      ref={sheetRef}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-brand-gold/20">
          <span
            className="text-[1.08rem] font-bold text-brand-navy"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            DA <span className="text-brand-gold italic">Tuition</span>
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center text-brand-midnight/80 hover:text-brand-blue-dark"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
          {searchOpen && (
            <GlobalSearch
              mobile
              initialOpen
              onOpenChange={(open) => { if (!open) onClose(); }}
              onResultClick={onClose}
            />
          )}
          <Link
            to="/"
            onClick={onClose}
            className="block text-brand-midnight/80 hover:text-brand-blue-dark font-medium py-2.5 border-b border-brand-gold/10"
          >
            Home
          </Link>
          {renderGroup('Programs', programsItems)}
          {renderGroup('Subjects', subjectsItems)}
          {renderGroup('About', aboutItems)}
          <Link
            to="/success-stories"
            onClick={onClose}
            className="block text-brand-midnight/80 hover:text-brand-blue-dark font-medium py-2.5 border-b border-brand-gold/10"
          >
            Success Stories
          </Link>
          <div className="space-y-1">
            <div className="font-semibold text-brand-midnight py-2.5 border-b border-brand-gold/10">Resources</div>
            <Link to="/faq" onClick={onClose} className="block pl-4 text-brand-midnight/75 hover:text-brand-blue-dark py-2.5">FAQ</Link>
            <Link to="/tutoring-canley-heights" onClick={onClose} className="block pl-4 text-brand-midnight/75 hover:text-brand-blue-dark py-2.5">Our Location</Link>
            <Link to="/articles" onClick={onClose} className="block pl-4 text-brand-midnight/75 hover:text-brand-blue-dark py-2.5">Articles &amp; Guides</Link>
          </div>
          <Link
            to="/contact"
            onClick={onClose}
            className="block text-brand-midnight/80 hover:text-brand-blue-dark font-medium py-2.5 border-b border-brand-gold/10"
          >
            Contact Us
          </Link>
        </div>

        <div className="px-4 pb-4 pt-2 border-t border-brand-gold/20">
          <Link
            to="/book-interview"
            onClick={onClose}
            className="flex items-center justify-center w-full px-4 py-3.5 text-sm font-bold text-[#fff3d6] rounded-md"
            style={{ background: 'linear-gradient(135deg, #0A1B34 0%, #122b4d 100%)', border: '1px solid rgba(200,149,52,.76)' }}
          >
            Book Consultation
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default MobileNavSheet;
