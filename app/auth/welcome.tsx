import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { login } from '@/api/mock-server';
import { useTheme } from '@/design/theme';
import { useSessionStore } from '@/stores/session-store';

export default function WelcomeScreen() {
  const [phone, setPhone] = useState('');
  const theme = useTheme();

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
      Alert.alert('Error', result.error?.message ?? 'Authentication failed');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Nafas</Text>
        <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
          Homemade Egyptian Food
        </Text>
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text, borderColor: theme.colors.textSecondary },
          ]}
          placeholder="Enter phone number"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="phone-pad"
          autoFocus
          value={phone}
          onChangeText={setPhone}
        />
        <Button title="Get Started" onPress={handleLogin} color={theme.colors.primary} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    height: 48,
    marginBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  tagline: {
    fontSize: 18,
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
