/// <reference types="node" />

/**
 * Foundation verification. Run with: npm run verify
 * (executed through `npx tsx`, which is not a project dependency).
 * Also type-checked by `npx tsc --noEmit`, which proves the @ts-expect-error
 * assertions in the "type-level" section.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import type { ComponentProps } from 'react';

import type { PaymentQrCard } from '../src/components/order/PaymentQrCard';
import type { PickupQrCard } from '../src/components/order/PickupQrCard';
import { ICONS } from '../src/components/common/icons/icon-data';
import { Colors } from '../src/constants/colors';
import { ButtonStyles, CardStyles, ChipStyles, DialogStyles, HeaderStyles, SheetStyles, StepperStyles, TabBarStyles, TimelineStyles } from '../src/constants/component-styles';
import { Sizes } from '../src/constants/layout';
import { ORDER_EXCEPTION_STATUSES, ORDER_STATUS_LABEL, ORDER_STATUS_SEQUENCE, ORDER_STATUS_TONE } from '../src/constants/order-status';
import { Radius } from '../src/constants/spacing';
import { TAB_ITEMS } from '../src/constants/tabs';
import { FontFamily, FontSize, Typography } from '../src/constants/typography';
import { calcDiscountPercent, formatCountdown, formatDistance, formatMoney, formatPhone, formatTimeVN } from '../src/utils/format';
import { getTimelineSteps } from '../src/utils/order-timeline';
import { aiConversationHistory, aiMockResponses, aiQuickPrompts } from '../src/data/ai';
import { mockAreas, mockOrders, mockPaymentMethods, mockRestaurants } from '../src/data/mock';
import { getHomeCategories, getHomeView, getPopularBags, swapHomeRestaurants } from '../src/features/discovery/home-logic';
import { favoriteKey, getFavorites, resetFavoritesStore, toggleFavorite } from '../src/features/discovery/favorites-store';
import { addRecentSearch, MAX_RECENT_SEARCHES, removeRecentSearch } from '../src/features/discovery/search-history';
import { getPrimaryBag, orderBagsForDetail } from '../src/features/restaurant/restaurant-logic';
import { buildRestaurantListings, findListing } from '../src/utils/restaurant-listing';
import { normalizeSearchText, searchListings } from '../src/utils/search';
import { addToCart, buildOrderDrafts, EMPTY_CART, getAddableQuantity, getCartCount, getLineTotal, priceCartGroups, sumOrderMoney, getCartTotal, groupCartByRestaurant, isReadyForCheckout, removeFromCart, setItemQuantity, setPickupSlot, setPromoCode, tryAddToCart } from '../src/features/cart/cart-logic';
import { addBagToCart, CART_ROUTE, clearCart, removeCartItem, setCartItemQuantity, setRestaurantPickupSlot } from '../src/features/cart/cart-actions';
import { cartReducer } from '../src/features/cart/cart-reducer';
import { dispatchCart, getCart, resetCartStore } from '../src/features/cart/cart-store';
import { ensurePaymentSession, PAYMENT_METHOD_ROUTE, paymentRoute, paymentSuccessRoute, pickupQrRoute, placeCheckout, retryOrderPayment, selectPickupSlot, CHECKOUT_ROUTE, PICKUP_TIME_ROUTE, SUMMARY_ROUTE } from '../src/features/checkout/checkout-actions';
import { buildCheckoutView, canSelectSlot, getCheckoutProgress, getPickupWindow, listSlotsInWindow } from '../src/features/checkout/checkout-logic';
import { getPaymentSession, resetCheckoutStore } from '../src/features/checkout/checkout-store';
import { classifyPickupError, confirmReceived, simulateStaffScan } from '../src/features/pickup/pickup-actions';
import { getNextPickupStep, getOrderPosition, getPickupGate, getPickupStage, getPickupStatusText, PICKUP_INSTRUCTION_STEPS, resolvePickupRoute } from '../src/features/pickup/pickup-logic';
import { calcImpact } from '../src/utils/impact';
import { clampOrbPosition, defaultOrbPosition, isOrbDrag, ORB_MARGIN } from '../src/components/ai/orb-position';
import { appendChatMessage, getChatMessages, resetChatStore } from '../src/features/ai/chat-store';
import { applySearchRefinements, countActiveFilters, emptySearchFilters, filterSearchResults, SEARCH_SORT_OPTIONS, sortSearchResults } from '../src/utils/search-refine';
import { APPLE_LOGIN_NOTICE, continueWithApple, FORGOT_PASSWORD_NOTICE } from '../src/features/auth/social-login';
import { getDirectionsUrl } from '../src/features/pickup/directions-logic';
import { signOut, updateProfile } from '../src/features/account/account-actions';
import { formatMemberSince, getAccountSummary, getInitial } from '../src/features/account/account-logic';
import { reorderOrder } from '../src/features/order-history/order-history-actions';
import { countOrdersByTab, filterOrders, getDefaultTab, getOrderAction, getOrderCardSubtitle, getOrderTab, getRefundLine, isActiveOrder, isOrderOwnedBy, ORDER_TABS, resolveOrderRoute, summarizeCompleted, type OrderTab } from '../src/features/order-history/order-history-logic';
import { buildCartView } from '../src/features/cart/cart-view';
import { getAlternativeListings, getBagAvailability, getStockLabel, summarizeAllergens } from '../src/features/food-bag/food-bag-logic';
import { getAddToCartSheetState, getSheetTotal } from '../src/features/food-bag/use-add-to-cart';
import { getPostLoginRoute, getProtectedRedirect, getSplashRoute, GUEST_PREVIEW_ENABLED, HOME_ROUTE, canAccessAuthScreen, resolveAuthRoute, type AuthScreen } from '../src/features/auth/auth-routing';
import { authReducer, getAuthProfile, getAuthStage, initialAuthState, type AuthEvent, type AuthState } from '../src/features/auth/auth-state';
import { dispatchAuth, getAuthState, resetAuthStore } from '../src/features/auth/auth-store';
import { completeOnboarding, createProfile, login, resendOtp, selectArea, startRegistration, submitOtp } from '../src/features/auth/auth-actions';
import { ONBOARDING_SLIDES } from '../src/features/auth/onboarding';
import { DEMO_OTP, DEMO_PASSWORD } from '../src/data/mock/auth';
import { OTP_RESEND_SECONDS, SPLASH_DURATION_MS } from '../src/constants/policy';
import { AUTH_MESSAGES, isValidEmail, isValidName, isValidOtp, isValidPassword, isValidPhone, normalizePhone } from '../src/utils/auth-validation';
import { tickCountdown } from '../src/utils/countdown';
import { devAdvanceOrder, devExpireOrder, devCancelOrder, devSetPaymentScenario } from '../src/features/dev/dev-actions';
import { canRetryPayment, derivePaymentPhase, holdSecondsLeft } from '../src/features/payment/payment-phase';
import { settlePayment } from '../src/features/payment/settle-payment';
import { aiService } from '../src/services/ai';
import { api } from '../src/services/api';
import { paymentService, setMockPaymentScenario } from '../src/services/payment';
import type { Cart, Order, OrderState, OrderStatus, PaymentQr, PickupQr, PickupSlot } from '../src/types';
import { canCancel, canExpire, canTransition, computeOrderMoney, formatOrderCode, isTerminal, orderCodeToTransferNote, transitionOrder } from '../src/utils';

let passed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (e) {
    failures.push(name);
    console.log(`  FAIL  ${name}\n        ${(e as Error).message}`);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const APP = path.join(SRC, 'app');
const REF_CSS = path.join(ROOT, 'reference', 'ecobite-82-screen-reference', 'css', 'styles.css');

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
  );
}
const read = (f: string) => fs.readFileSync(f, 'utf8');
/** Source without comments, so checks look at code only. */
const code = (f: string) =>
  read(f)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
const srcFiles = () => walk(SRC).filter((x) => /\.tsx?$/.test(x));

/** File -> URL path pattern, e.g. order/[orderId]/payment.tsx -> /order/:/payment */
function routePattern(file: string): string | null {
  const rel = path.relative(APP, file).replace(/\\/g, '/');
  if (!rel.endsWith('.tsx') || rel.split('/').pop()!.startsWith('_layout')) return null;
  const segs = rel
    .replace(/\.tsx$/, '')
    .split('/')
    .filter((s) => !/^\(.*\)$/.test(s))
    .map((s) => (/^\[.*\]$/.test(s) ? ':' : s));
  if (segs[segs.length - 1] === 'index') segs.pop();
  return '/' + segs.join('/');
}

const slot = (label: string): PickupSlot => {
  const [start, end] = label.split(' – ');
  return { label, date: '2026-09-14', start, end };
};

