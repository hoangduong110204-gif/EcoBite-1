import { Pressable, View } from 'react-native';

import { Colors, StepperStyles } from '@/constants';

import { AppText } from './AppText';
import { Icon } from './icons';

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  /** Lower bound (default 1). Use 0 where reaching 0 should trigger a remove confirmation. */
  min?: number;
  /** Upper bound, e.g. bags the restaurant has left. */
  max?: number;
  /** `sm` 26 px tiles (cart rows) · `lg` 38 px tiles (add-to-cart sheet). */
  size?: keyof typeof StepperStyles.sizes;
  disabled?: boolean;
}

/** −/+ stepper (reference 5.6 and 6.1). Presentational: the caller owns the state and rules. */
export function QuantityStepper({ value, onChange, min = 1, max, size = 'sm', disabled = false }: QuantityStepperProps) {
  const spec = StepperStyles.sizes[size];
  const atMin = value <= min;
  const atMax = max !== undefined && value >= max;
  const tile = { width: spec.tile, height: spec.tile, borderRadius: spec.radius, alignItems: 'center', justifyContent: 'center' } as const;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spec.gap }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Giảm số lượng"
        disabled={disabled || atMin}
        onPress={() => onChange(value - 1)}
        style={[tile, size === 'lg' ? StepperStyles.minusLarge : StepperStyles.minus, (disabled || atMin) && StepperStyles.disabled]}>
        <Icon name="minus" size={spec.icon} color={Colors.primaryDark} />
      </Pressable>
      <AppText variant="rowTitle" style={[spec.value, { minWidth: size === 'lg' ? 20 : undefined, textAlign: 'center' }]}>
        {value}
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tăng số lượng"
        disabled={disabled || atMax}
        onPress={() => onChange(value + 1)}
        style={[tile, StepperStyles.plus, (disabled || atMax) && StepperStyles.disabled]}>
        <Icon name="plus" size={spec.icon} color={Colors.white} />
      </Pressable>
    </View>
  );
}
