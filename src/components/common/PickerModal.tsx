/**
 * Themed Picker Modal component for selection lists
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface PickerModalProps<T> {
  visible: boolean;
  onClose: () => void;
  data: T[];
  onSelect: (item: T) => void;
  getLabel: (item: T) => string;
  getKey: (item: T) => string;
  title?: string;
}

export function PickerModal<T>({
  visible,
  onClose,
  data,
  onSelect,
  getLabel,
  getKey,
  title,
}: PickerModalProps<T>) {
  const { theme } = useTheme();

  const overlayStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  };

  const contentStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xxl,
    borderTopRightRadius: theme.borderRadius.xxl,
    maxHeight: '70%',
  };

  const headerStyle: ViewStyle = {
    padding: theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle: TextStyle = {
    ...theme.typography.h4,
    color: theme.colors.text,
  };

  const closeButtonStyle: TextStyle = {
    ...theme.typography.button,
    color: theme.colors.primary,
  };

  const itemStyle: ViewStyle = {
    padding: theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  };

  const itemTextStyle: TextStyle = {
    ...theme.typography.body,
    color: theme.colors.text,
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={overlayStyle}>
        <View style={contentStyle}>
          <View style={headerStyle}>
            {title && <Text style={titleStyle}>{title}</Text>}
            <TouchableOpacity onPress={onClose}>
              <Text style={closeButtonStyle}>Close</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => getKey(item)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={itemStyle}
                onPress={() => onSelect(item)}
                activeOpacity={0.7}
              >
                <Text style={itemTextStyle}>{getLabel(item)}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
