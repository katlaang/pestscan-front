// src/components/layout/KeyboardAvoidingView.tsx

import React from 'react';
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingViewProps as RNKeyboardAvoidingViewProps,
} from 'react-native';

interface KeyboardAvoidingViewProps extends Omit<RNKeyboardAvoidingViewProps, 'behavior'> {
  children: React.ReactNode;
  behavior?: 'height' | 'position' | 'padding';
  offset?: number;
  style?: ViewStyle;
  enabled?: boolean;
}

export const KeyboardAvoidingView: React.FC<KeyboardAvoidingViewProps> = ({
  children,
  behavior,
  offset = 0,
  style,
  enabled = true,
  ...props
}) => {
  // Determine default behavior based on platform
  const defaultBehavior = Platform.select({
    ios: 'padding' as const,
    android: 'height' as const,
    default: 'padding' as const,
  });

  const keyboardBehavior = behavior || defaultBehavior;

  return (
    <RNKeyboardAvoidingView
      behavior={keyboardBehavior}
      keyboardVerticalOffset={offset}
      enabled={enabled}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </RNKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});