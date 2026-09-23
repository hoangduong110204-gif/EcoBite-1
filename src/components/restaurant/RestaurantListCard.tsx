import { Pressable, View, type ImageSourcePropType } from 'react-native';

import { AppText, Badge } from '@/components/common';
import { FoodBagImage, FoodBagPrice } from '@/components/food-bag';
import { BorderWidth, Colors, Radius, Shadows, Spacing } from '@/constants';
import type { FoodArt, Money } from '@/types';

interface RestaurantListCardProps {
  name: string;
  art: FoodArt;
  image?: ImageSourcePropType;
  /** Second line, e.g. "Còn 3 túi · 0.8 km · nhận 17:30 – 19:00". */
  subtitle: string;
  price?: Money;
  originalPrice?: Money;
  soldOut?: boolean;
  onPress?: () => void;
}

/**
 * Horizontal restaurant row (`.ngang`, search results 3.5): picture, name,
 * summary line and the featured bag price. Sold-out restaurants are dimmed and
 * labelled but still open the restaurant.
 */
export function RestaurantListCard({ name, art, image, subtitle, price, originalPrice, soldOut = false, onPress }: RestaurantListCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
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
          opacity: soldOut ? 0.6 : 1,
        },
        Shadows.card,
        pressed && { opacity: 0.9 },
      ]}>
      <FoodBagImage art={art} image={image} size={74} />
      <View style={{ flex: 1, minWidth: 0, gap: 3, justifyContent: 'center' }}>
        <AppText variant="rowTitle" numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="caption" color="textMuted" numberOfLines={2}>
          {subtitle}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          {price !== undefined && !soldOut ? <FoodBagPrice price={price} originalPrice={originalPrice ?? price} /> : <View />}
          {soldOut ? <Badge label="Hết túi hôm nay" tone="gray" /> : null}
        </View>
      </View>
    </Pressable>
  );
}
