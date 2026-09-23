import { View } from 'react-native';

import { Spacing } from '@/constants';
import type { Money } from '@/types';
import { formatMoney } from '@/utils/format';

import { AppText } from './AppText';
import { Divider } from './Divider';

interface PriceRowProps {
  label: string;
  /** Amount in VND; formatted as `30.000đ`. */
  amount?: Money;
  /** Pre-formatted value (used instead of `amount`, e.g. "—"). */
  value?: string;
  /** Show the amount as a deduction (`−22.000đ`) in green (`.giam`). */
  discount?: boolean;
  /** Total row: dashed rule above, larger label and green amount (`.tien.tong`). */
  total?: boolean;
}

/** `.tien`: label left, tabular value right. Presentational only. */
export function PriceRow({ label, amount, value, discount = false, total = false }: PriceRowProps) {
  const text = value ?? (amount !== undefined ? `${discount ? '−' : ''}${formatMoney(amount)}` : '');
  return (
    <View>
      {total ? <Divider dashed style={{ marginTop: Spacing.s6 }} /> : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: total ? Spacing.s11 : 5,
          paddingBottom: total ? 0 : 5,
        }}>
        <AppText variant={total ? 'button' : 'bodyStrong'} color={total ? 'text' : 'textMuted'}>
          {label}
        </AppText>
        <AppText
          variant={total ? 'section' : 'rowTitle'}
          color={total || discount ? 'primaryDark' : 'text'}
          style={{ fontVariant: ['tabular-nums'] }}>
          {text}
        </AppText>
      </View>
    </View>
  );
}
