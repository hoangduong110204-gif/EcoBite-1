import { useEffect, useState } from 'react';

import { api } from '@/services/api';
import type { Order, Restaurant } from '@/types';

import { getCheckoutProgress, type CheckoutProgress } from './checkout-logic';

/** Order + restaurant + checkout progress for Payment Success (7.3). `not_paid` = the order is not paid (yet). */
export function usePaymentSuccess(orderId: string | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [progress, setProgress] = useState<CheckoutProgress | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'not_found' | 'not_paid' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const found = orderId ? await api.getOrder(orderId) : null;
        if (cancelled) return;
        if (!found) return setStatus('not_found');
        const [owner, orders] = await Promise.all([api.getRestaurant(found.restaurantId), api.listOrders()]);
        if (cancelled) return;
        setOrder(found);
        setRestaurant(owner);
        setProgress(getCheckoutProgress(orders, found.checkoutId, found.id));
        setStatus(found.paymentStatus === 'success' ? 'ready' : 'not_paid');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return { order, restaurant, progress, status };
}
