import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Colors, LocationArt } from '@/constants';

/** 190 px mint circle with a map pin (reference 2.1). Purely decorative: no GPS involved. */
export function LocationIllustration() {
  const a = LocationArt;
  return (
    <View
      style={{
        width: 190,
        height: 190,
        borderRadius: 95,
        backgroundColor: Colors.mint,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Svg width={118} height={118} viewBox="0 0 120 120">
        <Circle cx={60} cy={60} r={46} fill={a.ringOuter} opacity={0.65} />
        <Circle cx={60} cy={60} r={30} fill={a.ringInner} />
        <Path d="M60 86s18-16 18-28a18 18 0 1 0-36 0c0 12 18 28 18 28z" fill={a.pin} />
        <Circle cx={60} cy={57} r={6.6} fill={a.pinDot} />
        <Circle cx={24} cy={34} r={5} fill={a.dots} />
        <Circle cx={98} cy={42} r={4} fill={a.dots} />
        <Circle cx={90} cy={92} r={5.4} fill={a.dots} />
        <Circle cx={28} cy={88} r={4} fill={a.dots} />
      </Svg>
    </View>
  );
}
