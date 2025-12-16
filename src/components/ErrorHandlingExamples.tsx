/**
 * Example usage of error handling and user feedback components
 * This file demonstrates how to use the error handling system in the application
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useToast } from './Toast';
import { LoadingIndicator, InlineLoading } from './LoadingIndicator';
import { ErrorDisplay, InlineError } from './ErrorDisplay';
import { AppError, ErrorCode, handleAsyncOperation } from '../utils/errorHandler';
import { validateRequired, validatePositiveNumber, getValidationMessage } from '../utils/validation';
import { useLanguage } from '../services/LanguageContext';

/**
 * Example 1: Using Toast notifications
 */
export const ToastExample: React.FC = () => {
  const { showToast } = useToast();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => showToast('Operation completed successfully!', 'success')}
      >
        <Text style={styles.buttonText}>Show Success Toast</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => showToast('An error occurred', 'error')}
      >
        <Text style={styles.buttonText}>Show Error Toast</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => showToast('This is important information', 'info')}
      >
        <Text style={styles.buttonText}>Show Info Toast</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => showToast('Warning: Check your input', 'warning')}
      >
        <Text style={styles.buttonText}>Show Warning Toast</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Example 2: Using Loading Indicators
 */
export const LoadingExample: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const simulateAsyncOperation = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={simulateAsyncOperation}>
        <Text style={styles.buttonText}>Start Loading</Text>
      </TouchableOpacity>

      <LoadingIndicator visible={loading} message="Processing..." />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inline Loading:</Text>
        <InlineLoading message="Loading data..." />
      </View>
    </View>
  );
};

/**
 * Example 3: Using Error Display
 */
export const ErrorDisplayExample: React.FC = () => {
  const [showError, setShowError] = useState(false);
  const { showToast } = useToast();

  const handleRetry = () => {
    setShowError(false);
    showToast('Retrying operation...', 'info');
  };

  const handleDismiss = () => {
    setShowError(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setShowError(true)}>
        <Text style={styles.buttonText}>Show Error</Text>
      </TouchableOpacity>

      {showError && (
        <ErrorDisplay
          error="Failed to load data from server"
          onRetry={handleRetry}
          onDismiss={handleDismiss}
        />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inline Error:</Text>
        <InlineError message="Invalid input value" />
      </View>
    </View>
  );
};

/**
 * Example 4: Using AppError and error handling utilities
 */
export const ErrorHandlingExample: React.FC = () => {
  const { showToast } = useToast();
  const [result, setResult] = useState<string>('');

  const simulateOperation = async (shouldFail: boolean): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (shouldFail) {
      throw new AppError(
        'Operation failed due to insufficient storage',
        ErrorCode.INSUFFICIENT_STORAGE,
        true
      );
    }

    return 'Operation completed successfully';
  };

  const handleOperation = async (shouldFail: boolean) => {
    const result = await handleAsyncOperation(
      () => simulateOperation(shouldFail),
      (error) => {
        showToast(error.message, 'error');
      }
    );

    if (result) {
      setResult(result);
      showToast(result, 'success');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => handleOperation(false)}>
        <Text style={styles.buttonText}>Successful Operation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleOperation(true)}>
        <Text style={styles.buttonText}>Failed Operation</Text>
      </TouchableOpacity>

      {result && <Text style={styles.result}>{result}</Text>}
    </View>
  );
};

/**
 * Example 5: Using validation utilities
 */
export const ValidationExample: React.FC = () => {
  const { translate } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleValidation = (value: string) => {
    setInputValue(value);

    // Validate that the input is required and is a positive number
    const requiredValidation = validateRequired(value);
    if (!requiredValidation.isValid) {
      setValidationError(getValidationMessage(requiredValidation, translate));
      return;
    }

    const positiveNumberValidation = validatePositiveNumber(value);
    if (!positiveNumberValidation.isValid) {
      setValidationError(getValidationMessage(positiveNumberValidation, translate));
      return;
    }

    setValidationError(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter a positive number:</Text>
      <View style={styles.inputContainer}>
        {/* In a real app, you would use TextInput here */}
        <Text>Input: {inputValue}</Text>
      </View>

      {validationError && <InlineError message={validationError} compact />}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.smallButton} onPress={() => handleValidation('')}>
          <Text style={styles.buttonText}>Test Empty</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={() => handleValidation('-5')}>
          <Text style={styles.buttonText}>Test Negative</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={() => handleValidation('10')}>
          <Text style={styles.buttonText}>Test Valid</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  result: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    color: '#2e7d32',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  smallButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
  },
});
