# EcoBite — 82-Screen HTML Reference Prototype

**Design reference & interaction prototype for the EcoBite customer mobile app.**

> This is **NOT** the React Native implementation. It is a clickable HTML/CSS/JS reference that will be handed
> to Claude Code in the next stage so the application can be rebuilt in **React Native + Expo**.

| | |
|---|---|
| Screens | **82** |
| Groups | **11** |
| MVP flow | **24 steps**, fully clickable end to end |
| Fulfillment model | **SELF-PICKUP ONLY** — no delivery anywhere in the product |
| Backend | none — static files, mock data only |
| Target viewport | 390 × 844 (also 375 × 812 and 430 × 932) |
| UI language | Vietnamese · code, filenames and IDs in English |

---

## 1. What EcoBite is

EcoBite connects customers with restaurants that still have good, unsold food at the end of the day.
Restaurants pack that food into discounted **food bags** (*túi đồ ăn*). Customers browse nearby restaurants,
reserve a bag at roughly half price, pay in the app, then **walk to the restaurant and pick the bag up**
inside a chosen time window.

The product exists to reduce food waste. Every screen that shows impact uses one convention:

```
1 bag  ≈  1.2 kg food saved  ≈  2.5 kg CO2 avoided  ≈  340 L water
```

## 2. Product model

```
Restaurant has unsold food  →  packs it as a food bag  →  publishes it with a pickup window
Customer reserves + pays in app  →  receives a pickup QR  →  goes to the restaurant
Staff scans the pickup QR  →  hands over the bag  →  order completed
```

EcoBite is an intermediary. It does not cook, package or transport food.

## 3. Self-pickup model (critical)

**There is no delivery in this product.** The following screens do not exist and must never be reintroduced:

- ~~Delivery Address~~
- ~~Delivery Method~~
- ~~Delivery Fee~~
- ~~Driver Information~~
- ~~Driver Tracking~~
- ~~Driver Map~~
- ~~Contact Driver~~
- ~~Out for Delivery~~
- ~~Delivered by Driver~~

What replaces them:

| Concept | EcoBite equivalent |
|---|---|
| Delivery address | **Restaurant address** (`RESTAURANTS[].address`) |
| Delivery time | **Pickup time window** (`PICKUP_SLOTS`) |
| Delivery fee | Nothing — the Order Summary shows the row as `—` on purpose, so reviewers can see it was a decision |
| Driver tracking | **Pickup order status** (6 states, no driver) |
| Route to customer | **Directions to the restaurant** (screens 4.6 and 8.5) |

The user's location is used **only** to sort restaurants by distance and to draw walking directions.
Screens 2.1 and 2.3 state this explicitly in the UI.

## 4. Order status chain

Exactly six states, defined in `js/mock-data.js` as `ORDER_STATUS`:

| # | Key | Vietnamese label | Triggered by |
|---|---|---|---|
| 1 | `PLACED` | Đã đặt hàng | Customer taps *Đặt đơn* |
| 2 | `PAID` | Đã thanh toán | Server receives the bank webhook |
| 3 | `PREPARING` | Quán đang chuẩn bị | Restaurant confirms on its dashboard |
| 4 | `READY` | Sẵn sàng nhận hàng | Restaurant taps *prepared* |
| 5 | `QR_VERIFIED` | QR đã được xác nhận | Staff scans the customer's pickup QR |
| 6 | `COMPLETED` | Đã nhận hàng | Customer confirms receipt |

## 5. The 11 screen groups

| # | Folder | Group (EN) | Group (VI) | Screens |
|---|---|---|---|---|
| 1 | `screens/group-01/` | Welcome & Account | Chào mừng & Tài khoản | 9 |
| 2 | `screens/group-02/` | Location | Vị trí | 4 |
| 3 | `screens/group-03/` | Home & Discovery | Trang chủ & Khám phá | 10 |
| 4 | `screens/group-04/` | Restaurant | Nhà hàng | 7 |
| 5 | `screens/group-05/` | Food Bag | Túi đồ ăn | 7 |
| 6 | `screens/group-06/` | Cart & Order | Giỏ hàng & Đặt đơn | 9 |
| 7 | `screens/group-07/` | Payment | Thanh toán | 7 |
| 8 | `screens/group-08/` | Pickup at Restaurant | Nhận hàng tại quán | 8 |
| 9 | `screens/group-09/` | Order History | Lịch sử đơn | 7 |
| 10 | `screens/group-10/` | Account | Tài khoản | 9 |
| 11 | `screens/group-11/` | AI Assistant | Trợ lý AI | 5 |
| | | | **Total** | **82** |

## 6. All 82 screens

