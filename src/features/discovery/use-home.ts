import { useMemo, useState } from 'react';

import { useAuth } from '@/features/auth';
import { ALL_CATEGORY_ID } from '@/utils/restaurant-listing';

import { getHomeCategories, getHomeView, getPopularBags, swapHomeRestaurants } from './home-logic';
import { useCatalog } from './use-catalog';

/** State for the Home screen: catalog + selected area (auth session) + category filter. */
export function useHome() {
  const { area } = useAuth();
  const { listings, categories, status, reload } = useCatalog();
  const [categoryId, setCategoryId] = useState(ALL_CATEGORY_ID);
  const view = useMemo(() => getHomeView(listings, area, categoryId), [listings, area, categoryId]);
  const homeCategories = useMemo(() => getHomeCategories(categories), [categories]);
  const popularBags = useMemo(() => getPopularBags(listings), [listings]);
  const restaurants = useMemo(() => swapHomeRestaurants(view.restaurants), [view.restaurants]);
  return { ...view, restaurants, categories, homeCategories, popularBags, status, reload, setCategoryId };
}
