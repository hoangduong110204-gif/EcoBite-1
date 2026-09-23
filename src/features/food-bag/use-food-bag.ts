import { useCallback, useEffect, useState } from 'react';

import { api } from '@/services/api';
import type { FoodBag, Restaurant, RestaurantListing } from '@/types';
import { buildRestaurantListings } from '@/utils/restaurant-listing';

import { getAlternativeListings } from './food-bag-logic';

export type FoodBagStatus = 'loading' | 'ready' | 'not_found' | 'error';

/** Loads one bag with its restaurant (and, for the sold-out screen, alternatives). Unknown id → `not_found`. */
export function useFoodBag(id: string | undefined) {
  const [bag, setBag] = useState<FoodBag | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [alternatives, setAlternatives] = useState<RestaurantListing[]>([]);
  const [status, setStatus] = useState<FoodBagStatus>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const found = id ? await api.getFoodBag(id) : null;
      const owner = found ? await api.getRestaurant(found.restaurantId) : null;
      if (!found || !owner) {
        setBag(null);
        setRestaurant(null);
        setStatus('not_found');
        return;
      }
      const [restaurants, bags, categories] = await Promise.all([api.listRestaurants(), api.listFoodBags(), api.listCategories()]);
      setBag(found);
      setRestaurant(owner);
      setAlternatives(getAlternativeListings(buildRestaurantListings(restaurants, bags, categories), owner.id));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return { bag, restaurant, alternatives, status, reload: load };
}
