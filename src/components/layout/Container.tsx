import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ViewStyle,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from './KeyboardAvoidingView';
import { colors, spacing } from '../../theme/theme';

interface ContainerProps {
  children: React.ReactNode;
  padding?: keyof typeof spacing;
  paddingHorizontal?: keyof typeof spacing;
  paddingVertical?: keyof typeof spacing;
  scroll?: boolean;
  keyboardAware?: boolean;
  safeArea?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
  showsVerticalScrollIndicator?: boolean;
  keyboardOffset?: number;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  padding,
  paddingHorizontal,
  paddingVertical,
  scroll = false,
  keyboardAware = true,
  safeArea = true,
  backgroundColor = colors.background,
  style,
  contentContainerStyle,
  refreshing = false,
  onRefresh,
  showsVerticalScrollIndicator = false,
  keyboardOffset = 0,
}) => {
  const insets = useSafeAreaInsets();

  const paddingStyle: ViewStyle = {
    paddingTop: safeArea ? insets.top : 0,
    paddingBottom: safeArea ? insets.bottom : 0,
    paddingLeft: safeArea ? insets.left : 0,
    paddingRight: safeArea ? insets.right : 0,
  };

  if (padding) {
    paddingStyle.padding = spacing[padding];
  }
  if (paddingHorizontal) {
    paddingStyle.paddingHorizontal = spacing[paddingHorizontal];
  }
  if (paddingVertical) {
    paddingStyle.paddingVertical = spacing[paddingVertical];
  }

  const containerStyle: ViewStyle = {
    backgroundColor,
    ...paddingStyle,
    ...style,
  };

  const Wrapper = keyboardAware ? KeyboardAvoidingView : View;
  const wrapperProps = keyboardAware
    ? {
        offset: keyboardOffset,
        style: styles.keyboardAvoid,
      }
    : { style: styles.wrapper };

  if (scroll) {
    return (
      <Wrapper {...wrapperProps}>
        <ScrollView
          style={[styles.scrollView, { backgroundColor }]}
          contentContainerStyle={[containerStyle, contentContainerStyle]}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            ) : undefined
          }
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </Wrapper>
    );
  }

  return (
    <Wrapper {...wrapperProps}>
      <View style={[styles.container, containerStyle]}>{children}</View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});