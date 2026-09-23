import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { useAuth } from '@/features/auth';
import { api } from '@/services/api';
import type { Order, Restaurant } from '@/types';

export type OrdersStatus = 'loading' | 'ready' | 'error';

/** How often the Orders tab re-reads while it is focused (an active order may change on the restaurant side). */
export const ORDERS_POLL_MS = 3000;

/**
 * The signed-in customer's orders (read-only) with their restaurants. The Orders
 * tab stays mounted, so it reloads every time it gains focus and polls while
 * focused. Reading never changes an order.
 */
export function useOrders() {
  const { account } = useAuth();
  const accountId = account?.id;
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [status, setStatus] = useState<OrdersStatus>('loading');

  const load = useCallback(
    async (initial: boolean) => {
      if (initial) setStatus('loading');
      try {
        const [list, everyRestaurant] = await Promise.all([api.listOrders({ userId: accountId }), api.listRestaurants()]);
        setOrders(list);
        setRestaurants(everyRestaurant);
        setStatus('ready');
      } catch {
        if (initial) setStatus('error');
      }
    },
    [accountId],
  );

  useFocusEffect(
    useCallback(() => {
      void load(true);
      const timer = setInterval(() => void load(false), ORDERS_POLL_MS);
      return () => clearInterval(timer);
    }, [load]),
  );

  return { orders, restaurants, status, reload: () => load(true) };
}
