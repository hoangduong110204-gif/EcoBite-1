import { View } from 'react-native';

import { AppText, Badge } from '@/components/common';
import { Spacing } from '@/constants';

import { RestaurantMeta } from './RestaurantMeta';

interface RestaurantHeaderProps {
  name: string;
  rating: number;
  ratingCount: number;
  distanceKm: number;
  /** Category / cuisine line, e.g. "Cơm, đồ chay". */
  subtitle?: string;
  /** Availability badge, e.g. "Còn 5 túi hôm nay". */
  availabilityLabel?: string;
}

/** Title block of Restaurant Detail (4.1): availability badge, name, rating and distance. */
export function RestaurantHeader({ name, rating, ratingCount, distanceKm, subtitle, availabilityLabel }: RestaurantHeaderProps) {
  return (
    <View style={{ gap: Spacing.s6 }}>
      {availabilityLabel ? <Badge label={availabilityLabel} tone="solid" /> : null}
      <AppText variant="title">{name}</AppText>
      <RestaurantMeta rating={rating} distanceKm={distanceKm} ratingCount={ratingCount} />
      {subtitle ? <AppText variant="muted">{subtitle}</AppText> : null}
    </View>
  );
}
