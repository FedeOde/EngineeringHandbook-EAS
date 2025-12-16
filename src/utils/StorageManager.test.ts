/**
 * Unit tests for StorageManager
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StorageManager,
  StorageError,
  StorageErrorCode,
  BackupData,
} from './StorageManager';
import { initializeDatabase, executeQuery } from '../database/database';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../database/database');

describe('StorageManager', () => {
  let storageManager: StorageManager;

  beforeEach(() => {
    jest.clearAllMocks();
    storageManager = StorageManager.getInstance();
  });

  describe('checkStorageSpace', () => {
    it('should return storage statistics', async () => {
      const stats = await storageManager.checkStorageSpace();

      expect(stats).toHaveProperty('totalSpace');
      expect(stats).toHaveProperty('freeSpace');
      expect(stats).toHaveProperty('usedSpace');
      expect(stats).toHaveProperty('usedPercentage');
      expect(stats.totalSpace).toBeGreaterThan(0);
      expect(stats.freeSpace).toBeGreaterThan(0);
      expect(stats.usedSpace).toBeGreaterThan(0);
      expect(stats.usedPercentage).toBeGreaterThanOrEqual(0);
      expect(stats.usedPercentage).toBeLessThanOrEqual(100);
    });

    it('should calculate used percentage correctly', async () => {
      const stats = await storageManager.checkStorageSpace();
      const expectedPercentage = (stats.usedSpace / stats.totalSpace) * 100;

      expect(stats.usedPercentage).toBeCloseTo(expectedPercentage, 2);
    });
  });

  describe('validateStorageSpace', () => {
    it('should not throw when sufficient space is available', async () => {
      await expect(storageManager.validateStorageSpace()).resolves.not.toThrow();
    });

    it('should throw StorageError when insufficient space', async () => {
      // Mock insufficient space scenario
      jest.spyOn(storageManager, 'checkStorageSpace').mockResolvedValue({
        totalSpace: 100 * 1024 * 1024,
        freeSpace: 1 * 1024 * 1024, // Only 1 MB free
        usedSpace: 99 * 1024 * 1024,
        usedPercentage: 99,
      });

      await expect(storageManager.validateStorageSpace()).rejects.toThrow(StorageError);
      await expect(storageManager.validateStorageSpace()).rejects.toThrow(
        /Insufficient storage space/
      );
    });
  });

  describe('initializeAppData', () => {
    it('should initialize database and verify integrity', async () => {
      (initializeDatabase as jest.Mock).mockResolvedValue({});
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([]);
      (executeQuery as jest.Mock).mockResolvedValue([]);

      await storageManager.initializeAppData();

      expect(initializeDatabase).toHaveBeenCalled();
    });

    it('should throw StorageError on initialization failure', async () => {
      (initializeDatabase as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(storageManager.initializeAppData()).rejects.toThrow(StorageError);
    });
  });

  describe('verifyDataIntegrity', () => {
    it('should return true when data is accessible', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([]);
      (executeQuery as jest.Mock).mockResolvedValue([]);

      const result = await storageManager.verifyDataIntegrity();

      expect(result).toBe(true);
      expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
      expect(executeQuery).toHaveBeenCalledWith('SELECT 1');
    });

    it('should return false when AsyncStorage fails', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await storageManager.verifyDataIntegrity();

      expect(result).toBe(false);
    });

    it('should return false when database fails', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([]);
      (executeQuery as jest.Mock).mockRejectedValue(new Error('DB error'));

      const result = await storageManager.verifyDataIntegrity();

      expect(result).toBe(false);
    });
  });

  describe('createBackup', () => {
    beforeEach(() => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        '@app:language',
        '@sticky_notes:metadata',
      ]);
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === '@app:language') return Promise.resolve('en');
        if (key === '@sticky_notes:metadata') return Promise.resolve('[]');
        return Promise.resolve(null);
      });
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (executeQuery as jest.Mock).mockResolvedValue([
        { id: 'task1', description: 'Test task', completed: 0, created_at: 123456 },
      ]);
    });

    it('should create a backup with metadata', async () => {
      const backup = await storageManager.createBackup();

      expect(backup).toHaveProperty('metadata');
      expect(backup.metadata).toHaveProperty('timestamp');
      expect(backup.metadata).toHaveProperty('version');
      expect(backup.metadata).toHaveProperty('dataTypes');
      expect(backup.metadata).toHaveProperty('size');
      expect(backup.metadata.dataTypes).toContain('asyncStorage');
      expect(backup.metadata.dataTypes).toContain('database');
    });

    it('should backup AsyncStorage data', async () => {
      const backup = await storageManager.createBackup();

      expect(backup.asyncStorageData).toHaveProperty('@app:language');
      expect(backup.asyncStorageData['@app:language']).toBe('en');
    });

    it('should backup database data', async () => {
      const backup = await storageManager.createBackup();

      expect(backup.databaseData).toHaveProperty('tasks');
      expect(backup.databaseData.tasks).toHaveLength(1);
      expect(backup.databaseData.tasks[0].id).toBe('task1');
    });

    it('should save backup to storage', async () => {
      await storageManager.createBackup();

      expect(AsyncStorage.setItem).toHaveBeenCalled();
      const setItemCalls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const backupCall = setItemCalls.find(([key]) => key.startsWith('@backup:'));
      expect(backupCall).toBeDefined();
    });

    it('should throw StorageError on backup failure', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(storageManager.createBackup()).rejects.toThrow(StorageError);
      await expect(storageManager.createBackup()).rejects.toThrow(/Failed to create backup/);
    });
  });

  describe('restoreFromBackup', () => {
    const mockBackup: BackupData = {
      metadata: {
        timestamp: Date.now(),
        version: '1.0.0',
        dataTypes: ['asyncStorage', 'database'],
        size: 1000,
      },
      asyncStorageData: {
        '@app:language': 'es',
        '@sticky_notes:metadata': '[]',
      },
      databaseData: {
        tasks: [
          { id: 'task1', description: 'Restored task', completed: 0, created_at: 123456 },
        ],
      },
    };

    beforeEach(() => {
      (AsyncStorage.multiSet as jest.Mock).mockResolvedValue(undefined);
      (executeQuery as jest.Mock).mockResolvedValue([]);
    });

    it('should restore AsyncStorage data', async () => {
      await storageManager.restoreFromBackup(mockBackup);

      expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
        ['@app:language', 'es'],
        ['@sticky_notes:metadata', '[]'],
      ]);
    });

    it('should restore database data', async () => {
      await storageManager.restoreFromBackup(mockBackup);

      expect(executeQuery).toHaveBeenCalledWith('DELETE FROM tasks');
      expect(executeQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO tasks'),
        expect.arrayContaining(['task1', 'Restored task'])
      );
    });

    it('should throw StorageError on restore failure', async () => {
      (AsyncStorage.multiSet as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(storageManager.restoreFromBackup(mockBackup)).rejects.toThrow(StorageError);
      await expect(storageManager.restoreFromBackup(mockBackup)).rejects.toThrow(
        /Failed to restore from backup/
      );
    });
  });

  describe('getLatestBackup', () => {
    it('should return null when no backups exist', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([]);

      const backup = await storageManager.getLatestBackup();

      expect(backup).toBeNull();
    });

    it('should return the most recent backup', async () => {
      const oldBackup = {
        metadata: { timestamp: 1000, version: '1.0.0', dataTypes: [], size: 100 },
        asyncStorageData: {},
        databaseData: { tasks: [] },
      };
      const newBackup = {
        metadata: { timestamp: 2000, version: '1.0.0', dataTypes: [], size: 100 },
        asyncStorageData: {},
        databaseData: { tasks: [] },
      };

      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        '@backup:1000',
        '@backup:2000',
      ]);
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === '@backup:1000') return Promise.resolve(JSON.stringify(oldBackup));
        if (key === '@backup:2000') return Promise.resolve(JSON.stringify(newBackup));
        return Promise.resolve(null);
      });

      const backup = await storageManager.getLatestBackup();

      expect(backup).not.toBeNull();
      expect(backup?.metadata.timestamp).toBe(2000);
    });
  });

  describe('cleanupStorage', () => {
    it('should remove old backups keeping specified number', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        '@backup:1000',
        '@backup:2000',
        '@backup:3000',
        '@backup:4000',
        '@backup:5000',
      ]);
      (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

      await storageManager.cleanupStorage({ maxBackupsToKeep: 2 });

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
        expect.arrayContaining(['@backup:1000', '@backup:2000', '@backup:3000'])
      );
    });

    it('should not remove backups if under limit', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        '@backup:1000',
        '@backup:2000',
      ]);
      (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

      await storageManager.cleanupStorage({ maxBackupsToKeep: 3 });

      expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
    });

    it('should throw StorageError on cleanup failure', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(storageManager.cleanupStorage()).rejects.toThrow(StorageError);
    });
  });

  describe('clearAllData', () => {
    beforeEach(() => {
      (AsyncStorage.clear as jest.Mock).mockResolvedValue(undefined);
      (executeQuery as jest.Mock).mockResolvedValue([]);
    });

    it('should clear AsyncStorage', async () => {
      await storageManager.clearAllData();

      expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    it('should clear database tasks', async () => {
      await storageManager.clearAllData();

      expect(executeQuery).toHaveBeenCalledWith('DELETE FROM tasks');
    });

    it('should throw error on failure', async () => {
      (AsyncStorage.clear as jest.Mock).mockRejectedValue(new Error('Clear failed'));

      await expect(storageManager.clearAllData()).rejects.toThrow();
    });
  });

  describe('StorageError', () => {
    it('should create error with correct properties', () => {
      const error = new StorageError(
        'Test error',
        StorageErrorCode.INSUFFICIENT_SPACE,
        true
      );

      expect(error.message).toBe('Test error');
      expect(error.code).toBe(StorageErrorCode.INSUFFICIENT_SPACE);
      expect(error.recoverable).toBe(true);
      expect(error.name).toBe('StorageError');
    });

    it('should default recoverable to true', () => {
      const error = new StorageError('Test error', StorageErrorCode.BACKUP_FAILED);

      expect(error.recoverable).toBe(true);
    });
  });
});
