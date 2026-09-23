import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { AppText, Button } from '@/components/common';
import { ComponentGallery } from './ComponentGallery';
import { Colors, Radius, Spacing } from '@/constants';
import {
  devAdvanceOrder,
  devCancelOrder,
  devExpireOrder,
  devSetPaymentScenario,
} from '@/features/dev';
import { api } from '@/services/api';
import type { Order } from '@/types';
import { canCancel, canExpire, isTerminal } from '@/utils/order-lifecycle';

/**
 * Development-only control panel (D-17). Mounted from the root layout behind
 * `__DEV__`. Every button calls an existing mock service through
 * `features/dev`; it is NOT the old HTML demo panel and never ships in release
 * builds.
 */
export function DevMenu() {
  const [open, setOpen] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => setOrders(await api.listOrders()), []);

  const run = async (label: string, action: () => Promise<unknown>) => {
    try {
      await action();
      setMessage(label);
    } catch (error) {
      setMessage(`${label} failed: ${(error as Error).message}`);
    }
    await refresh();
  };

  return (
    <>
      <Pressable
        accessibilityLabel="Open dev menu"
        onPress={() => {
          setOpen(true);
          void refresh();
        }}
        style={{
          position: 'absolute',
          left: Spacing.sm,
          bottom: 120,
          zIndex: 100,
          backgroundColor: Colors.text,
          borderRadius: Radius.pill,
          paddingHorizontal: Spacing.s10,
          paddingVertical: Spacing.xs,
          opacity: 0.75,
        }}>
        <AppText variant="badge" color="white">
          DEV
        </AppText>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: Colors.paper, padding: Spacing.lg, paddingTop: 56 }}>
          <AppText variant="title">Dev controls</AppText>
          <AppText color="textMuted">
            Calls the existing mock services. Development builds only.
          </AppText>

          <AppText variant="cardTitle" style={{ marginTop: Spacing.lg }}>
            Next payment outcome
          </AppText>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
            {(['success', 'failed', 'expired'] as const).map((outcome) => (
              <Button
                key={outcome}
                size="sm"
                variant="soft"
                label={outcome}
                onPress={() => {
                  devSetPaymentScenario(outcome);
                  setMessage(`Next payments resolve to: ${outcome}`);
                }}
              />
            ))}
          </View>

          <AppText variant="cardTitle" style={{ marginTop: Spacing.lg }}>
            Orders
          </AppText>
          <ScrollView style={{ marginTop: Spacing.sm }}>
            {orders.map((order) => (
              <View
                key={order.id}
                style={{
                  gap: Spacing.sm,
                  paddingVertical: Spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.divider,
                }}>
                <AppText variant="rowTitle">
                  {order.orderCode} · {order.status}
                </AppText>
                <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                  <Button
                    size="sm"
                    label="Advance"
                    disabled={isTerminal(order)}
                    onPress={() => run(`Advanced ${order.orderCode}`, () => devAdvanceOrder(order.id))}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    label="Expire"
                    disabled={!canExpire(order)}
                    onPress={() => run(`Expired ${order.orderCode}`, () => devExpireOrder(order.id))}
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    label="Cancel"
                    disabled={!canCancel(order)}
                    onPress={() => run(`Cancelled ${order.orderCode}`, () => devCancelOrder(order.id))}
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          {message ? (
            <AppText color="primaryDark" style={{ marginVertical: Spacing.sm }}>
              {message}
            </AppText>
          ) : null}
          <Button label="Component gallery" variant="soft" onPress={() => setGallery(true)} style={{ marginBottom: Spacing.sm }} />
          <Button label="Close" variant="secondary" onPress={() => setOpen(false)} />
        </View>
      </Modal>

      <Modal visible={gallery} animationType="slide" onRequestClose={() => setGallery(false)}>
        <ComponentGallery onClose={() => setGallery(false)} />
      </Modal>
    </>
  );
}
