import * as fc from 'fast-check';
import { TorqueCalculator } from './TorqueCalculator';
import { BoltGrade, LubricationCondition } from './types';
import { getAllBoltSizes, getAllBoltGrades } from './boltData';

describe('TorqueCalculator - Property-Based Tests', () => {
  let calculator: TorqueCalculator;

  beforeEach(() => {
    calculator = new TorqueCalculator();
  });

  // Feature: engineering-pocket-helper, Property 10: Torque calculation validity
  // Validates: Requirements 5.1
  it('should calculate valid torque values within reasonable engineering limits for any bolt size and grade', () => {
    // Create arbitraries for valid bolt sizes and grades
    const allBoltSizes = getAllBoltSizes();
    const boltSizeArbitrary = fc.constantFrom(...allBoltSizes.map((b) => b.size));
    
    const allBoltGrades = getAllBoltGrades();
    const boltGradeArbitrary = fc.constantFrom<BoltGrade>(...allBoltGrades);
    
    const lubricationArbitrary = fc.constantFrom<LubricationCondition>(
      'dry',
      'lubricated',
      'anti-seize'
    );

    fc.assert(
      fc.property(
        boltSizeArbitrary,
        boltGradeArbitrary,
        lubricationArbitrary,
        (boltSize: string, grade: BoltGrade, lubrication: LubricationCondition) => {
          // Calculate torque
          const result = calculator.calculateTorque(boltSize, grade, lubrication);

          // Property: For any valid bolt size and grade combination,
          // the calculated torque value should be a positive number
          // within reasonable engineering limits (> 0 and < 30000 Nm)
          expect(result.value).toBeGreaterThan(0);
          expect(result.value).toBeLessThan(30000);
          expect(isFinite(result.value)).toBe(true);
          expect(isNaN(result.value)).toBe(false);
          
          // Verify the result has the correct structure
          expect(result.unit).toBe('Nm');
          expect(result.range).toBeDefined();
          expect(result.range.min).toBeGreaterThan(0);
          expect(result.range.max).toBeGreaterThan(0);
          expect(result.range.min).toBeLessThan(result.value);
          expect(result.range.max).toBeGreaterThan(result.value);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 11: Torque multi-unit representation
  // Validates: Requirements 5.3
  it('should return torque values in all three required units (Nm, ft-lb, kg-m) for any bolt specification', () => {
    // Create arbitraries for valid bolt sizes and grades
    const allBoltSizes = getAllBoltSizes();
    const boltSizeArbitrary = fc.constantFrom(...allBoltSizes.map((b) => b.size));
    
    const allBoltGrades = getAllBoltGrades();
    const boltGradeArbitrary = fc.constantFrom<BoltGrade>(...allBoltGrades);
    
    const lubricationArbitrary = fc.constantFrom<LubricationCondition>(
      'dry',
      'lubricated',
      'anti-seize'
    );

    fc.assert(
      fc.property(
        boltSizeArbitrary,
        boltGradeArbitrary,
        lubricationArbitrary,
        (boltSize: string, grade: BoltGrade, lubrication: LubricationCondition) => {
          // Calculate torque in all units
          const result = calculator.calculateTorqueAllUnits(boltSize, grade, lubrication);

          // Property: For any calculated torque value, the result should include
          // representations in all three required units: Nm, ft-lb, and kg-m
          
          // Verify all three unit fields are present
          expect(result).toHaveProperty('Nm');
          expect(result).toHaveProperty('ft-lb');
          expect(result).toHaveProperty('kg-m');
          
          // Verify all values are valid positive numbers
          expect(result.Nm).toBeGreaterThan(0);
          expect(result['ft-lb']).toBeGreaterThan(0);
          expect(result['kg-m']).toBeGreaterThan(0);
          
          expect(isFinite(result.Nm)).toBe(true);
          expect(isFinite(result['ft-lb'])).toBe(true);
          expect(isFinite(result['kg-m'])).toBe(true);
          
          expect(isNaN(result.Nm)).toBe(false);
          expect(isNaN(result['ft-lb'])).toBe(false);
          expect(isNaN(result['kg-m'])).toBe(false);
          
          // Verify the range is also present
          expect(result.range).toBeDefined();
          expect(result.range.min).toBeGreaterThan(0);
          expect(result.range.max).toBeGreaterThan(0);
          
          // Verify conversion relationships are correct
          // 1 Nm ≈ 0.737562 ft-lb
          // 1 Nm ≈ 0.101972 kg-m
          const expectedFtLb = result.Nm / 1.35582;
          const expectedKgM = result.Nm / 9.80665;
          
          // Allow small tolerance for floating point precision
          const tolerance = 0.0001;
          expect(Math.abs(result['ft-lb'] - expectedFtLb)).toBeLessThan(tolerance);
          expect(Math.abs(result['kg-m'] - expectedKgM)).toBeLessThan(tolerance);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 12: Lubrication effect on torque
  // Validates: Requirements 5.5
  it('should calculate lower torque values for lubricated conditions compared to dry conditions', () => {
    // Create arbitraries for valid bolt sizes and grades
    const allBoltSizes = getAllBoltSizes();
    const boltSizeArbitrary = fc.constantFrom(...allBoltSizes.map((b) => b.size));
    
    const allBoltGrades = getAllBoltGrades();
    const boltGradeArbitrary = fc.constantFrom<BoltGrade>(...allBoltGrades);

    fc.assert(
      fc.property(
        boltSizeArbitrary,
        boltGradeArbitrary,
        (boltSize: string, grade: BoltGrade) => {
          // Calculate torque for dry condition
          const dryTorque = calculator.calculateTorque(boltSize, grade, 'dry');
          
          // Calculate torque for lubricated condition
          const lubricatedTorque = calculator.calculateTorque(boltSize, grade, 'lubricated');
          
          // Calculate torque for anti-seize condition
          const antiSeizeTorque = calculator.calculateTorque(boltSize, grade, 'anti-seize');

          // Property: For any bolt specification, the torque value with lubrication
          // should be less than the torque value without lubrication (dry condition)
          expect(lubricatedTorque.value).toBeLessThan(dryTorque.value);
          expect(antiSeizeTorque.value).toBeLessThan(dryTorque.value);
          
          // Additionally, anti-seize should produce even lower torque than regular lubrication
          expect(antiSeizeTorque.value).toBeLessThan(lubricatedTorque.value);
          
          // Verify the relationship matches the friction coefficients
          // dry: 0.2, lubricated: 0.15, anti-seize: 0.12
          // Since T = k × d × F, the ratio should match the k-factor ratio
          const dryToLubricatedRatio = dryTorque.value / lubricatedTorque.value;
          const expectedRatio = 0.2 / 0.15; // ≈ 1.333
          
          // Allow small tolerance for floating point precision
          const tolerance = 0.0001;
          expect(Math.abs(dryToLubricatedRatio - expectedRatio)).toBeLessThan(tolerance);
          
          const dryToAntiSeizeRatio = dryTorque.value / antiSeizeTorque.value;
          const expectedAntiSeizeRatio = 0.2 / 0.12; // ≈ 1.667
          expect(Math.abs(dryToAntiSeizeRatio - expectedAntiSeizeRatio)).toBeLessThan(tolerance);
        }
      ),
      { numRuns: 100 }
    );
  });
});
