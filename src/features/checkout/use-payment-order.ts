import { useCallback, useEffect, useState } from 'react';

import { api } from '@/services/api';
import type { Order, PaymentSession } from '@/types';

import { ensurePaymentSession, retryOrderPayment } from './checkout-actions';
import { getCheckoutProgress, type CheckoutProgress } from './checkout-logic';

export type PaymentOrderStatus = 'loading' | 'ready' | 'not_found' | 'error';

/**
 * Loads the ORDER behind `/order/[orderId]/payment` and its current payment
 * session (created lazily, once per order). `retry` starts a new attempt for the
 * same order after a failed payment; it never creates another order.
 * `progress` describes the sibling orders of the same checkout (D-18).
 */
export function usePaymentOrder(orderId: string | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [progress, setProgress] = useState<CheckoutProgress | null>(null);
  const [status, setStatus] = useState<PaymentOrderStatus>('loading');
  const [retryError, setRetryError] = useState<string | undefined>();

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const found = orderId ? await api.getOrder(orderId) : null;
      if (!found) {
        setStatus('not_found');
        return;
      }
      setOrder(found);
      setSession(await ensurePaymentSession(found));
      setProgress(getCheckoutProgress(await api.listOrders(), found.checkoutId, found.id));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [orderId]);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    if (!orderId) return;
    const found = await api.getOrder(orderId);
    if (found) {
      setOrder(found);
      setProgress(getCheckoutProgress(await api.listOrders(), found.checkoutId, found.id));
    }
  }, [orderId]);

  const retry = async () => {
    if (!orderId) return;
    setRetryError(undefined);
    try {
      setSession(await retryOrderPayment(orderId));
    } catch (e) {
      setRetryError((e as Error).message);
    }
  };

  return { order, session, progress, status, reload: load, refresh, retry, retryError };
}
