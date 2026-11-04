import { Link, useParams, useSearchParams } from 'wouter';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { allTags, productAreas } from '@/lib/product-areas';
import { SiteShell } from '@/components/site';

export default function ExploreDetail() {
  const params = useParams<{ slug: string }>();
  const [sourceParams] = useSearchParams();
  const exploreParams = new URLSearchParams();
  const query = sourceParams.get('q');
  if (query) exploreParams.set('q', query);
  [...new Set(sourceParams.getAll('tag').filter((tag) => allTags.includes(tag)))].forEach((tag) => exploreParams.append('tag', tag));
  const exploreHref = `/explore${exploreParams.size ? `?${exploreParams.toString()}` : ''}`;
  const area = productAreas.find((item) => item.slug === params.slug);
  if (!area) {
    return <SiteShell><article className="accessibility-page mx-auto max-w-3xl px-5 py-24" aria-labelledby="missing-area-title"><div className="eyebrow">Product area</div><h1 id="missing-area-title" className="f-display mt-4 text-5xl">That area isn't here.</h1><p className="mt-4 text-muted-foreground">Browse the documented Me product areas instead.</p><Link href={exploreHref} className="mt-8 inline-flex items-center gap-2 text-accent"><ArrowLeft aria-hidden="true" className="h-4 w-4" />All product areas</Link></article></SiteShell>;
  }
  const sections = [
    { title: 'The problem', content: <p>{area.problem}</p> },
    { title: 'The approach', content: <p>{area.method}</p> },
    { title: 'What the repo documents', content: <ul className="space-y-3">{area.results.map((result) => <li key={result} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{result}</li>)}</ul> },
    { title: 'Tech stack & building blocks', content: <ul className="flex flex-wrap gap-2">{area.stack.map((item) => <li key={item} className="rounded-full border border-border bg-card px-4 py-2 text-sm">{item}</li>)}</ul> },
  ];
  return (
    <SiteShell>
      <article className="accessibility-page mx-auto max-w-6xl px-5 pb-24 pt-12 md:px-8 md:pt-20" aria-labelledby="product-area-title">
        <nav aria-label="Breadcrumb">
          <ol>
            <li><Link href={exploreHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden="true" className="h-4 w-4" />All product areas</Link></li>
          </ol>
        </nav>
        <div className="mt-12 max-w-4xl">
          <div className="eyebrow">{area.tags.join(' · ')}</div>
          <h1 id="product-area-title" className="f-display mt-5 text-[clamp(44px,8vw,94px)] leading-[.98]">{area.title}</h1>
          <p className="mt-7 max-w-2xl text-xl leading-relaxed text-muted-foreground">{area.summary}</p>
        </div>
        <div className="mt-14 divide-y divide-border border-y border-border">
          {sections.map((section, index) => <section key={section.title} aria-labelledby={`product-area-section-${index + 1}`} className="grid gap-4 py-8 md:grid-cols-[240px_1fr] md:gap-12 md:py-10">
            <h2 id={`product-area-section-${index + 1}`} className="f-display text-xl"><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span> <span className="ml-3">{section.title}</span></h2>
            <div className="max-w-3xl text-sm leading-7 text-muted-foreground">{section.content}</div>
          </section>)}
        </div>
        <section aria-labelledby="continue-exploring-title" className="mt-12 rounded-3xl bg-secondary/60 p-6 md:p-9">
          <h2 id="continue-exploring-title" className="eyebrow">Continue exploring</h2>
          <div className="mt-5 flex flex-wrap gap-3">{area.links.map((link) => <Link key={link.href} href={link.href} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm hover:border-accent">{link.label}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>)}</div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Me is in development. Details describe the current product concept and may change.</p>
        </section>
      </article>
    </SiteShell>
  );
}
