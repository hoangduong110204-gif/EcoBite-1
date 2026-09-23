import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppText, Button, Checkbox, Divider, Header, Input, Screen } from '@/components/common';
import { FORGOT_PASSWORD_NOTICE, REGISTER_ROUTE, WELCOME_ROUTE, continueWithApple, getDemoHints, login, useAuthGuard } from '@/features/auth';
import { useBack } from '@/hooks';

/**
 * 03 Login (reference 1.6). Email / phone + password against the mock auth backend.
 * "Tiếp tục bằng email" focuses the email field (the form IS the email login);
 * "Tiếp tục bằng Apple/iCloud" and "Quên mật khẩu?" are UI-only mocks that show a
 * notice: no Apple OAuth and no reset-password screen exist yet, and neither touches
 * the auth state machine. Demo credentials: see data/mock/auth.ts.
 */
export default function LoginScreen() {
  const router = useRouter();
  const goBack = useBack(WELCOME_ROUTE);
  const allowed = useAuthGuard('public');
  const identifierRef = useRef<TextInput>(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [notice, setNotice] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = identifier.trim().length > 0 && password.length > 0;

  const submit = async () => {
    setErrors({});
    setNotice(undefined);
    setSubmitting(true);
    const result = await login({ identifier, password });
    setSubmitting(false);
    if (result.ok) router.replace(result.route);
    else setErrors({ [result.field === 'identifier' ? 'identifier' : 'password']: result.message });
  };

  const apple = async () => {
    setErrors({});
    const result = await continueWithApple();
    setNotice(result.message);
  };

  if (!allowed) return null;
  const hints = __DEV__ ? getDemoHints() : null;
  return (
    <Screen padded={false} header={<Header onBack={goBack} />} contentStyle={{ paddingHorizontal: 20, gap: 20 }}>
      <View style={{ gap: 6 }}>
        <AppText variant="title">Đăng nhập</AppText>
        <AppText variant="muted">Chào bạn quay lại với EcoBite.</AppText>
      </View>
      <View style={{ gap: 14 }}>
        <Input
          inputRef={identifierRef}
          label="Email hoặc số điện thoại"
          icon="mail"
          value={identifier}
          onChangeText={setIdentifier}
          error={errors.identifier}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="ten@email.com hoặc 0912 345 678"
        />
        <Input
          label="Mật khẩu"
          icon="lock"
          password
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          placeholder="Nhập mật khẩu"
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Checkbox checked={remember} onChange={setRemember} accessibilityLabel="Ghi nhớ tôi" />
            <AppText variant="label" color="textMuted" style={{ fontSize: 12 }}>
              Ghi nhớ tôi
            </AppText>
          </View>
          <Pressable accessibilityRole="link" hitSlop={8} onPress={() => setNotice(FORGOT_PASSWORD_NOTICE)}>
            <AppText variant="label" color="primaryDark" style={{ fontSize: 12 }}>
              Quên mật khẩu?
            </AppText>
          </Pressable>
        </View>
      </View>
      <Button label="Đăng nhập" loading={submitting} disabled={!canSubmit} onPress={submit} />
      {notice ? (
        <AppText variant="caption" color="textMuted" style={{ textAlign: 'center' }}>
          {notice}
        </AppText>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Divider />
        </View>
        <AppText variant="caption" color="textMuted">
          hoặc
        </AppText>
        <View style={{ flex: 1 }}>
          <Divider />
        </View>
      </View>
      <View style={{ gap: 10 }}>
        <Button label="Tiếp tục bằng email" variant="secondary" icon="mail" onPress={() => identifierRef.current?.focus()} />
        <Button label="Tiếp tục bằng Apple/iCloud" variant="secondary" icon="apple" onPress={apple} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
        <AppText variant="caption">Chưa có tài khoản?</AppText>
        <Pressable accessibilityRole="link" onPress={() => router.replace(REGISTER_ROUTE)}>
          <AppText variant="label" color="primaryDark" style={{ fontSize: 11.5 }}>
            Đăng ký ngay
          </AppText>
        </Pressable>
      </View>
      {hints ? (
        <AppText variant="caption" style={{ textAlign: 'center' }}>
          Demo (dev): {hints.email} / {hints.password}
        </AppText>
      ) : null}
    </Screen>
  );
}
