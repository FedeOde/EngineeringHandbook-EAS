import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLanguage } from '../services/LanguageContext';
import { Language } from '../types/language.types';

interface LanguageSelectorProps {
  onLanguageSelected?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageSelected,
}) => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageSelect = async (language: Language) => {
    if (language === currentLanguage || isChanging) {
      return;
    }

    setIsChanging(true);
    try {
      await setLanguage(language);
      onLanguageSelected?.();
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('language.title')}</Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            currentLanguage === 'en' && styles.selectedButton,
          ]}
          onPress={() => handleLanguageSelect('en')}
          disabled={isChanging}
        >
          <Text
            style={[
              styles.languageText,
              currentLanguage === 'en' && styles.selectedText,
            ]}
          >
            {t('language.english')}
          </Text>
          {currentLanguage === 'en' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageButton,
            currentLanguage === 'es' && styles.selectedButton,
          ]}
          onPress={() => handleLanguageSelect('es')}
          disabled={isChanging}
        >
          <Text
            style={[
              styles.languageText,
              currentLanguage === 'es' && styles.selectedText,
            ]}
          >
            {t('language.spanish')}
          </Text>
          {currentLanguage === 'es' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {isChanging && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  optionsContainer: {
    gap: 12,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  selectedButton: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  languageText: {
    fontSize: 18,
    color: '#333',
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
});
