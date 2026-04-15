import { login as mockLogin, logout as mockLogout } from '@/api/mock-server';
import { useSessionStore } from '@/stores/session-store';
import type { AuthResult } from '@/types';

export function useAuth() {
  const userId = useSessionStore((s) => s.userId);
  const role = useSessionStore((s) => s.role);

  const isAuthenticated = userId !== null;

  const login = async (phone: string): Promise<AuthResult> => {
    const result = await mockLogin(phone, '123456');
    return result;
  };

  const logout = async () => {
    await mockLogout();
  };

  return { isAuthenticated, role, login, logout };
}
