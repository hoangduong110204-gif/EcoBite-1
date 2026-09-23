/**
 * Home redesign (U1.8 Task 5): sizes and illustration colours, measured from the
 * provided Home reference (image px × 0.75 = dp on a 390 px phone). Colours live
 * here so components hold no hex literals.
 */
export const HomeLayout = {
  gutter: 16,
  /** Gap between the stacked Home sections. */
  sectionGap: 22,
  /** Reference hero is 589 x 244 (2.4 : 1): 148 dp tall on a 358 dp wide banner. */
  heroHeight: 148,
  /** Round food photo: the bowl starts at ~58% of the width and bleeds off the right edge. */
  heroPhotoSize: 176,
  heroPhotoRight: -28,
  heroPhotoTop: -14,
  /** Text column (left ~60%, the bowl starts at ~58%). */
  heroTextShare: 0.6,
  categoryCircle: 58,
  categoryIcon: 40,
  restaurantCardWidth: 176,
  restaurantImageHeight: 116,
  bagCardWidth: 132,
  bagImageHeight: 90,
  heart: 28,
  /** Space kept under the last section so the tab bar / AI orb never cover content. */
  bottomPadding: 96,
} as const;

/** Hero banner (pale green → cream) and the fade that blends the photo into it. */
export const HomeHeroArt = {
  /** Very pale green / cream, quiet so the headline and the food stay the focus. */
  gradient: {
    colors: ['#F3F9EC', '#E9F5DF', '#DEF0D3'],
    start: { x: 0, y: 0.2 },
    end: { x: 1, y: 0.9 },
  },
  /** Soft circles behind the content. */
  shapeLight: 'rgba(255, 255, 255, 0.55)',
  shapeGreen: 'rgba(160, 210, 140, 0.22)',
} as const;

export const HomeChrome = {
  /** Bell button and its notification dot. */
  bellDot: '#E24B3B',
  /** Round heart button over photos. */
  heartBg: 'rgba(255, 255, 255, 0.92)',
  heartOff: '#8C9A91',
  heartOn: '#E24B3B',
  discountBg: '#DDF3D8',
  discountText: '#1F7D46',
  /** "Còn túi" badge over the restaurant photo. */
  stockBadgeBg: 'rgba(31, 125, 70, 0.92)',
  soldOutBadgeBg: 'rgba(60, 68, 63, 0.82)',
  impactBg: '#E3F3DC',
  impactBorder: '#D0E8C8',
} as const;

/** Category circles: pale tint per category, stronger green when selected. */
export const CategoryCircle = {
  all: '#DDF1D6',
  rice: '#E8F5E2',
  noodle: '#FBF0D6',
  healthy: '#E1F2D7',
  dessert: '#FCE8E0',
  drink: '#E1F4E4',
  selected: '#BDE5B1',
} as const;

export type CategoryIconKey = 'all' | 'rice' | 'noodle' | 'healthy' | 'dessert' | 'drink';

/** Flat, soft-3D category illustrations (one distinctive drawing per category). */
export const CategoryIconPalette = {
  gridOn: '#2FA05C',
  gridSelected: '#1F7D46',
  shadow: 'rgba(31, 125, 70, 0.14)',
  bowl: '#3FA862',
  bowlDark: '#2E8B4E',
  bowlNoodle: '#4CB27C',
  rice: '#FFFFFF',
  riceEdge: '#DCE7D6',
  riceGrain: '#C9D8C2',
  noodle: '#F6D67A',
  noodleLine: '#E2B23C',
  egg: '#FFFFFF',
  yolk: '#F4B839',
  chopstick: '#B9814B',
  greenLeaf: '#6CBB65',
  leaf: '#4FAE5A',
  leafLight: '#8ED381',
  leafVein: '#2E8B47',
  plate: '#FFFFFF',
  plateEdge: '#E5E2D6',
  sponge: '#F1D3A0',
  cream: '#FFF7E8',
  strawberry: '#E5483C',
  strawberryLeaf: '#4FA551',
  cup: '#8FD98F',
  cupFoam: '#C5EBB8',
  cupLid: '#FFFFFF',
  cupEdge: '#CFE3C8',
  straw: '#F26B5B',
  highlight: 'rgba(255, 255, 255, 0.55)',
} as const;
