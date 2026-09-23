/** Primary design reference device (points). */
export const REFERENCE_DEVICE = { width: 390, height: 844 } as const;

/** Horizontal page gutter (`.pad16`). Some screens use 20 (`.pad`) or 18 (Home). */
export const SCREEN_PADDING = 16;
export const SCREEN_PADDING_WIDE = 20;

/** Max content width when rendered on web / tablets. */
export const MAX_CONTENT_WIDTH = 480;

/** Fixed control sizes from the reference. */
export const Sizes = {
  buttonHeight: 50,
  buttonHeightSmall: 38,
  buttonHeightTiny: 31,
  inputHeight: 48,
  backChip: 36,
  iconTile: 38,
  chipHeight: 30,
  tabBadge: 16,
  /** Search field in the header of 3.4 / 3.5 (`.o` 42 px) and the fake search bar on Home (46 px). */
  searchField: 42,
  searchHome: 46,
  /** Home category button circle (`.dm .o`). */
  categoryCircle: 52,
  /** Restaurant Detail cover (4.1). */
  restaurantCover: 236,
  /** Food Bag Detail cover (5.1). */
  bagCover: 250,
} as const;
