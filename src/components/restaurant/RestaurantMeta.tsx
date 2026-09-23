import { View } from 'react-native';

import { AppText, Icon } from '@/components/common';
import { Colors, FontSize, Spacing } from '@/constants';
import { formatDistance } from '@/utils/format';

interface RestaurantMetaProps {
  rating: number;
  distanceKm: number;
  /** e.g. "(214 đánh giá)" style count shown after the rating. */
  ratingCount?: number;
  /** Small text (10.5) for grid cards; default 11.5. */
  compact?: boolean;
}

/** `.meta`: ★ 4.8 · 1.2 km. */
export function RestaurantMeta({ rating, distanceKm, ratingCount, compact = false }: RestaurantMetaProps) {
  const size = compact ? FontSize.micro : FontSize.caption;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Icon name="star" size={compact ? 11 : 12} color={Colors.warning} />
      <AppText variant="label" style={{ fontSize: size }}>
        {rating.toFixed(1)}
      </AppText>
      {ratingCount !== undefined ? (
        <AppText variant="caption" style={{ fontSize: size }}>
          ({ratingCount})
        </AppText>
      ) : null}
      <AppText variant="muted" style={{ fontSize: size, marginLeft: Spacing.xxs }}>
        · {formatDistance(distanceKm)}
      </AppText>
    </View>
  );
}
