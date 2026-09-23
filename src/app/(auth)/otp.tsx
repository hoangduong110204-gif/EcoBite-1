import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AppText, Button, Header, IconTile, OtpInput, Screen } from '@/components/common';
import { OTP_RESEND_SECONDS } from '@/constants';
import { REGISTER_ROUTE, getDemoHints, resendOtp, submitOtp, useAuth, useAuthGuard } from '@/features/auth';
import { useBack, useCountdown } from '@/hooks';
import { formatCountdown, formatPhone } from '@/utils/format';

/**
 * 03 OTP (reference 1.8): 4-digit code, 60 s resend countdown, verify.
 * The demo OTP is documented in data/mock/auth.ts (shown as a hint in __DEV__).
 */
export default function OtpScreen() {
  const router = useRouter();
  const goBack = useBack(REGISTER_ROUTE);
  const allowed = useAuthGuard('otp');
  const { pendingRegistration } = useAuth();
  const countdown = useCountdown(OTP_RESEND_SECONDS);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const verify = async () => {
    setError(undefined);
    setVerifying(true);
    const result = await submitOtp(code);
    setVerifying(false);
    if (result.ok) router.replace(result.route);
    else setError(result.message);
  };

  const resend = async () => {
    setResending(true);
    const result = await resendOtp();
    setResending(false);
    if (result.ok) {
      setCode('');
      setError(undefined);
      countdown.restart(result.resendAfterSeconds);
    }
  };

  if (!allowed || !pendingRegistration) return null;
  const hints = __DEV__ ? getDemoHints() : null;
  return (
    <Screen padded={false} header={<Header onBack={goBack} />} contentStyle={{ paddingHorizontal: 20, gap: 22 }}>
      <View style={{ gap: 8 }}>
        <IconTile name="phone" size="xl" iconSize={26} />
        <AppText variant="title" style={{ marginTop: 6 }}>
          Nhập mã xác thực
        </AppText>
        <AppText variant="muted">
          Chúng tôi vừa gửi mã 4 số tới{'\n'}
          <AppText variant="bodyStrong">{formatPhone(pendingRegistration.phone)}</AppText>
        </AppText>
      </View>
      <OtpInput
        value={code}
        onChangeText={(next) => {
          setCode(next);
          if (error) setError(undefined);
        }}
        error={error}
        disabled={verifying}
        autoFocus
      />
      <AppText variant="caption" style={{ textAlign: 'center' }}>
        {countdown.isDone ? (
          'Bạn có thể yêu cầu gửi lại mã.'
        ) : (
          <>
            Chưa nhận được mã? Gửi lại sau{' '}
            <AppText variant="label" color="primaryDark" style={{ fontSize: 11.5 }}>
              {formatCountdown(countdown.remaining)}
            </AppText>
          </>
        )}
      </AppText>
      <View style={{ gap: 10 }}>
        <Button label="Xác nhận" loading={verifying} disabled={code.length < 4} onPress={verify} />
        <Button
          label="Gửi lại mã"
          variant={countdown.isDone ? 'secondary' : 'neutral'}
          disabled={!countdown.isDone || verifying}
          loading={resending}
          onPress={resend}
        />
      </View>
      {hints ? (
        <AppText variant="caption" style={{ textAlign: 'center' }}>
          Mã demo (dev): {hints.otp}
        </AppText>
      ) : null}
    </Screen>
  );
}
