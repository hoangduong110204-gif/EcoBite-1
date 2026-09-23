import { View } from 'react-native';

import { AppText, QrCode } from '@/components/common';
import { BorderWidth, Colors, Radius, Shadows, Spacing } from '@/constants';
import type { PickupQr } from '@/types';

interface PickupQrCardProps {
  /**
   * The PICKUP QR (restaurant staff scan it). NOT a payment QR. The QR encodes
   * the opaque `token`; `orderCode` is shown beneath it for manual entry (D-7).
   */
  qr: PickupQr;
}

/** Pickup QR card (reference 8.3): white card r26, green modules with brand leaf, order code below. */
export function PickupQrCard({ qr }: PickupQrCardProps) {
  return (
    <View
      style={[
        {
          alignSelf: 'stretch',
          alignItems: 'center',
          gap: Spacing.s14,
          padding: 22,
          borderRadius: Radius.xl,
          backgroundColor: Colors.white,
          borderWidth: BorderWidth.hairline,
          borderColor: Colors.divider,
        },
        Shadows.qrCard,
      ]}>
      <QrCode value={qr.token} size={196} color={Colors.primaryDark} centerLogo />
      <View style={{ alignItems: 'center', gap: 3 }}>
        <AppText variant="caption" style={{ fontSize: 10.5, letterSpacing: 1 }}>
          MÃ ĐƠN
        </AppText>
        <AppText variant="hero" style={{ fontSize: 19, letterSpacing: 1.9 }}>
          {qr.orderCode}
        </AppText>
      </View>
    </View>
  );
}
