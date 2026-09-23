import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AppText, Badge, BottomActionBar, Button, Input, Screen } from '@/components/common';
import { Colors, Typography } from '@/constants';
import { createProfile, useAuth, useAuthGuard } from '@/features/auth';
import { formatPhone } from '@/utils/format';

/**
 * 03 Create Profile. The reference has no dedicated screen; the layout follows
 * "Thông tin cá nhân" (10.2): avatar with initial, name field, verified phone
 * and email. Only the name is editable; phone and email come from Register.
 */
export default function CreateProfileScreen() {
  const router = useRouter();
  const allowed = useAuthGuard('create-profile');
  const { account } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setError(undefined);
    setSaving(true);
    const result = await createProfile({ name });
    setSaving(false);
    if (result.ok) router.replace(result.route);
    else setError(result.message);
  };

  if (!allowed || !account) return null;
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <Screen
      padded={false}
      contentStyle={{ paddingHorizontal: 20, paddingTop: 28, gap: 18 }}
      footer={
        <BottomActionBar>
          <Button label="Tiếp tục" loading={saving} disabled={name.trim().length < 2} onPress={submit} />
        </BottomActionBar>
      }>
      <View style={{ gap: 6 }}>
        <AppText variant="title">Tạo hồ sơ của bạn</AppText>
        <AppText variant="muted">Cho EcoBite biết tên bạn để quán gọi khi bạn tới lấy túi.</AppText>
      </View>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.mint, alignItems: 'center', justifyContent: 'center' }}>
          <AppText style={[Typography.display, { fontSize: 30, color: Colors.primaryDark }]}>{initial || 'E'}</AppText>
        </View>
      </View>
      <View style={{ gap: 13 }}>
        <Input
          label="Họ và tên"
          icon="account"
          value={name}
          onChangeText={(v) => {
            setName(v);
            if (error) setError(undefined);
          }}
          error={error}
          autoCapitalize="words"
          placeholder="Nguyễn Văn A"
          autoFocus
        />
        <Input
          label="Số điện thoại"
          icon="phone"
          value={formatPhone(account.phone)}
          editable={false}
          disabled
          right={<Badge label="Đã xác thực" tone="green" />}
        />
        <Input label="Email" icon="mail" value={account.email} editable={false} disabled />
      </View>
    </Screen>
  );
}
