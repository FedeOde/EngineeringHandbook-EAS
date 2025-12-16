import { executeQuery } from '../database/database';
import { DrillSpecification, ThreadStandard } from '../database/types';

/**
 * Service for querying drill and threading specifications from the database
 */
export class DrillTableService {
  /**
   * Gets drill specification for a specific thread standard and size
   * @param standard - The thread standard (e.g., 'metric-coarse', 'unc')
   * @param threadSize - The thread size (e.g., 'M6', '1/4"-20')
   * @returns DrillSpecification or null if not found
   */
  async getDrillSize(
    standard: ThreadStandard,
    threadSize: string
  ): Promise<DrillSpecification | null> {
    try {
      const rows = await executeQuery(
        `SELECT id, standard, thread_size as threadSize, pitch, tap_drill_size as tapDrillSize, 
                tap_drill_size_imperial as tapDrillSizeImperial
         FROM drill_specs 
         WHERE standard = ? AND thread_size = ?`,
        [standard, threadSize]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0] as DrillSpecification;
    } catch (error) {
      console.error('Error getting drill size:', error);
      throw error;
    }
  }

  /**
   * Gets all drill specifications for a given thread standard
   * @param standard - The thread standard
   * @returns Array of DrillSpecification objects
   */
  async getAllSizes(standard: ThreadStandard): Promise<DrillSpecification[]> {
    try {
      const rows = await executeQuery(
        `SELECT id, standard, thread_size as threadSize, pitch, tap_drill_size as tapDrillSize, 
                tap_drill_size_imperial as tapDrillSizeImperial
         FROM drill_specs 
         WHERE standard = ?
         ORDER BY tap_drill_size ASC`,
        [standard]
      );

      return rows as DrillSpecification[];
    } catch (error) {
      console.error('Error getting all drill sizes:', error);
      throw error;
    }
  }

  /**
   * Gets all available thread standards
   * @returns Array of unique thread standards
   */
  async getAllStandards(): Promise<ThreadStandard[]> {
    try {
      const rows = await executeQuery(
        `SELECT DISTINCT standard FROM drill_specs ORDER BY standard`
      );

      return rows.map((row) => row.standard as ThreadStandard);
    } catch (error) {
      console.error('Error getting thread standards:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const drillTableService = new DrillTableService();
