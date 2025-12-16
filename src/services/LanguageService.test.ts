import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageService } from './LanguageService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('LanguageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should initialize with default language when no saved preference exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await LanguageService.initialize();
      const currentLang = LanguageService.getCurrentLanguage();

      expect(currentLang).toBe('en');
    });

    it('should initialize with saved language preference', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('es');

      await LanguageService.initialize();
      const currentLang = LanguageService.getCurrentLanguage();

      expect(currentLang).toBe('es');
    });

    it('should not reinitialize if already initialized', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('en');

      await LanguageService.initialize();
      await LanguageService.initialize();

      // getItem should only be called once
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('setLanguage', () => {
    beforeEach(async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      await LanguageService.initialize();
      jest.clearAllMocks();
    });

    it('should change language to Spanish', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await LanguageService.setLanguage('es');
      const currentLang = LanguageService.getCurrentLanguage();

      expect(currentLang).toBe('es');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@app:language', 'es');
    });

    it('should change language to English', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await LanguageService.setLanguage('en');
      const currentLang = LanguageService.getCurrentLanguage();

      expect(currentLang).toBe('en');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@app:language', 'en');
    });

    it('should persist language change to AsyncStorage', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await LanguageService.setLanguage('es');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@app:language', 'es');
    });
  });

  describe('getCurrentLanguage', () => {
    beforeEach(async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      await LanguageService.initialize();
      jest.clearAllMocks();
    });

    it('should return current language', async () => {
      const lang = LanguageService.getCurrentLanguage();
      expect(lang).toBe('en');
    });

    it('should return updated language after change', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await LanguageService.setLanguage('es');
      const lang = LanguageService.getCurrentLanguage();

      expect(lang).toBe('es');
    });
  });

  describe('translate', () => {
    beforeEach(async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      await LanguageService.initialize();
    });

    it('should translate keys in English', () => {
      const translation = LanguageService.translate('common.save');
      expect(translation).toBe('Save');
    });

    it('should translate keys in Spanish after language change', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await LanguageService.setLanguage('es');
      const translation = LanguageService.translate('common.save');

      expect(translation).toBe('Guardar');
    });

    it('should handle nested translation keys', () => {
      const translation = LanguageService.translate('language.title');
      expect(translation).toBe('Select Language');
    });
  });
});
