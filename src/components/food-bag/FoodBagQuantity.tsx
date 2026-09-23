import { View } from 'react-native';

import { AppText, QuantityStepper } from '@/components/common';

interface FoodBagQuantityProps {
  value: number;
  /** Bags the restaurant still has (shown as "Quán còn N túi"). */
  left: number;
  /** Stepper upper bound: `left` minus what the cart already holds. Defaults to `left`. */
  max?: number;
  onChange: (next: number) => void;
}

/** "Số lượng · Quán còn N túi" row with the large stepper (Add to Cart sheet 5.6). */
export function FoodBagQuantity({ value, left, max = left, onChange }: FoodBagQuantityProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ gap: 2 }}>
        <AppText variant="rowTitle">Số lượng</AppText>
        <AppText variant="caption" style={{ fontSize: 11 }}>
          Quán còn {left} túi
        </AppText>
      </View>
      <QuantityStepper size="lg" value={value} min={1} max={max} onChange={onChange} />
    </View>
  );
}
