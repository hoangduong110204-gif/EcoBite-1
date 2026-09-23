import type { Order, PaymentMethodId } from '@/types';
import { pickupRoutes } from '@/features/pickup/pickup-logic';
import { formatDayMonthVN, formatMoney, formatTimeVN } from '@/utils/format';
import { calcImpact, countBags } from '@/utils/impact';
import { isTerminal } from '@/utils/order-lifecycle';

/** The three segments of Orders (reference 9.1: "Đang xử lý · N", "Đã xong · N", "Đã huỷ · N"). */
export type OrderTab = 'active' | 'completed' | 'cancelled';

export const ORDER_TABS: readonly { key: OrderTab; label: string }[] = [
  { key: 'active', label: 'Đang xử lý' },
  { key: 'completed', label: 'Đã xong' },
  { key: 'cancelled', label: 'Đã huỷ' },
];

/**
 * Which segment an order belongs to. Not terminal (placed, paid, preparing, ready,
 * qr_verified) = active; `picked_up` = completed; `cancelled` and `expired` =
 * cancelled (reference 9.4 shows both there). Pure display logic, never mutates.
 */
export const getOrderTab = (order: Pick<Order, 'status'>): OrderTab => {
  if (order.status === 'picked_up') return 'completed';
  if (order.status === 'cancelled' || order.status === 'expired') return 'cancelled';
  return 'active';
};

export const isActiveOrder = (order: Pick<Order, 'status'>): boolean => !isTerminal(order);

const byCreatedDesc = (a: Order, b: Order) => Date.parse(b.createdAt) - Date.parse(a.createdAt);
/** Active orders: nearest pickup deadline first (reference 9.2), then newest. */
const byDeadline = (a: Order, b: Order) => a.pickupSlot.end.localeCompare(b.pickupSlot.end) || byCreatedDesc(a, b);

/** Orders of one segment, sorted for display. Returns a new array. */
export function filterOrders(orders: readonly Order[], tab: OrderTab): Order[] {
  return orders.filter((o) => getOrderTab(o) === tab).sort(tab === 'active' ? byDeadline : byCreatedDesc);
}

export function countOrdersByTab(orders: readonly Order[]): Record<OrderTab, number> {
  const counts: Record<OrderTab, number> = { active: 0, completed: 0, cancelled: 0 };
  for (const order of orders) counts[getOrderTab(order)] += 1;
  return counts;
}

/** Segment opened first: the active one when there is anything to resume, else the completed one. */
export const getDefaultTab = (orders: readonly Order[]): OrderTab => (countOrdersByTab(orders).active > 0 ? 'active' : 'completed');

export const orderDetailRoute = (orderId: string) => `/order/${orderId}` as const;

export type OrderRoute = ReturnType<typeof orderDetailRoute> | ReturnType<(typeof pickupRoutes)[keyof typeof pickupRoutes]>;

/**
 * The one screen an order opens (D-5): a live order goes to its flow, a finished
 * one to the read-only detail. `/order/[orderId]` is ONLY for finished orders, so
 * the detail screen redirects an active order here.
 *  - placed                       → payment (the hold is still running)
 *  - paid / preparing / ready     → `/order/[orderId]/status` (timeline)
 *  - qr_verified                  → QR Verified (completion)
 *  - picked_up / cancelled / expired → `/order/[orderId]` (detail)
 */
export function resolveOrderRoute(order: Pick<Order, 'id' | 'status'>): OrderRoute {
  switch (order.status) {
    case 'placed':
      return pickupRoutes.payment(order.id);
    case 'paid':
    case 'preparing':
    case 'ready':
      return pickupRoutes.status(order.id);
    case 'qr_verified':
      return pickupRoutes.verified(order.id);
    default:
      return orderDetailRoute(order.id);
  }
}

export interface OrderAction {
  key: 'open_qr' | 'pay' | 'confirm_receipt';
  label: string;
  route: OrderRoute;
}

/** The single resume action shown on an active order card (reference 9.1 "Mở QR"). None for finished orders. */
export function getOrderAction(order: Pick<Order, 'id' | 'status'>): OrderAction | null {
  switch (order.status) {
    case 'placed':
      return { key: 'pay', label: 'Thanh toán ngay', route: pickupRoutes.payment(order.id) };
    case 'paid':
    case 'preparing':
    case 'ready':
      return { key: 'open_qr', label: 'Mở mã nhận hàng', route: pickupRoutes.qr(order.id) };
    case 'qr_verified':
      return { key: 'confirm_receipt', label: 'Xác nhận đã nhận túi', route: pickupRoutes.verified(order.id) };
    default:
      return null;
  }
}

/** Impact of a set of orders (only `picked_up` ones count), via `utils/impact`. */
export function summarizeCompleted(orders: readonly Order[]): { orderCount: number; bags: number; foodKg: number; co2Kg: number } {
  const done = orders.filter((o) => o.status === 'picked_up');
  const bags = countBags(done.flatMap((o) => o.items));
  return { orderCount: done.length, bags, ...calcImpact(bags) };
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethodId, string> = {
  bank_qr: 'Chuyển khoản QR',
  e_wallet: 'Ví điện tử',
  card: 'Thẻ ngân hàng',
  cash: 'Tiền mặt tại quán',
};

/** Whether an order belongs to the signed-in account (an order of another account is treated as not found). */
export const isOrderOwnedBy = (order: Pick<Order, 'userId'>, accountId: string | null | undefined): boolean =>
  !accountId || order.userId === accountId;

/** Right-hand line of an order card: pickup window for a live order, receipt time / reason for a finished one. */
export function getOrderCardSubtitle(order: Pick<Order, 'status' | 'pickupSlot' | 'statusHistory' | 'createdAt' | 'cancellation'>): string {
  switch (order.status) {
    case 'picked_up': {
      const at = order.statusHistory.picked_up ?? order.createdAt;
      return `${formatDayMonthVN(at)} · đã nhận ${formatTimeVN(at)}`;
    }
    case 'cancelled':
      return `${formatDayMonthVN(order.cancellation?.cancelledAt ?? order.createdAt)} · lý do: ${order.cancellation?.reason ?? 'đã huỷ'}`;
    case 'expired':
      return `${formatDayMonthVN(order.createdAt)} · chưa thanh toán trong 10 phút`;
    default:
      return `Hôm nay · nhận ${order.pickupSlot.label}`;
  }
}

/** Refund line of a cancelled order (reference 9.4), or `null` when nothing was paid. */
export function getRefundLine(order: Pick<Order, 'cancellation'>): string | null {
  const refund = order.cancellation?.refund;
  if (!refund || refund.status === 'none' || refund.amount <= 0) return null;
  return refund.status === 'refunded'
    ? `Đã hoàn ${formatMoney(refund.amount)}${refund.refundedAt ? ` · ${formatDayMonthVN(refund.refundedAt)}` : ''}`
    : `Đang hoàn ${formatMoney(refund.amount)}`;
}
