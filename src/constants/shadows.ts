import type { ViewStyle } from 'react-native';

import { Colors } from './colors';

/**
 * Approximations of the reference box-shadows. React Native has no negative
 * spread or ring shadows, so rings are expressed with `BorderWidth`.
 * Shadow ink is rgb(24, 36, 32) as in the reference.
 */
const INK = '#182420';

export const Shadows = {
  none: {},
  /** `.the-c`: 0 2px 10px -4px rgba(24,36,32,.14) */
  card: {
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 2,
  },
  /** Primary button glow: 0 8px 18px -8px rgba(47,160,92,.85) */
  buttonGlow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  /** `.day` bottom action bar: 0 -8px 22px -14px rgba(24,36,32,.3) */
  bottomBar: {
    shadowColor: INK,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 8,
  },
  /** Pickup QR card: 0 14px 34px -16px rgba(24,36,32,.4) */
  qrCard: {
    shadowColor: INK,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
} as const satisfies Record<string, ViewStyle>;
