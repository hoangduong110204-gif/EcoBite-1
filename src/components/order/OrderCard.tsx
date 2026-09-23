import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, Card, StatusBadge } from '@/components/common';
import { Spacing } from '@/constants';
import type { Order } from '@/types';
import { formatMoney } from '@/utils/format';

interface OrderCardProps {
  order: Pick<Order, 'orderCode' | 'status' | 'items' | 'money' | 'pickupSlot'>;
  restaurantName: string;
  /** Right side of the footer line, e.g. "Hôm nay · nhận 18:30 – 19:00". */
  subtitle?: string;
  onPress?: () => void;
  /** Extra actions under the card content (e.g. "Mở QR" button). */
  children?: ReactNode;
}

/** Order list card (reference 9.1 / 9.2 / 9.3): code + status, restaurant, bags, slot and total. */
export function OrderCard({ order, restaurantName, subtitle, onPress, children }: OrderCardProps) {
  const bags = order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ');
  return (
    <Card style={{ gap: Spacing.s10 }}>
      {/* Only the summary is pressable: action buttons in `children` must not be nested inside a button. */}
      <Pressable accessibilityRole={onPress ? 'button' : undefined} disabled={!onPress} onPress={onPress} style={{ gap: Spacing.s10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <AppText variant="badge" color="textFaint" style={{ letterSpacing: 0.5 }}>
            {order.orderCode}
          </AppText>
          <StatusBadge status={order.status} />
        </View>
        <View style={{ gap: 3 }}>
          <AppText variant="rowTitle">{restaurantName}</AppText>
          <AppText variant="caption" color="textMuted" numberOfLines={2}>
            {bags}
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <AppText variant="caption" numberOfLines={1} style={{ flex: 1 }}>
            {subtitle ?? `nhận ${order.pickupSlot.label}`}
          </AppText>
          <AppText variant="price" color="text">
            {formatMoney(order.money.total)}
          </AppText>
        </View>
      </Pressable>
      {children}
    </Card>
  );
}
