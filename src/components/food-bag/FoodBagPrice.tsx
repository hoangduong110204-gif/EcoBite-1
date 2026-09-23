import { View } from 'react-native';

import { AppText } from '@/components/common';
import { FontSize, Spacing } from '@/constants';
import type { Money } from '@/types';
import { calcDiscountPercent, formatMoney } from '@/utils/format';

interface FoodBagPriceProps {
  price: Money;
  originalPrice?: Money;
  /** `md` list rows (13.5/10) · `lg` detail hero price. */
  size?: 'md' | 'lg';
  /** Also show "Tiết kiệm x%" text (Food Bag Detail 5.1). */
  showSaving?: boolean;
}

/** Selling price in green with the original struck through (reference `.gia`). */
export function FoodBagPrice({ price, originalPrice, size = 'md', showSaving = false }: FoodBagPriceProps) {
  const percent = originalPrice !== undefined ? calcDiscountPercent(originalPrice, price) : 0;
  const lg = size === 'lg';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: lg ? Spacing.sm : Spacing.s6, flexWrap: 'wrap' }}>
      <AppText variant={lg ? 'title' : 'price'} color="primaryDark" style={lg ? { fontSize: 25, lineHeight: 30 } : undefined}>
        {formatMoney(price)}
      </AppText>
      {originalPrice !== undefined && percent > 0 ? (
        <AppText variant="priceStrike" style={{ fontSize: lg ? FontSize.body : 10.5 }}>
          {formatMoney(originalPrice)}
        </AppText>
      ) : null}
      {showSaving && percent > 0 ? (
        <AppText variant="label" color="primaryDark">
          Tiết kiệm {percent}%
        </AppText>
      ) : null}
    </View>
  );
}
