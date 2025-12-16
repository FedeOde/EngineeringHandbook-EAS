/**
 * Unit tests for AppInitializationService
 */

import {
  AppInitializationService,
  InitializationResult,
} from './AppInitializationService';
import { storageManager, StorageError, StorageErrorCode } from '../utils/StorageManager';
import { LanguageService } from './LanguageService';

// Mock dependencies
jest.mock('../utils/StorageManager');
jest.mock('./LanguageService');

describe('AppInitializationService', () => {
  let service: AppInitializationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = AppInitializationService.getInstance();
    service.reset();

    // Setup default mocks
    (storageManager.validateStorageSpace as jest.Mock).mockResolvedValue(undefined);
    (storageManager.initializeAppData as jest.Mock).mockResolvedValue(undefined);
    (storageManager.verifyDataIntegrity as jest.Mock).mockResolvedValue(true);
    (storageManager.cleanupStorage as jest.Mock).mockResolvedValue(undefined);
    (LanguageService.initialize as jest.Mock).mockResolvedValue(undefined);
  });

  describe('initialize', () => {
    it('should successfully initialize the application', async () => {
      const result = await service.initialize();

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(storageManager.validateStorageSpace).toHaveBeenCalled();
      expect(LanguageService.initialize).toHaveBeenCalled();
      expect(storageManager.initializeAppData).toHaveBeenCalled();
      expect(storageManager.verifyDataIntegrity).toHaveBeenCalled();
    });

    it('should not reinitialize if already initialized', async () => {
      await service.initialize();
      const result = await service.initialize();

      expect(result.success).toBe(true);
      expect(result.warnings).toContain('Application already initialized');
    });

    it('should handle insufficient storage warning', async () => {
      (storageManager.validateStorageSpace as jest.Mock).mockRejectedValue(
        new StorageError(
          'Insufficient storage space',
          StorageErrorCode.INSUFFICIENT_SPACE,
          true
        )
      );

      const result = await service.initialize();

      expect(result.success).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Insufficient storage space');
    });

    it('should handle language initialization failure', async () => {
      (LanguageService.initialize as jest.Mock).mockRejectedValue(
        new Error('Language init failed')
      );

      const result = await service.initialize();

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Language initialization failed');
    });

    it('should handle data corruption and attempt recovery', async () => {
      (storageManager.initializeAppData as jest.Mock).mockRejectedValue(
        new StorageError('Data corrupted', StorageErrorCode.CORRUPTED_DATA, false)
      );
      (storageManager.getLatestBackup as jest.Mock).mockResolvedValue({
        metadata: { timestamp: Date.now(), version: '1.0.0', dataTypes: [], size: 100 },
        asyncStorageData: {},
        databaseData: { tasks: [] },
      });
      (storageManager.restoreFromBackup as jest.Mock).mockResolvedValue(undefined);

      const result = await service.initialize({ restoreFromBackup: true });

      expect(result.warnings).toContain('Data corruption detected. Attempting recovery...');
      expect(result.dataRestored).toBe(true);
      expect(storageManager.getLatestBackup).toHaveBeenCalled();
      expect(storageManager.restoreFromBackup).toHaveBeenCalled();
    });

    it('should handle failed data recovery', async () => {
      (storageManager.initializeAppData as jest.Mock).mockRejectedValue(
        new StorageError('Data corrupted', StorageErrorCode.CORRUPTED_DATA, false)
      );
      (storageManager.getLatestBackup as jest.Mock).mockResolvedValue(null);

      const result = await service.initialize({ restoreFromBackup: true });

      expect(result.dataRestored).toBe(false);
      expect(result.errors).toContain('Data recovery failed. Starting with fresh data.');
    });

    it('should handle data integrity check failure', async () => {
      (storageManager.verifyDataIntegrity as jest.Mock).mockResolvedValue(false);

      const result = await service.initialize();

      expect(result.warnings).toContain(
        'Data integrity check failed. Some data may be unavailable.'
      );
    });

    it('should cleanup old data when requested', async () => {
      await service.initialize({ cleanupOldData: true });

      expect(storageManager.cleanupStorage).toHaveBeenCalledWith({
        removeOldBackups: true,
        maxBackupsToKeep: 3,
      });
    });

    it('should not cleanup when disabled', async () => {
      await service.initialize({ cleanupOldData: false });

      expect(storageManager.cleanupStorage).not.toHaveBeenCalled();
    });

    it('should handle cleanup failure gracefully', async () => {
      (storageManager.cleanupStorage as jest.Mock).mockRejectedValue(
        new Error('Cleanup failed')
      );

      const result = await service.initialize({ cleanupOldData: true });

      expect(result.success).toBe(true);
      expect(result.warnings.some((w) => w.includes('Cleanup failed'))).toBe(true);
    });

    it('should handle critical initialization errors', async () => {
      (storageManager.initializeAppData as jest.Mock).mockRejectedValue(
        new Error('Critical error')
      );

      const result = await service.initialize({ restoreFromBackup: false });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Critical error');
    });

    it('should skip storage validation when disabled', async () => {
      await service.initialize({ validateStorage: false });

      expect(storageManager.validateStorageSpace).not.toHaveBeenCalled();
    });
  });

  describe('isInitialized', () => {
    it('should return false before initialization', () => {
      expect(service.isInitialized()).toBe(false);
    });

    it('should return true after successful initialization', async () => {
      await service.initialize();

      expect(service.isInitialized()).toBe(true);
    });

    it('should return false after reset', async () => {
      await service.initialize();
      service.reset();

      expect(service.isInitialized()).toBe(false);
    });
  });

  describe('shutdown', () => {
    it('should create a backup on shutdown', async () => {
      (storageManager.createBackup as jest.Mock).mockResolvedValue({
        metadata: { timestamp: Date.now(), version: '1.0.0', dataTypes: [], size: 100 },
        asyncStorageData: {},
        databaseData: { tasks: [] },
      });

      await service.shutdown();

      expect(storageManager.createBackup).toHaveBeenCalled();
    });

    it('should throw error if backup fails', async () => {
      (storageManager.createBackup as jest.Mock).mockRejectedValue(
        new Error('Backup failed')
      );

      await expect(service.shutdown()).rejects.toThrow('Backup failed');
    });
  });

  describe('handleStorageError', () => {
    it('should return user-friendly message for insufficient space', () => {
      const error = new StorageError(
        'Test',
        StorageErrorCode.INSUFFICIENT_SPACE,
        true
      );

      const message = service.handleStorageError(error);

      expect(message).toContain('Storage space is running low');
    });

    it('should return user-friendly message for permission denied', () => {
      const error = new StorageError(
        'Test',
        StorageErrorCode.PERMISSION_DENIED,
        false
      );

      const message = service.handleStorageError(error);

      expect(message).toContain('Storage access denied');
    });

    it('should return user-friendly message for corrupted data', () => {
      const error = new StorageError('Test', StorageErrorCode.CORRUPTED_DATA, false);

      const message = service.handleStorageError(error);

      expect(message).toContain('Data corruption detected');
    });

    it('should return user-friendly message for backup failed', () => {
      const error = new StorageError('Test', StorageErrorCode.BACKUP_FAILED, true);

      const message = service.handleStorageError(error);

      expect(message).toContain('Failed to create backup');
    });

    it('should return user-friendly message for restore failed', () => {
      const error = new StorageError('Test', StorageErrorCode.RESTORE_FAILED, false);

      const message = service.handleStorageError(error);

      expect(message).toContain('Failed to restore data');
    });

    it('should return user-friendly message for cleanup failed', () => {
      const error = new StorageError('Test', StorageErrorCode.CLEANUP_FAILED, true);

      const message = service.handleStorageError(error);

      expect(message).toContain('Failed to cleanup old data');
    });

    it('should return generic message for unknown errors', () => {
      const error = new Error('Unknown error');

      const message = service.handleStorageError(error);

      expect(message).toContain('unexpected error');
    });
  });
});
