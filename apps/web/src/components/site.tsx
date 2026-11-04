import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { productAreas } from '@/lib/product-areas';
import { MatchingText } from '@/components/matching-text';
import { findMatchingPassage, getPassageExcerpt, type SearchPassage } from '@/lib/product-search';

export const EASE = [0.22, 1, 0.36, 1] as const;
export const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

export function MeMark({ size = 28, color = '#17191c' }: { size?: number; color?: string }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, borderRadius: '50%', border: `${Math.max(2, size * 0.09)}px solid ${color}`, display: 'inline-grid', placeItems: 'center', boxSizing: 'border-box', flexShrink: 0 }}
    >
      <span style={{ width: '34%', height: '34%', borderRadius: '50%', background: '#1e6b66' }} />
    </span>
  );
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function ConceptLabel({ className = '' }: { className?: string }) {
  return (
    <span className={`f-mono inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground backdrop-blur ${className}`} data-testid="label-concept">
      Hardware concept render
    </span>
  );
}

const nav = [
  { href: '/', label: 'Overview' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/explore', label: 'Explore' },
  { href: '/ask', label: 'Ask Me' },
];

type SiteSearchResult = {
  label: string;
  detail: string;
  href: string;
  match?: SearchPassage;
};

export function SiteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAnnouncement, setSearchAnnouncement] = useState('');
  const [dark, setDark] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const [storageNotice, setStorageNotice] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const searchReturnFocus = useRef<HTMLElement | null>(null);
  const searchReturnFocusTestId = useRef<string | null>(null);
  const results: SiteSearchResult[] = searchQuery.trim() ? [
    ...productAreas.flatMap((area) => {
      const match = findMatchingPassage(area, searchQuery);
      return match ? [{ label: area.title, detail: area.summary, href: `/explore/${area.slug}`, match }] : [];
    }),
    ...([
      { label: 'Overview', detail: 'A home AI computer and mobile companion for the household.', href: '/' },
      { label: 'How it works', detail: 'Local models, local private chats, and approved actions.', href: '/how-it-works' },
      { label: 'Explore product areas', detail: 'Search and filter documented Me product areas.', href: '/explore' },
      { label: 'Ask about Me', detail: 'Local product Q&A using documented content only.', href: '/ask' },
      { label: 'Waitlist', detail: 'Receive Me launch updates.', href: '/signup' },
    ] as SiteSearchResult[]).filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(searchQuery.trim().toLowerCase())),
  ].slice(0, 6) : [];

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    setOpen(false);
    if (document.getElementById('mobile-site-nav')?.contains(document.activeElement)) {
      menuButton.current?.focus();
    }
    const hash = window.location.hash;
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('me-site-theme');
      if (saved === 'dark') setDark(true);
      if (saved === 'light') setDark(false);
    } catch {
      setStorageNotice(true);
    }
    setThemeReady(true);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    if (!themeReady) return;
    try {
      window.localStorage.setItem('me-site-theme', dark ? 'dark' : 'light');
    } catch {
      setStorageNotice(true);
    }
  }, [dark, themeReady]);
  useEffect(() => {
    const query = searchQuery.trim();
    if (!searchOpen || !query) {
      setSearchAnnouncement('');
      return;
    }
    const timeout = window.setTimeout(() => {
      setSearchAnnouncement(results.length === 0
        ? `No results for ${query}.`
        : `${results.length} ${results.length === 1 ? 'result' : 'results'} for ${query}.`);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [results.length, searchOpen, searchQuery]);
  const closeMenu = (afterNavigation = false) => {
    setOpen(false);
    const restoreFocus = () => {
      if (menuButton.current?.isConnected) {
        menuButton.current.focus();
      } else {
        document.querySelector<HTMLElement>('[data-testid="button-menu"]')?.focus();
      }
    };
    if (afterNavigation) window.requestAnimationFrame(restoreFocus);
    else restoreFocus();
  };
  const rememberSearchFocus = (element: HTMLElement | null) => {
    searchReturnFocus.current = element;
    searchReturnFocusTestId.current = element?.getAttribute('data-testid') ?? null;
  };
  const closeSearch = (clearQuery = false, afterNavigation = false) => {
    setSearchOpen(false);
    if (clearQuery) setSearchQuery('');
    if (afterNavigation) {
      window.requestAnimationFrame(() => {
        const returnTarget = searchReturnFocus.current;
        if (returnTarget?.isConnected) {
          returnTarget.focus();
          return;
        }
        const testId = searchReturnFocusTestId.current;
        if (testId) document.querySelector<HTMLElement>(`[data-testid="${testId}"]`)?.focus();
      });
    }
  };
  useEffect(() => {
    if (searchOpen) {
      searchInput.current?.focus();
      return;
    }
    const returnTarget = searchReturnFocus.current;
    if (returnTarget?.isConnected) {
      returnTarget.focus();
      return;
    }
    const testId = searchReturnFocusTestId.current;
    if (testId) document.querySelector<HTMLElement>(`[data-testid="${testId}"]`)?.focus();
  }, [searchOpen]);
  const toggleSearch = (button: HTMLButtonElement) => {
    if (searchOpen) {
      rememberSearchFocus(button);
      closeSearch();
      return;
    }
    rememberSearchFocus(button);
    setOpen(false);
    setSearchOpen(true);
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.key === '/' && !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName)) && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        rememberSearchFocus(document.activeElement instanceof HTMLElement ? document.activeElement : null);
        setOpen(false);
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        if (searchOpen) closeSearch();
        if (open) closeMenu();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, searchOpen]);

  return (
    <div className="site-noise min-h-[100dvh] bg-background text-foreground">
      <header className={`sticky top-0 z-40 transition-colors duration-300 ${scrolled ? 'border-b border-border bg-background/85 backdrop-blur-md' : 'border-b border-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2.5" data-testid="link-logo">
            <MeMark size={24} />
            <span className="f-display text-xl">Me</span>
          </Link>
          <nav aria-label="Primary site navigation" className="hidden items-center gap-8 md:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} data-testid={`link-nav-${n.label.toLowerCase().replace(/\s/g, '-')}`}
                className={`text-sm transition-colors ${location === n.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {n.label}
              </Link>
            ))}
            <button type="button" onClick={(event) => toggleSearch(event.currentTarget)} aria-label="Search Me site" aria-expanded={searchOpen} aria-controls={searchOpen ? 'site-search-panel' : undefined} className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" data-testid="button-global-search"><Search className="h-4 w-4" /></button>
            <button type="button" onClick={() => setDark((value) => !value)} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" data-testid="button-theme-toggle">{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
            <Link href="/signup" data-testid="link-nav-waitlist" className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-85">
              Join the waitlist
            </Link>
          </nav>
          <div className="flex items-center gap-1 md:hidden">
            <button type="button" onClick={(event) => toggleSearch(event.currentTarget)} aria-label="Search Me site" aria-expanded={searchOpen} aria-controls={searchOpen ? 'site-search-panel' : undefined} className="rounded-full p-2" data-testid="button-global-search-mobile"><Search className="h-5 w-5" /></button>
            <button type="button" onClick={() => setDark((value) => !value)} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} className="rounded-full p-2" data-testid="button-theme-toggle-mobile">{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
            <button ref={menuButton} type="button" className="rounded-full p-2" onClick={() => {
              if (open) closeMenu();
              else {
                setSearchOpen(false);
                setOpen(true);
              }
            }} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls={open ? 'mobile-site-nav' : undefined} data-testid="button-menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav id="mobile-site-nav" aria-label="Primary site navigation" className="border-t border-border bg-background px-5 pb-5 md:hidden">
            {[...nav, { href: '/signup', label: 'Join the waitlist' }].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => closeMenu(true)} className="block border-b border-border py-4 text-base" data-testid={`link-mobile-${n.href}`}>{n.label}</Link>
            ))}
          </nav>
        )}
        {searchOpen && (
          <div id="site-search-panel" className="absolute left-0 right-0 top-full border-b border-border bg-background/98 px-5 py-4 shadow-lg backdrop-blur-md md:px-8" role="dialog" aria-label="Search Me" aria-modal="false">
            <div className="mx-auto max-w-6xl">
              <p className="sr-only" aria-live="polite" aria-atomic="true" data-testid="status-global-search-results">{searchAnnouncement}</p>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input ref={searchInput} type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} aria-controls={searchQuery.trim() ? 'search-results' : undefined} aria-expanded={Boolean(searchQuery.trim())}
                  placeholder="Search documented Me product content" aria-label="Search all Me product content"
                  className="w-full rounded-full border border-input bg-card py-3 pl-11 pr-12 text-sm outline-none focus:border-accent" data-testid="input-global-search" />
                <button type="button" onClick={() => closeSearch(true)} aria-label="Close search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-secondary" data-testid="button-close-search"><X className="h-4 w-4" /></button>
              </div>
              {searchQuery.trim() && <div id="search-results" className="mt-3 max-h-[55vh] overflow-y-auto">
                {results.length ? results.map((result) => <Link key={result.href} href={result.href} onClick={() => closeSearch(false, true)} className="group flex items-center justify-between gap-4 border-b border-border py-3 last:border-0" data-testid={`link-search-${result.href.replaceAll('/', '-') || 'home'}`}>
                  <span>
                    <span className="block text-sm font-medium">{result.label}</span>
                    {result.match ? (
                      <span className="mt-1 block line-clamp-2 text-xs text-muted-foreground">
                        <span className="f-mono mr-1 text-[10px] uppercase tracking-[0.08em]">Match · {result.match.label}:</span>
                        <MatchingText text={getPassageExcerpt(result.match.text, searchQuery)} query={searchQuery} />
                      </span>
                    ) : (
                      <span className="mt-1 block line-clamp-1 text-xs text-muted-foreground">{result.detail}</span>
                    )}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
                </Link>) : <p className="py-5 text-sm text-muted-foreground">No documented matches. Try “feed”, “home”, or “approval”.</p>}
              </div>}
              {!searchQuery.trim() && <p className="mt-3 text-xs text-muted-foreground">Search product areas and routes · Press <kbd className="rounded border border-border px-1.5 py-0.5">/</kbd> anytime to open</p>}
            </div>
          </div>
        )}
      </header>
      {storageNotice && <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 pt-3 text-xs text-muted-foreground md:px-8" role="status" data-testid="status-theme-storage">
        <span>Theme choice can’t be saved on this device. Your current choice stays active until you leave.</span>
        <button type="button" onClick={() => setStorageNotice(false)} aria-label="Dismiss theme notice" className="rounded-full p-1 hover:bg-secondary"><X className="h-3.5 w-3.5" /></button>
      </div>}
      <main>{children}</main>
      <footer className="mt-24 border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
          <div>
            <div className="flex items-center gap-2.5"><MeMark size={22} /><span className="f-display text-lg">Me</span></div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Intelligence built for yourself, at home, working for yourself. A home AI computer and the app that connects your family to it.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="text-sm">
            <div className="eyebrow mb-4">Explore</div>
            <Link href="/" className="block py-1 text-muted-foreground hover:text-foreground">Overview</Link>
            <Link href="/how-it-works" className="block py-1 text-muted-foreground hover:text-foreground">How it works</Link>
            <Link href="/explore" className="block py-1 text-muted-foreground hover:text-foreground">Explore product areas</Link>
            <Link href="/ask" className="block py-1 text-muted-foreground hover:text-foreground">Ask about Me</Link>
            <Link href="/signup" className="block py-1 text-muted-foreground hover:text-foreground">Waitlist</Link>
          </nav>
          <div className="text-xs leading-relaxed text-muted-foreground">
            <div className="eyebrow mb-4">Notes</div>
            Me is in development. Hardware images are concept renders, not final product. Conversations shown are fictional examples.
          </div>
        </div>
        <div className="f-mono mx-auto flex max-w-6xl justify-between px-5 pb-8 text-[11px] text-muted-foreground md:px-8">
          <span>Me</span><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-accent" />home-first</span>
        </div>
      </footer>
    </div>
  );
}

