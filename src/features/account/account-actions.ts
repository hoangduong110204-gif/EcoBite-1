import { resolveAuthRoute, type AuthRoute } from '@/features/auth/auth-routing';
import { dispatchAuth, getAuthState } from '@/features/auth/auth-store';
import { clearCart } from '@/features/cart/cart-actions';
import { resetCheckoutStore } from '@/features/checkout/checkout-store';
import { resetFavoritesStore } from '@/features/discovery/favorites-store';
import { api } from '@/services/api';
import { authService } from '@/services/auth';
import { AUTH_MESSAGES, isValidName } from '@/utils/auth-validation';

const GENERIC_ERROR = 'Không lưu được thay đổi. Vui lòng thử lại.';

export type UpdateProfileResult = { ok: true } | { ok: false; field: 'name' | 'area' | 'form'; message: string };

/**
 * Edit Profile (reference 10.2): saves the display name and default area for the
 * signed-in account. The mock auth service keeps the account; the session auth
 * store (`useAuth().profile` / `.area`, read by Home) is updated to match. Phone and
 * email are shown read-only (changing a phone would need a new OTP).
 */
export async function updateProfile(input: { name: string; areaId: string }): Promise<UpdateProfileResult> {
  const state = getAuthState();
  if (!state.account || state.name === null) return { ok: false, field: 'form', message: GENERIC_ERROR };
  const name = input.name.trim();
  if (!isValidName(name)) return { ok: false, field: 'name', message: (name.length === 0 ? AUTH_MESSAGES.nameRequired : AUTH_MESSAGES.nameTooShort) };
  const area = (await api.listAreas()).find((a) => a.id === input.areaId);
  if (!area) return { ok: false, field: 'area', message: AUTH_MESSAGES.areaRequired };
  try {
    await authService.updateName(state.account.id, name);
    await authService.saveArea(state.account.id, area.id);
  } catch {
    return { ok: false, field: 'form', message: GENERIC_ERROR };
  }
  dispatchAuth({ type: 'profile_updated', name });
  dispatchAuth({ type: 'area_selected', area });
  return { ok: true };
}

/**
 * Logout (reference 10.9). Clears everything that belongs to the session: the
 * auth session, the cart, and the temporary checkout / payment sessions. Orders
 * are server-side data of the account (they stay in the mock API and come back
 * when the customer logs in again). Returns the auth entry route to go to.
 */
export function signOut(): AuthRoute {
  dispatchAuth({ type: 'signed_out' });
  clearCart();
  resetCheckoutStore();
  resetFavoritesStore();
  return resolveAuthRoute(getAuthState());
}
