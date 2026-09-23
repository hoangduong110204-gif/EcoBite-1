import { Pressable, View, type ImageSourcePropType } from 'react-native';

import { AppText, FoodImage, Icon } from '@/components/common';
import { FavoriteButton } from '@/components/home';
import { BorderWidth, Colors, HomeLayout, Radius, Shadows } from '@/constants';
import type { FoodArt, Money } from '@/types';
import { formatMoney } from '@/utils/format';

interface PopularBagCardProps {
  name: string;
  /** One-line description (the bag summary). */
  summary: string;
  restaurantName: string;
  rating: number;
  art: FoodArt;
  image?: ImageSourcePropType;
  price: Money;
  originalPrice: Money;
  favorite: boolean;
  onToggleFavorite: () => void;
  onPress?: () => void;
}

/** "Phổ biến hôm nay" card (reference 1): small photo with heart, name, description, price / struck price, star rating. */
export function PopularBagCard({ name, summary, restaurantName, rating, art, image, price, originalPrice, favorite, onToggleFavorite, onPress }: PopularBagCardProps) {
  return (
    <View
      style={[
        { width: HomeLayout.bagCardWidth, borderRadius: Radius.card, backgroundColor: Colors.white, overflow: 'hidden', borderWidth: BorderWidth.hairline, borderColor: Colors.divider },
        Shadows.card,
      ]}>
      <Pressable accessibilityRole="button" accessibilityLabel={name} onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}>
        <FoodImage art={art} image={image} height={HomeLayout.bagImageHeight} radius={0} />
        <View style={{ paddingTop: 8, paddingHorizontal: 9, paddingBottom: 10, gap: 2 }}>
          <AppText variant="rowTitle" numberOfLines={1} style={{ fontSize: 12 }}>
            {name}
          </AppText>
          <AppText variant="caption" color="textMuted" numberOfLines={1} style={{ fontSize: 10 }}>
            {summary}
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 3 }}>
            <AppText variant="price" style={{ fontSize: 12.5, lineHeight: 16 }}>
              {formatMoney(price)}
            </AppText>
            <AppText variant="priceStrike" numberOfLines={1} style={{ fontSize: 9, flexShrink: 1 }}>
              {formatMoney(originalPrice)}
            </AppText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 1 }}>
            <Icon name="star" size={10} color={Colors.warning} />
            <AppText variant="label" style={{ fontSize: 10 }}>
              {rating.toFixed(1)}
            </AppText>
            <AppText variant="caption" color="textMuted" numberOfLines={1} style={{ fontSize: 9.5, flex: 1 }}>
              · {restaurantName}
            </AppText>
          </View>
        </View>
      </Pressable>
      <FavoriteButton active={favorite} onToggle={onToggleFavorite} label={`Yêu thích ${name}`} />
    </View>
  );
}
