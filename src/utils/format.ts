import type { IsoDateString, Money } from '@/types';

/** 30000 -> "30.000đ" */
export const formatMoney = (amount: Money): string =>
  `${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ`;

/** Percentage saved vs the original price, e.g. (56000, 45000) -> 20. 0 when there is no saving. */
export const calcDiscountPercent = (original: Money, price: Money): number =>
  original > 0 && price < original ? Math.round(((original - price) / original) * 100) : 0;

/** 1.2 -> "1.2 km" */
export const formatDistance = (km: number): string => `${km.toFixed(1)} km`;

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

/** ISO timestamp -> "HH:mm" in Vietnam time (UTC+7), independent of the device timezone. */
export const formatTimeVN = (iso: IsoDateString): string => {
  const d = new Date(Date.parse(iso) + VN_OFFSET_MS);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
};

/** Seconds -> "mm:ss" (countdown display). */
export const formatCountdown = (seconds: number): string => {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

/** "0912345678" -> "0912 345 678" (display only). */
export const formatPhone = (phone: string): string =>
  phone.length === 10 ? `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}` : phone;

/** 1.2 -> "1,2 kg" (Vietnamese decimal comma). */
export const formatKg = (kg: number): string => `${String(kg).replace('.', ',')} kg`;

/** ISO timestamp -> "dd/MM/yyyy" in Vietnam time (UTC+7). */
export const formatDateVN = (iso: IsoDateString): string => {
  const d = new Date(Date.parse(iso) + VN_OFFSET_MS);
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
};

/** ISO timestamp -> "dd/MM" in Vietnam time (order lists). */
export const formatDayMonthVN = (iso: IsoDateString): string => formatDateVN(iso).slice(0, 5);
