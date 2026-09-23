import type { Promo } from '@/types';

/** Follows the reference `PROMOS`. */
export const mockPromos: Promo[] = [
  {
    code: 'ECOBITE10K',
    label: 'Giảm 10.000đ',
    minTotal: 80000,
    amount: 10000,
    expires: '20/09',
    usable: true,
  },
  {
    code: 'CHAY15',
    label: 'Giảm 15% tối đa 20.000đ',
    minTotal: 0,
    percent: 15,
    cap: 20000,
    expires: '30/09',
    usable: true,
    onlyVegan: true,
  },
  {
    code: 'ECOBITE30K',
    label: 'Giảm 30.000đ',
    minTotal: 150000,
    amount: 30000,
    expires: '25/09',
    usable: false,
  },
];
