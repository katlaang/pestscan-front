import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ObservationForm } from '../../components/forms/ObservationForm';
import { UpsertObservationRequest } from '../../types/api.types';

interface RecordObservationScreenProps {
  navigation: any;
  route: {
    params: {
      sessionId: string;
      sessionTargetId?: string;
    };
  };
}

export const RecordObservationScreen: React.FC<RecordObservationScreenProps> = ({
  navigation,
  route,
}) => {
  const { sessionId, sessionTargetId } = route.params;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: UpsertObservationRequest) => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // await scoutingService.createObservation(data);

      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Success',
          'Observation recorded successfully!',
          [
            {
              text: 'Add Another',
              onPress: () => {
                // Reset form or stay on page
              },
            },
            {
              text: 'Done',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to record observation. Please try again.');
      console.error('Failed to record observation:', error);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? All unsaved changes will be lost.',
      [
        { text: 'Continue Recording', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <Screen
      title="Record Observation"
      showBack
      onBackPress={handleCancel}
      scroll
      padding="md"
    >
      <ObservationForm
        sessionId={sessionId}
        sessionTargetId={sessionTargetId || 'default-target'}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({});
export default RecordObservationScreen