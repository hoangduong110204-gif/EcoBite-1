import { Pressable, View } from 'react-native';

import { BorderWidth, Colors } from '@/constants';

import { Icon } from './icons';

interface CheckboxProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** 18 px (login / register) or 22 px (add-to-cart sheet). */
  size?: 18 | 22;
  /** Highlights an unchecked box in red (e.g. terms required). */
  error?: boolean;
  accessibilityLabel?: string;
}

/** Rounded-square checkbox from the reference (radius 6 at 18 px, 7 at 22 px). */
export function Checkbox({ checked, onChange, size = 18, error = false, accessibilityLabel }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={() => onChange(!checked)}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size === 18 ? 6 : 7,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? Colors.primary : Colors.white,
          borderWidth: checked ? 0 : BorderWidth.ringStrong,
          borderColor: error ? Colors.danger : Colors.border,
        }}>
        {checked ? <Icon name="check" size={size === 18 ? 12 : 14} color={Colors.white} strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}
