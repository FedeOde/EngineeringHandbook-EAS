# Engineering Pocket Helper

A mobile application for engineering calculations, reference tools, and field documentation.

## Project Structure

```
engineering-pocket-helper/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── modules/                # Feature modules
│   │   ├── unit-converter/     # Unit conversion module
│   │   ├── drill-table/        # Drill and threading tables
│   │   ├── flange-database/    # Flange specifications
│   │   ├── torque-calculator/  # Torque calculations
│   │   ├── offset-calculator/  # Pipe offset calculations
│   │   ├── photo-annotation/   # Photo annotation tools
│   │   ├── task-list/          # Task management
│   │   ├── sticky-note/        # Drawing notes
│   │   └── voice-note/         # Voice recordings
│   ├── components/             # Reusable UI components
│   ├── services/               # Business logic services
│   ├── navigation/             # Navigation configuration
│   ├── locales/                # Translation files (en, es)
│   ├── database/               # SQLite schema and seed data
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
├── __tests__/                  # Test files
├── android/                    # Android native code
├── ios/                        # iOS native code
└── package.json
```

## Setup

### Prerequisites

- Node.js >= 18
- React Native development environment
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and SDK

### Installation

```bash
# Install dependencies
npm install

# iOS only: Install pods
cd ios && pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Features

- **Unit Converter**: Convert between 11 categories of units
- **Drill Tables**: Reference for threading specifications
- **Flange Database**: Lookup flange specifications by standard
- **Torque Calculator**: Calculate bolt tightening torque
- **Offset Calculator**: Calculate pipe offset dimensions
- **Photo Annotation**: Annotate measurements on photos
- **Task List**: Manage project tasks
- **Sticky Notes**: Quick drawing notes
- **Voice Notes**: Audio recordings
- **Bilingual**: English and Spanish support

## Technology Stack

- React Native 0.72
- TypeScript (strict mode)
- React Navigation
- react-i18next (internationalization)
- SQLite (structured data)
- AsyncStorage (preferences)
- Jest + fast-check (testing)

## License

Proprietary
