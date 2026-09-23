import { View } from 'react-native';

import { AppText, Badge, Card, QrCode } from '@/components/common';
import { BorderWidth, Colors, Radius, Spacing } from '@/constants';
import type { PaymentQr } from '@/types';
import { formatMoney } from '@/utils/format';

interface PaymentQrCardProps {
  /** The PAYMENT QR (the customer scans it with the banking app). NOT a pickup QR. */
  qr: PaymentQr;
  /** Shows the "BẢN DEMO · SỐ TÀI KHOẢN GIẢ LẬP" badge (mock bank details). */
  demo?: boolean;
}

/** Payment QR card (reference 7.1): amount, black-module QR on white, scan hint. */
export function PaymentQrCard({ qr, demo = true }: PaymentQrCardProps) {
  return (
    <View style={{ alignItems: 'center', gap: Spacing.s13 }}>
      {demo ? <Badge label="BẢN DEMO · SỐ TÀI KHOẢN GIẢ LẬP" tone="amber" /> : null}
      <Card style={{ alignSelf: 'stretch', alignItems: 'center', gap: Spacing.s13, paddingVertical: 20, paddingHorizontal: Spacing.s18 }}>
        <View style={{ alignItems: 'center', gap: 3 }}>
          <AppText variant="caption">Số tiền cần chuyển</AppText>
          <AppText variant="amount">{formatMoney(qr.amount)}</AppText>
        </View>
        <View
          style={{
            padding: Spacing.s13,
            borderRadius: Radius.lg,
            backgroundColor: Colors.white,
            borderWidth: BorderWidth.ring,
            borderColor: Colors.border,
          }}>
          <QrCode value={qr.payload} size={196} color={Colors.text} />
        </View>
        <AppText variant="caption" style={{ textAlign: 'center' }}>
          Mở app ngân hàng, chọn Quét mã QR và quét mã ở trên
        </AppText>
      </Card>
    </View>
  );
}
