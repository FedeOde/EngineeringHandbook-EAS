import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { ALL_SCHEMAS } from './schema';
import { ALL_FLANGE_DATA } from './seedData/flanges';
import { ALL_DRILL_DATA } from './seedData/drills';

// Enable promise API
SQLite.enablePromise(true);

const DATABASE_NAME = 'engineering_helper.db';
const DATABASE_VERSION = 1;

let databaseInstance: SQLiteDatabase | null = null;

/**
 * Opens or creates the database connection
 */
export const openDatabase = async (): Promise<SQLiteDatabase> => {
  if (databaseInstance) {
    return databaseInstance;
  }

  try {
    const db = await SQLite.openDatabase({
      name: DATABASE_NAME,
      location: 'default',
    });

    databaseInstance = db;
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};

/**
 * Closes the database connection
 */
export const closeDatabase = async (): Promise<void> => {
  if (databaseInstance) {
    await databaseInstance.close();
    databaseInstance = null;
  }
};

/**
 * Initializes the database schema
 */
export const initializeSchema = async (db: SQLiteDatabase): Promise<void> => {
  try {
    // Execute all schema creation statements
    for (const schema of ALL_SCHEMAS) {
      await db.executeSql(schema);
    }
  } catch (error) {
    console.error('Error initializing schema:', error);
    throw error;
  }
};

/**
 * Checks if the database has been seeded
 */
const isDatabaseSeeded = async (db: SQLiteDatabase): Promise<boolean> => {
  try {
    const [result] = await db.executeSql('SELECT COUNT(*) as count FROM flanges');
    return result.rows.item(0).count > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Seeds the database with initial data
 */
export const seedDatabase = async (db: SQLiteDatabase): Promise<void> => {
  try {
    // Check if already seeded
    const isSeeded = await isDatabaseSeeded(db);
    if (isSeeded) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database...');

    // Seed flange data
    for (const flange of ALL_FLANGE_DATA) {
      await db.executeSql(
        `INSERT INTO flanges (dn, inches, standard, class, od, pcd, bolt_count, bolt_size, thickness)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          flange.dn,
          flange.inches,
          flange.standard,
          flange.class,
          flange.od,
          flange.pcd,
          flange.boltCount,
          flange.boltSize,
          flange.thickness,
        ]
      );
    }

    // Seed drill data
    for (const drill of ALL_DRILL_DATA) {
      await db.executeSql(
        `INSERT INTO drill_specs (standard, thread_size, pitch, tap_drill_size, tap_drill_size_imperial)
         VALUES (?, ?, ?, ?, ?)`,
        [
          drill.standard,
          drill.threadSize,
          drill.pitch,
          drill.tapDrillSize,
          drill.tapDrillSizeImperial || null,
        ]
      );
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

/**
 * Initializes the database (creates schema and seeds data if needed)
 */
export const initializeDatabase = async (): Promise<SQLiteDatabase> => {
  try {
    const db = await openDatabase();
    await initializeSchema(db);
    await seedDatabase(db);
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Gets the current database instance
 */
export const getDatabase = (): SQLiteDatabase => {
  if (!databaseInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return databaseInstance;
};

/**
 * Executes a raw SQL query
 */
export const executeQuery = async (
  sql: string,
  params: any[] = []
): Promise<any[]> => {
  const db = getDatabase();
  try {
    const [result] = await db.executeSql(sql, params);
    const rows: any[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      rows.push(result.rows.item(i));
    }
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

/**
 * Drops all tables (useful for testing/reset)
 */
export const dropAllTables = async (): Promise<void> => {
  const db = getDatabase();
  try {
    await db.executeSql('DROP TABLE IF EXISTS flanges');
    await db.executeSql('DROP TABLE IF EXISTS drill_specs');
    await db.executeSql('DROP TABLE IF EXISTS tasks');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
};

/**
 * Resets the database (drops and recreates)
 */
export const resetDatabase = async (): Promise<void> => {
  try {
    await dropAllTables();
    const db = getDatabase();
    await initializeSchema(db);
    await seedDatabase(db);
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};
