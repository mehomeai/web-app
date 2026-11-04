import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { SiteShell } from '@/components/site';

export default function StaleChat() {
  return (
    <SiteShell>
      <section className="mx-auto flex min-h-[62vh] max-w-3xl flex-col justify-center px-5 py-16 md:px-8">
        <div className="eyebrow">Chat link</div>
        <h1 className="f-display mt-5 text-[clamp(42px,7vw,76px)] leading-[.98]">This conversation<br /><span className="text-muted-foreground">is unavailable.</span></h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">This link may be old or no longer available. No conversation details are shown here.</p>
        <Link href="/" className="mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground hover:opacity-85"><ArrowLeft className="h-4 w-4" />Back to Me</Link>
      </section>
    </SiteShell>
  );
}
