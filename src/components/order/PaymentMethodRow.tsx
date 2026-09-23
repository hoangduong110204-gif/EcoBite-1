import { Pressable, View } from 'react-native';

import { AppText, Badge, IconTile, RadioDot, type IconName } from '@/components/common';
import { BorderWidth, Colors, Radius, Spacing } from '@/constants';
import type { PaymentMethod, PaymentMethodId } from '@/types';

const ICON: Record<PaymentMethodId, { name: IconName; tone: 'mint' | 'blue' | 'neutral' }> = {
  bank_qr: { name: 'qr', tone: 'mint' },
  e_wallet: { name: 'phone', tone: 'blue' },
  card: { name: 'lock', tone: 'neutral' },
  cash: { name: 'box', tone: 'neutral' },
};

interface PaymentMethodRowProps {
  method: PaymentMethod;
  selected: boolean;
  onPress?: () => void;
}

/**
 * Payment method row (reference 6.8). A method with `enabled = false` is shown
 * dimmed, not selectable, with its badge ("Sắp có"). Only QR transfer is enabled (D-4/D-10).
 */
export function PaymentMethodRow({ method, selected, onPress }: PaymentMethodRowProps) {
  const icon = ICON[method.id];
  const disabled = !method.enabled;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        padding: Spacing.s14,
        borderRadius: Radius.card,
        backgroundColor: Colors.white,
        borderWidth: selected ? BorderWidth.ringStrong : BorderWidth.ring,
        borderColor: selected ? Colors.primary : Colors.border,
        opacity: disabled ? 0.55 : 1,
      }}>
      <IconTile name={icon.name} size="xl" tone={icon.tone} iconSize={20} color={disabled ? Colors.textMuted : Colors.primaryDark} />
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="bodyStrong">{method.label}</AppText>
        <AppText variant="caption" color="textMuted" style={{ fontSize: 11 }}>
          {method.description}
        </AppText>
      </View>
      <Badge label={method.badge} tone={disabled ? 'gray' : 'green'} />
      <RadioDot selected={selected} />
    </Pressable>
  );
}
