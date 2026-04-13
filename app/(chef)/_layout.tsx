import { Feather } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/design/theme';
import { useSessionStore } from '@/stores/session-store';

export default function ChefLayout() {
  const theme = useTheme();
  const { t } = useTranslation();
  const role = useSessionStore((s) => s.role);

  if (role !== 'chef') {
    return <Redirect href="/auth/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.saffron,
        tabBarInactiveTintColor: theme.colors.smoke,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBackground,
          borderTopColor: theme.colors.border,
        },
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.cream,
        headerTitleStyle: { fontFamily: 'TajawalBold' },
        tabBarLabelStyle: { fontFamily: 'TajawalMedium' },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('dashboard'),
          tabBarIcon: ({ color, size }) => <Feather name="grid" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('orders'),
          tabBarIcon: ({ color, size }) => <Feather name="clipboard" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: t('menu'),
          tabBarIcon: ({ color, size }) => <Feather name="book-open" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: t('schedule'),
          tabBarIcon: ({ color, size }) => <Feather name="calendar" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: t('stats'),
          tabBarIcon: ({ color, size }) => <Feather name="bar-chart" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
