// src/constants/roles.ts

import { Role } from '../types/api.types';

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: 'Super Administrator',
  [Role.FARM_ADMIN]: 'Farm Administrator',
  [Role.MANAGER]: 'Manager',
  [Role.SCOUT]: 'Scout',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: 'Full system access with all administrative privileges',
  [Role.FARM_ADMIN]: 'Manage farm operations, users, and configurations',
  [Role.MANAGER]: 'Oversee scouting sessions and generate reports',
  [Role.SCOUT]: 'Conduct field observations and record pest data',
};

export const ROLE_PERMISSIONS = {
  [Role.SUPER_ADMIN]: {
    canManageUsers: true,
    canManageFarms: true,
    canManageGreenhouses: true,
    canManageFieldBlocks: true,
    canManageSessions: true,
    canViewAnalytics: true,
    canViewHeatmaps: true,
    canExportData: true,
    canManageSubscriptions: true,
    canViewAllFarms: true,
    canDeleteRecords: true,
  },
  [Role.FARM_ADMIN]: {
    canManageUsers: true,
    canManageFarms: true,
    canManageGreenhouses: true,
    canManageFieldBlocks: true,
    canManageSessions: true,
    canViewAnalytics: true,
    canViewHeatmaps: true,
    canExportData: true,
    canManageSubscriptions: false,
    canViewAllFarms: false,
    canDeleteRecords: true,
  },
  [Role.MANAGER]: {
    canManageUsers: false,
    canManageFarms: false,
    canManageGreenhouses: false,
    canManageFieldBlocks: false,
    canManageSessions: true,
    canViewAnalytics: true,
    canViewHeatmaps: true,
    canExportData: true,
    canManageSubscriptions: false,
    canViewAllFarms: false,
    canDeleteRecords: false,
  },
  [Role.SCOUT]: {
    canManageUsers: false,
    canManageFarms: false,
    canManageGreenhouses: false,
    canManageFieldBlocks: false,
    canManageSessions: false,
    canViewAnalytics: false,
    canViewHeatmaps: false,
    canExportData: false,
    canManageSubscriptions: false,
    canViewAllFarms: false,
    canDeleteRecords: false,
  },
} as const;

export const ROLE_HIERARCHY = {
  [Role.SUPER_ADMIN]: 4,
  [Role.FARM_ADMIN]: 3,
  [Role.MANAGER]: 2,
  [Role.SCOUT]: 1,
} as const;

export const hasPermission = (
  userRole: Role,
  permission: keyof typeof ROLE_PERMISSIONS[Role]
): boolean => {
  return ROLE_PERMISSIONS[userRole][permission];
};

export const isHigherRole = (userRole: Role, compareRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[compareRole];
};

export const canManageUser = (managerRole: Role, targetRole: Role): boolean => {
  return isHigherRole(managerRole, targetRole);
};