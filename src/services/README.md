# Language Service

This module provides internationalization (i18n) support for the Engineering Pocket Helper application.

## Features

- **Bilingual Support**: English and Spanish translations
- **Persistent Language Selection**: User's language preference is saved to AsyncStorage
- **Runtime Language Switching**: Change language without app restart
- **React Context Integration**: Easy access to language functions throughout the app
- **Type-Safe**: Full TypeScript support

## Usage

### 1. Wrap your app with LanguageProvider

```typescript
import { LanguageProvider } from './services/LanguageContext';

const App = () => {
  return (
    <LanguageProvider>
      <YourAppContent />
    </LanguageProvider>
  );
};
```

### 2. Use the useLanguage hook in components

```typescript
import { useLanguage } from './services/LanguageContext';

const MyComponent = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();

  return (
    <View>
      <Text>{t('common.save')}</Text>
      <Button 
        title="Switch to Spanish" 
        onPress={() => setLanguage('es')} 
      />
    </View>
  );
};
```

### 3. Add translations to locale files

Edit `src/locales/en.json` and `src/locales/es.json` to add new translation keys.

## API

### LanguageService

- `initialize()`: Initialize the language service (called automatically by LanguageProvider)
- `getCurrentLanguage()`: Get the current language ('en' or 'es')
- `setLanguage(language)`: Change the current language
- `translate(key, params?)`: Translate a key with optional parameters

### useLanguage Hook

Returns:
- `currentLanguage`: Current language code ('en' or 'es')
- `setLanguage(language)`: Function to change language
- `t(key, params?)`: Translation function
- `isReady`: Boolean indicating if the service is initialized

## Components

### LanguageSelector

A reusable component for language selection with visual feedback.

```typescript
<LanguageSelector onLanguageSelected={() => console.log('Language changed')} />
```

### LanguageSelectionScreen

A full-screen component for language selection, typically used on first launch.

```typescript
<LanguageSelectionScreen onComplete={() => navigation.navigate('Home')} />
```

## Requirements Validation

This implementation satisfies the following requirements:

- **1.1**: Language selection screen displayed on first launch
- **1.2**: Language preference stored persistently in AsyncStorage
- **1.3**: Language changes update all interface text immediately
- **1.4**: Selected language maintained across all sections
- **1.5**: Settings provide option to change language

## Testing

Unit tests are provided for:
- LanguageService functionality
- LanguageSelector component behavior
- Language persistence
- Translation functionality
