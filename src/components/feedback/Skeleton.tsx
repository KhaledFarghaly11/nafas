import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@/design/theme';

interface SkeletonProps {
  variant: 'list' | 'detail' | 'card';
  count?: number;
  style?: ViewStyle;
  testID?: string;
}

export function Skeleton({ variant, count = 3, style, testID }: SkeletonProps) {
  const tokens = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  const baseColor = tokens.colors.skeletonBase;

  const renderList = () => {
    const rows: React.ReactNode[] = [];
    for (let i = 0; i < count; i++) {
      rows.push(
        <View
          key={i}
          style={[styles.listRow, { gap: tokens.spacing.md, marginBottom: tokens.spacing.md }]}
        >
          <Animated.View style={[styles.listAvatar, { backgroundColor: baseColor, opacity }]} />
          <View style={[styles.listTextBlock, { gap: tokens.spacing.xs }]}>
            <Animated.View style={[styles.listLine1, { backgroundColor: baseColor, opacity }]} />
            <Animated.View style={[styles.listLine2, { backgroundColor: baseColor, opacity }]} />
          </View>
        </View>,
      );
    }
    return rows;
  };

  const renderDetail = () => (
    <View style={{ gap: tokens.spacing.md }}>
      <Animated.View
        style={[
          styles.detailImage,
          { backgroundColor: baseColor, borderRadius: tokens.radius.md, opacity },
        ]}
      />
      <Animated.View style={[styles.detailLine1, { backgroundColor: baseColor, opacity }]} />
      <Animated.View style={[styles.detailLine2, { backgroundColor: baseColor, opacity }]} />
      <Animated.View style={[styles.detailLine3, { backgroundColor: baseColor, opacity }]} />
    </View>
  );

  const renderCard = () => (
    <View style={[styles.cardOuter, { borderRadius: tokens.radius.lg }]}>
      <Animated.View style={[styles.cardImage, { backgroundColor: baseColor, opacity }]} />
      <View style={[styles.cardInner, { gap: tokens.spacing.xs, padding: tokens.spacing.md }]}>
        <Animated.View style={[styles.cardLine1, { backgroundColor: baseColor, opacity }]} />
        <Animated.View style={[styles.cardLine2, { backgroundColor: baseColor, opacity }]} />
      </View>
    </View>
  );

  return (
    <View testID={testID} style={style}>
      {variant === 'list' && renderList()}
      {variant === 'detail' && renderDetail()}
      {variant === 'card' && renderCard()}
    </View>
  );
}

const styles = StyleSheet.create({
  cardImage: {
    height: 120,
  },
  cardInner: {
    gap: 8,
    padding: 12,
  },
  cardLine1: {
    borderRadius: 4,
    height: 14,
    width: '60%',
  },
  cardLine2: {
    borderRadius: 4,
    height: 12,
    width: '40%',
  },
  cardOuter: {
    overflow: 'hidden',
  },
  detailImage: {
    height: 150,
    width: 200,
  },
  detailLine1: {
    borderRadius: 4,
    height: 14,
    width: '90%',
  },
  detailLine2: {
    borderRadius: 4,
    height: 12,
    width: '70%',
  },
  detailLine3: {
    borderRadius: 4,
    height: 12,
    width: '50%',
  },
  listAvatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  listLine1: {
    borderRadius: 4,
    height: 14,
    width: '70%',
  },
  listLine2: {
    borderRadius: 4,
    height: 12,
    width: '50%',
  },
  listRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  listTextBlock: {
    flex: 1,
  },
});
