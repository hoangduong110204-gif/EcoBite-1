import { useMemo } from 'react';

import { searchListings } from '@/utils/search';
import { applySearchRefinements, emptySearchFilters, type SearchFilters, type SearchSort } from '@/utils/search-refine';

import { useCatalog } from './use-catalog';

interface SearchOptions {
  onlyAvailable?: boolean;
  filters?: SearchFilters;
  sort?: SearchSort;
}

/** Search over the local catalog. Empty query → no results (screen shows suggestions). */
export function useSearch(query: string, options: SearchOptions = {}) {
  const { listings, status, reload } = useCatalog();
  const onlyAvailable = options.onlyAvailable ?? false;
  const filters = options.filters ?? emptySearchFilters;
  const sort = options.sort ?? 'relevance';
  const results = useMemo(
    () => applySearchRefinements(searchListings(listings, query, { onlyAvailable }), filters, sort),
    [listings, query, onlyAvailable, filters, sort],
  );
  return { results, status, reload };
}
