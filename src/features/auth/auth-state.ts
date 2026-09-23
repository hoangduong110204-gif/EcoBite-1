import type { Area, AuthProfile } from '@/types';

/**
 * Mock authentication session state (session-level only: it survives
 * navigation but not an app reload; no AsyncStorage, no backend).
 *
 * Stages a customer moves through (see `getAuthStage`):
 *   unauthenticated → otp_pending → authenticated → profile_created → location_selected
 * A returning customer jumps straight to `authenticated` (or further) on login.
 */
export type AuthStatus = 'unauthenticated' | 'otp_pending' | 'authenticated';

export type AuthStage =
  | 'unauthenticated'
  | 'otp_pending'
  | 'authenticated'
  | 'profile_created'
  | 'location_selected';

export interface AuthAccountInfo {
  id: string;
  phone: string;
  email: string;
}

export interface AuthState {
  status: AuthStatus;
  /** True once the customer finished (or skipped) the onboarding slides this session. */
  hasSeenOnboarding: boolean;
  /** Registration credentials waiting for their OTP. */
  pendingRegistration: { phone: string; email: string } | null;
  /** The signed-in account (set once authenticated). */
  account: AuthAccountInfo | null;
  /** Display name; `null` until Create Profile is completed. */
  name: string | null;
  /** Selected area; `null` until Select Location is completed. Read by Home / discovery. */
  area: Area | null;
}

export type AuthEvent =
  | { type: 'onboarding_completed' }
  | { type: 'registration_started'; phone: string; email: string }
  | { type: 'otp_verified'; account: AuthAccountInfo }
  | { type: 'login_succeeded'; account: AuthAccountInfo; name: string | null; area: Area | null }
  | { type: 'profile_created'; name: string }
  | { type: 'profile_updated'; name: string }
  | { type: 'area_selected'; area: Area }
  | { type: 'signed_out' };

export const initialAuthState: AuthState = {
  status: 'unauthenticated',
  hasSeenOnboarding: false,
  pendingRegistration: null,
  account: null,
  name: null,
  area: null,
};

/** Pure transition function. Events that do not apply to the current status are ignored. */
export const authReducer = (state: AuthState, event: AuthEvent): AuthState => {
  switch (event.type) {
    case 'onboarding_completed':
      return { ...state, hasSeenOnboarding: true };
    case 'registration_started':
      if (state.status === 'authenticated') return state;
      return {
        ...state,
        status: 'otp_pending',
        pendingRegistration: { phone: event.phone, email: event.email },
      };
    case 'otp_verified':
      if (state.status !== 'otp_pending') return state;
      return {
        ...state,
        status: 'authenticated',
        pendingRegistration: null,
        account: event.account,
        name: null,
        area: null,
      };
    case 'login_succeeded':
      return {
        ...state,
        status: 'authenticated',
        pendingRegistration: null,
        account: event.account,
        name: event.name && event.name.trim().length > 0 ? event.name : null,
        area: event.area,
        hasSeenOnboarding: true,
      };
    case 'profile_created':
      if (state.status !== 'authenticated') return state;
      return { ...state, name: event.name };
    case 'profile_updated':
      // Edit Profile: only a fully signed-in customer (name already set) can rename.
      if (state.status !== 'authenticated' || state.name === null) return state;
      return { ...state, name: event.name };
    case 'area_selected':
      if (state.status !== 'authenticated' || state.name === null) return state;
      return { ...state, area: event.area };
    case 'signed_out':
      return { ...initialAuthState, hasSeenOnboarding: true };
  }
};

export const getAuthStage = (state: AuthState): AuthStage => {
  if (state.status === 'unauthenticated') return 'unauthenticated';
  if (state.status === 'otp_pending') return 'otp_pending';
  if (state.name === null) return 'authenticated';
  return state.area === null ? 'profile_created' : 'location_selected';
};

/** Profile of the signed-in customer, or `null` before Create Profile is done. */
export const getAuthProfile = (state: AuthState): AuthProfile | null =>
  state.account && state.name !== null
    ? { id: state.account.id, name: state.name, phone: state.account.phone, email: state.account.email }
    : null;
