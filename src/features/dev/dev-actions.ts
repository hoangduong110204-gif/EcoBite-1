import { api } from '@/services/api';
import { setMockPaymentScenario } from '@/services/payment';
import type { MockPaymentScenario } from '@/services/payment';
import type { Order } from '@/types';
import { getNextOrderStatus, isMainStatus } from '@/utils/order-lifecycle';

/**
 * Development-only controls (D-17). They stand in for the parts of the system
 * that live outside the customer app (bank webhook, restaurant dashboard,
 * staff scanner) and ONLY dispatch to the existing mock services. No business
 * rules are duplicated here: legality of each step is enforced by the services
 * and `utils/order-lifecycle`.
 *
 * Nothing in this file is wired into production UI; it is mounted through
 * `components/dev/DevMenu` behind `__DEV__`.
 */

/** Choose how the next payment sessions resolve. */
export const devSetPaymentScenario = (
  outcome: MockPaymentScenario['outcome'],
  resolveAfterMs = 1500,
): void => setMockPaymentScenario({ outcome, resolveAfterMs });

export type DevAdvanceResult =
  | { ok: true; order: Order; action: string }
  | { ok: false; reason: string };

/**
 * Advances an order by ONE main-lifecycle step by calling the matching mock
 * service:
 *   placed      -> api.markOrderPaid            (bank confirms the transfer)
 *   paid        -> api.simulateRestaurantProgress (restaurant starts preparing)
 *   preparing   -> api.simulateRestaurantProgress (restaurant marks ready)
 *   ready       -> api.verifyPickupQr           (staff scan the PICKUP QR token)
 *   qr_verified -> api.completePickup           (food handed over)
 */
export async function devAdvanceOrder(orderId: string): Promise<DevAdvanceResult> {
  const order = await api.getOrder(orderId);
  if (!order) return { ok: false, reason: `Order not found: ${orderId}` };
  if (!isMainStatus(order.status)) return { ok: false, reason: `Order is ${order.status} (terminal)` };
  const next = getNextOrderStatus(order.status);
  if (!next) return { ok: false, reason: 'Order is already completed' };

  try {
    switch (order.status) {
      case 'placed':
        return { ok: true, order: await api.markOrderPaid(orderId), action: 'markOrderPaid' };
      case 'paid':
      case 'preparing':
        return {
          ok: true,
          order: await api.simulateRestaurantProgress(orderId),
          action: 'simulateRestaurantProgress',
        };
      case 'ready':
        if (!order.pickupQr) return { ok: false, reason: 'Order has no pickup QR' };
        return {
          ok: true,
          order: await api.verifyPickupQr(orderId, order.pickupQr.token),
          action: 'verifyPickupQr',
        };
      case 'qr_verified':
        return { ok: true, order: await api.completePickup(orderId), action: 'completePickup' };
      default:
        return { ok: false, reason: `Nothing to do for ${order.status}` };
    }
  } catch (error) {
    return { ok: false, reason: (error as Error).message };
  }
}

/** Expires an unpaid order (payment hold ran out) via the existing service. */
export const devExpireOrder = (orderId: string) => api.expireOrder(orderId);

/** Cancels an order before preparation via the existing service. */
export const devCancelOrder = (orderId: string) => api.cancelOrder(orderId, 'Huỷ từ dev menu');