/* Phone frame echoing the film */
export function Phone({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative w-[280px] rounded-[44px] bg-[#17191c] p-[7px] shadow-[0_30px_60px_-24px_rgba(23,25,28,0.35)] ring-1 ring-[#3a3d42] ${className}`}>
      <div className="relative h-[570px] overflow-hidden rounded-[37px] bg-[#fbfaf7] text-[#17191c]">
        <div className="absolute left-1/2 top-[9px] z-10 h-[22px] w-[76px] -translate-x-1/2 rounded-full bg-[#17191c]" />
        <div className="absolute left-6 right-6 top-[12px] z-[5] flex justify-between text-[11px] font-semibold">
          <span>9:41</span>
          <span className="f-mono flex items-center gap-1 text-[9px] text-accent"><span className="h-1.5 w-1.5 rounded-full bg-accent" />HOME</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ChatScreen() {
  const you = 'ml-auto w-fit max-w-[200px] rounded-[16px_16px_4px_16px] bg-[#17191c] px-3 py-2.5 text-[12.5px] leading-snug text-[#f3f2ee]';
  const me = 'max-w-[215px] rounded-[16px_16px_16px_4px] border border-[#e6e4de] bg-white px-3 py-2.5 text-[12.5px] leading-snug';
  const msgs: [string, string][] = [
    [you, "I'm two months behind on rent. I'm embarrassed to tell my family."],
    [me, "That's more common than it feels. Want to make a plan, and think about how to tell them?"],
    [you, 'Where does this chat go?'],
    [me, "It's processed on Me Home and saved on its drive. It isn't sent to the cloud."],
  ];
  return (
    <div className="absolute inset-0 flex flex-col gap-2.5 px-4 pt-11">
      <div className="flex items-center gap-2 border-b border-[#e6e4de] pb-2.5">
        <MeMark size={26} />
        <div><div className="text-[14px] font-semibold">Me</div><div className="f-mono text-[9px] text-accent">private chat · on Me Home</div></div>
      </div>
      {msgs.map(([c, t], k) => (
        <motion.div key={k} className={c} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + k * 0.7, duration: 0.45, ease: EASE }}>{t}</motion.div>
      ))}
      <div className="f-mono absolute bottom-6 left-4 right-4 flex justify-between border-t border-[#e6e4de] pt-2.5 text-[9px] text-[#6b6f76]">
        <span>Fictional example</span><span className="text-accent">Processed on Me Home</span>
      </div>
    </div>
  );
}
