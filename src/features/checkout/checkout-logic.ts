import type { Cart, FoodBag, Order, PickupSlot, PickupSlotOption, Promo, Restaurant } from '@/types';
import { buildCartView, type CartViewGroup } from '@/features/cart/cart-view';
import { isReadyForCheckout } from '@/features/cart/cart-logic';
import { isMainStatus } from '@/utils/order-lifecycle';
import { priceCartGroups, sumOrderMoney } from '@/utils/order-pricing';
import type { OrderMoney } from '@/types';

/** One restaurant of the checkout = one future Order (D-1). */
export interface CheckoutGroup {
  restaurant: Restaurant | null;
  /** Items, name and the chosen pickup time label from the real cart. */
  view: CartViewGroup;
  /** This order's money from `utils/order-pricing` (promo applied to the first qualifying restaurant). */
  money: OrderMoney;
  promoCode: string | null;
}

export interface CheckoutView {
  groups: CheckoutGroup[];
  /** Sum of every order's money (there is no delivery fee). */
  money: OrderMoney;
  bagCount: number;
  /** Number of Orders (and pickup QRs) this checkout creates. */
  orderCount: number;
  /** Restaurants still without a pickup time. */
  missingSlots: string[];
  /** Every restaurant has a pickup time and the cart is not empty. */
  ready: boolean;
}

/** Joins the real cart with catalog data for Checkout / Summary / Payment Method. Money comes from `utils/order-pricing`. */
export function buildCheckoutView(cart: Cart, bags: FoodBag[], restaurants: Restaurant[], promos: Promo[]): CheckoutView {
  const cartView = buildCartView(cart, bags, restaurants);
  const promo = cart.promoCode ? (promos.find((p) => p.code === cart.promoCode) ?? null) : null;
  const priced = priceCartGroups(cart, promo);
  const groups = cartView.groups.map((view, i): CheckoutGroup => ({
    restaurant: restaurants.find((r) => r.id === view.restaurantId) ?? null,
    view,
    money: priced[i].money,
    promoCode: priced[i].promoCode,
  }));
  return {
    groups,
    money: sumOrderMoney(groups.map((g) => g.money)),
    bagCount: cartView.count,
    orderCount: groups.length,
    missingSlots: groups.filter((g) => !g.view.pickupLabel).map((g) => g.view.restaurantName),
    ready: isReadyForCheckout(cart),
  };
}

// ---------------------------------------------------------------- pickup time

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
};

export interface PickupWindowBounds {
  start: string;
  end: string;
}

/** Times at which every bag of this restaurant in the cart can be collected: the intersection of their windows. `null` if they never overlap. */
export function getPickupWindow(bags: Pick<FoodBag, 'pickupWindow'>[]): PickupWindowBounds | null {
  if (bags.length === 0) return null;
  const start = Math.max(...bags.map((b) => toMinutes(b.pickupWindow.start)));
  const end = Math.min(...bags.map((b) => toMinutes(b.pickupWindow.end)));
  if (start >= end) return null;
  const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  return { start: fmt(start), end: fmt(end) };
}

export const isSlotWithinWindow = (slot: Pick<PickupSlot, 'start' | 'end'>, window: PickupWindowBounds | null): boolean =>
  window !== null && toMinutes(slot.start) >= toMinutes(window.start) && toMinutes(slot.end) <= toMinutes(window.end);

/** A slot can be chosen when it still has capacity and lies inside the bags' pickup window. */
export const canSelectSlot = (option: PickupSlotOption, window: PickupWindowBounds | null): boolean =>
  option.left > 0 && isSlotWithinWindow(option, window);

/** Slots to list for a restaurant: only those inside the bags' window (full ones stay visible, disabled). */
export const listSlotsInWindow = (options: PickupSlotOption[], window: PickupWindowBounds | null): PickupSlotOption[] =>
  options.filter((o) => isSlotWithinWindow(o, window));

/** The `PickupSlot` stored on the cart for an option (drops `id` / `left`). */
export const toPickupSlot = (option: PickupSlotOption): PickupSlot => ({
  label: option.label,
  date: option.date,
  start: option.start,
  end: option.end,
});

// ------------------------------------------------------------ multi-order flow

export interface CheckoutProgress {
  /** Orders of this checkout, in creation order (order codes ascend). */
  orders: Order[];
  /** Orders whose payment succeeded. */
  paid: Order[];
  /** First order still waiting for payment (`placed`), other than `currentOrderId`. */
  nextToPay: Order | null;
  /** First paid order that has not been picked up: the initial Pickup QR destination. */
  firstPickup: Order | null;
}

/**
 * Sequential multi-order payment (decision D-18): each restaurant's order is
 * paid on its own QR, one after another. Expired / cancelled orders are
 * skipped. `orders` may contain orders of other checkouts; they are filtered.
 */
export function getCheckoutProgress(orders: Order[], checkoutId: string, currentOrderId?: string): CheckoutProgress {
  const mine = orders.filter((o) => o.checkoutId === checkoutId).sort((a, b) => a.orderCode.localeCompare(b.orderCode));
  const paid = mine.filter((o) => isMainStatus(o.status) && o.status !== 'placed');
  return {
    orders: mine,
    paid,
    nextToPay: mine.find((o) => o.status === 'placed' && o.id !== currentOrderId) ?? null,
    firstPickup: paid.find((o) => o.status !== 'picked_up') ?? null,
  };
}
