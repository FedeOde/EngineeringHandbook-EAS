// Database schema definitions

export const CREATE_FLANGES_TABLE = `
  CREATE TABLE IF NOT EXISTS flanges (
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
`;

export const CREATE_DRILL_SPECS_TABLE = `
  CREATE TABLE IF NOT EXISTS drill_specs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    standard TEXT NOT NULL,
    thread_size TEXT NOT NULL,
    pitch REAL NOT NULL,
    tap_drill_size REAL NOT NULL,
    tap_drill_size_imperial TEXT,
    UNIQUE(standard, thread_size)
  );
`;

export const CREATE_TASKS_TABLE = `
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    completed_at INTEGER
  );
`;

// Indexes for performance optimization
export const CREATE_FLANGES_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_flanges_lookup 
  ON flanges(dn, standard, class);
`;

export const CREATE_FLANGES_PCD_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_flanges_pcd 
  ON flanges(pcd);
`;

export const CREATE_DRILL_SPECS_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_drill_specs_lookup 
  ON drill_specs(standard, thread_size);
`;

export const ALL_SCHEMAS = [
  CREATE_FLANGES_TABLE,
  CREATE_DRILL_SPECS_TABLE,
  CREATE_TASKS_TABLE,
  CREATE_FLANGES_INDEX,
  CREATE_FLANGES_PCD_INDEX,
  CREATE_DRILL_SPECS_INDEX,
];
