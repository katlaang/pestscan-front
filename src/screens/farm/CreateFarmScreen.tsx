// src/screens/farm/CreateFarmScreen.tsx

import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { FarmForm } from '../../components/forms/FarmForm';
import { CreateFarmRequest } from '../../types/api.types';

interface CreateFarmScreenProps {
  navigation: any;
  route: any;
}

export const CreateFarmScreen: React.FC<CreateFarmScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: CreateFarmRequest) => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const response = await farmService.createFarm(data);
      
      // Mock API call
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Success',
          'Farm created successfully!',
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
      Alert.alert('Error', 'Failed to create farm. Please try again.');
      console.error('Failed to create farm:', error);
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
      title="Create Farm"
      showBack
      onBackPress={handleCancel}
      scroll
      padding="md"
    >
      <FarmForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({});