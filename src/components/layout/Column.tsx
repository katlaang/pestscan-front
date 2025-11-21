// src/components/layout/Column.tsx

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../../theme/theme';

type Alignment = 'flex-start' | 'center' | 'flex-end' | 'stretch';
type Justification = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

interface ColumnProps {
  children: React.ReactNode;
  gap?: keyof typeof spacing;
  align?: Alignment;
  justify?: Justification;
  style?: ViewStyle;
}

export const Column: React.FC<ColumnProps> = ({
  children,
  gap,
  align = 'stretch',
  justify = 'flex-start',
  style,
}) => {
  return (
    <View
      style={[
        styles.column,
        {
          alignItems: align,
          justifyContent: justify,
          gap: gap ? spacing[gap] : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
});