/**
 * Themed Input component with consistent styling
 */

import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...textInputProps
}) => {
  const { theme } = useTheme();

  const inputStyle: TextStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: error ? theme.colors.error : theme.colors.border,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    minHeight: 48,
  };

  const labelStyle: TextStyle = {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  };

  const errorStyle: TextStyle = {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <TextInput
        style={[inputStyle, style]}
        placeholderTextColor={theme.colors.textDisabled}
        {...textInputProps}
      />
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};
