import { useSyncExternalStore } from 'react';

import type { Cart } from '@/types';

import { getCartCount } from './cart-logic';
import { getCart, subscribeCart } from './cart-store';

/** Reactive session cart. */
export const useCart = (): Cart => useSyncExternalStore(subscribeCart, getCart, getCart);

/** Number of bag units in the cart (drives the tab badge). */
export const useCartCount = (): number => getCartCount(useCart());
