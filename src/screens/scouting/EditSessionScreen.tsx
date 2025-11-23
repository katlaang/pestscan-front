import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { SessionForm } from '../../components/forms/SessionForm';
import { CreateScoutingSessionRequest, ScoutingSessionDetailDto } from '../../types/api.types';
import { colors, spacing } from '../../theme/theme';

interface EditSessionScreenProps {
  navigation: any;
  route: {
    params: {
      sessionId: string;
    };
  };
}

export const EditSessionScreen: React.FC<EditSessionScreenProps> = ({
  navigation,
  route,
}) => {
  const { sessionId } = route.params;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sessionData, setSessionData] = useState<ScoutingSessionDetailDto | null>(null);

  useEffect(() => {
    loadSessionData();
  }, [sessionId]);

  const loadSessionData = async () => {
    try {
      setInitialLoading(true);
      // TODO: Implement API call
      // const data = await scoutingService.getSession(sessionId);
      // setSessionData(data);

      // Mock data
      setTimeout(() => {
        setSessionData({
          id: sessionId,
          farmId: 'farm-1',
          sessionDate: '2024-11-23',
          weekNumber: 47,
          status: 'DRAFT' as any,
          crop: 'Tomatoes',
          variety: 'Roma',
          temperatureCelsius: 22,
          relativeHumidityPercent: 65,
          notes: 'Initial observations',
          confirmationAcknowledged: false,
          sections: [],
          recommendations: [],
        });
        setInitialLoading(false);
      }, 1000);
    } catch (error) {
      setInitialLoading(false);
      Alert.alert('Error', 'Failed to load session data');
      navigation.goBack();
    }
  };

  const handleSubmit = async (data: CreateScoutingSessionRequest) => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // await scoutingService.updateSession(sessionId, data);

      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Success',
          'Session updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to update session. Please try again.');
      console.error('Failed to update session:', error);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? All unsaved changes will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (initialLoading) {
    return (
      <Screen title="Edit Session" showBack onBackPress={() => navigation.goBack()}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      title="Edit Session"
      showBack
      onBackPress={handleCancel}
      scroll
      padding="md"
    >
      {sessionData && (
        <SessionForm
          farmId={sessionData.farmId}
          initialData={sessionData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});
export default EditSessionScreen