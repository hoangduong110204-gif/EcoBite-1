import { View } from 'react-native';

import { BrandMark } from '@/components/auth';
import { AppText, Icon } from '@/components/common';
import { BorderWidth, Colors, HeroBannerArt, HomeChrome, HomeLayout } from '@/constants';

interface HomeHeaderProps {
  /** Shows the red unread dot. There is no notification state yet, so Home never sets it. */
  unread?: boolean;
}

/**
 * Compact Home header (reference 1): leaf logo, "EcoBite" with the "Good Food · Better
 * Planet" tagline, and the notification bell. The bell is only a marker until the
 * notifications screen (reference 3.9) is built, so it is not pressable.
 */
export function HomeHeader({ unread = false }: HomeHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: HomeLayout.gutter, paddingTop: 6, paddingBottom: 12 }}>
      <BrandMark tileSize={38} tone="mint" />
      <View style={{ flex: 1, gap: 1 }}>
        <AppText variant="hero" style={{ color: HeroBannerArt.title, fontSize: 21, lineHeight: 24, letterSpacing: -0.3 }}>
          EcoBite
        </AppText>
        <AppText variant="caption" color="textMuted" style={{ fontSize: 10.5, lineHeight: 13 }}>
          Good Food · Better Planet
        </AppText>
      </View>
      <View
        accessibilityLabel="Thông báo"
        style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, borderWidth: BorderWidth.hairline, borderColor: Colors.divider }}>
        <Icon name="bell" size={20} color={Colors.text} />
        {unread ? <View style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: HomeChrome.bellDot }} /> : null}
      </View>
    </View>
  );
}
