# EcoBite Customer App — MVP (24 screens)

EcoBite is a surplus-food marketplace with **customer self-pickup**. There is no delivery.

Flow: Discover surplus food → choose restaurant → choose food bag → add to cart → checkout → payment → receive **Pickup QR** → go to restaurant → staff verifies QR → receive food → order completed.

The full product reference has 82 screens in 11 groups; it will be implemented later from the HTML reference. This document covers the approved 24-screen MVP. Route paths are the current placeholders.

| #  | Screen                       | Route                                | Notes |
|----|------------------------------|--------------------------------------|-------|
| 01 | Splash                       | `/`                                  | |
| 02 | Onboarding                   | `/onboarding`                        | `(auth)` |
| 03 | Login / Register             | `/login`                             | `(auth)` |
| 04 | Location Permission          | `/location-permission`               | `(auth)` |
| 05 | Select Location              | `/select-location`                   | `(auth)` |
| 06 | Home                         | `/home`                              | tab |
| 07 | Search / Browse Restaurants  | `/search/results`                    | stack; `/search` = 3.4 (D-14) |
| 08 | Restaurant Detail            | `/restaurant/[id]`                   | |
| 09 | Food Bag Detail              | `/food-bag/[id]`                     | |
| 10 | Add to Cart                  | `/food-bag/[id]/add-to-cart`         | |
| 11 | Cart                         | `/cart`                              | tab |
| 12 | Checkout                     | `/order/checkout`                    | |
| 13 | Select Pickup Time           | `/order/pickup-time`                 | |
| 14 | Order Summary                | `/order/summary`                     | order is created here (`placed`) |
| 15 | QR Payment                   | `/order/[orderId]/payment`           | **Payment QR**, one route with phases (D-6) |
| 16 | Payment Success              | `/order/[orderId]/payment-success`   | → `paid`; next: Pickup QR (D-3) |
| 17 | Pickup QR Code               | `/order/[orderId]/pickup-qr`         | **Pickup QR** |
| 18 | Pickup Instructions          | `/order/[orderId]/pickup-instructions` | |
| 19 | Order Ready                  | `/order/[orderId]/ready`             | → `ready` |
| 20 | Customer Arrives at Restaurant | `/order/[orderId]/arrived`         | |
| 21 | QR Verified                  | `/order/[orderId]/verified`          | → `qr_verified` |
| 22 | Order Completed              | `/order/[orderId]/completed`         | → `picked_up` |
| 23 | Order History                | `/orders`                            | tab |
| 24 | Order Detail                 | `/order/[orderId]`                   | completed-order detail (D-5); active status = `/status` |

**Auth flow detail (U1.2):** Splash → Onboarding → Welcome (`/welcome`, the "Login / Register" fork) → Register (`/register`) → OTP (`/otp`) → Create Profile (`/create-profile`, no reference screen; modelled on 10.2) → Location Permission → Select Location → Home. Login (`/login`) skips the steps the account has already completed. Demo OTP `1234`.

**Discovery detail (U1.3):** Home (all six demo restaurants, selected area first) → Search (recent/trending, live matches) → Search Results (local filtering, "Còn túi" toggle, no-result state) → Restaurant Detail (cover, pickup window, address, "Túi đang có", "Chọn túi ngay") → Food Bag Detail (U1.4).

**Purchase setup (U1.4):** Restaurant Detail → Food Bag Detail (sold-out bags show the 5.7 state) → Add to Cart sheet (quantity limited by remaining bags, own box −2.000đ/túi) → Cart (one section per restaurant, quantity stepper, remove confirmation, empty state) → "Tiếp tục" (Checkout, U1.5).

**Checkout & payment (U1.5):** Cart → Checkout (per-restaurant pickup time, price breakdown, no delivery fee) → Select Pickup Time → Order Summary → Payment Method (QR only; others "Sắp có") → Payment QR (10-minute hold, waiting / failed / expired states) → Payment Success → Pickup QR. One Order and one Payment QR per restaurant, paid one after another.

**Pickup flow (U1.6):** Payment Success → Pickup QR (only for a paid order; the QR encodes an opaque token, the order code is printed under it) → Pickup Instructions → Order Ready (preparing state until the restaurant is done) → Customer Arrives → staff scan (mocked) → QR Verified → "Tôi đã nhận đủ túi" → Order Completed ("Đã nhận hàng"). One pickup QR and state per restaurant order, handled one after another.

**Orders & Account (U1.7):** Orders tab (Đang xử lý / Đã xong / Đã huỷ, one card per restaurant order, "Mở mã nhận hàng" on live orders) → a live order opens its flow (status timeline, payment, QR Verified) and a finished order opens the read-only Order Detail (with "Đặt lại túi này"); Account tab (profile, impact, Orders, Edit Profile) → Logout, which clears the session, cart and checkout state and returns to Welcome while keeping the account's orders.

The AI Assistant is not part of the 24-screen MVP; it is a separate module (`/ai`, see `AI-FLOW.md`).

## Order statuses

1. Đã đặt hàng (`placed`)
2. Đã thanh toán (`paid`)
3. Quán đang chuẩn bị (`preparing`)
4. Sẵn sàng nhận hàng (`ready`)
5. QR đã được xác nhận (`qr_verified`)
6. Đã nhận hàng (`picked_up`)
