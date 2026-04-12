import { login as mockLogin, logout as mockLogout } from '@/api/mock-server';
import { sessionStore, useSessionStore } from '@/stores/session-store';

export function useAuth() {
  const { userId, role } = useSessionStore((s) => ({ userId: s.userId, role: s.role }));

  const isAuthenticated = userId !== null;

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
