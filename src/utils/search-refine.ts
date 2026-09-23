import type { SearchResult } from './search';

/** Sort orders of Search Results (reference 3.7), limited to what the catalog data supports. */
export type SearchSort = 'relevance' | 'nearest' | 'cheapest' | 'top_rated';

export const SEARCH_SORT_OPTIONS: readonly { key: SearchSort; label: string; hint: string }[] = [
  { key: 'relevance', label: 'Phù hợp nhất', hint: 'Khớp tên quán, loại món rồi tới nội dung túi' },
  { key: 'nearest', label: 'Gần tôi nhất', hint: 'Quán có quãng đường ngắn nhất' },
  { key: 'cheapest', label: 'Giá thấp nhất', hint: 'Túi rẻ nhất lên trước' },
  { key: 'top_rated', label: 'Đánh giá cao nhất', hint: 'Theo điểm sao của quán' },
];

/** Price bands (reference 3.6 "Khoảng giá"), applied to the price shown on the card (`featuredBag`). */
export const SEARCH_PRICE_RANGES = [
  { key: 'under_30', label: 'Dưới 30k', min: 0, max: 30000 },
  { key: '30_50', label: '30k – 50k', min: 30000, max: 50000 },
  { key: '50_80', label: '50k – 80k', min: 50000, max: 80000 },
  { key: 'over_80', label: 'Trên 80k', min: 80000, max: Number.POSITIVE_INFINITY },
] as const;
export type SearchPriceRangeKey = (typeof SEARCH_PRICE_RANGES)[number]['key'];

export const SEARCH_DISTANCE_OPTIONS = [
  { km: 1, label: 'Trong 1 km' },
  { km: 2, label: 'Trong 2 km' },
  { km: 3, label: 'Trong 3 km' },
] as const;

export const TOP_RATED_MIN = 4.5;

export interface SearchFilters {
  priceRange: SearchPriceRangeKey | null;
  maxDistanceKm: number | null;
  topRatedOnly: boolean;
}

export const emptySearchFilters: SearchFilters = { priceRange: null, maxDistanceKm: null, topRatedOnly: false };

/** Number of active filters (the "Bộ lọc · N" badge). "Còn túi" is its own chip, not counted here. */
export const countActiveFilters = (filters: SearchFilters): number =>
  (filters.priceRange ? 1 : 0) + (filters.maxDistanceKm !== null ? 1 : 0) + (filters.topRatedOnly ? 1 : 0);

/** Distance from the sample user location is a mock number (no GPS); used only for filtering / sorting. */
const priceOf = (r: SearchResult): number | null => r.listing.featuredBag?.price ?? null;

/** Filters search results. Pure; returns a new array. A listing without a price (sold out) never matches a price band. */
export function filterSearchResults(results: readonly SearchResult[], filters: SearchFilters): SearchResult[] {
  const range = SEARCH_PRICE_RANGES.find((r) => r.key === filters.priceRange);
  return results.filter((r) => {
    if (range) {
      const price = priceOf(r);
      if (price === null || price < range.min || price >= range.max) return false;
    }
    if (filters.maxDistanceKm !== null && r.listing.restaurant.distanceKm > filters.maxDistanceKm) return false;
    if (filters.topRatedOnly && r.listing.restaurant.rating < TOP_RATED_MIN) return false;
    return true;
  });
}

/** Sorts search results. `relevance` keeps the ranking from `searchListings`. Stable; returns a new array. */
export function sortSearchResults(results: readonly SearchResult[], sort: SearchSort): SearchResult[] {
  const indexed = results.map((r, index) => ({ r, index }));
  const compare: Record<SearchSort, (a: SearchResult, b: SearchResult) => number> = {
    relevance: () => 0,
    nearest: (a, b) => a.listing.restaurant.distanceKm - b.listing.restaurant.distanceKm,
    // sold-out listings have no price: they go last
    cheapest: (a, b) => (priceOf(a) ?? Number.POSITIVE_INFINITY) - (priceOf(b) ?? Number.POSITIVE_INFINITY),
    top_rated: (a, b) => b.listing.restaurant.rating - a.listing.restaurant.rating,
  };
  return indexed.sort((a, b) => compare[sort](a.r, b.r) || a.index - b.index).map(({ r }) => r);
}

export const applySearchRefinements = (results: readonly SearchResult[], filters: SearchFilters, sort: SearchSort): SearchResult[] =>
  sortSearchResults(filterSearchResults(results, filters), sort);
