import * as fc from 'fast-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageService } from './LanguageService';
import { Language } from '../types/language.types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('LanguageService - Property-Based Tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // Initialize with default language
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    await LanguageService.initialize();
    jest.clearAllMocks();
  });

  // Feature: engineering-pocket-helper, Property 1: Language setting persistence round-trip
  // Validates: Requirements 1.2
  it('should persist and retrieve language settings (round-trip property)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Language>('en', 'es'),
        async (language: Language) => {
          // Mock AsyncStorage to simulate actual storage behavior
          let storedValue: string | null = null;
          
          (AsyncStorage.setItem as jest.Mock).mockImplementation(
            async (key: string, value: string) => {
              storedValue = value;
            }
          );
          
          (AsyncStorage.getItem as jest.Mock).mockImplementation(
            async (key: string) => {
              return storedValue;
            }
          );

          // Set the language
          await LanguageService.setLanguage(language);

          // Verify it was stored
          expect(AsyncStorage.setItem).toHaveBeenCalledWith('@app:language', language);

          // Retrieve the stored value
          const retrievedLanguage = await AsyncStorage.getItem('@app:language');

          // Property: Round-trip should return the same value
          expect(retrievedLanguage).toBe(language);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 2: Language consistency across modules
  // Validates: Requirements 1.4
  it('should return consistent language across multiple calls to getCurrentLanguage', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Language>('en', 'es'),
        async (language: Language) => {
          // Mock AsyncStorage
          (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
          (AsyncStorage.getItem as jest.Mock).mockResolvedValue(language);

          // Set the language
          await LanguageService.setLanguage(language);

          // Query the language multiple times from the same service instance
          const lang1 = LanguageService.getCurrentLanguage();
          const lang2 = LanguageService.getCurrentLanguage();
          const lang3 = LanguageService.getCurrentLanguage();

          // Property: All queries should return the same language value
          expect(lang1).toBe(language);
          expect(lang2).toBe(language);
          expect(lang3).toBe(language);
          expect(lang1).toBe(lang2);
          expect(lang2).toBe(lang3);
        }
      ),
      { numRuns: 100 }
    );
  });
});
