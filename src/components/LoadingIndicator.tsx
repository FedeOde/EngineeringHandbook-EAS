import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';

interface LoadingIndicatorProps {
  visible: boolean;
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  overlay?: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  visible,
  message,
  size = 'large',
  color = '#007AFF',
  overlay = true,
}) => {
  if (!visible) {
    return null;
  }

  const content = (
    <View style={[styles.container, overlay && styles.overlay]}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        {content}
      </Modal>
    );
  }

  return content;
};

interface InlineLoadingProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message,
  size = 'small',
  color = '#007AFF',
}) => {
  return (
    <View style={styles.inlineContainer}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.inlineMessage}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  inlineMessage: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
});
