import {
  mockAreas,
  mockCategories,
  mockCurrentUser,
  mockFoodBags,
  mockOrders,
  mockPickupLocations,
  mockPickupSlots,
  mockPromos,
  mockRestaurants,
} from '@/data/mock';
import type { Order } from '@/types';
import {
  buildOrderDrafts,
  cancelOrder,
  createId,
  delay,
  expireOrder,
  formatOrderCode,
  transitionOrder,
} from '@/utils';

import type { EcoBiteApi } from './types';

/** In-memory order store, seeded from mock data. Resets on app reload. */
const orders = new Map<string, Order>(mockOrders.map((o) => [o.id, o]));

/** Next order sequence number (the seed data already uses up to 022). */
let orderSequence = 23;

const requireOrder = (id: string): Order => {
  const order = orders.get(id);
  if (!order) throw new Error(`Order not found: ${id}`);
  return order;
};

const save = (order: Order): Order => {
  orders.set(order.id, order);
  return order;
};

export const mockApi: EcoBiteApi = {
  async getCurrentUser() {
    await delay();
    return mockCurrentUser;
  },

  async listAreas() {
    await delay();
    return mockAreas;
  },

  async listCategories() {
    await delay();
    return mockCategories;
  },

  async listRestaurants(query) {
    await delay();
    const q = query?.trim().toLowerCase();
    return q
      ? mockRestaurants.filter((r) => r.name.toLowerCase().includes(q))
      : mockRestaurants;
  },
  async getRestaurant(id) {
    await delay();
    return mockRestaurants.find((r) => r.id === id) ?? null;
  },

  async listFoodBags(restaurantId) {
    await delay();
    return restaurantId
      ? mockFoodBags.filter((b) => b.restaurantId === restaurantId)
      : mockFoodBags;
  },
  async getFoodBag(id) {
    await delay();
    return mockFoodBags.find((b) => b.id === id) ?? null;
  },

  async getPickupLocation(id) {
    await delay();
    return mockPickupLocations.find((p) => p.id === id) ?? null;
  },
  async listPickupSlots() {
    await delay();
    return mockPickupSlots;
  },
  async listPromos() {
    await delay();
    return mockPromos;
  },

  async checkout({ cart, userId }) {
    await delay();
    const promo = cart.promoCode ? (mockPromos.find((p) => p.code === cart.promoCode) ?? null) : null;
    if (cart.promoCode && !promo) throw new Error(`Unknown promo code: ${cart.promoCode}`);
    const drafts = buildOrderDrafts(cart, promo);

    // "Đã kiểm tra túi còn hàng": every bag must still be available.
    for (const item of cart.items) {
      const bag = mockFoodBags.find((b) => b.id === item.foodBagId);
      if (!bag || bag.left < item.quantity) throw new Error(`Bag unavailable: ${item.foodBagId}`);
    }

    const now = new Date();
    const checkoutId = createId('chk');
    const created = drafts.map((draft): Order => {
      const restaurant = mockRestaurants.find((r) => r.id === draft.restaurantId);
      if (!restaurant) throw new Error(`Restaurant not found: ${draft.restaurantId}`);
      const id = createId('ord');
      return save({
        id,
        orderCode: formatOrderCode(now, orderSequence++),
        checkoutId,
        userId: userId ?? mockCurrentUser.id,
        restaurantId: restaurant.id,
        pickupLocationId: restaurant.pickupLocationId,
        items: draft.items,
        money: draft.money,
        promoCode: draft.promoCode,
        status: 'placed',
        paymentStatus: 'pending',
        paymentMethod: 'bank_qr',
        pickupSlot: draft.pickupSlot,
        pickupQr: null,
        cancellation: null,
        statusHistory: { placed: now.toISOString() },
        createdAt: now.toISOString(),
      });
    });
    return { checkoutId, orders: created };
  },
  async listOrders(filter) {
    await delay();
    return [...orders.values()]
      .filter((o) => !filter?.userId || o.userId === filter.userId)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  },
  async getOrder(id) {
    await delay();
    return orders.get(id) ?? null;
  },

  async markOrderPaid(orderId) {
    await delay();
    const order = requireOrder(orderId);
    const paid = transitionOrder(order, 'paid');
    return save({
      ...paid,
      paymentStatus: 'success',
      pickupQr: {
        kind: 'pickup',
        orderId,
        orderCode: order.orderCode,
        // Opaque, unguessable-looking value: not the order id, not the order code.
        token: `${createId('pk')}${Math.random().toString(36).slice(2, 10)}`,
        issuedAt: new Date().toISOString(),
        verifiedAt: null,
      },
    });
  },

  async expireOrder(orderId) {
    await delay();
    return save(expireOrder(requireOrder(orderId)));
  },

  async cancelOrder(orderId, reason) {
    await delay();
    return save(cancelOrder(requireOrder(orderId), { reason, cancelledBy: 'customer' }));
  },

  async simulateRestaurantProgress(orderId) {
    await delay();
    const order = requireOrder(orderId);
    if (order.status === 'paid') return save(transitionOrder(order, 'preparing'));
    if (order.status === 'preparing') return save(transitionOrder(order, 'ready'));
    return order;
  },

  async verifyPickupQr(orderId, token) {
    await delay();
    const order = requireOrder(orderId);
    // The token must belong to THIS order (a payment QR payload, another order's token or a
    // made-up value never matches). Cancelled / expired / unpaid orders have no pickup QR at all.
    if (!order.pickupQr || order.pickupQr.token !== token) {
      throw new Error('Invalid pickup QR');
    }
    if (order.pickupQr.verifiedAt) throw new Error('Pickup QR already used');
    if (order.status !== 'ready') throw new Error(`Order is not ready for pickup (${order.status})`);
    const verified = transitionOrder(order, 'qr_verified');
    return save({
      ...verified,
      pickupQr: { ...order.pickupQr, verifiedAt: new Date().toISOString() },
    });
  },

  async completePickup(orderId) {
    await delay();
    return save(transitionOrder(requireOrder(orderId), 'picked_up'));
  },

  async getPickupQr(orderId) {
    await delay();
    return requireOrder(orderId).pickupQr;
  },
};
