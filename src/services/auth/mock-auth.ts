import { OTP_RESEND_SECONDS } from '@/constants/policy';
import { DEMO_OTP, DEMO_PASSWORD, mockUsers } from '@/data/mock';
import { createId, delay } from '@/utils/async';
import { normalizePhone } from '@/utils/auth-validation';

import type { AuthAccount, AuthService } from './types';

interface StoredAccount extends AuthAccount {
  password: string;
}

const accounts = new Map<string, StoredAccount>(
  mockUsers.map((u) => [
    u.id,
    { id: u.id, phone: normalizePhone(u.phone), email: u.email.toLowerCase(), name: u.name, areaId: null, password: DEMO_PASSWORD },
  ]),
);

/** Registrations waiting for their OTP, keyed by normalised phone. */
const pending = new Map<string, { email: string; password: string }>();

const publicAccount = ({ password: _password, ...account }: StoredAccount): AuthAccount => account;

const findByIdentifier = (identifier: string): StoredAccount | undefined => {
  const trimmed = identifier.trim();
  const phone = normalizePhone(trimmed);
  return [...accounts.values()].find(
    (a) => a.email === trimmed.toLowerCase() || (phone.length > 0 && a.phone === phone),
  );
};

const requireAccount = (id: string): StoredAccount => {
  const account = accounts.get(id);
  if (!account) throw new Error(`Account not found: ${id}`);
  return account;
};

/** In-memory auth. The OTP is always `DEMO_OTP`; see `data/mock/auth.ts`. */
export const mockAuthService: AuthService = {
  demoHints: { otp: DEMO_OTP, email: mockUsers[0].email, password: DEMO_PASSWORD },

  async register({ phone, email, password }) {
    await delay(350);
    const normalized = normalizePhone(phone);
    const lowerEmail = email.trim().toLowerCase();
    if ([...accounts.values()].some((a) => a.phone === normalized)) return { ok: false, error: 'phone_taken' };
    if ([...accounts.values()].some((a) => a.email === lowerEmail)) return { ok: false, error: 'email_taken' };
    pending.set(normalized, { email: lowerEmail, password });
    return { ok: true };
  },

  async sendOtp() {
    await delay(250);
    return { resendAfterSeconds: OTP_RESEND_SECONDS };
  },

  async verifyOtp(phone, code) {
    await delay(350);
    const normalized = normalizePhone(phone);
    const registration = pending.get(normalized);
    if (!registration || code !== DEMO_OTP) return { ok: false };
    pending.delete(normalized);
    const account: StoredAccount = {
      id: createId('usr'),
      phone: normalized,
      email: registration.email,
      name: '',
      areaId: null,
      password: registration.password,
    };
    accounts.set(account.id, account);
    return { ok: true, account: publicAccount(account) };
  },

  async login(identifier, password) {
    await delay(400);
    const account = findByIdentifier(identifier);
    if (!account || account.password !== password) return { ok: false };
    return { ok: true, account: publicAccount(account) };
  },

  async updateName(accountId, name) {
    await delay(250);
    const account = requireAccount(accountId);
    account.name = name.trim();
    return publicAccount(account);
  },

  async saveArea(accountId, areaId) {
    await delay(200);
    const account = requireAccount(accountId);
    account.areaId = areaId;
    return publicAccount(account);
  },
};
