/**
 * Colour tokens. Source of truth: the 82-screen HTML reference
 * (reference/ecobite-82-screen-reference/css/styles.css `:root`), decision D-12.
 * Reference variable names are noted next to each value.
 *
 * Light theme only (D-11): there is intentionally no dark palette.
 */
export const Colors = {
  // brand
  primary: '#2FA05C', // --la
  primaryDark: '#1F7D46', // --la-dam (prices, emphasis, active tab label)
  primaryText: '#22713F', // --la-chu (green text on mint)
  primaryLight: '#7FCB8C', // --la-sang
  mint: '#E6F4E4', // --bac-ha (icon circles, info cards)
  mintBorder: '#D3EBCF', // --bac-ha-2

  // surfaces
  paper: '#FDFDFB', // --giay (app background)
  white: '#FFFFFF', // --the (card surface)

  // text
  text: '#1A2621', // --muc
  textMuted: '#6B7A70', // --muc-mo
  textFaint: '#9BA89F', // --muc-rat-mo (tertiary, placeholders)
  textOnPrimary: '#FFFFFF',

  // lines
  border: '#E6E4DA', // --ke
  divider: '#EAE8DE', // --ke-2

  // status
  success: '#2FA05C',
  warning: '#F2A828', // --hophach (ratings, warnings)
  danger: '#E24B3B', // --do (errors, destructive)
  info: '#4B7FE0', // --lam

  // disabled button
  disabledFill: '#EDEAE0',
  disabledText: '#9BA89F',

  // badge tints (.nhan-n)
  amberSoft: '#FDF0DA',
  amberText: '#96702A',
  dangerSoft: '#FCE7E4',
  dangerText: '#B23A2C',
  neutralSoft: '#EFECE3',

  // warning card (amber note)
  warningSurface: '#FFF8EC',
  warningBorder: '#F2DDB4',
  warningNote: '#7A5A1E',

  // web-only preview shell (`WebMobileFrame`)
  webBackdrop: '#F2F1EE', // desktop backdrop around the phone-sized viewport
  webPhoneBorder: '#E5E7E5', // phone viewport edge

  // sheets, dialogs and small surfaces (reference inline styles)
  overlay: 'rgba(18, 26, 22, 0.5)', // scrim behind sheets/dialogs
  handle: '#DDD9CC', // bottom-sheet grabber, empty stars
  trackNeutral: '#E7E3D6', // pending timeline dot/line
  tileBlue: '#EFF3FB', // e-wallet icon tile
  tileNeutral: '#F0EDE4', // card icon tile
  pagerDot: '#D6DFD3', // inactive onboarding dot
} as const;

export type ColorToken = keyof typeof Colors;
