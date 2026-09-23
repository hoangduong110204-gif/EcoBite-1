import type { FoodBag, RestaurantListing } from '@/types';

/** Which field of the listing matched the query. */
export type SearchMatchField = 'name' | 'category' | 'bag';

export interface SearchResult {
  listing: RestaurantListing;
  matchedBy: SearchMatchField[];
  /** Bags whose name/summary matched (empty when only the restaurant/category matched). */
  matchedBags: FoodBag[];
}

/** Lower-case, accent-insensitive text so "com nieu" finds "Cơm Niêu". */
export const normalizeSearchText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (query: string): string[] => normalizeSearchText(query).split(' ').filter(Boolean);

/**
 * Local search over restaurant name, category name, and bag name / summary.
 * Every word of the query must appear somewhere in the listing. An empty query
 * returns no results (the Search screen shows suggestions instead).
 * Order: name matches, then category matches, then bag-only matches; ties keep
 * the catalog order.
 */
export function searchListings(
  listings: RestaurantListing[],
  query: string,
  options: { onlyAvailable?: boolean } = {},
): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];
  for (const listing of listings) {
    if (options.onlyAvailable && listing.soldOut) continue;

    const name = normalizeSearchText(listing.restaurant.name);
    const category = normalizeSearchText(listing.categoryName);
    const bagTexts = listing.bags.map((b) => normalizeSearchText(`${b.name} ${b.summary}`));

    const haystack = [name, category, ...bagTexts].join(' | ');
    if (!tokens.every((t) => haystack.includes(t))) continue;

    const matchedBy: SearchMatchField[] = [];
    if (tokens.some((t) => name.includes(t))) matchedBy.push('name');
    if (tokens.some((t) => category.includes(t))) matchedBy.push('category');
    const matchedBags = listing.bags.filter((_, i) => tokens.some((t) => bagTexts[i].includes(t)));
    if (matchedBags.length > 0) matchedBy.push('bag');

    results.push({ listing, matchedBy, matchedBags });
  }

  const rank = (r: SearchResult) => (r.matchedBy.includes('name') ? 0 : r.matchedBy.includes('category') ? 1 : 2);
  return results
    .map((r, index) => ({ r, index }))
    .sort((a, b) => rank(a.r) - rank(b.r) || a.index - b.index)
    .map(({ r }) => r);
}
