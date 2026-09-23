import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Colors } from '@/constants';

import { Icon } from './icons';

interface QrCodeProps {
  /** Text encoded in the QR. */
  value: string;
  size?: number;
  /** Module colour: black for the PAYMENT QR, dark green for the PICKUP QR. */
  color: string;
  backgroundColor?: string;
  /** Brand leaf on a white rounded square in the centre (pickup QR, reference 8.3). */
  centerLogo?: boolean;
}

/**
 * Generic QR renderer (react-native-qrcode-svg). It knows nothing about
 * payment vs pickup: use `PaymentQrCard` / `PickupQrCard`, which keep the two
 * QR types apart.
 */
export function QrCode({ value, size = 196, color, backgroundColor = Colors.white, centerLogo = false }: QrCodeProps) {
  const logo = Math.round(size * 0.288);
  return (
    <View style={{ width: size, height: size }}>
      <QRCode value={value} size={size} color={color} backgroundColor={backgroundColor} ecl={centerLogo ? 'H' : 'M'} quietZone={0} />
      {centerLogo ? (
        <View
          style={{
            position: 'absolute',
            left: (size - logo) / 2,
            top: (size - logo) / 2,
            width: logo,
            height: logo,
            borderRadius: Math.round(logo * 0.22),
            backgroundColor: Colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="leaf" size={Math.round(logo * 0.7)} color={Colors.primary} />
        </View>
      ) : null}
    </View>
  );
}
