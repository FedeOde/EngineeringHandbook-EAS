import * as fc from 'fast-check';
import { DrillTableService } from './DrillTableService';
import { initializeDatabase, closeDatabase } from '../database/database';
import { ThreadStandard } from '../database/types';
import { ALL_DRILL_DATA } from '../database/seedData/drills';

describe('DrillTableService - Property-Based Tests', () => {
  let service: DrillTableService;

  beforeAll(async () => {
    await initializeDatabase();
    service = new DrillTableService();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // Feature: engineering-pocket-helper, Property 5: Thread specification completeness
  // Validates: Requirements 3.2, 3.3
  it('should return complete thread specifications with all required fields', async () => {
    // Create arbitraries for valid thread standards and sizes from actual seed data
    const threadStandardArbitrary = fc.constantFrom<ThreadStandard>(
      'metric-coarse',
      'metric-fine',
      'unc',
      'unf',
      'bsw',
      'bsf',
      'bsp',
      'ba'
    );

    // Create a map of thread standards to their valid thread sizes
    const threadSizesByStandard = ALL_DRILL_DATA.reduce((acc, spec) => {
      if (!acc[spec.standard]) {
        acc[spec.standard] = [];
      }
      acc[spec.standard].push(spec.threadSize);
      return acc;
    }, {} as Record<ThreadStandard, string[]>);

    // Create an arbitrary that generates valid standard-size combinations
    const validThreadCombinationArbitrary = threadStandardArbitrary.chain((standard: ThreadStandard) => {
      const validSizes = threadSizesByStandard[standard];
      return fc.constantFrom(...validSizes).map((threadSize: string) => ({
        standard,
        threadSize,
      }));
    });

    await fc.assert(
      fc.asyncProperty(
        validThreadCombinationArbitrary,
        async ({ standard, threadSize }: { standard: ThreadStandard; threadSize: string }) => {
          // Query the drill specification
          const result = await service.getDrillSize(standard, threadSize);

          // Property: For any valid thread standard and size combination,
          // the returned drill specification should contain all required fields
          expect(result).not.toBeNull();
          
          // Verify all required fields are present and valid
          expect(result).toHaveProperty('threadSize');
          expect(result).toHaveProperty('pitch');
          expect(result).toHaveProperty('tapDrillSize');
          
          // Verify field values are valid (not null, undefined, or invalid)
          expect(result!.threadSize).toBe(threadSize);
          expect(result!.standard).toBe(standard);
          expect(typeof result!.pitch).toBe('number');
          expect(result!.pitch).toBeGreaterThan(0);
          expect(typeof result!.tapDrillSize).toBe('number');
          expect(result!.tapDrillSize).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 6: Thread specification unit duality
  // Validates: Requirements 3.5
  it('should return both metric and imperial representations for imperial thread standards', async () => {
    // Imperial thread standards that should have both metric and imperial units
    const imperialStandardsArbitrary = fc.constantFrom<ThreadStandard>(
      'unc',
      'unf',
      'bsw',
      'bsf',
      'bsp'
    );

    // Create a map of imperial thread standards to their valid thread sizes
    const threadSizesByStandard = ALL_DRILL_DATA.reduce((acc, spec) => {
      // Only include imperial standards
      if (['unc', 'unf', 'bsw', 'bsf', 'bsp'].includes(spec.standard)) {
        if (!acc[spec.standard]) {
          acc[spec.standard] = [];
        }
        acc[spec.standard].push(spec.threadSize);
      }
      return acc;
    }, {} as Record<ThreadStandard, string[]>);

    // Create an arbitrary that generates valid imperial standard-size combinations
    const validImperialThreadCombinationArbitrary = imperialStandardsArbitrary.chain((standard: ThreadStandard) => {
      const validSizes = threadSizesByStandard[standard];
      return fc.constantFrom(...validSizes).map((threadSize: string) => ({
        standard,
        threadSize,
      }));
    });

    await fc.assert(
      fc.asyncProperty(
        validImperialThreadCombinationArbitrary,
        async ({ standard, threadSize }: { standard: ThreadStandard; threadSize: string }) => {
          // Query the drill specification
          const result = await service.getDrillSize(standard, threadSize);

          // Property: For any thread specification where imperial units are applicable,
          // the returned data should contain both metric and imperial representations
          expect(result).not.toBeNull();
          
          // Verify metric representation (tapDrillSize) is present and valid
          expect(result).toHaveProperty('tapDrillSize');
          expect(typeof result!.tapDrillSize).toBe('number');
          expect(result!.tapDrillSize).toBeGreaterThan(0);
          
          // Verify imperial representation (tapDrillSizeImperial) is present and valid
          expect(result).toHaveProperty('tapDrillSizeImperial');
          expect(result!.tapDrillSizeImperial).toBeDefined();
          expect(typeof result!.tapDrillSizeImperial).toBe('string');
          expect(result!.tapDrillSizeImperial!.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
