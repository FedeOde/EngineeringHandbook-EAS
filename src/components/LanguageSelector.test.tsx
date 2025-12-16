import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../services/LanguageContext';

// Mock the useLanguage hook
jest.mock('../services/LanguageContext', () => ({
  useLanguage: jest.fn(),
}));

describe('LanguageSelector', () => {
  const mockSetLanguage = jest.fn();
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'language.title': 'Select Language',
      'language.english': 'English',
      'language.spanish': 'Spanish',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useLanguage as jest.Mock).mockReturnValue({
      currentLanguage: 'en',
      setLanguage: mockSetLanguage,
      t: mockT,
      isReady: true,
    });
  });

  it('should render language options', () => {
    const { getByText } = render(<LanguageSelector />);

    expect(getByText('Select Language')).toBeTruthy();
    expect(getByText('English')).toBeTruthy();
    expect(getByText('Spanish')).toBeTruthy();
  });

  it('should show checkmark for current language', () => {
    const { getAllByText } = render(<LanguageSelector />);

    const checkmarks = getAllByText('✓');
    expect(checkmarks.length).toBe(1);
  });

  it('should call setLanguage when Spanish is selected', async () => {
    mockSetLanguage.mockResolvedValue(undefined);
    const { getByText } = render(<LanguageSelector />);

    const spanishButton = getByText('Spanish');
    fireEvent.press(spanishButton);

    await waitFor(() => {
      expect(mockSetLanguage).toHaveBeenCalledWith('es');
    });
  });

  it('should call setLanguage when English is selected', async () => {
    (useLanguage as jest.Mock).mockReturnValue({
      currentLanguage: 'es',
      setLanguage: mockSetLanguage,
      t: mockT,
      isReady: true,
    });

    mockSetLanguage.mockResolvedValue(undefined);
    const { getByText } = render(<LanguageSelector />);

    const englishButton = getByText('English');
    fireEvent.press(englishButton);

    await waitFor(() => {
      expect(mockSetLanguage).toHaveBeenCalledWith('en');
    });
  });

  it('should call onLanguageSelected callback after language change', async () => {
    const onLanguageSelected = jest.fn();
    mockSetLanguage.mockResolvedValue(undefined);

    const { getByText } = render(
      <LanguageSelector onLanguageSelected={onLanguageSelected} />
    );

    const spanishButton = getByText('Spanish');
    fireEvent.press(spanishButton);

    await waitFor(() => {
      expect(onLanguageSelected).toHaveBeenCalled();
    });
  });

  it('should not call setLanguage when current language is selected', () => {
    const { getByText } = render(<LanguageSelector />);

    const englishButton = getByText('English');
    fireEvent.press(englishButton);

    expect(mockSetLanguage).not.toHaveBeenCalled();
  });
});
