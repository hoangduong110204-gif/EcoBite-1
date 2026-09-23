import { useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { AiOrb, ChatBubble } from '@/components/ai';
import { BrandMark, LocationIllustration, OnboardingIllustration, PagerDots } from '@/components/auth';
import { CartItem, CartRestaurantSection, CartSummary, PromoCodeRow } from '@/components/cart';
import {
  AppText,
  Badge,
  BottomActionBar,
  BottomSheet,
  BottomTabBar,
  Button,
  Card,
  Checkbox,
  Chip,
  ConfirmDialog,
  Divider,
  EmptyState,
  ErrorState,
  Header,
  IconTile,
  Input,
  ListRow,
  LoadingState,
  OtpInput,
  PriceRow,
  QuantityStepper,
  Skeleton,
  StatusBadge,
} from '@/components/common';
import { FoodBagCard, FoodBagQuantity } from '@/components/food-bag';
import {
  OrderCard,
  OrderPriceBreakdown,
  OrderStatusBanner,
  OrderStatusTimeline,
  PaymentMethodRow,
  PaymentQrCard,
  PickupInfo,
  PickupQrCard,
  PickupTimePicker,
} from '@/components/order';
import { RestaurantCard, RestaurantCategoryChip, RestaurantHeader } from '@/components/restaurant';
import { Colors, ORDER_STATUS_SEQUENCE, Spacing, type TabKey } from '@/constants';
import type { CartItem as CartItemModel, FoodBag, Order, PaymentMethod, PaymentQr, PickupQr } from '@/types';

/**
 * Development-only visual check of every shared UI component (U1.1). Reached
 * from `DevMenu` (`__DEV__` only). Sample values are inline on purpose: the
 * real screens get their data from services.
 */
const bag: FoodBag = {
  id: 'g1',
  restaurantId: 'r',
  name: 'Túi cơm chiều',
  summary: 'Cơm + 2 món mặn + canh',
  originalPrice: 56000,
  price: 45000,
  left: 3,
  pickupWindow: { label: '18:00 – 20:00', start: '18:00', end: '20:00' },
  art: 'rice',
  contents: [],
  allergens: { peanut: false, seafood: false, gluten: false, dairy: false, egg: false, spicy: false },
};
const cartItem: CartItemModel = {
  foodBagId: 'g1',
  restaurantId: 'r',
  name: bag.name,
  quantity: 2,
  unitPrice: 45000,
  originalPrice: 56000,
  ownBox: true,
};
const money = { subtotal: 90000, bagSavings: 22000, promoDiscount: 10000, ownBoxDiscount: 4000, total: 76000 };
const history: Order['statusHistory'] = {
  placed: '2026-09-14T17:36:00+07:00',
  paid: '2026-09-14T17:38:00+07:00',
  preparing: '2026-09-14T17:52:00+07:00',
  ready: '2026-09-14T18:24:00+07:00',
};
const payQr: PaymentQr = { kind: 'payment', payload: 'MOCK-PAYMENT|gallery|76000', amount: 76000, reference: 'EB2409017', expiresAt: '2026-09-14T17:46:00+07:00' };
const pickQr: PickupQr = { kind: 'pickup', orderId: 'o', orderCode: 'EB-2409-017', token: 'pk_gallery_token', issuedAt: '2026-09-14T17:38:00+07:00', verifiedAt: null };
const methods: PaymentMethod[] = [
  { id: 'bank_qr', label: 'Chuyển khoản QR ngân hàng', description: 'App tự nhận khi tiền về · không phí', enabled: true, badge: 'Khuyên dùng' },
  { id: 'e_wallet', label: 'Ví điện tử', description: 'MoMo, ZaloPay, VNPay', enabled: false, badge: 'Sắp có' },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: Spacing.md, marginTop: Spacing.xl }}>
      <AppText variant="section" color="primaryDark">
        {title}
      </AppText>
      {children}
    </View>
  );
}

