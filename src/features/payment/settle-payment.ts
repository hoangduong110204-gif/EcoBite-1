import { api } from '@/services/api';
import type { Order, PaymentSession } from '@/types';

/**
 * Applies a finished payment to its order (the bank-webhook step of the real
 * system):
 *  - success -> order `paid` and the PICKUP QR is issued
 *  - expired -> order `expired`
 *  - failed  -> nothing: the order stays `placed` for the retry window
 * Idempotent: an order that already left `placed` is returned unchanged.
 */
export async function settlePayment(session: PaymentSession): Promise<Order | null> {
  if (session.status === 'pending' || session.status === 'failed') return null;
  const order = await api.getOrder(session.orderId);
  if (!order || order.status !== 'placed') return order;
  return session.status === 'success'
    ? api.markOrderPaid(order.id)
    : api.expireOrder(order.id);
}
