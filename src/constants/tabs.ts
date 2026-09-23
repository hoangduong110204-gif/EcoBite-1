/**
 * Bottom tab bar (D-14): EXACTLY Home · Orders · Cart · Account.
 * Search is NOT a tab. Keys equal the route names in `app/(main)`.
 */
export const TAB_ITEMS = [
  { key: 'home', label: 'Trang chủ', icon: 'home' },
  { key: 'orders', label: 'Đơn hàng', icon: 'orders' },
  { key: 'cart', label: 'Giỏ hàng', icon: 'cart' },
  { key: 'account', label: 'Tài khoản', icon: 'account' },
] as const;

export type TabKey = (typeof TAB_ITEMS)[number]['key'];
