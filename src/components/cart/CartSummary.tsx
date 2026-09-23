import { View } from 'react-native';

import { PriceRow } from '@/components/common';
import type { Money } from '@/types';

interface CartSummaryProps {
  /** Number of bag units across all restaurants (the same count as the tab badge). */
  bagCount: number;
  /** Sum of unitPrice x quantity. */
  subtotal: Money;
  /** Total saved vs original prices (informational). */
  savings?: Money;
  /** Own-box discount already included in the total (shown as a deduction). */
  ownBoxDiscount?: Money;
}

/** Cart footer summary (reference 6.1): "Tạm tính · N túi", "Tiết kiệm được". No delivery row. */
export function CartSummary({ bagCount, subtotal, savings = 0, ownBoxDiscount = 0 }: CartSummaryProps) {
  return (
    <View>
      <PriceRow label={`Tạm tính · ${bagCount} túi`} amount={subtotal} />
      {ownBoxDiscount > 0 ? <PriceRow label="Mang hộp riêng" amount={ownBoxDiscount} discount /> : null}
      {savings > 0 ? <PriceRow label="Tiết kiệm được" amount={savings} discount /> : null}
    </View>
  );
}
