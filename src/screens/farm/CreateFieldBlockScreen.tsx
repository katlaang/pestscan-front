// src/screens/farm/CreateFieldBlockScreen.tsx

import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { FieldBlockForm } from '../../components/forms/FieldBlockForm';
import { CreateFieldBlockRequest } from '../../types/api.types';

interface CreateFieldBlockScreenProps {
  navigation: any;
  route: {
    params: {
      farmId: string;
    };
  };
}

export const CreateFieldBlockScreen: React.FC<CreateFieldBlockScreenProps> = ({
  navigation,
  route,
}) => {
  const { farmId } = route.params;
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: CreateFieldBlockRequest) => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // await fieldBlockService.createFieldBlock(farmId, data);
      
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Success',
          'Field block created successfully!',
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
      Alert.alert('Error', 'Failed to create field block. Please try again.');
      console.error('Failed to create field block:', error);
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
      title="Create Field Block"
      showBack
      onBackPress={handleCancel}
      scroll
      padding="md"
    >
      <FieldBlockForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({});