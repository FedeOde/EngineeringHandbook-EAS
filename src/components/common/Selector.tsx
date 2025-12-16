/**
 * Themed Selector component (dropdown/picker trigger)
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { minTouchTarget } from '../../theme/responsive';

interface SelectorProps {
  label?: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Selector: React.FC<SelectorProps> = ({
  label,
  value,
  placeholder,
  onPress,
  error,
  containerStyle,
}) => {
  const { theme } = useTheme();

  const labelStyle: TextStyle = {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  };

  const selectorStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: error ? theme.colors.error : theme.colors.border,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: minTouchTarget,
  };

  const valueStyle: TextStyle = {
    ...theme.typography.body,
    color: value ? theme.colors.text : theme.colors.textDisabled,
    flex: 1,
  };

  const arrowStyle: TextStyle = {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  };

  const errorStyle: TextStyle = {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <TouchableOpacity style={selectorStyle} onPress={onPress} activeOpacity={0.7}>
        <Text style={valueStyle}>{value || placeholder}</Text>
        <Text style={arrowStyle}>▼</Text>
      </TouchableOpacity>
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};
