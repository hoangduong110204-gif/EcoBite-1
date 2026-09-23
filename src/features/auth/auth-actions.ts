import { authService } from '@/services/auth';
import { api } from '@/services/api';
import {
  AUTH_MESSAGES,
  isValidEmail,
  isValidIdentifier,
  isValidName,
  isValidOtp,
  isValidPassword,
  isValidPhone,
  normalizePhone,
} from '@/utils/auth-validation';

import { resolveAuthRoute, type AuthRoute } from './auth-routing';
import { dispatchAuth, getAuthState } from './auth-store';

export type AuthErrorField =
  | 'identifier'
  | 'phone'
  | 'email'
  | 'password'
  | 'terms'
  | 'name'
  | 'otp'
  | 'area'
  | 'form';

export type AuthResult =
  | { ok: true; route: AuthRoute }
  | { ok: false; field: AuthErrorField; message: string };

const fail = (field: AuthErrorField, message: string): AuthResult => ({ ok: false, field, message });
const next = (): AuthResult => ({ ok: true, route: resolveAuthRoute(getAuthState()) });

/**
 * Orchestration of the mock auth flow. Every function validates input (pure
 * rules in `utils/auth-validation`), calls the mock `authService`, updates the
 * session store and returns where to go next. UI components only call these.
 */

/** Demo credentials for the __DEV__ hint on Login / OTP. */
export const getDemoHints = () => authService.demoHints;

/** Onboarding finished or skipped → Welcome. */
export const completeOnboarding = (): AuthResult => {
  dispatchAuth({ type: 'onboarding_completed' });
  return next();
};

/** Register (1.7): reserve credentials, "send" the OTP → OTP screen. */
export async function startRegistration(input: {
  phone: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
}): Promise<AuthResult> {
  if (!isValidPhone(input.phone)) return fail('phone', AUTH_MESSAGES.phoneInvalid);
  if (!isValidEmail(input.email)) return fail('email', AUTH_MESSAGES.emailInvalid);
  if (!isValidPassword(input.password)) return fail('password', AUTH_MESSAGES.passwordWeak);
  if (!input.acceptedTerms) return fail('terms', AUTH_MESSAGES.termsRequired);

  const registered = await authService.register({
    phone: input.phone,
    email: input.email,
    password: input.password,
  });
  if (!registered.ok) {
    return registered.error === 'phone_taken'
      ? fail('phone', AUTH_MESSAGES.phoneTaken)
      : fail('email', AUTH_MESSAGES.emailTaken);
  }
  const phone = normalizePhone(input.phone);
  await authService.sendOtp(phone);
  dispatchAuth({ type: 'registration_started', phone, email: input.email.trim().toLowerCase() });
  return next();
}

/** OTP (1.8): correct code → Create Profile; wrong code → stays on OTP. */
export async function submitOtp(code: string): Promise<AuthResult> {
  const pending = getAuthState().pendingRegistration;
  if (!pending) return fail('form', AUTH_MESSAGES.otpInvalid);
  if (!isValidOtp(code)) return fail('otp', AUTH_MESSAGES.otpIncomplete);
  const result = await authService.verifyOtp(pending.phone, code);
  if (!result.ok) return fail('otp', AUTH_MESSAGES.otpInvalid);
  dispatchAuth({
    type: 'otp_verified',
    account: { id: result.account.id, phone: result.account.phone, email: result.account.email },
  });
  return next();
}

/** "Gửi lại mã": asks for a new OTP; the caller restarts its countdown. */
export async function resendOtp(): Promise<{ ok: boolean; resendAfterSeconds: number }> {
  const pending = getAuthState().pendingRegistration;
  if (!pending) return { ok: false, resendAfterSeconds: 0 };
  const { resendAfterSeconds } = await authService.sendOtp(pending.phone);
  return { ok: true, resendAfterSeconds };
}

/** Login (1.6): valid credentials → Create Profile / Location Permission / Home depending on the account. */
export async function login(input: { identifier: string; password: string }): Promise<AuthResult> {
  if (!isValidIdentifier(input.identifier)) return fail('identifier', AUTH_MESSAGES.identifierInvalid);
  if (input.password.length === 0) return fail('password', AUTH_MESSAGES.passwordRequired);
  const result = await authService.login(input.identifier, input.password);
  if (!result.ok) return fail('password', AUTH_MESSAGES.credentialsWrong);
  const { account } = result;
  const areas = account.areaId ? await api.listAreas() : [];
  dispatchAuth({
    type: 'login_succeeded',
    account: { id: account.id, phone: account.phone, email: account.email },
    name: account.name,
    area: areas.find((a) => a.id === account.areaId) ?? null,
  });
  return next();
}

/** Create Profile: stores the display name → Location Permission. */
export async function createProfile(input: { name: string }): Promise<AuthResult> {
  const account = getAuthState().account;
  if (!account) return fail('form', AUTH_MESSAGES.nameRequired);
  if (input.name.trim().length === 0) return fail('name', AUTH_MESSAGES.nameRequired);
  if (!isValidName(input.name)) return fail('name', AUTH_MESSAGES.nameTooShort);
  const saved = await authService.updateName(account.id, input.name);
  dispatchAuth({ type: 'profile_created', name: saved.name });
  return next();
}

/** Select Location: stores the area in the session → Home. */
export async function selectArea(areaId: string): Promise<AuthResult> {
  const account = getAuthState().account;
  const area = (await api.listAreas()).find((a) => a.id === areaId);
  if (!account || !area) return fail('area', AUTH_MESSAGES.areaRequired);
  await authService.saveArea(account.id, area.id);
  dispatchAuth({ type: 'area_selected', area });
  return next();
}
