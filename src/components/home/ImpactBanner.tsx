import { Pressable, View } from 'react-native';

import { AppText, Icon } from '@/components/common';
import { BorderWidth, Colors, HeroBannerArt, HomeChrome } from '@/constants';

interface ImpactBannerProps {
  onPress?: () => void;
}

/** "Cùng EcoBite giảm lãng phí thực phẩm…" banner near the bottom of Home (reference 1): soft green, leaf, arrow. */
export function ImpactBanner({ onPress }: ImpactBannerProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Cùng EcoBite giảm lãng phí thực phẩm"
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderRadius: 16,
        backgroundColor: HomeChrome.impactBg,
        borderWidth: BorderWidth.hairline,
        borderColor: HomeChrome.impactBorder,
        opacity: pressed ? 0.9 : 1,
      })}>
      <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white }}>
        <Icon name="leaf" size={22} color={Colors.primary} />
      </View>
      <AppText variant="bodyStrong" style={{ flex: 1, color: HeroBannerArt.title, fontSize: 12.5, lineHeight: 17 }}>
        {'Cùng EcoBite giảm lãng phí thực phẩm\nvì một hành tinh xanh hơn'}
      </AppText>
      <Icon name="chevronRight" size={16} color={HeroBannerArt.title} />
    </Pressable>
  );
}
