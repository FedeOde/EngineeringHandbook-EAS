import * as fc from 'fast-check';
import { UnitConverter } from './UnitConverter';
import { UnitCategory } from './types';
import { getUnitsByCategory, getAllCategories } from './unitDefinitions';

describe('UnitConverter - Property-Based Tests', () => {
  let converter: UnitConverter;

  beforeEach(() => {
    converter = new UnitConverter();
  });

  // Feature: engineering-pocket-helper, Property 3: Unit conversion mathematical correctness
  // Validates: Requirements 2.2, 2.4
  it('should maintain round-trip conversion accuracy within precision tolerance', () => {
    // Custom arbitrary for generating valid numeric values
    const validNumberArbitrary = fc.double({
      min: 0.000001,
      max: 1000000,
      noNaN: true,
      noDefaultInfinity: true,
    });

    // Custom arbitrary for generating unit categories
    const categoryArbitrary = fc.constantFrom<UnitCategory>(
      ...getAllCategories()
    );

    fc.assert(
      fc.property(
        validNumberArbitrary,
        categoryArbitrary,
        (value: number, category: UnitCategory) => {
          const unitsInCategory = getUnitsByCategory(category);

          // Skip if category has less than 2 units (can't do round-trip)
          if (unitsInCategory.length < 2) {
            return true;
          }

          // Test round-trip for all pairs of units in this category
          for (let i = 0; i < unitsInCategory.length; i++) {
            for (let j = 0; j < unitsInCategory.length; j++) {
              if (i !== j) {
                const fromUnit = unitsInCategory[i];
                const toUnit = unitsInCategory[j];

                // Convert A -> B -> A
                const convertedValue = converter.convert(value, fromUnit, toUnit);
                const roundTripValue = converter.convert(
                  convertedValue,
                  toUnit,
                  fromUnit
                );

                // Calculate relative error
                const relativeError = Math.abs((roundTripValue - value) / value);

                // Property: Round-trip should return value within precision tolerance
                // Using 1e-8 as tolerance for floating-point precision (especially for temperature conversions)
                expect(relativeError).toBeLessThan(1e-8);
              }
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 4: Invalid input rejection
  // Validates: Requirements 2.5
  it('should reject invalid inputs and not perform calculation', () => {
    // Custom arbitrary for generating invalid numeric values
    const invalidNumberArbitrary = fc.oneof(
      fc.constant(NaN),
      fc.constant(Infinity),
      fc.constant(-Infinity),
      fc.constant(null as any),
      fc.constant(undefined as any)
    );

    // Custom arbitrary for generating unit categories
    const categoryArbitrary = fc.constantFrom<UnitCategory>(
      ...getAllCategories()
    );

    fc.assert(
      fc.property(
        invalidNumberArbitrary,
        categoryArbitrary,
        (invalidValue: number, category: UnitCategory) => {
          const unitsInCategory = getUnitsByCategory(category);

          // Skip if category has no units
          if (unitsInCategory.length === 0) {
            return true;
          }

          // Get two units from the category
          const fromUnit = unitsInCategory[0];
          const toUnit =
            unitsInCategory.length > 1 ? unitsInCategory[1] : unitsInCategory[0];

          // Property: Invalid inputs should throw an error
          expect(() => {
            converter.convert(invalidValue, fromUnit, toUnit);
          }).toThrow('Invalid input: value must be a valid finite number');

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
