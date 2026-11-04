import type { ProductArea } from '@/lib/product-areas';

export type SearchPassage = { label: string; text: string };

export function getSearchPassages(area: ProductArea): SearchPassage[] {
  return [
    { label: 'Overview', text: area.summary },
    { label: 'Problem', text: area.problem },
    { label: 'Approach', text: area.method },
    { label: 'What the repo documents', text: area.results.join(' ') },
    { label: 'Building blocks', text: area.stack.join(' ') },
    { label: 'Tags', text: area.tags.join(' ') },
    { label: 'Product area', text: area.title },
  ];
}

export function findMatchingPassage(area: ProductArea, rawQuery: string): SearchPassage | null {
  const normalizedQuery = rawQuery.trim().toLowerCase();
  if (!normalizedQuery) return null;
  return getSearchPassages(area).find(({ text }) => text.toLowerCase().includes(normalizedQuery)) ?? null;
}

export function getPassageExcerpt(text: string, rawQuery: string): string {
  const query = rawQuery.trim();
  const matchIndex = text.toLowerCase().indexOf(query.toLowerCase());
  if (matchIndex < 0) return text;

  const maxLength = Math.max(220, query.length + 32);
  if (text.length <= maxLength) return text;

  let start = Math.max(0, matchIndex - Math.floor((maxLength - query.length) / 2));
  if (start > 0) {
    const wordBoundary = text.lastIndexOf(' ', start);
    if (wordBoundary >= 0 && wordBoundary < matchIndex) start = wordBoundary + 1;
  }

  let end = Math.min(text.length, start + maxLength);
  if (end < text.length) {
    const wordBoundary = text.lastIndexOf(' ', end);
    if (wordBoundary > matchIndex + query.length) end = wordBoundary;
  }

  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

export function getMatchSegments(text: string, rawQuery: string) {
  const query = rawQuery.trim();
  const matchIndex = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || matchIndex < 0) return null;

  return {
    before: text.slice(0, matchIndex),
    match: text.slice(matchIndex, matchIndex + query.length),
    after: text.slice(matchIndex + query.length),
  };
}