async function main() {
  // ---------- routes + links ----------
  console.log('\n[1-2] Routes and navigation links');
  const files = walk(APP);
  const routeFiles = files.filter((f) => routePattern(f) !== null);
  const patterns = routeFiles.map((f) => routePattern(f)!);
  const EXPECTED = [
    '/', '/onboarding', '/welcome', '/login', '/register', '/otp', '/create-profile', '/location-permission', '/select-location',
    '/home', '/orders', '/cart', '/account',
    '/search', '/search/results',
    '/restaurant/:', '/food-bag/:', '/food-bag/:/add-to-cart',
    '/order/checkout', '/order/pickup-time', '/order/summary', '/order/payment-method',
    '/order/:', '/order/:/status',
    '/order/:/payment', '/order/:/payment-success', '/order/:/pickup-qr',
    '/order/:/pickup-instructions', '/order/:/ready', '/order/:/arrived',
    '/order/:/verified', '/order/:/completed', '/account/edit',
    '/ai', '/ai/history',
  ];

  await test('35 routes registered: 24 MVP + search flow/account/status + 2 AI + 4 auth + Payment Method (6.8) + Edit Profile (10.2)', () => {
    assert.equal(patterns.length, 35, `found ${patterns.length}`);
    assert.deepEqual([...patterns].sort(), [...EXPECTED].sort());
  });
  await test('no duplicate route URLs', () => {
    assert.equal(new Set(patterns).size, patterns.length);
  });
  await test('every route has a default export', () => {
    for (const f of routeFiles) assert.match(read(f), /export default function/, f);
  });
  await test('every route group has a _layout', () => {
    for (const d of ['(auth)', '(main)', 'order', 'ai', 'search', 'food-bag/[id]', 'restaurant/[id]']) {
      assert.ok(fs.existsSync(path.join(APP, d, '_layout.tsx')), d);
    }
    assert.ok(fs.existsSync(path.join(APP, '_layout.tsx')));
  });
  await test('root layout registers screens that exist on disk', () => {
    for (const [, name] of read(path.join(APP, '_layout.tsx')).matchAll(/<Stack\.Screen name="([^"]+)"/g)) {
      const p = path.join(APP, name);
      assert.ok(
        fs.existsSync(p) || fs.existsSync(p + '.tsx') || fs.existsSync(path.join(p, '_layout.tsx')),
        `Stack.Screen "${name}" has no matching route`,
      );
    }
  });
  await test('D-14: tabs are exactly Home · Orders · Cart · Account; search is not a tab', () => {
    const src = read(path.join(APP, '(main)', '_layout.tsx'));
    const names = [...src.matchAll(/<Tabs\.Screen name="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(names, ['home', 'orders', 'cart', 'account']);
    for (const n of names) assert.ok(fs.existsSync(path.join(APP, '(main)', n + '.tsx')), n);
    assert.ok(!fs.existsSync(path.join(APP, '(main)', 'search.tsx')));
  });
  await test('D-14: search is a stack flow (/search, /search/results)', () => {
    assert.ok(fs.existsSync(path.join(APP, 'search', 'index.tsx')));
    assert.ok(fs.existsSync(path.join(APP, 'search', 'results.tsx')));
  });
  await test('restaurant/[id] is a folder (index.tsx), not a file', () => {
    assert.ok(fs.existsSync(path.join(APP, 'restaurant', '[id]', 'index.tsx')));
    assert.ok(!fs.existsSync(path.join(APP, 'restaurant', '[id].tsx')));
  });
  await test('D-5: /order/[orderId] = detail (9.5), /order/[orderId]/status = timeline (8.2)', () => {
    assert.ok(fs.existsSync(path.join(APP, 'order', '[orderId]', 'index.tsx')));
    assert.ok(fs.existsSync(path.join(APP, 'order', '[orderId]', 'status.tsx')));
  });
  await test('D-6: one payment route; no separate waiting/failed/expired routes', () => {
    const payment = patterns.filter((p) => /payment/.test(p));
    assert.deepEqual(payment.sort(), ['/order/:/payment', '/order/:/payment-success', '/order/payment-method']);
  });
  await test('D-3: payment success links to Pickup QR (8.3), not to instructions (8.1)', () => {
    const src = read(path.join(APP, 'order', '[orderId]', 'payment-success.tsx'));
    // the screen goes through the checkout feature's helper, which targets the pickup-qr route
    assert.match(src, /pickupQrRoute/);
    assert.match(read(path.join(SRC, 'features', 'checkout', 'checkout-actions.ts')), /\/pickup-qr/);
    assert.doesNotMatch(src, /pickup-instructions/);
    assert.doesNotMatch(read(path.join(SRC, 'features', 'checkout', 'checkout-actions.ts')), /pickup-instructions/);
  });
  await test('every href resolves to a registered route; every non-root route is reachable', () => {
    const matches = (href: string) =>
      patterns.filter((p) => {
        const a = p.split('/');
        const b = href.split('/');
        return a.length === b.length && a.every((s, i) => s === ':' || s === b[i]);
      });
    const tabs = read(path.join(APP, '(main)', '_layout.tsx'));
    const reached = new Set<string>(
      [...tabs.matchAll(/<Tabs\.Screen name="([^"]+)"/g)].map((m) => '/' + m[1]),
    );
    for (const f of routeFiles) {
      for (const [, href] of read(f).matchAll(/href[:=]\s*['"]([^'"]+)['"]/g)) {
        const hit = matches(href);
        assert.ok(hit.length > 0, `${path.relative(ROOT, f)} links to unknown route ${href}`);
        hit.forEach((p) => reached.add(p));
      }
    }
    // Object-form and string navigation: router.push({ pathname: '/restaurant/[id]', params }), router.push('/search').
    for (const f of routeFiles) {
      const src = read(f);
      const targets = [...src.matchAll(/pathname:\s*'(\/[^']*)'/g), ...src.matchAll(/router\.(?:push|replace)\(\s*'(\/[^']*)'/g)].map((m) => m[1].replace(/\[[^\]]+\]/g, ':'));
      for (const href of targets) {
        const hit = matches(href);
        assert.ok(hit.length > 0, `${path.relative(ROOT, f)} navigates to unknown route ${href}`);
        hit.forEach((r) => reached.add(r));
      }
    }
    // Routes built by helpers with a template literal, e.g. `/order/${orderId}/payment-success`.
    for (const f of srcFiles()) {
      for (const [, tpl] of read(f).matchAll(/`(\/[a-z-]+(?:\/(?:\$\{[^}]+\}|[a-z-]+))+)`/g)) matches(tpl.replace(/\$\{[^}]+\}/g, ':')).forEach((r) => reached.add(r));
    }
    // Routes navigated to through constants (router.push(LOGIN_ROUTE), router.replace(result.route)).
    for (const f of srcFiles()) {
      for (const [, route] of read(f).matchAll(/[A-Z_]+_ROUTE\s*=\s*'(\/[^']*)'/g)) matches(route).forEach((p) => reached.add(p));
    }
    const unreachable = patterns.filter((p) => p !== '/' && !reached.has(p));
    assert.deepEqual(unreachable, [], `unreachable: ${unreachable.join(', ')}`);
  });
  await test('mock ids used in links exist in mock data', async () => {
    assert.ok(await api.getRestaurant('res_01'));
    assert.ok(await api.getFoodBag('bag_01'));
    assert.ok(await api.getOrder('ord_2409_017'));
  });

  // ---------- D-8 / D-9 ----------
  console.log('\n[D-8/9] Auth routing');
  await test('D-8: first login → Location Permission; returning user → Home', () => {
    assert.equal(getPostLoginRoute({ hasCompletedLocationSetup: false }), '/location-permission');
    assert.equal(getPostLoginRoute({ hasCompletedLocationSetup: true }), '/home');
    assert.equal(getSplashRoute({ isAuthenticated: true, hasCompletedLocationSetup: true }), '/home');
    assert.equal(getSplashRoute({ isAuthenticated: true, hasCompletedLocationSetup: false }), '/location-permission');
    assert.equal(getSplashRoute({ isAuthenticated: false, hasCompletedLocationSetup: false }), '/onboarding');
  });
  await test('D-9: guest preview is disabled and has no route', () => {
    assert.equal(GUEST_PREVIEW_ENABLED, false);
    assert.ok(!patterns.some((p) => /guest|preview/.test(p)));
  });

  // ---------- design tokens ----------
  console.log('\n[D-11/12/13] Design tokens and hygiene');
  await test('D-12: colour tokens equal the reference CSS :root values', () => {
    const css = read(REF_CSS);
    const ref: Record<string, string> = {};
    for (const [, k, v] of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g)) ref[k] = v.toUpperCase();
    const map: Record<string, keyof typeof Colors> = {
      la: 'primary', 'la-dam': 'primaryDark', 'la-chu': 'primaryText', 'la-sang': 'primaryLight',
      'bac-ha': 'mint', 'bac-ha-2': 'mintBorder', giay: 'paper', the: 'white',
      muc: 'text', 'muc-mo': 'textMuted', 'muc-rat-mo': 'textFaint',
      ke: 'border', 'ke-2': 'divider', hophach: 'warning', do: 'danger', lam: 'info',
    };
    for (const [cssName, token] of Object.entries(map)) {
      assert.ok(ref[cssName], `reference missing --${cssName}`);
      assert.equal(String(Colors[token]).toUpperCase(), ref[cssName], `${token} != --${cssName}`);
    }
    assert.equal(Colors.paper, '#FDFDFB');
  });
  await test('D-12: Nunito only (600/700/800), no Be Vietnam Pro anywhere in src', () => {
    for (const family of Object.values(FontFamily)) assert.match(family, /^Nunito_(600|700|800)/);
    for (const v of Object.values(Typography)) assert.match(v.fontFamily, /^Nunito_/);
    for (const f of srcFiles()) assert.doesNotMatch(read(f), /BeVietnam/i, f);
  });
  await test('D-11: light theme only (no dark palette, no colour-scheme hooks)', () => {
    assert.equal(JSON.parse(read(path.join(ROOT, 'app.json'))).expo.userInterfaceStyle, 'light');
    for (const f of srcFiles()) assert.doesNotMatch(read(f), /useColorScheme|darkColors|Colors\.dark/, f);
  });
  await test('D-13: no delivery-fee / delivery concepts in src', () => {
    for (const f of srcFiles()) {
      assert.doesNotMatch(code(f), /deliveryFee|delivery_fee|deliveryAddress|\b(shipper|courier|driver)\b|Phí giao hàng/i, f);
    }
  });
  await test('D-15: only the three approved dependencies were added', () => {
    const pkg = JSON.parse(read(path.join(ROOT, 'package.json')));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const d of ['react-native-svg', 'expo-linear-gradient', 'react-native-qrcode-svg']) assert.ok(deps[d], d);
    for (const d of ['expo-clipboard', 'expo-image-picker', 'expo-brightness', 'expo-location', '@expo/vector-icons']) {
      assert.ok(!deps[d], `${d} must not be installed yet`);
    }
  });
  await test('D-16: feature folders discovery / notifications / account exist', () => {
    for (const d of ['discovery', 'notifications', 'account']) {
      assert.ok(fs.existsSync(path.join(SRC, 'features', d)), d);
    }
  });
  await test('D-17: dev menu is only mounted behind __DEV__ and only calls features/dev', () => {
    assert.match(read(path.join(APP, '_layout.tsx')), /__DEV__ \? require\('@\/components\/dev\/DevMenu'\)/);
    for (const f of srcFiles()) {
      if (f.includes(`${path.sep}components${path.sep}dev${path.sep}`) || f.includes(`${path.sep}features${path.sep}dev${path.sep}`)) continue;
      if (f.endsWith(`${path.sep}app${path.sep}_layout.tsx`)) continue;
      assert.doesNotMatch(read(f), /components\/dev|features\/dev/, `${path.relative(ROOT, f)} imports dev tooling`);
    }
    assert.doesNotMatch(read(path.join(SRC, 'features', 'dev', 'dev-actions.ts')), /if \(__DEV__|__DEV__ [?&]/);
  });

  // ---------- cart (D-1) ----------
  console.log('\n[D-1] Multi-restaurant cart');
  const bag01 = (await api.getFoodBag('bag_01'))!;
  const bag06 = (await api.getFoodBag('bag_06'))!;
  const bag02 = (await api.getFoodBag('bag_02'))!;
  let cart: Cart = EMPTY_CART;
  await test('one cart holds bags from several restaurants (no reset)', () => {
    cart = addToCart(cart, bag01, 2, true);
    cart = addToCart(cart, bag06, 1);
    assert.equal(cart.items.length, 2);
    assert.equal(getCartCount(cart), 3);
    assert.equal(getCartTotal(cart), 2 * 45000 + 25000);
  });
  await test('quantity is clamped to what the restaurant has left', () => {
    const c = addToCart(EMPTY_CART, bag02, 5);
    assert.equal(c.items[0].quantity, bag02.left);
  });
  await test('groupCartByRestaurant: one group per restaurant, first-added order', () => {
    const groups = groupCartByRestaurant(cart);
    assert.deepEqual(groups.map((g) => g.restaurantId), ['res_01', 'res_06']);
    assert.deepEqual(groups.map((g) => g.count), [2, 1]);
    assert.deepEqual(groups.map((g) => g.subtotal), [90000, 25000]);
  });
  await test('checkout is blocked until every restaurant has a pickup time', () => {
    assert.equal(isReadyForCheckout(cart), false);
    cart = setPickupSlot(cart, 'res_01', slot('18:30 – 19:00'));
    assert.equal(isReadyForCheckout(cart), false);
    cart = setPickupSlot(cart, 'res_06', slot('19:30 – 20:00'));
    assert.equal(isReadyForCheckout(cart), true);
  });
  await test('removing a restaurant\'s last bag drops its pickup slot', () => {
    const c = removeFromCart(cart, 'bag_06');
    assert.deepEqual(Object.keys(c.pickupSlots), ['res_01']);
    assert.equal(removeFromCart(c, 'bag_01').promoCode, null);
  });
  await test('money breakdown: total = subtotal - promo - own box (no delivery fee)', () => {
    const m = computeOrderMoney(
      [{ unitPrice: 45000, originalPrice: 56000, quantity: 2, ownBox: true }],
      { code: 'ECOBITE10K', label: '', minTotal: 80000, amount: 10000, expires: '20/09', usable: true },
    );
    assert.deepEqual(m, { subtotal: 90000, bagSavings: 22000, promoDiscount: 10000, ownBoxDiscount: 4000, total: 76000 });
    assert.deepEqual(Object.keys(m).sort(), ['bagSavings', 'ownBoxDiscount', 'promoDiscount', 'subtotal', 'total']);
  });
  await test('seed orders satisfy the money invariant', () => {
    for (const o of mockOrders) {
      assert.equal(o.money.total, o.money.subtotal - o.money.promoDiscount - o.money.ownBoxDiscount, o.orderCode);
    }
  });

  // ---------- checkout: one order per restaurant ----------
  console.log('\n[D-1/D-2/D-7] Checkout → orders → pickup QR');
  let orderA = '';
  let orderB = '';
  let codeA = '';
  await test('checkout creates ONE order per restaurant, sharing a checkoutId', async () => {
    const result = await api.checkout({ cart: setPromoCode(cart, 'ECOBITE10K') });
    assert.equal(result.orders.length, 2);
    const [a, b] = result.orders;
    assert.equal(a.checkoutId, result.checkoutId);
    assert.equal(b.checkoutId, result.checkoutId);
    assert.notEqual(a.orderCode, b.orderCode);
    assert.match(a.orderCode, /^EB-\d{4}-\d{3}$/);
    assert.equal(a.restaurantId, 'res_01');
    assert.equal(b.restaurantId, 'res_06');
    for (const o of result.orders) {
      assert.equal(o.status, 'placed');
      assert.equal(o.paymentStatus, 'pending');
      assert.equal(o.pickupQr, null);
      assert.equal(o.cancellation, null);
    }
    // promo: applied once, to the first qualifying restaurant (90.000đ >= 80.000đ)
    assert.equal(a.money.total, 76000);
    assert.equal(a.promoCode, 'ECOBITE10K');
    assert.equal(b.money.total, 25000);
    assert.equal(b.promoCode, null);
    orderA = a.id; orderB = b.id; codeA = a.orderCode;
  });
  await test('checkout rejects: missing pickup slot, unavailable bag, empty cart, unknown promo', async () => {
    await assert.rejects(api.checkout({ cart: { ...cart, pickupSlots: {} } }), /pickup time/);
    const sushi = (await api.getFoodBag('bag_07'))!;
    const soldOut: Cart = {
      items: [{ foodBagId: sushi.id, restaurantId: sushi.restaurantId, name: sushi.name, quantity: 1, unitPrice: sushi.price, originalPrice: sushi.originalPrice, ownBox: false }],
      pickupSlots: { [sushi.restaurantId]: slot('18:00 – 18:30') },
      promoCode: null,
    };
    await assert.rejects(api.checkout({ cart: soldOut }), /Bag unavailable/);
    await assert.rejects(api.checkout({ cart: EMPTY_CART }), /empty/i);
    await assert.rejects(api.checkout({ cart: { ...cart, promoCode: 'NOPE' } }), /Unknown promo/);
  });
  await test('order code helpers', () => {
    assert.equal(formatOrderCode(new Date(2026, 8, 14), 17), 'EB-2609-017');
    assert.equal(orderCodeToTransferNote('EB-2409-017'), 'EB2409017');
  });

  // ---------- payment ----------
  console.log('\n[D-4/D-6/D-10] Payment');
  const pay = (orderId: string, orderCode: string, amount: number) =>
    paymentService.createPayment({ orderId, orderCode, amount });
  const resolves = async (outcome: 'success' | 'failed' | 'expired') => {
    setMockPaymentScenario({ outcome, resolveAfterMs: 60 });
    const session = await pay('x', 'EB-2409-999', 30000);
    const early = await paymentService.getPaymentStatus(session.id);
    await sleep(90);
    return { session, early, late: await paymentService.getPaymentStatus(session.id) };
  };
  await test('payment: pending session has a PAYMENT QR, bank details and a 10-minute hold', async () => {
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 5000 });
    const s = await pay('x', 'EB-2409-999', 30000);
    assert.equal(s.status, 'pending');
    assert.equal(s.qr.kind, 'payment');
    assert.equal(s.qr.amount, 30000);
    assert.equal(s.bank.transferNote, 'EB2409999');
    assert.equal(s.bank.isDemo, true);
    assert.equal(s.retryUntil, null);
    const holdMs = Date.parse(s.holdExpiresAt) - Date.parse(s.createdAt);
    assert.equal(holdMs, 10 * 60 * 1000);
    assert.equal((await paymentService.getPaymentStatus(s.id)).status, 'pending');
  });
  await test('payment: success', async () => assert.equal((await resolves('success')).late.status, 'success'));
  await test('payment: failed sets a 5-minute retry window', async () => {
    const { late } = await resolves('failed');
    assert.equal(late.status, 'failed');
    assert.ok(late.retryUntil);
    assert.ok(canRetryPayment(late));
    assert.equal(Date.parse(late.retryUntil!) - Date.parse(late.createdAt) - 60, 5 * 60 * 1000);
  });
  await test('payment: expired', async () => assert.equal((await resolves('expired')).late.status, 'expired'));
  await test('payment: unknown id rejects', async () => {
    await assert.rejects(paymentService.getPaymentStatus('nope'));
  });
  await test('D-4/D-10: only QR bank transfer is enabled; others disabled with "Sắp có"', async () => {
    const methods = await paymentService.listPaymentMethods();
    assert.deepEqual(methods.filter((m) => m.enabled).map((m) => m.id), ['bank_qr']);
    for (const m of methods.filter((x) => !x.enabled)) assert.equal(m.badge, 'Sắp có');
    assert.equal(mockPaymentMethods.length, 4);
    await assert.rejects(paymentService.createPayment({ orderId: 'x', orderCode: 'EB-2409-999', amount: 1, method: 'cash' }), /not available/);
  });
  await test('D-6: single-route phases derive from the session', () => {
    const base = { createdAt: new Date(1_000_000).toISOString() };
    assert.equal(derivePaymentPhase({ ...base, status: 'pending' }, 1_000_000 + 1000), 'qr');
    assert.equal(derivePaymentPhase({ ...base, status: 'pending' }, 1_000_000 + 5000), 'waiting');
    for (const s of ['success', 'failed', 'expired'] as const) assert.equal(derivePaymentPhase({ ...base, status: s }), s);
    assert.equal(holdSecondsLeft({ holdExpiresAt: new Date(1_060_000).toISOString() }, 1_000_000), 60);
    assert.equal(holdSecondsLeft({ holdExpiresAt: new Date(1_000_000).toISOString() }, 2_000_000), 0);
  });
  await test('failed payment leaves the order placed; retry succeeds; order becomes paid + QR issued', async () => {
    const before = (await api.getOrder(orderB))!;
    setMockPaymentScenario({ outcome: 'failed', resolveAfterMs: 60 });
    const first = await pay(before.id, before.orderCode, before.money.total);
    await sleep(90);
    const failed = await paymentService.getPaymentStatus(first.id);
    assert.equal(failed.status, 'failed');
    assert.equal(await settlePayment(failed), null);
    assert.equal((await api.getOrder(orderB))!.status, 'placed');
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 5000 });
    await assert.rejects(paymentService.retryPayment((await pay('y', 'EB-2409-998', 1)).id), /failed/);
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 60 });
    const retry = await paymentService.retryPayment(first.id);
    assert.equal(retry.orderId, before.id);
    assert.notEqual(retry.id, first.id);
    await sleep(90);
    const ok = await paymentService.getPaymentStatus(retry.id);
    assert.equal(ok.status, 'success');
    const paid = (await settlePayment(ok))!;
    assert.equal(paid.status, 'paid');
    assert.equal(paid.pickupQr?.orderCode, before.orderCode);
    assert.equal((await settlePayment(ok))!.status, 'paid'); // idempotent
  });
  await test('expired payment expires the order (terminal, outside the main sequence)', async () => {
    const [o] = (await api.checkout({ cart: removeFromCart(cart, 'bag_06') })).orders;
    setMockPaymentScenario({ outcome: 'expired', resolveAfterMs: 60 });
    const s = await pay(o.id, o.orderCode, o.money.total);
    await sleep(90);
    const expired = (await settlePayment(await paymentService.getPaymentStatus(s.id)))!;
    assert.equal(expired.status, 'expired');
    assert.equal(expired.paymentStatus, 'expired');
    assert.ok(expired.statusHistory.expired);
    assert.ok(isTerminal(expired));
    assert.equal(canCancel(expired), false);
  });

  // ---------- lifecycle ----------
  console.log('\n[D-2] Order lifecycle');
  await test('main sequence is exactly the 6 statuses; cancelled/expired sit outside it', () => {
    assert.deepEqual([...ORDER_STATUS_SEQUENCE], ['placed', 'paid', 'preparing', 'ready', 'qr_verified', 'picked_up']);
    assert.deepEqual([...ORDER_EXCEPTION_STATUSES], ['cancelled', 'expired']);
    for (const e of ORDER_EXCEPTION_STATUSES) assert.ok(!(ORDER_STATUS_SEQUENCE as readonly string[]).includes(e));
    assert.equal(canTransition('placed', 'ready'), false);
    assert.equal(canTransition('cancelled', 'paid'), false);
    assert.equal(canTransition('expired', 'paid'), false);
    assert.throws(() => transitionOrder({ status: 'placed', statusHistory: {} } as never, 'ready'));
  });
  let token = '';
  await test('order A (paid via multi-order checkout): PAID', async () => {
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 30 });
    const o = (await api.getOrder(orderA))!;
    const s = await pay(o.id, o.orderCode, o.money.total);
    await sleep(60);
    const paid = (await settlePayment(await paymentService.getPaymentStatus(s.id)))!;
    assert.equal(paid.status, 'paid');
    assert.equal(paid.paymentStatus, 'success');
    assert.equal(paid.pickupQr?.kind, 'pickup');
    assert.equal(paid.pickupQr?.verifiedAt, null);
    token = paid.pickupQr!.token;
  });
  await test('D-7: pickup QR has an opaque token AND the orderCode; they are different', async () => {
    const qr = (await api.getPickupQr(orderA))!;
    assert.equal(qr.orderCode, codeA);
    assert.ok(qr.token.length >= 8);
    assert.notEqual(qr.token, qr.orderCode);
    assert.ok(!qr.token.includes(qr.orderCode));
  });
  await test('two orders of one checkout have distinct pickup QR tokens', async () => {
    const a = (await api.getPickupQr(orderA))!;
    const b = (await api.getPickupQr(orderB))!;
    assert.notEqual(a.token, b.token);
    assert.notEqual(a.orderCode, b.orderCode);
  });
  await test('PREPARING → READY (restaurant simulation)', async () => {
    assert.equal((await api.simulateRestaurantProgress(orderA)).status, 'preparing');
    assert.equal((await api.simulateRestaurantProgress(orderA)).status, 'ready');
  });
  console.log('\n[5] Pickup QR verification');
  await test('wrong token, order code, and PAYMENT QR payload are all rejected', async () => {
    await assert.rejects(api.verifyPickupQr(orderA, 'wrong-token'), /Invalid pickup QR/);
    await assert.rejects(api.verifyPickupQr(orderA, codeA), /Invalid pickup QR/);
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 1 });
    const p = await pay(orderA, codeA, 1);
    await assert.rejects(api.verifyPickupQr(orderA, p.qr.payload), /Invalid pickup QR/);
    assert.equal((await api.getOrder(orderA))!.status, 'ready');
  });
  await test('QR_VERIFIED: correct token verifies, stamps verifiedAt, cannot verify twice', async () => {
    const o = await api.verifyPickupQr(orderA, token);
    assert.equal(o.status, 'qr_verified');
    assert.ok(o.pickupQr?.verifiedAt);
    await assert.rejects(api.verifyPickupQr(orderA, token));
  });
  await test('COMPLETED (picked_up): history has all six timestamps; order is terminal', async () => {
    const o = await api.completePickup(orderA);
    assert.equal(o.status, 'picked_up');
    for (const s of ORDER_STATUS_SEQUENCE) assert.ok(o.statusHistory[s], `missing history for ${s}`);
    assert.ok(isTerminal(o));
    assert.equal((await api.simulateRestaurantProgress(orderA)).status, 'picked_up');
    await assert.rejects(api.completePickup(orderA));
  });
  await test('cancellation: only before preparing; refund rules; QR invalidated; terminal', async () => {
    const [unpaid] = (await api.checkout({ cart: removeFromCart(cart, 'bag_06') })).orders;
    const c1 = await api.cancelOrder(unpaid.id, 'Đặt nhầm');
    assert.equal(c1.status, 'cancelled');
    assert.equal(c1.cancellation?.cancelledBy, 'customer');
    assert.deepEqual(c1.cancellation?.refund, { amount: 0, status: 'none', refundedAt: null });
    assert.ok(c1.statusHistory.cancelled);
    assert.ok(isTerminal(c1));
    await assert.rejects(api.cancelOrder(unpaid.id, 'again'), /cannot be cancelled/);

    // paid order: full refund pending
    const [paidOrder] = (await api.checkout({ cart: removeFromCart(cart, 'bag_06') })).orders;
    await api.markOrderPaid(paidOrder.id);
    const c2 = await api.cancelOrder(paidOrder.id, 'Không tới kịp giờ');
    assert.equal(c2.cancellation?.refund.amount, paidOrder.money.total);
    assert.equal(c2.cancellation?.refund.status, 'pending');
    assert.equal(c2.pickupQr, null);
    await assert.rejects(api.verifyPickupQr(paidOrder.id, 'x'), /Invalid pickup QR/);

    // once preparing it can no longer be cancelled
    const [prep] = (await api.checkout({ cart: removeFromCart(cart, 'bag_06') })).orders;
    await api.markOrderPaid(prep.id);
    await api.simulateRestaurantProgress(prep.id);
    assert.equal(canCancel((await api.getOrder(prep.id))!), false);
    await assert.rejects(api.cancelOrder(prep.id, 'late'), /cannot be cancelled/);
  });
  await test('expire only from placed', async () => {
    const [o] = (await api.checkout({ cart: removeFromCart(cart, 'bag_06') })).orders;
    assert.ok(canExpire(o));
    await api.markOrderPaid(o.id);
    await assert.rejects(api.expireOrder(o.id), /cannot expire/);
  });
  await test('seed data contains cancelled (with refund) and expired orders', () => {
    const cancelled = mockOrders.find((o) => o.status === 'cancelled')!;
    assert.equal(cancelled.cancellation?.refund.status, 'refunded');
    assert.ok(mockOrders.some((o) => o.status === 'expired'));
    assert.ok(mockOrders.some((o) => o.checkoutId === mockOrders[0].checkoutId && o.id !== mockOrders[0].id), 'multi-order checkout seed');
  });
  await test('listOrders sorted newest first', async () => {
    const times = (await api.listOrders()).map((o) => Date.parse(o.createdAt));
    assert.deepEqual(times, [...times].sort((a, b) => b - a));
  });

  // ---------- D-17 dev actions ----------
  console.log('\n[D-17] Dev controls call existing services');
  await test('devAdvanceOrder walks placed → picked_up via the existing services', async () => {
    const [o] = (await api.checkout({ cart: removeFromCart(cart, 'bag_06') })).orders;
    const actions: string[] = [];
    for (let i = 0; i < 6; i++) {
      const r = await devAdvanceOrder(o.id);
      if (!r.ok) break;
      actions.push(r.action);
    }
    assert.deepEqual(actions, ['markOrderPaid', 'simulateRestaurantProgress', 'simulateRestaurantProgress', 'verifyPickupQr', 'completePickup']);
    assert.equal((await api.getOrder(o.id))!.status, 'picked_up');
    const done = await devAdvanceOrder(o.id);
    assert.equal(done.ok, false);
  });
  await test('dev actions refuse terminal exception states and propagate service rules', async () => {
    const [o] = (await api.checkout({ cart: removeFromCart(cart, 'bag_06') })).orders;
    await devExpireOrder(o.id);
    const r = await devAdvanceOrder(o.id);
    assert.equal(r.ok, false);
    const [p] = (await api.checkout({ cart: removeFromCart(cart, 'bag_06') })).orders;
    await devAdvanceOrder(p.id); // paid
    await devAdvanceOrder(p.id); // preparing
    await assert.rejects(devCancelOrder(p.id), /cannot be cancelled/);
    devSetPaymentScenario('failed', 40);
    const s = await pay('z', 'EB-2409-997', 10);
    await sleep(80);
    assert.equal((await paymentService.getPaymentStatus(s.id)).status, 'failed');
    devSetPaymentScenario('success');
  });

  // ---------- type level ----------
  console.log('\n[6] Type-level separation (proven by tsc; runtime shape checked here)');
  await test('PaymentQr and PickupQr cannot be confused; PickupQr needs token AND orderCode', () => {
    const payQr: PaymentQr = { kind: 'payment', payload: 'p', amount: 1, reference: 'r', expiresAt: 'e' };
    const pickQr: PickupQr = { kind: 'pickup', orderId: 'o', orderCode: 'EB-2409-017', token: 't', issuedAt: 'i', verifiedAt: null };
    // @ts-expect-error a PickupQr is not assignable to a PaymentQr
    const a: PaymentQr = pickQr;
    // @ts-expect-error a PaymentQr is not assignable to a PickupQr
    const b: PickupQr = payQr;
    // @ts-expect-error the payment QR has no pickup token
    void payQr.token;
    // @ts-expect-error the pickup QR has no payment payload
    void pickQr.payload;
    // @ts-expect-error a PickupQr must carry the orderCode
    const noCode: PickupQr = { kind: 'pickup', orderId: 'o', token: 't', issuedAt: 'i', verifiedAt: null };
    // Never called: compile-time check only.
    const neverCalled = () =>
      // @ts-expect-error verifying pickup needs a string token, not a whole PaymentQr
      api.verifyPickupQr('o', payQr);
    void neverCalled;
    assert.notEqual(payQr.kind, pickQr.kind);
    void a; void b; void noCode;
  });
  await test('cancelled/expired are NOT part of OrderStatus; no delivery fee on Order/OrderMoney', () => {
    // @ts-expect-error 'cancelled' is an OrderExceptionStatus, not a main OrderStatus
    const s: OrderStatus = 'cancelled';
    const order = mockOrders[0];
    // @ts-expect-error Order has no delivery fee
    void order.deliveryFee;
    // @ts-expect-error OrderMoney has no delivery fee
    void order.money.deliveryFee;
    void s;
  });

  // ---------- AI ----------
  console.log('\n[7] AI mock service and routes');
  await test('AI: quick prompt returns suggestions WITH reasons that point at core entities by id', async () => {
    const r = await aiService.sendMessage({ text: aiQuickPrompts[1], history: [] });
    assert.equal(r.role, 'assistant');
    const first = r.suggestions![0];
    assert.equal(first.target?.id, 'bag_04');
    assert.equal(first.reasons?.length, 4);
    for (const s of r.suggestions!) {
      const found = s.target!.type === 'restaurant' ? await api.getRestaurant(s.target!.id) : await api.getFoodBag(s.target!.id);
      assert.ok(found, `${s.target!.type}:${s.target!.id}`);
    }
  });
  await test('AI: every mock keyword entry replies; fallback for unknown input', async () => {
    for (const e of aiMockResponses) assert.equal((await aiService.sendMessage({ text: e.keywords[0], history: [] })).text, e.text);
    const r = await aiService.sendMessage({ text: 'zzzz', history: [] });
    assert.ok(r.text.length > 0);
    assert.equal(r.suggestions, undefined);
  });
  await test('AI: conversation history (11.5) mock', async () => {
    const list = await aiService.listConversations();
    assert.equal(list.length, aiConversationHistory.length);
    assert.equal(list.length, 5);
    assert.deepEqual([...new Set(list.map((c) => c.group))].sort(), ['earlier', 'today']);
  });
  await test('/ai and /ai/history routes exist; /ai uses the AI feature hook', () => {
    assert.match(read(path.join(APP, 'ai', 'index.tsx')), /@\/features\/ai/);
    assert.ok(fs.existsSync(path.join(APP, 'ai', 'history.tsx')));
  });
  await test('AI module does not import core ordering code', () => {
    const aiFiles = [
      ...walk(path.join(SRC, 'features', 'ai')),
      ...walk(path.join(SRC, 'services', 'ai')),
      ...walk(path.join(SRC, 'components', 'ai')),
      ...walk(path.join(SRC, 'data', 'ai')),
      ...walk(path.join(SRC, 'types', 'ai')),
      path.join(APP, 'ai', 'index.tsx'),
      path.join(APP, 'ai', 'history.tsx'),
    ];
    const forbidden = /from '(@\/(features\/(?!ai)|services\/(?!ai)|data\/mock|types(?!\/ai))|\.\.\/(cart|payment|order|api))/;
    for (const f of aiFiles) {
      const bad = read(f).split('\n').filter((l) => forbidden.test(l));
      assert.deepEqual(bad, [], `${path.relative(ROOT, f)}: ${bad.join(' | ')}`);
    }
  });

  // ---------- U1.1 shared UI ----------
  console.log('\n[U1.1] Shared UI / design system');
  const css = read(REF_CSS);
  /** Value of `prop` inside the reference rule that starts with `selector{`. */
  const cssProp = (selector: string, prop: string): string => {
    const start = css.indexOf(`${selector}{`);
    assert.ok(start >= 0, `reference CSS has no rule ${selector}`);
    const block = css.slice(start + selector.length + 1, css.indexOf('}', start));
    const m = block.match(new RegExp(`(?:^|[;\\s])${prop}:([^;]+)`));
    assert.ok(m, `rule ${selector} has no ${prop}`);
    return m![1].trim();
  };
  const px = (v: string) => parseFloat(v.replace('px', ''));
  const WEIGHT_FAMILY: Record<string, string> = { '600': FontFamily.semiBold, '700': FontFamily.bold, '800': FontFamily.extraBold };

  await test('tokens match the reference CSS: controls (button 50/15, input 48/14, card 18, chip 30, back chip 36/12)', () => {
    assert.equal(Sizes.buttonHeight, px(cssProp('.nut', 'height')));
    assert.equal(Radius.button, px(cssProp('.nut', 'border-radius')));
    assert.equal(FontSize.button, px(cssProp('.nut', 'font-size')));
    assert.equal(Sizes.buttonHeightSmall, px(cssProp('.nut.nho', 'height')));
    assert.equal(Sizes.buttonHeightTiny, px(cssProp('.nut.rat-nho', 'height')));
    assert.equal(Sizes.inputHeight, px(cssProp('.nhap .o', 'height')));
    assert.equal(Radius.md, px(cssProp('.nhap .o', 'border-radius')));
    assert.equal(Radius.lg, px(cssProp('.the-c', 'border-radius')));
    assert.equal(CardStyles.base.padding, px(cssProp('.the-c', 'padding')));
    assert.equal(Sizes.chipHeight, px(cssProp('.chip', 'height')));
    assert.equal(Sizes.backChip, px(cssProp('.nav .lui', 'width')));
    assert.equal(HeaderStyles.backChip.borderRadius, px(cssProp('.nav .lui', 'border-radius')));
    assert.equal(Radius.card, px(cssProp('.nh', 'border-radius')));
    assert.equal(Sizes.tabBadge, px(cssProp('.tab .gio', 'height')));
    assert.equal(TimelineStyles.dot, px(cssProp('.buoc .cham', 'width')));
    assert.equal(TimelineStyles.line, px(cssProp('.buoc .noi', 'width')));
    assert.equal(ButtonStyles.base.height, 50);
    assert.equal(ButtonStyles.base.borderRadius, 15);
  });
  await test('tokens match the reference CSS: typography sizes and weights', () => {
    const cases: Array<[keyof typeof Typography, string]> = [
      ['title', '.tieu'], ['section', '.tieu2'], ['cardTitle', '.tieu3'], ['body', '.doan'], ['caption', '.nho'],
    ];
    for (const [variant, selector] of cases) {
      assert.equal(Typography[variant].fontSize, px(cssProp(selector, 'font-size')), `${variant} size`);
      assert.equal(Typography[variant].fontFamily, WEIGHT_FAMILY[cssProp(selector, 'font-weight')], `${variant} weight`);
    }
    assert.equal(Typography.navTitle.fontSize, px(cssProp('.nav h4', 'font-size')));
    assert.equal(Typography.tabLabel.fontSize, px(cssProp('.tab span', 'font-size')));
    assert.equal(Typography.tabLabel.fontFamily, WEIGHT_FAMILY[cssProp('.tab span', 'font-weight')]);
    assert.equal(Typography.badge.fontSize, px(cssProp('.nhan-n', 'font-size')));
    assert.equal(TabBarStyles.label.fontSize, 10);
    assert.equal(ChipStyles.label.fontSize, px(cssProp('.chip', 'font-size')));
  });
  await test('tokens match the reference CSS: bottom sheet 26 / dialog 24 / handle 38x4 (from reference screens)', () => {
    const sheet = read(path.join(ROOT, 'reference', 'ecobite-82-screen-reference', 'screens', 'group-05', '05-06-add-to-cart.html'));
    assert.match(sheet, /border-radius:26px 26px 0 0;padding:10px 20px 26px/);
    assert.match(sheet, /width:38px;height:4px;border-radius:2px;background:#DDD9CC/);
    assert.equal(SheetStyles.container.borderTopLeftRadius, 26);
    assert.equal(SheetStyles.handle.width, 38);
    assert.equal(SheetStyles.handle.height, 4);
    assert.equal(SheetStyles.handle.backgroundColor, '#DDD9CC');
    const dialog = read(path.join(ROOT, 'reference', 'ecobite-82-screen-reference', 'screens', 'group-06', '06-03-remove-item.html'));
    assert.match(dialog, /border-radius:24px;padding:24px 22px 20px/);
    assert.equal(DialogStyles.card.borderRadius, 24);
    assert.equal(DialogStyles.iconCircle.width, 62);
  });
  await test('Nunito 400 is not reintroduced (fonts 600/700/800 only)', () => {
    for (const f of srcFiles()) assert.doesNotMatch(read(f), /Nunito_400|Nunito400/, f);
    assert.deepEqual(Object.values(FontFamily), ['Nunito_600SemiBold', 'Nunito_700Bold', 'Nunito_800ExtraBold']);
  });
  await test('button variants: primary · secondary · soft · destructive · danger · neutral', () => {
    assert.deepEqual(Object.keys(ButtonStyles.variants).sort(), ['danger', 'destructive', 'neutral', 'primary', 'secondary', 'soft']);
  });

  const COMMON = path.join(SRC, 'components');
  const REQUIRED = [
    'common/Screen', 'common/AppText', 'common/Button', 'common/Input', 'common/Card', 'common/Header', 'common/BottomTabBar',
    'common/Chip', 'common/Badge', 'common/Divider', 'common/BottomSheet', 'common/ConfirmDialog', 'common/EmptyState',
    'common/ErrorState', 'common/LoadingState', 'common/Skeleton', 'common/StatusBadge', 'common/PriceRow',
    'common/QuantityStepper', 'common/QrCode', 'common/FoodImage', 'common/BottomActionBar', 'common/icons/Icon',
    'ai/AiOrb', 'ai/ChatBubble',
    'restaurant/RestaurantCard', 'restaurant/RestaurantHeader', 'restaurant/RestaurantMeta', 'restaurant/RestaurantCategoryChip',
    'food-bag/FoodBagCard', 'food-bag/FoodBagImage', 'food-bag/FoodBagPrice', 'food-bag/FoodBagQuantity',
    'cart/CartItem', 'cart/CartRestaurantSection', 'cart/CartSummary', 'cart/PromoCodeRow',
    'order/OrderCard', 'order/OrderStatusBanner', 'order/OrderStatusTimeline', 'order/OrderPriceBreakdown', 'order/PickupInfo',
    'order/PickupTimePicker', 'order/PaymentMethodRow', 'order/PaymentQrCard', 'order/PickupQrCard',
  ];
  await test('all required shared components exist and are exported from their folder index', () => {
    for (const rel of REQUIRED) {
      assert.ok(fs.existsSync(path.join(COMMON, `${rel}.tsx`)), `${rel}.tsx missing`);
      const [folder, name] = rel.split('/');
      const indexFile = path.join(COMMON, folder, 'index.ts');
      if (name !== 'Icon') assert.match(read(indexFile), new RegExp(`from './${name}'`), `${rel} not exported`);
    }
  });
  await test('BottomTabBar renders exactly TAB_ITEMS (Home · Orders · Cart · Account), never Search', () => {
    assert.deepEqual(TAB_ITEMS.map((t) => t.key), ['home', 'orders', 'cart', 'account']);
    assert.deepEqual(TAB_ITEMS.map((t) => t.label), ['Trang chủ', 'Đơn hàng', 'Giỏ hàng', 'Tài khoản']);
    const bar = code(path.join(COMMON, 'common', 'BottomTabBar.tsx'));
    assert.match(bar, /TAB_ITEMS\.map/);
    assert.doesNotMatch(bar, /search|Tìm kiếm/i);
    assert.match(read(path.join(APP, '(main)', '_layout.tsx')), /BottomTabBar/);
    for (const t of TAB_ITEMS) {
      assert.ok(t.icon in ICONS && `${t.icon}Filled` in ICONS, `${t.key} needs stroke + filled icons`);
    }
  });
  await test('icons: geometry equals the reference SVG paths (only qr and one gift path are custom)', () => {
    const refPaths = new Set<string>();
    for (const f of walk(path.join(ROOT, 'reference', 'ecobite-82-screen-reference', 'screens'))) {
      for (const [, d] of read(f).matchAll(/\sd="([^"]+)"/g)) refPaths.add(d);
    }
    const missing: string[] = [];
    for (const [name, def] of Object.entries(ICONS)) {
      if (name === 'qr') continue;
      for (const prim of def.prims) {
        if ('d' in prim && !refPaths.has(prim.d) && !prim.d.startsWith('M12 8.5S10.6 4')) missing.push(`${name}: ${prim.d.slice(0, 40)}`);
      }
    }
    assert.deepEqual(missing, []);
    assert.ok(Object.keys(ICONS).length >= 25);
  });
  await test('components hold no hard-coded colours, font weights or font-family strings (tokens only)', () => {
    for (const f of walk(COMMON).filter((x) => /\.tsx?$/.test(x))) {
      const src = read(f);
      assert.doesNotMatch(src, /#[0-9A-Fa-f]{3,8}\b(?![A-Za-z])|rgba?\(/, `${path.relative(ROOT, f)}: hard-coded colour`);
      assert.doesNotMatch(src, /fontWeight|Nunito_/, `${path.relative(ROOT, f)}: font literal`);
    }
  });
  await test('shared components are presentational: no services / features / data imports (dev tooling excepted)', () => {
    for (const f of walk(COMMON).filter((x) => /\.tsx?$/.test(x) && !x.includes(`${path.sep}dev${path.sep}`))) {
      const bad = read(f).split('\n').filter((l) => /from '@\/(services|features|data)\b/.test(l));
      assert.deepEqual(bad, [], `${path.relative(ROOT, f)} imports business layers: ${bad.join(' | ')}`);
    }
  });
  await test('shared components do not use the router (navigation stays in callers)', () => {
    for (const f of walk(COMMON).filter((x) => /\.tsx?$/.test(x) && !x.endsWith('PlaceholderScreen.tsx'))) {
      assert.doesNotMatch(code(f), /from 'expo-router'/, path.relative(ROOT, f));
    }
  });
  await test('PaymentQrCard accepts only PaymentQr; PickupQrCard accepts only PickupQr', () => {
    type PayProps = ComponentProps<typeof PaymentQrCard>;
    type PickProps = ComponentProps<typeof PickupQrCard>;
    const pay: PaymentQr = { kind: 'payment', payload: 'p', amount: 1, reference: 'r', expiresAt: 'e' };
    const pick: PickupQr = { kind: 'pickup', orderId: 'o', orderCode: 'EB-2409-017', token: 't', issuedAt: 'i', verifiedAt: null };
    const okPay: PayProps = { qr: pay };
    const okPick: PickProps = { qr: pick };
    // @ts-expect-error a PickupQr cannot be rendered by the payment QR card
    const badPay: PayProps = { qr: pick };
    // @ts-expect-error a PaymentQr cannot be rendered by the pickup QR card
    const badPick: PickProps = { qr: pay };
    void okPay; void okPick; void badPay; void badPick;
    const src = read(path.join(COMMON, 'order', 'PickupQrCard.tsx'));
    assert.match(src, /qr\.token/);
    assert.match(src, /qr\.orderCode/);
    assert.match(read(path.join(COMMON, 'order', 'PaymentQrCard.tsx')), /qr\.payload/);
  });
  await test('format helpers: money, discount %, distance, countdown, Vietnam time', () => {
    assert.equal(formatMoney(45000), '45.000đ');
    assert.equal(formatMoney(1234567), '1.234.567đ');
    assert.equal(calcDiscountPercent(56000, 45000), 20);
    assert.equal(calcDiscountPercent(45000, 45000), 0);
    assert.equal(formatDistance(1.2), '1.2 km');
    assert.equal(formatCountdown(36 * 60 + 12), '36:12');
    assert.equal(formatCountdown(-5), '00:00');
    assert.equal(formatTimeVN('2026-09-14T17:36:00+07:00'), '17:36');
    assert.equal(formatTimeVN('2026-09-14T10:36:00Z'), '17:36'); // independent of device timezone
  });
  await test('order status tones/labels cover all 8 states; ready = green, preparing = amber, cancelled = red', () => {
    const states = [...ORDER_STATUS_SEQUENCE, ...ORDER_EXCEPTION_STATUSES];
    for (const s of states) {
      assert.ok(ORDER_STATUS_LABEL[s] && ORDER_STATUS_TONE[s], s);
    }
    assert.equal(ORDER_STATUS_TONE.ready, 'green');
    assert.equal(ORDER_STATUS_TONE.preparing, 'amber');
    assert.equal(ORDER_STATUS_TONE.cancelled, 'red');
  });
  await test('timeline steps: ready order → 4 done + current qr_verified; completed → all done; cancelled/expired → no current', () => {
    const ready = mockOrders.find((o) => o.status === 'ready')!;
    const s1 = getTimelineSteps(ready.status, ready.statusHistory);
    assert.deepEqual(s1.map((s) => s.state), ['done', 'done', 'done', 'done', 'current', 'pending']);
    assert.equal(s1[3].reachedAt, ready.statusHistory.ready);
    assert.deepEqual(s1.map((s) => s.label), ORDER_STATUS_SEQUENCE.map((s) => ORDER_STATUS_LABEL[s]));
    const done = mockOrders.find((o) => o.status === 'picked_up')!;
    assert.ok(getTimelineSteps(done.status, done.statusHistory).every((s) => s.state === 'done'));
    const cancelled = mockOrders.find((o) => o.status === 'cancelled')!;
    const s3 = getTimelineSteps(cancelled.status, cancelled.statusHistory);
    assert.deepEqual(s3.map((s) => s.state), ['done', 'done', 'pending', 'pending', 'pending', 'pending']);
    const expired = mockOrders.find((o) => o.status === 'expired')!;
    assert.ok(!getTimelineSteps(expired.status, expired.statusHistory).some((s) => s.state === 'current'));
    assert.equal(getTimelineSteps('placed', { placed: 'x' })[1].state, 'current');
  });
  await test('no delivery-fee row in price components; AI orb has no business logic imports', () => {
    for (const f of ['order/OrderPriceBreakdown.tsx', 'cart/CartSummary.tsx']) {
      assert.doesNotMatch(code(path.join(COMMON, f)), /giao hàng|delivery/i, f);
    }
    assert.doesNotMatch(read(path.join(COMMON, 'ai', 'AiOrb.tsx')), /@\/(services|features|data)/);
  });

  // ---------- U1.2 auth / onboarding ----------
  console.log('\n[U1.2] Authentication + onboarding (mock auth)');
  const CAU_GIAY = 'area_cau_giay';
  const uniquePhone = (() => {
    let n = 0;
    return () => `09${String(Date.now()).slice(-5)}${String(++n).padStart(3, '0')}`;
  })();
  const registerNewUser = async (phone: string, email: string) => {
    const r = await startRegistration({ phone, email, password: 'Secret123', acceptedTerms: true });
    assert.equal(r.ok, true, JSON.stringify(r));
    return r;
  };

  await test('1. unauthenticated: splash → Onboarding; after onboarding → Welcome (auth entry)', async () => {
    resetAuthStore();
    assert.equal(getAuthStage(getAuthState()), 'unauthenticated');
    assert.equal(resolveAuthRoute(getAuthState()), '/onboarding');
    assert.equal(getSplashRoute({ isAuthenticated: false, hasCompletedLocationSetup: false }), '/onboarding');
    const done = completeOnboarding();
    assert.deepEqual(done, { ok: true, route: '/welcome' });
    assert.equal(resolveAuthRoute(getAuthState()), '/welcome');
  });
  await test('2. register → OTP: valid credentials move to otp_pending; invalid input is rejected without state change', async () => {
    resetAuthStore();
    const bad = [
      await startRegistration({ phone: '12345', email: 'a@b.co', password: 'Secret123', acceptedTerms: true }),
      await startRegistration({ phone: '0912345601', email: 'not-an-email', password: 'Secret123', acceptedTerms: true }),
      await startRegistration({ phone: '0912345601', email: 'a@b.co', password: 'short', acceptedTerms: true }),
      await startRegistration({ phone: '0912345601', email: 'a@b.co', password: 'Secret123', acceptedTerms: false }),
    ];
    assert.deepEqual(bad.map((r) => (r.ok ? 'ok' : r.field)), ['phone', 'email', 'password', 'terms']);
    assert.equal(getAuthStage(getAuthState()), 'unauthenticated');
    const phone = uniquePhone();
    const r = await registerNewUser(phone, `new${phone}@example.com`);
    assert.deepEqual(r, { ok: true, route: '/otp' });
    assert.equal(getAuthStage(getAuthState()), 'otp_pending');
    assert.equal(getAuthState().pendingRegistration?.phone, phone);
  });
  await test('2b. duplicate phone / email are rejected', async () => {
    resetAuthStore();
    const phone = await startRegistration({ phone: '0912 345 678', email: 'other@example.com', password: 'Secret123', acceptedTerms: true });
    assert.deepEqual(phone.ok ? null : phone.field, 'phone');
    const email = await startRegistration({ phone: '0987654321', email: 'duong.nguyen@email.com', password: 'Secret123', acceptedTerms: true });
    assert.deepEqual(email.ok ? null : email.field, 'email');
  });
  const flowPhone = uniquePhone();
  await test('4. invalid OTP: stays on OTP (state unchanged); incomplete code reports its own message', async () => {
    resetAuthStore();
    await registerNewUser(flowPhone, `flow${flowPhone}@example.com`);
    const wrong = await submitOtp('9999');
    assert.equal(wrong.ok, false);
    assert.equal(wrong.ok ? '' : wrong.message, AUTH_MESSAGES.otpInvalid);
    assert.equal(getAuthStage(getAuthState()), 'otp_pending');
    assert.equal(resolveAuthRoute(getAuthState()), '/otp');
    const short = await submitOtp('12');
    assert.equal(short.ok ? '' : short.message, AUTH_MESSAGES.otpIncomplete);
    assert.equal(getAuthStage(getAuthState()), 'otp_pending');
  });
  await test('OTP resend: allowed while pending, returns the 60 s window; demo OTP is 1234', async () => {
    const r = await resendOtp();
    assert.deepEqual(r, { ok: true, resendAfterSeconds: 60 });
    assert.equal(OTP_RESEND_SECONDS, 60);
    assert.equal(DEMO_OTP, '1234');
    assert.match(read(path.join(SRC, 'data', 'mock', 'auth.ts')), /OTP for every phone number: 1234/);
    assert.equal(tickCountdown(3), 2);
    assert.equal(tickCountdown(0), 0);
  });
  await test('3. correct OTP → Create Profile', async () => {
    const r = await submitOtp(DEMO_OTP);
    assert.deepEqual(r, { ok: true, route: '/create-profile' });
    assert.equal(getAuthStage(getAuthState()), 'authenticated');
    assert.equal(getAuthState().account?.phone, flowPhone);
    assert.equal(getAuthState().pendingRegistration, null);
  });
  await test('5. profile complete → Location Permission; empty / too-short name is rejected', async () => {
    const empty = await createProfile({ name: '   ' });
    assert.equal(empty.ok ? '' : empty.message, AUTH_MESSAGES.nameRequired);
    const short = await createProfile({ name: 'A' });
    assert.equal(short.ok ? '' : short.message, AUTH_MESSAGES.nameTooShort);
    assert.equal(getAuthStage(getAuthState()), 'authenticated');
    const ok = await createProfile({ name: 'Trần Minh An' });
    assert.deepEqual(ok, { ok: true, route: '/location-permission' });
    assert.equal(getAuthStage(getAuthState()), 'profile_created');
    assert.equal(getAuthProfile(getAuthState())?.name, 'Trần Minh An');
  });
  await test('6. location selected → Home; the area is stored for Home / discovery', async () => {
    const bad = await selectArea('area_nowhere');
    assert.equal(bad.ok, false);
    assert.equal(getAuthStage(getAuthState()), 'profile_created');
    const ok = await selectArea(CAU_GIAY);
    assert.deepEqual(ok, { ok: true, route: '/home' });
    assert.equal(getAuthStage(getAuthState()), 'location_selected');
    assert.equal(getAuthState().area?.name, 'Cầu Giấy');
  });
  await test('7. existing user WITH a saved location: login → Home', async () => {
    resetAuthStore(); // new app session; the mock backend remembers the account and its area
    const r = await login({ identifier: `flow${flowPhone}@example.com`, password: 'Secret123' });
    assert.deepEqual(r, { ok: true, route: '/home' });
    assert.equal(getAuthState().area?.id, CAU_GIAY);
    assert.equal(getAuthProfile(getAuthState())?.name, 'Trần Minh An');
  });
  await test('8. existing user WITHOUT a selected location: login → Location Permission', async () => {
    resetAuthStore();
    const r = await login({ identifier: 'duong.nguyen@email.com', password: DEMO_PASSWORD });
    assert.deepEqual(r, { ok: true, route: '/location-permission' });
    assert.equal(getAuthStage(getAuthState()), 'profile_created');
    // phone login works too
    resetAuthStore();
    const byPhone = await login({ identifier: '0912 345 678', password: DEMO_PASSWORD });
    assert.equal(byPhone.ok, true);
  });
  await test('login rejects wrong password, unknown user and invalid identifier without changing state', async () => {
    resetAuthStore();
    const wrong = await login({ identifier: 'duong.nguyen@email.com', password: 'wrong-pass1' });
    assert.equal(wrong.ok ? '' : wrong.message, AUTH_MESSAGES.credentialsWrong);
    const unknown = await login({ identifier: 'nobody@example.com', password: DEMO_PASSWORD });
    assert.equal(unknown.ok, false);
    const bad = await login({ identifier: 'abc', password: DEMO_PASSWORD });
    assert.equal(bad.ok ? '' : bad.field, 'identifier');
    assert.equal(getAuthStage(getAuthState()), 'unauthenticated');
  });
  await test('login for an account that never finished Create Profile → Create Profile', async () => {
    resetAuthStore();
    const phone = uniquePhone();
    await registerNewUser(phone, `half${phone}@example.com`);
    await submitOtp(DEMO_OTP); // authenticated, no name yet
    resetAuthStore();
    const r = await login({ identifier: phone, password: 'Secret123' });
    assert.deepEqual(r, { ok: true, route: '/create-profile' });
  });
  await test('reducer ignores events that do not apply (no skipping steps)', () => {
    const fresh = initialAuthState;
    const acct = { id: 'x', phone: '0900000000', email: 'x@y.co' };
    assert.equal(authReducer(fresh, { type: 'otp_verified', account: acct }), fresh);
    assert.equal(authReducer(fresh, { type: 'profile_created', name: 'Nam' }), fresh);
    assert.equal(authReducer(fresh, { type: 'area_selected', area: { id: 'a', name: 'A', city: 'C', restaurantCount: 1 } }), fresh);
    const authed = authReducer(authReducer(fresh, { type: 'registration_started', phone: '0900000000', email: 'x@y.co' }), { type: 'otp_verified', account: acct });
    assert.equal(authReducer(authed, { type: 'area_selected', area: { id: 'a', name: 'A', city: 'C', restaurantCount: 1 } }), authed); // needs a profile first
  });
  await test('route guards: each auth screen is reachable only at its stage', () => {
    const stages: Array<[AuthState, Record<AuthScreen, boolean>]> = [
      [initialAuthState, { public: true, otp: false, 'create-profile': false, location: false }],
      [{ ...initialAuthState, status: 'otp_pending', pendingRegistration: { phone: '0900000000', email: 'x@y.co' } }, { public: true, otp: true, 'create-profile': false, location: false }],
      [{ ...initialAuthState, status: 'authenticated', account: { id: 'x', phone: '0900000000', email: 'x@y.co' } }, { public: false, otp: false, 'create-profile': true, location: false }],
      [{ ...initialAuthState, status: 'authenticated', account: { id: 'x', phone: '0900000000', email: 'x@y.co' }, name: 'Nam' }, { public: false, otp: false, 'create-profile': false, location: true }],
      [{ ...initialAuthState, status: 'authenticated', account: { id: 'x', phone: '0900000000', email: 'x@y.co' }, name: 'Nam', area: { id: 'a', name: 'A', city: 'C', restaurantCount: 1 } }, { public: false, otp: false, 'create-profile': false, location: false }],
    ];
    for (const [state, expected] of stages) {
      for (const screen of Object.keys(expected) as AuthScreen[]) {
        assert.equal(canAccessAuthScreen(state, screen), expected[screen], `${getAuthStage(state)} / ${screen}`);
      }
    }
  });
  await test('9. guest preview stays unavailable (flag off, no route, no button in Welcome)', () => {
    assert.equal(GUEST_PREVIEW_ENABLED, false);
    const welcome = code(path.join(APP, '(auth)', 'welcome.tsx'));
    assert.doesNotMatch(welcome, /Xem trước|guest|Google|Apple/i);
  });
  await test('areas: exactly Cầu Giấy, Đống Đa, Ba Đình, Thanh Xuân; each shows the 6 demo restaurants', async () => {
    const areas = await api.listAreas();
    assert.deepEqual(areas.map((a) => a.name), ['Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Thanh Xuân']);
    assert.ok(areas.every((a) => a.restaurantCount === 6));
    assert.equal((await api.listRestaurants()).length, 6);
  });
  await test('validation helpers: phone / email / password / name / OTP', () => {
    assert.equal(normalizePhone('0912 345 678'), '0912345678');
    assert.equal(normalizePhone('+84 912 345 678'), '0912345678');
    assert.ok(isValidPhone('0912.345.678') && !isValidPhone('0212345678') && !isValidPhone('091234'));
    assert.ok(isValidEmail('a@b.co') && !isValidEmail('a@b') && !isValidEmail('a b@c.co'));
    assert.ok(isValidPassword('Secret123') && !isValidPassword('secretonly') && !isValidPassword('12345678') && !isValidPassword('Ab1'));
    assert.ok(isValidName('An') && !isValidName(' A '));
    assert.ok(isValidOtp('1234') && !isValidOtp('123') && !isValidOtp('12a4'));
    assert.equal(formatPhone('0912345678'), '0912 345 678');
  });
  await test('screens: thin routes (no services/data), guarded, mock permission (no expo-location, no maps)', () => {
    const authDir = path.join(APP, '(auth)');
    for (const f of walk(authDir).filter((x) => x.endsWith('.tsx') && !x.endsWith('_layout.tsx'))) {
      const src = code(f);
      assert.doesNotMatch(src, /from '@\/(services|data)/, `${path.relative(ROOT, f)} imports services/data`);
      assert.doesNotMatch(src, /expo-location|react-native-maps|mapbox/i, path.relative(ROOT, f));
      assert.match(src, /useAuthGuard\(/, `${path.relative(ROOT, f)} is not guarded`);
    }
    for (const f of ['login', 'register', 'otp', 'create-profile', 'location-permission', 'select-location', 'onboarding', 'welcome']) {
      assert.ok(fs.existsSync(path.join(authDir, `${f}.tsx`)), f);
    }
    assert.match(read(path.join(APP, 'index.tsx')), /resolveAuthRoute/);
  });
  await test('auth ends on the canonical /home route, and Home (U1.3) is a real screen fed by useHome', () => {
    assert.doesNotMatch(read(path.join(APP, '(main)', 'home.tsx')), /PlaceholderScreen/);
    assert.match(read(path.join(APP, '(main)', 'home.tsx')), /useHome/);
    assert.equal(HOME_ROUTE, '/home');
    assert.ok(fs.existsSync(path.join(APP, '(main)', 'home.tsx')));
  });
  await test('splash: short (no long artificial delay); onboarding: 3 slides with pager and skip', () => {
    assert.ok(SPLASH_DURATION_MS <= 1000);
    assert.equal(ONBOARDING_SLIDES.length, 3);
    assert.deepEqual(ONBOARDING_SLIDES.map((s) => s.key), ['value', 'impact', 'ai']);
    const onb = code(path.join(APP, '(auth)', 'onboarding.tsx'));
    assert.match(onb, /PagerDots/);
    assert.match(onb, /Bỏ qua/);
  });
  await test('new UI matches the reference: OTP boxes 60/15, pager 22x7 & 7x7, splash logo 104 & bar 132x4, onboarding circle 250, checkbox 18/6', () => {
    const refDir = path.join(ROOT, 'reference', 'ecobite-82-screen-reference', 'screens');
    assert.match(read(path.join(refDir, 'group-01', '01-08-otp-verification.html')), /flex:1;height:60px;border-radius:15px/);
    assert.match(read(path.join(refDir, 'group-01', '01-02-onboarding-value.html')), /width:22px;height:7px;border-radius:999px/);
    assert.match(read(path.join(refDir, 'group-01', '01-01-splash.html')), /width:104px;height:104px;border-radius:32px/);
    assert.match(read(path.join(refDir, 'group-01', '01-01-splash.html')), /width:132px;height:4px/);
    assert.match(read(path.join(refDir, 'group-01', '01-02-onboarding-value.html')), /width:250px;height:250px;border-radius:50%/);
    assert.match(read(path.join(refDir, 'group-01', '01-06-login.html')), /width:18px;height:18px;border-radius:6px/);
    const otp = code(path.join(COMMON, 'common', 'OtpInput.tsx'));
    assert.match(otp, /height: 60/);
    assert.match(otp, /Radius\.button/);
    assert.equal(Radius.button, 15);
    assert.match(code(path.join(COMMON, 'auth', 'PagerDots.tsx')), /i === index \? 22 : 7/);
    assert.match(code(path.join(COMMON, 'auth', 'OnboardingIllustration.tsx')), /width: 250/);
    assert.match(code(path.join(COMMON, 'auth', 'BrandMark.tsx')), /tileSize \* 0\.31/);
    assert.match(code(path.join(APP, 'index.tsx')), /width: 132, height: 4/);
    assert.match(code(path.join(COMMON, 'common', 'Checkbox.tsx')), /size === 18 \? 6 : 7/);
  });

  // ---------- U1.3: Home + Search + Restaurant discovery ----------
  console.log('\n[U1.3] Home / Search / Restaurant');
  const catalog = async () => {
    const [restaurants, bags, categories] = await Promise.all([api.listRestaurants(), api.listFoodBags(), api.listCategories()]);
    return buildRestaurantListings(restaurants, bags, categories);
  };
  const REGISTER_ROUTE_PATHS = ['(main)/home.tsx', 'search/index.tsx', 'search/results.tsx', 'restaurant/[id]/index.tsx'];

  await test('U1.3 data: exactly six restaurant records res_01…res_06, ids unique', async () => {
    const list = await api.listRestaurants();
    assert.equal(list.length, 6);
    assert.deepEqual(list.map((r) => r.id), ['res_01', 'res_02', 'res_03', 'res_04', 'res_05', 'res_06']);
    assert.equal(new Set(list.map((r) => r.id)).size, 6);
    assert.equal(new Set(list.map((r) => r.name)).size, 6);
    assert.equal(new Set(mockRestaurants.map((r) => r.pickupLocationId)).size, 6);
  });
  await test('U1.3 data: every restaurant address is in Hà Nội and inside one of the four supported areas', () => {
    const areaNames = mockAreas.map((a) => a.name);
    assert.deepEqual(areaNames, ['Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Thanh Xuân']);
    for (const r of mockRestaurants) {
      const area = mockAreas.find((a) => a.id === r.areaId);
      assert.ok(area, `${r.id} has no valid areaId`);
      assert.ok(r.address.includes('Hà Nội'), `${r.id} address is not in Hà Nội`);
      assert.ok(r.address.includes(area.name), `${r.id} address does not mention ${area.name}`);
    }
    for (const a of mockAreas) assert.ok(mockRestaurants.some((r) => r.areaId === a.id), `${a.name} has no restaurant`);
    for (const f of walk(path.join(SRC, 'data')).concat(walk(path.join(SRC, 'components')))) {
      assert.doesNotMatch(read(f), /Bắc Ninh|Ninh Xá|Suối Hoa/, f);
    }
  });
  await test('U1.3 data: no GPS / maps / geolocation was introduced', () => {
    const pkg = JSON.parse(read(path.join(ROOT, 'package.json')));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    for (const banned of ['expo-location', 'react-native-maps', '@react-native-community/geolocation']) assert.ok(!deps.includes(banned), banned);
    for (const f of srcFiles()) assert.doesNotMatch(code(f), /expo-location|react-native-maps|navigator\.geolocation/, f);
  });
  await test('search by restaurant name (accent-insensitive, case-insensitive)', async () => {
    const listings = await catalog();
    for (const q of ['bún bò', 'Bun Bo', '  BÚN   BÒ ']) {
      const r = searchListings(listings, q);
      assert.equal(r[0]?.listing.restaurant.id, 'res_03', q);
      assert.ok(r[0].matchedBy.includes('name'));
    }
    assert.equal(searchListings(listings, 'sushi')[0].listing.restaurant.id, 'res_02');
  });
  await test('search by category and by food bag name', async () => {
    const listings = await catalog();
    const rice = searchListings(listings, 'cơm').map((r) => r.listing.restaurant.id);
    for (const id of ['res_01', 'res_02', 'res_04']) assert.ok(rice.includes(id), `cơm should include ${id}`);
    const healthy = searchListings(listings, 'healthy');
    assert.deepEqual(healthy.map((r) => r.listing.restaurant.id), ['res_05']);
    assert.ok(healthy[0].matchedBy.includes('category'));
    const bag = searchListings(listings, 'tráng miệng');
    assert.ok(bag.some((r) => r.listing.restaurant.id === 'res_06' && r.matchedBy.includes('bag')));
    // every word must match: "bún sushi" matches nothing
    assert.deepEqual(searchListings(listings, 'bún sushi'), []);
  });
  await test('search no-result behaviour: unknown words and empty queries return []', async () => {
    const listings = await catalog();
    assert.deepEqual(searchListings(listings, 'pizza hải sản'), []);
    assert.deepEqual(searchListings(listings, ''), []);
    assert.deepEqual(searchListings(listings, '   '), []);
  });
  await test('search "Còn túi" filter drops sold-out restaurants (Sushi House has no bag left)', async () => {
    const listings = await catalog();
    assert.ok(searchListings(listings, 'sushi').length === 1);
    assert.deepEqual(searchListings(listings, 'sushi', { onlyAvailable: true }), []);
    assert.equal(normalizeSearchText('Đống Đa – Cơm Niêu'), 'dong da – com nieu');
  });
  await test('restaurant lookup by ID (API + listing) and invalid ID handling', async () => {
    assert.equal((await api.getRestaurant('res_03'))?.name, 'Bún Bò Cay');
    assert.equal(await api.getRestaurant('res_999'), null);
    assert.equal(await api.getRestaurant(''), null);
    const listings = await catalog();
    assert.equal(findListing(listings, 'res_05')?.restaurant.name, 'Salad Nhà Gấu');
    assert.equal(findListing(listings, 'res_999'), null);
    assert.equal(findListing(listings, undefined), null);
    const detail = code(path.join(APP, 'restaurant', '[id]', 'index.tsx'));
    assert.match(detail, /not_found/);
    assert.match(detail, /Không tìm thấy nhà hàng/);
    assert.match(code(path.join(SRC, 'features', 'restaurant', 'use-restaurant.ts')), /not_found/);
  });
  await test('restaurant listing values: available count, featured bag, sold-out restaurant', async () => {
    const listings = await catalog();
    const bepNhaLa = findListing(listings, 'res_01')!;
    assert.equal(bepNhaLa.availableCount, 5);
    assert.equal(bepNhaLa.featuredBag?.id, 'bag_01');
    assert.equal(bepNhaLa.featuredBag?.price, 45000);
    assert.equal(bepNhaLa.pickupWindowLabel, '17:30 – 19:30');
    assert.equal(bepNhaLa.categoryName, 'Cơm');
    const sushi = findListing(listings, 'res_02')!;
    assert.equal(sushi.soldOut, true);
    assert.equal(sushi.featuredBag, null);
    assert.equal(sushi.pickupWindowLabel, null);
    assert.equal(getPrimaryBag(sushi), null);
    assert.equal(getPrimaryBag(bepNhaLa)?.id, 'bag_01');
    assert.deepEqual(orderBagsForDetail(sushi.bags).map((b) => b.id), ['bag_07']);
  });
  await test('Home can read the selected location from the auth session', async () => {
    resetAuthStore();
    assert.equal(getAuthState().area, null);
    dispatchAuth({ type: 'registration_started', phone: '0987654321', email: 'home@test.vn' });
    dispatchAuth({ type: 'otp_verified', account: { id: 'acc_home', phone: '0987654321', email: 'home@test.vn' } });
    dispatchAuth({ type: 'profile_created', name: 'Khách Home' });
    const dongDa = (await api.listAreas()).find((a) => a.name === 'Đống Đa')!;
    dispatchAuth({ type: 'area_selected', area: dongDa });
    const listings = await catalog();
    const view = getHomeView(listings, getAuthState().area);
    assert.equal(view.area?.name, 'Đống Đa');
    // selected area's restaurants come first (res_03, res_06), the rest keep their order
    assert.deepEqual(view.restaurants.map((l) => l.restaurant.id), ['res_03', 'res_06', 'res_01', 'res_02', 'res_04', 'res_05']);
    assert.match(code(path.join(SRC, 'features', 'discovery', 'use-home.ts')), /useAuth\(\)/);
    assert.match(code(path.join(APP, '(main)', 'home.tsx')), /area/);
    resetAuthStore();
  });
  await test('Home exposes the six demo restaurants for every area and no area', async () => {
    const listings = await catalog();
    const areas = await api.listAreas();
    const ids = (area: (typeof areas)[number] | null) => getHomeView(listings, area).restaurants.map((l) => l.restaurant.id);
    assert.equal(new Set(ids(null)).size, 6);
    for (const a of areas) {
      const got = ids(a);
      assert.equal(got.length, 6, a.name);
      assert.equal(new Set(got).size, 6, a.name);
      const inArea = mockRestaurants.filter((r) => r.areaId === a.id).length;
      assert.ok(getHomeView(listings, a).restaurants.slice(0, inArea).every((l) => l.restaurant.areaId === a.id));
    }
  });
  await test('Home category filter and empty restaurant list', async () => {
    const listings = await catalog();
    const cat = (id: string) => getHomeView(listings, null, id).restaurants.map((l) => l.restaurant.id);
    assert.equal(cat('cat_all').length, 6);
    assert.deepEqual(cat('cat_rice'), ['res_01', 'res_02', 'res_04']);
    assert.deepEqual(cat('cat_noodle'), ['res_03']);
    assert.deepEqual(cat('cat_drink'), []);
    assert.match(code(path.join(APP, '(main)', 'home.tsx')), /restaurants\.length === 0/);
    assert.match(code(path.join(APP, '(main)', 'home.tsx')), /EmptyState/);
  });
  await test('recent searches: newest first, no duplicates, capped, removable', () => {
    let h: string[] = [];
    for (const q of ['bún bò', 'sushi', 'Bún Bò', 'salad', 'chè', 'cơm', 'bánh']) h = addRecentSearch(h, q);
    assert.equal(h.length, MAX_RECENT_SEARCHES);
    assert.equal(h[0], 'bánh');
    assert.equal(h.filter((x) => x.toLowerCase() === 'bún bò').length <= 1, true);
    assert.deepEqual(addRecentSearch(['a'], '   '), ['a']);
    assert.deepEqual(removeRecentSearch(['a', 'b'], 'a'), ['b']);
  });
  await test('navigation: Home → Search → Results → Restaurant → Food Bag', () => {
    const home = code(path.join(APP, '(main)', 'home.tsx'));
    const search = code(path.join(APP, 'search', 'index.tsx'));
    const results = code(path.join(APP, 'search', 'results.tsx'));
    const detail = code(path.join(APP, 'restaurant', '[id]', 'index.tsx'));
    assert.match(home, /router\.push\('\/search'\)/);
    assert.match(home, /pathname: '\/restaurant\/\[id\]'/);
    assert.match(search, /pathname: '\/search\/results'/);
    assert.match(results, /pathname: '\/restaurant\/\[id\]'/);
    assert.match(detail, /pathname: '\/food-bag\/\[id\]'/);
    // Food Bag Detail was still the placeholder in U1.3; U1.4 builds it (the route is reached from Restaurant Detail)
    assert.doesNotMatch(code(path.join(APP, 'food-bag', '[id]', 'index.tsx')), /PlaceholderScreen/);
  });
  await test('U1.3 screens are thin: no data/service imports, no delivery wording, shared components only', () => {
    for (const rel of REGISTER_ROUTE_PATHS) {
      const c = code(path.join(APP, rel));
      assert.doesNotMatch(c, /from '@\/(data|services)/, rel);
      assert.doesNotMatch(c, /giao hàng|delivery|vận chuyển|shipper|courier|driver/i, rel);
      assert.doesNotMatch(c, /#[0-9a-fA-F]{3,8}\b|rgba?\(|fontWeight|fontFamily/, rel);
    }
    for (const rel of ['features/discovery', 'features/restaurant', 'utils/search.ts', 'utils/restaurant-listing.ts']) {
      const p = path.join(SRC, rel);
      for (const f of fs.statSync(p).isDirectory() ? walk(p) : [p]) {
        assert.doesNotMatch(code(f), /giao hàng|delivery|vận chuyển|shipper|courier|driver/i, f);
        assert.doesNotMatch(code(f), /from '@\/data/, f);
      }
    }
  });
  await test('U1.3 / U1.8-3: the AI orb is mounted once in the main tab layout (navigation only), not on Home or stack screens', () => {
    assert.match(code(path.join(APP, '(main)', '_layout.tsx')), /<DraggableAiOrb onPress=\{\(\) => router\.push\('\/ai'\)\}/);
    assert.doesNotMatch(code(path.join(APP, '(main)', 'home.tsx')), /<AiOrb|<DraggableAiOrb/);
    for (const rel of ['search/index.tsx', 'search/results.tsx', 'restaurant/[id]/index.tsx', 'ai/index.tsx']) {
      assert.doesNotMatch(code(path.join(APP, rel)), /<AiOrb/, rel);
    }
  });
  await test('D-14: Search is not a bottom tab (tab list, layout and BottomTabBar)', () => {
    assert.deepEqual(TAB_ITEMS.map((t) => t.key), ['home', 'orders', 'cart', 'account']);
    assert.doesNotMatch(code(path.join(APP, '(main)', '_layout.tsx')), /search/i);
    assert.ok(!fs.existsSync(path.join(APP, '(main)', 'search.tsx')));
    assert.ok(fs.existsSync(path.join(APP, 'search', 'results.tsx')));
    assert.doesNotMatch(code(path.join(SRC, 'components', 'common', 'BottomTabBar.tsx')), /search|Tìm kiếm/i);
  });
  await test('U1.3 reference sizes: search field 42/46, category circle 52, restaurant cover 236', () => {
    assert.equal(Sizes.searchField, 42);
    assert.equal(Sizes.searchHome, 46);
    assert.equal(Sizes.categoryCircle, 52);
    assert.equal(Sizes.restaurantCover, 236);
  });

  // ---------- U1.4: Food Bag Detail + Add to Cart + Cart ----------
  console.log('\n[U1.4] Food Bag / Cart');
  const bagOf = async (id: string) => (await api.getFoodBag(id))!;
  const mkSlot = (label: string): PickupSlot => ({ label, date: '2025-09-24', start: label.slice(0, 5), end: label.slice(-5) });

  await test('add a bag to an empty cart (real store) and read it back', async () => {
    resetCartStore();
    assert.equal(getCart().items.length, 0);
    const r = await addBagToCart({ foodBagId: 'bag_01', quantity: 2 });
    assert.ok(r.ok && r.added === 2 && r.route === '/cart');
    assert.equal(getCart().items.length, 1);
    assert.deepEqual(
      { id: getCart().items[0].foodBagId, q: getCart().items[0].quantity, restaurant: getCart().items[0].restaurantId, price: getCart().items[0].unitPrice },
      { id: 'bag_01', q: 2, restaurant: 'res_01', price: 45000 },
    );
    resetCartStore();
  });
  await test('adding the same bag again increases the quantity (one line, not two)', async () => {
    resetCartStore();
    await addBagToCart({ foodBagId: 'bag_01', quantity: 1 });
    await addBagToCart({ foodBagId: 'bag_01', quantity: 1 });
    assert.equal(getCart().items.length, 1);
    assert.equal(getCart().items[0].quantity, 2);
    resetCartStore();
  });
  await test('quantity can never exceed the restaurant\'s remaining bags (counting what the cart already holds)', async () => {
    resetCartStore();
    const bag = await bagOf('bag_01'); // left = 3
    assert.equal(getAddableQuantity(getCart(), bag), 3);
    const first = await addBagToCart({ foodBagId: 'bag_01', quantity: 5 }); // clamped to 3
    assert.ok(first.ok && first.added === 3);
    assert.equal(getCart().items[0].quantity, 3);
    assert.equal(getAddableQuantity(getCart(), bag), 0);
    const second = await addBagToCart({ foodBagId: 'bag_01', quantity: 1 });
    assert.ok(!second.ok && second.reason === 'limit_reached');
    assert.equal(getCart().items[0].quantity, 3);
    // the pure functions agree
    assert.equal(addToCart(EMPTY_CART, bag, 9).items[0].quantity, 3);
    assert.equal(setItemQuantity(getCart(), 'bag_01', 99, bag.left).items[0].quantity, 3);
    resetCartStore();
  });
  await test('sold-out bag cannot be added (store, action and pure function)', async () => {
    resetCartStore();
    const sold = await bagOf('bag_07'); // left = 0
    assert.equal(sold.left, 0);
    const r = await addBagToCart({ foodBagId: 'bag_07', quantity: 1 });
    assert.ok(!r.ok && r.reason === 'sold_out');
    assert.equal(getCart().items.length, 0);
    assert.deepEqual(addToCart(EMPTY_CART, sold, 1), EMPTY_CART);
    const t = tryAddToCart(EMPTY_CART, sold, 1);
    assert.ok(!t.ok && t.reason === 'sold_out');
    assert.equal(getBagAvailability(sold), 'sold_out');
    assert.equal(getStockLabel(sold), 'Hết túi');
    assert.deepEqual(getAddToCartSheetState(EMPTY_CART, sold), { kind: 'sold_out' });
    const bad = tryAddToCart(EMPTY_CART, await bagOf('bag_01'), 0);
    assert.ok(!bad.ok && bad.reason === 'invalid_quantity');
  });
  await test('invalid bag ID is handled (no throw, cart untouched)', async () => {
    resetCartStore();
    const r = await addBagToCart({ foodBagId: 'bag_999', quantity: 1 });
    assert.ok(!r.ok && r.reason === 'not_found');
    assert.equal(getCart().items.length, 0);
    assert.equal(await api.getFoodBag('bag_999'), null);
    const detail = code(path.join(APP, 'food-bag', '[id]', 'index.tsx'));
    assert.match(detail, /not_found/);
    assert.match(detail, /Không tìm thấy túi này/);
    assert.match(code(path.join(SRC, 'features', 'food-bag', 'use-food-bag.ts')), /not_found/);
  });
  await test('different bags of the same restaurant share one group; different restaurants stay separate', async () => {
    resetCartStore();
    await addBagToCart({ foodBagId: 'bag_01', quantity: 2 }); // res_01
    await addBagToCart({ foodBagId: 'bag_02', quantity: 1 }); // res_01
    await addBagToCart({ foodBagId: 'bag_06', quantity: 1 }); // res_06
    const groups = groupCartByRestaurant(getCart());
    assert.equal(groups.length, 2);
    assert.deepEqual(groups.map((g) => [g.restaurantId, g.items.map((i) => i.foodBagId), g.count]), [
      ['res_01', ['bag_01', 'bag_02'], 3],
      ['res_06', ['bag_06'], 1],
    ]);
    for (const g of groups) assert.ok(g.items.every((i) => i.restaurantId === g.restaurantId));
    const view = buildCartView(getCart(), await api.listFoodBags(), await api.listRestaurants());
    assert.deepEqual(view.groups.map((g) => g.restaurantName), ['Bếp Nhà Lá', 'Chè Sen Bà Tâm']);
    assert.equal(view.restaurantCount, 2);
    assert.equal(view.groups[0].items[0].maxQuantity, 3);
    assert.equal(view.groups[0].items[0].summary, 'Cơm + 2 món mặn + canh');
    resetCartStore();
  });
  await test('quantity change, remove item, last item removed → empty cart, clear cart', async () => {
    resetCartStore();
    await addBagToCart({ foodBagId: 'bag_01', quantity: 1 });
    await addBagToCart({ foodBagId: 'bag_06', quantity: 1 });
    setCartItemQuantity('bag_01', 3, 3);
    assert.equal(getCart().items.find((i) => i.foodBagId === 'bag_01')?.quantity, 3);
    setCartItemQuantity('bag_01', 2, 3);
    assert.equal(getCart().items.find((i) => i.foodBagId === 'bag_01')?.quantity, 2);
    setCartItemQuantity('bag_01', 50, 3); // clamped
    assert.equal(getCart().items.find((i) => i.foodBagId === 'bag_01')?.quantity, 3);
    removeCartItem('bag_01');
    assert.deepEqual(getCart().items.map((i) => i.foodBagId), ['bag_06']);
    removeCartItem('bag_06'); // last item
    assert.deepEqual(getCart(), EMPTY_CART);
    assert.equal(getCartCount(getCart()), 0);
    assert.equal(buildCartView(getCart(), [], []).groups.length, 0);
    // stepper to 0 through the reducer removes the line as well
    await addBagToCart({ foodBagId: 'bag_04', quantity: 1 });
    setCartItemQuantity('bag_04', 0, 3);
    assert.equal(getCart().items.length, 0);
    await addBagToCart({ foodBagId: 'bag_04', quantity: 1 });
    await addBagToCart({ foodBagId: 'bag_05', quantity: 1 });
    clearCart();
    assert.deepEqual(getCart(), EMPTY_CART);
  });
  await test('cart count = bag UNITS across restaurants (badge definition), not lines or restaurants', async () => {
    resetCartStore();
    assert.equal(getCartCount(getCart()), 0);
    await addBagToCart({ foodBagId: 'bag_01', quantity: 2 });
    await addBagToCart({ foodBagId: 'bag_06', quantity: 1 });
    assert.equal(getCartCount(getCart()), 3);
    assert.equal(buildCartView(getCart(), await api.listFoodBags(), await api.listRestaurants()).count, 3);
    const layout = code(path.join(APP, '(main)', '_layout.tsx'));
    assert.match(layout, /useCartCount\(\)/);
    assert.match(layout, /cartCount=\{cartCount\}/);
    assert.doesNotMatch(layout, /cartCount=\{0\}/);
    assert.match(code(path.join(SRC, 'features', 'cart', 'use-cart.ts')), /getCartCount/);
    resetCartStore();
  });
  await test('pricing comes from utils/order-pricing (subtotal, savings, own box) — no delivery fee', async () => {
    resetCartStore();
    await addBagToCart({ foodBagId: 'bag_01', quantity: 2, ownBox: true });
    await addBagToCart({ foodBagId: 'bag_06', quantity: 1 });
    const view = buildCartView(getCart(), await api.listFoodBags(), await api.listRestaurants());
    assert.deepEqual(view.money, computeOrderMoney(getCart().items));
    assert.equal(view.money.subtotal, 45000 * 2 + 25000);
    assert.equal(view.money.bagSavings, (56000 - 45000) * 2 + (30000 - 25000));
    assert.equal(view.money.ownBoxDiscount, 2000 * 2);
    assert.equal(view.money.total, view.money.subtotal - 4000);
    assert.equal(getSheetTotal(await bagOf('bag_01'), 2, true), 86000); // reference 5.6: "Thêm 2 túi · 86.000đ"
    assert.equal(getSheetTotal(await bagOf('bag_01'), 2, false), 90000);
    assert.ok(!('deliveryFee' in view.money));
    // the store, reducer and components hold no money maths of their own
    for (const rel of ['features/cart/cart-store.ts', 'features/cart/cart-reducer.ts', 'features/cart/cart-actions.ts', 'features/cart/cart-view.ts']) {
      assert.doesNotMatch(code(path.join(SRC, rel)), /unitPrice\s*\*|subtotal\s*[-+]|OWN_BOX_DISCOUNT_PER_BAG\s*\*/, rel);
    }
    assert.match(code(path.join(SRC, 'features', 'cart', 'cart-view.ts')), /computeOrderMoney/);
    assert.match(code(path.join(SRC, 'features', 'cart', 'cart-view.ts')), /groupCartByRestaurant/);
    for (const rel of ['(main)/cart.tsx', 'food-bag/[id]/index.tsx', 'food-bag/[id]/add-to-cart.tsx']) {
      assert.doesNotMatch(code(path.join(APP, rel)), /unitPrice\s*\*|quantity\s*\*|\.reduce\(/, rel);
      assert.doesNotMatch(code(path.join(APP, rel)), /deliveryFee|phí giao|shipping|delivery|driver|shipper|courier/i, rel);
    }
    resetCartStore();
  });
  await test('store preserves the pickup slot per restaurant across item changes', async () => {
    resetCartStore();
    await addBagToCart({ foodBagId: 'bag_01', quantity: 1 });
    await addBagToCart({ foodBagId: 'bag_06', quantity: 1 });
    setRestaurantPickupSlot('res_01', mkSlot('18:30 – 19:00'));
    setRestaurantPickupSlot('res_06', mkSlot('19:30 – 20:00'));
    setRestaurantPickupSlot('res_04', mkSlot('19:00 – 19:30')); // no items of res_04: ignored
    assert.deepEqual(Object.keys(getCart().pickupSlots).sort(), ['res_01', 'res_06']);
    await addBagToCart({ foodBagId: 'bag_02', quantity: 1 }); // more items of res_01
    setCartItemQuantity('bag_01', 2, 3);
    assert.equal(getCart().pickupSlots.res_01.label, '18:30 – 19:00');
    assert.equal(getCart().pickupSlots.res_06.label, '19:30 – 20:00');
    const view = buildCartView(getCart(), await api.listFoodBags(), await api.listRestaurants());
    assert.deepEqual(view.groups.map((g) => g.pickupLabel), ['18:30 – 19:00', '19:30 – 20:00']);
    removeCartItem('bag_06'); // res_06 leaves the cart → its slot goes with it
    assert.deepEqual(Object.keys(getCart().pickupSlots), ['res_01']);
    resetCartStore();
  });
  await test('multi-restaurant cart stays compatible with one order per restaurant (D-1)', async () => {
    resetCartStore();
    await addBagToCart({ foodBagId: 'bag_01', quantity: 2 });
    await addBagToCart({ foodBagId: 'bag_02', quantity: 1 });
    await addBagToCart({ foodBagId: 'bag_04', quantity: 1 });
    await addBagToCart({ foodBagId: 'bag_06', quantity: 1 });
    assert.equal(isReadyForCheckout(getCart()), false); // no pickup times yet (chosen at checkout, U1.5)
    assert.throws(() => buildOrderDrafts(getCart()), /No pickup time/);
    for (const [res, label] of [['res_01', '18:00 – 19:00'], ['res_03', '17:30 – 18:00'], ['res_06', '19:30 – 20:00']] as const) {
      setRestaurantPickupSlot(res, mkSlot(label));
    }
    assert.equal(isReadyForCheckout(getCart()), true);
    const drafts = buildOrderDrafts(getCart());
    assert.equal(drafts.length, 3); // ONE draft (= one Order) per restaurant
    assert.deepEqual(drafts.map((d) => d.restaurantId), ['res_01', 'res_03', 'res_06']);
    assert.deepEqual(drafts.map((d) => d.items.length), [2, 1, 1]);
    for (const d of drafts) assert.ok(d.items.every((i) => getCart().items.find((c) => c.foodBagId === i.foodBagId)?.restaurantId === d.restaurantId));
    assert.equal(drafts.reduce((s, d) => s + d.money.total, 0), computeOrderMoney(getCart().items).total);
    // cart screen renders one independent section per restaurant, not one combined block
    const screen = code(path.join(APP, '(main)', 'cart.tsx'));
    assert.match(screen, /view\.groups\.map/);
    assert.match(screen, /<CartRestaurantSection key=\{group\.restaurantId\}/);
    resetCartStore();
  });
  await test('add-to-cart sheet state: ready / limit reached / sold out follow the session cart', async () => {
    resetCartStore();
    const bag = await bagOf('bag_03'); // left = 1
    assert.deepEqual(getAddToCartSheetState(getCart(), bag), { kind: 'ready', addable: 1, inCart: 0 });
    await addBagToCart({ foodBagId: 'bag_03', quantity: 1 });
    assert.deepEqual(getAddToCartSheetState(getCart(), bag), { kind: 'limit_reached', inCart: 1 });
    resetCartStore();
    assert.equal(getStockLabel(await bagOf('bag_01')), 'Chỉ còn 3 túi');
    assert.equal(getStockLabel(await bagOf('bag_08')), 'Còn 4 túi');
    assert.equal(summarizeAllergens((await bagOf('bag_01')).allergens), 'Có đậu phộng, hải sản · có thể có gluten');
    const alt = getAlternativeListings(await catalog(), 'res_02');
    assert.equal(alt.length, 2);
    assert.ok(alt.every((l) => l.restaurant.id !== 'res_02' && !l.soldOut));
  });
  await test('cart reducer is pure and only ignores rejected adds', async () => {
    const bag = await bagOf('bag_02'); // left = 1
    const a = cartReducer(EMPTY_CART, { type: 'add', bag, quantity: 1, ownBox: false });
    assert.equal(a.items.length, 1);
    assert.equal(EMPTY_CART.items.length, 0); // input not mutated
    assert.equal(cartReducer(a, { type: 'add', bag, quantity: 1, ownBox: false }), a); // limit reached → same object
    assert.deepEqual(cartReducer(a, { type: 'clear' }), EMPTY_CART);
  });
  await test('navigation: Restaurant → Food Bag → Add to Cart sheet → Cart → Checkout', () => {
    const restaurant = code(path.join(APP, 'restaurant', '[id]', 'index.tsx'));
    const bag = code(path.join(APP, 'food-bag', '[id]', 'index.tsx'));
    const sheet = code(path.join(APP, 'food-bag', '[id]', 'add-to-cart.tsx'));
    const cartScreen = code(path.join(APP, '(main)', 'cart.tsx'));
    assert.match(restaurant, /pathname: '\/food-bag\/\[id\]'/);
    assert.match(bag, /pathname: '\/food-bag\/\[id\]\/add-to-cart'/);
    assert.match(sheet, /addable/);
    assert.match(sheet, /router\.dismissTo\(result\.route\)/);
    assert.equal(CART_ROUTE, '/cart');
    assert.match(cartScreen, /router\.push\('\/order\/checkout'\)/);
    assert.match(read(path.join(APP, 'food-bag', '[id]', '_layout.tsx')), /transparentModal/);
    // Checkout and Order Summary were placeholders in U1.4; U1.5 builds them
    assert.doesNotMatch(code(path.join(APP, 'order', 'checkout.tsx')), /PlaceholderScreen/);
    assert.doesNotMatch(code(path.join(APP, 'order', 'summary.tsx')), /PlaceholderScreen/);
  });
  await test('cart UI: empty state with a way back, remove confirmation, no stale data, thin route files', () => {
    const screen = code(path.join(APP, '(main)', 'cart.tsx'));
    assert.match(screen, /Giỏ hàng đang trống/);
    assert.match(screen, /router\.navigate\('\/home'\)/);
    assert.match(screen, /<EmptyState/);
    assert.match(screen, /<ConfirmDialog/);
    assert.match(screen, /Xoá túi khỏi giỏ\?/);
    assert.match(screen, /removeCartItem\(/);
    for (const rel of ['(main)/cart.tsx', 'food-bag/[id]/index.tsx', 'food-bag/[id]/add-to-cart.tsx']) {
      const c = code(path.join(APP, rel));
      assert.doesNotMatch(c, /from '@\/(data|services)/, rel);
      assert.doesNotMatch(c, /#[0-9a-fA-F]{3,8}\b|rgba?\(|fontWeight|fontFamily/, rel);
    }
    assert.match(read(path.join(APP, 'food-bag', '[id]', 'index.tsx')), /getBagAvailability\(bag\) === 'sold_out'/);
  });
  await test('U1.4 reference sizes: bag cover 250, add-to-cart thumb 62, cart thumb 70, stepper tiles 26/38', () => {
    assert.equal(Sizes.bagCover, 250);
    assert.equal(StepperStyles.sizes.sm.tile, 26);
    assert.equal(StepperStyles.sizes.lg.tile, 38);
    assert.match(code(path.join(SRC, 'components', 'food-bag', 'AddToCartSheet.tsx')), /size=\{62\}/);
    assert.match(code(path.join(SRC, 'components', 'cart', 'CartItem.tsx')), /size=\{70\}/);
  });

  // ---------- U1.5: Checkout → Pickup Time → Summary → Payment Method → Payment QR → Success ----------
  console.log('\n[U1.5] Checkout / Payment');
  const SLOT_FOR: Record<string, string> = { res_01: 'slot_1800', res_03: 'slot_1830', res_05: 'slot_1800', res_06: 'slot_1930' };
  /** Fills the REAL cart store with bags and a pickup slot per restaurant. */
  const startCheckout = async (bagIds: string[], quantity = 1, withSlots = true) => {
    resetCartStore();
    resetCheckoutStore();
    for (const id of bagIds) assert.ok((await addBagToCart({ foodBagId: id, quantity })).ok, id);
    if (withSlots) {
      for (const res of new Set(getCart().items.map((i) => i.restaurantId))) {
        const option = (await api.listPickupSlots(res)).find((o) => o.id === SLOT_FOR[res])!;
        const r = await selectPickupSlot(res, option);
        assert.ok(r.ok, `slot for ${res}`);
      }
    }
  };
  const view = async () => buildCheckoutView(getCart(), await api.listFoodBags(), await api.listRestaurants(), await api.listPromos());
  const orderCount = async () => (await api.listOrders()).length;
  const settleAfter = async (outcome: 'success' | 'failed' | 'expired' | 'pending', orderId: string) => {
    // The real chain: payment session → provider outcome → settlePayment → order.
    const session = getPaymentSession(orderId)!;
    await sleep(outcome === 'pending' ? 0 : 320);
    const latest = await paymentService.getPaymentStatus(session.id);
    await settlePayment(latest);
    return { latest, order: (await api.getOrder(orderId))! };
  };
  const quick = (outcome: 'success' | 'failed' | 'expired' | 'pending') =>
    setMockPaymentScenario(outcome === 'pending' ? { outcome: 'success', resolveAfterMs: 600000 } : { outcome, resolveAfterMs: 60 });

  await test('Checkout: empty cart is blocked (no orders, no payment)', async () => {
    resetCartStore();
    const before = await orderCount();
    const r = await placeCheckout();
    assert.ok(!r.ok && r.reason === 'empty_cart');
    assert.equal(await orderCount(), before);
    const v = await view();
    assert.equal(v.orderCount, 0);
    assert.equal(v.ready, false);
    assert.throws(() => buildOrderDrafts(getCart()), /empty/i);
  });
  await test('Checkout: without a pickup slot the flow cannot continue to summary / payment', async () => {
    await startCheckout(['bag_01', 'bag_06'], 1, false);
    const v = await view();
    assert.equal(v.ready, false);
    assert.deepEqual(v.missingSlots, ['Bếp Nhà Lá', 'Chè Sen Bà Tâm']);
    const before = await orderCount();
    const r = await placeCheckout();
    assert.ok(!r.ok && r.reason === 'missing_pickup_slot');
    assert.equal(await orderCount(), before);
    assert.equal(getCart().items.length, 2); // cart untouched
    // one restaurant done, the other still blocks
    await selectPickupSlot('res_01', (await api.listPickupSlots('res_01')).find((o) => o.id === 'slot_1800')!);
    const half = await view();
    assert.deepEqual(half.missingSlots, ['Chè Sen Bà Tâm']);
    assert.equal(half.ready, false);
    const screen = code(path.join(APP, 'order', 'checkout.tsx'));
    assert.match(screen, /disabled=\{!view\.ready\}/);
    assert.match(code(path.join(APP, 'order', 'summary.tsx')), /!view\.ready/);
    assert.match(code(path.join(APP, 'order', 'payment-method.tsx')), /!view\.ready/);
  });
  await test('Pickup time is per restaurant, stored in the cart store, and only valid slots are accepted', async () => {
    await startCheckout(['bag_01', 'bag_04', 'bag_06'], 1, false);
    const slots = async (res: string) => api.listPickupSlots(res);
    const pick = async (res: string, id: string) => selectPickupSlot(res, (await slots(res)).find((o) => o.id === id)!);
    assert.ok((await pick('res_01', 'slot_1830')).ok); // 18:30
    assert.ok((await pick('res_03', 'slot_1800')).ok); // 18:00
    assert.ok((await pick('res_06', 'slot_1930')).ok); // 19:30
    assert.deepEqual(
      Object.fromEntries(Object.entries(getCart().pickupSlots).map(([k, s]) => [k, s.label])),
      { res_01: '18:30', res_03: '18:00', res_06: '19:30' },
    );
    const v = await view();
    assert.deepEqual(v.groups.map((g) => g.view.pickupLabel), ['18:30', '18:00', '19:30']);
    assert.equal(v.ready, true);
    // full slot, slot outside the bag's window, restaurant not in the cart: rejected, nothing changes
    assert.ok(!(await pick('res_01', 'slot_2000')).ok); // 20:00 is after the res_01 bag's 19:30 end
    assert.ok(!(await pick('res_03', 'slot_1930')).ok); // 19:30 is after Bún Bò Cay's 17:30 – 19:00 window
    assert.ok(!(await pick('res_06', 'slot_1800')).ok); // before Chè's 19:00 window
    assert.ok(!(await pick('res_04', 'slot_1930')).ok); // no res_04 bag in the cart
    assert.equal(getCart().pickupSlots.res_03.label, '18:00');
    // changing one restaurant does not touch the others
    assert.ok((await pick('res_01', 'slot_1800')).ok);
    assert.equal(getCart().pickupSlots.res_01.label, '18:00');
    assert.equal(getCart().pickupSlots.res_06.label, '19:30');
    // window maths
    const bags = await api.listFoodBags();
    assert.deepEqual(getPickupWindow([bags.find((b) => b.id === 'bag_01')!, bags.find((b) => b.id === 'bag_02')!]), { start: '18:00', end: '19:30' });
    assert.equal(getPickupWindow([bags.find((b) => b.id === 'bag_01')!, bags.find((b) => b.id === 'bag_03')!]), null); // 17:30–19:30 vs 20:00–21:30
    const all = await api.listPickupSlots('res_03');
    // times are generated per window, inclusive of both ends, on a 30-minute grid
    assert.deepEqual(listSlotsInWindow(all, getPickupWindow([bags.find((b) => b.id === 'bag_04')!])).map((o) => o.label), ['17:30', '18:00', '18:30', '19:00']);
    assert.equal(canSelectSlot({ ...all.find((o) => o.label === '18:00')!, left: 0 }, { start: '17:00', end: '21:00' }), false); // a full time is still rejected (capacity validation stays)
  });
  await test('Checkout / summary totals equal utils/order-pricing; no delivery fee anywhere', async () => {
    await startCheckout(['bag_01', 'bag_06'], 2);
    const v = await view();
    const priced = priceCartGroups(getCart(), null);
    assert.deepEqual(v.money, sumOrderMoney(priced.map((p) => p.money)));
    assert.deepEqual(v.groups.map((g) => g.money), priced.map((p) => p.money));
    assert.equal(v.money.subtotal, 45000 * 2 + 25000 * 2);
    assert.equal(v.money.total, v.money.subtotal - v.money.promoDiscount - v.money.ownBoxDiscount);
    assert.ok(!('deliveryFee' in v.money));
    const drafts = buildOrderDrafts(getCart(), null);
    assert.deepEqual(drafts.map((d) => d.money), v.groups.map((g) => g.money)); // drafts and preview price identically
    assert.equal(getLineTotal(getCart().items[0]), 90000);
    // a promo goes to the first qualifying restaurant only (existing rule), and the sum still matches
    const promo = (await api.listPromos()).find((p) => p.code === 'ECOBITE10K')!;
    const withPromo = priceCartGroups(getCart(), promo);
    assert.equal(withPromo[0].promoCode, 'ECOBITE10K'); // 90.000đ ≥ 80.000đ
    assert.equal(withPromo[1].promoCode, null);
    assert.equal(sumOrderMoney(withPromo.map((p) => p.money)).promoDiscount, 10000);
    // screens do no price arithmetic and mention no delivery
    for (const rel of ['checkout.tsx', 'pickup-time.tsx', 'summary.tsx', 'payment-method.tsx', '[orderId]/payment.tsx', '[orderId]/payment-success.tsx']) {
      const c = code(path.join(APP, 'order', rel));
      assert.doesNotMatch(c, /unitPrice\s*\*|quantity\s*\*|\.reduce\(|subtotal\s*[-+]|total\s*[-+]\s*\w/, rel);
      assert.doesNotMatch(c, /deliveryFee|giao hàng|phí giao|shipping|delivery|driver|shipper|courier/i, rel);
      assert.doesNotMatch(c, /from '@\/(data|services)/, rel);
      assert.doesNotMatch(c, /#[0-9a-fA-F]{3,8}\b|rgba?\(|fontWeight|fontFamily/, rel);
    }
    for (const f of walk(path.join(SRC, 'features', 'checkout'))) assert.doesNotMatch(code(f), /deliveryFee|giao hàng|phí giao|delivery|shipper|courier/i, f);
  });
  await test('single restaurant: ONE order, payment session for it, cart cleared once committed', async () => {
    await startCheckout(['bag_01'], 2);
    const expected = (await view()).money.total;
    const before = await orderCount();
    const r = await placeCheckout();
    assert.ok(r.ok);
    if (!r.ok) return;
    assert.equal(r.orders.length, 1);
    assert.equal(await orderCount(), before + 1);
    const order = r.orders[0];
    assert.equal(order.status, 'placed');
    assert.equal(order.paymentStatus, 'pending');
    assert.equal(order.money.total, expected);
    assert.equal(order.pickupSlot.label, '18:00');
    assert.equal(order.pickupQr, null); // no pickup QR before payment
    assert.deepEqual(getCart(), EMPTY_CART); // committed → cart cleared
    assert.equal(getCartCount(getCart()), 0);
    assert.equal(r.route, `/order/${order.id}/payment`);
    assert.equal(r.session?.orderId, order.id);
    assert.equal(r.session?.amount, expected);
    assert.equal(getPaymentSession(order.id)?.id, r.session?.id);
  });
  await test('two restaurants → 2 orders, three restaurants → 3 orders: unique codes, shared checkoutId, own slot each', async () => {
    await startCheckout(['bag_01', 'bag_02', 'bag_06'], 1);
    const two = await placeCheckout();
    assert.ok(two.ok);
    if (!two.ok) return;
    assert.equal(two.orders.length, 2);
    assert.deepEqual(two.orders.map((o) => o.restaurantId), ['res_01', 'res_06']);
    assert.equal(new Set(two.orders.map((o) => o.checkoutId)).size, 1);
    assert.equal(new Set(two.orders.map((o) => o.orderCode)).size, 2);
    assert.deepEqual(two.orders.map((o) => o.pickupSlot.label), ['18:00', '19:30']);
    assert.deepEqual(two.orders[0].items.map((i) => i.foodBagId), ['bag_01', 'bag_02']); // items of one restaurant stay together
    assert.ok(two.orders.every((o) => o.items.every((i) => !['bag_06'].includes(i.foodBagId)) || o.restaurantId === 'res_06'));
    assert.deepEqual(getCart(), EMPTY_CART);

    await startCheckout(['bag_01', 'bag_04', 'bag_06'], 1);
    const three = await placeCheckout();
    assert.ok(three.ok);
    if (!three.ok) return;
    assert.equal(three.orders.length, 3);
    const codes = [...two.orders, ...three.orders].map((o) => o.orderCode);
    assert.equal(new Set(codes).size, 5); // unique across checkouts too
    assert.equal(new Set(three.orders.map((o) => o.pickupQr)).size, 1); // none yet
    // sequential payment model: only the FIRST order has a session; the rest wait their turn
    assert.ok(getPaymentSession(three.orders[0].id));
    assert.equal(getPaymentSession(three.orders[1].id), null);
    assert.equal(getPaymentSession(three.orders[2].id), null);
    const first = await api.getOrder(three.orders[0].id);
    assert.equal(first?.status, 'placed');
  });
  await test('payment methods: only QR bank transfer is enabled, the rest are disabled with "Sắp có"', async () => {
    const methods = await paymentService.listPaymentMethods();
    assert.deepEqual(methods.filter((m) => m.enabled).map((m) => m.id), ['bank_qr']);
    for (const m of methods.filter((x) => x.id !== 'bank_qr')) {
      assert.equal(m.enabled, false, m.id);
      assert.equal(m.badge, 'Sắp có', m.id);
    }
    assert.deepEqual(methods.map((m) => m.id).sort(), ['bank_qr', 'card', 'cash', 'e_wallet']);
    await startCheckout(['bag_01']);
    const before = await orderCount();
    for (const id of ['card', 'e_wallet', 'cash'] as const) {
      const r = await placeCheckout({ method: id });
      assert.ok(!r.ok && r.reason === 'method_unavailable', id);
    }
    await assert.rejects(() => paymentService.createPayment({ orderId: 'x', orderCode: 'EB-2409-999', amount: 1000, method: 'card' }), /not available/);
    assert.equal(await orderCount(), before); // nothing created
    assert.equal(getCart().items.length, 1); // cart kept
    const screen = code(path.join(APP, 'order', 'payment-method.tsx'));
    assert.match(screen, /PaymentMethodRow/);
    assert.match(screen, /m\.enabled/);
    assert.match(screen, /Tiếp tục thanh toán/);
    resetCartStore();
  });
  await test('failed checkout (bag no longer available) keeps the cart and creates no order', async () => {
    await startCheckout(['bag_01'], 1);
    dispatchCart({ type: 'set_quantity', foodBagId: 'bag_01', quantity: 50, maxQuantity: 999 }); // more than the restaurant has
    const before = await orderCount();
    const r = await placeCheckout();
    assert.ok(!r.ok && r.reason === 'unavailable');
    assert.equal(await orderCount(), before);
    assert.equal(getCart().items.length, 1); // NOT cleared
    assert.equal(getCart().pickupSlots.res_01.label, '18:00');
    resetCartStore();
  });
  await test('Payment QR is created from the payment service and is never a pickup QR', async () => {
    quick('pending');
    await startCheckout(['bag_01'], 1);
    const r = await placeCheckout();
    assert.ok(r.ok && r.session);
    if (!r.ok || !r.session) return;
    const qr = r.session.qr;
    assert.equal(qr.kind, 'payment');
    assert.match(qr.payload, /^MOCK-PAYMENT\|/);
    assert.ok(!('token' in qr) && !('orderCode' in qr));
    assert.equal(qr.amount, r.orders[0].money.total);
    assert.equal(qr.reference, orderCodeToTransferNote(r.orders[0].orderCode));
    assert.equal(r.session.status, 'pending');
    assert.equal(Date.parse(r.session.holdExpiresAt) - Date.parse(r.session.createdAt), 10 * 60 * 1000); // 10-minute hold
    // the payment QR payload is refused as a pickup QR token
    await assert.rejects(() => api.verifyPickupQr(r.orders[0].id, qr.payload), /Invalid pickup QR/);
    assert.equal((await api.getOrder(r.orders[0].id))?.pickupQr, null);
    const pay = code(path.join(APP, 'order', '[orderId]', 'payment.tsx'));
    assert.match(pay, /PaymentQrCard qr=\{current\.qr\}/);
    assert.doesNotMatch(pay, /PickupQr/);
    assert.doesNotMatch(code(path.join(APP, 'order', '[orderId]', 'payment-success.tsx')), /PaymentQrCard/);
    // phases: pending session shows the QR first
    assert.equal(derivePaymentPhase(r.session, Date.parse(r.session.createdAt) + 100), 'qr');
    assert.equal(derivePaymentPhase(r.session, Date.parse(r.session.createdAt) + 5000), 'waiting');
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 4000 });
  });
  await test('payment success: order → paid, pickup QR issued (distinct token), lifecycle continues without skipping', async () => {
    quick('success');
    await startCheckout(['bag_01'], 1);
    const r = await placeCheckout();
    assert.ok(r.ok);
    if (!r.ok) return;
    const { latest, order } = await settleAfter('success', r.orders[0].id);
    assert.equal(latest.status, 'success');
    assert.equal(derivePaymentPhase(latest), 'success');
    assert.equal(order.status, 'paid');
    assert.equal(order.paymentStatus, 'success');
    assert.ok(order.statusHistory.placed && order.statusHistory.paid);
    assert.equal(order.pickupQr?.kind, 'pickup');
    assert.equal(order.pickupQr?.orderCode, order.orderCode);
    assert.notEqual(order.pickupQr?.token, latest.qr.payload);
    // idempotent: settling again does not fail or change the order
    await settlePayment(latest);
    assert.equal((await api.getOrder(order.id))?.status, 'paid');
    // the rest of the lifecycle is still strictly linear: paid → preparing → ready
    assert.equal((await api.simulateRestaurantProgress(order.id)).status, 'preparing');
    assert.equal((await api.simulateRestaurantProgress(order.id)).status, 'ready');
    assert.deepEqual(getCart(), EMPTY_CART);
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 4000 });
  });
  await test('payment failed: order stays placed, retry makes a NEW session for the SAME order (no duplicate order), then succeeds', async () => {
    quick('failed');
    await startCheckout(['bag_01'], 1);
    const r = await placeCheckout();
    assert.ok(r.ok && r.session);
    if (!r.ok || !r.session) return;
    const ordersBefore = await orderCount();
    const { latest, order } = await settleAfter('failed', r.orders[0].id);
    assert.equal(latest.status, 'failed');
    assert.equal(derivePaymentPhase(latest), 'failed');
    assert.equal(order.status, 'placed'); // not paid, not expired
    assert.equal(order.paymentStatus, 'pending');
    assert.ok(canRetryPayment(latest));
    assert.equal(Date.parse(latest.retryUntil!) - (Date.parse(r.session.createdAt) + 60), 5 * 60 * 1000); // 5-minute retry window
    assert.deepEqual(getCart(), EMPTY_CART); // a failed payment does not put the cart back or destroy the order

    quick('success');
    const again = await retryOrderPayment(order.id);
    assert.notEqual(again.id, r.session.id);
    assert.equal(again.orderId, order.id);
    assert.equal(again.orderCode, order.orderCode);
    assert.equal(again.amount, order.money.total);
    assert.equal(getPaymentSession(order.id)?.id, again.id);
    assert.equal(await orderCount(), ordersBefore); // retry did NOT create an order
    const done = await settleAfter('success', order.id);
    assert.equal(done.order.status, 'paid');
    assert.equal(await orderCount(), ordersBefore);
    // a session that did not fail cannot be "retried"
    await assert.rejects(() => retryOrderPayment(order.id), /Only a failed payment/);
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 4000 });
  });
  await test('payment expired: order becomes expired (terminal), no duplicate order, cart stays empty; ensurePaymentSession gives no new QR', async () => {
    quick('expired');
    await startCheckout(['bag_01'], 1);
    const r = await placeCheckout();
    assert.ok(r.ok);
    if (!r.ok) return;
    const ordersBefore = await orderCount();
    const { latest, order } = await settleAfter('expired', r.orders[0].id);
    assert.equal(latest.status, 'expired');
    assert.equal(derivePaymentPhase(latest), 'expired');
    assert.equal(order.status, 'expired');
    assert.equal(isTerminal(order), true);
    assert.equal(order.pickupQr, null);
    assert.equal(await orderCount(), ordersBefore);
    assert.deepEqual(getCart(), EMPTY_CART);
    assert.equal(canRetryPayment(latest), false); // expiry restarts the purchase, it is not a retry
    resetCheckoutStore();
    assert.equal(await ensurePaymentSession(order), null); // an expired order gets no new payment session
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 4000 });
  });
  await test('multi-restaurant payment is sequential: one QR per order, next unpaid order, then Pickup QR of the first active order', async () => {
    quick('success');
    await startCheckout(['bag_01', 'bag_06'], 1);
    const r = await placeCheckout();
    assert.ok(r.ok);
    if (!r.ok) return;
    const [a, b] = r.orders;
    let progress = getCheckoutProgress(await api.listOrders(), r.checkoutId, a.id);
    assert.deepEqual(progress.orders.map((o) => o.id), [a.id, b.id]);
    assert.equal(progress.nextToPay?.id, b.id);
    assert.equal(progress.paid.length, 0);
    assert.equal(progress.firstPickup, null);
    // pay A
    await settleAfter('success', a.id);
    progress = getCheckoutProgress(await api.listOrders(), r.checkoutId, a.id);
    assert.equal(progress.nextToPay?.id, b.id); // continue with the next unpaid order
    assert.deepEqual(progress.paid.map((o) => o.id), [a.id]);
    // B's turn: its own session (own QR, own 10-minute hold), never A's
    const sessionB = (await ensurePaymentSession((await api.getOrder(b.id))!))!;
    assert.equal(sessionB.orderId, b.id);
    assert.notEqual(sessionB.id, getPaymentSession(a.id)!.id);
    assert.equal(sessionB.amount, b.money.total);
    assert.notEqual(sessionB.qr.payload, getPaymentSession(a.id)!.qr.payload);
    await settleAfter('success', b.id);
    progress = getCheckoutProgress(await api.listOrders(), r.checkoutId, b.id);
    assert.equal(progress.nextToPay, null);
    assert.deepEqual(progress.paid.map((o) => o.id), [a.id, b.id]);
    assert.equal(progress.firstPickup?.id, a.id); // Pickup QR starts with the first active order
    const [pa, pb] = await Promise.all([api.getPickupQr(a.id), api.getPickupQr(b.id)]);
    assert.ok(pa && pb && pa.token !== pb.token); // separate pickup QR per restaurant
    // an expired sibling is skipped, a picked-up one is not "active"
    const skipped = getCheckoutProgress([{ ...b, status: 'expired' }, { ...a, status: 'paid' }], r.checkoutId, a.id);
    assert.equal(skipped.nextToPay, null);
    assert.equal(getCheckoutProgress([{ ...a, status: 'picked_up' }, { ...b, status: 'paid' }], r.checkoutId).firstPickup?.id, b.id);
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 4000 });
  });
  await test('navigation: Cart → Checkout → Pickup Time / Summary → Payment Method → Payment QR → Success → Pickup QR', () => {
    const cart = code(path.join(APP, '(main)', 'cart.tsx'));
    const checkout = code(path.join(APP, 'order', 'checkout.tsx'));
    const summary = code(path.join(APP, 'order', 'summary.tsx'));
    const method = code(path.join(APP, 'order', 'payment-method.tsx'));
    const pay = code(path.join(APP, 'order', '[orderId]', 'payment.tsx'));
    const success = code(path.join(APP, 'order', '[orderId]', 'payment-success.tsx'));
    assert.match(cart, /router\.push\('\/order\/checkout'\)/);
    assert.match(checkout, /pathname: '\/order\/pickup-time', params: \{ restaurantId/);
    assert.match(checkout, /router\.push\('\/order\/summary'\)/);
    assert.match(summary, /router\.push\(PAYMENT_METHOD_ROUTE\)/);
    assert.equal(PAYMENT_METHOD_ROUTE, '/order/payment-method');
    assert.match(method, /placeCheckout\(/);
    assert.match(method, /router\.replace\(result\.route\)/);
    assert.equal(paymentRoute('ord_x'), '/order/ord_x/payment');
    assert.match(pay, /paymentSuccessRoute\(order\.id\)/);
    assert.equal(paymentSuccessRoute('ord_x'), '/order/ord_x/payment-success');
    assert.match(success, /pickupQrRoute\(pickupTarget\.id\)/);
    assert.equal(pickupQrRoute('ord_x'), '/order/ord_x/pickup-qr');
    assert.match(success, /progress\?\.nextToPay/);
    assert.doesNotMatch(success, /pickup-instructions/); // D-3: no 8.1 in between
    assert.equal(PICKUP_TIME_ROUTE, '/order/pickup-time');
    assert.equal(SUMMARY_ROUTE, '/order/summary');
    assert.equal(CHECKOUT_ROUTE, '/order/checkout');
    // the pickup flow was still placeholders in U1.5; U1.6 builds every screen
    for (const rel of ['pickup-qr', 'pickup-instructions', 'ready', 'arrived', 'verified', 'completed', 'status']) {
      assert.doesNotMatch(code(path.join(APP, 'order', '[orderId]', `${rel}.tsx`)), /PlaceholderScreen/, rel);
    }
    // bottom tabs are unchanged and Search is still not a tab
    assert.deepEqual(TAB_ITEMS.map((t) => t.key), ['home', 'orders', 'cart', 'account']);
  });
  await test('multi-restaurant checkout UI keeps restaurants separate and says so; D-18 is documented', () => {
    for (const rel of ['checkout.tsx', 'summary.tsx']) {
      const c = code(path.join(APP, 'order', rel));
      assert.match(c, /view\.groups\.map/, rel);
      assert.match(c, /key=\{group\.restaurantId\}/, rel);
      assert.match(c, /view\.orderCount > 1/, rel);
    }
    assert.match(code(path.join(APP, 'order', 'checkout.tsx')), /onPickTime=/);
    const decisions = read(path.join(ROOT, 'docs', 'DECISIONS.md'));
    assert.match(decisions, /D-18/);
    assert.match(decisions, /sequential|lần lượt/i);
  });
  await test('U1.5 reference sizes: success disc 118, order item thumb 46', () => {
    assert.match(code(path.join(SRC, 'components', 'order', 'PaymentSuccessHero.tsx')), /width: 118/);
    assert.match(code(path.join(SRC, 'components', 'order', 'OrderItemRow.tsx')), /size=\{46\}/);
  });

  // ---------- U1.6: Pickup QR → Instructions → Ready → Arrives → QR Verified → Completed ----------
  console.log('\n[U1.6] Pickup flow');
  /** Real chain: cart → placeCheckout → payment sessions → settlePayment. Returns the PAID orders. */
  const payAll = async (bagIds: string[]) => {
    quick('success');
    await startCheckout(bagIds, 1);
    const r = await placeCheckout();
    assert.ok(r.ok);
    if (!r.ok) throw new Error('checkout failed');
    const paid: Order[] = [];
    for (const o of r.orders) {
      await ensurePaymentSession((await api.getOrder(o.id))!);
      await settleAfter('success', o.id);
      paid.push((await api.getOrder(o.id))!);
    }
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 4000 });
    return { checkoutId: r.checkoutId, orders: paid };
  };
  const step = async (id: string) => api.simulateRestaurantProgress(id);
  const ready = async (id: string) => {
    await step(id);
    return step(id);
  };

  await test('Pickup QR is issued only after payment: unpaid order has none; paid order gets a PickupQr with an opaque token', async () => {
    quick('pending');
    await startCheckout(['bag_01'], 1);
    const r = await placeCheckout();
    assert.ok(r.ok);
    if (!r.ok) return;
    const unpaid = (await api.getOrder(r.orders[0].id))!;
    assert.equal(unpaid.status, 'placed');
    assert.equal(unpaid.pickupQr, null);
    assert.equal(await api.getPickupQr(unpaid.id), null);
    assert.equal(getPickupGate(unpaid), 'unpaid');
    assert.equal(resolvePickupRoute(unpaid), `/order/${unpaid.id}/payment`);
    const noScan = await simulateStaffScan(unpaid.id, 'anything');
    assert.ok(!noScan.ok && noScan.reason === 'invalid_qr');

    quick('success');
    const session = getPaymentSession(unpaid.id)!;
    resetCheckoutStore();
    await startCheckout(['bag_04'], 1);
    const p = await placeCheckout();
    assert.ok(p.ok);
    if (!p.ok) return;
    await settleAfter('success', p.orders[0].id);
    const paid = (await api.getOrder(p.orders[0].id))!;
    const qr = paid.pickupQr!;
    assert.equal(qr.kind, 'pickup');
    assert.equal(qr.orderId, paid.id);
    assert.equal(qr.orderCode, paid.orderCode);
    assert.equal(qr.verifiedAt, null);
    assert.ok(qr.token.length >= 12);
    for (const secret of [paid.id, paid.orderCode, paid.orderCode.replace(/-/g, ''), paid.checkoutId, session.id, session.qr.payload]) {
      assert.ok(!qr.token.includes(secret), `token must not contain ${secret}`);
    }
    assert.equal(getPickupGate(paid), 'ok');
    assert.equal(getPickupStage(paid), 'preparing'); // paid → preparing
    assert.equal(resolvePickupRoute(paid), `/order/${paid.id}/pickup-qr`);
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 4000 });
  });
  await test('lifecycle stays linear: paid → preparing → ready → qr_verified → picked_up; no skipping, no going back', async () => {
    const { orders } = await payAll(['bag_01']);
    const id = orders[0].id;
    assert.equal(orders[0].status, 'paid');
    assert.equal((await step(id)).status, 'preparing');
    const rdy = await step(id);
    assert.equal(rdy.status, 'ready');
    assert.ok(rdy.statusHistory.paid && rdy.statusHistory.preparing && rdy.statusHistory.ready);
    assert.equal((await step(id)).status, 'ready'); // the restaurant simulation stops at ready
    // helper level: only the immediate next status is legal
    const cases: [OrderStatus, OrderStatus, boolean][] = [
      ['placed', 'paid', true], ['paid', 'preparing', true], ['preparing', 'ready', true], ['ready', 'qr_verified', true], ['qr_verified', 'picked_up', true],
      ['placed', 'ready', false], ['placed', 'picked_up', false], ['paid', 'picked_up', false], ['preparing', 'picked_up', false], ['ready', 'picked_up', false],
      ['paid', 'ready', false], ['picked_up', 'ready', false], ['picked_up', 'paid', false], ['ready', 'preparing', false], ['qr_verified', 'ready', false],
    ];
    for (const [from, to, ok] of cases) assert.equal(canTransition(from, to), ok, `${from} → ${to}`);
    assert.throws(() => transitionOrder({ ...rdy, status: 'paid' }, 'picked_up'), /Illegal order transition/);
    assert.throws(() => transitionOrder({ ...rdy, status: 'picked_up' }, 'ready'), /Illegal order transition/);
    // the service cannot jump either
    await assert.rejects(() => api.completePickup(id), /Illegal order transition/); // ready → picked_up without a verified QR
    assert.equal((await api.getOrder(id))?.status, 'ready');
    assert.deepEqual(ORDER_STATUS_SEQUENCE, ['placed', 'paid', 'preparing', 'ready', 'qr_verified', 'picked_up']);
    assert.equal(ORDER_STATUS_LABEL.qr_verified, 'QR đã được xác nhận');
    assert.equal(ORDER_STATUS_LABEL.picked_up, 'Đã nhận hàng');
  });
  await test('QR verification: only a READY order, only ITS token; payment QR / order code / other order / made-up values are rejected', async () => {
    quick('success');
    const { orders } = await payAll(['bag_01', 'bag_06']);
    const [a, b] = orders;
    const tokenA = a.pickupQr!.token;
    const tokenB = b.pickupQr!.token;
    assert.notEqual(tokenA, tokenB);
    // not ready yet (paid, then preparing): the correct token is still refused and nothing changes
    for (const expected of ['paid', 'preparing'] as const) {
      const early = await simulateStaffScan(a.id, tokenA);
      assert.ok(!early.ok && early.reason === 'not_ready', expected);
      assert.equal((await api.getOrder(a.id))?.status, expected);
      if (expected === 'paid') await step(a.id);
    }
    await step(a.id); // preparing → ready
    const payQr = getPaymentSession(a.id)!.qr.payload;
    for (const wrong of ['wrong-token', '', a.orderCode, a.id, payQr, tokenB, tokenA + 'x', tokenA.toUpperCase()]) {
      const r = await simulateStaffScan(a.id, wrong);
      assert.ok(!r.ok && r.reason === 'invalid_qr', `should reject "${wrong.slice(0, 16)}"`);
    }
    assert.equal((await api.getOrder(a.id))?.status, 'ready'); // every rejection left the order untouched
    assert.equal((await api.getOrder(a.id))?.pickupQr?.verifiedAt, null);
    // the other order's token does not verify THIS order, and B (not ready) is not verifiable with its own token yet
    const notReadyB = await simulateStaffScan(b.id, tokenB);
    assert.ok(!notReadyB.ok && notReadyB.reason === 'not_ready');
    // correct scan: ready → qr_verified ("QR đã được xác nhận"), same token, nothing new created
    const ordersBefore = await orderCount();
    const ok = await simulateStaffScan(a.id, tokenA);
    assert.ok(ok.ok);
    if (!ok.ok) return;
    assert.equal(ok.order.status, 'qr_verified');
    assert.equal(getPickupStage(ok.order), 'verified');
    assert.equal(ok.order.pickupQr?.token, tokenA); // no second token
    assert.ok(ok.order.pickupQr?.verifiedAt);
    assert.ok(ok.order.statusHistory.qr_verified);
    assert.equal(await orderCount(), ordersBefore); // no new order / payment
    assert.equal(resolvePickupRoute(ok.order), `/order/${a.id}/verified`);
    // idempotency: the same QR again is refused ("already used"), state unchanged, no duplicate records
    const again = await simulateStaffScan(a.id, tokenA);
    assert.ok(!again.ok && again.reason === 'already_used');
    assert.equal((await api.getOrder(a.id))?.status, 'qr_verified');
    assert.equal((await api.getOrder(a.id))?.pickupQr?.token, tokenA);
    assert.equal(await orderCount(), ordersBefore);
    assert.equal((await api.getOrder(b.id))?.status, 'paid'); // the other restaurant's order was not touched
    // and B's token still cannot be used on A
    const cross = await simulateStaffScan(a.id, tokenB);
    assert.ok(!cross.ok && cross.reason === 'invalid_qr');
  });
  await test('completion: verified → picked_up only through the customer confirmation; final state cannot move back; QR cannot be reused', async () => {
    const { orders } = await payAll(['bag_04']);
    const o = orders[0];
    const token = o.pickupQr!.token;
    // cannot confirm receipt before the staff scan (paid / ready)
    let early = await confirmReceived(o.id);
    assert.ok(!early.ok && early.reason === 'not_verified');
    await ready(o.id);
    early = await confirmReceived(o.id);
    assert.ok(!early.ok && early.reason === 'not_verified');
    assert.equal((await api.getOrder(o.id))?.status, 'ready'); // "I have arrived" / receipt did not complete anything
    assert.ok((await simulateStaffScan(o.id, token)).ok);
    assert.equal((await api.getOrder(o.id))?.status, 'qr_verified');
    const done = await confirmReceived(o.id);
    assert.ok(done.ok);
    if (!done.ok) return;
    assert.equal(done.order.status, 'picked_up');
    assert.equal(ORDER_STATUS_LABEL[done.order.status], 'Đã nhận hàng');
    assert.ok(done.order.statusHistory.picked_up);
    assert.equal(isTerminal(done.order), true);
    assert.equal(getPickupStage(done.order), 'completed');
    assert.equal(resolvePickupRoute(done.order), `/order/${o.id}/completed`);
    // final: no way back, no second completion, the used QR is dead
    const twice = await confirmReceived(o.id);
    assert.ok(!twice.ok && twice.reason === 'not_verified');
    const rescan = await simulateStaffScan(o.id, token);
    assert.ok(!rescan.ok && rescan.reason === 'already_used');
    assert.equal((await step(o.id)).status, 'picked_up'); // the restaurant simulation cannot move it back
    assert.equal((await api.getOrder(o.id))?.status, 'picked_up');
    await assert.rejects(() => api.completePickup(o.id), /Illegal order transition/);
    await assert.rejects(() => api.cancelOrder(o.id, 'x'), /cannot be cancelled/);
    // the dev "Advance" chain uses the same services and ends in the same place
    const dev = await devAdvanceOrder(o.id);
    assert.equal(dev.ok, false); // a completed order cannot be advanced again
  });
  await test('errors: invalid order id, cancelled, expired and missing pickup QR are handled (no throw, no QR, cannot verify)', async () => {
    const missing = await simulateStaffScan('ord_does_not_exist', 'x');
    assert.ok(!missing.ok && missing.reason === 'not_found');
    const noOrder = await confirmReceived('ord_does_not_exist');
    assert.ok(!noOrder.ok && noOrder.reason === 'not_found');
    assert.equal(await api.getOrder('ord_does_not_exist'), null);
    // cancelled (paid, then cancelled before preparing)
    const { orders } = await payAll(['bag_01']);
    const cancelled = await api.cancelOrder(orders[0].id, 'test');
    assert.equal(cancelled.status, 'cancelled');
    assert.equal(cancelled.pickupQr, null);
    assert.equal(getPickupGate(cancelled), 'cancelled');
    assert.equal(resolvePickupRoute(cancelled), null);
    const c = await simulateStaffScan(cancelled.id, orders[0].pickupQr!.token); // the old token is worthless now
    assert.ok(!c.ok && c.reason === 'invalid_qr');
    assert.equal((await api.getOrder(cancelled.id))?.status, 'cancelled');
    // expired (payment hold ran out)
    quick('expired');
    await startCheckout(['bag_06'], 1);
    const r = await placeCheckout();
    assert.ok(r.ok);
    if (!r.ok) return;
    await settleAfter('expired', r.orders[0].id);
    const expired = (await api.getOrder(r.orders[0].id))!;
    assert.equal(expired.status, 'expired');
    assert.equal(getPickupGate(expired), 'expired');
    assert.equal(resolvePickupRoute(expired), null);
    assert.equal((await api.getPickupQr(expired.id)), null);
    const e = await simulateStaffScan(expired.id, 'x');
    assert.ok(!e.ok && e.reason === 'invalid_qr');
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 4000 });
    // paid order whose pickup QR is missing → an explicit state, not a blank screen
    assert.equal(getPickupGate({ status: 'paid', pickupQr: null }), 'no_qr');
    // error mapping is exact
    assert.equal(classifyPickupError(new Error('Invalid pickup QR')), 'invalid_qr');
    assert.equal(classifyPickupError(new Error('Pickup QR already used')), 'already_used');
    assert.equal(classifyPickupError(new Error('Order is not ready for pickup (paid)')), 'not_ready');
    assert.equal(classifyPickupError(new Error('Order not found: x')), 'not_found');
    assert.equal(classifyPickupError(new Error('boom')), 'unknown');
    // every state has a way out, and no state is built from delivery wording
    const gate = code(path.join(SRC, 'components', 'order', 'PickupGateState.tsx'));
    for (const kind of ['not_found', 'error', 'unpaid', 'expired', 'cancelled', 'no_qr']) assert.match(gate, new RegExp(`case '${kind}'`));
    assert.match(gate, /primaryAction/);
  });
  await test('multi-restaurant pickup: separate pickup QR and state per order; completing one leaves the next available (D-21)', async () => {
    const { checkoutId, orders } = await payAll(['bag_01', 'bag_06']);
    const [a, b] = orders;
    assert.equal(orders.length, 2);
    assert.notEqual(a.pickupQr!.token, b.pickupQr!.token);
    assert.notEqual(a.pickupQr!.orderCode, b.pickupQr!.orderCode);
    assert.equal(a.pickupQr!.orderId, a.id);
    assert.equal(b.pickupQr!.orderId, b.id);
    assert.notEqual(a.restaurantId, b.restaurantId);
    assert.deepEqual(getOrderPosition(orders, checkoutId, b.id), { index: 2, total: 2 });
    assert.equal(getOrderPosition([a], a.checkoutId, a.id), null); // single order: no "Đơn 1/1"
    // pick up A completely
    await ready(a.id);
    assert.ok((await simulateStaffScan(a.id, a.pickupQr!.token)).ok);
    assert.ok((await confirmReceived(a.id)).ok);
    const all = await api.listOrders();
    assert.equal(all.find((o) => o.id === a.id)?.status, 'picked_up');
    assert.equal(all.find((o) => o.id === b.id)?.status, 'paid'); // B untouched
    assert.equal(all.find((o) => o.id === b.id)?.pickupQr?.verifiedAt, null);
    const next = getNextPickupStep(all, checkoutId, a.id);
    assert.equal(next.kind, 'pickup');
    assert.equal(next.kind === 'pickup' ? next.order.id : '', b.id);
    assert.equal(resolvePickupRoute(all.find((o) => o.id === b.id)!), `/order/${b.id}/pickup-qr`);
    // B: A's finished QR does nothing on B
    const misuse = await simulateStaffScan(b.id, a.pickupQr!.token);
    assert.ok(!misuse.ok && misuse.reason === 'invalid_qr');
    await ready(b.id);
    assert.ok((await simulateStaffScan(b.id, b.pickupQr!.token)).ok);
    assert.ok((await confirmReceived(b.id)).ok);
    assert.equal(getNextPickupStep(await api.listOrders(), checkoutId, b.id).kind, 'none');
    // a sibling that is still unpaid is offered for payment; an expired one is skipped
    const placedSibling = { ...b, status: 'placed' as const, pickupQr: null };
    assert.equal(getNextPickupStep([{ ...a, status: 'picked_up' }, placedSibling], checkoutId, a.id).kind, 'pay');
    assert.equal(getNextPickupStep([{ ...a, status: 'picked_up' }, { ...b, status: 'expired' as const, pickupQr: null }], checkoutId, a.id).kind, 'none');
  });
  await test('resume: every stage maps to one route and backing out never touches the order', async () => {
    const base = (await payAll(['bag_01'])).orders[0];
    const at = (status: OrderState) => resolvePickupRoute({ id: base.id, status });
    assert.equal(at('placed'), `/order/${base.id}/payment`);
    for (const s of ['paid', 'preparing', 'ready'] as const) assert.equal(at(s), `/order/${base.id}/pickup-qr`, s);
    assert.equal(at('qr_verified'), `/order/${base.id}/verified`);
    assert.equal(at('picked_up'), `/order/${base.id}/completed`);
    assert.equal(at('cancelled'), null);
    assert.equal(at('expired'), null);
    assert.deepEqual(['unpaid', 'preparing', 'preparing', 'ready', 'verified', 'completed', 'expired', 'cancelled'], (['placed', 'paid', 'preparing', 'ready', 'qr_verified', 'picked_up', 'expired', 'cancelled'] as const).map((s) => getPickupStage({ status: s })));
    // re-opening (or polling) creates nothing and keeps the same token
    const before = await orderCount();
    const again = (await api.getOrder(base.id))!;
    assert.equal(again.pickupQr?.token, base.pickupQr?.token);
    assert.equal(await orderCount(), before);
    for (const rel of ['pickup-qr', 'pickup-instructions', 'ready', 'status', 'arrived', 'verified', 'completed']) {
      const c = code(path.join(APP, 'order', '[orderId]', `${rel}.tsx`));
      assert.doesNotMatch(c, /cancelOrder|expireOrder|clearCart|placeCheckout|markOrderPaid|createPayment|checkout\(/, rel);
    }
  });
  await test('navigation: Payment Success → Pickup QR → Instructions → Ready → Arrives → (staff scan) QR Verified → Completed', () => {
    const src = (rel: string) => code(path.join(APP, 'order', '[orderId]', `${rel}.tsx`));
    assert.match(src('payment-success'), /pickupQrRoute\(pickupTarget\.id\)/);
    assert.match(src('pickup-qr'), /pickupRoutes\.instructions\(order\.id\)/);
    assert.match(src('pickup-instructions'), /pickupRoutes\.ready\(order\.id\)/);
    assert.match(src('ready'), /pickupRoutes\.arrived\(order\.id\)/);
    assert.match(src('arrived'), /pickupRoutes\.qr\(order\.id\)/);
    // "I have arrived" only opens the QR; it never verifies or completes
    assert.doesNotMatch(src('arrived'), /completed|verified|confirmReceived|simulateStaffScan|completePickup|verifyPickupQr/);
    // the customer app does not scan: QR Verified is reached by redirect once the order really is qr_verified
    assert.match(src('pickup-qr'), /usePickupScreen\(orderId, \['preparing', 'ready'\]\)/);
    assert.equal(resolvePickupRoute({ id: 'o', status: 'qr_verified' }), '/order/o/verified');
    assert.doesNotMatch(src('pickup-qr'), /simulateStaffScan|verifyPickupQr|confirmReceived/);
    assert.match(src('verified'), /confirmReceived\(order\.id\)/);
    assert.match(src('verified'), /pickupRoutes\.completed\(order\.id\)/);
    assert.match(src('completed'), /router\.replace\('\/home'\)/);
    // every pickup screen is real, follows the real order and never invents state
    for (const rel of ['pickup-qr', 'pickup-instructions', 'ready', 'status', 'arrived', 'verified', 'completed']) {
      assert.doesNotMatch(src(rel), /PlaceholderScreen/, rel);
      assert.match(src(rel), /usePickupScreen\(/, rel);
      assert.match(src(rel), /<PickupGateState/, rel);
    }
    // ready-before-arrival: the arrival screen refuses a not-ready order
    assert.match(src('arrived'), /getPickupStage\(order\) !== 'ready'/);
    assert.match(src('ready'), /disabled/);
    // Orders and Account were placeholders in U1.6; U1.7 builds them. The AI screens are still a later phase.
    assert.doesNotMatch(code(path.join(APP, '(main)', 'orders.tsx')), /PlaceholderScreen/);
    assert.doesNotMatch(code(path.join(APP, '(main)', 'account.tsx')), /PlaceholderScreen/);
    assert.match(code(path.join(APP, 'ai', 'index.tsx')), /PlaceholderScreen|AiScreen|AiChat|use-ai-chat/);
    assert.deepEqual(TAB_ITEMS.map((t) => t.key), ['home', 'orders', 'cart', 'account']);
  });
  await test('PaymentQr and PickupQr stay separate on the pickup screens (runtime + source)', async () => {
    const pickupScreen = code(path.join(APP, 'order', '[orderId]', 'pickup-qr.tsx'));
    assert.match(pickupScreen, /<PickupQrCard qr=\{qr\}/);
    assert.doesNotMatch(pickupScreen, /PaymentQr|paymentService|getPaymentSession/);
    assert.match(code(path.join(SRC, 'components', 'order', 'PickupQrCard.tsx')), /value=\{qr\.token\}/);
    assert.doesNotMatch(code(path.join(SRC, 'components', 'order', 'PickupQrCard.tsx')), /payload/);
    for (const rel of ['pickup-qr', 'pickup-instructions', 'ready', 'status', 'arrived', 'verified', 'completed']) {
      assert.doesNotMatch(code(path.join(APP, 'order', '[orderId]', `${rel}.tsx`)), /PaymentQrCard|qr\.payload/, rel);
    }
    // runtime: a payment session's QR is not a pickup token for any paid order
    const { orders } = await payAll(['bag_01']);
    await ready(orders[0].id);
    const payload = getPaymentSession(orders[0].id)!.qr.payload;
    const r = await simulateStaffScan(orders[0].id, payload);
    assert.ok(!r.ok && r.reason === 'invalid_qr');
    assert.equal((await api.getOrder(orders[0].id))?.status, 'ready');
  });
  await test('Order Completed shows impact through utils/impact and instructions are self-pickup only; no camera / scanner dependency', () => {
    const completed = code(path.join(APP, 'order', '[orderId]', 'completed.tsx'));
    assert.match(completed, /calcImpact\(bags\)/);
    assert.match(completed, /countBags\(order\.items\)/);
    assert.doesNotMatch(completed, /IMPACT_PER_BAG|\*\s*\d/); // no impact constants or maths of its own
    assert.deepEqual(calcImpact(2), { foodKg: 2.4, co2Kg: 5 });
    assert.equal(PICKUP_INSTRUCTION_STEPS.length, 5);
    const words = PICKUP_INSTRUCTION_STEPS.map((s) => `${s.title} ${s.detail}`).join(' ');
    assert.match(words, /quét/);
    assert.match(words, /nhận/i);
    assert.doesNotMatch(words, /shipper|giao tận|tài xế|courier|driver|phí giao/i);
    for (const rel of ['pickup-qr', 'pickup-instructions', 'ready', 'status', 'arrived', 'verified', 'completed']) {
      const c = code(path.join(APP, 'order', '[orderId]', `${rel}.tsx`));
      assert.doesNotMatch(c, /deliveryFee|phí giao|shipping|delivery|driver|shipper|courier|tài xế/i, rel);
      assert.doesNotMatch(c, /from '@\/(data|services)/, rel);
      assert.doesNotMatch(c, /#[0-9a-fA-F]{3,8}\b|rgba?\(|fontWeight|fontFamily/, rel);
    }
    const pkg = JSON.parse(read(path.join(ROOT, 'package.json')));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    for (const banned of ['expo-camera', 'expo-barcode-scanner', 'react-native-vision-camera', 'react-native-camera', 'expo-location', 'react-native-maps']) assert.ok(!deps.includes(banned), banned);
    for (const f of srcFiles()) assert.doesNotMatch(code(f), /expo-camera|BarCodeScanner|CameraView/, f);
    assert.deepEqual(getPickupStatusText({ status: 'ready', pickupSlot: mkSlot('18:00 – 18:30') }), { title: 'Túi đã sẵn sàng', hint: 'Tới quán trong khung giờ 18:00 – 18:30 để nhận' });
    assert.equal(getPickupStatusText({ status: 'preparing', pickupSlot: mkSlot('18:00 – 18:30') }).title, 'Quán đang chuẩn bị túi');
  });
  await test('D-21 (sequential multi-order pickup) is documented; the mock service errors are the contract', () => {
    const decisions = read(path.join(ROOT, 'docs', 'DECISIONS.md'));
    assert.match(decisions, /D-21/);
    assert.match(decisions, /D-22/);
    assert.match(read(path.join(SRC, 'services', 'api', 'mock-api.ts')), /Pickup QR already used/);
    assert.match(read(path.join(SRC, 'services', 'api', 'mock-api.ts')), /Order is not ready for pickup/);
  });

  // ---------- U1.7: Orders + Order Detail + Account + Logout ----------
  console.log('\n[U1.7] Orders / Account / Logout');
  const DEMO_EMAIL = 'duong.nguyen@email.com';
  const signInDemo = async () => {
    resetAuthStore();
    const r = await login({ identifier: DEMO_EMAIL, password: DEMO_PASSWORD });
    assert.ok(r.ok);
    if (getAuthState().area === null) assert.ok((await selectArea('area_dong_da')).ok);
    assert.equal(getAuthStage(getAuthState()), 'location_selected');
    return getAuthState().account!.id;
  };
  const registerNew = async () => {
    resetAuthStore();
    const phone = `09${String(Date.now()).slice(-8)}`;
    assert.ok((await startRegistration({ phone, email: `u${Date.now()}@test.vn`, password: 'Abcdef12', acceptedTerms: true })).ok);
    assert.ok((await submitOtp(DEMO_OTP)).ok);
    assert.ok((await createProfile({ name: 'Khách Mới' })).ok);
    assert.ok((await selectArea('area_cau_giay')).ok);
    return getAuthState().account!.id;
  };
  const SEEDED = { ready: 'ord_2409_017', preparing: 'ord_2409_018', picked: 'ord_2409_014', picked2: 'ord_2409_009', cancelled: 'ord_2409_011', expired: 'ord_2408_022' };
  const ALL_STATUSES: OrderState[] = ['placed', 'paid', 'preparing', 'ready', 'qr_verified', 'picked_up', 'cancelled', 'expired'];

  await test('Orders tab exists (tab bar unchanged) and is a real screen with loading, error, empty and per-segment states', () => {
    assert.deepEqual(TAB_ITEMS.map((t) => t.key), ['home', 'orders', 'cart', 'account']);
    const layout = code(path.join(APP, '(main)', '_layout.tsx'));
    assert.match(layout, /<Tabs\.Screen name="orders"/);
    assert.match(layout, /<Tabs\.Screen name="account"/);
    const screen = code(path.join(APP, '(main)', 'orders.tsx'));
    assert.doesNotMatch(screen, /PlaceholderScreen/);
    assert.match(screen, /useOrders\(\)/);
    assert.match(screen, /status === 'loading'/);
    assert.match(screen, /status === 'error'/);
    assert.match(screen, /orders\.length === 0/);
    assert.match(screen, /<EmptyState/);
    assert.match(screen, /Bạn chưa có đơn hàng nào/);
    assert.match(screen, /router\.navigate\('\/home'\)/); // the empty state leads back to discovery
    assert.match(screen, /EMPTY_TAB_MESSAGE/);
    assert.deepEqual(ORDER_TABS.map((t) => t.label), ['Đang xử lý', 'Đã xong', 'Đã huỷ']); // the three reference segments
    assert.match(screen, /<OrderCard/);
    assert.match(screen, /getOrderCardSubtitle\(order\)/);
  });
  await test('Order History shows the seeded orders in the right segment with the right status label', async () => {
    const mine = await api.listOrders({ userId: 'usr_001' });
    const byId = (id: string) => mine.find((o) => o.id === id)!;
    const expected: [string, OrderTab, string][] = [
      [SEEDED.ready, 'active', 'Sẵn sàng nhận hàng'],
      [SEEDED.preparing, 'active', 'Quán đang chuẩn bị'],
      [SEEDED.picked, 'completed', 'Đã nhận hàng'],
      [SEEDED.picked2, 'completed', 'Đã nhận hàng'],
      [SEEDED.cancelled, 'cancelled', 'Đã huỷ'],
      [SEEDED.expired, 'cancelled', 'Hết hạn giữ chỗ'],
    ];
    for (const [id, tab, label] of expected) {
      assert.ok(byId(id), id);
      assert.equal(getOrderTab(byId(id)), tab, id);
      assert.equal(ORDER_STATUS_LABEL[byId(id).status], label, id);
      assert.ok(filterOrders(mine, tab).some((o) => o.id === id), `${id} listed in ${tab}`);
    }
    // every lifecycle state has a segment and a label; terminal = completed / cancelled
    const seg = Object.fromEntries(ALL_STATUSES.map((s) => [s, getOrderTab({ status: s })]));
    assert.deepEqual(seg, { placed: 'active', paid: 'active', preparing: 'active', ready: 'active', qr_verified: 'active', picked_up: 'completed', cancelled: 'cancelled', expired: 'cancelled' });
    assert.equal(ORDER_STATUS_LABEL.paid, 'Đã thanh toán');
    assert.equal(ORDER_STATUS_LABEL.qr_verified, 'QR đã được xác nhận');
    assert.equal(ORDER_STATUS_LABEL.placed, 'Đã đặt hàng');
    for (const s of ALL_STATUSES) assert.equal(isActiveOrder({ status: s }), !['picked_up', 'cancelled', 'expired'].includes(s));
    // cards: what each shows
    assert.match(getOrderCardSubtitle(byId(SEEDED.ready)), /^Hôm nay · nhận 18:30 – 19:00$/);
    assert.match(getOrderCardSubtitle(byId(SEEDED.picked)), /đã nhận/);
    assert.match(getOrderCardSubtitle(byId(SEEDED.cancelled)), /lý do/);
    assert.match(getOrderCardSubtitle(byId(SEEDED.expired)), /chưa thanh toán trong 10 phút/);
    assert.match(getRefundLine(byId(SEEDED.cancelled)) ?? '', /^Đã hoàn 60\.000đ|^Đang hoàn 60\.000đ/);
    assert.equal(getRefundLine(byId(SEEDED.expired)), null);
    assert.equal(getRefundLine(byId(SEEDED.picked)), null);
    // counts are consistent with the filters
    const counts = countOrdersByTab(mine);
    assert.equal(counts.active + counts.completed + counts.cancelled, mine.length);
    for (const tab of ['active', 'completed', 'cancelled'] as const) assert.equal(filterOrders(mine, tab).length, counts[tab]);
    assert.equal(getDefaultTab(mine), 'active');
    assert.equal(getDefaultTab([byId(SEEDED.picked)]), 'completed');
  });
  await test('filtering is pure display logic: it does not mutate the orders and sorts active orders by pickup deadline', async () => {
    const mine = await api.listOrders({ userId: 'usr_001' });
    const snapshot = JSON.stringify(mine);
    const order = mine.map((o) => o.id);
    filterOrders(mine, 'active');
    filterOrders(mine, 'completed');
    filterOrders(mine, 'cancelled');
    countOrdersByTab(mine);
    summarizeCompleted(mine);
    assert.equal(JSON.stringify(mine), snapshot);
    assert.deepEqual(mine.map((o) => o.id), order); // same order, same objects
    const active = filterOrders(mine, 'active');
    for (let i = 1; i < active.length; i++) assert.ok(active[i - 1].pickupSlot.end <= active[i].pickupSlot.end, 'nearest deadline first');
    const done = filterOrders(mine, 'completed');
    for (let i = 1; i < done.length; i++) assert.ok(Date.parse(done[i - 1].createdAt) >= Date.parse(done[i].createdAt), 'newest first');
    const impact = summarizeCompleted(mine);
    const bags = mine.filter((o) => o.status === 'picked_up').flatMap((o) => o.items).reduce((s, i) => s + i.quantity, 0);
    assert.equal(impact.bags, bags);
    assert.deepEqual({ foodKg: impact.foodKg, co2Kg: impact.co2Kg }, calcImpact(bags)); // through utils/impact
  });
  await test('routing (D-5): active order → its flow, finished order → /order/[orderId]; invalid order → not found; opening changes nothing', async () => {
    const id = 'ord_x';
    const route = (status: OrderState) => resolveOrderRoute({ id, status });
    assert.equal(route('placed'), '/order/ord_x/payment');
    for (const s of ['paid', 'preparing', 'ready'] as const) assert.equal(route(s), '/order/ord_x/status', s);
    assert.equal(route('qr_verified'), '/order/ord_x/verified');
    for (const s of ['picked_up', 'cancelled', 'expired'] as const) assert.equal(route(s), '/order/ord_x', s);
    // action on an active card
    assert.deepEqual(getOrderAction({ id, status: 'ready' }), { key: 'open_qr', label: 'Mở mã nhận hàng', route: '/order/ord_x/pickup-qr' });
    assert.equal(getOrderAction({ id, status: 'placed' })?.key, 'pay');
    assert.equal(getOrderAction({ id, status: 'qr_verified' })?.route, '/order/ord_x/verified');
    for (const s of ['picked_up', 'cancelled', 'expired'] as const) assert.equal(getOrderAction({ id, status: s }), null);
    // the screens use the resolver
    assert.match(code(path.join(APP, '(main)', 'orders.tsx')), /router\.push\(resolveOrderRoute\(order\)\)/);
    const detail = code(path.join(APP, 'order', '[orderId]', 'index.tsx'));
    assert.match(detail, /useOrderDetail\(orderId\)/);
    assert.match(detail, /Không tìm thấy đơn hàng/);
    assert.doesNotMatch(detail, /PlaceholderScreen/);
    assert.match(code(path.join(SRC, 'features', 'order-history', 'use-order-detail.ts')), /resolveOrderRoute\(order\)/);
    assert.match(code(path.join(SRC, 'features', 'order-history', 'use-order-detail.ts')), /router\.replace\(target\)/);
    // status route resolves a finished order to its detail/completed screen (U1.6 redirect)
    assert.equal(resolvePickupRoute({ id, status: 'picked_up' }), '/order/ord_x/completed');
    // invalid id / another account's order
    assert.equal(await api.getOrder('ord_missing'), null);
    const other = (await api.getOrder(SEEDED.picked))!;
    assert.equal(isOrderOwnedBy(other, 'usr_001'), true);
    assert.equal(isOrderOwnedBy(other, 'acc_someone_else'), false);
    assert.equal(isOrderOwnedBy(other, null), true); // no session: the route gate handles it
    // viewing is read-only: nothing in the history / detail code can change an order
    const before = JSON.stringify(await api.listOrders());
    await api.listOrders({ userId: 'usr_001' });
    for (const o of await api.listOrders({ userId: 'usr_001' })) await api.getOrder(o.id);
    assert.equal(JSON.stringify(await api.listOrders()), before);
    for (const f of [...walk(path.join(SRC, 'features', 'order-history')), path.join(APP, '(main)', 'orders.tsx'), path.join(APP, 'order', '[orderId]', 'index.tsx')]) {
      assert.doesNotMatch(code(f), /markOrderPaid|simulateRestaurantProgress|verifyPickupQr|completePickup|cancelOrder|expireOrder|api\.checkout|transitionOrder/, f);
    }
  });
  await test('new orders appear in history and follow every lifecycle status; completing one does not complete another (multi-restaurant)', async () => {
    const accountId = await signInDemo();
    const { checkoutId, orders } = await payAll(['bag_01', 'bag_06']);
    const [a, b] = orders;
    assert.equal(a.userId, accountId); // orders belong to the signed-in account
    const history = async () => api.listOrders({ userId: accountId });
    let mine = await history();
    // two separate cards, same checkoutId, unique codes; paid → active
    const pair = mine.filter((o) => o.checkoutId === checkoutId);
    assert.equal(pair.length, 2);
    assert.notEqual(pair[0].orderCode, pair[1].orderCode);
    assert.deepEqual(pair.map((o) => getOrderTab(o)), ['active', 'active']);
    assert.deepEqual(pair.map((o) => ORDER_STATUS_LABEL[o.status]).sort(), ['Đã thanh toán', 'Đã thanh toán']);
    assert.notEqual(pair[0].restaurantId, pair[1].restaurantId);
    // every status of order A shows up correctly in the list
    const labelOf = async (id: string) => ORDER_STATUS_LABEL[(await history()).find((o) => o.id === id)!.status];
    assert.equal(await labelOf(a.id), 'Đã thanh toán');
    await step(a.id);
    assert.equal(await labelOf(a.id), 'Quán đang chuẩn bị');
    await step(a.id);
    assert.equal(await labelOf(a.id), 'Sẵn sàng nhận hàng');
    assert.equal(resolveOrderRoute((await history()).find((o) => o.id === a.id)!), `/order/${a.id}/status`);
    assert.ok((await simulateStaffScan(a.id, a.pickupQr!.token)).ok);
    assert.equal(await labelOf(a.id), 'QR đã được xác nhận');
    assert.equal(getOrderTab((await history()).find((o) => o.id === a.id)!), 'active'); // not finished until the customer confirms
    assert.equal(resolveOrderRoute((await history()).find((o) => o.id === a.id)!), `/order/${a.id}/verified`);
    assert.ok((await confirmReceived(a.id)).ok);
    mine = await history();
    assert.equal(await labelOf(a.id), 'Đã nhận hàng');
    assert.equal(getOrderTab(mine.find((o) => o.id === a.id)!), 'completed');
    assert.equal(resolveOrderRoute(mine.find((o) => o.id === a.id)!), `/order/${a.id}`);
    // B is independent and still live
    const bNow = mine.find((o) => o.id === b.id)!;
    assert.equal(bNow.status, 'paid');
    assert.equal(getOrderTab(bNow), 'active');
    assert.ok(filterOrders(mine, 'active').some((o) => o.id === b.id));
    assert.ok(!filterOrders(mine, 'completed').some((o) => o.id === b.id));
    // finish B too: both appear, independently, in "Đã xong"
    await ready(b.id);
    assert.ok((await simulateStaffScan(b.id, b.pickupQr!.token)).ok);
    assert.ok((await confirmReceived(b.id)).ok);
    mine = await history();
    const doneIds = filterOrders(mine, 'completed').map((o) => o.id);
    assert.ok(doneIds.includes(a.id) && doneIds.includes(b.id));
    assert.equal(new Set(mine.filter((o) => o.checkoutId === checkoutId).map((o) => o.id)).size, 2); // never merged into one entry
    // cancelled and expired orders created by the customer show up too
    quick('expired');
    await startCheckout(['bag_04'], 1);
    const exp = await placeCheckout();
    assert.ok(exp.ok);
    if (exp.ok) {
      await settleAfter('expired', exp.orders[0].id);
      const expiredNow = (await history()).find((o) => o.id === exp.orders[0].id)!;
      assert.equal(getOrderTab(expiredNow), 'cancelled');
      assert.equal(ORDER_STATUS_LABEL[expiredNow.status], 'Hết hạn giữ chỗ');
      assert.equal(resolveOrderRoute(expiredNow), `/order/${expiredNow.id}`);
    }
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 4000 });
    const paidThenCancelled = (await payAll(['bag_06'])).orders[0];
    await api.cancelOrder(paidThenCancelled.id, 'Đổi ý');
    const cancelledNow = (await history()).find((o) => o.id === paidThenCancelled.id)!;
    assert.equal(cancelledNow.status, 'cancelled');
    assert.equal(getOrderTab(cancelledNow), 'cancelled');
    assert.match(getRefundLine(cancelledNow) ?? '', /^Đang hoàn/);
    // the lifecycle is still linear (regression)
    assert.equal(canTransition('ready', 'picked_up'), false);
    assert.equal(canTransition('ready', 'qr_verified'), true);
  });
  await test('orders belong to accounts: a new customer starts with an empty history and never sees the demo user\'s orders', async () => {
    const demoId = await signInDemo();
    assert.ok((await api.listOrders({ userId: demoId })).length >= 6);
    const newId = await registerNew();
    assert.notEqual(newId, demoId);
    assert.equal((await api.listOrders({ userId: newId })).length, 0); // → the empty state
    await startCheckout(['bag_01'], 1);
    const r = await placeCheckout();
    assert.ok(r.ok);
    if (!r.ok) return;
    assert.equal(r.orders[0].userId, newId);
    const mine = await api.listOrders({ userId: newId });
    assert.equal(mine.length, 1);
    assert.equal(mine[0].id, r.orders[0].id);
    assert.ok(!(await api.listOrders({ userId: demoId })).some((o) => o.id === r.orders[0].id));
    assert.equal(isOrderOwnedBy(r.orders[0], demoId), false); // the detail screen would say "not found" to the demo user
    assert.match(code(path.join(SRC, 'features', 'order-history', 'use-order-detail.ts')), /isOrderOwnedBy\(found, account\?\.id\)/);
    assert.match(code(path.join(SRC, 'features', 'order-history', 'use-orders.ts')), /listOrders\(\{ userId: accountId \}\)/);
    assert.match(code(path.join(SRC, 'features', 'checkout', 'checkout-actions.ts')), /userId: getAuthState\(\)\.account\?\.id/);
    resetAuthStore();
  });
  await test('Order Detail data: money comes from the order (no delivery fee), reorder puts the bags in the current cart without touching orders', async () => {
    await signInDemo();
    const done = (await api.getOrder(SEEDED.picked))!;
    assert.equal(done.status, 'picked_up');
    assert.ok(!('deliveryFee' in done.money));
    assert.equal(done.money.total, done.money.subtotal - done.money.promoDiscount - done.money.ownBoxDiscount);
    const detail = code(path.join(APP, 'order', '[orderId]', 'index.tsx'));
    assert.match(detail, /<OrderPriceBreakdown money=\{order\.money\}/);
    assert.match(detail, /calcImpact\(countBags\(order\.items\)\)/);
    assert.doesNotMatch(detail, /unitPrice\s*\*|quantity\s*\*|\.reduce\(|subtotal\s*[-+]/);
    assert.doesNotMatch(detail, /deliveryFee|phí giao|giao hàng|delivery|driver|shipper|courier/i);
    assert.doesNotMatch(detail, /from '@\/(data|services)/);
    assert.match(detail, /order\.status === 'picked_up'/); // "Đặt lại" only for completed orders
    // reorder
    resetCartStore();
    const before = JSON.stringify(await api.listOrders());
    const result = await reorderOrder(done);
    assert.ok(result.added >= 1);
    assert.deepEqual(result.skipped, []);
    assert.deepEqual(getCart().items.map((i) => i.foodBagId), done.items.map((i) => i.foodBagId));
    assert.equal(JSON.stringify(await api.listOrders()), before); // no new order, old order unchanged
    // a sold-out bag is skipped by the normal add-to-cart rules
    resetCartStore();
    const soldOut = await reorderOrder({ items: [{ foodBagId: 'bag_07', name: 'Túi sushi chiều', quantity: 1, unitPrice: 60000, originalPrice: 75000, ownBox: false }] });
    assert.deepEqual(soldOut, { added: 0, skipped: ['Túi sushi chiều'] });
    assert.equal(getCart().items.length, 0);
    resetCartStore();
  });
  await test('Account loads the signed-in user from the session, Edit Profile updates the session user, phone / email stay read-only', async () => {
    const id = await signInDemo();
    const profile = getAuthProfile(getAuthState())!;
    assert.deepEqual(profile, { id, name: 'Nguyễn Hoàng Dương', phone: '0912345678', email: DEMO_EMAIL });
    assert.equal(formatPhone(profile.phone), '0912 345 678');
    assert.equal(getInitial(profile.name), 'N');
    assert.equal(getInitial('  đức'), 'Đ');
    assert.equal(formatMemberSince('2026-08'), '08/2026');
    const mine = await api.listOrders({ userId: id });
    const summary = getAccountSummary(mine);
    assert.equal(summary.orderCount, mine.length);
    assert.equal(summary.activeCount, countOrdersByTab(mine).active);
    assert.deepEqual({ foodKg: summary.foodKg, co2Kg: summary.co2Kg }, calcImpact(summary.bags));
    const account = code(path.join(APP, '(main)', 'account.tsx'));
    assert.doesNotMatch(account, /PlaceholderScreen/);
    assert.match(account, /useAccount\(\)/);
    assert.match(account, /formatPhone\(profile\.phone\)/);
    // edit profile
    const bad = await updateProfile({ name: 'A', areaId: 'area_ba_dinh' });
    assert.ok(!bad.ok && bad.field === 'name');
    const empty = await updateProfile({ name: '   ', areaId: 'area_ba_dinh' });
    assert.ok(!empty.ok && empty.field === 'name');
    const noArea = await updateProfile({ name: 'Tên Hợp Lệ', areaId: 'area_nowhere' });
    assert.ok(!noArea.ok && noArea.field === 'area');
    assert.equal(getAuthState().name, 'Nguyễn Hoàng Dương'); // rejected updates change nothing
    const ok = await updateProfile({ name: '  Dương Nguyễn  ', areaId: 'area_ba_dinh' });
    assert.ok(ok.ok);
    assert.equal(getAuthState().name, 'Dương Nguyễn'); // session user updated (trimmed)
    assert.equal(getAuthState().area?.name, 'Ba Đình'); // Home reads this
    assert.equal(getAuthProfile(getAuthState())?.phone, '0912345678'); // phone untouched
    assert.equal(getAuthProfile(getAuthState())?.email, DEMO_EMAIL);
    assert.equal(getAuthStage(getAuthState()), 'location_selected');
    // the mock account keeps it: sign out, sign in again → same name and area, straight to Home
    signOut();
    const again = await login({ identifier: DEMO_EMAIL, password: DEMO_PASSWORD });
    assert.ok(again.ok && again.route === '/home');
    assert.equal(getAuthState().name, 'Dương Nguyễn');
    assert.equal(getAuthState().area?.name, 'Ba Đình');
    assert.ok((await updateProfile({ name: 'Nguyễn Hoàng Dương', areaId: 'area_dong_da' })).ok); // restore
    // nothing to edit without a session
    resetAuthStore();
    const anon = await updateProfile({ name: 'Ai đó', areaId: 'area_ba_dinh' });
    assert.ok(!anon.ok && anon.field === 'form');
    // the edit screen
    const edit = code(path.join(APP, 'account', 'edit.tsx'));
    assert.match(edit, /updateProfile\(\{ name, areaId \}\)/);
    assert.match(edit, /label="Số điện thoại"[\s\S]*disabled/);
    assert.match(edit, /label="Email" value=\{profile\.email\} disabled/);
    assert.doesNotMatch(edit, /from '@\/(data|services)/);
    // a reducer event cannot rename a signed-out / half-set-up session
    assert.equal(authReducer(initialAuthState, { type: 'profile_updated', name: 'X Y' }).name, null);
  });
  await test('logout clears the auth session, the cart, the checkout / payment state and returns to the auth flow; history survives', async () => {
    const accountId = await signInDemo();
    quick('pending');
    await startCheckout(['bag_01'], 1);
    const placed = await placeCheckout();
    assert.ok(placed.ok);
    if (!placed.ok) return;
    const orderId = placed.orders[0].id;
    assert.ok(getPaymentSession(orderId)); // temporary payment state exists
    await addBagToCart({ foodBagId: 'bag_06', quantity: 1 }); // and a fresh cart
    assert.equal(getCartCount(getCart()), 1);
    const ordersBefore = await orderCount();

    const route = signOut();
    assert.equal(route, '/welcome'); // the auth entry (onboarding already seen)
    assert.equal(getAuthStage(getAuthState()), 'unauthenticated');
    assert.equal(getAuthState().account, null);
    assert.equal(getAuthProfile(getAuthState()), null);
    assert.equal(getAuthState().area, null);
    assert.equal(getAuthState().name, null);
    assert.deepEqual(getCart(), EMPTY_CART); // cart cleared
    assert.equal(getCartCount(getCart()), 0);
    assert.equal(getPaymentSession(orderId), null); // checkout / payment sessions cleared
    assert.equal(await orderCount(), ordersBefore); // the account's orders are NOT deleted
    // protected routes are guarded, the auth flow and splash stay reachable
    for (const segs of [['(main)', 'orders'], ['(main)', 'account'], ['(main)', 'cart'], ['(main)', 'home'], ['order', 'checkout'], ['order', 'x', 'pickup-qr'], ['account', 'edit'], ['restaurant', 'x'], ['ai']]) {
      assert.equal(getProtectedRedirect(getAuthState(), segs), '/welcome', segs.join('/'));
    }
    assert.equal(getProtectedRedirect(getAuthState(), []), null);
    assert.equal(getProtectedRedirect(getAuthState(), ['(auth)', 'login']), null);
    // the gate is mounted at the root
    assert.match(code(path.join(APP, '_layout.tsx')), /useAuthGate\(\)/);
    assert.match(code(path.join(SRC, 'features', 'auth', 'use-auth-gate.ts')), /getProtectedRedirect\(state, segments\)/);

    // add item → logout → login again → cart count = 0
    await signInDemo();
    await addBagToCart({ foodBagId: 'bag_01', quantity: 2 });
    assert.equal(getCartCount(getCart()), 2);
    signOut();
    const back = await login({ identifier: DEMO_EMAIL, password: DEMO_PASSWORD });
    assert.ok(back.ok);
    assert.equal(getCartCount(getCart()), 0);
    // the order history comes back with the account
    assert.ok((await api.listOrders({ userId: accountId })).some((o) => o.id === orderId));
    assert.equal(getAuthState().hasSeenOnboarding, true);
    // the UI: Account → dialog → signOut → replace to the auth entry
    const account = code(path.join(APP, '(main)', 'account.tsx'));
    assert.match(account, /<ConfirmDialog/);
    assert.match(account, /Đăng xuất khỏi EcoBite\?/);
    assert.match(account, /router\.replace\(signOut\(\)\)/);
    setMockPaymentScenario({ outcome: 'success', resolveAfterMs: 4000 });
    resetAuthStore();
  });
  await test('route gate matrix: every auth stage is sent to where it belongs; only a fully set-up session reaches protected routes', () => {
    const at = (events: AuthEvent[]) => events.reduce(authReducer, initialAuthState);
    const acc = { id: 'acc_gate', phone: '0911111111', email: 'g@test.vn' };
    const seg = ['(main)', 'orders'];
    assert.equal(getProtectedRedirect(initialAuthState, seg), '/onboarding');
    assert.equal(getProtectedRedirect(at([{ type: 'onboarding_completed' }]), seg), '/welcome');
    assert.equal(getProtectedRedirect(at([{ type: 'registration_started', phone: acc.phone, email: acc.email }]), seg), '/otp');
    const authed = at([{ type: 'registration_started', phone: acc.phone, email: acc.email }, { type: 'otp_verified', account: acc }]);
    assert.equal(getProtectedRedirect(authed, seg), '/create-profile');
    const named = authReducer(authed, { type: 'profile_created', name: 'Gate Test' });
    assert.equal(getProtectedRedirect(named, seg), '/location-permission');
    const done = authReducer(named, { type: 'area_selected', area: { id: 'area_dong_da', name: 'Đống Đa', city: 'Hà Nội', restaurantCount: 6 } });
    assert.equal(getProtectedRedirect(done, seg), null);
    assert.equal(getProtectedRedirect(done, ['account', 'edit']), null);
    // the first-login flow is unchanged
    assert.equal(resolveAuthRoute(done), HOME_ROUTE);
    assert.equal(resolveAuthRoute(named), '/location-permission');
    assert.equal(resolveAuthRoute(authed), '/create-profile');
  });
  await test('navigation: Home → Orders → status / detail; Home → Account → Edit Profile / Logout; tabs unchanged, no new tab', () => {
    const tabBar = code(path.join(SRC, 'components', 'common', 'BottomTabBar.tsx'));
    assert.match(tabBar, /TAB_ITEMS\.map/);
    assert.match(code(path.join(APP, '(main)', '_layout.tsx')), /props\.navigation\.navigate\(key\)/);
    assert.deepEqual(TAB_ITEMS.map((t) => t.key), ['home', 'orders', 'cart', 'account']);
    const orders = code(path.join(APP, '(main)', 'orders.tsx'));
    assert.match(orders, /router\.push\(resolveOrderRoute\(order\)\)/); // active → status, finished → detail
    assert.match(orders, /router\.push\(action\.route\)/); // "Mở mã nhận hàng"
    const account = code(path.join(APP, '(main)', 'account.tsx'));
    assert.match(account, /router\.push\('\/account\/edit'\)/);
    assert.match(account, /router\.navigate\('\/orders'\)/);
    assert.ok(fs.existsSync(path.join(APP, 'account', 'edit.tsx')));
    assert.ok(fs.existsSync(path.join(APP, 'account', '_layout.tsx')));
    assert.match(code(path.join(APP, 'account', 'edit.tsx')), /router\.back\(\)/); // save → back to Account
    assert.match(read(path.join(APP, '_layout.tsx')), /<Stack\.Screen name="account" \/>/);
    // unsupported reference screens were not added just to grow the route count
    for (const missing of ['wallet', 'impact', 'notification-settings', 'settings', 'help', 'support', 'legal', 'saved']) {
      assert.ok(!fs.existsSync(path.join(APP, 'account', `${missing}.tsx`)), missing);
    }
    assert.ok(!fs.existsSync(path.join(APP, 'order', '[orderId]', 'review.tsx')));
    assert.ok(!fs.existsSync(path.join(APP, 'order', '[orderId]', 'cancel.tsx')));
    // the AI screens are still a later phase
    assert.match(code(path.join(APP, 'ai', 'index.tsx')), /PlaceholderScreen|Ai/);
    // screens are thin and free of delivery wording
    for (const f of [path.join(APP, '(main)', 'orders.tsx'), path.join(APP, '(main)', 'account.tsx'), path.join(APP, 'account', 'edit.tsx'), path.join(APP, 'order', '[orderId]', 'index.tsx')]) {
      assert.doesNotMatch(code(f), /from '@\/(data|services)/, f);
      assert.doesNotMatch(code(f), /#[0-9a-fA-F]{3,8}\b|rgba?\(|fontWeight|fontFamily/, f);
      assert.doesNotMatch(code(f), /deliveryFee|phí giao|delivery|driver|shipper|courier/i, f);
    }
    for (const f of [...walk(path.join(SRC, 'features', 'order-history')), ...walk(path.join(SRC, 'features', 'account'))]) {
      assert.doesNotMatch(code(f), /deliveryFee|phí giao|delivery|shipper|courier/i, f);
    }
  });
  await test('regression: checkout / payment / pickup and QR separation keep working, and no persistence or new SDK was added', async () => {
    await signInDemo();
    const { orders } = await payAll(['bag_01']);
    const o = orders[0];
    assert.equal(o.status, 'paid');
    assert.equal(o.pickupQr?.kind, 'pickup');
    assert.notEqual(o.pickupQr?.token, getPaymentSession(o.id)?.qr.payload);
    await ready(o.id);
    const wrong = await simulateStaffScan(o.id, getPaymentSession(o.id)!.qr.payload);
    assert.ok(!wrong.ok && wrong.reason === 'invalid_qr');
    assert.ok((await simulateStaffScan(o.id, o.pickupQr!.token)).ok);
    assert.ok((await confirmReceived(o.id)).ok);
    assert.equal((await api.getOrder(o.id))?.status, 'picked_up');
    const pkg = JSON.parse(read(path.join(ROOT, 'package.json')));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    for (const banned of ['@react-native-async-storage/async-storage', 'firebase', '@supabase/supabase-js', 'expo-secure-store', 'react-native-mmkv', 'expo-sqlite', 'realm', 'expo-camera', 'expo-location', 'react-native-maps', 'expo-clipboard']) {
      assert.ok(!deps.includes(banned), banned);
    }
    for (const f of srcFiles()) assert.doesNotMatch(code(f), /AsyncStorage|localStorage|expo-sqlite/, f);
    resetAuthStore();
  });

  // ---------- U1.8 Task 1: Login, Search controls, Chỉ đường ----------
  console.log('\n[U1.8-1] Login / Search controls / Directions');
  await test('Login has the reference structure and keeps the mock auth logic', () => {
    const src = code(path.join(APP, '(auth)', 'login.tsx'));
    for (const s of ['Đăng nhập', 'Email hoặc số điện thoại', 'Mật khẩu', 'Ghi nhớ tôi', 'Quên mật khẩu?', 'hoặc', 'Tiếp tục bằng email', 'Tiếp tục bằng Apple/iCloud', 'Chưa có tài khoản?', 'Đăng ký ngay']) {
      assert.ok(src.includes(s), s);
    }
    assert.match(src, /icon="apple"/);
    assert.match(src, /await login\(\{ identifier, password \}\)/);
    assert.doesNotMatch(src, /Google/);
    assert.ok(ICONS.apple.prims.some((p) => 'fill' in p && p.fill));
  });
  await test('Apple/iCloud and forgot-password are UI-only: no session change, no navigation, no new auth event', async () => {
    resetAuthStore();
    const before = JSON.stringify(getAuthState());
    const result = await continueWithApple();
    assert.equal(result.ok, false);
    assert.equal(result.message, APPLE_LOGIN_NOTICE);
    assert.ok(FORGOT_PASSWORD_NOTICE.length > 0);
    assert.equal(JSON.stringify(getAuthState()), before);
    assert.equal(getAuthStage(getAuthState()), 'unauthenticated');
    const social = code(path.join(SRC, 'features', 'auth', 'social-login.ts'));
    assert.doesNotMatch(social, /dispatchAuth|router|oauth/i);
    // the login flow is unchanged
    const r = await login({ identifier: 'duong.nguyen@email.com', password: DEMO_PASSWORD });
    assert.ok(r.ok);
    resetAuthStore();
  });
  await test('Search refinements: sort, filters and "Còn túi" are pure and keep the count consistent', async () => {
    const listings = await catalog();
    const all = searchListings(listings, 'com');
    const snapshot = all.map((r) => r.listing.restaurant.id).join();
    assert.ok(all.length > 1);

    const nearest = sortSearchResults(all, 'nearest').map((r) => r.listing.restaurant.distanceKm);
    assert.deepEqual(nearest, [...nearest].sort((a, b) => a - b));
    const top = sortSearchResults(all, 'top_rated').map((r) => r.listing.restaurant.rating);
    assert.deepEqual(top, [...top].sort((a, b) => b - a));
    const cheap = sortSearchResults(searchListings(listings, ''), 'cheapest');
    assert.equal(cheap.length, 0); // empty query still returns nothing
    const everything = searchListings(listings, 'a');
    const priced = sortSearchResults(everything, 'cheapest').map((r) => r.listing.featuredBag?.price ?? Infinity);
    assert.deepEqual(priced, [...priced].sort((a, b) => a - b), 'sold-out (no price) last');
    assert.deepEqual(sortSearchResults(everything, 'relevance').map((r) => r.listing.restaurant.id), everything.map((r) => r.listing.restaurant.id));
    assert.equal(all.map((r) => r.listing.restaurant.id).join(), snapshot, 'input is not mutated');
    assert.deepEqual(SEARCH_SORT_OPTIONS[0].key, 'relevance');

    const under30 = filterSearchResults(everything, { ...emptySearchFilters, priceRange: 'under_30' });
    assert.ok(under30.length > 0 && under30.every((r) => (r.listing.featuredBag?.price ?? Infinity) < 30000));
    const near = filterSearchResults(everything, { ...emptySearchFilters, maxDistanceKm: 1 });
    assert.ok(near.length > 0 && near.every((r) => r.listing.restaurant.distanceKm <= 1));
    const rated = filterSearchResults(everything, { ...emptySearchFilters, topRatedOnly: true });
    assert.ok(rated.length > 0 && rated.every((r) => r.listing.restaurant.rating >= 4.5));
    assert.equal(countActiveFilters({ priceRange: 'under_30', maxDistanceKm: 1, topRatedOnly: true }), 3);
    assert.equal(countActiveFilters(emptySearchFilters), 0);
    assert.equal(applySearchRefinements(everything, emptySearchFilters, 'relevance').length, everything.length);

    // "Còn túi": sold-out restaurants disappear, the count follows
    const withSoldOut = searchListings(listings, 'a');
    const inStock = searchListings(listings, 'a', { onlyAvailable: true });
    assert.ok(withSoldOut.some((r) => r.listing.soldOut), 'catalog has a sold-out restaurant');
    assert.ok(inStock.length < withSoldOut.length && inStock.every((r) => !r.listing.soldOut));
    assert.equal(inStock.length, withSoldOut.filter((r) => !r.listing.soldOut).length);
  });
  await test('Search Results screen shows the [Bộ lọc] [sort] [Còn túi] chips and both sheets, and keeps the AI CTA', () => {
    const screen = code(path.join(APP, 'search', 'results.tsx'));
    assert.match(screen, /<SearchControls/);
    assert.match(screen, /<SearchFilterSheet/);
    assert.match(screen, /<SearchSortSheet/);
    assert.match(screen, /Nhờ AI gợi ý món tương tự/);
    const controls = code(path.join(SRC, 'components', 'search', 'SearchControls.tsx'));
    for (const s of ['Bộ lọc', 'Còn túi', 'icon="filter"', 'icon="sort"']) assert.ok(controls.includes(s), s);
    const filter = code(path.join(SRC, 'components', 'search', 'SearchFilterSheet.tsx'));
    for (const s of ['Khoảng giá', 'Khoảng cách tới quán', 'Đặt lại']) assert.ok(filter.includes(s), s);
    assert.ok(code(path.join(SRC, 'components', 'search', 'SearchSortSheet.tsx')).includes('Sắp xếp theo'));
    for (const f of walk(path.join(SRC, 'components', 'search'))) assert.doesNotMatch(code(f), /#[0-9a-fA-F]{3,8}\b|rgba?\(|fontWeight|fontFamily|services\/|features\/|data\/mock/, f);
  });
  await test('"Chỉ đường" is a plain maps link on every pickup card: no map SDK, no GPS', () => {
    assert.equal(getDirectionsUrl('  '), null);
    assert.equal(getDirectionsUrl(undefined), null);
    const url = getDirectionsUrl('Số 24 Nguyễn Văn Cừ, Cầu Giấy, Hà Nội')!;
    assert.ok(url.startsWith('https://www.google.com/maps/search/?api=1&query='));
    assert.ok(url.includes(encodeURIComponent('Nguyễn Văn Cừ')));
    for (const f of ['checkout.tsx', '[orderId]/pickup-instructions.tsx', '[orderId]/status.tsx', '[orderId]/ready.tsx', '[orderId]/arrived.tsx']) {
      const src = code(path.join(APP, 'order', ...f.split('/')));
      assert.match(src, /onDirections=\{\(\) => openDirections\(restaurant\?\.address\)\}/, f);
    }
    assert.match(code(path.join(SRC, 'components', 'order', 'PickupInfo.tsx')), /label="Chỉ đường"/);
    assert.doesNotMatch(code(path.join(SRC, 'features', 'pickup', 'directions-logic.ts')), /expo-location|react-native-maps|geolocation/i);
  });

  // ---------- U1.8 Task 2: Pickup Time polish ----------
  console.log('\n[U1.8-2] Pickup Time');
  await test('Pickup windows vary across the data; 20:00 is not the universal end', async () => {
    const bags = await api.listFoodBags();
    const ends = new Set(bags.map((b) => b.pickupWindow.end));
    const starts = new Set(bags.map((b) => b.pickupWindow.start));
    assert.ok(ends.size >= 5 && starts.size >= 4, 'varied windows');
    assert.ok(bags.some((b) => b.pickupWindow.end > '20:00'), 'some windows end after 20:00');
    for (const b of bags) assert.equal(b.pickupWindow.label, `${b.pickupWindow.start} – ${b.pickupWindow.end}`);
  });
  await test('Valid pickup times: inclusive of both window ends, 30-minute grid, nothing outside', async () => {
    const all = await api.listPickupSlots('res_01');
    const win = { start: '17:30', end: '20:00' };
    assert.deepEqual(listSlotsInWindow(all, win).map((o) => o.label), ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00']);
    for (const outside of ['17:00', '20:30']) {
      const o = all.find((x) => x.label === outside);
      if (o) assert.equal(canSelectSlot(o, win), false, outside);
    }
    assert.equal(canSelectSlot(all.find((x) => x.label === '20:00')!, win), true);
    assert.deepEqual(listSlotsInWindow(all, null), []);
    assert.ok(all.every((o) => o.start === o.end && o.label === o.start));
  });
  await test('Selecting a time outside the window is rejected and changes nothing', async () => {
    await startCheckout(['bag_04'], 1, false); // Bún Bò Cay: 17:30 – 19:00
    const slots = await api.listPickupSlots('res_03');
    const pick = (label: string) => selectPickupSlot('res_03', slots.find((o) => o.label === label)!);
    assert.ok(!(await pick('17:00')).ok);
    assert.ok(!(await pick('19:30')).ok);
    assert.equal(getCart().pickupSlots.res_03, undefined);
    assert.ok((await pick('17:30')).ok);
    assert.ok((await pick('19:00')).ok);
    assert.equal(getCart().pickupSlots.res_03.label, '19:00');
  });
  await test('Several bags of one restaurant use the intersection; no intersection stays invalid; restaurants keep their own time', async () => {
    const bags = await api.listFoodBags();
    const by = (id: string) => bags.find((b) => b.id === id)!;
    assert.deepEqual(getPickupWindow([by('bag_01'), by('bag_02')]), { start: '18:00', end: '19:30' }); // 17:30–19:30 ∩ 18:00–20:00
    assert.equal(getPickupWindow([by('bag_02'), by('bag_03')]), null); // 18:00–20:00 vs 20:00–21:30: no window
    const all = await api.listPickupSlots('res_01');
    assert.deepEqual(listSlotsInWindow(all, getPickupWindow([by('bag_01'), by('bag_02')])).map((o) => o.label), ['18:00', '18:30', '19:00', '19:30']);
    assert.deepEqual(listSlotsInWindow(all, getPickupWindow([by('bag_02'), by('bag_03')])), []);
    // in the real cart: an incompatible pair leaves no valid time; removing one bag fixes it
    await startCheckout(['bag_02', 'bag_03'], 1, false);
    assert.ok(!(await selectPickupSlot('res_01', all.find((o) => o.label === '20:00')!)).ok);
    assert.ok(!(await selectPickupSlot('res_01', all.find((o) => o.label === '19:00')!)).ok);
    assert.equal(Object.keys(getCart().pickupSlots).length, 0);
    await removeCartItem('bag_03');
    assert.ok((await selectPickupSlot('res_01', all.find((o) => o.label === '20:00')!)).ok);
    // two restaurants: each one is validated against its own bags
    await startCheckout(['bag_01', 'bag_06'], 1, false);
    assert.ok((await selectPickupSlot('res_01', all.find((o) => o.label === '19:30')!)).ok);
    assert.ok(!(await selectPickupSlot('res_06', (await api.listPickupSlots('res_06')).find((o) => o.label === '18:30')!)).ok);
    assert.ok((await selectPickupSlot('res_06', (await api.listPickupSlots('res_06')).find((o) => o.label === '21:30')!)).ok);
    assert.deepEqual(Object.fromEntries(Object.entries(getCart().pickupSlots).map(([k, s]) => [k, s.label])), { res_01: '19:30', res_06: '21:30' });
  });
  await test('Pickup Time screen: horizontal picker, no capacity text, no refund text; capacity validation stays in logic', () => {
    const screen = code(path.join(APP, 'order', 'pickup-time.tsx'));
    assert.match(screen, /<PickupTimePicker/);
    assert.match(screen, /Khung giờ nhận hôm nay/);
    for (const banned of [/Còn \$\{/, /Còn \d+ chỗ/, /Còn chỗ/, /hết chỗ/, /hoàn tiền/i]) assert.doesNotMatch(screen, banned);
    const picker = code(path.join(SRC, 'components', 'order', 'PickupTimePicker.tsx'));
    assert.match(picker, /horizontal/);
    assert.doesNotMatch(picker, /Còn|chỗ|left/);
    assert.doesNotMatch(picker, /#[0-9a-fA-F]{3,8}\b|rgba?\(|fontWeight|fontFamily/);
    assert.ok(!fs.existsSync(path.join(SRC, 'components', 'order', 'PickupTimeCard.tsx')));
    assert.match(code(path.join(SRC, 'features', 'checkout', 'checkout-logic.ts')), /option\.left > 0 && isSlotWithinWindow/);
  });

  // ---------- U1.8 Task 3: AI Assistant UI ----------
  console.log('\n[U1.8-3] AI Assistant UI');
  await test('Draggable orb: always clamped inside the visible area, clear of the status bar and the tab bar', () => {
    const area = { width: 390, height: 844 };
    const size = 60;
    const top = 47;
    const bottom = 84;
    const at = (x: number, y: number) => clampOrbPosition({ x, y }, area, size, top, bottom);
    assert.deepEqual(at(-500, -500), { x: ORB_MARGIN, y: top + ORB_MARGIN });
    assert.deepEqual(at(9999, 9999), { x: 390 - size - ORB_MARGIN, y: 844 - bottom - size - ORB_MARGIN });
    assert.deepEqual(at(150, 300), { x: 150, y: 300 }); // inside: untouched
    for (const [x, y] of [[0, 0], [390, 844], [-20, 900], [380, -5], [200, 810]]) {
      const p = at(x, y);
      assert.ok(p.x >= ORB_MARGIN && p.x + size <= area.width - ORB_MARGIN, 'x');
      assert.ok(p.y >= top + ORB_MARGIN && p.y + size <= area.height - bottom - ORB_MARGIN, 'y');
    }
    const home = defaultOrbPosition(area, size, bottom);
    assert.deepEqual(at(home.x, home.y), home); // the default corner is already legal
    // a tiny area never produces an inverted range
    const tiny = clampOrbPosition({ x: 50, y: 50 }, { width: 40, height: 60 }, size, top, bottom);
    assert.ok(Number.isFinite(tiny.x) && Number.isFinite(tiny.y));
  });
  await test('Draggable orb: a tap opens the assistant, a drag does not', () => {
    assert.equal(isOrbDrag(0, 0), false);
    assert.equal(isOrbDrag(3, -4), false);
    assert.equal(isOrbDrag(7, 0), true);
    assert.equal(isOrbDrag(0, -12), true);
    const orb = code(path.join(SRC, 'components', 'ai', 'DraggableAiOrb.tsx'));
    assert.match(orb, /PanResponder/);
    assert.match(orb, /onMoveShouldSetPanResponderCapture: \(_, g\) => isOrbDrag/);
    assert.match(orb, /dragged\.current \? undefined : live\.current\.onPress\(\)/);
    assert.match(orb, /pointerEvents="box-none"/);
    // the layer never blocks the screen underneath; a covered tab layout (0 x 0) must not collapse the position
    assert.match(orb, /if \(width <= 0 \|\| height <= 0\) return;/);
    assert.doesNotMatch(orb, /react-native-gesture-handler|react-native-reanimated|react-native-draggable/i);
    assert.doesNotMatch(orb, /@\/(services|features|data)/);
    const pkg = JSON.parse(read(path.join(ROOT, 'package.json')));
    assert.ok(!Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).some((d) => /draggable/i.test(d)));
  });
  await test('The orb is shared by the four main tabs (one mount, one position) and the tab bar is measured', () => {
    const layout = code(path.join(APP, '(main)', '_layout.tsx'));
    assert.equal((layout.match(/<DraggableAiOrb/g) ?? []).length, 1);
    assert.match(layout, /reservedBottom=\{tabBarHeight\}/);
    assert.match(layout, /reservedTop=\{insets\.top\}/);
    assert.deepEqual(TAB_ITEMS.map((x) => x.key), ['home', 'orders', 'cart', 'account']);
  });
  await test('AI chat: conversation is kept for the session, user and assistant messages are distinct, mock replies keep their suggestions', async () => {
    resetChatStore();
    assert.equal(getChatMessages().length, 0);
    const reply = await aiService.sendMessage({ text: 'Món cay, giá rẻ?', history: [] });
    appendChatMessage({ id: 'u1', role: 'user', text: 'Món cay, giá rẻ?', createdAt: new Date().toISOString() });
    appendChatMessage(reply);
    assert.deepEqual(getChatMessages().map((m) => m.role), ['user', 'assistant']);
    assert.ok(getChatMessages()[1].suggestions!.length === 2 && getChatMessages()[1].suggestions![0].reasons!.length === 4, 'no information lost');
    resetChatStore();
    assert.equal(getChatMessages().length, 0);
  });
  await test('AI chat screen: right / left bubbles, input + send, scrollable, suggestions inside the bubble (no nested cards)', () => {
    const screen = code(path.join(APP, 'ai', 'index.tsx'));
    for (const s of ['<ChatBubble', '<ChatComposer', '<ScrollView', '<SuggestionList', '<TypingBubble', 'scrollToEnd']) assert.ok(screen.includes(s), s);
    assert.doesNotMatch(screen, /<Card/);
    const bubble = code(path.join(SRC, 'components', 'ai', 'ChatBubble.tsx'));
    assert.match(bubble, /alignSelf: mine \? 'flex-end' : 'flex-start'/);
    assert.doesNotMatch(bubble, /Shadows|borderWidth|<Card/);
    assert.doesNotMatch(code(path.join(SRC, 'components', 'ai', 'SuggestionList.tsx')), /<Card|borderWidth|Shadows/);
    const composer = code(path.join(SRC, 'components', 'ai', 'ChatComposer.tsx'));
    assert.match(composer, /accessibilityLabel="Gửi"/);
    assert.match(composer, /<TextInput/);
    for (const f of walk(path.join(SRC, 'components', 'ai'))) {
      assert.doesNotMatch(code(f), /#[0-9a-fA-F]{3,8}\b|rgba?\(|fontWeight|fontFamily/, f);
    }
    assert.match(read(path.join(APP, 'ai', 'index.tsx')), /@\/features\/ai/);
  });

  // ---------- U1.8 Task 4: real restaurant & food images ----------
  console.log('\n[U1.8-4] Images');
  const registry = read(path.join(SRC, 'media', 'images.ts'));
  const entries = (prefix: string) => [...registry.matchAll(new RegExp(prefix + "_\\d+: require\\('([^']+)'\\)", 'g'))].map((m) => ({ id: m[0].split(':')[0], file: path.resolve(path.join(SRC, 'media'), m[1]) }));
  await test('Every restaurant and food bag has its own bundled photo (real JPEG on disk, local, no remote URLs)', async () => {
    const restaurants = await api.listRestaurants();
    const bags = await api.listFoodBags();
    const res = entries('res');
    const bag = entries('bag');
    assert.deepEqual(res.map((e) => e.id).sort(), restaurants.map((r) => r.id).sort());
    assert.deepEqual(bag.map((e) => e.id).sort(), bags.map((b) => b.id).sort());
    for (const e of [...res, ...bag]) {
      assert.ok(fs.existsSync(e.file), e.file);
      const buf = fs.readFileSync(e.file);
      assert.ok(buf.length > 20000, 'a real photo, not a placeholder: ' + e.id);
      assert.equal(buf[0], 0xff); // JPEG magic
      assert.equal(buf[1], 0xd8);
    }
    assert.equal(new Set([...res, ...bag].map((e) => e.file)).size, res.length + bag.length, 'no two entities share a file');
    assert.ok(res.every((e) => e.file.includes(path.join('assets', 'images', 'restaurants'))));
    assert.ok(bag.every((e) => e.file.includes(path.join('assets', 'images', 'food-bags'))));
    assert.doesNotMatch(registry, /https?:\/\//);
    assert.match(registry, /const restaurantImages/);
    assert.match(registry, /const foodBagImages/);
  });
  await test('Mapping matches the food: ids follow the mock data, every file is named after its entity', async () => {
    for (const e of [...entries('res'), ...entries('bag')]) assert.equal(path.basename(e.file, '.jpg'), e.id);
    const bags = await api.listFoodBags();
    for (const b of bags) assert.ok(registry.includes(b.id + ": require('../../assets/images/food-bags/" + b.id + ".jpg')"), b.id);
    const credits = read(path.join(ROOT, 'assets', 'images', 'CREDITS.md'));
    for (const e of [...entries('res'), ...entries('bag')]) assert.ok(credits.includes(e.id + '.jpg'), 'credit for ' + e.id);
    assert.match(credits, /Wikimedia Commons/);
  });
  await test('The same entity shows the same photo on every screen (one registry, keyed by id)', () => {
    const uses: [string, RegExp][] = [
      ['(main)/home.tsx', /image=\{getRestaurantImage\(restaurant\.id\)\}/],
      ['search/index.tsx', /image=\{getRestaurantImage\(listing\.restaurant\.id\)\}/],
      ['search/results.tsx', /image=\{getRestaurantImage\(result\.listing\.restaurant\.id\)\}/],
      ['restaurant/[id]/index.tsx', /image=\{getRestaurantImage\(restaurant\.id\)\}/],
      ['restaurant/[id]/index.tsx', /image=\{getFoodBagImage\(bag\.id\)\}/],
      ['food-bag/[id]/index.tsx', /image=\{getFoodBagImage\(bag\.id\)\}/],
      ['food-bag/[id]/index.tsx', /image=\{getRestaurantImage\(r\.id\)\}/],
      ['food-bag/[id]/add-to-cart.tsx', /image=\{getFoodBagImage\(bag\?\.id\)\}/],
      ['(main)/cart.tsx', /image=\{getFoodBagImage\(entry\.item\.foodBagId\)\}/],
      ['order/checkout.tsx', /image=\{getFoodBagImage\(item\.foodBagId\)\}/],
      ['order/summary.tsx', /image=\{getFoodBagImage\(item\.foodBagId\)\}/],
      ['order/[orderId]/index.tsx', /image=\{getFoodBagImage\(item\.foodBagId\)\}/],
    ];
    for (const [rel, re] of uses) assert.match(code(path.join(APP, rel)), re, rel);
    // images come from the registry only: no screen builds its own require / uri
    for (const f of walk(APP).filter((x) => /\.tsx$/.test(x))) assert.doesNotMatch(code(f), /require\(['"][^'"]*\.(jpg|png)['"]\)|source=\{\{ uri/, f);
    assert.doesNotMatch(code(path.join(APP, '(main)', 'cart.tsx')), /getRestaurantImage/);
  });
  await test('Components stay presentational: photo comes in as a prop, the illustration is the fallback, no data / service imports', () => {
    const img = code(path.join(SRC, 'components', 'common', 'FoodImage.tsx'));
    assert.match(img, /image\?: ImageSourcePropType/);
    assert.match(img, /<Image source=\{image\} resizeMode="cover"/);
    assert.match(img, /<LinearGradient/); // fallback illustration kept
    for (const c of ['common/CoverImage', 'food-bag/FoodBagImage', 'food-bag/FoodBagCard', 'food-bag/AddToCartSheet', 'cart/CartItem', 'order/OrderItemRow', 'restaurant/RestaurantCard', 'restaurant/RestaurantListCard']) {
      const src = code(path.join(SRC, 'components', ...c.split('/')) + '.tsx');
      assert.match(src, /ImageSourcePropType/, c);
      assert.doesNotMatch(src, /@\/media|@\/(services|features|data)/, c);
    }
    // business logic untouched: images are not part of the models or the pricing / lifecycle code
    for (const f of [path.join(SRC, 'features', 'cart', 'cart-view.ts'), path.join(SRC, 'utils', 'order-pricing.ts'), path.join(SRC, 'services', 'api', 'mock-api.ts')]) assert.doesNotMatch(code(f), /media\/images|ImageSourcePropType/, f);
    assert.doesNotMatch(img, /expo-image/); // React Native's own Image, no new dependency
  });

  // ---------- U1.8 Task 5: Home redesign ----------
  console.log('\n[U1.8-5] Home redesign');
  await test('Home categories: exactly the six reference categories, each with its own vector icon key', async () => {
    const cats = await api.listCategories();
    const home = getHomeCategories(cats);
    assert.deepEqual(home.map((h) => h.category.name), ['Tất cả', 'Cơm', 'Mì', 'Healthy', 'Tráng miệng', 'Đồ uống']);
    assert.deepEqual(home.map((h) => h.icon), ['all', 'rice', 'noodle', 'healthy', 'dessert', 'drink']);
    assert.equal(new Set(home.map((h) => h.icon)).size, 6, 'no icon is shared');
    assert.ok(!home.some((h) => ['cat_cake', 'cat_vegan'].includes(h.category.id)));
    assert.deepEqual(getHomeCategories([]), []);
  });
  await test('Popular bags: only buyable bags, best-rated restaurant first then biggest discount, capped, input untouched', async () => {
    const listings = await catalog();
    const before = JSON.stringify(listings);
    const popular = getPopularBags(listings);
    assert.equal(JSON.stringify(listings), before, 'pure');
    assert.ok(popular.length > 0 && popular.length <= 6);
    assert.ok(popular.every((p) => p.bag.left > 0), 'never a sold-out bag');
    assert.ok(!popular.some((p) => p.bag.id === 'bag_07'), 'sold-out sushi bag excluded');
    for (let i = 1; i < popular.length; i++) {
      const a = popular[i - 1];
      const b = popular[i];
      assert.ok(a.restaurant.rating > b.restaurant.rating || (a.restaurant.rating === b.restaurant.rating && a.discountPercent >= b.discountPercent));
    }
    assert.equal(getPopularBags(listings, 2).length, 2);
    assert.deepEqual(getPopularBags([]), []);
    for (const p of popular) assert.equal(p.discountPercent, calcDiscountPercent(p.bag.originalPrice, p.bag.price));
    // restaurants of the bags are the real owners
    for (const p of popular) assert.equal(p.bag.restaurantId, p.restaurant.id);
  });
  await test('Favourites (heart buttons): session toggle, per kind and id, cleared by logout; no persistence', async () => {
    resetFavoritesStore();
    assert.equal(getFavorites().size, 0);
    assert.equal(toggleFavorite('restaurant', 'res_01'), true);
    assert.equal(toggleFavorite('food-bag', 'res_01'), true); // same id, other kind
    assert.deepEqual([...getFavorites()].sort(), [favoriteKey('food-bag', 'res_01'), favoriteKey('restaurant', 'res_01')].sort());
    assert.equal(toggleFavorite('restaurant', 'res_01'), false);
    assert.equal(getFavorites().size, 1);
    signOut();
    assert.equal(getFavorites().size, 0, 'logout clears favourites');
    resetAuthStore();
    assert.doesNotMatch(code(path.join(SRC, 'features', 'discovery', 'favorites-store.ts')), /AsyncStorage|localStorage/);
  });
  await test('Home screen structure follows the reference order and keeps every existing interaction', () => {
    const home = code(path.join(APP, '(main)', 'home.tsx'));
    const order = ['<HomeHeader', '<HeroBanner', '<SearchBar', 'homeCategories.map', 'Nhà hàng gần bạn', 'Phổ biến hôm nay', '<ImpactBanner'].map((s) => home.indexOf(s));
    assert.ok(order.every((i) => i >= 0), 'all sections present: ' + order.join(','));
    assert.deepEqual([...order].sort((a, b) => a - b), order, 'sections in reference order');
    assert.match(home, /placeholder="Tìm kiếm món ăn, nhà hàng\.\.\."/);
    assert.match(home, /rightIcon="filter"/);
    assert.match(home, /router\.push\('\/search'\)/);
    assert.match(home, /pathname: '\/restaurant\/\[id\]'/);
    assert.match(home, /pathname: '\/food-bag\/\[id\]'/);
    assert.match(home, /setCategoryId\(category\.id\)/);
    assert.match(home, /restaurants\.length === 0/);
    assert.match(home, /image=\{getRestaurantImage\(restaurant\.id\)\}/);
    assert.match(home, /image=\{getFoodBagImage\(bag\.id\)\}/);
    assert.match(home, /<HeroBanner image=\{getHomeHeroImage\(\)\}/);
    assert.doesNotMatch(home, /<AiOrb|<DraggableAiOrb|PlaceholderScreen/);
    // horizontal card rows, real components (no flattened image of the design)
    assert.ok((home.match(/horizontal/g) ?? []).length >= 3, 'categories + restaurants + bags scroll horizontally');
    // bottom tabs and the single draggable orb are untouched
    assert.deepEqual(TAB_ITEMS.map((x) => x.key), ['home', 'orders', 'cart', 'account']);
    assert.equal((code(path.join(APP, '(main)', '_layout.tsx')).match(/<DraggableAiOrb/g) ?? []).length, 1);
  });
  await test('Category icons are vector drawings (no photos): six distinct illustrations in the reference style', () => {
    const icon = code(path.join(SRC, 'components', 'restaurant', 'CategoryIcon.tsx'));
    for (const key of ['all', 'rice', 'noodle', 'healthy', 'dessert', 'drink']) assert.ok(icon.includes("name === '" + key + "'"), key);
    assert.match(icon, /react-native-svg/);
    assert.doesNotMatch(icon, /<Image|FoodImage|require\(|emoji/);
    const button = code(path.join(SRC, 'components', 'restaurant', 'CategoryButton.tsx'));
    assert.match(button, /<CategoryIcon/);
    assert.doesNotMatch(button, /FoodImage|<Image|art\??:/);
    // every category circle has its own tint and a selected tint
    const home = read(path.join(SRC, 'constants', 'home.ts'));
    for (const key of ['all', 'rice', 'noodle', 'healthy', 'dessert', 'drink', 'selected']) assert.match(home, new RegExp('  ' + key + ": '#"));
  });
  await test('Home hero photo is a bundled JPEG behind the central registry; Home components hold no colour / font literals', () => {
    const registry = read(path.join(SRC, 'media', 'images.ts'));
    assert.match(registry, /getHomeHeroImage/);
    assert.match(registry, /assets\/images\/home\/hero-bowl\.jpg/);
    const hero = path.join(ROOT, 'assets', 'images', 'home', 'hero-bowl.jpg');
    const buf = fs.readFileSync(hero);
    assert.ok(buf.length > 30000 && buf[0] === 0xff && buf[1] === 0xd8);
    assert.match(read(path.join(ROOT, 'assets', 'images', 'CREDITS.md')), /home\/hero-bowl\.jpg/);
    for (const rel of ['home/HomeHeader.tsx', 'home/HomeSectionHeader.tsx', 'home/FavoriteButton.tsx', 'home/ImpactBanner.tsx', 'restaurant/NearbyRestaurantCard.tsx', 'restaurant/CategoryIcon.tsx', 'restaurant/CategoryButton.tsx', 'restaurant/HeroBanner.tsx', 'food-bag/PopularBagCard.tsx']) {
      const src = code(path.join(SRC, 'components', ...rel.split('/')));
      assert.doesNotMatch(src, /#[0-9a-fA-F]{3,8}\b|rgba?\(|fontWeight|fontFamily/, rel);
      assert.doesNotMatch(src, /@\/(services|features|data)|https?:\/\//, rel);
    }
    for (const f of walk(APP).filter((x) => /\.tsx$/.test(x))) assert.doesNotMatch(code(f), /https?:\/\/[^'"]*\.(jpg|png)/, f);
  });

  await test('Hero banner has no decorative leaves; Bếp Nhà Lá and Salad Nhà Gấu keep distinct photos of their own', async () => {
    const hero = code(path.join(SRC, 'components', 'restaurant', 'HeroBanner.tsx'));
    assert.doesNotMatch(hero, /leaf|Leaf|react-native-svg|<Svg|<Path/);
    assert.match(hero, /Ăn ngon hơn\\nSống xanh hơn/);
    assert.match(hero, /Món ngon, giá tốt\\nvì một hành tinh xanh/);
    assert.doesNotMatch(read(path.join(SRC, 'constants', 'home.ts')).split('export const HomeChrome')[0], /leaf/i);
    // the two restaurants and all their bags each have their own file (no image shared inside or across them)
    const bags = await api.listFoodBags();
    const ids = ['res_01', 'res_05', ...bags.filter((b) => ['res_01', 'res_05'].includes(b.restaurantId)).map((b) => b.id)];
    assert.deepEqual(ids.sort(), ['bag_01', 'bag_02', 'bag_03', 'bag_05', 'res_01', 'res_05']);
    const files = ids.map((id) => path.join(ROOT, 'assets', 'images', id.startsWith('res') ? 'restaurants' : 'food-bags', id + '.jpg'));
    const hashes = files.map((file) => require('node:crypto').createHash('sha1').update(fs.readFileSync(file)).digest('hex'));
    assert.equal(new Set(hashes).size, files.length, 'six different photos');
    for (const file of files) assert.ok(fs.statSync(file).size > 60000, 'a real photo: ' + file);
    const credits = read(path.join(ROOT, 'assets', 'images', 'CREDITS.md'));
    for (const id of ids) assert.ok(credits.includes(id + '.jpg'), id);
  });

  await test('Home swaps Bếp Nhà Lá and Cơm Niêu Quê in the restaurant row only; data, search and other lists keep their order', async () => {
    const listings = await catalog();
    const areas = await api.listAreas();
    const ids = (area: (typeof areas)[number] | null, cat?: string) => getHomeView(listings, area, cat).restaurants.map((l) => l.restaurant.id);
    for (const area of [null, ...areas]) {
      const before = ids(area);
      const after = swapHomeRestaurants(getHomeView(listings, area).restaurants).map((l) => l.restaurant.id);
      const a = before.indexOf('res_01');
      const b = before.indexOf('res_04');
      assert.equal(after[a], 'res_04', 'Cơm Niêu Quê takes the old Bếp Nhà Lá slot');
      assert.equal(after[b], 'res_01', 'Bếp Nhà Lá takes the old Cơm Niêu Quê slot');
      assert.deepEqual(after.filter((id) => !['res_01', 'res_04'].includes(id)), before.filter((id) => !['res_01', 'res_04'].includes(id)));
      assert.equal(new Set(after).size, 6);
    }
    // default area (Cầu Giấy): Bếp Nhà Lá was first, now Cơm Niêu Quê is
    const cauGiay = areas.find((x) => x.name === 'Cầu Giấy')!;
    assert.deepEqual(ids(cauGiay), ['res_01', 'res_05', 'res_02', 'res_03', 'res_04', 'res_06']);
    assert.deepEqual(swapHomeRestaurants(getHomeView(listings, cauGiay).restaurants).map((l) => l.restaurant.id), ['res_04', 'res_05', 'res_02', 'res_03', 'res_01', 'res_06']);
    // one of the two missing (Mì category has only Bún Bò Cay): nothing moves; input never mutated
    const noodle = getHomeView(listings, null, 'cat_noodle').restaurants;
    assert.deepEqual(swapHomeRestaurants(noodle).map((l) => l.restaurant.id), noodle.map((l) => l.restaurant.id));
    const snapshot = JSON.stringify(getHomeView(listings, null).restaurants);
    swapHomeRestaurants(getHomeView(listings, null).restaurants);
    assert.equal(JSON.stringify(getHomeView(listings, null).restaurants), snapshot);
    // catalog order used by search / results is unchanged
    assert.deepEqual(listings.map((l) => l.restaurant.id), ['res_01', 'res_02', 'res_03', 'res_04', 'res_05', 'res_06']);
    assert.deepEqual(searchListings(listings, 'com').map((r) => r.listing.restaurant.id).filter((id) => ['res_01', 'res_04'].includes(id)), ['res_04', 'res_01']); // relevance ranking (name match first), unchanged by the Home swap
    assert.match(code(path.join(SRC, 'features', 'discovery', 'use-home.ts')), /swapHomeRestaurants\(view\.restaurants\)/);
    assert.doesNotMatch(code(path.join(SRC, 'features', 'discovery', 'use-search.ts')), /swapHomeRestaurants/);
  });
  await test('Home header: logo, EcoBite, tagline and the bell; the bell is not a dead button', () => {
    const header = code(path.join(SRC, 'components', 'home', 'HomeHeader.tsx'));
    for (const s of ['EcoBite', 'Good Food · Better Planet', 'name="bell"', '<BrandMark']) assert.ok(header.includes(s), s);
    assert.doesNotMatch(header, /Pressable|onPress/);
    assert.ok('bell' in ICONS && 'heart' in ICONS && 'heartFilled' in ICONS);
    const card = code(path.join(SRC, 'components', 'restaurant', 'NearbyRestaurantCard.tsx'));
    for (const s of ['Còn túi', 'Hết túi', '<FavoriteButton', 'calcDiscountPercent', 'formatMoney', 'pickupWindowLabel']) assert.ok(card.includes(s), s);
  });
  await test('D-23 / D-24 (account-scoped orders and route gate; logout scope) are documented', () => {
    const decisions = read(path.join(ROOT, 'docs', 'DECISIONS.md'));
    assert.match(decisions, /D-23/);
    assert.match(decisions, /D-24/);
    assert.match(decisions, /D-1 … D-17/);
  });

  console.log(`\nRESULT: ${passed} passed, ${failures.length} failed`);
  if (failures.length) {
    console.log('Failed:\n - ' + failures.join('\n - '));
    process.exit(1);
  }
}

main();
