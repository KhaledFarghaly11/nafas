import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SteamParticle {
  id: number;
  startX: number;
  drift: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

function generateSteamParticles(count: number): SteamParticle[] {
  const center = SCREEN_WIDTH / 2;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    startX: center + (Math.random() - 0.5) * 120,
    drift: (Math.random() - 0.5) * 40,
    duration: 3000 + Math.random() * 2000,
    delay: Math.random() * 4000,
    size: 6 + Math.random() * 14,
    opacity: 0.15 + Math.random() * 0.2,
  }));
}

export default function WelcomeScreen() {
  const [phone, setPhone] = useState('');
  const theme = useTheme();
  const { t } = useTranslation();
  const toast = useToast();

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;
  const testOpacity = useRef(new Animated.Value(0)).current;
  const steamParticleAnims = useRef<Animated.Value[]>([]).current;
  const steamTranslateY = useRef<Animated.Value[]>([]).current;
  const steamTranslateX = useRef<Animated.Value[]>([]).current;

  const [particles] = useState(() => generateSteamParticles(12));

  if (steamParticleAnims.length === 0) {
    for (let i = 0; i < particles.length; i++) {
      steamParticleAnims.push(new Animated.Value(0));
      steamTranslateY.push(new Animated.Value(0));
      steamTranslateX.push(new Animated.Value(0));
    }
  }

  useEffect(() => {
    const titleSpring = Animated.spring(titleTranslateY, {
      toValue: 0,
      damping: 12,
      stiffness: 80,
      useNativeDriver: true,
    });

    const titleFade = Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });

    const taglineFade = Animated.timing(taglineOpacity, {
      toValue: 1,
      duration: 600,
      delay: 400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });

    const formSpring = Animated.spring(formTranslateY, {
      toValue: 0,
      damping: 14,
      stiffness: 70,
      useNativeDriver: true,
    });

    const formFade = Animated.timing(formOpacity, {
      toValue: 1,
      duration: 700,
      delay: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });

    const testFade = Animated.timing(testOpacity, {
      toValue: 1,
      duration: 500,
      delay: 900,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });

    Animated.parallel([
      Animated.sequence([Animated.parallel([titleSpring, titleFade]), taglineFade]),
      Animated.sequence([formSpring, formFade]),
      testFade,
    ]).start();

    const steamLoops = particles.map((p, i) => {
      const riseAnim = Animated.loop(
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.parallel([
            Animated.timing(steamTranslateY[i], {
              toValue: -140,
              duration: p.duration,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(steamTranslateX[i], {
              toValue: p.drift,
              duration: p.duration,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(steamParticleAnims[i], {
                toValue: p.opacity,
                duration: p.duration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(steamParticleAnims[i], {
                toValue: 0,
                duration: p.duration * 0.7,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.delay(800 + Math.random() * 2000),
        ]),
      );
      return riseAnim;
    });

    const timer = setTimeout(() => {
      steamLoops.forEach((anim) => anim.start());
    }, 1200);

    return () => {
      clearTimeout(timer);
      steamLoops.forEach((anim) => anim.stop());
    };
  }, []);

  const handleLogin = async () => {
    const result = await login(phone, '123456');
    if (result.success && result.user) {
      useSessionStore.getState().login(result.user);
      if (result.user.role === 'chef') {
        router.replace('/(chef)/dashboard');
      } else {
        router.replace('/(customer)/home');
      }
    } else {
      const errorCode = result.error?.code;
      const errorKey =
        errorCode === 'INVALID_PHONE'
          ? 'error_invalid_phone'
          : errorCode === 'UNKNOWN_PHONE'
            ? 'error_unknown_phone'
            : 'error_message';
      toast.show(t(errorKey), 'error');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LanguageToggle style={styles.langToggle} />

        <View style={[styles.content, { paddingHorizontal: theme.spacing.xl }]}>
          <View style={styles.titleSection}>
            <View style={styles.titleWithSteam}>
              <View style={styles.steamArea} pointerEvents="none">
                {particles.map((p, i) => (
                  <Animated.View
                    key={p.id}
                    style={[
                      styles.steamParticleBase,
                      {
                        backgroundColor: theme.colors.smoke,
                        width: p.size,
                        height: p.size,
                        borderRadius: p.size / 2,
                        left: p.startX - SCREEN_WIDTH / 2,
                        opacity: steamParticleAnims[i],
                        transform: [
                          { translateY: steamTranslateY[i] },
                          { translateX: steamTranslateX[i] },
                        ],
                      },
                    ]}
                  />
                ))}
              </View>
              <Animated.View
                style={{
                  opacity: titleOpacity,
                  transform: [{ translateY: titleTranslateY }],
                }}
              >
                <Text
                  variant="heading1"
                  color="clay"
                  align="center"
                  style={{ marginBottom: theme.spacing.xs }}
                >
                  {t('app_name')}
                </Text>
              </Animated.View>
            </View>
            <Animated.View style={{ opacity: taglineOpacity }}>
              <Text variant="body" color="secondary" align="center">
                {t('tagline')}
              </Text>
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.formSection,
              {
                opacity: formOpacity,
                transform: [{ translateY: formTranslateY }],
                gap: theme.spacing.lg,
                marginTop: theme.spacing['2xl'],
              },
            ]}
          >
            <Input
              value={phone}
              onChangeText={setPhone}
              placeholder={t('phone_placeholder')}
              keyboardType="phone-pad"
              maxLength={11}
            />
            <Button
              title={t('login_button')}
              onPress={handleLogin}
              size="md"
              style={styles.button}
            />
          </Animated.View>

          <Animated.View style={[styles.testAccountsWrapper, { opacity: testOpacity }]}>
            <View
              style={[
                styles.testAccounts,
                {
                  gap: theme.spacing.xs,
                  marginTop: theme.spacing['2xl'],
                  backgroundColor: theme.colors.linen,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing.lg,
                },
              ]}
            >
              <Text variant="caption" color="secondary" align="center">
                {t('test_accounts')}
              </Text>
              <Text variant="caption" color="clay" align="center">
                {t('chef')}: {CHEF_ACCOUNTS[0].phone} ({CHEF_ACCOUNTS[0].name})
              </Text>
              <Text variant="caption" color="clay" align="center">
                {t('customer')}: {CUSTOMER_ACCOUNTS[0].phone} ({CUSTOMER_ACCOUNTS[0].name})
              </Text>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  formSection: {
    width: '100%',
  },
  langToggle: {
    alignSelf: 'center',
  },
  steamArea: {
    height: 150,
    position: 'absolute',
    top: -130,
    width: SCREEN_WIDTH,
  },
  steamParticleBase: {
    bottom: 10,
    position: 'absolute',
  },
  testAccounts: {
    width: '100%',
  },
  testAccountsWrapper: {
    width: '100%',
  },
  titleSection: {
    alignItems: 'center',
    width: '100%',
  },
  titleWithSteam: {
    alignItems: 'center',
    position: 'relative',
  },
});
