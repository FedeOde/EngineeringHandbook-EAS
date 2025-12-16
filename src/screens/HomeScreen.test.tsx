import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from './HomeScreen';

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

// Mock AnimatedView
jest.mock('../components/common/AnimatedView', () => ({
  AnimatedView: ({ children }: any) => children,
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

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('HomeScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the home screen with title', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('home.title')).toBeTruthy();
  });

  it('displays all feature section cards', () => {
    const { getByText } = render(<HomeScreen />);

    // Check for translation keys (mock returns keys)
    expect(getByText('unitConverter.title')).toBeTruthy();
    expect(getByText('drillTable.title')).toBeTruthy();
    expect(getByText('flange.title')).toBeTruthy();
    expect(getByText('torqueCalculator.title')).toBeTruthy();
    expect(getByText('offsetCalculator.title')).toBeTruthy();
    expect(getByText('photo.title')).toBeTruthy();
    expect(getByText('tasks.title')).toBeTruthy();
    expect(getByText('stickyNote.title')).toBeTruthy();
    expect(getByText('voiceNote.title')).toBeTruthy();
  });

  it('navigates to feature screen when card is pressed', () => {
    const { getByText } = render(<HomeScreen />);

    fireEvent.press(getByText('unitConverter.title'));
    expect(mockNavigate).toHaveBeenCalledWith('UnitConverter');
  });
});
