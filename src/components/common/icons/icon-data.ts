/**
 * Icon geometry copied from the 82-screen HTML reference (inline `<svg>` paths,
 * 24x24 viewBox). Only icons required by the shared components are included.
 *
 * Primitive keys: `d` path · `c` circle [cx, cy, r] · `r` rect [x, y, w, h, rx].
 * Flags: `fill` = painted with the icon colour instead of stroked;
 *        `paper` = stroked with the paper colour (detail inside a filled icon);
 *        `sw` = stroke-width override.
 */
export type IconPrimitive =
  | { d: string; fill?: boolean; paper?: boolean; sw?: number }
  | { c: [number, number, number]; fill?: boolean; sw?: number }
  | { r: [number, number, number, number, number]; fill?: boolean; sw?: number };

export interface IconDefinition {
  /** Default stroke width for stroked primitives. */
  sw: number;
  prims: IconPrimitive[];
}

const HOME = 'M3.4 10.6 12 3.3l8.6 7.3V19a2.4 2.4 0 0 1-2.4 2.4h-3.4v-5.2a1.2 1.2 0 0 0-1.2-1.2h-3.2a1.2 1.2 0 0 0-1.2 1.2v5.2H5.8A2.4 2.4 0 0 1 3.4 19z';
const RECEIPT = 'M5.5 3.6h13v16.8l-3.2-2.2-3.3 2.2-3.3-2.2-3.2 2.2z';
const CART = 'M3.5 4h2.2l2.1 10.4a1.6 1.6 0 0 0 1.6 1.3h8.3a1.6 1.6 0 0 0 1.6-1.3L21 7H6.4';
const PIN = 'M12 21.5s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z';
const HEART = 'M12 20.4S3.8 15 3.8 9.4a4.4 4.4 0 0 1 8.2-2.2 4.4 4.4 0 0 1 8.2 2.2c0 5.6-8.2 11-8.2 11z';
const BOX = 'M4.6 8.4 12 4.4l7.4 4v7.2L12 19.6l-7.4-4z';

