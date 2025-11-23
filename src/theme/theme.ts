// src/theme/theme.ts

import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const colors = {
  primary: '#2ecc71',
  primaryDark: '#27ae60',
  secondary: '#3498db',
  accent: '#e74c3c',
  
  // Severity colors (matching backend SeverityLevel)
  severityZero: '#2ecc71',
  severityLow: '#f1c40f',
  severityModerate: '#e67e22',
  severityHigh: '#e74c3c',
  severityVeryHigh: '#c0392b',
  severityEmergency: '#7f0000',
  
  // Status colors
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#3498db',
  
  // Neutral colors
  background: '#f5f6fa',
  surface: '#ffffff',
  text: '#2c3e50',
  textSecondary: '#7f8c8d',
  border: '#dfe6e9',
  disabled: '#b2bec3',
  
  // Category colors
  pest: '#e74c3c',
  disease: '#e67e22',
  beneficial: '#2ecc71',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
  },
  roundness: borderRadius.md,
};

// Helper function to get severity color
export const getSeverityColor = (level: string): string => {
  const levelMap: Record<string, string> = {
    ZERO: colors.severityZero,
    LOW: colors.severityLow,
    MODERATE: colors.severityModerate,
    HIGH: colors.severityHigh,
    VERY_HIGH: colors.severityVeryHigh,
    EMERGENCY: colors.severityEmergency,
  };
  
  return levelMap[level] || colors.text;
};

// Helper function to get category color
export const getCategoryColor = (category: string): string => {
  const categoryMap: Record<string, string> = {
    PEST: colors.pest,
    DISEASE: colors.disease,
    BENEFICIAL: colors.beneficial,
  };
  
  return categoryMap[category] || colors.text;
};