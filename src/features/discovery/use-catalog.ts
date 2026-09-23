import { useCallback, useEffect, useState } from 'react';

import { api } from '@/services/api';
import type { Category, RestaurantListing } from '@/types';
import { buildRestaurantListings } from '@/utils/restaurant-listing';

export type CatalogStatus = 'loading' | 'ready' | 'error';

/** Loads restaurants + bags + categories from the API and joins them into listings. */
export function useCatalog() {
  const [listings, setListings] = useState<RestaurantListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<CatalogStatus>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [restaurants, bags, cats] = await Promise.all([
        api.listRestaurants(),
        api.listFoodBags(),
        api.listCategories(),
      ]);
      setListings(buildRestaurantListings(restaurants, bags, cats));
      setCategories(cats);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { listings, categories, status, reload: load };
}
