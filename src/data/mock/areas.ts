import type { Area } from '@/types';

/**
 * Demo areas offered on Select Location (U1.2). Exactly these four.
 * Each restaurant has an `areaId` (see restaurants.ts). `restaurantCount` is the
 * number of demo restaurants a customer can browse from that area: pickup is in
 * person but all 6 are within reach in the Hà Nội pilot, so Home lists all six
 * and puts the selected area's restaurants first.
 */
export const mockAreas: Area[] = [
  { id: 'area_cau_giay', name: 'Cầu Giấy', city: 'Hà Nội', restaurantCount: 6 },
  { id: 'area_dong_da', name: 'Đống Đa', city: 'Hà Nội', restaurantCount: 6 },
  { id: 'area_ba_dinh', name: 'Ba Đình', city: 'Hà Nội', restaurantCount: 6 },
  { id: 'area_thanh_xuan', name: 'Thanh Xuân', city: 'Hà Nội', restaurantCount: 6 },
];