`MVP` column = step number in the 24-step MVP flow, or `—` if the screen is outside the MVP.
`RN component` = the React Native component this screen should become in the next stage.

### Group 01 — Welcome & Account · *Chào mừng & Tài khoản*

| Screen | File | Name (VI) | MVP | RN component |
|---|---|---|---|---|
| `1.1` | `01-01-splash.html` | Màn khởi động | 1 | `SplashScreen` |
| `1.2` | `01-02-onboarding-value.html` | Giới thiệu 1 — Ăn ngon, giá tốt | 2 | `OnboardingValueScreen` |
| `1.3` | `01-03-onboarding-impact.html` | Giới thiệu 2 — Giảm lãng phí | — | `OnboardingImpactScreen` |
| `1.4` | `01-04-onboarding-ai.html` | Giới thiệu 3 — Trợ lý AI | — | `OnboardingAiScreen` |
| `1.5` | `01-05-welcome.html` | Chào mừng — chọn cách vào | — | `WelcomeScreen` |
| `1.6` | `01-06-login.html` | Đăng nhập | 3 | `LoginScreen` |
| `1.7` | `01-07-register.html` | Đăng ký | — | `RegisterScreen` |
| `1.8` | `01-08-otp-verification.html` | Xác thực OTP | — | `OtpVerificationScreen` |
| `1.9` | `01-09-reset-password.html` | Quên mật khẩu → Đặt lại | — | `ResetPasswordScreen` |

### Group 02 — Location · *Vị trí*

| Screen | File | Name (VI) | MVP | RN component |
|---|---|---|---|---|
| `2.1` | `02-01-location-permission.html` | Xin quyền vị trí | 4 | `LocationPermissionScreen` |
| `2.2` | `02-02-select-location.html` | Chọn khu vực | 5 | `SelectLocationScreen` |
| `2.3` | `02-03-current-location.html` | Vị trí hiện tại | — | `CurrentLocationScreen` |
| `2.4` | `02-04-search-location.html` | Tìm khu vực | — | `SearchLocationScreen` |

### Group 03 — Home & Discovery · *Trang chủ & Khám phá*

| Screen | File | Name (VI) | MVP | RN component |
|---|---|---|---|---|
| `3.1` | `03-01-home.html` | Trang chủ | 6 | `HomeScreen` |
| `3.2` | `03-02-all-categories.html` | Tất cả danh mục | — | `AllCategoriesScreen` |
| `3.3` | `03-03-category-results.html` | Kết quả theo danh mục | — | `CategoryResultsScreen` |
| `3.4` | `03-04-search.html` | Tìm kiếm — trước khi gõ | — | `SearchScreen` |
| `3.5` | `03-05-search-results.html` | Kết quả tìm kiếm | 7 | `SearchResultsScreen` |
| `3.6` | `03-06-filter.html` | Bộ lọc | — | `FilterSheet` |
| `3.7` | `03-07-sort.html` | Sắp xếp | — | `SortSheet` |
| `3.8` | `03-08-restaurant-map.html` | Bản đồ nhà hàng | — | `RestaurantMapScreen` |
| `3.9` | `03-09-notifications.html` | Thông báo | — | `NotificationsScreen` |
| `3.10` | `03-10-saved-restaurants.html` | Nhà hàng đã lưu | — | `SavedRestaurantsScreen` |

### Group 04 — Restaurant · *Nhà hàng*

| Screen | File | Name (VI) | MVP | RN component |
|---|---|---|---|---|
| `4.1` | `04-01-restaurant-detail.html` | Chi tiết nhà hàng | 8 | `RestaurantDetailScreen` |
| `4.2` | `04-02-restaurant-bags.html` | Menu túi của quán | — | `RestaurantBagsScreen` |
| `4.3` | `04-03-restaurant-reviews.html` | Đánh giá nhà hàng | — | `RestaurantReviewsScreen` |
| `4.4` | `04-04-restaurant-info.html` | Thông tin nhà hàng | — | `RestaurantInfoScreen` |
| `4.5` | `04-05-photo-gallery.html` | Thư viện ảnh | — | `PhotoGalleryScreen` |
| `4.6` | `04-06-directions.html` | Chỉ đường tới quán | — | `DirectionsScreen` |
| `4.7` | `04-07-report-restaurant.html` | Báo cáo nhà hàng | — | `ReportRestaurantScreen` |

### Group 05 — Food Bag · *Túi đồ ăn*

