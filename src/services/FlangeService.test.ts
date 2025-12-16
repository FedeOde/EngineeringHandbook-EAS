import { FlangeService } from './FlangeService';
import { initializeDatabase, resetDatabase, closeDatabase } from '../database/database';

describe('FlangeService', () => {
  let flangeService: FlangeService;

  beforeAll(async () => {
    await initializeDatabase();
    flangeService = new FlangeService();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('getFlange', () => {
    it('should retrieve a specific flange by DN, standard, and class', async () => {
      const result = await flangeService.getFlange(50, 'EN1092-1', 'PN10');
      
      expect(result).not.toBeNull();
      expect(result?.dn).toBe(50);
      expect(result?.standard).toBe('EN1092-1');
      expect(result?.class).toBe('PN10');
      expect(result?.od).toBe(165);
      expect(result?.pcd).toBe(125);
      expect(result?.boltCount).toBe(4);
      expect(result?.boltSize).toBe('M16');
      expect(result?.thickness).toBe(16);
    });

    it('should return null for non-existent flange', async () => {
      const result = await flangeService.getFlange(9999, 'EN1092-1', 'PN10');
      
      expect(result).toBeNull();
    });

    it('should retrieve flanges from different standards', async () => {
      const en1092 = await flangeService.getFlange(100, 'EN1092-1', 'PN16');
      const bs10 = await flangeService.getFlange(100, 'BS10', 'Table D');
      const asme = await flangeService.getFlange(100, 'ASME-B16.5', 'Class 150');
      
      expect(en1092).not.toBeNull();
      expect(bs10).not.toBeNull();
      expect(asme).not.toBeNull();
      
      expect(en1092?.standard).toBe('EN1092-1');
      expect(bs10?.standard).toBe('BS10');
      expect(asme?.standard).toBe('ASME-B16.5');
    });
  });

  describe('findByPCD', () => {
    it('should find flanges within tolerance of measured PCD', async () => {
      const results = await flangeService.findByPCD(125, 2);
      
      expect(results.length).toBeGreaterThan(0);
      
      // All results should have PCD within tolerance
      results.forEach(flange => {
        expect(flange.pcd).toBeGreaterThanOrEqual(123);
        expect(flange.pcd).toBeLessThanOrEqual(127);
      });
    });

    it('should return results sorted by DN', async () => {
      const results = await flangeService.findByPCD(150, 10);
      
      expect(results.length).toBeGreaterThan(1);
      
      // Check that results are sorted by DN in ascending order
      for (let i = 1; i < results.length; i++) {
        expect(results[i].dn).toBeGreaterThanOrEqual(results[i - 1].dn);
      }
    });

    it('should return empty array when no flanges match', async () => {
      const results = await flangeService.findByPCD(9999, 2);
      
      expect(results).toEqual([]);
    });

    it('should use default tolerance of 2mm when not specified', async () => {
      const resultsWithDefault = await flangeService.findByPCD(125);
      const resultsWithExplicit = await flangeService.findByPCD(125, 2);
      
      expect(resultsWithDefault.length).toBe(resultsWithExplicit.length);
    });
  });

  describe('getAllSizes', () => {
    it('should retrieve all sizes for a specific standard and class', async () => {
      const results = await flangeService.getAllSizes('EN1092-1', 'PN10');
      
      expect(results.length).toBeGreaterThan(0);
      
      // All results should match the requested standard and class
      results.forEach(flange => {
        expect(flange.standard).toBe('EN1092-1');
        expect(flange.class).toBe('PN10');
      });
    });

    it('should return results sorted by DN', async () => {
      const results = await flangeService.getAllSizes('EN1092-1', 'PN16');
      
      expect(results.length).toBeGreaterThan(1);
      
      // Check that results are sorted by DN in ascending order
      for (let i = 1; i < results.length; i++) {
        expect(results[i].dn).toBeGreaterThanOrEqual(results[i - 1].dn);
      }
    });
  });

  describe('getAvailableStandards', () => {
    it('should return all available flange standards', async () => {
      const standards = await flangeService.getAvailableStandards();
      
      expect(standards.length).toBeGreaterThan(0);
      expect(standards).toContain('EN1092-1');
      expect(standards).toContain('BS10');
      expect(standards).toContain('ASME-B16.5');
    });
  });

  describe('getAvailableClasses', () => {
    it('should return all classes for EN1092-1 standard', async () => {
      const classes = await flangeService.getAvailableClasses('EN1092-1');
      
      expect(classes.length).toBeGreaterThan(0);
      expect(classes).toContain('PN6');
      expect(classes).toContain('PN10');
      expect(classes).toContain('PN16');
      expect(classes).toContain('PN25');
      expect(classes).toContain('PN40');
    });

    it('should return all classes for BS10 standard', async () => {
      const classes = await flangeService.getAvailableClasses('BS10');
      
      expect(classes.length).toBeGreaterThan(0);
      expect(classes).toContain('Table D');
      expect(classes).toContain('Table E');
      expect(classes).toContain('Table F');
      expect(classes).toContain('Table H');
    });
  });

  describe('getAvailableDNs', () => {
    it('should return all DN sizes for a specific standard and class', async () => {
      const dns = await flangeService.getAvailableDNs('EN1092-1', 'PN10');
      
      expect(dns.length).toBeGreaterThan(0);
      
      // Check that DNs are sorted in ascending order
      for (let i = 1; i < dns.length; i++) {
        expect(dns[i]).toBeGreaterThanOrEqual(dns[i - 1]);
      }
    });

    it('should return different DN lists for different classes', async () => {
      const pn10Dns = await flangeService.getAvailableDNs('EN1092-1', 'PN10');
      const pn40Dns = await flangeService.getAvailableDNs('EN1092-1', 'PN40');
      
      expect(pn10Dns.length).toBeGreaterThan(0);
      expect(pn40Dns.length).toBeGreaterThan(0);
    });
  });
});
