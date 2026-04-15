import { USER_SEEDS } from '@/api/seeds/users';
import { sessionStore } from '@/stores/session-store';
import type { AuthResult, UserSession } from '@/types/user';

export function login(phone: string): AuthResult {
  const normalizedPhone = phone?.trim();
  if (!normalizedPhone || !/^\d+$/.test(normalizedPhone)) {
    return {
      success: false,
      user: null,
      error: { code: 'INVALID_PHONE' },
    };
  }

  const user = USER_SEEDS.find((u) => u.phone === normalizedPhone);
  if (user) {
    return {
      success: true,
      user,
      error: null,
    };
  }

  return {
    success: false,
    user: null,
    error: { code: 'UNKNOWN_PHONE' },
  };
}

export function logout(): void {
  sessionStore.getState().logout();
}

export function getSession(): UserSession | null {
  const state = sessionStore.getState();
  if (state.userId === null || state.role === null) {
    return null;
  }
  return {
    userId: state.userId,
    role: state.role,
    phone: state.phone,
    authenticatedAt: state.authenticatedAt,
  };
}
