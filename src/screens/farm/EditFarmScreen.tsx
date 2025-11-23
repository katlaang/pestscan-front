// src/screens/farm/EditFarmScreen.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { FarmForm } from '../../components/forms/FarmForm';
import { CreateFarmRequest, FarmResponse } from '../../types/api.types';
import { colors, spacing } from '../../theme/theme';

interface EditFarmScreenProps {
  navigation: any;
  route: {
    params: {
      farmId: string;
    };
  };
}

export const EditFarmScreen: React.FC<EditFarmScreenProps> = ({ navigation, route }) => {
  const { farmId } = route.params;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [farmData, setFarmData] = useState<FarmResponse | null>(null);

  useEffect(() => {
    loadFarmData();
  }, [farmId]);

  const loadFarmData = async () => {
    try {
      setInitialLoading(true);
      // TODO: Implement API call
      // const data = await farmService.getFarm(farmId);
      // setFarmData(data);
      
      // Mock data
      setTimeout(() => {
        setFarmData({
          id: farmId,
          name: 'Green Valley Farm',
          description: 'Premium organic greenhouse operation',
          city: 'Portland',
          province: 'Oregon',
          country: 'USA',
          licensedAreaHectares: 5.5,
          structureType: 'GREENHOUSE' as any,
          subscriptionStatus: 'ACTIVE' as any,
          subscriptionTier: 'PREMIUM' as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ownerId: 'user-1',
        } as FarmResponse);
        setInitialLoading(false);
      }, 1000);
    } catch (error) {
      setInitialLoading(false);
      Alert.alert('Error', 'Failed to load farm data');
      navigation.goBack();
    }
  };

  const handleSubmit = async (data: CreateFarmRequest) => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // await farmService.updateFarm(farmId, data);
      
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Success',
          'Farm updated successfully!',
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
      Alert.alert('Error', 'Failed to update farm. Please try again.');
      console.error('Failed to update farm:', error);
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
      <Screen title="Edit Farm" showBack onBackPress={() => navigation.goBack()}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      title="Edit Farm"
      showBack
      onBackPress={handleCancel}
      scroll
      padding="md"
    >
      {farmData && (
        <FarmForm
          initialData={farmData}
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