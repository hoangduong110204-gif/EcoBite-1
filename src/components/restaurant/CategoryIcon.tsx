import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { CategoryIconPalette as P, type CategoryIconKey } from '@/constants';

interface CategoryIconProps {
  name: CategoryIconKey;
  size: number;
  /** "Tất cả" grid is drawn in a deeper green when its circle is selected. */
  selected?: boolean;
}

/**
 * One distinctive vector drawing per Home category (flat, soft-3D, green / cream):
 * grid, rice bowl, noodle bowl, leafy vegetable, cake slice, drink cup. Not photos,
 * not emoji; every drawing shares the 48 × 48 grid and the same soft shadow.
 */
export function CategoryIcon({ name, size, selected = false }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {name === 'all' ? (
        <>
          {[9, 27].flatMap((x) => [9, 27].map((y) => <Rect key={`${x}-${y}`} x={x} y={y} width={12} height={12} rx={3.4} fill={selected ? P.gridSelected : P.gridOn} />))}
        </>
      ) : null}

      {name === 'rice' ? (
        <>
          <Ellipse cx={24} cy={42.4} rx={15} ry={2.4} fill={P.shadow} />
          <Path d="M9 26c1.2-8.6 6.6-14 15-14s13.8 5.4 15 14z" fill={P.rice} stroke={P.riceEdge} strokeWidth={1.2} />
          <Ellipse cx={19} cy={19} rx={1.6} ry={0.9} fill={P.riceGrain} />
          <Ellipse cx={26} cy={16.6} rx={1.6} ry={0.9} fill={P.riceGrain} />
          <Ellipse cx={30.5} cy={21} rx={1.6} ry={0.9} fill={P.riceGrain} />
          <Ellipse cx={23} cy={22.4} rx={1.6} ry={0.9} fill={P.riceGrain} />
          <Path d="M6.5 25h35c0 10.4-7.6 16.4-17.5 16.4S6.5 35.4 6.5 25z" fill={P.bowl} />
          <Path d="M6.5 25h35v3.2h-35z" fill={P.bowlDark} />
          <Path d="M12 30.5c1.8 3.4 5.2 5.4 9 5.9" stroke={P.highlight} strokeWidth={1.8} strokeLinecap="round" fill="none" />
        </>
      ) : null}

      {name === 'noodle' ? (
        <>
          <Ellipse cx={24} cy={42.4} rx={15} ry={2.4} fill={P.shadow} />
          <Path d="M31.5 4.5 22 20M36 7l-9.6 14.5" stroke={P.chopstick} strokeWidth={2} strokeLinecap="round" fill="none" />
          <Path d="M9.5 26c1.3-7.6 6.6-12.6 14.5-12.6S37.2 18.4 38.5 26z" fill={P.noodle} />
          <Path d="M12.5 22.6c3-3.2 5-3.2 7.5 0s5 3.2 8 0 4.8-2.6 7.5 0" stroke={P.noodleLine} strokeWidth={1.6} strokeLinecap="round" fill="none" />
          <Path d="M13 19.4c2.6-2.2 4.6-2.2 6.8 0s4.6 2.2 7.2 0" stroke={P.noodleLine} strokeWidth={1.4} strokeLinecap="round" fill="none" />
          <Circle cx={30.4} cy={19} r={4.2} fill={P.egg} />
          <Circle cx={30.4} cy={19} r={2} fill={P.yolk} />
          <Ellipse cx={17} cy={18} rx={3.6} ry={2} fill={P.greenLeaf} />
          <Path d="M6.5 25h35c0 10.4-7.6 16.4-17.5 16.4S6.5 35.4 6.5 25z" fill={P.bowlNoodle} />
          <Path d="M6.5 25h35v3.2h-35z" fill={P.bowlDark} />
          <Path d="M12 30.5c1.8 3.4 5.2 5.4 9 5.9" stroke={P.highlight} strokeWidth={1.8} strokeLinecap="round" fill="none" />
        </>
      ) : null}

      {name === 'healthy' ? (
        <>
          <Ellipse cx={24} cy={42.6} rx={12} ry={2.2} fill={P.shadow} />
          <Path d="M20 13C10 14 6 22 7 31c.2 1.6.6 3 1.2 4.2 1.4-6 4.6-10.6 9.6-13.6-3 4-4.6 8.4-4.8 13.4 4.6.2 8.4-1.6 10.6-5.6 2.6-4.6 2-11.2-3.6-16.4z" fill={P.leafLight} />
          <Path d="M40 6C22 6 12 16 12 29c0 2 .3 4 .9 5.8 1.6-7.6 6.4-14 14.6-18.6-5 5.4-8 11.6-9 18.4 2.2.8 4.6 1.2 7 1.2 11.6 0 14.5-14 14.5-29.8z" fill={P.leaf} />
          <Path d="M13.4 36c3-9.6 9.6-17 20.2-23.2" stroke={P.leafVein} strokeWidth={1.6} strokeLinecap="round" fill="none" />
          <Path d="M20 27.5 18.4 22.2M25.6 22l-.4-5.6" stroke={P.leafVein} strokeWidth={1.2} strokeLinecap="round" fill="none" opacity={0.7} />
        </>
      ) : null}

      {name === 'dessert' ? (
        <>
          <Ellipse cx={24} cy={40} rx={16.5} ry={3.2} fill={P.plate} stroke={P.plateEdge} strokeWidth={1.2} />
          <Path d="M9.5 36.5V25h29v11.5c0 1.4-6.6 2.4-14.5 2.4S9.5 37.9 9.5 36.5z" fill={P.sponge} />
          <Path d="M9.5 29.4h29v3.2h-29z" fill={P.cream} />
          <Path d="M9.5 25c0-4.2 5.6-6.6 14.5-6.6S38.5 20.8 38.5 25z" fill={P.plate} stroke={P.plateEdge} strokeWidth={1} />
          <Circle cx={24} cy={15.4} r={5} fill={P.strawberry} />
          <Path d="M21.4 11.6c1.2-1.2 3.6-1.2 5.2 0-1.6.8-3.6.8-5.2 0z" fill={P.strawberryLeaf} />
          <Circle cx={22.4} cy={14.6} r={0.6} fill={P.highlight} />
          <Circle cx={25.6} cy={16.4} r={0.6} fill={P.highlight} />
        </>
      ) : null}

      {name === 'drink' ? (
        <>
          <Ellipse cx={24} cy={43} rx={11} ry={2} fill={P.shadow} />
          <Path d="M27.5 10 31 3.6h4.2" stroke={P.straw} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Path d="M14 17h20l-2.4 23.4c-.1 1.4-1.2 2.4-2.6 2.4h-9.6c-1.4 0-2.5-1-2.6-2.4z" fill={P.cup} />
          <Path d="M14.6 21.6h18.8l-.4 3.4H15z" fill={P.cupFoam} />
          <Path d="M17 28l1.2 10" stroke={P.highlight} strokeWidth={2} strokeLinecap="round" fill="none" />
          <Rect x={11.5} y={12.5} width={25} height={5.4} rx={2.7} fill={P.cupLid} stroke={P.cupEdge} strokeWidth={1} />
        </>
      ) : null}
    </Svg>
  );
}
