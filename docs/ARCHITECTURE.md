# EcoBite Customer App — Architecture

Stack: React Native, Expo SDK 57, Expo Router (typed routes), TypeScript (strict). Path alias `@/*` → `src/*`.
Approved dependencies beyond the Expo template: `@expo-google-fonts/nunito`, `react-native-svg`, `expo-linear-gradient`, `react-native-qrcode-svg` (D-15); dev: `@types/node`.

Status: **U0, U1.1 … U1.7 complete** (shared UI foundation, see "Shared UI" below). The data model, tokens, services and navigation match the 82-screen reference and decisions D-1…D-17 (see `SCREEN-MAPPING.md`). Auth, Home, Search, Restaurant Detail, Food Bag Detail, Add to Cart and Cart are built; Checkout, Pickup Time, Order Summary, Payment Method, Payment QR and Payment Success are built; the pickup flow (Pickup QR → Instructions → Order Ready → Customer Arrives → QR Verified → Order Completed) is built; Orders, Order Detail, Account and Edit Profile are built; only the AI screens are still placeholders (U1.8).

## Folder structure

```
src/
├── app/                      Expo Router routes (thin, placeholders for now)
│   ├── index.tsx             01 Splash
│   ├── (auth)/               onboarding, login, location-permission, select-location
│   ├── (main)/               bottom tabs: home · orders · cart · account
│   ├── search/               index (3.4) · results (3.5)              — stack, NOT a tab
│   ├── restaurant/[id]/      index (4.1)
│   ├── food-bag/[id]/        index (5.1) · add-to-cart (5.6)
│   ├── order/                checkout · pickup-time · summary
│   │   └── [orderId]/        index (9.5 detail) · status (8.2) · payment (phases) ·
│   │                         payment-success · pickup-qr · pickup-instructions ·
│   │                         ready · arrived · verified · completed
│   └── ai/                   index (welcome/chat) · history (11.5)
├── components/               common/ (+ icons/)  restaurant/ food-bag/ cart/ order/  ai/  dev/
├── features/                 auth location restaurant food-bag cart payment pickup
│                             order-history discovery notifications account ai dev
├── services/                 api/ payment/ ai/   (interface + mock implementation)
├── data/                     mock/ (core mock data)  ai/ (AI mock data)
├── constants/                design tokens, component style presets, policy, order status
├── hooks/                    shared hooks (empty)
├── utils/                    pure helpers: format, async, order-code, order-lifecycle, order-pricing
└── types/                    domain types; types/ai/ for AI
docs/  MVP.md  AI-FLOW.md  ARCHITECTURE.md  SCREEN-MAPPING.md
scripts/verify-foundation.ts
```

## Feature boundaries

- Routes compose components + feature hooks; no business logic.
- `features/<name>` owns hooks and thin orchestration for that domain. **Pure rules** shared with services live in `utils/`.
- `components/<name>` are presentational; `components/common` are design-system primitives.
- Features talk to the backend only through `services/*`. Nothing outside `services/` imports `data/`.
- `discovery` (home, categories, search, filter/sort, map, saved), `notifications`, `account` (profile, wallet, settings, help, legal, impact) are new empty feature folders (D-16). Checkout, promo, summary and payment-method logic stay in `cart`/`payment`; reviews and cancel/reorder stay in `order-history`.
- `features/dev` + `components/dev` are development tooling only (see below).
- `features/ai` and its siblings are isolated from core ordering (see `AI-FLOW.md`).

## Navigation architecture

- Root `Stack` (`app/_layout.tsx`): loads **Nunito 600/700/800**, hides the splash, registers groups, mounts `DevMenu` only under `__DEV__`.
- `(auth)` Stack — onboarding, login, location. `(main)` — `Tabs` styled from `TabBarStyles`: **Home · Orders · Cart · Account** (D-14). `search/`, `restaurant/[id]/`, `food-bag/[id]/`, `order/`, `ai/` are Stacks above the tabs.
- **Auth routing (D-8/D-9)** — `features/auth/auth-routing.ts`: first login → Location Permission → Select Location → Home; returning user → Home. Guest preview is unsupported (`GUEST_PREVIEW_ENABLED = false`, no guest route).
- **Order routes (D-5):** `/order/[orderId]` = completed-order detail (9.5), `/order/[orderId]/status` = active status timeline (8.2). Checkout/pickup-time/summary come before any order id exists; the orders are created at Summary ("Đặt đơn").
- **Payment (D-6):** one route `/order/[orderId]/payment` renders the phases `qr → waiting → success | failed | expired`; the result navigates on (success → **Pickup QR**, D-3).
- Placeholder screens (`PlaceholderScreen`) link to the next step to prove navigation; they are throwaway.

