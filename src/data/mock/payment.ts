import type { BankTransferDetails, PaymentMethod } from '@/types';

/**
 * Screen 6.8: QR bank transfer is the only enabled method (D-4, D-10).
 * Every other method is displayed disabled with "Sắp có".
 */
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'bank_qr',
    label: 'Chuyển khoản QR ngân hàng',
    description: 'App tự nhận khi tiền về · không phí',
    enabled: true,
    badge: 'Khuyên dùng',
  },
  {
    id: 'e_wallet',
    label: 'Ví điện tử',
    description: 'MoMo, ZaloPay, VNPay',
    enabled: false,
    badge: 'Sắp có',
  },
  {
    id: 'card',
    label: 'Thẻ ngân hàng',
    description: 'Thêm thẻ mới',
    enabled: false,
    badge: 'Sắp có',
  },
  {
    id: 'cash',
    label: 'Tiền mặt tại quán',
    description: 'Trả khi tới lấy túi · cần quán đồng ý',
    enabled: false,
    badge: 'Sắp có',
  },
];

/** Demo receiving account. Deliberately invalid; never a real account. */
export const mockBankAccount = {
  bank: 'Vietcombank (demo)',
  accountName: 'CTY TNHH ECOBITE',
  accountNumber: '0000 1234 5678',
  isDemo: true,
} as const satisfies Omit<BankTransferDetails, 'transferNote'>;
