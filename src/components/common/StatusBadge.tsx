import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from '@/constants';
import type { OrderState } from '@/types';

import { Badge } from './Badge';

/** Order status pill. Label and tone come from the order-status constants (main sequence + cancelled/expired). */
export function StatusBadge({ status }: { status: OrderState }) {
  return <Badge label={ORDER_STATUS_LABEL[status]} tone={ORDER_STATUS_TONE[status]} />;
}
