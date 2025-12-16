import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './AppNavigator';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-sqlite-storage
jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(),
    executeSql: jest.fn(),
  })),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock ThemeContext
jest.mock('../theme/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: '#FFFFFF',
        surface: '#F5F5F5',
        card: '#FFFFFF',
        text: '#000000',
        textSecondary: '#666666',
        border: '#E0E0E0',
        primary: '#007AFF',
        primaryLight: '#5AC8FA',
      },
      shadows: {
        sm: {},
        md: {},
        lg: {},
      },
    },
    themeMode: 'light',
    setThemeMode: jest.fn(),
    isDark: false,
  }),
  ThemeProvider: ({ children }: any) => children,
}));

// Mock LanguageContext
jest.mock('../services/LanguageContext', () => ({
  LanguageProvider: ({ children }: any) => children,
  useLanguage: () => ({
    currentLanguage: 'en',
    setLanguage: jest.fn(),
    t: (key: string) => key,
    isReady: true,
  }),
}));

describe('AppNavigator', () => {
  it('renders without crashing', () => {
    const result = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );
    expect(result).toBeTruthy();
  });
});
