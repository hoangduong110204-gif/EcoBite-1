import { useState } from 'react';

import { addBagToCart, computeOrderMoney, getAddableQuantity, getBagQuantityInCart, useCart } from '@/features/cart';
import type { Cart, FoodBag } from '@/types';

import { getBagAvailability } from './food-bag-logic';
import { useFoodBag } from './use-food-bag';

export type AddToCartSheetState =
  | { kind: 'sold_out' }
  | { kind: 'limit_reached'; inCart: number }
  | { kind: 'ready'; addable: number; inCart: number };

/** What the Add-to-Cart sheet can offer for this bag given the session cart. */
export function getAddToCartSheetState(cart: Cart, bag: FoodBag): AddToCartSheetState {
  if (getBagAvailability(bag) === 'sold_out') return { kind: 'sold_out' };
  const inCart = getBagQuantityInCart(cart, bag.id);
  const addable = getAddableQuantity(cart, bag);
  return addable > 0 ? { kind: 'ready', addable, inCart } : { kind: 'limit_reached', inCart };
}

/** Sheet button price: the same money model the cart and checkout use (own-box discount included). */
export const getSheetTotal = (bag: FoodBag, quantity: number, ownBox: boolean) =>
  computeOrderMoney([{ unitPrice: bag.price, originalPrice: bag.originalPrice, quantity, ownBox }]).total;

/** State of the Add-to-Cart sheet (5.6): quantity (1…addable), own box, total, submit into the real cart. */
export function useAddToCart(foodBagId: string | undefined) {
  const { bag, restaurant, status, reload } = useFoodBag(foodBagId);
  const cart = useCart();
  const [requested, setRequested] = useState(1);
  const [ownBox, setOwnBox] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const sheet = bag ? getAddToCartSheetState(cart, bag) : null;
  const addable = sheet?.kind === 'ready' ? sheet.addable : 0;
  const quantity = Math.max(1, Math.min(requested, addable || 1));
  const total = bag ? getSheetTotal(bag, quantity, ownBox) : 0;

  const submit = async () => {
    if (!bag || busy) return undefined;
    setBusy(true);
    setError(undefined);
    const result = await addBagToCart({ foodBagId: bag.id, quantity, ownBox });
    setBusy(false);
    if (!result.ok) setError(result.message);
    return result;
  };

  return { bag, restaurant, status, reload, sheet, addable, quantity, setQuantity: setRequested, ownBox, setOwnBox, total, busy, error, submit };
}
