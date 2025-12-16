/**
 * AppInitializationService
 * Handles application startup, data restoration, and initialization
 * 
 * This service orchestrates:
 * - Storage validation
 * - Database initialization
 * - Data restoration from previous sessions
 * - Error recovery
 */

import { storageManager, StorageError, StorageErrorCode } from '../utils/StorageManager';
import { LanguageService } from './LanguageService';

/**
 * Initialization result
 */
export interface InitializationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  dataRestored: boolean;
}

/**
 * Initialization options
 */
export interface InitializationOptions {
  validateStorage?: boolean;
  restoreFromBackup?: boolean;
  cleanupOldData?: boolean;
}

/**
 * AppInitializationService class
 */
export class AppInitializationService {
  private static instance: AppInitializationService;
  private initialized = false;

  private constructor() {}

  /**
   * Gets the singleton instance
   */
  static getInstance(): AppInitializationService {
    if (!AppInitializationService.instance) {
      AppInitializationService.instance = new AppInitializationService();
    }
    return AppInitializationService.instance;
  }

  /**
   * Initializes the application
   * This should be called on app startup
   */
  async initialize(options?: InitializationOptions): Promise<InitializationResult> {
    if (this.initialized) {
      return {
        success: true,
        errors: [],
        warnings: ['Application already initialized'],
        dataRestored: false,
      };
    }

    const result: InitializationResult = {
      success: true,
      errors: [],
      warnings: [],
      dataRestored: false,
    };

    const {
      validateStorage = true,
      restoreFromBackup = false,
      cleanupOldData = true,
    } = options || {};

    try {
      console.log('Starting application initialization...');

      // Step 1: Validate storage space
      if (validateStorage) {
        try {
          await storageManager.validateStorageSpace();
        } catch (error) {
          if (error instanceof StorageError && error.code === StorageErrorCode.INSUFFICIENT_SPACE) {
            result.warnings.push(error.message);
          } else {
            throw error;
          }
        }
      }

      // Step 2: Initialize language service
      try {
        await LanguageService.initialize();
      } catch (error) {
        result.errors.push(`Language initialization failed: ${error}`);
        console.error('Language initialization error:', error);
      }

      // Step 3: Initialize app data (database, etc.)
      try {
        await storageManager.initializeAppData();
      } catch (error) {
        if (error instanceof StorageError && error.code === StorageErrorCode.CORRUPTED_DATA) {
          result.warnings.push('Data corruption detected. Attempting recovery...');
          
          // Attempt to restore from backup
          if (restoreFromBackup) {
            const restored = await this.attemptDataRecovery();
            result.dataRestored = restored;
            
            if (!restored) {
              result.errors.push('Data recovery failed. Starting with fresh data.');
            }
          }
        } else {
          throw error;
        }
      }

      // Step 4: Verify data integrity
      const integrityOk = await storageManager.verifyDataIntegrity();
      if (!integrityOk) {
        result.warnings.push('Data integrity check failed. Some data may be unavailable.');
      }

      // Step 5: Cleanup old data if requested
      if (cleanupOldData) {
        try {
          await storageManager.cleanupStorage({
            removeOldBackups: true,
            maxBackupsToKeep: 3,
          });
        } catch (error) {
          result.warnings.push(`Cleanup failed: ${error}`);
          console.error('Cleanup error:', error);
        }
      }

      this.initialized = true;
      console.log('Application initialization completed successfully');

      return result;
    } catch (error) {
      console.error('Critical initialization error:', error);
      result.success = false;
      result.errors.push(`Critical error: ${error}`);
      return result;
    }
  }

  /**
   * Attempts to recover data from the latest backup
   */
  private async attemptDataRecovery(): Promise<boolean> {
    try {
      console.log('Attempting data recovery from backup...');

      const latestBackup = await storageManager.getLatestBackup();
      if (!latestBackup) {
        console.log('No backup available for recovery');
        return false;
      }

      await storageManager.restoreFromBackup(latestBackup);
      console.log('Data recovered successfully from backup');
      return true;
    } catch (error) {
      console.error('Data recovery failed:', error);
      return false;
    }
  }

  /**
   * Checks if the application is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Resets initialization state (for testing)
   */
  reset(): void {
    this.initialized = false;
  }

  /**
   * Performs a graceful shutdown
   * Saves any pending data and creates a backup
   */
  async shutdown(): Promise<void> {
    try {
      console.log('Performing graceful shutdown...');

      // Create a backup before shutdown
      await storageManager.createBackup();

      console.log('Shutdown completed successfully');
    } catch (error) {
      console.error('Error during shutdown:', error);
      throw error;
    }
  }

  /**
   * Handles storage errors with user-friendly messages
   */
  handleStorageError(error: unknown): string {
    if (error instanceof StorageError) {
      switch (error.code) {
        case StorageErrorCode.INSUFFICIENT_SPACE:
          return 'Storage space is running low. Please free up some space and try again.';
        case StorageErrorCode.PERMISSION_DENIED:
          return 'Storage access denied. Please check app permissions.';
        case StorageErrorCode.CORRUPTED_DATA:
          return 'Data corruption detected. The app will attempt to recover your data.';
        case StorageErrorCode.BACKUP_FAILED:
          return 'Failed to create backup. Your data is safe but backup was not created.';
        case StorageErrorCode.RESTORE_FAILED:
          return 'Failed to restore data from backup. Starting with current data.';
        case StorageErrorCode.CLEANUP_FAILED:
          return 'Failed to cleanup old data. This may affect storage space.';
        default:
          return 'A storage error occurred. Please try again.';
      }
    }

    return 'An unexpected error occurred. Please restart the app.';
  }
}

// Export singleton instance
export const appInitializationService = AppInitializationService.getInstance();
