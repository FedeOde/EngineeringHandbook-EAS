import { TorqueCalculator } from './TorqueCalculator';
import { BoltGrade, LubricationCondition } from './types';

describe('TorqueCalculator', () => {
  let calculator: TorqueCalculator;

  beforeEach(() => {
    calculator = new TorqueCalculator();
  });

  describe('calculateTorque', () => {
    it('should calculate torque for M10 bolt grade 8.8 dry condition', () => {
      const result = calculator.calculateTorque('M10', '8.8', 'dry');

      expect(result.value).toBeGreaterThan(0);
      expect(result.unit).toBe('Nm');
      expect(result.range.min).toBeLessThan(result.value);
      expect(result.range.max).toBeGreaterThan(result.value);
    });

    it('should calculate torque for imperial bolt 1/2" grade 8.8 dry condition', () => {
      const result = calculator.calculateTorque('1/2"', '8.8', 'dry');

      expect(result.value).toBeGreaterThan(0);
      expect(result.unit).toBe('Nm');
      expect(result.range.min).toBeLessThan(result.value);
      expect(result.range.max).toBeGreaterThan(result.value);
    });

    it('should throw error for unknown bolt size', () => {
      expect(() => {
        calculator.calculateTorque('M999', '8.8', 'dry');
      }).toThrow('Unknown bolt size');
    });

    it('should throw error for unknown bolt grade', () => {
      expect(() => {
        calculator.calculateTorque('M10', 'invalid' as BoltGrade, 'dry');
      }).toThrow('Unknown bolt grade');
    });

    it('should throw error for unknown lubrication condition', () => {
      expect(() => {
        calculator.calculateTorque(
          'M10',
          '8.8',
          'invalid' as LubricationCondition
        );
      }).toThrow('Unknown lubrication condition');
    });

    it('should calculate lower torque for lubricated condition than dry', () => {
      const dryResult = calculator.calculateTorque('M10', '8.8', 'dry');
      const lubricatedResult = calculator.calculateTorque(
        'M10',
        '8.8',
        'lubricated'
      );

      expect(lubricatedResult.value).toBeLessThan(dryResult.value);
    });

    it('should calculate lower torque for anti-seize than lubricated', () => {
      const lubricatedResult = calculator.calculateTorque(
        'M10',
        '8.8',
        'lubricated'
      );
      const antiSeizeResult = calculator.calculateTorque(
        'M10',
        '8.8',
        'anti-seize'
      );

      expect(antiSeizeResult.value).toBeLessThan(lubricatedResult.value);
    });

    it('should calculate higher torque for higher grade bolts', () => {
      const grade88 = calculator.calculateTorque('M10', '8.8', 'dry');
      const grade109 = calculator.calculateTorque('M10', '10.9', 'dry');

      expect(grade109.value).toBeGreaterThan(grade88.value);
    });

    it('should calculate higher torque for larger bolts', () => {
      const m10 = calculator.calculateTorque('M10', '8.8', 'dry');
      const m20 = calculator.calculateTorque('M20', '8.8', 'dry');

      expect(m20.value).toBeGreaterThan(m10.value);
    });
  });

  describe('convertTorque', () => {
    it('should convert Nm to ft-lb correctly', () => {
      const result = calculator.convertTorque(100, 'Nm', 'ft-lb');
      expect(result).toBeCloseTo(73.756, 2);
    });

    it('should convert Nm to kg-m correctly', () => {
      const result = calculator.convertTorque(100, 'Nm', 'kg-m');
      expect(result).toBeCloseTo(10.197, 2);
    });

    it('should convert ft-lb to Nm correctly', () => {
      const result = calculator.convertTorque(100, 'ft-lb', 'Nm');
      expect(result).toBeCloseTo(135.582, 2);
    });

    it('should convert kg-m to Nm correctly', () => {
      const result = calculator.convertTorque(10, 'kg-m', 'Nm');
      expect(result).toBeCloseTo(98.0665, 2);
    });

    it('should return same value when converting to same unit', () => {
      const result = calculator.convertTorque(100, 'Nm', 'Nm');
      expect(result).toBe(100);
    });

    it('should throw error for invalid input', () => {
      expect(() => {
        calculator.convertTorque(NaN, 'Nm', 'ft-lb');
      }).toThrow('Invalid input');
    });

    it('should throw error for Infinity', () => {
      expect(() => {
        calculator.convertTorque(Infinity, 'Nm', 'ft-lb');
      }).toThrow('Invalid input');
    });
  });

  describe('calculateTorqueAllUnits', () => {
    it('should return torque in all three units', () => {
      const result = calculator.calculateTorqueAllUnits('M10', '8.8', 'dry');

      expect(result.Nm).toBeGreaterThan(0);
      expect(result['ft-lb']).toBeGreaterThan(0);
      expect(result['kg-m']).toBeGreaterThan(0);
      expect(result.range.min).toBeGreaterThan(0);
      expect(result.range.max).toBeGreaterThan(0);
    });

    it('should have consistent conversions between units', () => {
      const result = calculator.calculateTorqueAllUnits('M10', '8.8', 'dry');

      // Verify conversions are consistent
      const ftLbConverted = calculator.convertTorque(result.Nm, 'Nm', 'ft-lb');
      const kgMConverted = calculator.convertTorque(result.Nm, 'Nm', 'kg-m');

      expect(result['ft-lb']).toBeCloseTo(ftLbConverted, 5);
      expect(result['kg-m']).toBeCloseTo(kgMConverted, 5);
    });
  });
});
