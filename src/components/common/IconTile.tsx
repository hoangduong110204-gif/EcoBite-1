import { View } from 'react-native';

import { Colors, IconTileStyles } from '@/constants';

import { Icon, type IconName } from './icons';

type Tone = 'mint' | 'white' | 'blue' | 'neutral' | 'danger' | 'amber';

const TONE_BG: Record<Tone, string> = {
  mint: Colors.mint,
  white: Colors.white,
  blue: Colors.tileBlue,
  neutral: Colors.tileNeutral,
  danger: Colors.dangerSoft,
  amber: Colors.amberSoft,
};

interface IconTileProps {
  name: IconName;
  /** `xs` 26 · `sm` 34 · `md` 36 · `lg` 38 · `xl` 40 (reference icon tiles). */
  size?: keyof typeof IconTileStyles.sizes;
  tone?: Tone;
  color?: string;
  iconSize?: number;
}

/** Rounded square with a centred icon (list rows, section headers, promo row). */
export function IconTile({ name, size = 'lg', tone = 'mint', color = Colors.primaryDark, iconSize }: IconTileProps) {
  const { size: box, radius } = IconTileStyles.sizes[size];
  return (
    <View
      style={{
        width: box,
        height: box,
        borderRadius: radius,
        backgroundColor: TONE_BG[tone],
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon name={name} size={iconSize ?? Math.round(box * 0.5)} color={color} />
    </View>
  );
}
