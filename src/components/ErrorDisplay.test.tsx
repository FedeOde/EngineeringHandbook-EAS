import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorDisplay, InlineError } from './ErrorDisplay';

// Mock the useLanguage hook
jest.mock('../services/LanguageContext', () => ({
  ...jest.requireActual('../services/LanguageContext'),
  useLanguage: () => ({
    language: 'en',
    setLanguage: jest.fn(),
    t: (key: string) => key,
    translate: (key: string) => key,
  }),
}));

const renderWithLanguage = (component: React.ReactElement) => {
  return render(component);
};

describe('ErrorDisplay', () => {
  it('renders error message from string', () => {
    const { getByText } = renderWithLanguage(
      <ErrorDisplay error="Test error message" />
    );

    expect(getByText('Test error message')).toBeTruthy();
  });

  it('renders error message from Error object', () => {
    const error = new Error('Error object message');
    const { getByText } = renderWithLanguage(
      <ErrorDisplay error={error} />
    );

    expect(getByText('Error object message')).toBeTruthy();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    const { getByText } = renderWithLanguage(
      <ErrorDisplay error="Test error" onRetry={onRetry} />
    );

    const retryButton = getByText('errorDisplay.retry');
    fireEvent.press(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when dismiss button is pressed', () => {
    const onDismiss = jest.fn();
    const { getByText } = renderWithLanguage(
      <ErrorDisplay error="Test error" onDismiss={onDismiss} />
    );

    const dismissButton = getByText('common.close');
    fireEvent.press(dismissButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('uses custom retry label when provided', () => {
    const { getByText } = renderWithLanguage(
      <ErrorDisplay error="Test error" onRetry={() => {}} retryLabel="Custom Retry" />
    );

    expect(getByText('Custom Retry')).toBeTruthy();
  });

  it('uses custom dismiss label when provided', () => {
    const { getByText } = renderWithLanguage(
      <ErrorDisplay error="Test error" onDismiss={() => {}} dismissLabel="Custom Dismiss" />
    );

    expect(getByText('Custom Dismiss')).toBeTruthy();
  });

  it('shows error details when showDetails is true', () => {
    const error = new Error('Test error');
    error.stack = 'Error stack trace';
    
    const { getByText } = renderWithLanguage(
      <ErrorDisplay error={error} showDetails={true} />
    );

    expect(getByText('Error stack trace')).toBeTruthy();
  });
});

describe('InlineError', () => {
  it('renders inline error message', () => {
    const { getByText } = render(
      <InlineError message="Inline error message" />
    );

    expect(getByText('Inline error message')).toBeTruthy();
  });

  it('renders compact version when compact is true', () => {
    const { getByText } = render(
      <InlineError message="Compact error" compact={true} />
    );

    expect(getByText('Compact error')).toBeTruthy();
  });
});
