import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { LanguageSelector } from './LanguageSelector';

interface LanguageSelectionScreenProps {
  onComplete?: () => void;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  onComplete,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LanguageSelector onLanguageSelected={onComplete} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
