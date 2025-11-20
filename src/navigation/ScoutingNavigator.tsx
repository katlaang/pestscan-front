// src/navigation/ScoutingNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SessionListScreen from '../screens/scouting/SessionListScreen';
import SessionDetailScreen from '../screens/scouting/SessionDetailScreen';
import CreateSessionScreen from '../screens/scouting/CreateSessionScreen';
import ObservationGridScreen from '../screens/scouting/ObservationGridScreen';

export type ScoutingStackParamList = {
  SessionList: { farmId?: string };
  SessionDetail: { sessionId: string };
  CreateSession: { farmId: string };
  ObservationGrid: { sessionId: string; targetId: string };
};

const Stack = createNativeStackNavigator<ScoutingStackParamList>();

const ScoutingNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SessionList"
        component={SessionListScreen}
        options={{ title: 'Scouting Sessions' }}
      />
      <Stack.Screen
        name="SessionDetail"
        component={SessionDetailScreen}
        options={{ title: 'Session Details' }}
      />
      <Stack.Screen
        name="CreateSession"
        component={CreateSessionScreen}
        options={{ title: 'New Session' }}
      />
      <Stack.Screen
        name="ObservationGrid"
        component={ObservationGridScreen}
        options={{ title: 'Record Observations' }}
      />
    </Stack.Navigator>
  );
};

export default ScoutingNavigator;