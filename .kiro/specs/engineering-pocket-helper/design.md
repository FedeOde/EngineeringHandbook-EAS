# Design Document: Engineering Pocket Helper

## Overview

Engineering Pocket Helper es una aplicación móvil multiplataforma diseñada para proporcionar herramientas de ingeniería portátiles. La arquitectura se basa en un enfoque modular que separa las funcionalidades en componentes independientes, permitiendo mantenibilidad y escalabilidad. La aplicación utilizará React Native para desarrollo multiplataforma (iOS y Android), con almacenamiento local mediante SQLite y AsyncStorage para diferentes tipos de datos.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  (React Native Components + Navigation + i18n)          │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                    Business Logic Layer                  │
│  (Calculators, Converters, Data Validators)             │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                    Data Access Layer                     │
│  (SQLite DB, AsyncStorage, File System)                 │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                    Data Storage Layer                    │
│  (Local Database, Files, User Preferences)              │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: React Native (cross-platform mobile development)
- **Language**: TypeScript (type safety and better tooling)
- **Navigation**: React Navigation (screen navigation and routing)
- **Internationalization**: react-i18next (multi-language support)
- **Database**: SQLite (structured data storage for flanges, drill tables)
- **Key-Value Storage**: AsyncStorage (user preferences, settings)
- **File Storage**: React Native File System (photos, voice notes, drawings)
- **State Management**: React Context API + Hooks (lightweight state management)
- **Testing**: Jest + React Native Testing Library (unit tests), fast-check (property-based testing)

## Components and Interfaces

### 1. Language Module

**Responsibilities:**
- Manage language selection and persistence
- Provide translation services to all components
- Handle language switching at runtime

**Key Interfaces:**
```typescript
interface LanguageService {
  getCurrentLanguage(): Language;
  setLanguage(language: Language): Promise<void>;
  translate(key: string, params?: object): string;
}

type Language = 'en' | 'es';
```

### 2. Unit Converter Module

**Responsibilities:**
- Perform conversions between different unit systems
- Validate input values
- Maintain conversion formulas and factors

**Key Interfaces:**
```typescript
interface UnitConverter {
  convert(value: number, fromUnit: Unit, toUnit: Unit): number;
  getSupportedUnits(category: UnitCategory): Unit[];
}

type UnitCategory = 'length' | 'area' | 'volume' | 'mass' | 'force' | 
                    'temperature' | 'pressure' | 'power' | 'energy' | 
                    'time' | 'viscosity';

interface Unit {
  id: string;
  name: string;
  symbol: string;
  category: UnitCategory;
}
```

### 3. Drill and Threading Module

**Responsibilities:**
- Store and retrieve drill size tables
- Provide lookup functionality by thread standard and size
- Display threading specifications

**Key Interfaces:**
```typescript
interface DrillTableService {
  getDrillSize(standard: ThreadStandard, size: string): DrillSpecification;
  getAllSizes(standard: ThreadStandard): DrillSpecification[];
}

type ThreadStandard = 'metric-coarse' | 'metric-fine' | 'unc' | 'unf' | 
                      'bsw' | 'bsf' | 'bsp' | 'ba';

interface DrillSpecification {
  threadSize: string;
  pitch: number;
  tapDrillSize: number;
  tapDrillSizeImperial?: string;
}
```

### 4. Flange Database Module

**Responsibilities:**
- Store comprehensive flange specifications
- Provide lookup by DN, standard, and class
- Perform reverse lookup by measured PCD
- Calculate PCD tolerances for matching

**Key Interfaces:**
```typescript
interface FlangeService {
  getFlange(dn: number, standard: FlangeStandard, flangeClass: string): FlangeSpecification;
  findByPCD(pcd: number, tolerance?: number): FlangeSpecification[];
  getAllSizes(standard: FlangeStandard, flangeClass: string): FlangeSpecification[];
}

type FlangeStandard = 'EN1092-1' | 'BS10' | 'ASME-B16.5';

interface FlangeSpecification {
  dn: number;
  inches: number;
  standard: FlangeStandard;
  class: string;
  od: number;
  pcd: number;
  boltCount: number;
  boltSize: string;
  thickness: number;
}
```

### 5. Torque Calculator Module

**Responsibilities:**
- Calculate recommended torque values
- Account for bolt size, grade, and lubrication
- Provide conversions between torque units

