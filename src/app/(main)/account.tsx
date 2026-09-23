import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AccountImpactCard, ProfileHeader } from '@/components/account';
import { AppText, Button, Card, ConfirmDialog, ErrorState, Header, ListRow, Screen } from '@/components/common';
import { Spacing } from '@/constants';
import { getInitial, signOut, useAccount } from '@/features/account';
import { formatKg, formatPhone } from '@/utils/format';

/**
 * 10.1 Account (reference): profile header, impact from the customer's completed
 * orders (`utils/impact`), the way to Orders and Edit Profile, and Logout. The
 * profile comes from the session auth state. Logout clears the session, the cart
 * and the checkout / payment state, then returns to the auth flow. Screens the
 * reference lists here that are not part of the approved flow (saved restaurants,
 * wallet, promo codes, notifications, settings, help, legal) are not built.
 */
export default function AccountScreen() {
  const router = useRouter();
  const { profile, area, memberSince, summary, status, reload } = useAccount();
  const [confirming, setConfirming] = useState(false);
  const header = <Header title="Tài khoản" />;

  if (!profile) {
    return (
      <Screen header={header}>
        <ErrorState title="Chưa có hồ sơ" message="Hãy hoàn tất hồ sơ để dùng tài khoản." primaryAction={{ label: 'Tải lại', onPress: reload }} />
      </Screen>
    );
  }

  const logout = () => {
    setConfirming(false);
    router.replace(signOut());
  };

  return (
    <>
      <Screen header={header}>
        <View style={{ gap: Spacing.md, paddingBottom: Spacing.xl }}>
          <ProfileHeader
            name={profile.name}
            initial={getInitial(profile.name)}
            detail={formatPhone(profile.phone)}
            memberSince={memberSince}
            onEdit={() => router.push('/account/edit')}
          />
          <AccountImpactCard
            stats={[
              { value: String(summary.bags), label: 'túi đã cứu' },
              { value: formatKg(summary.foodKg), label: 'thức ăn' },
              { value: formatKg(summary.co2Kg), label: 'CO₂ tránh được' },
            ]}
          />
          <Card style={{ paddingVertical: 2 }}>
            <ListRow
              icon="orders"
              title="Đơn hàng của tôi"
              subtitle={status === 'ready' && summary.activeCount > 0 ? `${summary.activeCount} đơn đang xử lý` : undefined}
              trailing={status === 'ready' ? <AppText variant="rowTitle">{summary.orderCount}</AppText> : undefined}
              onPress={() => router.navigate('/orders')}
            />
            <ListRow icon="account" title="Thông tin cá nhân" subtitle={profile.email} divider onPress={() => router.push('/account/edit')} />
            <ListRow icon="pin" title="Khu vực mặc định" subtitle={area ? `${area.name}, ${area.city}` : 'Chưa chọn'} divider />
          </Card>
          <Button label="Đăng xuất" variant="destructive" onPress={() => setConfirming(true)} />
          <AppText variant="caption" style={{ textAlign: 'center' }}>
            EcoBite · phiên bản nghiên cứu 0.1
          </AppText>
        </View>
      </Screen>
      <ConfirmDialog
        visible={confirming}
        tone="primary"
        icon="account"
        title="Đăng xuất khỏi EcoBite?"
        message={
          summary.activeCount > 0
            ? `Bạn đang có ${summary.activeCount} đơn chưa nhận. Đơn vẫn được giữ và bạn có thể đăng nhập lại bất cứ lúc nào để mở mã QR. Giỏ hàng hiện tại sẽ được xoá.`
            : 'Giỏ hàng hiện tại sẽ được xoá. Bạn có thể đăng nhập lại bất cứ lúc nào.'
        }
        confirmLabel="Đăng xuất"
        cancelLabel="Ở lại"
        onConfirm={logout}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
