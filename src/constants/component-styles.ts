import type { TextStyle, ViewStyle } from 'react-native';

import { Colors } from './colors';
import { Sizes } from './layout';
import { BorderWidth, Radius, Spacing } from './spacing';
import { Shadows } from './shadows';
import { Typography } from './typography';

/**
 * Shared style presets built from tokens. Values come from the 82-screen
 * reference (`css/styles.css` + inline styles), verified against it in U1.1.
 */

export const ButtonStyles = {
  /** `.nut`: 50 px, radius 15, 15/800. */
  base: {
    height: Sizes.buttonHeight,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  } satisfies ViewStyle,
  sizes: {
    md: {},
    /** `.nut.nho` 38 px, radius 12, 12.5 label */
    sm: { height: Sizes.buttonHeightSmall, borderRadius: Radius.sm, paddingHorizontal: Spacing.lg },
    /** `.nut.rat-nho` 31 px, radius 10, 11.5 label */
    xs: { height: Sizes.buttonHeightTiny, borderRadius: 10, paddingHorizontal: Spacing.s13 },
  } satisfies Record<string, ViewStyle>,
  labelSizes: {
    md: {},
    sm: { fontSize: 12.5 },
    xs: { fontSize: 11.5 },
  } satisfies Record<string, TextStyle>,
  variants: {
    /** `.nut` */
    primary: { backgroundColor: Colors.primary, ...Shadows.buttonGlow },
    /** `.nut.phu` — white with mint ring */
    secondary: {
      backgroundColor: Colors.white,
      borderWidth: BorderWidth.ringStrong,
      borderColor: Colors.mintBorder,
    },
    /** `.nut.xam` — mint fill */
    soft: { backgroundColor: Colors.mint },
    /** `.nut.vien` — destructive outline */
    destructive: {
      backgroundColor: 'transparent',
      borderWidth: BorderWidth.ring,
      borderColor: 'rgba(226, 75, 59, 0.34)',
    },
    /** Solid red confirm (dialog "Xoá túi") with red glow */
    danger: {
      backgroundColor: Colors.danger,
      shadowColor: Colors.danger,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 5,
    },
    /** `.nut.tro` used as a tappable neutral button (dialog "Giữ lại") */
    neutral: { backgroundColor: Colors.disabledFill },
  } satisfies Record<string, ViewStyle>,
  labels: {
    primary: { color: Colors.textOnPrimary },
    secondary: { color: Colors.primaryDark },
    soft: { color: Colors.primaryDark },
    destructive: { color: Colors.danger },
    danger: { color: Colors.textOnPrimary },
    neutral: { color: Colors.disabledText },
  } satisfies Record<string, TextStyle>,
  label: Typography.button satisfies TextStyle,
  /** `.nut.tro` disabled */
  disabled: {
    backgroundColor: Colors.disabledFill,
    borderColor: Colors.disabledFill,
    shadowOpacity: 0,
    elevation: 0,
  } satisfies ViewStyle,
  disabledLabel: { color: Colors.disabledText } satisfies TextStyle,
} as const;

/** `.nhap`: label above, 48 px field, radius 14, ring border. */
export const InputStyles = {
  wrapper: { gap: Spacing.s6 } satisfies ViewStyle,
  label: { color: Colors.textMuted, paddingLeft: Spacing.xxs, ...Typography.label } satisfies TextStyle,
  /** `.o` — the bordered row that holds icon + text + adornment */
  field: {
    height: Sizes.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s10,
    paddingHorizontal: 15,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.ring,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  } satisfies ViewStyle,
  /** the TextInput inside the field */
  text: { flex: 1, height: '100%', color: Colors.text, ...Typography.input } satisfies TextStyle,
  focused: { borderColor: Colors.primary, borderWidth: BorderWidth.ringStrong } satisfies ViewStyle,
  error: { borderColor: Colors.danger, borderWidth: 1.6 } satisfies ViewStyle,
  disabled: { backgroundColor: Colors.disabledFill, opacity: 0.7 } satisfies ViewStyle,
  /** `.bao` helper / error line */
  helperError: { color: Colors.danger, paddingLeft: Spacing.xxs, fontFamily: Typography.bodyStrong.fontFamily, fontSize: 11 } satisfies TextStyle,
  helper: { color: Colors.textFaint, paddingLeft: Spacing.xxs, ...Typography.caption } satisfies TextStyle,
} as const;

