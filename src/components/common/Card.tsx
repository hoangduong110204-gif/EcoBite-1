import { View, type ViewProps } from 'react-native';

import { CardStyles } from '@/constants';

interface CardProps extends ViewProps {
  /** `base` white card (radius 18) · `mint` info card · `outline` border only · `warning` amber note. */
  variant?: keyof typeof CardStyles;
}

export function Card({ variant = 'base', style, ...rest }: CardProps) {
  return <View style={[CardStyles[variant], style]} {...rest} />;
}
