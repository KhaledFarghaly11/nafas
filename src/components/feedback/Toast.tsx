import React, { useState, useRef, useCallback, useEffect, createContext, useContext } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/design/theme';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  id: number;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastInner({
  message,
  type,
  translateY,
}: {
  message: string;
  type: ToastType;
  translateY: Animated.Value;
}) {
  const tokens = useTheme();

  const borderColorMap: Record<ToastType, string> = {
    success: tokens.colors.success,
    error: tokens.colors.error,
    info: tokens.colors.primary,
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ translateY }] }]}>
      <SafeAreaView edges={['bottom']}>
        <View
          style={[
            styles.content,
            {
              backgroundColor: tokens.colors.surface,
              borderLeftColor: borderColorMap[type],
              borderRadius: tokens.radius.lg,
              paddingHorizontal: tokens.spacing.lg,
              paddingVertical: tokens.spacing.md,
              ...tokens.shadows.md,
            },
          ]}
        >
          <Text variant="body">{message}</Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
    id: 0,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const translateY = useRef(new Animated.Value(100)).current;

  const hideToast = useCallback(() => {
    const closingId = state.id;
    Animated.timing(translateY, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setState((prev) => {
        if (prev.id !== closingId) return prev;
        return { ...prev, visible: false };
      });
    });
  }, [translateY, state.id]);

  const show = useCallback(
    (message: string, type: ToastType = 'info') => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      translateY.stopAnimation();

      setState({ visible: true, message, type, id: Date.now() });

      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, 4000);
    },
    [translateY, hideToast],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      translateY.stopAnimation();
    };
  }, [translateY]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {state.visible && (
        <ToastInner message={state.message} type={state.type} translateY={translateY} />
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  content: {
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  wrapper: {
    alignSelf: 'center',
    bottom: 80,
    left: '5%',
    maxWidth: 400,
    position: 'absolute',
    right: '5%',
  },
});
