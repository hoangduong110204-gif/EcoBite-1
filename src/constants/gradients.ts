import type { FoodArt } from '@/types';

/**
 * Gradient and illustration tokens from the reference (`styles.css` `.m-*`,
 * Home hero, pickup-QR screen, AI orb). Angles are the CSS angle converted to
 * expo-linear-gradient start/end points.
 */

type Point = { x: number; y: number };
export interface GradientSpec {
  colors: readonly [string, string, ...string[]];
  start: Point;
  end: Point;
}

/** CSS `150deg` ≈ top-left → bottom-right. */
const DIAGONAL = { start: { x: 0.2, y: 0 }, end: { x: 0.8, y: 1 } } as const;
const VERTICAL = { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } } as const;

/** Tinted tile behind a food illustration (`.m-xanh` …). */
export const FoodTileGradient: Record<FoodArt, GradientSpec> = {
  rice: { colors: ['#E8F4E1', '#CDE6C4'], ...DIAGONAL }, // m-xanh
  sushi: { colors: ['#FBEBD8', '#F2CFA8'], ...DIAGONAL }, // m-cam
  noodle: { colors: ['#FBE0DA', '#EFB9AC'], ...DIAGONAL }, // m-do
  clay: { colors: ['#F3E7D4', '#D8BC92'], ...DIAGONAL }, // m-nau
  salad: { colors: ['#E1F3DA', '#B8DFAE'], ...DIAGONAL }, // m-la
  dessert: { colors: ['#FBE9F0', '#EFC3D6'], ...DIAGONAL }, // m-hong
};

/** Simplified placeholder illustration palette per art (shadow, bowl rim, food colours). */
export const FoodIllustrationPalette: Record<
  FoodArt,
  { shadow: string; rim: string; bowl: string; food: string; accent: string; accent2: string }
> = {
  rice: { shadow: '#A5CB99', bowl: '#FFFFFF', rim: '#ECF5E9', food: '#F2E2B6', accent: '#57AE58', accent2: '#E86A52' },
  sushi: { shadow: '#DDAF80', bowl: '#FFFFFF', rim: '#F6EEE3', food: '#F4F0E6', accent: '#F2946A', accent2: '#4F8468' },
  noodle: { shadow: '#D99384', bowl: '#FFFFFF', rim: '#F7EAE7', food: '#E9C58A', accent: '#D9694F', accent2: '#6FBE68' },
  clay: { shadow: '#B99870', bowl: '#8A6141', rim: '#6E4A30', food: '#F2E2B6', accent: '#D8A15E', accent2: '#57AE58' },
  salad: { shadow: '#93C286', bowl: '#FFFFFF', rim: '#EDF6EA', food: '#6FBE68', accent: '#E86A52', accent2: '#F4B839' },
  dessert: { shadow: '#D89AB5', bowl: '#FFFFFF', rim: '#F6D3E0', food: '#C97FA4', accent: '#8E5C75', accent2: '#F6D3E0' },
};

/** Home hero banner. */
export const HeroGradient: GradientSpec = {
  colors: ['#DAEDD0', '#CBE7C1', '#BADFB2'],
  start: { x: 0, y: 0.3 },
  end: { x: 1, y: 0.7 },
};

/** Pickup-QR screen background (mint fading to paper). */
export const QrScreenGradient: GradientSpec = { colors: ['#E9F6E4', '#FDFDFB'], ...VERTICAL };

/**
 * AI orb layers. The reference uses CSS conic gradients (not available in RN);
 * they are approximated with a diagonal multi-stop linear gradient.
 */
export const OrbGradient: GradientSpec = {
  colors: ['#C3EBFF', '#D3C4F8', '#FFD8EC', '#FFF3D4', '#C6F2DD', '#A8DCF8'],
  start: { x: 0.1, y: 0.1 },
  end: { x: 0.9, y: 0.95 },
};
