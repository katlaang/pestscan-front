// src/navigation/ProfileNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;