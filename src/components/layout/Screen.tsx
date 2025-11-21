// src/components/layout/Screen.tsx

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Header } from '../common/Header';
import { Container } from './Container';
import { colors } from '../../theme/theme';

interface ScreenProps extends React.ComponentProps<typeof Container> {
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showBack?: boolean;
  onBackPress?: () => void;
  headerActions?: React.ComponentProps<typeof Header>['actions'];
  transparentHeader?: boolean;
  headerStyle?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  title,
  subtitle,
  showHeader = true,
  showBack = false,
  onBackPress,
  headerActions,
  transparentHeader = false,
  headerStyle,
  children,
  safeArea = false, // Screen handles safe area via Header
  ...containerProps
}) => {
  return (
    <View style={styles.screen}>
      {showHeader && title && (
        <Header
          title={title}
          subtitle={subtitle}
          showBack={showBack}
          onBackPress={onBackPress}
          actions={headerActions}
          transparent={transparentHeader}
        />
      )}
      <Container safeArea={safeArea} {...containerProps}>
        {children}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});