## Design system (D-11, D-12)

`src/constants` — values taken from `reference/…/css/styles.css`; `npm run verify` compares every colour token with the CSS `:root`.

- `colors.ts` — paper `#FDFDFB`, primary `#2FA05C`, primaryDark `#1F7D46`, primaryText `#22713F`, mint `#E6F4E4`, mintBorder `#D3EBCF`, text `#1A2621`, textMuted `#6B7A70`, textFaint `#9BA89F`, border `#E6E4DA`, divider `#EAE8DE`, warning `#F2A828`, danger `#E24B3B`, info `#4B7FE0`, plus badge tints, warning-card and disabled colours. **Light theme only.**
- `typography.ts` — Nunito 600/700/800; reference sizes 10–27 px (title 23, section 17, nav 16, cardTitle 14, body 13/600, caption 11.5, button 15/800…).
- `spacing.ts` — reference gaps (11, 10, 9, 13… included), radii (button 15, card 18, input 14, tile 12, QR card 26, pill), ring border widths.
- `shadows.ts` — RN approximations of the reference shadows. `layout.ts` — 390×844, control sizes (button 50, input 48, back chip 36).
- `component-styles.ts` — presets for button (primary/secondary/soft/destructive, sizes), input, card (base/mint/outline), tab bar, header, bottom bar, badge, chip.
- `policy.ts` — own-box discount (2.000đ/bag), payment hold 10 min, retry 5 min, poll interval, impact per bag.

## Orders, Order Detail, Account (U1.7)

Flow: **Orders tab → (active) Status / Payment / QR Verified, (finished) Order Detail**; **Account tab → Edit Profile, Logout**. See `DECISIONS.md` D-23 (account-scoped orders, root auth gate) and D-24 (logout scope, Edit Profile, derived Account numbers).

