import { AppText, Card, PriceRow } from '@/components/common';
import type { OrderMoney } from '@/types';
import { formatMoney } from '@/utils/format';

interface OrderPriceBreakdownProps {
  money: OrderMoney;
  /** Applied promo code, shown in the promo row label. */
  promoCode?: string | null;
  /** Number of bags with own box (label "Mang hộp riêng ×2"). */
  ownBoxCount?: number;
  /** Label of the total row. */
  totalLabel?: string;
  /** Also show "Bạn tiết kiệm được" (`money.bagSavings`), informational: it is already inside the prices. */
  showSavings?: boolean;
}

/**
 * Money breakdown (reference 6.4 / 6.7 / 9.5): subtotal, promo, own-box, total.
 * There is no delivery-fee row (self-pickup only, D-13).
 */
export function OrderPriceBreakdown({ money, promoCode, ownBoxCount, totalLabel = 'Tổng thanh toán', showSavings = false }: OrderPriceBreakdownProps) {
  return (
    <Card style={{ gap: 2 }}>
      <PriceRow label="Tạm tính" amount={money.subtotal} />
      {money.promoDiscount > 0 ? (
        <PriceRow label={promoCode ? `Mã ${promoCode}` : 'Mã giảm giá'} amount={money.promoDiscount} discount />
      ) : null}
      {money.ownBoxDiscount > 0 ? (
        <PriceRow label={`Mang hộp riêng${ownBoxCount ? ` ×${ownBoxCount}` : ''}`} amount={money.ownBoxDiscount} discount />
      ) : null}
      <PriceRow label={totalLabel} amount={money.total} total />
      {showSavings && money.bagSavings > 0 ? (
        <AppText variant="caption" color="primaryDark" style={{ textAlign: 'right', paddingTop: 4 }}>
          Bạn tiết kiệm được {formatMoney(money.bagSavings)} so với giá gốc
        </AppText>
      ) : null}
    </Card>
  );
}
