export type Language = 'en' | 'es';

export interface LanguageService {
  getCurrentLanguage(): Language;
  setLanguage(language: Language): Promise<void>;
  translate(key: string, params?: object): string;
  initialize(): Promise<void>;
}
