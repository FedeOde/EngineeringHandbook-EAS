import { executeQuery } from '../database/database';
import { FlangeSpecification, FlangeStandard } from '../database/types';

/**
 * Service for querying flange specifications from the database
 */
export class FlangeService {
  /**
   * Get a specific flange by DN, standard, and class
   * @param dn - Nominal diameter
   * @param standard - Flange standard (EN1092-1, BS10, ASME-B16.5)
   * @param flangeClass - Flange class/rating
   * @returns Flange specification or null if not found
   */
  async getFlange(
    dn: number,
    standard: FlangeStandard,
    flangeClass: string
  ): Promise<FlangeSpecification | null> {
    const sql = `
      SELECT 
        id, dn, inches, standard, class, od, pcd, 
        bolt_count as boltCount, bolt_size as boltSize, thickness
      FROM flanges
      WHERE dn = ? AND standard = ? AND class = ?
    `;

    const results = await executeQuery(sql, [dn, standard, flangeClass]);

    if (results.length === 0) {
      return null;
    }

    return results[0] as FlangeSpecification;
  }

  /**
   * Find flanges by measured PCD with tolerance
   * @param pcd - Measured pitch circle diameter
   * @param tolerance - Tolerance in mm (default: 2mm)
   * @returns Array of matching flange specifications sorted by DN
   */
  async findByPCD(
    pcd: number,
    tolerance: number = 2
  ): Promise<FlangeSpecification[]> {
    const minPcd = pcd - tolerance;
    const maxPcd = pcd + tolerance;

    const sql = `
      SELECT 
        id, dn, inches, standard, class, od, pcd, 
        bolt_count as boltCount, bolt_size as boltSize, thickness
      FROM flanges
      WHERE pcd >= ? AND pcd <= ?
      ORDER BY dn ASC
    `;

    const results = await executeQuery(sql, [minPcd, maxPcd]);

    return results as FlangeSpecification[];
  }

  /**
   * Get all flange sizes for a specific standard and class
   * @param standard - Flange standard
   * @param flangeClass - Flange class/rating
   * @returns Array of flange specifications sorted by DN
   */
  async getAllSizes(
    standard: FlangeStandard,
    flangeClass: string
  ): Promise<FlangeSpecification[]> {
    const sql = `
      SELECT 
        id, dn, inches, standard, class, od, pcd, 
        bolt_count as boltCount, bolt_size as boltSize, thickness
      FROM flanges
      WHERE standard = ? AND class = ?
      ORDER BY dn ASC
    `;

    const results = await executeQuery(sql, [standard, flangeClass]);

    return results as FlangeSpecification[];
  }

  /**
   * Get all available standards
   * @returns Array of unique flange standards
   */
  async getAvailableStandards(): Promise<FlangeStandard[]> {
    const sql = `
      SELECT DISTINCT standard
      FROM flanges
      ORDER BY standard
    `;

    const results = await executeQuery(sql);

    return results.map((row) => row.standard as FlangeStandard);
  }

  /**
   * Get all available classes for a specific standard
   * @param standard - Flange standard
   * @returns Array of unique flange classes
   */
  async getAvailableClasses(standard: FlangeStandard): Promise<string[]> {
    const sql = `
      SELECT DISTINCT class
      FROM flanges
      WHERE standard = ?
      ORDER BY class
    `;

    const results = await executeQuery(sql, [standard]);

    return results.map((row) => row.class);
  }

  /**
   * Get all available DN sizes for a specific standard and class
   * @param standard - Flange standard
   * @param flangeClass - Flange class/rating
   * @returns Array of DN values
   */
  async getAvailableDNs(
    standard: FlangeStandard,
    flangeClass: string
  ): Promise<number[]> {
    const sql = `
      SELECT DISTINCT dn
      FROM flanges
      WHERE standard = ? AND class = ?
      ORDER BY dn ASC
    `;

    const results = await executeQuery(sql, [standard, flangeClass]);

    return results.map((row) => row.dn);
  }
}

// Export singleton instance
export const flangeService = new FlangeService();
