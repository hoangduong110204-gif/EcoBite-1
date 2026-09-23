import type { OrderExceptionStatus, OrderState, OrderStatus } from '@/types';

/** Main lifecycle order. Index = stage number - 1. */
export const ORDER_STATUS_SEQUENCE: readonly OrderStatus[] = [
  'placed',
  'paid',
  'preparing',
  'ready',
  'qr_verified',
  'picked_up',
];

/** Terminal exception states, outside the main sequence. */
export const ORDER_EXCEPTION_STATUSES: readonly OrderExceptionStatus[] = ['cancelled', 'expired'];

/** A customer may cancel only before the restaurant starts preparing. */
export const CANCELLABLE_STATUSES: readonly OrderStatus[] = ['placed', 'paid'];

export const ORDER_STATUS_LABEL: Record<OrderState, string> = {
  placed: 'Đã đặt hàng',
  paid: 'Đã thanh toán',
  preparing: 'Quán đang chuẩn bị',
  ready: 'Sẵn sàng nhận hàng',
  qr_verified: 'QR đã được xác nhận',
  picked_up: 'Đã nhận hàng',
  cancelled: 'Đã huỷ',
  expired: 'Hết hạn giữ chỗ',
};

/** Badge tone per state (reference: ready = green, preparing = amber, picked up / expired = grey, cancelled = red). */
export type StatusTone = 'green' | 'amber' | 'red' | 'gray' | 'solid';

export const ORDER_STATUS_TONE: Record<OrderState, StatusTone> = {
  placed: 'gray',
  paid: 'green',
  preparing: 'amber',
  ready: 'green',
  qr_verified: 'green',
  picked_up: 'gray',
  cancelled: 'red',
  expired: 'gray',
};
