import { Unit, UnitCategory, ConversionResult } from './types';
import { getUnitsByCategory, getUnitById } from './unitDefinitions';

export class UnitConverter {
  /**
   * Validates that a numeric value is valid for conversion
   * @param value - The value to validate
   * @returns true if valid, false otherwise
   */
  private validateInput(value: number): boolean {
    // Check for invalid inputs: NaN, Infinity, null, undefined
    if (
      value === null ||
      value === undefined ||
      typeof value !== 'number' ||
      isNaN(value) ||
      !isFinite(value)
    ) {
      return false;
    }
    return true;
  }

  /**
   * Converts a value from one unit to another
   * @param value - The numeric value to convert
   * @param fromUnit - The source unit
   * @param toUnit - The target unit
   * @returns The converted value
   * @throws Error if input is invalid or units are incompatible
   */
  convert(value: number, fromUnit: Unit, toUnit: Unit): number {
    // Validate input
    if (!this.validateInput(value)) {
      throw new Error('Invalid input: value must be a valid finite number');
    }

    // Check that units are from the same category
    if (fromUnit.category !== toUnit.category) {
      throw new Error(
        `Cannot convert between different unit categories: ${fromUnit.category} and ${toUnit.category}`
      );
    }

    // If converting to the same unit, return the value
    if (fromUnit.id === toUnit.id) {
      return value;
    }

    // Convert: value -> base unit -> target unit
    const baseValue = fromUnit.toBase(value);
    const convertedValue = toUnit.fromBase(baseValue);

    return convertedValue;
  }

  /**
   * Converts a value and returns a ConversionResult object
   * @param value - The numeric value to convert
   * @param fromUnit - The source unit
   * @param toUnit - The target unit
   * @returns ConversionResult object with value and unit information
   */
  convertWithDetails(
    value: number,
    fromUnit: Unit,
    toUnit: Unit
  ): ConversionResult {
    const convertedValue = this.convert(value, fromUnit, toUnit);
    return {
      value: convertedValue,
      fromUnit,
      toUnit,
    };
  }

  /**
   * Gets all supported units for a given category
   * @param category - The unit category
   * @returns Array of units in that category
   */
  getSupportedUnits(category: UnitCategory): Unit[] {
    return getUnitsByCategory(category);
  }

  /**
   * Gets a unit by its ID
   * @param id - The unit ID
   * @returns The unit or undefined if not found
   */
  getUnitById(id: string): Unit | undefined {
    return getUnitById(id);
  }
}

// Export a singleton instance
export const unitConverter = new UnitConverter();
