import { View } from 'react-native';

import { AppText, Card, Icon } from '@/components/common';
import { Colors, TimelineStyles } from '@/constants';
import type { IsoDateString, OrderState } from '@/types';
import { formatTimeVN } from '@/utils/format';
import { getTimelineSteps } from '@/utils/order-timeline';

interface OrderStatusTimelineProps {
  status: OrderState;
  /** Timestamp at which each state was reached (`Order.statusHistory`). */
  history: Partial<Record<OrderState, IsoDateString>>;
  /** Hint under the current step, e.g. "Chờ nhân viên quét". */
  currentHint?: string;
}

/**
 * Six-step order timeline (reference 8.2, no driver steps). Reached steps are
 * filled green with a time; the current step is a hollow green ring; the rest
 * are grey. Step states come from `getTimelineSteps` (utils).
 */
export function OrderStatusTimeline({ status, history, currentHint }: OrderStatusTimelineProps) {
  const steps = getTimelineSteps(status, history);
  const { dot, line, column } = TimelineStyles;

  return (
    <Card>
      {steps.map((step, index) => {
        const done = step.state === 'done';
        const current = step.state === 'current';
        const last = index === steps.length - 1;
        const nextDone = !last && steps[index + 1].state === 'done';
        return (
          <View key={step.status} style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ width: column, alignItems: 'center' }}>
              <View
                style={{
                  width: dot,
                  height: dot,
                  borderRadius: dot / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: done ? TimelineStyles.done : current ? Colors.white : TimelineStyles.pending,
                  borderWidth: current ? TimelineStyles.currentRing : 0,
                  borderColor: TimelineStyles.done,
                }}>
                {done ? <Icon name="check" size={12} color={Colors.white} strokeWidth={3} /> : null}
              </View>
              {!last ? (
                <View style={{ flex: 1, width: line, marginVertical: 2, backgroundColor: nextDone ? TimelineStyles.done : TimelineStyles.pending }} />
              ) : null}
            </View>
            <View style={{ flex: 1, paddingBottom: last ? 0 : 16, gap: 2 }}>
              <AppText variant="bodyStrong" color={done || current ? 'text' : 'textFaint'}>
                {step.label}
              </AppText>
              {step.reachedAt ? (
                <AppText variant="caption" style={{ fontSize: 11 }}>
                  {formatTimeVN(step.reachedAt)}
                </AppText>
              ) : current && currentHint ? (
                <AppText variant="caption" color="primaryDark" style={{ fontSize: 11 }}>
                  {currentHint}
                </AppText>
              ) : null}
            </View>
          </View>
        );
      })}
    </Card>
  );
}
