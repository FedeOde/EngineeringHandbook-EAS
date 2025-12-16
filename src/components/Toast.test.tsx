import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';
import { ToastProvider, useToast } from './Toast';

const TestComponent: React.FC = () => {
  const { showToast } = useToast();

  return (
    <>
      <TouchableOpacity onPress={() => showToast('Success message', 'success')}>
        <Text>Show Success</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => showToast('Error message', 'error')}>
        <Text>Show Error</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => showToast('Info message', 'info')}>
        <Text>Show Info</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => showToast('Warning message', 'warning')}>
        <Text>Show Warning</Text>
      </TouchableOpacity>
    </>
  );
};

describe('Toast', () => {
  it('displays success toast when triggered', async () => {
    const { getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.press(getByText('Show Success'));

    await waitFor(() => {
      expect(getByText('Success message')).toBeTruthy();
    });
  });

  it('displays error toast when triggered', async () => {
    const { getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.press(getByText('Show Error'));

    await waitFor(() => {
      expect(getByText('Error message')).toBeTruthy();
    });
  });

  it('displays info toast when triggered', async () => {
    const { getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.press(getByText('Show Info'));

    await waitFor(() => {
      expect(getByText('Info message')).toBeTruthy();
    });
  });

  it('displays warning toast when triggered', async () => {
    const { getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.press(getByText('Show Warning'));

    await waitFor(() => {
      expect(getByText('Warning message')).toBeTruthy();
    });
  });

  it('dismisses toast when tapped', async () => {
    const { getByText, queryByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.press(getByText('Show Success'));

    await waitFor(() => {
      expect(getByText('Success message')).toBeTruthy();
    });

    fireEvent.press(getByText('Success message'));

    await waitFor(() => {
      expect(queryByText('Success message')).toBeNull();
    });
  });

  it('throws error when useToast is used outside ToastProvider', () => {
    const TestComponentWithoutProvider = () => {
      expect(() => useToast()).toThrow('useToast must be used within a ToastProvider');
      return <Text>Test</Text>;
    };

    render(<TestComponentWithoutProvider />);
  });
});
