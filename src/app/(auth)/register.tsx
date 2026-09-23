import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, Button, Checkbox, Header, Input, Screen } from '@/components/common';
import { LOGIN_ROUTE, WELCOME_ROUTE, startRegistration, useAuthGuard } from '@/features/auth';
import { useBack } from '@/hooks';
import { AUTH_MESSAGES } from '@/utils/auth-validation';

const REGISTER_FIELDS: string[] = ['phone', 'email', 'password', 'terms'];

type FieldErrors = { phone?: string; email?: string; password?: string; terms?: string };

/**
 * 03 Register (reference 1.7). The reference's "Họ và tên" field moves to the
 * Create Profile step that follows OTP, so Register only collects the account
 * credentials (phone, email, password) and the terms consent.
 */
export default function RegisterScreen() {
  const router = useRouter();
  const goBack = useBack(WELCOME_ROUTE);
  const allowed = useAuthGuard('public');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Reference 1.7: the button only lights up once the terms are ticked.
  const canSubmit = terms && phone.trim() !== '' && email.trim() !== '' && password !== '';

  const submit = async () => {
    setErrors({});
    setSubmitting(true);
    const result = await startRegistration({ phone, email, password, acceptedTerms: terms });
    setSubmitting(false);
    if (result.ok) router.push(result.route);
    else setErrors({ [REGISTER_FIELDS.includes(result.field) ? result.field : 'phone']: result.message });
  };

  if (!allowed) return null;
  return (
    <Screen padded={false} header={<Header onBack={goBack} />} contentStyle={{ paddingHorizontal: 20, gap: 18 }}>
      <View style={{ gap: 6 }}>
        <AppText variant="title">Tạo tài khoản</AppText>
        <AppText variant="muted">Chỉ mất chưa tới một phút.</AppText>
      </View>
      <View style={{ gap: 13 }}>
        <Input
          label="Số điện thoại"
          icon="phone"
          value={phone}
          onChangeText={setPhone}
          error={errors.phone}
          keyboardType="phone-pad"
          placeholder="0912 345 678"
        />
        <Input
          label="Email"
          icon="mail"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="ten@email.com"
        />
        <Input
          label="Mật khẩu"
          icon="lock"
          password
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          helper={AUTH_MESSAGES.passwordWeak}
          placeholder="Tạo mật khẩu"
        />
      </View>
      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 9 }}>
          <View style={{ marginTop: 1 }}>
            <Checkbox checked={terms} onChange={setTerms} error={!!errors.terms} accessibilityLabel="Đồng ý điều khoản" />
          </View>
          <AppText variant="caption" color="textMuted" style={{ flex: 1, lineHeight: 18 }}>
            Tôi đồng ý với{' '}
            <AppText variant="label" color="primaryDark" style={{ fontSize: 11.5 }}>
              Điều khoản sử dụng
            </AppText>{' '}
            và{' '}
            <AppText variant="label" color="primaryDark" style={{ fontSize: 11.5 }}>
              Chính sách bảo mật
            </AppText>{' '}
            của EcoBite.
          </AppText>
        </View>
        {errors.terms ? (
          <AppText variant="bodyStrong" color="danger" style={{ fontSize: 11 }}>
            {errors.terms}
          </AppText>
        ) : null}
      </View>
      <Button label="Tạo tài khoản" loading={submitting} disabled={!canSubmit} onPress={submit} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
        <AppText variant="caption">Đã có tài khoản?</AppText>
        <Pressable accessibilityRole="link" onPress={() => router.replace(LOGIN_ROUTE)}>
          <AppText variant="label" color="primaryDark" style={{ fontSize: 11.5 }}>
            Đăng nhập
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}