| Screen | File | Name (VI) | MVP | RN component |
|---|---|---|---|---|
| `5.1` | `05-01-food-bag-detail.html` | Chi tiết túi | 9 | `FoodBagDetailScreen` |
| `5.2` | `05-02-bag-contents.html` | Túi hôm nay gồm gì | — | `BagContentsScreen` |
| `5.3` | `05-03-select-pickup-time.html` | Chọn khung giờ nhận | 13 | `SelectPickupTimeScreen` |
| `5.4` | `05-04-allergens.html` | Nguyên liệu & dị ứng | — | `AllergensScreen` |
| `5.5` | `05-05-bag-impact.html` | Tác động của túi này | — | `BagImpactScreen` |
| `5.6` | `05-06-add-to-cart.html` | Chọn số lượng | 10 | `AddToCartSheet` |
| `5.7` | `05-07-bag-unavailable.html` | Túi đã hết / ngoài giờ | — | `BagUnavailableScreen` |

### Group 06 — Cart & Order · *Giỏ hàng & Đặt đơn*

| Screen | File | Name (VI) | MVP | RN component |
|---|---|---|---|---|
| `6.1` | `06-01-cart.html` | Giỏ hàng | 11 | `CartScreen` |
| `6.2` | `06-02-cart-empty.html` | Giỏ hàng trống | — | `CartEmptyScreen` |
| `6.3` | `06-03-remove-item.html` | Xoá túi khỏi giỏ | — | `RemoveItemDialog` |
| `6.4` | `06-04-checkout.html` | Xác nhận đơn — nhận tại quán | 12 | `CheckoutScreen` |
| `6.5` | `06-05-promo-code.html` | Mã giảm giá | — | `PromoCodeScreen` |
| `6.6` | `06-06-change-pickup-time.html` | Đổi giờ tới lấy | — | `ChangePickupTimeScreen` |
| `6.7` | `06-07-order-summary.html` | Tóm tắt đơn hàng | 14 | `OrderSummaryScreen` |
| `6.8` | `06-08-payment-method.html` | Chọn cách thanh toán | — | `PaymentMethodScreen` |
| `6.9` | `06-09-creating-order.html` | Đang tạo đơn | — | `CreatingOrderScreen` |

### Group 07 — Payment · *Thanh toán*

| Screen | File | Name (VI) | MVP | RN component |
|---|---|---|---|---|
| `7.1` | `07-01-qr-payment.html` | QR chuyển khoản | 15 | `QrPaymentScreen` |
| `7.2` | `07-02-waiting-payment.html` | Đang chờ nhận tiền | — | `WaitingPaymentScreen` |
| `7.3` | `07-03-payment-success.html` | Thanh toán thành công | 16 | `PaymentSuccessScreen` |
| `7.4` | `07-04-payment-failed.html` | Thanh toán thất bại | — | `PaymentFailedScreen` |
| `7.5` | `07-05-payment-expired.html` | Hết hạn giữ chỗ | — | `PaymentExpiredScreen` |
| `7.6` | `07-06-wallet-cards.html` | Ví & thẻ đã lưu | — | `WalletCardsScreen` |
| `7.7` | `07-07-invoice.html` | Hoá đơn điện tử | — | `InvoiceScreen` |

### Group 08 — Pickup at Restaurant · *Nhận hàng tại quán*

| Screen | File | Name (VI) | MVP | RN component |
|---|---|---|---|---|
| `8.1` | `08-01-pickup-instructions.html` | Đặt hàng thành công | 18 | `PickupInstructionsScreen` |
| `8.2` | `08-02-pickup-order-status.html` | Trạng thái đơn nhận tại quán | — | `PickupOrderStatusScreen` |
| `8.3` | `08-03-pickup-qr-code.html` | Mã QR nhận hàng | 17 | `PickupQrCodeScreen` |
| `8.4` | `08-04-order-ready.html` | Thông báo sẵn sàng nhận | 19 | `OrderReadyNotification` |
| `8.5` | `08-05-arriving-at-restaurant.html` | Đang trên đường tới quán | 20 | `ArrivingAtRestaurantScreen` |
| `8.6` | `08-06-qr-verified.html` | QR đã được xác nhận | 21 | `QrVerifiedScreen` |
| `8.7` | `08-07-order-completed.html` | Đã nhận hàng tại quán | 22 | `OrderCompletedScreen` |
| `8.8` | `08-08-cancel-order.html` | Huỷ đơn | — | `CancelOrderScreen` |

### Group 09 — Order History · *Lịch sử đơn*

