import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../../theme/theme';

type Alignment = 'flex-start' | 'center' | 'flex-end' | 'stretch';
type Justification = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

interface RowProps {
  children: React.ReactNode;
  gap?: keyof typeof spacing;
  align?: Alignment;
  justify?: Justification;
  wrap?: boolean;
  style?: ViewStyle;
}

export const Row: React.FC<RowProps> = ({
  children,
  gap,
  align = 'center',
  justify = 'flex-start',
  wrap = false,
  style,
}) => {
  return (
    <View
      style={[
        styles.row,
        {
          alignItems: align,
          justifyContent: justify,
          gap: gap ? spacing[gap] : 0,
          flexWrap: wrap ? 'wrap' : 'nowrap',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});