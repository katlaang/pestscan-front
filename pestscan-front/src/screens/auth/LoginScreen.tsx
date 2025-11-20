// src/screens/auth/LoginScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../store/AuthContext';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { showErrorToast } from '../../utils/toastConfig';
import { getErrorMessage } from '../../utils/helpers';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      await login(data.email, data.password);
      // Navigation will be handled automatically by AppNavigator
    } catch (error) {
      showErrorToast('Login Failed', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={60} color={colors.surface} />
          </View>
          <Text style={styles.title}>Mofo Pest Scout</Text>
          <Text style={styles.subtitle}>Farm Pest Management System</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Sign In</Text>
          <Text style={styles.formSubtitle}>
            Enter your credentials to access your account
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  mode="outlined"
                  label="Email"
                  placeholder="your.email@example.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  left={<TextInput.Icon icon="email" />}
                  error={!!errors.email}
                  style={styles.input}
                />
                {errors.email && (
                  <HelperText type="error" visible={!!errors.email}>
                    {errors.email.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  mode="outlined"
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  error={!!errors.password}
                  style={styles.input}
                />
                {errors.password && (
                  <HelperText type="error" visible={!!errors.password}>
                    {errors.password.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
          >
            Sign In
          </Button>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          >
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={styles.registerTextBold}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Mofo Technologies. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.surface,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  formTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
  },
  loginButton: {
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
  },
  loginButtonContent: {
    paddingVertical: spacing.sm,
  },
  registerLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  registerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  registerTextBold: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default LoginScreen;