- **Orders** (`features/order-history`): `useOrders` (focus reload + 3 s poll while focused; read-only), pure `getOrderTab` / `filterOrders` / `countOrdersByTab` / `getDefaultTab` / `getOrderCardSubtitle` / `getRefundLine` / `summarizeCompleted`, and `resolveOrderRoute` + `getOrderAction` (the only routing table for orders). `useOrderDetail` loads a finished order (read-only, ownership-checked) and redirects a live order to `resolveOrderRoute`.
- **Ownership:** `Order.userId` is the signed-in account (`placeCheckout` → `api.checkout({ userId })`); `api.listOrders({ userId })` scopes the list. Seed orders belong to the demo account.
- **Root auth gate:** `features/auth/use-auth-gate` (mounted in `app/_layout`) sends anyone without a `location_selected` session to `resolveAuthRoute`; `getProtectedRedirect(state, segments)` is the pure rule. The U1.2 auth flow is untouched.
- **Account** (`features/account`): `useAccount` (session profile from `useAuth`, the account's orders, `getAccountSummary`), `updateProfile` (mock auth account + session store via the new `profile_updated` event; `area_selected` keeps Home in sync) and `signOut` (auth `signed_out` + `clearCart` + `resetCheckoutStore`).
- **Reorder:** `reorderOrder` uses `addBagToCart`, so sold-out bags and stock limits still apply; it never creates an order or touches the old one.
- **UI added:** `components/account` (`Avatar`, `ProfileHeader`, `AccountImpactCard`); route `/account/edit` (35 routes; `app/account/_layout` + `edit`). `OrderCard` no longer nests its action buttons inside its own pressable area (invalid nested `<button>` on web).
- **Not built:** saved restaurants, wallet, promo codes, notifications, settings, help, legal, impact detail (10.3–10.8), invoice (7.7), review (9.7), cancel (8.8), report (4.7), reorder sheet (9.6).

## Pickup flow (U1.6)

Flow: **Payment Success → Pickup QR (`/order/[orderId]/pickup-qr`) → Pickup Instructions (`pickup-instructions`) → Order Ready (`ready`, preparing state included) → Customer Arrives (`arrived`) → Pickup QR again for the staff scan → QR Verified (`verified`) → Order Completed (`completed`)**; the timeline is `status` (8.2). See `DECISIONS.md` D-21 (sequential multi-order pickup) and D-22 (mapping onto the six-step lifecycle).

- **No new lifecycle state.** `features/pickup/pickup-logic` derives a `PickupStage` from `Order.status` (placed → unpaid, paid / preparing → preparing, ready, qr_verified → verified, picked_up → completed, plus expired / cancelled). `getPickupGate` decides whether the pickup screens can show at all (unpaid / expired / cancelled / paid-without-QR give an explanatory state), `resolvePickupRoute` maps a status to the screen it belongs on (resume + redirect).
- **Screens follow the real order:** `usePickupScreen(orderId, allowedStages)` loads the order, its restaurant and its checkout siblings, polls every 1.5 s until the order is terminal, applies the gate and redirects when the screen is opened at another stage (Pickup QR → QR Verified once staff scan; QR Verified → Completed once picked up). Invalid ids are `not_found`.
- **Verification (mock, no camera):** `simulateStaffScan(orderId, scanned)` → `api.verifyPickupQr` (ready → qr_verified). The service now rejects, in order: wrong token / payment QR payload / other order's token / order without a pickup QR ("Invalid pickup QR"), an already used QR ("Pickup QR already used"), an order that is not `ready` ("Order is not ready for pickup"). `confirmReceived(orderId)` → `api.completePickup` only from `qr_verified`. The pickup token is unguessable-looking and unrelated to the order id, order code and payment QR payload.
- **Multi-order:** each order has its own QR, token and state; `getNextPickupStep` (derived from the orders sharing a `checkoutId`) offers the next paid / unpaid sibling on Order Completed; Pickup QR shows "Đơn n/N".
- **UI added:** `order/PickupGateState`, `PickupStepList`; reused `PickupQrCard`, `PickupInfo`, `OrderStatusBanner`, `OrderStatusTimeline`, `PaymentSuccessHero`, `BagImpactTiles`, `StatusBadge`. Impact uses `utils/impact`.
- **Not built:** Directions / call buttons (4.6 not routed), the review prompt and "Đặt lại" on Order Completed (9.7 / 9.6), "Có vấn đề với túi này" (4.7), countdown timers (a clock countdown would depend on the time of day of the demo).

## Checkout & Payment (U1.5)

Flow: **Cart → Checkout (`/order/checkout`) → Select Pickup Time (`/order/pickup-time?restaurantId=`) → Order Summary (`/order/summary`) → Payment Method (`/order/payment-method`) → Payment QR (`/order/[orderId]/payment`) → Payment Success (`/order/[orderId]/payment-success`) → Pickup QR (`/order/[orderId]/pickup-qr`, U1.6).** See `DECISIONS.md` D-18 (sequential multi-order payment), D-19 (Summary before Payment Method), D-20 (slot validity).

- **Checkout state** is the real cart store; `features/checkout/use-checkout` joins it with catalog data through `buildCheckoutView`, which prices every restaurant with `priceCartGroups` and totals with `sumOrderMoney` (`utils/order-pricing`). `ready` = not empty and every restaurant has a pickup time; Checkout / Summary / Payment Method all block on it.
- **Pickup time per restaurant:** `selectPickupSlot(restaurantId, option)` → `setRestaurantPickupSlot` in the cart store (survives navigation). Valid = capacity left and inside the intersection of the bags' pickup windows (`getPickupWindow`, `canSelectSlot`).
- **Order creation** (`placeCheckout`, on Payment Method → "Tiếp tục thanh toán"): validates cart, slots and method (QR only), `api.checkout` creates ONE Order per restaurant (shared `checkoutId`, unique order codes), the cart is cleared as soon as the orders are committed (not on failure), and the FIRST order gets its payment session. `ensurePaymentSession` creates the others when their turn comes; `retryOrderPayment` makes a new session for the same order.
- **Payment screen** = one route with phases (`usePaymentOrder` loads the order and session, `usePaymentStatus` polls the mock provider and settles the order: success → `paid` + Pickup QR issued, expired → `expired`, failed → stays `placed`). `usePaymentStatus` now also reports `settled` so the success screen never reads an unsettled order.
- **Multi-order flow:** `getCheckoutProgress(orders, checkoutId, currentOrderId)` derives `nextToPay` / `paid` / `firstPickup` from the orders (same `checkoutId`); expired and cancelled siblings are skipped.
- **UI added:** `order/OrderItemRow`, `HoldTimerCard`, `PaymentSuccessHero`; `PickupInfo` gained the pickup-time row (`pickupLabel`, `onPickTime`, `title`), `OrderPriceBreakdown` gained `showSavings`; `hooks/use-now`. New route `/order/payment-method` (34 routes).
- **Pure helpers added:** `priceCartGroups`, `sumOrderMoney`, `getLineTotal` (`utils/order-pricing`; `buildOrderDrafts` now uses `priceCartGroups`), `calcImpact`, `countBags` (`utils/impact`), `formatDateVN`, `retrySecondsLeft`.

## Food Bag + Cart (U1.4)

Flow: **Restaurant Detail → Food Bag Detail (`/food-bag/[id]`) → Add to Cart sheet (`/food-bag/[id]/add-to-cart`) → Cart (`(main)/cart`) → Checkout (U1.5).**

- **Cart store** (`features/cart`): `cart-store` (session singleton, `getCart / dispatchCart / subscribeCart / resetCartStore`), `cart-reducer` (pure; routes actions `add | set_quantity | remove | clear | set_pickup_slot | set_promo` to `cart-logic`), `cart-actions` (screen-facing, async `addBagToCart` looks the bag up via `services/api`), `cart-view` (`buildCartView`: sections per restaurant + totals), hooks `useCart`, `useCartCount`, `useCartView`.
- **Rules:** `cart-logic` (`tryAddToCart`, `getAddableQuantity`, `getBagQuantityInCart`, `setItemQuantity`, `removeFromCart`, `setPickupSlot`, `getCartCount`); `addToCart` ignores sold-out bags and quantities < 1. **Money is never computed in the store or screens:** `buildCartView` uses `groupCartByRestaurant` and `computeOrderMoney` from `utils/order-pricing` (subtotal, bag savings, own-box discount, total; no delivery fee, no promo in the cart).
- **Cart count** = food-bag units across all restaurants (the tab badge, "Tạm tính · N túi").
- **Multi-restaurant (D-1):** one cart section per restaurant; `buildOrderDrafts` already yields one draft (= one Order, one pickup QR) per restaurant for U1.5. The pickup slot is stored per restaurant but chosen at checkout.
- **Food bag feature** (`features/food-bag`): `useFoodBag` (loading | ready | not_found | error, plus alternatives for the sold-out screen), `useAddToCart` (quantity 1…addable, own box, total from `computeOrderMoney`), `food-bag-logic` (availability, stock label, allergen summary).
- **UI added:** `common/CoverImage` (shared by Restaurant and Food Bag detail); `food-bag/AddToCartSheet`, `OwnBoxRow`, `BagContentsList`, `BagImpactTiles`; `FoodBagQuantity` gained `max`, `CartSummary` gained `ownBoxDiscount` and no longer draws its own card.
- **Not built:** bag sub-screens (contents 5.2, allergens 5.4, impact 5.5, pickup-time 5.3), "Nhắc tôi khi có túi mới" toggle, swipe-to-delete, promo row in the Cart (promo belongs to checkout 6.5), live "còn N phút để đặt" countdown.

## Discovery: Home, Search, Restaurant Detail (U1.3)

Flow: **Home → Search (`/search`) → Search Results (`/search/results?q=`) → Restaurant Detail (`/restaurant/[id]`) → Food Bag (`/food-bag/[id]`, placeholder until U1.4)**; Home cards also open Restaurant Detail directly. Search is a stack flow, not a tab (D-14).

- **Data:** the six demo restaurants keep their ids; each has `areaId` (one of `area_cau_giay`, `area_dong_da`, `area_ba_dinh`, `area_thanh_xuan`) and a Hà Nội address in that area (Cầu Giấy: res_01, res_05 · Đống Đa: res_03, res_06 · Ba Đình: res_02 · Thanh Xuân: res_04). Coordinates are mock numbers; there is no GPS, map or distance API. `RestaurantListing` (`types/catalog.ts`) is a read model built by `buildRestaurantListings`: restaurant + category name + bags + `availableCount` + `featuredBag` (first bag still available) + `pickupWindowLabel` + `soldOut`.
- **Home** (`features/discovery/use-home` → `getHomeView`): shows all six restaurants, the selected area's first (`sortByArea`), optionally filtered by category (`filterByCategory`; categories without restaurants show the empty state). The selected area comes from `useAuth().area` (U1.2 session).
- **Search:** `utils/search.searchListings` (local, accent-insensitive, all words must match the restaurant name, category name or bag name/summary; optional "Còn túi" filter). Recent searches are a session-level store (`features/discovery/search-history`). States: empty (recent + trending), active (live matches), results, no results.
- **Restaurant Detail:** `features/restaurant/use-restaurant` (`loading | ready | not_found | error`); bags ordered available-first; bottom button opens the first available bag.
- **UI added:** `components/common` `SearchBar` (editable or tappable fake), `SectionHeader`; `components/restaurant` `CategoryButton`, `HeroBanner`, `RestaurantListCard`, `PickupInfoTiles`; `RestaurantCard` gained `soldOut`; `Screen` gained `edgeToEdge`.
- **Not built (no reference route in the approved set):** notifications bell, "Xem tất cả" categories, filter/sort sheets, saved hearts, directions/reviews/gallery, area switching from Home.

## Auth & onboarding (U1.2)

Flow: **Splash → Onboarding (3 slides, "Bỏ qua") → Welcome → Register → OTP → Create Profile → Location Permission → Select Location → Home**; **Login → Create Profile | Location Permission | Home** (an account that already has a name and an area goes straight to Home). Routes (`app/(auth)`): `onboarding`, `welcome`, `login`, `register`, `otp`, `create-profile`, `location-permission`, `select-location` (+ `app/index` splash). Home is still the placeholder; the flow ends with `router.replace('/home')`.

- **State** (`features/auth`): `AuthState { status: unauthenticated | otp_pending | authenticated, hasSeenOnboarding, pendingRegistration, account, name, area }`; derived stages `unauthenticated → otp_pending → authenticated → profile_created → location_selected` (`getAuthStage`). `authReducer` is pure and ignores events that would skip a step. `auth-store.ts` is a module singleton read through `useAuth` (`useSyncExternalStore`): session-level, no AsyncStorage.
- **Routing:** `resolveAuthRoute(state)` gives the route a customer belongs on (used by the splash, by every action result and by `useAuthGuard`); `canAccessAuthScreen` guards public / otp / create-profile / location screens. `getSplashRoute` / `getPostLoginRoute` (D-8) are kept. Guest preview stays off (D-9).
- **Actions** (`auth-actions.ts`): `completeOnboarding`, `startRegistration`, `submitOtp`, `resendOtp`, `login`, `createProfile`, `selectArea` — validate (pure rules in `utils/auth-validation`), call `services/auth`, update the store, return `{ ok, route }` or `{ ok:false, field, message }`. Screens contain no auth rules.
- **Mock backend** (`services/auth`): in-memory accounts seeded from the demo user; **OTP is always `1234`**, demo password `EcoBite123` (`data/mock/auth.ts`, hint shown in __DEV__ only). No SMS provider.
- **Location** (`features/location/use-areas`): mock Location Permission (no expo-location / GPS / maps); `api.listAreas()` returns Cầu Giấy, Đống Đa, Ba Đình, Thanh Xuân (each "6 nhà hàng"). The selected `Area` lives in the auth session for Home / discovery.
- **UI added:** `components/auth` (`BrandMark`, `OnboardingIllustration`, `LocationIllustration`, `PagerDots`) and `components/common` `Checkbox`, `ListRow`, `OtpInput`; `Input` gained a `right` slot, `BottomActionBar` a `transparent` mode; `hooks/use-countdown`, `hooks/use-back`; illustration colours live in `constants/illustrations.ts`.

## Shared UI (U1.1)

Presentational components built from the reference (`reference/…/css/styles.css` + screens). They take plain props / domain **types** only: **no services, features, data or router imports** (navigation and business rules stay in callers; `npm run verify` enforces this and forbids hard-coded colours / font literals in components).

- **`components/common`** — `Screen`, `AppText`, `Button` (primary · secondary · soft · destructive · danger · neutral, sizes md/sm/xs, loading, icon), `Input` (label, error, helper, disabled, password), `Card` (base · mint · outline · warning), `Header`, `BottomTabBar` (exactly Home · Orders · Cart · Account from `constants/tabs.ts`), `BottomActionBar`, `Chip`, `Badge`, `StatusBadge` (order states), `Divider`, `BottomSheet`, `ConfirmDialog`, `EmptyState`, `ErrorState`, `LoadingState`, `Skeleton`, `PriceRow`, `QuantityStepper`, `IconTile`, `RadioDot`, `FoodImage` (gradient tile + placeholder bowl), `QrCode` (react-native-qrcode-svg wrapper).
- **`components/common/icons`** — `Icon` (react-native-svg) with ~30 icons whose paths are copied from the reference; only `qr` and one gift path are custom.
- **`components/restaurant`** `RestaurantCard`, `RestaurantHeader`, `RestaurantMeta`, `RestaurantCategoryChip` · **`food-bag`** `FoodBagCard`, `FoodBagImage`, `FoodBagPrice`, `FoodBagQuantity` · **`cart`** `CartItem`, `CartRestaurantSection`, `CartSummary`, `PromoCodeRow` · **`order`** `OrderCard`, `OrderStatusBanner`, `OrderStatusTimeline`, `OrderPriceBreakdown` (no delivery row), `PickupInfo`, `PickupTimeCard`, `PaymentMethodRow` (disabled + "Sắp có"), `PaymentQrCard` (takes `PaymentQr` only), `PickupQrCard` (takes `PickupQr` only: token in the QR, orderCode beneath).
- **`components/ai`** — `ChatBubble` (reference style) and `AiOrb` (floating orb: gradient layers + float animation, `onPress` only, no AI logic, mounting/navigation is the caller's job).
- **Pure helpers** for display: `utils/format` (`formatMoney`, `calcDiscountPercent`, `formatDistance`, `formatTimeVN`, `formatCountdown`) and `utils/order-timeline` (`getTimelineSteps`, used by `OrderStatusTimeline`).
- **Dev only:** `components/dev/ComponentGallery` (opened from `DevMenu`) shows every component for visual checks.
- **Tokens added in U1.1:** `constants/gradients.ts` (food tiles, hero, QR screen, orb), `constants/tabs.ts`, `ORDER_STATUS_TONE`, sheet/dialog/stepper/radio/timeline/icon-tile style presets, typography roles `heading`, `muted`, `price`, `priceStrike`, `status`, scrim/handle/track colours. Reference sizes are asserted against the CSS in `npm run verify`.

## Domain model

- `Cart`: `{ items, pickupSlots: Record<restaurantId, PickupSlot>, promoCode }` — multi-restaurant (D-1). `CartItem` snapshots name, prices and `ownBox`.
- `Order` (one per restaurant): `orderCode` (`EB-YYMM-NNN`), `checkoutId`, `items`, `money: OrderMoney`, `promoCode`, `status: OrderState`, `paymentStatus`, `paymentMethod`, `pickupSlot`, `pickupQr`, `cancellation`, `statusHistory`. **No delivery fee anywhere.**
- Reference-shaped mock entities: `Restaurant` (category, phone, walkMinutes), `FoodBag` (`left`, `pickupWindow`, `contents`, `allergens`), `Category`, `Promo`, `PickupSlotOption`, `PaymentMethod`, `User` (impact, wallet, saved).

## Service layer

Each service is an interface plus a mock; consumers import the exported binding (`api`, `paymentService`, `aiService`). Swapping in a real implementation means changing one line in the service `index.ts`.

- `services/api` — `EcoBiteApi`: catalog reads, **`checkout({ cart })` → `CheckoutResult { checkoutId, orders[] }`** (checks bag availability and pickup slots), order reads, `markOrderPaid`, `expireOrder`, `cancelOrder`, restaurant/staff simulations (`simulateRestaurantProgress`, `verifyPickupQr`, `completePickup`). Orders live in memory, seeded from `data/mock`.
- `services/payment` — `PaymentService`: `listPaymentMethods`, `createPayment`, `getPaymentStatus`, `retryPayment`; `setMockPaymentScenario` chooses the outcome.
- `services/ai` — `AiService`: `sendMessage`, `listConversations`.

## Order lifecycle (D-2)

```
placed → paid → preparing → ready → qr_verified → picked_up          (main sequence, linear)
placed | paid ──cancel──▶ cancelled        placed ──hold timeout──▶ expired      (terminal, outside the sequence)
```
Rules in `utils/order-lifecycle.ts`: `transitionOrder` (linear only), `canCancel`/`cancelOrder` (paid → full refund `pending`; unpaid → no refund; pickup QR invalidated), `canExpire`/`expireOrder`, `isTerminal`. Labels: `constants/order-status.ts`.

## Checkout (D-1)

`utils/order-pricing.ts`: `groupCartByRestaurant` → `buildOrderDrafts` (one draft per restaurant; a restaurant without a pickup slot blocks checkout) → `api.checkout` creates the orders. `computeOrderMoney`: `total = subtotal - promoDiscount - ownBoxDiscount`. One promo per checkout; it is applied to the first restaurant whose order qualifies (`onlyVegan` promos are not applicable yet).

## Payment flow (D-4, D-6, D-10)

1. Payment-method screen 6.8 lists `PaymentMethod`s; only `bank_qr` is enabled, the rest show "Sắp có".
2. `paymentService.createPayment` per order → `PaymentSession` with a **Payment QR**, demo `BankTransferDetails` (transfer note = order code without dashes) and `holdExpiresAt` (+10 min).
3. `usePaymentStatus` polls and exposes the phase (`derivePaymentPhase`: `qr` → `waiting` after 4 s → `success | failed | expired`).
4. `settlePayment` applies the result: success → `api.markOrderPaid` (order `paid`, **Pickup QR issued**); expired → `api.expireOrder`; failed → order stays `placed`, `retryUntil` = +5 min, `retryPayment` creates a new attempt.
5. Success navigates to **Pickup QR (8.3)** (D-3).

No real provider (PayOS, Casso, SePay) is integrated.

## Pickup flow (D-7)

1. After payment the order holds a `PickupQr` `{ token (opaque), orderCode }`; the QR encodes the token, the order code is displayed beneath it for manual entry.
2. Restaurant preparation is simulated: `simulateRestaurantProgress` → `preparing` → `ready`.
3. Staff verification is simulated by `verifyPickupQr(orderId, token)` (an order code or a payment QR payload is rejected) → `qr_verified`; `completePickup` → `picked_up`.

**Payment QR and Pickup QR are different objects**, types and screens. Self-pickup only.

## Development-only controls (D-17)

`components/dev/DevMenu` (a small "DEV" pill + modal) is mounted from `app/_layout.tsx` behind `__DEV__` via `require`. Its buttons call `features/dev/dev-actions`: `devAdvanceOrder` dispatches to the matching **existing** service for the order's current status (`markOrderPaid` / `simulateRestaurantProgress` / `verifyPickupQr` / `completePickup`), `devExpireOrder`, `devCancelOrder`, `devSetPaymentScenario`. No rules are duplicated; the services and `utils/order-lifecycle` enforce legality. It is not the HTML reference demo panel.

## AI separation

`app/ai`, `features/ai`, `components/ai`, `services/ai`, `data/ai`, `types/ai`. UI + mock only; suggestions carry `reasons[]` and reference core entities by id; no imports from core ordering features. `/ai` (welcome/chat states) and `/ai/history`. See `AI-FLOW.md`.