export const CardStyles = {
  /** `.the-c` */
  base: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 15,
    borderWidth: BorderWidth.hairline,
    borderColor: Colors.divider,
    ...Shadows.card,
  } satisfies ViewStyle,
  /** `.the-p` */
  mint: {
    backgroundColor: Colors.mint,
    borderRadius: Radius.lg,
    padding: 15,
  } satisfies ViewStyle,
  /** `.vien-n` */
  outline: {
    borderRadius: Radius.lg,
    padding: 15,
    borderWidth: BorderWidth.ring,
    borderColor: Colors.border,
  } satisfies ViewStyle,
  /** Amber note card (`#FFF8EC`, ring `#F2DDB4`) */
  warning: {
    backgroundColor: Colors.warningSurface,
    borderRadius: Radius.lg,
    padding: 15,
    borderWidth: 1.3,
    borderColor: Colors.warningBorder,
  } satisfies ViewStyle,
} as const;

/** `.tab` bottom tab bar (Home · Orders · Cart · Account). */
export const TabBarStyles = {
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderTopColor: Colors.divider,
    borderTopWidth: 1,
    paddingTop: 9,
    paddingHorizontal: Spacing.sm,
  } satisfies ViewStyle,
  item: { width: 70, alignItems: 'center', gap: 3 } satisfies ViewStyle,
  iconSize: 22,
  activeTint: Colors.primaryDark,
  inactiveTint: Colors.textFaint,
  label: Typography.tabLabel satisfies TextStyle,
  /** `.gio` cart count badge (top:-4, right:13) */
  badge: {
    position: 'absolute',
    top: -4,
    right: 13,
    minWidth: Sizes.tabBadge,
    height: Sizes.tabBadge,
    paddingHorizontal: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
  badgeText: { color: Colors.white, fontFamily: Typography.badge.fontFamily, fontSize: 9.5 } satisfies TextStyle,
} as const;

/** `.nav` top bar with 36x36 back chip. */
export const HeaderStyles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.s6,
    paddingBottom: Spacing.md,
  } satisfies ViewStyle,
  backChip: {
    width: Sizes.backChip,
    height: Sizes.backChip,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    borderWidth: BorderWidth.hairline,
    borderColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  } satisfies ViewStyle,
  title: { flex: 1, color: Colors.text, ...Typography.navTitle } satisfies TextStyle,
  /** `.nav h4.c`: centred title leaves room for the chip */
  titleCentered: { textAlign: 'center', marginRight: Sizes.backChip } satisfies TextStyle,
  right: { width: Sizes.backChip, height: Sizes.backChip, alignItems: 'center', justifyContent: 'center' } satisfies ViewStyle,
} as const;

/** `.day` pinned bottom action area. */
export const BottomBarStyles = {
  container: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 13,
    paddingHorizontal: Spacing.s18,
    gap: Spacing.s11,
    ...Shadows.bottomBar,
  } satisfies ViewStyle,
  /** Onboarding / permission screens: same padding, no surface (`.day` with transparent background and no border). */
  transparent: { backgroundColor: 'transparent', borderTopWidth: 0, shadowOpacity: 0, elevation: 0 } satisfies ViewStyle,
  /** Reference bottom padding is 26 (includes the home-indicator area). */
  minBottomPadding: 16,
} as const;

