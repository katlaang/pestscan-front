// src/screens/dashboard/DashboardScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Card, Button, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { DashboardStackParamList } from '../../navigation/DashboardNavigator';
import { useAuth } from '../../store/AuthContext';
import { useFarmStore } from '../../store/farmStore';
import { useScoutingStore } from '../../store/scoutingStore';
import { Role } from '../../types/api.types';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme/theme';
import { formatDate, getCurrentWeek, getCurrentYear } from '../../utils/helpers';

type Props = NativeStackScreenProps<DashboardStackParamList, 'Dashboard'>;

interface KPICardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  subtitle?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, color, subtitle }) => (
  <Card style={[styles.kpiCard, shadows.md]}>
    <View style={styles.kpiContent}>
      <View style={[styles.kpiIconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <View style={styles.kpiTextContainer}>
        <Text style={styles.kpiTitle}>{title}</Text>
        <Text style={[styles.kpiValue, { color }]}>{value}</Text>
        {subtitle && <Text style={styles.kpiSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  </Card>
);

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { user, hasRole } = useAuth();
  const { farms, currentFarm, fetchFarms } = useFarmStore();
  const { sessions, fetchSessions } = useScoutingStore();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await fetchFarms();
      
      if (currentFarm) {
        await fetchSessions(currentFarm.id);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const handleFarmSelect = () => {
    navigation.navigate('FarmList');
  };

  const handleNewSession = () => {
    if (currentFarm) {
      navigation.navigate('FarmDetail', { farmId: currentFarm.id });
    }
  };

  // Calculate KPIs
  const activeSessions = sessions.filter(s => s.status === 'IN_PROGRESS').length;
  const completedThisWeek = sessions.filter(s => {
    if (!s.completedAt) return false;
    const sessionWeek = getCurrentWeek();
    return s.status === 'COMPLETED' && sessionWeek === getCurrentWeek();
  }).length;
  
  const totalObservations = sessions.reduce((sum, session) => {
    return sum + session.sections.reduce((sectionSum, section) => {
      return sectionSum + section.observations.length;
    }, 0);
  }, 0);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.firstName}!</Text>
          <Text style={styles.date}>{formatDate(new Date(), 'EEEE, MMMM dd, yyyy')}</Text>
        </View>
        <TouchableOpacity
          style={styles.farmSelector}
          onPress={handleFarmSelect}
        >
          <Ionicons name="business" size={20} color={colors.primary} />
          <Text style={styles.farmName} numberOfLines={1}>
            {currentFarm?.name || 'Select Farm'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiContainer}>
        <KPICard
          title="Active Sessions"
          value={activeSessions}
          icon="timer"
          color={colors.info}
          subtitle="In progress"
        />
        <KPICard
          title="Completed This Week"
          value={completedThisWeek}
          icon="checkmark-circle"
          color={colors.success}
          subtitle={`Week ${getCurrentWeek()}`}
        />
        <KPICard
          title="Total Observations"
          value={totalObservations}
          icon="eye"
          color={colors.secondary}
          subtitle="All time"
        />
        <KPICard
          title="Farms"
          value={farms.length}
          icon="leaf"
          color={colors.primary}
          subtitle="Under management"
        />
      </View>

      {/* Quick Actions */}
      {hasRole([Role.MANAGER, Role.FARM_ADMIN, Role.SUPER_ADMIN]) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.primary }]}
              onPress={handleNewSession}
            >
              <Ionicons name="add-circle" size={40} color={colors.surface} />
              <Text style={styles.actionText}>New Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.secondary }]}
              onPress={() => navigation.navigate('FarmList')}
            >
              <Ionicons name="analytics" size={40} color={colors.surface} />
              <Text style={styles.actionText}>View Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.accent }]}
              onPress={() => navigation.navigate('FarmList')}
            >
              <Ionicons name="document-text" size={40} color={colors.surface} />
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.warning }]}
              onPress={handleFarmSelect}
            >
              <Ionicons name="settings" size={40} color={colors.surface} />
              <Text style={styles.actionText}>Manage Farms</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <Button
              mode="text"
              onPress={() => {/* Navigate to all sessions */}}
              compact
            >
              View All
            </Button>
          </View>
          
          {sessions.slice(0, 3).map((session) => (
            <Card key={session.id} style={[styles.sessionCard, shadows.sm]}>
              <Card.Content>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionTitle}>
                    {formatDate(session.sessionDate)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(session.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {session.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
                {session.crop && (
                  <Text style={styles.sessionDetail}>
                    Crop: {session.crop} {session.variety ? `(${session.variety})` : ''}
                  </Text>
                )}
                <Text style={styles.sessionDetail}>
                  Week {session.weekNumber} • {session.sections.length} sections
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}

      {/* Empty State */}
      {sessions.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="clipboard-outline" size={80} color={colors.border} />
          <Text style={styles.emptyTitle}>No Sessions Yet</Text>
          <Text style={styles.emptyText}>
            {hasRole(Role.SCOUT)
              ? 'Wait for your manager to assign a session'
              : 'Create your first scouting session to get started'}
          </Text>
          {hasRole([Role.MANAGER, Role.FARM_ADMIN, Role.SUPER_ADMIN]) && (
            <Button
              mode="contained"
              onPress={handleNewSession}
              style={styles.emptyButton}
            >
              Create Session
            </Button>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    DRAFT: colors.textSecondary,
    IN_PROGRESS: colors.info,
    COMPLETED: colors.success,
    CANCELLED: colors.error,
  };
  return statusColors[status] || colors.textSecondary;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  farmSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  farmName: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  kpiCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  kpiContent: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
  },
  kpiIconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  kpiTextContainer: {
    flex: 1,
  },
  kpiTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  kpiValue: {
    ...typography.h2,
    fontWeight: 'bold',
  },
  kpiSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    minWidth: '47%',
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  actionText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  sessionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sessionTitle: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sessionDetail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
});

export default DashboardScreen;