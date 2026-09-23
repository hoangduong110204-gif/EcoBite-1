import { OWN_BOX_DISCOUNT_PER_BAG } from '@/constants/policy';
import { api } from '@/services/api';
import type { PickupSlot } from '@/types';
import { formatMoney } from '@/utils/format';

import { tryAddToCart, type AddToCartFailure } from './cart-logic';
import { dispatchCart, getCart } from './cart-store';

export const CART_ROUTE = '/cart' as const;

export const CART_MESSAGES = {
  not_found: 'Không tìm thấy túi này.',
  sold_out: 'Túi này đã hết hôm nay.',
  limit_reached: 'Bạn đã thêm tất cả số túi quán còn lại.',
  invalid_quantity: 'Số lượng không hợp lệ.',
  /** Own-box hint, e.g. "−2.000đ/túi". */
  ownBoxHint: `−${formatMoney(OWN_BOX_DISCOUNT_PER_BAG)}/túi`,
} as const;

export type AddBagResult =
  | { ok: true; added: number; route: typeof CART_ROUTE }
  | { ok: false; reason: AddToCartFailure | 'not_found'; message: string };

/**
 * Adds a bag to the real session cart. Looks the bag up through `services/api`
 * (unknown id → `not_found`), validates with `tryAddToCart` (sold out, limit,
 * quantity) and only then updates the store. Screens navigate to `route`.
 */
export async function addBagToCart(input: { foodBagId: string; quantity: number; ownBox?: boolean }): Promise<AddBagResult> {
  const bag = await api.getFoodBag(input.foodBagId);
  if (!bag) return { ok: false, reason: 'not_found', message: CART_MESSAGES.not_found };
  const ownBox = input.ownBox ?? false;
  const result = tryAddToCart(getCart(), bag, input.quantity, ownBox);
  if (!result.ok) return { ok: false, reason: result.reason, message: CART_MESSAGES[result.reason] };
  dispatchCart({ type: 'add', bag, quantity: input.quantity, ownBox });
  return { ok: true, added: result.added, route: CART_ROUTE };
}

/** Stepper change on a cart line. 0 removes the line (the screen confirms first). */
export const setCartItemQuantity = (foodBagId: string, quantity: number, maxQuantity: number) =>
  dispatchCart({ type: 'set_quantity', foodBagId, quantity, maxQuantity });

export const removeCartItem = (foodBagId: string) => dispatchCart({ type: 'remove', foodBagId });

export const clearCart = () => dispatchCart({ type: 'clear' });

/** Pickup time per restaurant (chosen at checkout in U1.5); the store already keeps one per restaurant. */
export const setRestaurantPickupSlot = (restaurantId: string, slot: PickupSlot) =>
  dispatchCart({ type: 'set_pickup_slot', restaurantId, slot });
