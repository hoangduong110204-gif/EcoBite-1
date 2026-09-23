import { OWN_BOX_DISCOUNT_PER_BAG } from '@/constants/policy';
import type {
  Cart,
  CartGroup,
  CartItem,
  Money,
  OrderDraft,
  OrderItem,
  OrderMoney,
  Promo,
} from '@/types';

/** Groups cart items by restaurant, in first-added order. One group = one future Order. */
export const groupCartByRestaurant = (cart: Cart): CartGroup[] => {
  const groups = new Map<string, CartGroup>();
  for (const item of cart.items) {
    const group = groups.get(item.restaurantId) ?? {
      restaurantId: item.restaurantId,
      items: [],
      count: 0,
      subtotal: 0,
      pickupSlot: cart.pickupSlots[item.restaurantId] ?? null,
    };
    group.items.push(item);
    group.count += item.quantity;
    group.subtotal += item.unitPrice * item.quantity;
    groups.set(item.restaurantId, group);
  }
  return [...groups.values()];
};

/** Unit price x quantity of one cart line (the number shown on item rows). */
export const getLineTotal = (item: Pick<CartItem, 'unitPrice' | 'quantity'>): Money => item.unitPrice * item.quantity;

/** A promo applies when usable and the order reaches `minTotal`. `onlyVegan` promos are not supported yet. */
export const isPromoApplicable = (promo: Promo, subtotal: Money): boolean =>
  promo.usable && !promo.onlyVegan && subtotal >= promo.minTotal;

export const calcPromoDiscount = (promo: Promo | null | undefined, subtotal: Money): Money => {
  if (!promo || !isPromoApplicable(promo, subtotal)) return 0;
  const raw = promo.amount ?? Math.round((subtotal * (promo.percent ?? 0)) / 100);
  const capped = promo.cap !== undefined ? Math.min(raw, promo.cap) : raw;
  return Math.min(capped, subtotal);
};

type PricedItem = Pick<CartItem, 'unitPrice' | 'originalPrice' | 'quantity' | 'ownBox'>;

/** total = subtotal - promoDiscount - ownBoxDiscount. There is no delivery fee. */
export const computeOrderMoney = (items: PricedItem[], promo?: Promo | null): OrderMoney => {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const bagSavings = items.reduce((s, i) => s + (i.originalPrice - i.unitPrice) * i.quantity, 0);
  const ownBoxDiscount = items.reduce(
    (s, i) => s + (i.ownBox ? OWN_BOX_DISCOUNT_PER_BAG * i.quantity : 0),
    0,
  );
  const promoDiscount = calcPromoDiscount(promo, subtotal);
  return {
    subtotal,
    bagSavings,
    promoDiscount,
    ownBoxDiscount,
    total: Math.max(0, subtotal - promoDiscount - ownBoxDiscount),
  };
};

/** One restaurant's share of a cart, priced (with the promo when it applies to this group). */
export interface PricedGroup {
  group: CartGroup;
  money: OrderMoney;
  promoCode: string | null;
}

/**
 * Prices every restaurant group of a cart (multi-restaurant, D-1) WITHOUT
 * needing pickup slots, so Checkout can preview totals before times are chosen.
 * One promo per checkout: it is applied to the first restaurant whose order
 * qualifies. `buildOrderDrafts` uses this same function.
 */
export const priceCartGroups = (cart: Cart, promo?: Promo | null): PricedGroup[] => {
  const groups = groupCartByRestaurant(cart);
  const promoIndex = promo ? groups.findIndex((g) => isPromoApplicable(promo, g.subtotal)) : -1;
  return groups.map((group, index) => {
    const appliedPromo = index === promoIndex ? promo : null;
    return {
      group,
      money: computeOrderMoney(group.items, appliedPromo),
      promoCode: appliedPromo ? appliedPromo.code : null,
    };
  });
};

/** Adds several orders' money together (the Checkout / Summary total of a multi-order checkout). */
export const sumOrderMoney = (monies: OrderMoney[]): OrderMoney =>
  monies.reduce<OrderMoney>(
    (sum, m) => ({
      subtotal: sum.subtotal + m.subtotal,
      bagSavings: sum.bagSavings + m.bagSavings,
      promoDiscount: sum.promoDiscount + m.promoDiscount,
      ownBoxDiscount: sum.ownBoxDiscount + m.ownBoxDiscount,
      total: sum.total + m.total,
    }),
    { subtotal: 0, bagSavings: 0, promoDiscount: 0, ownBoxDiscount: 0, total: 0 },
  );

/**
 * Turns a cart into one priced draft per restaurant (multi-restaurant
 * checkout, D-1). Throws if the cart is empty or a restaurant has no pickup slot.
 */
export const buildOrderDrafts = (cart: Cart, promo?: Promo | null): OrderDraft[] => {
  if (cart.items.length === 0) throw new Error('Cart is empty');
  return priceCartGroups(cart, promo).map(({ group, money, promoCode }) => {
    if (!group.pickupSlot) {
      throw new Error(`No pickup time chosen for restaurant ${group.restaurantId}`);
    }
    const items: OrderItem[] = group.items.map((i) => ({
      foodBagId: i.foodBagId,
      name: i.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      originalPrice: i.originalPrice,
      ownBox: i.ownBox,
    }));
    return { restaurantId: group.restaurantId, items, money, promoCode, pickupSlot: group.pickupSlot };
  });
};
