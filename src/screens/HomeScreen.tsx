import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../services/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { AnimatedView } from '../components/common/AnimatedView';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SectionCard {
  id: string;
  titleKey: string;
  icon: string;
  screen: keyof RootStackParamList;
  color: string;
}

const sections: SectionCard[] = [
  {
    id: 'unitConverter',
    titleKey: 'unitConverter.title',
    icon: '📏',
    screen: 'UnitConverter',
    color: '#007AFF',
  },
  {
    id: 'drillTable',
    titleKey: 'drillTable.title',
    icon: '🔩',
    screen: 'DrillTable',
    color: '#5856D6',
  },
  {
    id: 'flange',
    titleKey: 'flange.title',
    icon: '⚙️',
    screen: 'Flange',
    color: '#AF52DE',
  },
  {
    id: 'torqueCalculator',
    titleKey: 'torqueCalculator.title',
    icon: '🔧',
    screen: 'TorqueCalculator',
    color: '#FF9500',
  },
  {
    id: 'offsetCalculator',
    titleKey: 'offsetCalculator.title',
    icon: '📐',
    screen: 'OffsetCalculator',
    color: '#FF2D55',
  },
  {
    id: 'photoAnnotation',
    titleKey: 'photo.title',
    icon: '📷',
    screen: 'PhotoAnnotation',
    color: '#34C759',
  },
  {
    id: 'taskList',
    titleKey: 'tasks.title',
    icon: '✓',
    screen: 'TaskList',
    color: '#00C7BE',
  },
  {
    id: 'stickyNote',
    titleKey: 'stickyNote.title',
    icon: '✏️',
    screen: 'StickyNote',
    color: '#FFD60A',
  },
  {
    id: 'voiceNote',
    titleKey: 'voiceNote.title',
    icon: '🎤',
    screen: 'VoiceNote',
    color: '#FF3B30',
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const handleCardPress = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('home.title')}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{t('home.welcome')}</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.grid}>
          {sections.map((section, index) => (
            <AnimatedView
              key={section.id}
              animation="slideUp"
              delay={index * 50}
            >
              <TouchableOpacity
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.card,
                    borderLeftColor: section.color,
                    borderColor: theme.colors.border,
                  },
                  theme.shadows.md,
                ]}
                onPress={() => handleCardPress(section.screen)}
                activeOpacity={0.7}
              >
                <Text style={styles.cardIcon}>{section.icon}</Text>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{t(section.titleKey)}</Text>
              </TouchableOpacity>
            </AnimatedView>
          ))}
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
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  grid: {
    gap: 12,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderWidth: 1,
    minHeight: 80,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
});
