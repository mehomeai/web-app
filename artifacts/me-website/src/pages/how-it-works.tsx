import { Link } from 'wouter';
import { ArrowRight, Cpu, HardDrive, ShieldCheck, SlidersHorizontal, Smartphone, Globe } from 'lucide-react';
import { ConceptLabel, Reveal, SiteShell, img } from '@/components/site';

const layers = [
  { icon: Cpu, tag: 'Local models', title: 'The language models run at home.', body: 'Me Home is a dedicated AI computer. It runs local LLMs on its own hardware, so your everyday conversations are processed inside your house.' },
  { icon: HardDrive, tag: 'Local data', title: 'Private chats are stored on its drive.', body: 'Chat history and personal context live on Me Home, building an assistant that knows your household without handing that history to a cloud provider.' },
  { icon: SlidersHorizontal, tag: 'Your rules', title: 'You write the rules it follows.', body: 'Decide what the feed optimizes for, which tasks the assistant may attempt, and what each family member can access. Parents supervise children\u2019s profiles.' },
  { icon: Globe, tag: 'Permissioned actions', title: 'Outside actions need your yes.', body: 'Some tasks require an outside service, like checking a price or booking something. Those contact the service, with only what the approved task needs.' },
];

const flow = [
  ['You ask', 'From the Me app on your phone, at home on the local network.'],
  ['Me Home thinks', 'A local model processes the request on the computer in your home.'],
  ['It remembers, locally', 'The private conversation is saved on Me Home\u2019s drive.'],
  ['If it must reach out, it asks', 'An approval request names the service and the information involved.'],
];

export default function HowItWorks() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:px-8 md:pt-24">
        <Reveal><div className="eyebrow">How it works</div></Reveal>
        <Reveal delay={0.1}><h1 className="f-display mt-5 max-w-4xl text-[clamp(44px,8vw,104px)] leading-[0.98]">Two parts. <span className="text-muted-foreground">One assistant.</span></h1></Reveal>
        <Reveal delay={0.2}><p className="mt-8 max-w-2xl text-xl leading-snug text-muted-foreground">A computer that holds the intelligence, and an app that brings it to every phone in the family.</p></Reveal>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 md:grid-cols-2 md:px-8">
        <Reveal>
          <div className="relative h-full overflow-hidden rounded-3xl border border-border bg-card">
            <img src={img('me-home.png')} alt="Concept render of Me Home" className="aspect-[4/3] w-full bg-[#e9e7e1] object-cover" />
            <ConceptLabel className="absolute left-4 top-4" />
            <div className="p-8">
              <div className="f-mono text-xs text-accent">01 · HARDWARE</div>
              <h2 className="f-display mt-2 text-4xl">Me Home</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">An AI computer that sits on a shelf in your house and connects to your home network. It runs the models, keeps the memory, and enforces the rules.</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col rounded-3xl border border-border bg-card">
            <div className="flex aspect-[4/3] items-center justify-center bg-[#e9e7e1]">
              <div className="w-[170px] rounded-[30px] bg-[#17191c] p-[5px]">
                <div className="h-[300px] rounded-[25px] bg-[#fbfaf7] px-4 pt-8">
                  <div className="f-mono flex items-center gap-1 text-[8px] text-accent"><Smartphone className="h-3 w-3" />CONNECTED TO ME HOME</div>
                  {['Chat', 'Feed', 'Rules', 'Approvals', 'Family'].map((t) => (
                    <div key={t} className="border-b border-[#e6e4de] py-2.5 text-[12px]">{t}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="f-mono text-xs text-accent">02 · APP</div>
              <h2 className="f-display mt-2 text-4xl">Me</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">The mobile app for everyone in the household. Chat, a goal-driven feed, the rules you set, and approvals for anything that leaves the house.</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal><div className="eyebrow">What you own</div></Reveal>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {layers.map((l, k) => (
            <Reveal key={l.tag} delay={k * 0.05}>
              <div className="grid gap-4 py-10 md:grid-cols-[220px_1fr_1.2fr] md:gap-10" data-testid={`row-layer-${k}`}>
                <div className="flex items-center gap-3"><l.icon className="h-5 w-5 text-accent" /><span className="f-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">{l.tag}</span></div>
                <h3 className="f-display text-2xl leading-tight md:text-3xl">{l.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{l.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8">
          <Reveal><div className="eyebrow">The path of a request</div></Reveal>
          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {flow.map(([t, d], k) => (
              <Reveal key={t} delay={k * 0.08}>
                <li className="relative">
                  <div className="flex items-center gap-3">
                    <span className={`f-mono grid h-8 w-8 place-items-center rounded-full text-xs ${k === 3 ? 'border border-accent text-accent' : 'bg-primary text-primary-foreground'}`}>{k + 1}</span>
                    {k < 3 && <span className="hidden h-px flex-1 bg-border md:block" />}
                  </div>
                  <div className="mt-5 font-semibold">{t}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-24 md:grid-cols-[1fr_1.2fr] md:px-8">
        <Reveal>
          <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-accent" /><div className="eyebrow">The honest boundary</div></div>
          <h2 className="f-display mt-5 text-[clamp(32px,4.5vw,52px)] leading-[1.05]">Private where it matters. Clear about the rest.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="f-mono text-[11px] text-accent">STAYS AT HOME</div>
              <ul className="mt-4 space-y-2 text-sm"><li>Private chat processing</li><li>Chat history and memory</li><li>Your household rules</li></ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="f-mono text-[11px] text-[#b98a3e]">MAY CONTACT OUTSIDE SERVICES</div>
              <ul className="mt-4 space-y-2 text-sm"><li>Tasks you approve, such as a price check</li><li>Only the details that task needs</li></ul>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Me is in development; specifics of hardware and software may change before launch.</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl">
            <img src={img('me-home-room.jpg')} alt="Concept render of Me Home in a living room" className="aspect-[4/5] w-full object-cover md:aspect-[21/9]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(243,242,238,0.95)_0%,rgba(243,242,238,0.6)_40%,rgba(243,242,238,0)_70%)]" />
            <div className="absolute left-6 top-6 max-w-sm md:left-12 md:top-1/2 md:-translate-y-1/2">
              <h2 className="f-display text-[clamp(30px,4vw,52px)] leading-[1.04]">Be first to hear when Me is ready.</h2>
              <Link href="/signup" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-85" data-testid="link-how-waitlist">Join the waitlist <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <ConceptLabel className="absolute bottom-5 right-5" />
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}
