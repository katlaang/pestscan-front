// src/navigation/DashboardNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import FarmListScreen from '../screens/farm/FarmListScreen';
import FarmDetailScreen from '../screens/farm/FarmDetailScreen';

export type DashboardStackParamList = {
  Dashboard: undefined;
  FarmList: undefined;
  FarmDetail: { farmId: string };
};

const Stack = createNativeStackNavigator<DashboardStackParamList>();

const DashboardNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="FarmList"
        component={FarmListScreen}
        options={{ title: 'Farms' }}
      />
      <Stack.Screen
        name="FarmDetail"
        component={FarmDetailScreen}
        options={{ title: 'Farm Details' }}
      />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;