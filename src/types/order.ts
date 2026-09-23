import type { IsoDateString, Money } from './common';
import type { PaymentMethodId, PaymentStatus } from './payment';
import type { PickupQr, PickupSlot } from './pickup';

/**
 * Main order lifecycle (strictly linear). Vietnamese labels live in
 * constants/order-status.ts.
 *
 *  1. placed      — Đã đặt hàng
 *  2. paid        — Đã thanh toán
 *  3. preparing   — Quán đang chuẩn bị
 *  4. ready       — Sẵn sàng nhận hàng
 *  5. qr_verified — QR đã được xác nhận
 *  6. picked_up   — Đã nhận hàng (the reference calls this COMPLETED)
 */
export type OrderStatus =
  | 'placed'
  | 'paid'
  | 'preparing'
  | 'ready'
  | 'qr_verified'
  | 'picked_up';

/**
 * Terminal exception states, OUTSIDE the main sequence.
 *  - cancelled: cancelled by the customer or the system (only before `preparing`).
 *  - expired:   the payment hold ran out before payment succeeded.
 */
export type OrderExceptionStatus = 'cancelled' | 'expired';

/** Every state an order can be in. */
export type OrderState = OrderStatus | OrderExceptionStatus;

export interface OrderItem {
  foodBagId: string;
  name: string;
  quantity: number;
  unitPrice: Money;
  originalPrice: Money;
  ownBox: boolean;
}

/**
 * Money breakdown. There is deliberately no delivery fee: EcoBite is
 * self-pickup only.
 *
 *   total = subtotal - promoDiscount - ownBoxDiscount
 *
 * `bagSavings` (original price - price) is informational and not part of `total`.
 */
export interface OrderMoney {
  /** Sum of unitPrice x quantity. */
  subtotal: Money;
  /** Sum of (originalPrice - unitPrice) x quantity. Informational. */
  bagSavings: Money;
  promoDiscount: Money;
  ownBoxDiscount: Money;
  total: Money;
}

export type RefundStatus = 'none' | 'pending' | 'refunded';

export interface RefundInfo {
  amount: Money;
  status: RefundStatus;
  refundedAt: IsoDateString | null;
}

export interface OrderCancellation {
  reason: string;
  cancelledBy: 'customer' | 'system';
  cancelledAt: IsoDateString;
  refund: RefundInfo;
}

/** One Order per restaurant. Orders created by one checkout share `checkoutId`. */
export interface Order {
  id: string;
  /** Human-readable code, e.g. `EB-2409-017`. Shown to customer and staff. */
  orderCode: string;
  /** Groups the sibling orders created by one multi-restaurant checkout. */
  checkoutId: string;
  userId: string;
  restaurantId: string;
  pickupLocationId: string;
  items: OrderItem[];
  money: OrderMoney;
  promoCode: string | null;
  status: OrderState;
  /**
   * Payment progress is tracked separately from the lifecycle: a failed
   * payment leaves the order at `placed` (retry window), an expired one moves
   * it to `expired`.
   */
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethodId;
  pickupSlot: PickupSlot;
  /** Issued only after payment succeeds. */
  pickupQr: PickupQr | null;
  /** Set only when `status = cancelled`. */
  cancellation: OrderCancellation | null;
  /** Timestamp at which each state was reached. */
  statusHistory: Partial<Record<OrderState, IsoDateString>>;
  createdAt: IsoDateString;
}

/** Result of one checkout: several orders (one per restaurant) that share `checkoutId`. */
export interface CheckoutResult {
  checkoutId: string;
  orders: Order[];
}

/** One restaurant's share of a cart, priced and ready to become an Order. */
export interface OrderDraft {
  restaurantId: string;
  items: OrderItem[];
  money: OrderMoney;
  promoCode: string | null;
  pickupSlot: PickupSlot;
}
