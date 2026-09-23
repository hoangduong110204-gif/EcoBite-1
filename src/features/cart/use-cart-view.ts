import { useCallback, useEffect, useMemo, useState } from 'react';

import { api } from '@/services/api';
import type { FoodBag, Restaurant } from '@/types';

import { buildCartView } from './cart-view';
import { useCart } from './use-cart';

/** Cart + catalog data for the Cart screen. `availableBagCount` feeds the empty-state line. */
export function useCartView() {
  const cart = useCart();
  const [catalog, setCatalog] = useState<{ bags: FoodBag[]; restaurants: Restaurant[] } | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [bags, restaurants] = await Promise.all([api.listFoodBags(), api.listRestaurants()]);
      setCatalog({ bags, restaurants });
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const view = useMemo(() => buildCartView(cart, catalog?.bags ?? [], catalog?.restaurants ?? []), [cart, catalog]);
  const availableBagCount = useMemo(() => (catalog?.bags ?? []).reduce((sum, b) => sum + b.left, 0), [catalog]);
  return { view, status, reload: load, availableBagCount };
}
