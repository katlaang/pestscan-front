// src/components/layout/Divider.tsx

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme/theme';

interface DividerProps {
  vertical?: boolean;
  marginVertical?: keyof typeof spacing;
  marginHorizontal?: keyof typeof spacing;
  color?: string;
  thickness?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  vertical = false,
  marginVertical = 'md',
  marginHorizontal = 'none',
  color = colors.border,
  thickness = 1,
  style,
}) => {
  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        {
          backgroundColor: color,
          marginVertical: vertical ? 0 : spacing[marginVertical],
          marginHorizontal: vertical ? spacing[marginHorizontal] : 0,
          width: vertical ? thickness : '100%',
          height: vertical ? '100%' : thickness,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    alignSelf: 'stretch',
  },
  vertical: {
    alignSelf: 'stretch',
  },
});