import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '@/api/mock-server';
import { CHEF_ACCOUNTS, CUSTOMER_ACCOUNTS } from '@/api/seeds/users';
import { LanguageToggle } from '@/components/domain/LanguageToggle';
import { useToast } from '@/components/feedback/Toast';
import { Button } from '@/components/primitives/Button';
import { Input } from '@/components/primitives/Input';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/design/theme';
import { useSessionStore } from '@/stores/session-store';

export default function WelcomeScreen() {
  const [phone, setPhone] = useState('');
  const theme = useTheme();
  const { t } = useTranslation();
  const toast = useToast();

  const handleLogin = () => {
    const result = login(phone);
    if (result.success && result.user) {
      useSessionStore.getState().login(result.user);
      if (result.user.role === 'chef') {
        router.replace('/(chef)/dashboard');
      } else {
        router.replace('/(customer)/home');
      }
    } else {
      toast.show(result.error?.message ?? t('error_message'), 'error');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LanguageToggle style={styles.langToggle} />
      <View style={[styles.content, { paddingHorizontal: theme.spacing.xl }]}>
        <Text
          variant="heading1"
          color="clay"
          align="center"
          style={{ marginBottom: theme.spacing.sm }}
        >
          {t('app_name')}
        </Text>
        <Text
          variant="heading3"
          color="secondary"
          align="center"
          style={{ marginBottom: theme.spacing['3xl'] }}
        >
          {t('tagline')}
        </Text>
        <View style={[styles.inputContainer, { marginBottom: theme.spacing.xl }]}>
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder={t('phone_placeholder')}
            keyboardType="phone-pad"
            maxLength={11}
          />
        </View>
        <Button title={t('login_button')} onPress={handleLogin} size="lg" style={styles.button} />
        <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.xl }}>
          <Text variant="caption" color="secondary" align="center">
            Test accounts:
          </Text>
          <Text variant="caption" color="secondary" align="center">
            Chef: {CHEF_ACCOUNTS[0].phone} ({CHEF_ACCOUNTS[0].name})
          </Text>
          <Text variant="caption" color="secondary" align="center">
            Customer: {CUSTOMER_ACCOUNTS[0].phone} ({CUSTOMER_ACCOUNTS[0].name})
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  inputContainer: {
    width: '100%',
  },
  langToggle: {
    alignSelf: 'center',
  },
});