export const ICONS = {
  // navigation / chevrons
  back: { sw: 2.2, prims: [{ d: 'm14.5 5-7 7 7 7' }] },
  chevronRight: { sw: 2.4, prims: [{ d: 'm9.5 5 7 7-7 7' }] },
  chevronDown: { sw: 2.4, prims: [{ d: 'm6 9 6 6 6-6' }] },
  close: { sw: 2.4, prims: [{ d: 'M6 6 18 18M18 6 6 18' }] },
  check: { sw: 2.6, prims: [{ d: 'm5 12.5 4.6 4.6L19 7.4' }] },
  plus: { sw: 2.6, prims: [{ d: 'M12 6v12M6 12h12' }] },
  minus: { sw: 2.8, prims: [{ d: 'M6 12h12' }] },

  // tab bar (stroke = inactive, *Filled = active)
  home: { sw: 1.9, prims: [{ d: HOME }] },
  homeFilled: { sw: 1.9, prims: [{ d: HOME, fill: true }] },
  orders: { sw: 1.9, prims: [{ d: RECEIPT }, { d: 'M9 8.4h6M9 12.4h4' }] },
  ordersFilled: {
    sw: 1.9,
    prims: [{ d: RECEIPT, fill: true }, { d: 'M9 8.4h6M9 12.4h4', paper: true, sw: 1.7 }],
  },
  cart: { sw: 1.9, prims: [{ d: CART }, { c: [10, 19.5, 1.4] }, { c: [17.5, 19.5, 1.4] }] },
  cartFilled: {
    sw: 1.9,
    prims: [{ d: `${CART}z`, fill: true }, { c: [10, 19.5, 1.6], fill: true }, { c: [17.5, 19.5, 1.6], fill: true }],
  },
  account: {
    sw: 1.9,
    prims: [{ c: [12, 8.4, 3.6] }, { d: 'M4.6 20.4c0-3.8 3.3-5.8 7.4-5.8s7.4 2 7.4 5.8' }],
  },
  accountFilled: {
    sw: 1.9,
    prims: [{ c: [12, 8.4, 3.8], fill: true }, { d: 'M4.6 20.4c0-3.9 3.3-6 7.4-6s7.4 2.1 7.4 6z', fill: true }],
  },

  // content
  star: { sw: 1, prims: [{ d: 'M12 3 14.7 8.6 20.8 9.4 16.3 13.6 17.5 19.7 12 16.8 6.5 19.7 7.7 13.6 3.2 9.4 9.3 8.6z', fill: true }] },
  pin: { sw: 2, prims: [{ d: PIN }, { c: [12, 10.4, 2.6] }] },
  clock: { sw: 2, prims: [{ c: [12, 12, 8.5] }, { d: 'M12 7v5.2l3.2 2' }] },
  search: { sw: 2.3, prims: [{ c: [11, 11, 7] }, { d: 'm20 20-3.5-3.5' }] },
  map: { sw: 2, prims: [{ d: 'm3.6 6.4 5.6-2.2 5.6 2.2 5.6-2.2v13.4l-5.6 2.2-5.6-2.2-5.6 2.2z' }, { d: 'M9.2 4.2v15.4M14.8 6.4v15.4' }] },
  box: { sw: 2, prims: [{ d: BOX }, { d: 'M4.6 8.4 12 12.4l7.4-4M12 12.4v7.2' }] },
  gift: {
    sw: 1.9,
    prims: [
      { r: [3.5, 8.5, 17, 4.4, 1.2] },
      { d: 'M5 12.9h14v7.6H5zM12 8.5v12' },
      { d: 'M12 8.5S10.6 4 8.2 4a2.2 2.2 0 0 0 0 4.5zM12 8.5S13.4 4 15.8 4a2.2 2.2 0 0 1 0 4.5z' },
    ],
  },
  qr: {
    sw: 2,
    prims: [
      { r: [4, 4, 6.4, 6.4, 1.4] },
      { r: [13.6, 4, 6.4, 6.4, 1.4] },
      { r: [4, 13.6, 6.4, 6.4, 1.4] },
      { d: 'M13.6 13.6h2.4v2.4h-2.4zM17.6 17.6H20V20h-2.4zM13.6 17.6h2.4M17.6 13.6H20' },
    ],
  },
  phone: {
    sw: 1.9,
    prims: [{ d: 'M6 3.5h3l1.6 4-2 1.6a12 12 0 0 0 6.3 6.3l1.6-2 4 1.6v3A2 2 0 0 1 18.4 20 15.5 15.5 0 0 1 4 5.6 2 2 0 0 1 6 3.5z' }],
  },
  lock: { sw: 1.9, prims: [{ r: [4.6, 10.4, 14.8, 10, 2.4] }, { d: 'M8 10.4V7.6a4 4 0 0 1 8 0v2.8' }] },
  eye: { sw: 1.9, prims: [{ d: 'M2.4 12S5.6 5.6 12 5.6 21.6 12 21.6 12 18.4 18.4 12 18.4 2.4 12 2.4 12z' }, { c: [12, 12, 3] }] },
  mail: { sw: 1.9, prims: [{ r: [3, 5.4, 18, 13.2, 2.4] }, { d: 'm3.6 7 8.4 6 8.4-6' }] },
  trash: { sw: 1.9, prims: [{ d: 'M4.5 6.5h15M9.5 6.5V4.6h5v1.9M6.8 6.5l.9 13a1.6 1.6 0 0 0 1.6 1.5h5.4a1.6 1.6 0 0 0 1.6-1.5l.9-13' }] },
  warning: { sw: 2, prims: [{ d: 'M12 3.6 21.4 20H2.6z' }, { d: 'M12 9.6v4.4M12 17h.01' }] },
  // Home header bell and favourite heart (reference 3.1, 4.1)
  bell: { sw: 1.9, prims: [{ d: 'M18 9a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7z' }, { d: 'M10.5 20a2 2 0 0 0 3 0' }] },
  heart: { sw: 2, prims: [{ d: HEART }] },
  heartFilled: { sw: 2, prims: [{ d: HEART, fill: true }] },
  // reference 3.5 control row (filter sliders, sort arrows) and 1.5 Apple mark (filled)
  filter: { sw: 2.4, prims: [{ d: 'M3.5 5.5h17M6.5 12h11M10 18.5h4' }] },
  sort: { sw: 2.2, prims: [{ d: 'M7 4v16M7 20l-3-3M17 20V4M17 4l3 3' }] },
  apple: {
    sw: 1,
    prims: [
      {
        d: 'M16.4 12.7c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9s-1.9-.9-3.2-.8c-1.6 0-3.2 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3.1 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8 2.2-1.2 3-2.4c.9-1.3 1.3-2.7 1.3-2.8 0 0-2.7-1-2.7-4zM14 5.6c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1 0 2.2-.6 2.9-1.4z',
        fill: true,
      },
    ],
  },
  leaf: {
    sw: 1,
    prims: [{ d: 'M20 4C10 4 4 9 4 17c0 1 .2 2 .5 3 .6-3 2.5-6 6-8-2 2.5-3.2 5.2-3.6 8.4C8 21 9.4 21.4 11 21.4c7 0 9-7.4 9-17.4z', fill: true }],
  },
} as const satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof ICONS;
