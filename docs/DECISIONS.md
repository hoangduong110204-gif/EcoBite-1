# EcoBite customer app — implementation decisions

Decisions **D-1 … D-17** are approved and recorded in [`SCREEN-MAPPING.md`](./SCREEN-MAPPING.md) §12 ("Decisions (approved)"). They are not repeated or changed here. This file records decisions that came up **after** U0, when an implementation detail needed a call.

## D-18 — Multi-restaurant payment is sequential, one payment session per order (U1.5)

**Context.** A cart can hold bags from several restaurants (D-1), and checkout creates one `Order` per restaurant. Each order has its own Payment QR (`PaymentSession`, 10-minute hold) and, once paid, its own Pickup QR. The existing `PaymentService` models exactly one session per order; there is no "pay several orders with one QR" capability.

**Decision.** Keep that model. After "Tiếp tục thanh toán":

1. `placeCheckout` validates the real cart (not empty, every restaurant has a pickup time, QR bank transfer selected), creates **all** orders with `api.checkout` (one per restaurant, one shared `checkoutId`), **clears the cart** (the orders are committed) and creates the payment session of the **first** order only.
2. The customer pays orders **one after another**. A restaurant's session (and its 10-minute hold) is created when its turn comes (`ensurePaymentSession`, idempotent per order).
3. After a payment succeeds, Payment Success (7.3) shows "Thanh toán đơn tiếp theo" while another order of the same checkout is still `placed`. Expired or cancelled siblings are skipped.
4. When no order is waiting for payment, Payment Success goes **directly** to Pickup QR (8.3) of the first paid, not-yet-picked-up order (D-3 unchanged, no 8.1 in between). Moving between the Pickup QRs of several orders is U1.6.

`features/checkout/checkout-logic.getCheckoutProgress` derives all of this from the orders themselves (same `checkoutId`, ordered by order code); nothing about the sequence is stored separately.

**Retry / expiry.** A failed payment leaves the order `placed`; "Thử thanh toán lại" creates a **new session for the same order** (never a new order) inside the 5-minute window. An expired hold expires the order (terminal); the customer restarts from the bag (Đặt lại túi này) and the cart is not refilled.

**Why not one combined payment.** It would need a combined amount and a combined QR that the payment/order model does not have, and would blur "one order = one restaurant = one pickup QR".

## D-19 — Screen order Summary → Payment Method (U1.5)

**Conflict found.** The approved mapping (D-4, rows 6.4/6.7/6.8) orders the screens *Checkout → Payment Method (6.8) → Order Summary (6.7) → place order*. The U1.5 brief specifies *Checkout → Pickup Time → Order Summary → Payment Method → Payment QR*.

**Decision.** Follow the U1.5 brief (it is the more recent, explicit instruction and its tests assume it): Order Summary shows the payment method (QR bank transfer, the only enabled one) and opens Payment Method; **orders are created on Payment Method → "Tiếp tục thanh toán"**, then the first Payment QR opens. D-4 itself (Payment Method screen included, QR only enabled, others "Sắp có") is unchanged; only its position in the sequence differs from the mapping table. The route `/order/payment-method` (mapped as ➕ in the route table) is now registered (34 routes).

## D-20 — Pickup slots are validated against the bags' pickup window (U1.5)

A restaurant's pickup time must be inside the daily pickup window of **every** bag of that restaurant in the cart (the intersection of the windows) and must still have capacity. Slots outside the window are not listed; full slots are listed disabled ("Đã hết chỗ"). If the bags never overlap (for example an 18:00–20:00 bag and a 20:00–21:00 last-call bag from the same restaurant) the screen says so and the customer must remove one of them. Enforced in `features/checkout` (`getPickupWindow`, `canSelectSlot`, `selectPickupSlot`).

## D-21 — Multi-order pickup is sequential and derived from the orders (U1.6)

**Context.** A multi-restaurant checkout (D-1, D-18) leaves several orders, each with its own pickup QR, token, restaurant and state.

**Decision.** Pickup stays **per order** and the flow is sequential. Every pickup screen is addressed by `orderId` (`/order/[orderId]/pickup-qr`, `…/ready`, …); nothing merges orders or shares a token. After payment the customer lands on the Pickup QR of the first paid, not-yet-picked-up order (D-18). When an order reaches `picked_up`, Order Completed offers the **next** sibling of the same `checkoutId` that is still paid and not picked up ("Nhận đơn tiếp theo" → its Pickup QR), or, when a sibling is still unpaid, its payment ("Thanh toán đơn tiếp theo"). Expired and cancelled siblings are skipped. This is derived on demand by `features/pickup/getNextPickupStep` from the orders themselves; there is no extra stored state, so leaving the flow never loses anything: `resolvePickupRoute(order)` maps every lifecycle status to the screen the order belongs on (paid / preparing / ready → Pickup QR, qr_verified → QR Verified, picked_up → Completed, placed → payment, expired / cancelled → none) and the pickup screens redirect there when opened at the wrong stage. Pickup QR shows "Đơn 1/2" when the checkout has several orders.

## D-22 — Verification and completion map onto the existing six-step lifecycle (U1.6)

