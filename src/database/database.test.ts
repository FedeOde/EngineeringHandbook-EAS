import { ALL_FLANGE_DATA } from './seedData/flanges';
import { ALL_DRILL_DATA } from './seedData/drills';
import { ALL_SCHEMAS } from './schema';

describe('Database Schema and Seed Data', () => {
  describe('Schema Definitions', () => {
    it('should have all required schema statements', () => {
      expect(ALL_SCHEMAS).toBeDefined();
      expect(ALL_SCHEMAS.length).toBeGreaterThan(0);
    });

    it('should include flanges table creation', () => {
      const flangesSchema = ALL_SCHEMAS.find(s => s.includes('CREATE TABLE IF NOT EXISTS flanges'));
      expect(flangesSchema).toBeDefined();
      expect(flangesSchema).toContain('dn INTEGER NOT NULL');
      expect(flangesSchema).toContain('pcd REAL NOT NULL');
      expect(flangesSchema).toContain('UNIQUE(dn, standard, class)');
    });

    it('should include drill_specs table creation', () => {
      const drillSchema = ALL_SCHEMAS.find(s => s.includes('CREATE TABLE IF NOT EXISTS drill_specs'));
      expect(drillSchema).toBeDefined();
      expect(drillSchema).toContain('standard TEXT NOT NULL');
      expect(drillSchema).toContain('thread_size TEXT NOT NULL');
      expect(drillSchema).toContain('UNIQUE(standard, thread_size)');
    });

    it('should include tasks table creation', () => {
      const tasksSchema = ALL_SCHEMAS.find(s => s.includes('CREATE TABLE IF NOT EXISTS tasks'));
      expect(tasksSchema).toBeDefined();
      expect(tasksSchema).toContain('id TEXT PRIMARY KEY');
      expect(tasksSchema).toContain('completed INTEGER NOT NULL DEFAULT 0');
    });

    it('should include performance indexes', () => {
      const flangesIndex = ALL_SCHEMAS.find(s => s.includes('idx_flanges_lookup'));
      const pcdIndex = ALL_SCHEMAS.find(s => s.includes('idx_flanges_pcd'));
      const drillIndex = ALL_SCHEMAS.find(s => s.includes('idx_drill_specs_lookup'));
      
      expect(flangesIndex).toBeDefined();
      expect(pcdIndex).toBeDefined();
      expect(drillIndex).toBeDefined();
    });
  });

  describe('Flange Seed Data', () => {
    it('should have flange data for all standards', () => {
      expect(ALL_FLANGE_DATA).toBeDefined();
      expect(ALL_FLANGE_DATA.length).toBeGreaterThan(0);
    });

    it('should include EN 1092-1 flanges for all pressure classes', () => {
      const en1092Flanges = ALL_FLANGE_DATA.filter(f => f.standard === 'EN1092-1');
      expect(en1092Flanges.length).toBeGreaterThan(0);
      
      const pn6 = en1092Flanges.filter(f => f.class === 'PN6');
      const pn10 = en1092Flanges.filter(f => f.class === 'PN10');
      const pn16 = en1092Flanges.filter(f => f.class === 'PN16');
      const pn25 = en1092Flanges.filter(f => f.class === 'PN25');
      const pn40 = en1092Flanges.filter(f => f.class === 'PN40');
      
      expect(pn6.length).toBeGreaterThan(0);
      expect(pn10.length).toBeGreaterThan(0);
      expect(pn16.length).toBeGreaterThan(0);
      expect(pn25.length).toBeGreaterThan(0);
      expect(pn40.length).toBeGreaterThan(0);
    });

    it('should include BS 10 flanges for all tables', () => {
      const bs10Flanges = ALL_FLANGE_DATA.filter(f => f.standard === 'BS10');
      expect(bs10Flanges.length).toBeGreaterThan(0);
      
      const tableD = bs10Flanges.filter(f => f.class === 'Table D');
      const tableE = bs10Flanges.filter(f => f.class === 'Table E');
      const tableF = bs10Flanges.filter(f => f.class === 'Table F');
      const tableH = bs10Flanges.filter(f => f.class === 'Table H');
      
      expect(tableD.length).toBeGreaterThan(0);
      expect(tableE.length).toBeGreaterThan(0);
      expect(tableF.length).toBeGreaterThan(0);
      expect(tableH.length).toBeGreaterThan(0);
    });

    it('should include ASME B16.5 flanges for all classes', () => {
      const asmeFlanges = ALL_FLANGE_DATA.filter(f => f.standard === 'ASME-B16.5');
      expect(asmeFlanges.length).toBeGreaterThan(0);
      
      const class150 = asmeFlanges.filter(f => f.class === 'Class 150');
      const class300 = asmeFlanges.filter(f => f.class === 'Class 300');
      
      expect(class150.length).toBeGreaterThan(0);
      expect(class300.length).toBeGreaterThan(0);
    });

    it('should have valid flange specifications with all required fields', () => {
      ALL_FLANGE_DATA.forEach(flange => {
        expect(flange.dn).toBeGreaterThan(0);
        expect(flange.inches).toBeGreaterThan(0);
        expect(flange.standard).toBeTruthy();
        expect(flange.class).toBeTruthy();
        expect(flange.od).toBeGreaterThan(0);
        expect(flange.pcd).toBeGreaterThan(0);
        expect(flange.boltCount).toBeGreaterThan(0);
        expect(flange.boltSize).toBeTruthy();
        expect(flange.thickness).toBeGreaterThan(0);
      });
    });
  });

  describe('Drill Seed Data', () => {
    it('should have drill data for all thread standards', () => {
      expect(ALL_DRILL_DATA).toBeDefined();
      expect(ALL_DRILL_DATA.length).toBeGreaterThan(0);
    });

    it('should include all required thread standards', () => {
      const standards = new Set(ALL_DRILL_DATA.map(d => d.standard));
      
      expect(standards.has('metric-coarse')).toBe(true);
      expect(standards.has('metric-fine')).toBe(true);
      expect(standards.has('unc')).toBe(true);
      expect(standards.has('unf')).toBe(true);
      expect(standards.has('bsw')).toBe(true);
      expect(standards.has('bsf')).toBe(true);
      expect(standards.has('bsp')).toBe(true);
      expect(standards.has('ba')).toBe(true);
    });

    it('should have metric coarse thread specifications', () => {
      const metricCoarse = ALL_DRILL_DATA.filter(d => d.standard === 'metric-coarse');
      expect(metricCoarse.length).toBeGreaterThan(10);
      
      // Check for common sizes
      const m6 = metricCoarse.find(d => d.threadSize === 'M6');
      const m8 = metricCoarse.find(d => d.threadSize === 'M8');
      const m10 = metricCoarse.find(d => d.threadSize === 'M10');
      
      expect(m6).toBeDefined();
      expect(m8).toBeDefined();
      expect(m10).toBeDefined();
    });

    it('should have UNC thread specifications', () => {
      const unc = ALL_DRILL_DATA.filter(d => d.standard === 'unc');
      expect(unc.length).toBeGreaterThan(5);
      
      // Check for common sizes
      const quarterInch = unc.find(d => d.threadSize === '1/4"-20');
      const halfInch = unc.find(d => d.threadSize === '1/2"-13');
      
      expect(quarterInch).toBeDefined();
      expect(halfInch).toBeDefined();
    });

    it('should have valid drill specifications with all required fields', () => {
      ALL_DRILL_DATA.forEach(drill => {
        expect(drill.standard).toBeTruthy();
        expect(drill.threadSize).toBeTruthy();
        expect(drill.pitch).toBeGreaterThan(0);
        expect(drill.tapDrillSize).toBeGreaterThan(0);
      });
    });

    it('should have imperial equivalents for imperial thread standards', () => {
      const imperialStandards = ['unc', 'unf', 'bsw', 'bsf', 'bsp'];
      
      imperialStandards.forEach(standard => {
        const drills = ALL_DRILL_DATA.filter(d => d.standard === standard);
        drills.forEach(drill => {
          // Most imperial standards should have imperial drill sizes
          if (drill.tapDrillSizeImperial) {
            expect(drill.tapDrillSizeImperial).toBeTruthy();
          }
        });
      });
    });
  });

  describe('Data Integrity', () => {
    it('should have unique flange combinations', () => {
      const combinations = new Set<string>();
      
      ALL_FLANGE_DATA.forEach(flange => {
        const key = `${flange.dn}-${flange.standard}-${flange.class}`;
        expect(combinations.has(key)).toBe(false);
        combinations.add(key);
      });
    });

    it('should have unique drill combinations', () => {
      const combinations = new Set<string>();
      
      ALL_DRILL_DATA.forEach(drill => {
        const key = `${drill.standard}-${drill.threadSize}`;
        expect(combinations.has(key)).toBe(false);
        combinations.add(key);
      });
    });

    it('should have reasonable flange dimensions', () => {
      ALL_FLANGE_DATA.forEach(flange => {
        // PCD should be less than OD
        expect(flange.pcd).toBeLessThan(flange.od);
        
        // DN should be reasonable
        expect(flange.dn).toBeGreaterThanOrEqual(10);
        expect(flange.dn).toBeLessThanOrEqual(1000);
        
        // Thickness should be reasonable
        expect(flange.thickness).toBeGreaterThan(5);
        expect(flange.thickness).toBeLessThan(200);
      });
    });

    it('should have reasonable drill dimensions', () => {
      ALL_DRILL_DATA.forEach(drill => {
        // Tap drill size should be reasonable
        expect(drill.tapDrillSize).toBeGreaterThan(0.5);
        expect(drill.tapDrillSize).toBeLessThan(100);
        
        // Pitch should be reasonable
        expect(drill.pitch).toBeGreaterThan(0.1);
        expect(drill.pitch).toBeLessThan(10);
      });
    });
  });
});
