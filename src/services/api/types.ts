import type {
  Area,
  Cart,
  Category,
  CheckoutResult,
  FoodBag,
  Order,
  PickupLocation,
  PickupQr,
  PickupSlotOption,
  Promo,
  Restaurant,
  User,
} from '@/types';

/**
 * Backend contract for the core ordering system. Screens/features depend on
 * this interface only; today it is backed by mock data (see mock-api.ts).
 */
export interface EcoBiteApi {
  getCurrentUser(): Promise<User>;

  listCategories(): Promise<Category[]>;
  /** Areas offered on Select Location (U1.2). */
  listAreas(): Promise<Area[]>;
  listRestaurants(query?: string): Promise<Restaurant[]>;
  getRestaurant(id: string): Promise<Restaurant | null>;

  listFoodBags(restaurantId?: string): Promise<FoodBag[]>;
  getFoodBag(id: string): Promise<FoodBag | null>;

  getPickupLocation(id: string): Promise<PickupLocation | null>;
  listPickupSlots(restaurantId: string): Promise<PickupSlotOption[]>;
  listPromos(): Promise<Promo[]>;

  /**
   * Multi-restaurant checkout: groups the cart by restaurant and creates ONE
   * order (status `placed`) per restaurant, all sharing one `checkoutId`.
   * Rejects if a bag is unavailable or a restaurant has no pickup slot.
   */
  checkout(input: { cart: Cart; /** Signed-in account that owns the orders (default: the demo user). */ userId?: string }): Promise<CheckoutResult>;
  /** All orders, newest first; `userId` limits them to one account (Order History). */
  listOrders(filter?: { userId?: string }): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;

  /** Payment succeeded: placed -> paid, and the PICKUP QR is issued. */
  markOrderPaid(orderId: string): Promise<Order>;
  /** Payment hold ran out: placed -> expired (terminal, outside the main sequence). */
  expireOrder(orderId: string): Promise<Order>;
  /** Customer cancels before the restaurant starts preparing: -> cancelled (terminal). */
  cancelOrder(orderId: string, reason: string): Promise<Order>;

  /**
   * Restaurant-preparation simulation: advances paid -> preparing -> ready.
   * (Stands in for the restaurant dashboard.)
   */
  simulateRestaurantProgress(orderId: string): Promise<Order>;

  /**
   * Staff-side simulation: verifies the PICKUP QR (ready -> qr_verified).
   * Rejects when the token is not the order's pickup token ("Invalid pickup QR": wrong
   * value, another order's token, a payment QR, or an order without a pickup QR), when the
   * QR was already used ("Pickup QR already used") or when the order is not `ready`.
   */
  verifyPickupQr(orderId: string, token: string): Promise<Order>;

  /** Staff hands over food (qr_verified -> picked_up). */
  completePickup(orderId: string): Promise<Order>;

  getPickupQr(orderId: string): Promise<PickupQr | null>;
}
