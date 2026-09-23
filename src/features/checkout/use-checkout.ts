import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCart } from '@/features/cart';
import { api } from '@/services/api';
import { paymentService } from '@/services/payment';
import type { FoodBag, PaymentMethod, Promo, Restaurant } from '@/types';

import { buildCheckoutView } from './checkout-logic';

interface Catalog {
  bags: FoodBag[];
  restaurants: Restaurant[];
  promos: Promo[];
  methods: PaymentMethod[];
}

/**
 * Data for Checkout, Order Summary and Payment Method: the REAL session cart
 * joined with catalog data. Totals come from `utils/order-pricing`
 * (`buildCheckoutView`), never from the screens.
 */
export function useCheckout() {
  const cart = useCart();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [bags, restaurants, promos, methods] = await Promise.all([
        api.listFoodBags(),
        api.listRestaurants(),
        api.listPromos(),
        paymentService.listPaymentMethods(),
      ]);
      setCatalog({ bags, restaurants, promos, methods });
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const view = useMemo(
    () => buildCheckoutView(cart, catalog?.bags ?? [], catalog?.restaurants ?? [], catalog?.promos ?? []),
    [cart, catalog],
  );
  return { view, methods: catalog?.methods ?? [], status, reload: load };
}
