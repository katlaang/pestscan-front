// src/components/navigation/DrawerContent.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../common/Avatar';
import { Divider } from '../layout/Divider';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme/theme';
import { Role } from '../../types/api.types';

interface DrawerMenuItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  badge?: number;
  roles?: Role[];
}

interface DrawerContentProps extends DrawerContentComponentProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    avatar?: string;
  };
  onLogout?: () => void;
}

const drawerMenuItems: DrawerMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'home',
    route: 'Dashboard',
  },
  {
    label: 'Farms',
    icon: 'leaf',
    route: 'Farms',
    roles: [Role.FARM_ADMIN, Role.SUPER_ADMIN],
  },
  {
    label: 'Greenhouses',
    icon: 'business',
    route: 'Greenhouses',
  },
  {
    label: 'Field Blocks',
    icon: 'grid',
    route: 'FieldBlocks',
  },
  {
    label: 'Scouting Sessions',
    icon: 'search',
    route: 'Sessions',
  },
  {
    label: 'Observations',
    icon: 'eye',
    route: 'Observations',
  },
  {
    label: 'Analytics',
    icon: 'stats-chart',
    route: 'Analytics',
  },
  {
    label: 'Heatmaps',
    icon: 'color-palette',
    route: 'Heatmaps',
  },
];

const settingsMenuItems: DrawerMenuItem[] = [
  {
    label: 'Profile',
    icon: 'person',
    route: 'Profile',
  },
  {
    label: 'Settings',
    icon: 'settings',
    route: 'Settings',
  },
  {
    label: 'Help & Support',
    icon: 'help-circle',
    route: 'Support',
  },
];

export const DrawerContent: React.FC<DrawerContentProps> = ({
  navigation,
  state,
  user,
  onLogout,
}) => {
  const insets = useSafeAreaInsets();

  const isRouteActive = (routeName: string): boolean => state.routeNames[state.index] === routeName;

  const canAccessRoute = (item: DrawerMenuItem): boolean => {
    if (!item.roles || !user) return true;
    return item.roles.includes(user.role);
  };

  const handleNavigation = (routeName: string) => {
    navigation.navigate(routeName as never);
  };

  const getRoleLabel = (role: Role): string => {
    switch (role) {
      case Role.SUPER_ADMIN:
        return 'Super Admin';
      case Role.FARM_ADMIN:
        return 'Farm Admin';
      case Role.MANAGER:
        return 'Manager';
      case Role.SCOUT:
        return 'Scout';
      default:
        return role;
    }
  };

  const renderMenuItem = (item: DrawerMenuItem) => {
    if (!canAccessRoute(item)) return null;

    const isActive = isRouteActive(item.route);
    return (
      <TouchableOpacity
        key={item.route}
        style={[styles.menuItem, isActive && styles.menuItemActive]}
        onPress={() => handleNavigation(item.route)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
          <Ionicons
            name={item.icon}
            size={20}
            color={isActive ? colors.surface : colors.textSecondary}
          />
        </View>
        <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>{item.label}</Text>
        {item.badge !== undefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <DrawerContentScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* User Profile */}
      {user && (
        <View style={[styles.userSection, { paddingTop: insets.top }]}>
          <Avatar
            name={`${user.firstName} ${user.lastName}`}
            size="lg"
            source={user.avatar ? { uri: user.avatar } : undefined}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
            <View style={styles.roleBadge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
              <Text style={styles.roleText}>{getRoleLabel(user.role)}</Text>
            </View>
          </View>
        </View>
      )}

      <Divider marginVertical="md" />

      {/* Main navigation */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Navigation</Text>
      </View>
      <View>{drawerMenuItems.map(renderMenuItem)}</View>

      <Divider marginVertical="md" />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Settings</Text>
      </View>
      <View>{settingsMenuItems.map(renderMenuItem)}</View>

      {/* Logout */}
      {onLogout && (
        <>
          <Divider marginVertical="md" />
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out" size={24} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Text style={styles.versionText}>PestScan v1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 18,
  },
  userEmail: {
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  roleBadge: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primaryLighter || '#E6F0FF',
    borderRadius: borderRadius.full,
  },
  roleText: {
    color: colors.primary,
    ...typography.caption,
  },
  sectionHeader: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionHeaderText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  menuItemActive: {
    backgroundColor: colors.primaryLighter || '#E6F0FF',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  iconContainerActive: {
    backgroundColor: colors.primary,
  },
  menuLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  menuLabelActive: {
    color: colors.primary,
    ...typography.bodyBold,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    color: colors.surface,
    ...typography.caption,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  logoutText: {
    ...typography.bodyBold,
    color: colors.error,
  },
  footer: {
    marginTop: spacing.lg,
  },
  versionText: {
    color: colors.textSecondary,
    ...typography.caption,
  },
});