**Context.** The U1.6 brief describes "QR verified" and "ready → picked_up" as one step, but the approved lifecycle (D-2) has `ready → qr_verified → picked_up` and the label "QR đã được xác nhận" belongs to `qr_verified`.

**Decision.** No lifecycle state is added or skipped:

- **Staff scan** (`api.verifyPickupQr`, mocked; no camera) = `ready → qr_verified`. It is refused unless the token is THIS order's pickup token, the order is `ready` and the QR was not used before (errors "Invalid pickup QR", "Order is not ready for pickup", "Pickup QR already used"). A payment QR payload, an order code, another order's token, or a made-up value never matches; cancelled, expired and unpaid orders have no pickup QR at all. The customer app never scans: it polls the order and moves to QR Verified when the order becomes `qr_verified`. In development the scan (and the restaurant's preparing / ready steps) are the existing DevMenu "Advance" control (D-17).
- **Customer confirmation** "Tôi đã nhận đủ túi" (QR Verified screen) = `qr_verified → picked_up` ("Đã nhận hàng"), guarded by `confirmReceived`. "Tôi đã tới quán" (Customer Arrives) only opens the Pickup QR; it changes nothing.
- The pickup token is `pk_<time/counter>` plus random characters: opaque, not the order id, not the order code, not the payment QR payload.

**Screens.** 8.1 Pickup Instructions (`pickup-instructions`), 8.2 Order status timeline (`status`), 8.3 Pickup QR (`pickup-qr`), 8.4 Order Ready (`ready`, also the preparing state), 8.5 Customer Arrives (`arrived`), 8.6 QR Verified (`verified`), 8.7 Order Completed (`completed`). The brief's numbering differs from the reference; the route/screen mapping in `SCREEN-MAPPING.md` is used. From Pickup QR the customer reaches Instructions, then Order Ready, then Customer Arrives, back to the Pickup QR for the staff scan, then QR Verified and Completed.

## D-23 — Orders belong to an account, and the whole app sits behind the auth gate (U1.7)

**Context.** Until U1.6 every order was stamped with the demo user and nothing outside the auth screens was guarded, so a freshly registered customer would have seen the demo user's history and a signed-out customer could still open Orders or Account.

**Decision.**
- `api.checkout({ cart, userId })` stamps the orders with the signed-in account (`placeCheckout` passes `getAuthState().account?.id`; the default stays the demo user), and `api.listOrders({ userId })` returns one account's orders. Order History and Account read only the signed-in account's orders; the finished-order detail treats another account's order as "not found". Seed orders belong to the demo account, so a new customer starts with the empty state.
- One root guard (`useAuthGate` → `getProtectedRedirect`, mounted in the root layout) sends anyone without a fully set-up session (`location_selected`) to the auth screen they belong on (`resolveAuthRoute`). Only the splash and the `(auth)` group are public. The first-login flow (Register → OTP → Create Profile → Location Permission → Select Location → Home) and the returning-user shortcut are unchanged.
- Orders (`/orders`) has the three reference segments (Đang xử lý / Đã xong / Đã huỷ). `resolveOrderRoute` (D-5) opens a live order in its flow (placed → payment, paid / preparing / ready → `/order/[orderId]/status`, qr_verified → QR Verified) and a finished one (picked_up, cancelled, expired) in `/order/[orderId]`; the detail screen redirects a live order to its flow. History screens are read-only: they never call a mutating service.

## D-24 — What logout clears, what Edit Profile changes, where Account numbers come from (U1.7)

- **Logout** (`features/account/signOut`) clears the auth session (`signed_out`), the cart, and the temporary checkout / payment sessions, then goes to `resolveAuthRoute` (Welcome, since onboarding was seen). Orders are the account's data and are not deleted: logging in again brings the history back (the reference dialog says active orders are kept). The cart is never persisted between sessions.
- **Edit Profile** (`/account/edit`, mapped ➕ 10.2) changes what the user model supports: display name and default area, saved in the mock auth account and in the session auth state (Home reads the area). Phone (verified) and email are read-only; birth date and change-password are not modelled.
- **Account numbers** (bags saved, kg of food, kg of CO₂, order counts) are derived from the account's own orders through `utils/impact` instead of the static `User.impact` sample, so they stay consistent with Order History.
- **Deferred** (their reference screens are not in the approved flow): saved restaurants, wallet, promo codes, notifications, settings, help, terms, "my impact" detail (10.3–10.8), invoice (7.7), review (9.7), cancel (8.8), report a problem (4.7). "Đặt lại túi này" is built without its own sheet (9.6): it adds the bags to the current cart through the normal add-to-cart rules and opens Cart.

## Not built in U1.5 (by design)

- Promo screen (6.5) and the promo row on Checkout: the promo model and pricing (`cart.promoCode`, `priceCartGroups`) work, but there is no UI to choose a code yet.
- "Sao chép số tài khoản" on the Payment QR (needs `expo-clipboard`, not installed, D-15), "Tôi cần trợ giúp", "Đổi cách thanh toán" (only one method), "Huỷ đơn" (8.8 is not routed).
