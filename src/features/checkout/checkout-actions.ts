import { api } from '@/services/api';
import { paymentService } from '@/services/payment';
import type { Order, PaymentMethodId, PaymentSession, PickupSlotOption } from '@/types';

import { getAuthState } from '@/features/auth/auth-store';
import { clearCart, getCart, isReadyForCheckout, setRestaurantPickupSlot } from '@/features/cart';
import { canSelectSlot, getPickupWindow, toPickupSlot } from './checkout-logic';
import { getPaymentSession, rememberPaymentSession } from './checkout-store';

export const CHECKOUT_ROUTE = '/order/checkout' as const;
export const PICKUP_TIME_ROUTE = '/order/pickup-time' as const;
export const SUMMARY_ROUTE = '/order/summary' as const;
export const PAYMENT_METHOD_ROUTE = '/order/payment-method' as const;

export const CHECKOUT_MESSAGES = {
  empty_cart: 'Giỏ hàng đang trống.',
  missing_pickup_slot: 'Hãy chọn giờ nhận cho tất cả các quán.',
  method_unavailable: 'Cách thanh toán này chưa được hỗ trợ.',
  unavailable: 'Một số túi vừa hết hàng. Hãy quay lại giỏ hàng để cập nhật.',
  invalid_slot: 'Khung giờ này không còn chỗ hoặc nằm ngoài giờ nhận của túi.',
} as const;

// ------------------------------------------------------------------ pickup time

export type SelectSlotResult = { ok: true } | { ok: false; message: string };

/**
 * Stores the chosen pickup time for ONE restaurant in the real cart. Only a
 * slot with capacity that lies inside the restaurant's bag pickup windows is accepted.
 */
export async function selectPickupSlot(restaurantId: string, option: PickupSlotOption): Promise<SelectSlotResult> {
  const cart = getCart();
  const bagIds = cart.items.filter((i) => i.restaurantId === restaurantId).map((i) => i.foodBagId);
  if (bagIds.length === 0) return { ok: false, message: CHECKOUT_MESSAGES.invalid_slot };
  const bags = (await api.listFoodBags(restaurantId)).filter((b) => bagIds.includes(b.id));
  if (!canSelectSlot(option, getPickupWindow(bags))) return { ok: false, message: CHECKOUT_MESSAGES.invalid_slot };
  setRestaurantPickupSlot(restaurantId, toPickupSlot(option));
  return { ok: true };
}

// ---------------------------------------------------------------------- payment

/**
 * The current payment session of an order, creating one when there is none.
 * Idempotent per order: it never creates a second ORDER, and an order that is
 * not `placed` (paid, expired, cancelled) gets no session.
 */
export async function ensurePaymentSession(order: Order, method: PaymentMethodId = 'bank_qr'): Promise<PaymentSession | null> {
  const existing = getPaymentSession(order.id);
  if (existing) return existing;
  if (order.status !== 'placed') return null;
  const session = await paymentService.createPayment({ orderId: order.id, orderCode: order.orderCode, amount: order.money.total, method });
  rememberPaymentSession(session);
  return session;
}

/** Retry after a failed attempt (inside the 5-minute window): a NEW session for the SAME order. */
export async function retryOrderPayment(orderId: string): Promise<PaymentSession> {
  const current = getPaymentSession(orderId);
  if (!current) throw new Error(`No payment session for order ${orderId}`);
  const next = await paymentService.retryPayment(current.id);
  rememberPaymentSession(next);
  return next;
}

export const paymentRoute = (orderId: string) => `/order/${orderId}/payment` as const;

export type PlaceCheckoutResult =
  | { ok: true; checkoutId: string; orders: Order[]; session: PaymentSession | null; route: ReturnType<typeof paymentRoute> }
  | { ok: false; reason: keyof typeof CHECKOUT_MESSAGES; message: string };

/**
 * "Tiếp tục thanh toán": validates the real cart, creates ONE Order per
 * restaurant (`api.checkout`, all sharing a checkoutId), CLEARS the cart once
 * the orders are committed (never earlier, never on failure), then creates the
 * payment session of the FIRST order. The other orders are paid afterwards, one
 * QR at a time (D-18); their sessions are created when their turn comes.
 */
export async function placeCheckout(input: { method?: PaymentMethodId } = {}): Promise<PlaceCheckoutResult> {
  const method = input.method ?? 'bank_qr';
  const fail = (reason: keyof typeof CHECKOUT_MESSAGES): PlaceCheckoutResult => ({ ok: false, reason, message: CHECKOUT_MESSAGES[reason] });

  const cart = getCart();
  if (cart.items.length === 0) return fail('empty_cart');
  if (!isReadyForCheckout(cart)) return fail('missing_pickup_slot');
  const methods = await paymentService.listPaymentMethods();
  if (!methods.find((m) => m.id === method)?.enabled) return fail('method_unavailable');

  let created;
  try {
    created = await api.checkout({ cart, userId: getAuthState().account?.id });
  } catch {
    return fail('unavailable');
  }
  clearCart(); // orders are committed: the cart must not still hold them

  const [first] = created.orders;
  let session: PaymentSession | null = null;
  try {
    session = await ensurePaymentSession(first, method);
  } catch {
    session = null; // the payment screen creates it lazily; the orders already exist
  }
  return { ok: true, checkoutId: created.checkoutId, orders: created.orders, session, route: paymentRoute(first.id) };
}

export const paymentSuccessRoute = (orderId: string) => `/order/${orderId}/payment-success` as const;

/** Where "Xem mã nhận hàng" goes. Pickup QR (8.3) is built in U1.6. */
export const pickupQrRoute = (orderId: string) => `/order/${orderId}/pickup-qr` as const;
