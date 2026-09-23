import type { Cart, FoodBag, PickupSlot } from '@/types';

import { EMPTY_CART, removeFromCart, setItemQuantity, setPickupSlot, setPromoCode, tryAddToCart } from './cart-logic';

export type CartAction =
  | { type: 'add'; bag: FoodBag; quantity: number; ownBox: boolean }
  | { type: 'set_quantity'; foodBagId: string; quantity: number; maxQuantity: number }
  | { type: 'remove'; foodBagId: string }
  | { type: 'clear' }
  | { type: 'set_pickup_slot'; restaurantId: string; slot: PickupSlot }
  | { type: 'set_promo'; code: string | null };

/**
 * Pure cart reducer. It only routes actions to the existing pure functions in
 * `cart-logic` (money stays in `utils/order-pricing`); it holds no rules of its
 * own. A rejected add (sold out, limit reached) leaves the cart unchanged.
 */
export function cartReducer(cart: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'add': {
      const result = tryAddToCart(cart, action.bag, action.quantity, action.ownBox);
      return result.ok ? result.cart : cart;
    }
    case 'set_quantity':
      return setItemQuantity(cart, action.foodBagId, action.quantity, action.maxQuantity);
    case 'remove':
      return removeFromCart(cart, action.foodBagId);
    case 'clear':
      return EMPTY_CART;
    case 'set_pickup_slot':
      // A slot only makes sense for a restaurant that has items in the cart.
      return cart.items.some((i) => i.restaurantId === action.restaurantId)
        ? setPickupSlot(cart, action.restaurantId, action.slot)
        : cart;
    case 'set_promo':
      return setPromoCode(cart, action.code);
  }
}
