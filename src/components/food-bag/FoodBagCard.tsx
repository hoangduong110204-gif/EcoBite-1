import { Pressable, View, type ImageSourcePropType } from 'react-native';

import { AppText, Badge } from '@/components/common';
import { BorderWidth, Colors, Radius, Shadows, Spacing } from '@/constants';
import type { FoodBag } from '@/types';

import { FoodBagImage } from './FoodBagImage';
import { FoodBagPrice } from './FoodBagPrice';

interface FoodBagCardProps {
  bag: Pick<FoodBag, 'name' | 'summary' | 'art' | 'price' | 'originalPrice' | 'left' | 'pickupWindow'>;
  /** Bag photo; without one the illustration of `bag.art` is shown. */
  image?: ImageSourcePropType;
  /** Show the pickup window under the summary. */
  showPickupWindow?: boolean;
  onPress?: () => void;
}

/**
 * Horizontal list card (`.ngang`): image, name, summary, price and "Còn N"
 * badge. A bag with `left = 0` is dimmed and not pressable (reference 4.2).
 */
export function FoodBagCard({ bag, image, showPickupWindow = false, onPress }: FoodBagCardProps) {
  const soldOut = bag.left <= 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: soldOut }}
      disabled={soldOut || !onPress}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          gap: Spacing.md,
          padding: Spacing.s10,
          borderRadius: Radius.card,
          backgroundColor: Colors.white,
          borderWidth: BorderWidth.hairline,
          borderColor: Colors.divider,
          opacity: soldOut ? 0.48 : 1,
        },
        Shadows.card,
        pressed && { opacity: 0.9 },
      ]}>
      <FoodBagImage art={bag.art} image={image} size={74} />
      <View style={{ flex: 1, minWidth: 0, gap: 3, justifyContent: 'center' }}>
        <AppText variant="rowTitle" numberOfLines={1}>
          {bag.name}
        </AppText>
        <AppText variant="caption" color="textMuted" numberOfLines={1}>
          {bag.summary}
          {showPickupWindow ? ` · nhận ${bag.pickupWindow.label}` : ''}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <FoodBagPrice price={bag.price} originalPrice={bag.originalPrice} />
          {soldOut ? (
            <Badge label="Hết túi" tone="gray" />
          ) : (
            <Badge label={`Còn ${bag.left}`} tone={bag.left <= 1 ? 'amber' : 'green'} />
          )}
        </View>
      </View>
    </Pressable>
  );
}
