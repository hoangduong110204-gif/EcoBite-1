import { getAuthStage, type AuthState } from './auth-state';

/**
 * Auth routing (decisions D-8 and D-9, U1.2).
 *
 *  - New customer: Onboarding → Welcome → Register → OTP → Create Profile →
 *    Location Permission → Select Location → Home.
 *  - First login: Location Permission → Select Location → Home.
 *  - Returning authenticated customer with a selected area: straight to Home.
 *  - Guest preview is NOT supported in the MVP: there is no guest route, and
 *    the "Xem trước không cần tài khoản" button (screen 1.5) is not rendered.
 */
export interface AuthSession {
  isAuthenticated: boolean;
  /** True once the user finished Location Permission / Select Location at least once. */
  hasCompletedLocationSetup: boolean;
}

export const HOME_ROUTE = '/home';
export const LOCATION_PERMISSION_ROUTE = '/location-permission';
export const ONBOARDING_ROUTE = '/onboarding';
export const WELCOME_ROUTE = '/welcome';
export const LOGIN_ROUTE = '/login';
export const REGISTER_ROUTE = '/register';
export const OTP_ROUTE = '/otp';
export const CREATE_PROFILE_ROUTE = '/create-profile';
export const SELECT_LOCATION_ROUTE = '/select-location';

export type AuthRoute =
  | typeof HOME_ROUTE
  | typeof LOCATION_PERMISSION_ROUTE
  | typeof ONBOARDING_ROUTE
  | typeof WELCOME_ROUTE
  | typeof OTP_ROUTE
  | typeof CREATE_PROFILE_ROUTE;

/** Where to go right after a successful login. */
export const getPostLoginRoute = (
  session: Pick<AuthSession, 'hasCompletedLocationSetup'>,
): typeof HOME_ROUTE | typeof LOCATION_PERMISSION_ROUTE =>
  session.hasCompletedLocationSetup ? HOME_ROUTE : LOCATION_PERMISSION_ROUTE;

/** Where the splash screen sends the user (simple session view). */
export const getSplashRoute = (
  session: AuthSession,
): typeof HOME_ROUTE | typeof LOCATION_PERMISSION_ROUTE | typeof ONBOARDING_ROUTE =>
  session.isAuthenticated ? getPostLoginRoute(session) : ONBOARDING_ROUTE;

/**
 * The route a customer belongs on for the current auth state. Used by the
 * splash screen, by every auth action (to know where to go next) and by the
 * route guards.
 */
export const resolveAuthRoute = (state: AuthState): AuthRoute => {
  switch (getAuthStage(state)) {
    case 'unauthenticated':
      return state.hasSeenOnboarding ? WELCOME_ROUTE : ONBOARDING_ROUTE;
    case 'otp_pending':
      return OTP_ROUTE;
    case 'authenticated':
      return CREATE_PROFILE_ROUTE;
    case 'profile_created':
      return getPostLoginRoute({ hasCompletedLocationSetup: false });
    case 'location_selected':
      return getPostLoginRoute({ hasCompletedLocationSetup: true });
  }
};

/** Groups of auth screens for route guarding. */
export type AuthScreen = 'public' | 'otp' | 'create-profile' | 'location';

/**
 * Whether the screen group may be shown for this state. Anything else is
 * redirected to `resolveAuthRoute(state)`.
 *  - public (onboarding, welcome, login, register): not signed in (OTP pending is fine: going back to edit)
 *  - otp: only while an OTP is pending
 *  - create-profile: signed in, profile not created
 *  - location (permission + select): profile created, no area yet
 */
export const canAccessAuthScreen = (state: AuthState, screen: AuthScreen): boolean => {
  const stage = getAuthStage(state);
  switch (screen) {
    case 'public':
      return stage === 'unauthenticated' || stage === 'otp_pending';
    case 'otp':
      return stage === 'otp_pending';
    case 'create-profile':
      return stage === 'authenticated';
    case 'location':
      return stage === 'profile_created';
  }
};

/** Guest preview is not supported in the MVP (D-9). */
export const GUEST_PREVIEW_ENABLED = false;

/**
 * Route gate for everything outside the auth flow. Only the splash (`[]`) and the
 * `(auth)` group are public; every other route (tabs, discovery, cart, checkout,
 * orders, account, pickup, AI) needs a fully set-up session (`location_selected`).
 * Returns where an unauthenticated / half-set-up customer belongs, or `null` when
 * the route may be shown.
 */
export const getProtectedRedirect = (state: AuthState, segments: readonly string[]): AuthRoute | null => {
  if (segments.length === 0 || segments[0] === '(auth)') return null;
  return getAuthStage(state) === 'location_selected' ? null : resolveAuthRoute(state);
};
