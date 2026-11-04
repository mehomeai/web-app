import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'wouter';
import { ArrowRight, Search, X } from 'lucide-react';
import { productAreas, allTags } from '@/lib/product-areas';
import { findMatchingPassage, getPassageExcerpt, getSearchPassages } from '@/lib/product-search';
import { MatchingText } from '@/components/matching-text';
import { Reveal, SiteShell } from '@/components/site';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialFilters] = useState(() => {
    return {
      query: searchParams.get('q') ?? '',
      selectedTags: [...new Set(searchParams.getAll('tag').filter((tag) => allTags.includes(tag)))],
    };
  });
  const [query, setQuery] = useState(initialFilters.query);
  const [selectedTags, setSelectedTags] = useState(initialFilters.selectedTags);
  const [restorationAnnouncement, setRestorationAnnouncement] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);
  const visible = useMemo(() => productAreas.filter((area) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesSearch = !normalizedQuery || getSearchPassages(area)
      .some(({ text }) => text.toLowerCase().includes(normalizedQuery));
    return selectedTags.every((tag) => area.tags.includes(tag)) && matchesSearch;
  }), [query, selectedTags]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    selectedTags.forEach((tag) => params.append('tag', tag));
    if (searchParams.toString() !== params.toString()) setSearchParams(params, { replace: true });
  }, [query, searchParams, selectedTags, setSearchParams]);

  useEffect(() => {
    if (initialFilters.query || initialFilters.selectedTags.length > 0) {
      const details = [
        initialFilters.query ? `search for ${initialFilters.query}` : '',
        initialFilters.selectedTags.length ? `selected tags: ${initialFilters.selectedTags.join(', ')}` : '',
      ].filter(Boolean).join('; ');
      setRestorationAnnouncement(`Restored ${details}. Showing ${visible.length} ${visible.length === 1 ? 'area' : 'areas'}.`);
    }
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => current.includes(tag)
      ? current.filter((selectedTag) => selectedTag !== tag)
      : [...current, tag]);
  };

  return (
    <SiteShell>
      <section className="accessibility-page mx-auto max-w-6xl px-5 pb-12 pt-14 md:px-8 md:pt-24">
        <Reveal><div className="eyebrow">Product areas</div></Reveal>
        <Reveal delay={0.08}><h1 className="f-display mt-5 max-w-4xl text-[clamp(46px,8vw,96px)] leading-[.98]">A closer look<br /><span className="text-muted-foreground">at Me.</span></h1></Reveal>
        <Reveal delay={0.16}><p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">Explore the home computer and app as they are described today. This is a product concept in development; outcomes below refer to what the current site documents and demonstrates.</p></Reveal>
      </section>
      <section className="accessibility-page mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="sticky top-16 z-20 -mx-5 border-y border-border bg-background/95 px-5 py-4 backdrop-blur md:mx-0 md:rounded-2xl md:border md:px-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative min-w-0 flex-1 md:basis-56 md:shrink-0">
              <span className="sr-only">Search product areas</span>
              <Search aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input ref={searchInput} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product areas"
                aria-controls="explore-results"
                className="w-full rounded-full border border-input bg-card py-3 pl-11 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:border-accent" data-testid="input-explore-search" />
              {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); searchInput.current?.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground" data-testid="button-clear-explore-search"><X aria-hidden="true" className="h-4 w-4" /></button>}
            </label>
            <div className="flex min-w-0 flex-1 flex-wrap gap-2" role="group" aria-label="Filter product areas by tag" aria-controls="explore-results">
              <button type="button" onClick={() => setSelectedTags([])} aria-pressed={selectedTags.length === 0} className={`shrink-0 rounded-full border px-4 py-2 text-xs transition-colors ${selectedTags.length === 0 ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-secondary'}`}>All areas</button>
              {allTags.map((item) => <button key={item} type="button" onClick={() => toggleTag(item)} aria-pressed={selectedTags.includes(item)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs transition-colors ${selectedTags.includes(item) ? 'border-accent bg-accent text-accent-foreground' : 'border-border hover:bg-secondary'}`}>{item}</button>)}
            </div>
          </div>
          <p className="f-mono mt-3 text-[11px] text-muted-foreground" role="status" aria-live="polite" aria-atomic="true" data-testid="status-explore-results">
            {visible.length} {visible.length === 1 ? 'area' : 'areas'}{selectedTags.length > 0 ? ` · Filters: ${selectedTags.join(', ')}` : ''}
          </p>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true" data-testid="status-explore-restored">{restorationAnnouncement}</p>
        </div>
        <div id="explore-results" role="region" aria-label="Matching product areas">
          {visible.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center" data-testid="empty-explore">
              <h2 className="f-display text-2xl">No matching areas.</h2>
              <p className="mt-2 text-sm text-muted-foreground">Try another phrase or remove a selected tag.</p>
              <button type="button" onClick={() => { setQuery(''); setSelectedTags([]); searchInput.current?.focus(); }} className="mt-5 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary" data-testid="button-clear-explore-filters">Clear filters</button>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {visible.map((area, index) => {
                const matchingPassage = findMatchingPassage(area, query);
                const excerpt = matchingPassage ? getPassageExcerpt(matchingPassage.text, query) : '';
                const describedBy = matchingPassage
                  ? `area-summary-${area.slug} area-match-${area.slug}`
                  : `area-summary-${area.slug}`;
                return (
                <Reveal key={area.slug} delay={Math.min(index * 0.04, 0.16)}>
                  <Link href={(() => {
                    const params = new URLSearchParams();
                    if (query) params.set('q', query);
                    selectedTags.forEach((tag) => params.append('tag', tag));
                    return `/explore/${area.slug}${params.size ? `?${params.toString()}` : ''}`;
                  })()} aria-labelledby={`area-title-${area.slug} area-action-${area.slug}`} aria-describedby={describedBy} className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition-colors hover:border-accent/60 md:p-8" data-testid={`link-area-${area.slug}`}>
                    <div className="flex flex-wrap gap-2">{area.tags.map((item) => <span key={item} className="f-mono rounded-full bg-secondary px-3 py-1 text-[10px] text-muted-foreground">{item}</span>)}</div>
                    <h2 id={`area-title-${area.slug}`} className="f-display mt-7 text-3xl leading-tight">{area.title}</h2>
                    <p id={`area-summary-${area.slug}`} className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{area.summary}</p>
                    {matchingPassage && (
                      <p id={`area-match-${area.slug}`} className="mt-4 rounded-xl border border-border/70 bg-secondary/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground" data-testid={`match-passage-${area.slug}`}>
                        <span className="f-mono mb-1 block text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Match · {matchingPassage.label}</span>
                        <MatchingText text={excerpt} query={query} />
                      </p>
                    )}
                    <span id={`area-action-${area.slug}`} className="mt-7 inline-flex items-center gap-2 text-sm text-accent">Explore this area <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  </Link>
                </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
