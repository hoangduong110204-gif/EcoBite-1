import type { PropsWithChildren } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';

import { Colors, Shadows } from '@/constants';

const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;

/**
 * Web-only preview shell: centres the whole app inside a phone-sized (390x844)
 * viewport when it runs in a desktop browser (`npx expo start --web`), so the
 * chat scrolls and the composer stays pinned inside that box instead of
 * stretching across the page. Mounted once, in the root layout.
 *
 * Native (iOS/Android) never renders this wrapper: `children` pass straight
 * through, full-screen, exactly as before.
 */
export function WebMobileFrame({ children }: PropsWithChildren) {
  const { width, height } = useWindowDimensions();
  if (Platform.OS !== 'web') return <>{children}</>;

  const frameWidth = Math.min(PHONE_WIDTH, width);
  const frameHeight = Math.min(PHONE_HEIGHT, height);
  // A real (small) mobile browser gets no visible backdrop margin: skip the bezel then.
  const hasBackdrop = frameWidth < width || frameHeight < height;

  return (
    <View style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.webBackdrop }}>
      <View
        style={[
          { width: frameWidth, height: frameHeight, overflow: 'hidden', backgroundColor: Colors.paper },
          hasBackdrop && { borderRadius: 28, borderWidth: 1, borderColor: Colors.webPhoneBorder, ...Shadows.card },
        ]}>
        {children}
      </View>
    </View>
  );
}