/** `.nhan-n` status badges. */
export const BadgeStyles = {
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    paddingVertical: 3,
    paddingHorizontal: Spacing.s9,
    borderRadius: Radius.pill,
  } satisfies ViewStyle,
  variants: {
    green: { bg: Colors.mint, fg: Colors.primaryDark },
    amber: { bg: Colors.amberSoft, fg: Colors.amberText },
    red: { bg: Colors.dangerSoft, fg: Colors.dangerText },
    gray: { bg: Colors.neutralSoft, fg: Colors.textMuted },
    solid: { bg: Colors.primary, fg: Colors.white },
  },
} as const;

/** `.chip` */
export const ChipStyles = {
  base: {
    height: Sizes.chipHeight,
    paddingHorizontal: Spacing.s13,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.white,
    borderWidth: 1.3,
    borderColor: Colors.border,
  } satisfies ViewStyle,
  compact: { height: 26, paddingHorizontal: Spacing.s10 } satisfies ViewStyle,
  selected: { backgroundColor: Colors.primary, borderColor: Colors.primary } satisfies ViewStyle,
  soft: { backgroundColor: Colors.mint, borderColor: Colors.mint } satisfies ViewStyle,
  label: { color: Colors.textMuted, ...Typography.label } satisfies TextStyle,
  labelSelected: { color: Colors.white } satisfies TextStyle,
  labelSoft: { color: Colors.primaryDark } satisfies TextStyle,
} as const;

/** Bottom sheet (5.6, 3.6, 3.7, 9.6): radius 26 top, handle 38x4, padding 10/20/26. */
export const SheetStyles = {
  container: {
    backgroundColor: Colors.paper,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: 10,
    paddingHorizontal: Spacing.s20,
    paddingBottom: 26,
    gap: Spacing.s18,
  } satisfies ViewStyle,
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.handle,
    alignSelf: 'center',
  } satisfies ViewStyle,
} as const;

/** Centred dialog (6.3, 10.9): radius 24, padding 24/22/20, icon circle 62. */
export const DialogStyles = {
  scrim: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'center', paddingHorizontal: 30 } satisfies ViewStyle,
  card: {
    backgroundColor: Colors.paper,
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 22,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 13,
  } satisfies ViewStyle,
  iconCircle: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center' } satisfies ViewStyle,
  actions: { width: '100%', gap: 9, marginTop: Spacing.s6 } satisfies ViewStyle,
} as const;

/** Quantity stepper: 26 px tiles (cart rows, radius 9) and 38 px tiles (sheet, radius 13). */
export const StepperStyles = {
  sizes: {
    sm: { tile: 26, radius: 9, icon: 14, gap: 11, value: { fontSize: 13 } },
    lg: { tile: 38, radius: 13, icon: 18, gap: 16, value: { fontSize: 19 } },
  },
  minus: { backgroundColor: Colors.mint } satisfies ViewStyle,
  minusLarge: { backgroundColor: Colors.white, borderWidth: BorderWidth.ring, borderColor: Colors.border } satisfies ViewStyle,
  plus: { backgroundColor: Colors.primary } satisfies ViewStyle,
  disabled: { opacity: 0.4 } satisfies ViewStyle,
} as const;

/** Radio dot (20 px) used by slot and payment-method rows. */
export const RadioStyles = {
  size: 20,
  off: { backgroundColor: Colors.white, borderWidth: BorderWidth.ringStrong, borderColor: Colors.border } satisfies ViewStyle,
  on: { backgroundColor: Colors.primary } satisfies ViewStyle,
} as const;

/** Order status timeline (`.buoc`): 22 px dots, 2 px connector. */
export const TimelineStyles = {
  column: 26,
  dot: 22,
  line: 2,
  done: Colors.primary,
  pending: Colors.trackNeutral,
  currentRing: 2.6,
} as const;

/** Small icon tile used in rows (`.dong .bt` 38, section headers 26, promo row 36). */
export const IconTileStyles = {
  sizes: {
    xs: { size: 26, radius: 9 },
    sm: { size: 34, radius: 11 },
    md: { size: 36, radius: 12 },
    lg: { size: 38, radius: 12 },
    xl: { size: 40, radius: 13 },
  },
} as const;
