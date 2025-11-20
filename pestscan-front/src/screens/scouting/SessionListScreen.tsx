// src/screens/scouting/SessionListScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { FAB, SegmentedButtons } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScoutingStackParamList } from '../../navigation/ScoutingNavigator';
import { useScoutingStore } from '../../store/scoutingStore';
import { useFarmStore } from '../../store/farmStore';
import { useAuth } from '../../store/AuthContext';
import { SessionCard } from '../../components/cards/SessionCard';
import { LoadingSpinner, EmptyState, SearchBar } from '../../components/common';
import { colors, spacing } from '../../theme/theme';
import { Role, SessionStatus } from '../../types/api.types';

type Props = NativeStackScreenProps<ScoutingStackParamList, 'SessionList'>;

const SessionListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { hasRole } = useAuth();
  const { currentFarm } = useFarmStore();
  const { sessions, isLoading, fetchSessions } = useScoutingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    if (currentFarm) {
      loadSessions();
    }
  }, [currentFarm]);

  const loadSessions = async () => {
    if (currentFarm) {
      await fetchSessions(currentFarm.id);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSessions();
    setIsRefreshing(false);
  };

  const handleSessionPress = (sessionId: string) => {
    navigation.navigate('SessionDetail', { sessionId });
  };

  const handleCreateSession = () => {
    if (currentFarm) {
      navigation.navigate('CreateSession', { farmId: currentFarm.id });
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch =
      session.crop?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.variety?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || session.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading && sessions.length === 0) {
    return <LoadingSpinner message="Loading sessions..." />;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search sessions..."
      />

      <SegmentedButtons
        value={statusFilter}
        onValueChange={setStatusFilter}
        buttons={[
          { value: 'ALL', label: 'All' },
          { value: SessionStatus.DRAFT, label: 'Draft' },
          { value: SessionStatus.IN_PROGRESS, label: 'Active' },
          { value: SessionStatus.COMPLETED, label: 'Done' },
        ]}
        style={styles.filter}
      />

      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() => handleSessionPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-outline"
            title="No Sessions Found"
            message={
              searchQuery || statusFilter !== 'ALL'
                ? 'No sessions match your filters'
                : hasRole(Role.SCOUT)
                ? 'No sessions assigned yet'
                : 'Create your first scouting session'
            }
            actionLabel={
              hasRole([Role.MANAGER, Role.FARM_ADMIN, Role.SUPER_ADMIN])
                ? 'Create Session'
                : undefined
            }
            onAction={
              hasRole([Role.MANAGER, Role.FARM_ADMIN, Role.SUPER_ADMIN])
                ? handleCreateSession
                : undefined
            }
          />
        }
      />

      {hasRole([Role.MANAGER, Role.FARM_ADMIN, Role.SUPER_ADMIN]) && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleCreateSession}
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
  filter: {
    marginBottom: spacing.md,
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

export default SessionListScreen;