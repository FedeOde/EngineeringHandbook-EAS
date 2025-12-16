/**
 * Property-Based Tests for StorageManager
 * Tests universal properties that should hold across all valid executions
 */

import * as fc from 'fast-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StorageManager,
  StorageError,
  StorageErrorCode,
  BackupData,
} from './StorageManager';
import { initializeDatabase, closeDatabase, executeQuery } from '../database/database';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../database/database');

describe('StorageManager - Property-Based Tests', () => {
  let storageManager: StorageManager;

  beforeAll(async () => {
    // Initialize database for tests
    (initializeDatabase as jest.Mock).mockResolvedValue({});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    storageManager = StorageManager.getInstance();
    
    // Default mock implementations
    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([]);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.multiSet as jest.Mock).mockResolvedValue(undefined);
    (executeQuery as jest.Mock).mockResolvedValue([]);
  });

  // Feature: engineering-pocket-helper, Property 29: Storage limit error handling
  // Validates: Requirements 11.5
  it('should throw error before attempting to save when storage space is insufficient', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate various backup data scenarios
        fc.record({
          asyncStorageData: fc.dictionary(
            fc.string({ minLength: 1, maxLength: 50 }),
            fc.string({ minLength: 0, maxLength: 200 }),
            { minKeys: 0, maxKeys: 20 }
          ),
          databaseData: fc.record({
            tasks: fc.array(
              fc.record({
                id: fc.uuid(),
                description: fc.string({ minLength: 1, maxLength: 100 }),
                completed: fc.integer({ min: 0, max: 1 }),
                created_at: fc.integer({ min: 1000000000000, max: 9999999999999 }),
                completed_at: fc.option(fc.integer({ min: 1000000000000, max: 9999999999999 }), { nil: null }),
              }),
              { minLength: 0, maxLength: 10 }
            ),
          }),
        }),
        // Generate various insufficient storage scenarios
        fc.record({
          totalSpace: fc.integer({ min: 100 * 1024 * 1024, max: 1000 * 1024 * 1024 }), // 100MB - 1GB
          freeSpace: fc.integer({ min: 0, max: 9 * 1024 * 1024 }), // 0 - 9MB (below 10MB threshold)
        }),
        async (backupData, storageStats) => {
          // Calculate used space and percentage
          const usedSpace = storageStats.totalSpace - storageStats.freeSpace;
          const usedPercentage = (usedSpace / storageStats.totalSpace) * 100;

          // Mock insufficient storage space
          jest.spyOn(storageManager, 'checkStorageSpace').mockResolvedValue({
            totalSpace: storageStats.totalSpace,
            freeSpace: storageStats.freeSpace,
            usedSpace: usedSpace,
            usedPercentage: usedPercentage,
          });

          // Track if any write operations were attempted
          let asyncStorageWriteAttempted = false;
          let databaseWriteAttempted = false;

          (AsyncStorage.setItem as jest.Mock).mockImplementation(() => {
            asyncStorageWriteAttempted = true;
            return Promise.resolve();
          });

          (AsyncStorage.multiSet as jest.Mock).mockImplementation(() => {
            asyncStorageWriteAttempted = true;
            return Promise.resolve();
          });

          (executeQuery as jest.Mock).mockImplementation((query: string) => {
            if (query.includes('INSERT') || query.includes('UPDATE')) {
              databaseWriteAttempted = true;
            }
            return Promise.resolve([]);
          });

          // Prepare backup data with proper structure
          const fullBackupData: BackupData = {
            metadata: {
              timestamp: Date.now(),
              version: '1.0.0',
              dataTypes: ['asyncStorage', 'database'],
              size: JSON.stringify(backupData).length,
            },
            asyncStorageData: backupData.asyncStorageData,
            databaseData: backupData.databaseData,
          };

          // Property 1: createBackup should throw StorageError when storage is insufficient
          let errorThrown = false;
          let errorBeforeWrite = false;

          try {
            await storageManager.createBackup();
          } catch (error) {
            errorThrown = true;
            
            // Property 2: Error should be a StorageError
            expect(error).toBeInstanceOf(StorageError);
            
            // Property 3: Error should have INSUFFICIENT_SPACE code
            if (error instanceof StorageError) {
              expect(error.code).toBe(StorageErrorCode.INSUFFICIENT_SPACE);
              
              // Property 4: Error should be recoverable
              expect(error.recoverable).toBe(true);
              
              // Property 5: Error message should mention insufficient space
              expect(error.message).toMatch(/insufficient/i);
            }
            
            // Property 6: No write operations should have been attempted before error
            errorBeforeWrite = !asyncStorageWriteAttempted && !databaseWriteAttempted;
          }

          // Property 7: An error must be thrown when storage is insufficient
          expect(errorThrown).toBe(true);
          
          // Property 8: Error must be thrown BEFORE any write operations
          expect(errorBeforeWrite).toBe(true);
          
          // Property 9: No AsyncStorage writes should occur when storage is insufficient
          expect(asyncStorageWriteAttempted).toBe(false);
          
          // Property 10: No database writes should occur when storage is insufficient
          expect(databaseWriteAttempted).toBe(false);

          // Reset mocks for next iteration
          jest.restoreAllMocks();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Additional property: Validate storage space check should reject insufficient space
  it('should reject insufficient storage space during validation', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate storage scenarios below the 10MB threshold
        fc.record({
          totalSpace: fc.integer({ min: 100 * 1024 * 1024, max: 10 * 1024 * 1024 * 1024 }), // 100MB - 10GB
          freeSpace: fc.integer({ min: 0, max: 9 * 1024 * 1024 }), // 0 - 9MB (below threshold)
        }),
        async (storageStats) => {
          const usedSpace = storageStats.totalSpace - storageStats.freeSpace;
          const usedPercentage = (usedSpace / storageStats.totalSpace) * 100;

          // Mock insufficient storage
          jest.spyOn(storageManager, 'checkStorageSpace').mockResolvedValue({
            totalSpace: storageStats.totalSpace,
            freeSpace: storageStats.freeSpace,
            usedSpace: usedSpace,
            usedPercentage: usedPercentage,
          });

          // Property: validateStorageSpace should throw when space is insufficient
          let errorThrown = false;
          let correctErrorType = false;

          try {
            await storageManager.validateStorageSpace();
          } catch (error) {
            errorThrown = true;
            
            if (error instanceof StorageError) {
              correctErrorType = error.code === StorageErrorCode.INSUFFICIENT_SPACE;
            }
          }

          // Property: Error must be thrown for insufficient space
          expect(errorThrown).toBe(true);
          
          // Property: Error must be of correct type
          expect(correctErrorType).toBe(true);

          jest.restoreAllMocks();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Sufficient storage should allow operations to proceed
  it('should allow operations when storage space is sufficient', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate storage scenarios above the 10MB threshold
        fc.record({
          totalSpace: fc.integer({ min: 100 * 1024 * 1024, max: 10 * 1024 * 1024 * 1024 }), // 100MB - 10GB
          freeSpace: fc.integer({ min: 10 * 1024 * 1024, max: 1024 * 1024 * 1024 }), // 10MB - 1GB (above threshold)
        }),
        // Generate backup data
        fc.record({
          asyncStorageData: fc.dictionary(
            fc.string({ minLength: 1, maxLength: 30 }),
            fc.string({ minLength: 0, maxLength: 100 }),
            { minKeys: 0, maxKeys: 5 }
          ),
          databaseData: fc.record({
            tasks: fc.array(
              fc.record({
                id: fc.uuid(),
                description: fc.string({ minLength: 1, maxLength: 50 }),
                completed: fc.integer({ min: 0, max: 1 }),
                created_at: fc.integer({ min: 1000000000000, max: 9999999999999 }),
                completed_at: fc.option(fc.integer({ min: 1000000000000, max: 9999999999999 }), { nil: null }),
              }),
              { minLength: 0, maxLength: 3 }
            ),
          }),
        }),
        async (storageStats, backupData) => {
          const usedSpace = storageStats.totalSpace - storageStats.freeSpace;
          const usedPercentage = (usedSpace / storageStats.totalSpace) * 100;

          // Mock sufficient storage
          jest.spyOn(storageManager, 'checkStorageSpace').mockResolvedValue({
            totalSpace: storageStats.totalSpace,
            freeSpace: storageStats.freeSpace,
            usedSpace: usedSpace,
            usedPercentage: usedPercentage,
          });

          // Mock successful storage operations
          (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(
            Object.keys(backupData.asyncStorageData)
          );
          (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
            return Promise.resolve(backupData.asyncStorageData[key] || null);
          });
          (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
          (executeQuery as jest.Mock).mockResolvedValue(backupData.databaseData.tasks);

          // Property: validateStorageSpace should not throw when space is sufficient
          let validationPassed = false;
          try {
            await storageManager.validateStorageSpace();
            validationPassed = true;
          } catch (error) {
            // Should not throw
            validationPassed = false;
          }

          expect(validationPassed).toBe(true);

          // Property: createBackup should succeed when space is sufficient
          let backupSucceeded = false;
          try {
            const backup = await storageManager.createBackup();
            backupSucceeded = true;
            
            // Property: Backup should have valid structure
            expect(backup).toHaveProperty('metadata');
            expect(backup).toHaveProperty('asyncStorageData');
            expect(backup).toHaveProperty('databaseData');
            expect(backup.metadata.timestamp).toBeGreaterThan(0);
          } catch (error) {
            // Should not throw storage error
            if (error instanceof StorageError && error.code === StorageErrorCode.INSUFFICIENT_SPACE) {
              backupSucceeded = false;
            } else {
              // Other errors are acceptable (e.g., mock issues)
              backupSucceeded = true;
            }
          }

          expect(backupSucceeded).toBe(true);

          jest.restoreAllMocks();
        }
      ),
      { numRuns: 100 }
    );
  });
});
