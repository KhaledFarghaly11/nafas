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

const INITIAL_STATE = {
  userId: null as string | null,
  role: null as UserRole | null,
  phone: null as string | null,
  authenticatedAt: null as number | null,
};

function validateSession(state: SessionState): boolean {
  const { userId, role, phone, authenticatedAt } = state;
  if ([userId, role, phone, authenticatedAt].some((v) => v === undefined)) {
    return false;
  }
  if (userId === null && role === null && phone === null && authenticatedAt === null) {
    return true;
  }
  if (userId !== null && role !== null && phone !== null) {
    return true;
  }
  return false;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
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
          ...INITIAL_STATE,
        }),
    }),
    {
      name: 'nafas-session',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.warn('[session-store] Rehydration failed:', error);
          }
          if (state && !validateSession(state)) {
            useSessionStore.setState({ ...INITIAL_STATE, hydrated: true });
          } else {
            useSessionStore.setState({ hydrated: true });
          }
        };
      },
    },
  ),
);

export const sessionStore = useSessionStore;
