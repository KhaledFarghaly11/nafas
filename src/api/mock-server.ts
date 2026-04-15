import { CHEF_ACCOUNTS, CUSTOMER_ACCOUNTS } from '@/api/seeds/users';
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

  const matchedChef = CHEF_ACCOUNTS.find((c) => c.phone === normalizedPhone);
  if (matchedChef) {
    return {
      success: true,
      user: {
        id: `chef-${normalizedPhone}`,
        phone: normalizedPhone,
        role: 'chef' as const,
        name: matchedChef.name,
        kitchenId: matchedChef.kitchenId,
        createdAt: '2026-04-01T00:00:00.000Z',
      },
      error: null,
    };
  }

  const matchedCustomer = CUSTOMER_ACCOUNTS.find((c) => c.phone === normalizedPhone);
  if (matchedCustomer) {
    return {
      success: true,
      user: {
        id: `customer-${normalizedPhone}`,
        phone: normalizedPhone,
        role: 'customer' as const,
        name: matchedCustomer.name,
        createdAt: '2026-04-01T00:00:00.000Z',
      },
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
