/**
 * StorageManager
 * Centralized storage management utility for data persistence, backup, and cleanup
 * 
 * Handles:
 * - Storage space checking
 * - Error handling for insufficient storage
 * - Data restoration on app restart
 * - Storage cleanup utilities
 * - Backup and restore functionality
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeDatabase, getDatabase, executeQuery } from '../database/database';

/**
 * Storage error types
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code: StorageErrorCode,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export enum StorageErrorCode {
  INSUFFICIENT_SPACE = 'INSUFFICIENT_SPACE',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  CORRUPTED_DATA = 'CORRUPTED_DATA',
  BACKUP_FAILED = 'BACKUP_FAILED',
  RESTORE_FAILED = 'RESTORE_FAILED',
  CLEANUP_FAILED = 'CLEANUP_FAILED',
}

/**
 * Storage statistics
 */
export interface StorageStats {
  totalSpace: number; // bytes
  freeSpace: number; // bytes
  usedSpace: number; // bytes
  usedPercentage: number;
}

/**
 * Backup metadata
 */
export interface BackupMetadata {
  timestamp: number;
  version: string;
  dataTypes: string[];
  size: number; // bytes
}

/**
 * Backup data structure
 */
export interface BackupData {
  metadata: BackupMetadata;
  asyncStorageData: Record<string, string>;
  databaseData: {
    tasks: any[];
  };
}

/**
 * Storage configuration
 */
const STORAGE_CONFIG = {
  MIN_FREE_SPACE_MB: 10, // Minimum free space required (MB)
  WARNING_THRESHOLD_PERCENT: 90, // Warn when storage is 90% full
  BACKUP_KEY_PREFIX: '@backup:',
  APP_VERSION: '1.0.0',
};

/**
 * StorageManager class
 */
