import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [location]);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className={`sticky top-0 z-40 transition-colors duration-300 ${scrolled ? 'border-b border-border bg-background/85 backdrop-blur-md' : 'border-b border-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2.5" data-testid="link-logo">
            <MeMark size={24} />
            <span className="f-display text-xl">Me</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} data-testid={`link-nav-${n.label.toLowerCase().replace(/\s/g, '-')}`}
                className={`text-sm transition-colors ${location === n.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {n.label}
              </Link>
            ))}
            <Link href="/signup" data-testid="link-nav-waitlist" className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-85">
              Join the waitlist
            </Link>
          </nav>
          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu" data-testid="button-menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-border bg-background px-5 pb-5 md:hidden">
            {[...nav, { href: '/signup', label: 'Join the waitlist' }].map((n) => (
              <Link key={n.href} href={n.href} className="block border-b border-border py-4 text-base" data-testid={`link-mobile-${n.href}`}>{n.label}</Link>
            ))}
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-24 border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
          <div>
            <div className="flex items-center gap-2.5"><MeMark size={22} /><span className="f-display text-lg">Me</span></div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Intelligence built for yourself, at home, working for yourself. A home AI computer and the app that connects your family to it.
            </p>
          </div>
          <div className="text-sm">
            <div className="eyebrow mb-4">Explore</div>
            <Link href="/" className="block py-1 text-muted-foreground hover:text-foreground">Overview</Link>
            <Link href="/how-it-works" className="block py-1 text-muted-foreground hover:text-foreground">How it works</Link>
            <Link href="/signup" className="block py-1 text-muted-foreground hover:text-foreground">Waitlist</Link>
          </div>
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
