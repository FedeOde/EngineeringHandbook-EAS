import { OffsetCalculator } from './OffsetCalculator';
import { OffsetParameters } from './types';

describe('OffsetCalculator', () => {
  let calculator: OffsetCalculator;

  beforeEach(() => {
    calculator = new OffsetCalculator();
  });

  describe('getSupportedAngles', () => {
    it('should return array of supported angles', () => {
      const angles = calculator.getSupportedAngles();
      expect(angles).toEqual([15, 22.5, 30, 45, 60, 90]);
    });

    it('should return a copy of the array', () => {
      const angles1 = calculator.getSupportedAngles();
      const angles2 = calculator.getSupportedAngles();
      expect(angles1).not.toBe(angles2);
      expect(angles1).toEqual(angles2);
    });
  });

  describe('calculateOffset', () => {
    it('should calculate offset for 45 degree angle without pipe diameter', () => {
      const params: OffsetParameters = {
        offsetDistance: 100,
        angle: 45,
      };

      const result = calculator.calculateOffset(params);

      // For 45 degrees: travel = rise / sin(45°) = 100 / 0.7071 ≈ 141.42
      expect(result.rise).toBe(100);
      expect(result.travel).toBeCloseTo(141.42, 1);
      expect(result.run).toBeCloseTo(100, 1);
      expect(result.cutLength).toBeCloseTo(141.42, 1);
    });

    it('should calculate offset for 30 degree angle', () => {
      const params: OffsetParameters = {
        offsetDistance: 50,
        angle: 30,
      };

      const result = calculator.calculateOffset(params);

      // For 30 degrees: travel = rise / sin(30°) = 50 / 0.5 = 100
      expect(result.rise).toBe(50);
      expect(result.travel).toBeCloseTo(100, 1);
      expect(result.run).toBeCloseTo(86.6, 1); // 50 / tan(30°)
    });

    it('should calculate offset for 60 degree angle', () => {
      const params: OffsetParameters = {
        offsetDistance: 100,
        angle: 60,
      };

      const result = calculator.calculateOffset(params);

      // For 60 degrees: travel = rise / sin(60°) = 100 / 0.866 ≈ 115.47
      expect(result.rise).toBe(100);
      expect(result.travel).toBeCloseTo(115.47, 1);
      expect(result.run).toBeCloseTo(57.74, 1); // 100 / tan(60°)
    });

    it('should calculate offset for 90 degree angle', () => {
      const params: OffsetParameters = {
        offsetDistance: 100,
        angle: 90,
      };

      const result = calculator.calculateOffset(params);

      // For 90 degrees: travel = rise / sin(90°) = 100 / 1 = 100
      expect(result.rise).toBe(100);
      expect(result.travel).toBeCloseTo(100, 1);
      expect(result.run).toBeCloseTo(0, 1); // 100 / tan(90°) ≈ 0
    });

    it('should account for pipe diameter in calculations', () => {
      const paramsWithoutDiameter: OffsetParameters = {
        offsetDistance: 100,
        angle: 45,
      };

      const paramsWithDiameter: OffsetParameters = {
        offsetDistance: 100,
        angle: 45,
        pipeDiameter: 10,
      };

      const resultWithout = calculator.calculateOffset(paramsWithoutDiameter);
      const resultWith = calculator.calculateOffset(paramsWithDiameter);

      // Travel should be larger when pipe diameter is included
      expect(resultWith.travel).toBeGreaterThan(resultWithout.travel);
      
      // Rise and run should be the same
      expect(resultWith.rise).toBe(resultWithout.rise);
      expect(resultWith.run).toBeCloseTo(resultWithout.run, 5);
    });

    it('should include diagram data in result', () => {
      const params: OffsetParameters = {
        offsetDistance: 100,
        angle: 45,
        pipeDiameter: 10,
      };

      const result = calculator.calculateOffset(params);

      expect(result.diagram).toBeDefined();
      expect(result.diagram.offsetDistance).toBe(100);
      expect(result.diagram.angle).toBe(45);
      expect(result.diagram.travel).toBe(result.travel);
      expect(result.diagram.rise).toBe(result.rise);
      expect(result.diagram.run).toBe(result.run);
      expect(result.diagram.pipeDiameter).toBe(10);
    });

    it('should throw error for invalid offset distance', () => {
      const params: OffsetParameters = {
        offsetDistance: -10,
        angle: 45,
      };

      expect(() => calculator.calculateOffset(params)).toThrow(
        'Invalid offset distance'
      );
    });

    it('should throw error for NaN offset distance', () => {
      const params: OffsetParameters = {
        offsetDistance: NaN,
        angle: 45,
      };

      expect(() => calculator.calculateOffset(params)).toThrow(
        'Invalid offset distance'
      );
    });

    it('should throw error for unsupported angle', () => {
      const params: OffsetParameters = {
        offsetDistance: 100,
        angle: 37,
      };

      expect(() => calculator.calculateOffset(params)).toThrow(
        'Unsupported angle'
      );
    });

    it('should throw error for invalid pipe diameter', () => {
      const params: OffsetParameters = {
        offsetDistance: 100,
        angle: 45,
        pipeDiameter: NaN,
      };

      expect(() => calculator.calculateOffset(params)).toThrow(
        'Invalid pipe diameter'
      );
    });

    it('should handle zero pipe diameter', () => {
      const params: OffsetParameters = {
        offsetDistance: 100,
        angle: 45,
        pipeDiameter: 0,
      };

      const result = calculator.calculateOffset(params);
      expect(result.travel).toBeCloseTo(141.42, 1);
    });
  });

  describe('Pythagorean theorem verification', () => {
    it('should satisfy travel² = rise² + run² for 45 degree offset', () => {
      const params: OffsetParameters = {
        offsetDistance: 100,
        angle: 45,
      };

      const result = calculator.calculateOffset(params);
      
      const travelSquared = result.travel * result.travel;
      const riseSquared = result.rise * result.rise;
      const runSquared = result.run * result.run;

      expect(travelSquared).toBeCloseTo(riseSquared + runSquared, 0);
    });

    it('should satisfy travel² = rise² + run² for 30 degree offset', () => {
      const params: OffsetParameters = {
        offsetDistance: 50,
        angle: 30,
      };

      const result = calculator.calculateOffset(params);
      
      const travelSquared = result.travel * result.travel;
      const riseSquared = result.rise * result.rise;
      const runSquared = result.run * result.run;

      expect(travelSquared).toBeCloseTo(riseSquared + runSquared, 0);
    });
  });
});