| Screen | File | Name (VI) | MVP | RN component |
|---|---|---|---|---|
| `9.1` | `09-01-order-history.html` | Danh sách đơn hàng | 23 | `OrderHistoryScreen` |
| `9.2` | `09-02-orders-active.html` | Đơn đang xử lý | — | `OrdersActiveScreen` |
| `9.3` | `09-03-orders-completed.html` | Đơn đã hoàn tất | — | `OrdersCompletedScreen` |
| `9.4` | `09-04-orders-cancelled.html` | Đơn đã huỷ | — | `OrdersCancelledScreen` |
| `9.5` | `09-05-order-detail.html` | Chi tiết đơn cũ | 24 | `OrderDetailScreen` |
| `9.6` | `09-06-reorder.html` | Đặt lại nhanh | — | `ReorderSheet` |
| `9.7` | `09-07-write-review.html` | Viết đánh giá | — | `WriteReviewScreen` |

### Group 10 — Account · *Tài khoản*

| Screen | File | Name (VI) | MVP | RN component |
|---|---|---|---|---|
| `10.1` | `10-01-profile.html` | Hồ sơ | — | `ProfileScreen` |
| `10.2` | `10-02-edit-profile.html` | Sửa thông tin cá nhân | — | `EditProfileScreen` |
| `10.3` | `10-03-my-impact.html` | Thành tích của bạn | — | `MyImpactScreen` |
| `10.4` | `10-04-notification-settings.html` | Cài đặt thông báo | — | `NotificationSettingsScreen` |
| `10.5` | `10-05-settings.html` | Cài đặt chung | — | `SettingsScreen` |
| `10.6` | `10-06-help.html` | Trợ giúp | — | `HelpScreen` |
| `10.7` | `10-07-contact-support.html` | Liên hệ hỗ trợ | — | `ContactSupportScreen` |
| `10.8` | `10-08-terms-privacy.html` | Điều khoản & bảo mật | — | `TermsPrivacyScreen` |
| `10.9` | `10-09-logout.html` | Đăng xuất | — | `LogoutDialog` |

### Group 11 — AI Assistant · *Trợ lý AI*

| Screen | File | Name (VI) | MVP | RN component |
|---|---|---|---|---|
| `11.1` | `11-01-ai-orb.html` | Quả cầu AI nổi trên màn | — | `AiOrbOverlay` |
| `11.2` | `11-02-ai-welcome.html` | Mở trợ lý AI | — | `AiWelcomeScreen` |
| `11.3` | `11-03-ai-typing.html` | Đang nhập câu hỏi | — | `AiTypingScreen` |
| `11.4` | `11-04-ai-suggestions.html` | AI trả lời kèm lý do | — | `AiSuggestionsScreen` |
| `11.5` | `11-05-ai-history.html` | Lịch sử hội thoại AI | — | `AiHistoryScreen` |

## 7. The 24-step MVP flow

These 24 screens are wired end to end. In the prototype the **MVP rail** below the phone walks the exact chain;
the in-screen buttons also follow it where the natural interaction matches.

| Step | Flow name | Screen | File |
|---|---|---|---|
| 01 | Splash | `1.1` Màn khởi động | `screens/group-01/01-01-splash.html` |
| 02 | Onboarding | `1.2` Giới thiệu 1 — Ăn ngon, giá tốt | `screens/group-01/01-02-onboarding-value.html` |
| 03 | Login / Register | `1.6` Đăng nhập | `screens/group-01/01-06-login.html` |
| 04 | Location Permission | `2.1` Xin quyền vị trí | `screens/group-02/02-01-location-permission.html` |
| 05 | Select Location | `2.2` Chọn khu vực | `screens/group-02/02-02-select-location.html` |
| 06 | Home | `3.1` Trang chủ | `screens/group-03/03-01-home.html` |
| 07 | Search / Browse Restaurants | `3.5` Kết quả tìm kiếm | `screens/group-03/03-05-search-results.html` |
| 08 | Restaurant Detail | `4.1` Chi tiết nhà hàng | `screens/group-04/04-01-restaurant-detail.html` |
| 09 | Food Bag Detail | `5.1` Chi tiết túi | `screens/group-05/05-01-food-bag-detail.html` |
| 10 | Add to Cart | `5.6` Chọn số lượng | `screens/group-05/05-06-add-to-cart.html` |
| 11 | Cart | `6.1` Giỏ hàng | `screens/group-06/06-01-cart.html` |
| 12 | Checkout | `6.4` Xác nhận đơn — nhận tại quán | `screens/group-06/06-04-checkout.html` |
| 13 | Select Pickup Time | `5.3` Chọn khung giờ nhận | `screens/group-05/05-03-select-pickup-time.html` |
| 14 | Order Summary | `6.7` Tóm tắt đơn hàng | `screens/group-06/06-07-order-summary.html` |
| 15 | QR Payment | `7.1` QR chuyển khoản | `screens/group-07/07-01-qr-payment.html` |
| 16 | Payment Success | `7.3` Thanh toán thành công | `screens/group-07/07-03-payment-success.html` |
| 17 | Pickup QR Code | `8.3` Mã QR nhận hàng | `screens/group-08/08-03-pickup-qr-code.html` |
| 18 | Pickup Instructions | `8.1` Đặt hàng thành công | `screens/group-08/08-01-pickup-instructions.html` |
| 19 | Order Ready | `8.4` Thông báo sẵn sàng nhận | `screens/group-08/08-04-order-ready.html` |
| 20 | Customer Arrives at Restaurant | `8.5` Đang trên đường tới quán | `screens/group-08/08-05-arriving-at-restaurant.html` |
| 21 | QR Verified | `8.6` QR đã được xác nhận | `screens/group-08/08-06-qr-verified.html` |
| 22 | Order Completed | `8.7` Đã nhận hàng tại quán | `screens/group-08/08-07-order-completed.html` |
| 23 | Order History | `9.1` Danh sách đơn hàng | `screens/group-09/09-01-order-history.html` |
| 24 | Order Detail | `9.5` Chi tiết đơn cũ | `screens/group-09/09-05-order-detail.html` |

