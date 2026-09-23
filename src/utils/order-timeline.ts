import { ORDER_STATUS_LABEL, ORDER_STATUS_SEQUENCE } from '@/constants/order-status';
import type { IsoDateString, OrderState, OrderStatus } from '@/types';

export type TimelineStepState = 'done' | 'current' | 'pending';

export interface TimelineStep {
  status: OrderStatus;
  label: string;
  state: TimelineStepState;
  /** ISO timestamp when the step was reached (undefined for current/pending). */
  reachedAt?: IsoDateString;
}

/**
 * Steps for the six-step order timeline (screen 8.2): a step is `done` when
 * it has a history timestamp, the first unreached step is `current`, the rest
 * are `pending`. For `cancelled` / `expired` orders no step is current.
 */
export const getTimelineSteps = (
  status: OrderState,
  history: Partial<Record<OrderState, IsoDateString>>,
): TimelineStep[] => {
  const terminalException = status === 'cancelled' || status === 'expired';
  const currentStatus = terminalException
    ? null
    : (ORDER_STATUS_SEQUENCE.find((s) => history[s] === undefined) ?? null);
  return ORDER_STATUS_SEQUENCE.map((step) => {
    const reachedAt = history[step];
    const state: TimelineStepState =
      reachedAt !== undefined ? 'done' : step === currentStatus ? 'current' : 'pending';
    return { status: step, label: ORDER_STATUS_LABEL[step], state, reachedAt };
  });
};
