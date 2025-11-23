// src/screens/farm/CreateGreenhouseScreen.tsx

import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { GreenhouseForm } from '../../components/forms/GreenhouseForm';
import { CreateGreenhouseRequest } from '../../types/api.types';

interface CreateGreenhouseScreenProps {
  navigation: any;
  route: {
    params: {
      farmId: string;
    };
  };
}

export const CreateGreenhouseScreen: React.FC<CreateGreenhouseScreenProps> = ({
  navigation,
  route,
}) => {
  const { farmId } = route.params;
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: CreateGreenhouseRequest) => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // await greenhouseService.createGreenhouse(farmId, data);
      
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Success',
          'Greenhouse created successfully!',
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
      Alert.alert('Error', 'Failed to create greenhouse. Please try again.');
      console.error('Failed to create greenhouse:', error);
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

  return (
    <Screen
      title="Create Greenhouse"
      showBack
      onBackPress={handleCancel}
      scroll
      padding="md"
    >
      <GreenhouseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({});