```
Splash → Onboarding → Login/Register → Location Permission → Select Location → Home
      → Search/Browse → Restaurant Detail → Food Bag Detail → Add to Cart → Cart
      → Checkout → Select Pickup Time → Order Summary → QR Payment → Payment Success
      → Pickup QR Code → Pickup Instructions → Order Ready → Customer Arrives
      → QR Verified → Order Completed → Order History → Order Detail
```

## 8. Two different QR codes

This is the single most important distinction in the product. **Do not merge them.**

| | **QR #1 — Payment** | **QR #2 — Pickup** |
|---|---|---|
| Screen | `7.1` `qr-payment` | `8.3` `pickup-qr-code` |
| Who scans | **The customer**, with their banking app | **Restaurant staff**, with the merchant app |
| Direction | Customer's phone → bank | Customer's phone → staff scanner |
| Payload | VietQR string for the receiving account (fake in this prototype) | Order ID, e.g. `EB-2409-017` |
| Appears after | Customer taps *Đặt đơn* | Payment is confirmed |
| Result of scanning | Status → `PAID` | Status → `QR_VERIFIED` |
| Visual identity | Black modules, white card, **BẢN DEMO** badge | Green modules, mint background, *“Đưa màn hình này cho nhân viên”* |
| Fallback | Copy account number and transfer manually | Read the order ID aloud for manual entry |

## 9. Mock payment behaviour

The prototype never contacts a bank. Screen `7.1` behaves like the real design:

- There is **no “I have transferred the money” button**. That button would be customer-asserted and unverifiable.
- After ~4 s the prototype advances to `7.2 waiting-payment`, then after ~5 s to `7.3 payment-success`.
- The **demo panel** beside the phone can force any outcome: success, failure (`7.4`), or hold expiry (`7.5`).

In production this becomes:

```
customer transfers  →  bank  →  webhook (Casso / SePay / PayOS)  →  EcoBite server
app polls GET /orders/:id/status every 3s  →  PENDING | PAID | EXPIRED
PAID  →  navigate to Payment Success automatically
```

## 10. Mock restaurant behaviour

Food preparation happens in the **merchant app**, which is outside the customer app's scope.
The prototype simulates it with clearly-labelled demo buttons on screens `8.1`, `8.2`, `8.3` and `8.5`:

- *Quán bắt đầu chuẩn bị* → status `PREPARING`
- *Quán báo túi đã sẵn sàng* → status `READY`, opens `8.4 order-ready`
- *Nhân viên quét mã QR* → status `QR_VERIFIED`, opens `8.6 qr-verified`

These controls exist **only in the prototype** and must not be built into the React Native app.

## 11. AI assistant — UI only

Group 11 designs the assistant completely, and the floating orb appears on `3.1`, `3.2`, `3.3`, `3.10`, `6.1`,
`9.1`, `10.1` and `11.1`. All of it is **presentation only**:

- No model is called. Responses come from `AI_MOCK` in `js/mock-data.js`.
- The orb is draggable on the standalone `3.1` page; in the shell it is a tappable entry point to `11.2`.
- Screen `11.4` shows the product's differentiator: every suggestion carries **explicit reasons**, not just a list.
- Screen `11.5` states in the UI that the MVP has no real AI connected.

## 12. Screens excluded from MVP implementation

All 82 screens are designed, but only 24 are in the MVP chain. The remaining 58 are reference for later stages.
If the next build stage must be cut further, this is the recommended phase-1 subset (13 screens) that still
produces a coherent demo video:

`1.1` → `1.6` → `2.2` → `3.1` → `4.1` → `5.1` → `5.6` → `6.1` → `6.4` → `6.7` → `7.1` → `7.3` → `8.3`

