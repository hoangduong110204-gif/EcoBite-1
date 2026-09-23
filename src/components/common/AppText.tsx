import { Text, type TextProps } from 'react-native';

import { Colors, Typography, type ColorToken, type TypographyVariant } from '@/constants';

interface AppTextProps extends TextProps {
  /**
   * Reference typography role. Common ones: `title` (23/800), `heading` (17/800),
   * `body` (13/600), `caption` (11.5/600), `muted` (13/600 muted), `button`
   * (15/800), `price` (13.5/800 green), `priceStrike` (10/600 struck), `status` (10/800).
   */
  variant?: TypographyVariant;
  /** Overrides the variant's default colour. */
  color?: ColorToken;
}

/** Default colour per variant (reference: `.doan`, `.nho`, prices). */
const VARIANT_COLOR: Partial<Record<TypographyVariant, ColorToken>> = {
  muted: 'textMuted',
  caption: 'textFaint',
  price: 'primaryDark',
  priceStrike: 'textFaint',
  status: 'textMuted',
};

export function AppText({ variant = 'body', color, style, ...rest }: AppTextProps) {
  const resolved = color ?? VARIANT_COLOR[variant] ?? 'text';
  return <Text style={[Typography[variant], { color: Colors[resolved] }, style]} {...rest} />;
}
