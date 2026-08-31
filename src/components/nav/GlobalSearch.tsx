import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchSite } from '@/lib/siteSearch';

interface GlobalSearchProps {
  mobile?: boolean;
  initialOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onResultClick?: () => void;
}

const GlobalSearch = ({ mobile = false, initialOpen = false, onOpenChange, onResultClick }: GlobalSearchProps) => {
  const [open, setOpen] = useState(initialOpen);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const results = query.trim() ? searchSite(query).slice(0, 6) : [];

  useLayoutEffect(() => {
    if (mobile || !open || !results.length) return;
    const update = () => setDropdownRect(rootRef.current?.getBoundingClientRect() ?? null);
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [mobile, open, results.length]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(-1);
    onOpenChange?.(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [onOpenChange]);
  const reveal = useCallback(() => {
    setOpen(true);
    onOpenChange?.(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [onOpenChange]);

  useEffect(() => {
    if (initialOpen) reveal();
  }, [initialOpen, reveal]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('mousedown', dismiss);
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('mousedown', dismiss);
      document.removeEventListener('keydown', keydown);
    };
  }, [close, open]);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      document.getElementById(`${listId}-${activeIndex}`)?.click();
    }
  };

  const field = (
    <div className={`relative flex h-10 items-center border border-brand-gold/35 bg-[#fffaf0] text-brand-navy shadow-sm ${mobile ? 'w-full px-3' : 'w-full px-2.5'}`}>
      <Search className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
      <label className="sr-only" htmlFor={listId}>Search DA Tuition</label>
      <input
        ref={inputRef}
        id={listId}
        type="search"
        value={query}
        onChange={(event) => { setQuery(event.target.value); setActiveIndex(-1); }}
        onKeyDown={onInputKeyDown}
        placeholder="Search DA Tuition..."
        aria-controls={results.length ? `${listId}-results` : undefined}
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-brand-navy/60"
        autoComplete="off"
      />
      <button type="button" onClick={() => query ? setQuery('') : close()} aria-label={query ? 'Clear search' : 'Close search'} className="grid h-8 w-8 shrink-0 place-items-center text-brand-navy/70 transition-colors hover:bg-brand-gold/15 hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <div ref={rootRef} className={mobile ? 'w-full' : 'relative h-10 w-10 shrink-0'} role="search">
      {!open ? (
        <button ref={triggerRef} type="button" onClick={reveal} aria-label="Search DA Tuition" className="grid h-10 w-10 place-items-center text-brand-navy transition-colors hover:bg-brand-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f1e7]">
          <Search className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      ) : <div className={mobile ? '' : 'absolute right-0 top-0 w-[23rem]'}>{field}</div>}
      {open && results.length > 0 && (mobile || dropdownRect) && (mobile ? (
        <div id={`${listId}-results`} role="listbox" aria-label="Search results" className="z-[80] mt-2 w-full overflow-hidden border border-brand-gold/30 bg-[#fffaf0] shadow-lg">
          {results.map((result, index) => (
            <Link id={`${listId}-${index}`} role="option" aria-selected={activeIndex === index} key={result.href} to={result.href} onMouseEnter={() => setActiveIndex(index)} onClick={() => { onResultClick?.(); close(); }} className={`block border-b border-brand-navy/10 px-4 py-3 last:border-b-0 focus:outline-none focus-visible:bg-brand-gold/15 ${activeIndex === index ? 'bg-brand-gold/10' : 'hover:bg-brand-gold/10'}`}><span className="block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-gold">{result.kind}</span><span className="mt-0.5 block text-sm font-semibold text-brand-navy">{result.title}</span><span className="mt-0.5 block text-xs text-brand-navy/65">{result.breadcrumb}</span></Link>
          ))}
        </div>
      ) : createPortal(
        <div id={`${listId}-results`} role="listbox" aria-label="Search results" className="fixed z-[100] w-[23rem] overflow-hidden border border-brand-gold/30 bg-[#fffaf0] shadow-lg" style={{ top: dropdownRect!.bottom + 8, left: dropdownRect!.right - 368 }}>
          {results.map((result, index) => (
            <Link
              id={`${listId}-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              key={result.href}
              to={result.href}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => { onResultClick?.(); close(); }}
              className={`block border-b border-brand-navy/10 px-4 py-3 last:border-b-0 focus:outline-none focus-visible:bg-brand-gold/15 ${activeIndex === index ? 'bg-brand-gold/10' : 'hover:bg-brand-gold/10'}`}
            >
              <span className="block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-gold">{result.kind}</span>
              <span className="mt-0.5 block text-sm font-semibold text-brand-navy">{result.title}</span>
              <span className="mt-0.5 block text-xs text-brand-navy/65">{result.breadcrumb}</span>
            </Link>
          ))}
        </div>, document.body
      ))}
    </div>
  );
};

export default GlobalSearch;