| Group | Screens outside the MVP chain |
|---|---|
| 01 · Welcome & Account | `1.3`, `1.4`, `1.5`, `1.7`, `1.8`, `1.9` |
| 02 · Location | `2.3`, `2.4` |
| 03 · Home & Discovery | `3.2`, `3.3`, `3.4`, `3.6`, `3.7`, `3.8`, `3.9`, `3.10` |
| 04 · Restaurant | `4.2`, `4.3`, `4.4`, `4.5`, `4.6`, `4.7` |
| 05 · Food Bag | `5.2`, `5.4`, `5.5`, `5.7` |
| 06 · Cart & Order | `6.2`, `6.3`, `6.5`, `6.6`, `6.8`, `6.9` |
| 07 · Payment | `7.2`, `7.4`, `7.5`, `7.6`, `7.7` |
| 08 · Pickup at Restaurant | `8.2`, `8.8` |
| 09 · Order History | `9.2`, `9.3`, `9.4`, `9.6`, `9.7` |
| 10 · Account | `10.1`, `10.2`, `10.3`, `10.4`, `10.5`, `10.6`, `10.7`, `10.8`, `10.9` |
| 11 · AI Assistant | `11.1`, `11.2`, `11.3`, `11.4`, `11.5` |

## 13. Design system

Everything lives in `css/styles.css`. Screens never hard-code a colour that exists as a token.

### Colour tokens

| Token | Value | Use |
|---|---|---|
| `--la` | `#2FA05C` | primary green — buttons, active states, links |
| `--la-dam` | `#1F7D46` | dark green — prices, emphasis, active tab label |
| `--la-chu` | `#22713F` | green text on mint backgrounds |
| `--bac-ha` | `#E6F4E4` | mint — icon circles, info cards |
| `--bac-ha-2` | `#D3EBCF` | mint border for secondary buttons |
| `--giay` | `#FDFDFB` | app background |
| `--the` | `#FFFFFF` | card surface |
| `--muc` | `#1A2621` | primary text |
| `--muc-mo` | `#6B7A70` | secondary text |
| `--muc-rat-mo` | `#9BA89F` | tertiary text, placeholders |
| `--ke` / `--ke-2` | `#E6E4DA / #EAE8DE` | borders and dividers |
| `--hophach` | `#F2A828` | amber — ratings, warnings, demo badges |
| `--do` | `#E24B3B` | red — errors, destructive actions, badges |

> The brief specified `#FAF8F1` as the paper background. During review the client found it too warm and dim,
> so the token was lifted to **`#FDFDFB`** and the border tokens darkened slightly to keep white cards separated.
> `#2FA05C`, `#1F7D46` and `#E6F4E4` are unchanged.

### Typography — Nunito

| Role | Class | Size / weight |
|---|---|---|
| Screen title | `.tieu` | 23px / 800, tracking −0.025em |
| Section title | `.tieu2` | 17px / 800 |
| Card title | `.tieu3` | 14px / 800 |
| Body | `.doan` | 13px / 600, line-height 1.55 |
| Caption | `.nho` | 11.5px / 600 |
| Nav title | `.nav h4` | 16px / 800 |
| Tab label | `.tab span` | 10px / 700 |

### Components

| Component | Class | Notes |
|---|---|---|
| Phone frame | `.thu` + `.may` | 390 × 844, 44px radius, scaled for other sizes |
| Screen root | `.mh` | column flex: status bar → nav → `.cuon` → `.day` → `.tab` |
| Scroll body | `.cuon` | the only scrolling region |
| Status bar | `.tt` | 9:41 + signal/wifi/battery |
| Top nav | `.nav` | back chip + title + optional right action |
| Primary button | `.nut` | 50px, radius 15, green, green shadow |
| Secondary button | `.nut.phu` | white with mint ring |
| Tertiary / mint | `.nut.xam` | mint fill, dark green label |
| Disabled | `.nut.tro` | grey, no shadow |
| Destructive | `.nut.vien` | transparent with red ring |
| Text input | `.nhap` + `.o` | `.sang` = focused, `.loi` = error |
| Card | `.the-c` | white, radius 18, 1px border + soft shadow |
| Info card | `.the-p` | mint fill, no border |
| Outline card | `.vien-n` | border only, no fill |
| List row | `.dong` | icon tile + text + trailing value/chevron |
| Chip / filter | `.chip` | `.on` = selected, `.nhat` = mint |
| Status badge | `.nhan-n` | `.xanh` `.cam` `.do` `.xam` `.dac` |
| Money row | `.tien` | `.tong` = total row with dashed rule |
| Bottom bar | `.day` | sticky action area above the tab bar |
| Bottom tab bar | `.tab` | 4 tabs, filled icon when active, cart badge |
| Empty state | `.rong` | mint circle + title + body + two actions |
| Restaurant card | `.nh` | grid card — image, discount badge, name, rating, price |
| Horizontal card | `.ngang` | list card — thumbnail + text + price |
| Step timeline | `.buoc` | order status chain, hollow ring = current step |
| Chat bubble | `.tn` | `.ai` left, `.toi` right |
| Map surface | `.bando` | mock blocks/roads/pins, no map SDK |
| AI orb | `.cau` | 6-layer iridescent sphere, drag-enabled |

