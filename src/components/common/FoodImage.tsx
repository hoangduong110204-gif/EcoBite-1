import type { ReactNode } from 'react';
import { Image, View, type DimensionValue, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { FoodIllustrationPalette, FoodTileGradient, Radius } from '@/constants';
import type { FoodArt } from '@/types';

interface FoodImageProps {
  art: FoodArt;
  /** Real photo. When absent the vector illustration of `art` is drawn instead. */
  image?: ImageSourcePropType;
  width?: DimensionValue;
  height?: number;
  radius?: number;
  /** Overlay content (e.g. a discount badge positioned absolutely). */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Food picture: the real photo (`image`, cover-fitted and cropped to the box) or,
 * without one, the tinted gradient tile + simple vector bowl (reference `.mon .m-*`).
 */
export function FoodImage({ art, image, width = '100%', height = 104, radius = Radius.card, children, style }: FoodImageProps) {
  const tile = FoodTileGradient[art];
  const p = FoodIllustrationPalette[art];
  return (
    <View style={[{ width, height, borderRadius: radius, overflow: 'hidden' }, style]}>
      {image ? (
        <Image source={image} resizeMode="cover" accessibilityIgnoresInvertColors style={{ width: '100%', height: '100%' }} />
      ) : (
      <LinearGradient colors={tile.colors} start={tile.start} end={tile.end} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Svg height="88%" style={{ aspectRatio: 120 / 88 }} viewBox="0 0 120 88">
          <Ellipse cx={60} cy={76} rx={42} ry={6} fill={p.shadow} opacity={0.5} />
          <Path d="M16 44h88c0 17-16 28-44 28S16 61 16 44z" fill={p.bowl} />
          <Path d="M19 44h82c0 3.4-1.4 6.4-3.8 8.8H22.8C20.4 50.4 19 47.4 19 44z" fill={p.rim} />
          <Path d="M28 44c4-13 15-21 32-21s28 8 32 21z" fill={p.food} />
          <Circle cx={42} cy={36} r={5} fill={p.accent} />
          <Circle cx={56} cy={31} r={4.4} fill={p.accent2} />
          <Circle cx={72} cy={35} r={5.2} fill={p.accent} />
          <Circle cx={83} cy={39} r={3.6} fill={p.accent2} />
        </Svg>
      </LinearGradient>
      )}
      {children}
    </View>
  );
}
