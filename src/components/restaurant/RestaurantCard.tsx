import { Pressable, Text, View, type ImageSourcePropType } from 'react-native';

import { AppText, FoodImage } from '@/components/common';
import { BorderWidth, Colors, Radius, Shadows, Spacing, Typography } from '@/constants';
import type { FoodArt, Money } from '@/types';
import { calcDiscountPercent, formatMoney } from '@/utils/format';

import { RestaurantMeta } from './RestaurantMeta';

interface RestaurantCardProps {
  name: string;
  art: FoodArt;
  image?: ImageSourcePropType;
  rating: number;
  distanceKm: number;
  /** Lowest current bag price and its original price (drives the -x% badge). */
  price?: Money;
  originalPrice?: Money;
  /** No bag left today: dimmed, shows "Hết túi hôm nay" instead of a price. */
  soldOut?: boolean;
  onPress?: () => void;
}

/** Grid card (`.nh`, Home 2-column list): 104 px image, discount badge, name, meta, prices. */
export function RestaurantCard({ name, art, image, rating, distanceKm, price, originalPrice, soldOut = false, onPress }: RestaurantCardProps) {
  const percent = !soldOut && price !== undefined && originalPrice !== undefined ? calcDiscountPercent(originalPrice, price) : 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      onPress={onPress}
      style={({ pressed }) => [
        {
          borderRadius: Radius.card,
          backgroundColor: Colors.white,
          overflow: 'hidden',
          borderWidth: BorderWidth.hairline,
          borderColor: Colors.divider,
        },
        Shadows.card,
        soldOut && { opacity: 0.6 },
        pressed && { opacity: 0.9 },
      ]}>
      <FoodImage art={art} image={image} height={104} radius={0}>
        {percent > 0 ? (
          <View
            style={{
              position: 'absolute',
              top: 7,
              right: 7,
              backgroundColor: Colors.primary,
              borderRadius: Radius.pill,
              paddingVertical: 3,
              paddingHorizontal: 8,
            }}>
            <Text style={[Typography.badge, { color: Colors.white }]}>-{percent}%</Text>
          </View>
        ) : null}
      </FoodImage>
      <View style={{ paddingTop: 9, paddingHorizontal: Spacing.s10, paddingBottom: Spacing.s11, gap: 3 }}>
        <AppText variant="label" numberOfLines={1} style={{ fontSize: 12.5 }}>
          {name}
        </AppText>
        <RestaurantMeta rating={rating} distanceKm={distanceKm} compact />
        {soldOut ? (
          <AppText variant="caption" color="textMuted" style={{ marginTop: 2 }}>
            Hết túi hôm nay
          </AppText>
        ) : price !== undefined ? (
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: Spacing.s6, marginTop: 2 }}>
            <AppText variant="price">{formatMoney(price)}</AppText>
            {originalPrice !== undefined && percent > 0 ? (
              <AppText variant="priceStrike" style={{ fontSize: 10.5 }}>
                {formatMoney(originalPrice)}
              </AppText>
            ) : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

