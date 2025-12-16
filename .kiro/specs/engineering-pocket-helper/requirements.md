# Requirements Document

## Introduction

Engineering Pocket Helper es una aplicación móvil diseñada para asistir a ingenieros y técnicos en campo con herramientas de cálculo, conversión, consulta de especificaciones técnicas y gestión de tareas. La aplicación proporciona acceso rápido a tablas de referencia, calculadoras especializadas y herramientas de documentación que facilitan el trabajo diario en proyectos de ingeniería mecánica, tuberías y construcción.

## Glossary

- **Application**: La aplicación móvil Engineering Pocket Helper
- **User**: Ingeniero o técnico que utiliza la aplicación
- **Language Setting**: Configuración de idioma de la interfaz (inglés o español)
- **Unit Converter**: Módulo de conversión de unidades de medida
- **Drill Table**: Tabla de referencia de medidas de brocas para roscado
- **Flange Database**: Base de datos de especificaciones de bridas según normas internacionales
- **DN**: Diámetro nominal de brida
- **PCD**: Pitch Circle Diameter (diámetro del círculo de pernos)
- **Torque Calculator**: Calculadora de torque de ajuste para pernos
- **Offset Calculator**: Calculadora de desviaciones para tuberías
- **Photo Annotation Tool**: Herramienta de anotación sobre fotografías
- **Task List**: Lista de tareas pendientes
- **Sticky Note**: Nota rápida dibujada con el dedo
- **Voice Note**: Nota de audio grabada por el usuario

## Requirements

### Requirement 1: Language Selection

**User Story:** Como usuario, quiero poder seleccionar el idioma de la aplicación entre inglés y español, para que pueda utilizar la aplicación en mi idioma preferido.

#### Acceptance Criteria

1. WHEN the Application starts for the first time, THE Application SHALL display a language selection screen with options for English and Spanish
2. WHEN the User selects a Language Setting, THE Application SHALL store the preference persistently
3. WHEN the User changes the Language Setting, THE Application SHALL update all interface text immediately without requiring restart
4. THE Application SHALL maintain the selected Language Setting across all sections and features
5. WHERE the User accesses settings, THE Application SHALL provide an option to change the Language Setting

### Requirement 2: Unit Conversion

**User Story:** Como ingeniero, quiero convertir entre diferentes unidades de medida, para que pueda trabajar con especificaciones en diversos sistemas de medición.

#### Acceptance Criteria

1. THE Application SHALL provide conversion functionality for the following physical quantities: Length, Area, Volume, Mass, Force, Temperature, Pressure, Power, Energy, Time, and Viscosity
2. WHEN the User inputs a numerical value with a source unit, THE Application SHALL calculate and display the equivalent value in the selected target unit
3. WHEN the User changes either the source or target unit, THE Application SHALL recalculate the conversion immediately
4. THE Application SHALL maintain precision to at least 6 significant figures in all conversions
5. WHEN invalid input is entered, THE Application SHALL display an error message and prevent calculation

### Requirement 3: Drill and Threading Tables

**User Story:** Como técnico de taller, quiero consultar las medidas de brocas para diferentes tipos de roscado, para que pueda seleccionar la broca correcta para cada trabajo.

#### Acceptance Criteria

1. THE Application SHALL provide drill size tables for the following thread standards: Metric Coarse, Metric Fine, UNC, UNF, BSW, BSF, BSP, and BA
2. WHEN the User selects a thread standard and size, THE Application SHALL display the recommended drill diameter
3. THE Application SHALL display complete threading specifications including pitch and tap drill sizes
4. THE Application SHALL allow the User to browse all available sizes within each thread standard
5. THE Application SHALL display measurements in both metric and imperial units where applicable

### Requirement 4: Flange Specifications Lookup

**User Story:** Como ingeniero de tuberías, quiero buscar especificaciones de bridas por norma y clase, para que pueda verificar dimensiones durante instalación y diseño.

#### Acceptance Criteria

1. THE Application SHALL support flange specifications for the following standards: EN 1092-1 (PN6, PN10, PN16, PN25, PN40), BS 10 (Tables D, E, F, H), and ASME B16.5 (Class 150, Class 300)
2. WHEN the User selects a DN size, standard, and class, THE Application SHALL display the complete flange dimensions including OD, PCD, bolt quantity, bolt size, and thickness
3. THE Application SHALL display flange sizes in both DN and inch designations
4. WHEN the User inputs a measured PCD value, THE Application SHALL recommend compatible flange sizes with their complete specifications
5. WHEN multiple flanges match a measured PCD, THE Application SHALL display all compatible options sorted by DN size

