import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText, Badge, IconTile } from '@/components/common';
import { Spacing } from '@/constants';

interface CartRestaurantSectionProps {
  restaurantName: string;
  /** Chosen pickup time label, e.g. "18:30 – 19:00". `null` = not chosen yet. */
  pickupLabel: string | null;
  children: ReactNode;
}

/**
 * Cart group per restaurant (reference 6.1: each restaurant is its own pickup
 * point and will become its own order). Header + item rows.
 */
export function CartRestaurantSection({ restaurantName, pickupLabel, children }: CartRestaurantSectionProps) {
  return (
    <View style={{ gap: Spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        <IconTile name="pin" size="xs" iconSize={14} />
        <AppText variant="label" style={{ fontSize: 12.5 }} numberOfLines={1}>
          {restaurantName}
        </AppText>
        {pickupLabel ? (
          <Badge label={`Lấy ${pickupLabel}`} tone="green" />
        ) : (
          <Badge label="Chưa chọn giờ" tone="amber" />
        )}
      </View>
      {children}
    </View>
  );
}
