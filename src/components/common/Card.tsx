// src/components/Card.tsx

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';
import { colors, borderRadius, shadows, spacing } from '../../theme/theme';

type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: keyof typeof spacing;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
  onPress,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          ...shadows.lg,
          elevation: 8,
        };
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: colors.border,
          elevation: 0,
        };
      default:
        return shadows.sm;
    }
  };

  const cardContent = (
    <View
      style={[
        styles.card,
        getVariantStyle(),
        { padding: spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <PaperCard onPress={onPress} style={styles.touchableCard}>
        {cardContent}
      </PaperCard>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  touchableCard: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
});