import { useCallback, useEffect, useState } from 'react';

import { api } from '@/services/api';
import type { RestaurantListing } from '@/types';
import { buildRestaurantListings } from '@/utils/restaurant-listing';

export type RestaurantStatus = 'loading' | 'ready' | 'not_found' | 'error';

/** Loads one restaurant (with its bags) by route id. Unknown id → `not_found`. */
export function useRestaurant(id: string | undefined) {
  const [listing, setListing] = useState<RestaurantListing | null>(null);
  const [status, setStatus] = useState<RestaurantStatus>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const restaurant = id ? await api.getRestaurant(id) : null;
      if (!restaurant) {
        setListing(null);
        setStatus('not_found');
        return;
      }
      const [bags, categories] = await Promise.all([api.listFoodBags(restaurant.id), api.listCategories()]);
      setListing(buildRestaurantListings([restaurant], bags, categories)[0]);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return { listing, status, reload: load };
}