**Key Interfaces:**
```typescript
interface TorqueCalculator {
  calculateTorque(boltSize: string, grade: BoltGrade, lubrication: LubricationCondition): TorqueValue;
  convertTorque(value: number, fromUnit: TorqueUnit, toUnit: TorqueUnit): number;
}

type BoltGrade = '4.6' | '4.8' | '5.8' | '8.8' | '10.9' | '12.9' | 'A2' | 'A4';
type LubricationCondition = 'dry' | 'lubricated' | 'anti-seize';
type TorqueUnit = 'Nm' | 'ft-lb' | 'kg-m';

interface TorqueValue {
  value: number;
  unit: TorqueUnit;
  range: { min: number; max: number };
}
```

### 6. Offset Calculator Module

**Responsibilities:**
- Calculate pipe offset dimensions
- Compute travel, rise, and run
- Generate visual diagrams

**Key Interfaces:**
```typescript
interface OffsetCalculator {
  calculateOffset(params: OffsetParameters): OffsetResult;
  getSupportedAngles(): number[];
}

interface OffsetParameters {
  offsetDistance: number;
  angle: number;
  pipeDiameter?: number;
}

interface OffsetResult {
  travel: number;
  rise: number;
  run: number;
  cutLength: number;
  diagram: DiagramData;
}
```

### 7. Photo Annotation Module

**Responsibilities:**
- Capture and load photos
- Provide drawing and annotation tools
- Save annotated images
- Manage photo storage

**Key Interfaces:**
```typescript
interface PhotoAnnotationService {
  loadPhoto(source: PhotoSource): Promise<Photo>;
  addAnnotation(photoId: string, annotation: Annotation): Promise<void>;
  saveAnnotatedPhoto(photoId: string): Promise<string>;
  deletePhoto(photoId: string): Promise<void>;
}

type PhotoSource = 'camera' | 'gallery';

interface Annotation {
  type: 'text' | 'line' | 'arrow' | 'rectangle' | 'circle';
  position: { x: number; y: number };
  properties: AnnotationProperties;
}

interface Photo {
  id: string;
  uri: string;
  annotations: Annotation[];
  timestamp: Date;
}
```

### 8. Task List Module

**Responsibilities:**
- Create, read, update, delete tasks
- Manage task completion status
- Persist task data

**Key Interfaces:**
```typescript
interface TaskService {
  createTask(description: string): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  getAllTasks(): Promise<Task[]>;
  toggleTaskCompletion(id: string): Promise<Task>;
}

interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}
```

### 9. Sticky Note Module

**Responsibilities:**
- Provide drawing canvas
- Capture touch input as strokes
- Save and retrieve drawings
- Manage drawing tools (colors, eraser)

**Key Interfaces:**
```typescript
interface StickyNoteService {
  createNote(): StickyNote;
  saveNote(note: StickyNote): Promise<string>;
  getNote(id: string): Promise<StickyNote>;
  deleteNote(id: string): Promise<void>;
  getAllNotes(): Promise<StickyNote[]>;
}

interface StickyNote {
  id: string;
  strokes: DrawingStroke[];
  timestamp: Date;
}

interface DrawingStroke {
  points: Point[];
  color: string;
  width: number;
}
```

### 10. Voice Note Module

**Responsibilities:**
- Record audio from microphone
- Save audio files
- Playback recordings
- Manage audio storage

**Key Interfaces:**
```typescript
interface VoiceNoteService {
  startRecording(): Promise<void>;
  stopRecording(): Promise<VoiceNote>;
  playNote(id: string): Promise<void>;
  pausePlayback(): Promise<void>;
  deleteNote(id: string): Promise<void>;
  getAllNotes(): Promise<VoiceNote[]>;
}

interface VoiceNote {
  id: string;
  uri: string;
  duration: number;
  timestamp: Date;
}
```

## Data Models

### Database Schema (SQLite)

**Flange Specifications Table:**
```sql
CREATE TABLE flanges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dn INTEGER NOT NULL,
  inches REAL NOT NULL,
  standard TEXT NOT NULL,
  class TEXT NOT NULL,
  od REAL NOT NULL,
  pcd REAL NOT NULL,
  bolt_count INTEGER NOT NULL,
  bolt_size TEXT NOT NULL,
  thickness REAL NOT NULL,
  UNIQUE(dn, standard, class)
);
```

