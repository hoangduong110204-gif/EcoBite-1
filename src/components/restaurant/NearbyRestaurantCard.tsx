import { Pressable, Text, View, type ImageSourcePropType } from 'react-native';

import { AppText, FoodImage, Icon } from '@/components/common';
import { FavoriteButton } from '@/components/home';
import { BorderWidth, Colors, HomeChrome, HomeLayout, Radius, Shadows, Typography } from '@/constants';
import type { FoodArt, Money } from '@/types';
import { calcDiscountPercent, formatDistance, formatMoney } from '@/utils/format';

interface NearbyRestaurantCardProps {
  name: string;
  art: FoodArt;
  image?: ImageSourcePropType;
  rating: number;
  ratingCount: number;
  distanceKm: number;
  /** Pickup window of the earliest available bag, e.g. "17:30 – 19:30". */
  pickupWindowLabel?: string | null;
  walkMinutes: number;
  /** Featured (first available) bag price and its original price. */
  price?: Money;
  originalPrice?: Money;
  /** No bag left today: dimmed, "Hết túi" badge instead of "Còn túi", no price. */
  soldOut?: boolean;
  favorite: boolean;
  onToggleFavorite: () => void;
  onPress?: () => void;
}

/**
 * "Nhà hàng gần bạn" card (reference 1): photo with "Còn túi" badge and heart, name,
 * rating (count) · distance, pickup window, walking time, then the discounted price, the
 * struck-through original price and the -x% pill. Opening hours are not in the data, so
 * the pickup window is shown instead.
 */
export function NearbyRestaurantCard({
  name,
  art,
  image,
  rating,
  ratingCount,
  distanceKm,
  pickupWindowLabel,
  walkMinutes,
  price,
  originalPrice,
  soldOut = false,
  favorite,
  onToggleFavorite,
  onPress,
}: NearbyRestaurantCardProps) {
  const percent = !soldOut && price !== undefined && originalPrice !== undefined ? calcDiscountPercent(originalPrice, price) : 0;
  return (
    <View
      style={[
        { width: HomeLayout.restaurantCardWidth, borderRadius: Radius.card, backgroundColor: Colors.white, overflow: 'hidden', borderWidth: BorderWidth.hairline, borderColor: Colors.divider },
        Shadows.card,
      ]}>
      <Pressable accessibilityRole="button" accessibilityLabel={name} onPress={onPress} style={({ pressed }) => ({ opacity: soldOut ? 0.72 : pressed ? 0.92 : 1 })}>
        <FoodImage art={art} image={image} height={HomeLayout.restaurantImageHeight} radius={0}>
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              paddingVertical: 3.5,
              paddingHorizontal: 9,
              borderRadius: Radius.pill,
              backgroundColor: soldOut ? HomeChrome.soldOutBadgeBg : HomeChrome.stockBadgeBg,
            }}>
            <Text style={[Typography.badge, { color: Colors.white, fontSize: 10.5 }]}>{soldOut ? 'Hết túi' : 'Còn túi'}</Text>
          </View>
        </FoodImage>
        <View style={{ paddingTop: 9, paddingHorizontal: 10, paddingBottom: 11, gap: 4 }}>
          <AppText variant="rowTitle" numberOfLines={1} style={{ fontSize: 13.5 }}>
            {name}
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="star" size={11} color={Colors.warning} />
            <AppText variant="label" style={{ fontSize: 11 }}>
              {rating.toFixed(1)}
            </AppText>
            <AppText variant="caption" color="textMuted" style={{ fontSize: 10.5 }} numberOfLines={1}>
              ({ratingCount}) · {formatDistance(distanceKm)}
            </AppText>
          </View>
          {pickupWindowLabel ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Icon name="clock" size={11} color={Colors.textMuted} />
              <AppText variant="caption" color="textMuted" style={{ fontSize: 10.5 }} numberOfLines={1}>
                Nhận {pickupWindowLabel}
              </AppText>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Icon name="pin" size={11} color={Colors.textMuted} />
            <AppText variant="caption" color="textMuted" style={{ fontSize: 10.5 }} numberOfLines={1}>
              Đi bộ {walkMinutes} phút
            </AppText>
          </View>
          {soldOut || price === undefined ? (
            <AppText variant="caption" color="textMuted" style={{ marginTop: 3 }}>
              Hết túi hôm nay
            </AppText>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }}>
              <AppText variant="price" style={{ fontSize: 14.5, lineHeight: 18 }}>
                {formatMoney(price)}
              </AppText>
              {originalPrice !== undefined && percent > 0 ? (
                <AppText variant="priceStrike" style={{ fontSize: 10, flexShrink: 1 }} numberOfLines={1}>
                  {formatMoney(originalPrice)}
                </AppText>
              ) : null}
              {percent > 0 ? (
                <View style={{ marginLeft: 'auto', paddingVertical: 2.5, paddingHorizontal: 6, borderRadius: Radius.sm, backgroundColor: HomeChrome.discountBg }}>
                  <Text style={[Typography.badge, { color: HomeChrome.discountText, fontSize: 10.5 }]}>-{percent}%</Text>
                </View>
              ) : null}
            </View>
          )}
        </View>
      </Pressable>
      <FavoriteButton active={favorite} onToggle={onToggleFavorite} label={`Yêu thích ${name}`} />
    </View>
  );
}
