import { getMatchSegments } from '@/lib/product-search';

export function MatchingText({ text, query }: { text: string; query: string }) {
  const segments = getMatchSegments(text, query);
  if (!segments) return <>{text}</>;

  return (
    <>
      {segments.before}
      <mark className="rounded bg-accent/20 px-0.5 text-foreground">{segments.match}</mark>
      {segments.after}
    </>
  );
}