### Requirement 5: Torque Calculation

**User Story:** Como técnico de montaje, quiero calcular el torque de ajuste necesario para pernos, para que pueda realizar ajustes correctos y seguros.

#### Acceptance Criteria

1. WHEN the User selects a bolt size and grade, THE Application SHALL calculate and display the recommended tightening torque
2. THE Application SHALL support metric and imperial bolt sizes
3. THE Application SHALL display torque values in multiple units (Nm, ft-lb, kg-m)
4. THE Application SHALL provide torque specifications for standard bolt grades and materials
5. WHEN the User specifies lubrication conditions, THE Application SHALL adjust torque recommendations accordingly

### Requirement 6: Pipe Offset Calculations

**User Story:** Como instalador de tuberías, quiero calcular dimensiones para desviaciones de tubería, para que pueda determinar longitudes de corte y ángulos sin desperdicio de material.

#### Acceptance Criteria

1. WHEN the User inputs offset distance and angle, THE Application SHALL calculate the required pipe length
2. THE Application SHALL calculate travel distance, rise, and run for pipe offsets
3. WHEN the User specifies pipe diameter, THE Application SHALL account for center-to-center measurements
4. THE Application SHALL support common offset angles (15°, 22.5°, 30°, 45°, 60°, 90°)
5. THE Application SHALL display a visual diagram of the calculated offset with labeled dimensions

### Requirement 7: Photo Annotation

**User Story:** Como inspector de campo, quiero anotar medidas y dimensiones directamente sobre fotografías, para que pueda documentar mediciones in situ de manera visual.

#### Acceptance Criteria

1. WHEN the User captures or selects a photo, THE Application SHALL allow adding text annotations with measurements
2. THE Application SHALL allow drawing lines, arrows, and shapes on photos
3. WHEN the User adds annotations, THE Application SHALL save the annotated photo separately from the original
4. THE Application SHALL allow the User to edit or delete annotations after creation
5. THE Application SHALL export annotated photos in standard image formats (JPEG, PNG)

### Requirement 8: Task List Management

**User Story:** Como gestor de proyectos, quiero crear y gestionar una lista de tareas, para que pueda organizar y dar seguimiento a trabajos pendientes.

#### Acceptance Criteria

1. WHEN the User creates a new task, THE Application SHALL add it to the task list with an unchecked status
2. WHEN the User marks a task as complete, THE Application SHALL update its status to checked
3. THE Application SHALL persist all tasks and their completion status
4. WHEN the User deletes a task, THE Application SHALL remove it from the list permanently
5. THE Application SHALL allow the User to edit task descriptions after creation

### Requirement 9: Sticky Note Drawing

**User Story:** Como usuario, quiero crear notas rápidas dibujando con el dedo en la pantalla, para que pueda capturar ideas o esquemas de manera inmediata.

#### Acceptance Criteria

1. WHEN the User accesses the sticky note feature, THE Application SHALL provide a blank canvas for finger drawing
2. THE Application SHALL capture and render touch input as continuous drawing strokes
3. WHEN the User saves a sticky note, THE Application SHALL store it with a timestamp
4. THE Application SHALL allow the User to view, edit, and delete saved sticky notes
5. THE Application SHALL provide basic drawing tools including color selection and eraser

### Requirement 10: Voice Notes Recording

**User Story:** Como usuario en campo, quiero grabar notas de voz, para que pueda documentar información rápidamente sin necesidad de escribir.

#### Acceptance Criteria

1. WHEN the User initiates voice recording, THE Application SHALL capture audio from the device microphone
2. WHEN the User stops recording, THE Application SHALL save the voice note with a timestamp
3. THE Application SHALL allow the User to play back recorded voice notes
4. THE Application SHALL display a list of all saved voice notes with duration and timestamp
5. WHEN the User deletes a voice note, THE Application SHALL remove it and free storage space

### Requirement 11: Data Persistence

**User Story:** Como usuario, quiero que mis datos y configuraciones se guarden automáticamente, para que no pierda información al cerrar la aplicación.

#### Acceptance Criteria

1. WHEN the User creates or modifies content, THE Application SHALL save changes to persistent storage immediately
2. WHEN the Application restarts, THE Application SHALL restore all user data including tasks, notes, and settings
3. THE Application SHALL maintain data integrity during unexpected application termination
4. THE Application SHALL provide adequate storage management for photos, drawings, and voice recordings
5. WHEN storage space is insufficient, THE Application SHALL notify the User before attempting to save new content