**Drill Specifications Table:**
```sql
CREATE TABLE drill_specs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  standard TEXT NOT NULL,
  thread_size TEXT NOT NULL,
  pitch REAL NOT NULL,
  tap_drill_size REAL NOT NULL,
  tap_drill_size_imperial TEXT,
  UNIQUE(standard, thread_size)
);
```

**Tasks Table:**
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  completed_at INTEGER
);
```

### File Storage Structure

```
/app-data/
  /photos/
    /{photo-id}.jpg
    /{photo-id}-annotated.jpg
  /sticky-notes/
    /{note-id}.json
  /voice-notes/
    /{note-id}.m4a
```

### AsyncStorage Keys

```typescript
const STORAGE_KEYS = {
  LANGUAGE: '@app:language',
  LAST_UNIT_CATEGORY: '@app:last_unit_category',
  LAST_THREAD_STANDARD: '@app:last_thread_standard',
  LAST_FLANGE_STANDARD: '@app:last_flange_standard',
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, several properties can be consolidated:
- Task CRUD operations (8.1, 8.2, 8.4, 8.5) share common patterns and can be tested through comprehensive CRUD property tests
- Data persistence properties (8.3, 11.2) are related and test round-trip consistency
- Unit conversion properties (2.2, 2.4) both validate conversion correctness and can be combined
- Flange lookup properties (4.2, 4.3) both validate data completeness and can be combined

The following properties represent the unique, non-redundant correctness guarantees:

### Property 1: Language setting persistence round-trip
*For any* valid language selection (English or Spanish), storing the language preference and then retrieving it should return the same language value.
**Validates: Requirements 1.2**

### Property 2: Language consistency across modules
*For any* application state, querying the current language from different modules should return the same language value.
**Validates: Requirements 1.4**

### Property 3: Unit conversion mathematical correctness
*For any* valid numerical value and pair of units within the same category, converting from unit A to unit B and then back to unit A should return a value within acceptable precision tolerance of the original value (round-trip property).
**Validates: Requirements 2.2, 2.4**

### Property 4: Invalid input rejection
*For any* invalid input (non-numeric, NaN, Infinity, null, undefined), the conversion function should reject the input and not perform calculation.
**Validates: Requirements 2.5**

### Property 5: Thread specification completeness
*For any* valid thread standard and size combination, the returned drill specification should contain all required fields: thread size, pitch, and tap drill size.
**Validates: Requirements 3.2, 3.3**

### Property 6: Thread specification unit duality
*For any* thread specification where imperial units are applicable, the returned data should contain both metric and imperial representations.
**Validates: Requirements 3.5**

### Property 7: Flange specification completeness
*For any* valid DN size, standard, and class combination, the returned flange specification should contain all required dimensions: OD, PCD, bolt count, bolt size, thickness, DN, and inches.
**Validates: Requirements 4.2, 4.3**

### Property 8: PCD reverse lookup accuracy
*For any* PCD value, all returned flange specifications should have PCD values within a reasonable tolerance (±2mm) of the input PCD value.
**Validates: Requirements 4.4**

### Property 9: Flange results sorting
*For any* list of flange specifications returned from a PCD search, the results should be sorted in ascending order by DN size.
**Validates: Requirements 4.5**

### Property 10: Torque calculation validity
*For any* valid bolt size and grade combination, the calculated torque value should be a positive number within reasonable engineering limits (> 0 and < 10000 Nm).
**Validates: Requirements 5.1**

### Property 11: Torque multi-unit representation
*For any* calculated torque value, the result should include representations in all three required units: Nm, ft-lb, and kg-m.
**Validates: Requirements 5.3**

### Property 12: Lubrication effect on torque
*For any* bolt specification, the torque value with lubrication should be less than the torque value without lubrication (dry condition).
**Validates: Requirements 5.5**

### Property 13: Offset calculation geometric correctness
*For any* offset distance and angle, the calculated travel, rise, and run should satisfy the Pythagorean theorem: travel² = rise² + run².
**Validates: Requirements 6.1, 6.2**

### Property 14: Pipe diameter effect on offset
*For any* offset parameters, including a pipe diameter should result in a different (larger) travel distance than the same parameters without pipe diameter.
**Validates: Requirements 6.3**

### Property 15: Annotated photo preservation
*For any* photo with annotations, saving the annotated version should create a new file while the original photo file remains unchanged and accessible.
**Validates: Requirements 7.3**

### Property 16: Annotation mutability
*For any* saved annotation, it should be possible to modify its properties and retrieve the modified version, or delete it entirely.
**Validates: Requirements 7.4**

### Property 17: Photo export format validity
*For any* exported annotated photo, the file should be a valid image format (JPEG or PNG) that can be read by standard image libraries.
**Validates: Requirements 7.5**

### Property 18: Task creation state
*For any* newly created task with a valid description, the task should appear in the task list with completed status set to false.
**Validates: Requirements 8.1**

### Property 19: Task completion toggle
*For any* task, toggling its completion status should change the completed field from false to true or true to false.
**Validates: Requirements 8.2**

### Property 20: Task persistence round-trip
*For any* task with its completion status, saving the task and then retrieving it should return a task with the same description and completion status.
**Validates: Requirements 8.3**

### Property 21: Task deletion completeness
*For any* task that exists in the task list, after deleting that task, it should not appear in subsequent queries for all tasks.
**Validates: Requirements 8.4**

### Property 22: Task description mutability
*For any* task, updating its description should result in the task having the new description when retrieved.
**Validates: Requirements 8.5**

### Property 23: Sticky note timestamp presence
*For any* saved sticky note, the note should have a timestamp field that represents a valid date and time.
**Validates: Requirements 9.3**

### Property 24: Sticky note CRUD operations
*For any* sticky note, it should be possible to retrieve it after saving, modify its strokes, and delete it from storage.
**Validates: Requirements 9.4**

### Property 25: Voice note timestamp presence
*For any* saved voice note, the note should have a timestamp field that represents a valid date and time.
**Validates: Requirements 10.2**

### Property 26: Voice note metadata completeness
*For any* retrieved voice note, it should contain all required metadata fields: id, uri, duration, and timestamp.
**Validates: Requirements 10.4**

### Property 27: Voice note deletion cleanup
*For any* voice note, after deletion, the audio file should no longer exist in the file system.
**Validates: Requirements 10.5**

### Property 28: Application restart data persistence
*For any* user data (tasks, settings, notes) saved before application restart, the same data should be retrievable after restart.
**Validates: Requirements 11.2**

### Property 29: Storage limit error handling
*For any* save operation when storage space is insufficient, the application should return an error before attempting to write data.
**Validates: Requirements 11.5**

## Error Handling

### Error Categories

1. **Input Validation Errors**
   - Invalid numeric input in converters and calculators
   - Out-of-range values
   - Missing required parameters
   - Malformed data

2. **Data Not Found Errors**
   - Requested flange specification doesn't exist
   - Thread standard/size combination not in database
   - Task/note ID not found

3. **Storage Errors**
   - Insufficient storage space
   - File system access denied
   - Database connection failures
   - Corrupted data files

4. **Hardware Errors**
   - Camera access denied
   - Microphone access denied
   - File system permissions denied

5. **Network Errors** (future consideration)
   - No internet connection for updates
   - API timeout

### Error Handling Strategy

**Validation Layer:**
- All user inputs must be validated before processing
- Validation errors should provide clear, actionable messages in the user's selected language
- Invalid inputs should never cause application crashes

**Service Layer:**
- All service methods should return Result types or throw typed exceptions
- Database operations should be wrapped in try-catch blocks
- File operations should check permissions before attempting access

**Presentation Layer:**
- All errors should be caught and displayed to users in a friendly format
- Critical errors should be logged for debugging
- Users should always have a path to recover from errors

**Error Response Format:**
```typescript
interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
  recoverable: boolean;
}
```

## Testing Strategy

### Unit Testing Approach

The application will use Jest and React Native Testing Library for unit testing. Unit tests will focus on:

**Business Logic Testing:**
- Individual calculator functions (unit conversions, torque calculations, offset calculations)
- Data validation functions
- Utility functions and helpers
- Service layer methods

**Component Testing:**
- React component rendering with various props
- User interaction handlers
- State management logic
- Navigation flows

**Data Layer Testing:**
- Database query functions
- CRUD operations
- Data transformation functions
- Storage operations

**Example Unit Tests:**
- Test that converting 1 meter to centimeters returns 100
- Test that creating a task with empty description is rejected
- Test that deleting a non-existent task returns appropriate error
- Test that flange lookup with invalid DN returns null

### Property-Based Testing Approach

The application will use fast-check for property-based testing in JavaScript/TypeScript. Property-based tests will verify universal properties across many randomly generated inputs.

**Configuration:**
- Each property-based test MUST run a minimum of 100 iterations
- Tests will use custom generators for domain-specific types (units, thread standards, flange specifications)
- Each property test MUST be tagged with a comment referencing the design document property

**Tag Format:**
```typescript
// Feature: engineering-pocket-helper, Property 3: Unit conversion mathematical correctness
```

**Property Test Coverage:**
- All 29 correctness properties defined in this document MUST be implemented as property-based tests
- Each correctness property MUST be implemented by exactly ONE property-based test
- Tests will generate random valid inputs to verify properties hold universally

**Example Property Tests:**
- For any valid unit conversion, round-trip conversion should return original value within tolerance
- For any task, saving and loading should preserve all fields
- For any flange PCD search, all results should have PCD within tolerance
- For any offset calculation, geometric relationships should hold

**Custom Generators:**
```typescript
// Example generator for unit categories
const unitCategoryArbitrary = fc.constantFrom(
  'length', 'area', 'volume', 'mass', 'force', 
  'temperature', 'pressure', 'power', 'energy', 
  'time', 'viscosity'
);

// Example generator for valid numeric values
const validNumberArbitrary = fc.double({ 
  min: 0.000001, 
  max: 1000000, 
  noNaN: true 
});
```

### Integration Testing

Integration tests will verify that modules work correctly together:
- Language service integration with all UI components
- Database operations with service layer
- File system operations with photo and voice note services
- Complete user workflows (e.g., create task → mark complete → verify persistence)

### Test Organization

```
/src
  /modules
    /unit-converter
      UnitConverter.ts
      UnitConverter.test.ts          # Unit tests
      UnitConverter.properties.test.ts  # Property-based tests
    /flange-database
      FlangeService.ts
      FlangeService.test.ts
      FlangeService.properties.test.ts
```

### Testing Priorities

1. **Critical Path Testing** (highest priority):
   - Unit conversion accuracy
   - Flange and drill table lookups
   - Data persistence (tasks, notes, settings)

2. **Data Integrity Testing**:
   - Round-trip properties for all storage operations
   - Validation of all user inputs
   - Error handling for edge cases

3. **User Experience Testing**:
   - Language switching
   - Photo annotation workflows
   - Task management operations

## Implementation Considerations

### Performance

- **Database Indexing**: Create indexes on frequently queried columns (DN, standard, class for flanges; standard, thread_size for drills)
- **Lazy Loading**: Load flange and drill data on-demand rather than all at once
- **Image Optimization**: Compress photos before saving to reduce storage usage
- **Caching**: Cache frequently accessed data (current language, last used units)

### Scalability

- **Modular Architecture**: Each feature module is independent and can be updated separately
- **Database Schema**: Design allows for adding new flange standards and thread types without schema changes
- **Extensibility**: New unit categories and conversion factors can be added through configuration

### Security

- **Input Sanitization**: All user inputs must be sanitized before storage or processing
- **File Access**: Restrict file operations to application sandbox
- **Data Privacy**: All data stored locally on device, no external transmission
- **Permission Handling**: Request camera and microphone permissions only when needed

### Accessibility

- **Text Scaling**: Support system font size settings
- **Color Contrast**: Ensure sufficient contrast for readability
- **Screen Reader Support**: Provide appropriate labels for all interactive elements
- **Touch Targets**: Minimum 44x44 points for all touchable elements

### Internationalization

- **Translation Files**: Separate JSON files for English and Spanish translations
- **Number Formatting**: Use locale-appropriate number formatting
- **Unit Preferences**: Allow users to set preferred unit systems
- **Date/Time Formatting**: Use locale-appropriate date and time formats

### Offline Support

- **Complete Offline Functionality**: All features work without internet connection
- **Local Data Storage**: All reference data (flanges, drills, torque tables) stored locally
- **No Cloud Dependency**: Application fully functional without network access
