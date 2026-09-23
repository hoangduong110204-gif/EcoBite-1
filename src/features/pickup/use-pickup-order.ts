import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'expo-router';

import { api } from '@/services/api';
import type { Order, Restaurant } from '@/types';
import { isTerminal } from '@/utils/order-lifecycle';

import { getPickupGate, getPickupStage, resolvePickupRoute, type PickupGate, type PickupStage } from './pickup-logic';

export type PickupOrderStatus = 'loading' | 'ready' | 'not_found' | 'error';

/** How often the pickup screens re-read the order (the restaurant / staff act on another device). */
export const PICKUP_POLL_MS = 1500;

/**
 * The order behind a pickup screen, its restaurant and the sibling orders of the
 * same checkout. It re-reads the order every `PICKUP_POLL_MS` until the order is
 * terminal, so the screens follow what the (mock) restaurant does. Nothing is
 * created here: an invalid id is `not_found`.
 */
export function usePickupOrder(orderId: string | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<PickupOrderStatus>('loading');

  const load = useCallback(
    async (initial: boolean) => {
      if (initial) setStatus('loading');
      try {
        const found = orderId ? await api.getOrder(orderId) : null;
        if (!found) {
          setOrder(null);
          setStatus('not_found');
          return;
        }
        const [everyRestaurant, all] = await Promise.all([api.listRestaurants(), api.listOrders()]);
        setOrder(found);
        setRestaurants(everyRestaurant);
        setRestaurant(everyRestaurant.find((r) => r.id === found.restaurantId) ?? null);
        setOrders(all.filter((o) => o.checkoutId === found.checkoutId));
        setStatus('ready');
      } catch {
        if (initial) setStatus('error');
      }
    },
    [orderId],
  );

  useEffect(() => {
    void load(true);
  }, [load]);

  const finished = order ? isTerminal(order) : false;
  useEffect(() => {
    if (status !== 'ready' || finished) return;
    const timer = setInterval(() => void load(false), PICKUP_POLL_MS);
    return () => clearInterval(timer);
  }, [status, finished, load]);

  return { order, restaurant, restaurants, orders, status, reload: () => load(true) };
}

/**
 * Sends the customer to the screen that matches the order's real state when a
 * pickup screen is opened (or left open) at another stage, e.g. the QR screen once
 * staff verified the order, or Completed for a picked-up order. Returns `true`
 * while a redirect is pending.
 */
export function usePickupRedirect(order: Order | null, allowed: PickupStage[]): boolean {
  const router = useRouter();
  const stage = order ? getPickupStage(order) : null;
  const target = order && stage && !allowed.includes(stage) ? resolvePickupRoute(order) : null;
  useEffect(() => {
    if (target) router.replace(target);
  }, [target, router]);
  return target !== null;
}

export type PickupScreenState = 'loading' | 'redirecting' | 'not_found' | 'error' | Exclude<PickupGate, 'ok'> | 'ok';

/**
 * One call per pickup screen: loads (and polls) the order, applies the gate
 * (unpaid / expired / cancelled / missing QR → an explanatory state) and, for a
 * usable order, redirects to the screen that matches its real stage when this
 * screen does not serve it. `state === 'ok'` means the screen can render `order`.
 */
export function usePickupScreen(orderId: string | undefined, allowed: PickupStage[]) {
  const data = usePickupOrder(orderId);
  const gate = data.order ? getPickupGate(data.order) : null;
  const redirecting = usePickupRedirect(gate === 'ok' ? data.order : null, allowed);
  const state: PickupScreenState =
    data.status === 'loading'
      ? 'loading'
      : data.status === 'not_found' || data.status === 'error'
        ? data.status
        : gate && gate !== 'ok'
          ? gate
          : redirecting
            ? 'redirecting'
            : 'ok';
  return { ...data, state };
}
