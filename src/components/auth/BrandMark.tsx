import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { Colors, SplashPalette } from '@/constants';

interface BrandMarkProps {
  /** Tile edge: 104 on Splash (1.1), 90 on Welcome (1.5). */
  tileSize?: number;
  /** White tile with glow (Splash) or mint tile (Welcome). */
  tone?: 'white' | 'mint';
}

/** EcoBite leaf logo on a rounded tile (reference 1.1 / 1.5). */
export function BrandMark({ tileSize = 104, tone = 'white' }: BrandMarkProps) {
  const [c0, c1, c2] = SplashPalette.logoGradient;
  return (
    <View
      style={{
        width: tileSize,
        height: tileSize,
        borderRadius: Math.round(tileSize * 0.31),
        backgroundColor: tone === 'white' ? Colors.white : Colors.mint,
        alignItems: 'center',
        justifyContent: 'center',
        ...(tone === 'white'
          ? { shadowColor: SplashPalette.logoShadow, shadowOffset: { width: 0, height: 18 }, shadowOpacity: 1, shadowRadius: 18, elevation: 10 }
          : null),
      }}>
      <Svg width={Math.round(tileSize * 0.56)} height={Math.round(tileSize * 0.56)} viewBox="0 0 32 32">
        <Defs>
          <LinearGradient id="brandLeaf" x1="0.1" y1="0" x2="0.9" y2="1">
            <Stop offset="0" stopColor={c0} />
            <Stop offset="0.55" stopColor={c1} />
            <Stop offset="1" stopColor={c2} />
          </LinearGradient>
        </Defs>
        <Path
          d="M27.5 3.5C13 3.5 4.8 10.2 4.8 21c0 1.7.3 3.3.9 4.8 1-4.7 3.9-9 8.8-12.1-3.2 3.8-5 8-5.6 12.9 1.7.9 3.6 1.3 5.7 1.3C24.3 27.9 27.5 17.6 27.5 3.5z"
          fill="url(#brandLeaf)"
        />
        <Path
          d="M9.4 27.6C12.6 19.2 18.9 11.8 26.2 6.6"
          stroke={SplashPalette.logoHighlight}
          strokeWidth={1.7}
          fill="none"
          strokeLinecap="round"
          opacity={0.85}
        />
      </Svg>
    </View>
  );
}
