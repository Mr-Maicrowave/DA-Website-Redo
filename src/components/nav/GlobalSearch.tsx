import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchSite } from '@/lib/siteSearch';
import './GlobalSearch.css';

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
  const shellRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const listId = useId();
  const hasQuery = query.trim().length > 0;
  const results = hasQuery ? searchSite(query).slice(0, 6) : [];

  useLayoutEffect(() => {
    if (mobile || !open || !hasQuery) return;
    const update = () => setDropdownRect(shellRef.current?.getBoundingClientRect() ?? null);
    update();
    const resizeObserver = new ResizeObserver(update);
    if (shellRef.current) resizeObserver.observe(shellRef.current);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      resizeObserver.disconnect();
    };
  }, [hasQuery, mobile, open]);

  const close = useCallback(() => {
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    setOpen(false);
    setQuery('');
    setActiveIndex(-1);
    onOpenChange?.(false);
    closeTimerRef.current = setTimeout(() => triggerRef.current?.focus(), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 250);
  }, [onOpenChange]);
  const reveal = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpen(true);
    onOpenChange?.(true);
    // Let the shell establish its shape before a caret or placeholder appears.
    focusTimerRef.current = setTimeout(() => inputRef.current?.focus(), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 210);
  }, [onOpenChange]);

  useEffect(() => () => {
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if (initialOpen) reveal();
  }, [initialOpen, reveal]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !resultsRef.current?.contains(target)) close();
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

  const selectResult = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    // Allow React Router's Link handler to initiate navigation before this
    // component clears its transient search state.
    requestAnimationFrame(() => {
      onResultClick?.();
      close();
    });
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById(`${listId}-${activeIndex >= 0 ? activeIndex : 0}`)?.click();
    }
  };

  const field = (
    <div ref={shellRef} className={`global-search__shell relative flex h-10 items-center text-brand-navy ${mobile ? 'w-full px-3' : 'w-full'}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={reveal}
        aria-label="Search DA Tuition"
        aria-hidden={open || undefined}
        tabIndex={open ? -1 : undefined}
        className="global-search__trigger grid h-10 w-10 shrink-0 place-items-center text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f1e7]"
      >
        <Search className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
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
        className="global-search__input h-full min-w-0 flex-1 bg-transparent px-1.5 text-sm outline-none placeholder:text-brand-navy/60"
        autoComplete="off"
      />
      <button type="button" onClick={() => query ? setQuery('') : close()} aria-label={query ? 'Clear search' : 'Close search'} aria-hidden={open || mobile ? undefined : true} tabIndex={open || mobile ? undefined : -1} className="global-search__close grid h-9 w-9 shrink-0 place-items-center rounded-full text-brand-navy/70 transition-colors hover:bg-brand-gold/15 hover:text-brand-navy active:bg-brand-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );

  const emptyState = (
    <div className="px-4 py-3 text-sm text-brand-navy/75" role="status">
      <strong className="block font-semibold text-brand-navy">No clear match for “{query}”</strong>
      <span className="mt-1 block text-xs">Try another search term.</span>
    </div>
  );

  return (
    <div ref={rootRef} data-open={open} className={mobile ? 'global-search global-search--mobile w-full' : 'global-search global-search--desktop relative h-10 shrink-0'} role="search">
      {!mobile && <span className="global-search__fallback-trigger" aria-hidden="true"><Search className="h-[18px] w-[18px]" /></span>}
      {field}
      {open && hasQuery && (mobile || dropdownRect) && (mobile ? (
        <div ref={resultsRef} id={`${listId}-results`} role="listbox" aria-label="Search results" className="z-[80] mt-2 w-full overflow-hidden border border-brand-gold/30 bg-[#fffaf0] shadow-lg">
          {results.length ? results.map((result, index) => (
            <Link id={`${listId}-${index}`} role="option" aria-selected={activeIndex === index} key={result.href} to={result.href} onMouseEnter={() => setActiveIndex(index)} onClick={selectResult} className={`block border-b border-brand-navy/10 px-4 py-3 last:border-b-0 focus:outline-none focus-visible:bg-brand-gold/15 ${activeIndex === index ? 'bg-brand-gold/10' : 'hover:bg-brand-gold/10'}`}><span className="block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-gold">{result.kind}</span><span className="mt-0.5 block text-sm font-semibold text-brand-navy">{result.title}</span><span className="mt-0.5 block text-xs text-brand-navy/65">{result.breadcrumb}</span></Link>
          )) : emptyState}
        </div>
      ) : createPortal(
        <div ref={resultsRef} id={`${listId}-results`} role="listbox" aria-label="Search results" className="fixed z-[100] overflow-hidden border border-brand-gold/30 bg-[#fffaf0] shadow-lg" style={{ top: dropdownRect!.bottom + 8, left: dropdownRect!.left, width: 'min(28rem, calc(100vw - 2rem))' }}>
          {results.length ? results.map((result, index) => (
            <Link
              id={`${listId}-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              key={result.href}
              to={result.href}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={selectResult}
              className={`block border-b border-brand-navy/10 px-4 py-3 last:border-b-0 focus:outline-none focus-visible:bg-brand-gold/15 ${activeIndex === index ? 'bg-brand-gold/10' : 'hover:bg-brand-gold/10'}`}
            >
              <span className="block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-gold">{result.kind}</span>
              <span className="mt-0.5 block text-sm font-semibold text-brand-navy">{result.title}</span>
              <span className="mt-0.5 block text-xs text-brand-navy/65">{result.breadcrumb}</span>
            </Link>
          )) : emptyState}
        </div>, document.body
      ))}
    </div>
  );
};

export default GlobalSearch;
