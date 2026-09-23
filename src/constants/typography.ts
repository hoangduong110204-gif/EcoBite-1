import type { TextStyle } from 'react-native';

/**
 * Nunito only (D-12; NOT Be Vietnam Pro). The reference uses weights 600, 700
 * and 800 exclusively, so there is no 400 family.
 * Names are registered by useFonts in app/_layout.tsx.
 */
export const FontFamily = {
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
} as const;

/** Sizes measured from the reference (px). */
export const FontSize = {
  badge: 10,
  tab: 10,
  micro: 10.5,
  xs: 11,
  caption: 11.5,
  label: 11.5,
  small: 12.5,
  body: 13,
  row: 13.5,
  cardTitle: 14,
  button: 15,
  nav: 16,
  section: 17,
  hero: 20,
  title: 23,
  amount: 27,
  display: 32,
} as const;

/** Reference letter-spacing is in em; converted to px for the given size. */
const em = (size: number, value: number) => Math.round(size * value * 100) / 100;

export const Typography = {
  display: { fontFamily: FontFamily.extraBold, fontSize: FontSize.display, lineHeight: 38 },
  amount: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.amount,
    lineHeight: 32,
    letterSpacing: em(FontSize.amount, -0.03),
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.title,
    lineHeight: 27,
    letterSpacing: em(FontSize.title, -0.025),
  },
  hero: { fontFamily: FontFamily.extraBold, fontSize: FontSize.hero, lineHeight: 24 },
  section: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.section,
    lineHeight: 22,
    letterSpacing: em(FontSize.section, -0.015),
  },
  navTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.nav,
    lineHeight: 21,
    letterSpacing: em(FontSize.nav, -0.015),
  },
  cardTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.cardTitle,
    lineHeight: 19,
    letterSpacing: em(FontSize.cardTitle, -0.01),
  },
  rowTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize.row, lineHeight: 18 },
  body: { fontFamily: FontFamily.semiBold, fontSize: FontSize.body, lineHeight: 20 },
  bodyStrong: { fontFamily: FontFamily.bold, fontSize: FontSize.body, lineHeight: 20 },
  caption: { fontFamily: FontFamily.semiBold, fontSize: FontSize.caption, lineHeight: 17 },
  label: { fontFamily: FontFamily.extraBold, fontSize: FontSize.label, lineHeight: 16 },
  badge: { fontFamily: FontFamily.extraBold, fontSize: FontSize.badge, lineHeight: 12 },
  tabLabel: { fontFamily: FontFamily.bold, fontSize: FontSize.tab, lineHeight: 12 },
  button: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.button,
    letterSpacing: em(FontSize.button, -0.01),
  },
  input: { fontFamily: FontFamily.semiBold, fontSize: FontSize.row },
  /** Alias of `section` (17/800). */
  heading: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.section,
    lineHeight: 22,
    letterSpacing: em(FontSize.section, -0.015),
  },
  /** `.doan`: 13/600, lh 1.55 (colour: textMuted). */
  muted: { fontFamily: FontFamily.semiBold, fontSize: FontSize.body, lineHeight: 20 },
  /** Selling price 13.5/800 (colour: primaryDark). */
  price: { fontFamily: FontFamily.extraBold, fontSize: FontSize.row, lineHeight: 18 },
  /** Original price, struck through, 10/600 (colour: textFaint). */
  priceStrike: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.badge,
    lineHeight: 14,
    textDecorationLine: 'line-through',
  },
  /** Status text (badge size 10/800). */
  status: { fontFamily: FontFamily.extraBold, fontSize: FontSize.badge, lineHeight: 12 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof Typography;
