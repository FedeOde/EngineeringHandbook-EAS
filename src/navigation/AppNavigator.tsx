import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { useLanguage } from '../services/LanguageContext';

// Import screens
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { UnitConverterScreen } from '../components/UnitConverterScreen';
import { DrillTableScreen } from '../components/DrillTableScreen';
import { FlangeScreen } from '../components/FlangeScreen';
import { TorqueCalculatorScreen } from '../components/TorqueCalculatorScreen';
import { OffsetCalculatorScreen } from '../components/OffsetCalculatorScreen';
import { PhotoAnnotationScreen } from '../components/PhotoAnnotationScreen';
import { TaskListScreen } from '../components/TaskListScreen';
import { StickyNoteScreen } from '../components/StickyNoteScreen';
import { VoiceNoteScreen } from '../components/VoiceNoteScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  UnitConverter: undefined;
  DrillTable: undefined;
  Flange: undefined;
  TorqueCalculator: undefined;
  OffsetCalculator: undefined;
  PhotoAnnotation: undefined;
  TaskList: undefined;
  StickyNote: undefined;
  VoiceNote: undefined;
};

export type TabParamList = {
  Home: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Simple icon component using text
const TabIcon = ({ label, focused }: { label: string; focused?: boolean }) => (
  <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{label}</Text>
);

const MainTabs = () => {
  const { t } = useLanguage();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('home.title'),
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('settings.title'),
          tabBarIcon: ({ focused }) => <TabIcon label="⚙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { t } = useLanguage();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UnitConverter"
        component={UnitConverterScreen}
        options={{ title: t('unitConverter.title') }}
      />
      <Stack.Screen
        name="DrillTable"
        component={DrillTableScreen}
        options={{ title: t('drillTable.title') }}
      />
      <Stack.Screen
        name="Flange"
        component={FlangeScreen}
        options={{ title: t('flange.title') }}
      />
      <Stack.Screen
        name="TorqueCalculator"
        component={TorqueCalculatorScreen}
        options={{ title: t('torqueCalculator.title') }}
      />
      <Stack.Screen
        name="OffsetCalculator"
        component={OffsetCalculatorScreen}
        options={{ title: t('offsetCalculator.title') }}
      />
      <Stack.Screen
        name="PhotoAnnotation"
        component={PhotoAnnotationScreen}
        options={{ title: t('photo.title') }}
      />
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{ title: t('tasks.title') }}
      />
      <Stack.Screen
        name="StickyNote"
        component={StickyNoteScreen}
        options={{ title: t('stickyNote.title') }}
      />
      <Stack.Screen
        name="VoiceNote"
        component={VoiceNoteScreen}
        options={{ title: t('voiceNote.title') }}
      />
    </Stack.Navigator>
  );
};
