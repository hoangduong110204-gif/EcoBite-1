import type { Money } from './common';
import type { PickupSlot } from './pickup';

export interface CartItem {
  foodBagId: string;
  restaurantId: string;
  /** Snapshot of the bag name at add time. */
  name: string;
  quantity: number;
  /** Unit price captured when the item was added. */
  unitPrice: Money;
  /** Pre-discount price captured when the item was added. */
  originalPrice: Money;
  /** Customer brings their own box (small per-bag discount). */
  ownBox: boolean;
}

/**
 * A cart may hold bags from several restaurants. At checkout it is grouped by
 * restaurant and one Order (with its own pickup QR) is created per group.
 */
export interface Cart {
  items: CartItem[];
  /** Pickup slot chosen per restaurant id. A restaurant without one cannot be checked out yet. */
  pickupSlots: Record<string, PickupSlot>;
  promoCode: string | null;
}

/** Cart items of one restaurant (= one future Order). */
export interface CartGroup {
  restaurantId: string;
  items: CartItem[];
  /** Number of bags. */
  count: number;
  /** Sum of unitPrice x quantity. */
  subtotal: Money;
  pickupSlot: PickupSlot | null;
}
