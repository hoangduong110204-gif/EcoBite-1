import type { Order } from '@/types';
import { getCheckoutProgress } from '@/features/checkout/checkout-logic';

/**
 * Where an order is in the pickup flow. It is DERIVED from the existing order
 * lifecycle (`placed → paid → preparing → ready → qr_verified → picked_up`,
 * plus the terminal `cancelled` / `expired`); it adds no lifecycle state.
 */
export type PickupStage = 'unpaid' | 'preparing' | 'ready' | 'verified' | 'completed' | 'expired' | 'cancelled';

export const getPickupStage = (order: Pick<Order, 'status'>): PickupStage => {
  switch (order.status) {
    case 'placed':
      return 'unpaid';
    case 'paid':
    case 'preparing':
      return 'preparing';
    case 'ready':
      return 'ready';
    case 'qr_verified':
      return 'verified';
    case 'picked_up':
      return 'completed';
    case 'expired':
      return 'expired';
    case 'cancelled':
      return 'cancelled';
  }
};

/** Whether the pickup screens can be shown for this order at all. */
export type PickupGate = 'ok' | 'unpaid' | 'expired' | 'cancelled' | 'no_qr';

/**
 * An unpaid, expired or cancelled order has no usable pickup QR; a paid order
 * whose QR is missing is an error state, not a blank screen.
 */
export function getPickupGate(order: Pick<Order, 'status' | 'pickupQr'>): PickupGate {
  const stage = getPickupStage(order);
  if (stage === 'unpaid' || stage === 'expired' || stage === 'cancelled') return stage;
  return order.pickupQr ? 'ok' : 'no_qr';
}

/** Route builders of the pickup flow (`/order/[orderId]/…`). */
export const pickupRoutes = {
  qr: (orderId: string) => `/order/${orderId}/pickup-qr` as const,
  instructions: (orderId: string) => `/order/${orderId}/pickup-instructions` as const,
  /** Order Ready (8.4): preparing state until the restaurant marks the order ready. */
  ready: (orderId: string) => `/order/${orderId}/ready` as const,
  status: (orderId: string) => `/order/${orderId}/status` as const,
  arrived: (orderId: string) => `/order/${orderId}/arrived` as const,
  verified: (orderId: string) => `/order/${orderId}/verified` as const,
  completed: (orderId: string) => `/order/${orderId}/completed` as const,
  payment: (orderId: string) => `/order/${orderId}/payment` as const,
} as const;

export type PickupRoute = ReturnType<(typeof pickupRoutes)[keyof typeof pickupRoutes]>;

/**
 * Where an order belongs right now (used to resume it and to redirect a screen
 * opened at the wrong stage). `null` for expired / cancelled orders.
 */
export function resolvePickupRoute(order: Pick<Order, 'id' | 'status'>): PickupRoute | null {
  switch (getPickupStage(order)) {
    case 'unpaid':
      return pickupRoutes.payment(order.id);
    case 'preparing':
    case 'ready':
      return pickupRoutes.qr(order.id);
    case 'verified':
      return pickupRoutes.verified(order.id);
    case 'completed':
      return pickupRoutes.completed(order.id);
    default:
      return null;
  }
}

export type NextPickupStep =
  | { kind: 'pickup'; order: Order }
  | { kind: 'pay'; order: Order }
  | { kind: 'none' };

/**
 * Sequential multi-order pickup (decision D-21): after `currentOrderId`, the next
 * sibling order of the same checkout that still has to be picked up (paid and not
 * completed) comes first, then one that is still waiting for payment. Expired /
 * cancelled siblings are skipped. Each order keeps its own pickup QR and state.
 */
export function getNextPickupStep(orders: Order[], checkoutId: string, currentOrderId: string): NextPickupStep {
  const progress = getCheckoutProgress(orders, checkoutId, currentOrderId);
  const active = progress.orders.find((o) => o.id !== currentOrderId && ['paid', 'preparing', 'ready', 'qr_verified'].includes(o.status));
  if (active) return { kind: 'pickup', order: active };
  if (progress.nextToPay) return { kind: 'pay', order: progress.nextToPay };
  return { kind: 'none' };
}

/** "Đơn 1/2" position of an order among its checkout siblings; `null` for a single-order checkout. */
export function getOrderPosition(orders: Order[], checkoutId: string, orderId: string): { index: number; total: number } | null {
  const siblings = getCheckoutProgress(orders, checkoutId).orders;
  if (siblings.length < 2) return null;
  return { index: siblings.findIndex((o) => o.id === orderId) + 1, total: siblings.length };
}

/** Banner text of the tracking screens for the current stage (reference 8.2 / 8.4 / 8.5). */
export function getPickupStatusText(order: Pick<Order, 'status' | 'pickupSlot'>): { title: string; hint: string } {
  const slot = order.pickupSlot.label;
  switch (getPickupStage(order)) {
    case 'ready':
      return { title: 'Túi đã sẵn sàng', hint: `Tới quán trong khung giờ ${slot} để nhận` };
    case 'verified':
      return { title: 'QR đã được xác nhận', hint: 'Nhận túi từ nhân viên quán' };
    case 'completed':
      return { title: 'Đã nhận hàng', hint: 'Cảm ơn bạn đã cứu túi đồ ăn' };
    default:
      return { title: 'Quán đang chuẩn bị túi', hint: `Khung giờ nhận ${slot}` };
  }
}

/** Pickup Instructions (self-pickup only): the five things the customer does. */
export const PICKUP_INSTRUCTION_STEPS = [
  { title: 'Tới quán trong khung giờ đã chọn', detail: 'EcoBite không giao hàng, bạn tự đến quán nhận túi.' },
  { title: 'Mở mã QR nhận hàng', detail: 'Đưa màn hình cho nhân viên. Mã chỉ dùng được cho đơn này.' },
  { title: 'Nhân viên quét mã để xác nhận', detail: 'Máy quán hỏng? Đọc mã đơn cho nhân viên nhập tay.' },
  { title: 'Nhận túi và kiểm tra', detail: 'Xem túi có đúng như mô tả không.' },
  { title: 'Bấm “Tôi đã nhận đủ túi”', detail: 'Đơn chuyển sang Đã nhận hàng.' },
] as const;
