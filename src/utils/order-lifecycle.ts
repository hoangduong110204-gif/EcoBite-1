import {
  CANCELLABLE_STATUSES,
  ORDER_EXCEPTION_STATUSES,
  ORDER_STATUS_SEQUENCE,
} from '@/constants/order-status';
import type {
  Order,
  OrderCancellation,
  OrderExceptionStatus,
  OrderState,
  OrderStatus,
} from '@/types';

export const isExceptionStatus = (state: OrderState): state is OrderExceptionStatus =>
  (ORDER_EXCEPTION_STATUSES as readonly OrderState[]).includes(state);

export const isMainStatus = (state: OrderState): state is OrderStatus => !isExceptionStatus(state);

/** Next status in the main lifecycle, or null when finished or in an exception state. */
export const getNextOrderStatus = (state: OrderState): OrderStatus | null =>
  isMainStatus(state) ? (ORDER_STATUS_SEQUENCE[ORDER_STATUS_SEQUENCE.indexOf(state) + 1] ?? null) : null;

/** Main lifecycle is strictly linear: only the immediate next status is allowed. */
export const canTransition = (from: OrderState, to: OrderStatus): boolean =>
  getNextOrderStatus(from) === to;

/** `cancelled`, `expired` and `picked_up` are final. */
export const isTerminal = (order: Pick<Order, 'status'>): boolean =>
  isExceptionStatus(order.status) || order.status === 'picked_up';

/** Returns a copy of the order advanced to `to`, or throws on an illegal jump. */
export const transitionOrder = (order: Order, to: OrderStatus, at = new Date()): Order => {
  if (!canTransition(order.status, to)) {
    throw new Error(`Illegal order transition: ${order.status} -> ${to}`);
  }
  return {
    ...order,
    status: to,
    statusHistory: { ...order.statusHistory, [to]: at.toISOString() },
  };
};

/** A customer may cancel only before the restaurant starts preparing (`placed` / `paid`). */
export const canCancel = (order: Pick<Order, 'status'>): boolean =>
  isMainStatus(order.status) && CANCELLABLE_STATUSES.includes(order.status);

/**
 * Cancels an order (terminal, outside the main sequence). A paid order gets a
 * full refund (`pending` until the provider confirms); an unpaid one has none.
 * The pickup QR is invalidated.
 */
export const cancelOrder = (
  order: Order,
  input: { reason: string; cancelledBy: OrderCancellation['cancelledBy'] },
  at = new Date(),
): Order => {
  if (!canCancel(order)) {
    throw new Error(`Order ${order.orderCode} cannot be cancelled in status ${order.status}`);
  }
  const paid = order.paymentStatus === 'success';
  const iso = at.toISOString();
  return {
    ...order,
    status: 'cancelled',
    pickupQr: null,
    cancellation: {
      reason: input.reason,
      cancelledBy: input.cancelledBy,
      cancelledAt: iso,
      refund: paid
        ? { amount: order.money.total, status: 'pending', refundedAt: null }
        : { amount: 0, status: 'none', refundedAt: null },
    },
    statusHistory: { ...order.statusHistory, cancelled: iso },
  };
};

/** Only an unpaid (`placed`) order can expire: its payment hold ran out. */
export const canExpire = (order: Pick<Order, 'status'>): boolean => order.status === 'placed';

export const expireOrder = (order: Order, at = new Date()): Order => {
  if (!canExpire(order)) {
    throw new Error(`Order ${order.orderCode} cannot expire in status ${order.status}`);
  }
  return {
    ...order,
    status: 'expired',
    paymentStatus: 'expired',
    statusHistory: { ...order.statusHistory, expired: at.toISOString() },
  };
};
