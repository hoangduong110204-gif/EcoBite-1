import type { PickupLocation } from '@/types';
import { mockRestaurants } from './restaurants';

const INSTRUCTION = 'Đưa mã QR nhận hàng cho nhân viên quét. Nếu máy quán hỏng, đọc mã đơn cho nhân viên nhập tay.';

/** One pickup point per restaurant (the restaurant itself). Self-pickup only. */
export const mockPickupLocations: PickupLocation[] = mockRestaurants.map((r) => ({
  id: r.pickupLocationId,
  restaurantId: r.id,
  label: r.name,
  address: r.address,
  location: r.location,
  instructions: INSTRUCTION,
}));
