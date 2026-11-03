import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { ChatScreen, ConceptLabel, EASE, MeMark, Phone, Reveal, SiteShell, img } from '@/components/site';
import { useState } from 'react';

const family = [
  ['Maya · age 9', 'learning mode'],
  ['Theo · age 12', 'learning mode'],
  ['Parents · admin', 'supervising'],
];

function FeedDial() {
  const [v, setV] = useState(68);
  const rows = [
    { k: 'Goal-aligned learning', w: v },
    { k: 'Friends and family', w: Math.round((100 - v) * 0.6) },
    { k: 'Pure entertainment', w: Math.round((100 - v) * 0.4) },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="flex items-baseline justify-between">
        <div className="eyebrow">Your feed rules</div>
        <div className="f-mono text-xs text-muted-foreground" data-testid="text-dial-value">{v}% toward goals</div>
      </div>
      <input type="range" min={20} max={95} value={v} onChange={(e) => setV(Number(e.target.value))}
        className="mt-6 w-full accent-[#1e6b66]" aria-label="Feed goal weighting" data-testid="input-feed-dial" />
      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <div key={r.k}>
            <div className="flex justify-between text-sm"><span>{r.k}</span><span className="f-mono text-xs text-muted-foreground">{r.w}%</span></div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
              <motion.div className="h-full origin-left rounded-full bg-accent" animate={{ scaleX: r.w / 100 }} transition={{ duration: 0.5, ease: EASE }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">Illustrative control. You set what the feed optimizes for. Not watch time.</p>
    </div>
  );
}

export default function Home() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-14 md:px-8 md:pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="flex items-center gap-4">
          <MeMark size={52} />
          <h1 className="f-display text-[clamp(56px,11vw,132px)] leading-[0.95]" data-testid="text-hero-title">Meet Me.</h1>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 max-w-2xl text-xl leading-snug text-muted-foreground md:text-2xl">
          <span className="text-foreground">A home AI computer and the app that connects your family to it.</span>
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 flex flex-wrap gap-3">
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-85" data-testid="link-hero-waitlist">
            Join the waitlist <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm hover:bg-secondary" data-testid="link-hero-how">
            How it works
          </Link>
        </motion.div>

        <div className="relative mt-16 grid items-end gap-6 md:grid-cols-[1.5fr_1fr]">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
            className="relative overflow-hidden rounded-3xl bg-[#e9e7e1]">
            <img src={img('me-home.png')} alt="Concept render of the Me Home AI computer" className="aspect-[4/3] w-full object-cover" />
            <ConceptLabel className="absolute left-4 top-4" />
            <div className="absolute bottom-4 left-4 rounded-2xl border border-[#e6e4de] bg-white px-5 py-3">
              <div className="f-mono text-[11px] text-accent">01 · HARDWARE</div>
              <div className="mt-0.5 font-semibold">Me Home</div>
              <div className="text-sm text-muted-foreground">AI computer, in your house</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9, ease: EASE }} className="flex flex-col items-center gap-5">
            <Phone>
              <div className="absolute inset-0 px-5 pt-14">
                <MeMark size={44} />
                <div className="f-display mt-4 text-[26px] leading-[1.1]">Good evening,<br />the Okafor family.</div>
                <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-[#e6e4de] bg-white p-3">
                  <span className="blink h-2 w-2 rounded-full bg-accent" />
                  <div><div className="text-[13px] font-semibold">Connected to Me Home</div><div className="f-mono text-[9px] text-[#6b6f76]">living room · local network</div></div>
                </div>
                {family.map(([a, b]) => (
                  <div key={a} className="flex justify-between border-b border-[#e6e4de] py-3 text-[13px]"><span>{a}</span><span className="f-mono text-[9px] text-[#6b6f76]">{b}</span></div>
                ))}
              </div>
            </Phone>
            <div className="rounded-2xl border border-[#e6e4de] bg-white px-5 py-3 text-center">
              <div className="f-mono text-[11px] text-accent">02 · APP</div>
              <div className="mt-0.5 font-semibold">Me</div>
              <div className="text-sm text-muted-foreground">on every family phone</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Thesis */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <Reveal><div className="eyebrow">The idea</div></Reveal>
          <Reveal delay={0.1}>
            <p className="f-display mt-6 max-w-4xl text-[clamp(32px,5vw,60px)] leading-[1.05]">
              Building the intelligence for yourself, at home. <span className="text-muted-foreground">And that intelligence working for you.</span>
            </p>
          </Reveal>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {[
              ['The intelligence', 'Local language models run on Me Home, a computer that lives in your house.'],
              ['The data', 'Private chats are processed and stored on its drive, not in someone else\u2019s cloud.'],
              ['The rules', 'You decide what the assistant may do, what the feed shows, and what children can access.'],
            ].map(([t, d], k) => (
              <Reveal key={t} delay={k * 0.08} className="bg-card p-8">
                <div className="f-mono text-xs text-muted-foreground">0{k + 1}</div>
                <div className="mt-8 text-lg font-semibold">You own {t.split(' ')[1]}.</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Private chat */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-24 md:grid-cols-2 md:px-8 md:py-32">
        <div>
          <Reveal><div className="eyebrow">Private chat</div></Reveal>
          <Reveal delay={0.1}><h2 className="f-display mt-5 text-[clamp(40px,6vw,76px)] leading-[1.02]">Ask the hard<br /><span className="text-muted-foreground">questions.</span></h2></Reveal>
          <Reveal delay={0.2}><p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Money worries, health questions, the things you would not type into a search bar. Me answers like a thoughtful assistant, and the conversation is <span className="text-foreground">processed at home</span>.
          </p></Reveal>
        </div>
        <Reveal delay={0.15} className="flex justify-center"><Phone><ChatScreen /></Phone></Reveal>
      </section>

      {/* Room */}
      <section className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl">
            <img src={img('me-home-room.jpg')} alt="Concept render of Me Home on a living room sideboard" className="aspect-[4/5] w-full object-cover md:aspect-[16/9]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(243,242,238,0.92)_0%,rgba(243,242,238,0.5)_30%,rgba(243,242,238,0)_50%)]" />
            <div className="absolute left-6 right-6 top-6 md:left-12 md:top-12">
              <div className="eyebrow">Me Home · in the living room</div>
              <h2 className="f-display mt-3 text-[clamp(34px,5.5vw,72px)] leading-[1.02]">Your chat is<br /><span className="text-accent">saved right here.</span></h2>
            </div>
            <div className="absolute left-1/2 top-[76%] hidden md:block">
              {[0, 1, 2].map((k) => (
                <span key={k} className="pulse-ring absolute -left-6 -top-6 h-12 w-12 rounded-full border-2 border-accent" style={{ animationDelay: `${k * 0.6}s` }} />
              ))}
            </div>
            <ConceptLabel className="absolute bottom-5 right-5" />
          </div>
        </Reveal>
      </section>

      {/* Family + feed */}
      <section className="mx-auto grid max-w-6xl gap-14 px-5 py-24 md:grid-cols-2 md:px-8 md:py-32">
        <div>
          <Reveal><div className="eyebrow">For the next generation</div></Reveal>
          <Reveal delay={0.1}><h2 className="f-display mt-5 text-[clamp(36px,5vw,60px)] leading-[1.04]">A feed that serves <span className="text-accent">their goals.</span> Not your attention.</h2></Reveal>
          <Reveal delay={0.2}><p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Me includes a full-screen vertical feed, the format children already know. The difference is the algorithm: it belongs to the family, and its dial is in your hands.
          </p></Reveal>
          <Reveal delay={0.25}>
            <ul className="mt-8 space-y-3 text-sm">
              {['Children learn to question AI, not just trust it', 'Parents supervise from their own phone', 'Mechanical, repeatable tasks get offloaded. Thinking does not.'].map((t) => (
                <li key={t} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{t}</li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.1}><FeedDial /></Reveal>
      </section>

      {/* Actions */}
      <section className="bg-[#17191c] text-[#f3f2ee]">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <Reveal><div className="eyebrow !text-[#7fb8b2]">Working for you</div></Reveal>
          <Reveal delay={0.1}><h2 className="f-display mt-5 max-w-3xl text-[clamp(36px,5vw,64px)] leading-[1.04]">It can act on the outside world. <span className="text-[#9a9ea5]">Only with your permission.</span></h2></Reveal>
          <Reveal delay={0.2}><p className="mt-6 max-w-xl text-lg leading-relaxed text-[#9a9ea5]">
            Checking prices, booking, looking something up online. When a task needs an outside service, Me asks first, and shares only what that task requires.
          </p></Reveal>
          <Reveal delay={0.25}>
            <div className="mt-12 max-w-md rounded-2xl border border-[#3a3d42] bg-[#202327] p-6">
              <div className="f-mono text-[11px] text-[#7fb8b2]">APPROVAL REQUEST · EXAMPLE</div>
              <div className="mt-3 font-semibold">Compare grocery prices at two stores</div>
              <div className="mt-1 text-sm text-[#9a9ea5]">Shares: shopping list items only</div>
              <div className="mt-5 flex gap-2">
                <span className="rounded-full bg-[#f3f2ee] px-4 py-1.5 text-sm text-[#17191c]">Approve once</span>
                <span className="rounded-full border border-[#3a3d42] px-4 py-1.5 text-sm">Decline</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pt-24 text-center md:px-8 md:pt-32">
        <Reveal><MeMark size={56} /></Reveal>
        <Reveal delay={0.1}><h2 className="f-display mx-auto mt-8 max-w-3xl text-[clamp(40px,6vw,80px)] leading-[1]">Intelligence that answers to you.</h2></Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-85" data-testid="link-cta-waitlist">Join the waitlist <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/how-it-works" className="rounded-full border border-border px-6 py-3 text-sm hover:bg-secondary" data-testid="link-cta-how">See how it works</Link>
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}