### Spacing & radius

- Horizontal gutters: `16px` (`.pad16`) or `20px` (`.pad`)
- Vertical rhythm between cards: `11–14px`
- Radius: buttons `15`, cards `18`, chips `999`, icon tiles `12`, phone `44`

## 14. Project structure

```
ecobite-82-screen-reference/
├── index.html                  ← the clickable prototype (all 82 screens inlined as <template>)
├── README.md                   ← this file
├── assets/
│   ├── icons/leaf.svg          ← brand mark; all other icons are inline SVG
│   └── images/README.txt       ← how to replace the placeholder food illustrations
├── css/
│   └── styles.css              ← design tokens + all components + prototype shell
├── js/
│   ├── mock-data.js            ← restaurants, bags, orders, user, promos, AI responses
│   ├── navigation.js           ← SCREENS map, ROUTES table, MVP_FLOW, wireScreen()
│   ├── app.js                  ← prototype shell: rendering, MVP rail, demo controls, quantity maths
│   └── standalone.js           ← navigation for the individual screen files
└── screens/
    ├── group-01/  01-01-splash.html … 01-09-reset-password.html
    ├── group-02/  02-01-location-permission.html … 02-04-search-location.html
    ├── group-03/  03-01-home.html … 03-10-saved-restaurants.html
    ├── group-04/  04-01-restaurant-detail.html … 04-07-report-restaurant.html
    ├── group-05/  05-01-food-bag-detail.html … 05-07-bag-unavailable.html
    ├── group-06/  06-01-cart.html … 06-09-creating-order.html
    ├── group-07/  07-01-qr-payment.html … 07-07-invoice.html
    ├── group-08/  08-01-pickup-instructions.html … 08-08-cancel-order.html
    ├── group-09/  09-01-order-history.html … 09-07-write-review.html
    ├── group-10/  10-01-profile.html … 10-09-logout.html
    └── group-11/  11-01-ai-orb.html … 11-05-ai-history.html
```

Screen file naming: `GG-NN-slug.html` where `GG` is the group number and `NN` the screen number
inside the group — matching the `G.N` codes used throughout the EcoBite specification.

## 15. How to run

No backend, no build step, no npm install.

```bash
# unzip, then:
open ecobite-82-screen-reference/index.html        # macOS
start ecobite-82-screen-reference\index.html       # Windows
```

Or double-click `index.html`. Everything runs from `file://`.

Optional, for a cleaner URL bar:

```bash
cd ecobite-82-screen-reference && python3 -m http.server 8080
# → http://localhost:8080
```

### Using the prototype

| Control | What it does |
|---|---|
| Left sidebar | Jump to any of the 82 screens; the amber number is the MVP step |
| *Chỉ màn MVP* | Filter the sidebar down to the 24 MVP screens |
| *Hiện vùng bấm* | Outline every clickable region inside the phone |
| Size buttons | 375 × 812 · 390 × 844 · 430 × 932 |
| MVP rail | *← Bước trước* / *Bước sau →* walks the exact 24-step chain |
| Demo panel | Appears on payment and pickup screens; forces simulated outcomes |
| URL hash | `index.html#7.1` opens a specific screen directly |

Screens are also openable on their own, e.g. `screens/group-07/07-01-qr-payment.html`.
Those pages carry the same navigation wiring and link back to the shell.

> Layout is authored at **390 × 844**. The 375 and 430 buttons scale the frame rather than re-flowing,
> because the reference is a fixed-width design spec. In React Native the same layouts should use flex
> and percentage widths so they genuinely reflow.

## 16. Demo data policy

Everything financial in this prototype is fabricated. No real account, card or transaction data is used anywhere.

| Field | Value in prototype |
|---|---|
| Bank | `Vietcombank (demo)` |
| Account holder | `CTY TNHH ECOBITE` |
| Account number | `0000 1234 5678` — deliberately invalid |
| Card | `•••• •••• •••• 4242` — standard test-card pattern |
| Order IDs | `EB-2409-0xx` |
| Payment QR payload | random modules, not a scannable VietQR string |

