/** A signed-up customer as the (mock) auth backend knows it. */
export interface AuthAccount {
  id: string;
  /** Normalised phone, e.g. `0912345678`. */
  phone: string;
  email: string;
  /** Empty until the customer completes Create Profile. */
  name: string;
  /** Area chosen on Select Location, `null` until then. */
  areaId: string | null;
}

export type RegisterError = 'phone_taken' | 'email_taken';

/**
 * Authentication contract. Today: in-memory mock (no SMS provider, no
 * backend). Later: a real auth API behind the same interface.
 */
export interface AuthService {
  /** Demo credentials, shown as a hint in __DEV__ builds only. */
  readonly demoHints: { otp: string; email: string; password: string };
  /** Reserves the credentials; the account is created once the OTP is verified. */
  register(input: { phone: string; email: string; password: string }): Promise<{ ok: true } | { ok: false; error: RegisterError }>;
  /** "Sends" an OTP (nothing is sent). Returns when the customer may ask again. */
  sendOtp(phone: string): Promise<{ resendAfterSeconds: number }>;
  /** Checks the OTP and, when correct, creates the account. */
  verifyOtp(phone: string, code: string): Promise<{ ok: true; account: AuthAccount } | { ok: false }>;
  /** Email/phone + password. */
  login(identifier: string, password: string): Promise<{ ok: true; account: AuthAccount } | { ok: false }>;
  updateName(accountId: string, name: string): Promise<AuthAccount>;
  saveArea(accountId: string, areaId: string): Promise<AuthAccount>;
}
