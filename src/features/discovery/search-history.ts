import { useSyncExternalStore } from 'react';

/** Popular searches shown on the empty Search screen (reference 3.4 lists others such as "dưới 30k" that this mock catalog cannot answer, so only terms with results are used). */
export const TRENDING_SEARCHES = ['cơm', 'bún bò', 'sushi', 'salad', 'healthy', 'chè', 'tráng miệng'] as const;

export const MAX_RECENT_SEARCHES = 5;

/** Pure: newest first, no case-insensitive duplicates, capped. */
export function addRecentSearch(history: readonly string[], query: string): string[] {
  const q = query.trim();
  if (!q) return [...history];
  return [q, ...history.filter((h) => h.toLowerCase() !== q.toLowerCase())].slice(0, MAX_RECENT_SEARCHES);
}

export const removeRecentSearch = (history: readonly string[], query: string): string[] =>
  history.filter((h) => h !== query);

/** Session-level store (no persistence, like the auth store). */
let recent: string[] = [];
const listeners = new Set<() => void>();
const set = (next: string[]) => {
  recent = next;
  listeners.forEach((l) => l());
};

export const getRecentSearches = () => recent;
export const rememberSearch = (query: string) => set(addRecentSearch(recent, query));
export const forgetSearch = (query: string) => set(removeRecentSearch(recent, query));
export const clearRecentSearches = () => set([]);

export function useRecentSearches(): readonly string[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getRecentSearches,
    getRecentSearches,
  );
}
