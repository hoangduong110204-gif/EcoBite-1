import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Colors } from '@/constants';

import { ICONS, type IconDefinition, type IconName, type IconPrimitive } from './icon-data';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  /** Overrides the icon's default stroke width. */
  strokeWidth?: number;
}

/**
 * SVG icon from the reference set (`icon-data.ts`). Stroked by default;
 * primitives flagged `fill` are painted with `color`.
 */
export function Icon({ name, size = 20, color = Colors.text, strokeWidth }: IconProps) {
  const def: IconDefinition = ICONS[name];
  const render = (prim: IconPrimitive, index: number) => {
    const filled = 'fill' in prim && prim.fill;
    const paper = 'paper' in prim && prim.paper;
    const common = filled
      ? { fill: color }
      : {
          fill: 'none',
          stroke: paper ? Colors.paper : color,
          strokeWidth: prim.sw ?? strokeWidth ?? def.sw,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
        };
    if ('d' in prim) return <Path key={index} d={prim.d} {...common} />;
    if ('c' in prim) return <Circle key={index} cx={prim.c[0]} cy={prim.c[1]} r={prim.c[2]} {...common} />;
    const [x, y, width, height, rx] = prim.r;
    return <Rect key={index} x={x} y={y} width={width} height={height} rx={rx} {...common} />;
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {def.prims.map(render)}
    </Svg>
  );
}

export type { IconName };
