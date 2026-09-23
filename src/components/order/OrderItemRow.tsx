import { View, type ImageSourcePropType } from 'react-native';

import { AppText } from '@/components/common';
import { FoodBagImage } from '@/components/food-bag';
import { Spacing } from '@/constants';
import type { FoodArt, Money } from '@/types';
import { formatMoney } from '@/utils/format';

interface OrderItemRowProps {
  art: FoodArt;
  image?: ImageSourcePropType;
  name: string;
  quantity: number;
  /** Second line: "×2 · mang hộp riêng" on Checkout, the bag summary on Order Summary. */
  detail?: string;
  /** Line total (unit price × quantity), already computed by the pricing layer. */
  lineTotal: Money;
}

/** Bag line inside "Túi đã đặt" / "Túi trong đơn" (reference 6.4 / 6.7): 46 px thumb, name, detail, line total. */
export function OrderItemRow({ art, image, name, quantity, detail, lineTotal }: OrderItemRowProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.s11 }}>
      <FoodBagImage art={art} image={image} size={46} radius={12} />
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <AppText variant="rowTitle" numberOfLines={1}>
          {name} ×{quantity}
        </AppText>
        {detail ? (
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {detail}
          </AppText>
        ) : null}
      </View>
      <AppText variant="rowTitle">{formatMoney(lineTotal)}</AppText>
    </View>
  );
}
