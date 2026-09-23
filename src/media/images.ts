import type { ImageSourcePropType } from 'react-native';

/**
 * Real photos, bundled locally (`assets/images`, credits in `assets/images/CREDITS.md`).
 * ONE entry per entity id, so a restaurant / food bag shows the same picture on every
 * screen (Home, Search, Restaurant Detail, Food Bag Detail, Cart, Checkout, Orders).
 * Kept apart from `data/mock` (which stays plain data the node checks can load) and from
 * the `constants` barrel; only screens read it. An id without an entry falls back to the
 * vector illustration of its `art`.
 *
 * Restaurant photos show the restaurant's signature dish; bag photos show what the
 * bag actually contains (`data/mock/food-bags.ts`).
 */
const restaurantImages: Record<string, ImageSourcePropType> = {
  res_01: require('../../assets/images/restaurants/res_01.jpg'), // Bếp Nhà Lá: cơm tấm sườn
  res_02: require('../../assets/images/restaurants/res_02.jpg'), // Sushi House: sushi platter
  res_03: require('../../assets/images/restaurants/res_03.jpg'), // Bún Bò Cay: bún bò
  res_04: require('../../assets/images/restaurants/res_04.jpg'), // Cơm Niêu Quê: cơm niêu
  res_05: require('../../assets/images/restaurants/res_05.jpg'), // Salad Nhà Gấu: fresh salad
  res_06: require('../../assets/images/restaurants/res_06.jpg'), // Chè Sen Bà Tâm: chè
};

const foodBagImages: Record<string, ImageSourcePropType> = {
  bag_01: require('../../assets/images/food-bags/bag_01.jpg'), // Túi cơm chiều: cơm sườn
  bag_02: require('../../assets/images/food-bags/bag_02.jpg'), // Túi chay thanh đạm: cơm + món chay
  bag_03: require('../../assets/images/food-bags/bag_03.jpg'), // Túi bất ngờ cuối ngày: mâm nhiều món
  bag_04: require('../../assets/images/food-bags/bag_04.jpg'), // Túi bún bò cay
  bag_05: require('../../assets/images/food-bags/bag_05.jpg'), // Túi salad chiều: salad + ức gà
  bag_06: require('../../assets/images/food-bags/bag_06.jpg'), // Túi tráng miệng: chè hạt sen
  bag_07: require('../../assets/images/food-bags/bag_07.jpg'), // Túi sushi chiều
  bag_08: require('../../assets/images/food-bags/bag_08.jpg'), // Túi cơm niêu
};

/** Home hero banner photo (healthy bowl with egg and vegetables). */
const homeHeroImage: ImageSourcePropType = require('../../assets/images/home/hero-bowl.jpg');
export const getHomeHeroImage = (): ImageSourcePropType => homeHeroImage;

export const getRestaurantImage = (restaurantId: string | undefined | null): ImageSourcePropType | undefined =>
  restaurantId ? restaurantImages[restaurantId] : undefined;

export const getFoodBagImage = (foodBagId: string | undefined | null): ImageSourcePropType | undefined =>
  foodBagId ? foodBagImages[foodBagId] : undefined;

/** Ids that have a bundled photo (used by the consistency checks). */
export const RESTAURANT_IMAGE_IDS = Object.keys(restaurantImages);
export const FOOD_BAG_IMAGE_IDS = Object.keys(foodBagImages);
