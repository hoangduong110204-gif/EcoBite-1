import type { User } from '@/types';

/** Follows the reference `USER`. */
export const mockUsers: User[] = [
  {
    id: 'usr_001',
    name: 'Nguyễn Hoàng Dương',
    phone: '0912 345 678',
    email: 'duong.nguyen@email.com',
    area: 'Phường Dịch Vọng Hậu, Q. Cầu Giấy, Hà Nội',
    memberSince: '2026-08',
    walletBalance: 128000,
    savedRestaurants: ['res_01', 'res_05', 'res_02', 'res_06'],
    impact: { bagsSaved: 9, foodKg: 10.8, co2Kg: 22.5, moneySaved: 312000 },
  },
];

/** The signed-in user in the mock environment. */
export const mockCurrentUser: User = mockUsers[0];
