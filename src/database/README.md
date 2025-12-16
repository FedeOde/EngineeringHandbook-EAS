# Database Module

This module provides SQLite database functionality for the Engineering Pocket Helper application.

## Overview

The database module handles:
- Database schema creation and management
- Seed data for flange specifications (EN 1092-1, BS 10, ASME B16.5)
- Seed data for drill and threading tables (Metric, UNC, UNF, BSW, BSF, BSP, BA)
- Database connection and query utilities
- Data initialization and migration

## Structure

```
src/database/
├── database.ts          # Main database connection and utilities
├── schema.ts            # Database schema definitions
├── types.ts             # TypeScript type definitions
├── index.ts             # Public API exports
├── sqlite.d.ts          # Type declarations for react-native-sqlite-storage
├── seedData/
│   ├── flanges.ts       # Flange specification seed data
│   └── drills.ts        # Drill specification seed data
└── README.md            # This file
```

## Usage

### Initialize Database

```typescript
import { initializeDatabase } from '@/database';

// Initialize database (creates schema and seeds data if needed)
const db = await initializeDatabase();
```

### Execute Queries

```typescript
import { executeQuery } from '@/database';

// Query flanges
const flanges = await executeQuery(
  'SELECT * FROM flanges WHERE dn = ? AND standard = ?',
  [50, 'EN1092-1']
);

// Query drill specifications
const drills = await executeQuery(
  'SELECT * FROM drill_specs WHERE standard = ?',
  ['metric-coarse']
);
```

### Reset Database

```typescript
import { resetDatabase } from '@/database';

// Drop all tables and recreate with seed data
await resetDatabase();
```

## Database Schema

### Flanges Table

Stores flange specifications for various standards and pressure classes.

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

**Indexes:**
- `idx_flanges_lookup` on (dn, standard, class)
- `idx_flanges_pcd` on (pcd)

### Drill Specifications Table

Stores drill size tables for different thread standards.

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

**Indexes:**
- `idx_drill_specs_lookup` on (standard, thread_size)

### Tasks Table

Stores user tasks and their completion status.

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  completed_at INTEGER
);
```

## Seed Data

### Flange Standards

The database includes comprehensive flange specifications for:

**EN 1092-1 (European Standard)**
- PN6, PN10, PN16, PN25, PN40
- DN sizes from 10 to 300

**BS 10 (British Standard)**
- Table D, E, F, H
- DN sizes from 15 to 300

**ASME B16.5 (American Standard)**
- Class 150, Class 300
- DN sizes from 15 to 300

Total: 143 flange specifications

### Thread Standards

The database includes drill specifications for:

**Metric Threads**
- Metric Coarse (M1.6 to M36)
- Metric Fine (M6x0.75 to M30x2.0)

**Unified Threads**
- UNC - Unified National Coarse (#4-40 to 1"-8)
- UNF - Unified National Fine (#4-48 to 1"-12)

**British Threads**
- BSW - British Standard Whitworth (1/8" to 1")
- BSF - British Standard Fine (3/16" to 1")
- BSP - British Standard Pipe (1/8" to 2")
- BA - British Association (0BA to 10BA)

Total: 139 drill specifications

## API Reference

### Database Connection

- `openDatabase()` - Opens or creates the database connection
- `closeDatabase()` - Closes the database connection
- `getDatabase()` - Gets the current database instance

### Initialization

- `initializeDatabase()` - Initializes database (schema + seed data)
- `initializeSchema(db)` - Creates database tables and indexes
- `seedDatabase(db)` - Populates database with seed data

### Queries

- `executeQuery(sql, params)` - Executes a SQL query and returns results

### Maintenance

- `resetDatabase()` - Drops and recreates all tables with seed data
- `dropAllTables()` - Drops all database tables

## Data Validation

All seed data has been validated to ensure:
- Unique combinations (no duplicate DN/standard/class for flanges)
- Reasonable dimensional values
- Complete required fields
- Proper data types

## Performance Considerations

- Indexes are created on frequently queried columns
- Database is initialized once on app startup
- Seed data is only inserted if tables are empty
- Connection is reused throughout the app lifecycle

## Testing

Run the database tests:

```bash
npm test -- --testPathPattern="database.test"
```

Tests cover:
- Schema creation
- Seed data integrity
- Data validation
- Unique constraints
- Dimensional reasonableness
