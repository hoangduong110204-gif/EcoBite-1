import type { Cart, CartItem, FoodArt, FoodBag, Money, OrderMoney, Restaurant } from '@/types';
import { computeOrderMoney, groupCartByRestaurant } from '@/utils/order-pricing';

export interface CartViewItem {
  item: CartItem;
  art: FoodArt;
  summary?: string;
  /** Stepper upper bound: what the restaurant has left (the line quantity if the bag is unknown). */
  maxQuantity: number;
}

/** One restaurant section of the cart = one future Order (D-1). */
export interface CartViewGroup {
  restaurantId: string;
  restaurantName: string;
  /** Chosen pickup time label; `null` until the customer picks one at checkout. */
  pickupLabel: string | null;
  items: CartViewItem[];
  count: number;
  subtotal: Money;
}

export interface CartView {
  groups: CartViewGroup[];
  /** Bag units in the whole cart (the tab-bar badge). */
  count: number;
  restaurantCount: number;
  /** Totals from `utils/order-pricing` (no promo in the cart, no delivery fee). */
  money: OrderMoney;
}

/** Joins the cart with catalog data for display. Grouping and money come from `utils/order-pricing`. */
export function buildCartView(cart: Cart, bags: FoodBag[], restaurants: Restaurant[]): CartView {
  const groups = groupCartByRestaurant(cart).map((group): CartViewGroup => {
    const restaurant = restaurants.find((r) => r.id === group.restaurantId);
    return {
      restaurantId: group.restaurantId,
      restaurantName: restaurant?.name ?? 'Nhà hàng',
      pickupLabel: group.pickupSlot?.label ?? null,
      count: group.count,
      subtotal: group.subtotal,
      items: group.items.map((item) => {
        const bag = bags.find((b) => b.id === item.foodBagId);
        return {
          item,
          art: bag?.art ?? restaurant?.art ?? 'rice',
          summary: bag?.summary,
          maxQuantity: bag?.left ?? item.quantity,
        };
      }),
    };
  });
  return {
    groups,
    count: groups.reduce((sum, g) => sum + g.count, 0),
    restaurantCount: groups.length,
    money: computeOrderMoney(cart.items),
  };
}
