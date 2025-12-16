import { DrillTableService } from './DrillTableService';
import { initializeDatabase, closeDatabase, resetDatabase } from '../database/database';
import { ThreadStandard } from '../database/types';

describe('DrillTableService', () => {
  let service: DrillTableService;

  beforeAll(async () => {
    await initializeDatabase();
    service = new DrillTableService();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('getDrillSize', () => {
    it('should return drill specification for valid thread standard and size', async () => {
      const result = await service.getDrillSize('metric-coarse', 'M6');
      
      expect(result).not.toBeNull();
      expect(result?.threadSize).toBe('M6');
      expect(result?.standard).toBe('metric-coarse');
      expect(result?.pitch).toBe(1.0);
      expect(result?.tapDrillSize).toBe(5.0);
    });

    it('should return drill specification with imperial size for UNC threads', async () => {
      const result = await service.getDrillSize('unc', '1/4"-20');
      
      expect(result).not.toBeNull();
      expect(result?.threadSize).toBe('1/4"-20');
      expect(result?.standard).toBe('unc');
      expect(result?.tapDrillSizeImperial).toBe('#7');
    });

    it('should return null for non-existent thread size', async () => {
      const result = await service.getDrillSize('metric-coarse', 'M999');
      
      expect(result).toBeNull();
    });

    it('should return null for invalid thread standard', async () => {
      const result = await service.getDrillSize('invalid-standard' as ThreadStandard, 'M6');
      
      expect(result).toBeNull();
    });
  });

  describe('getAllSizes', () => {
    it('should return all drill specifications for metric-coarse standard', async () => {
      const results = await service.getAllSizes('metric-coarse');
      
      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBeGreaterThan(0);
      
      // Verify all results are for the correct standard
      results.forEach(spec => {
        expect(spec.standard).toBe('metric-coarse');
        expect(spec.threadSize).toBeDefined();
        expect(spec.pitch).toBeGreaterThan(0);
        expect(spec.tapDrillSize).toBeGreaterThan(0);
      });
    });

    it('should return results sorted by tap drill size', async () => {
      const results = await service.getAllSizes('metric-coarse');
      
      // Verify ascending order
      for (let i = 1; i < results.length; i++) {
        expect(results[i].tapDrillSize).toBeGreaterThanOrEqual(results[i - 1].tapDrillSize);
      }
    });

    it('should return all drill specifications for UNC standard with imperial sizes', async () => {
      const results = await service.getAllSizes('unc');
      
      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBeGreaterThan(0);
      
      // Verify all UNC results have imperial sizes
      results.forEach(spec => {
        expect(spec.standard).toBe('unc');
        expect(spec.tapDrillSizeImperial).toBeDefined();
      });
    });

    it('should return empty array for invalid thread standard', async () => {
      const results = await service.getAllSizes('invalid-standard' as ThreadStandard);
      
      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBe(0);
    });

    it('should return specifications for all supported thread standards', async () => {
      const standards: ThreadStandard[] = [
        'metric-coarse',
        'metric-fine',
        'unc',
        'unf',
        'bsw',
        'bsf',
        'bsp',
        'ba',
      ];

      for (const standard of standards) {
        const results = await service.getAllSizes(standard);
        expect(results.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getAllStandards', () => {
    it('should return all available thread standards', async () => {
      const standards = await service.getAllStandards();
      
      expect(standards).toBeInstanceOf(Array);
      expect(standards.length).toBeGreaterThan(0);
      
      // Verify expected standards are present
      expect(standards).toContain('metric-coarse');
      expect(standards).toContain('unc');
      expect(standards).toContain('bsw');
    });

    it('should return unique standards only', async () => {
      const standards = await service.getAllStandards();
      const uniqueStandards = [...new Set(standards)];
      
      expect(standards.length).toBe(uniqueStandards.length);
    });
  });
});
