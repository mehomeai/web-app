import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { SiteShell } from '@/components/site';

export default function NotFound() {
  return (
    <SiteShell>
      <section className="mx-auto flex min-h-[62vh] max-w-3xl flex-col justify-center px-5 py-16 md:px-8">
        <div className="eyebrow">404 · Page not found</div>
        <h1 className="f-display mt-5 text-[clamp(42px,7vw,76px)] leading-[.98]">That page isn’t here.</h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
          We couldn’t find this page. You can return to the Me overview.
        </p>
        <Link href="/" className="mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground hover:opacity-85" data-testid="link-not-found-home">
          <ArrowLeft className="h-4 w-4" />Back to Me
        </Link>
      </section>
    </SiteShell>
  );
}
