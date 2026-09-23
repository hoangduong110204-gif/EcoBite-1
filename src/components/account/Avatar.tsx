import { View } from 'react-native';

import { AppText } from '@/components/common';
import { Colors } from '@/constants';

interface AvatarProps {
  /** Letter shown in the circle (the first letter of the name). */
  initial: string;
  /** 62 on Account (10.1), 88 on Edit Profile (10.2). */
  size?: number;
}

/** Mint circle with the name's initial (reference 10.1 / 10.2). */
export function Avatar({ initial, size = 62 }: AvatarProps) {
  return (
    <View
      accessibilityLabel={`Ảnh đại diện ${initial}`}
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: Colors.mint, alignItems: 'center', justifyContent: 'center' }}>
      <AppText variant="hero" color="primaryDark" style={{ fontSize: Math.round(size * 0.35), lineHeight: Math.round(size * 0.4) }}>
        {initial}
      </AppText>
    </View>
  );
}
