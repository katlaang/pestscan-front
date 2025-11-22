// src/utils/toastConfig.tsx

import React from 'react';
import Toast from 'react-native-toast-message';
import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { colors } from '../theme/theme';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.success,
        backgroundColor: colors.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
      }}
      text2Style={{
        fontSize: 14,
        color: colors.textSecondary,
      }}
    />
  ),
  
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: colors.error,
        backgroundColor: colors.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
      }}
      text2Style={{
        fontSize: 14,
        color: colors.textSecondary,
      }}
    />
  ),
  
  info: (props: any) => (
    <InfoToast
      {...props}
      style={{
        borderLeftColor: colors.info,
        backgroundColor: colors.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
      }}
      text2Style={{
        fontSize: 14,
        color: colors.textSecondary,
      }}
    />
  ),
  
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.warning,
        backgroundColor: colors.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
      }}
      text2Style={{
        fontSize: 14,
        color: colors.textSecondary,
      }}
    />
  ),
};

// Helper functions for showing toasts
export const showSuccessToast = (title: string, message?: string) => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
  });
};

export const showErrorToast = (title: string, message?: string) => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
  });
};

export const showInfoToast = (title: string, message?: string) => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
  });
};

export const showWarningToast = (title: string, message?: string) => {
  Toast.show({
    type: 'warning',
    text1: title,
    text2: message,
  });
};
