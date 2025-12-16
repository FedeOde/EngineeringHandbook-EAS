import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../services/LanguageContext';

export interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryLabel?: string;
  dismissLabel?: string;
  showDetails?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  retryLabel,
  dismissLabel,
  showDetails = false,
}) => {
  const { translate } = useLanguage();

  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <Text style={styles.title}>{translate('common.error')}</Text>
      <Text style={styles.message}>{errorMessage}</Text>
      {showDetails && errorStack && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>{errorStack}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>
              {retryLabel || translate('errorDisplay.retry')}
            </Text>
          </TouchableOpacity>
        )}
        {onDismiss && (
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissButtonText}>
              {dismissLabel || translate('common.close')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

interface InlineErrorProps {
  message: string;
  compact?: boolean;
}

export const InlineError: React.FC<InlineErrorProps> = ({ message, compact = false }) => {
  return (
    <View style={[styles.inlineContainer, compact && styles.inlineCompact]}>
      <Text style={styles.inlineIcon}>⚠️</Text>
      <Text style={styles.inlineMessage}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 12,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 150,
    width: '100%',
  },
  detailsText: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dismissButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  dismissButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  inlineCompact: {
    padding: 8,
  },
  inlineIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  inlineMessage: {
    flex: 1,
    fontSize: 14,
    color: '#c62828',
  },
});
