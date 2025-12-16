# Implementation Plan

- [x] 1. Set up project structure and dependencies





  - Initialize React Native project with TypeScript
  - Install required dependencies: react-navigation, react-i18next, SQLite, AsyncStorage, fast-check, Jest
  - Configure TypeScript with strict mode
  - Set up folder structure for modules, components, services, and tests
  - _Requirements: All_

- [x] 2. Implement language service and internationalization





  - Create language service interface and implementation
  - Set up i18next configuration with English and Spanish translation files
  - Implement language persistence using AsyncStorage
  - Create language selection screen component
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2.1 Write property test for language persistence






  - **Property 1: Language setting persistence round-trip**
  - **Validates: Requirements 1.2**

- [x] 2.2 Write property test for language consistency






  - **Property 2: Language consistency across modules**
  - **Validates: Requirements 1.4**

- [x] 3. Create database schema and seed data





  - Design and create SQLite database schema for flanges and drill specifications
  - Create database initialization and migration utilities
  - Prepare seed data for flange specifications (EN 1092-1, BS 10, ASME B16.5)
  - Prepare seed data for drill and threading tables (Metric, UNC, UNF, BSW, BSF, BSP, BA)
  - Implement database connection and query utilities
  - _Requirements: 3.1, 4.1_

- [x] 4. Implement unit converter module




  - Define unit categories and unit definitions
  - Implement conversion formulas and factors for all 11 unit categories
  - Create UnitConverter service with convert() method
  - Implement input validation for numeric values
  - Create unit converter UI component with dropdowns and input fields
  - _Requirements: 2.1, 2.2, 2.4, 2.5_

- [x] 4.1 Write property test for unit conversion round-trip





  - **Property 3: Unit conversion mathematical correctness**
  - **Validates: Requirements 2.2, 2.4**

- [x] 4.2 Write property test for invalid input rejection






  - **Property 4: Invalid input rejection**
  - **Validates: Requirements 2.5**

- [x] 5. Implement drill and threading table module





  - Create DrillTableService with database query methods
  - Implement getDrillSize() and getAllSizes() methods
  - Create drill table UI component with thread standard selector
  - Display drill specifications with both metric and imperial units
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [x] 5.1 Write property test for thread specification completeness






  - **Property 5: Thread specification completeness**
  - **Validates: Requirements 3.2, 3.3**

- [x] 5.2 Write property test for thread specification unit duality






  - **Property 6: Thread specification unit duality**
  - **Validates: Requirements 3.5**

- [x] 6. Implement flange database module








  - Create FlangeService with database query methods
  - Implement getFlange() method for direct lookup by DN, standard, and class
  - Implement findByPCD() method for reverse lookup with tolerance calculation
  - Implement sorting logic for PCD search results
  - Create flange lookup UI component with standard and class selectors
  - Create PCD search UI component with input field and results list
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6.1 Write property test for flange specification completeness






  - **Property 7: Flange specification completeness**
  - **Validates: Requirements 4.2, 4.3**

- [x] 6.2 Write property test for PCD reverse lookup accuracy






  - **Property 8: PCD reverse lookup accuracy**
  - **Validates: Requirements 4.4**

- [x] 6.3 Write property test for flange results sorting






  - **Property 9: Flange results sorting**
  - **Validates: Requirements 4.5**

- [x] 7. Implement torque calculator module





  - Create torque calculation formulas for different bolt grades
  - Implement TorqueCalculator service with calculateTorque() method
  - Implement torque unit conversion (Nm, ft-lb, kg-m)
  - Create torque calculator UI component with bolt size and grade selectors
  - Add lubrication condition selector
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 7.1 Write property test for torque calculation validity






  - **Property 10: Torque calculation validity**
  - **Validates: Requirements 5.1**

- [x] 7.2 Write property test for torque multi-unit representation






  - **Property 11: Torque multi-unit representation**
  - **Validates: Requirements 5.3**

- [x] 7.3 Write property test for lubrication effect on torque






  - **Property 12: Lubrication effect on torque**
  - **Validates: Requirements 5.5**

- [x] 8. Implement offset calculator module





  - Create geometric calculation functions for pipe offsets
  - Implement OffsetCalculator service with calculateOffset() method
  - Calculate travel, rise, run, and cut length
  - Account for pipe diameter in calculations
  - Create offset calculator UI component with input fields
  - Generate visual diagram data for offset display
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 8.1 Write property test for offset geometric correctness






  - **Property 13: Offset calculation geometric correctness**
  - **Validates: Requirements 6.1, 6.2**

- [x] 8.2 Write property test for pipe diameter effect






  - **Property 14: Pipe diameter effect on offset**
  - **Validates: Requirements 6.3**

- [x] 9. Checkpoint - Ensure all calculator tests pass





  - Ensure all tests pass, ask the user if questions arise