export function ComponentGallery({ onClose }: { onClose: () => void }) {
  const [qty, setQty] = useState(2);
  const [tab, setTab] = useState<TabKey>('home');
  const [chip, setChip] = useState('cat_rice');
  const [slot, setSlot] = useState(1);
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [otp, setOtp] = useState('12');
  const [checked, setChecked] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.paper }}>
      <View style={{ paddingTop: 44 }}>
        <Header title="Component gallery (dev)" onBack={onClose} />
      </View>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 140 }}>
        <Section title="Typography">
          <AppText variant="display">Display 32</AppText>
          <AppText variant="title">Title 23</AppText>
          <AppText variant="heading">Heading 17</AppText>
          <AppText variant="body">Body 13 / 600</AppText>
          <AppText variant="muted">Muted 13 / 600</AppText>
          <AppText variant="caption">Caption 11.5 / 600</AppText>
          <AppText variant="price">45.000đ</AppText>
          <AppText variant="priceStrike">56.000đ</AppText>
          <AppText variant="status">STATUS</AppText>
        </Section>

        <Section title="Buttons">
          <Button label="Primary" />
          <Button label="Secondary" variant="secondary" />
          <Button label="Soft" variant="soft" icon="qr" />
          <Button label="Destructive" variant="destructive" />
          <Button label="Danger" variant="danger" />
          <Button label="Disabled" disabled />
          <Button label="Loading" loading />
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <Button label="Small" size="sm" />
            <Button label="Tiny" size="xs" variant="soft" />
          </View>
        </Section>

        <Section title="Inputs">
          <Input label="Email" placeholder="ten@email.com" icon="mail" />
          <Input label="Mật khẩu" placeholder="••••••••" password icon="lock" />
          <Input label="Lỗi" defaultValue="abc" error="Email không hợp lệ" />
          <Input label="Vô hiệu" defaultValue="Không sửa được" disabled />
        </Section>

        <Section title="Cards, badges, chips">
          <Card><AppText>Card base (radius 18)</AppText></Card>
          <Card variant="mint"><AppText color="primaryText">Info card (mint)</AppText></Card>
          <Card variant="outline"><AppText>Outline card</AppText></Card>
          <Card variant="warning"><AppText style={{ color: Colors.warningNote }}>Warning note</AppText></Card>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' }}>
            <Badge label="Còn 3" tone="green" />
            <Badge label="Còn 1" tone="amber" />
            <Badge label="Sắp hết giờ" tone="red" />
            <Badge label="Đã nhận hàng" tone="gray" />
            <Badge label="-20%" tone="solid" />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
            {ORDER_STATUS_SEQUENCE.map((s) => <StatusBadge key={s} status={s} />)}
            <StatusBadge status="cancelled" />
            <StatusBadge status="expired" />
          </View>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' }}>
            {['cat_all', 'cat_rice', 'cat_noodle'].map((id, i) => (
              <RestaurantCategoryChip key={id} category={{ id, name: ['Tất cả', 'Cơm', 'Mì'][i] }} selected={chip === id} onPress={setChip} />
            ))}
            <Chip label="Soft" soft />
            <Chip label="Compact" compact />
          </View>
          <Divider />
          <IconTile name="pin" />
        </Section>

        <Section title="Restaurant / food bag">
          <RestaurantCard name="Bếp Nhà Lá" art="rice" rating={4.8} distanceKm={1.2} price={45000} originalPrice={56000} />
          <RestaurantHeader name="Bếp Nhà Lá" rating={4.8} ratingCount={214} distanceKm={1.2} subtitle="Cơm, đồ chay" availabilityLabel="Còn 5 túi hôm nay" />
          <FoodBagCard bag={bag} />
          <FoodBagCard bag={{ ...bag, name: 'Túi sushi', art: 'sushi', left: 0 }} />
          <FoodBagQuantity value={qty} left={3} onChange={setQty} />
          <QuantityStepper value={qty} max={3} onChange={setQty} />
        </Section>

        <Section title="Cart">
          <CartRestaurantSection restaurantName="Bếp Nhà Lá" pickupLabel="18:30 – 19:00">
            <CartItem item={cartItem} art="rice" summary={bag.summary} maxQuantity={3} onChangeQuantity={setQty} />
          </CartRestaurantSection>
          <CartRestaurantSection restaurantName="Chè Sen Bà Tâm" pickupLabel={null}>
            <CartItem item={{ ...cartItem, name: 'Túi tráng miệng', unitPrice: 25000, originalPrice: 30000, quantity: 1, ownBox: false }} art="dessert" onChangeQuantity={() => undefined} />
          </CartRestaurantSection>
          <PromoCodeRow appliedCode={null} onPress={() => undefined} />
          <PromoCodeRow appliedCode="ECOBITE10K" onPress={() => undefined} />
          <CartSummary bagCount={3} subtotal={115000} savings={27000} />
          <PriceRow label="Tạm tính" amount={90000} />
          <PriceRow label="Mang hộp riêng ×2" amount={4000} discount />
          <PriceRow label="Tổng thanh toán" amount={76000} total />
        </Section>

        <Section title="Order">
          <OrderStatusBanner title="Túi đã sẵn sàng" hint="Tới quán trước 19:00 để nhận" countdown="36:12" />
          <OrderStatusTimeline status="ready" history={history} currentHint="Chờ nhân viên quét" />
          <OrderPriceBreakdown money={money} promoCode="ECOBITE10K" ownBoxCount={2} />
          <PickupInfo restaurantName="Bếp Nhà Lá" address="Số 24 Nguyễn Văn Cừ" distanceKm={1.2} walkMinutes={15} onDirections={() => undefined} />
          <PickupTimePicker
            times={[{ id: 't1', label: '17:30' }, { id: 't2', label: '18:00' }, { id: 't3', label: '18:30' }, { id: 't4', label: '19:00', disabled: true }, { id: 't5', label: '19:30' }, { id: 't6', label: '20:00' }]}
            selectedId={slot === 0 ? 't2' : slot === 1 ? 't3' : null}
            onSelect={(id) => setSlot(id === 't2' ? 0 : 1)}
          />
          {methods.map((m, i) => <PaymentMethodRow key={m.id} method={m} selected={i === 0} />)}
          <OrderCard
            order={{ orderCode: 'EB-2409-017', status: 'ready', items: [{ foodBagId: 'g1', name: 'Túi cơm chiều', quantity: 2, unitPrice: 45000, originalPrice: 56000, ownBox: true }], money, pickupSlot: { label: '18:30 – 19:00', date: '2026-09-14', start: '18:30', end: '19:00' } }}
            restaurantName="Bếp Nhà Lá"
          />
          <PaymentQrCard qr={payQr} />
          <PickupQrCard qr={pickQr} />
        </Section>

        <Section title="States, sheets, dialogs">
          <Skeleton height={16} />
          <Skeleton height={70} radius={14} />
          <View style={{ height: 160 }}><LoadingState message="Đang giữ chỗ túi cho bạn…" /></View>
          <View style={{ height: 330 }}>
            <EmptyState title="Giỏ hàng đang trống" message="Còn 43 túi đang chờ được cứu quanh Hà Nội hôm nay." primaryAction={{ label: 'Khám phá nhà hàng gần bạn', onPress: () => undefined }} secondaryAction={{ label: 'Hỏi AI xem nên ăn gì', icon: 'leaf', onPress: () => undefined }} />
          </View>
          <View style={{ height: 330 }}>
            <ErrorState title="Chưa thanh toán được" message="Tiền chưa bị trừ khỏi tài khoản của bạn." primaryAction={{ label: 'Thử thanh toán lại', onPress: () => undefined }} />
          </View>
          <Button label="Open bottom sheet" variant="secondary" onPress={() => setSheet(true)} />
          <Button label="Open confirm dialog" variant="secondary" onPress={() => setDialog(true)} />
        </Section>

        <Section title="Auth / onboarding (U1.2)">
          <View style={{ flexDirection: 'row', gap: Spacing.md }}>
            <BrandMark tileSize={104} tone="white" />
            <BrandMark tileSize={90} tone="mint" />
          </View>
          <OtpInput value={otp} onChangeText={setOtp} />
          <OtpInput value="1234" onChangeText={() => undefined} error="Mã không đúng. Vui lòng thử lại." />
          <View style={{ flexDirection: 'row', gap: Spacing.md, alignItems: 'center' }}>
            <Checkbox checked={checked} onChange={setChecked} />
            <Checkbox checked={false} onChange={() => undefined} error />
            <Checkbox checked size={22} onChange={() => undefined} />
          </View>
          <Card>
            <ListRow icon="pin" title="Cầu Giấy" subtitle="6 nhà hàng" selected onPress={() => undefined} />
            <ListRow icon="pin" title="Đống Đa" subtitle="6 nhà hàng" divider onPress={() => undefined} />
            <ListRow icon="pin" title="Ba Đình" subtitle="6 nhà hàng" divider busy />
          </Card>
          <PagerDots count={3} index={1} />
          <View style={{ alignItems: 'center', gap: Spacing.md }}>
            <OnboardingIllustration art="value" />
            <OnboardingIllustration art="impact" />
            <OnboardingIllustration art="ai" />
            <LocationIllustration />
          </View>
        </Section>

        <Section title="AI (visual only)">
          <ChatBubble message={{ role: 'user', text: 'Hôm nay tôi muốn ăn cay và rẻ' }} />
          <ChatBubble message={{ role: 'assistant', text: 'Dưới đây là một số món phù hợp với bạn:' }} />
        </Section>

        <Section title="Bottom tab bar (Home · Orders · Cart · Account)">
          <BottomTabBar activeKey={tab} cartCount={3} onSelect={setTab} />
        </Section>
        <Section title="Bottom action bar">
          <BottomActionBar>
            <PriceRow label="Tổng" amount={86000} />
            <Button label="Thêm 2 túi · 86.000đ" />
          </BottomActionBar>
        </Section>
      </ScrollView>
      <AiOrb onPress={() => undefined} />
      <BottomSheet visible={sheet} onClose={() => setSheet(false)}>
        <FoodBagQuantity value={qty} left={3} onChange={setQty} />
        <Button label="Thêm vào giỏ" onPress={() => setSheet(false)} />
      </BottomSheet>
      <ConfirmDialog
        visible={dialog}
        title="Xoá túi khỏi giỏ?"
        message="“Túi cơm chiều” sẽ bị bỏ khỏi giỏ hàng. Chỗ này có thể bị khách khác đặt mất."
        confirmLabel="Xoá túi"
        cancelLabel="Giữ lại"
        onConfirm={() => setDialog(false)}
        onCancel={() => setDialog(false)}
      />
    </View>
  );
}
