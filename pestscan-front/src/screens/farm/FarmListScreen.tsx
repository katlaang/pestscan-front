// src/screens/farm/FarmListScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { FAB } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../../navigation/DashboardNavigator';
import { useFarmStore } from '../../store/farmStore';
import { useAuth } from '../../store/AuthContext';
import { FarmCard } from '../../components/cards/FarmCard';
import { LoadingSpinner, EmptyState, SearchBar } from '../../components/common';
import { colors, spacing } from '../../theme/theme';
import { Role } from '../../types/api.types';

type Props = NativeStackScreenProps<DashboardStackParamList, 'FarmList'>;

const FarmListScreen: React.FC<Props> = ({ navigation }) => {
  const { hasRole } = useAuth();
  const { farms, isLoading, fetchFarms, setCurrentFarm } = useFarmStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    await fetchFarms();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadFarms();
    setIsRefreshing(false);
  };

  const handleFarmPress = (farmId: string) => {
    const farm = farms.find(f => f.id === farmId);
    if (farm) {
      setCurrentFarm(farm);
      navigation.navigate('FarmDetail', { farmId });
    }
  };

  const filteredFarms = farms.filter(farm =>
    farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.farmTag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && farms.length === 0) {
    return <LoadingSpinner message="Loading farms..." />;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search farms..."
      />

      <FlatList
        data={filteredFarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FarmCard
            farm={item}
            onPress={() => handleFarmPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="leaf-outline"
            title="No Farms Found"
            message={
              searchQuery
                ? 'No farms match your search'
                : 'You don\'t have any farms yet'
            }
            actionLabel={hasRole([Role.SUPER_ADMIN]) ? 'Create Farm' : undefined}
            onAction={
              hasRole([Role.SUPER_ADMIN])
                ? () => {/* Navigate to create farm */}
                : undefined
            }
          />
        }
      />

      {hasRole([Role.SUPER_ADMIN]) && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => {/* Navigate to create farm */}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  listContent: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default FarmListScreen;