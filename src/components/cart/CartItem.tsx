import { View, type ImageSourcePropType } from 'react-native';

import { AppText, Card, QuantityStepper } from '@/components/common';
import { FoodBagImage, FoodBagPrice } from '@/components/food-bag';
import { FontFamily, Spacing } from '@/constants';
import type { CartItem as CartItemModel, FoodArt } from '@/types';

interface CartItemProps {
  item: CartItemModel;
  art: FoodArt;
  image?: ImageSourcePropType;
  /** Second line, e.g. the bag summary "Cơm + 2 món mặn + canh". */
  summary?: string;
  /** Bags the restaurant has left (stepper upper bound). */
  maxQuantity?: number;
  /** Called with the requested quantity; the caller decides (e.g. 0 opens the remove dialog). */
  onChangeQuantity: (next: number) => void;
}

/** Cart line (reference 6.1): image, name, summary, price and the small stepper. */
export function CartItem({ item, art, image, summary, maxQuantity, onChangeQuantity }: CartItemProps) {
  return (
    <Card style={{ flexDirection: 'row', gap: Spacing.md, padding: Spacing.md }}>
      <FoodBagImage art={art} image={image} size={70} radius={14} />
      <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
        <AppText variant="rowTitle" numberOfLines={1}>
          {item.name}
        </AppText>
        {summary ? (
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {summary}
          </AppText>
        ) : null}
        {item.ownBox ? (
          <AppText variant="caption" color="primaryDark" style={{ fontFamily: FontFamily.bold }}>
            mang hộp riêng
          </AppText>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 }}>
          <FoodBagPrice price={item.unitPrice} originalPrice={item.originalPrice} />
          <QuantityStepper value={item.quantity} min={0} max={maxQuantity} onChange={onChangeQuantity} />
        </View>
      </View>
    </Card>
  );
}
