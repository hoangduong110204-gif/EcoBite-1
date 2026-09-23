/**
 * Spacing measured from the reference. The reference is not a strict 4-pt
 * grid: gaps of 11, 10, 9, 13 and 14 are very common, so they have tokens.
 */
export const Spacing = {
  xxs: 2,
  xs: 4,
  s6: 6,
  sm: 8,
  s9: 9,
  s10: 10,
  s11: 11,
  md: 12,
  s13: 13,
  s14: 14,
  lg: 16,
  s18: 18,
  s20: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Corner radii from the reference. Circles use `size / 2`. */
export const Radius = {
  xs: 6,
  sm: 12, // icon tiles, back chip
  image: 13,
  md: 14, // inputs
  button: 15,
  card: 16, // restaurant / list cards
  lg: 18, // `.the-c` cards
  hero: 22,
  xl: 26, // QR card, sheets
  pill: 999, // chips, badges
} as const;

/** The reference draws borders as "rings" (box-shadow spread). */
export const BorderWidth = {
  hairline: 1,
  ring: 1.4,
  ringStrong: 1.8,
} as const;