export class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  /**
   * Gets the singleton instance
   */
  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * Checks available storage space
   * Note: React Native doesn't provide direct API for storage space
   * This is a mock implementation - in production, use react-native-fs or similar
   */
  async checkStorageSpace(): Promise<StorageStats> {
    try {
      // Mock implementation
      // In production, use: import RNFS from 'react-native-fs';
      // const freeSpace = await RNFS.getFSInfo();
      
      const mockTotalSpace = 10 * 1024 * 1024 * 1024; // 10 GB
      const mockFreeSpace = 2 * 1024 * 1024 * 1024; // 2 GB
      const mockUsedSpace = mockTotalSpace - mockFreeSpace;

      return {
        totalSpace: mockTotalSpace,
        freeSpace: mockFreeSpace,
        usedSpace: mockUsedSpace,
        usedPercentage: (mockUsedSpace / mockTotalSpace) * 100,
      };
    } catch (error) {
      console.error('Error checking storage space:', error);
      throw new StorageError(
        'Failed to check storage space',
        StorageErrorCode.PERMISSION_DENIED,
        false
      );
    }
  }

  /**
   * Validates that sufficient storage space is available
   * @throws StorageError if insufficient space
   */
  async validateStorageSpace(): Promise<void> {
    const stats = await this.checkStorageSpace();
    const minFreeSpaceBytes = STORAGE_CONFIG.MIN_FREE_SPACE_MB * 1024 * 1024;

    if (stats.freeSpace < minFreeSpaceBytes) {
      throw new StorageError(
        `Insufficient storage space. At least ${STORAGE_CONFIG.MIN_FREE_SPACE_MB}MB required.`,
        StorageErrorCode.INSUFFICIENT_SPACE,
        true
      );
    }

    if (stats.usedPercentage > STORAGE_CONFIG.WARNING_THRESHOLD_PERCENT) {
      console.warn(
        `Storage is ${stats.usedPercentage.toFixed(1)}% full. Consider cleaning up data.`
      );
    }
  }

  /**
   * Initializes application data on startup
   * Restores all user data and ensures database is ready
   */
  async initializeAppData(): Promise<void> {
    try {
      console.log('Initializing application data...');

      // Initialize database
      await initializeDatabase();

      // Verify data integrity
      await this.verifyDataIntegrity();

      console.log('Application data initialized successfully');
    } catch (error) {
      console.error('Error initializing app data:', error);
      throw new StorageError(
        'Failed to initialize application data',
        StorageErrorCode.CORRUPTED_DATA,
        false
      );
    }
  }

  /**
   * Verifies data integrity across all storage systems
   */
  async verifyDataIntegrity(): Promise<boolean> {
    try {
      // Check AsyncStorage accessibility
      await AsyncStorage.getAllKeys();

      // Check database accessibility
      const db = getDatabase();
      await executeQuery('SELECT 1');

      return true;
    } catch (error) {
      console.error('Data integrity check failed:', error);
      return false;
    }
  }

  /**
   * Creates a backup of all user data
   */
  async createBackup(): Promise<BackupData> {
    try {
      await this.validateStorageSpace();

      console.log('Creating backup...');

      // Backup AsyncStorage data
      const asyncStorageData = await this.backupAsyncStorage();

      // Backup database data
      const databaseData = await this.backupDatabase();

      const backup: BackupData = {
        metadata: {
          timestamp: Date.now(),
          version: STORAGE_CONFIG.APP_VERSION,
          dataTypes: ['asyncStorage', 'database'],
          size: JSON.stringify({ asyncStorageData, databaseData }).length,
        },
        asyncStorageData,
        databaseData,
      };

      // Save backup to storage
      await this.saveBackup(backup);

      console.log('Backup created successfully');
      return backup;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new StorageError(
        'Failed to create backup',
        StorageErrorCode.BACKUP_FAILED,
        true
      );
    }
  }

  /**
   * Restores data from a backup
   */
  async restoreFromBackup(backup: BackupData): Promise<void> {
    try {
      console.log('Restoring from backup...');

      // Restore AsyncStorage data
      await this.restoreAsyncStorage(backup.asyncStorageData);

      // Restore database data
      await this.restoreDatabase(backup.databaseData);

      console.log('Restore completed successfully');
    } catch (error) {
      console.error('Error restoring from backup:', error);
      throw new StorageError(
        'Failed to restore from backup',
        StorageErrorCode.RESTORE_FAILED,
        false
      );
    }
  }

  /**
   * Gets the most recent backup
   */
  async getLatestBackup(): Promise<BackupData | null> {
    try {
      const backupKeys = await this.getBackupKeys();
      if (backupKeys.length === 0) {
        return null;
      }

      // Sort by timestamp (newest first)
      backupKeys.sort((a, b) => {
        const timestampA = parseInt(a.split(':')[1] || '0');
        const timestampB = parseInt(b.split(':')[1] || '0');
        return timestampB - timestampA;
      });

      const latestKey = backupKeys[0];
      const backupJson = await AsyncStorage.getItem(latestKey);
      
      if (!backupJson) {
        return null;
      }

      return JSON.parse(backupJson);
    } catch (error) {
      console.error('Error getting latest backup:', error);
      return null;
    }
  }

  /**
   * Cleans up old data and frees storage space
   */
  async cleanupStorage(options?: {
    removeOldBackups?: boolean;
    maxBackupsToKeep?: number;
  }): Promise<void> {
    try {
      console.log('Cleaning up storage...');

      const { removeOldBackups = true, maxBackupsToKeep = 3 } = options || {};

      if (removeOldBackups) {
        await this.cleanupOldBackups(maxBackupsToKeep);
      }

      console.log('Storage cleanup completed');
    } catch (error) {
      console.error('Error cleaning up storage:', error);
      throw new StorageError(
        'Failed to cleanup storage',
        StorageErrorCode.CLEANUP_FAILED,
        true
      );
    }
  }

  /**
   * Clears all application data (for testing or reset)
   */
  async clearAllData(): Promise<void> {
    try {
      console.log('Clearing all application data...');

      // Clear AsyncStorage
      await AsyncStorage.clear();

      // Clear database
      const db = getDatabase();
      await executeQuery('DELETE FROM tasks');

      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  // Private helper methods

  private async backupAsyncStorage(): Promise<Record<string, string>> {
    const keys = await AsyncStorage.getAllKeys();
    const data: Record<string, string> = {};

    for (const key of keys) {
      // Skip backup keys themselves
      if (key.startsWith(STORAGE_CONFIG.BACKUP_KEY_PREFIX)) {
        continue;
      }

      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        data[key] = value;
      }
    }

    return data;
  }

  private async backupDatabase(): Promise<{ tasks: any[] }> {
    const tasks = await executeQuery('SELECT * FROM tasks');
    return { tasks };
  }

  private async restoreAsyncStorage(data: Record<string, string>): Promise<void> {
    const entries: [string, string][] = Object.entries(data);
    await AsyncStorage.multiSet(entries);
  }

  private async restoreDatabase(data: { tasks: any[] }): Promise<void> {
    // Clear existing data
    await executeQuery('DELETE FROM tasks');

    // Restore tasks
    for (const task of data.tasks) {
      await executeQuery(
        `INSERT INTO tasks (id, description, completed, created_at, completed_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          task.id,
          task.description,
          task.completed,
          task.created_at,
          task.completed_at,
        ]
      );
    }
  }

  private async saveBackup(backup: BackupData): Promise<void> {
    const key = `${STORAGE_CONFIG.BACKUP_KEY_PREFIX}${backup.metadata.timestamp}`;
    await AsyncStorage.setItem(key, JSON.stringify(backup));
  }

  private async getBackupKeys(): Promise<string[]> {
    const allKeys = await AsyncStorage.getAllKeys();
    return allKeys.filter((key) => key.startsWith(STORAGE_CONFIG.BACKUP_KEY_PREFIX));
  }

  private async cleanupOldBackups(maxToKeep: number): Promise<void> {
    const backupKeys = await this.getBackupKeys();

    if (backupKeys.length <= maxToKeep) {
      return;
    }

    // Sort by timestamp (newest first)
    backupKeys.sort((a, b) => {
      const timestampA = parseInt(a.split(':')[1] || '0');
      const timestampB = parseInt(b.split(':')[1] || '0');
      return timestampB - timestampA;
    });

    // Remove old backups
    const keysToRemove = backupKeys.slice(maxToKeep);
    await AsyncStorage.multiRemove(keysToRemove);

    console.log(`Removed ${keysToRemove.length} old backups`);
  }
}

// Export singleton instance
export const storageManager = StorageManager.getInstance();
