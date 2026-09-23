import { View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { AiArt, FontFamily, ImpactArt, OnboardingCircle, ValueArt, type OnboardingArtKey } from '@/constants';

/**
 * 250 px illustration circle of the onboarding slides (reference 1.2, 1.3,
 * 1.4). Vector placeholders drawn from the reference SVGs; real artwork can
 * replace them without changing the screens.
 */
export function OnboardingIllustration({ art }: { art: OnboardingArtKey }) {
  return (
    <View
      style={{
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: OnboardingCircle[art],
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {art === 'value' ? <ValueSvg /> : art === 'impact' ? <ImpactSvg /> : <AiSvg />}
    </View>
  );
}

function ValueSvg() {
  const a = ValueArt;
  return (
    <Svg width={176} height={150} viewBox="0 0 176 150">
      <Ellipse cx={88} cy={132} rx={64} ry={9} fill={a.shadow} opacity={0.4} />
      <Path d="M22 72h132c0 27-24 46-66 46S22 99 22 72z" fill={a.bowl} />
      <Path d="M26 72h124c0 5-2 9-5 13H31c-3-4-5-8-5-13z" fill={a.rim} />
      <Path d="M38 72c5-20 23-33 50-33s45 13 50 33z" fill={a.food} />
      <Circle cx={58} cy={60} r={7} fill={a.greens[0]} />
      <Circle cx={76} cy={52} r={6.4} fill={a.greens[1]} />
      <Circle cx={100} cy={55} r={7} fill={a.greens[2]} />
      <Circle cx={120} cy={63} r={6} fill={a.greens[3]} />
      <Ellipse cx={88} cy={44} rx={17} ry={12} fill={a.egg} />
      <Ellipse cx={91} cy={44} rx={7} ry={6} fill={a.yolk} />
      <G transform="translate(120,14)">
        <Circle cx={20} cy={20} r={20} fill={a.badge} />
        <SvgText x={20} y={26} fontFamily={FontFamily.extraBold} fontSize={14} fill={a.badgeText} textAnchor="middle">
          -50%
        </SvgText>
      </G>
    </Svg>
  );
}

function ImpactSvg() {
  const a = ImpactArt;
  return (
    <Svg width={176} height={150} viewBox="0 0 176 150">
      <Ellipse cx={88} cy={134} rx={52} ry={8} fill={a.shadow} opacity={0.38} />
      <Circle cx={88} cy={66} r={48} fill={a.globe} />
      <Circle cx={88} cy={66} r={48} fill="none" stroke={a.ring} strokeWidth={2} />
      <Path d="M50 44c12-6 24-6 34 0-8 7-22 8-34 0z" fill={a.leaves[0]} />
      <Path d="M104 52c10-2 18 1 22 7-8 4-17 2-22-7z" fill={a.leaves[1]} />
      <Path d="M52 82c10-5 22-4 30 3-10 5-22 4-30-3z" fill={a.leaves[2]} />
      <Path d="M98 86c8-1 15 2 18 8-7 3-14 0-18-8z" fill={a.leaves[3]} />
      <Path d="M88 18v96" stroke={a.lines} strokeWidth={1.6} />
      <Path d="M40 66h96" stroke={a.lines} strokeWidth={1.6} />
      <G transform="translate(96,14)">
        <Circle cx={24} cy={24} r={24} fill={a.bubble} />
        <G transform="translate(9,9)">
          <Path
            d="M26 4C12 4 5 10.4 5 21c0 1.4.3 2.7.7 4 .8-4 3.4-8 8-10.6C10.9 18 9.3 21.5 8.8 25.7c1.6.8 3.4 1.2 5.5 1.2C23.7 26.9 26 17.2 26 4z"
            fill={a.leafIcon}
          />
        </G>
      </G>
      <G transform="translate(20,86)">
        <Circle cx={20} cy={20} r={20} fill={a.bubble} />
        <Path d="M13 20.6 18 25.6 28 14.6" stroke={a.check} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
}

function AiSvg() {
  const a = AiArt;
  return (
    <Svg width={176} height={160} viewBox="0 0 176 160">
      <Defs>
        <LinearGradient id="onbOrb" x1="0" y1="0" x2="1" y2="1">
          {a.orb.map((color, i) => (
            <Stop key={color} offset={a.orbStops[i]} stopColor={color} />
          ))}
        </LinearGradient>
      </Defs>
      <Circle cx={88} cy={70} r={46} fill="url(#onbOrb)" />
      <Ellipse cx={72} cy={52} rx={16} ry={10} fill={a.highlight} opacity={0.9} />
      <Ellipse cx={108} cy={90} rx={9} ry={5} fill={a.highlight} opacity={0.7} />
      <Circle cx={88} cy={70} r={46} fill="none" stroke={a.highlight} strokeWidth={2} opacity={0.7} />
      <G transform="translate(74,56)">
        <Path
          transform="scale(1.1667)"
          d="M20 4C10 4 4 9 4 17c0 1 .2 2 .5 3 .6-3 2.5-6 6-8-2 2.5-3.2 5.2-3.6 8.4C8 21 9.4 21.4 11 21.4c7 0 9-7.4 9-17.4z"
          fill={a.leaf}
          opacity={0.92}
        />
      </G>
      <Rect x={18} y={122} width={78} height={26} rx={13} fill={a.chip} />
      <SvgText x={36} y={139} fontFamily={FontFamily.bold} fontSize={12} fill={a.chipText}>
        Hôm nay ăn gì?
      </SvgText>
      <Circle cx={28} cy={135} r={4.4} fill={a.dotViolet} />
      <Rect x={104} y={96} width={60} height={24} rx={12} fill={a.chip} />
      <SvgText x={120} y={112} fontFamily={FontFamily.bold} fontSize={11} fill={a.chipText}>
        Món cay?
      </SvgText>
      <Circle cx={113} cy={108} r={4} fill={a.dotAmber} />
    </Svg>
  );
}
