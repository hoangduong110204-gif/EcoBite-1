import { Pressable, Text, type PressableProps } from 'react-native';

import { ChipStyles, Colors } from '@/constants';

import { Icon, type IconName } from './icons';

interface ChipProps extends Omit<PressableProps, 'children'> {
  label: string;
  /** Selected = solid green (`.chip.on`). */
  selected?: boolean;
  /** Soft mint chip (`.chip.nhat`) for non-interactive labels. */
  soft?: boolean;
  /** Shorter chip (26 px). */
  compact?: boolean;
  icon?: IconName;
}

/** Filter / category chip (30 px, pill). */
export function Chip({ label, selected = false, soft = false, compact = false, icon, style, ...rest }: ChipProps) {
  const labelStyle = selected ? ChipStyles.labelSelected : soft ? ChipStyles.labelSoft : null;
  const iconColor = selected ? Colors.white : soft ? Colors.primaryDark : Colors.textMuted;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={(state) => [
        ChipStyles.base,
        compact && ChipStyles.compact,
        soft && !selected && ChipStyles.soft,
        selected && ChipStyles.selected,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      {icon ? <Icon name={icon} size={13} color={iconColor} /> : null}
      <Text style={[ChipStyles.label, labelStyle]}>{label}</Text>
    </Pressable>
  );
}
