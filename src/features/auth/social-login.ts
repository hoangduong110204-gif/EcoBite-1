/**
 * Mock-only entry points shown on Login (reference 1.6). They never touch the auth
 * session or the state machine: there is no Apple OAuth and no password-reset flow
 * in the MVP, so each one only returns the notice the screen displays.
 */
export const APPLE_LOGIN_NOTICE = 'Đăng nhập bằng Apple/iCloud chưa khả dụng trong bản demo. Bạn hãy dùng email hoặc số điện thoại nhé.';
export const FORGOT_PASSWORD_NOTICE = 'Tính năng đặt lại mật khẩu sẽ sớm có. Bản demo dùng mật khẩu mẫu ở màn hình này.';

export interface SocialLoginResult {
  ok: false;
  message: string;
}

/** Apple / iCloud button: UI-only mock, no session change, no navigation. */
export async function continueWithApple(): Promise<SocialLoginResult> {
  return { ok: false, message: APPLE_LOGIN_NOTICE };
}
