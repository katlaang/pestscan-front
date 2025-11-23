import { axiosInstance } from './api.client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SyncStatus {
  lastSyncAt?: string;
  isSyncing: boolean;
  pendingChanges: number;
  failedChanges: number;
}

export interface PendingChange {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'OBSERVATION' | 'SESSION' | 'PHOTO' | 'OTHER';
  data: any;
  timestamp: string;
  attempts: number;
  lastError?: string;
}

const SYNC_STORAGE_KEY = '@pestscan/sync';
const PENDING_CHANGES_KEY = '@pestscan/pending_changes';
const MAX_RETRY_ATTEMPTS = 3;

class SyncService {
  private syncInProgress = false;
  private listeners: Array<(status: SyncStatus) => void> = [];

  /**
   * Get current sync status
   */
  async getSyncStatus(): Promise<SyncStatus> {
    const statusStr = await AsyncStorage.getItem(SYNC_STORAGE_KEY);
    const status: SyncStatus = statusStr
      ? JSON.parse(statusStr)
      : {
          isSyncing: false,
          pendingChanges: 0,
          failedChanges: 0,
        };

    const pendingChanges = await this.getPendingChanges();
    status.pendingChanges = pendingChanges.length;
    status.failedChanges = pendingChanges.filter((c) => c.attempts >= MAX_RETRY_ATTEMPTS).length;

    return status;
  }

  /**
   * Subscribe to sync status changes
   */
  subscribe(listener: (status: SyncStatus) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notify all listeners of status change
   */
  private async notifyListeners(): Promise<void> {
    const status = await this.getSyncStatus();
    this.listeners.forEach((listener) => listener(status));
  }

  /**
   * Get pending changes
   */
  async getPendingChanges(): Promise<PendingChange[]> {
    const changesStr = await AsyncStorage.getItem(PENDING_CHANGES_KEY);
    return changesStr ? JSON.parse(changesStr) : [];
  }

  /**
   * Add a pending change
   */
  async addPendingChange(
    type: PendingChange['type'],
    entity: PendingChange['entity'],
    data: any
  ): Promise<void> {
    const changes = await this.getPendingChanges();
    const newChange: PendingChange = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      entity,
      data,
      timestamp: new Date().toISOString(),
      attempts: 0,
    };

    changes.push(newChange);
    await AsyncStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(changes));
    await this.notifyListeners();
  }

  /**
   * Remove a pending change
   */
  async removePendingChange(changeId: string): Promise<void> {
    let changes = await this.getPendingChanges();
    changes = changes.filter((c) => c.id !== changeId);
    await AsyncStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(changes));
    await this.notifyListeners();
  }

  /**
   * Update a pending change (increment attempts, add error)
   */
  async updatePendingChange(changeId: string, error?: string): Promise<void> {
    const changes = await this.getPendingChanges();
    const change = changes.find((c) => c.id === changeId);
    
    if (change) {
      change.attempts += 1;
      if (error) {
        change.lastError = error;
      }
      await AsyncStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(changes));
      await this.notifyListeners();
    }
  }

  /**
   * Sync a single change
   */
  private async syncChange(change: PendingChange): Promise<boolean> {
    try {
      switch (change.entity) {
        case 'OBSERVATION':
          await this.syncObservation(change);
          break;
        case 'SESSION':
          await this.syncSession(change);
          break;
        case 'PHOTO':
          await this.syncPhoto(change);
          break;
        default:
          throw new Error(`Unknown entity type: ${change.entity}`);
      }
      return true;
    } catch (error: any) {
      console.error(`Failed to sync change ${change.id}:`, error);
      await this.updatePendingChange(change.id, error.message);
      return false;
    }
  }

  /**
   * Sync observation change
   */
  private async syncObservation(change: PendingChange): Promise<void> {
    switch (change.type) {
      case 'CREATE':
        await axiosInstance.post('/observations', change.data);
        break;
      case 'UPDATE':
        await axiosInstance.put(`/observations/${change.data.id}`, change.data);
        break;
      case 'DELETE':
        await axiosInstance.delete(`/observations/${change.data.id}`);
        break;
    }
  }

  /**
   * Sync session change
   */
  private async syncSession(change: PendingChange): Promise<void> {
    switch (change.type) {
      case 'CREATE':
        await axiosInstance.post('/sessions', change.data);
        break;
      case 'UPDATE':
        await axiosInstance.put(`/sessions/${change.data.id}`, change.data);
        break;
      case 'DELETE':
        await axiosInstance.delete(`/sessions/${change.data.id}`);
        break;
    }
  }

  /**
   * Sync photo change
   */
  private async syncPhoto(change: PendingChange): Promise<void> {
    switch (change.type) {
      case 'CREATE':
        const formData = new FormData();
        formData.append('file', change.data.file);
        formData.append('entityType', change.data.entityType);
        formData.append('entityId', change.data.entityId);
        await axiosInstance.post('/photos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        break;
      case 'DELETE':
        await axiosInstance.delete(`/photos/${change.data.id}`);
        break;
    }
  }

  /**
   * Perform full sync
   */
  async sync(): Promise<{ success: boolean; synced: number; failed: number }> {
    if (this.syncInProgress) {
      console.log('Sync already in progress');
      return { success: false, synced: 0, failed: 0 };
    }

    this.syncInProgress = true;
    let synced = 0;
    let failed = 0;

    try {
      // Update status
      await AsyncStorage.setItem(
        SYNC_STORAGE_KEY,
        JSON.stringify({
          isSyncing: true,
          lastSyncAt: new Date().toISOString(),
        })
      );
      await this.notifyListeners();

      // Get pending changes
      const changes = await this.getPendingChanges();
      console.log(`Syncing ${changes.length} pending changes`);

      // Process each change
      for (const change of changes) {
        if (change.attempts >= MAX_RETRY_ATTEMPTS) {
          console.log(`Skipping change ${change.id} - max attempts reached`);
          failed++;
          continue;
        }

        const success = await this.syncChange(change);
        if (success) {
          await this.removePendingChange(change.id);
          synced++;
        } else {
          failed++;
        }
      }

      return { success: true, synced, failed };
    } catch (error) {
      console.error('Sync failed:', error);
      return { success: false, synced, failed };
    } finally {
      this.syncInProgress = false;
      await AsyncStorage.setItem(
        SYNC_STORAGE_KEY,
        JSON.stringify({
          isSyncing: false,
          lastSyncAt: new Date().toISOString(),
        })
      );
      await this.notifyListeners();
    }
  }

  /**
   * Clear all pending changes
   */
  async clearPendingChanges(): Promise<void> {
    await AsyncStorage.removeItem(PENDING_CHANGES_KEY);
    await this.notifyListeners();
  }

  /**
   * Clear failed changes only
   */
  async clearFailedChanges(): Promise<void> {
    let changes = await this.getPendingChanges();
    changes = changes.filter((c) => c.attempts < MAX_RETRY_ATTEMPTS);
    await AsyncStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(changes));
    await this.notifyListeners();
  }

  /**
   * Check if online
   */
  async isOnline(): Promise<boolean> {
    try {
      const response = await axiosInstance.get('/health', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export const syncService = new SyncService();