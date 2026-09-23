import type { Cart, FoodBag, PickupSlot } from '@/types';
import { groupCartByRestaurant } from '@/utils/order-pricing';

export {
  buildOrderDrafts,
  calcPromoDiscount,
  computeOrderMoney,
  getLineTotal,
  groupCartByRestaurant,
  isPromoApplicable,
  priceCartGroups,
  sumOrderMoney,
} from '@/utils/order-pricing';

export const EMPTY_CART: Cart = { items: [], pickupSlots: {}, promoCode: null };

/** Bags of `foodBagId` already reserved in the session cart. */
export const getBagQuantityInCart = (cart: Cart, foodBagId: string): number =>
  cart.items.find((i) => i.foodBagId === foodBagId)?.quantity ?? 0;

/** How many more units of `bag` can still be added: what the restaurant has left minus what the cart already holds. */
export const getAddableQuantity = (cart: Cart, bag: Pick<FoodBag, 'id' | 'left'>): number =>
  Math.max(0, bag.left - getBagQuantityInCart(cart, bag.id));

export type AddToCartFailure = 'sold_out' | 'limit_reached' | 'invalid_quantity';

export type AddToCartResult =
  | { ok: true; cart: Cart; added: number }
  | { ok: false; reason: AddToCartFailure };

/**
 * Validating add: a sold-out bag, a quantity below 1, or a cart that already
 * holds every remaining unit is rejected. A request above the addable amount is
 * clamped to it (`added` says how many units went in).
 */
export const tryAddToCart = (cart: Cart, bag: FoodBag, quantity = 1, ownBox = false): AddToCartResult => {
  if (!Number.isInteger(quantity) || quantity < 1) return { ok: false, reason: 'invalid_quantity' };
  if (bag.left <= 0) return { ok: false, reason: 'sold_out' };
  const addable = getAddableQuantity(cart, bag);
  if (addable <= 0) return { ok: false, reason: 'limit_reached' };
  const added = Math.min(quantity, addable);
  return { ok: true, cart: addToCart(cart, bag, added, ownBox), added };
};

/**
 * Adds a bag. Bags of several restaurants can live in one cart (D-1); the
 * quantity of a bag never exceeds what the restaurant has left. A sold-out bag
 * or a quantity below 1 leaves the cart unchanged.
 */
export const addToCart = (cart: Cart, bag: FoodBag, quantity = 1, ownBox = false): Cart => {
  if (bag.left <= 0 || quantity < 1) return cart;
  const existing = cart.items.find((i) => i.foodBagId === bag.id);
  if (existing) {
    return {
      ...cart,
      items: cart.items.map((i) =>
        i.foodBagId === bag.id
          ? { ...i, quantity: Math.min(i.quantity + quantity, bag.left), ownBox }
          : i,
      ),
    };
  }
  return {
    ...cart,
    items: [
      ...cart.items,
      {
        foodBagId: bag.id,
        restaurantId: bag.restaurantId,
        name: bag.name,
        quantity: Math.min(quantity, bag.left),
        unitPrice: bag.price,
        originalPrice: bag.originalPrice,
        ownBox,
      },
    ],
  };
};

/** Sets a line quantity (clamped to `maxQuantity`); a quantity of 0 removes the line. */
export const setItemQuantity = (
  cart: Cart,
  foodBagId: string,
  quantity: number,
  maxQuantity = Number.POSITIVE_INFINITY,
): Cart =>
  quantity <= 0
    ? removeFromCart(cart, foodBagId)
    : {
        ...cart,
        items: cart.items.map((i) =>
          i.foodBagId === foodBagId ? { ...i, quantity: Math.min(quantity, maxQuantity) } : i,
        ),
      };

/** Removes a line; when a restaurant has no items left its pickup slot is dropped too. */
export const removeFromCart = (cart: Cart, foodBagId: string): Cart => {
  const items = cart.items.filter((i) => i.foodBagId !== foodBagId);
  const remaining = new Set(items.map((i) => i.restaurantId));
  const pickupSlots = Object.fromEntries(
    Object.entries(cart.pickupSlots).filter(([restaurantId]) => remaining.has(restaurantId)),
  );
  return { ...cart, items, pickupSlots, promoCode: items.length ? cart.promoCode : null };
};

export const setPickupSlot = (cart: Cart, restaurantId: string, slot: PickupSlot): Cart => ({
  ...cart,
  pickupSlots: { ...cart.pickupSlots, [restaurantId]: slot },
});

export const setPromoCode = (cart: Cart, code: string | null): Cart => ({
  ...cart,
  promoCode: code,
});

/** Cart total before promo/own-box discounts (sum of unitPrice x quantity). */
export const getCartTotal = (cart: Cart): number =>
  cart.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

/**
 * Cart count = number of food-bag UNITS across all restaurants (2 + 1 bags = 3).
 * This is the tab badge and the "N túi" in the cart summary; restaurants are not counted.
 */
export const getCartCount = (cart: Cart): number =>
  cart.items.reduce((sum, i) => sum + i.quantity, 0);

/** Number of restaurants = number of Orders (and pickup QRs) checkout will create. */
export const getRestaurantCount = (cart: Cart): number => groupCartByRestaurant(cart).length;

/** True when every restaurant in the cart has a pickup time, so checkout can proceed. */
export const isReadyForCheckout = (cart: Cart): boolean =>
  cart.items.length > 0 &&
  groupCartByRestaurant(cart).every((group) => group.pickupSlot !== null);
