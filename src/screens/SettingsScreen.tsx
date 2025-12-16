import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLanguage } from '../services/LanguageContext';
import { useTheme } from '../theme/ThemeContext';

export const SettingsScreen: React.FC = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const { theme, themeMode, setThemeMode } = useTheme();

  const handleLanguageChange = async (lang: 'en' | 'es') => {
    await setLanguage(lang);
  };

  const handleThemeChange = async (mode: 'light' | 'dark' | 'auto') => {
    await setThemeMode(mode);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('settings.title')}</Text>
      </View>
      <ScrollView style={styles.content}>
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{t('settings.language')}</Text>
          <View style={[styles.optionGroup, { backgroundColor: theme.colors.surface }, theme.shadows.md]}>
            <TouchableOpacity
              style={[
                styles.option,
                { borderBottomColor: theme.colors.border },
                currentLanguage === 'en' && { backgroundColor: theme.colors.primaryLight + '20' },
              ]}
              onPress={() => handleLanguageChange('en')}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    { color: theme.colors.text },
                    currentLanguage === 'en' && { fontWeight: '600', color: theme.colors.primary },
                  ]}
                >
                  {t('language.english')}
                </Text>
                {currentLanguage === 'en' && (
                  <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                { borderBottomColor: theme.colors.border },
                currentLanguage === 'es' && { backgroundColor: theme.colors.primaryLight + '20' },
              ]}
              onPress={() => handleLanguageChange('es')}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    { color: theme.colors.text },
                    currentLanguage === 'es' && { fontWeight: '600', color: theme.colors.primary },
                  ]}
                >
                  {t('language.spanish')}
                </Text>
                {currentLanguage === 'es' && (
                  <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Theme</Text>
          <View style={[styles.optionGroup, { backgroundColor: theme.colors.surface }, theme.shadows.md]}>
            <TouchableOpacity
              style={[
                styles.option,
                { borderBottomColor: theme.colors.border },
                themeMode === 'light' && { backgroundColor: theme.colors.primaryLight + '20' },
              ]}
              onPress={() => handleThemeChange('light')}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    { color: theme.colors.text },
                    themeMode === 'light' && { fontWeight: '600', color: theme.colors.primary },
                  ]}
                >
                  Light
                </Text>
                {themeMode === 'light' && (
                  <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                { borderBottomColor: theme.colors.border },
                themeMode === 'dark' && { backgroundColor: theme.colors.primaryLight + '20' },
              ]}
              onPress={() => handleThemeChange('dark')}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    { color: theme.colors.text },
                    themeMode === 'dark' && { fontWeight: '600', color: theme.colors.primary },
                  ]}
                >
                  Dark
                </Text>
                {themeMode === 'dark' && (
                  <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                themeMode === 'auto' && { backgroundColor: theme.colors.primaryLight + '20' },
              ]}
              onPress={() => handleThemeChange('auto')}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    { color: theme.colors.text },
                    themeMode === 'auto' && { fontWeight: '600', color: theme.colors.primary },
                  ]}
                >
                  Auto (System)
                </Text>
                {themeMode === 'auto' && (
                  <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  optionGroup: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    minHeight: 48,
    justifyContent: 'center',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 17,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
