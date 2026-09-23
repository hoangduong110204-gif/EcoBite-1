import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'expo-router';

import { useAuth } from '@/features/auth';
import { api } from '@/services/api';
import type { FoodBag, Order, Restaurant } from '@/types';

import { isOrderOwnedBy, resolveOrderRoute } from './order-history-logic';

export type OrderDetailStatus = 'loading' | 'ready' | 'not_found' | 'error' | 'redirecting';

/**
 * Data for `/order/[orderId]` (finished-order detail, D-5). Read-only. An unknown
 * id, or an order of another account, is `not_found`. A LIVE order does not belong
 * here: the hook redirects it to the screen `resolveOrderRoute` names (status,
 * payment, QR verified).
 */
export function useOrderDetail(orderId: string | undefined) {
  const router = useRouter();
  const { account } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [bags, setBags] = useState<FoodBag[]>([]);
  const [status, setStatus] = useState<OrderDetailStatus>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const found = orderId ? await api.getOrder(orderId) : null;
      if (!found || !isOrderOwnedBy(found, account?.id)) {
        setOrder(null);
        setStatus('not_found');
        return;
      }
      const [owner, catalog] = await Promise.all([api.getRestaurant(found.restaurantId), api.listFoodBags()]);
      setOrder(found);
      setRestaurant(owner);
      setBags(catalog);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [orderId, account?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const target = order ? resolveOrderRoute(order) : null;
  const live = order !== null && target !== null && target !== `/order/${order.id}`;
  useEffect(() => {
    if (live && target) router.replace(target);
  }, [live, target, router]);

  return { order, restaurant, bags, status: live && status === 'ready' ? ('redirecting' as const) : status, reload: load };
}
