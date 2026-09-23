# EcoBite — Screen Mapping (82-screen reference → React Native)

> **Status: all 17 decisions (D-1 … D-17) are APPROVED and phases U0 and U1.2 (auth + onboarding) are implemented** (data model, tokens, services, navigation, dependencies, dev controls — see [§12](#12-decisions-approved) and [§14](#14-u0-change-log)). **Only the auth/onboarding/location screens (1.1–1.2, 1.5–1.8, 2.1–2.2 + Create Profile) are built**; every other route is still a placeholder. Sections 3, 5, 6, 10 and 11 describe the original analysis; where U0 changed something it is marked "✅ U0".

- **Reference:** `reference/ecobite-82-screen-reference/` (README, `css/styles.css`, `js/navigation.js`, `js/mock-data.js`, all 82 files in `screens/group-NN/`).
- **Source-of-truth order used:** (1) product/MVP docs in this repo → (2) the 82-screen reference → (3) current architecture → (4) current design tokens.
- **Screen IDs** use the reference's `G.N` codes (`8.3` = group 8, screen 3). The reference is a Vietnamese-language UI; code, IDs and route names stay English.

## Summary

| Metric | Count |
|---|---:|
| HTML screens found (`screens/group-*/*.html`) | **82** |
| Groups | **11** |
| MVP screens mapped | **24** (24 expected) |
| AI screens (group 11) | **5** (+3 core screens that only *link* to AI: 3.5, 5.7, 6.2) |
| Screens with route file that **exists today** (✅) | 32 |
| Screens needing a **new route file** (➕) | 33 |
| Screens that are a **state/variant** of another route (↳) | 14 |
| Screens that are a **dialog/overlay component** (◻) | 3 |
| Screens whose route **mismatches** the current app (⚠) | 0 (all resolved in U0) |
| Exception / error / empty / edge-case screens | 17 (see §10) |
| Existing route files not claimed by any screen | 1 — `/create-profile` |
| Design-token differences found | itemised in §5 (colour, typography, spacing, radius, sizes) |
| Decisions | 17 — all **APPROVED** (§12) |

## 1. Key findings (original analysis, with U0 outcome)

1. **All 82 screens and 11 groups are present and match the README.** All 24 MVP screens are mapped and, after U0, all 24 have a matching route. ✅ U0
2. **Tab bar** differed (reference: Home · Orders · Cart · Account, no Search tab). ✅ U0: tabs are now exactly those four (D-14).
3. **MVP 07 = screen 3.5 (Search Results)**, reached from 3.4. ✅ U0: search is a stack flow, `/search` (3.4) → `/search/results` (3.5).
4. **Domain gaps** (cancelled/expired state, multi-restaurant cart, promo, own-box, slot capacity, categories, AI reasons). ✅ U0: implemented in types, mock data and services (D-1, D-2, D-7). Still open: `Area`, `Review`, `Notification`, `Wallet` cards, FAQ, search history types — deferred to their screens (§11).
5. **Design tokens differed** (paper `#FDFDFB` vs `#FAF8F1`, text/border/warning/danger, type scale, radii, button height). ✅ U0: tokens now equal the reference; colours are verified against the CSS by `npm run verify` (D-12).
6. **Reference inconsistencies** (login → Home vs 2.1; 8.3 vs 8.1; README naming *Be Vietnam Pro* vs CSS *Nunito*; orb on 6.1). ✅ resolved by D-8, D-3, D-12; orb on 6.1 is an unresolved reference typo (G-6) and does not affect the app.
7. **Self-pickup.** The reference shows a "Phí giao hàng: Không áp dụng / —" row on 6.4, 6.7, 7.7, 9.5. ✅ D-13: **not built** — no delivery-fee rows anywhere.
8. **Prototype-only demo panel** must not be built. ✅ D-17: replaced by a `__DEV__`-only menu that calls the existing mock services.

## 2. How to read the tables

| Marker in "RN Route" | Meaning |
|---|---|
| ✅ | Route file **exists** in `src/app` (verified by script against the filesystem, including the U0 routes) |
| ➕ | **New route** to be created in a later phase (not yet created) |
| ↳ | **State / variant** of another route, no route file of its own |
| ◻ | **Overlay / dialog / component**, not a route |
| ⚠ | **Mismatch** with an existing route — none remain after U0 |

Feature column: folders under `src/features/` (checkout, promo and summary map to `cart`; cancel, review and reorder map to `order-history`). `discovery`, `notifications` and `account` were created in U0 (D-16).

Component names in the tables are the names planned in the analysis; the shared set was built in **U1.1** (see `docs/ARCHITECTURE.md` → Shared UI). A few planned names differ: `BagRowCard` → `FoodBagCard`, `StepTimeline` → `OrderStatusTimeline`, `ListRow` / `SearchBar` / `CategoryButton` / `OtpInput` / `SwitchRow` / `MapMock` are not built yet (needed by later screens).

## 3. Screen mapping — all 82 screens

### Group 1 — Welcome & Account · *Chào mừng & Tài khoản* (9 screens)

| ID | HTML Screen | Group | MVP | RN Route | Feature | Components | Navigation |
|----|-------------|-------|-----|----------|---------|------------|------------|
| 1.1 | `01-01-splash.html` — Màn khởi động | 1 | 01 | ✅ `/` | auth | BrandMark, ScreenContainer | auto → 1.2 (new user) · 2.1 (authenticated, location not set up) · 3.1 (returning) — D-8 |
| 1.2 | `01-02-onboarding-value.html` — Giới thiệu 1 — Ăn ngon, giá tốt | 1 | 02 | ✅ `/onboarding` | auth | OnboardingSlide, PagerDots, Button, TextLink | Tiếp tục → 1.3 · Bỏ qua → 1.5 |
| 1.3 | `01-03-onboarding-impact.html` — Giới thiệu 2 — Giảm lãng phí | 1 | — | ↳ `/onboarding (step 2)` | auth | OnboardingSlide, PagerDots | Tiếp tục → 1.4 · Bỏ qua → 1.5 |
| 1.4 | `01-04-onboarding-ai.html` — Giới thiệu 3 — Trợ lý AI | 1 | — | ↳ `/onboarding (step 3)` | auth | OnboardingSlide, PagerDots, AiOrb(illustration only) | Bắt đầu → 1.5 · Bỏ qua → 1.5 |
| 1.5 | `01-05-welcome.html` — Chào mừng — chọn cách vào | 1 | — | ✅ `/welcome` | auth | Button(primary/secondary), SocialButton(Google/Apple, UI only), TextLink | Đăng nhập → 1.6 · Tạo tài khoản mới → 1.7 (guest preview button, Google/Apple buttons NOT rendered — D-9) |
| 1.6 | `01-06-login.html` — Đăng nhập | 1 | 03 | ✅ `/login` | auth | AppHeader, TextField, Checkbox, Button, TextLink | Đăng nhập → Create Profile / 2.1 / 3.1 depending on the account (D-8) · Đăng ký ngay → 1.7 · back → 1.5 |
| 1.7 | `01-07-register.html` — Đăng ký | 1 | — | ✅ `/register` | auth | AppHeader, TextField×4, Checkbox(terms), Button | Tạo tài khoản → 1.8 OTP · Đăng nhập → 1.6 |
| 1.8 | `01-08-otp-verification.html` — Xác thực OTP | 1 | — | ✅ `/otp` | auth | AppHeader, OtpInput(4), CountdownText, Button | Xác nhận → Create Profile · back → 1.7 |
| 1.9 | `01-09-reset-password.html` — Quên mật khẩu → Đặt lại | 1 | — | ➕ `/reset-password` | auth | AppHeader, TextField, PasswordRules(InfoCard), Button | Lưu mật khẩu mới → 1.6 · back → 1.6 |

<details><summary>Mock data, interactions and states — group 1</summary>

| ID | Required mock data | Important interactions / special states | AI | Exception |
|----|--------------------|------------------------------------------|----|-----------|
| 1.1 | USER (session) | Timer redirect; hide native splash after fonts load | — | — |
| 1.2 | static copy | Step 1/3 of a pager; skip jumps to 1.5 | — | — |
| 1.3 | static copy | Step 2/3 of the same pager as 1.2 | — | — |
| 1.4 | static copy | Step 3/3; primary label changes to "Bắt đầu". Marketing copy about AI only — not an AI screen | — | — |
| 1.5 | none | U1.2 ✅ built. Guest preview NOT supported in MVP (D-9); no social login exists, so those controls are omitted | — | — |
| 1.6 | USER | U1.2 ✅ built. Mock login (email or phone + password). "Quên mật khẩu?", "Tiếp tục bằng email" and social buttons are omitted (later screens / no provider) | — | — |
| 1.7 | USER | U1.2 ✅ built. "Họ và tên" moved to Create Profile (the step after OTP); collects phone, email, password + terms. Button disabled until terms ticked | — | — |
| 1.8 | USER.phone | U1.2 ✅ built. 4 boxes, 60 s resend countdown, invalid-OTP state. Demo OTP 1234 (data/mock/auth.ts); no SMS | — | — |
| 1.9 | USER.email | Two steps merged in one flow: email → OTP (1.8) → this screen | — | — |

</details>

### Group 2 — Location · *Vị trí* (4 screens)

| ID | HTML Screen | Group | MVP | RN Route | Feature | Components | Navigation |
|----|-------------|-------|-----|----------|---------|------------|------------|
| 2.1 | `02-01-location-permission.html` — Xin quyền vị trí | 2 | 04 | ✅ `/location-permission` | location | IllustrationCircle, BulletList(InfoCard), Button, TextLink | Cho phép → 2.2 · Để sau → 2.2 |
| 2.2 | `02-02-select-location.html` — Chọn khu vực | 2 | 05 | ✅ `/select-location` | location | AppHeader, InfoCard(hint), section label, ListRow×4, footnote (search field and "Dùng vị trí hiện tại" row omitted) | Tap an area → store in auth session → 3.1 Home · back → 2.1 |
| 2.3 | `02-03-current-location.html` — Vị trí hiện tại | 2 | — | ➕ `/current-location` | location | MapMock, Card(area), StatCells, Button | Dùng khu vực này → 3.1 · Đổi → 2.2 · back → 2.2 |
| 2.4 | `02-04-search-location.html` — Tìm khu vực | 2 | — | ➕ `/search-location` | location | SearchField(focused), ListRow(result), Chip(recent), Keyboard | result → 3.1 · back → 2.2 |

<details><summary>Mock data, interactions and states — group 2</summary>

| ID | Required mock data | Important interactions / special states | AI | Exception |
|----|--------------------|------------------------------------------|----|-----------|
| 2.1 | none | U1.2 ✅ built. MOCK permission: no expo-location, no GPS, no OS dialog. Both buttons continue to 2.2 | — | — |
| 2.2 | AREAS: Cầu Giấy, Đống Đa, Ba Đình, Thanh Xuân (6 nhà hàng each) | U1.2 ✅ built. Reference lists Bắc Ninh districts; the approved demo areas are the four Hà Nội districts. Loading / error states included | — | edge |
| 2.3 | USER.area, RESTAURANTS.length, nearest distance | Mock map (Views, no SDK). Copy states location ≠ delivery address | — | — |
| 2.4 | AREAS | Live filter by typed text; "Gần đây" recents | — | — |

</details>

### Group 3 — Home & Discovery · *Trang chủ & Khám phá* (10 screens)

| ID | HTML Screen | Group | MVP | RN Route | Feature | Components | Navigation |
|----|-------------|-------|-----|----------|---------|------------|------------|
| 3.1 | `03-01-home.html` — Trang chủ | 3 | 06 | ✅ `/home` | discovery | HomeHeader(brand+bell), LocationPill, HeroBanner, FakeSearchBar, CategoryButton row, SectionHeader, RestaurantCard(2-col FlatList), BottomTabBar, AiOrb | card → 4.1 · search bar → 3.4 · Xem tất cả → 3.2 · Bắc Ninh → 2.2 · orb → 11.2 · bell → 3.9 (implied) |
| 3.2 | `03-02-all-categories.html` — Tất cả danh mục | 3 | — | ➕ `/categories` | discovery | AppHeader, InfoCard(stat), CategoryRow(count), BottomTabBar, AiOrb | category → 3.3 · back → 3.1 |
| 3.3 | `03-03-category-results.html` — Kết quả theo danh mục | 3 | — | ➕ `/category/[id]` | discovery | AppHeader, Chip row, FilterButton(count badge), SortChip, HorizontalCard(FlatList), BottomTabBar, AiOrb | card → 4.1 · Bộ lọc → 3.6 · Gần nhất → 3.7 · back → 3.2 |
| 3.4 | `03-04-search.html` — Tìm kiếm — trước khi gõ | 3 | — | ✅ `/search` | discovery | SearchField(autofocus), RecentSearchList, TrendingChips, InfoCard(AI-style hint) | suggestion → 3.5 · back → 3.1 |
| 3.5 | `03-05-search-results.html` — Kết quả tìm kiếm | 3 | 07 | ✅ `/search/results` | discovery | SearchField(with query), Chip(Bộ lọc/sort/Còn túi), ResultCount, HorizontalCard, SoldOutRow, AiSuggestButton, BottomTabBar | card → 4.1 · Bộ lọc → 3.6 · sort → 3.7 · Nhờ AI gợi ý → 11.2 · back → 3.4 |
| 3.6 | `03-06-filter.html` — Bộ lọc | 3 | — | ➕ `/filter` | discovery | BottomSheet, Chip groups, ToggleRow, Button(Xem N kết quả), TextLink(Đặt lại) | Xem N kết quả → 3.5/3.3 · Đặt lại → resets selection |
| 3.7 | `03-07-sort.html` — Sắp xếp | 3 | — | ➕ `/sort` | discovery | BottomSheet, RadioRow×5 | select → closes, returns to 3.5/3.3 re-sorted |
| 3.8 | `03-08-restaurant-map.html` — Bản đồ nhà hàng | 3 | — | ➕ `/map` | discovery | MapMock, MapPin(price; amber = closing soon), SearchField(overlay), HorizontalCard(preview) | preview card → 4.1 · Xem dạng danh sách → 3.3 · back → 3.1 |
| 3.9 | `03-09-notifications.html` — Thông báo | 3 | — | ➕ `/notifications` | notifications | AppHeader, Chip tabs, NotificationRow(unread dot), SectionLabel(Hôm nay/Trước đó), BottomTabBar | "Túi đã sẵn sàng" → 8.2 · "Cứu 12 kg CO₂" → 10.3 · back → 3.1 |
| 3.10 | `03-10-saved-restaurants.html` — Nhà hàng đã lưu | 3 | — | ➕ `/saved` | discovery | AppHeader, StatsRow, HorizontalCard(available / sold-out + "Bật nhắc"), BottomTabBar, AiOrb | card → 4.1 · back → 10.1 |

<details><summary>Mock data, interactions and states — group 3</summary>

| ID | Required mock data | Important interactions / special states | AI | Exception |
|----|--------------------|------------------------------------------|----|-----------|
| 3.1 | RESTAURANTS, CATEGORIES, FOOD_BAGS(price/discount) | Discount badge only when bag discount ≥ threshold; unread red dot on bell; cart badge on tab | core+AI-entry | — |
| 3.2 | CATEGORIES(count) | "Ask AI" hint pointing at orb | AI-entry | — |
| 3.3 | RESTAURANTS filtered by category | Filter count badge; result count line; sorted-by caption | AI-entry | — |
| 3.4 | SEARCH_HISTORY, TRENDING (new) | Empty-query state (this screen); "Xoá hết" clears history | — | — |
| 3.5 | RESTAURANTS + FOOD_BAGS matched by keyword | Shows restaurants AND bags; sold-out row with reminder; no-result state only described in note, NOT designed (gap G-1) | AI-entry | edge |
| 3.6 | FILTER_OPTIONS (price, distance, pickup window, flags) | Sheet over dimmed screen; live result count in button | — | — |
| 3.7 | SORT_OPTIONS | Single select; closes immediately | — | — |
| 3.8 | RESTAURANTS(location), FOOD_BAGS(window) | Amber pin = bag expiring soon. Mock map, no SDK | — | — |
| 3.9 | NOTIFICATIONS (new: type order/promo/impact, unread) | Mark all read; filter by type | — | — |
| 3.10 | USER.savedRestaurants, RESTAURANTS | Sold-out variant with reminder toggle; empty state only described in note (gap G-1) | AI-entry | empty |

</details>

### Group 4 — Restaurant · *Nhà hàng* (7 screens)

| ID | HTML Screen | Group | MVP | RN Route | Feature | Components | Navigation |
|----|-------------|-------|-----|----------|---------|------------|------------|
| 4.1 | `04-01-restaurant-detail.html` — Chi tiết nhà hàng | 4 | 08 | ✅ `/restaurant/[id]` | restaurant | Cover(FoodArt), HeartButton, StatusBadge, RatingRow, InfoCard(pickup window + walk time), AddressRow, Button(Chỉ đường), SectionHeader, HorizontalCard(bag), BottomActionBar | bag → 5.1 · Chỉ đường → 4.6 · reviews → 4.3 · address → 4.4 · Xem tất cả → 4.2 · back → 3.1. File must become restaurant/[id]/index.tsx |
| 4.2 | `04-02-restaurant-bags.html` — Menu túi của quán | 4 | — | ➕ `/restaurant/[id]/bags` | restaurant | AppHeader, InfoCard, SectionLabel(pickup window group), HorizontalCard(bag), SoldOutRow | bag → 5.1 · back → 4.1 |
| 4.3 | `04-03-restaurant-reviews.html` — Đánh giá nhà hàng | 4 | — | ➕ `/restaurant/[id]/reviews` | restaurant | AppHeader, RatingSummary(histogram), Chip(filter), ReviewCard | back → 4.1 |
| 4.4 | `04-04-restaurant-info.html` — Thông tin nhà hàng | 4 | — | ➕ `/restaurant/[id]/info` | restaurant | AppHeader, Card(address), Button×2(Chỉ đường/Gọi quán), KeyValueRows(hours), BulletList(commitments) | Chỉ đường → 4.6 · Gọi quán → Linking tel: · back → 4.1 |
| 4.5 | `04-05-photo-gallery.html` — Thư viện ảnh | 4 | — | ➕ `/restaurant/[id]/gallery` | restaurant | FullscreenPager, Counter("3 / 12"), Caption | back → 4.1 |
| 4.6 | `04-06-directions.html` — Chỉ đường tới quán | 4 | — | ➕ `/restaurant/[id]/directions` | restaurant | MapMock, Card(stats: km/min/deadline), Button(Gọi quán), Button(Mở Google Maps) | Mở Google Maps → Linking.openURL · back → 4.1 |
| 4.7 | `04-07-report-restaurant.html` — Báo cáo nhà hàng | 4 | — | ➕ `/restaurant/[id]/report` | restaurant | AppHeader, RadioRow list, TextField(multiline), PhotoAdd(up to 3), BottomActionBar | Gửi báo cáo → 4.1 · back → 4.1 (also opened from 8.6, 9.5) |

<details><summary>Mock data, interactions and states — group 4</summary>

| ID | Required mock data | Important interactions / special states | AI | Exception |
|----|--------------------|------------------------------------------|----|-----------|
| 4.1 | RESTAURANTS, FOOD_BAGS(by restaurant), USER.savedRestaurants | Heart toggles saved; "Còn 1" badge on nearly sold-out bag | — | — |
| 4.2 | FOOD_BAGS grouped by pickupWindow | Sold-out rows dimmed & not tappable; "Sắp hết giờ" badge | — | edge |
| 4.3 | REVIEWS (new: author, ago, text, bagName) | Only customers who picked up can review (so each review shows bag name) | — | — |
| 4.4 | RESTAURANTS(address, phone), PICKUP_HOURS (new) | Hours are PICKUP hours, not opening hours | — | — |
| 4.5 | RESTAURANT_PHOTOS (new; placeholders) | Swipe between photos; caption + date | — | — |
| 4.6 | RESTAURANTS(location, walkMinutes) | No real map SDK; external maps via Linking (expo-linking already installed) | — | — |
| 4.7 | REPORT_REASONS (new) | Report is anonymous to the restaurant; photo picker = UI only (no picker dependency yet) | — | edge |

</details>

### Group 5 — Food Bag · *Túi đồ ăn* (7 screens)

| ID | HTML Screen | Group | MVP | RN Route | Feature | Components | Navigation |
|----|-------------|-------|-----|----------|---------|------------|------------|
| 5.1 | `05-01-food-bag-detail.html` — Chi tiết túi | 5 | 09 | ✅ `/food-bag/[id]` | food-bag | BagHero(FoodArt), StatusBadge(Chỉ còn N túi), PriceBlock(-x%), CountdownText, PickupWindowRow, ContentsList, ImpactPair, ListRow(allergens), BottomActionBar(total + Button) | Thêm vào giỏ hàng → 5.6 · allergens → 5.4 · contents → 5.2 · CO₂ → 5.5 · pickup row → 5.3 · back → 4.1 |
| 5.2 | `05-02-bag-contents.html` — Túi hôm nay gồm gì | 5 | — | ➕ `/food-bag/[id]/contents` | food-bag | AppHeader, Card(item rows w/ weight), InfoCard(note), BottomActionBar | Thêm vào giỏ hàng → 5.6 · back → 5.1 |
| 5.3 | `05-03-select-pickup-time.html` — Chọn khung giờ nhận | 5 | 13 | ✅ `/order/pickup-time` | pickup | AppHeader, Card(restaurant+address+walk), SlotList(radio, capacity), WarningNote(late policy), BottomActionBar(Xác nhận <slot>) | Xác nhận → 6.7 · back → 6.4. Same screen reused as 6.6 (mode=change). Slot is stored per restaurant on the Cart |
| 5.4 | `05-04-allergens.html` — Nguyên liệu & dị ứng | 5 | — | ➕ `/food-bag/[id]/allergens` | food-bag | AppHeader, WarningBanner(amber), AllergenRow(emoji, Có/Không/Có thể), InfoCard(disclaimer) | back → 5.1 |
| 5.5 | `05-05-bag-impact.html` — Tác động của túi này | 5 | — | ➕ `/food-bag/[id]/impact` | food-bag | AppHeader, BigStat(CO₂), StatTriplet, InfoCard(formula+source), BottomActionBar | Thêm vào giỏ hàng → 5.6 · back → 5.1 |
| 5.6 | `05-06-add-to-cart.html` — Chọn số lượng | 5 | 10 | ✅ `/food-bag/[id]/add-to-cart` | cart | BottomSheet, BagThumb, PriceBlock, QuantityStepper(max = bag.left), Checkbox(own box −2.000đ/túi), Button(Thêm N túi · price) | Thêm N túi → 6.1 |
| 5.7 | `05-07-bag-unavailable.html` — Túi đã hết / ngoài giờ | 5 | — | ↳ `/food-bag/[id] (sold-out state)` | food-bag | ResultState(illustration), Toggle(Nhắc tôi khi có túi mới), HorizontalCard(alternatives), AiSuggestButton, BottomActionBar | alternative → 4.1 · Nhờ AI tìm túi thay thế → 11.2 · back → 4.1 |

<details><summary>Mock data, interactions and states — group 5</summary>

| ID | Required mock data | Important interactions / special states | AI | Exception |
|----|--------------------|------------------------------------------|----|-----------|
| 5.1 | FOOD_BAGS(contents, allergens, left, pickupWindow), CONFIG.impactPerBag | Live countdown "Còn 2 giờ 14 phút để đặt"; renders 5.7 when sold out/out of hours | — | — |
| 5.2 | FOOD_BAGS.contents (needs quantities + updatedAt) | Fallback row "Bất ngờ cuối ngày" if restaurant has not updated (before 16:00 rule) | — | — |
| 5.3 | PICKUP_SLOTS(label, left, selected) | Full slots ("Đã hết chỗ") disabled; button label reflects selected slot; date tabs Hôm nay/Mai (6.6) | — | edge |
| 5.4 | FOOD_BAGS.allergens + ingredients text (new) | Yes/No/Maybe badge colours; restaurant-declared disclaimer | — | — |
| 5.5 | CONFIG.impactPerBag | Formula 1 bag ≈ 1.2 kg food ≈ 2.5 kg CO₂ ≈ 340 L water | — | — |
| 5.6 | FOOD_BAGS(left, price) | Presented as transparent modal sheet. Button price updates live. NOTE: prototype clamps qty at 5 in JS but README says clamp to bag.left | — | — |
| 5.7 | FOOD_BAGS(left=0), alternatives by distance | "Only dead end in purchase flow" — must always offer next steps | AI-entry | error |

</details>

### Group 6 — Cart & Order · *Giỏ hàng & Đặt đơn* (9 screens)

| ID | HTML Screen | Group | MVP | RN Route | Feature | Components | Navigation |
|----|-------------|-------|-----|----------|---------|------------|------------|
| 6.1 | `06-01-cart.html` — Giỏ hàng | 6 | 11 | ✅ `/cart` | cart | AppHeader, RestaurantGroup, CartItemRow(QuantityStepper, swipe-to-delete), WarningNote(2 QR), PriceRow, BottomActionBar, BottomTabBar | Tiếp tục → 6.4 · qty→0 / swipe → 6.3 · back → 3.1 |
| 6.2 | `06-02-cart-empty.html` — Giỏ hàng trống | 6 | — | ↳ `/cart (empty state)` | cart | EmptyState(circle icon), Button×2, BottomTabBar | Khám phá nhà hàng → 3.1 · Hỏi AI → 11.2 |
| 6.3 | `06-03-remove-item.html` — Xoá túi khỏi giỏ | 6 | — | ◻ `(dialog on /cart)` | cart | ConfirmDialog(destructive) | Xoá túi → back to 6.1 without item · Giữ lại → 6.1 |
| 6.4 | `06-04-checkout.html` — Xác nhận đơn — nhận tại quán | 6 | 12 | ✅ `/order/checkout` | cart | AppHeader, InfoCard("Chỉ nhận hàng tại quán"), PickupPointCard, TimeRow(Đổi), OrderItemRow, PromoRow, PriceRow(subtotal, promo, own-box, total), BottomActionBar | Chọn cách thanh toán → 6.8 · Đổi → 5.3 · Thêm mã → 6.5 · Chỉ đường → 4.6 · back → 6.1 |
| 6.5 | `06-05-promo-code.html` — Mã giảm giá | 6 | — | ➕ `/order/promo` | cart | AppHeader, TextField+Button(Dùng), PromoCard(usable/disabled + reason), BottomActionBar(Áp dụng · tiết kiệm x) | Áp dụng → 6.4 · back → 6.4 (also from Account 10.1) |
| 6.6 | `06-06-change-pickup-time.html` — Đổi giờ tới lấy | 6 | — | ↳ `/order/pickup-time?mode=change` | pickup | (same as 5.3) + date Chip tabs, WarningNote(change may be refused) | Lưu giờ mới → 6.4 · back → 6.4 |
| 6.7 | `06-07-order-summary.html` — Tóm tắt đơn hàng | 6 | 14 | ✅ `/order/summary` | cart | AppHeader, PickupPointCard, OrderItemRow, PriceRow(subtotal, promo, own-box, total), ImpactInline, BottomActionBar(Đặt đơn · total) | Đặt đơn → 6.9 → 7.1 · back → 6.4 |
| 6.8 | `06-08-payment-method.html` — Chọn cách thanh toán | 6 | — | ➕ `/order/payment-method` | payment | AppHeader, MethodCard(radio; QR "Khuyên dùng"), MethodCard(disabled: e-wallet/card/cash), PriceRow(total), BottomActionBar | Tiếp tục thanh toán → 6.7 · back → 6.4 |
| 6.9 | `06-09-creating-order.html` — Đang tạo đơn | 6 | — | ↳ `/order/summary (creating overlay)` | cart | FullscreenLoader, ChecklistRow×3 | auto → 7.1 (1.9 s) |

<details><summary>Mock data, interactions and states — group 6</summary>

| ID | Required mock data | Important interactions / special states | AI | Exception |
|----|--------------------|------------------------------------------|----|-----------|
| 6.1 | Cart(items grouped by restaurant), FOOD_BAGS | Multi-restaurant cart (D-1): grouped per restaurant, each group becomes its own Order with its own pickup QR. Item may show "Chưa chọn giờ" | — | — |
| 6.2 | none (43 bags count) | Never blank: home + AI exits | AI-entry | empty |
| 6.3 | Cart item | Triggered by qty→0 or swipe-left | — | dialog |
| 6.4 | Cart, PROMOS, restaurants(address) | Goes to 6.8 payment method (D-4, included; QR only enabled) then 6.7. No delivery-fee row (D-13) | — | — |
| 6.5 | PROMOS(code,minTotal,expires,usable) | Unusable codes dimmed with reason ("còn thiếu 64.000đ") | — | edge |
| 6.6 | PICKUP_SLOTS | Variant of 5.3 for changing an already chosen slot | — | — |
| 6.7 | Cart, PROMOS, CONFIG.impactPerBag | Creates order (status placed) on tap. Total here (76.000đ) differs from 6.4 (86.000đ) because promo applied in between (gap G-5) | — | — |
| 6.8 | PAYMENT_METHODS (new) | QR bank transfer is the only ENABLED method; e-wallet, card and cash are shown disabled with "Sắp có" (D-4, D-10). Carries BẢN DEMO note | — | — |
| 6.9 | api.createOrder (pending) | Transition while order is created & bag reserved; failure ("bag just sold") described but not designed (gap G-1) | — | error |

</details>

### Group 7 — Payment · *Thanh toán* (7 screens)

| ID | HTML Screen | Group | MVP | RN Route | Feature | Components | Navigation |
|----|-------------|-------|-----|----------|---------|------------|------------|
| 7.1 | `07-01-qr-payment.html` — QR chuyển khoản | 7 | 15 | ✅ `/order/[orderId]/payment` | payment | AppHeader, DemoBadge(BẢN DEMO), PaymentQrCard(black modules, white card), KeyValueRows(bank/holder/account/note), HoldTimer(InfoCard), Button(Sao chép số tài khoản) | auto → 7.2 (~4 s) → 7.3 (success) / 7.4 (failed) / 7.5 (expired) · back → 6.7 |
| 7.2 | `07-02-waiting-payment.html` — Đang chờ nhận tiền | 7 | — | ↳ `/order/[orderId]/payment (waiting phase)` | payment | Spinner, StepChecklist, InfoCard, Button(Tôi cần trợ giúp), TextLink(Huỷ đơn và hoàn tiền) | auto → 7.3 · Tôi cần trợ giúp → 10.7 |
| 7.3 | `07-03-payment-success.html` — Thanh toán thành công | 7 | 16 | ✅ `/order/[orderId]/payment-success` | payment | SuccessHero, Card(order id/paid/method/time), InfoCard(pickup point), ImpactInline, Button×2 | Xem mã nhận hàng → 8.3 · Về trang chủ → 3.1 |
| 7.4 | `07-04-payment-failed.html` — Thanh toán thất bại | 7 | — | ↳ `/order/[orderId]/payment (failed phase)` | payment | ResultState(error), Card(order/amount/reason), InfoCard(hold 04:58), Button×2, TextLink | Thử thanh toán lại → 7.1 · Đổi cách thanh toán → 6.8 · Huỷ đơn → 8.8 |
| 7.5 | `07-05-payment-expired.html` — Hết hạn giữ chỗ | 7 | — | ↳ `/order/[orderId]/payment (expired phase)` | payment | ResultState(expired), Card(order/status/charged 0đ), HorizontalCard(bag still available), Button×2 | Đặt lại túi này → 5.1 · Xem quán khác → 3.1 |
| 7.6 | `07-06-wallet-cards.html` — Ví & thẻ đã lưu | 7 | — | ➕ `/account/wallet` | account | AppHeader, DemoBadge, WalletBalanceCard, CardRow(default), Button(Thêm thẻ/ví) | back → 10.1 |
| 7.7 | `07-07-invoice.html` — Hoá đơn điện tử | 7 | — | ➕ `/order/[orderId]/invoice` | order-history | AppHeader, InvoiceCard, PriceRow, Button(Tải bản PDF) | back → 9.5 |

<details><summary>Mock data, interactions and states — group 7</summary>

| ID | Required mock data | Important interactions / special states | AI | Exception |
|----|--------------------|------------------------------------------|----|-----------|
| 7.1 | PaymentSession(qr, amount, expiresAt), DEMO_PAYMENT | No "I have paid" button by design. Countdown 09:42. Copy account number → clipboard (needs expo-clipboard; not installed) | — | — |
| 7.2 | usePaymentStatus poll (3 s in reference; 1.5 s in code) | Phase "waiting" of the single payment route (D-6). Poll count shown; help button after 2 min | — | — |
| 7.3 | Order(status paid) | Auto-shown on PAID. Goes straight to 8.3 Pickup QR (D-3); 8.1 is not inserted before it | — | — |
| 7.4 | PaymentSession(status failed) | Phase "failed" of the single payment route (D-6). Order stays placed; 5-minute retry window (retryUntil) | — | error |
| 7.5 | PaymentSession(status expired), Order(cancelled) | Phase "expired" of the single payment route (D-6). Order becomes EXPIRED (terminal, outside the main sequence — D-2) | — | error |
| 7.6 | WALLET (new: balance, cards) | Entirely demo data; "EcoBite does not store full card numbers". Not in MVP payment flow | — | — |
| 7.7 | Order + USER | PDF export = UI only (no file/print dependency) | — | — |

</details>

### Group 8 — Pickup at Restaurant · *Nhận hàng tại quán* (8 screens)

| ID | HTML Screen | Group | MVP | RN Route | Feature | Components | Navigation |
|----|-------------|-------|-----|----------|---------|------------|------------|
| 8.1 | `08-01-pickup-instructions.html` — Đặt hàng thành công | 8 | 18 | ✅ `/order/[orderId]/pickup-instructions` | pickup | AppHeader, SuccessHero, DeadlineCountdown, PickupPointCard(Chỉ đường/Gọi quán), OrderLine, BottomActionBar | Mở mã nhận hàng → 8.3 · Theo dõi trạng thái → 8.2 · Chỉ đường → 8.5 |
| 8.2 | `08-02-pickup-order-status.html` — Trạng thái đơn nhận tại quán | 8 | — | ✅ `/order/[orderId]/status` | pickup | AppHeader, StatusBanner, DeadlineTimer, StepTimeline(6 steps, hollow ring = current), PickupPointCard, BottomActionBar(Đưa mã cho nhân viên quét) | Chỉ đường → 8.5 · action → 8.3 · back → 9.1 |
| 8.3 | `08-03-pickup-qr-code.html` — Mã QR nhận hàng | 8 | 17 | ✅ `/order/[orderId]/pickup-qr` | pickup | AppHeader, PickupQrCard(green modules, mint gradient), OrderCodeText, KeyValueRows, WarningNote(manual entry), brightness hint | Máy quán hỏng → 10.7 · back → 8.2 · (staff scan → 8.6) |
| 8.4 | `08-04-order-ready.html` — Thông báo sẵn sàng nhận | 8 | 19 | ✅ `/order/[orderId]/ready` | pickup | NotificationBanner(lock-screen style), DeadlineTimer | tap → 8.3 |
| 8.5 | `08-05-arriving-at-restaurant.html` — Đang trên đường tới quán | 8 | 20 | ✅ `/order/[orderId]/arrived` | pickup | MapMock, HeaderTimer, PickupPointCard(distance/walk), Button(Mở mã nhận hàng) | Mở mã nhận hàng → 8.3 · back → 8.2 |
| 8.6 | `08-06-qr-verified.html` — QR đã được xác nhận | 8 | 21 | ✅ `/order/[orderId]/verified` | pickup | SuccessHero, Card(order/time/staff), InfoCard(own box saved), Button×2 | Tôi đã nhận đủ túi → 8.7 · Có vấn đề với túi này → 4.7 |
| 8.7 | `08-07-order-completed.html` — Đã nhận hàng tại quán | 8 | 22 | ✅ `/order/[orderId]/completed` | pickup | SuccessHero, ImpactPair, RatingPrompt(card), Button×2, BottomTabBar | Chạm để đánh giá → 9.7 · Đặt lại → 9.6 · Về trang chủ → 3.1 |
| 8.8 | `08-08-cancel-order.html` — Huỷ đơn | 8 | — | ➕ `/order/[orderId]/cancel` | order-history | AppHeader, OrderMiniCard, RadioRow(reasons), InfoCard(refund policy), BottomActionBar(Xác nhận huỷ · hoàn x, Giữ đơn hàng) | Xác nhận huỷ → 9.4 · Giữ đơn hàng → 8.2 · back → 8.2 |

<details><summary>Mock data, interactions and states — group 8</summary>

| ID | Required mock data | Important interactions / special states | AI | Exception |
|----|--------------------|------------------------------------------|----|-----------|
| 8.1 | Order, RESTAURANTS, PickupLocation | Emphasises customer MUST come to the restaurant; live countdown | — | — |
| 8.2 | Order.statusHistory + ORDER_STATUS_SEQUENCE | THE 6-step timeline; no driver steps. Time stamps per reached step; current step shows hint text | — | — |
| 8.3 | PickupQr { token (opaque), orderCode } — the QR encodes the token, orderCode shown beneath it (D-7) | Raise screen brightness later (expo-brightness not installed). Manual fallback: read orderCode aloud (D-7) | — | — |
| 8.4 | Order(status ready) | Reference draws a PUSH notification. In-app: modal/banner screen. Real push is out of scope | — | — |
| 8.5 | Order, RESTAURANTS(location) | Order-linked directions with deadline countdown; no real GPS tracking | — | — |
| 8.6 | Order(status qr_verified, pickupQr.verifiedAt) | Appears on customer device once staff scan succeeds (poll/push in real app) | — | — |
| 8.7 | Order(status picked_up), CONFIG.impactPerBag | Only here (and 9.5) the review flow opens | — | — |
| 8.8 | Order, CANCEL_REASONS (new), refund policy | Allowed only while placed/paid (before preparing). Result state is CANCELLED, outside the main sequence (D-2). Button label shows refund amount | — | edge |

</details>

### Group 9 — Order History · *Lịch sử đơn* (7 screens)

| ID | HTML Screen | Group | MVP | RN Route | Feature | Components | Navigation |
|----|-------------|-------|-----|----------|---------|------------|------------|
| 9.1 | `09-01-order-history.html` — Danh sách đơn hàng | 9 | 23 | ✅ `/orders` | order-history | AppHeader, SegmentTabs(Đang xử lý N / Đã xong N / Đã huỷ N), ActiveOrderCard(Mở QR), OrderCard, BottomTabBar, AiOrb | card → 9.5 · Mở QR → 8.3 · segments → 9.2/9.3/9.4 |
| 9.2 | `09-02-orders-active.html` — Đơn đang xử lý | 9 | — | ↳ `/orders?tab=active` | order-history | SegmentTabs, ActiveOrderCard(deadline timer, Chỉ đường, Mã nhận hàng) | Mã nhận hàng → 8.3 · Chỉ đường → 8.5 · back → 9.1 |
| 9.3 | `09-03-orders-completed.html` — Đơn đã hoàn tất | 9 | — | ↳ `/orders?tab=completed` | order-history | SegmentTabs, InfoCard(total impact), OrderCard(picked-up, "Đã đánh giá") | card → 9.5 · back → 9.1 |
| 9.4 | `09-04-orders-cancelled.html` — Đơn đã huỷ | 9 | — | ↳ `/orders?tab=cancelled` | order-history | SegmentTabs, OrderCard(cancelled by user / hold expired), RefundLine | back → 9.1 |
| 9.5 | `09-05-order-detail.html` — Chi tiết đơn cũ | 9 | 24 | ✅ `/order/[orderId]` | order-history | AppHeader, StatusBadge, KeyValueRows, PriceRow, Button(Xem hoá đơn), Button(Đặt lại), TextLink(Báo cáo vấn đề) | Xem hoá đơn → 7.7 · Đặt lại → 9.6 · Báo cáo → 4.7 · restaurant name → 4.1 · back → 9.1 |
| 9.6 | `09-06-reorder.html` — Đặt lại nhanh | 9 | — | ➕ `/order/[orderId]/reorder` | order-history | BottomSheet, BagRow, SlotChip row, PriceRow, Button(Thêm vào giỏ) | Thêm vào giỏ → 6.1 |
| 9.7 | `09-07-write-review.html` — Viết đánh giá | 9 | — | ➕ `/order/[orderId]/review` | order-history | AppHeader, StarRating, Chip(tags multi-select), TextField(multiline), PhotoAdd, BottomActionBar | Gửi đánh giá → 9.5 · back → 9.5 |

<details><summary>Mock data, interactions and states — group 9</summary>

| ID | Required mock data | Important interactions / special states | AI | Exception |
|----|--------------------|------------------------------------------|----|-----------|
| 9.1 | ORDERS | Tab #2 in reference bar. Summary view of 9.2–9.4 | AI-entry | — |
| 9.2 | ORDERS(status ≠ picked_up/cancelled) | Sorted by nearest pickup deadline | — | — |
| 9.3 | ORDERS(picked_up), impact totals | Total saved food/CO₂ links conceptually to 10.3 | — | — |
| 9.4 | ORDERS(cancelled) | Shows who cancelled and refund state. Data: status cancelled / expired (D-2) | — | edge |
| 9.5 | ORDERS(one) | Completed-order detail (D-5). The status timeline of an ACTIVE order is 8.2 at /order/[orderId]/status | — | — |
| 9.6 | FOOD_BAGS(availability), PICKUP_SLOTS | Checks availability first; cannot reorder sold-out bag | — | edge |
| 9.7 | REVIEW_TAGS (new) | Unlocked only when status = picked_up (anti-fake-review rule) | — | — |

</details>

### Group 10 — Account · *Tài khoản* (9 screens)

| ID | HTML Screen | Group | MVP | RN Route | Feature | Components | Navigation |
|----|-------------|-------|-----|----------|---------|------------|------------|
| 10.1 | `10-01-profile.html` — Hồ sơ | 10 | — | ✅ `/account` | account | AppHeader, ProfileHeader(avatar), ImpactCard, ListRow(badge/value)×n, BottomTabBar, AiOrb | Sửa → 10.2 · Thành tích → 10.3 · Đơn hàng → 9.1 · Đã lưu → 3.10 · Ví → 7.6 · Mã giảm giá → 6.5 · Thông báo → 10.4 · Cài đặt → 10.5 · Trợ giúp → 10.6 · Điều khoản → 10.8 · Đăng xuất → 10.9 |
| 10.2 | `10-02-edit-profile.html` — Sửa thông tin cá nhân | 10 | — | ➕ `/account/edit` | account | AppHeader, AvatarEditor, TextField×n, VerifiedBadge, Button | Lưu thay đổi → 10.1 · phone change → 1.8 (OTP) · back → 10.1 |
| 10.3 | `10-03-my-impact.html` — Thành tích của bạn | 10 | — | ➕ `/account/impact` | account | AppHeader, BigStat(CO₂), StatTriplet, BarChart(6 months, custom Views), BadgeCard(earned / in progress), BottomTabBar | back → 10.1 |
| 10.4 | `10-04-notification-settings.html` — Cài đặt thông báo | 10 | — | ➕ `/account/notification-settings` | account | AppHeader, SwitchRow groups, InfoCard(order notifications should stay on) | back → 10.1 |
| 10.5 | `10-05-settings.html` — Cài đặt chung | 10 | — | ➕ `/account/settings` | account | AppHeader, ListRow(value), SwitchRow, DestructiveRow(Xoá lịch sử/Xoá tài khoản) | back → 10.1 |
| 10.6 | `10-06-help.html` — Trợ giúp | 10 | — | ➕ `/account/help` | account | AppHeader, SearchField, InfoCard(how it works), AccordionRow(FAQ), Button(Liên hệ hỗ trợ) | Liên hệ hỗ trợ → 10.7 · back → 10.1 |
| 10.7 | `10-07-contact-support.html` — Liên hệ hỗ trợ | 10 | — | ➕ `/account/support` | account | AppHeader, OrderPickerCard(prefilled, Đổi), Select(category), TextField(multiline), PhotoAdd, ContactRows, BottomActionBar | Gửi yêu cầu → 10.6 · back → 10.6 (also from 7.2, 8.3) |
| 10.8 | `10-08-terms-privacy.html` — Điều khoản & bảo mật | 10 | — | ➕ `/account/legal` | account | AppHeader, Chip tabs(Điều khoản/Bảo mật), LegalSection(text) | back → 10.1 |
| 10.9 | `10-09-logout.html` — Đăng xuất | 10 | — | ◻ `(dialog on /account)` | account | ConfirmDialog | Đăng xuất → 1.5 · Ở lại → 10.1 |

<details><summary>Mock data, interactions and states — group 10</summary>

| ID | Required mock data | Important interactions / special states | AI | Exception |
|----|--------------------|------------------------------------------|----|-----------|
| 10.1 | USER(impact, savedRestaurants, walletBalance), PROMOS.length | Tab #4 (Account). No tab exists for it today | AI-entry | — |
| 10.2 | USER | Changing phone re-triggers OTP | — | — |
| 10.3 | USER.impact, BADGES (new), monthly history (new) | Bar chart drawn with Views (no chart dependency) | — | — |
| 10.4 | SETTINGS (new) | Order notifications separate from promo notifications | — | — |
| 10.5 | SETTINGS | Language, theme ("Theo hệ thống" — no dark palette defined, D-11 ✅), location permission | — | — |
| 10.6 | FAQ (new) | FIRST FAQ must be "does EcoBite deliver?" (answer: no) | — | — |
| 10.7 | ORDERS(current problem order) | Order id prefilled when opened from an order screen | — | — |
| 10.8 | LEGAL_TEXT (static) | States EcoBite is an intermediary and NOT a delivery service | — | — |
| 10.9 | USER, active orders count | Reminds that active orders are kept | — | dialog |

</details>

### Group 11 — AI Assistant · *Trợ lý AI* (5 screens)

| ID | HTML Screen | Group | MVP | RN Route | Feature | Components | Navigation |
|----|-------------|-------|-----|----------|---------|------------|------------|
| 11.1 | `11-01-ai-orb.html` — Quả cầu AI nổi trên màn | 11 | — | ◻ `(overlay in tab layout)` | ai | AiOrb(draggable, 60 px, 6-layer gradient), QuickPromptPopover(3 chips) | orb tap → 11.2 · quick chip → 11.2/11.3 |
| 11.2 | `11-02-ai-welcome.html` — Mở trợ lý AI | 11 | — | ✅ `/ai` | ai | AiHeader(orb+status), AiWelcome, QuickPromptChip×4, ChatInput | prompt → 11.3 · "Hỏi gì cũng được" → 11.5 · also entered from 3.5, 5.7, 6.2 |
| 11.3 | `11-03-ai-typing.html` — Đang nhập câu hỏi | 11 | — | ↳ `/ai (typing state)` | ai | AiHeader, ChatBubble(ai/user), ChatInput(focused), Keyboard | Gửi → 11.4 · "EcoBite AI" header → 11.5 |
| 11.4 | `11-04-ai-suggestions.html` — AI trả lời kèm lý do | 11 | — | ↳ `/ai (answer state)` | ai | ChatBubble, AiSuggestionCard(bag + reasons list), Chip(follow-ups), DisclaimerNote, ChatInput | Xem chi tiết món → 5.1 (by id) · follow-up chip → 11.4 · back → 11.5 |
| 11.5 | `11-05-ai-history.html` — Lịch sử hội thoại AI | 11 | — | ✅ `/ai/history` | ai | AppHeader, Button(Hội thoại mới), ConversationRow, InfoCard("Bản MVP · chưa nối AI thật") | Hội thoại mới → 11.2 · row → 11.4 · back → 11.4 |

<details><summary>Mock data, interactions and states — group 11</summary>

| ID | Required mock data | Important interactions / special states | AI | Exception |
|----|--------------------|------------------------------------------|----|-----------|
| 11.1 | none (AI module) | Floats over 3.1/3.2/3.3/3.10/9.1/10.1 (README also lists 6.1, but 6.1 HTML has no orb — gap G-6). Long-press expands 3 prompts | AI | — |
| 11.2 | AI_MOCK.greeting/quickPrompts | Empty-thread state of the chat screen | AI | — |
| 11.3 | AI_MOCK.sampleQuestion | Keyboard open, user message composing | AI | — |
| 11.4 | AI_MOCK.sampleAnswer(bagId, reasons[]), FOOD_BAGS(by id) | Each suggestion MUST show reasons ("Vì sao mình gợi ý…"). Links to core only via router by id | AI | — |
| 11.5 | AI_HISTORY (new, data/ai) | Clear all ("Xoá hết") for privacy | AI | — |

</details>

## 4. 24-Screen MVP mapping

Verified against the reference's `MVP_FLOW` in `js/navigation.js` and against the routes actually on disk.

| MVP | Flow name | Ref screen | HTML file | RN route | Route today | Feature | Result |
|----:|-----------|-----------|-----------|----------|-------------|---------|--------|
| 01 | Splash | 1.1 Màn khởi động | `01-01-splash.html` | `/` | ✅ exists | auth | ✅ |
| 02 | Onboarding | 1.2 Giới thiệu 1 — Ăn ngon, giá tốt | `01-02-onboarding-value.html` | `/onboarding` | ✅ exists | auth | ✅ |
| 03 | Login / Register | 1.6 Đăng nhập | `01-06-login.html` | `/login` | ✅ exists | auth | ✅ |
| 04 | Location Permission | 2.1 Xin quyền vị trí | `02-01-location-permission.html` | `/location-permission` | ✅ exists | location | ✅ |
| 05 | Select Location | 2.2 Chọn khu vực | `02-02-select-location.html` | `/select-location` | ✅ exists | location | ✅ |
| 06 | Home | 3.1 Trang chủ | `03-01-home.html` | `/home` | ✅ exists | discovery | ✅ |
| 07 | Search / Browse Restaurants | 3.5 Kết quả tìm kiếm | `03-05-search-results.html` | `/search/results` | ✅ exists | discovery | ✅ |
| 08 | Restaurant Detail | 4.1 Chi tiết nhà hàng | `04-01-restaurant-detail.html` | `/restaurant/[id]` | ✅ exists | restaurant | ✅ |
| 09 | Food Bag Detail | 5.1 Chi tiết túi | `05-01-food-bag-detail.html` | `/food-bag/[id]` | ✅ exists | food-bag | ✅ |
| 10 | Add to Cart | 5.6 Chọn số lượng | `05-06-add-to-cart.html` | `/food-bag/[id]/add-to-cart` | ✅ exists | cart | ✅ |
| 11 | Cart | 6.1 Giỏ hàng | `06-01-cart.html` | `/cart` | ✅ exists | cart | ✅ |
| 12 | Checkout | 6.4 Xác nhận đơn — nhận tại quán | `06-04-checkout.html` | `/order/checkout` | ✅ exists | cart | ✅ |
| 13 | Select Pickup Time | 5.3 Chọn khung giờ nhận | `05-03-select-pickup-time.html` | `/order/pickup-time` | ✅ exists | pickup | ✅ |
| 14 | Order Summary | 6.7 Tóm tắt đơn hàng | `06-07-order-summary.html` | `/order/summary` | ✅ exists | cart | ✅ |
| 15 | QR Payment | 7.1 QR chuyển khoản | `07-01-qr-payment.html` | `/order/[orderId]/payment` | ✅ exists | payment | ✅ |
| 16 | Payment Success | 7.3 Thanh toán thành công | `07-03-payment-success.html` | `/order/[orderId]/payment-success` | ✅ exists | payment | ✅ |
| 17 | Pickup QR Code | 8.3 Mã QR nhận hàng | `08-03-pickup-qr-code.html` | `/order/[orderId]/pickup-qr` | ✅ exists | pickup | ✅ |
| 18 | Pickup Instructions | 8.1 Đặt hàng thành công | `08-01-pickup-instructions.html` | `/order/[orderId]/pickup-instructions` | ✅ exists | pickup | ✅ |
| 19 | Order Ready | 8.4 Thông báo sẵn sàng nhận | `08-04-order-ready.html` | `/order/[orderId]/ready` | ✅ exists | pickup | ✅ |
| 20 | Customer Arrives at Restaurant | 8.5 Đang trên đường tới quán | `08-05-arriving-at-restaurant.html` | `/order/[orderId]/arrived` | ✅ exists | pickup | ✅ |
| 21 | QR Verified | 8.6 QR đã được xác nhận | `08-06-qr-verified.html` | `/order/[orderId]/verified` | ✅ exists | pickup | ✅ |
| 22 | Order Completed | 8.7 Đã nhận hàng tại quán | `08-07-order-completed.html` | `/order/[orderId]/completed` | ✅ exists | pickup | ✅ |
| 23 | Order History | 9.1 Danh sách đơn hàng | `09-01-order-history.html` | `/orders` | ✅ exists | order-history | ✅ |
| 24 | Order Detail | 9.5 Chi tiết đơn cũ | `09-05-order-detail.html` | `/order/[orderId]` | ✅ exists | order-history | ✅ (note: URL shared with 8.2 status, D-5) |

**MVP result:** 24 / 24 MVP steps have a reference screen (all agree with `SCREENS[].mvp` and `MVP_FLOW`). **24 / 24 have a matching React Native route** and **24 / 24 map to an existing feature folder** (MVP 07 became `/search/results` in U0; `discovery` was created in U0). Nothing is left unmapped.

Reference flow order (`MVP_FLOW`) equals `docs/MVP.md` order exactly. Two orderings inside it are worth noting: step 13 (5.3 pickup time) is reached from Checkout via the "Đổi" link and returns to 6.7, and steps 17→18 (Pickup QR before Pickup Instructions) follow the rail; per D-3 (approved) the real flow goes 7.3 → 8.3 directly, and 8.1 is reached afterwards.

## 5. Design system extraction & token comparison

Extracted from `css/styles.css` plus a scan of every inline style in the 82 screens (counts = occurrences across all screens). The comparison tables below record the state **before U0**. ✅ **U0 (D-12): `src/constants` now uses the reference values** — colours (verified against the CSS by `npm run verify`), Nunito 600/700/800 with the reference type scale, reference spacing/radius/ring widths, control sizes and component presets. Nunito is kept; Be Vietnam Pro is not used. Light theme only (D-11). RN cannot express ring/negative-spread shadows, so those are approximations.

### 5.1 Colours

| Reference token | Value | Uses | Our token (`src/constants/colors.ts`) | Status |
|---|---|---|---|---|
| `--la` primary | `#2FA05C` | 131 | `primary #2FA05C` | ✅ same |
| `--la-dam` dark green | `#1F7D46` | 285 | `primaryDark #1F7D46` | ✅ same |
| `--bac-ha` mint | `#E6F4E4` | many | `mint #E6F4E4` | ✅ same |
| `--the` card | `#FFFFFF` | 98 | `white` | ✅ same |
| `--giay` app background | **`#FDFDFB`** | 31 | `paper #FAF8F1` | ❌ **differs** — README says the client lifted the brief's `#FAF8F1` to `#FDFDFB` after review (D-12) |
| `--muc` text | `#1A2621` | 912 | `text #1B2A21` | ❌ near-miss (1 step) |
| `--muc-mo` secondary text | `#6B7A70` | many | `textMuted #5F6F66` | ❌ differs |
| `--muc-rat-mo` tertiary/placeholder | `#9BA89F` | 107 | — | ➕ missing |
| `--ke` / `--ke-2` border | `#E6E4DA` / `#EAE8DE` (warm grey) | many | `border #DCE5DC` (green-grey) | ❌ differs |
| `--hophach` amber | `#F2A828` | 49 | `warning #E0A21B` | ❌ differs |
| `--do` red | `#E24B3B` | few | `danger #D64545` | ❌ differs |
| `--la-chu` green text on mint | `#22713F` | — | — | ➕ missing |
| `--bac-ha-2` mint border | `#D3EBCF` | — | — | ➕ missing |
| `--la-sang` light green / `--lam` blue | `#7FCB8C` / `#4B7FE0` | few | — | ➕ missing (low use) |
| disabled button | fill `#EDEAE0`, label `#9BA89F` | — | `disabled #C5CFC7` (single) | ❌ differs |
| badge tints: amber `#FDF0DA`/`#96702A`, red `#FCE7E4`/`#B23A2C`, grey `#EFECE3` | | | — | ➕ missing |
| warning card `#FFF8EC`, ring `#F2DDB4`, text `#7A5A1E` | | 7 | — | ➕ missing |
| illustration fills (`m-xanh/cam/do/nau/la/hong` gradients), hero `#DAEDD0→#BADFB2`, pickup-QR screen `#E9F6E4→#FDFDFB`, orb conic gradient | | | — | ➕ missing (art, not UI tokens) |

Dark mode exists **only in the prototype shell** (`:root[data-theme=dark]` styles the showcase page, not the phone). The product palette is light only, although 10.5 lists "Giao diện: Theo hệ thống" (D-11).

### 5.2 Typography (Nunito)

Weights actually used: **800 (252×), 600 (230×), 700 (95×)**. Weight 400 is never used — body text is 600. Our `FontFamily.regular` (`Nunito_400Regular`) has no counterpart; body should use 600.

| Role | Reference (CSS class) | Our variant (`typography.ts`) | Status |
|---|---|---|---|
| Screen title | 23 px / 800, −0.025em | `title` 24 / 800, lh 32 | ≈ (1 px) |
| Section title | 17 px / 800 (`.tieu2`), 16 px h3 on Home | `subheading` 17 / **700** | weight differs |
| Card / row title | 14 px / 800 (`.tieu3`), 13.5 in rows | — | ➕ missing |
| Body | 13 px / 600, lh 1.55 | `body` **15** / **400**, lh 22 | ❌ differs |
| Caption | 11.5 px / 600 | `caption` 13 / 400 | ❌ differs |
| Nav title | 16 px / 800 | — | ➕ missing |
| Button label | 15 px / 800 | 17 / 700 (`ButtonStyles.label`) | ❌ differs |
| Input text | 13.5 px / 600 | 15 / 400 | ❌ differs |
| Tab label | 10 px / 700 | `xs` 11 / 700 | ≈ |
| Badge | 10 px / 800; chip 11.5 / 800 | — | ➕ missing |
| Amounts | 27 px (QR amount), 19–20 (hero/QR id), 18 (total) | `display` 32 | ➕ missing |

Most-used sizes (px × count): 11×101, 12.5×95, 14×63, 11.5×62, 10.5×44, 13.5×41, 13×39, 12×38, 10×20, 15×15. The reference works in a **10–17 px** range with many half-pixel steps; our scale (11/13/15/17/20/24/32) does not contain 10, 10.5, 11.5, 12.5, 13.5, 14.

### 5.3 Spacing, radius, shadows, sizes

| Aspect | Reference | Ours | Status |
|---|---|---|---|
| Screen gutters | 16 px (`.pad16`) or 20 (`.pad`); Home uses 18 | `SCREEN_PADDING 16` | ≈ (20/18 missing) |
| Gaps | very frequent odd values: **11 (99×)**, 12 (70×), 8 (53×), 10 (43×), 6, 9, 13, 14 | 4/8/12/16/24/32/48 scale | ❌ 11/10/9/13/14/6 have no token |
| Radius: button | **15** | pill (999) | ❌ differs |
| Radius: card | **18** (`.the-c`), restaurant card 16, list card 16 | `lg` 16 | ❌ 18 missing |
| Radius: input | 14 | `md` 12 | ❌ differs |
| Radius: icon tile / image | 12 / 13 | `md` 12 | ≈ |
| Radius: chip / badge | 999 | `pill` | ✅ |
| Radius: hero / sheets / QR card | 22 / 24–26 / 26 | `xl` 24 | ≈ |
| Radius: circles | 50 % (108×) | — | use `borderRadius: size/2` |
| Border style | **1.3–1.8 px "ring" shadows** (`0 0 0 1.4px var(--ke)`) instead of borders | `border` colour + `borderWidth` | translate to `borderWidth` (RN has no spread shadow) |
| Card shadow | `0 2px 10px -4px rgba(24,36,32,.14)` + ring | `Shadows.md` | approximate |
| Primary button glow | `0 8px 18px -8px rgba(47,160,92,.85)` | none | ➕ missing (negative spread unsupported on RN) |
| Button height | **50** (small 38, tiny 31) | 52 | ❌ differs |
| Input height | **48** | 52 | ❌ differs |
| Back chip | 36×36, radius 12, ring | — | ➕ missing |
| Bottom bar (`.day`) | pad 13/18/26, top border, upward shadow | — | ➕ missing |
| Tab bar | 4 tabs, icon + 10 px label, pad 9/8/26, red count badge 16 px | `TabBarStyles` height 64 | ❌ differs (structure + badge) |
| Reference device | 390 × 844 (375 × 812, 430 × 932 scaled) | `REFERENCE_DEVICE 390×844` | ✅ |

### 5.4 Patterns to reproduce

| Pattern | Reference implementation | Notes for RN |
|---|---|---|
| Buttons | `.nut` primary green; `.phu` white + mint ring; `.xam` mint fill; `.tro` disabled; `.vien` destructive red ring; sizes 50/38/31 | Existing `Button` has 4 variants (primary/secondary/outline/ghost) and one size — needs `destructive`, sizes, restyle |
| Cards | `.the-c` white r18; `.the-p` mint no border; `.vien-n` outline only | `Card` has `base`/`mint`; add `outline` |
| Inputs | `.nhap` label above, `.o` 48 px, states `.sang` (focus, green ring) `.loi` (red ring), helper `.bao` | `Input` handles focus/error; needs label + helper |
| Bottom navigation | `.tab` — 4 tabs, filled icon when active, `.gio` count badge | Replace default Tabs bar with custom `tabBar` |
| Headers | `.nav`: back chip · title 16/800 (left, or centred `.c`) · optional right action | new `AppHeader` |
| Badges | `.nhan-n` `.xanh .cam .do .xam .dac` (10/800, pill) | new `StatusBadge` |
| Chips | `.chip` white + ring; `.on` solid green; `.nhat` mint | new `Chip` |
| Modals / sheets | 3.6, 3.7, 5.6, 6.9, 9.6 bottom sheets over dimmed screen; 6.3, 10.9 centred confirm dialogs | expo-router modal presentation + `BottomSheet` / `ConfirmDialog` |
| Floating AI assistant | `.cau` 60 px orb, bottom-right (`right:18 bottom:96`), floating animation 3.6 s, drag on standalone 3.1, tap → 11.2 | `AiOrb` in `components/ai`, mounted in `(main)` layout |
| QR presentation | Payment QR (7.1): black modules, white card r18, amount above, BẢN DEMO badge. Pickup QR (8.3): green modules, white card r26 on mint-white gradient, order code letter-spaced 19/800 below | two separate components: `PaymentQrCard`, `PickupQrCard` |
| Order status presentation | 8.2 vertical step timeline: filled green dot = done, hollow grey ring = pending, times under each step; `StatusBadge` colours per status; active-order card on 9.1 | `StepTimeline` fed by `Order.statusHistory` + `ORDER_STATUS_SEQUENCE` |
| Illustrations | food art = inline vector on tinted gradients (`m-*`); `assets/images/README.txt`: replace with real photos (cover 16:10, card 4:3) | placeholder art component now, real images later |
| Icons | inline SVG per screen (no icon library) | needs a decision (D-15) |

### 5.5 Token conclusion

Decision D-12 (APPROVED): the reference values are the source of truth. ✅ Implemented in U0 as a single reconciliation of `src/constants` (paper = `#FDFDFB`).

## 6. Route mismatches

| # | Route (before U0) | Reference says | Resolution | Status |
|---|---|---|---|---|
| R-1 | `(main)/search` tab "Tìm kiếm" | No Search tab; search = 3.4 → 3.5 | Stack: `/search` (3.4), `/search/results` (3.5); tab removed (D-14) | ✅ U0 |
| R-2 | Tabs: home · search · cart · orders | home · orders · cart · account | Tabs → `home`, `orders`, `cart`, `account`; `(main)/account` added (D-14) | ✅ U0 |
| R-3 | `restaurant/[id].tsx` (file) | 4.1 plus 6 sub-screens | Converted to `restaurant/[id]/index.tsx` (+ `_layout`), URL unchanged | ✅ U0 |
| R-4 | `order/[orderId]/index` = MVP 24 | 9.5 completed detail vs 8.2 active status | `/order/[orderId]` = 9.5, `/order/[orderId]/status` = 8.2 (D-5) | ✅ U0 |
| R-5 | `order/pickup-time` (MVP 13) | Same job as 6.6 | Reuse the route with `?mode=change` (later phase) | planned |
| R-6 | `ai/index` only | 5 AI screens | `ai/history` added; 11.3/11.4 are states of `ai/index`; orb is a component | ✅ U0 (history route) |
| R-7 | `(auth)/` holds location screens | README suggests `(setup)` | Kept as is | no change |
| R-8 | No routes for the other non-MVP screens | Required by the remaining screens | Created phase by phase (U5–U7); listed per screen in §3 | planned |

Payment failed/expired (7.4/7.5) are **phases of the single payment route** (D-6), not separate routes. Guest preview has no route (D-9).

Routes that match and need no change: `/`, `/onboarding`, `/login`, `/location-permission`, `/select-location`, `/home`, `/cart`, `/orders`, `/restaurant/[id]` (path), `/food-bag/[id]`, `/food-bag/[id]/add-to-cart`, `/order/checkout`, `/order/pickup-time`, `/order/summary`, `/order/[orderId]/{payment,payment-success,pickup-qr,pickup-instructions,ready,arrived,verified,completed}`, `/ai`.

## 7. Interaction mapping (HTML → React Native)

| Interaction | In the reference | React Native translation |
|---|---|---|
| Back navigation | `.nav .lui` chip wired to a fixed target (`ROUTES.back`) | `router.back()`; where the reference target differs from history (e.g. 8.3 back → 8.2) use `router.replace`/explicit href |
| Forward / primary action | `.day .nut` → `ROUTES.next` | `router.push`; terminal states (payment result, order completed) use `router.replace` so back does not return to a paid/finished step |
| Bottom tabs | `TAB_TARGETS` `[3.1, 9.1, 6.1, 10.1]` | expo-router `Tabs` with custom `tabBar`; `.gio` badge = cart count |
| Onboarding | 1.2→1.3→1.4→1.5, "Bỏ qua" skips to 1.5 | single `/onboarding` route with a 3-page pager + dots; skip → `/welcome` |
| Splash | timer redirect after 1.8 s | `useEffect` after fonts + session check → `router.replace` |
| Text fields | `.sang` focus ring, `.loi` error ring, password rules, OTP boxes | `Input` (focus/error already) + label/helper, `OtpInput` |
| Search | Home bar is a fake field → 3.4; recents/trending chips → 3.5 | Home renders a `Pressable` looking like an input → push `/search`; autofocus `TextInput`; query in route params; filtering in `features/discovery` via `api.listRestaurants(query)` |
| Filters & sort | 3.6/3.7 sheets over dimmed screen; count badge on filter chip; "Đặt lại" | modal route (`presentation: 'formSheet'`/`transparentModal`); selections in URL params or a small store; result count computed by a pure function |
| Categories | Home category buttons → 3.3 (or 3.2 "Xem tất cả") | push `/category/[id]` |
| Restaurant selection | `.nh`/`.ngang` cards → 4.1 | push `/restaurant/[id]` |
| Save restaurant | heart button on 4.1 | local state in `features/restaurant` (persisted later) |
| Food-bag selection | bag row → 5.1 | push `/food-bag/[id]` |
| Add to cart | 5.6 sheet: stepper (min 1, max = bag.left), own-box checkbox −2.000đ/bag, live button label "Thêm N túi · price" | transparent modal; quantity logic in `features/cart/cart-logic.ts` (pure); price maths in a pure function, not in the component |
| Cart | steppers per line, qty→0 or swipe-left opens 6.3, totals update live, grouped per restaurant | `FlatList`/`SectionList` by restaurant; swipe via `react-native-gesture-handler` (already installed) |
| Checkout | fixed pickup point (no address form), "Đổi" → 5.3, promo row → 6.5, "Chọn cách thanh toán" → 6.8 | read-only pickup point card; promo via params/store |
| Pickup time | slots with capacity; full slots disabled; button label shows chosen slot | radio list; selection saved to the draft order |
| Payment | 7.1 QR + hold timer 09:42; no "I have paid" button; auto → 7.2 → 7.3 / 7.4 / 7.5 | `usePaymentStatus` (exists) drives `router.replace` to result routes; QR from `PaymentSession.qr` |
| QR display | Payment QR and Pickup QR are visually distinct | two components; never share props/types (already enforced in `types/`) |
| Pickup verification | staff scan (prototype: demo button) → 8.6 appears on customer device | poll `api.getOrder`; when status = `qr_verified` → `router.replace(verified)`. Staff side is out of scope; dev-only trigger (D-17) |
| Order status changes | 6-step timeline; hint text under current step | `StepTimeline` reads `Order.statusHistory` |
| Cancel order | allowed only before "preparing"; refund 100 % | guard in a pure function using `OrderStatus`; needs cancelled state (D-2) |
| Order history | 9.1 chips → 9.2/9.3/9.4; active card with "Mở QR" | one `/orders` route with segments (`?tab=`); card → `/order/[orderId]` |
| Reorder / review | 9.6 sheet re-checks availability; 9.7 only when picked up | modal route; availability via `api.getFoodBag`; guard on status |
| Countdowns | 5.1 "còn 2h14", 7.1 hold, 8.1/8.2/8.5 deadline | shared `useCountdown(targetISO)` hook |
| Copy / call / maps | "Sao chép số tài khoản", "Gọi quán", "Mở Google Maps" | clipboard (needs package), `Linking.openURL('tel:…')`, `Linking` maps URL (`expo-linking` present) |
| Map screens | pure CSS mock map, pins, sheet | `MapMock` from Views; **no map SDK** |
| AI orb & chat | orb tap → 11.2; quick prompts; send → suggestions with reasons; history | orb in `(main)` layout; chat via `useAiChat` (exists) + `aiService` mock; router only, by id, into core |
| Notifications | list, unread dots, deep links to 8.2 / 10.3 | plain list; **no real push** |
| Logout | 10.9 confirm → 1.5 | `ConfirmDialog` → clear session → `router.replace('/welcome')` |

## 8. Component identification

Reuse counts are the number of the 82 screens using the reference class. **Not implemented** — identification only.

| Proposed component | Reference | Screens | Exists today? | Notes |
|---|---|---|---|---|
| `AppHeader` | `.nav` (back chip + title + right slot) | 51 | ❌ | left / centred title variants |
| `BottomActionBar` | `.day` | 35 | ❌ | pinned outside scroll, safe-area padding |
| `BottomTabBar` | `.tab` | 16 | ❌ | 4 tabs + count badge |
| `Button` | `.nut` (+ `.phu .xam .tro .vien`, 3 sizes) | 54 | ⚠ partial | restyle + destructive + sizes |
| `TextField` | `.nhap` | 17 | ⚠ `Input` | add label, helper, error text |
| `Card` / `InfoCard` / `OutlineCard` | `.the-c` `.the-p` `.vien-n` | 47 / 24 / 12 | ⚠ `Card` | add outline |
| `StatusBadge` | `.nhan-n` | 23 | ❌ | 5 colours |
| `Chip` / `FilterChip` | `.chip` | 15 | ❌ | selected / soft |
| `ListRow` | `.dong` | 13 | ❌ | icon tile + text + trailing |
| `PriceRow` / `PriceSummary` | `.tien`, `.tong` | 13 | ❌ | dashed total rule |
| `RestaurantCard` | `.nh` (grid) | 2 | ❌ | Home only |
| `BagRowCard` (horizontal) | `.ngang` | 8 | ❌ | restaurant / bag lists, sold-out variant |
| `FoodArt` / `FoodImage` | `.mon .m-*` | 30 | ❌ | placeholder art now; photos later |
| `QuantityStepper` | inline in 5.6 / 6.1 | 2 | ❌ | min 1, max stock |
| `StepTimeline` (`OrderStatus`) | `.buoc` | 1 (8.2) | ❌ | 6 steps |
| `PaymentQrCard` | 7.1 | 1 | ❌ | black modules, demo badge |
| `PickupQrCard` | 8.3 | 1 | ❌ | green modules, order code |
| `CountdownText` | inline timers | ~8 | ❌ | + `useCountdown` hook |
| `BottomSheet`, `ConfirmDialog` | 3.6 3.7 5.6 9.6 / 6.3 10.9 | 7 | ❌ | modal presentation |
| `EmptyState`, `ResultState` (error/expired/sold-out) | `.rong`, 7.4 7.5 5.7 | 5 | ❌ | shared illustration + 2 actions |
| `SearchBar` (fake + real) | Home / 3.4 | 6 | ❌ | |
| `CategoryButton`, `SectionHeader` | Home | 3 | ❌ | |
| `MapMock`, `MapPin` | `.bando` | 4 | ❌ | Views only |
| `WarningNote` | amber card `#FFF8EC` | 6 | ❌ | |
| `DemoBadge` | "BẢN DEMO" | 3 | ❌ | 6.8, 7.1, 7.6 |
| `SwitchRow`, `RadioRow`, `Checkbox` | 10.4 10.5 3.7 8.8 4.7 | ~8 | ❌ | |
| `OtpInput`, `StarRating`, `PhotoAdd`, `Avatar`, `BarChart`, `Accordion` | 1.8, 9.7, 4.7, 10.x | ~8 | ❌ | UI-only (no pickers/charts libs) |
| `AiOrb` | `.cau` | 7 | ❌ | in `components/ai` |
| `AiChatBubble` | `.tn` | 2 | ⚠ `ChatBubble` | restyle |
| `AiSuggestionCard` (with reasons), `AiQuickPrompt` | 11.4, 11.1–11.2 | 4 | ❌ | in `components/ai` |
| `AppText`, `Screen` | | | ✅ | keep |

## 9. AI module analysis (Group 11)

Five screens; all UI only, matching `docs/AI-FLOW.md`.

| ID | Screen | RN | What it shows |
|---|---|---|---|
| 11.1 | AI orb floating | overlay component `AiOrb` (◻) | Draggable 60 px orb over Home; long-press expands 3 quick prompts. Present on 3.1, 3.2, 3.3, 3.10, 9.1, 10.1, 11.1 |
| 11.2 | AI welcome | `/ai` ✅, empty-thread state | Greeting, 4 quick-prompt chips, input |
| 11.3 | Typing | `/ai` chat state ↳ | Keyboard open, message composing |
| 11.4 | Answer with reasons | `/ai` chat state ↳ | AI reply + suggestion card: bag, price, rating, **reasons list ("Vì sao mình gợi ý món này?")**, "Xem chi tiết món" → 5.1, follow-up chips, disclaimer |
| 11.5 | History | `/ai/history` ➕ | Conversation list grouped by day, "Hội thoại mới", "Xoá hết", banner "Bản MVP · chưa nối AI thật" |

**Navigation:** entry via orb (11.1) and three contextual buttons in core screens — 3.5 "Nhờ AI gợi ý món tương tự", 5.7 "Nhờ AI tìm túi thay thế", 6.2 "Hỏi AI xem nên ăn gì" — all just `router.push('/ai')` (optionally with a `?context=` param). Exit into core only via `router.push('/food-bag/[id]')` by id.

**UI states:** empty/welcome · composing · replying (typing indicator) · answer with suggestion cards · history list · history empty (not designed) · error/offline (not designed).

**Mock behaviour (reference `AI_MOCK`):** greeting, `quickPrompts[4]`, one `sampleQuestion` and one `sampleAnswer = { bagId: 'bag_04', reasons: [4 strings] }`.

**Relation to core data & coupling:** the answer references a bag **by id** and its reasons are strings that describe core facts (spice, price < 50k, distance 0.8 km, 3 left, pickup window). Suggestion cards need bag name/price/distance to render, which lives in core data. To keep `features/ai` decoupled:
- the AI service returns `{ bagId, reasons[] }` only;
- the **screen** (route file, not the AI module) resolves `bagId` through `services/api` to render the card — the AI module never imports core types/features (the rule `npm run verify` enforces);
- the orb is the only AI component mounted by core (`(main)/_layout`), via its public export.
- Required type change (proposed, not done): `AiSuggestion` needs `reasons: string[]`; `AiMockResponse` mirrors it; add `AI_HISTORY` mock in `data/ai`.

## 10. Exception / error / empty states

"Designed" = the reference has a full screen; "note only" = the reference mentions the behaviour in text but has no design.

| State | Ref | Trigger | RN host | Component | Designed? |
|---|---|---|---|---|---|
| Empty cart | 6.2 | cart has 0 items | `/cart` state ↳ | `EmptyState` (2 actions incl. AI) | ✅ |
| Remove item confirm | 6.3 | qty→0 / swipe | dialog on `/cart` ◻ | `ConfirmDialog` | ✅ |
| Bag sold out / out of hours | 5.7 | `bag.left = 0` or window over | `/food-bag/[id]` state ↳ | `ResultState` + alternatives + AI | ✅ |
| Restaurant bag sold out row | 4.2, 3.10, 3.5 | left = 0 | inside lists | `BagRowCard` sold-out variant | ✅ |
| Search no result | 3.5 note | 0 matches | `/search/results` state ↳ | `EmptyState` + AI suggestion | 📝 note only |
| Saved list empty | 3.10 note | no saved | `/saved` state ↳ | `EmptyState` | 📝 note only |
| Area "Sắp mở" | 2.2 | district without restaurants | list row | disabled `ListRow` | ✅ |
| Location permission denied | 2.1 | OS denies | `/location-permission` | fall back to 2.2 | ❌ not designed |
| Promo not usable | 6.5 | conditions unmet | `/order/promo` | disabled `PromoCard` + reason | ✅ |
| Slot full | 5.3, 6.6 | capacity 0 | `/order/pickup-time` | disabled slot row | ✅ |
| Creating order / reservation fails | 6.9 note | bag just taken | `/order/summary` overlay ↳ | `ResultState` | 📝 note only |
| Payment waiting > 2 min | 7.2 | slow bank | payment phase ↳ | "Tôi cần trợ giúp" → 10.7 | ✅ |
| **Payment failed** | 7.4 | `paymentStatus = failed` (order stays `placed`, 5-min retry) | `/order/[orderId]/payment` failed phase ↳ (D-6) | `ResultState` | ✅ |
| **Payment expired / hold expired** | 7.5 | `paymentStatus = expired` (10 min) → order `expired` | `/order/[orderId]/payment` expired phase ↳ (D-6) | `ResultState` | ✅ |
| Cancel order | 8.8 | user cancels before "preparing" | `/order/[orderId]/cancel` ➕ | radio reasons + policy | ✅ |
| Cancelled orders list | 9.4 | cancelled / expired orders | `/orders?tab=cancelled` ↳ | `OrderCard` variants | ✅ |
| Pickup issue: reader broken | 8.3 | staff device down | `/order/[orderId]/pickup-qr` | `WarningNote` + order code + 10.7 | ✅ |
| Pickup issue: wrong bag | 8.6, 9.5 | mismatch | `/restaurant/[id]/report` ➕ | report form | ✅ |
| Restaurant closed / bad quality | 4.7 | any | same | report form | ✅ |
| Arriving late | 5.3 note | > 15 min after slot | policy text | `WarningNote` | ✅ |
| Reorder unavailable | 9.6 | bag sold out | reorder sheet | disabled button | ✅ |
| Login / register field errors | `.loi` style | invalid input | `/login`, `/register` | `TextField` error | 📝 style only |
| Offline / generic error / loading skeletons | — | — | — | — | ❌ not designed |

## 11. Data model gaps

Reference mock (`js/mock-data.js`) vs `src/types` **before U0**. ✅ U0 implemented: cancelled/expired states + cancellation/refund (D-2), `orderCode` and `checkoutId`, money breakdown without delivery fee, multi-restaurant `Cart` with per-restaurant pickup slots and own-box (D-1), reference-shaped `Restaurant`/`FoodBag`/`User`, `Category`, `Promo`, `PickupSlotOption`, `PaymentMethod`, payment hold/retry semantics, `PickupQr { token, orderCode }` (D-7) and AI `reasons`/history. Still deferred (needed only by later screens): `Area`, `Review`, `Notification`, saved wallet cards, FAQ, search history/trending, monthly impact history.

| Reference | Current type | Gap |
|---|---|---|
| `ORDER_STATUS` 6 keys **+ `CANCELLED`** (orders EB-2409-011, expired 9.4) | `OrderStatus` has 6, no cancelled | add `cancelled` + `cancelReason`, `cancelledBy`, `refundedAmount` (D-2) |
| Order code `EB-2409-017`, transfer note `EB2409017` | `Order.id` opaque `o_…` | need human `orderCode` (used in QR fallback, invoices, support) |
| Order: `subtotal, discount, promoCode, ownBox, paymentMethod, pickedUpAt, deliveryFee:null` | `total` only | add money breakdown + own-box; **do not add `deliveryFee`** |
| Cart grouped by restaurant, several restaurants ("2 mã QR riêng") | `Cart` = one restaurant, `addToCart` resets on other restaurant | multi-restaurant cart → one order per restaurant (D-1) |
| Cart line: own-box flag, per-restaurant pickup slot ("Chưa chọn giờ") | `CartItem` no own-box; slot on order | add `ownBox`, per-restaurant slot |
| `FOOD_BAGS`: `summary, contents[], allergens{}, lastCall, art, pickupWindow "18:00 – 20:00"` | `FoodBag` has description, ISO window | add contents/allergens/summary; window is string label in reference, ISO in ours |
| `RESTAURANTS`: `category, phone, walkMinutes, bagsLeft, pickupWindowToday, art` | `Restaurant` lacks these | add `categoryId, phone, walkMinutes` |
| `PICKUP_SLOTS` `{ label, left, selected }` (capacity per slot) | `PickupSlot {start,end}` | add capacity/remaining |
| `CATEGORIES`, `PROMOS`, `USER.impact/wallet/savedRestaurants`, `DEMO_PAYMENT` | none | new types: `Category`, `Promo`, `ImpactStats`, `Wallet`, bank-transfer details on `PaymentSession` |
| Not in reference mock but needed by screens: `Area`, `Review`, `Notification`, `PaymentMethod`, `Badge`, `FAQ`, search history/trending | none | new types + mock (no backend) |
| `AI_MOCK.sampleAnswer { bagId, reasons[] }` | `AiSuggestion { label, target }` | add `reasons`, history |
| Pickup QR payload = order code | `PickupQr.token` opaque | keep token **and** add order code, or encode order code (D-7) |
| Payment `PaymentSession`: `holdExpiresAt`, retry window 5 min, hold 10 min | `qr.expiresAt` 10 min | add retry hold semantics |
| Currency `đ` with dot separators | `formatMoney` | ✅ matches |
| Impact `1 bag = 1.2 kg / 2.5 kg CO₂ / 340 L` | none | add constant + pure helper |

## 12. Decisions (approved)

All 17 decisions are **APPROVED**. "Implemented" = done in U0; the others are recorded rules for later phases.

| ID | Decision | Status | Approved resolution | Where |
|---|---|---|---|---|
| D-1 | Multi-restaurant cart vs single-restaurant `Cart` | **APPROVED** | One `Cart` holds several restaurants. Checkout groups by restaurant and creates **one Order per restaurant**, each with its own pickup QR (and payment session) | ✅ `types/cart.ts`, `utils/order-pricing.ts`, `features/cart`, `api.checkout` |
| D-2 | Cancelled / expired order state | **APPROVED** | Six-step main lifecycle unchanged; `cancelled` and `expired` are **terminal exception states outside the sequence**, with cancel reason and refund info | ✅ `types/order.ts`, `utils/order-lifecycle.ts`, `constants/order-status.ts` |
| D-3 | After 7.3: 8.3 or 8.1 | **APPROVED** | 7.3 → **8.3 Pickup QR**. 8.1 is not inserted before it | ✅ documented; placeholder flow keeps 8.3 first |
| D-4 | Payment method screen 6.8 in MVP | **APPROVED** | Included. QR bank transfer is the only enabled method; others disabled with "Sắp có" | ✅ `data/mock/payment.ts`, `PaymentService.listPaymentMethods` |
| D-5 | `/order/[orderId]` = 8.2 or 9.5 | **APPROVED** | `/order/[orderId]` = completed detail (9.5); `/order/[orderId]/status` = active timeline (8.2) | ✅ route `status.tsx` added |
| D-6 | 7.1/7.2 and payment states: one route or several | **APPROVED** | One route with phases (`qr → waiting → success/failed/expired`) | ✅ `PaymentPhase`, `derivePaymentPhase`, `usePaymentStatus` |
| D-7 | Pickup QR payload / manual code | **APPROVED** | Opaque `token` **and** `orderCode` displayed beneath the QR | ✅ `PickupQr { token, orderCode }` |
| D-8 | Login success destination | **APPROVED** | First successful login → Location Permission → Select Location → Home; returning authenticated user → Home | ✅ `features/auth/auth-routing.ts` |
| D-9 | Guest preview | **APPROVED** | Not supported in MVP; the button stays hidden | ✅ `GUEST_PREVIEW_ENABLED = false`, no route |
| D-10 | Non-QR payment methods | **APPROVED** | Remain disabled with "Sắp có" | ✅ mock data + `createPayment` rejects disabled methods |
| D-11 | Theme | **APPROVED** | Light only; no dark theme | ✅ `userInterfaceStyle: light`, no colour-scheme code |
| D-12 | Token source of truth | **APPROVED** | Reference visual values; keep Nunito; no Be Vietnam Pro | ✅ `src/constants/*`; colours verified against the reference CSS |
| D-13 | Delivery-fee rows | **APPROVED** | Remove all; self-pickup only | ✅ no such field/row/copy; verified by `npm run verify` |
| D-14 | Tabs and search | **APPROVED** | Tabs: Home, Orders, Cart, Account. Search is a stack flow `/search`, `/search/results` | ✅ `(main)/_layout`, `search/` |
| D-15 | Dependencies | **APPROVED** | Add only `react-native-svg`, `expo-linear-gradient`, `react-native-qrcode-svg`; nothing else yet | ✅ installed; others verified absent |
| D-16 | Feature folders | **APPROVED** | Create `discovery`, `notifications`, `account`; checkout stays in `cart`; reviews stay in `order-history` | ✅ folders created |
| D-17 | Dev controls | **APPROVED** | `__DEV__`-only control advancing existing mock payment/order/restaurant/pickup states via existing services; no HTML demo panel | ✅ `components/dev/DevMenu`, `features/dev/dev-actions` |

Informational reference inconsistencies (no decision needed): cart badge 2 on Home vs 3 on 6.1 (use the bag count); 9.1 headline counts 1+8+1 orders vs "9" on 10.1; payment hold is 10 min (7.5, 9.4) while the retry hold after a failure is 5 min (7.4) — both are implemented as separate policies; README lists the AI orb on 6.1 but the 6.1 HTML has none.

### Design gaps (not designed in the reference)
G-1 no-result / empty / reservation-failed screens are described in notes only · G-2 location permission denied · G-3 offline / generic error / skeletons · G-4 login error copy · G-5 checkout total (86.000đ) vs summary (76.000đ) implies a promo step that is not shown between them · G-6 orb presence on 6.1.

## 13. Implementation plan

**Order of work, MVP first.** Each phase ends with `tsc`, `npm run verify` and an export smoke test.

| Phase | Scope | Screens | Status |
|---|---|---|---|
| **U0** Decisions & foundations | D-1…D-17 applied: types, mock data, services, tokens, navigation reshape, dependencies, feature folders, dev controls, docs | — | ✅ **done** |
| **U1.1** Shared UI / design system | `Screen`, `AppText`, `Button`, `Input`, `Card`, `Header`, `BottomTabBar`, `BottomActionBar`, `Chip`, `Badge`, `StatusBadge`, `Divider`, `BottomSheet`, `ConfirmDialog`, `EmptyState`, `ErrorState`, `LoadingState`, `Skeleton`, `PriceRow`, `QuantityStepper`, `QrCode`, `FoodImage`, icon layer, restaurant/food-bag/cart/order components, `AiOrb`, `ChatBubble` | — | ✅ **done** |
| **U1.2** Authentication + onboarding | Splash, Onboarding (3 slides), Welcome, Register, OTP, Create Profile, Login, Location Permission (mock), Select Location (4 areas); `Checkbox`, `ListRow`, `OtpInput`, `useCountdown`; mock auth state | 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 2.1 2.2 (+ Create Profile) | ✅ **done** |
| **U1.3** Home + Search + Restaurant Discovery | Home (6 demo restaurants, selected area first), Search, Search Results, Restaurant Detail; `SearchBar`, `SectionHeader`, `CategoryButton`, `HeroBanner`, `RestaurantListCard`, `PickupInfoTiles` | 3.1 3.4 3.5 4.1 | ✅ **done** |
| **U1.4** Food Bag + Cart | Food Bag Detail (+ sold-out 5.7), Add-to-Cart sheet, Cart (+ empty 6.2, remove dialog 6.3); session cart store, tab badge; `CoverImage`, `AddToCartSheet`, `OwnBoxRow`, `BagContentsList`, `BagImpactTiles` | 5.1 5.6 5.7 6.1 6.2 6.3 | ✅ **done** |
| **U1.5** Checkout + Payment | Checkout (6.4), Select Pickup Time (5.3 / 6.6), Order Summary (6.7), Payment Method (6.8), Payment QR (7.1 → 7.2 → 7.4 / 7.5 phases), Payment Success (7.3); `OrderItemRow`, `HoldTimerCard`, `PaymentSuccessHero`; multi-order sequential payment | 5.3 6.4 6.6 6.7 6.8 6.9 7.1 7.2 7.3 7.4 7.5 | ✅ **done** |
| **U1.6** Pickup | Pickup QR (8.3), Pickup Instructions (8.1), Order status timeline (8.2), Order Ready (8.4), Customer Arrives (8.5), QR Verified (8.6), Order Completed (8.7); `PickupGateState`, `PickupStepList`; sequential multi-order pickup | 8.1 8.2 8.3 8.4 8.5 8.6 8.7 | ✅ **done** |
| **U1.7** Orders + Account | Orders (9.1–9.4 segments), Order Detail (9.5), Account (10.1), Edit Profile (10.2), Logout (10.9); `components/account`; root auth gate; account-scoped orders | 9.1 9.2 9.3 9.4 9.5 10.1 10.2 10.9 | ✅ **done** |
| **U1.8** AI | AI Assistant, AI History, orb wiring | 11.x | not started |
| **U2** MVP entry | Splash, Onboarding, Login, Location permission/select, Home, Search (3.4/3.5) | 1.1 1.2 1.6 2.1 2.2 3.1 3.4 3.5 | not started |
| **U3** MVP browse & cart | Restaurant, Food bag, Add to cart, Cart, Checkout, Pickup time, Summary | 4.1 5.1 5.6 6.1 6.4 5.3 6.7 | not started |
| **U4** MVP payment & pickup | Payment QR (phases), success, Pickup QR (separate components), instructions, ready, arrived, verified, completed, history, order detail | 7.1 7.3 8.3 8.1 8.4 8.5 8.6 8.7 9.1 9.5 | not started |
| **U5** Exceptions on the MVP path | 5.7 6.2 6.3 6.8 7.2 7.4 7.5 (phases) 8.2 8.8 9.4 4.7 + search no-result | ~12 | not started |
| **U6** Discovery extras | 3.2 3.3 3.6 3.7 3.8 3.9 3.10, 4.2–4.6, 5.2 5.4 5.5, 6.5 6.6 6.9 | ~21 | not started |
| **U7** Auth extras & Account | 1.3–1.5 1.7–1.9 2.3 2.4, 7.6 7.7, 9.2 9.3 9.6 9.7, 10.x | ~24 | not started |
| **U8** AI | `AiOrb`, `/ai` states, suggestion card with reasons, `/ai/history` UI | 11.1–11.5 | not started |

The README also suggests a 13-screen demo subset (`1.1 → 1.6 → 2.2 → 3.1 → 4.1 → 5.1 → 5.6 → 6.1 → 6.4 → 6.7 → 7.1 → 7.3 → 8.3`) if scope must be cut further.

**Out of scope (unchanged):** real payment, real AI, backend, delivery, push notifications, real maps, dark mode, the prototype demo panel.

## 14. U0 change log

- **Types:** `Cart` (multi-restaurant, per-restaurant slots), `Order` (`orderCode`, `checkoutId`, `OrderMoney`, `OrderState`, `OrderCancellation`, `RefundInfo`), `OrderDraft`, `CheckoutResult`, `PaymentSession` (hold/retry, bank details), `PaymentPhase`, `PaymentMethod`, `PickupQr` (`token` + `orderCode`), catalog types (`Category`, `Promo`, `AllergenInfo`, `PickupWindow`), `User`, AI (`reasons`, `AiConversationSummary`).
- **Mock data:** reference shape and values (`res_01…06`, `bag_01…08`, `EB-2409-017…`, promos, slots, payment methods, categories, AI answer with 4 reasons, 5-item history); seeds include a multi-order checkout, a cancelled order with refund and an expired order.
- **Rules (pure):** `utils/order-lifecycle.ts` (cancel/expire), `utils/order-pricing.ts` (grouping, promo, money, drafts), `utils/order-code.ts`.
- **Services:** `api.checkout`, `cancelOrder`, `expireOrder`, catalog reads; payment `listPaymentMethods`, `retryPayment`, hold/retry semantics; AI `listConversations`.
- **Features:** `cart` (multi-restaurant logic), `payment` (phase, settle, hook), `auth` (post-login routing), `dev` (dev actions); folders `discovery`, `notifications`, `account` created.
- **Tokens:** `colors`, `typography`, `spacing`, `shadows`, `layout`, `component-styles`, `policy` reconciled with the reference; `Button` restyled (variants primary/secondary/soft/destructive + sizes).
- **Navigation:** tabs reshaped (Search removed, Account added); `/search`, `/search/results`, `restaurant/[id]/index`, `/order/[orderId]/status`, `/ai/history` added.
- **Dependencies added:** `react-native-svg`, `expo-linear-gradient`, `react-native-qrcode-svg`.
- **Tooling:** `components/dev/DevMenu` (`__DEV__` only); `npm run verify` extended (29 routes, tokens vs reference CSS, checkout/payment/lifecycle/cancel/expire, dev actions, hygiene).
- **Docs:** `CLAUDE.md`, `ARCHITECTURE.md`, `MVP.md`, `AI-FLOW.md`, this file.

## 15. U1.2 change log (auth + onboarding)

- **Screens:** Splash, Onboarding (1.2–1.4 as one 3-slide pager), Welcome (1.5), Login (1.6), Register (1.7), OTP (1.8), Create Profile (new, modelled on 10.2), Location Permission (2.1, mock), Select Location (2.2, four Hà Nội areas). Routes added: `/welcome`, `/register`, `/otp`, `/create-profile` (33 routes in total). Home stays the placeholder.
- **Reconciliations with the reference:** Create Profile has no reference screen (layout from 10.2); "Họ và tên" moved from Register to Create Profile; Google/Apple buttons, "Xem trước không cần tài khoản", "Quên mật khẩu?" and "Tiếp tục bằng email" are not rendered; Select Location omits the search field and the "Dùng vị trí hiện tại" row and lists the four approved Hà Nội districts instead of Bắc Ninh districts.
- **State / rules:** `features/auth` (reducer, session store, routing, actions, guards), `utils/auth-validation`, `services/auth` (mock, demo OTP `1234`, demo password `EcoBite123`), `api.listAreas`.
- **UI:** `Checkbox`, `ListRow`, `OtpInput` (common); `BrandMark`, `OnboardingIllustration`, `LocationIllustration`, `PagerDots` (`components/auth`); hooks `use-countdown`, `use-back`.
- **Tests:** 21 new checks in `npm run verify` (99 total).

## 16. U1.3 change log (Home + Search + Restaurant discovery)

- **Screens:** Home (3.1), Search (3.4), Search Results (3.5), Restaurant Detail (4.1). Still 33 routes; Food Bag Detail stays the placeholder.
- **Mock data:** restaurants `res_01`…`res_06` keep ids, names, ratings, distance and art but get `areaId` and Hà Nội addresses inside the four supported areas; the user's demo area string is Hà Nội too. No Bắc Ninh text remains in `src/data` or `src/components`.
- **Reconciliations with the reference:** Home omits the notification bell (3.9 is not routed) and "Xem tất cả" (3.2 is not routed); the location pill is read-only (area switching after Select Location is not in the approved flow); the hero, category circles (food illustration instead of line icons), restaurant grid and fake search bar follow 3.1. Search omits per-row history icons other than the clock and the AI hint card (replaced by a plain hint); trending terms are limited to words the mock catalog can answer. Results omit "Bộ lọc" and sort chips (3.6/3.7 not routed) and keep "Còn túi" and "Nhờ AI gợi ý"; the reference's sold-out reminder card is replaced by a dimmed row with a "Hết túi hôm nay" badge. Restaurant Detail omits the heart, "Chỉ đường" and the review link (4.3/4.6 not routed) and its bottom button opens the first available bag instead of "Xem tất cả N túi" (4.2 not routed). Search screens are stack screens, so the bottom tab bar of the reference 3.5 is not shown (D-14).
- **Logic:** `features/discovery`, `features/restaurant`, `utils/restaurant-listing`, `utils/search`.
- **Tests:** 18 new checks in `npm run verify` (117 total, not counting the updated reachability scan and the Home-placeholder assertion that described U1.2).

## 17. U1.4 change log (Food Bag + Cart)

- **Screens:** Food Bag Detail (5.1) with the sold-out state (5.7), Add-to-Cart sheet (5.6), Cart (6.1) with the empty state (6.2) and the remove confirmation (6.3). Still 33 routes; Checkout and later stay placeholders.
- **State:** real session cart store in `features/cart`; tab badge = bag units across restaurants; the store, reducer and screens hold no price maths (`utils/order-pricing` is the source of truth).
- **Reconciliations with the reference:** the Cart badge in each section says "Chưa chọn giờ" until checkout (U1.5) lets the customer choose a time; the sheet subtitle shows the bag's daily pickup window instead of a chosen slot; the live countdown "Còn 2 giờ 14 phút để đặt" is replaced by a static line (a clock-based countdown would make the demo bags expire depending on the time of day); the allergen, contents and impact rows are informational (5.2/5.4/5.5 are not routed); "Nhắc tôi khi có túi mới" is omitted (no notification feature); swipe-to-delete is omitted (the stepper at 1 → 0 opens the remove dialog); low stock uses the soft red badge tone; the header back on the Cart goes to Home. The cart has no delivery-fee row (D-13).
- **Tests:** 16 new checks in `npm run verify` (133 total); two U1.3 assertions that described Food Bag Detail as a placeholder were updated.

## 18. U1.5 change log (Checkout + Payment)

- **Screens:** Checkout (6.4), Select Pickup Time (5.3, also 6.6 "Đổi"), Order Summary (6.7), Payment Method (6.8, new route `/order/payment-method` → 34 routes), Payment QR with its waiting / failed / expired phases (7.1, 7.2, 7.4, 7.5), Payment Success (7.3), and the transitional "Đang tạo đơn" state (6.9) on Payment Method. Pickup QR (8.3) is still the placeholder.
- **Decisions:** D-18 sequential multi-order payment, D-19 Summary before Payment Method (the U1.5 brief differs from the D-4 row order), D-20 slot validity — see `docs/DECISIONS.md`.
- **Reconciliations with the reference:** no "Phí giao hàng" row and no "không mất phí giao" wording (D-13); no promo row / screen (6.5) — the model and pricing are ready; the reference "Giảm giá túi" row is shown as the informational line "Bạn tiết kiệm được …" because it is not part of `total`; no "Sao chép số tài khoản" (needs `expo-clipboard`, D-15), "Tôi cần trợ giúp", "Đổi cách thanh toán" or "Huỷ đơn" (single method, 8.8 not routed); the failed reason is a generic line because the mock session has no reason; expired offers "Đặt lại túi này" (first bag of the order) and "Xem quán khác gần đây".
- **Tests:** 16 new checks in `npm run verify` (149 total). Updated because the phase changed: the route list/count (34), the D-6 payment-route list (now includes `/order/payment-method`), the D-3 check (goes through the `pickupQrRoute` helper), the reachability scan (also template-literal routes) and two U1.3/U1.4 assertions that called Checkout/Summary placeholders.

## 19. U1.6 change log (Pickup flow)

- **Screens:** Pickup QR (8.3), Pickup Instructions (8.1), Order Ready (8.4, with the preparing state), Order status timeline (8.2), Customer Arrives (8.5), QR Verified (8.6), Order Completed (8.7). No new routes (still 34).
- **Decisions:** D-21 sequential multi-order pickup, D-22 verification / completion mapped onto the existing lifecycle (`ready → qr_verified → picked_up`) — see `docs/DECISIONS.md`.
- **Service change:** `api.verifyPickupQr` now distinguishes "Invalid pickup QR", "Pickup QR already used" and "Order is not ready for pickup"; pickup tokens carry random characters. No new mock state machine and no new dev panel (DevMenu "Advance" plays the restaurant and the staff scanner).
- **Reconciliations with the reference:** no live deadline countdowns; no "Chỉ đường" / "Gọi quán" buttons (4.6 not routed); no map on Customer Arrives (no maps, D-15); no rating prompt / "Đặt lại" on Completed (9.7 / 9.6) and no "Có vấn đề với túi này" (4.7); Order Ready is an in-app screen, not a lock-screen notification; the reference order (8.1 first) is kept out of the main path by D-3, so Instructions is opened from the Pickup QR screen.
- **Tests:** 11 new checks in `npm run verify` (160 total). One U1.5 assertion that called the pickup screens placeholders was updated.

## 20. U1.7 change log (Orders + Order Detail + Account)

- **Screens:** Orders (9.1, with the 9.2 / 9.3 / 9.4 segments as chips), Order Detail (9.5, finished orders only, D-5), Account (10.1), Edit Profile (10.2, new route `/account/edit` → 35 routes), Logout dialog (10.9). The Order status timeline (8.2) from U1.6 is what an active order opens.
- **Decisions:** D-23 account-scoped orders + root auth gate, D-24 logout scope / Edit Profile / derived Account numbers — see `docs/DECISIONS.md`.
- **Reconciliations with the reference:** the three segments are chips on one screen (`?tab=` deep links are not used); a live order card has one resume button ("Mở mã nhận hàng" / "Thanh toán ngay" / "Xác nhận đã nhận túi") instead of directions and a countdown; refund lines say "Đã hoàn X" without the wallet (7.6 is not built); Account lists only Orders, personal info and default area (saved restaurants, wallet, promo codes, notifications, settings, help, terms are not routed) and the impact card is derived from the account's orders, not the static sample; Edit Profile keeps phone / email read-only and omits birth date and change-password (not in the user model); Order Detail omits the invoice, report and review actions (7.7, 4.7, 9.7) and "Đặt lại" adds to the cart directly instead of opening the 9.6 sheet.
- **Fix found while validating in the browser:** `OrderCard` nested its action button inside its own pressable area (invalid `<button>` in `<button>` on web); actions now sit outside the pressable summary.
- **Tests:** 13 new checks in `npm run verify` (173 total). Updated because the phase changed: the route list/count (35) and the U1.6 assertion that called Orders / Account placeholders.

## 21. U1.8 Task 1 change log (Login, Search controls, Chỉ đường)

- **Login (1.6):** now has "Quên mật khẩu?", the "hoặc" divider, "Tiếp tục bằng email" (focuses the email field) and "Tiếp tục bằng Apple/iCloud". Apple and forgot-password are UI-only mocks (`features/auth/social-login`): they show a notice, never touch the auth state machine or navigate. Google stays out.
- **Search Results (3.5):** control row [Bộ lọc · N] [sort label] [Còn túi] (`components/search`). Filter sheet (3.6): price band, distance, rating ≥ 4.5. Sort sheet (3.7): Phù hợp nhất, Gần tôi nhất, Giá thấp nhất, Đánh giá cao nhất. Pure rules in `utils/search-refine`; not built: pickup-window filter, "Có lựa chọn chay", "Giảm giá nhiều nhất", "Sắp hết giờ nhận".
- **Chỉ đường:** `PickupInfo` cards on Checkout, Pickup Instructions, Status, Ready and Arrived open a plain maps deep link built from the restaurant address (`features/pickup/directions`). No map SDK, no GPS.

## 22. U1.8 Task 2 change log (Pickup Time)

- **Model:** a pickup time is a point in time on a 30-minute grid (`PickupSlot.start === end === label`, e.g. "18:30"), offered from the intersection of the restaurant's bags' windows, inclusive of both ends (`listSlotsInWindow`, `canSelectSlot` unchanged). Orders placed before this change keep their old "18:00 – 18:30" labels.
- **UI:** `/order/pickup-time` shows restaurant + address, "Khung giờ nhận hôm nay: A – B", a horizontal `PickupTimePicker` (replaces `PickupTimeCard`), the selected time and the confirm button. "Còn N chỗ" and "Đơn vẫn được hoàn tiền" are gone; capacity is still validated in `canSelectSlot`, and a full time would show dimmed without text.
- **Data:** bag windows now vary (17:30–19:30, 18:00–20:00, 20:00–21:30, 17:30–19:00, 17:00–18:30, 19:00–21:30, 18:30–21:00, 19:00–21:00). The mock has no full time any more (the old full slot_3 is gone); the capacity rule is tested with a constructed full option.

## 23. U1.8 Task 3 change log (AI Assistant UI)

- **Orb:** `DraggableAiOrb` (plain `PanResponder`, no library) is mounted ONCE in `(main)/_layout` (navigation only), so the same orb and position float over Home / Orders / Cart / Account and never sit behind the status bar or the measured tab bar (`components/ai/orb-position`). A tap opens `/ai`; a drag never does. The position is session-level (resets on reload). It is no longer mounted on Home; Search, Restaurant and checkout screens still have no orb.
- **Chat (11.1):** messenger-style conversation: user bubbles green on the right, assistant bubbles soft neutral on the left (no border, no shadow, no cards), suggestions as plain rows with their reasons inside the assistant bubble (`SuggestionList`), typing indicator, quick prompts before the first message, pinned composer with a round send button (`ChatComposer`), auto-scroll. The conversation is kept for the session (`features/ai/chat-store`). Mock replies only; AI History (11.5) is unchanged.

## 24. U1.8 Task 4 change log (real restaurant & food images)

- **Assets:** 6 restaurant photos (`assets/images/restaurants/res_0N.jpg`) and 8 food-bag photos (`assets/images/food-bags/bag_0N.jpg`), local and bundled, 800 px wide, from Wikimedia Commons (CC0 / public domain / CC BY-SA); attribution in `assets/images/CREDITS.md`. Each photo matches its dish (Bếp Nhà Lá = cơm tấm, Bún Bò Cay = bún bò, Chè Sen Bà Tâm = chè, "Túi tráng miệng" = chè hạt sen, ...).
- **Mapping:** ONE registry, `src/media/images.ts` (`getRestaurantImage(id)`, `getFoodBagImage(id)`), keyed by the mock ids. Not in `data/mock` (node checks cannot load images) and not under `@/assets/` (that alias points at the root `assets/`). Restaurants show the restaurant photo on Home, Search, Search Results, Restaurant Detail and "Vẫn còn túi ở gần bạn"; bags show the bag photo on Restaurant Detail, Food Bag Detail, the add-to-cart sheet, Cart, Checkout, Order Summary and Order Detail.
- **Components:** `FoodImage` (and `CoverImage`, `FoodBagImage`, `FoodBagCard`, `CartItem`, `OrderItemRow`, `AddToCartSheet`, `RestaurantCard`, `RestaurantListCard`) take an optional `image` prop; without it the vector illustration of `art` is still drawn. Category buttons keep their illustrations. No new dependency (React Native `Image`).
- **Also fixed (found while checking in the browser):** `DraggableAiOrb` collapsed to the top-left corner after the tab layout was covered by a stack screen (0 x 0 layout); it now ignores empty layouts.

## 25. U1.8 Task 5 change log (Home redesign)

- **Layout (top to bottom):** `HomeHeader` (logo, EcoBite, "Good Food · Better Planet", bell) → `HeroBanner` with a real photo → search bar with the filter icon → six illustrated categories → "Nhà hàng gần bạn" (horizontal `NearbyRestaurantCard`s) → "Phổ biến hôm nay" (horizontal `PopularBagCard`s) → `ImpactBanner`. Bottom tabs and the single draggable AI orb are unchanged.
- **Categories:** Tất cả / Cơm / Mì / Healthy / Tráng miệng / Đồ uống, each its own vector drawing (`CategoryIcon`, react-native-svg), never a photo. Filtering works as before (an empty category still shows the empty state). Bánh and Chay exist in the catalog but are not on Home.
- **Data:** restaurant cards use existing fields (rating, review count, distance, pickup window, walk minutes, featured-bag price and discount). Opening hours are not in the model, so the pickup window is shown instead. "Phổ biến hôm nay" = `getPopularBags`: buyable bags only, best-rated restaurant first, then biggest discount.
- **Hearts:** session-only (`features/discovery/favorites-store`, cleared on logout). There is no saved-restaurants screen (3.10 is not built). The bell is a marker only (no notifications screen, no unread state), so it is not pressable. "Xem tất cả" opens Search; the impact banner opens Account.
- **Assets:** hero photo `assets/images/home/hero-bowl.jpg` (CC0, credited) through `getHomeHeroImage()` in `src/media/images.ts`; sizes and illustration colours in `src/constants/home.ts`. New icons `bell`, `heart`, `heartFilled` use reference paths.
