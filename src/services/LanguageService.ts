import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, LanguageService as ILanguageService } from '../types/language.types';
import en from '../locales/en.json';
import es from '../locales/es.json';

const LANGUAGE_STORAGE_KEY = '@app:language';
const DEFAULT_LANGUAGE: Language = 'en';

class LanguageServiceImpl implements ILanguageService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Try to load saved language preference
    const savedLanguage = await this.loadLanguageFromStorage();

    await i18n
      .use(initReactI18next)
      .init({
        resources: {
          en: { translation: en },
          es: { translation: es },
        },
        lng: savedLanguage || DEFAULT_LANGUAGE,
        fallbackLng: DEFAULT_LANGUAGE,
        interpolation: {
          escapeValue: false,
        },
        compatibilityJSON: 'v3',
      });

    this.initialized = true;
  }

  getCurrentLanguage(): Language {
    const currentLang = i18n.language;
    return (currentLang === 'es' ? 'es' : 'en') as Language;
  }

  async setLanguage(language: Language): Promise<void> {
    await i18n.changeLanguage(language);
    await this.saveLanguageToStorage(language);
  }

  translate(key: string, params?: object): string {
    return i18n.t(key, params);
  }

  private async loadLanguageFromStorage(): Promise<Language | null> {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage === 'en' || savedLanguage === 'es') {
        return savedLanguage;
      }
      return null;
    } catch (error) {
      console.error('Error loading language from storage:', error);
      return null;
    }
  }

  private async saveLanguageToStorage(language: Language): Promise<void> {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error('Error saving language to storage:', error);
      throw error;
    }
  }
}

export const LanguageService = new LanguageServiceImpl();
