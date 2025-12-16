import * as fc from 'fast-check';
import { OffsetCalculator } from './OffsetCalculator';
import { OffsetParameters } from './types';

describe('OffsetCalculator - Property-Based Tests', () => {
  let calculator: OffsetCalculator;

  beforeEach(() => {
    calculator = new OffsetCalculator();
  });

  // Feature: engineering-pocket-helper, Property 13: Offset calculation geometric correctness
  // Validates: Requirements 6.1, 6.2
  it('should satisfy Pythagorean theorem: travel² = rise² + run² for base geometry', () => {
    // Custom arbitrary for generating valid offset distances
    const offsetDistanceArbitrary = fc.double({
      min: 0.1,
      max: 10000,
      noNaN: true,
      noDefaultInfinity: true,
    });

    // Custom arbitrary for generating supported angles
    const supportedAngles = calculator.getSupportedAngles();
    // Filter out 90 degrees as it creates run ≈ 0 which can cause numerical issues
    const angleArbitrary = fc.constantFrom(
      ...supportedAngles.filter((a) => a !== 90)
    );

    fc.assert(
      fc.property(
        offsetDistanceArbitrary,
        angleArbitrary,
        (offsetDistance: number, angle: number) => {
          // Test without pipe diameter to verify base geometric correctness
          const params: OffsetParameters = {
            offsetDistance,
            angle,
          };

          const result = calculator.calculateOffset(params);

          // Property: For any offset calculation, the geometric relationship
          // travel² = rise² + run² should hold (Pythagorean theorem)
          // 
          // This verifies that the trigonometric calculations are correct:
          // - travel = rise / sin(angle)
          // - run = rise / tan(angle)
          // - These should satisfy: travel² = rise² + run²

          const travelSquared = result.travel * result.travel;
          const riseSquared = result.rise * result.rise;
          const runSquared = result.run * result.run;

          // Calculate relative error to account for floating-point precision
          const expected = riseSquared + runSquared;
          const relativeError = Math.abs((travelSquared - expected) / expected);

          // The geometric relationship should hold within floating-point precision
          // Using 1e-9 tolerance to account for accumulated rounding errors
          expect(relativeError).toBeLessThan(1e-9);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 14: Pipe diameter effect on offset
  // Validates: Requirements 6.3
  it('should increase travel distance when pipe diameter is included', () => {
    // Custom arbitrary for generating valid offset distances
    const offsetDistanceArbitrary = fc.double({
      min: 0.1,
      max: 10000,
      noNaN: true,
      noDefaultInfinity: true,
    });

    // Custom arbitrary for generating supported angles
    const supportedAngles = calculator.getSupportedAngles();
    const angleArbitrary = fc.constantFrom(...supportedAngles);

    // Custom arbitrary for generating valid pipe diameters
    const pipeDiameterArbitrary = fc.double({
      min: 0.1,
      max: 1000,
      noNaN: true,
      noDefaultInfinity: true,
    });

    fc.assert(
      fc.property(
        offsetDistanceArbitrary,
        angleArbitrary,
        pipeDiameterArbitrary,
        (offsetDistance: number, angle: number, pipeDiameter: number) => {
          // Property: For any offset parameters, including a pipe diameter
          // should result in a larger travel distance than the same parameters
          // without pipe diameter.
          //
          // This validates that the calculator accounts for center-to-center
          // measurements when pipe diameter is specified.

          // Calculate without pipe diameter
          const paramsWithoutDiameter: OffsetParameters = {
            offsetDistance,
            angle,
          };
          const resultWithoutDiameter = calculator.calculateOffset(paramsWithoutDiameter);

          // Calculate with pipe diameter
          const paramsWithDiameter: OffsetParameters = {
            offsetDistance,
            angle,
            pipeDiameter,
          };
          const resultWithDiameter = calculator.calculateOffset(paramsWithDiameter);

          // The travel distance with pipe diameter should be greater than
          // the travel distance without pipe diameter
          expect(resultWithDiameter.travel).toBeGreaterThan(
            resultWithoutDiameter.travel
          );

          // The difference should be positive and related to the pipe diameter
          const travelDifference =
            resultWithDiameter.travel - resultWithoutDiameter.travel;
          expect(travelDifference).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
