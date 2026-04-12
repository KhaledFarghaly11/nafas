import { Slot, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { ThemeProvider } from '@/design/theme';
import { QueryProvider } from '@/lib/query-client';
import { useSessionStore } from '@/stores/session-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useSessionStore((s) => s.hydrated);
  const role = useSessionStore((s) => s.role);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    let target: string | null = null;

    if (role === null) {
      target = '/auth/welcome';
    } else if (role === 'customer') {
      target = '/(customer)/home';
    } else if (role === 'chef') {
      target = '/(chef)/dashboard';
    }

    const currentNormalized = pathname.replace(/\/+$/, '') || '/';

    if (target && currentNormalized !== target.replace(/\/+$/, '')) {
      router.replace(target);
    }

    SplashScreen.hideAsync().catch(() => {});
  }, [hydrated, role, pathname, router]);

  return (
    <QueryProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </QueryProvider>
  );
}
