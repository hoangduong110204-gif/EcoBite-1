import type { Cart } from '@/types';

import { EMPTY_CART } from './cart-logic';
import { cartReducer, type CartAction } from './cart-reducer';

/**
 * Session cart store (module singleton, no persistence, resets on app reload,
 * same model as the auth store). Read through `useCart`; write through
 * `cart-actions`.
 */
let cart: Cart = EMPTY_CART;
const listeners = new Set<() => void>();

export const getCart = (): Cart => cart;

export function dispatchCart(action: CartAction): Cart {
  const next = cartReducer(cart, action);
  if (next !== cart) {
    cart = next;
    listeners.forEach((l) => l());
  }
  return cart;
}

export function subscribeCart(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Test / dev helper: empties the cart. */
export function resetCartStore(): void {
  cart = EMPTY_CART;
  listeners.forEach((l) => l());
}
