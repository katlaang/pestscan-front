// src/navigation/MainNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';
import { useAuth } from '../store/AuthContext';
import { Role } from '../types/api.types';

// Stack Navigators
import DashboardNavigator from './DashboardNavigator';
import ScoutingNavigator from './ScoutingNavigator';
import AnalyticsNavigator from './AnalyticsNavigator';
import ProfileNavigator from './ProfileNavigator';

export type MainTabParamList = {
  DashboardTab: undefined;
  ScoutingTab: undefined;
  AnalyticsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const { user, hasRole } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ScoutingTab') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'AnalyticsTab') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardNavigator}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      
      <Tab.Screen
        name="ScoutingTab"
        component={ScoutingNavigator}
        options={{ tabBarLabel: 'Scouting' }}
      />
      
      {hasRole([Role.MANAGER, Role.FARM_ADMIN, Role.SUPER_ADMIN]) && (
        <Tab.Screen
          name="AnalyticsTab"
          component={AnalyticsNavigator}
          options={{ tabBarLabel: 'Analytics' }}
        />
      )}
      
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;