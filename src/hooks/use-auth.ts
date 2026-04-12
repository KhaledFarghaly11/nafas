import { login as mockLogin, logout as mockLogout } from '@/api/mock-server';
import { sessionStore, useSessionStore } from '@/stores/session-store';
import type { UserRole } from '@/types/user';

export function useAuth() {
  const session = useSessionStore();

  const isAuthenticated = session.userId !== null;
  const role: UserRole | null = session.role;

  const login = (phone: string) => {
    const result = mockLogin(phone);
    if (result.success && result.user) {
      sessionStore.getState().login(result.user);
    }
    return result;
  };

  const logout = () => {
    mockLogout();
  };

  return { isAuthenticated, role, login, logout };
}
