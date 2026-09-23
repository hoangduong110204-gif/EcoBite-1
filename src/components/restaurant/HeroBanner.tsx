import { Image, View, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText } from '@/components/common';
import { HeroBannerArt, HomeHeroArt, HomeLayout, Radius } from '@/constants';

interface HeroBannerProps {
  /** Food photo (round bowl) on the right. Without one the banner is text on the gradient only. */
  image?: ImageSourcePropType;
}

/**
 * Home hero (reference: wide 2.4 : 1 promo banner): a very pale green background with two
 * soft circles (no leaves), the headline and supporting text left-aligned on the left
 * ~55%, and a large round food photo on the right that bleeds off the edge. Real views,
 * no flattened image; the AI orb is a global component and is NOT part of the hero.
 */
export function HeroBanner({ image }: HeroBannerProps) {
  const photo = HomeLayout.heroPhotoSize;
  return (
    <LinearGradient
      colors={HomeHeroArt.gradient.colors}
      start={HomeHeroArt.gradient.start}
      end={HomeHeroArt.gradient.end}
      style={{ height: HomeLayout.heroHeight, borderRadius: Radius.hero, overflow: 'hidden' }}>
      {/* soft background circles */}
      <View pointerEvents="none" style={{ position: 'absolute', left: -34, bottom: -46, width: 120, height: 120, borderRadius: 60, backgroundColor: HomeHeroArt.shapeLight }} />
      <View
        pointerEvents="none"
        style={{ position: 'absolute', right: HomeLayout.heroPhotoRight - 14, top: HomeLayout.heroPhotoTop - 10, width: photo + 28, height: photo + 28, borderRadius: (photo + 28) / 2, backgroundColor: HomeHeroArt.shapeGreen }}
      />

      <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 20, width: `${HomeLayout.heroTextShare * 100}%`, gap: 8 }}>
        <AppText variant="hero" style={{ color: HeroBannerArt.title, fontSize: 25, lineHeight: 30, letterSpacing: -0.5 }}>
          {'Ăn ngon hơn\nSống xanh hơn'}
        </AppText>
        <AppText variant="bodyStrong" style={{ color: HeroBannerArt.subtitle, fontSize: 13, lineHeight: 18 }}>
          {'Món ngon, giá tốt\nvì một hành tinh xanh'}
        </AppText>
      </View>

      {image ? (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', right: HomeLayout.heroPhotoRight, top: HomeLayout.heroPhotoTop, width: photo, height: photo, borderRadius: photo / 2, overflow: 'hidden' }}>
          <Image source={image} resizeMode="cover" accessibilityIgnoresInvertColors style={{ width: '100%', height: '100%' }} />
        </View>
      ) : null}
    </LinearGradient>
  );
}
