import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserRole } from '@/types/user';

interface SessionState {
  userId: string | null;
  role: UserRole | null;
  phone: string | null;
  authenticatedAt: number | null;
  hydrated: boolean;
  login: (user: { id: string; phone: string; role: UserRole; name: string }) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      userId: null,
      role: null,
      phone: null,
      authenticatedAt: null,
      hydrated: false,
      login: (user) =>
        set({
          userId: user.id,
          role: user.role,
          phone: user.phone,
          authenticatedAt: Date.now(),
        }),
      logout: () =>
        set({
          userId: null,
          role: null,
          phone: null,
          authenticatedAt: null,
        }),
    }),
    {
      name: 'nafas-session',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        return (_state, error) => {
          if (!error) {
            useSessionStore.setState({ hydrated: true });
          }
        };
      },
    },
  ),
);

export const sessionStore = useSessionStore;
