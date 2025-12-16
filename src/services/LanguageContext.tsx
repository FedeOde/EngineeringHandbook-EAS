import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from '../types/language.types';
import { LanguageService } from './LanguageService';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: string, params?: object) => string;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isReady, setIsReady] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        await LanguageService.initialize();
        const lang = LanguageService.getCurrentLanguage();
        setCurrentLanguage(lang);
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing language service:', error);
        setIsReady(true); // Still set ready to avoid blocking the app
      }
    };

    initializeLanguage();
  }, []);

  const handleSetLanguage = async (language: Language) => {
    try {
      await LanguageService.setLanguage(language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Error setting language:', error);
      throw error;
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage: handleSetLanguage,
    t,
    isReady,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
