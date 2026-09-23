import type { GradientSpec } from './gradients';

/**
 * Colours of the auth / onboarding illustrations, copied from the reference
 * SVGs (screens 1.1–1.4, 2.1). Kept here so components hold no hex literals.
 */

/** Splash (1.1) */
export const SplashGradient: GradientSpec = {
  colors: ['#F3FAF0', '#E2F1DD', '#D2E9CC'],
  start: { x: 0.35, y: 0 },
  end: { x: 0.65, y: 1 },
};
export const SplashPalette = {
  tagline: '#4B8C63',
  hint: '#6E8E7B',
  track: 'rgba(31, 125, 70, 0.16)',
  logoShadow: 'rgba(31, 125, 70, 0.5)',
  logoGradient: ['#8FD98F', '#4FB56A', '#1B7D45'] as const,
  logoHighlight: '#D4F0DA',
} as const;

/** Onboarding circles behind the illustrations (250 px). */
export const OnboardingCircle = { value: '#E8F4E1', impact: '#DCEFD6', ai: '#EFF1FB' } as const;

export type OnboardingArtKey = keyof typeof OnboardingCircle;

/** 1.2 "Ăn ngon hơn": bowl with a -50% badge. */
export const ValueArt = {
  shadow: '#9CC894',
  bowl: '#FFFFFF',
  rim: '#EDF6EA',
  food: '#F4E4B8',
  greens: ['#57AE58', '#6FBE68', '#4FA551', '#76C46D'],
  egg: '#FFFFFF',
  yolk: '#F4B839',
  badge: '#2FA05C',
  badgeText: '#FFFFFF',
} as const;

/** 1.3 "Giảm lãng phí": leafy globe with a check. */
export const ImpactArt = {
  shadow: '#9CC894',
  globe: '#EAF6E6',
  ring: '#B4DCAE',
  leaves: ['#6FBE68', '#57AE58', '#4FA551', '#76C46D'],
  lines: '#CDE7C8',
  bubble: '#FFFFFF',
  leafIcon: '#2FA05C',
  check: '#2FA05C',
} as const;

/** 1.4 "Trợ lý AI": orb with two suggestion chips. */
export const AiArt = {
  orb: ['#CDEBFF', '#D8C8F8', '#FFE0EE', '#C8F2DE'] as const,
  orbStops: [0, 0.35, 0.7, 1] as const,
  highlight: '#FFFFFF',
  leaf: '#1F7D46',
  chip: '#FFFFFF',
  chipText: '#1A2621',
  dotViolet: '#8C7BE8',
  dotAmber: '#F2A828',
} as const;

/** 2.1 Location permission: pin with soft rings. */
export const LocationArt = {
  ringOuter: '#FFFFFF',
  ringInner: '#FFFFFF',
  pin: '#2FA05C',
  pinDot: '#FDFDFB',
  dots: '#8FD0A4',
} as const;

/** Home hero banner (3.1): mint gradient, soft circle, salad plate. */
export const HeroBannerArt = {
  gradient: {
    colors: ['#DAEDD0', '#CBE7C1', '#BADFB2'],
    start: { x: 0, y: 0.3 },
    end: { x: 1, y: 0.7 },
  } as GradientSpec,
  circle: 'rgba(255, 255, 255, 0.3)',
  title: '#1A4F2F',
  subtitle: '#3A6C4A',
  shadow: '#A6CD9D',
  plate: '#FFFFFF',
  egg: '#F4B839',
  greens: ['#57AE58', '#6FBE68', '#4FA551', '#7EC974', '#6CBB65'],
} as const;

/** Account "Thành tích của bạn" card (10.1): deep-to-brand green gradient with translucent stat tiles. */
export const AccountImpactArt = {
  gradient: {
    colors: ['#1F7D46', '#2FA05C'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  } as GradientSpec,
  tile: 'rgba(255, 255, 255, 0.16)',
  label: 'rgba(255, 255, 255, 0.82)',
} as const;
