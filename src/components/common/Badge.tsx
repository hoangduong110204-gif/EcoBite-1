import { Text, View } from 'react-native';

import { BadgeStyles, Typography, type StatusTone } from '@/constants';

import { Icon, type IconName } from './icons';

interface BadgeProps {
  label: string;
  /** `green` · `amber` · `red` · `gray` · `solid` (reference `.nhan-n` xanh / cam / do / xam / dac). */
  tone?: StatusTone;
  icon?: IconName;
}

/** `.nhan-n`: small pill for quantities left, pickup windows, discounts, categories. */
export function Badge({ label, tone = 'green', icon }: BadgeProps) {
  const { bg, fg } = BadgeStyles.variants[tone];
  return (
    <View style={[BadgeStyles.base, { backgroundColor: bg }]}>
      {icon ? <Icon name={icon} size={11} color={fg} /> : null}
      <Text style={[Typography.badge, { color: fg }]}>{label}</Text>
    </View>
  );
}