Screens `7.1`, `7.6` and the payment method list carry a visible **BẢN DEMO** badge.

## 17. Mapping to React Native + Expo

### Token mapping

```js
// theme.js
export const colors = {
  la: '#2FA05C', laDam: '#1F7D46', laChu: '#22713F',
  bacHa: '#E6F4E4', bacHa2: '#D3EBCF',
  giay: '#FDFDFB', the: '#FFFFFF',
  muc: '#1A2621', mucMo: '#6B7A70', mucRatMo: '#9BA89F',
  ke: '#E6E4DA', ke2: '#EAE8DE',
  hophach: '#F2A828', do: '#E24B3B',
};
```

### CSS → React Native

| HTML / CSS here | React Native |
|---|---|
| `.mh` | `<SafeAreaView>` with `flex: 1` |
| `.cuon` | `<ScrollView>` — the only scroller per screen |
| `.day` | a `<View>` pinned outside the ScrollView |
| `.tab` | `expo-router` Tabs navigator with a custom `tabBar` |
| `.nut` | `<Pressable>` + `styles.nut` |
| `.nhap .o` | `<TextInput>` wrapped in a bordered `<View>` |
| `.the-c` | `<View>` with `shadowColor` / `elevation` |
| `.nh` grid | `<FlatList numColumns={2} />` |
| `.ngang` list | `<FlatList />` with a horizontal row renderer |
| inline `<svg>` | `@expo/vector-icons` or `react-native-svg` |
| `box-shadow` | `shadowOffset/Opacity/Radius` on iOS, `elevation` on Android |
| `font-weight: 800` | `fontFamily: 'BeVietnamPro_800ExtraBold'` — never `fontWeight` with custom fonts |
| `background: linear-gradient` | `expo-linear-gradient` |
| `position: fixed` demo panel | does not exist in the app — prototype only |

### Suggested navigation tree

```
app/
├── (auth)/      splash · onboarding · welcome · login · register · otp · reset-password
├── (setup)/     location-permission · select-location · current-location · search-location
├── (tabs)/
│   ├── index            → HomeScreen                 (3.1)
│   ├── orders           → OrderHistoryScreen         (9.1)
│   ├── cart             → CartScreen                 (6.1)
│   └── account          → ProfileScreen              (10.1)
├── restaurant/[id]      → RestaurantDetailScreen     (4.1)
├── bag/[id]             → FoodBagDetailScreen        (5.1)
├── checkout/            → CheckoutScreen (6.4) · SelectPickupTime (5.3) · OrderSummary (6.7)
├── payment/[orderId]    → QrPayment (7.1) · WaitingPayment (7.2) · PaymentSuccess (7.3)
├── pickup/[orderId]     → PickupQrCode (8.3) · PickupOrderStatus (8.2) · QrVerified (8.6)
└── ai/                  → AiWelcome (11.2) · AiSuggestions (11.4) · AiHistory (11.5)
```

### API surface the screens imply

```
GET  /restaurants?lat=&lng=&category=&sort=      → RESTAURANTS
GET  /restaurants/:id                            → detail + pickup hours
GET  /restaurants/:id/bags                       → FOOD_BAGS for that restaurant
GET  /bags/:id                                   → contents, allergens, impact
GET  /bags/:id/slots                             → PICKUP_SLOTS
POST /orders          { bagId, qty, slotId, promoCode, ownBox }   → { orderId, payment }
GET  /orders/:id/status   → PENDING | PAID | EXPIRED   (polled every 3s on 7.1/7.2)
GET  /orders/:id/pickup-qr                       → payload for screen 8.3
GET  /orders                                     → ORDERS (history)
POST /orders/:id/cancel  { reason }
POST /orders/:id/review  { rating, tags, text }
```

### External dependencies outside the customer app

| Step | Depends on | Owner |
|---|---|---|
| 15–16 · Payment | Bank webhook → EcoBite server | Backend |
| 19 · Order Ready | Restaurant taps *prepared* on the merchant dashboard | Merchant app |
| 21 · QR Verified | Staff scans the pickup QR | Merchant app |

If the merchant dashboard is not ready for a demo, keep a clearly-labelled simulation control, exactly as
this prototype does — never fake it silently.

## 18. Build rules for the next stage

Do **not** implement, in the stage that consumes this reference:

- a backend, a database, or real payment processing
- any real AI model call
- any delivery feature, in any form
- the prototype's demo control panel

Do implement: the 24 MVP screens first, against mock data shaped exactly like `js/mock-data.js`,
with the payment status poll and the two QR screens kept strictly separate.

---

*EcoBite · customer app design reference · 82 screens · self-pickup model*
