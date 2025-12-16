import * as fc from 'fast-check';
import { FlangeService } from './FlangeService';
import { initializeDatabase, closeDatabase } from '../database/database';
import { FlangeStandard } from '../database/types';
import { ALL_FLANGE_DATA } from '../database/seedData/flanges';

describe('FlangeService - Property-Based Tests', () => {
  let service: FlangeService;

  beforeAll(async () => {
    await initializeDatabase();
    service = new FlangeService();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // Feature: engineering-pocket-helper, Property 7: Flange specification completeness
  // Validates: Requirements 4.2, 4.3
  it('should return complete flange specifications with all required fields', async () => {
    // Create a map of valid DN, standard, and class combinations from seed data
    const validCombinations = ALL_FLANGE_DATA.map((flange) => ({
      dn: flange.dn,
      standard: flange.standard,
      flangeClass: flange.class,
    }));

    // Create an arbitrary that generates valid combinations
    const validFlangeCombinationArbitrary = fc.constantFrom(...validCombinations);

    await fc.assert(
      fc.asyncProperty(
        validFlangeCombinationArbitrary,
        async ({ dn, standard, flangeClass }: { dn: number; standard: FlangeStandard; flangeClass: string }) => {
          // Query the flange specification
          const result = await service.getFlange(dn, standard, flangeClass);

          // Property: For any valid DN size, standard, and class combination,
          // the returned flange specification should contain all required dimensions:
          // OD, PCD, bolt count, bolt size, thickness, DN, and inches
          expect(result).not.toBeNull();

          // Verify all required fields are present
          expect(result).toHaveProperty('dn');
          expect(result).toHaveProperty('inches');
          expect(result).toHaveProperty('standard');
          expect(result).toHaveProperty('class');
          expect(result).toHaveProperty('od');
          expect(result).toHaveProperty('pcd');
          expect(result).toHaveProperty('boltCount');
          expect(result).toHaveProperty('boltSize');
          expect(result).toHaveProperty('thickness');

          // Verify field values are valid (not null, undefined, or invalid)
          expect(result!.dn).toBe(dn);
          expect(result!.standard).toBe(standard);
          expect(result!.class).toBe(flangeClass);

          // Verify numeric fields are positive numbers
          expect(typeof result!.inches).toBe('number');
          expect(result!.inches).toBeGreaterThan(0);

          expect(typeof result!.od).toBe('number');
          expect(result!.od).toBeGreaterThan(0);

          expect(typeof result!.pcd).toBe('number');
          expect(result!.pcd).toBeGreaterThan(0);

          expect(typeof result!.boltCount).toBe('number');
          expect(result!.boltCount).toBeGreaterThan(0);

          expect(typeof result!.thickness).toBe('number');
          expect(result!.thickness).toBeGreaterThan(0);

          // Verify boltSize is a non-empty string
          expect(typeof result!.boltSize).toBe('string');
          expect(result!.boltSize.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 8: PCD reverse lookup accuracy
  // Validates: Requirements 4.4
  it('should return flanges with PCD values within tolerance of input PCD', async () => {
    // Create an arbitrary that generates PCD values from actual flanges in the database
    const pcdValuesFromData = ALL_FLANGE_DATA.map((flange) => flange.pcd);
    const uniquePcdValues = [...new Set(pcdValuesFromData)];

    const pcdArbitrary = fc.constantFrom(...uniquePcdValues);
    const toleranceArbitrary = fc.double({ min: 0.5, max: 5, noNaN: true });

    await fc.assert(
      fc.asyncProperty(
        pcdArbitrary,
        toleranceArbitrary,
        async (pcd: number, tolerance: number) => {
          // Query flanges by PCD with tolerance
          const results = await service.findByPCD(pcd, tolerance);

          // Property: For any PCD value, all returned flange specifications
          // should have PCD values within the specified tolerance (±tolerance mm)
          // of the input PCD value
          const minPcd = pcd - tolerance;
          const maxPcd = pcd + tolerance;

          results.forEach((flange) => {
            expect(flange.pcd).toBeGreaterThanOrEqual(minPcd);
            expect(flange.pcd).toBeLessThanOrEqual(maxPcd);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 9: Flange results sorting
  // Validates: Requirements 4.5
  it('should return flanges sorted by DN in ascending order from PCD search', async () => {
    // Create an arbitrary that generates PCD values from actual flanges in the database
    // Use a larger tolerance to ensure we get multiple results for testing sorting
    const pcdValuesFromData = ALL_FLANGE_DATA.map((flange) => flange.pcd);
    const uniquePcdValues = [...new Set(pcdValuesFromData)];

    const pcdArbitrary = fc.constantFrom(...uniquePcdValues);
    const toleranceArbitrary = fc.double({ min: 5, max: 50, noNaN: true });

    await fc.assert(
      fc.asyncProperty(
        pcdArbitrary,
        toleranceArbitrary,
        async (pcd: number, tolerance: number) => {
          // Query flanges by PCD with tolerance
          const results = await service.findByPCD(pcd, tolerance);

          // Property: For any list of flange specifications returned from a PCD search,
          // the results should be sorted in ascending order by DN size
          
          // If we have 0 or 1 results, sorting is trivially correct
          if (results.length <= 1) {
            return true;
          }

          // Check that each DN is less than or equal to the next DN
          for (let i = 0; i < results.length - 1; i++) {
            const currentDN = results[i].dn;
            const nextDN = results[i + 1].dn;
            
            expect(currentDN).toBeLessThanOrEqual(nextDN);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