- [x] 10. Implement task list module





  - Create Task data model and interface
  - Set up SQLite table for tasks
  - Implement TaskService with CRUD operations
  - Create task list UI component with add, toggle, edit, delete functionality
  - Implement task persistence and retrieval
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 10.1 Write property test for task creation state






  - **Property 18: Task creation state**
  - **Validates: Requirements 8.1**

- [x] 10.2 Write property test for task completion toggle






  - **Property 19: Task completion toggle**
  - **Validates: Requirements 8.2**

- [x] 10.3 Write property test for task persistence round-trip






  - **Property 20: Task persistence round-trip**
  - **Validates: Requirements 8.3**

- [x] 10.4 Write property test for task deletion completeness






  - **Property 21: Task deletion completeness**
  - **Validates: Requirements 8.4**

- [x] 10.5 Write property test for task description mutability






  - **Property 22: Task description mutability**
  - **Validates: Requirements 8.5**

- [x] 11. Implement photo annotation module




  - Set up camera and gallery access permissions
  - Create PhotoAnnotationService with file management methods
  - Implement photo loading from camera and gallery
  - Create annotation data structures (text, line, arrow, shapes)
  - Implement annotation rendering on canvas
  - Create photo annotation UI component with drawing tools
  - Implement save functionality that preserves original photo
  - Implement annotation editing and deletion
  - Add export functionality for JPEG and PNG formats
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 11.1 Write property test for annotated photo preservation






  - **Property 15: Annotated photo preservation**
  - **Validates: Requirements 7.3**

- [x] 11.2 Write property test for annotation mutability






  - **Property 16: Annotation mutability**
  - **Validates: Requirements 7.4**

- [x] 11.3 Write property test for photo export format validity






  - **Property 17: Photo export format validity**
  - **Validates: Requirements 7.5**

- [x] 12. Implement sticky note module





  - Create StickyNote data model with strokes
  - Implement StickyNoteService with file storage operations
  - Create drawing canvas component with touch input handling
  - Implement stroke rendering and storage
  - Add drawing tools: color picker and eraser
  - Create sticky note list view component
  - Implement note saving with timestamps
  - Add edit and delete functionality
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 12.1 Write property test for sticky note timestamp presence






  - **Property 23: Sticky note timestamp presence**
  - **Validates: Requirements 9.3**

- [x] 12.2 Write property test for sticky note CRUD operations






  - **Property 24: Sticky note CRUD operations**
  - **Validates: Requirements 9.4**


- [x] 13. Implement voice note module










  - Set up microphone access permissions
  - Create VoiceNote data model
  - Implement VoiceNoteService with audio recording and playback
  - Create voice note recording UI component with record/stop controls
  - Implement audio file storage with timestamps
  - Calculate and store recording duration
  - Create voice note list view component
  - Implement playback controls with pause functionality
  - Add delete functionality with file cleanup
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_



- [x] 13.1 Write property test for voice note timestamp presence





  - **Property 25: Voice note timestamp presence**
  - **Validates: Requirements 10.2**

- [x] 13.2 Write property test for voice note metadata completeness






  - **Property 26: Voice note metadata completeness**
  - **Validates: Requirements 10.4**

- [x] 13.3 Write property test for voice note deletion cleanup






  - **Property 27: Voice note deletion cleanup**
  - **Validates: Requirements 10.5**

- [x] 14. Implement data persistence and storage management





  - Create storage utility functions for checking available space
  - Implement error handling for insufficient storage
  - Add data restoration logic for application restart
  - Implement storage cleanup utilities
  - Create backup and restore functionality for user data
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 14.1 Write property test for application restart data persistence






  - **Property 28: Application restart data persistence**
  - **Validates: Requirements 11.2**

- [x] 14.2 Write property test for storage limit error handling






  - **Property 29: Storage limit error handling**
  - **Validates: Requirements 11.5**

- [x] 15. Implement navigation and main app structure





  - Set up React Navigation with tab navigator for main sections
  - Create home screen with section cards
  - Implement navigation between all feature screens
  - Add settings screen with language selector
  - Create consistent header and navigation patterns
  - _Requirements: All_

- [x] 16. Implement error handling and user feedback



  - Create error boundary components
  - Implement toast/snackbar notifications for user feedback
  - Add loading indicators for async operations
  - Create error display components with recovery options
  - Implement validation error messages in both languages
  - _Requirements: All_

- [x] 17. Polish UI and user experience




  - Apply consistent styling and theming
  - Implement responsive layouts for different screen sizes
  - Add animations and transitions
  - Optimize touch targets for accessibility
  - Implement dark mode support (optional enhancement)
  - _Requirements: All_

- [x] 18. Final checkpoint - Ensure all tests pass









  - Ensure all tests pass, ask the user if questions arise
