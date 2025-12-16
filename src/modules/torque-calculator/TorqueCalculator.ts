import {
  BoltGrade,
  LubricationCondition,
  TorqueUnit,
  TorqueValue,
  TorqueResult,
} from './types';
import {
  getBoltBySize,
  BOLT_GRADE_STRENGTH,
  FRICTION_COEFFICIENTS,
} from './boltData';

/**
 * TorqueCalculator service for calculating bolt tightening torque
 */
export class TorqueCalculator {
  /**
   * Calculate recommended tightening torque for a bolt
   * Uses the formula: T = k × d × F
   * Where:
   *   T = Torque (Nm)
   *   k = Friction coefficient (nut factor)
   *   d = Nominal bolt diameter (m)
   *   F = Preload force (N)
   *
   * Preload is calculated as: F = 0.75 × As × σy
   * Where:
   *   As = Stress area (approximately 0.75 × π × (d/2)²)
   *   σy = Yield strength (MPa)
   *
   * @param boltSize - Bolt size string (e.g., 'M10', '1/2"')
   * @param grade - Bolt grade
   * @param lubrication - Lubrication condition
   * @returns TorqueValue with recommended torque and range
   */
  calculateTorque(
    boltSize: string,
    grade: BoltGrade,
    lubrication: LubricationCondition
  ): TorqueValue {
    // Get bolt specification
    const bolt = getBoltBySize(boltSize);
    if (!bolt) {
      throw new Error(`Unknown bolt size: ${boltSize}`);
    }

    // Get material properties
    const tensileStrength = BOLT_GRADE_STRENGTH[grade];
    if (!tensileStrength) {
      throw new Error(`Unknown bolt grade: ${grade}`);
    }

    // Get friction coefficient
    const k = FRICTION_COEFFICIENTS[lubrication];
    if (k === undefined) {
      throw new Error(`Unknown lubrication condition: ${lubrication}`);
    }

    // Calculate torque in Nm
    const diameter = bolt.diameter; // in mm
    const d = diameter / 1000; // convert to meters

    // Yield strength is approximately 0.9 × tensile strength for most bolts
    const yieldStrength = tensileStrength * 0.9; // MPa

    // Stress area (simplified): As ≈ 0.75 × π × (d/2)²
    const stressArea = 0.75 * Math.PI * Math.pow(d / 2, 2); // m²

    // Preload force: F = 0.75 × As × σy (using 75% of yield for safety)
    const preload = 0.75 * stressArea * yieldStrength * 1e6; // Convert MPa to Pa

    // Torque: T = k × d × F
    const torque = k * d * preload;

    // Calculate range (±10% tolerance)
    const min = torque * 0.9;
    const max = torque * 1.1;

    return {
      value: torque,
      unit: 'Nm',
      range: { min, max },
    };
  }

  /**
   * Convert torque from one unit to another
   * @param value - Torque value
   * @param fromUnit - Source unit
   * @param toUnit - Target unit
   * @returns Converted torque value
   */
  convertTorque(value: number, fromUnit: TorqueUnit, toUnit: TorqueUnit): number {
    // Validate input
    if (
      value === null ||
      value === undefined ||
      typeof value !== 'number' ||
      isNaN(value) ||
      !isFinite(value)
    ) {
      throw new Error('Invalid input: value must be a valid finite number');
    }

    // If same unit, return value
    if (fromUnit === toUnit) {
      return value;
    }

    // Convert to Nm first (base unit)
    let valueInNm: number;
    switch (fromUnit) {
      case 'Nm':
        valueInNm = value;
        break;
      case 'ft-lb':
        valueInNm = value * 1.35582; // 1 ft-lb = 1.35582 Nm
        break;
      case 'kg-m':
        valueInNm = value * 9.80665; // 1 kg-m = 9.80665 Nm
        break;
      default:
        throw new Error(`Unknown torque unit: ${fromUnit}`);
    }

    // Convert from Nm to target unit
    switch (toUnit) {
      case 'Nm':
        return valueInNm;
      case 'ft-lb':
        return valueInNm / 1.35582;
      case 'kg-m':
        return valueInNm / 9.80665;
      default:
        throw new Error(`Unknown torque unit: ${toUnit}`);
    }
  }

  /**
   * Calculate torque and return values in all supported units
   * @param boltSize - Bolt size string
   * @param grade - Bolt grade
   * @param lubrication - Lubrication condition
   * @returns TorqueResult with values in all units
   */
  calculateTorqueAllUnits(
    boltSize: string,
    grade: BoltGrade,
    lubrication: LubricationCondition
  ): TorqueResult {
    const torqueValue = this.calculateTorque(boltSize, grade, lubrication);
    const torqueNm = torqueValue.value;

    return {
      Nm: torqueNm,
      'ft-lb': this.convertTorque(torqueNm, 'Nm', 'ft-lb'),
      'kg-m': this.convertTorque(torqueNm, 'Nm', 'kg-m'),
      range: torqueValue.range,
    };
  }
}

// Export singleton instance
export const torqueCalculator = new TorqueCalculator();
